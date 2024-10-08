import { VFormSchemaExplore } from "@baseball-simulator/utils/types";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@webapp/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@webapp/components/ui/select";
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
		<div>
			<div>Explore</div>
			<div className=" max-w-md">
				<Form {...form}>
					<form className="space-y-8">
						<FormField
							control={form.control}
							name="typeExplore"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Explore type</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a verified email to display" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="person">Person</SelectItem>
													<SelectItem value="player">Player</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								);
							}}
						/>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Explore;
