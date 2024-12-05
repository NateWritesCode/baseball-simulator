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

function randomNormal(): number {
	let u = 0;
	let v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

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

		const numPitchesThrown = this.statistics.pitching.pitchesThrown;
		const pitchName = input.pitchName;
		const playerHitterHeight = input.playerHitter.player.physical.height;
		const pitcherStamina = input.playerPitcher.player.pitching.stamina;

		const fatigueMultiplier = 1 - fatigueEffect.pitching.controlPenalty;
		const velocityMultiplier = 1 - fatigueEffect.pitching.velocityPenalty;
		const movementMultiplier = 1 - fatigueEffect.pitching.movementPenalty;

		const getRandomInRange = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		// Calculate release parameters with fatigue influence
		const releasePosX =
			getRandomInRange(-1.5, 1.5) *
			(1 + fatigueEffect.pitching.controlPenalty * 0.25);
		const releasePosY = getRandomInRange(52.5, 54);
		const releasePosZ =
			getRandomInRange(5, 6) *
			(1 + fatigueEffect.pitching.controlPenalty * 0.25);

		// Calculate strike zone
		const szBot = 1.5 + (playerHitterHeight - 500) / 1000;
		const szTop = szBot + 2 + (playerHitterHeight - 500) / 500;

		// Calculate target location based on pitch type
		const szMid = (szTop + szBot) / 2;
		let targetX = 0;
		let targetZ = szMid;

		// Pitch-specific targeting
		switch (pitchName) {
			case "changeup": {
				targetZ = szMid - 0.2;
				targetX += Math.random() > 0.5 ? 0.2 : -0.2;
				break;
			}
			case "curveball": {
				targetZ = szMid - 0.3;
				targetX += Math.random() > 0.5 ? 0.2 : -0.2;
				break;
			}
			case "cutter": {
				targetX += 0.3;
				targetZ = szMid + 0.1;
				break;
			}
			case "eephus": {
				targetZ = szMid + 0.3;
				targetX += Math.random() > 0.5 ? 0.3 : -0.3;
				break;
			}
			case "fastball": {
				targetZ = szMid + (Math.random() > 0.5 ? 0.2 : -0.2);
				targetX += Math.random() > 0.7 ? 0.2 : 0;
				break;
			}
			case "forkball": {
				targetZ = szMid - 0.4;
				break;
			}
			case "knuckleball": {
				targetX += (Math.random() - 0.5) * 0.4;
				targetZ += (Math.random() - 0.5) * 0.4;
				break;
			}
			case "knuckleCurve": {
				targetZ = szMid - 0.25;
				targetX += Math.random() > 0.5 ? 0.25 : -0.25;
				break;
			}
			case "screwball": {
				targetX -= 0.3;
				targetZ = szMid + 0.1;
				break;
			}
			case "sinker": {
				targetZ = szMid - 0.25;
				targetX -= 0.2;
				break;
			}
			case "slider": {
				targetX += 0.3;
				targetZ = szMid - 0.1;
				break;
			}
			case "slurve": {
				targetX += 0.25;
				targetZ = szMid - 0.2;
				break;
			}
			case "splitter": {
				targetZ = szMid - 0.35;
				targetX += Math.random() > 0.5 ? 0.1 : -0.1;
				break;
			}
			case "sweeper": {
				targetX += 0.35;
				targetZ = szMid - 0.15;
				break;
			}
		}

		// Inside getPitchLocation, update getMovementProfile:
		const getMovementProfile = () => {
			// More dramatic stuff impact
			const stuffRating = this.player.pitching.stuff / RATING_MAX;
			const stuffFactor = 0.3 + stuffRating * 1.4; // Range: 0.3-1.7

			const movementRating = this.player.pitching.movement / RATING_MAX;
			const movementFactor = 0.3 + movementRating * 1.4; // Range: 0.3-1.7

			const effectiveFactor = stuffFactor * movementFactor * movementMultiplier;

			// Helper for spin rate calculation
			const getSpinRate = (baseMin: number, baseMax: number) => {
				const spinRange = baseMax - baseMin;
				const stuffImpact = stuffRating * spinRange * 0.4; // Stuff affects max spin
				const actualMin = baseMin + stuffImpact;
				const actualMax = baseMax + stuffImpact;
				return getRandomInRange(actualMin, actualMax);
			};

			switch (pitchName) {
				case "fastball":
					return {
						horizontalBreak: getRandomInRange(-2, 2) * effectiveFactor,
						verticalBreak: getRandomInRange(8, 12) * effectiveFactor,
						spinRate: getSpinRate(1800, 2200), // Lower base, more stuff impact
					};
				case "sinker":
					return {
						horizontalBreak: getRandomInRange(-8, -4) * effectiveFactor,
						verticalBreak: getRandomInRange(-4, -1) * effectiveFactor,
						spinRate: getSpinRate(1700, 2000),
					};
				case "cutter":
					return {
						horizontalBreak: getRandomInRange(1, 4) * effectiveFactor,
						verticalBreak: getRandomInRange(3, 7) * effectiveFactor,
						spinRate: getSpinRate(2200, 2500),
					};
				case "slider":
					return {
						horizontalBreak: getRandomInRange(2, 6) * effectiveFactor,
						verticalBreak: getRandomInRange(-1, 2) * effectiveFactor,
						spinRate: getSpinRate(2300, 2600),
					};
				case "curveball":
					return {
						horizontalBreak: getRandomInRange(-6, 6) * effectiveFactor,
						verticalBreak: getRandomInRange(-12, -8) * effectiveFactor,
						spinRate: getSpinRate(2400, 2800),
					};
				case "changeup":
					return {
						horizontalBreak: getRandomInRange(-10, -6) * effectiveFactor,
						verticalBreak: getRandomInRange(-8, -4) * effectiveFactor,
						spinRate: getSpinRate(1600, 1900),
					};
				case "splitter":
					return {
						horizontalBreak: getRandomInRange(-4, 0) * effectiveFactor,
						verticalBreak: getRandomInRange(-12, -8) * effectiveFactor,
						spinRate: getSpinRate(1400, 1700),
					};
				case "sweeper":
					return {
						horizontalBreak: getRandomInRange(12, 18) * effectiveFactor,
						verticalBreak: getRandomInRange(-4, 0) * effectiveFactor,
						spinRate: getSpinRate(2500, 2800),
					};
				case "slurve":
					return {
						horizontalBreak: getRandomInRange(8, 14) * effectiveFactor,
						verticalBreak: getRandomInRange(-8, -4) * effectiveFactor,
						spinRate: getSpinRate(2300, 2600),
					};
				case "screwball":
					return {
						horizontalBreak: getRandomInRange(-12, -8) * effectiveFactor,
						verticalBreak: getRandomInRange(-4, 0) * effectiveFactor,
						spinRate: getSpinRate(1900, 2200),
					};
				case "forkball":
					return {
						horizontalBreak: getRandomInRange(-2, 2) * effectiveFactor,
						verticalBreak: getRandomInRange(-14, -10) * effectiveFactor,
						spinRate: getSpinRate(1300, 1600),
					};
				case "knuckleball":
					return {
						horizontalBreak: getRandomInRange(-10, 10) * 1.2, // Knuckleballs ignore stuff
						verticalBreak: getRandomInRange(-5, 5) * 1.2,
						spinRate: getRandomInRange(900, 1200), // Low spin by design
					};
				case "knuckleCurve":
					return {
						horizontalBreak: getRandomInRange(-8, 8) * effectiveFactor,
						verticalBreak: getRandomInRange(-10, -6) * effectiveFactor,
						spinRate: getSpinRate(2100, 2400),
					};
				case "eephus":
					return {
						horizontalBreak: getRandomInRange(-4, 4),
						verticalBreak: getRandomInRange(-20, -15),
						spinRate: getRandomInRange(1100, 1400), // Low spin by design
					};
			}
		};

		// Get control variation based on pitcher's skill and fatigue
		const controlRating = this.player.pitching.control / RATING_MAX;
		const standardDeviation =
			(0.3 + (1 - controlRating) * 0.4) * fatigueMultiplier;

		// Add controlled randomness to target location
		const actualX = targetX + randomNormal() * standardDeviation;
		const actualZ = targetZ + randomNormal() * standardDeviation;

		// Limit extreme misses
		const maxMiss = 1.2;
		const clampedX = Math.max(-maxMiss, Math.min(maxMiss, actualX));
		const clampedZ = Math.max(szBot * 0.8, Math.min(szTop * 1.2, actualZ));

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

		// Calculate final plate location
		const plateX = clampedX + movementEffect.x;
		const plateZ = clampedZ + movementEffect.z;

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
		const playerHitter = input.playerHitter;
		const batting = playerHitter.player.batting;
		const bats = playerHitter.player.bats;
		const speed = playerHitter.player.running.speed;
		const handThrowing = this.player.throws;
		const handBatting = (() => {
			if (bats === "s") {
				if (handThrowing === "r") {
					return "l";
				}

				return "r";
			}
			return bats;
		})();

		// Get the appropriate batting ratings based on pitcher's throwing arm
		const batterRatings = {
			contact: handThrowing === "l" ? batting.contactVL : batting.contactVR,
			power: handThrowing === "l" ? batting.powerVL : batting.powerVR,
			eye: handThrowing === "l" ? batting.eyeVL : batting.eyeVR,
			avoidK: handThrowing === "l" ? batting.avoidKsVL : batting.avoidKsVR,
		};

		// Get pitcher's ratings against this batter's handedness
		const pitcherRatings = {
			control:
				handBatting === "l"
					? this.player.pitching.controlVL
					: this.player.pitching.controlVR,
			movement:
				handBatting === "l"
					? this.player.pitching.movementVL
					: this.player.pitching.movementVR,
			stuff:
				handBatting === "l"
					? this.player.pitching.stuffVL
					: this.player.pitching.stuffVR,
		};

		const availablePitches = Object.entries(pitches).filter(
			([, rating]) => rating > RATING_MIN,
		) as [keyof typeof pitches, number][];

		if (Math.random() > 0.999) {
			return Object.keys(pitches)[
				Math.floor(Math.random() * Object.keys(pitches).length)
			] as keyof typeof pitches;
		}

		const fatiguePercentage = fatigueCurrent / FATIGUE_MAX;
		const staminaPercentage = Math.max(
			0,
			1 - numPitchesThrown / (pitcherStamina * 0.7),
		);

		const weightedPitches = availablePitches.map(([pitch, rating]) => {
			let weight = rating;

			const fatigueCost = PITCH_TYPE_FATIGUE_MULTIPLIERS[pitch] || 1;
			const fatigueMultiplier = 1 - fatiguePercentage * (fatigueCost - 0.7);
			weight *= fatigueMultiplier;

			// Batter handedness considerations with platoon splits
			const isOppositeHand =
				(handBatting === "l" && handThrowing === "r") ||
				(handBatting === "r" && handThrowing === "l");
			if (isOppositeHand) {
				// Adjust based on pitcher's opposite-hand effectiveness
				switch (pitch) {
					case "slider":
					case "cutter":
						weight *= 1.25 * (pitcherRatings.movement / RATING_MAX);
						break;
					case "changeup":
						weight *= 1.2 * (pitcherRatings.stuff / RATING_MAX);
						break;
				}
			} else {
				// Same-hand matchup adjustments
				switch (pitch) {
					case "curveball":
					case "splitter":
						weight *= 1.2 * (pitcherRatings.movement / RATING_MAX);
						break;
				}
			}

			// Contact vs Power hitter adjustments using platoon splits
			if (batterRatings.power > batterRatings.contact * 1.2) {
				// Against power hitters
				switch (pitch) {
					case "sinker":
					case "splitter":
						weight *= 1.3 * (pitcherRatings.movement / RATING_MAX);
						break;
					case "fastball":
						weight *= 0.8 * (pitcherRatings.stuff / RATING_MAX);
						break;
				}
			} else if (batterRatings.contact > batterRatings.power * 1.2) {
				// Against contact hitters
				switch (pitch) {
					case "curveball":
					case "slider":
						weight *= 1.2 * (pitcherRatings.movement / RATING_MAX);
						break;
					case "changeup":
						weight *= 1.25 * (pitcherRatings.stuff / RATING_MAX);
						break;
				}
			}

			// Adjust for batter's eye/discipline with platoon splits
			if (batterRatings.eye > RATING_MAX * 0.7) {
				// Use pitcher's control rating to adjust effectiveness
				switch (pitch) {
					case "cutter":
					case "slider":
						weight *= 1.15 * (pitcherRatings.control / RATING_MAX);
						break;
					case "knuckleball":
					case "eephus":
						weight *= 0.8;
						break;
				}
			}

			// Strikeout avoidance consideration
			if (batterRatings.avoidK > RATING_MAX * 0.7) {
				// Against contact-oriented hitters who rarely strike out
				switch (pitch) {
					case "sinker":
					case "cutter":
						// Favor pitches that induce weak contact
						weight *= 1.2 * (pitcherRatings.movement / RATING_MAX);
						break;
					case "curveball":
					case "slider":
						// Reduce reliance on pure strikeout pitches
						weight *= 0.9;
						break;
				}
			}

			// Speed adaptation based on batter's physical attributes
			if (speed > RATING_MAX * 0.7) {
				switch (pitch) {
					case "sinker":
					case "splitter":
						weight *= 1.2 * (pitcherRatings.movement / RATING_MAX);
						break;
				}
			}

			// Existing situation-based logic
			if (numStrikes === 2) {
				switch (pitch) {
					case "slider":
					case "curveball":
					case "splitter":
						weight *= 1.3 * (pitcherRatings.stuff / RATING_MAX);
						break;
				}
			}

			if (numBalls === 3) {
				switch (pitch) {
					case "fastball":
					case "sinker":
					case "changeup":
						weight *= 1.4 * (pitcherRatings.control / RATING_MAX);
						break;
					case "knuckleball":
					case "eephus":
						weight *= 0.5;
						break;
				}
			}

			// Stamina and fatigue considerations
			if (["fastball", "sinker", "cutter"].includes(pitch)) {
				weight *= staminaPercentage;
				if (fatiguePercentage > 0.7) {
					weight *= 0.7;
				}
			} else {
				weight *= 1 + (1 - staminaPercentage) * 0.5;
			}

			if (fatiguePercentage > 0.8) {
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
				switch (pitch) {
					case "changeup":
					case "curveball":
					case "slider":
						weight *= 1.2;
						break;
				}
			}

			if (numOuts === 2 && (numBalls === 3 || numStrikes === 2)) {
				weight *=
					(rating / Math.max(...availablePitches.map(([, r]) => r))) * 1.3;
			}

			return { pitch, weight };
		});

		weightedPitches.sort((a, b) => b.weight - a.weight);

		if (
			fatiguePercentage > 0.9 ||
			(numOuts === 2 && numBalls === 3 && numStrikes === 2)
		) {
			return weightedPitches[0].pitch;
		}

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
	playerHitter: instance(GameSimPlayerState),
});
type TInputChoosePitch = InferInput<typeof VInputChoosePitch>;
