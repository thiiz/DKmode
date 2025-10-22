# Dark Theme Extension - Quick Test Guide

## Quick Start

### 1. Build and Load Extension
```bash
npm run build
```
Then load `dist` folder as unpacked extension in Chrome.

### 2. Test Files Overview

| File | Purpose | Key Features |
|------|---------|--------------|
| `test-static-html-site.html` | Basic HTML | Forms, tables, lists, text |
| `test-spa-simulation.html` | SPA behavior | Dynamic content, routing, modals |
| `test-complex-layout.html` | Complex layouts | Multi-column, feeds, comments |
| `test-media-handling.html` | Media elements | SVG, canvas, images, videos |
| `test-existing-dark-mode.html` | Native dark mode | CSS variables, theme conflicts |

## Quick Test Checklist

### For Each Test File:

#### Basic Functionality
- [ ] Open file in Chrome
- [ ] Click extension icon
- [ ] Toggle dark theme ON
- [ ] Verify page turns dark
- [ ] Toggle dark theme OFF
- [ ] Verify page returns to normal

#### Intensity Testing
- [ ] Set intensity to 0 (subtle)
- [ ] Set intensity to 50 (medium)
- [ ] Set intensity to 100 (maximum)
- [ ] Verify smooth transitions

#### Visual Verification
- [ ] Text is readable
- [ ] Buttons are visible
- [ ] Forms work correctly
- [ ] Links are distinguishable
- [ ] No layout breaks

## Critical Tests

### 🔴 MUST PASS: Media Handling
Open `test-media-handling.html`:
- SVG graphics should maintain colors (not inverted)
- Canvas elements should maintain colors (not inverted)
- Images should have slight brightness adjustment only
- Test at different intensity levels

### 🔴 MUST PASS: Existing Dark Mode
Open `test-existing-dark-mode.html`:
1. Native OFF + Extension OFF → Normal light mode
2. Native OFF + Extension ON → Extension dark theme
3. Native ON + Extension OFF → Native dark mode
4. Native ON + Extension ON → **No double-inversion!**

### 🔴 MUST PASS: Dynamic Content
Open `test-spa-simulation.html`:
- Navigate between views → All views should have dark theme
- Click "Load Content" → New content should be dark
- Open modal → Modal should be visible and dark

## Common Issues to Check

### ❌ Problems to Look For:
- Double-inverted text (light text on light background)
- Over-inverted images (negative effect)
- Broken layouts or shifted elements
- Invisible buttons or form elements
- Unreadable text (poor contrast)
- Flickering when toggling theme

### ✅ Expected Behavior:
- Dark backgrounds with light text
- Clear contrast and readability
- Media maintains natural appearance
- Smooth transitions
- No layout changes
- All interactive elements visible

## Real Website Testing

### Easy Sites (Start Here):
1. **Wikipedia** - Simple static content
2. **MDN Web Docs** - Documentation site
3. **News sites** - Various layouts

### Medium Complexity:
1. **Reddit** - Feed-based layout
2. **Stack Overflow** - Q&A format
3. **Medium** - Article reading

### Complex Sites:
1. **Gmail** - Email interface
2. **GitHub** - Code repository
3. **Twitter/X** - Social feed
4. **YouTube** - Video platform

### Sites with Dark Mode:
1. **GitHub** - Toggle their dark mode first
2. **Twitter/X** - Toggle their dark mode first
3. **YouTube** - Toggle their dark mode first

## Performance Check

- [ ] Toggle theme → Should be instant (< 100ms)
- [ ] Adjust intensity → Should update smoothly
- [ ] Scroll page → No lag or stuttering
- [ ] Open DevTools → Check for console errors

## Browser Console Tests

Open DevTools Console and check:
```javascript
// Check if dark theme is applied
document.documentElement.classList.contains('dark-theme-active')

// Check intensity value
getComputedStyle(document.documentElement).getPropertyValue('--dark-theme-intensity')

// Check for errors
// Should see no errors related to extension
```

## Intensity Level Guide

| Level | Effect | Use Case |
|-------|--------|----------|
| 0-20 | Subtle tint | Slight darkening |
| 21-50 | Moderate | Balanced dark theme |
| 51-80 | Strong | Clear dark mode |
| 81-100 | Maximum | Full contrast |

## Test Results Template

```
Test File: [filename]
Date: [date]
Browser: Chrome [version]

✅ PASS / ❌ FAIL

Issues Found:
- [Issue 1]
- [Issue 2]

Notes:
- [Additional observations]
```

## Quick Fixes

### If text is unreadable:
- Check intensity level
- Verify CSS is loaded
- Check for inline styles overriding

### If images are inverted:
- Verify content.css has media filters
- Check CSS specificity
- Test different intensity levels

### If theme doesn't apply:
- Check extension is enabled
- Verify content script injected
- Check for CSP restrictions
- Look for console errors

## Reporting Issues

When reporting issues, include:
1. Test file or website URL
2. Browser version
3. Extension version
4. Intensity level
5. Screenshot if possible
6. Console errors if any
7. Steps to reproduce

## Success Criteria

Task 23 is complete when:
- ✅ All 5 test files work correctly
- ✅ Media elements are not over-inverted
- ✅ No visual glitches or broken layouts
- ✅ Existing dark modes don't cause conflicts
- ✅ Dynamic content receives theme
- ✅ Performance is acceptable
- ✅ At least 3 real websites tested successfully

## Time Estimate

- Test files: ~30 minutes
- Real websites: ~30 minutes
- Documentation: ~15 minutes
- **Total: ~75 minutes**

## Tips

1. **Test systematically** - Don't skip test files
2. **Use different intensity levels** - Not just 100%
3. **Check console** - Look for errors
4. **Test edge cases** - Modals, overlays, dynamic content
5. **Compare with/without** - Toggle to see differences
6. **Take screenshots** - Document issues visually
7. **Test on real sites** - Test files don't cover everything

## Need Help?

- Check `TASK_23_VERIFICATION.md` for detailed procedures
- Review `content.css` for styling rules
- Check `content.js` for theme application logic
- Look at browser console for errors
- Test with extension disabled to isolate issues
