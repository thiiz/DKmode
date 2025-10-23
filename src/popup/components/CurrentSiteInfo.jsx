export function CurrentSiteInfo({ currentSite, darkThemeEnabled }) {
  if (!currentSite) {
    return (
      <div className="current-site-info">
        <p className="site-list-description">
          No active site detected
        </p>
      </div>
    );
  }

  return (
    <div className="current-site-info">
      <div className="site-info-header">
        <span className="site-info-label">
          Current Site
        </span>
      </div>
      <div className="site-info-main">
        <span className="site-hostname">
          {currentSite}
        </span>
        {/* Visual indicator badge */}
        <div className={`site-status-badge ${darkThemeEnabled ? 'active' : ''}`}>
          {/* Status indicator dot */}
          <span className={`status-indicator-dot ${darkThemeEnabled ? 'active' : ''}`} />
          <span className={`status-badge-text ${darkThemeEnabled ? 'active' : ''}`}>
            {darkThemeEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
      <div className="site-info-details">
        <div className="site-info-item">
          <span className="site-info-item-label">Status: </span>
          <span className={`site-info-item-value ${darkThemeEnabled ? 'active' : ''}`}>
            {darkThemeEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
