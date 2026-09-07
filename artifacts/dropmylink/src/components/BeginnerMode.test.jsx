import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BeginnerMode from "./BeginnerMode";

const LEARNING_STORAGE_KEY = "hw_beginner_learning_v2";
const PRACTICE_STORAGE_KEY = "hw_beginner_practice_v1";
const LEGACY_KEYS = [
  "dropmylink_beginner_progress_v1",
  "hw_beginner_progress_v1",
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  window.localStorage.clear();
});

function open(id) {
  fireEvent.click(screen.getByTestId(`button-beginner-drawer-${id}`));
}

function complete(id) {
  if (!screen.queryByTestId(`beginner-drawer-content-${id}`)) open(id);
  fireEvent.click(screen.getByTestId(`button-complete-beginner-${id}`));
}

describe("BeginnerMode learning path", () => {
  it("opens the local Active Practice path without wallet actions", () => {
    render(<BeginnerMode onExit={vi.fn()} />);

    fireEvent.click(screen.getByTestId("button-beginner-mode-active-practice"));

    expect(screen.getByTestId("active-practice-mode")).toBeInTheDocument();
    expect(screen.getByTestId("text-practice-progress")).toHaveTextContent("0/10");
    expect(screen.getByTestId("practice-local-notice")).toHaveTextContent("Tidak ada wallet, RPC, Sepolia");
    expect(screen.getByTestId("button-practice-category-social-quest-wl")).not.toBeDisabled();
    expect(screen.getByTestId("button-practice-category-dex-swap")).toBeDisabled();
  });

  it("saves the first local practice and unlocks the next category", () => {
    render(<BeginnerMode onExit={vi.fn()} />);

    fireEvent.click(screen.getByTestId("button-beginner-mode-active-practice"));

    expect(screen.getByTestId("button-practice-complete-social-quest-wl")).toBeDisabled();
    fireEvent.click(screen.getByTestId("button-practice-social-source"));
    fireEvent.click(screen.getByTestId("button-practice-social-rules"));
    fireEvent.click(screen.getByTestId("button-practice-social-risk"));
    expect(screen.getByTestId("button-practice-complete-social-quest-wl")).not.toBeDisabled();

    fireEvent.click(screen.getByTestId("button-practice-complete-social-quest-wl"));

    expect(screen.getByTestId("text-practice-progress")).toHaveTextContent("1/10");
    expect(screen.getByTestId("practice-panel-dex-swap")).toBeInTheDocument();
    expect(screen.getByTestId("button-practice-category-dex-swap")).not.toBeDisabled();
    expect(JSON.parse(window.localStorage.getItem(PRACTICE_STORAGE_KEY))).toMatchObject({
      activeCategoryId: "dex-swap",
      categories: {
        "social-quest-wl": {
          completed: true,
          steps: { source: true, rules: true, risk: true },
          simulator: { selectedCard: "risk" },
        },
      },
    });
  });

  it("starts with every drawer closed", () => {
    render(<BeginnerMode onExit={vi.fn()} />);

    expect(screen.getByTestId("beginner-learning-path")).toBeInTheDocument();
    expect(screen.queryByTestId("beginner-drawer-content-web3")).not.toBeInTheDocument();
    expect(screen.queryByTestId("beginner-drawer-content-crypto")).not.toBeInTheDocument();
    expect(screen.queryByTestId("beginner-drawer-content-airdrop")).not.toBeInTheDocument();
    expect(screen.queryByTestId("beginner-drawer-content-lab")).not.toBeInTheDocument();
  });

  it("keeps the accordion controlled so opening a drawer closes the previous one", () => {
    render(<BeginnerMode onExit={vi.fn()} />);

    open("web3");
    expect(screen.getByTestId("beginner-drawer-content-web3")).toBeInTheDocument();
    expect(screen.queryByTestId("beginner-drawer-content-crypto")).not.toBeInTheDocument();
    expect(screen.queryByTestId("beginner-inner-content-web3-0")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-beginner-inner-web3-0"));
    expect(screen.getByTestId("beginner-inner-content-web3-0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-beginner-inner-web3-1"));
    expect(screen.queryByTestId("beginner-inner-content-web3-0")).not.toBeInTheDocument();
    expect(screen.getByTestId("beginner-inner-content-web3-1")).toBeInTheDocument();

    complete("web3");
    open("crypto");
    expect(screen.getByTestId("beginner-drawer-content-crypto")).toBeInTheDocument();
    expect(screen.queryByTestId("beginner-drawer-content-web3")).not.toBeInTheDocument();
  });

  it("follows the ordered progression through the practice lab", () => {
    render(<BeginnerMode onExit={vi.fn()} />);

    expect(screen.getByTestId("button-beginner-drawer-crypto")).toBeDisabled();
    expect(screen.getByTestId("button-beginner-drawer-airdrop")).toBeDisabled();
    expect(screen.getByTestId("button-beginner-drawer-lab")).toBeDisabled();

    complete("web3");
    expect(screen.getByTestId("button-beginner-drawer-crypto")).not.toBeDisabled();
    expect(screen.getByTestId("button-beginner-drawer-airdrop")).toBeDisabled();

    complete("crypto");
    expect(screen.getByTestId("button-beginner-drawer-airdrop")).not.toBeDisabled();
    expect(screen.getByTestId("button-beginner-drawer-lab")).toBeDisabled();

    complete("airdrop");
    expect(screen.getByTestId("button-beginner-drawer-lab")).not.toBeDisabled();
    open("lab");
    expect(screen.queryByTestId("fictional-practice-lab")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-beginner-inner-lab-0"));
    expect(screen.getByTestId("fictional-practice-lab")).toBeInTheDocument();
  });

  it("does not render legacy point, XP, reward, or quest language", () => {
    render(<BeginnerMode onExit={vi.fn()} />);
    open("web3");

    expect(document.body.textContent).not.toMatch(/campaign points|xp|reward|quest/i);
    expect(document.body.textContent).toContain("Tidak ada wallet connection, token, atau transaksi nyata");
  });

  it("keeps AstraDrop and NovaSwap inside a fictional lab without wallet actions", () => {
    render(<BeginnerMode onExit={vi.fn()} />);

    complete("web3");
    complete("crypto");
    complete("airdrop");
    open("lab");

    expect(screen.getByTestId("beginner-drawer-content-lab")).toHaveTextContent("AstraDrop");
    expect(screen.getByTestId("beginner-drawer-content-lab")).toHaveTextContent("NovaSwap");
    expect(screen.queryByRole("button", { name: /connect wallet/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /transaction/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-beginner-inner-lab-0"));
    expect(screen.getByTestId("fictional-practice-lab")).toHaveTextContent("AstraDrop");
    fireEvent.click(screen.getByTestId("button-beginner-inner-lab-1"));
    expect(screen.getByTestId("fictional-practice-lab")).toHaveTextContent("NovaSwap");
    expect(screen.getByTestId("fictional-practice-lab")).toHaveTextContent("contoh rekaan");
  });

  it("persists only learning completion and clears legacy progress keys", () => {
    window.localStorage.setItem(
      "dropmylink_beginner_progress_v1",
      JSON.stringify({ completed: { web3: [0] }, points: 999 }),
    );
    window.localStorage.setItem(
      "hw_beginner_progress_v1",
      JSON.stringify({ completedQuestIds: ["defi-swap"], points: 999 }),
    );

    render(<BeginnerMode onExit={vi.fn()} />);

    expect(screen.getByTestId("button-beginner-drawer-crypto")).toBeDisabled();
    expect(window.localStorage.getItem("dropmylink_beginner_progress_v1")).toBeNull();
    expect(window.localStorage.getItem("hw_beginner_progress_v1")).toBeNull();

    complete("web3");
    expect(JSON.parse(window.localStorage.getItem(LEARNING_STORAGE_KEY))).toEqual({ completed: ["web3"] });
  });

  it("recovers from malformed learning storage and blocked browser storage", () => {
    window.localStorage.setItem(LEARNING_STORAGE_KEY, "{not-valid-json");
    expect(() => render(<BeginnerMode onExit={vi.fn()} />)).not.toThrow();
    expect(screen.getByTestId("button-beginner-drawer-web3")).toBeInTheDocument();

    cleanup();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage access denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage access denied");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Storage access denied");
    });

    expect(() => render(<BeginnerMode onExit={vi.fn()} />)).not.toThrow();
    expect(screen.getByTestId("button-beginner-drawer-web3")).toBeInTheDocument();
  });
});