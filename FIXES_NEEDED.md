# MarkViewPro - Missing Implementations & Fixes Needed

## 1. Settings Backend Integration ❌
**Status**: Settings are only stored in localStorage, not synced with backend

**Issue**: 
- Frontend has settings in localStorage
- Backend has GetSettings() and UpdateSettings() methods in app.go
- No integration between them

**Fix Needed**:
- Add GetSettings and UpdateSettings to wailsBindings.ts
- Update SettingsContext to load/save settings from/to backend
- Ensure settings persist across app restarts

**Files to modify**:
- `frontend/src/utils/wailsBindings.ts` - Add settings methods
- `frontend/src/contexts/SettingsContext.tsx` - Integrate with backend
- Backend settings structure needs alignment with frontend Settings type

---

## 2. Toast Notifications Not Used ❌
**Status**: Toast component exists but is never rendered in the app

**Issue**:
- Toast component and useToast hook are fully implemented
- ToastContainer is never rendered in App.tsx
- No user feedback for actions (save, export, errors)

**Fix Needed**:
- Add ToastContainer to App.tsx
- Use toast notifications for:
  - File saved successfully
  - Export completed
  - Errors (file not found, save failed, etc.)
  - File opened from recent
  - Settings saved

**Files to modify**:
- `frontend/src/App.tsx` - Add ToastContainer and useToast
- Add toast calls in relevant handlers

---

## 3. Auto-Reload Feature Not Implemented ❌
**Status**: Setting exists but file watching is not connected

**Issue**:
- Backend has StartWatching() and StopWatching() methods
- Frontend has autoReload setting
- No connection between them - files don't auto-reload when changed externally

**Fix Needed**:
- Add startWatching and stopWatching to wailsBindings.ts
- Implement file watching when a file is opened
- Listen for file change events from backend
- Reload file content when changed (if autoReload is enabled)
- Show toast notification when file is reloaded

**Files to modify**:
- `frontend/src/utils/wailsBindings.ts` - Add watching methods
- `frontend/src/App.tsx` - Implement file watching logic
- Backend may need to emit events when file changes

---

## 4. Auto-Save Feature Not Implemented ❌
**Status**: Setting exists but functionality is missing

**Issue**:
- Frontend has autoSave setting in types
- No implementation of auto-save logic
- Backend settings has AutoSave and AutoSaveDelay fields

**Fix Needed**:
- Implement auto-save timer when content changes
- Only auto-save if file has a path (not new unsaved files)
- Respect autoSave setting
- Show indicator when auto-saving
- Use toast to notify user of auto-save

**Files to modify**:
- `frontend/src/App.tsx` - Add auto-save logic
- Consider adding to useTabs hook

---

## 5. Recent Files Not Persisted ❌
**Status**: Recent files work but may not persist properly

**Issue**:
- Backend has recent files functionality
- Need to verify files are added to recent when opened
- Need to ensure recent files persist across app restarts

**Fix Needed**:
- Ensure OpenFile adds to recent files in backend
- Verify filemanager saves recent files to disk
- Test recent files persistence

**Files to check**:
- `internal/filemanager/filemanager.go` - Verify recent files are saved
- Test opening files and checking if they appear in recent after restart

---

## 6. Settings Type Mismatch ⚠️
**Status**: Frontend and backend settings don't match

**Issue**:
- Frontend Settings type has: theme, fontSize, fontFamily, lineHeight, sidebarWidth, showLineNumbers, autoSave, wordWrap, autoReload
- Backend UserSettings has: Theme, FontSize, FontFamily, LineHeight, EditorTheme, PreviewTheme, AutoSave, AutoSaveDelay, SyncScroll, ShowLineNumbers, WordWrap, SpellCheck
- Missing fields: sidebarWidth (frontend), EditorTheme, PreviewTheme, AutoSaveDelay, SyncScroll, SpellCheck (backend)

**Fix Needed**:
- Align frontend and backend settings structures
- Add missing fields to both sides
- Implement any missing UI for new settings

**Files to modify**:
- `frontend/src/types/index.ts` - Update Settings interface
- `internal/settings/settings.go` - Update UserSettings struct
- `frontend/src/components/Settings/SettingsModal.tsx` - Add UI for new settings

---

## 7. Error Handling Missing ⚠️
**Status**: Many operations lack user-visible error handling

**Issue**:
- File operations can fail silently
- No error messages shown to user
- Console.error used but user sees nothing

**Fix Needed**:
- Add toast notifications for errors
- Show meaningful error messages
- Handle common errors (file not found, permission denied, etc.)

**Files to modify**:
- All handlers in `frontend/src/App.tsx`
- Add error toasts throughout

---

## 8. Command Palette Missing Commands ⚠️
**Status**: Command palette exists but may be missing some commands

**Issue**:
- Need to verify all keyboard shortcuts have corresponding commands
- Some features might not be accessible via command palette

**Fix Needed**:
- Audit all features and ensure they're in command palette
- Add missing commands (if any)

**Files to check**:
- `frontend/src/App.tsx` - commands array

---

## Summary

**Critical (Must Fix)**:
1. Settings backend integration
2. Toast notifications implementation
3. Auto-reload feature
4. Settings type alignment

**Important (Should Fix)**:
5. Auto-save feature
6. Error handling with user feedback
7. Recent files persistence verification

**Nice to Have**:
8. Command palette completeness audit

---

## Recommended Fix Order

1. **Add Toast notifications** - Quick win, improves UX immediately
2. **Integrate settings with backend** - Important for persistence
3. **Implement auto-reload** - Backend is ready, just needs wiring
4. **Add error handling** - Use toasts for all errors
5. **Implement auto-save** - Useful feature
6. **Align settings types** - Clean up inconsistencies
7. **Test recent files** - Verify it works correctly
8. **Audit command palette** - Ensure completeness
