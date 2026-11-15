import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Stepper } from "./Stepper";

describe("Stepper", () => {
  it("＋を押すと onIncrement だけが引数なしで呼ばれる", () => {
    const onIncrement = vi.fn<() => void>();
    const onDecrement = vi.fn<() => void>();
    render(<Stepper name="回数" num={1} onIncrement={onIncrement} onDecrement={onDecrement} />);
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(onIncrement).toHaveBeenCalledWith();
    expect(onDecrement).not.toHaveBeenCalled();
  });

  it("−を押すと onDecrement だけが引数なしで呼ばれる", () => {
    const onIncrement = vi.fn<() => void>();
    const onDecrement = vi.fn<() => void>();
    render(<Stepper name="回数" num={1} onIncrement={onIncrement} onDecrement={onDecrement} />);
    fireEvent.click(screen.getByRole("button", { name: "−" }));
    expect(onDecrement).toHaveBeenCalledWith();
    expect(onIncrement).not.toHaveBeenCalled();
  });

  it("0のときは−を押せない", () => {
    const onDecrement = vi.fn<() => void>();
    render(
      <Stepper name="回数" num={0} onIncrement={vi.fn<() => void>()} onDecrement={onDecrement} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "−" }));
    expect(onDecrement).not.toHaveBeenCalled();
  });
});
