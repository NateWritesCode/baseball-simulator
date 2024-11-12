import PageError from "@/components/general/PageError";
import PageLoading from "@/components/general/PageLoading";
import PageNoDataFound from "@/components/general/PageNoDataFound";
import { honoClient } from "@/services/hono";
import type { TApiResponseGetIdPerson } from "@baseball-simulator/utils/types";
import { Card, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ProgressBar, ProgressRoot } from "../ui/progress";

const IdPerson = () => {
	const params = useParams<{ idPerson: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["player", params.idPerson],
		queryFn: async () => {
			try {
				const res = await honoClient.person[":idPerson"].$post({
					json: {
						idPerson: params.idPerson,
					},
					param: {
						idPerson: params.idPerson,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return (await res.json()) as TApiResponseGetIdPerson;
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

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const renderProgressBar = (value: number, max = 1000) => (
		<ProgressRoot value={(value / max) * 100}>
			<ProgressBar />
		</ProgressRoot>
	);

	const person = data;

	// Function to convert 0-1000 scale to realistic human measurements
	const normalizeMetric = (value: number, mean: number, stdDev: number) => {
		// Convert 0-1000 scale to z-score (standard normal distribution)
		const zScore = (value / 1000) * 6 - 3;
		// Convert z-score to actual measurement
		return Number((zScore * stdDev + mean).toFixed(1));
	};

	// Constants for average adult measurements (in cm and kg)
	const AVG_HEIGHT_CM = 170;
	const STD_DEV_HEIGHT_CM = 10;
	const AVG_WEIGHT_KG = 70;
	const STD_DEV_WEIGHT_KG = 15;

	// Calculate normalized height and weight
	const heightCm = normalizeMetric(
		person.physical.height,
		AVG_HEIGHT_CM,
		STD_DEV_HEIGHT_CM,
	);
	const weightKg = normalizeMetric(
		person.physical.weight,
		AVG_WEIGHT_KG,
		STD_DEV_WEIGHT_KG,
	);

	// Convert to imperial units
	const heightFtIn = `${Math.floor(heightCm / 30.48)}' ${Math.round((heightCm % 30.48) / 2.54)}"`;
	const weightLbs = (weightKg * 2.20462).toFixed(1);

	const determineType = () => {
		const types = {
			E:
				person.myersBriggs.extroversion > person.myersBriggs.introversion
					? "E"
					: "I",
			N: person.myersBriggs.intuition > person.myersBriggs.sensing ? "N" : "S",
			F: person.myersBriggs.feeling > person.myersBriggs.thinking ? "F" : "T",
			J: person.myersBriggs.judging > person.myersBriggs.perceiving ? "J" : "P",
		};
		return `${types.E}${types.N}${types.F}${types.J}`;
	};

	interface TypeDescriptions {
		[key: string]: string;
	}

	const getTypeDescription = (type: string): string => {
		const descriptions: TypeDescriptions = {
			ISTJ: "Quiet, serious, earn success by thoroughness and dependability. Practical, matter-of-fact, realistic, and responsible.",
			ISFJ: "Quiet, friendly, responsible, and conscientious. Committed and steady in meeting their obligations.",
			INFJ: "Seek meaning and connection in ideas, relationships, and material possessions. Want to understand what motivates people.",
			INTJ: "Have original minds and great drive for implementing their ideas and achieving their goals.",
			ISTP: "Tolerant and flexible, quiet observers until a problem appears, then act quickly to find workable solutions.",
			ISFP: "Quiet, friendly, sensitive, and kind. Enjoy the present moment, what's going on around them.",
			INFP: "Idealistic, loyal to their values and to people who are important to them. Want an external life that is congruent with their values.",
			INTP: "Seek to develop logical explanations for everything that interests them. Theoretical and abstract.",
			ESTP: "Flexible and tolerant, they take a pragmatic approach focused on immediate results.",
			ESFP: "Outgoing, friendly, and accepting. Exuberant lovers of life, people, and material comforts.",
			ENFP: "Warmly enthusiastic and imaginative. See life as full of possibilities. Make connections between events and information.",
			ENTP: "Quick, ingenious, stimulating, alert, and outspoken. Resourceful in solving new and challenging problems.",
			ESTJ: "Practical, realistic, matter-of-fact. Decisive, quickly move to implement decisions.",
			ESFJ: "Warmhearted, conscientious, and cooperative. Want harmony in their environment.",
			ENFJ: "Warm, empathetic, responsive, and responsible. Highly attuned to the emotions, needs, and motivations of others.",
			ENTJ: "Frank, decisive, assume leadership readily. Quickly see illogical and inefficient procedures and policies.",
		};
		return descriptions[type] || "Description not available.";
	};

	const mbtiType = determineType();
	const description = getTypeDescription(mbtiType);

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Card.Root>
				<Card.Header>
					<Card.Title className="text-2xl font-bold">
						{person.firstName} {person.middleName} {person.lastName}
						{person.nickname && (
							<span className="text-gray-500 ml-2">"{person.nickname}"</span>
						)}
					</Card.Title>
				</Card.Header>
				<Card.Body>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p>
								<strong>Date of Birth:</strong> {formatDate(person.dateOfBirth)}
							</p>
							<p>
								<strong>Birthplace:</strong> {person.birthplace.city.name},{" "}
								{person.birthplace.state.name}, {person.birthplace.country.name}
							</p>
						</div>
					</div>
				</Card.Body>
			</Card.Root>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card.Root>
					<Card.Header>
						<Card.Title>Alignment</Card.Title>
					</Card.Header>
					<Card.Body>
						<Table.Root>
							<Table.Body>
								{Object.entries(person.alignment).map(([key, value]) => (
									<Table.Row key={key}>
										<Table.Cell className="font-medium capitalize">
											{key}
										</Table.Cell>
										<Table.Cell className="w-full">
											{renderProgressBar(value)}
										</Table.Cell>
										<Table.Cell className="text-right">{value}</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Mental Attributes</Card.Title>
					</Card.Header>
					<Card.Body>
						<Table.Root>
							<Table.Body>
								{Object.entries(person.mental).map(([key, value]) => (
									<Table.Row key={key}>
										<Table.Cell className="font-medium capitalize">
											{key}
										</Table.Cell>
										<Table.Cell className="w-full">
											{renderProgressBar(value)}
										</Table.Cell>
										<Table.Cell className="text-right">{value}</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</Card.Body>
				</Card.Root>
				<Card.Root className="w-full max-w-2xl mx-auto">
					<Card.Header>
						<Card.Title>Myers-Briggs Type Indicator (MBTI)</Card.Title>
					</Card.Header>
					<Card.Body>
						<h3 className="text-xl font-bold mb-2">Type: {mbtiType}</h3>
						<p className="text-gray-700">{description}</p>
						<div className="mt-4 grid grid-cols-2 gap-2">
							{Object.entries(person.myersBriggs).map(([key, value]) => (
								<div key={key} className="flex justify-between">
									<span className="font-medium capitalize">{key}:</span>
									<span>{value}</span>
								</div>
							))}
						</div>
					</Card.Body>
				</Card.Root>

				<Card.Root className="w-full max-w-md mx-auto">
					<Card.Header>
						<Card.Title>Physical Attributes</Card.Title>
					</Card.Header>
					<Card.Body>
						<Table.Root>
							<Table.Body>
								<Table.Row>
									<Table.Cell className="font-medium">Height</Table.Cell>
									<Table.Cell>{heightCm} cm</Table.Cell>
									<Table.Cell>{heightFtIn}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell className="font-medium">Weight</Table.Cell>
									<Table.Cell>{weightKg} kg</Table.Cell>
									<Table.Cell>{weightLbs} lbs</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Body>
				</Card.Root>
			</div>
		</div>
	);
};

export default IdPerson;
