import { type InferInput, instance, number, object, parse } from "valibot";
import { RATING_MAX, RATING_MIN } from "../constants";
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
	runs: number;
	runsEarned: number;
	singlesAllowed: number;
	triplesAllowed: number;
};

type TStatistics = {
	batting: TBattingStatistics;
	pitching: TPitchingStatistics;
};

const VConstructorGameSimPlayerState = object({
	player: VConstructorGameSimPlayer,
});
type TConstructorGameSimPlayerState = InferInput<
	typeof VConstructorGameSimPlayerState
>;

class GameSimPlayerState implements OGameSimObserver {
	public player: TConstructorGameSimPlayer;
	statistics: TStatistics;

	constructor(_input: TConstructorGameSimPlayerState) {
		const input = parse(VConstructorGameSimPlayerState, _input);

		this.player = input.player;
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
				runs: 0,
				runsEarned: 0,
				singlesAllowed: 0,
				triplesAllowed: 0,
			},
		};
	}

	public getPitchLocation(_input: TInputGetPitchLocation) {
		const input = parse(VInputGetPitchLocation, _input);
		const numPitchesThrown =
			input.playerPitcher.statistics.pitching.pitchesThrown;
		const pitchName = input.pitchName;
		const playerHitterHeight = input.playerHitter.player.physical.height;
		const pitcherStamina = input.playerPitcher.player.pitching.stamina;

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
			plateX: getRandomInRange(-1.5, 1.5),
			plateZ: getRandomInRange(szBot, szTop),
			// releaseSpeed: Velocity of the pitch at release (mph)
			// Range: Typically 70 to 105 mph
			releaseSpeed,
			// releasePosX, releasePosY, releasePosZ: Position of the ball at release (ft)
			// Range: Varies based on pitcher's release point, but typically:
			// X: -3 to 3 ft
			// Y: 50 to 55 ft (distance from home plate)
			// Z: 5 to 7 ft (height)
			releasePosX: getRandomInRange(-2, 2),
			releasePosY: getRandomInRange(50, 55),
			releasePosZ: getRandomInRange(5, 7),
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

		const availablePitches = Object.entries(pitches).filter(
			([, rating]) => rating > RATING_MIN,
		) as [keyof typeof pitches, number][];

		if (Math.random() > 0.999) {
			return Object.keys(pitches)[
				Math.floor(Math.random() * Object.keys(pitches).length)
			] as keyof typeof pitches;
		}

		const STAMINA_FACTOR = 0.7;
		const RELY_ON_BEST_THRESHOLD = 0.8;

		const staminaPercentage = Math.max(
			0,
			1 - numPitchesThrown / (pitcherStamina * STAMINA_FACTOR),
		);

		const weightedPitches = availablePitches.map(([pitch, rating]) => {
			let weight = rating;

			// Adjust weight based on game situation
			if (numStrikes === 2) {
				weight *= 1.2; // Increase weight for strikeout pitches
			}
			if (numBalls === 3) {
				weight *= 0.8; // Decrease weight for potential walk pitches
			}

			// Adjust weight based on stamina
			if (["fastball", "cutter", "sinker"].includes(pitch)) {
				weight *= staminaPercentage;
			} else {
				weight *= 1 + (1 - staminaPercentage) * 0.5;
			}

			return { pitch, weight };
		});

		// Sort pitches by weight in descending order
		weightedPitches.sort((a, b) => b.weight - a.weight);

		// If pitcher is tired or in a crucial situation, rely more on best pitches
		if (
			staminaPercentage < RELY_ON_BEST_THRESHOLD ||
			(numOuts === 2 && (numBalls === 3 || numStrikes === 2))
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

		// Fallback to the highest rated pitch (should never reach here)
		return weightedPitches[0].pitch;
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
						case "BALL": {
							this.statistics.pitching.pitchesThrownBalls++;
							break;
						}
						case "IN_PLAY": {
							this.statistics.pitching.pitchesThrownInPlay++;
							break;
						}
						case "STRIKE": {
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
}

export default GameSimPlayerState;

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
