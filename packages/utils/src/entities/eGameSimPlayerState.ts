import { Database } from "bun:sqlite";
import {
	type InferInput,
	instance,
	nullable,
	number,
	object,
	parse,
} from "valibot";
import {
	DB_PATH,
	FATIGUE_MAX,
	FATIGUE_MIN,
	RATING_MAX,
	RATING_MIN,
} from "../constants";
import { PITCHES_THROWN_STANDARD_MAX } from "../constants/cBaseball";
import { handleValibotParse } from "../functions";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";
import {
	type TConstructorGameSimPlayer,
	VConstructorGameSimPlayer,
} from "../types/tGameSimConstructors";
import { VPicklistPitchNames } from "../types/tPicklist";

// Fatigue multipliers for different pitch types
const PITCH_TYPE_FATIGUE_MULTIPLIERS = {
	fastball: 1.2, // High stress on arm
	sinker: 1.15, // Heavy ball, high effort
	cutter: 1.1, // Modified fastball, moderate stress
	slider: 1.0, // Standard breaking ball effort
	changeup: 0.9, // Lower velocity, less stress
	curveball: 0.95, // Breaking ball, moderate effort
	splitter: 1.05, // Split-finger puts stress on arm
	sweeper: 1.0, // Standard breaking ball effort
	knuckleball: 0.8, // Low velocity, minimal stress
	eephus: 0.7, // Very low effort pitch
	forkball: 1.0, // Moderate stress on arm
	knuckleCurve: 0.9, // Low velocity breaking ball
	screwball: 1.1, // High stress on arm
	slurve: 1.0, // Standard breaking ball effort
} as const;

// Base fatigue values for different actions
const BASE_FATIGUE = {
	PITCH: 0.15, // Base fatigue per pitch
	RUN_TO_BASE: 0.3, // Base fatigue for running to next base
	HUSTLE_MULTIPLIER: 2, // Multiplier for hustle plays
	FIELD_ROUTINE: 0.15, // Routine fielding play
	FIELD_SPECTACULAR: 0.4, // Spectacular fielding play
} as const;

type TBattingStatistics = {
	ab: number;
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
	runs: number;
	runsEarned: number;
	singlesAllowed: number;
	triplesAllowed: number;
};

type TFatigue = {
	accumulator: number;
	current: number;
};

type TStatistics = {
	batting: TBattingStatistics;
	pitching: TPitchingStatistics;
};

const VConstructorGameSimPlayerState = object({
	idGameGroup: nullable(number()),
	player: VConstructorGameSimPlayer,
});
type TConstructorGameSimPlayerState = InferInput<
	typeof VConstructorGameSimPlayerState
>;

class GameSimPlayerState implements OGameSimObserver {
	fatigue: TFatigue = {
		accumulator: 0,
		current: FATIGUE_MIN,
	};
	idGameGroup: number | null;
	public player: TConstructorGameSimPlayer;
	statistics: TStatistics;

	constructor(_input: TConstructorGameSimPlayerState) {
		const input = parse(VConstructorGameSimPlayerState, _input);

		this.idGameGroup = input.idGameGroup;

		this.player = input.player;

		this.statistics = {
			batting: {
				ab: 0,
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
				runs: 0,
				runsEarned: 0,
				singlesAllowed: 0,
				triplesAllowed: 0,
			},
		};
	}

