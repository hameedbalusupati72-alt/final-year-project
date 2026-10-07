import { Menu, X } from "lucide-react";

const styles = {
  bar: { display: "flex", alignItems: "center", gap: 12, minHeight: 56, padding: "10px 16px", borderBottom: "1px solid #303443", background: "#11141c", color: "#e7e9ef" },
  title: { margin: 0, fontSize: 17 },
  subtitle: { margin: "3px 0 0", color: "#9299a8", fontSize: 12 },
  spacer: { flex: 1 },
  iconButton: { display: "inline-grid", placeItems: "center", width: 36, height: 36, border: "1px solid #363b4b", borderRadius: 8, background: "transparent", color: "inherit", cursor: "pointer" },
};

/** Header bar. `onMenuClick` toggles a mobile navigation drawer. */
export function Navbar({ title = "QPart", subtitle, brand, onMenuClick, menuOpen = false, actions, children, className = "" }) {
  return (
    <header className={`qpart-frontend-navbar ${className}`.trim()} style={styles.bar}>
      {onMenuClick && (
        <button type="button" className="qpart-frontend-navbar-menu" style={styles.iconButton} onClick={onMenuClick} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>
          {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
        </button>
      )}
      {brand && <span className="qpart-frontend-navbar-brand">{brand}</span>}
      <div>
        <h1 className="qpart-frontend-navbar-title" style={styles.title}>{title}</h1>
        {subtitle && <p className="qpart-frontend-navbar-subtitle" style={styles.subtitle}>{subtitle}</p>}
      </div>
      <span style={styles.spacer} />
      {children}
      {actions}
    </header>
  );
}

export default Navbar;
