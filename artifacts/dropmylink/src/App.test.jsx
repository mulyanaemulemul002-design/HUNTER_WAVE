import { describe, expect, it } from "vitest";
import { readPersistedTab } from "./App";

describe("last active tab persistence", () => {
  it("restores a valid tab after refresh", () => {
    window.localStorage.setItem("hw_last_tab_v1", "discover");

    expect(readPersistedTab()).toBe("discover");
  });

  it("falls back to Airdrop for invalid or unavailable storage", () => {
    window.localStorage.setItem("hw_last_tab_v1", "not-a-tab");
    expect(readPersistedTab()).toBe("airdrops");

    expect(readPersistedTab({
      getItem() {
        throw new Error("Storage access denied");
      },
    })).toBe("airdrops");
  });
});