# Intensity Control Test Guide

## Overview
This guide provides comprehensive testing procedures for the dark theme intensity control feature (Task 26).

## Requirements Coverage
- **8.1**: Intensity slider updates CSS variables/filter values
- **8.2**: Content script applies new intensity immediately  
- **8.3**: Intensity value saved to chrome.storage.sync
- **8.4**: Saved intensity applied on page load
- **8.5**: Minimum intensity applies subtle adjustments
- **8.6**: Maximum intensity applies full inversion with high contrast

## Test Setup

### Prerequisites
1. Dark Theme Extension installed and loaded in Chrome
2. Extension popup accessible
3. Test file `test-intensity-control.html` opened in browser

### Initial Configuration
1. Open Chrome DevTools (F12)
2. Navigate to Console tab to monitor logs
3. Open extension popup
4. Enable dark theme for the test site

## Test Procedures

### Test 1: Immediate Visual Changes (Req 8.1, 8.2)

**Objective**: Verify intensity changes apply instantly without page reload

**Steps**:
1. With dark theme enabled, note current page appearance
2. Open extension popup
3. Move intensity slider from current position to 25%
4. **Expected**: Background and text colors change immediately
5. Move slider to 50%
6. **Expected**: Further darkening occurs instantly
7. Move slider to 75%
8. **Expected**: Even darker appearance, still instant
9. Move slider rapidly back and forth (0% → 100% → 50%)
10. **Expected**: Smooth updates with no lag or flicker

**Success Criteria**:
- ✅ Visual changes occur within 100ms
- ✅ No page flicker or flash
- ✅ All elements update simultaneously
- ✅ No console errors

**Verification**:
```javascript
// Check CSS variable is being updated
getComputedStyle(document.documentElement).getPropertyValue('--dark-theme-intensity')
// Should return value between 0 and 1
```

---

### Test 2: Minimum Intensity (Req 8.5)

**Objective**: Verify subtle changes at low intensity values

**Steps**:
1. Set intensity slider to 0%
2. Observe page appearance
3. **Expected**: Very subtle darkening, background NOT pure black
4. **Expected**: Text slightly lighter but still readable
5. **Expected**: Images barely affected
6. Set intensity to 10%
7. **Expected**: Slightly more noticeable but still subtle
8. Set intensity to 20%
9. **Expected**: Gradual progression, still comfortable

**Success Criteria**:
- ✅ At 0%: Background is light gray/dark (not black)
- ✅ At 0%: Text contrast is minimal but readable
- ✅ At 0-20%: Images maintain ~95-100% brightness
- ✅ Overall appearance is subtle and comfortable

**Visual Checkpoints**:
- White backgrounds → Very light gray
- Black text → Slightly lighter gray
- Colored elements → Minimal color shift
- Images → No visible dimming

---

### Test 3: Maximum Intensity (Req 8.6)

**Objective**: Verify full inversion at high intensity values

**Steps**:
1. Set intensity slider to 100%
2. Observe page appearance
3. **Expected**: Very dark background (near black)
4. **Expected**: Very bright text (near white)
5. **Expected**: High contrast throughout
6. **Expected**: Images noticeably dimmed but visible
7. Set intensity to 90%
8. **Expected**: Slightly less extreme but still very dark
9. Set intensity to 80%
10. **Expected**: Strong dark theme, good contrast

**Success Criteria**:
- ✅ At 100%: Background is very dark (near black)
- ✅ At 100%: Text is very bright (near white)
- ✅ At 100%: Images dimmed to ~80% brightness
- ✅ High contrast maintained throughout
- ✅ All content remains readable/visible

