type Send = (name: string, props: Record<string, string | number>) => void;

/** Reading time and scroll depth are separate signals, rather than a single gate. */
export function readingMetrics(send: Send, surface: string) {
  let previous: number | undefined;
  let wasActive = false;
  let milliseconds = 0;
  let depth = 0;
  let engaged = false;
  const timeThresholds = new Set([10, 30, 90]);
  const depthThresholds = new Set([25, 50, 75, 100]);
  function legacyEngagement() {
    if (!engaged && milliseconds >= 30000 && depth >= 50) {
      engaged = true;
      send("engaged_read", { seconds: 30, depth: 50, surface });
    }
  }
  return {
    tick(now: number, active: boolean) {
      if (previous !== undefined && wasActive && active) {
        // A suspended timer or sleeping laptop must not become reading time.
        milliseconds += Math.max(0, Math.min(now - previous, 1500));
      }
      previous = now;
      wasActive = active;
      for (const seconds of timeThresholds) if (milliseconds >= seconds * 1000) {
        timeThresholds.delete(seconds);
        send("active_read", { seconds, surface });
      }
      legacyEngagement();
    },
    depth(percent: number) {
      depth = Math.max(depth, percent);
      for (const threshold of depthThresholds) if (depth >= threshold) {
        depthThresholds.delete(threshold);
        send("read_depth", { percent: threshold, surface });
      }
      legacyEngagement();
    }
  };
}
