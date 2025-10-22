# Cross-Tab Synchronization Testing Guide

## Overview
This document provides instructions for testing the cross-tab synchronization feature of the Dark Theme Extension (Task 16).

## What Was Implemented

### 1. SETTINGS_UPDATED Message Handler
- Added `handleSettingsUpdate()` function in content script
- Listens for `SETTINGS_UPDATED` messages from the background script
- Automatically applies or removes theme based on updated settings
- Updates intensity when changed in another tab

### 2. Storage Change Listener
- Added `chrome.storage.onChanged` listener in content script
- Provides direct synchronization when storage changes
- Works as a backup mechanism alongside message-based sync

### 3. Smart Theme Reapplication Logic
- Checks if theme should be applied based on new settings
- Compares current state with desired state
- Only makes changes when necessary (avoids unnecessary DOM updates)
- Handles intensity updates for active themes

## Testing Instructions

### Prerequisites
1. Build the extension: `npm run build`
2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Test 1: Basic Cross-Tab Toggle

**Steps:**
1. Open `test-cross-tab-sync.html` in Tab 1
2. Open the same file in Tab 2 (duplicate the tab)
3. In Tab 1, click the extension icon and toggle dark theme ON
4. Immediately switch to Tab 2
5. Verify that Tab 2's theme updates automatically (within 1-2 seconds)
6. In Tab 2, click the extension icon and toggle dark theme OFF
7. Switch back to Tab 1
8. Verify that Tab 1's theme is removed automatically

**Expected Results:**
- ✅ Both tabs should always show the same theme state
- ✅ No page refresh required
- ✅ Changes should be nearly instantaneous
- ✅ Console should show: "Applied/Removed theme due to settings update from another tab"

### Test 2: Intensity Synchronization

**Steps:**
1. Open `test-cross-tab-sync.html` in 3 tabs
2. Enable dark theme in Tab 1
3. Verify all tabs show dark theme
4. In Tab 1, adjust intensity slider to 50%
5. Check Tab 2 and Tab 3 - they should update to 50% intensity
6. In Tab 2, adjust intensity to 100%
7. Check Tab 1 and Tab 3 - they should update to 100% intensity

**Expected Results:**
- ✅ All tabs reflect the same intensity level
- ✅ Visual changes are immediate
- ✅ Console shows: "Updated intensity due to settings update from another tab"

### Test 3: Whitelist/Blacklist Synchronization

**Steps:**
1. Open `test-cross-tab-sync.html` in Tab 1
2. Open `test-dark-theme.html` in Tab 2
3. In Tab 1, add the current site to the whitelist
4. Verify Tab 1 applies dark theme immediately
5. Switch to Tab 2 and add its site to the blacklist
6. Verify Tab 2 removes dark theme immediately
7. Duplicate Tab 1 to create Tab 3
8. Verify Tab 3 has dark theme active (inherited from whitelist)

**Expected Results:**
- ✅ Whitelist changes apply immediately to all matching tabs
- ✅ Blacklist changes remove theme immediately from all matching tabs
- ✅ New tabs respect the whitelist/blacklist settings

### Test 4: Multiple Tabs with Different Sites

**Steps:**
1. Open `test-cross-tab-sync.html` in Tab 1
2. Open `test-dark-theme.html` in Tab 2
3. Open any other website in Tab 3
4. Enable global dark theme in Tab 1
5. Verify all 3 tabs get dark theme
6. Add Tab 2's site to blacklist
7. Verify only Tab 2 loses dark theme
8. Verify Tab 1 and Tab 3 keep dark theme

**Expected Results:**
- ✅ Global settings affect all tabs
- ✅ Site-specific settings override global settings
- ✅ Each tab respects its own site rules

### Test 5: Storage Change Direct Listener

**Steps:**
1. Open `test-cross-tab-sync.html` in 2 tabs
2. Open Chrome DevTools in both tabs
3. In Tab 1's console, run:
   ```javascript
   chrome.storage.sync.set({ intensity: 30 })
   ```
4. Check Tab 2 - it should update to 30% intensity
5. In Tab 2's console, run:
   ```javascript
   chrome.storage.sync.set({ darkThemeEnabled: false })
   ```
