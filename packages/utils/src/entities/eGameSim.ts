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
	private readonly GRAVITY = -32.174; // ft/s^2
	private readonly AIR_DENSITY = 0.0765; // lb/ft^3
	private readonly BALL_MASS = 0.3125; // lb
	private readonly BALL_RADIUS = 0.12; // ft
	private readonly INFIELD_DEPTH = 90; // feet from home plate
	private readonly OUTFIELD_DEPTH = 250; // typical outfield depth

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

	private _calculateDistanceToBoundary(
		_input: TInputCalculateDistanceToBoundary,
	) {
		const { finalX, finalY, parkState } = parse(
			VInputCalculateDistanceToBoundary,
			_input,
		);

		let shortestDistance = Number.POSITIVE_INFINITY;
		let result: {
			distance: number;
			isNearCorner: boolean;
			segmentType: "wall" | "foulLine" | "backstop";
			nearestSegmentHeight?: number;
		} = {
			distance: Number.POSITIVE_INFINITY,
			isNearCorner: false,
			segmentType: "wall",
		};

		// Check distance to wall segments
		for (const segment of parkState.park.wallSegments) {
			const wallDistance = this._calculateDistanceToSegment({
				endX: segment.segmentEndX,
				endY: segment.segmentEndY,
				finalX,
				finalY,
				startX: segment.segmentStartX,
				startY: segment.segmentStartY,
			});

			if (wallDistance.distance < shortestDistance) {
				shortestDistance = wallDistance.distance;
				result = {
					distance: wallDistance.distance,
					isNearCorner: wallDistance.isNearCorner,
					nearestSegmentHeight: segment.height,
					segmentType: "wall",
				};
			}
		}

		// Check distance to foul lines
		const leftFoulLineDistance = this._calculateDistanceToSegment({
			endX: parkState.park.foulLineLeftFieldX,
			endY: parkState.park.foulLineLeftFieldY,
			finalX,
			finalY,
			startX: 0,
			startY: 0,
		});

		const rightFoulLineDistance = this._calculateDistanceToSegment({
			endX: parkState.park.foulLineRightFieldX,
			endY: parkState.park.foulLineRightFieldY,
			finalX,
			finalY,
			startX: 0,
			startY: 0,
		});

		const foulLineDistance = Math.min(
			leftFoulLineDistance.distance,
			rightFoulLineDistance.distance,
		);

		if (foulLineDistance < shortestDistance) {
			shortestDistance = foulLineDistance;
			result = {
				distance: foulLineDistance,
				isNearCorner: false,
				segmentType: "foulLine",
			};
		}

		// Check distance to backstop
		if (finalY < 0) {
			const backstopY = -parkState.park.backstopDistance;
			let backstopDistance: number;

			// Handle curved backstop approximation
			if (Math.abs(finalX) > parkState.park.backstopDistance) {
				// Beyond the curve, use direct distance
				backstopDistance = Math.sqrt(
					finalX * finalX + (finalY - backstopY) * (finalY - backstopY),
				);
			} else {
				// Within curve, use vertical distance
				backstopDistance = Math.abs(finalY - backstopY);
			}

			if (backstopDistance < shortestDistance) {
				result = {
					distance: backstopDistance,
					isNearCorner: false,
					nearestSegmentHeight: parkState.park.backstopDistance,
					segmentType: "backstop",
				};
			}
		}

		return result;
	}

	private _calculateDistanceToSegment(
		_input: TInputCalculateDistanceToSegment,
	) {
		const { endX, endY, finalX, finalY, startX, startY } = parse(
			VInputCalculateDistanceToSegment,
			_input,
		);

		// Vector from start to end of segment
		const segmentVectorX = endX - startX;
		const segmentVectorY = endY - startY;

		// Vector from segment start to ball position
		const ballVectorX = finalX - startX;
		const ballVectorY = finalY - startY;

		// Calculate squared length of the segment
		const segmentLengthSquared =
			segmentVectorX * segmentVectorX + segmentVectorY * segmentVectorY;

		// Handle zero-length segment
		if (segmentLengthSquared === 0) {
			const distance = Math.sqrt(
				ballVectorX * ballVectorX + ballVectorY * ballVectorY,
			);
			return {
				distance,
				isNearCorner: false,
			};
		}

		// Calculate projection parameter
		const t = Math.max(
			0,
			Math.min(
				1,
				(ballVectorX * segmentVectorX + ballVectorY * segmentVectorY) /
					segmentLengthSquared,
			),
		);

		// Calculate closest point on segment
		const closestX = startX + t * segmentVectorX;
		const closestY = startY + t * segmentVectorY;

		// Calculate distance to closest point
		const distance = Math.sqrt(
			(finalX - closestX) * (finalX - closestX) +
				(finalY - closestY) * (finalY - closestY),
		);

		// Check if point is near a corner (within 5 feet of segment endpoint)
		const CORNER_THRESHOLD = 5;
		const isNearStartCorner = t < 0.1 && distance < CORNER_THRESHOLD;
		const isNearEndCorner = t > 0.9 && distance < CORNER_THRESHOLD;

		return {
			distance,
			isNearCorner: isNearStartCorner || isNearEndCorner,
		};
	}

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

	private _calculateFieldingDifficulty(
		_input: TInputCalculateFieldingDifficulty,
	) {
		const {
			ballInPlay,
			fielder,
			fielderPosition,
			finalX,
			finalY,
			isFoul,
			parkState,
			position,
		} = parse(VInputCalculateFieldingDifficulty, _input);

		// Base difficulty calculation based on position
		let positionDifficulty = 0;

		switch (position) {
			case "c": {
				const catcherRating =
					fielder.player.fielding.catcherAbility / RATING_MAX;
				const catcherFraming =
					fielder.player.fielding.catcherFraming / RATING_MAX;

				// Base difficulty for catchers
				positionDifficulty = 0.5 - catcherRating * 0.3;

				// Distance factors
				if (ballInPlay.distance > 60) {
					positionDifficulty += Math.min((ballInPlay.distance - 60) / 40, 0.4);
				}

				// Height/trajectory factors
				if (ballInPlay.launchAngle > 60) {
					// Pop-ups
					positionDifficulty -= catcherFraming * 0.2;
					if (ballInPlay.distance < 30) {
						positionDifficulty -= 0.2;
					}
				}

				// Foul territory is slightly easier for catchers
				if (isFoul) {
					positionDifficulty *= 0.9;
				}
				break;
			}
			case "fb":
			case "tb": {
				const rangeRating = fielder.player.fielding.infieldRange / RATING_MAX;
				const errorRating = fielder.player.fielding.infieldError / RATING_MAX;
				const armRating = fielder.player.fielding.infieldArm / RATING_MAX;
				const doublePlayRating =
					fielder.player.fielding.infieldDoublePlay / RATING_MAX;

				// Base difficulty
				positionDifficulty = 0.5 - rangeRating * 0.3 - errorRating * 0.2;

				// Direction adjustments
				const angle = Math.atan2(finalY, finalX) * (180 / Math.PI);
				const isWrongSide =
					(position === "fb" && angle < 0) || (position === "tb" && angle > 0);

				if (isWrongSide) {
					positionDifficulty += isFoul ? 0.3 : 0.4;
				}

				// Ball type adjustments
				if (ballInPlay.launchAngle < 10) {
					if (ballInPlay.distance > 60) {
						positionDifficulty += 0.2 - armRating * 0.2;
					}
					if (!isFoul) {
						positionDifficulty -= doublePlayRating * 0.1;
					}
				}

				if (isFoul) {
					positionDifficulty *= 1.1;
				}
				break;
			}
			case "sb":
			case "ss": {
				const rangeRating = fielder.player.fielding.infieldRange / RATING_MAX;
				const errorRating = fielder.player.fielding.infieldError / RATING_MAX;
				const doublePlayRating =
					fielder.player.fielding.infieldDoublePlay / RATING_MAX;

				// Base difficulty
				positionDifficulty = 0.4 - rangeRating * 0.3 - errorRating * 0.2;

				// Middle infielders struggle more with foul balls
				if (isFoul) {
					positionDifficulty += 0.3;
				} else {
					positionDifficulty -= doublePlayRating * 0.2;
				}
				break;
			}
			case "lf":
			case "cf":
			case "rf": {
				const rangeRating = fielder.player.fielding.outfieldRange / RATING_MAX;
				const errorRating = fielder.player.fielding.outfieldError / RATING_MAX;
				const armRating = fielder.player.fielding.outfieldArm / RATING_MAX;

				// Base difficulty
				positionDifficulty = 0.5 - rangeRating * 0.4 - errorRating * 0.1;

				// CF bonus
				if (position === "cf") {
					positionDifficulty -= 0.1;
				}

				// Direction factors
				const angle = Math.atan2(finalY, finalX) * (180 / Math.PI);
				const isWrongSide =
					(position === "rf" && angle < 0) || (position === "lf" && angle > 0);

				if (isWrongSide) {
					positionDifficulty += 0.4;
				}

				// Distance and speed factors
				if (ballInPlay.distance < 150) {
					positionDifficulty += 0.3;
				} else if (ballInPlay.distance > 250) {
					positionDifficulty += 0.2 - armRating * 0.2;
				}

				if (isFoul) {
					positionDifficulty *= 1.2;
				}
				break;
			}
			case "p": {
				// Pitchers are generally not involved in foul balls
				if (isFoul) {
					return 1;
				}

				const rangeRating = fielder.player.fielding.infieldRange / RATING_MAX;
				const errorRating = fielder.player.fielding.infieldError / RATING_MAX;

				positionDifficulty = 0.6 - rangeRating * 0.2 - errorRating * 0.2;

				if (ballInPlay.launchAngle > 10 || ballInPlay.distance > 60) {
					positionDifficulty += 0.4;
				}
				break;
			}
		}

		// Calculate trajectory difficulty (20% of total)
		const trajectoryDifficulty = this._calculateTrajectoryDifficulty({
			ballInPlay,
			position,
		});

		// Calculate situational difficulty (20% of total)
		const situationalDifficulty = this._calculateSituationalDifficulty({
			ballInPlay,
			fieldingPosition: fielderPosition,
			finalX,
			finalY,
			parkState,
		});

		// Weight the components
		const totalDifficulty =
			positionDifficulty * 0.6 + // Position-specific: 60%
			trajectoryDifficulty * 0.2 + // Trajectory: 20%
			situationalDifficulty * 0.2; // Situational: 20%

		return Math.min(Math.max(totalDifficulty, 0), 1);
	}

	private _calculateLaunchAngle(input: TInputSimulateBallInPlay) {
		const { contactQuality, pitchLocation } = input;

		// Base angle affected by pitch height
		const baseAngle = 10 + (pitchLocation.plateZ - pitchLocation.szBot) * 15;

		// Add variation based on contact quality
		const angleVariation = (Math.random() - 0.5) * 20;
		return baseAngle + angleVariation * (1 - contactQuality);
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

	private _checkWallInteraction(_input: TInputCheckWallInteraction) {
		const { ballInPlay, parkState } = parse(VInputCheckWallInteraction, _input);

		let closestIntersection = null;
		let minDistance = Number.POSITIVE_INFINITY;
		let intersectingSegmentHeight = 0;
		let isNearCorner = false;

		// Check each wall segment for intersection
		for (const segment of parkState.park.wallSegments) {
			const intersection = this._findTrajectoryWallIntersection({
				trajectory: ballInPlay.trajectory,
				wallEnd: { x: segment.segmentEndX, y: segment.segmentEndY },
				wallStart: { x: segment.segmentStartX, y: segment.segmentStartY },
			});

			if (intersection) {
				const distance = Math.sqrt(
					intersection.x * intersection.x + intersection.y * intersection.y,
				);

				// Check if this is the closest intersection
				if (distance < minDistance) {
					minDistance = distance;
					closestIntersection = intersection;
					intersectingSegmentHeight = segment.height;

					// Check if near a corner
					const wallLength = Math.sqrt(
						(segment.segmentEndX - segment.segmentStartX) ** 2 +
							(segment.segmentEndY - segment.segmentStartY) ** 2,
					);

					// Calculate distance from intersection to segment endpoints
					const distanceToStart = Math.sqrt(
						(intersection.x - segment.segmentStartX) ** 2 +
							(intersection.y - segment.segmentStartY) ** 2,
					);
					const distanceToEnd = Math.sqrt(
						(intersection.x - segment.segmentEndX) ** 2 +
							(intersection.y - segment.segmentEndY) ** 2,
					);

					// Consider it near a corner if within 5% of wall segment length from either end
					isNearCorner =
						distanceToStart < wallLength * 0.05 ||
						distanceToEnd < wallLength * 0.05;
				}
			}
		}

		// If no intersection found, check for automatic home runs
		// (balls that clearly go over the wall without intersection)
		if (!closestIntersection) {
			const finalPoint =
				ballInPlay.trajectory[ballInPlay.trajectory.length - 1];
			const distance = Math.sqrt(
				finalPoint.x * finalPoint.x + finalPoint.y * finalPoint.y,
			);

			// Find the wall height at this distance/direction
			const nearestWallHeight = this._findNearestWallHeight({
				finalX: finalPoint.x,
				finalY: finalPoint.y,
				parkState,
			});

			// If the ball's final height is well above the nearest wall, it's a home run
			if (finalPoint.z > nearestWallHeight * 1.2) {
				return {
					isHomeRun: true,
					wallHeight: nearestWallHeight,
				};
			}

			return null;
		}

		return {
			intersectionPoint: closestIntersection,
			isHomeRun: closestIntersection.z > intersectingSegmentHeight,
			isNearCorner,
			wallHeight: intersectingSegmentHeight,
		};
	}

	private _determineClosestFielders(_input: TInputDetermineClosestFielders) {
		const opportunities: TFieldingOpportunity[] = [];

		const { ballInPlay, teamDefenseState } = parse(
			VInputSimulateFielding,
			_input,
		);

		// Get all potential fielders based on ball trajectory
		const potentialFielders: Array<{
			position: TPicklistPositions;
			fielder: GameSimPlayerState;
		}> = [];

		// Determine if ball is in infield or outfield
		const distanceFromHome = Math.sqrt(
			ballInPlay.finalX * ballInPlay.finalX +
				ballInPlay.finalY * ballInPlay.finalY,
		);
		const isInfield = distanceFromHome <= this.INFIELD_DEPTH;
		const launchAngle = ballInPlay.launchAngle;

		// Add pitcher for bunts and short grounders
		if (isInfield && launchAngle < 10 && distanceFromHome < 30) {
			potentialFielders.push({
				fielder: teamDefenseState.getFielderForPosition("p"),
				position: "p",
			});
		}

		// Add catcher for pop-ups and bunts
		if (
			(launchAngle > 45 && distanceFromHome < 60) ||
			(launchAngle < 10 && distanceFromHome < 20)
		) {
			potentialFielders.push({
				fielder: teamDefenseState.getFielderForPosition("c"),
				position: "c",
			});
		}

		// Add infielders
		if (isInfield || launchAngle > 45) {
			potentialFielders.push(
				{
					fielder: teamDefenseState.getFielderForPosition("fb"),
					position: "fb",
				},
				{
					fielder: teamDefenseState.getFielderForPosition("sb"),
					position: "sb",
				},
				{
					fielder: teamDefenseState.getFielderForPosition("tb"),
					position: "tb",
				},
				{
					fielder: teamDefenseState.getFielderForPosition("ss"),
					position: "ss",
				},
			);
		}

		// Add outfielders
		if (!isInfield || launchAngle > 25) {
			potentialFielders.push(
				{
					fielder: teamDefenseState.getFielderForPosition("lf"),
					position: "lf",
				},
				{
					fielder: teamDefenseState.getFielderForPosition("cf"),
					position: "cf",
				},
				{
					fielder: teamDefenseState.getFielderForPosition("rf"),
					position: "rf",
				},
			);
		}

		// Calculate opportunities for each potential fielder
		for (const { position, fielder } of potentialFielders) {
			const fielderPosition = this._getFielderStartPosition({
				position,
			});

			const distance = Math.sqrt(
				(ballInPlay.finalX - fielderPosition.x) ** 2 +
					(ballInPlay.finalY - fielderPosition.y) ** 2,
			);

			// Calculate fielding difficulty using existing method
			const difficulty = this._calculateFieldingDifficulty({
				ballInPlay,
				fielder,
				fielderPosition,
				finalX: ballInPlay.finalX,
				finalY: ballInPlay.finalY,
				isFoul: ballInPlay.isFoul,
				parkState: this.parkState,
				position,
			});

			// Calculate reach time based on fielder speed and distance
			const reachTime = distance / this._getFielderSpeed({ fielder });

			// Add opportunity if difficulty is not impossible (< 1)
			if (difficulty < 1) {
				opportunities.push({
					difficulty,
					idFielder: fielder.player.idPlayer,
					position,
					reachTime,
					xPos: fielderPosition.x,
					yPos: fielderPosition.y,
				});
			}
		}

		// Sort opportunities by a combination of reach time and difficulty
		// This gives slight preference to more skilled fielders who might be slightly further away
		return opportunities.sort((a, b) => {
			const scoreA = a.reachTime * (1 + a.difficulty);
			const scoreB = b.reachTime * (1 + b.difficulty);
			return scoreA - scoreB;
		});
	}

	private _determineContactQuality(_input: TInputDetermineContactQuality) {
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

	private _determineSwingLikelihood(_input: TInputDetermineSwingLikelihood) {
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

	private _determineStrikeZone(_input: TInputDetermineStrikeZone) {
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

	private _findNearestWallHeight(_input: TInputFindNearestWallHeight) {
		const { finalX, finalY, parkState } = parse(
			VInputFindNearestWallHeight,
			_input,
		);

		let nearestDistance = Number.POSITIVE_INFINITY;
		let nearestHeight = 0;

		// Find the closest wall segment
		for (const segment of parkState.park.wallSegments) {
			const distance = this._calculateDistanceToSegment({
				endX: segment.segmentEndX,
				endY: segment.segmentEndY,
				finalX,
				finalY,
				startX: segment.segmentStartX,
				startY: segment.segmentStartY,
			});

			if (distance.distance < nearestDistance) {
				nearestDistance = distance.distance;
				nearestHeight = segment.height;
			}
		}

		return nearestHeight;
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

	private _getBoundaryProximityDifficulty(
		_input: TInputGetBoundaryProximityDifficulty,
	) {
		const { finalX, finalY, parkState } = parse(
			VInputGetBoundaryProximityDifficulty,
			_input,
		);
		let difficulty = 0;

		// Get distance and boundary information
		const boundaryInfo = this._calculateDistanceToBoundary({
			finalX,
			finalY,
			parkState,
		});

		// Very close to boundary
		if (boundaryInfo.distance < 10) {
			difficulty += (1 - boundaryInfo.distance / 10) * 0.8;

			// Additional difficulty for wall plays vs foul line plays
			if (boundaryInfo.segmentType === "wall") {
				difficulty += 0.1;
			}
		} else if (boundaryInfo.distance < 20) {
			// Approaching boundary
			difficulty += (1 - boundaryInfo.distance / 20) * 0.4;
		}

		// Additional difficulty for corner plays
		if (boundaryInfo.isNearCorner) {
			difficulty += 0.3;
		}

		// Additional difficulty for backstop plays
		if (boundaryInfo.segmentType === "backstop") {
			difficulty += 0.2;
		}

		return Math.min(difficulty, 1);
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

	private _getFielderStartPosition(_input: TInputGetFielderStartPosition) {
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
			(finalX - fieldingPosition.x) ** 2 + (finalY - fieldingPosition.y) ** 2,
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

	private _getPitchWhiffFactor(_input: TInputGetPitchWhiffFactor) {
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

	private _getRunnerTaggingChance({ distance }: { distance: number }) {
		return Math.min((distance - 200) / 200, 0.9); // Max 90% chance on deep flies
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

	private _handleFoulBall(_input: TInputHandleFoulBall) {
		let isAtBatOver = false;
		const { ballInPlay, teamDefenseState } = parse(
			VInputHandleFoulBall,
			_input,
		);

		const opportunities = this._determineClosestFielders({
			ballInPlay,
			teamDefenseState,
		});

		if (opportunities.length === 0) {
			if (this.numStrikes < 2) {
				this.numStrikes++;
			}
			return isAtBatOver;
		}

		const opportunity = opportunities[0];

		const fieldingResult = this._simulateFieldingAttempt({
			opportunity,
			ballInPlay,
		});

		if (fieldingResult.isSuccess) {
			// Caught foul ball - batter is out
			this._handleOut();
			isAtBatOver = true;
		} else {
			// Dropped/missed foul ball - add strike if less than 2
			if (this.numStrikes < 2) {
				this.numStrikes++;
			}
		}

		return isAtBatOver;
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

	private _handleNonWallBallOutcome(_input: TInputHandleNonWallBallOutcome) {
		const { ballInPlay, fieldingResult } = parse(
			VInputHandleNonWallBallOutcome,
			_input,
		);
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

	private _handleWallBallOutcome(_input: TInputHandleWallBallOutcome) {
		const { ballInPlay, fieldingResult, wallInteraction } = parse(
			VInputHandleWallBallOutcome,
			_input,
		);
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

	private _notifyObservers = (input: TGameSimEvent) => {
		for (const observer of this.observers) {
			observer.notifyGameEvent({
				...input,
			});
		}
	};

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

	_simulateBallInPlay(_input: TInputSimulateBallInPlay) {
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

	private _simulateFielding(input: TInputSimulateFielding) {
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

	private _simulateFieldingAttempt(_input: TInputSimulateFieldingAttempt) {
		const { opportunity, ballInPlay } = parse(
			VInputSimulateFieldingAttempt,
			_input,
		);
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

	private _simulateInPlayOutcome(_input: TInputSimulateInPlayOutcome) {
		const { ballInPlay, fieldingResult } = parse(
			VInputSimulateInPlayOutcome,
			_input,
		);

		// First check if it's a potential home run (based on distance and wall height)
		const wallInteraction = this._checkWallInteraction({
			ballInPlay,
			parkState: this.parkState,
		});

		// Calculate total distance from home plate
		const distance = Math.sqrt(
			ballInPlay.finalX * ballInPlay.finalX +
				ballInPlay.finalY * ballInPlay.finalY,
		);

		// Home run check
		if (wallInteraction) {
			const { intersectionPoint, wallHeight } = wallInteraction;
			if (intersectionPoint && intersectionPoint.z > wallHeight) {
				this._handleHomeRun();
				return;
			}
		}

		// Wall ball check
		if (wallInteraction?.intersectionPoint) {
			this._handleWallBallOutcome({
				ballInPlay,
				fieldingResult,
				wallInteraction,
			});
			return;
		}

		// Regular ball in play
		this._handleNonWallBallOutcome({
			ballInPlay,
			fieldingResult,
		});
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

				const ballInPlay = this._simulateBallInPlay({
					contactQuality,
					parkState: this.parkState,
					pitchLocation,
					pitchName,
					playerHitter,
					playerPitcher,
				});

				if (ballInPlay.isFoul) {
					this._handleFoulBall({
						ballInPlay,
						teamDefenseState:
							this.teamStates[
								this._getTeamId({ teamIndex: this.numTeamDefense })
							],
					});
					isAtBatOver = true;
					break;
				}

				const fieldingResult = parse(
					VFieldingResult,
					this._simulateFielding({
						ballInPlay,
						teamDefenseState:
							this.teamStates[
								this._getTeamId({ teamIndex: this.numTeamDefense })
							],
					}),
				);

				this._simulateInPlayOutcome({
					ballInPlay,
					fieldingResult,
				});

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

const VWallInteraction = object({
	intersectionPoint: object({
		x: number(),
		y: number(),
		z: number(),
	}),
	isHomeRun: boolean(),
	isNearCorner: boolean(),
	wallHeight: number(),
});
type TWallInteraction = InferInput<typeof VWallInteraction>;

const VFieldingOpportunity = object({
	difficulty: number(),
	idFielder: number(),
	position: VPicklistPositions,
	reachTime: number(),
	xPos: number(),
	yPos: number(),
});
type TFieldingOpportunity = InferInput<typeof VFieldingOpportunity>;

const VPicklistFieldingPlayType = picklist(["flyOut", "groundOut", "lineOut"]);

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
const VFieldingResult = object({
	idFielder: number(),
	isError: boolean(),
	isSuccess: boolean(),
	position: VPicklistPositions,
	reachTime: number(),
	type: VPicklistFieldingPlayType,
});
type TFieldingResult = InferInput<typeof VFieldingResult>;

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

const VInputSimulateFielding = object({
	ballInPlay: VBallInPlay,
	teamDefenseState: instance(GameSimTeamState),
});

type TInputSimulateFielding = InferInput<typeof VInputSimulateFielding>;

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

const VInputCalculateFieldingDifficulty = object({
	ballInPlay: VBallInPlay,
	fielder: instance(GameSimPlayerState),
	fielderPosition: object({ x: number(), y: number() }),
	finalX: number(),
	finalY: number(),
	isFoul: boolean(),
	parkState: instance(GameSimParkState),
	position: VPicklistPositions,
});
type TInputCalculateFieldingDifficulty = InferInput<
	typeof VInputCalculateFieldingDifficulty
>;

const VInputCalculateDistanceToBoundary = object({
	finalX: number(),
	finalY: number(),
	parkState: instance(GameSimParkState),
});
type TInputCalculateDistanceToBoundary = InferInput<
	typeof VInputCalculateDistanceToBoundary
>;

const VInputCalculateDistanceToSegment = object({
	endX: number(),
	endY: number(),
	finalX: number(),
	finalY: number(),
	startX: number(),
	startY: number(),
});
type TInputCalculateDistanceToSegment = InferInput<
	typeof VInputCalculateDistanceToSegment
>;

const VInputSimulateFieldingAttempt = object({
	opportunity: object({
		difficulty: number(),
		idFielder: number(),
		position: VPicklistPositions,
		reachTime: number(),
		xPos: number(),
		yPos: number(),
	}),
	ballInPlay: VBallInPlay,
});
type TInputSimulateFieldingAttempt = InferInput<
	typeof VInputSimulateFieldingAttempt
>;

const VInputDetermineClosestFielders = object({
	ballInPlay: VBallInPlay,
	teamDefenseState: instance(GameSimTeamState),
});
type TInputDetermineClosestFielders = InferInput<
	typeof VInputDetermineClosestFielders
>;

const VInputSimulateInPlayOutcome = object({
	ballInPlay: VBallInPlay,
	fieldingResult: VFieldingResult,
});
type TInputSimulateInPlayOutcome = InferInput<
	typeof VInputSimulateInPlayOutcome
>;

const VInputFindNearestWallHeight = object({
	finalX: number(),
	finalY: number(),
	parkState: instance(GameSimParkState),
});
type TInputFindNearestWallHeight = InferInput<
	typeof VInputFindNearestWallHeight
>;
const VInputHandleWallBallOutcome = object({
	ballInPlay: VBallInPlay,
	fieldingResult: VFieldingResult,
	wallInteraction: VWallInteraction,
});
type TInputHandleWallBallOutcome = InferInput<
	typeof VInputHandleWallBallOutcome
>;
const VInputHandleNonWallBallOutcome = object({
	ballInPlay: VBallInPlay,
	fieldingResult: VFieldingResult,
});
type TInputHandleNonWallBallOutcome = InferInput<
	typeof VInputHandleNonWallBallOutcome
>;
