import { GameSim } from "@baseball-simulator/utils/entities";

export interface WorkerData {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	game: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	teams: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	park: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	umpires: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	wallSegments: any;
}

self.onmessage = (event: MessageEvent<WorkerData>) => {
	const { game, teams, park, umpires, wallSegments } = event.data;

	const gameSim = new GameSim({
		dateTime: game.dateTime,
		idGame: game.idGame,
		idGameGroup: game.idGameGroup,
		park: {
			...park,
			wallSegments,
		},
		teams,
		umpires,
	});

	const result = gameSim.simulate();

	self.postMessage(result);
};
