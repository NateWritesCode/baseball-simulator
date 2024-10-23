import {
	type InferInput,
	array,
	boolean,
	instance,
	literal,
	number,
	object,
	parse,
	picklist,
	union,
} from "valibot";
import { RATING_MAX } from "../constants";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEventPitchLocation,
} from "../types/tGameSim";
import {
	type TConstructorGameSim,
	type TConstructorGameSimTeam,
	VConstructorGameSim,
} from "../types/tGameSimConstructors";
import {
	type TPicklistPitchNames,
	type TPicklistPitchOutcomes,
	type TPicklistPositions,
	VPicklistPitchNames,
	VPicklistPositions,
} from "../types/tPicklist";
import GameSimCoachState from "./eGameSimCoachState";
import GameSimEventStore from "./eGameSimEventStore";
import GameSimLog from "./eGameSimLog";
import GameSimParkState from "./eGameSimParkState";
import GameSimPlayerState from "./eGameSimPlayerState";
import GameSimTeamState from "./eGameSimTeamState";
import GameSimUmpireState from "./eGameSimUmpireState";

export default class GameSim {
	private coachStates: {
		[key: number]: GameSimCoachState;
	};
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
	private parkState: GameSimParkState;
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
	private umpireHp: GameSimUmpireState;
	private umpireFb: GameSimUmpireState;
	private umpireSb: GameSimUmpireState;
	private umpireTb: GameSimUmpireState;