	public getPitchLocation(_input: TInputGetPitchLocation) {
		const input = parse(VInputGetPitchLocation, _input);
		const fatigueEffect = this._calculateFatigueEffect();

		const numPitchesThrown = this.statistics.pitching.pitchesThrown;
		const pitchName = input.pitchName;
		const playerHitterHeight = input.playerHitter.player.physical.height;
		const pitcherStamina = input.playerPitcher.player.pitching.stamina;

		const fatigueMultiplier = 1 - fatigueEffect.pitching.controlPenalty;
		const velocityMultiplier = 1 - fatigueEffect.pitching.velocityPenalty;

		const getRandomInRange = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		const getBaseReleaseSpeed = () => {
			const staminaFactor =
				1 -
				((numPitchesThrown / PITCHES_THROWN_STANDARD_MAX) *
					(RATING_MAX - pitcherStamina)) /
					RATING_MAX;
			switch (pitchName) {
				case "fastball":
					return getRandomInRange(90, 100) * staminaFactor;
				case "changeup":
					return getRandomInRange(75, 85) * staminaFactor;
				case "curveball":
					return getRandomInRange(70, 80) * staminaFactor;
				case "cutter":
					return getRandomInRange(85, 95) * staminaFactor;
				case "eephus":
					return getRandomInRange(55, 70) * staminaFactor;
				case "forkball":
					return getRandomInRange(75, 85) * staminaFactor;
				case "knuckleball":
					return getRandomInRange(65, 75) * staminaFactor;
				case "knuckleCurve":
					return getRandomInRange(65, 75) * staminaFactor;
				case "screwball":
					return getRandomInRange(70, 80) * staminaFactor;
				case "sinker":
					return getRandomInRange(88, 98) * staminaFactor;
				case "slider":
					return getRandomInRange(80, 90) * staminaFactor;
				case "slurve":
					return getRandomInRange(75, 85) * staminaFactor;
				case "splitter":
					return getRandomInRange(80, 90) * staminaFactor;
				case "sweeper":
					return getRandomInRange(78, 88) * staminaFactor;
				default:
					return getRandomInRange(75, 95) * staminaFactor;
			}
		};

		const getPitchMovement = () => {
			switch (pitchName) {
				case "fastball":
					return {
						pfxX: getRandomInRange(-5, 5),
						pfxZ: getRandomInRange(5, 15),
					};
				case "changeup":
					return {
						pfxX: getRandomInRange(-10, 10),
						pfxZ: getRandomInRange(-5, 5),
					};
				case "curveball":
					return {
						pfxX: getRandomInRange(-15, 15),
						pfxZ: getRandomInRange(-15, -5),
					};
				case "cutter":
					return {
						pfxX: getRandomInRange(-5, 5),
						pfxZ: getRandomInRange(0, 10),
					};
				case "eephus":
					return {
						pfxX: getRandomInRange(-20, 20),
						pfxZ: getRandomInRange(-20, 20),
					};
				case "forkball":
					return {
						pfxX: getRandomInRange(-5, 5),
						pfxZ: getRandomInRange(-15, -5),
					};
				case "knuckleball":
					return {
						pfxX: getRandomInRange(-20, 20),
						pfxZ: getRandomInRange(-20, 20),
					};
				case "knuckleCurve":
					return {
						pfxX: getRandomInRange(-15, 15),
						pfxZ: getRandomInRange(-15, -5),
					};
				case "screwball":
					return {
						pfxX: getRandomInRange(5, 15),
						pfxZ: getRandomInRange(-10, 0),
					};
				case "sinker":
					return {
						pfxX: getRandomInRange(-10, 10),
						pfxZ: getRandomInRange(-10, 0),
					};
				case "slider":
					return {
						pfxX: getRandomInRange(-15, -5),
						pfxZ: getRandomInRange(-5, 5),
					};
				case "slurve":
					return {
						pfxX: getRandomInRange(-15, -5),
						pfxZ: getRandomInRange(-10, 0),
					};
				case "splitter":
					return {
						pfxX: getRandomInRange(-5, 5),
						pfxZ: getRandomInRange(-15, -5),
					};
				case "sweeper":
					return {
						pfxX: getRandomInRange(-20, -10),
						pfxZ: getRandomInRange(-5, 5),
					};
				default:
					return {
						pfxX: getRandomInRange(-10, 10),
						pfxZ: getRandomInRange(-10, 10),
					};
			}
		};

		const releaseSpeed = getBaseReleaseSpeed();
		const { pfxX, pfxZ } = getPitchMovement();

		const szBot = 1.5 + (playerHitterHeight - 500) / 1000;
		const szTop = szBot + 2 + (playerHitterHeight - 500) / 500;

		// x-axis: Runs horizontally from the catcher's left to right (third base to first base).
		// y-axis: Runs from home plate to the pitcher's mound (towards second base).
		// z-axis: Runs vertically, perpendicular to the ground.

		// Positive z: The ball is moving upward
		// Negative z: The ball is moving downward
		// Zero z: The ball is moving purely horizontally

		return {
			// ax, ay, az: Acceleration of the pitch in the x, y, and z directions (ft/sec²)
			// Range: Typically between -50 to 50 ft/sec²
			ax: getRandomInRange(-20, 20),
			ay: getRandomInRange(-40, 0),
			az: getRandomInRange(-20, 50),
			// pfxX, pfxZ: Pitch movement in inches, from the catcher's perspective
			// Range: Usually between -20 to 20 inches
			pfxX,
			pfxZ,
			// plateX, plateZ: Horizontal and vertical position of the pitch as it crosses home plate (ft)
			// plateX range: -2.5 to 2.5 ft (0 is the center of the plate)
			// plateZ range: 0 to 5 ft (height above ground)
			plateX: getRandomInRange(-1.5, 1.5) * fatigueMultiplier,
			plateZ: getRandomInRange(szBot, szTop) * fatigueMultiplier,
			// releaseSpeed: Velocity of the pitch at release (mph)
			// Range: Typically 70 to 105 mph
			releaseSpeed: releaseSpeed * velocityMultiplier,
			// releasePosX, releasePosY, releasePosZ: Position of the ball at release (ft)
			// Range: Varies based on pitcher's release point, but typically:
			// X: -3 to 3 ft
			// Y: 50 to 55 ft (distance from home plate)
			// Z: 5 to 7 ft (height)
			releasePosX:
				getRandomInRange(-2, 2) *
				(1 + fatigueEffect.pitching.controlPenalty * 0.5),
			releasePosY: getRandomInRange(50, 55),
			releasePosZ:
				getRandomInRange(5, 7) *
				(1 + fatigueEffect.pitching.controlPenalty * 0.5),
			// szBot, szTop: Bottom and top of the strike zone for the batter (ft)
			// Range: Typically between 1.5 to 4 ft, varies by batter
			szBot,
			szTop,
			// vx0, vy0, vz0: Initial velocity components of the pitch (ft/sec)
			// Range: Depends on pitch speed and direction, but typically:
			// vx0: -20 to 20 ft/sec
			// vy0: -150 to -110 ft/sec (negative because y-axis points towards batter)
			// vz0: -10 to 10 ft/sec
			vx0: getRandomInRange(-10, 10),
			vy0: -releaseSpeed * 1.467,
			vz0: getRandomInRange(-5, 10),
		};
	}

