# Task 21: Settings Persistence on Page Load - Test Plan

## Overview
This document outlines the testing strategy for verifying that settings persistence works correctly on page load, as required by Task 21.

## Requirements Being Tested
- **Requirement 5.1**: Settings saved to chrome.storage.sync
- **Requirement 5.2**: Content script retrieves saved preferences on page load
- **Requirement 3.1**: Content script checks storage for dark theme state on page load

## Test Environment Setup

### Prerequisites
1. Chrome browser with extension loaded
2. Extension must be built and loaded as unpacked extension
3. Test file: `test-settings-persistence.html`

### Test File Location
- `test-settings-persistence.html` - Comprehensive test suite for all persistence scenarios

## Test Scenarios

### Test 1: Basic Settings Retrieval on Load
**Objective**: Verify content script retrieves settings from chrome.storage.sync on page load

**Steps**:
1. Open `test-settings-persistence.html`
2. Click "Run Test 1"
3. Observe test results

**Expected Results**:
- ✅ Settings saved to storage
- ✅ darkThemeEnabled retrieved correctly
- ✅ intensity retrieved correctly
- ✅ whitelist retrieved correctly
- ✅ blacklist retrieved correctly

**Verification**:
- Check console logs for storage retrieval
- Verify all settings are retrieved without errors

---

### Test 2: Dark Theme Auto-Apply on Load (Global Enabled)
**Objective**: Verify dark theme applies automatically when page loads if globally enabled

**Steps**:
1. Open `test-settings-persistence.html`
2. Click "Enable Global Dark Theme"
3. Click "Reload Page"
4. Observe page appearance

**Expected Results**:
- ✅ Page loads with dark theme active
- ✅ `dark-theme-active` class is present on `<html>` element
- ✅ CSS variables are set correctly
- ✅ Current state shows "Dark Theme Active: ✅ Yes"

**Verification**:
```javascript
// Check in console:
document.documentElement.classList.contains('dark-theme-active') // Should be true
document.documentElement.style.getPropertyValue('--dark-theme-intensity') // Should be set
```

---

### Test 3: Dark Theme Does Not Apply (Global Disabled)
**Objective**: Verify dark theme does not apply when globally disabled

**Steps**:
1. Open `test-settings-persistence.html`
2. Click "Disable Global Dark Theme"
3. Click "Reload Page"
4. Observe page appearance

**Expected Results**:
- ✅ Page loads without dark theme
- ✅ `dark-theme-active` class is NOT present
- ✅ Current state shows "Dark Theme Active: ❌ No"

---

### Test 4: Intensity Level Persistence
**Objective**: Verify intensity level is applied from saved settings on page load

**Steps**:
1. Open `test-settings-persistence.html`
2. Set intensity to 50 in the input field
3. Click "Save Intensity"
4. Click "Reload Page"
5. Check current intensity display

**Expected Results**:
- ✅ Page loads with dark theme at 50% intensity
- ✅ CSS variable `--dark-theme-intensity` is set to 0.5
- ✅ Current state shows "Intensity: 50%"
- ✅ Visual appearance reflects lower intensity

**Verification**:
```javascript
// Check in console:
parseFloat(document.documentElement.style.getPropertyValue('--dark-theme-intensity')) // Should be 0.5
```

**Repeat with different intensities**:
- Test with intensity = 0 (minimum)
- Test with intensity = 100 (maximum)
- Test with intensity = 75 (mid-range)

---

### Test 5: Whitelist Logic on Page Load
**Objective**: Verify whitelist logic works correctly - whitelisted sites get dark theme even when globally disabled

**Steps**:
1. Open `test-settings-persistence.html`
2. Click "Add Current Site to Whitelist"
3. Verify global dark theme is disabled
4. Click "Reload Page"
5. Observe page appearance

