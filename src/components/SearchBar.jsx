export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="search" role="search" onSubmit={onSubmit}>
      <label htmlFor="q" className="sr-only">Search medicines by brand name</label>
      <input
        id="q"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by brand name, e.g. Advil"
        autoComplete="off"
        autoFocus
      />
      <button type="submit" className="btn">Search</button>
    </form>
  );
}