	public choosePitch(_input: TInputChoosePitch) {
		const input = parse(VInputChoosePitch, _input);
		const { numBalls, numOuts, numStrikes } = input;
		const numPitchesThrown = this.statistics.pitching.pitchesThrown;
		const pitcherStamina = this.player.pitching.stamina;
		const pitches = this.player.pitches;
		const fatigueCurrent = this.fatigue.current;

		// Only consider pitches the pitcher knows (rating > RATING_MIN)
		const availablePitches = Object.entries(pitches).filter(
			([, rating]) => rating > RATING_MIN,
		) as [keyof typeof pitches, number][];

		// Emergency random pitch for edge cases (0.1% chance)
		if (Math.random() > 0.999) {
			return Object.keys(pitches)[
				Math.floor(Math.random() * Object.keys(pitches).length)
			] as keyof typeof pitches;
		}

		// Calculate fatigue penalties
		const fatiguePercentage = fatigueCurrent / FATIGUE_MAX;
		const staminaPercentage = Math.max(
			0,
			1 - numPitchesThrown / (pitcherStamina * 0.7),
		);

		const weightedPitches = availablePitches.map(([pitch, rating]) => {
			let weight = rating;

			// Base pitch type fatigue consideration
			const fatigueCost = PITCH_TYPE_FATIGUE_MULTIPLIERS[pitch] || 1;

			// Reduce weight of high-fatigue pitches when tired
			const fatigueMultiplier = 1 - fatiguePercentage * (fatigueCost - 0.7);
			weight *= fatigueMultiplier;

			// Game situation adjustments
			if (numStrikes === 2) {
				// Strikeout situation - favor breaking balls
				switch (pitch) {
					case "slider":
					case "curveball":
					case "splitter":
						weight *= 1.3;
						break;
				}
			}

			if (numBalls === 3) {
				// Must-throw strike situation - favor control pitches
				switch (pitch) {
					case "fastball":
					case "sinker":
					case "changeup":
						weight *= 1.4;
						break;
					case "knuckleball":
					case "eephus":
						weight *= 0.5; // Too risky in full count
						break;
				}
			}

			// Adjust weight based on stamina/fatigue combination
			if (["fastball", "sinker", "cutter"].includes(pitch)) {
				// Power pitches become less appealing as stamina/fatigue worsen
				weight *= staminaPercentage;

				// Further reduce weight in high-fatigue situations
				if (fatiguePercentage > 0.7) {
					weight *= 0.7;
				}
			} else {
				// Off-speed and breaking pitches become more appealing when tired
				weight *= 1 + (1 - staminaPercentage) * 0.5;
			}

			// Pitcher tendency adjustments based on current fatigue
			if (fatiguePercentage > 0.8) {
				// Very tired - strongly favor low-effort pitches
				switch (pitch) {
					case "changeup":
					case "eephus":
					case "knuckleball":
						weight *= 1.4;
						break;
					case "fastball":
					case "sinker":
						weight *= 0.6;
						break;
				}
			} else if (fatiguePercentage > 0.6) {
				// Moderately tired - start mixing in more off-speed
				switch (pitch) {
					case "changeup":
					case "curveball":
					case "slider":
						weight *= 1.2;
						break;
				}
			}

			// Critical situation adjustments
			if (numOuts === 2 && (numBalls === 3 || numStrikes === 2)) {
				// High-leverage situation - favor pitcher's best pitches despite fatigue
				weight *=
					(rating / Math.max(...availablePitches.map(([, r]) => r))) * 1.3;
			}

			return { pitch, weight };
		});

		// Sort pitches by weight in descending order
		weightedPitches.sort((a, b) => b.weight - a.weight);

		// If severely tired or in a crucial situation, rely more on best available pitch
		if (
			fatiguePercentage > 0.9 ||
			(numOuts === 2 && numBalls === 3 && numStrikes === 2)
		) {
			return weightedPitches[0].pitch;
		}

		// Otherwise, use weighted random selection
		const totalWeight = weightedPitches.reduce(
			(sum, { weight }) => sum + weight,
			0,
		);
		let randomValue = Math.random() * totalWeight;

		for (const { pitch, weight } of weightedPitches) {
			randomValue -= weight;
			if (randomValue <= 0) {
				return pitch;
			}
		}

		// Fallback to the highest weighted pitch (should never reach here)
		return weightedPitches[0].pitch;
	}

