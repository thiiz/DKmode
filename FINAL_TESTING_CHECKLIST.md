# Final Testing Checklist - Dark Theme Extension

## Quick Start

This checklist provides a quick way to verify all functionality of the Dark Theme Extension before deployment.

**Estimated Time**: 15-20 minutes

---

## Prerequisites

- [ ] Chrome browser installed
- [ ] Extension built (`npm run build`)
- [ ] Extension loaded in Chrome (chrome://extensions → Load unpacked → select `dist` folder)

---

## 1. Basic Functionality (5 minutes)

### Extension Loading
- [ ] Extension appears in chrome://extensions
- [ ] No errors shown in extension details
- [ ] Extension icon visible in Chrome toolbar

### Popup Interface
- [ ] Click extension icon → Popup opens
- [ ] Popup displays correctly (no layout issues)
- [ ] All components visible:
  - [ ] Header with title
  - [ ] Theme toggle switch
  - [ ] Intensity slider
  - [ ] Current site info
  - [ ] Whitelist section
  - [ ] Blacklist section

### Dark Theme Toggle
- [ ] Navigate to any website (e.g., wikipedia.org)
- [ ] Open extension popup
- [ ] Toggle dark theme ON
- [ ] Page darkens immediately
- [ ] Toggle dark theme OFF
- [ ] Page returns to normal immediately
- [ ] No console errors

---

## 2. Intensity Control (3 minutes)

### Slider Functionality
- [ ] Enable dark theme on a test page
- [ ] Move intensity slider to 0%
- [ ] Page shows subtle darkening
- [ ] Move intensity slider to 50%
- [ ] Page shows moderate darkening
- [ ] Move intensity slider to 100%
- [ ] Page shows maximum darkening
- [ ] Slider moves smoothly, no lag

### Persistence
- [ ] Set intensity to 65%
- [ ] Refresh the page
- [ ] Dark theme applies with 65% intensity
- [ ] Open popup → Slider shows 65%

---

## 3. Whitelist Functionality (3 minutes)

### Adding to Whitelist
- [ ] Navigate to a test site
- [ ] Disable global dark theme toggle
- [ ] Page is light (no dark theme)
- [ ] Add current site to whitelist
- [ ] Dark theme applies immediately
- [ ] Site appears in whitelist

### Whitelist Persistence
- [ ] Refresh the page
- [ ] Dark theme still applied (global toggle still OFF)
- [ ] Navigate to different site
- [ ] Dark theme not applied (not whitelisted)
- [ ] Return to whitelisted site
- [ ] Dark theme applied again

### Removing from Whitelist
- [ ] Remove site from whitelist
- [ ] Dark theme removed immediately
- [ ] Site no longer in whitelist

---

## 4. Blacklist Functionality (3 minutes)

### Adding to Blacklist
- [ ] Navigate to a test site
- [ ] Enable global dark theme toggle
- [ ] Page is dark
- [ ] Add current site to blacklist
- [ ] Dark theme removed immediately
- [ ] Site appears in blacklist

### Blacklist Persistence
- [ ] Refresh the page
- [ ] Dark theme not applied (global toggle still ON)
- [ ] Navigate to different site
- [ ] Dark theme applied (not blacklisted)
- [ ] Return to blacklisted site
- [ ] Dark theme not applied

### Removing from Blacklist
- [ ] Remove site from blacklist
- [ ] Dark theme applied immediately
- [ ] Site no longer in blacklist

---

## 5. Settings Persistence (2 minutes)

### Browser Restart
- [ ] Configure specific settings:
  - [ ] Dark theme: ON
  - [ ] Intensity: 75%
  - [ ] Add 2 sites to whitelist
  - [ ] Add 1 site to blacklist
- [ ] Close Chrome completely
- [ ] Reopen Chrome
- [ ] Open extension popup
- [ ] All settings retained:
  - [ ] Dark theme: ON
  - [ ] Intensity: 75%
  - [ ] Whitelist has 2 sites
  - [ ] Blacklist has 1 site

---

## 6. Error Handling (2 minutes)

### Restricted Pages
- [ ] Navigate to chrome://extensions
- [ ] Open extension popup
- [ ] Error message displayed: "This extension cannot run on browser pages"
- [ ] Toggle switch disabled or shows appropriate state

### Content Script Not Loaded
- [ ] Open a new tab (about:blank)
- [ ] Immediately open extension popup
- [ ] Try to toggle dark theme
- [ ] If error occurs, user-friendly message shown

---

## 7. Cross-Tab Synchronization (2 minutes)

### Multiple Tabs
- [ ] Open two tabs with the same website
- [ ] In Tab 1: Enable dark theme
- [ ] Switch to Tab 2
- [ ] Dark theme applied in Tab 2
- [ ] In Tab 2: Change intensity to 50%
- [ ] Switch to Tab 1
- [ ] Intensity updated to 50% in Tab 1

---

## 8. Performance Check (2 minutes)

### Visual Performance
- [ ] Toggle dark theme on/off rapidly (10 times)
- [ ] No lag or delay
- [ ] No visual glitches
- [ ] Smooth transitions

### Memory Usage
- [ ] Open Chrome Task Manager (Shift+Esc)
- [ ] Find "Extension: Dark Theme Extension"
- [ ] Memory usage < 5MB
- [ ] No memory leaks after extended use

### Console Errors
- [ ] Open DevTools Console (F12)
- [ ] Perform various operations
- [ ] No errors in console
- [ ] Only expected log messages

---

## 9. Various Website Types (3 minutes)

### Static HTML Sites
- [ ] Test on Wikipedia
- [ ] Dark theme applies correctly
- [ ] Text readable
- [ ] Images not over-inverted

### React/Vue SPAs
- [ ] Test on GitHub
- [ ] Dark theme applies correctly
- [ ] Navigation works
- [ ] Dynamic content handled

### Complex Layouts
- [ ] Test on Gmail or similar
- [ ] Dark theme applies correctly
- [ ] Layout not broken
- [ ] Interactive elements work

### Sites with Existing Dark Mode
- [ ] Test on Reddit or similar
- [ ] Extension dark theme applies
- [ ] No conflicts with site's dark mode
- [ ] Can toggle extension off to use site's mode

---

## 10. Edge Cases (2 minutes)

### Hostname Variations
- [ ] Test www.example.com
- [ ] Test example.com (without www)
- [ ] Treated as separate sites ✓
- [ ] Each can be added to lists independently

### Subdomain Handling
- [ ] Test github.com
- [ ] Test gist.github.com
- [ ] Treated as separate sites ✓
- [ ] Each can be added to lists independently

### Priority Testing
- [ ] Add same site to both whitelist and blacklist
- [ ] Blacklist takes priority (theme not applied) ✓
- [ ] Remove from blacklist
- [ ] Whitelist now works (theme applied) ✓

---

## Test Results Summary

### Overall Status
- [ ] All tests passed
- [ ] Some tests failed (document below)
- [ ] Tests could not be completed (document below)

### Issues Found
```
[Document any issues here]

Issue #1:
- Description:
- Severity:
- Steps to reproduce:
- Expected vs Actual:

Issue #2:
...
```

### Performance Notes
```
[Document any performance observations]

- Toggle speed:
- Memory usage:
- Visual smoothness:
- Console errors:
```

---

## Quick Verification Commands

### Check Storage
```javascript
// In browser console
chrome.storage.sync.get(null, (data) => console.log('Settings:', data));
```

### Check Performance
```javascript
// On any page with extension loaded
window.__darkThemePerformance.getStats();
```

### Check Dark Theme Status
```javascript
// On any page
console.log('Dark theme active:', document.documentElement.classList.contains('dark-theme-active'));
```

---

## Test Environment

**Date**: ___________  
**Tester**: ___________  
**Chrome Version**: ___________  
**Extension Version**: 1.0.0  
**Operating System**: ___________  

---

## Sign-Off

- [ ] All critical tests passed
- [ ] All high-priority tests passed
- [ ] Performance acceptable
- [ ] No critical bugs found
- [ ] Extension ready for deployment

**Tested By**: ___________  
**Date**: ___________  
**Signature**: ___________  

---

## Additional Test Pages

For more comprehensive testing, use the provided test pages:

1. **Settings Persistence**: `test-settings-persistence.html`
2. **Whitelist/Blacklist**: `test-whitelist-blacklist.html`
3. **Intensity Control**: `test-intensity-control.html`
4. **Performance**: `test-performance.html`
5. **Hostname Edge Cases**: `test-hostname-edge-cases.html`

---

## Troubleshooting

### Extension Not Loading
- Check chrome://extensions for errors
- Verify dist folder contains all files
- Try removing and re-adding extension

### Dark Theme Not Applying
- Check if site is blacklisted
- Verify content script loaded (check console)
- Refresh the page
- Check if URL is restricted (chrome://, etc.)

### Settings Not Persisting
- Check Chrome sync is enabled
- Verify storage permissions in manifest
- Check console for storage errors
- Try clearing extension storage and reconfiguring

### Performance Issues
- Check Chrome Task Manager for memory usage
- Look for console errors
- Test on simpler websites first
- Verify no other extensions conflicting

---

**Checklist Version**: 1.0  
**Last Updated**: 2025-10-22  
**Status**: Ready for use
