// ==UserScript==
// @name         bypass Anime3rb Anti-Adblock message
// @namespace    Violentmonkey Scripts
// @version      1.69
// @description  Removes anti-adblock modals and blocks forced fullscreen exit on anime3rb.com.
// @author       You
// @match        https://anime3rb.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const noop = () => {
        console.log('[Bypass] Blocked attempt to exit fullscreen.');
        return Promise.resolve();
    };

    ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'].forEach(name => {
        Object.defineProperty(document, name, {
            configurable: true,
            writable: false,
            value: noop
        });
    });

    ['cancelFullScreen', 'webkitCancelFullScreen', 'mozCancelFullScreen'].forEach(name => {
        Object.defineProperty(Element.prototype, name, {
            configurable: true,
            writable: false,
            value: noop
        });
    });

    console.log('[Bypass] Fullscreen block injected.');

    window.addEventListener('display-modal', (e) => {
        console.log('[Bypass] Blocked modal trigger event.');
        e.stopImmediatePropagation();
        e.preventDefault();
    }, true);

    const hideModal = () => {
        const modal = document.querySelector('#support');
        if (modal) {
            modal.remove();
            console.log('[Bypass] Modal removed.');
        }

        const overlay = document.querySelector('a[style*="position: absolute"][style*="top: 0px"]');
        if (overlay) {
            overlay.remove();
            console.log('[Bypass] Fullscreen ad overlay removed.');
        }

        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    };

    window.addEventListener('DOMContentLoaded', () => {
        const observer = new MutationObserver(() => hideModal());
        observer.observe(document.body, { childList: true, subtree: true });
        hideModal();
    });
})();
