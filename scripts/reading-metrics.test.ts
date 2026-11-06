import assert from "node:assert/strict";
import { test } from "node:test";
import { readingMetrics } from "../src/lib/reading-metrics";

test("a visible 30-second read counts without reaching half of a long page", () => {
  const events: string[] = [];
  const metrics = readingMetrics((event, props) => events.push(`${event}:${props.seconds ?? props.percent}`), "lesson");
  for (let second = 0; second <= 30; second++) metrics.tick(second * 1000, true);
  assert.deepEqual(events, ["active_read:10", "active_read:30"]);
  metrics.depth(50);
  metrics.depth(50);
  assert.deepEqual(events.slice(2), ["read_depth:25", "read_depth:50", "engaged_read:30"]);
});

test("background tabs and a suspended computer do not accumulate reading minutes", () => {
  const events: string[] = [];
  const metrics = readingMetrics((event) => events.push(event), "lab");
  metrics.tick(0, true);
  metrics.tick(1000, false);
  metrics.tick(120000, false);
  metrics.tick(121000, true);
  metrics.tick(122000, true);
  metrics.tick(900000, true);
  assert.deepEqual(events, []);
});

test("scroll signals remain independent and each reading milestone is sent once", () => {
  const events: Array<[string, Record<string, string | number>]> = [];
  const metrics = readingMetrics((name, props) => events.push([name, props]), "pattern_detail");
  metrics.depth(100);
  metrics.depth(0);
  metrics.depth(100);
  for (let second = 0; second <= 180; second++) metrics.tick(second * 1000, true);
  assert.deepEqual(events.filter(([name]) => name === "read_depth").map(([, p]) => p.percent), [25, 50, 75, 100]);
  assert.deepEqual(events.filter(([name]) => name === "active_read").map(([, p]) => p.seconds), [10, 30, 90]);
  assert.equal(events.filter(([name]) => name === "engaged_read").length, 1);
});
