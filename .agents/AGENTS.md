# Project Rules

- **Git Push Policy**: Chỉ thực hiện commit và push lên Git/GitHub khi có yêu cầu bằng lời nói rõ ràng từ người dùng. Tuyệt đối không tự ý stage, commit hoặc push code trong bất kỳ trường hợp nào khác.

- **Strict Scope of Work**: Chỉ chỉnh sửa đúng những file và những dòng code cần thiết cho yêu cầu hiện tại. Các phần code khác phải giữ nguyên trạng để tránh gây lỗi dây chuyền cho các tính năng đang hoạt động bình thường khác.

- **Vietnamese Language Integrity**: Always preserve and maintain the integrity of Vietnamese text and UTF-8 encoding in the codebase. Do not alter, break, or mess up Vietnamese diacritics or translations unless explicitly requested.

## GEMS Ebook App – UI/UX Rules

- **Navigation Bar & E-Reader**: The bottom navigation bar (`#app-bottom-nav`) must be HIDDEN when the e-reader screen (`#view-reader`) is open. It must be restored (SHOWN) when the e-reader is closed. This is intentional design — the reader is a full-screen immersive experience. Do NOT make the nav bar always visible globally; it must be hidden specifically inside the reader.

- **Navigation Bar Z-Index**: For ALL other screens (not the reader), the navigation bar must stay visible and use `z-[200]` so it is always rendered above sub-panels (z-[60] to z-[95] range). Never reduce the nav bar z-index below z-[200] outside of the reader context.

- **Note/Highlight Modal Z-Index**: The reader note modal (`#reader-note-modal`) must use `z-[300]` so it sits ABOVE the navigation bar (`z-[200]`). Never set it lower than z-[250].

- **Dictionary Term Detail Panel**: `#view-dict-term` is a child element nested inside `#view-dictionary`. This means `view-dictionary` must be made visible (remove `hidden`) BEFORE calling `openDictionaryTerm()`. Any function that opens a term detail from OUTSIDE the dictionary view (e.g., `openKeyTermDetail` from Chi tiết kiến thức) MUST first call `openDictionary()`, then call `openDictionaryTerm()` (with a small setTimeout if needed for DOM update).

- **Highlight/Ghi Chú Feature**: The `selectedText` variable stores the currently bôi đen (selected) text in the reader. The `pointerdown` event listener must NOT clear `selectedText` or `selectedRange` when a click event originates INSIDE `#reader-note-modal`. Failing to guard this will cause the "Vui lòng bôi đen vùng chọn văn bản trước" warning when the user tries to save a note.

- **Selection Toolbar Behavior**: The floating selection toolbar (`#selection-toolbar`) appears when the user selects/highlights text inside the e-reader viewport. It must only be dismissed when clicking OUTSIDE the reader viewport — not when clicking inside `#reader-note-modal`.