	constructor(_input: TConstructorGameSim) {
		const input = parse(VConstructorGameSim, _input);
		this.coachStates = {};
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
		this.parkState = new GameSimParkState({
			park: input.park,
		});
		this.playerStates = {};
		this.teamStates = {};
		this.umpireHp = new GameSimUmpireState({
			umpire: input.umpires[0],
		});
		this.umpireFb = new GameSimUmpireState({
			umpire: input.umpires[1],
		});
		this.umpireSb = new GameSimUmpireState({
			umpire: input.umpires[2],
		});
		this.umpireTb = new GameSimUmpireState({
			umpire: input.umpires[3],
		});

		// team0 is the away team, team1 is the home team
		this.teams = [input.teams[0], input.teams[1]];

		for (const team of this.teams) {
			const coachStates = team.coaches.map((coach) => {
				const coachState = new GameSimCoachState({
					coach,
				});
				return coachState;
			});
			const playerStates = team.players.map((player) => {
				const playerState = new GameSimPlayerState({
					player,
				});
				return playerState;
			});

			const teamState = new GameSimTeamState({
				coachStates,
				playerStates,
				team,
			});
			this.observers.push(teamState);

			this.teamStates[team.idTeam] = teamState;

			for (const coachState of coachStates) {
				this.coachStates[coachState.coach.idCoach] = coachState;
				this.observers.push(coachState);
			}

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

	private _calculateCatcherFieldingDifficulty(
		_input: TInputCalculateCatcherFieldingDifficulty,
	) {
		const { ballInPlay, fielder, isFoul } = parse(
			VInputCalculateCatcherFieldingDifficulty,
			_input,
		);
		let difficulty = 0;
		const catcherRating = fielder.player.fielding.catcherAbility / RATING_MAX;
		const catcherFraming = fielder.player.fielding.catcherFraming / RATING_MAX;

		// Base difficulty
		difficulty = 0.5 - catcherRating * 0.3;

		// Distance factors
		if (ballInPlay.distance > 60) {
			difficulty += Math.min((ballInPlay.distance - 60) / 40, 0.4);
		}

		// Height/trajectory factors
		if (ballInPlay.launchAngle > 60) {
			// Pop-ups
			difficulty -= catcherFraming * 0.2;
			if (ballInPlay.distance < 30) {
				difficulty -= 0.2;
			}
		} else if (ballInPlay.launchAngle < 10) {
			// Ground balls
			difficulty += 0.2 + Math.min(ballInPlay.distance / 100, 0.3);
		}

		// Foul territory adjustment
		if (isFoul) {
			// Slightly easier for catchers in foul territory due to angle
			difficulty *= 0.9;
		}

		return Math.min(Math.max(difficulty, 0), 1);
	}

	private _calculateCornerInfielderFieldingDifficulty(
		_input: TInputCalculateCornerInfielderFieldingDifficulty,
	) {
		const { ballInPlay, fielder, isFoul, position } = parse(
			VInputCalculateCornerInfielderFieldingDifficulty,
			_input,
		);
		let difficulty = 0;
		const rangeRating = fielder.player.fielding.infieldRange / RATING_MAX;
		const errorRating = fielder.player.fielding.infieldError / RATING_MAX;
		const armRating = fielder.player.fielding.infieldArm / RATING_MAX;
		const doublePlayRating =
			fielder.player.fielding.infieldDoublePlay / RATING_MAX;

		// Base difficulty
		difficulty = 0.5 - rangeRating * 0.3 - errorRating * 0.2;

		// Direction adjustments
		const angle =
			Math.atan2(ballInPlay.finalY, ballInPlay.finalX) * (180 / Math.PI);
		const isWrongSide =
			(position === "fb" && angle < 0) || (position === "tb" && angle > 0);

		if (isWrongSide) {
			difficulty += isFoul ? 0.3 : 0.4; // Wrong side is even harder in fair territory
		}

		// Distance factors
		if (ballInPlay.distance > 100) {
			difficulty += Math.min((ballInPlay.distance - 100) / 100, 0.3);
		}

		// Ball type adjustments
		if (ballInPlay.launchAngle < 10) {
			// Ground balls
			if (ballInPlay.distance > 60) {
				difficulty += 0.2 - armRating * 0.2;
			}
			if (!isFoul) {
				// Double play potential affects fair territory plays
				difficulty -= doublePlayRating * 0.1;
			}
		} else if (ballInPlay.launchAngle > 45) {
			difficulty += 0.2 - rangeRating * 0.2;
		}

		if (isFoul) {
			// Slightly harder in foul territory due to obstacles
			difficulty *= 1.1;
		}

		return Math.min(Math.max(difficulty, 0), 1);
	}

	private _calculateMiddleInfielderFieldingDifficulty(
		_input: TInputCalculateMiddleInfielderFieldingDifficulty,
	) {
		const { ballInPlay, fielder, isFoul, position } = parse(
			VInputCalculateMiddleInfielderFieldingDifficulty,
			_input,
		);
		let difficulty = 0;
		const rangeRating = fielder.player.fielding.infieldRange / RATING_MAX;
		const errorRating = fielder.player.fielding.infieldError / RATING_MAX;
		const doublePlayRating =
			fielder.player.fielding.infieldDoublePlay / RATING_MAX;

		// Base difficulty
		difficulty = 0.4 - rangeRating * 0.3 - errorRating * 0.2;

		// Middle infielders struggle more with foul balls
		if (isFoul) {
			difficulty += 0.3;
		} else {
			// Double play ability matters in fair territory
			difficulty -= doublePlayRating * 0.2;
		}

		return Math.min(Math.max(difficulty, 0), 1);
	}

	private _calculateOutfielderFieldingDifficulty(
		_input: TInputCalculateOutfielderFieldingDifficulty,
	) {
		const { ballInPlay, fielder, isFoul, position } = parse(
			VInputCalculateOutfielderFieldingDifficulty,
			_input,
		);
		let difficulty = 0;
		const rangeRating = fielder.player.fielding.outfieldRange / RATING_MAX;
		const errorRating = fielder.player.fielding.outfieldError / RATING_MAX;
		const armRating = fielder.player.fielding.outfieldArm / RATING_MAX;

		// Base difficulty
		difficulty = 0.5 - rangeRating * 0.4 - errorRating * 0.1;

		// Position specific adjustments
		if (position === "cf") {
			difficulty -= 0.1; // Center fielders generally better at tracking
		}

		// Direction factors
		const angle =
			Math.atan2(ballInPlay.finalY, ballInPlay.finalX) * (180 / Math.PI);
		const isWrongSide =
			(position === "rf" && angle < 0) || (position === "lf" && angle > 0);

		if (isWrongSide) {
			difficulty += 0.4;
		}

		// Distance factors
		if (ballInPlay.distance < 150) {
			difficulty += 0.3;
		} else if (ballInPlay.distance > 250) {
			difficulty += 0.2 - armRating * 0.2;
		}

		// Ball characteristic adjustments
		if (ballInPlay.exitVelocity > 95) {
			difficulty += Math.min((ballInPlay.exitVelocity - 95) / 20, 0.3);
		}

		// Trajectory adjustments
		if (ballInPlay.launchAngle < 15) {
			difficulty += 0.4;
		} else if (ballInPlay.launchAngle > 60) {
			difficulty += 0.2;
		}

		// Foul territory adjustment
		if (isFoul) {
			difficulty *= 1.2; // Harder in foul territory due to walls/obstacles
		}

		return Math.min(Math.max(difficulty, 0), 1);
	}

	private _calculatePitcherFieldingDifficulty(
		_input: TInputCalculatePitcherFieldingDifficulty,
	) {
		const { ballInPlay, fielder, isFoul } = parse(
			VInputCalculatePitcherFieldingDifficulty,
			_input,
		);
		// Pitchers are generally not involved in foul balls
		if (isFoul) {
			return 1;
		}

		let difficulty = 0.6; // Base difficulty is higher for pitchers
		const rangeRating = fielder.player.fielding.infieldRange / RATING_MAX;
		const errorRating = fielder.player.fielding.infieldError / RATING_MAX;

		difficulty -= rangeRating * 0.2 + errorRating * 0.2;

		// Pitchers mainly handle short ground balls and bunts
		if (ballInPlay.launchAngle > 10 || ballInPlay.distance > 60) {
			difficulty += 0.4;
		}

		return Math.min(Math.max(difficulty, 0), 1);
	}

	private _getFielderSpeed(_input: { fielder: GameSimPlayerState }) {
		const { fielder } = parse(
			object({
				fielder: instance(GameSimPlayerState),
			}),
			_input,
		);
		// Convert speed rating (1-1000) to feet per second (15-30 ft/s range)
		return 15 + (fielder.player.running.speed / RATING_MAX) * 15;
	}

	private _calculateTrajectoryDifficulty(
		_input: TInputCalculateTrajectoryDifficulty,
	) {
		const { ballInPlay, position } = parse(
			VInputCalculateTrajectoryDifficulty,
			_input,
		);
		let difficulty = 0;

		// High pop-ups
		if (ballInPlay.launchAngle > 60) {
			switch (position) {
				case "c": {
					// Catchers are best at straight-up pop-ups
					difficulty += Math.min((ballInPlay.launchAngle - 60) / 30, 1) * 0.3;
					break;
				}
				case "fb":
				case "tb": {
					// Corner infielders handle high pop-ups well
					difficulty += Math.min((ballInPlay.launchAngle - 60) / 30, 1) * 0.4;
					break;
				}
				default: {
					// Other positions struggle more with extreme pop-ups
					difficulty += Math.min((ballInPlay.launchAngle - 60) / 30, 1) * 0.5;
				}
			}
		}

		// Line drives
		if (ballInPlay.launchAngle < 25 && ballInPlay.launchAngle > 10) {
			const lineDriveDifficulty = 0.3 + (ballInPlay.exitVelocity / 105) * 0.2;
			switch (position) {
				case "lf":
				case "rf": {
					// Outfielders handle line drives better
					difficulty += lineDriveDifficulty * 0.7;
					break;
				}
				case "fb":
				case "tb": {
					// Corner infielders average on line drives
					difficulty += lineDriveDifficulty;
					break;
				}
				default: {
					// Others struggle more with line drives
					difficulty += lineDriveDifficulty * 1.3;
				}
			}
		}

		// Ground balls
		if (ballInPlay.launchAngle < 10) {
			const bounceUnpredictability = 0.4 * (ballInPlay.exitVelocity / 105);
			switch (position) {
				case "fb":
				case "tb": {
					// Corner infielders best at ground balls
					difficulty += bounceUnpredictability * 0.7;
					break;
				}
				case "ss":
				case "sb": {
					// Middle infielders good at ground balls
					difficulty += bounceUnpredictability * 0.8;
					break;
				}
				case "c": {
					// Catchers handle short grounders okay
					if (ballInPlay.distance < 45) {
						difficulty += bounceUnpredictability * 0.9;
					} else {
						difficulty += bounceUnpredictability * 1.4;
					}
					break;
				}
				default: {
					// Others struggle with ground balls
					difficulty += bounceUnpredictability * 1.3;
				}
			}
		}

		// Medium height balls (between pop-ups and line drives)
		if (ballInPlay.launchAngle >= 25 && ballInPlay.launchAngle <= 60) {
			const heightDifficulty = 0.2 + Math.abs(45 - ballInPlay.launchAngle) / 45;
			switch (position) {
				case "lf":
				case "rf": {
					// Outfielders best at medium height balls
					difficulty += heightDifficulty * 0.7;
					break;
				}
				case "fb":
				case "tb": {
					// Corner infielders good at medium height
					difficulty += heightDifficulty * 0.8;
					break;
				}
				default: {
					difficulty += heightDifficulty;
				}
			}
		}

		return Math.min(difficulty, 1);
	}

	private _calculatePositionSpecificDifficulty(
		_input: TInputCalculatePositionSpecificDifficulty,
	) {
		const { ballInPlay, fielder, isFoul, position } = parse(
			VInputCalculatePositionSpecificDifficulty,
			_input,
		);
		switch (position) {
			case "c": {
				return this._calculateCatcherFieldingDifficulty({
					ballInPlay,
					fielder,
					isFoul,
				});
			}
			case "fb":
			case "tb": {
				return this._calculateCornerInfielderFieldingDifficulty({
					ballInPlay,
					fielder,
					isFoul,
					position,
				});
			}
			case "sb":
			case "ss": {
				return this._calculateMiddleInfielderFieldingDifficulty({
					ballInPlay,
					fielder,
					isFoul,
					position,
				});
			}
			case "lf":
			case "cf":
			case "rf": {
				return this._calculateOutfielderFieldingDifficulty({
					ballInPlay,
					fielder,
					isFoul,
					position,
				});
			}
			case "p": {
				return this._calculatePitcherFieldingDifficulty({
					ballInPlay,
					fielder,
					isFoul,
				});
			}
			default: {
				const exhaustiveCheck: never = position;
				throw new Error(exhaustiveCheck);
			}
		}
	}

	private _calculateSituationalDifficulty(
		_input: TInputCalculateSituationalDifficulty,
	) {
		const { ballInPlay, fieldingPosition, finalX, finalY, parkState } = parse(
			VInputCalculateSituationalDifficulty,
			_input,
		);
		let difficulty = 0;

		// 1. Wall/Boundary Proximity (25% of situational difficulty)
		const boundaryDifficulty = this._getBoundaryProximityDifficulty({
			finalX,
			finalY,
			parkState,
		});
		difficulty += boundaryDifficulty * 0.25;

		// 2. Ball Characteristics (25% of situational difficulty)
		const ballDifficulty = this._getBallCharacteristicsDifficulty({
			ballInPlay,
		});
		difficulty += ballDifficulty * 0.25;

		// 3. Fielder Movement and Angles (25% of situational difficulty)
		const movementDifficulty = this._getMovementDifficulty({
			ballInPlay,
			fieldingPosition,
			finalX,
			finalY,
		});
		difficulty += movementDifficulty * 0.25;

		return Math.min(Math.max(difficulty, 0), 1);
	}

	private _getDistanceFromBoundary(_input: TInputGetDistanceFromBoundary) {
		const { finalX, finalY, parkState } = parse(
			VInputGetDistanceFromBoundary,
			_input,
		);
		// Initialize return values
		let shortestDistance = Number.POSITIVE_INFINITY;
		let nearestWallHeight = 0;
		let isNearCorner = false;

		// Get all wall segments
		const wallSegments = parkState.park.wallSegments;

		// Check distance to each wall segment
		for (let i = 0; i < wallSegments.length; i++) {
			const segment = wallSegments[i];
			const distanceInfo = this._getDistanceToWallSegment({
				finalX,
				finalY,
				segment,
			});

			if (distanceInfo.distance < shortestDistance) {
				shortestDistance = distanceInfo.distance;
				nearestWallHeight = segment.height;
				isNearCorner = distanceInfo.isNearCorner;
			}
		}

		// Check distance to foul lines
		const foulLineDistance = this._getDistanceToFoulLines({
			finalX,
			finalY,
			parkState,
		});

		if (foulLineDistance < shortestDistance) {
			shortestDistance = foulLineDistance;
			nearestWallHeight = 0; // Foul lines don't have height
			isNearCorner = false;
		}

		// Check distance to backstop if close to home plate
		if (finalY < 0) {
			const backstopDistance = this._getDistanceToBackstop({
				finalX,
				finalY,
				parkState,
			});

			if (backstopDistance < shortestDistance) {
				shortestDistance = backstopDistance;
				nearestWallHeight = parkState.park.backstopDistance; // Using backstop distance as height
				isNearCorner = false;
			}
		}

		return {
			distance: shortestDistance,
			isNearCorner,
			wallHeight: nearestWallHeight,
		};
	}

	private _getDistanceToWallSegment({
		finalX,
		finalY,
		segment,
	}: {
		finalX: number;
		finalY: number;
		segment: {
			height: number;
			segmentEndX: number;
			segmentEndY: number;
			segmentStartX: number;
			segmentStartY: number;
		};
	}): {
		distance: number;
		isNearCorner: boolean;
	} {
		// Vector from start to end of wall segment
		const wallVectorX = segment.segmentEndX - segment.segmentStartX;
		const wallVectorY = segment.segmentEndY - segment.segmentStartY;

		// Vector from wall start to ball position
		const ballVectorX = finalX - segment.segmentStartX;
		const ballVectorY = finalY - segment.segmentStartY;

		// Wall segment length squared
		const wallLengthSquared =
			wallVectorX * wallVectorX + wallVectorY * wallVectorY;

		// Handle zero-length wall segment
		if (wallLengthSquared === 0) {
			return {
				distance: Math.sqrt(
					ballVectorX * ballVectorX + ballVectorY * ballVectorY,
				),
				isNearCorner: false,
			};
		}

		// Calculate projection of ball vector onto wall vector
		const t = Math.max(
			0,
			Math.min(
				1,
				(ballVectorX * wallVectorX + ballVectorY * wallVectorY) /
					wallLengthSquared,
			),
		);

		// Calculate closest point on wall segment
		const closestX = segment.segmentStartX + t * wallVectorX;
		const closestY = segment.segmentStartY + t * wallVectorY;

		// Calculate distance to closest point
		const distance = Math.sqrt(
			(finalX - closestX) ** 2 + (finalY - closestY) ** 2,
		);

		// Check if near a corner (within 5 feet of segment endpoint)
		const isNearStartCorner = t < 0.1 && distance < 5;
		const isNearEndCorner = t > 0.9 && distance < 5;

		return {
			distance,
			isNearCorner: isNearStartCorner || isNearEndCorner,
		};
	}

	private _getDistanceToFoulLines({
		finalX,
		finalY,
		parkState,
	}: {
		finalX: number;
		finalY: number;
		parkState: GameSimParkState;
	}): number {
		// Calculate distances to both foul lines
		const leftFoulLineDistance = this._getDistanceToLine({
			finalX,
			finalY,
			x1: 0,
			x2: parkState.park.foulLineLeftFieldX,
			y1: 0,
			y2: parkState.park.foulLineLeftFieldY,
		});

		const rightFoulLineDistance = this._getDistanceToLine({
			finalX,
			finalY,
			x1: 0,
			x2: parkState.park.foulLineRightFieldX,
			y1: 0,
			y2: parkState.park.foulLineRightFieldY,
		});

		// Return the shorter distance
		return Math.min(leftFoulLineDistance, rightFoulLineDistance);
	}

	private _getDistanceToBackstop({
		finalX,
		finalY,
		parkState,
	}: {
		finalX: number;
		finalY: number;
		parkState: GameSimParkState;
	}): number {
		// Backstop is typically curved, but we'll approximate it as a straight line
		const backstopY = -parkState.park.backstopDistance;

		// If beyond backstop curve edges, use direct distance
		if (Math.abs(finalX) > parkState.park.backstopDistance) {
			return Math.sqrt(finalX ** 2 + (finalY - backstopY) ** 2);
		}

		// Otherwise, just use vertical distance to backstop
		return Math.abs(finalY - backstopY);
	}

	private _getDistanceToLine({
		finalX,
		finalY,
		x1,
		x2,
		y1,
		y2,
	}: {
		finalX: number;
		finalY: number;
		x1: number;
		x2: number;
		y1: number;
		y2: number;
	}): number {
		// Vector from line start to end
		const lineVectorX = x2 - x1;
		const lineVectorY = y2 - y1;

		// Vector from line start to ball position
		const ballVectorX = finalX - x1;
		const ballVectorY = finalY - y1;

		// Line length squared
		const lineLengthSquared =
			lineVectorX * lineVectorX + lineVectorY * lineVectorY;

		// Handle zero-length line
		if (lineLengthSquared === 0) {
			return Math.sqrt(ballVectorX * ballVectorX + ballVectorY * ballVectorY);
		}

		// Calculate projection
		const t = Math.max(
			0,
			Math.min(
				1,
				(ballVectorX * lineVectorX + ballVectorY * lineVectorY) /
					lineLengthSquared,
			),
		);

		// Calculate closest point on line
		const closestX = x1 + t * lineVectorX;
		const closestY = y1 + t * lineVectorY;

		// Return distance to closest point
		return Math.sqrt((finalX - closestX) ** 2 + (finalY - closestY) ** 2);
	}

	private _getBoundaryProximityDifficulty(
		_input: TInputGetBoundaryProximityDifficulty,
	) {
		const { finalX, finalY, parkState } = parse(
			VInputGetBoundaryProximityDifficulty,
			_input,
		);
		let difficulty = 0;

		// Distance to nearest wall/boundary
		const distanceFromBoundary = this._getDistanceFromBoundary({
			finalX,
			finalY,
			parkState,
		});

		if (distanceFromBoundary < 10) {
			// Very close to wall/boundary
			difficulty += (1 - distanceFromBoundary / 10) * 0.8;
		} else if (distanceFromBoundary < 20) {
			// Approaching wall/boundary
			difficulty += (1 - distanceFromBoundary / 20) * 0.4;
		}

		// Corner plays are harder
		const isInCorner = Math.abs(Math.atan2(finalY, finalX)) > Math.PI * 0.4;
		if (isInCorner) {
			difficulty += 0.3;
		}

		return Math.min(difficulty, 1);
	}

	private _getBallCharacteristicsDifficulty({
		ballInPlay,
	}: {
		ballInPlay: TBallInPlay;
	}): number {
		let difficulty = 0;

		// Exit velocity impact
		if (ballInPlay.exitVelocity > 95) {
			difficulty += Math.min((ballInPlay.exitVelocity - 95) / 20, 0.4);
		}

		// Extreme launch angles
		const optimalAngle = 45;
		const angleDifficulty =
			Math.abs(ballInPlay.launchAngle - optimalAngle) / 90;
		difficulty += angleDifficulty * 0.3;

		// Hang time vs distance relationship
		const expectedHangTime = ballInPlay.distance / 100; // rough estimate
		const hangTimeDiff = Math.abs(ballInPlay.hangTime - expectedHangTime);
		if (hangTimeDiff > 0.5) {
			difficulty += Math.min(hangTimeDiff * 0.2, 0.3);
		}

		// Wind effects (if available)
		// Could add wind calculations here

		return Math.min(difficulty, 1);
	}

	private _getGameSituationDifficulty({
		gameTime,
		numOuts,
		runnersOn,
	}: {
		gameTime: { inning: number; isDay: boolean; isNightGame: boolean };
		numOuts: number;
		runnersOn: Array<{ base: number; isRunning: boolean; speed: number }>;
	}): number {
		let difficulty = 0;

		// Time of day factors
		if (gameTime.isNightGame && !gameTime.isDay) {
			difficulty += 0.1; // Slightly harder at night
		}

		// Late game pressure
		if (gameTime.inning >= 8) {
			difficulty += 0.1;
		}

		// Runner distraction factor
		for (const runner of runnersOn) {
			if (runner.isRunning) {
				// Fast runners create more pressure
				const runnerPressure = (runner.speed / RATING_MAX) * 0.2;
				difficulty += runnerPressure;
			}
		}

		// Critical out situations
		if (numOuts === 2 && runnersOn.length > 0) {
			difficulty += 0.1; // Added pressure with RISP and 2 outs
		}

		return Math.min(difficulty, 1);
	}

	private _getMovementDifficulty({
		ballInPlay,
		fieldingPosition,
		finalX,
		finalY,
	}: {
		ballInPlay: TBallInPlay;
		fieldingPosition: { x: number; y: number };
		finalX: number;
		finalY: number;
	}): number {
		let difficulty = 0;

		// Calculate required movement angle
		const moveAngle = Math.atan2(
			finalY - fieldingPosition.y,
			finalX - fieldingPosition.x,
		);

		// Calculate required distance
		const moveDistance = Math.sqrt(
			Math.pow(finalX - fieldingPosition.x, 2) +
				Math.pow(finalY - fieldingPosition.y, 2),
		);

		// Moving backward is harder
		if (finalY > fieldingPosition.y) {
			difficulty += 0.3;
		}

		// Lateral movement difficulty
		const lateralComponent = Math.abs(Math.sin(moveAngle));
		difficulty += lateralComponent * 0.2;

		// Distance coverage difficulty
		difficulty += Math.min(moveDistance / 100, 0.4);

		// Quick reaction plays
		const reactionTime = ballInPlay.hangTime;
		if (reactionTime < 1.5) {
			difficulty += (1.5 - reactionTime) * 0.3;
		}

		return Math.min(difficulty, 1);
	}

	private _calculateFoulBallFieldingDifficulty(
		_input: TInputCalculateFoulBallFieldingDifficulty,
	) {
		const {
			ballInPlay,
			fielder,
			fielderPosition,
			finalX,
			finalY,
			parkState,
			position,
		} = parse(VInputCalculateFoulBallFieldingDifficulty, _input);

		// Calculate base metrics
		const distanceToTravel = Math.sqrt(
			(finalX - fielderPosition.x) ** 2 + (finalY - fielderPosition.y) ** 2,
		);
		const timeToReach = distanceToTravel / this._getFielderSpeed({ fielder });

		// Initialize base difficulty
		let difficulty = 0;

		// 1. Distance/Time Component (30% of difficulty)
		const distanceDifficulty = Math.min(timeToReach / ballInPlay.hangTime, 1);
		difficulty += distanceDifficulty * 0.3;

		// 2. Ball Trajectory Component (25% of difficulty)
		const trajectoryDifficulty = this._calculateTrajectoryDifficulty({
			ballInPlay,
			position,
		});
		difficulty += trajectoryDifficulty * 0.25;

		// 3. Position-Specific Component (25% of difficulty)
		const positionDifficulty = this._calculatePositionSpecificDifficulty({
			ballInPlay,
			fielder,
			isFoul: true,
			position,
		});
		difficulty += positionDifficulty * 0.25;

		// 4. Environmental/Situational Component (20% of difficulty)
		const situationalDifficulty = this._calculateSituationalDifficulty({
			ballInPlay,
			finalX,
			finalY,
			parkState,
		});
		difficulty += situationalDifficulty * 0.2;

		return Math.min(Math.max(difficulty, 0), 1);
	}

	private _getFoulBallFielderOpportunity(
		_input: TInputGetFoulBallFielderOpportunity,
	) {
		const { ballInPlay, teamDefenseState } = parse(
			VInputGetFoulBallFielderOpportunity,
			_input,
		);

		// Calculate final coordinates and trajectory
		const finalX = ballInPlay.finalX;
		const finalY = ballInPlay.finalY;
		const distance = Math.sqrt(finalX * finalX + finalY * finalY);
		const angle = Math.atan2(finalY, finalX) * (180 / Math.PI);

		// Get all potential fielders based on ball location
		const potentialFielders = this._getPotentialFoulBallFielders({
			angle,
			ballInPlay,
			distance,
			teamDefenseState,
		});

		if (potentialFielders.length === 0) {
			return null;
		}

		// Calculate opportunity for each potential fielder
		const opportunities = potentialFielders.map(({ fielder, position }) => {
			const startPos = this._getFielderStartPosition({
				position: position as TPicklistPositions,
			});
			const difficulty = this._calculateFoulBallFieldingDifficulty({
				ballInPlay,
				fielderPos: startPos,
				finalX,
				finalY,
			});

			return {
				difficulty,
				fielder,
				position,
			};
		});

		// Find the fielder with best (lowest) difficulty
		const bestOpportunity = opportunities.reduce((best, current) => {
			if (current.difficulty < best.difficulty) {
				return current;
			}
			return best;
		});

		// If best opportunity is still too difficult, return null
		if (bestOpportunity.difficulty >= 1) {
			return null;
		}

		return bestOpportunity;
	}

	private _getPotentialFoulBallFielders(
		_input: TInputGetPotentialFoulBallFielders,
	) {
		const { angle, ballInPlay, distance, teamDefenseState } = parse(
			VInputGetPotentialFoulBallFielders,
			_input,
		);
		const fielders: Array<{
			fielder: GameSimPlayerState;
			position: string;
		}> = [];

		if (distance < 40) {
			// Very close to home - catcher only
			fielders.push({
				fielder: teamDefenseState.getFielderForPosition("c"),
				position: "c",
			});
			return fielders;
		}

		if (angle < -70) {
			// Deep left field foul territory
			fielders.push({
				fielder: teamDefenseState.getFielderForPosition("lf"),
				position: "lf",
			});
		} else if (angle > 70) {
			// Deep right field foul territory
			fielders.push({
				fielder: teamDefenseState.getFielderForPosition("rf"),
				position: "rf",
			});
		}

		if (distance < 150) {
			// Infield territory
			if (angle < -30) {
				// Third base side
				fielders.push({
					fielder: teamDefenseState.getFielderForPosition("tb"),
					position: "tb",
				});
			} else if (angle > 30) {
				// First base side
				fielders.push({
					fielder: teamDefenseState.getFielderForPosition("fb"),
					position: "fb",
				});
			}

			// Catcher has a chance on shorter pops
			if (distance < 100 && ballInPlay.launchAngle > 45) {
				fielders.push({
					fielder: teamDefenseState.getFielderForPosition("c"),
					position: "C",
				});
			}
		}

		return fielders;
	}

	private _simulateFoulBallFieldingAttempt({
		difficulty,
		fielder,
		position,
	}: {
		difficulty: number;
		fielder: GameSimPlayerState;
		position: TPicklistPositions;
	}) {
		// Base catch probability starts as inverse of difficulty
		let catchProbability = 1 - difficulty;

		// Get relevant fielding ratings based on position
		const fieldingRatings = {
			catcherAbility: fielder.player.fielding.catcherAbility,
			infieldError: fielder.player.fielding.infieldError,
			infieldRange: fielder.player.fielding.infieldRange,
			outfieldError: fielder.player.fielding.outfieldError,
			outfieldRange: fielder.player.fielding.outfieldRange,
		};

		// Apply position-specific modifiers
		switch (position) {
			case "c": {
				// Catchers use catcher-specific abilities
				const catcherSkill = fieldingRatings.catcherAbility / RATING_MAX;
				catchProbability *= 0.7 + catcherSkill * 0.3; // Catcher skill affects 30% of probability
				break;
			}
			case "fb":
			case "sb": {
				// Corner infielders
				const rangeSkill = fieldingRatings.infieldRange / RATING_MAX;
				const errorSkill = fieldingRatings.infieldError / RATING_MAX;
				// Range affects 40%, error-avoidance affects 30%
				catchProbability *= 0.3 + rangeSkill * 0.4 + errorSkill * 0.3;
				break;
			}
			case "lf":
			case "rf": {
				// Corner outfielders
				const rangeSkill = fieldingRatings.outfieldRange / RATING_MAX;
				const errorSkill = fieldingRatings.outfieldError / RATING_MAX;
				// Range affects 50%, error-avoidance affects 20%
				catchProbability *= 0.3 + rangeSkill * 0.5 + errorSkill * 0.2;
				break;
			}
			default: {
				// Default fielding calculation
				const errorSkill = fieldingRatings.infieldError / RATING_MAX;
				catchProbability *= 0.6 + errorSkill * 0.4;
			}
		}

		// Apply a final random factor (between 0.9 and 1.1) to add some variability
		const randomFactor = 0.9 + Math.random() * 0.2;
		catchProbability *= randomFactor;

		// Ensure probability stays between 0 and 1
		catchProbability = Math.max(0, Math.min(1, catchProbability));

		// Make the attempt
		return Math.random() < catchProbability;
	}

	private _handleFoulBall(_input: TInputHandleFoulBall) {
		const { ballInPlay, teamDefenseState } = parse(
			VInputHandleFoulBall,
			_input,
		);

		// Get the best fielding opportunity for this foul ball
		const fielderOpportunity = this._getFoulBallFielderOpportunity({
			ballInPlay,
			teamDefenseState,
		});

		// If no fielder has a play
		if (!fielderOpportunity) {
			// Only add a strike if less than 2 strikes
			if (this.numStrikes < 2) {
				this.numStrikes++;
			}
			return;
		}

		fielderOpportunity.difficulty;

		// Attempt the catch
		const catchSuccess = this._simulateFoulBallFieldingAttempt({
			difficulty: fielderOpportunity.difficulty,
			fielder: fielderOpportunity.fielder,
			position: fielderOpportunity.position,
		});

		if (catchSuccess) {
			// Foul ball caught - batter is out regardless of strike count
			this._handleOut();
			return;
		}

		// Foul ball dropped - add a strike if less than 2
		if (this.numStrikes < 2) {
			this.numStrikes++;
		}
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

	private _simulateInPlayOutcome(_input: TInputSimulateBallInPlay) {
		const input = parse(VInputSimulateBallInPlay, _input);
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

		const { contactQuality, pitchOutcome } = this._simulatePitchOutcome({
			pitchLocation,
			pitchName,
			playerHitter,
			playerPitcher,
			umpireFb: this.umpireFb,
			umpireHp: this.umpireHp,
			umpireTb: this.umpireSb,
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
				if (contactQuality === null) {
					throw new Error("Expected contactQuality to be a number");
				}

				const simulatorBallInPlay = new SimulatorBallInPlay();

				const ballInPlay = simulatorBallInPlay.simulateBallInPlay({
					contactQuality,
					parkState: this.parkState,
					pitchLocation,
					pitchName,
					playerHitter,
					playerPitcher,
				});

				if (ballInPlay.isFoul) {
					if (this.numStrikes < 2) {
						this.numStrikes++;
					}
					return;
				}

				const simulatorFielding = new SimulatorFielding();

				const fieldingResult = parse(
					VFieldingResult,
					simulatorFielding.simulateFielding({
						ballInPlay,
						teamDefenseState:
							this.teamStates[
								this._getTeamId({ teamIndex: this.numTeamDefense })
							],
					}),
				);

				const inPlayOutcome = this._simulateInPlayOutcome({
					ballInPlay,
					fieldingResult,
				});

				// const inPlayEvent = this._simulateInPlayEvent();

				// switch (inPlayEvent) {
				// 	case "double": {
				// 		this._handleDouble();
				// 		break;
				// 	}
				// 	case "doublePlay":
				// 	case "fieldOut":
				// 	case "forceOut":
				// 	case "groundedIntoDoublePlay":
				// 	case "otherOut": {
				// 		this._handleOut();
				// 		break;
				// 	}
				// 	case "hitByPitch": {
				// 		this._handleHitByPitch();
				// 		break;
				// 	}
				// 	case "homeRun": {
				// 		this._handleHomeRun();
				// 		break;
				// 	}
				// 	case "single": {
				// 		this._handleSingle();
				// 		break;
				// 	}
				// 	case "triple": {
				// 		this._handleTriple();
				// 		break;
				// 	}
				// 	default: {
				// 		const exhaustiveCheck: never = inPlayEvent;
				// 		throw new Error(exhaustiveCheck);
				// 	}
				// }

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

	private _findTrajectoryWallIntersection({
		trajectory,
		wallEnd,
		wallStart,
	}: {
		trajectory: Array<{ x: number; y: number; z: number }>;
		wallEnd: { x: number; y: number };
		wallStart: { x: number; y: number };
	}): { x: number; y: number; z: number } | null {
		// For each pair of points in the trajectory
		for (let i = 0; i < trajectory.length - 1; i++) {
			const p1 = trajectory[i];
			const p2 = trajectory[i + 1];

			// Line segment intersection math
			const denominator =
				(wallEnd.y - wallStart.y) * (p2.x - p1.x) -
				(wallEnd.x - wallStart.x) * (p2.y - p1.y);

			if (denominator === 0) continue; // Lines are parallel

			const ua =
				((wallEnd.x - wallStart.x) * (p1.y - wallStart.y) -
					(wallEnd.y - wallStart.y) * (p1.x - wallStart.x)) /
				denominator;
			const ub =
				((p2.x - p1.x) * (p1.y - wallStart.y) -
					(p2.y - p1.y) * (p1.x - wallStart.x)) /
				denominator;

			// Check if intersection occurs within both line segments
			if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
				const x = p1.x + ua * (p2.x - p1.x);
				const y = p1.y + ua * (p2.y - p1.y);
				const z = p1.z + ua * (p2.z - p1.z);
				return { x, y, z };
			}
		}

		return null;
	}

	private _checkWallInteraction(_input: TInputCheckWallInteraction) {
		const { ballInPlay, parkState } = parse(VInputCheckWallInteraction, _input);

		let closestIntersection = null;
		let minDistance = Number.POSITIVE_INFINITY;
		let intersectingSegmentIndex = -1;
		let intersectingSegmentHeight = 0;

		// Check each wall segment for intersection
		for (let i = 0; i < parkState.park.wallSegments.length; i++) {
			const segment = parkState.park.wallSegments[i];
			const intersection = this._findTrajectoryWallIntersection({
				trajectory: ballInPlay.trajectory,
				wallEnd: { x: segment.segmentEndX, y: segment.segmentEndY },
				wallStart: { x: segment.segmentStartX, y: segment.segmentStartY },
			});

			if (intersection) {
				const distance = Math.sqrt(
					intersection.x * intersection.x + intersection.y * intersection.y,
				);

				if (distance < minDistance) {
					minDistance = distance;
					closestIntersection = intersection;
					intersectingSegmentIndex = i;
					intersectingSegmentHeight = segment.height;
				}
			}
		}
	}

	private _handleWallBallOutcome({
		ballInPlay,
		fieldingResult,
		wallInteraction,
	}: {
		ballInPlay: TBallInPlay;
		fieldingResult: TFieldingResult;
		wallInteraction: ReturnType<typeof this._checkWallInteraction>;
	}) {
		if (wallInteraction.intersectionPoint) {
			const heightRatio =
				wallInteraction.intersectionPoint.z / wallInteraction.wallHeight;
			const distance = Math.sqrt(
				wallInteraction.intersectionPoint.x *
					wallInteraction.intersectionPoint.x +
					wallInteraction.intersectionPoint.y *
						wallInteraction.intersectionPoint.y,
			);

			if (fieldingResult.isError) {
				// Error on wall ball is likely extra bases
				this._handleTriple();
				return;
			}

			if (heightRatio > 0.8) {
				// High off the wall, likely double or triple
				if (distance > 350 || ballInPlay.launchAngle > 25) {
					this._handleTriple();
				} else {
					this._handleDouble();
				}
			} else {
				// Lower on the wall, likely single or double
				if (distance > 330 || ballInPlay.launchAngle > 20) {
					this._handleDouble();
				} else {
					this._handleSingle();
				}
			}
		}
	}

	private _handleNonWallBallOutcome({
		ballInPlay,
		fieldingResult,
	}: {
		ballInPlay: TBallInPlay;
		fieldingResult: TFieldingResult;
	}) {
		if (ballInPlay.launchAngle < 10) {
			// Ground ball
			if (fieldingResult.isError) {
				this._handleSingle();
			} else if (fieldingResult.isSuccess) {
				if (this.numOuts < 2 && this.playerRunner1) {
					// Potential double play situation
					this._handleOut();
					this._handleOut();
				} else {
					this._handleOut();
				}
			} else {
				this._handleSingle();
			}
		} else if (ballInPlay.launchAngle > 25) {
			// Fly ball
			if (fieldingResult.isError) {
				const distance = Math.sqrt(
					ballInPlay.finalX * ballInPlay.finalX +
						ballInPlay.finalY * ballInPlay.finalY,
				);
				if (distance > 200) {
					this._handleTriple();
				} else {
					this._handleDouble();
				}
			} else if (fieldingResult.isSuccess) {
				this._handleOut();
			} else {
				this._handleDouble();
			}
		} else {
			// Line drive
			if (fieldingResult.isError) {
				const distance = Math.sqrt(
					ballInPlay.finalX * ballInPlay.finalX +
						ballInPlay.finalY * ballInPlay.finalY,
				);
				if (distance > 250) {
					this._handleTriple();
				} else {
					this._handleDouble();
				}
			} else if (fieldingResult.isSuccess) {
				this._handleOut();
			} else {
				const distance = Math.sqrt(
					ballInPlay.finalX * ballInPlay.finalX +
						ballInPlay.finalY * ballInPlay.finalY,
				);
				if (distance > 200) {
					this._handleDouble();
				} else {
					this._handleSingle();
				}
			}
		}
	}

	private _getRunnerTaggingChance({ distance }: { distance: number }) {
		return Math.min((distance - 200) / 200, 0.9); // Max 90% chance on deep flies
	}

	_determineSwingLikelihood(_input: TInputDetermineSwingLikelihood) {
		const { pitchLocation, playerHitter, playerPitcher } = parse(
			VInputDetermineSwingLikelihood,
			_input,
		);

		const baseSwingLikelihood = playerHitter.player.batting.eye / RATING_MAX;

		// Adjust based on how close to the zone the pitch is
		const distanceFromCenter = Math.sqrt(
			pitchLocation.plateX ** 2 +
				(pitchLocation.plateZ -
					(pitchLocation.szTop + pitchLocation.szBot) / 2) **
					2,
		);

		const adjustedLikelihood =
			baseSwingLikelihood *
			(1 - distanceFromCenter * 0.2) *
			(playerPitcher.player.pitching.movement / RATING_MAX);

		return Math.random() < adjustedLikelihood;
	}

	_determineStrikeZone(_input: TInputDetermineStrikeZone) {
		const { pitchLocation, umpireHp } = parse(
			VInputDetermineStrikeZone,
			_input,
		);

		const xInZone = Math.abs(pitchLocation.plateX) < 0.85; // Standard strike zone width
		const zInZone =
			pitchLocation.plateZ > pitchLocation.szBot &&
			pitchLocation.plateZ < pitchLocation.szTop;

		// Apply umpire tendencies
		const xAdjustment =
			pitchLocation.plateX > 0
				? umpireHp.umpire.outsideZone / RATING_MAX
				: umpireHp.umpire.insideZone / RATING_MAX;
		const zAdjustment =
			pitchLocation.plateZ > (pitchLocation.szTop + pitchLocation.szBot) / 2
				? umpireHp.umpire.highZone / RATING_MAX
				: umpireHp.umpire.lowZone / RATING_MAX;

		return (
			(xInZone || Math.random() < xAdjustment) &&
			(zInZone || Math.random() < zAdjustment)
		);
	}

	_getFielderStartPosition(_input: TInputGetFielderStartPosition) {
		const { position } = parse(VInputGetFielderStartPosition, _input);

		// All measurements in feet from home plate
		// (0,0) is home plate, positive x is right field, positive y is outfield
		switch (position) {
			case "p": {
				return { x: 0, y: 60.5 }; // Pitcher's mound
			}
			case "c": {
				return { x: 0, y: -3 }; // Slightly behind home plate
			}
			case "fb": {
				return { x: 45, y: 87 }; // First base
			}
			case "sb": {
				return { x: 37, y: 137 }; // Second base
			}
			case "tb": {
				return { x: -45, y: 87 }; // Third base
			}
			case "ss": {
				return { x: -37, y: 137 }; // Shortstop
			}
			case "lf": {
				return { x: -100, y: 280 }; // Left field
			}
			case "cf": {
				return { x: 0, y: 300 }; // Center field
			}
			case "rf": {
				return { x: 100, y: 280 }; // Right field
			}
			default: {
				const exhaustiveCheck: never = position;
				throw new Error(exhaustiveCheck);
			}
		}
	}

	_getPitchWhiffFactor(_input: TInputGetPitchWhiffFactor) {
		const { pitchName } = parse(VInputGetPitchWhiffFactor, _input);
		// Based loosely on MLB whiff rates per pitch type
		const whiffFactors: Record<TPicklistPitchNames, number> = {
			changeup: 0.31,
			curveball: 0.32,
			cutter: 0.25,
			eephus: 0.2,
			fastball: 0.22,
			forkball: 0.3,
			knuckleball: 0.23,
			knuckleCurve: 0.33,
			screwball: 0.29,
			sinker: 0.18,
			slider: 0.35,
			slurve: 0.34,
			splitter: 0.37,
			sweeper: 0.36,
		};

		return whiffFactors[pitchName];
	}

	_determineContactQuality(_input: TInputDetermineContactQuality) {
		const { pitchLocation, pitchName, playerHitter, playerPitcher } = parse(
			VInputDetermineContactQuality,
			_input,
		);

		// Convert ratings to 0-1 scale
		const batterContact = playerHitter.player.batting.contact / RATING_MAX;
		const batterWhiffResistance =
			playerHitter.player.batting.avoidKs / RATING_MAX;
		const pitcherStuff = playerPitcher.player.pitching.stuff / RATING_MAX;

		// Get base whiff rate for this pitch type
		const pitchWhiffFactor = this._getPitchWhiffFactor({ pitchName });

		// Location factor - pitches further from center of zone are harder to hit
		const distanceFromCenter = Math.sqrt(
			pitchLocation.plateX ** 2 +
				(pitchLocation.plateZ -
					(pitchLocation.szTop + pitchLocation.szBot) / 2) **
					2,
		);
		const locationFactor = 1 - distanceFromCenter * 0.15;

		// Calculate contact probability
		const contactProbability =
			batterContact *
			batterWhiffResistance *
			(1 - pitcherStuff * pitchWhiffFactor) *
			locationFactor;

		// Add some randomness
		return contactProbability * (0.85 + Math.random() * 0.3);
	}

	private _simulatePitchOutcome(_input: TInputSimulatePitchOutcome) {
		const pitchOutcome: {
			contactQuality: number | null;
			pitchOutcome: TPicklistPitchOutcomes;
		} = {
			contactQuality: null,
			pitchOutcome: "BALL",
		};
		const input = parse(VInputSimulatePitchOutcome, _input);
		const isInStrikeZone = this._determineStrikeZone({
			pitchLocation: input.pitchLocation,
			umpireHp: input.umpireHp,
		});
		const isBatterSwinging = this._determineSwingLikelihood({
			pitchLocation: input.pitchLocation,
			playerHitter: input.playerHitter,
			playerPitcher: input.playerPitcher,
		});

		if (!isBatterSwinging) {
			if (isInStrikeZone) {
				pitchOutcome.pitchOutcome = "STRIKE";
			}

			return pitchOutcome;
		}

		const contactQuality = this._determineContactQuality({
			pitchLocation: input.pitchLocation,
			pitchName: input.pitchName,
			playerHitter: input.playerHitter,
			playerPitcher: input.playerPitcher,
		});

		if (contactQuality < 0.25) {
			pitchOutcome.pitchOutcome = "STRIKE";
		}

		pitchOutcome.contactQuality = contactQuality;
		pitchOutcome.pitchOutcome = "IN_PLAY";

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
const VInputSimulatePitchOutcome = object({
	pitchLocation: VGameSimEventPitchLocation,
	pitchName: VPicklistPitchNames,
	playerHitter: instance(GameSimPlayerState),
	playerPitcher: instance(GameSimPlayerState),
	umpireHp: instance(GameSimUmpireState),
	umpireFb: instance(GameSimUmpireState),
	umpireTb: instance(GameSimUmpireState),
});
type TInputSimulatePitchOutcome = InferInput<typeof VInputSimulatePitchOutcome>;

const VInputDetermineStrikeZone = object({
	pitchLocation: VGameSimEventPitchLocation,
	umpireHp: instance(GameSimUmpireState),
});
type TInputDetermineStrikeZone = InferInput<typeof VInputDetermineStrikeZone>;

const VInputDetermineSwingLikelihood = object({
	pitchLocation: VGameSimEventPitchLocation,
	playerHitter: instance(GameSimPlayerState),
	playerPitcher: instance(GameSimPlayerState),
});
type TInputDetermineSwingLikelihood = InferInput<
	typeof VInputDetermineSwingLikelihood
>;

const VInputDetermineContactQuality = object({
	pitchLocation: VGameSimEventPitchLocation,
	pitchName: VPicklistPitchNames,
	playerHitter: instance(GameSimPlayerState),
	playerPitcher: instance(GameSimPlayerState),
});
type TInputDetermineContactQuality = InferInput<
	typeof VInputDetermineContactQuality
>;

const VInputGetPitchWhiffFactor = object({
	pitchName: VPicklistPitchNames,
});
type TInputGetPitchWhiffFactor = InferInput<typeof VInputGetPitchWhiffFactor>;

const VInputSimulateBallInPlay = object({
	contactQuality: number(),
	parkState: instance(GameSimParkState),
	pitchLocation: VGameSimEventPitchLocation,
	pitchName: VPicklistPitchNames,
	playerHitter: instance(GameSimPlayerState),
	playerPitcher: instance(GameSimPlayerState),
});
type TInputSimulateBallInPlay = InferInput<typeof VInputSimulateBallInPlay>;

const VBallInPlay = object({
	launchAngle: number(),
	distance: number(),
	exitVelocity: number(),
	finalX: number(),
	finalY: number(),
	hangTime: number(),
	isFoul: boolean(),
	trajectory: array(
		object({
			x: number(),
			y: number(),
			z: number(),
		}),
	),
});
type TBallInPlay = InferInput<typeof VBallInPlay>;

const VInputSimulateFielding = object({
	ballInPlay: VBallInPlay,
	teamDefenseState: instance(GameSimTeamState),
});

type TInputSimulateFielding = InferInput<typeof VInputSimulateFielding>;

const VPicklistFieldingPlayType = picklist([
	"flyBall",
	"groundBall",
	"lineDrive",
]);
type TPicklistFieldingPlayType = InferInput<typeof VPicklistFieldingPlayType>;

const VFieldingResult = object({
	idFielder: number(),
	isError: boolean(),
	isSuccess: boolean(),
	position: VPicklistPositions,
	reachTime: number(),
	type: VPicklistFieldingPlayType,
});
type TFieldingResult = InferInput<typeof VFieldingResult>;

const VInputSimulatePlayOutcome = object({
	ballInPlay: VBallInPlay,
	fieldingResult: VFieldingResult,
});
type TInputSimulatePlayOutcome = InferInput<typeof VInputSimulatePlayOutcome>;

const VInputDetermineFlyBallOutcome = object({
	ballInPlay: VBallInPlay,
	fieldingResult: VFieldingResult,
});
type TInputDetermineFlyBallOutcome = InferInput<
	typeof VInputDetermineFlyBallOutcome
>;

const VInputDetermineGroundBallOutcome = object({
	ballInPlay: VBallInPlay,
	fieldingResult: VFieldingResult,
});
type TInputDetermineGroundBallOutcome = InferInput<
	typeof VInputDetermineGroundBallOutcome
>;
const VInputDetermineLineDriveOutcome = object({
	ballInPlay: VBallInPlay,
	fieldingResult: VFieldingResult,
});
type TInputDetermineLineDriveOutcome = InferInput<
	typeof VInputDetermineLineDriveOutcome
>;

const VInputCheckWallInteraction = object({
	ballInPlay: VBallInPlay,
	parkState: instance(GameSimParkState),
});

type TInputCheckWallInteraction = InferInput<typeof VInputCheckWallInteraction>;

const VInputHandleFoulBall = object({
	ballInPlay: VBallInPlay,
	teamDefenseState: instance(GameSimTeamState),
});
type TInputHandleFoulBall = InferInput<typeof VInputHandleFoulBall>;

const VInputCheckCornerInfielderFoulOpportunity = object({
	ballInPlay: VBallInPlay,
	teamDefenseState: instance(GameSimTeamState),
});

type TInputCheckCornerInfielderFoulOpportunity = InferInput<
	typeof VInputCheckCornerInfielderFoulOpportunity
>;

const VInputCalculateGroundFoulDifficulty = object({
	ballInPlay: VBallInPlay,
	fieldingRange: number(),
	reactionTime: number(),
});
type TInputCalculateGroundFoulDifficulty = InferInput<
	typeof VInputCalculateGroundFoulDifficulty
>;

const VInputCalculateCatcherPopupDifficulty = object({
	ballInPlay: VBallInPlay,
});
type TInputCalculateCatcherPopupDifficulty = InferInput<
	typeof VInputCalculateCatcherPopupDifficulty
>;

const VInputGetFoulBallFielderOpportunity = object({
	ballInPlay: VBallInPlay,
	teamDefenseState: instance(GameSimTeamState),
});
type TInputGetFoulBallFielderOpportunity = InferInput<
	typeof VInputGetFoulBallFielderOpportunity
>;

const VInputGetPotentialFoulBallFielders = object({
	angle: number(),
	ballInPlay: VBallInPlay,
	distance: number(),
	teamDefenseState: instance(GameSimTeamState),
});
type TInputGetPotentialFoulBallFielders = InferInput<
	typeof VInputGetPotentialFoulBallFielders
>;

const VInputCalculateFoulBallFieldingDifficulty = object({
	ballInPlay: VBallInPlay,
	fielder: instance(GameSimPlayerState),
	fielderPosition: object({ x: number(), y: number() }),
	finalX: number(),
	finalY: number(),
	parkState: instance(GameSimParkState),
	position: VPicklistPositions,
});
type TInputCalculateFoulBallFieldingDifficulty = InferInput<
	typeof VInputCalculateFoulBallFieldingDifficulty
>;
const VInputGetFielderStartPosition = object({
	position: VPicklistPositions,
});
type TInputGetFielderStartPosition = InferInput<
	typeof VInputGetFielderStartPosition
>;

const VInputCalculateTrajectoryDifficulty = object({
	ballInPlay: VBallInPlay,
	position: VPicklistPositions,
});
type TInputCalculateTrajectoryDifficulty = InferInput<
	typeof VInputCalculateTrajectoryDifficulty
>;

const VInputCalculatePositionSpecificDifficulty = object({
	ballInPlay: VBallInPlay,
	fielder: instance(GameSimPlayerState),
	isFoul: boolean(),
	position: VPicklistPositions,
});
type TInputCalculatePositionSpecificDifficulty = InferInput<
	typeof VInputCalculatePositionSpecificDifficulty
>;

const VInputCalculateCatcherFieldingDifficulty = object({
	ballInPlay: VBallInPlay,
	fielder: instance(GameSimPlayerState),
	isFoul: boolean(),
});
type TInputCalculateCatcherFieldingDifficulty = InferInput<
	typeof VInputCalculateCatcherFieldingDifficulty
>;

const VInputCalculateCornerInfielderFieldingDifficulty = object({
	ballInPlay: VBallInPlay,
	fielder: instance(GameSimPlayerState),
	isFoul: boolean(),
	position: VPicklistPositions,
});
type TInputCalculateCornerInfielderFieldingDifficulty = InferInput<
	typeof VInputCalculateCornerInfielderFieldingDifficulty
>;

const VInputCalculateMiddleInfielderFieldingDifficulty = object({
	ballInPlay: VBallInPlay,
	fielder: instance(GameSimPlayerState),
	isFoul: boolean(),
	position: VPicklistPositions,
});
type TInputCalculateMiddleInfielderFieldingDifficulty = InferInput<
	typeof VInputCalculateMiddleInfielderFieldingDifficulty
>;

const VInputCalculateOutfielderFieldingDifficulty = object({
	ballInPlay: VBallInPlay,
	fielder: instance(GameSimPlayerState),
	isFoul: boolean(),
	position: VPicklistPositions,
});
type TInputCalculateOutfielderFieldingDifficulty = InferInput<
	typeof VInputCalculateOutfielderFieldingDifficulty
>;

const VInputCalculatePitcherFieldingDifficulty = object({
	ballInPlay: VBallInPlay,
	fielder: instance(GameSimPlayerState),
	isFoul: boolean(),
});
type TInputCalculatePitcherFieldingDifficulty = InferInput<
	typeof VInputCalculatePitcherFieldingDifficulty
>;

const VInputCalculateSituationalDifficulty = object({
	ballInPlay: VBallInPlay,
	fieldingPosition: object({ x: number(), y: number() }),
	finalX: number(),
	finalY: number(),
	parkState: instance(GameSimParkState),
});
type TInputCalculateSituationalDifficulty = InferInput<
	typeof VInputCalculateSituationalDifficulty
>;

const VInputGetBoundaryProximityDifficulty = object({
	finalX: number(),
	finalY: number(),
	parkState: instance(GameSimParkState),
});
type TInputGetBoundaryProximityDifficulty = InferInput<
	typeof VInputGetBoundaryProximityDifficulty
>;

const VInputGetDistanceFromBoundary = object({
	finalX: number(),
	finalY: number(),
	parkState: instance(GameSimParkState),
});
type TInputGetDistanceFromBoundary = InferInput<
	typeof VInputGetDistanceFromBoundary
>;

class SimulatorFielding {
	private readonly INFIELD_DEPTH = 90; // feet from home plate
	private readonly OUTFIELD_DEPTH = 250; // typical outfield depth

	private _determineClosestFielders(_input: TInputSimulateFielding): Array<{
		difficulty: number; // 0-1, how hard the play is
		idFielder: number;
		position: string;
		reachTime: number; // Time fielder needs to reach ball
		xPos: number;
		yPos: number;
	}> {
		const opportunities: Array<{
			difficulty: number; // 0-1, how hard the play is
			idFielder: number;
			position: string;
			reachTime: number; // Time fielder needs to reach ball
			xPos: number;
			yPos: number;
		}> = [];

		const { ballInPlay, teamDefenseState } = parse(
			VInputSimulateFielding,
			_input,
		);

		// Determine if ball is in infield or outfield
		const distanceFromHome = Math.sqrt(
			ballInPlay.finalX * ballInPlay.finalX +
				ballInPlay.finalY * ballInPlay.finalY,
		);
		const isInfield = distanceFromHome <= this.INFIELD_DEPTH;

		// Calculate angles and distances for each fielder
		if (isInfield) {
			// Infield opportunities
			const infielders = {
				fb: teamDefenseState.getFielderForPosition("fb"),
				sb: teamDefenseState.getFielderForPosition("sb"),
				tb: teamDefenseState.getFielderForPosition("tb"),
				ss: teamDefenseState.getFielderForPosition("ss"),
			};

			for (const [position, fielder] of Object.entries(infielders)) {
				const { x: fielderX, y: fielderY } = this._getFielderStartPosition({
					position: position as TPicklistPositions,
				});
				const distance = Math.sqrt(
					(ballInPlay.finalX - fielderX) ** 2 +
						(ballInPlay.finalY - fielderY) ** 2,
				);

				opportunities.push({
					difficulty: this._calculateInfieldDifficulty({ distance, fielder }),
					idFielder: fielder.player.idPlayer,
					position,
					reachTime: distance / this._getFielderSpeed({ fielder }),
					xPos: fielderX,
					yPos: fielderY,
				});
			}
		} else {
			// Outfield opportunities
			const outfielders = {
				cf: teamDefenseState.getFielderForPosition("cf"),
				lf: teamDefenseState.getFielderForPosition("lf"),
				rf: teamDefenseState.getFielderForPosition("rf"),
			};

			for (const [position, fielder] of Object.entries(outfielders)) {
				const { x: fielderX, y: fielderY } = this._getFielderStartPosition({
					position: position as TPicklistPositions,
				});
				const distance = Math.sqrt(
					(ballInPlay.finalX - fielderX) ** 2 +
						(ballInPlay.finalY - fielderY) ** 2,
				);

				opportunities.push({
					difficulty: this._calculateOutfieldDifficulty({ distance, fielder }),
					idFielder: fielder.player.idPlayer,
					position,
					reachTime: distance / this._getFielderSpeed({ fielder }),
					xPos: fielderX,
					yPos: fielderY,
				});
			}
		}

		// Sort by reach time to find closest fielders
		return opportunities.sort((a, b) => a.reachTime - b.reachTime);
	}

	private _calculateInfieldDifficulty({
		distance,
		fielder,
	}: {
		distance: number;
		fielder: GameSimPlayerState;
	}): number {
		const baseRange = fielder.player.fielding.infieldRange / RATING_MAX;
		const baseError = fielder.player.fielding.infieldError / RATING_MAX;

		// Normalize distance to difficulty (0-1)
		const distanceFactor = Math.min(distance / 40, 1); // 40 feet as max reasonable range

		return 1 - (baseRange * (1 - distanceFactor) + baseError);
	}

	private _calculateOutfieldDifficulty({
		distance,
		fielder,
	}: {
		distance: number;
		fielder: GameSimPlayerState;
	}): number {
		const baseRange = fielder.player.fielding.outfieldRange / RATING_MAX;
		const baseError = fielder.player.fielding.outfieldError / RATING_MAX;

		// Normalize distance to difficulty (0-1)
		const distanceFactor = Math.min(distance / 100, 1); // 100 feet as max reasonable range

		return 1 - (baseRange * (1 - distanceFactor) + baseError);
	}

	private _getFielderSpeed({
		fielder,
	}: { fielder: GameSimPlayerState }): number {
		// Convert speed rating to feet per second
		return 15 + (fielder.player.running.speed / RATING_MAX) * 15; // Range: 15-30 ft/s
	}

	private _getFielderStartPosition({
		position,
	}: { position: TPicklistPositions }) {
		// Approximate starting positions (could be customized based on strategy/shifts)
		const positions: Record<TPicklistPositions, { x: number; y: number }> = {
			p: { x: 0, y: 0 },
			c: { x: 0, y: 0 },
			fb: { x: 60, y: 60 },
			sb: { x: -40, y: 60 },
			tb: { x: -60, y: 60 },
			cf: { x: 0, y: this.OUTFIELD_DEPTH },
			lf: { x: -90, y: this.OUTFIELD_DEPTH - 20 },
			rf: { x: 90, y: this.OUTFIELD_DEPTH - 20 },
			ss: { x: -40, y: 60 },
		};
		return positions[position];
	}

	private _simulateFieldingAttempt({
		opportunity,
		ballInPlay,
	}: {
		opportunity: {
			difficulty: number; // 0-1, how hard the play is
			idFielder: number;
			position: string;
			reachTime: number; // Time fielder needs to reach ball
			xPos: number;
			yPos: number;
		};
		ballInPlay: TBallInPlay;
	}) {
		// Base success chance from difficulty
		const baseSuccess = 1 - opportunity.difficulty;

		// Adjust for hang time
		const hangTimeFactor = Math.min(ballInPlay.hangTime / 4, 1); // Normalize to 0-1
		const adjustedSuccess = baseSuccess * (0.7 + hangTimeFactor * 0.3);

		// Random roll for success
		const isSuccess = Math.random() < adjustedSuccess;

		// Determine if it's an error on successful reach
		const errorChance = opportunity.difficulty * 0.2; // Higher difficulty = higher error chance
		const isError = isSuccess && Math.random() < errorChance;

		return {
			idFielder: opportunity.idFielder,
			isError,
			isSuccess: isSuccess && !isError,
			position: opportunity.position,
			reachTime: opportunity.reachTime,
			type: this._determinePlayType({ ballInPlay, opportunity }),
		};
	}

	private _determinePlayType({
		ballInPlay,
		opportunity,
	}: {
		opportunity: {
			difficulty: number; // 0-1, how hard the play is
			idFielder: number;
			position: string;
			reachTime: number; // Time fielder needs to reach ball
			xPos: number;
			yPos: number;
		};
		ballInPlay: TBallInPlay;
	}) {
		const isInfield = opportunity.position.match(/[fst]B|SS/);
		const isGroundBall = ballInPlay.launchAngle < 10;
		const isLineDrive =
			ballInPlay.launchAngle >= 10 && ballInPlay.launchAngle < 25;
		const isFlyBall = ballInPlay.launchAngle >= 25;

		if (isInfield) {
			return isGroundBall
				? "groundBall"
				: isLineDrive
					? "lineDrive"
					: "flyBall";
		}
		return isLineDrive ? "lineDrive" : isFlyBall ? "flyBall" : "groundBall";
	}

	simulateFielding(input: TInputSimulateFielding) {
		const { ballInPlay, teamDefenseState } = input;

		// Get closest fielders to ball landing spot
		const opportunities = this._determineClosestFielders({
			ballInPlay,
			teamDefenseState,
		});

		// Simulate primary fielder attempt
		const opportunity = opportunities[0];
		const result = this._simulateFieldingAttempt({
			opportunity: opportunity,
			ballInPlay,
		});

		return result;
	}
}

class SimulatorBallInPlay {
	private readonly GRAVITY = -32.174; // ft/s^2
	private readonly AIR_DENSITY = 0.0765; // lb/ft^3
	private readonly BALL_MASS = 0.3125; // lb
	private readonly BALL_RADIUS = 0.12; // ft

	private _calculateExitVelocity(input: TInputSimulateBallInPlay) {
		const {
			contactQuality,
			playerHitter: {
				player: {
					batting: { power },
				},
			},
		} = input;
		const baseExitVelo = 65 + (power / RATING_MAX) * 55; // 65-120 mph range
		return baseExitVelo * contactQuality;
	}

	private _calculateLaunchAngle(input: TInputSimulateBallInPlay) {
		const { contactQuality, pitchLocation } = input;

		// Base angle affected by pitch height
		const baseAngle = 10 + (pitchLocation.plateZ - pitchLocation.szBot) * 15;

		// Add variation based on contact quality
		const angleVariation = (Math.random() - 0.5) * 20;
		return baseAngle + angleVariation * (1 - contactQuality);
	}

	private _calculateSpinRate(input: TInputSimulateBallInPlay): number {
		const {
			contactQuality,
			playerHitter: {
				player: {
					batting: { gap },
				},
			},
		} = input;
		// Higher gap power generally means better ability to create beneficial spin
		const baseSpin = 1500 + (gap / RATING_MAX) * 1500;
		return baseSpin * contactQuality;
	}

	private _isFoulBall({
		parkState,
		x,
		y,
	}: {
		parkState: GameSimParkState;
		x: number;
		y: number;
	}) {
		// Calculate slopes of foul lines
		const leftFoulLineSlope =
			parkState.park.foulLineLeftFieldY / parkState.park.foulLineLeftFieldX;
		const rightFoulLineSlope =
			parkState.park.foulLineRightFieldY / parkState.park.foulLineRightFieldX;

		// For left field (negative X), ball is fair if Y is greater than the left foul line Y at that X
		// For right field (positive X), ball is fair if Y is greater than the right foul line Y at that X
		if (x < 0) {
			const foulLineY = leftFoulLineSlope * x;
			return y < foulLineY;
		}
		if (x > 0) {
			const foulLineY = rightFoulLineSlope * x;
			return y < foulLineY;
		}

		// If ballX is exactly 0, it's fair
		return false;
	}

	private _calculateTrajectory({
		exitVelocity,
		launchAngle,
		spinRate,
	}: {
		exitVelocity: number;
		launchAngle: number;
		spinRate: number;
	}) {
		const trajectory: Array<{ x: number; y: number; z: number }> = [];
		const timeStep = 0.01; // seconds

		// Initial conditions
		let x = 0;
		let y = 0;
		let z = 2; // Starting height (approximate height of contact)

		// Convert launch angle to radians
		const theta = (launchAngle * Math.PI) / 180;

		// Initial velocities
		let vx = exitVelocity * Math.cos(theta);
		let vy = exitVelocity * Math.sin(theta);
		let vz = 0;

		// Magnus force coefficient based on spin
		const magnusCoef = spinRate / 10000;

		while (z > 0) {
			// While ball is above ground
			// Update position
			x += vx * timeStep;
			y += vy * timeStep;
			z += vz * timeStep;

			// Calculate drag force
			const velocity = Math.sqrt(vx * vx + vy * vy + vz * vz);
			const dragForce =
				-0.5 *
				this.AIR_DENSITY *
				Math.PI *
				this.BALL_RADIUS *
				this.BALL_RADIUS *
				velocity;

			// Update velocities including drag and magnus effect
			vx += ((dragForce * vx) / velocity) * timeStep;
			vy += ((dragForce * vy) / velocity + magnusCoef * vx) * timeStep;
			vz += (this.GRAVITY + (dragForce * vz) / velocity) * timeStep;

			trajectory.push({ x, y, z });
		}

		return trajectory;
	}

	simulateBallInPlay(_input: TInputSimulateBallInPlay) {
		const input = parse(VInputSimulateBallInPlay, _input);
		const exitVelocity = this._calculateExitVelocity(input);
		const launchAngle = this._calculateLaunchAngle(input);
		const spinRate = this._calculateSpinRate(input);

		const trajectory = this._calculateTrajectory({
			exitVelocity,
			launchAngle,
			spinRate,
		});
		const finalPosition = trajectory[trajectory.length - 1];

		const isFoul = this._isFoulBall({
			parkState: input.parkState,
			x: finalPosition.x,
			y: finalPosition.y,
		});
		const distance = Math.sqrt(
			finalPosition.x * finalPosition.x + finalPosition.y * finalPosition.y,
		);
		const hangTime = trajectory.length * 0.01; // Based on our timeStep

		return {
			distance,
			exitVelocity,
			finalX: finalPosition.x,
			finalY: finalPosition.y,
			hangTime,
			isFoul,
			launchAngle,
			trajectory,
		};
	}
}
