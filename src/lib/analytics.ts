type AnalyticsValue = string | number | boolean;
type AnalyticsProps = Record<string, AnalyticsValue | undefined>;
type AnalyticsEvent = [eventName: string, props?: Record<string, AnalyticsValue>];

declare global {
  interface Window {
    __analyticsQueue?: AnalyticsEvent[];
    __trackAnalytics?: (eventName: string, props?: Record<string, AnalyticsValue>) => void;
    umami?: {
      track?: (eventName: string, props?: Record<string, AnalyticsValue>) => void;
    };
  }
}

export function track(eventName: string, props: AnalyticsProps = {}) {
  if (import.meta.env.DEV || typeof window === "undefined") return;

  const cleanProps = Object.fromEntries(
    Object.entries(props).filter((entry): entry is [string, AnalyticsValue] => entry[1] !== undefined)
  );
  const payload = Object.keys(cleanProps).length > 0 ? cleanProps : undefined;

  if (typeof window.__trackAnalytics === "function") {
    window.__trackAnalytics(eventName, payload);
    return;
  }

  if (typeof window.umami?.track === "function") {
    window.umami.track(eventName, payload);
    return;
  }

  window.__analyticsQueue ??= [];
  window.__analyticsQueue.push([eventName, payload]);
}
