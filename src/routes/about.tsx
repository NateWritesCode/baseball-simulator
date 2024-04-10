import { createFileRoute } from "@tanstack/react-router";

const About = () => {
  return (
    <div>About</div>
  )
}

export default About;

export const Route = createFileRoute("/about")({
    component: () => <About />,
 });
 