import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("機種名と、各カウンターがすべて表示される", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("カバネリ");
    for (const name of ["無名", "生駒", "通常周期の非当選カウント", "下段ベル"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });
});
