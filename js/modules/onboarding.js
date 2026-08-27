/**
 * LIMES Ebook App - Mobile Onboarding Flow Module
 * Provides an interactive 3-step carousel, touch/mouse swipe gesture support,
 * state persistence, and smooth transition to the Login/Registration screen.
 */

window.GEMS = window.GEMS || {};

window.GEMS.Onboarding = (function () {
    let currentSlide = 0;
    const totalSlides = 3;
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    function init() {
        const onboardingView = document.getElementById('view-onboarding');
        const loginView = document.getElementById('view-login');
        const appNav = document.getElementById('app-bottom-nav');

        if (loginView) loginView.classList.add('hidden');
        if (appNav) appNav.classList.add('hidden');

        if (onboardingView) {
            onboardingView.classList.remove('hidden', 'opacity-0', 'scale-95', 'pointer-events-none');
        }

        const carousel = document.getElementById('onboarding-carousel');
        if (!carousel) return;

        // Reset to first slide
        goToSlide(0, false);

        // Setup Touch Gestures for Mobile
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchmove', handleTouchMove);
        carousel.removeEventListener('touchend', handleTouchEnd);
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd);

        // Setup Mouse Drag for Desktop Testing
        carousel.removeEventListener('mousedown', handleMouseDown);
        carousel.addEventListener('mousedown', handleMouseDown);
    }

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 40 && touchEndX !== 0) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        touchStartX = 0;
        touchEndX = 0;
    }

    // Mouse Drag support for easy desktop inspection
    function handleMouseDown(e) {
        touchStartX = e.clientX;
        isDragging = true;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        touchEndX = e.clientX;
    }

    function handleMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 50 && touchEndX !== 0) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        touchStartX = 0;
        touchEndX = 0;
    }

    function goToSlide(index, animate = true) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        currentSlide = index;

        const track = document.getElementById('onboarding-track');
        if (track) {
            if (!animate) {
                track.style.transition = 'none';
            } else {
                track.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
            }
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Update Dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.getElementById(`onboarding-dot-${i}`);
            if (dot) {
                if (i === currentSlide) {
                    dot.className = 'h-2 w-7 bg-brand-blue rounded-full transition-all duration-300 shadow-sm';
                } else {
                    dot.className = 'h-2 w-2 bg-slate-200 hover:bg-slate-300 rounded-full transition-all duration-300 cursor-pointer';
                }
            }
        }

        // Update Button CTA state
        const nextBtn = document.getElementById('onboarding-next-btn');
        const finishBtn = document.getElementById('onboarding-finish-btn');
        const guestLink = document.getElementById('onboarding-guest-link');

        if (currentSlide === totalSlides - 1) {
            if (nextBtn) nextBtn.classList.add('hidden');
            if (finishBtn) finishBtn.classList.remove('hidden');
            if (guestLink) guestLink.classList.remove('hidden');
        } else {
            if (nextBtn) nextBtn.classList.remove('hidden');
            if (finishBtn) finishBtn.classList.add('hidden');
            if (guestLink) guestLink.classList.add('hidden');
        }
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        } else {
            completeOnboarding(false);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    function completeOnboarding(skipToApp = false) {
        localStorage.setItem('gems_onboarding_completed', 'true');
        const onboardingView = document.getElementById('view-onboarding');
        const loginView = document.getElementById('view-login');
        
        if (!skipToApp && loginView) {
            // Unhide loginView immediately directly underneath onboardingView (z-[9998] over z-[9995])
            // to completely eliminate the brief flash of the underlying home screen
            loginView.classList.remove('hidden', 'opacity-0');
            if (typeof initLoginCanvas === 'function') initLoginCanvas();
        }

        if (onboardingView) {
            onboardingView.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            setTimeout(() => {
                onboardingView.classList.add('hidden');
                onboardingView.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');

                if (skipToApp) {
                    if (typeof enterMainApp === 'function') {
                        enterMainApp();
                    }
                }
            }, 400);
        }
    }

    function skipOnboarding() {
        completeOnboarding(false);
    }

    function openOnboardingFlow() {
        const onboardingView = document.getElementById('view-onboarding');
        const loginView = document.getElementById('view-login');
        const appNav = document.getElementById('app-bottom-nav');

        if (loginView) loginView.classList.add('hidden');
        if (appNav) appNav.classList.add('hidden');

        if (onboardingView) {
            onboardingView.classList.remove('hidden', 'opacity-0', 'scale-95', 'pointer-events-none');
            goToSlide(0, false);
            init();
        }
    }

    // Auto-check on page load
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('onboarding') || urlParams.has('reset')) {
            localStorage.removeItem('gems_onboarding_completed');
            localStorage.removeItem('gems_logged_in');
        }

        const hasSeenOnboarding = localStorage.getItem('gems_onboarding_completed') === 'true';
        const onboardingView = document.getElementById('view-onboarding');
        const loginView = document.getElementById('view-login');
        const appNav = document.getElementById('app-bottom-nav');

        if (!hasSeenOnboarding) {
            if (loginView) loginView.classList.add('hidden');
            if (appNav) appNav.classList.add('hidden');
            if (onboardingView) {
                onboardingView.classList.remove('hidden', 'opacity-0', 'scale-95', 'pointer-events-none');
            }
            init();
        } else {
            // Already seen onboarding, hide onboarding screen
            if (onboardingView) {
                onboardingView.classList.add('hidden');
            }
        }
    });

    return {
        init: init,
        goToSlide: goToSlide,
        nextSlide: nextSlide,
        prevSlide: prevSlide,
        completeOnboarding: completeOnboarding,
        skipOnboarding: skipOnboarding,
        openOnboardingFlow: openOnboardingFlow
    };
})();

