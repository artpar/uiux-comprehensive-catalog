type AnalyticsValue = string | number | boolean;
type AnalyticsProps = Record<string, AnalyticsValue | undefined>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, AnalyticsValue> }) => void;
  }
}

export function track(eventName: string, props: AnalyticsProps = {}) {
  if (import.meta.env.DEV || typeof window === "undefined" || typeof window.plausible !== "function") return;

  const cleanProps = Object.fromEntries(
    Object.entries(props).filter((entry): entry is [string, AnalyticsValue] => entry[1] !== undefined)
  );

  window.plausible(eventName, Object.keys(cleanProps).length > 0 ? { props: cleanProps } : undefined);
}