	public close() {
		if (this.idGameGroup) {
			const db = new Database(DB_PATH, {
				strict: true,
			});
			const queryStatisticsBatting = db.query(/*sql*/ `
			insert into statisticsPlayerGameGroupBatting
			(
				ab, doubles, h, hr, idGameGroup, idPlayer, idTeam, 
				k, lob, outs, rbi, runs, singles, triples
			)
			values (
				$ab, $doubles, $h, $hr, $idGameGroup, $idPlayer, $idTeam,
				$k, $lob, $outs, $rbi, $runs, $singles, $triples
			)
			on conflict (idGameGroup, idPlayer, idTeam) do update set
				ab = statisticsPlayerGameGroupBatting.ab + $ab,
				doubles = statisticsPlayerGameGroupBatting.doubles + $doubles,
				h = statisticsPlayerGameGroupBatting.h + $h,
				hr = statisticsPlayerGameGroupBatting.hr + $hr,
				k = statisticsPlayerGameGroupBatting.k + $k,
				lob = statisticsPlayerGameGroupBatting.lob + $lob,
				outs = statisticsPlayerGameGroupBatting.outs + $outs,
				rbi = statisticsPlayerGameGroupBatting.rbi + $rbi,
				runs = statisticsPlayerGameGroupBatting.runs + $runs,
				singles = statisticsPlayerGameGroupBatting.singles + $singles,
				triples = statisticsPlayerGameGroupBatting.triples + $triples
		`);

			queryStatisticsBatting.run({
				ab: this.statistics.batting.ab,
				doubles: this.statistics.batting.doubles,
				h: this.statistics.batting.h,
				hr: this.statistics.batting.hr,
				idGameGroup: this.idGameGroup,
				idPlayer: this.player.idPlayer,
				idTeam: this.player.idTeam,
				k: this.statistics.batting.k,
				lob: this.statistics.batting.lob,
				outs: this.statistics.batting.outs,
				rbi: this.statistics.batting.rbi,
				runs: this.statistics.batting.runs,
				singles: this.statistics.batting.singles,
				triples: this.statistics.batting.triples,
			});

			const queryStatisticsPitching = db.query(/*sql*/ `
			insert into statisticsPlayerGameGroupPitching
			(
				battersFaced, bb, doublesAllowed, hitsAllowed, hrsAllowed, idGameGroup, idPlayer, idTeam,
				k, lob, outs, pitchesThrown, pitchesThrownBalls, pitchesThrownInPlay, pitchesThrownStrikes,
				runs, runsEarned, singlesAllowed, triplesAllowed
			)
			values (
				$battersFaced, $bb, $doublesAllowed, $hitsAllowed, $hrsAllowed, $idGameGroup, $idPlayer, $idTeam,
				$k, $lob, $outs, $pitchesThrown, $pitchesThrownBalls, $pitchesThrownInPlay, $pitchesThrownStrikes,
				$runs, $runsEarned, $singlesAllowed, $triplesAllowed
			)
			on conflict (idGameGroup, idPlayer, idTeam) do update set
				battersFaced = statisticsPlayerGameGroupPitching.battersFaced + $battersFaced,
				bb = statisticsPlayerGameGroupPitching.bb + $bb,
				doublesAllowed = statisticsPlayerGameGroupPitching.doublesAllowed + $doublesAllowed,
				hitsAllowed = statisticsPlayerGameGroupPitching.hitsAllowed + $hitsAllowed,
				hrsAllowed = statisticsPlayerGameGroupPitching.hrsAllowed + $hrsAllowed,
				k = statisticsPlayerGameGroupPitching.k + $k,
				lob = statisticsPlayerGameGroupPitching.lob + $lob,
				outs = statisticsPlayerGameGroupPitching.outs + $outs,
				pitchesThrown = statisticsPlayerGameGroupPitching.pitchesThrown + $pitchesThrown,
				pitchesThrownBalls = statisticsPlayerGameGroupPitching.pitchesThrownBalls + $pitchesThrownBalls,
				pitchesThrownInPlay = statisticsPlayerGameGroupPitching.pitchesThrownInPlay + $pitchesThrownInPlay,
				pitchesThrownStrikes = statisticsPlayerGameGroupPitching.pitchesThrownStrikes + $pitchesThrownStrikes,
				runs = statisticsPlayerGameGroupPitching.runs + $runs,
				runsEarned = statisticsPlayerGameGroupPitching.runsEarned + $runsEarned,
				singlesAllowed = statisticsPlayerGameGroupPitching.singlesAllowed + $singlesAllowed,
				triplesAllowed = statisticsPlayerGameGroupPitching.triplesAllowed + $triplesAllowed
		`);

			queryStatisticsPitching.run({
				battersFaced: this.statistics.pitching.battersFaced,
				bb: this.statistics.pitching.bb,
				doublesAllowed: this.statistics.pitching.doublesAllowed,
				hitsAllowed: this.statistics.pitching.hitsAllowed,
				hrsAllowed: this.statistics.pitching.hrsAllowed,
				idGameGroup: this.idGameGroup,
				idPlayer: this.player.idPlayer,
				idTeam: this.player.idTeam,
				k: this.statistics.pitching.k,
				lob: this.statistics.pitching.lob,
				outs: this.statistics.pitching.outs,
				pitchesThrown: this.statistics.pitching.pitchesThrown,
				pitchesThrownBalls: this.statistics.pitching.pitchesThrownBalls,
				pitchesThrownInPlay: this.statistics.pitching.pitchesThrownInPlay,
				pitchesThrownStrikes: this.statistics.pitching.pitchesThrownStrikes,
				runs: this.statistics.pitching.runs,
				runsEarned: this.statistics.pitching.runsEarned,
				singlesAllowed: this.statistics.pitching.singlesAllowed,
				triplesAllowed: this.statistics.pitching.triplesAllowed,
			});

			db.close();
		}
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
				const { playerHitter, playerPitcher } = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.ab++;
				}

