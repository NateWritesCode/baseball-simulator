export default async () => {
	const data = await Bun.file(
		"/home/nathanh81/Projects/baseball-simulator/apps/server/src/data/test/simulation.json",
	);

	// Initialize all possible pitch types
	const allPitchTypes = [
		"changeup",
		"curveball",
		"cutter",
		"eephus",
		"fastball",
		"forkball",
		"knuckleball",
		"knuckleCurve",
		"screwball",
		"sinker",
		"slider",
		"slurve",
		"splitter",
		"sweeper",
	];

	// Initialize the test structure with all pitch types
	const tests: any = {
		choosePitch: {
			situationalCounts: {
				fullCount: initializePitchCounts(allPitchTypes),
				strikeoutPitch: initializePitchCounts(allPitchTypes),
				mustThrowStrike: initializePitchCounts(allPitchTypes),
				firstPitch: initializePitchCounts(allPitchTypes),
			},
			fatigueRanges: {
				fresh: initializeFatigueRange(allPitchTypes),
				moderate: initializeFatigueRange(allPitchTypes),
				tired: initializeFatigueRange(allPitchTypes),
				exhausted: initializeFatigueRange(allPitchTypes),
			},
			ratingAnalysis: {
				topPitchUsage: 0,
				secondPitchUsage: 0,
				thirdPitchUsage: 0,
				totalPitches: 0,
				avgRatingOfChosenPitches: 0,
			},
			batterTypeAnalysis: {
				vsHighPower: initializePitchCounts(allPitchTypes),
				vsHighContact: initializePitchCounts(allPitchTypes),
				vsHighEye: initializePitchCounts(allPitchTypes),
				vsHighAvoidK: initializePitchCounts(allPitchTypes),
				vsHighSpeed: initializePitchCounts(allPitchTypes),
			},
			pitchSequences: {
				afterFastball: initializePitchCounts(allPitchTypes),
				afterBreakingBall: initializePitchCounts(allPitchTypes),
				afterOffspeed: initializePitchCounts(allPitchTypes),
			},
			platoonSplits: {
				vsL: initializePitchCounts(allPitchTypes),
				vsR: initializePitchCounts(allPitchTypes),
				vsSwitchHitter: initializePitchCounts(allPitchTypes),
			},
			pitchDistribution: initializePitchCounts(allPitchTypes),
			ratingCorrelation: {
				byPitchType: initializePitchRatingCorrelation(allPitchTypes),
				overallCorrelation: 0,
			},
		},
	};

	const games = await data.json();

	if (games.length > 0) {
		let totalRatingCorrelation = 0;
		let totalPitches = 0;

		for (const game of games) {
			if (game.choosePitch && game.choosePitch.length > 0) {
				let lastPitch = null;

				for (const choice of game.choosePitch) {
					const {
						fatigue,
						playerHitter,
						playerPitcher,
						numBalls,
						numStrikes,
						numOuts,
						numPitchesThrown,
						pitchName,
					} = choice;

					// Update basic pitch distribution
					incrementCount(tests.choosePitch.pitchDistribution, pitchName);

					// Determine fatigue range
					const fatigueRange = getFatigueRange(fatigue.current);

					// Update situational counts
					updateSituationalCounts(tests, choice);

					// Track first pitch tendencies
					if (numBalls === 0 && numStrikes === 0) {
						incrementCount(
							tests.choosePitch.situationalCounts.firstPitch,
							pitchName,
						);
					}

					// Update fatigue analysis
					updateFatigueAnalysis(tests, choice, fatigueRange);

					// Analyze batter types
					updateBatterTypeAnalysis(tests, choice);

					// Track pitch sequences
					if (lastPitch) {
						updatePitchSequences(tests, lastPitch, pitchName);
					}

					// Update platoon splits
					updatePlatoonSplits(tests, choice);

					// Update rating correlation
					updateRatingCorrelation(tests, choice);

					const pitchRating = playerPitcher.pitches[pitchName];
					totalRatingCorrelation += pitchRating;
					totalPitches++;

					lastPitch = pitchName;
				}
			}
		}

		finalizePitchAnalysis(tests, totalRatingCorrelation, totalPitches);
	}

	await Bun.write(
		"/home/nathanh81/Projects/baseball-simulator/apps/server/src/data/test/analyzeSimulation.json",
		JSON.stringify(tests, null, 2),
	);
	console.info("Analyze simulation complete");
};

// Helper functions for initialization
function initializePitchCounts(pitchTypes: string[]): Record<string, number> {
	return pitchTypes.reduce((acc, pitch) => ({ ...acc, [pitch]: 0 }), {});
}

function initializePitchRatingCorrelation(
	pitchTypes: string[],
): Record<string, { totalRating: number; count: number }> {
	return pitchTypes.reduce(
		(acc, pitch) => ({
			...acc,
			[pitch]: { totalRating: 0, count: 0 },
		}),
		{},
	);
}

function initializeFatigueRange(pitchTypes: string[]) {
	return {
		pitchCounts: initializePitchCounts(pitchTypes),
		avgPitchRatings: pitchTypes.reduce(
			(acc, pitch) => ({
				...acc,
				[pitch]: { total: 0, count: 0 },
			}),
			{},
		),
		batterStats: {},
	};
}

