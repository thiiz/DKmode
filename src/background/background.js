// Background Service Worker for Dark Theme Extension

// Default settings for new installations
const DEFAULT_SETTINGS = {
  darkThemeEnabled: true, // Enabled by default
  intensity: 80,
  blacklist: [],
  siteSettings: {}
};

// Handle extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Dark Theme] Extension installed/updated:', details.reason);

  if (details.reason === 'install') {
    // Initialize default settings on first install
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
      if (chrome.runtime.lastError) {
        console.error('[Dark Theme] Error setting default settings:', chrome.runtime.lastError);
      } else {
        console.log('[Dark Theme] Default settings initialized');
      }
    });
  } else if (details.reason === 'update') {
    // Handle settings migration for updates
    const previousVersion = details.previousVersion;
    console.log('[Dark Theme] Updating from version:', previousVersion);

    // Get current settings and merge with any new defaults
    chrome.storage.sync.get(null, (currentSettings) => {
      if (chrome.runtime.lastError) {
        console.error('[Dark Theme] Error getting settings for migration:', chrome.runtime.lastError);
        return;
      }

      // Merge current settings with new defaults (preserving user data)
      const migratedSettings = { ...DEFAULT_SETTINGS, ...currentSettings };

      chrome.storage.sync.set(migratedSettings, () => {
        if (chrome.runtime.lastError) {
          console.error('[Dark Theme] Error migrating settings:', chrome.runtime.lastError);
        } else {
          console.log('[Dark Theme] Settings migrated successfully');
        }
      });
    });
  }
});

// Message relay and broadcast functionality
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Dark Theme] Background received message:', message.type);

  // Handle broadcast requests from popup
  if (message.type === 'BROADCAST_SETTINGS') {
    // Send settings update to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        // Skip chrome:// and other restricted URLs
        if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'SETTINGS_UPDATED',
            settings: message.settings
          }).catch((error) => {
            // Tab may not have content script loaded, ignore error
            console.log(`[Dark Theme] Could not send message to tab ${tab.id}:`, error.message);
          });
        }
      });
    });

    sendResponse({ success: true });
    return true; // Keep message channel open for async response
  }

  // Handle other message types if needed
  sendResponse({ success: true });
  return true;
});

// Listen for storage changes and sync across tabs
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    console.log('[Dark Theme] Storage changed:', Object.keys(changes));

    // Notify all tabs of settings changes
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        // Skip chrome:// and other restricted URLs
        if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'SETTINGS_UPDATED',
            changes: changes
          }).catch((error) => {
            // Tab may not have content script loaded, ignore error
            console.log(`[Dark Theme] Could not send storage change to tab ${tab.id}:`, error.message);
          });
        }
      });
    });
  }
});

console.log('[Dark Theme] Background service worker initialized');
