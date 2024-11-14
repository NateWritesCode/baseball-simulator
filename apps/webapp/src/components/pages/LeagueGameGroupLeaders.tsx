import PageError from "@/components/general/PageError";
import PageLoading from "@/components/general/PageLoading";
import PageNoDataFound from "@/components/general/PageNoDataFound";
import { honoClient } from "@/services/hono";
import type { TApiResponsePostIdLeagueIdGameGroupLeaders } from "@baseball-simulator/utils/types";
import { Box, Grid, Heading, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";

type TStatType = TApiResponsePostIdLeagueIdGameGroupLeaders[number]["statType"];

const formatStatValue = (statType: TStatType, value: number) => {
	switch (statType) {
		case "avg":
			return value.toFixed(3).replace(/^0/, "");
		case "bb/9":
		case "k/9":
		case "k/bb":
			return value.toFixed(2);
		case "era":
			return value.toFixed(2);
		default:
			return Math.round(value);
	}
};

const getStatTitle = (statType: TStatType) => {
	const titles = {
		avg: "Batting Average",
		"bb/9": "Walks per 9",
		era: "Earned Run Average",
		hr: "Home Runs",
		"k/9": "Strikeouts per 9",
		"k/bb": "Strikeout to Walk Ratio",
		rbi: "Runs Batted In",
		sb: "Stolen Bases",
	};
	return titles[statType] || statType.toUpperCase();
};

const LeagueGameGroupLeaders = () => {
	const params = useParams<{ idLeague: string; idGameGroup: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: [
			"league",
			params.idLeague,
			"gameGroup",
			params.idGameGroup,
			"leaders",
		],
		queryFn: async () => {
			try {
				const res = await honoClient.league[":idLeague"].gameGroup[
					":idGameGroup"
				].leaders.$post({
					json: {
						idGameGroup: params.idGameGroup,
						idLeague: params.idLeague,
					},
					param: {
						idGameGroup: params.idGameGroup,
						idLeague: params.idLeague,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return (await res.json()) as TApiResponsePostIdLeagueIdGameGroupLeaders;
			} catch (error) {
				console.error("error", error);
				throw new Error("There was an error fetching the data");
			}
		},
		retry: 0,
	});

	const isNoDataFound = !data;

	if (isError) {
		return <PageError error={error.message} />;
	}

	if (isLoading) {
		return <PageLoading />;
	}

	if (isNoDataFound) {
		return <PageNoDataFound />;
	}

	const groupedData = data.reduce<{
		[K in TApiResponsePostIdLeagueIdGameGroupLeaders[number]["statType"]]?: TApiResponsePostIdLeagueIdGameGroupLeaders;
	}>((acc, item) => {
		if (!acc[item.statType]) {
			acc[item.statType] = [];
		}
		acc[item.statType]?.push(item);
		return acc;
	}, {});

	return (
		<Box p="4">
			<Heading mb={6} size="lg">
				League Leaders
			</Heading>
			<Grid
				gap={6}
				templateColumns={{
					base: "1fr", // 1 column on mobile
					md: "repeat(2, 1fr)", // 2 columns on medium screens
					lg: "repeat(3, 1fr)", // 3 columns on large screens
				}}
			>
				{Object.entries(groupedData)
					.sort()
					.map(([statType, leaders]) => (
						<Box
							key={statType}
							borderRadius="md"
							flex="1"
							minW="300px"
							p={4}
							shadow="md"
						>
							<Heading mb={4} size="md">
								{getStatTitle(statType as TStatType)}
							</Heading>
							<Table.Root size="sm">
								<Table.Header>
									<Table.Row>
										<Table.ColumnHeader textAlign="center" width="40px">
											#
										</Table.ColumnHeader>
										<Table.ColumnHeader>Player</Table.ColumnHeader>
										<Table.ColumnHeader>Team</Table.ColumnHeader>
										<Table.ColumnHeader>
											{statType.toUpperCase()}
										</Table.ColumnHeader>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{leaders?.map((leader) => (
										<Table.Row key={`${leader.idPerson}-${statType}`}>
											<Table.Cell textAlign="center">
												{leader.numRank}
											</Table.Cell>
											<Table.Cell>
												<Link href={`/person/${leader.idPerson}`}>
													{leader.firstName} {leader.lastName}
												</Link>
											</Table.Cell>
											<Table.Cell>
												<Link href={`/team/${leader.team.idTeam}`}>
													{leader.team.city.name} {leader.team.nickname}
												</Link>
											</Table.Cell>
											<Table.Cell>
												{formatStatValue(leader.statType, leader.statValue)}
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Root>
						</Box>
					))}
			</Grid>
		</Box>
	);
};

export default LeagueGameGroupLeaders;
