/**
 * GEMS Ebook App - Navigation & Screen Router Module
 * Encapsulated bottom navigation, tab routing, and z-index visibility management.
 */

window.GEMS = window.GEMS || {};

window.GEMS.Nav = (function () {
    let isSwitchingTab = false;

    function updateBottomNavVisibility() {
        const appNav = document.getElementById('app-bottom-nav');
        if (appNav) {
            if (window.appState && !window.appState.isLoggedIn) {
                appNav.classList.add('hidden');
                return;
            }

            const readerView = document.getElementById('view-reader');
            if (readerView && !readerView.classList.contains('hidden')) {
                // Rule: Hidden inside e-reader
                appNav.classList.add('hidden');
            } else {
                // Rule: Restored for all other views, z-[200]
                appNav.classList.remove('hidden');
            }
        }
    }

    function switchTab(tabName) {
        console.log("=== switchTab START to " + tabName);
        const tStart = performance.now();

        if (window.appState && !window.appState.isLoggedIn) {
            const loginView = document.getElementById('view-login');
            if (loginView && loginView.classList.contains('hidden')) {
                loginView.classList.remove('hidden');
                if (typeof initLoginCanvas === 'function') initLoginCanvas();
            }
            const appNav = document.getElementById('app-bottom-nav');
            if (appNav) appNav.classList.add('hidden');
            return;
        }

        isSwitchingTab = true;

        if (window.appState && window.appState.shopBannerInterval) {
            clearInterval(window.appState.shopBannerInterval);
            window.appState.shopBannerInterval = null;
        }

        // Close slide-over panels
        ['view-book-detail', 'view-author-profile', 'view-group-detail'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });

        // Hide all overlay views
        const allOverlays = [
            'view-reader', 'view-quiz', 'view-audiobook', 'view-dictionary',
            'view-library-search', 'view-shop-search', 'view-shop-search-results',
            'view-knowledge-details', 'view-blog-view', 'view-knowledge-experience',
            'view-reading-habit', 'view-dict-term', 'view-shop-product-detail',
            'view-shop-cart', 'view-shop-checkout', 'view-shop-success',
            'view-checkout-voucher-selector', 'view-shop-orders', 'view-shop-vouchers',
            'view-shop-messages', 'view-shop-chat-detail', 'view-shop-address',
            'view-shop-paylater', 'view-shop-local', 'view-shop-xtra',
            'view-shop-freeship', 'view-shop-mall', 'view-shop-global',
            'view-shop-flashsale', 'view-profile-sublist', 'view-profile-rewards'
        ];
        allOverlays.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        // Hide view panels
        document.querySelectorAll('.view-panel').forEach(panel => {
            panel.classList.add('hidden');
        });

        const selectedPanel = document.getElementById(`view-${tabName}`);
        if (selectedPanel) {
            selectedPanel.classList.remove('hidden');
        }

        if (tabName === 'shop' && window.appState && !window.appState.shopPopupShown) {
            window.appState.shopPopupShown = true;
            requestAnimationFrame(() => {
                if (typeof showShopPopup === 'function') showShopPopup();
            });
        }

        // Tabs button CSS highlight styling
        const tabs = ['home', 'library', 'shop', 'profile'];
        const highlightTab = (tabName === 'book-toc') ? 'library' : tabName;

        tabs.forEach(t => {
            const btn = document.getElementById(`tab-${t}`);
            if (btn) {
                const wrapper = btn.querySelector('.nav-icon-wrapper');
                const label = btn.querySelector('.nav-label');
                const icon = btn.querySelector('.material-symbols-outlined');

                if (t === highlightTab) {
                    if (wrapper) {
                        wrapper.className = "nav-icon-wrapper flex items-center justify-center w-11 h-11 active-tab-circle circle-animate transition-colors duration-150";
                    }
                    if (icon) {
                        icon.classList.add('filled-icon', 'text-[22px]');
                        icon.classList.remove('text-lg');
                    }
                    if (label) {
                        label.className = "nav-label text-[10px] mt-0.5 font-bold text-blue-600 transition-all duration-300";
                    }
                } else {
                    if (wrapper) {
                        wrapper.className = "nav-icon-wrapper flex items-center justify-center w-11 h-11 text-slate-500 hover:bg-slate-100/50 rounded-full transition-colors duration-150";
                    }
                    if (icon) {
                        icon.classList.remove('filled-icon', 'text-[24px]');
                        icon.classList.add('text-lg');
                    }
                    if (label) {
                        label.className = "nav-label text-[10px] mt-0.5 font-bold text-slate-500 transition-all duration-300";
                    }
                }
            }
        });

        if (window.appState) {
            window.appState.activeTab = tabName;
        }

        if (tabName === 'shop') {
            if (typeof initShop === 'function') initShop();
        }

        updateBottomNavVisibility();
        isSwitchingTab = false;
        console.log("=== switchTab END, took " + (performance.now() - tStart).toFixed(2) + "ms");
    }

    function toggleSideMenu() {
        const sideMenu = document.getElementById('side-menu-overlay');
        if (sideMenu) sideMenu.classList.toggle('hidden');
    }

    function toggleQRModal(show) {
        const qrModal = document.getElementById('qr-zoom-modal');
        if (qrModal) {
            if (show) qrModal.classList.remove('hidden');
            else qrModal.classList.add('hidden');
        }
    }

    return {
        updateBottomNavVisibility,
        switchTab,
        toggleSideMenu,
        toggleQRModal,
        get isSwitchingTab() { return isSwitchingTab; }
    };
})();

// Global compatibility bindings for inline HTML handlers (onclick="...")
window.updateBottomNavVisibility = window.GEMS.Nav.updateBottomNavVisibility;
window.switchTab = window.GEMS.Nav.switchTab;
window.toggleSideMenu = window.GEMS.Nav.toggleSideMenu;
window.toggleQRModal = window.GEMS.Nav.toggleQRModal;
