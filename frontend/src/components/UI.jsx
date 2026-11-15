/**
 * Componentes reutilizables para formularios.
 */
export function Campo({ label, name, error, children }) {
  return (
    <div className="campo">
      <label htmlFor={name}>{label}</label>
      {children}
      {error && <span className="campo-error">{error}</span>}
    </div>
  );
}

export function Alerta({ tipo = 'error', mensaje, detalle }) {
  if (!mensaje) return null;
  return (
    <div className={`alerta alerta-${tipo}`} role="alert">
      <p>{mensaje}</p>
      {detalle && (
        <ul>
          {detalle.map((d, i) => (
            <li key={i}>
              <strong>{d.campo}</strong>: {d.mensaje}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
