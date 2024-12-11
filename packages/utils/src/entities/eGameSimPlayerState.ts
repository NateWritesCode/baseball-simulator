import {
	type InferInput,
	instance,
	nullable,
	number,
	object,
	parse,
} from "valibot";
import { FATIGUE_MAX, FATIGUE_MIN, RATING_MAX, RATING_MIN } from "../constants";
import { handleValibotParse } from "../functions";
import {
	type OGameSimObserver,
	type TGameSimBattingStatistics,
	type TGameSimEvent,
	type TGameSimPitchingStatistics,
	VGameSimEvent,
} from "../types/tGameSim";
import {
	type TConstructorGameSimPlayer,
	VConstructorGameSimPlayer,
} from "../types/tGameSimConstructors";
import {
	type TPicklistPitchNames,
	VPicklistPitchNames,
} from "../types/tPicklist";
import GameSimUmpireState from "./eGameSimUmpireState";

const PITCHES_THROWN_STANDARD_MAX = 125;

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

export const WEIGHTS_CHOOSE_PITCH = {
	batter: {
		contact: 0.15, // Critical - affects likelihood of making contact
		eye: 0.12, // Important - determines ability to lay off bad pitches
		power: 0.08, // Influences pitch location and type selection
		avoidKs: 0.05, // Minor factor in approach
	},
	context: {
		runnersOnBase: 0.2, // Very important - changes entire pitching strategy
	},
	pitcher: {
		pitchRatings: 0.2, // Most important - actual pitch quality
		pitcherRatings: 0.1, // General pitching ability
		fatigue: 0.06, // Affects pitch selection as game progresses
		intelligence: 0.03, // Minor influence on pitch sequencing
		wisdom: 0.01, // Smallest factor - general game awareness
	},
} as const;

type TFatigue = {
	accumulator: number;
	current: number;
};

type TStatistics = {
	batting: TGameSimBattingStatistics;
	pitching: TGameSimPitchingStatistics;
};

const VConstructorGameSimPlayerState = object({
	idGameGroup: nullable(number()),
	player: VConstructorGameSimPlayer,
});
type TConstructorGameSimPlayerState = InferInput<
	typeof VConstructorGameSimPlayerState
>;

