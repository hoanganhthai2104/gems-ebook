/* js/modules/theme.js - E-reader & Application Theme Switcher */
(function() {
    window.setTheme = function(themeName) {
        const readerEl = document.getElementById('view-reader');
        if (!readerEl) return;
        
        readerEl.classList.remove('theme-white', 'theme-sepia', 'theme-dark');
        readerEl.classList.add(`theme-${themeName}`);
        
        localStorage.setItem('gems_reader_theme', themeName);
        if (typeof window.showToast === 'function') {
            const themeNames = { white: 'Sáng', sepia: 'Vàng sepia', dark: 'Tối' };
            window.showToast(`Đã chuyển theme trình đọc: ${themeNames[themeName] || themeName}`, 'info');
        }
    };

    window.initTheme = function() {
        const savedTheme = localStorage.getItem('gems_reader_theme') || 'white';
        window.setTheme(savedTheme);
    };
})();