**Expected Results**:
- ✅ Page loads with dark theme active (despite global being disabled)
- ✅ `dark-theme-active` class is present
- ✅ Current state shows "Dark Theme Active: ✅ Yes"

**Cleanup**:
1. Click "Remove from Whitelist"
2. Reload to verify theme is removed

---

### Test 6: Blacklist Logic on Page Load
**Objective**: Verify blacklist logic works correctly - blacklisted sites never get dark theme even when globally enabled

**Steps**:
1. Open `test-settings-persistence.html`
2. Click "Add Current Site to Blacklist"
3. Verify global dark theme is enabled
4. Click "Reload Page"
5. Observe page appearance

**Expected Results**:
- ✅ Page loads WITHOUT dark theme (despite global being enabled)
- ✅ `dark-theme-active` class is NOT present
- ✅ Current state shows "Dark Theme Active: ❌ No"

**Cleanup**:
1. Click "Remove from Blacklist"
2. Reload to verify theme is applied

---

### Test 7: Site-Specific Settings Priority
**Objective**: Verify site-specific settings override global settings

**Scenario A: Site-Specific Enabled, Global Disabled**
1. Click "Enable for This Site Only"
2. Verify global is disabled
3. Reload page
4. Expected: Dark theme IS active

**Scenario B: Site-Specific Disabled, Global Enabled**
1. Click "Disable for This Site Only"
2. Verify global is enabled
3. Reload page
4. Expected: Dark theme IS NOT active

**Scenario C: Site-Specific with Custom Intensity**
1. Set site-specific enabled with intensity 90
2. Set global intensity to 50
3. Reload page
4. Expected: Dark theme uses 90% intensity (site-specific)

---

### Test 8: Complete Persistence Flow
**Objective**: Run a complete end-to-end test of all persistence mechanisms

**Steps**:
1. Open `test-settings-persistence.html`
2. Click "Run Complete Test"
3. Observe all test steps

**Expected Results**:
- ✅ Step 1: Cleared all settings
- ✅ Step 2: Set default settings
- ✅ Step 3: Enabled global dark theme
- ✅ Step 4: Set intensity to 65%
- ✅ Step 5: Added example.com to whitelist
- ✅ Step 6: Added test.com to blacklist
- ✅ Step 7: Set site-specific settings
- ✅ Step 8: All settings verified successfully
- ✅ Complete test passed!

**Final Verification**:
1. Reload page
2. Verify dark theme applies with correct settings
3. Check console for any errors

---

## Priority Logic Verification

The content script should follow this priority order:
1. **Blacklist** (highest priority) - Never apply if blacklisted
2. **Whitelist** - Always apply if whitelisted
3. **Site-Specific Settings** - Use site-specific if set
4. **Global Settings** (lowest priority) - Use global as fallback

### Test Priority Logic
```javascript
// Test in console after setting up various scenarios:

// Scenario 1: Site in blacklist + whitelist (blacklist wins)
// Expected: Dark theme NOT applied

// Scenario 2: Site in whitelist, global disabled
// Expected: Dark theme applied

// Scenario 3: Site-specific enabled, global disabled
// Expected: Dark theme applied

// Scenario 4: Site-specific disabled, global enabled
// Expected: Dark theme NOT applied
```

---

## Console Verification Commands

Use these commands in the browser console to verify persistence:

```javascript
// Check if dark theme is active
document.documentElement.classList.contains('dark-theme-active')

// Check current intensity
document.documentElement.style.getPropertyValue('--dark-theme-intensity')

// Get all settings from storage
chrome.storage.sync.get([
  'darkThemeEnabled',
  'intensity',
  'whitelist',
  'blacklist',
  'siteSettings'
], (settings) => console.log('Current settings:', settings))

// Check current site
window.location.hostname

// Manually trigger initDarkTheme (if needed for debugging)
// Note: This is not exposed, but you can reload the page
```

---

## Error Scenarios to Test

### Test 9: Storage Failure Handling
**Objective**: Verify graceful degradation when storage fails

