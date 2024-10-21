import {
	type InferInput,
	instance,
	literal,
	object,
	parse,
	union,
} from "valibot";
import { PITCH_OUTCOMES } from "../constants/cBaseball";
import type { OGameSimObserver, TGameSimEvent } from "../types/tGameSim";
import {
	type TConstructorGameSim,
	type TConstructorGameSimTeam,
	VConstructorGameSim,
} from "../types/tGameSimConstructors";
import GameSimEventStore from "./eGameSimEventStore";
import GameSimLog from "./eGameSimLog";
import GameSimPlayerState from "./eGameSimPlayerState";
import GameSimTeamState from "./eGameSimTeamState";

export default class GameSim {
	private isNeutralPark: boolean;
	private isTopOfInning: boolean;
	private numBalls: number;
	private numInning: number;
	private numInningsInGame: number;
	private numOuts: number;
	private numStrikes: number;
	private numTeamDefense: 0 | 1;
	private numTeamOffense: 0 | 1;
	private observers: OGameSimObserver[] = [];
	private playerRunner1: GameSimPlayerState | null = null;
	private playerRunner2: GameSimPlayerState | null = null;
	private playerRunner3: GameSimPlayerState | null = null;
	private playerStates: {
		[key: number]: GameSimPlayerState;
	};
	private teams: [TConstructorGameSimTeam, TConstructorGameSimTeam];
	private teamStates: {
		[key: number]: GameSimTeamState;
	};

	constructor(_input: TConstructorGameSim) {
		const input = parse(VConstructorGameSim, _input);
		this.isNeutralPark = true;
		this.isTopOfInning = true;
		this.numBalls = 0;
		this.numInning = 1;
		this.numInningsInGame = 9;
		this.numOuts = 0;
		this.numStrikes = 0;
		this.numTeamDefense = 1;
		this.numTeamOffense = 0;
		this.observers = [];
		this.playerStates = {};

		// team0 is the away team, team1 is the home team
		this.teams = [input.teams[0], input.teams[1]];
		this.teamStates = {};

		for (const team of this.teams) {
			const playerStates = team.players.map((player) => {
				const playerState = new GameSimPlayerState({
					player,
				});
				return playerState;
			});

			const teamState = new GameSimTeamState({
				playerStates,
				team,
			});
			this.observers.push(teamState);

			this.teamStates[team.idTeam] = teamState;

			for (const playerState of playerStates) {
				this.playerStates[playerState.player.idPlayer] = playerState;
				this.observers.push(playerState);
			}
		}

		this.observers.push(
			new GameSimLog({
				idGame: input.idGame,
			}),
		);
		this.observers.push(
			new GameSimEventStore({
				idGame: input.idGame,
			}),
		);
	}

	public simulate() {
		this._notifyObservers({
			gameSimEvent: "gameStart",
		});

		let isGameOver = false;

		while (!isGameOver) {
			this._simulateHalfInning();

			const _isGameOver = this._checkIsGameOver();
			isGameOver = _isGameOver;
		}

		const teamAway = this.teams[0];
		const teamHome = this.teams[1];

		console.log(
			`Final score ${teamAway.city.name} ${teamAway.nickname} ${this.teamStates[this._getTeamId({ teamIndex: 0 })].statistics.batting.runs} - ${teamHome.city.name} ${teamHome.nickname} ${this.teamStates[this._getTeamId({ teamIndex: 1 })].statistics.batting.runs}`,
		);

		this._notifyObservers({
			gameSimEvent: "gameEnd",
		});
	}

	private _checkIsGameOver() {
		const teamAway = this.teams[0];
		const teamHome = this.teams[1];
		const team0Runs = this.teamStates[teamAway.idTeam].statistics.batting.runs;
		const team1Runs = this.teamStates[teamHome.idTeam].statistics.batting.runs;

		if (this.numInning > this.numInningsInGame && team0Runs !== team1Runs) {
			return true;
		}

		return false;
	}

	private _checkIsHalfInningOver() {
		if (this.numOuts >= 3) {
			return true;
		}

		return false;
	}

	private _endAtBat() {
		const teamStateOffense =
			this.teamStates[
				this._getTeamId({
					teamIndex: this.numTeamOffense,
				})
			];
		teamStateOffense.advanceLineupIndex();

		this.numBalls = 0;
		this.numStrikes = 0;
	}

