# Performance Testing - Quick Start Guide

## 🚀 Quick Start

### 1. Build the Extension
```bash
npm run build
```

### 2. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist/` folder

### 3. Open Performance Test Page
Open `test-performance.html` in Chrome:
```
file:///path/to/test-performance.html
```

## 📊 Using the Performance Test Page

### Real-Time Metrics Dashboard

**Refresh Metrics**: Click to update current performance stats
**Start Continuous Monitoring**: Updates every 2 seconds
**Stop Monitoring**: Stops continuous updates
**Clear Metrics**: Resets all performance data

### Performance Targets

| Metric | Target | Good Range |
|--------|--------|------------|
| Initialization | < 50ms | 15-30ms |
| Apply Theme | < 100ms | 1-5ms |
| Remove Theme | < 100ms | 1-3ms |
| Storage Read | < 50ms | 10-25ms |
| Storage Write | < 50ms | 15-30ms |
| Message Handling | < 50ms | 5-15ms |

### Running Tests

#### Toggle Speed Test
Tests rapid theme on/off switching:
- **10 Toggles**: Quick validation
- **50 Toggles**: Standard test
- **100 Toggles**: Stress test

**Expected Results**:
- Average: 2-5ms per toggle
- No visual lag
- Consistent performance

#### Intensity Adjustment Test
Tests CSS variable updates:
- **20 Changes**: Quick test
- **50 Changes**: Standard test
- **100 Changes**: Stress test

**Expected Results**:
- Average: 2-5ms per change
- Smooth transitions
- No performance degradation

#### Memory Usage Test
Monitors JavaScript heap size:
- **Check Memory**: Current usage snapshot
- **Run Stress Test**: 100 toggle cycles

**Expected Results**:
- Memory usage: < 5MB
- Memory increase: < 1MB during stress test
- No memory leaks

#### Visual Performance Test
Tests theme on complex DOM:
- **50 Elements**: Light test
- **200 Elements**: Medium test
- **500 Elements**: Heavy test

**Expected Results**:
- Instant application on 50 elements
- < 10ms on 200 elements
- < 25ms on 500 elements

## 🔍 Console API

### Check Performance Stats
```javascript
// In browser console on any page
window.__darkThemePerformance.getStats()
```

**Returns**:
```javascript
{
  initializationTime: "15.23ms",
  operations: {
    applyThemeTime: {
      count: 5,
      average: "2.45ms",
      max: "4.12ms",
      min: "1.23ms"
    },
    // ... more operations
  }
}
```

### Get Raw Metrics
```javascript
window.__darkThemePerformance.getRawMetrics()
```

**Returns**:
```javascript
{
  initStartTime: 1234.56,
  initEndTime: 1250.78,
  applyThemeTime: [2.3, 2.5, 2.1, ...],
  removeThemeTime: [1.8, 1.9, 2.0, ...],
  // ... more arrays
}
```

## 🎯 Chrome Task Manager

### Monitor Memory Usage

1. Press `Shift+Esc` to open Chrome Task Manager
2. Find "Extension: Dark Theme Extension"
3. Check Memory column

**Expected**:
- Memory: < 5MB per tab
- CPU: < 5% when idle
- CPU: < 20% during operations

## 🧪 Manual Testing Checklist

### Basic Performance Test
- [ ] Load extension
- [ ] Open test page
- [ ] Click "Refresh Metrics"
- [ ] Verify all metrics are green (within targets)
- [ ] Run toggle speed test (50 iterations)
- [ ] Run intensity test (50 changes)
- [ ] Check memory usage

### Real-World Testing
- [ ] Test on Wikipedia (static HTML)
- [ ] Test on GitHub (React SPA)
- [ ] Test on Gmail (complex layout)
- [ ] Test on YouTube (media-heavy)
- [ ] Verify no visual lag on any site
- [ ] Check console for warnings

### Low-End Device Test
- [ ] Open Chrome DevTools (F12)
- [ ] Go to Performance tab
- [ ] Enable CPU throttling (4x slowdown)
- [ ] Toggle theme multiple times
- [ ] Verify still responsive (< 200ms)

## 🐛 Troubleshooting

### Performance API Not Available
**Issue**: `window.__darkThemePerformance` is undefined

**Solution**:
1. Verify extension is loaded
2. Refresh the page
3. Check browser console for errors
4. Rebuild extension: `npm run build`

### Slow Operations Detected
**Issue**: Console warnings about operations > 50ms

**Solution**:
1. Check which operation is slow
2. Review PERFORMANCE_OPTIMIZATION_GUIDE.md
3. Test on different sites
4. Check Chrome Task Manager for resource usage

### Memory Usage High
**Issue**: Memory > 5MB per tab

**Solution**:
1. Run memory stress test
2. Check for memory leaks
3. Clear metrics and test again
4. Review performance log

### Test Page Not Working
**Issue**: Tests fail or don't run

**Solution**:
1. Verify extension is loaded
2. Check browser console for errors
3. Refresh the page
4. Try different browser/profile

## 📈 Interpreting Results

### Good Performance ✅
- All metrics within target ranges
- No slow operation warnings
- Memory usage < 5MB
- Smooth user experience

### Acceptable Performance ⚠️
- Most metrics within targets
- Occasional slow operations (< 100ms)
- Memory usage 5-10MB
- Minor lag on complex sites

### Poor Performance ❌
- Multiple metrics exceed targets
- Frequent slow operations (> 100ms)
- Memory usage > 10MB
- Noticeable lag

## 🔧 Quick Fixes

### If Initialization is Slow (> 50ms)
- Check storage API response time
- Verify network conditions
- Test on simpler sites first

### If Theme Application is Slow (> 100ms)
- Check DOM complexity
- Verify CSS is optimized
- Test with fewer elements

### If Memory Usage is High (> 5MB)
- Clear performance metrics
- Check for memory leaks
- Restart browser

## 📚 Additional Resources

- **PERFORMANCE_OPTIMIZATION_GUIDE.md**: Complete optimization guide
- **TASK_27_PERFORMANCE_TEST_SUMMARY.md**: Detailed test results
- **TASK_27_VERIFICATION.md**: Verification documentation

## 🎓 Best Practices

1. **Test Regularly**: Run performance tests after each change
2. **Monitor Metrics**: Use continuous monitoring during development
3. **Check Console**: Watch for slow operation warnings
4. **Test Real Sites**: Don't just test on simple pages
5. **Use Task Manager**: Monitor actual resource usage
6. **Document Issues**: Log any performance problems found

## ⚡ Performance Tips

- Keep metrics within target ranges
- Watch for slow operation warnings
- Monitor memory usage regularly
- Test on various site types
- Use CPU throttling for low-end testing
- Export logs for analysis

## 🎉 Success Criteria

Your extension has good performance if:
- ✅ All metrics within targets
- ✅ No slow operation warnings
- ✅ Memory < 5MB per tab
- ✅ Theme toggle feels instant
- ✅ Smooth intensity slider
- ✅ No visual glitches
- ✅ Works well on all site types

---

**Need Help?** Check the full documentation in PERFORMANCE_OPTIMIZATION_GUIDE.md
