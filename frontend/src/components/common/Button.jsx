import { LoaderCircle } from "lucide-react";

const variants = {
  primary: { background: "#7359c8", borderColor: "#8e78dc", color: "#fff" },
  secondary: { background: "#1a1e28", borderColor: "#3a4050", color: "#e0e3ed" },
  ghost: { background: "transparent", borderColor: "transparent", color: "#c8cddd" },
  danger: { background: "#672e3a", borderColor: "#88414d", color: "#fff" },
};

/** Reusable button. Accepts normal button props plus `variant`, `icon`, and `loading`. */
export function Button({ children, variant = "primary", size = "md", icon: Icon, loading = false, disabled = false, className = "", type = "button", ...buttonProps }) {
  const compact = size === "sm";
  return (
    <button {...buttonProps} type={type} disabled={disabled || loading} className={`qpart-frontend-button qpart-frontend-button-${variant} ${className}`.trim()} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: compact ? 32 : 40, padding: compact ? "6px 10px" : "9px 14px", border: `1px solid ${variants[variant]?.borderColor ?? variants.primary.borderColor}`, borderRadius: 8, font: "inherit", fontSize: compact ? 13 : 14, cursor: disabled || loading ? "not-allowed" : "pointer", opacity: disabled || loading ? 0.65 : 1, ...variants[variant] }}>
      {loading ? <LoaderCircle size={16} aria-hidden="true" /> : Icon ? <Icon size={16} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export default Button;
