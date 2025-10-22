import { useEffect, useRef } from 'preact/hooks';

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Check if a URL is restricted (cannot run content scripts)
 * @param {string} url - URL to check
 * @returns {boolean} True if URL is restricted
 */
function isRestrictedUrl(url) {
  if (!url) return true;

  const restrictedPrefixes = [
    'chrome://',
    'chrome-extension://',
    'edge://',
    'about:',
    'view-source:',
    'data:',
    'file://',
    'chrome-search://',
    'devtools://'
  ];

  return restrictedPrefixes.some(prefix => url.startsWith(prefix));
}

export function IntensitySlider({ intensity, onIntensityChange }) {
  // Use ref to store the debounced function so it persists across renders
  const debouncedUpdateRef = useRef(null);

  // Initialize debounced function
  useEffect(() => {
    // Create debounced function to send message to content script and save to storage
    debouncedUpdateRef.current = debounce(async (newIntensity) => {
      try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
          throw new Error('No active tab found');
        }

        if (!tab.id) {
          throw new Error('Invalid tab ID');
        }

        // Check if the tab URL is restricted
        if (!isRestrictedUrl(tab.url)) {
          try {
            // Send UPDATE_INTENSITY message to content script
            await chrome.tabs.sendMessage(tab.id, {
              type: 'UPDATE_INTENSITY',
              intensity: newIntensity
            });
          } catch (messageError) {
            // Log but don't throw - content script might not be loaded yet
            console.warn('Could not send intensity update to content script:', messageError);
          }
        }

        // Save intensity value to chrome.storage.sync
        await chrome.storage.sync.set({ intensity: newIntensity });
      } catch (error) {
        console.error('Failed to update intensity:', error);
        // Could notify parent component of error if needed
      }
    }, 500); // 500ms debounce delay
  }, []);

  /**
   * Handle slider change
   * @param {Event} e - Change event
   */
  const handleChange = (e) => {
    const newIntensity = parseInt(e.target.value, 10);

    // Update local state immediately for responsive UI
    onIntensityChange(newIntensity);

    // Call debounced function to update content script and storage
    if (debouncedUpdateRef.current) {
      debouncedUpdateRef.current(newIntensity);
    }
  };

  return (
    <div className="intensity-slider-container">
      <div className="intensity-slider-header">
        <label className="intensity-slider-label">
          Intensity
        </label>
        <span className="intensity-value">
          {intensity}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={intensity}
        onChange={handleChange}
        className="intensity-slider"
        aria-label="Theme intensity"
      />
      <div className="intensity-slider-labels">
        <span className="intensity-slider-label-text">Subtle</span>
        <span className="intensity-slider-label-text">Maximum</span>
      </div>
    </div>
  );
}
