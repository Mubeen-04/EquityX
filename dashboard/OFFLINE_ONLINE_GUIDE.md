# Offline-Online WebSocket Implementation Guide

## Overview
Your app now supports **offline-first** functionality with automatic sync when coming back online.

## How It Works

### 1. **Offline Detection**
```javascript
navigator.onLine              // Browser API to check internet status
window.addEventListener('online')    // Triggered when connection restored
window.addEventListener('offline')   // Triggered when connection lost
```

### 2. **Data Caching Strategy**
- **On First Load**: Loads cached data from localStorage immediately
- **On Data Update**: Every data update (WebSocket or Polling) is cached
- **On Offline**: Uses cached data from localStorage
- **On Coming Online**: Auto-syncs with server

### 3. **Connection Fallback**
```
WebSocket connected? → YES → Real-time updates
                      ↓ NO (timeout after 5s)
Fallback to Polling (every 5 seconds)
↓
Offline? → Use cached data
```

## Technical Implementation

### State Variables Added:
```javascript
const [isOnline, setIsOnline] = useState(navigator.onLine);
// true = internet connected, false = offline
```

### Event Listeners:
```javascript
// When connection is restored
window.addEventListener("online", () => {
  setIsOnline(true);
  setMode("websocket");  // Try WebSocket first
  fetchData();            // Auto-sync with server
});

// When connection is lost
window.addEventListener("offline", () => {
  setIsOnline(false);
  // App keeps working with cached data
});
```

### Caching on Data Update:
```javascript
// Every WebSocket update caches data
socketIO.on("holdingsData", (data) => {
  setHoldings(data);
  
  // Cache to localStorage
  const cached = JSON.parse(localStorage.getItem("tradingAppCache") || "{}");
  cached.holdings = data;
  cached.timestamp = new Date().toISOString();
  localStorage.setItem("tradingAppCache", JSON.stringify(cached));
});
```

## Using in Components

### 1. Display Status
```javascript
import { useRealTime } from "../RealTimeContext";
import ConnectionStatus from "./ConnectionStatus";

function Dashboard() {
  const { isOnline, isConnected } = useRealTime();
  
  return (
    <div>
      <ConnectionStatus />  {/* Shows "Offline Mode" or "Live/Polling" */}
    </div>
  );
}
```

### 2. Handle Offline State
```javascript
function BuyButton() {
  const { isOnline } = useRealTime();
  
  if (!isOnline) {
    return <button disabled>Cannot buy while offline</button>;
  }
  
  return <button onClick={handleBuy}>Buy Stock</button>;
}
```

### 3. Manual Refresh
```javascript
function Portfolio() {
  const { refreshNow, isOnline } = useRealTime();
  
  const handleRefresh = () => {
    if (isOnline) {
      refreshNow();
    } else {
      alert("Cannot refresh - offline. Cached data shown.");
    }
  };
  
  return <button onClick={handleRefresh}>Refresh</button>;
}
```

## localStorage Cache Structure
```json
{
  "tradingAppCache": {
    "holdings": [...holdings data],
    "positions": [...positions data],
    "orders": [...orders data],
    "indices": {...indices},
    "timestamp": "2026-04-11T10:30:45.123Z"
  }
}
```

## Testing Offline Mode

### Chrome DevTools Method:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Check **Offline** checkbox
4. App will show "Offline Mode" banner
5. Uncheck to come back online
6. App auto-syncs data

### Throttling Network:
1. Network tab → Throttling dropdown
2. Select "Slow 3G" or "Offline"
3. Test behavior under slow connections

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| **Go offline** | Show cached data, display offline banner |
| **Come online** | Reset connection, try WebSocket, auto-sync |
| **WebSocket timeout** | Switch to polling (every 5s) |
| **Polling fails offline** | Use cached data, no errors |
| **Cold start (no cache)** | Load data from API, show as it loads |
| **Place order offline** | Disabled (prevent data inconsistency) |

## Optional: Track Data Freshness

```javascript
function Dashboard() {
  const { lastUpdate, isOnline } = useRealTime();
  
  const dataFreshness = new Date() - lastUpdate < 5000 ? "🟢 Fresh" : "🟡 Stale";
  
  return (
    <div>
      {!isOnline && <p>Using cached data from {lastUpdate.toLocaleTimeString()}</p>}
      <p>{dataFreshness}</p>
    </div>
  );
}
```

## Performance Tips

1. **Clear Old Cache** (Optional):
   ```javascript
   // Clear cache older than 1 hour
   const cached = JSON.parse(localStorage.getItem("tradingAppCache"));
   const cacheAge = new Date() - new Date(cached.timestamp);
   if (cacheAge > 60 * 60 * 1000) {
     localStorage.removeItem("tradingAppCache");
   }
   ```

2. **Limit Cache Size**:
   - localStorage limit: ~5-10MB per domain
   - Keep only last 100 orders, holdings data

3. **Compression** (Future):
   ```javascript
   // For large datasets, consider compression (optional)
   import { compress, decompress } from 'lz-string';
   ```

## Future Enhancements

1. **Service Worker**: Cache API responses for true offline support
2. **IndexedDB**: For larger datasets (>5MB)
3. **Pending Actions Queue**: Store offline actions, sync when online
4. **Delta Sync**: Only sync changed data
5. **Conflict Resolution**: Handle if data changes while offline

## Files Modified

- ✅ `RealTimeContext.js` - Added offline detection, caching, auto-sync
- ✅ `ConnectionStatus.js` - New component to display status

## No Breaking Changes!

Your existing components work as-is. The offline handling is transparent:
- Components still use `useRealTime()` same way
- Data comes from cache when offline
- Everything syncs when online

---

**Test it now:**
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh page → Still loads cached data
4. Uncheck "Offline" → Auto-syncs with server
