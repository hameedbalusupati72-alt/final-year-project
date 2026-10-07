import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Modal dialog. Supply `open`, `onClose`, a `title`, and dialog `children`. */
export function Modal({ open = false, isOpen, onClose, title, description, children, footer, closeOnEscape = true, closeOnBackdrop = true, className = "" }) {
  const dialogRef = useRef(null);
  const visible = isOpen ?? open;
  useEffect(() => {
    if (!visible) return undefined;
    const previousFocus = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && closeOnEscape) onClose?.();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKeyDown); previousFocus?.focus?.(); };
  }, [visible, closeOnEscape, onClose]);
  if (!visible) return null;
  const headingId = "qpart-frontend-modal-title";
  const descriptionId = description ? "qpart-frontend-modal-description" : undefined;
  return (
    <div className={`qpart-frontend-modal-backdrop ${className}`.trim()} onMouseDown={(event) => { if (event.target === event.currentTarget && closeOnBackdrop) onClose?.(); }} style={{ position: "fixed", zIndex: 1000, inset: 0, display: "grid", placeItems: "center", padding: 20, background: "#05060bcc" }}>
      <section ref={dialogRef} className="qpart-frontend-modal" role="dialog" aria-modal="true" aria-labelledby={headingId} aria-describedby={descriptionId} tabIndex={-1} style={{ width: "min(100%, 560px)", maxHeight: "min(85vh, 800px)", overflow: "auto", border: "1px solid #383e50", borderRadius: 12, background: "#151821", color: "#e7e9ef", boxShadow: "0 20px 70px #0009" }}>
        <header style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 20px", borderBottom: "1px solid #303443" }}>
          <div style={{ flex: 1 }}><h2 id={headingId} style={{ margin: 0, fontSize: 18 }}>{title}</h2>{description && <p id={descriptionId} style={{ margin: "6px 0 0", color: "#a3aabb", lineHeight: 1.5 }}>{description}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Close dialog" style={{ display: "grid", placeItems: "center", width: 34, height: 34, border: 0, borderRadius: 6, background: "transparent", color: "inherit", cursor: "pointer" }}><X size={18} aria-hidden="true" /></button>
        </header>
        <div style={{ padding: 20 }}>{children}</div>
        {footer && <footer style={{ padding: "14px 20px", borderTop: "1px solid #303443" }}>{footer}</footer>}
      </section>
    </div>
  );
}

export default Modal;