	private _endHalfInning() {
		//Swap offense/defense team with the Bitwise XOR Operator: https://dmitripavlutin.com/swap-variables-javascript/#4-bitwise-xor-operator
		this.numTeamOffense = (this.numTeamOffense ^ this.numTeamDefense) as 0 | 1;
		this.numTeamDefense = (this.numTeamOffense ^ this.numTeamDefense) as 0 | 1;
		this.numTeamOffense = (this.numTeamOffense ^ this.numTeamDefense) as 0 | 1;

		const isBottomHalfOfInning = !this.isTopOfInning;

		if (isBottomHalfOfInning) {
			this.numInning++;
		}

		this.isTopOfInning = !this.isTopOfInning;

		this.numOuts = 0;
		this.playerRunner1 = null;
		this.playerRunner2 = null;
		this.playerRunner3 = null;
	}

	private _getCurrentHitter(_input: TInputGetCurrentHitter) {
		const { teamIndex } = parse(VInputGetCurrentHitter, _input);
		const idTeam = this.teams[teamIndex].idTeam;
		const idCurrentHitter = this.teamStates[idTeam].getCurrentHitterId();
		const playerState = this.playerStates[idCurrentHitter];

		return playerState;
	}

	private _getCurrentPitcher(_input: TInputGetCurrentPitcher) {
		const { teamIndex } = parse(VInputGetCurrentPitcher, _input);
		const idTeam = this.teams[teamIndex].idTeam;
		const idCurrentPitcher = this.teamStates[idTeam].getPositionId({
			position: "p",
		});
		const playerState = this.playerStates[idCurrentPitcher];

		return playerState;
	}

	private _getTeamDefense() {
		const teamDefense = this.teamStates[this.teams[this.numTeamDefense].idTeam];
		return teamDefense;
	}

	private _getTeamId(_input: TInputGetTeamId) {
		const input = parse(VInputGetTeamId, _input);

		return this.teams[input.teamIndex].idTeam;
	}

	private _getTeamOffense() {
		const teamOffense = this.teamStates[this.teams[this.numTeamOffense].idTeam];
		return teamOffense;
	}

	private _handleDouble() {
		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const playerRunner1 = this.playerRunner1;
		const playerRunner2 = this.playerRunner2;
		const playerRunner3 = this.playerRunner3;
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();
		this._handleRunnersAdvanceXBases({
			numBases: 2,
		});

		this.playerRunner1 = playerHitter;

		this._notifyObservers({
			data: {
				playerHitter,
				playerPitcher,
				teamDefense,
				teamOffense,
				playerRunner1,
				playerRunner2,
				playerRunner3,
			},
			gameSimEvent: "double",
		});
	}

	private _handleHitByPitch() {
		this._handleRunnerAdvanceAutomaticIncludingHitter();
	}

	private _handleHomeRun() {
		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const playerRunner1 = this.playerRunner1;
		const playerRunner2 = this.playerRunner2;
		const playerRunner3 = this.playerRunner3;
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();
		this._handleRunnersAdvanceXBases({
			numBases: 3,
		});

		this.playerRunner1 = playerHitter;

		this._notifyObservers({
			data: {
				playerHitter,
				playerPitcher,
				teamDefense,
				teamOffense,
				playerRunner1,
				playerRunner2,
				playerRunner3,
			},
			gameSimEvent: "homeRun",
		});

		this._handleRun({
			playerRunner: playerHitter,
		});
	}

	private _handleOut() {
		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();
		const playerRunner1 = this.playerRunner1;
		const playerRunner2 = this.playerRunner2;
		const playerRunner3 = this.playerRunner3;

		this.numOuts++;

		this._notifyObservers({
			gameSimEvent: "out",
			data: {
				playerHitter,
				playerPitcher,
				teamDefense,
				teamOffense,
				playerRunner1,
				playerRunner2,
				playerRunner3,
			},
		});
	}

	private _handleRun(_input: TInputHandleRun) {
		const { playerRunner } = parse(VInputHandleRun, _input);

		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();

		this._notifyObservers({
			gameSimEvent: "run",
			data: {
				playerHitter,
				playerPitcher,
				playerRunner,
				teamDefense,
				teamOffense,
			},
		});
	}

	private _handleRunnerAdvanceAutomatic() {
		const playerRunner1Current = this.playerRunner1;
		const playerRunner2Current = this.playerRunner2;
		const playerRunner3Current = this.playerRunner3;

		if (playerRunner1Current && playerRunner2Current && playerRunner3Current) {
			this.playerRunner3 = playerRunner2Current;
			this.playerRunner2 = playerRunner1Current;
			this._handleRun({
				playerRunner: playerRunner3Current,
			});
			// Bases loaded
		} else if (playerRunner1Current && playerRunner2Current) {
			// Runners on first and second
			this.playerRunner3 = playerRunner2Current;
			this.playerRunner2 = playerRunner1Current;
		} else if (playerRunner1Current) {
			this.playerRunner2 = playerRunner1Current;
		}
	}