function randomNormal(): number {
	let u = 0;
	let v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const PITCH_MOVEMENT_PROFILES: Record<
	string,
	{
		horizontalRange: [number, number];
		verticalRange: [number, number];
		spinRange: [number, number];
	}
> = {
	fastball: {
		horizontalRange: [-2, 2],
		verticalRange: [8, 12],
		spinRange: [1800, 2200],
	},
	sinker: {
		horizontalRange: [-8, -4],
		verticalRange: [-4, -1],
		spinRange: [1700, 2000],
	},
	cutter: {
		horizontalRange: [1, 4],
		verticalRange: [3, 7],
		spinRange: [2200, 2500],
	},
	slider: {
		horizontalRange: [2, 6],
		verticalRange: [-1, 2],
		spinRange: [2300, 2600],
	},
	curveball: {
		horizontalRange: [-6, 6],
		verticalRange: [-12, -8],
		spinRange: [2400, 2800],
	},
	changeup: {
		horizontalRange: [-10, -6],
		verticalRange: [-8, -4],
		spinRange: [1600, 1900],
	},
	splitter: {
		horizontalRange: [-4, 0],
		verticalRange: [-12, -8],
		spinRange: [1400, 1700],
	},
	sweeper: {
		horizontalRange: [12, 18],
		verticalRange: [-4, 0],
		spinRange: [2500, 2800],
	},
	slurve: {
		horizontalRange: [8, 14],
		verticalRange: [-8, -4],
		spinRange: [2300, 2600],
	},
	screwball: {
		horizontalRange: [-12, -8],
		verticalRange: [-4, 0],
		spinRange: [1900, 2200],
	},
	forkball: {
		horizontalRange: [-2, 2],
		verticalRange: [-14, -10],
		spinRange: [1300, 1600],
	},
	knuckleball: {
		horizontalRange: [-10, 10],
		verticalRange: [-5, 5],
		spinRange: [900, 1200],
	},
	knuckleCurve: {
		horizontalRange: [-8, 8],
		verticalRange: [-10, -6],
		spinRange: [2100, 2400],
	},
	eephus: {
		horizontalRange: [-4, 4],
		verticalRange: [-20, -15],
		spinRange: [1100, 1400],
	},
};

const PITCH_TARGETS: Record<
	string,
	(szMid: number) => {
		targetX: number;
		targetZ: number;
		randomness: number;
	}
> = {
	fastball: (szMid) => ({
		targetX: 0,
		targetZ: szMid + (Math.random() > 0.5 ? 0.2 : -0.2),
		randomness: Math.random() > 0.7 ? 0.2 : 0,
	}),
	sinker: (szMid) => ({
		targetX: -0.2,
		targetZ: szMid - 0.25,
		randomness: 0,
	}),
	cutter: (szMid) => ({
		targetX: 0.3,
		targetZ: szMid + 0.1,
		randomness: 0,
	}),
	slider: (szMid) => ({
		targetX: 0.3,
		targetZ: szMid - 0.1,
		randomness: 0,
	}),
	curveball: (szMid) => ({
		targetX: Math.random() > 0.5 ? 0.2 : -0.2,
		targetZ: szMid - 0.3,
		randomness: 0,
	}),
	changeup: (szMid) => ({
		targetX: Math.random() > 0.5 ? 0.2 : -0.2,
		targetZ: szMid - 0.2,
		randomness: 0,
	}),
	splitter: (szMid) => ({
		targetX: Math.random() > 0.5 ? 0.1 : -0.1,
		targetZ: szMid - 0.35,
		randomness: 0,
	}),
	sweeper: (szMid) => ({
		targetX: 0.35,
		targetZ: szMid - 0.15,
		randomness: 0,
	}),
	slurve: (szMid) => ({
		targetX: 0.25,
		targetZ: szMid - 0.2,
		randomness: 0,
	}),
	screwball: (szMid) => ({
		targetX: -0.3,
		targetZ: szMid + 0.1,
		randomness: 0,
	}),
	forkball: (szMid) => ({
		targetX: 0,
		targetZ: szMid - 0.4,
		randomness: 0,
	}),
	knuckleball: (szMid) => ({
		targetX: (Math.random() - 0.5) * 0.4,
		targetZ: szMid + (Math.random() - 0.5) * 0.4,
		randomness: 0,
	}),
	knuckleCurve: (szMid) => ({
		targetX: Math.random() > 0.5 ? 0.25 : -0.25,
		targetZ: szMid - 0.25,
		randomness: 0,
	}),
	eephus: (szMid) => ({
		targetX: Math.random() > 0.5 ? 0.3 : -0.3,
		targetZ: szMid + 0.3,
		randomness: 0,
	}),
};

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
				doubles: 0,
				h: 0,
				hr: 0,
				k: 0,
				lob: 0,
				outs: 0,
				rbi: 0,
				runs: 0,
				sb: 0,
				singles: 0,
				triples: 0,
			},
			pitching: {
				balks: 0,
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

		// Extract relevant values
		const playerHitterHeight = input.playerHitter.player.physical.height;
		const pitchName = input.pitchName;

		// Calculate fatigue multipliers
		const fatigueMultiplier = 1 - fatigueEffect.pitching.controlPenalty;
		const velocityMultiplier = 1 - fatigueEffect.pitching.velocityPenalty;
		const movementMultiplier = 1 - fatigueEffect.pitching.movementPenalty;

		// Calculate release parameters with fatigue influence
		const releasePosX =
			this._getRandomInRange(-1.5, 1.5) *
			(1 + fatigueEffect.pitching.controlPenalty * 0.25);
		const releasePosY = this._getRandomInRange(52.5, 54);
		const releasePosZ =
			this._getRandomInRange(5, 6) *
			(1 + fatigueEffect.pitching.controlPenalty * 0.25);

		// Calculate strike zone
		const szBot = 1.5 + (playerHitterHeight - 500) / 1000;
		const szTop = szBot + 2 + (playerHitterHeight - 500) / 500;
		const szMid = (szTop + szBot) / 2;

		// Get target location based on pitch type
		const pitchTarget =
			PITCH_TARGETS[pitchName]?.(szMid) || PITCH_TARGETS.fastball(szMid);
		const targetX = pitchTarget.targetX;
		const targetZ = pitchTarget.targetZ;

		// Calculate pitcher control effect
		const controlRating = this.player.pitching.control / RATING_MAX;
		const standardDeviation =
			(0.3 + (1 - controlRating) * 0.4) * fatigueMultiplier;

		// Add controlled randomness to target location
		const actualX = targetX + this._randomNormal() * standardDeviation;
		const actualZ = targetZ + this._randomNormal() * standardDeviation;

		// Limit extreme misses
		const maxMiss = 1.2;
		const clampedX = Math.max(-maxMiss, Math.min(maxMiss, actualX));
		const clampedZ = Math.max(szBot * 0.8, Math.min(szTop * 1.2, actualZ));

		// Calculate movement profile
		const movement = this._getMovementProfile(
			pitchName,
			this.player.pitching.stuff / RATING_MAX,
			this.player.pitching.movement / RATING_MAX,
			movementMultiplier,
		);

		// Calculate final location based on movement
		const distanceToPlate = 60.5 - releasePosY;
		const timeToPlate =
			distanceToPlate / (this._getPitchVelocity(pitchName) * 1.467);

		const movementEffect = {
			x: (movement.horizontalBreak / 12) * timeToPlate * timeToPlate,
			z: (movement.verticalBreak / 12) * timeToPlate * timeToPlate,
		};

		// Calculate final plate location
		const plateX = clampedX + movementEffect.x;
		const plateZ = clampedZ + movementEffect.z;

		return {
			ax: -movement.horizontalBreak * 2,
			ay: this._getRandomInRange(-40, 0),
			az: -movement.verticalBreak * 2,
			pfxX: movement.horizontalBreak,
			pfxZ: movement.verticalBreak,
			plateX,
			plateZ,
			releaseSpeed: this._getPitchVelocity(pitchName) * velocityMultiplier,
			releasePosX,
			releasePosY,
			releasePosZ,
			spinRate: movement.spinRate,
			szBot,
			szTop,
			vx0: movement.horizontalBreak * 0.4,
			vy0: -this._getPitchVelocity(pitchName) * 1.467 * velocityMultiplier,
			vz0: movement.verticalBreak * 0.4,
		};
	}

	private _getMovementProfile(
		pitchName: string,
		stuffRating: number,
		movementRating: number,
		movementMultiplier: number,
	) {
		const profile =
			PITCH_MOVEMENT_PROFILES[pitchName] || PITCH_MOVEMENT_PROFILES.fastball;

		// Calculate effectiveness factors
		const stuffFactor = 0.3 + stuffRating * 1.4;
		const movementFactor = 0.3 + movementRating * 1.4;
		const effectiveFactor = stuffFactor * movementFactor * movementMultiplier;

		// Special case for knuckleball
		const isKnuckleball = pitchName === "knuckleball";
		const actualFactor = isKnuckleball ? 1.2 : effectiveFactor;

		// Calculate spin rate
		const spinRange = profile.spinRange[1] - profile.spinRange[0];
		const stuffImpact = stuffRating * spinRange * 0.4;
		const spinMin = profile.spinRange[0] + (isKnuckleball ? 0 : stuffImpact);
		const spinMax = profile.spinRange[1] + (isKnuckleball ? 0 : stuffImpact);

		return {
			horizontalBreak:
				this._getRandomInRange(
					profile.horizontalRange[0],
					profile.horizontalRange[1],
				) * actualFactor,
			verticalBreak:
				this._getRandomInRange(
					profile.verticalRange[0],
					profile.verticalRange[1],
				) * actualFactor,
			spinRate: this._getRandomInRange(spinMin, spinMax),
		};
	}

	public choosePitch(_input: TInputChoosePitch) {
		const pitchName: TPicklistPitchNames = "fastball";
		const {
			numBalls,
			numOuts,
			numStrikes,
			playerHitter,
			playerRunner1,
			playerRunner2,
			playerRunner3,
		} = parse(VInputChoosePitch, _input);
		const pitches = this.player.pitches;

		const availablePitches = Object.entries(pitches).filter(
			([, rating]) => rating > RATING_MIN,
		) as [keyof typeof pitches, number][];

		const weightedPitches = availablePitches.map(([pitch, rating]) => {
			const scorePitcher =
				(rating * 0.6 +
					this.player.pitching.stuff * 0.15 +
					this.player.pitching.control * 0.15 +
					this.player.pitching.movement * 0.1) /
				RATING_MAX;

			const scoreBatter =
				((RATING_MAX - playerHitter.player.batting.contact) * 0.3 +
					(RATING_MAX - playerHitter.player.batting.eye) * 0.3 +
					(RATING_MAX - playerHitter.player.batting.power) * 0.2 +
					(RATING_MAX - playerHitter.player.batting.avoidKs) * 0.2) /
				RATING_MAX;

			const scoreContext = (() => {
				let score = 500; // Base score

				// Ball/Strike count influence with pitch type considerations
				if (numBalls === 3) {
					score += pitch === "fastball" ? 200 : 0; // Need a strike, favor fastball
				}
				if (numStrikes === 2) {
					score += pitch === "slider" || pitch === "curveball" ? 150 : 0; // Can waste a pitch, favor breaking balls
				}
				if (numBalls === 0 && numStrikes === 0) {
					score += pitch === "fastball" ? 100 : 0; // First pitch, favor fastball
				}

				// Outs situation with pitch type considerations
				if (numOuts === 2) {
					score += pitch === "slider" || pitch === "curveball" ? 100 : 0; // Two outs, can be more aggressive with breaking balls
				}

				// Runners on base with pitch type considerations
				const hasRunnerOnFirst = !!playerRunner1;
				const hasRunnerOnSecond = !!playerRunner2;
				const hasRunnerOnThird = !!playerRunner3;

				if (hasRunnerOnThird) {
					score += pitch === "fastball" ? 100 : -100; // Need control, favor fastball
				}
				if (hasRunnerOnFirst) {
					score += pitch === "fastball" ? 100 : -50; // May need quick delivery, favor fastball
				}
				if (hasRunnerOnSecond || hasRunnerOnThird) {
					score += pitch === "fastball" ? 50 : -50; // RISP, favor control with fastball
				}

				return score / RATING_MAX;
			})();

			const scoreFatigue = (() => {
				const fatiguePercentage = this.fatigue.current / FATIGUE_MAX;
				const pitchesThrown = this.statistics.pitching.pitchesThrown;
				const staminaRating = this.player.pitching.stamina;
				let score = 500; // Base score

				// Heavy fatigue penalty above 80%
				if (fatiguePercentage > 0.8) {
					score -= 300;
				} else if (fatiguePercentage > 0.6) {
					score -= 150;
				}

				// Consider pitch type fatigue impact
				const pitchFatigueCost = PITCH_TYPE_FATIGUE_MULTIPLIERS[pitch] || 1;
				score -= pitchFatigueCost * 100;

				// Stamina influence
				const staminaPercentage = Math.max(
					0,
					1 - pitchesThrown / (staminaRating * 0.7),
				);
				score *= staminaPercentage;

				// Favor less taxing pitches when tired
				if (fatiguePercentage > 0.7) {
					if (
						pitch === "changeup" ||
						pitch === "knuckleball" ||
						pitch === "eephus"
					) {
						score += 200;
					}
					if (pitch === "fastball" || pitch === "sinker") {
						score -= 200;
					}
				}

				return score / RATING_MAX;
			})();

			// Calculate final weighted score using WEIGHTS_CHOOSE_PITCH
			const finalScore =
				scorePitcher * WEIGHTS_CHOOSE_PITCH.pitcher.pitchRatings +
				scoreBatter *
					(WEIGHTS_CHOOSE_PITCH.batter.contact +
						WEIGHTS_CHOOSE_PITCH.batter.eye +
						WEIGHTS_CHOOSE_PITCH.batter.power +
						WEIGHTS_CHOOSE_PITCH.batter.avoidKs) +
				scoreContext * WEIGHTS_CHOOSE_PITCH.context.runnersOnBase +
				scoreFatigue * WEIGHTS_CHOOSE_PITCH.pitcher.fatigue;

			return {
				pitch,
				score: finalScore,
			};
		});

		// Sort pitches by score
		weightedPitches.sort((a, b) => b.score - a.score);

		// Use weighted random selection
		const totalScore = weightedPitches.reduce((sum, p) => sum + p.score, 0);
		let randomValue = Math.random() * totalScore;

		for (const weightedPitch of weightedPitches) {
			randomValue -= weightedPitch.score;
			if (randomValue <= 0) {
				return {
					pitchName: weightedPitch.pitch,
				};
			}
		}

		// Fallback to highest scored pitch if random selection fails
		return {
			pitchName: weightedPitches[0].pitch,
		};
	}

	private _getRandomInRange(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	private _randomNormal(): number {
		let u = 0;
		let v = 0;
		while (u === 0) u = Math.random();
		while (v === 0) v = Math.random();
		return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	}

	public close() {
		return {
			batting: {
				ab: this.statistics.batting.ab,
				doubles: this.statistics.batting.doubles,
				h: this.statistics.batting.h,
				hr: this.statistics.batting.hr,
				k: this.statistics.batting.k,
				lob: this.statistics.batting.lob,
				outs: this.statistics.batting.outs,
				rbi: this.statistics.batting.rbi,
				runs: this.statistics.batting.runs,
				sb: this.statistics.batting.sb,
				singles: this.statistics.batting.singles,
				triples: this.statistics.batting.triples,
			},
			idGameGroup: this.idGameGroup,
			idPlayer: this.player.idPlayer,
			idTeam: this.player.idTeam,
			pitching: {
				balks: this.statistics.pitching.balks,
				battersFaced: this.statistics.pitching.battersFaced,
				bb: this.statistics.pitching.bb,
				doublesAllowed: this.statistics.pitching.doublesAllowed,
				hitsAllowed: this.statistics.pitching.hitsAllowed,
				hrsAllowed: this.statistics.pitching.hrsAllowed,
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
			},
		};
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
			case "balk": {
				const { playerPitcher } = input.data;

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.balks++;
				}

				break;
			}
			case "ball": {
				break;
			}
			case "catcherInterference": {
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
			case "hitByPitch": {
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
				const { playerPitcher, pitchName, pitchOutcome } = input.data;

				if (playerPitcher.player.idPlayer === this.player.idPlayer) {
					this.statistics.pitching.pitchesThrown++;

					// Add base fatigue for throwing a pitch
					const pitchFatigue = BASE_FATIGUE.PITCH;

					// Multiply by pitch-specific fatigue multiplier
					const pitchMultiplier =
						PITCH_TYPE_FATIGUE_MULTIPLIERS[pitchName] || 1;

					// Add fatigue based on pitch type and situation
					this._addFatigue({
						amount: pitchFatigue * pitchMultiplier,
					});

					switch (pitchOutcome) {
						case "ball": {
							this.statistics.pitching.pitchesThrownBalls++;
							break;
						}
						case "catcherInterference": {
							break;
						}
						case "hitByPitch": {
							break;
						}
						case "inPlay": {
							this.statistics.pitching.pitchesThrownInPlay++;
							break;
						}
						case "strikeCalled": {
							this.statistics.pitching.pitchesThrownStrikes++;
							break;
						}
						case "strikeSwinging": {
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
			case "steal": {
				const { playerRunner } = input.data;

				if (playerRunner.player.idPlayer === this.player.idPlayer) {
					this.statistics.batting.sb++;
				}

				break;
			}
			case "stealAttempt": {
				break;
			}
			case "stealCaught": {
				break;
			}

			case "strikeCalled": {
				break;
			}
			case "strikeSwinging": {
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
				const { playerPitcher } = input.data;

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

	private _getPitchVelocity(pitchName: TPicklistPitchNames): number {
		const staminaFactor =
			1 -
			((this.statistics.pitching.pitchesThrown / PITCHES_THROWN_STANDARD_MAX) *
				(RATING_MAX - this.player.pitching.stamina)) /
				RATING_MAX;
		const stuffFactor = 0.9 + (this.player.pitching.stuff / RATING_MAX) * 0.2;

		const getRandomInRange = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		switch (pitchName) {
			case "fastball":
				return getRandomInRange(92, 102) * staminaFactor * stuffFactor;
			case "sinker":
				return getRandomInRange(90, 96) * staminaFactor * stuffFactor;
			case "cutter":
				return getRandomInRange(86, 94) * staminaFactor * stuffFactor;
			case "slider":
				return getRandomInRange(82, 88) * staminaFactor * stuffFactor;
			case "changeup":
				return getRandomInRange(78, 86) * staminaFactor * stuffFactor;
			case "curveball":
				return getRandomInRange(76, 84) * staminaFactor * stuffFactor;
			case "splitter":
				return getRandomInRange(82, 88) * staminaFactor * stuffFactor;
			case "sweeper":
				return getRandomInRange(78, 84) * staminaFactor * stuffFactor;
			case "slurve":
				return getRandomInRange(78, 84) * staminaFactor * stuffFactor;
			case "screwball":
				return getRandomInRange(78, 84) * staminaFactor * stuffFactor;
			case "forkball":
				return getRandomInRange(80, 86) * staminaFactor * stuffFactor;
			case "knuckleball":
				return getRandomInRange(65, 75) * staminaFactor; // Knuckleball less affected by stuff
			case "knuckleCurve":
				return getRandomInRange(72, 78) * staminaFactor * stuffFactor;
			case "eephus":
				return getRandomInRange(55, 65) * staminaFactor; // Eephus also less affected by stuff
			default: {
				const exhaustiveCheck: never = pitchName;
				throw new Error(`Unhandled pitch type: ${exhaustiveCheck}`);
			}
		}
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
	playerHitter: instance(GameSimPlayerState),
	playerRunner1: nullable(instance(GameSimPlayerState)),
	playerRunner2: nullable(instance(GameSimPlayerState)),
	playerRunner3: nullable(instance(GameSimPlayerState)),
	umpireHp: instance(GameSimUmpireState),
});
type TInputChoosePitch = InferInput<typeof VInputChoosePitch>;
