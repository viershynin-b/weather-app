import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";


import MainHeader from "../UI/MainHeader";

describe("Test Index component", () => {
  render(<MainHeader />);

  test("It should render open weather header text", () => {
    const text = screen.getByLabelText("OpenWeather");
    expect(text).toBeInTheDocument();
  });
});
