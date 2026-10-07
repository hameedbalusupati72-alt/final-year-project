import { X } from "lucide-react";

const styles = {
  aside: { boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14, width: 250, minHeight: "100%", padding: 16, borderRight: "1px solid #303443", background: "#10131a", color: "#e7e9ef" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 32 },
  heading: { margin: 0, fontSize: 16 },
  nav: { display: "grid", gap: 5 },
  link: { display: "flex", alignItems: "center", gap: 10, width: "100%", minHeight: 40, padding: "8px 10px", border: "1px solid transparent", borderRadius: 8, background: "transparent", color: "#c2c7d3", textAlign: "left", textDecoration: "none", cursor: "pointer" },
};

/** Navigation sidebar. Items accept `{ id, label, href, icon, disabled }`. */
export function Sidebar({ items = [], activeItem, onNavigate, brand = "QPart", open = true, onClose, footer, className = "" }) {
  if (!open) return null;
  return (
    <aside className={`qpart-frontend-sidebar ${className}`.trim()} style={styles.aside} aria-label="Primary navigation">
      <div className="qpart-frontend-sidebar-header" style={styles.header}>
        <h2 className="qpart-frontend-sidebar-brand" style={styles.heading}>{brand}</h2>
        {onClose && <button type="button" className="qpart-frontend-sidebar-close" onClick={onClose} aria-label="Close navigation" style={{ ...styles.link, width: 38, justifyContent: "center" }}><X size={18} aria-hidden="true" /></button>}
      </div>
      <nav className="qpart-frontend-sidebar-nav" style={styles.nav}>
        {items.map((item) => {
          const Icon = item.icon;
          const selected = item.id === activeItem;
          const content = <>{Icon && <Icon size={18} aria-hidden="true" />}<span>{item.label}</span></>;
          const shared = { className: `qpart-frontend-sidebar-link${selected ? " qpart-frontend-sidebar-link-active" : ""}`, style: { ...styles.link, ...(selected ? { color: "#d5c6ff", background: "#282239", border: "1px solid #504270" } : {}), ...(item.disabled ? { opacity: 0.55, cursor: "not-allowed" } : {}) }, "aria-current": selected ? "page" : undefined };
          return item.href && !item.disabled
            ? <a key={item.id} {...shared} href={item.href} onClick={(event) => { if (onNavigate) { event.preventDefault(); onNavigate(item.id, item); } }}>{content}</a>
            : <button key={item.id} {...shared} type="button" disabled={item.disabled} onClick={() => onNavigate?.(item.id, item)}>{content}</button>;
        })}
      </nav>
      {footer && <div className="qpart-frontend-sidebar-footer" style={{ marginTop: "auto" }}>{footer}</div>}
    </aside>
  );
}

export default Sidebar;
