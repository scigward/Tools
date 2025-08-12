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

    Object.defineProperty(window, 'isOpen', {
        get: () => false,
        set: () => {},
        configurable: true
    });

    const hideModal = () => {
        document.querySelectorAll('div[x-show="isOpen"]').forEach(el => {
            el.remove();
            console.log('[Bypass] Modal removed.');
        });

        document.querySelectorAll('a[style*="position:fixed"][style*="width:100vw"]').forEach(el => {
            el.remove();
            console.log('[Bypass] Overlay removed.');
        });

        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    };

    new MutationObserver(hideModal).observe(document.documentElement, { childList: true, subtree: true });

    hideModal();
})();
