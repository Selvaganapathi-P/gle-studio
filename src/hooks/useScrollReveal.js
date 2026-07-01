import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useScrollReveal
 * ------------------------------------------------------------
 * Watches the page for any element carrying a [data-reveal]
 * attribute (see index.css for the fade/slide/scale variants)
 * and adds the `.is-visible` class the moment it scrolls into
 * view — triggering the CSS transition already defined for
 * [data-reveal].is-visible.
 *
 * - Re-scans whenever the route changes (location.pathname),
 *   so newly-mounted pages get their reveals wired up.
 * - Also watches for elements added later via a MutationObserver
 *   (e.g. gallery photos / frame cards that load after an API call).
 * - Each element reveals once, then is left alone (no replay on
 *   scroll-up) — keeps things subtle rather than distracting.
 *
 * Usage: call once near the root of your layout, e.g. inside
 * PublicLayout in App.jsx. Then anywhere in your pages:
 *
 *   <div data-reveal>Fades up into view</div>
 *   <img data-reveal="scale" ... />
 *   <h2 data-reveal="left">Slides in from the left</h2>
 *   <div data-reveal style={{ '--reveal-delay': '0.15s' }}>Staggered</div>
 */
export default function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    const observeAll = () => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        if (!el.dataset.revealBound) {
          el.dataset.revealBound = 'true';
          observer.observe(el);
        }
      });
    };

    // Initial scan after this page has rendered
    observeAll();

    // Catch elements that mount later (async photo grids, etc.)
    const mutationObserver = new MutationObserver(() => observeAll());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
}