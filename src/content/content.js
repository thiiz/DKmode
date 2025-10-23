/**
 * Dark Theme Extension - Content Script
 * Intelligent dark theme with contrast detection
 */

// Settings cache
let settings = {
  darkThemeEnabled: true,
  blacklist: [],
  siteSettings: {}
};

/**
 * Get settings from storage
 */
async function getSettings() {
  try {
    const stored = await chrome.storage.sync.get(['darkThemeEnabled', 'blacklist', 'siteSettings']);
    settings = { ...settings, ...stored };
    return settings;
  } catch (error) {
    console.error('[Dark Theme] Storage error:', error);
    return settings;
  }
}

/**
 * Save site-specific settings
 */
async function saveSiteSettings(site, enabled) {
  try {
    const { siteSettings = {} } = await chrome.storage.sync.get('siteSettings');
    siteSettings[site] = { enabled, lastModified: Date.now() };
    await chrome.storage.sync.set({ siteSettings });
  } catch (error) {
    console.error('[Dark Theme] Save error:', error);
  }
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse RGB color string to array
 */
function parseRGB(colorString) {
  const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
}

/**
 * Detect if page already has dark theme
 */
function detectPageTheme() {
  const body = document.body;
  if (!body) return 'unknown';

  const bgColor = window.getComputedStyle(body).backgroundColor;
  const rgb = parseRGB(bgColor);

  if (!rgb) return 'unknown';

  const luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
  return luminance < 0.5 ? 'dark' : 'light';
}

/**
 * Analyze contrast of elements on page
 */
function analyzePageContrast() {
  const samples = [];
  const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a');

  // Sample up to 50 text elements
  const sampleSize = Math.min(50, elements.length);
  for (let i = 0; i < sampleSize; i++) {
    const el = elements[Math.floor(Math.random() * elements.length)];
    const styles = window.getComputedStyle(el);

    const bgColor = parseRGB(styles.backgroundColor);
    const textColor = parseRGB(styles.color);

    if (bgColor && textColor) {
      const contrast = getContrastRatio(bgColor, textColor);
      samples.push({ element: el.tagName, contrast });
    }
  }

  if (samples.length === 0) return null;

  const avgContrast = samples.reduce((sum, s) => sum + s.contrast, 0) / samples.length;
  const lowContrast = samples.filter(s => s.contrast < 4.5).length;

  return {
    average: avgContrast,
    lowContrastCount: lowContrast,
    totalSamples: samples.length,
    needsImprovement: avgContrast < 4.5 || lowContrast > samples.length * 0.3
  };
}

/**
 * Initialize dark theme
 */
async function initDarkTheme() {
  try {
    await getSettings();

    const currentSite = window.location.hostname;
    const shouldApply = determineShouldApply(currentSite);

    if (shouldApply) {
      applyDarkTheme();
    }
  } catch (error) {
    console.error('[Dark Theme] Init error:', error);
  }
}

/**
 * Detect and activate native dark mode
 */
function detectAndActivateNative() {
  // Check data-theme attribute
  const themeEl = document.querySelector('[data-theme]');
  if (themeEl) {
    themeEl.setAttribute('data-theme', 'dark');
    return 'data-theme';
  }

  // Check for dark mode classes
  const darkClasses = ['dark', 'dark-mode', 'theme-dark'];
  for (const cls of darkClasses) {
    if (document.documentElement.classList.contains(cls)) {
      return 'class-exists';
    }
  }

  // Try adding dark class
  document.documentElement.classList.add('dark');
  return 'class-added';
}

/**
 * Apply dark theme with contrast awareness
 */
function applyDarkTheme() {
  if (!document.documentElement) return;

  // Try native dark mode first
  const nativeMethod = detectAndActivateNative();

  // Always add our enhancement class
  document.documentElement.classList.add('dark-theme-active');
  document.documentElement.setAttribute('data-dark-mode', nativeMethod);

  console.log('[Dark Theme] Applied with method:', nativeMethod);

  // Analyze and improve contrast if needed
  setTimeout(() => {
    const contrast = analyzePageContrast();
    if (contrast?.needsImprovement) {
      document.documentElement.setAttribute('data-contrast-boost', 'true');
      console.log('[Dark Theme] Contrast boost enabled', contrast);
    }
  }, 500);
}

/**
 * Remove dark theme
 */
function removeDarkTheme() {
  if (!document.documentElement) return;

  const method = document.documentElement.getAttribute('data-dark-mode');

  // Revert native changes
  if (method === 'data-theme') {
    const themeEl = document.querySelector('[data-theme]');
    if (themeEl) themeEl.setAttribute('data-theme', 'light');
  } else if (method === 'class-added') {
    document.documentElement.classList.remove('dark');
  }

  // Remove our classes
  document.documentElement.classList.remove('dark-theme-active');
  document.documentElement.removeAttribute('data-dark-mode');
  document.documentElement.removeAttribute('data-contrast-boost');
}

/**
 * Determine if dark theme should be applied
 */
function determineShouldApply(site) {
  // Check blacklist
  if (settings.blacklist?.includes(site)) {
    return false;
  }

  // Check site-specific setting
  if (settings.siteSettings?.[site]?.enabled !== undefined) {
    return settings.siteSettings[site].enabled;
  }

  // Use global setting
  return settings.darkThemeEnabled !== false;
}

/**
 * Handle settings updates
 */
async function handleSettingsUpdate() {
  await getSettings();

  const currentSite = window.location.hostname;
  const shouldApply = determineShouldApply(currentSite);
  const isActive = document.documentElement?.classList.contains('dark-theme-active');

  if (shouldApply && !isActive) {
    applyDarkTheme();
  } else if (!shouldApply && isActive) {
    removeDarkTheme();
  }
}

/**
 * Message handler
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message?.type) {
    sendResponse({ success: false });
    return;
  }

  const currentSite = window.location.hostname;

  switch (message.type) {
    case 'TOGGLE_DARK_THEME':
      if (message.enabled) {
        applyDarkTheme();
        saveSiteSettings(currentSite, true);
      } else {
        removeDarkTheme();
        saveSiteSettings(currentSite, false);
      }
      sendResponse({ success: true });
      break;

    case 'SETTINGS_UPDATED':
      handleSettingsUpdate().then(() => {
        sendResponse({ success: true });
      });
      return true; // Async response

    case 'ANALYZE_CONTRAST':
      const contrast = analyzePageContrast();
      const theme = detectPageTheme();
      sendResponse({ success: true, contrast, theme });
      break;

    default:
      sendResponse({ success: false });
  }
});

/**
 * Storage change listener
 */
chrome.storage.onChanged.addListener((_changes, area) => {
  if (area === 'sync') {
    handleSettingsUpdate();
  }
});

/**
 * Watch for dynamic content changes
 */
function observeDynamicContent() {
  const observer = new MutationObserver(() => {
    // Re-check if theme is still applied
    if (document.documentElement.classList.contains('dark-theme-active')) {
      // Theme is active, ensure it stays applied
      const contrast = analyzePageContrast();
      if (contrast?.needsImprovement &&
        !document.documentElement.hasAttribute('data-contrast-boost')) {
        document.documentElement.setAttribute('data-contrast-boost', 'true');
        console.log('[Dark Theme] Contrast boost enabled after content change');
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Initialize
 */
(function init() {
  const url = window.location.href;

  // Skip restricted pages
  if (url.startsWith('chrome:') || url.startsWith('chrome-extension:') ||
    url.startsWith('edge:') || url.startsWith('about:')) {
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDarkTheme();
      setTimeout(observeDynamicContent, 1000);
    });
  } else {
    initDarkTheme();
    setTimeout(observeDynamicContent, 1000);
  }
})();
