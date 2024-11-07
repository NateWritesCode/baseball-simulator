import {
	type InferInput,
	array,
	instance,
	number,
	object,
	parse,
} from "valibot";
import { FATIGUE_MAX, RATING_MAX } from "../constants";
import type { POSITIONS } from "../constants/cBaseball";
import { handleValibotParse } from "../functions";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";
import { VConstructorGameSimTeam } from "../types/tGameSimConstructors";
import { VPicklistPositions } from "../types/tPicklist";
import GameSimCoachState from "./eGameSimCoachState";
import GameSimPlayerState from "./eGameSimPlayerState";
import GameSimUtils from "./eGameSimUtils";

type TBattingStatistics = {
	bb: number;
	doubles: number;
	h: number;
	hr: number;
	k: number;
	lob: number;
	outs: number;
	rbi: number;
	runs: number;
	singles: number;
	triples: number;
};

type TFieldingStatistics = {
	e: number;
};

type TPitchingStatistics = {
	battersFaced: number;
	bb: number;
	doublesAllowed: number;
	k: number;
	pitchesThrown: number;
	pitchesThrownBalls: number;
	pitchesThrownInPlay: number;
	pitchesThrownStrikes: number;
	hitsAllowed: number;
	hrsAllowed: number;
	lob: number;
	outs: number;
	runsAllowed: number;
	runsEarned: number;
	singlesAllowed: number;
	triplesAllowed: number;
};

type TStatistics = {
	batting: TBattingStatistics;
	fielding: TFieldingStatistics;
	pitching: TPitchingStatistics;
};

const VConstructorGameSimTeamState = object({
	coachStates: array(instance(GameSimCoachState)),
	playerStates: array(instance(GameSimPlayerState)),
	team: VConstructorGameSimTeam,
});
type TConstructorGameSimTeamState = InferInput<
	typeof VConstructorGameSimTeamState
>;

class GameSimTeamState extends GameSimUtils implements OGameSimObserver {
	coachStates: {
		[key: number]: GameSimCoachState;
	};
	lineup: number[];
	numLineupIndex: number;
	playerStates: {
		[key: number]: GameSimPlayerState;
	};
	positions: {
		p: number;
		c: number;
		fb: number;
		sb: number;
		tb: number;
		ss: number;
		lf: number;
		cf: number;
		rf: number;
	};
	statistics: TStatistics;
	team: TConstructorGameSimTeamState["team"];

	constructor(_input: TConstructorGameSimTeamState) {
		super();
		const input = parse(VConstructorGameSimTeamState, _input);
		this.team = input.team;

		this.coachStates = input.coachStates.reduce(
			(acc: { [key: number]: GameSimCoachState }, coach) => {
				acc[coach.coach.idCoach] = coach;
				return acc;
			},
			{},
		);

		this.playerStates = input.playerStates.reduce(
			(acc: { [key: number]: GameSimPlayerState }, player) => {
				acc[player.player.idPlayer] = player;
				return acc;
			},
			{},
		);

		const { p, c, fb, sb, tb, ss, lf, cf, rf } = this._getStartingPlayers();

		this.positions = {
			p,
			c,
			fb,
			sb,
			tb,
			ss,
			lf,
			cf,
			rf,
		};

		this.numLineupIndex = 0;
		this.lineup = this._setLineup();

		// Stats
		this.statistics = {
			batting: {
				bb: 0,
				doubles: 0,
				h: 0,
				hr: 0,
				k: 0,
				lob: 0,
				outs: 0,
				rbi: 0,
				runs: 0,
				singles: 0,
				triples: 0,
			},
			fielding: {
				e: 0,
			},
			pitching: {
				battersFaced: 0,
				bb: 0,
				doublesAllowed: 0,
				hitsAllowed: 0,
				hrsAllowed: 0,
				k: 0,
				lob: 0,
				outs: 0,
				pitchesThrown: 0,
				pitchesThrownBalls: 0,
				pitchesThrownInPlay: 0,
				pitchesThrownStrikes: 0,
				runsAllowed: 0,
				runsEarned: 0,
				singlesAllowed: 0,
				triplesAllowed: 0,
			},
		};
	}

	public advanceLineupIndex() {
		this.numLineupIndex++;

		if (this.numLineupIndex >= this.lineup.length) {
			this.numLineupIndex = 0;
		}
	}

	public getCurrentHitterId() {
		return this.lineup[this.numLineupIndex];
	}

	public getFielderForPosition(position: (typeof POSITIONS)[number]) {
		const idPlayer = this.positions[position];

		return this.playerStates[idPlayer];
	}