				break;
			}
			case "double": {
				const { playerHitter, playerPitcher } = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.h++;
					this.statistics.batting.doubles++;
				}

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.hitsAllowed++;
					this.statistics.pitching.doublesAllowed++;
				}

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
				const { playerHitter, playerPitcher } = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.h++;
					this.statistics.batting.hr++;
				}

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.hitsAllowed++;
					this.statistics.pitching.hrsAllowed++;
				}

				break;
			}
			case "out": {
				const {
					playerHitter,
					playerPitcher,
					playerRunner1,
					playerRunner2,
					playerRunner3,
				} = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.outs++;
					if (playerRunner1) {
						this.statistics.batting.lob++;
					}

					if (playerRunner2) {
						this.statistics.batting.lob++;
					}

					if (playerRunner3) {
						this.statistics.batting.lob++;
					}
				}

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.outs++;

					if (playerRunner1) {
						this.statistics.pitching.lob++;
					}

					if (playerRunner2) {
						this.statistics.pitching.lob++;
					}

					if (playerRunner3) {
						this.statistics.pitching.lob++;
					}
				}

				break;
			}
			case "pitch": {
				const { playerPitcher, pitchOutcome } = input.data;

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.pitchesThrown++;

					switch (pitchOutcome) {
						case "ball": {
							this.statistics.pitching.pitchesThrownBalls++;
							break;
						}
						case "inPlay": {
							this.statistics.pitching.pitchesThrownInPlay++;
							break;
						}
						case "strike": {
							this.statistics.pitching.pitchesThrownStrikes++;
							break;
						}
						default: {
							const exhaustiveCheck: never = pitchOutcome;
							throw new Error(exhaustiveCheck);
						}
					}
				}

				break;
			}
			case "run": {
				const { playerHitter, playerPitcher, playerRunner } = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.rbi++;
				}

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.runs++;
					this.statistics.pitching.runsEarned++;
				}

				if (playerRunner.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.runs++;
				}

				break;
			}

			case "single": {
				const { playerHitter, playerPitcher } = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.h++;
					this.statistics.batting.singles++;
				}

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.hitsAllowed++;
					this.statistics.pitching.singlesAllowed++;
				}

				break;
			}

			case "strikeout": {
				const { playerHitter, playerPitcher } = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.k++;
				}

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.k++;
				}

				break;
			}

			case "triple": {
				const { playerHitter, playerPitcher } = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.h++;
					this.statistics.batting.triples++;
				}

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.hitsAllowed++;
					this.statistics.pitching.triplesAllowed++;
				}

				break;
			}

			case "walk": {
				const { playerHitter, playerPitcher } = input.data;

				if (playerHitter.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.bb++;
				}

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.bb++;
				}

				break;
			}

			default: {
				const exhaustiveCheck: never = gameSimEvent;
				throw new Error(exhaustiveCheck);
			}
		}
	}

	private _addFatigue(_input: TInputAddFatigue) {
		const input = parse(VInputAddFatigue, _input);
		this.fatigue.accumulator += input.amount;

		// Apply accumulated fatigue when it reaches a threshold
		if (this.fatigue.accumulator >= 1) {
			const fatigueToAdd = Math.floor(this.fatigue.accumulator);
			this.fatigue.current = Math.min(
				FATIGUE_MAX,
				this.fatigue.current + fatigueToAdd,
			);
			this.fatigue.accumulator -= fatigueToAdd;
		}
	}

	private _calculateFatigueEffect() {
		const fatiguePercentage = this.fatigue.current / FATIGUE_MAX;

		return {
			batting: {
				contactPenalty: fatiguePercentage * 0.15, // 15% max penalty
				powerPenalty: fatiguePercentage * 0.2, // 20% max penalty
				eyePenalty: fatiguePercentage * 0.1, // 10% max penalty
				speedPenalty: fatiguePercentage * 0.25, // 25% max penalty
			},
			pitching: {
				controlPenalty: fatiguePercentage * 0.2, // 20% max penalty
				movementPenalty: fatiguePercentage * 0.15, // 15% max penalty
				velocityPenalty: fatiguePercentage * 0.25, // 25% max penalty
				commandPenalty: fatiguePercentage * 0.2, // 20% max penalty
			},
		};
	}
}

export default GameSimPlayerState;

const VInputAddFatigue = object({
	amount: number(),
});
type TInputAddFatigue = InferInput<typeof VInputAddFatigue>;

const VInputGetPitchLocation = object({
	pitchName: VPicklistPitchNames,
	playerHitter: instance(GameSimPlayerState),
	playerPitcher: instance(GameSimPlayerState),
});
type TInputGetPitchLocation = InferInput<typeof VInputGetPitchLocation>;

const VInputChoosePitch = object({
	numBalls: number(),
	numOuts: number(),
	numStrikes: number(),
});
type TInputChoosePitch = InferInput<typeof VInputChoosePitch>;
