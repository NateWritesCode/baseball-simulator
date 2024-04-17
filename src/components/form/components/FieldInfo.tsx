import type { FieldApi } from "@tanstack/react-form";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const FieldInfo = ({ field }: { field: FieldApi<any, any, any, any> }) => {
   return (
      <>
         {field.state.meta.touchedErrors ? (
            <em>{field.state.meta.touchedErrors}</em>
         ) : null}
         {field.state.meta.isValidating ? "Validating..." : null}
      </>
   );
};

export default FieldInfo;
