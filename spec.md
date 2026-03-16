# FitAlso

## Current State
Backend `main.mo` has `var platformConfigData : ?PlatformConfig = null` which is NOT a stable variable. Every canister upgrade (deploy) resets it to null, wiping all admin-added products.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `var platformConfigData` → `stable var platformConfigData` so products persist across deploys
- `var platformConfig` (legacy) → `stable var platformConfig` for migration compatibility

### Remove
- Nothing

## Implementation Plan
1. Change `var platformConfig` to `stable var platformConfig` in main.mo
2. Change `var platformConfigData` to `stable var platformConfigData` in main.mo
3. Deploy — products added by admin will now persist permanently
