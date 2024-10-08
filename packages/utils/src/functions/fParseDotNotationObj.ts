// biome-ignore lint/suspicious/noExplicitAny: Okay, this is a utility function that is meant to be used in a variety of contexts
export default ({ data }: { data: Record<string, any> }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Okay, this is a utility function that is meant to be used in a variety of contexts
	const result: Record<string, any> = {};

	for (const [key, value] of Object.entries(data)) {
		if (key.includes(".")) {
			const keys = key.split(".");
			let current = result;
			for (let i = 0; i < keys.length - 1; i++) {
				if (!(keys[i] in current)) {
					current[keys[i]] = {};
				}
				current = current[keys[i]];
			}
			current[keys[keys.length - 1]] = value;
		} else {
			result[key] = value;
		}
	}

	return result;
};
