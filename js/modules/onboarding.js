/**
 * GEMS Ebook App - Mobile Onboarding Flow Module
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
        
        if (onboardingView) {
            onboardingView.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            setTimeout(() => {
                onboardingView.classList.add('hidden');
                onboardingView.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');

                if (skipToApp) {
                    if (typeof enterMainApp === 'function') {
                        enterMainApp();
                    }
                } else {
                    const loginView = document.getElementById('view-login');
                    if (loginView) {
                        loginView.classList.remove('hidden');
                        if (typeof initLoginCanvas === 'function') initLoginCanvas();
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
