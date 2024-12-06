export default async () => {
	const data = await Bun.file(
		"/home/nathanh81/Projects/baseball-simulator/apps/server/src/data/test/simulation.json",
	);

	// Initialize the test structure with all pitch types
	const tests: any = {
		choosePitch: {},
	};

	const games = await data.json();

	if (!games || games.length === 0) {
		throw new Error("No games found in simulation data");
	}

	for (const game of games) {
		if (game.choosePitch && game.choosePitch.length > 0) {
		}
	}

	await Bun.write(
		"/home/nathanh81/Projects/baseball-simulator/apps/server/src/data/test/analyzeSimulation.json",
		JSON.stringify(tests, null, 2),
	);
	console.info("Analyze simulation complete");
};
