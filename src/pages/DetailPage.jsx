import { useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import useMedicine from "../hooks/useMedicine.js";
import { LoadingGrid, EmptyState, ErrorState } from "../components/StatusViews.jsx";
import { getCardInfo, joinList, toList, formatDate, SECTIONS } from "../utils/format.js";

export default function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { status, record, error, retry } = useMedicine(id);

  const backTo = { pathname: "/", search: location.state?.from ?? "" };

  const brand = record ? getCardInfo(record).brand : "";
  useEffect(() => {
    document.title = brand ? `${brand} | Medicine Search` : "Medicine Search";
    return () => { document.title = "Medicine Search"; };
  }, [brand]);

  const back = <Link to={backTo} className="back">&larr; Back to results</Link>;

  if (status === "loading") {
    return <>{back}<LoadingGrid count={2} /></>;
  }
  if (status === "error") {
    return <>{back}<ErrorState error={error} onRetry={retry} /></>;
  }
  if (status === "notfound") {
    return (
      <>
        {back}
        <EmptyState title="Medicine not found">
          This label may have been removed or the link is incorrect. Go back and search again.
        </EmptyState>
      </>
    );
  }

  const o = record.openfda ?? {};
  const info = getCardInfo(record);
  const facts = [
    ["Generic name", joinList(o.generic_name)],
    ["Manufacturer", joinList(o.manufacturer_name)],
    ["Product type", joinList(o.product_type)],
    ["Route", joinList(o.route)],
    ["Active substance", joinList(o.substance_name)],
    ["Drug class", joinList(o.pharm_class_epc)],
    ["Application number", joinList(o.application_number)],
    ["NDC codes", joinList(o.product_ndc, 6)],
    ["Label updated", formatDate(record.effective_time)],
  ].filter(([, v]) => v);

  const sections = SECTIONS.map(([key, title]) => [key, title, toList(record[key])]).filter(
    ([, , paras]) => paras.length
  );
  const boxed = toList(record.boxed_warning);

  return (
    <article>
      {back}
      <h1 className="title">{info.brand}</h1>
      {info.generic && <p className="card-sub lead">{info.generic}</p>}

      {boxed.length > 0 && (
        <section className="boxed" aria-label="Boxed warning">
          <h2>Boxed warning</h2>
          {boxed.map((p, i) => <p key={i}>{p}</p>)}
        </section>
      )}

      {facts.length > 0 && (
        <dl className="facts detail-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {sections.length === 0 ? (
        <p className="muted">This label has no detailed sections available.</p>
      ) : (
        <div className="sections">
          {sections.map(([key, title, paras], i) => (
            <details key={key} open={i < 2}>
              <summary>{title}</summary>
              {paras.map((p, j) => <p key={j}>{p}</p>)}
            </details>
          ))}
        </div>
      )}
    </article>
  );
}
