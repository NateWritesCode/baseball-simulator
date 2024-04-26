import { expect, test } from "bun:test";
import { SimulateButton } from "@/components/simulation";
import { render, screen } from "@testing-library/react";

test("renders SimulateButton component", () => {
   render(<SimulateButton />);

   const buttonElement = screen.getByText(/simulate/i);
   expect(buttonElement.innerText).toEqual("Simulate");
});
