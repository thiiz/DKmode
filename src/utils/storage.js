/**
 * Storage utility functions for Chrome extension
 * Provides error handling and fallback mechanisms for chrome.storage.sync operations
 */

// Default settings for the extension
const DEFAULT_SETTINGS = {
  darkThemeEnabled: true, // Enabled by default
  blacklist: [],
  siteSettings: {}
};

/**
 * Log error with context
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 */
function logError(context, error) {
  console.error(`[Dark Theme Extension] ${context}:`, error);
}

/**
 * Get data from chrome.storage.sync with error handling
 * @param {string|string[]|Object} keys - Keys to retrieve
 * @returns {Promise<Object>} Retrieved data or empty object on error
 */
export async function storageGet(keys) {
  try {
    const result = await chrome.storage.sync.get(keys);
    return result;
  } catch (error) {
    logError('storageGet', error);
    return {};
  }
}

/**
 * Set data in chrome.storage.sync with error handling
 * @param {Object} items - Key-value pairs to store
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function storageSet(items) {
  try {
    await chrome.storage.sync.set(items);
    return true;
  } catch (error) {
    logError('storageSet', error);
    return false;
  }
}

/**
 * Get all extension settings with fallback to defaults
 * @returns {Promise<Object>} Extension settings
 */
export async function getSettings() {
  try {
    const keys = Object.keys(DEFAULT_SETTINGS);
    const result = await chrome.storage.sync.get(keys);

    // Merge with defaults to ensure all required keys exist
    const settings = { ...DEFAULT_SETTINGS };

    for (const key of keys) {
      if (result[key] !== undefined) {
        settings[key] = result[key];
      }
    }

    return settings;
  } catch (error) {
    logError('getSettings', error);
    // Return default settings on error
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save extension settings to storage
 * @param {Object} settings - Settings object to save
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function saveSettings(settings) {
  try {
    // Validate settings object
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings object');
    }

    await chrome.storage.sync.set(settings);
    return true;
  } catch (error) {
    logError('saveSettings', error);
    return false;
  }
}

/**
 * Get a specific setting value with fallback to default
 * @param {string} key - Setting key to retrieve
 * @returns {Promise<any>} Setting value or default value
 */
export async function getSetting(key) {
  try {
    const result = await chrome.storage.sync.get(key);

    if (result[key] !== undefined) {
      return result[key];
    }

    // Return default value if key exists in defaults
    if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
      return DEFAULT_SETTINGS[key];
    }

    return null;
  } catch (error) {
    logError('getSetting', error);
    // Return default value on error
    return DEFAULT_SETTINGS.hasOwnProperty(key) ? DEFAULT_SETTINGS[key] : null;
  }
}

/**
 * Save a specific setting value
 * @param {string} key - Setting key
 * @param {any} value - Setting value
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function saveSetting(key, value) {
  try {
    await chrome.storage.sync.set({ [key]: value });
    return true;
  } catch (error) {
    logError('saveSetting', error);
    return false;
  }
}

/**
 * Clear all extension settings
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function clearSettings() {
  try {
    const keys = Object.keys(DEFAULT_SETTINGS);
    await chrome.storage.sync.remove(keys);
    return true;
  } catch (error) {
    logError('clearSettings', error);
    return false;
  }
}

/**
 * Reset settings to defaults
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function resetToDefaults() {
  try {
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
    return true;
  } catch (error) {
    logError('resetToDefaults', error);
    return false;
  }
}

// Export default settings for use in other modules
export { DEFAULT_SETTINGS };