// Global convenience bindings
window.goToOnboardingSlide = function(idx) {
    if (window.GEMS && window.GEMS.Onboarding) window.GEMS.Onboarding.goToSlide(idx);
};
window.nextOnboardingSlide = function() {
    if (window.GEMS && window.GEMS.Onboarding) window.GEMS.Onboarding.nextSlide();
};
window.prevOnboardingSlide = function() {
    if (window.GEMS && window.GEMS.Onboarding) window.GEMS.Onboarding.prevSlide();
};
window.completeOnboarding = function(asGuest) {
    if (window.GEMS && window.GEMS.Onboarding) window.GEMS.Onboarding.completeOnboarding(asGuest);
};
window.skipOnboarding = function() {
    if (window.GEMS && window.GEMS.Onboarding) window.GEMS.Onboarding.skipOnboarding();
};
window.openOnboardingFlow = function() {
    if (window.GEMS && window.GEMS.Onboarding) window.GEMS.Onboarding.openOnboardingFlow();
};
window.resetAndShowOnboarding = function() {
    localStorage.removeItem('gems_onboarding_completed');
    localStorage.removeItem('gems_logged_in');
    location.reload();
};

// Interactive Demo Handlers for Ebook Onboarding Slides
window.setDemoReaderTheme = function(theme) {
    const card = document.getElementById('onboarding-reader-demo-card');
    const header = document.getElementById('onboarding-demo-header');
    const text = document.getElementById('onboarding-demo-text');
    const bLight = document.getElementById('demo-btn-light');
    const bSepia = document.getElementById('demo-btn-sepia');
    const bDark = document.getElementById('demo-btn-dark');
    if (!card || !header || !text) return;

    [bLight, bSepia, bDark].forEach(b => {
        if (b) {
            b.classList.remove('ring-2', 'ring-brand-blue', 'ring-amber-600', 'ring-sky-400', 'font-bold', 'scale-105');
            b.classList.add('opacity-70');
        }
    });

    if (theme === 'light') {
        card.style.backgroundColor = '#ffffff';
        card.style.borderColor = 'rgba(226, 232, 240, 0.9)';
        header.style.color = '#64748b';
        text.style.color = '#1e293b';
        if (bLight) {
            bLight.classList.add('ring-2', 'ring-brand-blue', 'font-bold', 'scale-105');
            bLight.classList.remove('opacity-70');
        }
    } else if (theme === 'sepia') {
        card.style.backgroundColor = '#fbf0d9';
        card.style.borderColor = 'rgba(217, 119, 6, 0.3)';
        header.style.color = '#8c6d48';
        text.style.color = '#45321f';
        if (bSepia) {
            bSepia.classList.add('ring-2', 'ring-amber-600', 'font-bold', 'scale-105');
            bSepia.classList.remove('opacity-70');
        }
    } else if (theme === 'dark') {
        card.style.backgroundColor = '#0f172a';
        card.style.borderColor = 'rgba(51, 65, 85, 0.9)';
        header.style.color = '#94a3b8';
        text.style.color = '#e2e8f0';
        if (bDark) {
            bDark.classList.add('ring-2', 'ring-sky-400', 'font-bold', 'scale-105');
            bDark.classList.remove('opacity-70');
        }
    }
};

window.setDemoHighlightColor = function(color) {
    const hl = document.getElementById('onboarding-demo-highlight');
    if (!hl) return;
    hl.className = 'p-2.5 rounded-xl text-[10.5px] leading-relaxed font-medium transition-all duration-300 border-l-[3px] ';
    if (color === 'yellow') {
        hl.className += 'bg-amber-100/90 text-amber-950 border-amber-500';
    } else if (color === 'blue') {
        hl.className += 'bg-sky-100/90 text-sky-950 border-sky-500';
    } else if (color === 'green') {
        hl.className += 'bg-emerald-100/90 text-emerald-950 border-emerald-500';
    }
};

