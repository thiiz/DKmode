# Implementation Plan

- [x] 1. Initialize project structure and configuration






  - Create React project with Vite using template
  - Install required dependencies (vite, react, react-dom)
  - Configure package.json with build scripts
  - Create directory structure for popup, content, background, and assets
  - _Requirements: 1.1, 1.2_




- [x] 2. Configure Vite for Chrome extension build






  - Create vite.config.js with multiple entry points (popup, content, background)
  - Configure rollupOptions to output separate JS files without code splitting
  - Set up publicDir to copy manifest.json and assets to dist
  - Configure output file naming to match extension requirements




  - Test build process to verify dist folder structure
  - _Requirements: 1.3, 1.4, 1.5_





- [x] 3. Create manifest.json file


  - Write manifest.json in public directory with manifest_version 3
  - Add extension metadata (name, version, description)
  - Configure permissions array (storage, activeTab, scripting)




  - Set host_permissions to ["<all_urls>"]
  - Define action with default_popup and icon paths

  - Configure content_scripts with matches, js, css, and run_at settings
  - Add background service_worker configuration
  - Define icons for multiple sizes
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 4. Implement dark theme CSS styles




  - Create src/content/content.css file
  - Define CSS custom properties for intensity control (--dark-theme-intensity, --dark-bg, --dark-text, --dark-border)
  - Write styles for .dark-theme-active class targeting body and all elements
  - Add specific styles for input elements, textareas, and selects
  - Style links and visited links with appropriate dark theme colors
  - Implement media element protection (img, video, canvas) with brightness filters
  - Style buttons with dark theme colors
  - Use !important declarations to override site styles
  - Test CSS on sample HTML page to verify appearance
  - _Requirements: 3.5, 3.6, 3.7, 8.5, 8.6_


- [x] 5. Implement content script core functionality




  - Create src/content/content.js file
  - Write initDarkTheme() function to check storage and apply theme on page load
  - Implement applyDarkTheme(intensity) function to add class and set CSS variables
  - Implement removeDarkTheme() function to remove class
  - Write determineShouldApply(site, settings) function with whitelist/blacklist logic
  - Add chrome.runtime.onMessage listener for TOGGLE_DARK_THEME messages
  - Add chrome.runtime.onMessage listener for UPDATE_INTENSITY messages
  - Implement saveSiteSettings() function to persist per-site preferences
  - Call initDarkTheme() on script load
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.5, 8.4_


- [x] 6. Implement storage helper functions




  - Create utility functions for chrome.storage.sync.get() with error handling
  - Create utility functions for chrome.storage.sync.set() with error handling
  - Implement getSettings() function to retrieve all extension settings
  - Implement saveSettings(settings) function to persist settings
  - Add error logging for storage failures
  - Implement fallback to default values when storage fails
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 7. Create popup HTML structure





  - Create src/popup/popup.html file
  - Add HTML structure with root div for React mounting
  - Link to popup.js script
  - Add basic meta tags and title
  - _Requirements: 4.1_
-

- [x] 8. Implement popup Preact component structure




  - Create src/popup/main.jsx as entry point
  - Create src/popup/App.jsx as main component
  - Set up Preact state for darkThemeEnabled, intensity, currentSite, whitelist, blacklist
  - Implement useEffect to load settings from chrome.storage.sync on mount
  - Implement useEffect to query active tab using chrome.tabs.query
  - Create component structure with Header, ThemeToggle, IntensitySlider, CurrentSiteInfo, SiteListManager
  - _Requirements: 4.1, 4.2, 4.7_





- [x] 9. Implement theme toggle functionality in popup









  - Create ThemeToggle component with switch UI
  - Add onChange handler to toggle darkThemeEnabled state
  - Implement sendMessageToContentScript() function using chrome.tabs.sendMessage
  - Send TOGGLE_DARK_THEME message with enabled state and current site



  - Save updated settings to chrome.storage.sync

  - Add error handling for message sending failures
  - Display user feedback when toggle succeeds or fails
  - _Requirements: 4.3, 4.5, 4.6_




-

- [x] 10. Implement intensity slider in popup






  - Create IntensitySlider component with range input (0-100)
  - Add onChange handler to update intensity state
  - Implement debounced function to send UPDATE_INTENSITY message to content script
  - Save intensity value to chrome.storage.sync after debounce
  - Display current intensity value as percentage





  - _Requirements: 4.3, 4.6, 8.1, 8.2, 8.3_





- [x] 11. Implement current site info display



  - Create CurrentSiteInfo component
  - Display current site hostname from active tab
  - Show whether dark theme is currently enabled for this site
  - Display current intensity level






  - Add visual indicator (icon or color) for theme status
  - _Requirements: 4.4_

- [x] 12. Implement site list management UI



  - Create SiteListManager component
  - Create SiteList component that accepts type prop (whitelist or blacklist)



  - Display list of sites for each type



  - Add input field and button to add new sites

  - Add remove button for each site in the list
  - Validate site input (basic hostname format check)



  - _Requirements: 4.8, 7.3_