**Visual Checkpoints**:
- White backgrounds → Near black (#0d0d0d or darker)
- Black text → Near white (#e6e6e6 or brighter)
- Colored elements → Inverted with high contrast
- Images → Visibly dimmed but recognizable

---

### Test 4: Persistence After Reload (Req 8.3, 8.4)

**Objective**: Verify intensity settings persist across page reloads

**Test 4.1: Basic Persistence**

**Steps**:
1. Set intensity to 65%
2. Note the visual appearance
3. Open DevTools Console and run:
   ```javascript
   chrome.storage.sync.get(['intensity'], (r) => console.log('Saved intensity:', r.intensity))
   ```
4. **Expected**: Console shows "Saved intensity: 65"
5. Reload page (F5)
6. **Expected**: Dark theme reapplies automatically
7. **Expected**: Visual appearance matches before reload
8. Check intensity in popup
9. **Expected**: Slider shows 65%

**Success Criteria**:
- ✅ Intensity value saved to storage
- ✅ Saved value retrieved on page load
- ✅ Visual appearance consistent before/after reload
- ✅ No flash of wrong intensity

**Test 4.2: Multiple Value Changes**

**Steps**:
1. Set intensity to 30%
2. Reload page
3. Verify intensity is 30%
4. Set intensity to 85%
5. Reload page
6. Verify intensity is 85%
7. Set intensity to 0%
8. Reload page
9. Verify intensity is 0%

**Success Criteria**:
- ✅ Each new intensity value persists correctly
- ✅ No "stuck" values from previous settings

**Test 4.3: Tab Close/Reopen**

**Steps**:
1. Set intensity to 55%
2. Close the tab completely
3. Reopen `test-intensity-control.html`
4. **Expected**: Dark theme applies with 55% intensity
5. Verify in popup that slider shows 55%

**Success Criteria**:
- ✅ Intensity persists across tab close/reopen
- ✅ Settings retrieved from chrome.storage.sync

---

### Test 5: Different Content Types (Req 8.1-8.6)

**Objective**: Verify intensity affects all content types appropriately

**Test 5.1: Text Content**

**Steps**:
1. Navigate to "Test 5: Different Content Types" section
2. Set intensity to 0%
3. Verify all text is readable (headings, paragraphs, links, code)
4. Set intensity to 50%
5. Verify good contrast for all text styles
6. Set intensity to 100%
7. Verify high contrast, all text clearly visible

**Success Criteria**:
- ✅ Regular text readable at all levels
- ✅ Links distinguishable at all levels
- ✅ Bold/italic/underline visible at all levels
- ✅ Code blocks maintain readability

**Test 5.2: Images**

**Steps**:
1. Locate the SVG image sample
2. Set intensity to 0%
3. **Expected**: Image at full brightness
4. Set intensity to 50%
5. **Expected**: Image slightly dimmed (~90% brightness)
6. Set intensity to 100%
7. **Expected**: Image noticeably dimmed (~80% brightness)
8. Verify image colors look natural (not inverted)

**Success Criteria**:
- ✅ Images dim proportionally to intensity
- ✅ Images never inverted or distorted
- ✅ Images remain recognizable at max intensity
- ✅ Brightness filter applied correctly

**Verification**:
```javascript
// Check image filter
const img = document.querySelector('svg');
const filter = getComputedStyle(img).filter;
console.log('Image filter:', filter);
// Should show brightness() value
```

**Test 5.3: Interactive Elements**

**Steps**:
1. Locate buttons and form inputs
2. Set intensity to 0%
3. Verify buttons/inputs slightly darkened
4. Click on text input
5. Verify focus state is visible
6. Set intensity to 50%
7. Verify good contrast for interaction
8. Set intensity to 100%
9. Verify high contrast, clear boundaries
10. Test all input types (text, email, textarea, select, checkbox, radio)

**Success Criteria**:
- ✅ All inputs visible at all intensity levels
- ✅ Placeholder text readable
- ✅ Focus states clearly visible
- ✅ Disabled states distinguishable
- ✅ Borders and boundaries clear

**Test 5.4: Video/Media Elements**

**Steps**:
1. Locate video placeholder
2. Set intensity to 0%
3. Verify full brightness
4. Set intensity to 50%
5. Verify slight dimming
6. Set intensity to 100%
7. Verify noticeable dimming but still visible

**Success Criteria**:
- ✅ Media elements dim like images
- ✅ Content remains watchable
- ✅ No over-inversion

---

### Test 6: Edge Cases

**Objective**: Test boundary conditions and rapid changes

**Test 6.1: Boundary Values**

**Steps**:
1. Set intensity to exactly 0%
2. Verify minimal effect, no errors
3. Set intensity to exactly 100%
4. Verify maximum effect, no errors
5. Check console for any errors
6. **Expected**: No errors or warnings

**Test 6.2: Rapid Changes**

**Steps**:
1. Rapidly move slider: 0% → 100% → 50% → 25% → 75%
2. Repeat 5-10 times quickly
3. **Expected**: Smooth updates, no crashes
4. **Expected**: No visual glitches
5. Check console for errors
6. **Expected**: No errors

**Test 6.3: Debounced Saving**

**Steps**:
1. Open DevTools Console
2. Run: `chrome.storage.onChanged.addListener((changes) => console.log('Storage changed:', changes))`
3. Rapidly move intensity slider
4. **Expected**: Storage updates are debounced (not every movement)
5. Stop moving slider
6. **Expected**: Final value saved within 500ms

**Test 6.4: Dark Theme Disabled**

**Steps**:
1. Disable dark theme in popup
2. Change intensity slider
3. **Expected**: No visual changes on page
4. Enable dark theme
5. **Expected**: Intensity applies immediately

**Success Criteria**:
- ✅ No crashes at boundary values
- ✅ Smooth performance during rapid changes
- ✅ Storage writes are debounced
- ✅ Final value always persists
- ✅ Intensity has no effect when theme disabled

---

## Automated Verification

### Console Commands

Run these in DevTools Console for verification:

```javascript
// Check current intensity value
chrome.storage.sync.get(['intensity'], (result) => {
    console.log('Current intensity:', result.intensity);
});

// Check CSS variable
const intensity = getComputedStyle(document.documentElement)
    .getPropertyValue('--dark-theme-intensity');
console.log('CSS intensity variable:', intensity);

// Check if dark theme is active
const isActive = document.documentElement.classList.contains('dark-theme-active');
console.log('Dark theme active:', isActive);

// Monitor storage changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.intensity) {
        console.log('Intensity changed:', 
            changes.intensity.oldValue, '→', changes.intensity.newValue);
    }
});

// Check image filters
document.querySelectorAll('img, video, canvas, svg').forEach(el => {
    console.log(el.tagName, 'filter:', getComputedStyle(el).filter);
});
```

---

## Expected Results Summary

### Requirement 8.1 ✅
- Intensity slider updates `--dark-theme-intensity` CSS variable
- Variable value ranges from 0 to 1 (intensity% / 100)

### Requirement 8.2 ✅
- Content script applies intensity changes immediately
- No page reload required
- Visual updates within 100ms

### Requirement 8.3 ✅
- Intensity value saved to `chrome.storage.sync`
- Debounced to prevent excessive writes
- Final value always persists

### Requirement 8.4 ✅
- Saved intensity retrieved on page load
- Applied before page renders (no flash)
- Consistent experience across reloads

### Requirement 8.5 ✅
- Minimum intensity (0-20%) applies subtle changes
- Background: Light gray, not black
- Text: Minimal contrast change
- Images: Barely affected

### Requirement 8.6 ✅
- Maximum intensity (80-100%) applies full inversion
- Background: Very dark, near black
- Text: Very bright, near white
- High contrast throughout
- Images: Noticeably dimmed but visible

---

## Troubleshooting

### Issue: Intensity doesn't change visually
**Check**:
- Is dark theme enabled?
- Check console for errors
- Verify CSS variable: `getComputedStyle(document.documentElement).getPropertyValue('--dark-theme-intensity')`

### Issue: Intensity doesn't persist
**Check**:
- Verify storage permission in manifest.json
- Check storage: `chrome.storage.sync.get(['intensity'], console.log)`
- Look for storage errors in console

### Issue: Images are inverted
**Check**:
- Verify content.css has brightness filter, not invert filter
- Check: `getComputedStyle(document.querySelector('img')).filter`

### Issue: Changes are laggy
**Check**:
- Verify debounce is working (not saving on every change)
- Check for excessive DOM queries
- Monitor performance in DevTools

---

## Test Completion Checklist

- [ ] Test 1: Immediate visual changes verified
- [ ] Test 2: Minimum intensity (subtle changes) verified
- [ ] Test 3: Maximum intensity (full inversion) verified
- [ ] Test 4: Persistence after reload verified
- [ ] Test 5.1: Text content at all intensities verified
- [ ] Test 5.2: Images at all intensities verified
- [ ] Test 5.3: Interactive elements at all intensities verified
- [ ] Test 5.4: Video/media at all intensities verified
- [ ] Test 6: Edge cases and boundaries verified
- [ ] All requirements (8.1-8.6) confirmed working
- [ ] No console errors during testing
- [ ] Performance is acceptable (no lag)

---

## Test Report Template

```
# Intensity Control Test Report

**Date**: [Date]
**Tester**: [Name]
**Extension Version**: [Version]
**Chrome Version**: [Version]

## Test Results

### Test 1: Immediate Visual Changes
- Status: [ ] Pass [ ] Fail
- Notes: 

### Test 2: Minimum Intensity
- Status: [ ] Pass [ ] Fail
- Notes:

### Test 3: Maximum Intensity
- Status: [ ] Pass [ ] Fail
- Notes:

### Test 4: Persistence
- Status: [ ] Pass [ ] Fail
- Notes:

### Test 5: Content Types
- Text: [ ] Pass [ ] Fail
- Images: [ ] Pass [ ] Fail
- Interactive: [ ] Pass [ ] Fail
- Media: [ ] Pass [ ] Fail
- Notes:

### Test 6: Edge Cases
- Status: [ ] Pass [ ] Fail
- Notes:

## Issues Found
1. [Issue description]
2. [Issue description]

## Overall Result
[ ] All tests passed
[ ] Some tests failed (see issues)

## Recommendations
[Any recommendations for improvements]
```
