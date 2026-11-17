import { test } from "node:test";
import assert from "node:assert/strict";
import { createPlan } from "../src/planner.js";
import { readStored, writeStored } from "../src/storage.js";
test("room plans reflect room, area, style and the user brief", () => {
  const plan = createPlan({
    room: "dining",
    style: "bold",
    size: 15,
    brief: "Oak flooring",
    lang: "en",
  });
  assert.match(plan, /Dining room · 15 m²/);
  assert.match(plan, /compact room/);
  assert.match(plan, /charcoal/);
  assert.match(plan, /Shield/);
  assert.match(plan, /Your brief: Oak flooring/);
  assert.doesNotMatch(plan, /\bAI\b|not connected|demo/i);
});
test("planner supports every room and both languages", () => {
  for (const room of ["living", "dining", "bedroom"])
    for (const style of ["warm", "bold"])
      for (const lang of ["en", "tm"]) {
        assert.ok(createPlan({ room, style, size: 25, lang }).length > 100);
      }
  assert.match(
    createPlan({ room: "bedroom", style: "warm", size: 25, lang: "tm" }),
    /Ýatylýan otag/,
  );
});
test("invalid room dimensions and unsupported choices are rejected", () => {
  for (const size of ["", 0, 4, 501, "no", Infinity])
    assert.throws(() => createPlan({ room: "living", style: "warm", size }));
  assert.throws(() => createPlan({ room: "invalid", style: "warm", size: 25 }));
  assert.throws(() =>
    createPlan({ room: "living", style: "invalid", size: 25 }),
  );
});
test("blocked or unavailable storage does not break the UI", () => {
  assert.equal(readStored("forma-lang", "tm"), "tm");
  assert.doesNotThrow(() => writeStored("forma-saved", []));
});

test("inherited object properties are not room types", () => {
  for (const room of ["__proto__", "constructor", "toString"]) {
    assert.throws(() => createPlan({ room, style: "warm", size: 25 }));
  }
});
