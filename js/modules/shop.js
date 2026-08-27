/**
 * LIMES Ebook App - Shop & Store Module
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
            startFlashSaleTimer();
        }
    }

    function claimVoucher(code) {
        if (!window.appState) return;
        window.appState.userVouchers = window.appState.userVouchers || [];
        if (!window.appState.userVouchers.includes(code)) {
            window.appState.userVouchers.push(code);
            if (typeof window.saveState === 'function') window.saveState();
            if (typeof window.showToast === 'function') {
                window.showToast(`Đã lưu voucher ${code} vào ví!`, 'success');
            }
        } else {
            if (typeof window.showToast === 'function') {
                window.showToast(`Voucher ${code} đã có trong ví của bạn.`, 'info');
            }
        }
    }

    function startFlashSaleTimer() {
        if (window.flashSaleInterval) clearInterval(window.flashSaleInterval);
        let secondsLeft = 9900; // 2h45m demo timer
        window.flashSaleInterval = setInterval(() => {
            secondsLeft--;
            if (secondsLeft <= 0) secondsLeft = 9900;
            const h = Math.floor(secondsLeft / 3600);
            const m = Math.floor((secondsLeft % 3600) / 60);
            const s = secondsLeft % 60;
            
            const hStr = String(h).padStart(2, '0');
            const mStr = String(m).padStart(2, '0');
            const sStr = String(s).padStart(2, '0');

            ['flash-timer-h', 'fs-detail-hour'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = hStr;
            });
            ['flash-timer-m', 'fs-detail-min'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = mStr;
            });
            ['flash-timer-s', 'fs-detail-sec'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = sStr;
            });
        }, 1000);
    }

    function renderOrdersTimeline() {
        const container = document.getElementById('shop-orders-container');
        if (!container) return;
        const mockOrders = [
            { id: "LIMES-88231", title: "Sách Giải Phẫu Học 3D", status: "Đang vận chuyển", step: 3, date: "07/08/2026", price: "250.000đ" },
            { id: "LIMES-77109", title: "Voucher Bệnh Viện Y Dược 100K", status: "Đã hoàn thành", step: 4, date: "05/08/2026", price: "0đ (50 LIMES Xu)" }
        ];

        container.innerHTML = mockOrders.map(ord => `
            <div class="glass-card-premium p-4 rounded-2xl mb-3 border border-slate-200/80 shadow-sm">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-mono text-xs font-bold text-slate-500">${ord.id}</span>
                    <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full ${ord.step === 4 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}">${ord.status}</span>
                </div>
                <h4 class="font-bold text-sm text-slate-800 mb-1">${ord.title}</h4>
                <div class="flex justify-between items-center text-xs text-slate-500 mb-3">
                    <span>Ngọc: ${ord.date}</span>
                    <span class="font-bold text-slate-900">${ord.price}</span>
                </div>
                <!-- Progress steps -->
                <div class="grid grid-cols-4 gap-1 text-center pt-2 border-t border-slate-100">
                    <div class="${ord.step >= 1 ? 'text-blue-600 font-bold' : 'text-slate-400'} text-[9px]">Xác nhận</div>
                    <div class="${ord.step >= 2 ? 'text-blue-600 font-bold' : 'text-slate-400'} text-[9px]">Đóng gói</div>
                    <div class="${ord.step >= 3 ? 'text-blue-600 font-bold' : 'text-slate-400'} text-[9px]">Đang giao</div>
                    <div class="${ord.step >= 4 ? 'text-emerald-600 font-bold' : 'text-slate-400'} text-[9px]">Hoàn thành</div>
                </div>
            </div>
        `).join('');
    }

    function openShopProductDetail(productId) {
        if (window.appState) {
            window.appState.activeShopProduct = productId;
        }
        const view = document.getElementById('view-shop-product-detail');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.remove('hidden');
                view.classList.add('gpu-layer');
            });
        }
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function closeShopProductDetail() {
        const view = document.getElementById('view-shop-product-detail');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.add('hidden');
            });
        }
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function openShopCart() {
        const view = document.getElementById('view-shop-cart');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.remove('hidden');
                view.classList.add('gpu-layer');
            });
        }
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function closeShopCart() {
        const view = document.getElementById('view-shop-cart');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.add('hidden');
            });
        }
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
        closeShopPopup,
        claimVoucher,
        startFlashSaleTimer,
        renderOrdersTimeline
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
window.claimVoucher = window.GEMS.Shop.claimVoucher;
window.startFlashSaleTimer = window.GEMS.Shop.startFlashSaleTimer;
window.renderOrdersTimeline = window.GEMS.Shop.renderOrdersTimeline;
