import { describe, expect, it } from "vitest";
import { eventsForDate, initialState, unreadCount } from "./data";

describe("fictional school demo", () => {
  it("starts with unread notices and assignments", () => {
    const state = initialState();
    expect(unreadCount(state)).toBe(state.updates.length);
  });
  it("counts only unread updates", () => {
    const state = initialState();
    state.readIds = [state.updates[0].id];
    expect(unreadCount(state)).toBe(state.updates.length - 1);
  });
  it("matches calendar events only on the selected day", () => {
    const state = initialState();
    const day = state.events[0].date;
    expect(eventsForDate(state.events, day).some((event) => event.id === state.events[0].id)).toBe(true);
    expect(eventsForDate(state.events, "1990-01-01")).toEqual([]);
  });
});