	public getPositionId(_input: TInputGetPositionId) {
		const input = parse(VInputGetPositionId, _input);

		return this.positions[input.position];
	}

	notifyGameEvent(_input: TGameSimEvent) {
		const [input, error] = handleValibotParse({
			data: _input,
			schema: VGameSimEvent,
		});

		if (error || !input) {
			throw new Error("Invalid input");
		}

		const gameSimEvent = input.gameSimEvent;

		switch (gameSimEvent) {
			case "atBatEnd": {
				const { data } = input;
				const { teamDefense, teamOffense } = data;

				if (teamOffense.team.idTeam === this.team.idTeam) {
					this.advanceLineupIndex();
				}

				if (teamDefense.team.idTeam === this.team.idTeam) {
					const shouldSubstitutePitcher = this._shouldSubstitutePitcher({
						maxFatiguePercentage: 0.75,
						maxPitchesThrown: 125,
					});

					if (shouldSubstitutePitcher) {
						this._substitutePitcherToBestAvailable();
					}
				}

				break;
			}
			case "atBatStart": {
				break;
			}
			case "double": {
				break;
			}
			case "foul": {
				break;
			}
			case "gameEnd": {
				break;
			}
			case "gameStart": {
				break;
			}
			case "halfInningEnd": {
				break;
			}
			case "halfInningStart": {
				break;
			}
			case "homeRun": {
				const { teamDefense, teamOffense } = input.data;

				if (teamOffense.team.idTeam === this.team.idTeam) {
					this.statistics.batting.hr++;
				}

				if (teamDefense.team.idTeam === this.team.idTeam) {
					this.statistics.pitching.hrsAllowed++;
				}

				break;
			}
			case "out": {
				break;
			}
			case "pitch": {
				break;
			}
			case "run": {
				const { teamDefense, teamOffense } = input.data;

				if (teamOffense.team.idTeam === this.team.idTeam) {
					this.statistics.batting.runs++;
				}

				if (teamDefense.team.idTeam === this.team.idTeam) {
					this.statistics.pitching.runsAllowed++;
				}
				break;
			}
			case "single": {
				break;
			}
			case "strikeout": {
				break;
			}
			case "triple": {
				break;
			}
			case "walk": {
				break;
			}
			default: {
				const exhaustiveCheck: never = gameSimEvent;
				throw new Error(exhaustiveCheck);
			}
		}
	}

	private _getArrayOfAllPlayerStates() {
		return Object.values(this.playerStates || {});
	}

	private _getArrayOfAllPlayerStatesActive() {
		const playersPositionIds = Object.values(this.positions || {});

		return this._getArrayOfAllPlayerStates().filter((player) =>
			playersPositionIds.includes(player.player.idPlayer),
		);
	}

	private _getArrayOfAllPlayerStatesBench() {
		const playersPositionIds = Object.values(this.positions || {});

		return this._getArrayOfAllPlayerStates().filter(
			(player) => !playersPositionIds.includes(player.player.idPlayer),
		);
	}

	private _getStartingPlayers() {
		const idsStartingPlayers = [];

		const p = this._getStartingPitcher();

		idsStartingPlayers.push(p);

		const c = this._getStartingPositionPlayer({
			idsStartingPlayers,
			position: "c",
		});

		idsStartingPlayers.push(c);

		const fb = this._getStartingPositionPlayer({
			idsStartingPlayers,
			position: "fb",
		});

		idsStartingPlayers.push(fb);

		const sb = this._getStartingPositionPlayer({
			idsStartingPlayers,
			position: "sb",
		});

		idsStartingPlayers.push(sb);

		const tb = this._getStartingPositionPlayer({
			idsStartingPlayers,
			position: "tb",
		});

		idsStartingPlayers.push(tb);

		const ss = this._getStartingPositionPlayer({
			idsStartingPlayers,
			position: "ss",
		});

		idsStartingPlayers.push(ss);

		const lf = this._getStartingPositionPlayer({
			idsStartingPlayers,
			position: "lf",
		});

		idsStartingPlayers.push(lf);

		const cf = this._getStartingPositionPlayer({
			idsStartingPlayers,
			position: "cf",
		});

		idsStartingPlayers.push(cf);

		const rf = this._getStartingPositionPlayer({
			idsStartingPlayers,
			position: "rf",
		});

		idsStartingPlayers.push(rf);

		return {
			c,
			cf,
			fb,
			lf,
			p,
			rf,
			sb,
			ss,
			tb,
		};
	}

