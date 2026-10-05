import { useEffect, useState, useCallback } from "react";
import { searchMedicines, getCachedSearch, normalizeQuery } from "../api/fda.js";

export const MIN_QUERY_LENGTH = 2;

function stateFor(key) {
  if (key.length < MIN_QUERY_LENGTH) return { forKey: key, status: "idle", results: [], error: null };
  const cached = getCachedSearch(key);
  if (cached)
    return { forKey: key, status: cached.length ? "success" : "empty", results: cached, error: null };
  return { forKey: key, status: "loading", results: [], error: null };
}

export default function useMedicineSearch(query) {
  const key = normalizeQuery(query);
  const [state, setState] = useState(() => stateFor(key));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const next = stateFor(key);
    setState(next);
    if (next.status !== "loading") return;

    const controller = new AbortController();
    searchMedicines(key, controller.signal)
      .then((results) =>
        setState({ forKey: key, status: results.length ? "success" : "empty", results, error: null })
      )
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ forKey: key, status: "error", results: [], error });
      });
    return () => controller.abort();
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const current = state.forKey === key ? state : stateFor(key);
  return { ...current, key, retry };
}
