import { honoClient } from "@/services/hono";
import type { TApiResponseGetStandings } from "@baseball-simulator/utils/types";
import { Box, Card, Container, Flex, Heading, Table } from "@chakra-ui/react";
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

	const directionOrder = ["E", "NE", "N", "NW", "SE", "S", "SW", "W"];

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
		const middleIndex = Math.floor(directionOrder.length / 2);

		const divisionKeys = Object.keys(divisions).sort((a, b) => {
			const aDir = divisions[a][0]?.division?.direction;
			const bDir = divisions[b][0]?.division?.direction;

			// If neither has a direction, sort alphabetically
			if (!aDir && !bDir) return a.localeCompare(b);

			// Compare with middle index when one direction is missing
			if (!aDir) return middleIndex - directionOrder.indexOf(bDir || "");
			if (!bDir) return directionOrder.indexOf(aDir) - middleIndex;

			const aIndex = directionOrder.indexOf(aDir);
			const bIndex = directionOrder.indexOf(bDir);

			return aIndex - bIndex;
		});

		for (const key of divisionKeys) {
			sortedDivisions[key] = divisions[key];
		}
		organized[subLeague] = sortedDivisions;
	}

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

			// If either has no direction, put it in the middle
			if (!aDir && !bDir) return a.localeCompare(b);
			if (!aDir) return 0; // Middle
			if (!bDir) return 0; // Middle

			// If both have direction, sort by the order array
			const aIndex = directionOrder.indexOf(aDir);
			const bIndex = directionOrder.indexOf(bDir);

			// If direction isn't in our order array, treat it as middle
			if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
			if (aIndex === -1) return 0;
			if (bIndex === -1) return 0;

			return aIndex - bIndex;
		});

		for (const key of divisionKeys) {
			sortedDivisions[key] = divisions[key];
		}
		organized[subLeague] = sortedDivisions;
	}

	return (
		<Container maxW="breakpoint-xl" py="5">
			<Heading as="h2" fontSize="xx-large" my="3">
				{leagueName}
			</Heading>
			<Flex gap="4" flexDir={["column", "column", "column", "row"]}>
				{Object.entries(organized).map(([subLeagueName, divisions]) => (
					<Box key={subLeagueName} flex="1">
						<Card.Root>
							<Card.Header>
								<Card.Title>{subLeagueName}</Card.Title>
							</Card.Header>
							<Card.Body>
								<Box>
									{Object.entries(divisions).map(([divisionName, teams]) => (
										<Box key={divisionName} my="2">
											<Heading as="h4" my="2">
												{divisionName}{" "}
												{teams[0]?.division?.direction
													? `(${teams[0].division.direction})`
													: ""}
											</Heading>
											<Table.Root striped>
												<Table.Header>
													<Table.Row>
														<Table.ColumnHeader>Team</Table.ColumnHeader>
														<Table.ColumnHeader>W</Table.ColumnHeader>
														<Table.ColumnHeader>L</Table.ColumnHeader>
														<Table.ColumnHeader>PCT</Table.ColumnHeader>
													</Table.Row>
												</Table.Header>
												<Table.Body>
													{teams.map((team) => (
														<Table.Row key={team.idTeam}>
															<Table.Cell className="font-medium">
																{team.city.name} {team.nickname}
															</Table.Cell>
															<Table.Cell>{team.w}</Table.Cell>
															<Table.Cell>{team.l}</Table.Cell>
															<Table.Cell>
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
										</Box>
									))}
								</Box>
							</Card.Body>
						</Card.Root>
					</Box>
				))}
			</Flex>
		</Container>
	);
};

export default Standings;
