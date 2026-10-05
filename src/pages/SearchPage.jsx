import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import MedicineCard from "../components/MedicineCard.jsx";
import { LoadingGrid, EmptyState, ErrorState } from "../components/StatusViews.jsx";
import useDebounce from "../hooks/useDebounce.js";
import useMedicineSearch, { MIN_QUERY_LENGTH } from "../hooks/useMedicineSearch.js";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [text, setText] = useState(() => params.get("q") ?? "");
  const [query, setQuery] = useState(text);
  const debounced = useDebounce(text, 400);
  useEffect(() => setQuery(debounced), [debounced]);

  useEffect(() => {
    const q = query.trim();
    if (q !== (params.get("q") ?? "")) setParams(q ? { q } : {}, { replace: true });
  }, [query]);

  const { status, results, key, error, retry } = useMedicineSearch(query);

  const submit = (e) => {
    e.preventDefault();
    setQuery(text);
  };
  const pick = (name) => {
    setText(name);
    setQuery(name);
  };

  const from = `?q=${encodeURIComponent(query.trim())}`;

  return (
    <>
      <h1 className="title">Find a medicine</h1>
      <SearchBar value={text} onChange={setText} onSubmit={submit} />

      <div aria-live="polite">
        {status === "idle" && (
          <EmptyState title="Search for a medicine">
            {text.trim().length === 1
              ? `Type at least ${MIN_QUERY_LENGTH} characters.`
              : "Enter a brand name to see matching FDA drug labels."}
          </EmptyState>
        )}
        {status === "loading" && <LoadingGrid />}
        {status === "error" && <ErrorState error={error} onRetry={retry} />}
        {status === "empty" && (
          <EmptyState title="No results found">
            {`Nothing matched the brand name "${key}". Check the spelling or try another brand name.`}
          </EmptyState>
        )}
        {status === "success" && (
          <>
            <p className="count">
              Showing {results.length} result{results.length === 1 ? "" : "s"} for "{key}"
            </p>
            <ul className="grid">
              {results.map((r) => (
                <MedicineCard key={r.id} record={r} from={from} />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
