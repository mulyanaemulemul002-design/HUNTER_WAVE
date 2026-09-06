import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BeginnerMode from "./BeginnerMode";

const STORAGE_KEY = "dropmylink_beginner_progress_v1";
const FOUNDATION_IDS = ["web-evolution", "crypto", "airdrop"];

function seedQuestMode(overrides = {}) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      completed: {},
      currentLesson: {},
      lastModule: "web3",
      foundationCompletedIds: FOUNDATION_IDS,
      ...overrides,
    }),
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  window.localStorage.clear();
});

describe("BeginnerMode progress", () => {
  it("keeps completed lessons when moving forward and returning to an earlier lesson", () => {
    seedQuestMode();
    render(<BeginnerMode onExit={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Web2 vs Web3" })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-complete-beginner-web3-1"));
    fireEvent.click(screen.getByTestId("button-beginner-lesson-web3-2"));

    expect(screen.getByRole("heading", { name: "Blockchain secara sederhana" })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toMatchObject({
      completed: { web3: [0] },
      currentLesson: { web3: 1 },
      lastModule: "web3",
    });

    fireEvent.click(screen.getByTestId("button-beginner-lesson-back"));

    expect(screen.getByRole("heading", { name: "Web2 vs Web3" })).toBeInTheDocument();
    expect(screen.getByTestId("button-complete-beginner-web3-1")).toHaveTextContent("Lesson selesai");
  });

  it("restores the last lesson and completed progress after remounting", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completed: { web3: [0] },
        currentLesson: { web3: 1 },
        lastModule: "web3",
        foundationCompletedIds: FOUNDATION_IDS,
      }),
    );

    const firstRender = render(<BeginnerMode onExit={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Blockchain secara sederhana" })).toBeInTheDocument();
    expect(screen.getByTestId("button-complete-beginner-web3-2")).toHaveTextContent("Tandai lesson selesai");

    firstRender.unmount();
    render(<BeginnerMode onExit={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Blockchain secara sederhana" })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-beginner-lesson-web3-1"));

    expect(screen.getByRole("heading", { name: "Web2 vs Web3" })).toBeInTheDocument();
    expect(screen.getByTestId("button-complete-beginner-web3-1")).toHaveTextContent("Lesson selesai");
  });

  it("starts safely when progress storage contains malformed JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not-valid-json");

    expect(() => render(<BeginnerMode onExit={vi.fn()} />)).not.toThrow();
    expect(screen.getByRole("heading", { name: "Apa itu Web3?" })).toBeInTheDocument();
  });

  it("clamps an invalid saved lesson index instead of crashing", () => {
    seedQuestMode({
      completed: { web3: ["0", -1, 99] },
      currentLesson: { web3: -1 },
    });

    expect(() => render(<BeginnerMode onExit={vi.fn()} />)).not.toThrow();
    expect(screen.getByRole("heading", { name: "Web2 vs Web3" })).toBeInTheDocument();
  });

  it("stays usable when browser storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage access denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage access denied");
    });

    expect(() => render(<BeginnerMode onExit={vi.fn()} />)).not.toThrow();
    expect(screen.getByRole("heading", { name: "Apa itu Web3?" })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-complete-foundation-web-evolution"));
    fireEvent.click(screen.getByTestId("button-complete-foundation-crypto"));
    fireEvent.click(screen.getByTestId("button-complete-foundation-airdrop"));
    fireEvent.click(screen.getByTestId("button-complete-beginner-web3-1"));
    expect(screen.getByTestId("button-complete-beginner-web3-1")).toHaveTextContent("Lesson selesai");
  });

  it("gates Quest Lab behind foundation and awards simulated NovaSwap points", () => {
    render(<BeginnerMode onExit={vi.fn()} />);

    expect(screen.getByTestId("beginner-foundation")).toBeInTheDocument();
    expect(screen.queryByTestId("button-beginner-module-defi")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-complete-foundation-web-evolution"));
    fireEvent.click(screen.getByTestId("button-complete-foundation-crypto"));
    fireEvent.click(screen.getByTestId("button-complete-foundation-airdrop"));

    fireEvent.click(screen.getByTestId("button-beginner-module-defi"));
    expect(screen.getAllByText("NovaSwap")).toHaveLength(3);

    fireEvent.click(screen.getByTestId("button-complete-quest-defi-swap"));
    expect(screen.getByText(/Masukkan minimal 100 USDC/)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("input-simulation-defi-swap"), { target: { value: "100" } });
    fireEvent.click(screen.getByTestId("button-complete-quest-defi-swap"));

    expect(screen.getByTestId("button-complete-quest-defi-swap")).toHaveTextContent("Selesai");
    expect(JSON.parse(window.localStorage.getItem("hw_beginner_progress_v1"))).toMatchObject({
      completedQuestIds: ["defi-swap"],
      points: 35,
    });
  });
});