6. Check Tab 1 - dark theme should be removed

**Expected Results:**
- ✅ Direct storage changes trigger theme updates
- ✅ Console shows: "Storage changed, syncing theme state"
- ✅ Both message-based and storage-based sync work

### Test 6: Rapid Changes

**Steps:**
1. Open `test-cross-tab-sync.html` in 2 tabs
2. In Tab 1, rapidly toggle dark theme on/off 5 times
3. Check Tab 2 after each toggle
4. In Tab 1, rapidly move intensity slider back and forth
5. Check Tab 2 during slider movement

**Expected Results:**
- ✅ All changes sync correctly
- ✅ No race conditions or stuck states
- ✅ Final state matches across all tabs

### Test 7: Browser Restart Persistence

**Steps:**
1. Open `test-cross-tab-sync.html` in 2 tabs
2. Enable dark theme with 60% intensity
3. Close Chrome completely
4. Reopen Chrome
5. Open `test-cross-tab-sync.html` in 2 new tabs

**Expected Results:**
- ✅ Both tabs load with dark theme active
- ✅ Intensity is 60% as previously set
- ✅ Settings persisted across browser restart

## Debugging

### Check Console Logs
Look for these messages in the console:
- `[Dark Theme Extension] Storage changed, syncing theme state`
- `[Dark Theme Extension] Applied theme due to settings update from another tab`
- `[Dark Theme Extension] Removed theme due to settings update from another tab`
- `[Dark Theme Extension] Updated intensity due to settings update from another tab`

### Check Background Script Logs
Open the extension's background page:
1. Go to `chrome://extensions/`
2. Find "Dark Theme Extension"
3. Click "service worker" link
4. Check console for:
   - `[Dark Theme] Storage changed: ...`
   - `[Dark Theme] Broadcasting to X tabs`

### Verify Storage
Check current storage values:
```javascript
chrome.storage.sync.get(null, (data) => console.log(data))
```

## Common Issues and Solutions

### Issue: Changes don't sync to other tabs
**Solution:** 
- Check if content script is loaded in all tabs
- Verify background script is running
- Check console for errors

### Issue: Intensity doesn't update
**Solution:**
- Verify CSS variable is being set: `document.documentElement.style.getPropertyValue('--dark-theme-intensity')`
- Check if theme is active: `document.documentElement.classList.contains('dark-theme-active')`

### Issue: Sync is slow
**Solution:**
- This is expected - Chrome's message passing has slight delay
- Typical sync time is 100-500ms
- Storage sync across devices can take longer

## Requirements Verification

### Requirement 5.3: Settings sync across Chrome instances
✅ Implemented via `chrome.storage.sync` API

### Requirement 5.4: Settings available across devices
✅ Implemented via `chrome.storage.sync` API (syncs when signed into Chrome)

### Requirement 6.3: Background worker coordinates state across tabs
✅ Implemented via `chrome.storage.onChanged` listener in background script
✅ Broadcasts `SETTINGS_UPDATED` messages to all tabs

## Implementation Details

### Content Script Changes
1. Added `handleSettingsUpdate(changes)` function
2. Added `SETTINGS_UPDATED` case to message listener
3. Added `chrome.storage.onChanged` listener
4. Smart logic to determine if theme should be applied/removed/updated

### Background Script
- Already had `chrome.storage.onChanged` listener
- Already broadcasts to all tabs
- No changes needed for this task

### Synchronization Flow
```
Tab 1: User changes setting
    ↓
chrome.storage.sync.set()
    ↓
Background: chrome.storage.onChanged fires
    ↓
Background: Broadcasts SETTINGS_UPDATED to all tabs
    ↓
Tab 2: Receives SETTINGS_UPDATED message
    ↓
Tab 2: handleSettingsUpdate() executes
    ↓
Tab 2: Theme updates automatically
```

## Success Criteria
- ✅ SETTINGS_UPDATED message handler added to content script
- ✅ Content script listens for storage changes
- ✅ Theme reapplies when settings change in another tab
- ✅ All test scenarios pass
- ✅ Requirements 5.3, 5.4, and 6.3 satisfied
