import { Routes, Route, Link } from "react-router-dom";
import SearchPage from "./pages/SearchPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <Link to="/" className="brand">Medicine Search</Link>
        <span className="source">FDA drug label data</span>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/medicine/:id" element={<DetailPage />} />
          <Route path="*" element={<SearchPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        Public FDA data. Not medical advice. ask a doctor or pharmacist before taking any medicine.
      </footer>
    </div>
  );
}
