import { Button, Input } from "@baseball-simulator/components/ui";
import { generalStore } from "@baseball-simulator/services/generalStore";
import DbClient from "@baseball-simulator/utils/db/DbClient";
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useEffect, useState } from "react";
import { excludes, minLength, string } from "valibot";
import { FieldInfo } from "../components";

const FormNewGame = () => {
   const [dbList, setDbList] = useState<IDBDatabaseInfo[] | null>(null);

   useEffect(() => {
      const callAsync = async () => {
         const dbList = await indexedDB.databases();

         console.log("dbList", dbList);

         setDbList(dbList);
      };
      callAsync();
   }, []);

   const form = useForm({
      defaultValues: {
         name: "",
      },
      onSubmit: async ({ value }) => {
         // Do something with form data

         const dbClient = new DbClient({
            name: value.name,
         });

         await dbClient.init();

         generalStore.setState((state) => {
            return {
               ...state,
               dbClient,
            };
         });
      },
      // Add a validator to support Valibot usage in Form and Field
      validatorAdapter: valibotValidator,
   });

   if (!dbList) {
      return <div>Loading...</div>;
   }

   const dbNames = dbList.map((db) => db.name);

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
                     ...dbNames.map((dbName) => {
                        if (!dbName) {
                           throw new Error("dbName is not defined");
                        }

                        return excludes<string, typeof dbName>(
                           dbName,
                           `Name cannot be '${dbName}'. It already exists in the database.`,
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
