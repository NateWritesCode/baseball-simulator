import { Button, Input } from "@baseball-simulator/components/ui";
import { generalStore } from "@baseball-simulator/services/generalStore";
import DbClient from "@baseball-simulator/utils/db/DbClient";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-store";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { excludes, minLength, string } from "valibot";
import { FieldInfo } from "../components";

const FormNewGame = () => {
   const gameNames = useStore(generalStore, (state) => state.gameNames);

   const form = useForm({
      defaultValues: {
         name: "",
      },
      onSubmit: async ({ value, formApi }) => {
         const { name } = value;
         const dbClient = new DbClient({
            name,
         });

         await dbClient.init();

         generalStore.setState((state) => {
            return {
               ...state,
               dbClient,
               gameNames: [...state.gameNames, name],
            };
         });

         formApi.reset();
      },
      // Add a validator to support Valibot usage in Form and Field
      validatorAdapter: valibotValidator,
   });

   return (
      <form
         onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
         }}
      >
         <div>
            <form.Field
               name="name"
               validators={{
                  onChange: string([
                     minLength(1, "Name must be at least 1 character"),
                     ...gameNames.map((gameName) => {
                        if (!gameName) {
                           throw new Error("gameName is not defined");
                        }

                        return excludes<string, typeof gameName>(
                           gameName,
                           `Name cannot be '${gameName}'. It already exists in the database.`,
                        );
                     }),
                  ]),
               }}
               children={(field) => {
                  return (
                     <>
                        <label htmlFor={field.name}>Name:</label>
                        <Input
                           id={field.name}
                           name={field.name}
                           value={field.state.value}
                           onBlur={field.handleBlur}
                           onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                     </>
                  );
               }}
            />
         </div>
         <div>
            <form.Subscribe
               selector={(state) => [state.canSubmit, state.isSubmitting]}
               children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                     {isSubmitting ? "..." : "Submit"}
                  </Button>
               )}
            />
         </div>
      </form>
   );
};

export default FormNewGame;
