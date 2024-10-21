import { type InferInput, array, instance, object, parse } from "valibot";
import type { POSITIONS } from "../constants/cBaseball";
import { handleValibotParse } from "../functions";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";
import {
	type TConstructorGameSimCoach,
	VConstructorGameSimCoach,
	VConstructorGameSimTeam,
} from "../types/tGameSimConstructors";
import { VPicklistPositions } from "../types/tPicklist";
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
	pitching: TPitchingStatistics;
};

const VConstructorGameSimTeamState = object({
	coach: VConstructorGameSimCoach,
	playerStates: array(instance(GameSimPlayerState)),
	team: VConstructorGameSimTeam,
});
type TConstructorGameSimTeamState = InferInput<
	typeof VConstructorGameSimTeamState
>;

class GameSimTeamState extends GameSimUtils implements OGameSimObserver {
	coach: TConstructorGameSimCoach;
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
		this.coach = input.coach;

		this.playerStates = input.playerStates.reduce(
			(acc: { [key: number]: GameSimPlayerState }, player) => {
				acc[player.player.idPlayer] = player;
				return acc;
			},
			{},
		);

		this.positions = {
			p: this._setPlayerPosition("p"),
			c: this._setPlayerPosition("c"),
			fb: this._setPlayerPosition("fb"),
			sb: this._setPlayerPosition("sb"),
			tb: this._setPlayerPosition("tb"),
			ss: this._setPlayerPosition("ss"),
			lf: this._setPlayerPosition("lf"),
			cf: this._setPlayerPosition("cf"),
			rf: this._setPlayerPosition("rf"),
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
		this.numLineupIndex = (this.numLineupIndex + 1) % this.lineup.length;
	}

	public getCurrentHitterId() {
		return this.lineup[this.numLineupIndex];
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
				break;
			}
			case "atBatStart": {
				break;
			}
			case "double": {
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
				const {
					teamDefense,
					teamOffense,
					playerRunner1,
					playerRunner2,
					playerRunner3,
				} = input.data;

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
}

export default GameSimTeamState;

const VInputGetPositionId = object({
	position: VPicklistPositions,
});
type TInputGetPositionId = InferInput<typeof VInputGetPositionId>;