	private _handleRunnerAdvanceAutomaticIncludingHitter() {
		this._handleRunnerAdvanceAutomatic();

		this.playerRunner1 = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
	}

	private _handleRunnersAdvanceXBases(
		_input: TInputHandleRunnersAdvanceXBases,
	) {
		const { numBases } = parse(VInputHandleRunnersAdvanceXBases, _input);

		const playerRunner1Current = this.playerRunner1;
		const playerRunner2Current = this.playerRunner2;
		const playerRunner3Current = this.playerRunner3;

		switch (numBases) {
			case 1: {
				if (playerRunner3Current) {
					this._handleRun({
						playerRunner: playerRunner3Current,
					});
				}

				if (playerRunner2Current) {
					this.playerRunner3 = playerRunner2Current;
				}

				if (playerRunner1Current) {
					this.playerRunner2 = playerRunner1Current;
				}

				break;
			}
			case 2: {
				if (playerRunner3Current) {
					this._handleRun({
						playerRunner: playerRunner3Current,
					});
				}

				if (playerRunner2Current) {
					this._handleRun({
						playerRunner: playerRunner2Current,
					});
				}

				if (playerRunner1Current) {
					this.playerRunner3 = playerRunner1Current;
				}

				break;
			}
			case 3: {
				if (playerRunner3Current) {
					this._handleRun({
						playerRunner: playerRunner3Current,
					});
				}

				if (playerRunner2Current) {
					this._handleRun({
						playerRunner: playerRunner2Current,
					});
				}

				if (playerRunner1Current) {
					this._handleRun({
						playerRunner: playerRunner1Current,
					});
				}

				break;
			}
			default: {
				const exhaustiveCheck: never = numBases;
				throw new Error(exhaustiveCheck);
			}
		}
	}

	private _handleSingle() {
		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const playerRunner1 = this.playerRunner1;
		const playerRunner2 = this.playerRunner2;
		const playerRunner3 = this.playerRunner3;
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();
		this._handleRunnersAdvanceXBases({
			numBases: 1,
		});

		this.playerRunner1 = playerHitter;

		this._notifyObservers({
			data: {
				playerHitter,
				playerPitcher,
				teamDefense,
				teamOffense,
				playerRunner1,
				playerRunner2,
				playerRunner3,
			},
			gameSimEvent: "single",
		});
	}

	private _handleStrikeout() {
		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();
		this._notifyObservers({
			gameSimEvent: "strikeout",
			data: {
				playerHitter,
				playerPitcher,
				teamDefense,
				teamOffense,
			},
		});

		this.numOuts++;
	}

	private _handleTriple() {
		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const playerRunner1 = this.playerRunner1;
		const playerRunner2 = this.playerRunner2;
		const playerRunner3 = this.playerRunner3;
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();
		this._handleRunnersAdvanceXBases({
			numBases: 3,
		});

		this.playerRunner1 = playerHitter;

		this._notifyObservers({
			data: {
				playerHitter,
				playerPitcher,
				teamDefense,
				teamOffense,
				playerRunner1,
				playerRunner2,
				playerRunner3,
			},
			gameSimEvent: "triple",
		});
	}

	private _handleWalk() {
		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();
		this._notifyObservers({
			gameSimEvent: "walk",
			data: {
				playerHitter,
				playerPitcher,
				teamDefense,
				teamOffense,
			},
		});
		this._handleRunnerAdvanceAutomaticIncludingHitter();
	}

	private _notifyObservers = (input: TGameSimEvent) => {
		for (const observer of this.observers) {
			observer.notifyGameEvent({
				...input,
			});
		}
	};

	private _simulateAtBat() {
		this._notifyObservers({
			gameSimEvent: "atBatStart",
		});

		let isAtBatOver = false;

		while (!isAtBatOver) {
			const _isAtBatOver = this._simulatePitch();
			isAtBatOver = _isAtBatOver;
		}

		this._endAtBat();

		this._notifyObservers({
			gameSimEvent: "atBatEnd",
		});
	}

	private _simulateHalfInning() {
		const teamDefense = this._getTeamDefense();
		const teamOffense = this._getTeamOffense();

		this._notifyObservers({
			data: {
				teamDefense,
				teamOffense,
			},
			gameSimEvent: "halfInningStart",
		});

		let isHalfInningOver = false;

		while (!isHalfInningOver) {
			this._simulateAtBat();

			const _isHalfInningOver = this._checkIsHalfInningOver();
			isHalfInningOver = _isHalfInningOver;
		}

		this._endHalfInning();

		this._notifyObservers({
			data: {
				playerRunner1: this.playerRunner1,
				playerRunner2: this.playerRunner2,
				playerRunner3: this.playerRunner3,
			},
			gameSimEvent: "halfInningEnd",
		});
	}