// Existing helper functions
function getFatigueRange(fatigue: number): string {
	return fatigue <= 25
		? "fresh"
		: fatigue <= 50
			? "moderate"
			: fatigue <= 75
				? "tired"
				: "exhausted";
}

function updateSituationalCounts(tests: any, choice: any) {
	const { numBalls, numStrikes, pitchName } = choice;

	if (numBalls === 3 && numStrikes === 2) {
		incrementCount(tests.choosePitch.situationalCounts.fullCount, pitchName);
	} else if (numStrikes === 2) {
		incrementCount(
			tests.choosePitch.situationalCounts.strikeoutPitch,
			pitchName,
		);
	} else if (numBalls === 3) {
		incrementCount(
			tests.choosePitch.situationalCounts.mustThrowStrike,
			pitchName,
		);
	}
}

function updateFatigueAnalysis(tests: any, choice: any, fatigueRange: string) {
	const { pitchName, playerPitcher } = choice;
	const rangeData = tests.choosePitch.fatigueRanges[fatigueRange];

	incrementCount(rangeData.pitchCounts, pitchName);

	if (!rangeData.avgPitchRatings[pitchName]) {
		rangeData.avgPitchRatings[pitchName] = { total: 0, count: 0 };
	}
	rangeData.avgPitchRatings[pitchName].total +=
		playerPitcher.pitches[pitchName];
	rangeData.avgPitchRatings[pitchName].count++;
}

function updateBatterTypeAnalysis(tests: any, choice: any) {
	const { pitchName, playerHitter } = choice;
	const { batting, running } = playerHitter;

	if (batting.power > batting.contact * 1.2) {
		incrementCount(tests.choosePitch.batterTypeAnalysis.vsHighPower, pitchName);
	}
	if (batting.contact > batting.power * 1.2) {
		incrementCount(
			tests.choosePitch.batterTypeAnalysis.vsHighContact,
			pitchName,
		);
	}
	if (batting.eye > 70) {
		incrementCount(tests.choosePitch.batterTypeAnalysis.vsHighEye, pitchName);
	}
	if (batting.avoidKs > 70) {
		incrementCount(
			tests.choosePitch.batterTypeAnalysis.vsHighAvoidK,
			pitchName,
		);
	}
	if (running.speed > 70) {
		incrementCount(tests.choosePitch.batterTypeAnalysis.vsHighSpeed, pitchName);
	}
}

function updatePitchSequences(
	tests: any,
	lastPitch: string,
	currentPitch: string,
) {
	const pitchTypes = {
		fastball: ["fastball", "sinker", "cutter"],
		breaking: ["slider", "curveball", "slurve", "sweeper"],
		offspeed: ["changeup", "splitter", "forkball"],
	};

	const lastPitchType = Object.entries(pitchTypes).find(([_, pitches]) =>
		pitches.includes(lastPitch),
	)?.[0];

	if (lastPitchType) {
		const sequenceKey = `after${lastPitchType.charAt(0).toUpperCase() + lastPitchType.slice(1)}`;
		incrementCount(tests.choosePitch.pitchSequences[sequenceKey], currentPitch);
	}
}

function updatePlatoonSplits(tests: any, choice: any) {
	const { pitchName, playerHitter } = choice;
	const bats = playerHitter.player.bats;

	if (bats === "L") {
		incrementCount(tests.choosePitch.platoonSplits.vsL, pitchName);
	} else if (bats === "R") {
		incrementCount(tests.choosePitch.platoonSplits.vsR, pitchName);
	} else {
		incrementCount(tests.choosePitch.platoonSplits.vsSwitchHitter, pitchName);
	}
}

function updateRatingCorrelation(tests: any, choice: any) {
	const { pitchName, playerPitcher } = choice;
	const rating = playerPitcher.pitches[pitchName];

	tests.choosePitch.ratingCorrelation.byPitchType[pitchName].totalRating +=
		rating;
	tests.choosePitch.ratingCorrelation.byPitchType[pitchName].count++;
}

function finalizePitchAnalysis(
	tests: any,
	totalRatingCorrelation: number,
	totalPitches: number,
) {
	// Calculate average ratings
	Object.values(tests.choosePitch.fatigueRanges).forEach((range: any) => {
		Object.entries(range.avgPitchRatings).forEach(
			([pitch, data]: [string, any]) => {
				if (data.count > 0) {
					range.avgPitchRatings[pitch] = data.total / data.count;
				}
			},
		);
	});

	// Calculate rating correlations
	Object.entries(tests.choosePitch.ratingCorrelation.byPitchType).forEach(
		([pitch, data]: [string, any]) => {
			if (data.count > 0) {
				tests.choosePitch.ratingCorrelation.byPitchType[pitch] =
					data.totalRating / data.count;
			}
		},
	);

	if (totalPitches > 0) {
		tests.choosePitch.ratingCorrelation.overallCorrelation =
			totalRatingCorrelation / totalPitches;
	}
}

function incrementCount(obj: any, key: string) {
	if (obj && typeof obj === "object") {
		obj[key] = (obj[key] || 0) + 1;
	}
}
