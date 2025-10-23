import { useEffect, useState } from 'preact/hooks';
import { CurrentSiteInfo } from './components/CurrentSiteInfo';
import { Header } from './components/Header';
import { SiteListManager } from './components/SiteListManager';
import { ThemeToggle } from './components/ThemeToggle';

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

export function App() {
  // State management
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(true); // Enabled by default
  const [currentSite, setCurrentSite] = useState('');
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load settings from chrome.storage.sync on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await chrome.storage.sync.get([
          'darkThemeEnabled',
          'blacklist'
        ]);

        setDarkThemeEnabled(settings.darkThemeEnabled !== undefined ? settings.darkThemeEnabled : true);
        setBlacklist(settings.blacklist || []);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setError('Failed to load settings. Using default values.');

        // Use default values on error
        setDarkThemeEnabled(true);
        setBlacklist([]);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Query active tab to get current site
  useEffect(() => {
    const getCurrentTab = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
          // Check if URL is restricted
          if (isRestrictedUrl(tab.url)) {
            setCurrentSite('Restricted Page');
            setError('This extension cannot run on browser pages. Try a regular website.');
          } else {
            const url = new URL(tab.url);
            setCurrentSite(url.hostname);
          }
        } else {
          setCurrentSite('Unknown');
        }
      } catch (error) {
        console.error('Failed to get current tab:', error);
        setCurrentSite('Unknown');
        setError('Failed to detect current site.');
      }
    };

    getCurrentTab();
  }, []);

  /**
   * Send message to content script in the active tab
   * @param {Object} message - Message to send
   * @returns {Promise<Object>} Response from content script
   */
  const sendMessageToContentScript = async (message) => {
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
      if (isRestrictedUrl(tab.url)) {
        throw new Error('Cannot run extension on this page');
      }

      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, message);
      return response;
    } catch (error) {
      console.error('Failed to send message to content script:', error);

      // Provide more specific error messages
      if (error.message.includes('Receiving end does not exist')) {
        throw new Error('Content script not loaded. Try refreshing the page.');
      } else if (error.message.includes('Cannot run extension')) {
        throw error; // Re-throw with original message
      } else {
        throw new Error('Failed to communicate with page. Please try again.');
      }
    }
  };

  /**
   * Handle theme toggle
   * @param {boolean} enabled - New enabled state
   */
  const handleThemeToggle = async (enabled) => {
    try {
      // Clear any previous messages
      setError(null);
      setSuccess(null);

      // Update local state immediately for responsive UI
      setDarkThemeEnabled(enabled);

      // Send message to content script
      await sendMessageToContentScript({
        type: 'TOGGLE_DARK_THEME',
        enabled: enabled,
        site: currentSite
      });

      // Save settings to chrome.storage.sync
      await chrome.storage.sync.set({
        darkThemeEnabled: enabled
      });

      // chrome.storage.sync.set doesn't return a value on success
      setSuccess(enabled ? 'Dark theme enabled' : 'Dark theme disabled');

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      console.error('Failed to toggle theme:', error);

      // Revert local state on error
      setDarkThemeEnabled(!enabled);

      // Set error message based on error type
      if (error.message.includes('Cannot run extension on this page')) {
        setError('This extension cannot run on browser pages. Try a regular website.');
      } else if (error.message.includes('Content script not loaded')) {
        setError('Content script not loaded. Try refreshing the page.');
      } else if (error.message.includes('QUOTA_BYTES')) {
        setError('Storage quota exceeded. Please remove some sites from your lists.');
      } else {
        setError('Failed to toggle dark theme. Please try again.');
      }

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };



  /**
   * Handle blacklist changes (both add and remove operations)
   * @param {string[]} newBlacklist - Updated blacklist array
   */
  const handleBlacklistChange = async (newBlacklist) => {
    try {
      // Clear any previous messages
      setError(null);
      setSuccess(null);

      // Determine if this is an add or remove operation
      const isAddOperation = newBlacklist.length > blacklist.length;

      if (isAddOperation) {
        // Site was added to blacklist
        const addedSite = newBlacklist.find(site => !blacklist.includes(site));

        // Update local state
        setBlacklist(newBlacklist);

        // Save to chrome.storage.sync
        await chrome.storage.sync.set({ blacklist: newBlacklist });

        // Check if the newly added site is the current site
        if (addedSite === currentSite) {
          // Remove theme immediately if the current site was just blacklisted
          await sendMessageToContentScript({
            type: 'TOGGLE_DARK_THEME',
            enabled: false,
            site: currentSite
          });

          setSuccess(`${currentSite} added to blacklist and dark theme removed`);
        } else {
          setSuccess(`${addedSite} added to blacklist`);
        }
      } else {
        // Site was removed from blacklist
        const removedSite = blacklist.find(site => !newBlacklist.includes(site));

        // Update local state
        setBlacklist(newBlacklist);

        // Save to chrome.storage.sync
        await chrome.storage.sync.set({ blacklist: newBlacklist });

        // Check if the removed site is the current site
        if (removedSite === currentSite) {
          // Re-evaluate if theme should be applied based on global settings
          if (darkThemeEnabled) {
            // Apply theme if global setting is on
            await sendMessageToContentScript({
              type: 'TOGGLE_DARK_THEME',
              enabled: true,
              site: currentSite
            });

            setSuccess(`${currentSite} removed from blacklist and dark theme applied`);
          } else {
            setSuccess(`${currentSite} removed from blacklist`);
          }
        } else {
          setSuccess(`${removedSite} removed from blacklist`);
        }
      }

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      console.error('Failed to update blacklist:', error);

      // Revert local state on error
      setBlacklist(blacklist);

      // Set error message based on error type
      if (error.message.includes('Cannot run extension on this page')) {
        setError('Cannot apply theme to this page type.');
      } else if (error.message.includes('Content script not loaded')) {
        setError('Content script not loaded. Try refreshing the page.');
      } else if (error.message.includes('QUOTA_BYTES')) {
        setError('Storage quota exceeded. Cannot add more sites to blacklist.');
      } else {
        setError('Failed to update blacklist. Please try again.');
      }

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <ThemeToggle
        enabled={darkThemeEnabled}
        onToggle={handleThemeToggle}
        currentSite={currentSite}
      />

      <CurrentSiteInfo
        currentSite={currentSite}
        darkThemeEnabled={darkThemeEnabled}
      />

      <SiteListManager
        blacklist={blacklist}
        onBlacklistChange={handleBlacklistChange}
        currentSite={currentSite}
      />
    </div>
  );
}
