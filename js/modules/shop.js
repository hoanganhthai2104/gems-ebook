/**
 * GEMS Ebook App - Shop & Store Module
 * Encapsulated Shop listing, cart, checkout & product details module.
 */

window.GEMS = window.GEMS || {};

window.GEMS.Shop = (function () {
    function initShop() {
        console.log("🛒 Shop Module initialized");
        const shopView = document.getElementById('view-shop');
        if (shopView) {
            // Re-render shop banner or active components if needed
            if (typeof renderShopProducts === 'function') {
                renderShopProducts();
            }
        }
    }

    function openShopProductDetail(productId) {
        if (window.appState) {
            window.appState.activeShopProduct = productId;
        }
        const view = document.getElementById('view-shop-product-detail');
        if (view) view.classList.remove('hidden');
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function closeShopProductDetail() {
        const view = document.getElementById('view-shop-product-detail');
        if (view) view.classList.add('hidden');
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function openShopCart() {
        const view = document.getElementById('view-shop-cart');
        if (view) view.classList.remove('hidden');
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function closeShopCart() {
        const view = document.getElementById('view-shop-cart');
        if (view) view.classList.add('hidden');
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function showShopPopup() {
        const popup = document.getElementById('shop-promo-popup');
        if (popup) popup.classList.remove('hidden');
    }

    function closeShopPopup() {
        const popup = document.getElementById('shop-promo-popup');
        if (popup) popup.classList.add('hidden');
    }

    return {
        initShop,
        openShopProductDetail,
        closeShopProductDetail,
        openShopCart,
        closeShopCart,
        showShopPopup,
        closeShopPopup
    };
})();

// Global compatibility bindings for inline HTML handlers (onclick="...")
window.initShop = window.GEMS.Shop.initShop;
window.openShopProductDetail = window.GEMS.Shop.openShopProductDetail;
window.closeShopProductDetail = window.GEMS.Shop.closeShopProductDetail;
window.openShopCart = window.GEMS.Shop.openShopCart;
window.closeShopCart = window.GEMS.Shop.closeShopCart;
window.showShopPopup = window.GEMS.Shop.showShopPopup;
window.closeShopPopup = window.GEMS.Shop.closeShopPopup;
