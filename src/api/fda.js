const BASE = "https://api.fda.gov/drug/label.json";
const LIMIT = 20;

export class ApiError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

const searchCache = new Map();
const detailCache = new Map();

export const normalizeQuery = (q) => q.trim().toLowerCase().replace(/\s+/g, " ");

export const getCachedSearch = (key) => searchCache.get(key);
export const getCachedMedicine = (id) => detailCache.get(id);

async function request(url, signal) {
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError("network");
  }

  if (res.status === 404) return null;
  if (res.status === 429) throw new ApiError("rate_limit");
  if (!res.ok) throw new ApiError("server");
  try {
    return await res.json();
  } catch {
    throw new ApiError("server");
  }
}

export async function searchMedicines(query, signal) {
  const key = normalizeQuery(query);
  const cached = searchCache.get(key);
  if (cached) return cached;

  const safe = key.replace(/["\\]/g, "");
  if (!safe) return [];

  const search = encodeURIComponent(`openfda.brand_name:"${safe}"`);
  const data = await request(`${BASE}?search=${search}&limit=${LIMIT}`, signal);
  const results = (data?.results ?? []).filter((r) => r && r.id);

  searchCache.set(key, results);
  results.forEach((r) => detailCache.set(r.id, r));
  return results;
}

export async function getMedicine(id, signal) {
  const cached = detailCache.get(id);
  if (cached) return cached;

  const safe = id.replace(/["\\]/g, "");
  const search = encodeURIComponent(`id:"${safe}"`);
  const data = await request(`${BASE}?search=${search}&limit=1`, signal);
  const record = data?.results?.[0] ?? null;
  if (record) detailCache.set(id, record);
  return record;
}
