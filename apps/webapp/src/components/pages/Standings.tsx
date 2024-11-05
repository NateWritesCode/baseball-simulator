import type { TApiResponseGetStandings } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@webapp/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@webapp/components/ui/table";
import { honoClient } from "@webapp/services/hono";
import { useParams } from "wouter";
import PageError from "../general/PageError";
import PageLoading from "../general/PageLoading";
import PageNoDataFound from "../general/PageNoDataFound";

type Team = TApiResponseGetStandings[number];

type OrganizedTeams = {
	[league: string]: {
		[subLeague: string]: {
			[division: string]: Team[];
		};
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

	// First organize by league
	for (const team of data) {
		const leagueName = team.league.name;
		const subLeagueName = team.subLeague.name;
		const divisionName = team.division?.name || "No Division";

		organized[leagueName] = organized[leagueName] || {};
		organized[leagueName][subLeagueName] =
			organized[leagueName][subLeagueName] || {};
		organized[leagueName][subLeagueName][divisionName] =
			organized[leagueName][subLeagueName][divisionName] || [];

		organized[leagueName][subLeagueName][divisionName].push(team);
	}

	// Sort divisions by direction if available (East to West, North to South)
	const directionOrder = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];

	// Sort teams within each division
	for (const league in organized) {
		for (const subLeague in organized[league]) {
			const divisions = organized[league][subLeague];

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
			organized[league][subLeague] = sortedDivisions;
		}
	}

	return (
		<div className="container mx-auto">
			<div className="flex flex-col md:flex-row gap-8">
				{Object.entries(organized).map(([leagueName, subLeagues]) => (
					<div key={leagueName} className="flex-1">
						<Card>
							<CardHeader>
								<CardTitle>{leagueName}</CardTitle>
							</CardHeader>
							<CardContent>
								{Object.entries(subLeagues).map(
									([subLeagueName, divisions]) => (
										<div key={subLeagueName}>
											<h3 className="text-lg font-semibold mb-4">
												{subLeagueName}
											</h3>
											<div className="space-y-6">
												{Object.entries(divisions).map(
													([divisionName, teams]) => (
														<div key={divisionName}>
															<h4 className="text-sm font-medium mb-2">
																{divisionName}{" "}
																{teams[0]?.division?.direction
																	? `(${teams[0].division.direction})`
																	: ""}
															</h4>
															<Table>
																<TableHeader>
																	<TableRow>
																		<TableHead>Team</TableHead>
																		<TableHead className="text-right">
																			W
																		</TableHead>
																		<TableHead className="text-right">
																			L
																		</TableHead>
																		<TableHead className="text-right">
																			PCT
																		</TableHead>
																	</TableRow>
																</TableHeader>
																<TableBody>
																	{teams.map((team) => (
																		<TableRow key={team.idTeam}>
																			<TableCell className="font-medium">
																				{team.city.name} {team.nickname}
																			</TableCell>
																			<TableCell className="text-right">
																				{team.w}
																			</TableCell>
																			<TableCell className="text-right">
																				{team.l}
																			</TableCell>
																			<TableCell className="text-right">
																				{team.w + team.l === 0
																					? ".000"
																					: calculatePct(team.w, team.l)
																							.toFixed(3)
																							.substring(1)}
																			</TableCell>
																		</TableRow>
																	))}
																</TableBody>
															</Table>
														</div>
													),
												)}
											</div>
										</div>
									),
								)}
							</CardContent>
						</Card>
					</div>
				))}
			</div>
		</div>
	);
};

export default Standings;
