import { useState } from 'preact/hooks';

export function SiteList({ type, sites, onSitesChange, currentSite }) {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState(null);

  const title = 'Blacklist';
  const description = 'Sites that never get dark theme';

  /**
   * Validate hostname format
   * @param {string} hostname - Hostname to validate
   * @returns {boolean} True if valid hostname
   */
  const isValidHostname = (hostname) => {
    // Basic hostname validation
    // Must not be empty
    if (!hostname) return false;

    // Must not contain protocol
    if (hostname.includes('://')) return false;

    // Must not contain path
    if (hostname.includes('/')) return false;

    // Must not contain spaces
    if (hostname.includes(' ')) return false;

    // Basic pattern check: alphanumeric, dots, hyphens
    const hostnamePattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return hostnamePattern.test(hostname);
  };

  const handleAdd = () => {
    const site = inputValue.trim().toLowerCase();

    // Clear previous validation error
    setValidationError(null);

    // Basic validation
    if (!site) {
      setValidationError('Please enter a site name');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    // Validate hostname format
    if (!isValidHostname(site)) {
      setValidationError('Invalid hostname format. Please enter a valid domain (e.g., example.com)');
      setTimeout(() => setValidationError(null), 4000);
      return;
    }

    // Check if already in list
    if (sites.includes(site)) {
      setValidationError(`${site} is already in the ${type}`);
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    // Add to list
    onSitesChange([...sites, site]);
    setInputValue('');
  };

  const handleRemove = (site) => {
    onSitesChange(sites.filter(s => s !== site));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="site-list">
      <div className="site-list-header">
        <h3 className={`site-list-title ${type}`}>
          {title}
        </h3>
        <p className="site-list-description">
          {description}
        </p>
      </div>

      <div className="site-list-input-row">
        <input
          type="text"
          value={inputValue}
          onInput={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="example.com"
          className="site-list-input"
          aria-label={`Add site to ${type}`}
        />
        <button
          onClick={handleAdd}
          className={`site-list-add-button ${type}`}
          aria-label={`Add to ${type}`}
        >
          Add
        </button>
      </div>

      {/* Validation error message */}
      {validationError && (
        <div className="site-list-validation-error">
          {validationError}
        </div>
      )}

      {sites.length > 0 && (
        <div className="site-list-items">
          {sites.map(site => (
            <div
              key={site}
              className={`site-list-item ${site === currentSite ? 'current' : ''}`}
            >
              <span className="site-list-item-text">
                {site}
                {site === currentSite && (
                  <span className="site-list-item-current-badge">
                    (current)
                  </span>
                )}
              </span>
              <button
                onClick={() => handleRemove(site)}
                className="site-list-remove-button"
                aria-label={`Remove ${site} from ${type}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {sites.length === 0 && (
        <p className="site-list-empty">
          No sites in {type}
        </p>
      )}
    </div>
  );
}
