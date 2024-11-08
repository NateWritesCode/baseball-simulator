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
		const movementMultiplier = 1 - fatigueEffect.pitching.movementPenalty;

		const getRandomInRange = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		// Calculate release parameters
		const releasePosX =
			getRandomInRange(-1.5, 1.5) *
			(1 + fatigueEffect.pitching.controlPenalty * 0.25);
		const releasePosY = getRandomInRange(52.5, 54);
		const releasePosZ =
			getRandomInRange(5, 6) *
			(1 + fatigueEffect.pitching.controlPenalty * 0.25);

		// Get movement profile based on pitch type
		const getMovementProfile = () => {
			const stuffFactor = 0.8 + (this.player.pitching.stuff / RATING_MAX) * 0.4;
			const movementFactor =
				0.8 + (this.player.pitching.movement / RATING_MAX) * 0.4;
			const effectiveFactor = stuffFactor * movementFactor * movementMultiplier;

			switch (pitchName) {
				case "fastball":
					return {
						horizontalBreak: getRandomInRange(-2, 2) * effectiveFactor,
						verticalBreak: getRandomInRange(8, 12) * effectiveFactor,
						spinRate: getRandomInRange(2200, 2500),
					};
				case "sinker":
					return {
						horizontalBreak: getRandomInRange(-8, -4) * effectiveFactor,
						verticalBreak: getRandomInRange(-4, -1) * effectiveFactor,
						spinRate: getRandomInRange(1900, 2200),
					};
				case "cutter":
					return {
						horizontalBreak: getRandomInRange(1, 4) * effectiveFactor,
						verticalBreak: getRandomInRange(3, 7) * effectiveFactor,
						spinRate: getRandomInRange(2300, 2700),
					};
				case "slider":
					return {
						horizontalBreak: getRandomInRange(2, 6) * effectiveFactor,
						verticalBreak: getRandomInRange(-1, 2) * effectiveFactor,
						spinRate: getRandomInRange(2400, 2800),
					};
				case "curveball":
					return {
						horizontalBreak: getRandomInRange(-6, 6) * effectiveFactor,
						verticalBreak: getRandomInRange(-12, -8) * effectiveFactor,
						spinRate: getRandomInRange(2500, 3000),
					};
				case "changeup":
					return {
						horizontalBreak: getRandomInRange(-10, -6) * effectiveFactor,
						verticalBreak: getRandomInRange(-8, -4) * effectiveFactor,
						spinRate: getRandomInRange(1700, 2000),
					};
				case "splitter":
					return {
						horizontalBreak: getRandomInRange(-4, 0) * effectiveFactor,
						verticalBreak: getRandomInRange(-12, -8) * effectiveFactor,
						spinRate: getRandomInRange(1500, 1800),
					};
				case "sweeper":
					return {
						horizontalBreak: getRandomInRange(12, 18) * effectiveFactor,
						verticalBreak: getRandomInRange(-4, 0) * effectiveFactor,
						spinRate: getRandomInRange(2600, 3000),
					};
				case "slurve":
					return {
						horizontalBreak: getRandomInRange(8, 14) * effectiveFactor,
						verticalBreak: getRandomInRange(-8, -4) * effectiveFactor,
						spinRate: getRandomInRange(2400, 2800),
					};
				case "screwball":
					return {
						horizontalBreak: getRandomInRange(-12, -8) * effectiveFactor,
						verticalBreak: getRandomInRange(-4, 0) * effectiveFactor,
						spinRate: getRandomInRange(2000, 2400),
					};
				case "forkball":
					return {
						horizontalBreak: getRandomInRange(-2, 2) * effectiveFactor,
						verticalBreak: getRandomInRange(-14, -10) * effectiveFactor,
						spinRate: getRandomInRange(1400, 1700),
					};
				case "knuckleball":
					return {
						horizontalBreak: getRandomInRange(-10, 10),
						verticalBreak: getRandomInRange(-5, 5),
						spinRate: getRandomInRange(1000, 1400),
					};
				case "knuckleCurve":
					return {
						horizontalBreak: getRandomInRange(-8, 8) * effectiveFactor,
						verticalBreak: getRandomInRange(-10, -6) * effectiveFactor,
						spinRate: getRandomInRange(2200, 2600),
					};
				case "eephus":
					return {
						horizontalBreak: getRandomInRange(-4, 4),
						verticalBreak: getRandomInRange(-20, -15),
						spinRate: getRandomInRange(1200, 1600),
					};
				default: {
					const exhaustiveCheck: never = pitchName;
					throw new Error(`Unhandled pitch type: ${exhaustiveCheck}`);
				}
			}
		};

		// Calculate strike zone
		const szBot = 1.5 + (playerHitterHeight - 500) / 1000;
		const szTop = szBot + 2 + (playerHitterHeight - 500) / 500;

		// Get intended location with pitcher's control
		const controlFactor = (this.player.pitching.control / RATING_MAX) * 0.5;
		const targetLocation = this._getTargetLocation(pitchName, szBot, szTop);
		const intendedPlateX = targetLocation.x;
		const intendedPlateZ = targetLocation.z;

		// Apply movement to get final location
		const movement = getMovementProfile();
		const distanceToPlate = 60.5 - releasePosY;
		const timeToPlate =
			distanceToPlate / (this._getPitchVelocity(pitchName) * 1.467);

		// Calculate how movement affects final location
		const movementEffect = {
			x: (movement.horizontalBreak / 12) * timeToPlate * timeToPlate,
			z: (movement.verticalBreak / 12) * timeToPlate * timeToPlate,
		};

		// Add control variance
		const locationVariance = (1 - controlFactor) * 1.2 * fatigueMultiplier;
		const controlVariance = {
			x: getRandomInRange(-locationVariance, locationVariance),
			z: getRandomInRange(-locationVariance, locationVariance),
		};

		// Calculate final plate location
		const plateX = intendedPlateX + movementEffect.x + controlVariance.x;
		const plateZ = intendedPlateZ + movementEffect.z + controlVariance.z;

		return {
			ax: -movement.horizontalBreak * 2,
			ay: getRandomInRange(-40, 0),
			az: -movement.verticalBreak * 2,
			pfxX: movement.horizontalBreak,
			pfxZ: movement.verticalBreak,
			plateX,
			plateZ,
			releaseSpeed: this._getPitchVelocity(pitchName) * velocityMultiplier,
			releasePosX,
			releasePosY,
			releasePosZ,
			szBot,
			szTop,
			spinRate: movement.spinRate,
			vx0: movement.horizontalBreak * 0.4,
			vy0: -this._getPitchVelocity(pitchName) * 1.467 * velocityMultiplier,
			vz0: movement.verticalBreak * 0.4,
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
				singles: this.statistics.batting.singles,
				triples: this.statistics.batting.triples,
			},
			idGameGroup: this.idGameGroup,
			idPlayer: this.player.idPlayer,
			idTeam: this.player.idTeam,
			pitching: {
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

	// Helper method to get target location based on pitch type
	// Helper method to get target location based on pitch type
	private _getTargetLocation(
		pitchName: TPicklistPitchNames,
		szBot: number,
		szTop: number,
	) {
		const getRandomInRange = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		// Default zones
		const zones = {
			top: { min: szTop - 0.5, max: szTop + 0.2 },
			middle: {
				min: (szBot + szTop) / 2 - 0.25,
				max: (szBot + szTop) / 2 + 0.25,
			},
			bottom: { min: szBot - 0.2, max: szBot + 0.5 },
			inside: { min: -0.8, max: -0.3 },
			outside: { min: 0.3, max: 0.8 },
			center: { min: -0.25, max: 0.25 },
		};

		switch (pitchName) {
			case "fastball":
				return {
					x: getRandomInRange(zones.inside.min, zones.outside.max),
					z: getRandomInRange(zones.middle.min, zones.top.max),
				};
			case "sinker":
				return {
					x: getRandomInRange(zones.inside.min, zones.center.max),
					z: getRandomInRange(zones.bottom.min, zones.middle.max),
				};
			case "cutter":
				return {
					x: getRandomInRange(zones.center.min, zones.outside.max),
					z: getRandomInRange(zones.middle.min, zones.top.min),
				};
			case "slider":
				return {
					x: getRandomInRange(zones.center.min, zones.outside.max),
					z: getRandomInRange(zones.bottom.min, zones.middle.max),
				};
			case "curveball":
				return {
					x: getRandomInRange(zones.inside.min, zones.outside.max),
					z: getRandomInRange(zones.bottom.min, zones.middle.min),
				};
			case "changeup":
				return {
					x: getRandomInRange(zones.inside.min, zones.outside.max),
					z: getRandomInRange(zones.bottom.max, zones.middle.max),
				};
			case "splitter":
				return {
					x: getRandomInRange(zones.center.min, zones.center.max),
					z: getRandomInRange(zones.bottom.min, zones.bottom.max),
				};
			case "sweeper":
				return {
					x: getRandomInRange(zones.center.min, zones.outside.max),
					z: getRandomInRange(zones.middle.min, zones.middle.max),
				};
			case "slurve":
				return {
					x: getRandomInRange(zones.center.min, zones.outside.max),
					z: getRandomInRange(zones.bottom.min, zones.middle.max),
				};
			case "screwball":
				return {
					x: getRandomInRange(zones.inside.min, zones.center.max),
					z: getRandomInRange(zones.middle.min, zones.middle.max),
				};
			case "forkball":
				return {
					x: getRandomInRange(zones.center.min, zones.center.max),
					z: getRandomInRange(zones.bottom.min, zones.bottom.max),
				};
			case "knuckleball":
				return {
					x: getRandomInRange(zones.inside.min, zones.outside.max),
					z: getRandomInRange(zones.middle.min, zones.middle.max),
				};
			case "knuckleCurve":
				return {
					x: getRandomInRange(zones.inside.min, zones.outside.max),
					z: getRandomInRange(zones.bottom.min, zones.middle.min),
				};
			case "eephus":
				return {
					x: getRandomInRange(zones.center.min, zones.center.max),
					z: getRandomInRange(zones.middle.max, zones.top.max),
				};
			default: {
				const exhaustiveCheck: never = pitchName;
				throw new Error(`Unhandled pitch type: ${exhaustiveCheck}`);
			}
		}
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
});
type TInputChoosePitch = InferInput<typeof VInputChoosePitch>;