	private _simulateInPlayEvent() {
		const eventsWeCanHandleNow = [
			"double",
			"doublePlay",
			"fieldOut",
			"forceOut",
			"groundedIntoDoublePlay",
			"hitByPitch",
			"homeRun",
			"otherOut",
			"single",
			"triple",
		] as const;

		const randomIndex = Math.floor(Math.random() * eventsWeCanHandleNow.length);
		const pitchInPlayEvent = eventsWeCanHandleNow[randomIndex];

		return pitchInPlayEvent;
	}

	private _simulatePitch() {
		let isAtBatOver = false;
		const playerPitcher = this._getCurrentPitcher({
			teamIndex: this.numTeamDefense,
		});
		const playerHitter = this._getCurrentHitter({
			teamIndex: this.numTeamOffense,
		});

		const pitchName = playerPitcher.choosePitch({
			numBalls: this.numBalls,
			numOuts: this.numOuts,
			numStrikes: this.numStrikes,
		});

		const pitchLocation = playerPitcher.getPitchLocation({
			pitchName,
			playerHitter,
			playerPitcher,
		});

		const pitchOutcome = this._simulatePitchOutcome({
			pitchLocation,
			pitchName,
			playerHitter,
			playerPitcher,
		});

		this._notifyObservers({
			data: {
				playerHitter,
				pitchLocation,
				pitchName,
				pitchOutcome,
				playerPitcher,
				teamDefense:
					this.teamStates[this._getTeamId({ teamIndex: this.numTeamDefense })],
				teamOffense:
					this.teamStates[this._getTeamId({ teamIndex: this.numTeamOffense })],
			},
			gameSimEvent: "pitch",
		});

		switch (pitchOutcome) {
			case "BALL": {
				this.numBalls++;

				if (this.numBalls === 4) {
					this._handleWalk();
					isAtBatOver = true;
				}

				break;
			}
			case "IN_PLAY": {
				const inPlayEvent = this._simulateInPlayEvent();

				switch (inPlayEvent) {
					case "double": {
						this._handleDouble();
						break;
					}
					case "doublePlay":
					case "fieldOut":
					case "forceOut":
					case "groundedIntoDoublePlay":
					case "otherOut": {
						this._handleOut();
						break;
					}
					case "hitByPitch": {
						this._handleHitByPitch();
						break;
					}
					case "homeRun": {
						this._handleHomeRun();
						break;
					}
					case "single": {
						this._handleSingle();
						break;
					}
					case "triple": {
						this._handleTriple();
						break;
					}
					default: {
						const exhaustiveCheck: never = inPlayEvent;
						throw new Error(exhaustiveCheck);
					}
				}

				isAtBatOver = true;

				break;
			}
			case "STRIKE": {
				this.numStrikes++;

				if (this.numStrikes === 3) {
					this._handleStrikeout();
					isAtBatOver = true;
				}
				break;
			}
			default: {
				const exhaustiveCheck: never = pitchOutcome;
				throw new Error(exhaustiveCheck);
			}
		}

		return isAtBatOver;
	}

	private _simulatePitchOutcome() {
		const randomIndex = Math.floor(Math.random() * PITCH_OUTCOMES.length);
		const pitchOutcome = PITCH_OUTCOMES[randomIndex];

		return pitchOutcome;
	}
}

const VInputGetCurrentHitter = object({
	teamIndex: union([literal(0), literal(1)]),
});
type TInputGetCurrentHitter = InferInput<typeof VInputGetCurrentHitter>;

const VInputGetCurrentPitcher = object({
	teamIndex: union([literal(0), literal(1)]),
});
type TInputGetCurrentPitcher = InferInput<typeof VInputGetCurrentPitcher>;

const VInputGetTeamId = object({
	teamIndex: union([literal(0), literal(1)]),
});
type TInputGetTeamId = InferInput<typeof VInputGetTeamId>;

const VInputHandleRun = object({
	playerRunner: instance(GameSimPlayerState),
});
type TInputHandleRun = InferInput<typeof VInputHandleRun>;

const VInputHandleRunnersAdvanceXBases = object({
	numBases: union([literal(1), literal(2), literal(3)]),
});
type TInputHandleRunnersAdvanceXBases = InferInput<
	typeof VInputHandleRunnersAdvanceXBases
>;
