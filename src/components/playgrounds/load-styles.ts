import playgroundCssUrl from "@/styles/playground.css?url";

let pending: Promise<void> | undefined;

export function loadPlaygroundStyles() {
  if (pending) return pending;
  const existing = document.querySelector<HTMLLinkElement>('link[data-playground-styles]');
  if (existing?.sheet) return Promise.resolve();
  pending = new Promise<void>((resolve, reject) => {
    const link = existing ?? document.createElement("link");
    link.rel = "stylesheet";
    link.href = playgroundCssUrl;
    link.dataset.playgroundStyles = "true";
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener("error", () => {
      pending = undefined;
      link.remove();
      reject(new Error("Example styles could not load."));
    }, { once: true });
    if (!existing) document.head.append(link);
  });
  return pending;
}