	private _getStartingPitcher = () => {
		const pitchers = this._getArrayOfAllPlayerStatesBench().toSorted((a, b) => {
			const aRating =
				a.player.pitching.stuff +
				a.player.pitching.movement +
				a.player.pitching.control +
				a.player.pitching.stamina;
			const bRating =
				b.player.pitching.stuff +
				b.player.pitching.movement +
				b.player.pitching.control +
				b.player.pitching.stamina;
			return bRating - aRating;
		});

		if (!pitchers.length) {
			throw new Error("No pitchers found");
		}

		return pitchers[0].player.idPlayer;
	};

	private _getStartingPositionPlayer = ({
		idsStartingPlayers,
		position,
	}: {
		idsStartingPlayers: number[];
		position: Exclude<(typeof POSITIONS)[number], "p">;
	}) => {
		const players = this._getArrayOfAllPlayerStates()
			.filter((player) => !idsStartingPlayers.includes(player.player.idPlayer))
			.toSorted((a, b) => {
				const aRating =
					a.player.fielding[position] +
					a.player.batting.contact +
					a.player.batting.power +
					a.player.batting.eye +
					a.player.batting.gap +
					a.player.batting.avoidKs;

				const bRating =
					a.player.fielding[position] +
					b.player.batting.contact +
					b.player.batting.power +
					b.player.batting.eye +
					b.player.batting.gap +
					b.player.batting.avoidKs;

				return bRating - aRating;
			});

		if (!players.length) {
			throw new Error(`No ${position} found`);
		}

		return players[0].player.idPlayer;
	};

	private _setLineup() {
		return this._getArrayOfAllPlayerStatesActive()
			.toSorted((a, b) => {
				const aRating =
					a.player.batting.contact +
					a.player.batting.power +
					a.player.batting.eye +
					a.player.batting.gap +
					a.player.batting.avoidKs;
				const bRating =
					b.player.batting.contact +
					b.player.batting.power +
					b.player.batting.eye +
					b.player.batting.gap +
					b.player.batting.avoidKs;

				return bRating - aRating;
			})
			.map((player) => player.player.idPlayer);
	}

	private _setPlayerPosition(position: (typeof POSITIONS)[number]) {
		switch (position) {
			case "p": {
				return this._setPositionPitcher();
			}
			case "c":
			case "fb":
			case "sb":
			case "tb":
			case "ss":
			case "lf":
			case "cf":
			case "rf": {
				return this._setPositionNonPitcher(position);
			}
			default: {
				const exhaustiveCheck: never = position;
				throw new Error(exhaustiveCheck);
			}
		}
	}

	private _setPositionPitcher() {
		const pitchers = this._getArrayOfAllPlayerStatesBench().toSorted((a, b) => {
			const aRating =
				a.player.pitching.stuff +
				a.player.pitching.movement +
				a.player.pitching.control;
			const bRating =
				b.player.pitching.stuff +
				b.player.pitching.movement +
				b.player.pitching.control;
			return bRating - aRating;
		});

		if (!pitchers.length) {
			throw new Error("No pitchers found");
		}

		return pitchers[0].player.idPlayer;
	}

	private _setPositionNonPitcher(
		position: Exclude<(typeof POSITIONS)[number], "p">,
	) {
		const players = this._getArrayOfAllPlayerStatesBench().toSorted((a, b) => {
			const aRating =
				a.player.fielding[position] +
				a.player.batting.contact +
				a.player.batting.power +
				a.player.batting.eye +
				a.player.batting.gap +
				a.player.batting.avoidKs;

			const bRating =
				a.player.fielding[position] +
				b.player.batting.contact +
				b.player.batting.power +
				b.player.batting.eye +
				b.player.batting.gap +
				b.player.batting.avoidKs;

			return bRating - aRating;
		});

		if (!players.length) {
			throw new Error(`No ${position} found`);
		}

		return players[0].player.idPlayer;
	}

