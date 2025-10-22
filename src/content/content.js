/**
 * Dark Theme Extension - Content Script
 * Applies dark theme styles to web pages based on user preferences
 */

// In-memory fallback settings when storage is unavailable
const fallbackSettings = {
  darkThemeEnabled: false,
  intensity: 80,
  whitelist: [],
  blacklist: [],
  siteSettings: {}
};

// Track if storage is available
let storageAvailable = true;

// Performance monitoring
const performanceMetrics = {
  initStartTime: performance.now(),
  initEndTime: null,
  applyThemeTime: [],
  removeThemeTime: [],
  storageReadTime: [],
  storageWriteTime: [],
  messageHandlingTime: []
};

/**
 * Record performance metric
 * @param {string} operation - Name of the operation
 * @param {number} duration - Duration in milliseconds
 */
function recordPerformance(operation, duration) {
  if (performanceMetrics[operation]) {
    performanceMetrics[operation].push(duration);
  }

  // Log slow operations (> 50ms)
  if (duration > 50) {
    console.warn(`[Dark Theme Extension] Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
  }
}

/**
 * Get performance statistics
 * @returns {Object} Performance statistics
 */
function getPerformanceStats() {
  const stats = {
    initializationTime: performanceMetrics.initEndTime
      ? (performanceMetrics.initEndTime - performanceMetrics.initStartTime).toFixed(2) + 'ms'
      : 'Not completed',
    operations: {}
  };

  for (const [key, values] of Object.entries(performanceMetrics)) {
    if (Array.isArray(values) && values.length > 0) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);

      stats.operations[key] = {
        count: values.length,
        average: avg.toFixed(2) + 'ms',
        max: max.toFixed(2) + 'ms',
        min: min.toFixed(2) + 'ms'
      };
    }
  }

  return stats;
}

// Expose performance stats to window for testing
window.__darkThemePerformance = {
  getStats: getPerformanceStats,
  getRawMetrics: () => performanceMetrics
};

/**
 * Enhanced error logging function with context
 * @param {string} context - Description of where the error occurred
 * @param {Error} error - The error object
 * @param {Object} additionalInfo - Additional context information
 */
function logError(context, error, additionalInfo = {}) {
  const errorDetails = {
    context,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...additionalInfo
  };

  console.error(`[Dark Theme Extension] Error in ${context}:`, errorDetails);

  // Could extend to send to analytics service if needed
  // Example: sendErrorToAnalytics(errorDetails);
}

/**
 * Safely get settings from storage with fallback
 * @param {Array<string>} keys - Keys to retrieve from storage
 * @returns {Promise<Object>} Settings object
 */
async function getSettingsSafely(keys) {
  const startTime = performance.now();
  try {
    if (!storageAvailable) {
      logError('getSettingsSafely', new Error('Storage unavailable, using fallback'), { keys });
      return fallbackSettings;
    }

    const settings = await chrome.storage.sync.get(keys);
    recordPerformance('storageReadTime', performance.now() - startTime);
    return settings;
  } catch (error) {
    logError('getSettingsSafely', error, { keys });
    storageAvailable = false;
    recordPerformance('storageReadTime', performance.now() - startTime);
    return fallbackSettings;
  }
}

/**
 * Safely save settings to storage with fallback
 * @param {Object} settings - Settings to save
 * @returns {Promise<boolean>} Success status
 */
async function saveSettingsSafely(settings) {
  const startTime = performance.now();
  try {
    if (!storageAvailable) {
      logError('saveSettingsSafely', new Error('Storage unavailable, updating fallback only'), { settings });
      Object.assign(fallbackSettings, settings);
      return false;
    }

    await chrome.storage.sync.set(settings);
    recordPerformance('storageWriteTime', performance.now() - startTime);
    return true;
  } catch (error) {
    logError('saveSettingsSafely', error, { settings });
    storageAvailable = false;
    Object.assign(fallbackSettings, settings);
    recordPerformance('storageWriteTime', performance.now() - startTime);
    return false;
  }
}

// Initialize dark theme on page load
async function initDarkTheme() {
  const startTime = performance.now();
  try {
    console.log('[Dark Theme Extension] Initializing dark theme on page load...');

    const settings = await getSettingsSafely([
      'darkThemeEnabled',
      'intensity',
      'whitelist',
      'blacklist',
      'siteSettings'
    ]);

    console.log('[Dark Theme Extension] Retrieved settings:', settings);

    const currentSite = window.location.hostname;
    const shouldApply = determineShouldApply(currentSite, settings);

    console.log(`[Dark Theme Extension] Should apply dark theme to ${currentSite}:`, shouldApply);

    if (shouldApply) {
      const intensity = settings.siteSettings?.[currentSite]?.intensity || settings.intensity || 80;
      console.log(`[Dark Theme Extension] Applying dark theme with intensity: ${intensity}%`);
      applyDarkTheme(intensity);
    } else {
      console.log('[Dark Theme Extension] Dark theme not applied based on settings');
    }

    performanceMetrics.initEndTime = performance.now();
    const totalTime = performanceMetrics.initEndTime - performanceMetrics.initStartTime;
    console.log(`[Dark Theme Extension] Initialization completed in ${totalTime.toFixed(2)}ms`);
  } catch (error) {
    logError('initDarkTheme', error, {
      hostname: window.location.hostname,
      storageAvailable
    });
    performanceMetrics.initEndTime = performance.now();
    // Graceful degradation: continue without dark theme
  }
}

// Apply dark theme with specified intensity
function applyDarkTheme(intensity) {
  const startTime = performance.now();
  try {
    // Validate intensity value
    const validIntensity = Math.max(0, Math.min(100, intensity || 80));

    // Check if document is ready for manipulation
    if (!document.documentElement) {
      throw new Error('Document element not available');
    }

    document.documentElement.classList.add('dark-theme-active');
    document.documentElement.style.setProperty('--dark-theme-intensity', validIntensity / 100);

    recordPerformance('applyThemeTime', performance.now() - startTime);
    console.log(`[Dark Theme Extension] Successfully applied dark theme with intensity: ${validIntensity}%`);
  } catch (error) {
    logError('applyDarkTheme', error, {
      intensity,
      documentReady: !!document.documentElement
    });
    recordPerformance('applyThemeTime', performance.now() - startTime);
  }
}

// Remove dark theme
function removeDarkTheme() {
  const startTime = performance.now();
  try {
    // Check if document is ready for manipulation
    if (!document.documentElement) {
      throw new Error('Document element not available');
    }

    document.documentElement.classList.remove('dark-theme-active');
    document.documentElement.style.removeProperty('--dark-theme-intensity');

    recordPerformance('removeThemeTime', performance.now() - startTime);
    console.log('[Dark Theme Extension] Successfully removed dark theme');
  } catch (error) {
    logError('removeDarkTheme', error, {
      documentReady: !!document.documentElement
    });
    recordPerformance('removeThemeTime', performance.now() - startTime);
  }
}

// Determine if dark theme should be applied to the current site
function determineShouldApply(site, settings) {
  try {
    // Validate inputs
    if (!site || typeof site !== 'string') {
      logError('determineShouldApply', new Error('Invalid site parameter'), { site });
      return false;
    }

    if (!settings || typeof settings !== 'object') {
      logError('determineShouldApply', new Error('Invalid settings parameter'), { settings });
      return false;
    }

    // Check blacklist first (highest priority)
    if (Array.isArray(settings.blacklist) && settings.blacklist.includes(site)) {
      console.log(`[Dark Theme Extension] Site ${site} is blacklisted - dark theme will NOT be applied`);
      return false;
    }

    // Check whitelist
    if (Array.isArray(settings.whitelist) && settings.whitelist.includes(site)) {
      console.log(`[Dark Theme Extension] Site ${site} is whitelisted - dark theme WILL be applied`);
      return true;
    }

    // Check site-specific settings
    if (settings.siteSettings?.[site]?.enabled !== undefined) {
      const enabled = settings.siteSettings[site].enabled;
      console.log(`[Dark Theme Extension] Site ${site} has site-specific setting: ${enabled ? 'enabled' : 'disabled'}`);
      return enabled;
    }

    // Default to global setting
    const globalEnabled = settings.darkThemeEnabled || false;
    console.log(`[Dark Theme Extension] Using global setting for ${site}: ${globalEnabled ? 'enabled' : 'disabled'}`);
    return globalEnabled;
  } catch (error) {
    logError('determineShouldApply', error, { site, settings });
    return false; // Fail safe: don't apply theme if error occurs
  }
}

// Save site-specific settings
async function saveSiteSettings(site, enabled, intensity) {
  try {
    // Validate inputs
    if (!site || typeof site !== 'string') {
      throw new Error('Invalid site parameter');
    }

    const { siteSettings = {} } = await getSettingsSafely(['siteSettings']);

    siteSettings[site] = {
      enabled,
      intensity,
      lastModified: Date.now()
    };

    const saved = await saveSettingsSafely({ siteSettings });

    if (!saved) {
      console.warn('[Dark Theme Extension] Settings saved to fallback only (storage unavailable)');
    }
  } catch (error) {
    logError('saveSiteSettings', error, { site, enabled, intensity, storageAvailable });
  }
}

// Handle settings updates from other tabs
async function handleSettingsUpdate(changes) {
  try {
    // Get current settings to determine what changed
    const settings = await getSettingsSafely([
      'darkThemeEnabled',
      'intensity',
      'whitelist',
      'blacklist',
      'siteSettings'
    ]);

    const currentSite = window.location.hostname;

    // Validate we can access DOM
    if (!document.documentElement) {
      throw new Error('Document element not available');
    }

    const shouldApply = determineShouldApply(currentSite, settings);
    const isCurrentlyActive = document.documentElement.classList.contains('dark-theme-active');

    // Determine if we need to apply or remove the theme
    if (shouldApply && !isCurrentlyActive) {
      // Theme should be active but isn't - apply it
      const intensity = settings.siteSettings?.[currentSite]?.intensity || settings.intensity || 80;
      applyDarkTheme(intensity);
      console.log('[Dark Theme Extension] Applied theme due to settings update from another tab');
    } else if (!shouldApply && isCurrentlyActive) {
      // Theme is active but shouldn't be - remove it
      removeDarkTheme();
      console.log('[Dark Theme Extension] Removed theme due to settings update from another tab');
    } else if (shouldApply && isCurrentlyActive) {
      // Theme is active and should stay active - check if intensity changed
      if (changes.intensity || changes.siteSettings) {
        const intensity = settings.siteSettings?.[currentSite]?.intensity || settings.intensity || 80;
        applyDarkTheme(intensity);
        console.log('[Dark Theme Extension] Updated intensity due to settings update from another tab');
      }
    }
  } catch (error) {
    logError('handleSettingsUpdate', error, {
      changes,
      storageAvailable,
      documentReady: !!document.documentElement
    });
  }
}

// Listen for messages from popup and background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const messageStartTime = performance.now();
  try {
    // Validate message structure
    if (!message || typeof message !== 'object' || !message.type) {
      throw new Error('Invalid message format');
    }

    const currentSite = window.location.hostname;

    switch (message.type) {
      case 'TOGGLE_DARK_THEME':
        try {
          if (message.enabled) {
            const intensity = message.intensity || 80;
            applyDarkTheme(intensity);
            saveSiteSettings(currentSite, true, intensity);
          } else {
            removeDarkTheme();
            saveSiteSettings(currentSite, false, null);
          }
          recordPerformance('messageHandlingTime', performance.now() - messageStartTime);
          sendResponse({ success: true });
        } catch (error) {
          logError('TOGGLE_DARK_THEME handler', error, { message });
          recordPerformance('messageHandlingTime', performance.now() - messageStartTime);
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'UPDATE_INTENSITY':
        try {
          // Validate document is ready
          if (!document.documentElement) {
            throw new Error('Document element not available');
          }

          if (document.documentElement.classList.contains('dark-theme-active')) {
            applyDarkTheme(message.intensity);
            saveSiteSettings(currentSite, true, message.intensity);
          }
          recordPerformance('messageHandlingTime', performance.now() - messageStartTime);
          sendResponse({ success: true });
        } catch (error) {
          logError('UPDATE_INTENSITY handler', error, { message });
          recordPerformance('messageHandlingTime', performance.now() - messageStartTime);
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'SETTINGS_UPDATED':
        // Handle settings changes from other tabs
        handleSettingsUpdate(message.changes)
          .then(() => {
            recordPerformance('messageHandlingTime', performance.now() - messageStartTime);
            sendResponse({ success: true });
          })
          .catch((error) => {
            logError('SETTINGS_UPDATED handler', error, { message });
            recordPerformance('messageHandlingTime', performance.now() - messageStartTime);
            sendResponse({ success: false, error: error.message });
          });
        return true; // Keep channel open for async response

      case 'GET_PERFORMANCE_STATS':
        // Return performance statistics
        sendResponse({ success: true, stats: getPerformanceStats() });
        break;

      default:
        logError('Message handler', new Error('Unknown message type'), { messageType: message.type });
        recordPerformance('messageHandlingTime', performance.now() - messageStartTime);
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  } catch (error) {
    logError('Message handler', error, { message });
    recordPerformance('messageHandlingTime', performance.now() - messageStartTime);
    sendResponse({ success: false, error: error.message });
  }

  return true; // Keep message channel open for async response
});

// Listen for storage changes directly (additional sync mechanism)
chrome.storage.onChanged.addListener((changes, areaName) => {
  try {
    if (areaName === 'sync') {
      console.log('[Dark Theme Extension] Storage changed, syncing theme state');
      handleSettingsUpdate(changes);
    }
  } catch (error) {
    logError('Storage change listener', error, { changes, areaName });
  }
});

// Check if we're on a restricted page
function isRestrictedPage() {
  const url = window.location.href;
  const restrictedProtocols = ['chrome:', 'chrome-extension:', 'edge:', 'about:'];

  return restrictedProtocols.some(protocol => url.startsWith(protocol));
}

// Initialize on script load with safety checks
(function () {
  try {
    // Check if we're on a restricted page
    if (isRestrictedPage()) {
      console.log('[Dark Theme Extension] Skipping initialization on restricted page:', window.location.href);
      return;
    }

    // Check if document is ready
    if (document.readyState === 'loading') {
      // Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', () => {
        initDarkTheme();
      });
    } else {
      // DOM is already ready
      initDarkTheme();
    }
  } catch (error) {
    logError('Script initialization', error, {
      url: window.location.href,
      readyState: document.readyState
    });
  }
})();
