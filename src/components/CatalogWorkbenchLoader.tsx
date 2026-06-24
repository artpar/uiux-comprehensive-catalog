import { useEffect, useState } from "react";
import CatalogWorkbench, { type WorkbenchComparison, type WorkbenchPattern } from "@/components/CatalogWorkbench";

type WorkbenchData = {
  patterns: WorkbenchPattern[];
  comparisons: WorkbenchComparison[];
  categories: string[];
  platforms: string[];
  maturities: string[];
};

type CatalogWorkbenchLoaderProps = {
  dataUrl: string;
  baseUrl: string;
  detailBaseUrl: string;
};

export default function CatalogWorkbenchLoader({ dataUrl, baseUrl, detailBaseUrl }: CatalogWorkbenchLoaderProps) {
  const [data, setData] = useState<WorkbenchData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const response = await fetch(dataUrl, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setData((await response.json()) as WorkbenchData);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load lab data.");
      }
    }

    loadData();
    return () => controller.abort();
  }, [dataUrl]);

  if (error) {
    return (
      <section className="workbench-loader" role="alert">
        <h2>Pattern lab data could not load</h2>
        <p>Refresh the page or open the pattern catalog while the lab data recovers.</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="workbench-loader" role="status" aria-live="polite">
        <h2>Loading pattern lab...</h2>
        <p>Preparing filters, comparisons, and source-backed pattern guidance.</p>
      </section>
    );
  }

  return (
    <CatalogWorkbench
      patterns={data.patterns}
      comparisons={data.comparisons}
      categories={data.categories}
      platforms={data.platforms}
      maturities={data.maturities}
      baseUrl={baseUrl}
      detailBaseUrl={detailBaseUrl}
    />
  );
}
