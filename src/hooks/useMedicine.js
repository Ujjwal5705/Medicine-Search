import { useEffect, useState, useCallback } from "react";
import { getMedicine, getCachedMedicine } from "../api/fda.js";

const initial = (id) => {
  const cached = getCachedMedicine(id);
  return cached
    ? { status: "success", record: cached, error: null }
    : { status: "loading", record: null, error: null };
};

export default function useMedicine(id) {
  const [state, setState] = useState(() => initial(id));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const next = initial(id);
    setState(next);
    if (next.status === "success") return;

    const controller = new AbortController();
    getMedicine(id, controller.signal)
      .then((record) =>
        setState(
          record
            ? { status: "success", record, error: null }
            : { status: "notfound", record: null, error: null }
        )
      )
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ status: "error", record: null, error });
      });
    return () => controller.abort();
  }, [id, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
