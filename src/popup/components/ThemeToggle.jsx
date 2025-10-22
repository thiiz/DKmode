export function ThemeToggle({ enabled, onToggle }) {
  const handleToggle = () => {
    onToggle(!enabled);
  };

  return (
    <div className="theme-toggle-container">
      <div className="theme-toggle-row">
        <label className="theme-toggle-label">
          Dark Theme
        </label>
        <button
          onClick={handleToggle}
          className={`toggle-switch ${enabled ? 'active' : ''}`}
          aria-label={enabled ? 'Disable dark theme' : 'Enable dark theme'}
        >
          <span className="toggle-knob" />
        </button>
      </div>
      <p className="theme-toggle-status">
        {enabled ? 'Dark theme is enabled' : 'Dark theme is disabled'}
      </p>
    </div>
  );
}
