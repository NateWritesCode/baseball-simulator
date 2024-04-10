import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import SimulateButton from "./SimulateButton";

test("renders SimulateButton component", () => {
   render(<SimulateButton />);

   const buttonElement = screen.getByText(/simulate/i);
   expect(buttonElement.innerText).toEqual("Simulate");
});
