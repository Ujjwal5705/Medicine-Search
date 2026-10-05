# Medicine Search

Search FDA drug labels by brand name (openFDA `drug/label.json`), browse result cards, and open a detail page.

## Live demo

https://medicine-search-pearl.vercel.app/

## Manually verified

- Search for a known brand (e.g. Advil), then open a card and use "Back to results".
- Unknown brand shows "No results found".
- Refreshing a detail page loads it directly.
- Offline: error state appears with a working "Try again".
- Layout checked on a narrow mobile viewport.

## With another hour

- Wildcard/prefix search so partial names like "adv" match.
- Pagination or "load more" beyond the first 20 results.
- Cache expiry, and optionally persist the cache in sessionStorage.
- Tests for the API layer and the missing-field helpers.
- Pass the card data through a shared `useReducer` store only if more screens need it.

## Run

```bash
npm install
npm run dev     
npm run build    
```

Deployed on Vercel. `vercel.json` rewrites all paths to `index.html` so a detail URL works when opened directly or refreshed.

## Structure

- `src/api/fda.js`: the only file that calls the API. Handles 404 as "no results", classifies errors, owns the caches.
- `src/hooks/`: `useDebounce`, `useMedicineSearch`, `useMedicine`.
- `src/pages/`: `SearchPage`, `DetailPage`.
- `src/components/`: `SearchBar`, `MedicineCard`, status views (loading, empty, error).
- `src/utils/format.js`: array/missing-field handling for `openfda` data.

## Decisions and trade-offs

**State and data**
- Search state is one status: `idle | loading | success | empty | error`. A failed call shows a retry button; errors are never cached.
- Caches are two module-level `Map`s: query to results, and label id to record. Maps give O(1) lookup, and results seed the detail cache so opening a card needs no second request.
- The search term lives in the URL (`/?q=advil`), so Back from a detail page restores the search from cache with no refetch.
- The detail route is `/medicine/:id`. On a direct open or refresh the cache is empty, so the page fetches by label `id`.
- Back goes to the previous search if known, otherwise to the clean search page.

**Optimisations, and the problem each solves**
- Debounce (400 ms): without it every keystroke is an API request, and keyless openFDA is rate limited. Enter skips the wait.
- Request cancellation (`AbortController` in the effect cleanup): a slow older response cannot overwrite a newer one.
- Cache: repeated queries and back-navigation are instant and cost no requests.
- `React.memo` on `MedicineCard` only: the page re-renders on every keystroke (controlled input), but the cards' props do not change, so up to 20 card re-renders per keystroke are skipped.
- No `useMemo`/`useCallback` elsewhere on purpose: card view-models are cheap string joins, and nothing downstream needs stable function identity.

**Trade-offs**
- Brand-name search uses the quoted phrase from the brief, so it matches whole words ("advil" matches, "adv" does not). With more time: wildcard or prefix search.
- Caches are in memory only, with no expiry, and are lost on refresh.
- Only the first 20 matches are shown; there is no pagination.
- Cards read only from the `openfda` object; the label `id` is used solely for routing.
- No tests. With more time: tests for the API layer and the missing-field helpers.