**Steps**:
1. Simulate storage failure (if possible)
2. Reload page
3. Verify no errors break the page

**Expected Results**:
- ✅ Content script handles error gracefully
- ✅ Error logged to console
- ✅ Page remains functional
- ✅ Default settings used as fallback

---

### Test 10: Missing Settings
**Objective**: Verify behavior when settings are not yet initialized

**Steps**:
1. Clear all settings: `chrome.storage.sync.clear()`
2. Reload page
3. Observe behavior

**Expected Results**:
- ✅ No errors thrown
- ✅ Dark theme not applied (default: disabled)
- ✅ Content script initializes without issues

---

## Performance Verification

### Test 11: Load Time Impact
**Objective**: Verify settings retrieval doesn't significantly impact page load

**Steps**:
1. Open Chrome DevTools Performance tab
2. Start recording
3. Reload page
4. Stop recording
5. Analyze content script execution time

**Expected Results**:
- ✅ Content script execution < 50ms
- ✅ Storage retrieval < 20ms
- ✅ Theme application < 30ms
- ✅ No blocking of page render

---

## Cross-Browser Tab Testing

### Test 12: Settings Sync Across Tabs
**Objective**: Verify settings persist across multiple tabs

**Steps**:
1. Open `test-settings-persistence.html` in Tab 1
2. Enable dark theme and set intensity to 70
3. Open same page in Tab 2
4. Reload Tab 2
5. Verify dark theme applies with 70% intensity

**Expected Results**:
- ✅ Tab 2 loads with same settings as Tab 1
- ✅ Both tabs show consistent theme state

---

## Automated Test Checklist

Run through this checklist to verify all requirements:

- [ ] Content script retrieves settings from chrome.storage.sync on load
- [ ] Dark theme applies automatically when enabled globally
- [ ] Dark theme does not apply when disabled globally
- [ ] Intensity level is applied from saved settings
- [ ] Whitelist logic works: whitelisted sites get theme even when global disabled
- [ ] Blacklist logic works: blacklisted sites never get theme even when global enabled
- [ ] Site-specific settings override global settings
- [ ] Priority order is correct: blacklist > whitelist > site-specific > global
- [ ] Error handling works when storage fails
- [ ] Missing settings don't cause errors
- [ ] Performance impact is minimal
- [ ] Settings persist across page reloads
- [ ] Settings sync across browser tabs

---

## Success Criteria

Task 21 is complete when:
1. ✅ All 12 test scenarios pass
2. ✅ No console errors during normal operation
3. ✅ Settings persist correctly across page reloads
4. ✅ All priority logic works as designed
5. ✅ Performance requirements are met
6. ✅ Error handling is graceful

---

## Notes

- The content script already has the implementation in place
- This task focuses on verification and testing
- Any bugs found during testing should be documented and fixed
- Console logs should be checked for any warnings or errors
- Test on multiple websites to ensure consistency

---

## Test Results Log

Use this section to log test results:

### Test Run 1: [Date/Time]
- Test 1: ⬜ Pass / ⬜ Fail
- Test 2: ⬜ Pass / ⬜ Fail
- Test 3: ⬜ Pass / ⬜ Fail
- Test 4: ⬜ Pass / ⬜ Fail
- Test 5: ⬜ Pass / ⬜ Fail
- Test 6: ⬜ Pass / ⬜ Fail
- Test 7: ⬜ Pass / ⬜ Fail
- Test 8: ⬜ Pass / ⬜ Fail
- Test 9: ⬜ Pass / ⬜ Fail
- Test 10: ⬜ Pass / ⬜ Fail
- Test 11: ⬜ Pass / ⬜ Fail
- Test 12: ⬜ Pass / ⬜ Fail

**Issues Found**: [List any issues]

**Overall Status**: ⬜ All Tests Passed / ⬜ Some Tests Failed
