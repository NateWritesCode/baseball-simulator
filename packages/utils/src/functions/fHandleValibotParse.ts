import { type BaseIssue, type BaseSchema, safeParse } from "valibot";

const handleValibotParse = <T>(_input: {
	// biome-ignore lint/suspicious/noExplicitAny: Accept any schema
	schema: BaseSchema<any, T, any>;
	data: unknown;
}) => {
	// Create a new Error to access the stack trace
	const err = new Error();
	const stack = err.stack?.split("\n");
	const callerInfo =
		stack && stack.length > 2 ? stack[2].trim() : "No caller info";
	const errors = [`Valibot parse error at ${callerInfo}`];

	const { schema, data } = _input;

	const _output = safeParse(schema, data);

	if (!_output.success) {
		if (Array.isArray(_output.issues)) {
			for (const _issue of _output.issues) {
				// biome-ignore lint/suspicious/noExplicitAny: Accept any schema
				const issue = _issue as BaseIssue<any>;

				if (issue?.path) {
					const path = issue.path;

					for (const pathItem of path) {
						errors.push(`Valibot type: ${pathItem.type}`);

						if (pathItem.key) {
							errors.push(`Valibot key: ${pathItem.key}`);
						}
					}
				}

				errors.push(
					`Valibot expected: ${issue.expected} got: ${issue.received}`,
				);
			}
		}

		console.error(JSON.stringify(errors, null, 2));

		return [null, errors] as const;
	}

	return [_output.output, null] as [T, null];
};

export default handleValibotParse;