	private _shouldSubstitutePitcher(_input: TInputShouldSubstitutePitcher) {
		const input = parse(VInputShouldSubstitutePitcher, _input);

		// Get current pitcher
		const currentPitcherId = this.positions.p;
		const currentPitcher = this.playerStates[currentPitcherId];

		// Check fatigue and stamina thresholds
		const fatiguePercentage = currentPitcher.fatigue.current / FATIGUE_MAX;
		const staminaPercentage =
			currentPitcher.player.pitching.stamina / RATING_MAX;
		const pitchesThrown = currentPitcher.statistics.pitching.pitchesThrown;

		// Determine if substitution is needed based on multiple factors
		const needsSubstitution =
			fatiguePercentage > input.maxFatiguePercentage || // Exceeds fatigue threshold
			pitchesThrown > input.maxPitchesThrown || // Too many pitches
			(fatiguePercentage > input.maxFatiguePercentage * 0.75 &&
				staminaPercentage < 0.4); // Combined fatigue and low stamina

		if (!needsSubstitution) {
			return false;
		}

		// Find best available relief pitcher
		const availablePitchers = this._getArrayOfAllPlayerStatesBench().toSorted(
			(a, b) => {
				// Calculate combined rating for each pitcher
				const getRating = (player: GameSimPlayerState) => {
					const basePitchingRating =
						player.player.pitching.stuff +
						player.player.pitching.movement +
						player.player.pitching.control;

					// Consider fatigue in rating calculation
					const fatigueMultiplier = 1 - player.fatigue.current / FATIGUE_MAX;
					const staminaMultiplier = player.player.pitching.stamina / RATING_MAX;

					return basePitchingRating * fatigueMultiplier * staminaMultiplier;
				};

				return getRating(b) - getRating(a);
			},
		);

		// If no pitchers available, keep current pitcher
		if (!availablePitchers.length) {
			return false;
		}

		// Check if best available pitcher is actually better than current pitcher
		const bestAvailablePitcher = availablePitchers[0];
		const currentFatigueMultiplier =
			1 - currentPitcher.fatigue.current / FATIGUE_MAX;
		const currentEffectiveness =
			(currentPitcher.player.pitching.stuff +
				currentPitcher.player.pitching.movement +
				currentPitcher.player.pitching.control) *
			currentFatigueMultiplier;

		const replacementFatigueMultiplier =
			1 - bestAvailablePitcher.fatigue.current / FATIGUE_MAX;
		const replacementEffectiveness =
			(bestAvailablePitcher.player.pitching.stuff +
				bestAvailablePitcher.player.pitching.movement +
				bestAvailablePitcher.player.pitching.control) *
			replacementFatigueMultiplier;

		// Only substitute if replacement is significantly better
		if (replacementEffectiveness > currentEffectiveness * 1.1) {
			this.positions.p = bestAvailablePitcher.player.idPlayer;
			return true;
		}

		return false;
	}

	private _substitutePitcherToBestAvailable() {
		const currentPitcherId = this.positions.p;
		const currentPitcher = this.playerStates[currentPitcherId];

		// Find best available relief pitcher
		const availablePitchers = this._getArrayOfAllPlayerStatesBench().toSorted(
			(a, b) => {
				// Calculate combined rating for each pitcher
				const getRating = (player: GameSimPlayerState) => {
					const basePitchingRating =
						player.player.pitching.stuff +
						player.player.pitching.movement +
						player.player.pitching.control;

					// Consider fatigue in rating calculation
					const fatigueMultiplier = 1 - player.fatigue.current / FATIGUE_MAX;
					const staminaMultiplier = player.player.pitching.stamina / RATING_MAX;

					return basePitchingRating * fatigueMultiplier * staminaMultiplier;
				};

				return getRating(b) - getRating(a);
			},
		);

		// If no pitchers available, keep current pitcher
		if (!availablePitchers.length) {
			return false;
		}

		// Check if best available pitcher is actually better than current pitcher
		const bestAvailablePitcher = availablePitchers[0];
		const currentFatigueMultiplier =
			1 - currentPitcher.fatigue.current / FATIGUE_MAX;
		const currentEffectiveness =
			(currentPitcher.player.pitching.stuff +
				currentPitcher.player.pitching.movement +
				currentPitcher.player.pitching.control) *
			currentFatigueMultiplier;

		const replacementFatigueMultiplier =
			1 - bestAvailablePitcher.fatigue.current / FATIGUE_MAX;
		const replacementEffectiveness =
			(bestAvailablePitcher.player.pitching.stuff +
				bestAvailablePitcher.player.pitching.movement +
				bestAvailablePitcher.player.pitching.control) *
			replacementFatigueMultiplier;

		// Only substitute if replacement is significantly better
		if (replacementEffectiveness > currentEffectiveness * 1.1) {
			this.positions.p = bestAvailablePitcher.player.idPlayer;
			return true;
		}

		return false;
	}
}

export default GameSimTeamState;

const VInputGetPositionId = object({
	position: VPicklistPositions,
});
type TInputGetPositionId = InferInput<typeof VInputGetPositionId>;

const VInputShouldSubstitutePitcher = object({
	maxFatiguePercentage: number(),
	maxPitchesThrown: number(),
});
type TInputShouldSubstitutePitcher = InferInput<
	typeof VInputShouldSubstitutePitcher
>;
