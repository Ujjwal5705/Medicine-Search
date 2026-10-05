const ERROR_COPY = {
  network: {
    title: "Can't reach the FDA service",
    body: "Check your internet connection, then try again.",
  },
  rate_limit: {
    title: "Too many requests",
    body: "The FDA service is limiting requests. Wait a minute, then try again.",
  },
  server: {
    title: "The FDA service had a problem",
    body: "This is usually temporary. Try again in a moment.",
  },
};

export function LoadingGrid({ count = 6 }) {
  return (
    <ul className="grid" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="card skeleton" aria-hidden="true">
          <span className="sk sk-title" />
          <span className="sk sk-line" />
          <span className="sk sk-line short" />
          <span className="sk sk-line" />
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="state">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const copy = ERROR_COPY[error?.kind] ?? ERROR_COPY.server;
  return (
    <div className="state error" role="alert">
      <h2>{copy.title}</h2>
      <p>{copy.body}</p>
      <button type="button" className="btn" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
