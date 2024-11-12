import { honoClient } from "@/services/hono";
import type { TApiResponseGetStandings } from "@baseball-simulator/utils/types";
import { Card, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import PageError from "../general/PageError";
import PageLoading from "../general/PageLoading";
import PageNoDataFound from "../general/PageNoDataFound";

type Team = TApiResponseGetStandings[number];

type OrganizedTeams = {
	[subLeague: string]: {
		[division: string]: Team[];
	};
};

const calculatePct = (w: number, l: number): number => {
	if (w + l === 0) return 0;
	return w / (w + l);
};

const Standings = () => {
	const params = useParams<{ idGameGroup: string }>();

	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["standings", params.idGameGroup],
		queryFn: async () => {
			try {
				const res = await honoClient.standings[":idGameGroup"].$post({
					json: {
						idGameGroup: params.idGameGroup,
					},
					param: {
						idGameGroup: params.idGameGroup,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return (await res.json()) as TApiResponseGetStandings;
			} catch (error) {
				console.error("error", error);
				throw new Error("There was an error fetching the data");
			}
		},
		retry: 0,
	});

	const isNoDataFound = !data || data.length === 0;

	if (isError) {
		return <PageError error={error.message} />;
	}

	if (isLoading) {
		return <PageLoading />;
	}

	if (isNoDataFound) {
		return <PageNoDataFound />;
	}

	const organized: OrganizedTeams = {};
	let leagueName = "";

	// First organize by subLeague
	for (const team of data) {
		leagueName = team.league.name;
		const subLeagueName = team.subLeague.name;
		const divisionName = team.division?.name || "No Division";

		organized[subLeagueName] = organized[subLeagueName] || {};
		organized[subLeagueName][divisionName] =
			organized[subLeagueName][divisionName] || [];

		organized[subLeagueName][divisionName].push(team);
	}

	// Sort divisions by direction if available (East to West, North to South)
	const directionOrder = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];

	// Sort teams within each division
	for (const subLeague in organized) {
		const divisions = organized[subLeague];

		for (const division in divisions) {
			divisions[division].sort((a, b) => {
				// First sort by win percentage
				const pctA = calculatePct(a.w, a.l);
				const pctB = calculatePct(b.w, b.l);

				if (pctB !== pctA) return pctB - pctA;

				// If win percentages are equal, sort by city name
				return a.city.name.localeCompare(b.city.name);
			});
		}

		// Sort divisions by direction
		const sortedDivisions: { [division: string]: Team[] } = {};
		const divisionKeys = Object.keys(divisions).sort((a, b) => {
			const aDir = divisions[a][0]?.division?.direction;
			const bDir = divisions[b][0]?.division?.direction;
			if (!aDir && !bDir) return a.localeCompare(b);
			if (!aDir) return 1;
			if (!bDir) return -1;
			return directionOrder.indexOf(aDir) - directionOrder.indexOf(bDir);
		});

		for (const key of divisionKeys) {
			sortedDivisions[key] = divisions[key];
		}
		organized[subLeague] = sortedDivisions;
	}

	return (
		<div className="container mx-auto">
			<h2 className="text-2xl font-bold mb-6 text-center">{leagueName}</h2>
			<div className="flex flex-col md:flex-row gap-8">
				{Object.entries(organized).map(([subLeagueName, divisions]) => (
					<div key={subLeagueName} className="flex-1">
						<Card.Root>
							<Card.Header>
								<Card.Title>{subLeagueName}</Card.Title>
							</Card.Header>
							<Card.Body>
								<div className="space-y-6">
									{Object.entries(divisions).map(([divisionName, teams]) => (
										<div key={divisionName}>
											<h4 className="text-sm font-medium mb-2">
												{divisionName}{" "}
												{teams[0]?.division?.direction
													? `(${teams[0].division.direction})`
													: ""}
											</h4>
											<Table.Root>
												<Table.Header>
													<Table.Row>
														<Table.ColumnHeader>Team</Table.ColumnHeader>
														<Table.ColumnHeader className="text-right">
															W
														</Table.ColumnHeader>
														<Table.ColumnHeader className="text-right">
															L
														</Table.ColumnHeader>
														<Table.ColumnHeader className="text-right">
															PCT
														</Table.ColumnHeader>
													</Table.Row>
												</Table.Header>
												<Table.Body>
													{teams.map((team) => (
														<Table.Row key={team.idTeam}>
															<Table.Cell className="font-medium">
																{team.city.name} {team.nickname}
															</Table.Cell>
															<Table.Cell className="text-right">
																{team.w}
															</Table.Cell>
															<Table.Cell className="text-right">
																{team.l}
															</Table.Cell>
															<Table.Cell className="text-right">
																{team.w + team.l === 0
																	? ".000"
																	: calculatePct(team.w, team.l)
																			.toFixed(3)
																			.substring(1)}
															</Table.Cell>
														</Table.Row>
													))}
												</Table.Body>
											</Table.Root>
										</div>
									))}
								</div>
							</Card.Body>
						</Card.Root>
					</div>
				))}
			</div>
		</div>
	);
};

export default Standings;
