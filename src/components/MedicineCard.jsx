import { memo } from "react";
import { Link } from "react-router-dom";
import { getCardInfo } from "../utils/format.js";

function MedicineCard({ record, from }) {
  const info = getCardInfo(record);
  const rows = [
    ["Manufacturer", info.manufacturer],
    ["Type", info.productType],
    ["Route", info.route],
    ["Active substance", info.substance],
  ].filter(([, value]) => value);

  return (
    <li>
      <Link
        to={`/medicine/${encodeURIComponent(record.id)}`}
        state={{ from }}
        className="card"
      >
        <h2 className="card-title">{info.brand}</h2>
        {info.generic && <p className="card-sub">{info.generic}</p>}
        {rows.length > 0 ? (
          <dl className="facts">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="muted">No extra details listed.</p>
        )}
      </Link>
    </li>
  );
}

export default memo(MedicineCard);
