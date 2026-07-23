/**
 * GEMS Ebook App - Main Application Orchestrator & State Bridge
 */

window.GEMS = window.GEMS || {};

// Initialize App State
window.appState = window.appState || {
    isLoggedIn: true,
    activeTab: 'home',
    currentBookId: 'thaoduoc',
    currentChapter: 'tongquan',
    notes: [],
    bookData: {},
    bookInLibrary: false,
    followingAuthor: false,
    followersCount: 12400,
    shopPopupShown: false
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 GEMS Application Initialized cleanly with Modular Architecture!");
    if (typeof window.updateBottomNavVisibility === 'function') {
        window.updateBottomNavVisibility();
    }
});
