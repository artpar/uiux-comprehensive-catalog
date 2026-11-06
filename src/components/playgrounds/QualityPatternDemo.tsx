import { Suspense, useEffect, useState } from "react";
import { exampleComponents } from "./example-loaders";
import { patternMeta } from "./examples/shared";
import { fallbackMeta } from "./examples/metadata";
import { loadPlaygroundStyles } from "./load-styles";

type Props = {
  pattern: { id: string };
  onReady?: () => void;
  onError?: () => void;
};

function ReadyExample({ pattern, onReady }: Props) {
  const meta = patternMeta[pattern.id] ?? fallbackMeta;
  const key = (pattern.id in exampleComponents ? pattern.id : `generic-${meta.group}`) as keyof typeof exampleComponents;
  const Example = exampleComponents[key];
  useEffect(() => { onReady?.(); }, [onReady]);
  return <div data-demo-ready={pattern.id}><Example patternId={pattern.id} meta={meta} /></div>;
}

export default function QualityPatternDemo({ pattern, onReady, onError }: Props) {
  const [stylesReady, setStylesReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let mounted = true;
    loadPlaygroundStyles().then(() => {
      if (mounted) setStylesReady(true);
    }).catch(() => {
      if (mounted) { setFailed(true); onError?.(); }
    });
    return () => { mounted = false; };
  }, [onError]);
  const loading = <p className="demo-loading" role="status">Loading interactive example…</p>;
  if (failed) return <div role="alert"><p>The example could not load. Reload the page to try again.</p><button className="demo-button" onClick={() => window.location.reload()}>Reload example</button></div>;
  if (!stylesReady) return loading;
  return <Suspense fallback={loading}><ReadyExample pattern={pattern} onReady={onReady} /></Suspense>;
}
