/* js/modules/ui-utils.js - Toast Notifications, Scroll Handlers & Modal Helpers */
(function() {
    window.showToast = function(msg, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-5 right-5 z-[9999] flex flex-col space-y-2 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const bgColors = {
            info: 'bg-blue-600',
            success: 'bg-emerald-600',
            warning: 'bg-amber-600',
            error: 'bg-rose-600'
        };

        const bgClass = bgColors[type] || bgColors.info;
        toast.className = `toast-item ${bgClass} text-white px-4 py-3 rounded-xl shadow-xl font-medium text-sm transition-all duration-300 pointer-events-auto flex items-center space-x-2`;
        toast.innerHTML = `<span>${msg}</span>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-[-10px]');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    window.preventGhostClick = function() {
        if (typeof isSwitchingTab !== 'undefined' && isSwitchingTab) return;
        const blocker = document.getElementById('ghost-click-blocker');
        if (blocker) {
            blocker.classList.remove('hidden');
            setTimeout(() => {
                blocker.classList.add('hidden');
            }, 350);
        }
    };

    window.initBackToTopScroll = function() {
        const scrollContainers = [
            { id: 'shop-scroll-content', fn: 'handleShopScroll' },
            { id: 'local-scroll-content', fn: 'handleLocalScroll' },
            { id: 'view-shop-xtra-scroll', fn: 'handleXtraScroll' },
            { id: 'home-scroll-content', fn: 'handleHomeScroll' },
            { id: 'global-scroll-content', fn: 'handleGlobalScroll' }
        ];

        scrollContainers.forEach(item => {
            const el = document.getElementById(item.id);
            if (el && typeof window[item.fn] === 'function') {
                el.addEventListener('scroll', window[item.fn], { passive: true });
            }
        });
    };
})();
