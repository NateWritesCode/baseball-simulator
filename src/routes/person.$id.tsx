import { generalStore } from "@/services/generalStore";
import { getPrettyText } from "@/utils/functions";
import { ArtPerson } from "@/utils/svg";
import {
   createFileRoute,
   redirect,
   useLoaderData,
} from "@tanstack/react-router";
import { css } from "styled-system/css";
import { Box, Center, Container, Grid } from "styled-system/jsx";

const tableWrapper = css({
   width: "100%",
   overflowX: "auto",
   height: "100%",
});

const table = css({
   width: "100%",
   borderCollapse: "collapse",
   height: "100%",
});

const tableHeadandCell = css({
   textAlign: "left",
   border: "1px solid #aaa",
   padding: "2",
});

const Person = () => {
   const { person } = useLoaderData({ from: "/person/$id" });

   return (
      <Container my="5">
         <Grid columns={3} gap="5">
            <Center bg="slate.100" border="1px solid #bbb">
               <ArtPerson />
            </Center>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           General
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person)
                        .filter(
                           (key) =>
                              key !== "alignment" &&
                              key !== "myersBriggs" &&
                              key !== "birthplace" &&
                              key !== "currentPhysical" &&
                              key !== "currentSkillMental" &&
                              key !== "currentSkillPhysical" &&
                              key !== "potentialSkillPhysical" &&
                              key !== "potentialSkillMental",
                        )
                        .map((key) => {
                           const _key = key as keyof typeof person;
                           return (
                              <tr key={_key}>
                                 <th className={tableHeadandCell}>
                                    {getPrettyText(_key)}
                                 </th>
                                 <td className={tableHeadandCell}>
                                    {person[_key] as string}
                                 </td>
                              </tr>
                           );
                        })}
                  </tbody>
               </table>
            </div>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           Alignment
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person.alignment).map((key) => {
                        const _key = key as keyof typeof person.alignment;

                        return (
                           <tr key={_key}>
                              <th className={tableHeadandCell}>
                                 {getPrettyText(_key)}
                              </th>
                              <td className={tableHeadandCell}>
                                 {person.alignment[_key]}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           Myers Briggs
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person.myersBriggs).map((key) => {
                        const _key = key as keyof typeof person.myersBriggs;

                        return (
                           <tr key={_key}>
                              <th className={tableHeadandCell}>
                                 {getPrettyText(_key)}
                              </th>
                              <td className={tableHeadandCell}>
                                 {person.myersBriggs[_key]}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           Birthplace
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person.birthplace).map((key) => {
                        const _key = key as keyof typeof person.birthplace;

                        return (
                           <tr key={_key}>
                              <th className={tableHeadandCell}>
                                 {getPrettyText(_key)}
                              </th>
                              <td className={tableHeadandCell}>
                                 {person.birthplace[_key]}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           Current Physical
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person.currentPhysical).map((key) => {
                        const _key = key as keyof typeof person.currentPhysical;

                        return (
                           <tr key={_key}>
                              <th className={tableHeadandCell}>
                                 {getPrettyText(_key)}
                              </th>
                              <td className={tableHeadandCell}>
                                 {person.currentPhysical[_key]}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           Current Skill Mental
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person.currentSkillMental).map((key) => {
                        const _key =
                           key as keyof typeof person.currentSkillMental;

                        return (
                           <tr key={_key}>
                              <th className={tableHeadandCell}>
                                 {getPrettyText(_key)}
                              </th>
                              <td className={tableHeadandCell}>
                                 {person.currentSkillMental[_key]}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           Current Skill Physical
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person.currentSkillPhysical).map((key) => {
                        const _key =
                           key as keyof typeof person.currentSkillPhysical;

                        return (
                           <tr key={_key}>
                              <th className={tableHeadandCell}>
                                 {getPrettyText(_key)}
                              </th>
                              <td className={tableHeadandCell}>
                                 {person.currentSkillPhysical[_key]}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           Potential Skill Mental
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person.potentialSkillMental).map((key) => {
                        const _key =
                           key as keyof typeof person.potentialSkillMental;

                        return (
                           <tr key={_key}>
                              <th className={tableHeadandCell}>
                                 {getPrettyText(_key)}
                              </th>
                              <td className={tableHeadandCell}>
                                 {person.potentialSkillMental[_key]}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            <div className={tableWrapper}>
               <table className={table}>
                  <thead>
                     <tr>
                        <th className={tableHeadandCell} colSpan={2}>
                           Potential Skill Physical
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.keys(person.currentSkillPhysical).map((key) => {
                        const _key =
                           key as keyof typeof person.potentialSkillPhysical;

                        return (
                           <tr key={_key}>
                              <th className={tableHeadandCell}>
                                 {getPrettyText(_key)}
                              </th>
                              <td className={tableHeadandCell}>
                                 {person.potentialSkillPhysical[_key]}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </Grid>
      </Container>
   );
};

export const Route = createFileRoute("/person/$id")({
   loader: ({ params }) => {
      if (!generalStore.state.dbClient) {
         throw redirect({
            to: "/",
         });
      }

      return generalStore.state.dbClient.person({ id: params.id });
   },
   component: Person,
});
