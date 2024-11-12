import { VFormSchemaExplore } from "@baseball-simulator/utils/types";
import { Box } from "@chakra-ui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

const DEFAULT_VALUES = {
	typeExplore: "person",
};

const Explore = () => {
	const form = useForm({
		defaultValues: {
			typeExplore: "person",
		},
		resolver: valibotResolver(VFormSchemaExplore),
	});

	return (
		<Box>
			<Box>Explore</Box>
			<Box className="max-w-md">
				{/* <Form {...form}>
					<form className="space-y-8" {...form.formProps}>
						<FormField
							control={form.control}
							name="typeExplore"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Explore type</FormLabel>
										<FormControl>
											<SelectRoot
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValueText placeholder="Select a verified email to display" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="person">Person</SelectItem>
													<SelectItem value="player">Player</SelectItem>
												</SelectContent>
											</SelectRoot>
										</FormControl>
									</FormItem>
								);
							}}
						/>
					</form>
				</Form> */}
			</Box>
		</Box>
	);
};

export default Explore;