- [x] 13. Implement whitelist functionality






  - Add handleAddToWhitelist() function in popup
  - Update whitelist array in state and storage
  - Send message to content script to apply theme immediately if site is whitelisted
  - Add handleRemoveFromWhitelist() function
  - Update storage when whitelist changes








  - _Requirements: 7.1, 7.4_


- [x] 14. Implement blacklist functionality



  - Add handleAddToBlacklist() function in popup
  - Update blacklist array in state and storage
  - Send message to content script to remove theme immediately if site is blacklisted
  - Add handleRemoveFromBlacklist() function




  - Update storage when blacklist changes
  - _Requirements: 7.2, 7.4_

- [x] 15. Implement background service worker






  - Create src/background/background.js file
  - Add chrome.runtime.onInstalled listener for install and update events
  - Implement initialization of default settings on install

  - Implement settings migration logic for updates (if needed)
  - Add chrome.runtime.onMessage listener for message relay
  - Implement broadcast functionality to send settings to all tabs

  - Add chrome.storage.onChanged listener to sync settings across tabs
  - _Requirements: 6.1, 6.2, 6.3, 6.4_





- [x] 16. Implement cross-tab synchronization


  - Add SETTINGS_UPDATED message handler in content script
  - Update content script to listen for storage changes from other tabs
  - Implement logic to reapply theme when settings change in another tab
  - Test synchronization by opening multiple tabs and changing settings
  - _Requirements: 5.3, 5.4, 6.3_




- [x] 17. Add error handling to content script









  - Wrap DOM manipulation in try-catch blocks
  - Add error logging function with context
  - Implement graceful degradation when storage fails
  - Add fallback to in-memory settings if storage is unavailable
  - Test error scenarios (restricted pages, storage failures)
  - _Requirements: 5.5_




- [x] 18. Add error handling to popup






  - Add try-catch blocks around chrome API calls
  - Implement error state in Preact components
  - Display user-friendly error messages in UI
  - Check tab.url before sending messages to avoid restricted pages
  - Show message when extension cannot run on current page (chrome://, etc.)
  - _Requirements: 5.5_

- [x] 19. Create extension icons

  - Create or source icon images in multiple sizes (16x16, 32x32, 48x48, 128x128)
  - Save icons to src/assets/icons/ directory
  - Ensure icons are in PNG format
  - Verify icons display correctly in Chrome toolbar and extensions page
  - _Requirements: 2.5_


- [x] 20. Add popup styling


  - Create CSS file for popup components
  - Style ThemeToggle with modern switch design
  - Style IntensitySlider with custom range input appearance
  - Style SiteListManager with clean list layout
  - Add responsive design for different popup sizes
  - Ensure good contrast and readability
  - Add hover and focus states for interactive elements
  - _Requirements: 4.1_



- [x] 21. Implement settings persistence on page load





  - Verify content script retrieves settings from chrome.storage.sync on load
  - Test that dark theme applies automatically when page loads if enabled
  - Verify intensity level is applied from saved settings



  - Test whitelist/blacklist logic on page load
  - _Requirements: 5.1, 5.2, 3.1_





- [x] 22. Test build and extension loading


  - Run npm run build command
  - Verify dist folder contains all required files (manifest.json, popup.html, popup.js, content.js, content.css, background.js, icons)
  - Load unpacked extension in Chrome from dist folder
  - Verify extension appears in chrome://extensions




  - Check for any console errors during load

  - _Requirements: 9.1, 9.2, 9.3_


- [x] 23. Test dark theme on various websites



  - Test extension on static HTML sites
  - Test on React/Vue/Angular SPAs
  - Test on complex sites (Gmail, Twitter, GitHub)
  - Verify no visual glitches or broken layouts
  - Check that images and videos are not over-inverted
  - Test on sites with existing dark modes
  - _Requirements: 3.5, 3.6, 3.7_

- [x] 24. Test settings persistence and sync









  - Change settings in popup and verify they persist after closing popup
  - Close and reopen browser, verify settings are retained
  - Test sync across Chrome instances (if possible with multiple devices/profiles)
  - Verify site-specific settings persist correctly
  - _Requirements: 5.1, 5.2, 5.3, 5.4_



- [x] 25. Test whitelist and blacklist functionality








  - Add site to whitelist, verify dark theme applies even when globally disabled
  - Add site to blacklist, verify dark theme never applies even when globally enabled
  - Test removing sites from lists
  - Verify list changes persist across sessions

  - Test edge cases (subdomain handling, www vs non-www)



  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_





- [x] 26. Test intensity control


  - Adjust intensity slider and verify immediate visual changes
  - Test minimum intensity (subtle changes)






  - Test maximum intensity (full inversion)
  - Verify intensity persists after page reload
  - Test intensity on different types of content (text, images, videos)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 27. Performance testing and optimization





  - Measure content script execution time on various sites
  - Check memory usage in Chrome Task Manager
  - Verify no noticeable lag when toggling theme
  - Test on low-end devices if possible
  - Optimize any performance bottlenecks found
  - _Requirements: 9.5_

- [ ] 28. Fix any bugs found during testing



  - Document bugs with reproduction steps
  - Prioritize bugs by severity
  - Fix critical bugs that break core functionality


  - Fix UI/UX issues that impact usability
  - Retest after fixes to verify resolution
  - _Requirements: 9.4_
