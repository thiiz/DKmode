# Whitelist & Blacklist Testing - Quick Start Guide

## 🚀 Quick Start

### Step 1: Open the Main Test File
1. Open `test-whitelist-blacklist.html` in Chrome
2. Make sure the Dark Theme Extension is loaded and enabled

### Step 2: Follow the Test Sections
The test file contains 5 main sections:
1. **Test 1:** Whitelist with global dark theme disabled
2. **Test 2:** Blacklist with global dark theme enabled  
3. **Test 3:** Cross-session persistence
4. **Test 4:** Edge cases (hostname variations)
5. **Test 5:** Priority and conflict resolution

### Step 3: Check Off Completed Tests
Use the interactive checklist at the bottom of the test page to track your progress.

## 📋 Test Checklist

### Basic Functionality
- [ ] Can add sites to whitelist
- [ ] Can add sites to blacklist
- [ ] Can remove sites from whitelist
- [ ] Can remove sites from blacklist
- [ ] Changes apply immediately (no refresh needed)
- [ ] Whitelisted sites get dark theme (global OFF)
- [ ] Blacklisted sites don't get dark theme (global ON)

### Persistence
- [ ] Settings persist after page refresh
- [ ] Settings persist after browser restart
- [ ] Multiple sites in lists persist correctly

### Edge Cases
- [ ] WWW vs non-WWW treated as separate
- [ ] Subdomains treated as separate
- [ ] Localhost works correctly
- [ ] IP addresses work correctly

### Priority
- [ ] Blacklist overrides whitelist
- [ ] Removing from blacklist allows whitelist to work

## 🌐 Testing Edge Cases

### For Hostname Variations
1. Open `test-hostname-edge-cases.html`
2. Note the current hostname displayed
3. Follow the test scenarios for:
   - WWW vs non-WWW
   - Subdomains
   - Localhost vs 127.0.0.1
   - Port numbers

### Setting Up Local Server (for localhost tests)
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js
npx http-server -p 8080
```

Then access:
- `http://localhost:8080/test-hostname-edge-cases.html`
- `http://127.0.0.1:8080/test-hostname-edge-cases.html`

## ✅ Expected Behaviors

### Whitelist (Global OFF)
- ✅ Dark theme applies to whitelisted sites
- ✅ Changes take effect immediately
- ✅ Persists across sessions

### Blacklist (Global ON)
- ✅ Dark theme never applies to blacklisted sites
- ✅ Changes take effect immediately
- ✅ Persists across sessions

### Priority Rules
1. **Blacklist** (highest) - Never apply
2. **Whitelist** - Always apply
3. **Global setting** (lowest) - Default

### Hostname Matching
- `example.com` ≠ `www.example.com`
- `github.com` ≠ `gist.github.com`
- `localhost` ≠ `127.0.0.1`
- `localhost:8080` ≠ `localhost:3000`

## 📝 Documenting Results

Use `TASK_25_VERIFICATION.md` to document:
- Test execution date
- Browser version
- Test results (pass/fail)
- Any issues or bugs found
- Notes and observations

## 🐛 Common Issues to Watch For

1. **Changes don't apply immediately**
   - Check if content script is loaded
   - Check browser console for errors

2. **Settings don't persist**
   - Verify chrome.storage.sync is working
   - Check storage quota isn't exceeded

3. **Lists don't display in popup**
   - Check popup console for errors
   - Verify storage retrieval is working

4. **Edge cases fail**
   - Confirm exact hostname matching
   - Check if www/non-www are treated separately

## 🎯 Success Criteria

All tests pass when:
- All checklist items are checked ✅
- No console errors during testing
- All requirements (7.1-7.5) are verified
- Edge cases behave as expected
- Settings persist across sessions

## 📚 Related Files

- `test-whitelist-blacklist.html` - Main comprehensive test
- `test-hostname-edge-cases.html` - Edge case testing
- `TASK_25_VERIFICATION.md` - Detailed verification doc
- `TASK_25_SUMMARY.md` - Complete task summary

## 🔍 Requirements Tested

- **7.1:** Whitelist always applies dark theme ✅
- **7.2:** Blacklist never applies dark theme ✅
- **7.3:** Display all whitelisted/blacklisted domains ✅
- **7.4:** Update storage and refresh display on removal ✅
- **7.5:** Content script respects whitelist/blacklist preferences ✅

## 💡 Tips

1. **Test systematically** - Complete one section before moving to the next
2. **Use the checklist** - Track your progress as you go
3. **Document issues** - Note any unexpected behaviors
4. **Test edge cases** - Don't skip the hostname variation tests
5. **Verify persistence** - Always test after browser restart

## ⏱️ Estimated Time

- Basic functionality tests: 10-15 minutes
- Persistence tests: 5-10 minutes
- Edge case tests: 15-20 minutes
- Total: ~30-45 minutes

## 🎉 Completion

When all tests pass:
1. Check all items in the test checklist
2. Fill out the verification document
3. Document any issues found
4. Mark task as complete

---

**Ready to start?** Open `test-whitelist-blacklist.html` and begin with Test 1!
