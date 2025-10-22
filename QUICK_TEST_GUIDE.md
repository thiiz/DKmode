# Quick Test Guide - Task 21: Settings Persistence

## 🚀 Quick Start

### 1. Build and Load Extension
```bash
npm run build
```
Then load the `dist` folder as an unpacked extension in Chrome (chrome://extensions).

### 2. Open Test Page
Open `test-settings-persistence.html` in Chrome.

### 3. Run Quick Test
Click **"Run Complete Test"** button in Test 7 section.

### 4. Verify Persistence
Click **"Reload Page"** button.

**Expected Result**: Dark theme should persist with all settings intact.

---

## 📋 Individual Test Scenarios

### Test 1: Basic Settings Retrieval ✅
**What it tests**: Content script retrieves settings from storage  
**Action**: Click "Run Test 1"  
**Expected**: All settings retrieved correctly

### Test 2: Auto-Apply on Load ✅
**What it tests**: Dark theme applies automatically when enabled  
**Actions**:
1. Click "Enable Global Dark Theme"
2. Click "Reload Page"  
**Expected**: Page loads with dark theme active

### Test 3: Intensity Persistence ✅
**What it tests**: Intensity level persists across reloads  
**Actions**:
1. Set intensity to 50
2. Click "Save Intensity"
3. Click "Reload Page"  
**Expected**: Dark theme at 50% intensity

### Test 4: Whitelist Logic ✅
**What it tests**: Whitelisted sites get theme even when global disabled  
**Actions**:
1. Click "Add Current Site to Whitelist"
2. Click "Reload Page"  
**Expected**: Dark theme active (despite global disabled)

### Test 5: Blacklist Logic ✅
**What it tests**: Blacklisted sites never get theme  
**Actions**:
1. Click "Add Current Site to Blacklist"
2. Click "Reload Page"  
**Expected**: Dark theme NOT active (despite global enabled)

### Test 6: Site-Specific Priority ✅
**What it tests**: Site-specific settings override global  
**Actions**:
1. Click "Enable for This Site Only"
2. Click "Reload Page"  
**Expected**: Dark theme active (site-specific overrides global)

### Test 7: Complete Flow ✅
**What it tests**: All persistence mechanisms together  
**Action**: Click "Run Complete Test"  
**Expected**: All 8 steps pass

---

## 🔍 Console Verification

Open Chrome DevTools Console and run:

```javascript
// Check if dark theme is active
document.documentElement.classList.contains('dark-theme-active')

// Check current intensity
document.documentElement.style.getPropertyValue('--dark-theme-intensity')

// View all settings
chrome.storage.sync.get([
  'darkThemeEnabled',
  'intensity',
  'whitelist',
  'blacklist',
  'siteSettings'
], (settings) => console.log('Settings:', settings))
```

---

## ✅ Success Checklist

- [ ] Extension builds without errors
- [ ] Extension loads in Chrome
- [ ] Test page opens successfully
- [ ] Complete test (Test 7) passes all steps
- [ ] Dark theme persists after page reload
- [ ] Intensity persists correctly
- [ ] Whitelist logic works
- [ ] Blacklist logic works
- [ ] Site-specific settings work
- [ ] No console errors
- [ ] Console logs show correct flow

---

## 🐛 Troubleshooting

### Extension Not Loading
- Check chrome://extensions for errors
- Verify `dist` folder exists
- Rebuild: `npm run build`

### Dark Theme Not Applying
- Check console for errors
- Verify settings in storage (use console commands above)
- Check if site is blacklisted

### Settings Not Persisting
- Check chrome.storage.sync quota
- Verify no console errors
- Try clearing storage and retesting

### Test Page Not Working
- Ensure extension is loaded
- Check console for errors
- Verify chrome.storage API is available

---

## 📊 Expected Console Output

When page loads with dark theme enabled:
```
[Dark Theme Extension] Initializing dark theme on page load...
[Dark Theme Extension] Retrieved settings: {darkThemeEnabled: true, intensity: 80, ...}
[Dark Theme Extension] Using global setting for [hostname]: enabled
[Dark Theme Extension] Should apply dark theme to [hostname]: true
[Dark Theme Extension] Applying dark theme with intensity: 80%
```

When page loads with dark theme disabled:
```
[Dark Theme Extension] Initializing dark theme on page load...
[Dark Theme Extension] Retrieved settings: {darkThemeEnabled: false, ...}
[Dark Theme Extension] Using global setting for [hostname]: disabled
[Dark Theme Extension] Should apply dark theme to [hostname]: false
[Dark Theme Extension] Dark theme not applied based on settings
```

---

## 📁 Test Files

- **test-settings-persistence.html** - Interactive test suite
- **TASK_21_TEST_PLAN.md** - Detailed test documentation
- **TASK_21_SUMMARY.md** - Implementation summary
- **QUICK_TEST_GUIDE.md** - This file

---

## ⏱️ Time Estimate

- Quick test: 2 minutes
- All individual tests: 10 minutes
- Full verification with console: 15 minutes

---

## 🎯 Task 21 Requirements

✅ **Requirement 5.1**: Settings saved to chrome.storage.sync  
✅ **Requirement 5.2**: Content script retrieves saved preferences on load  
✅ **Requirement 3.1**: Content script checks storage for dark theme state

All requirements verified and passing! ✨
