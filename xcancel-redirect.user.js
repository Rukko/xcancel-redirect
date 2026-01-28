// ==UserScript==
// @name         X → Twitter Frontend Redirect
// @namespace    http://rukko.es
// @version      5.0.1
// @license      MIT
// @description  Redirects x.com to your preferred Twitter frontend. Choose from xcancel (default), nitter instances, and more.
// @author       Rukko
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://xcancel.com/*
// @match        https://*.nitter.net/*
// @match        https://nitter.poast.org/*
// @match        https://nitter.privacydev.net/*
// @match        https://nitter.1d4.us/*
// @match        https://nitter.unixfox.eu/*
// @match        https://nitter.hu/*
// @match        https://bird.makeup/*
// @match        https://twstalker.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/Rukko/xcancel-redirect/main/xcancel-redirect.user.js
// @updateURL    https://raw.githubusercontent.com/Rukko/xcancel-redirect/main/xcancel-redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Available Twitter frontends
    const FRONTENDS = {
        'xcancel.com': 'XCancel',
        'nitter.poast.org': 'Nitter (poast.org)',
        'nitter.privacydev.net': 'Nitter (privacydev.net)',
        'nitter.1d4.us': 'Nitter (1d4.us)',
        'nitter.unixfox.eu': 'Nitter (unixfox.eu)',
        'nitter.hu': 'Nitter (hu)',
        'bird.makeup': 'Bird Makeup',
        'twstalker.com': 'TWstalker'
    };
    
    const DEFAULT_FRONTEND = 'xcancel.com';
    
    // Get current frontend preference
    function getFrontend() {
        return GM_getValue('frontend', DEFAULT_FRONTEND);
    }
    
    // Set frontend preference
    function setFrontend(frontend) {
        GM_setValue('frontend', frontend);
    }
    
    // Show configuration dialog
    function showConfigDialog() {
        const currentFrontend = getFrontend();
        
        // Create dialog HTML
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #000;
            min-width: 350px;
        `;
        
        dialog.innerHTML = `
            <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Twitter Frontend Settings</h2>
            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Choose your preferred frontend for X/Twitter redirects:</p>
            <select id="frontend-select" style="
                width: 100%;
                height: auto;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                margin-bottom: 20px;
                cursor: pointer;
            ">
                ${Object.entries(FRONTENDS).map(([url, name]) => 
                    `<option value="${url}" ${url === currentFrontend ? 'selected' : ''}>${name}</option>`
                ).join('')}
            </select>
            <div style="display: flex; gap: 10px;">
                <button id="save-btn" style="
                    flex: 1;
                    padding: 10px 20px;
                    background: #1d9bf0;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                ">Save</button>
                <button id="cancel-btn" style="
                    flex: 1;
                    padding: 10px 20px;
                    background: #eff3f4;
                    color: #0f1419;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                ">Cancel</button>
            </div>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        // Event handlers
        document.getElementById('save-btn').addEventListener('click', () => {
            const selected = document.getElementById('frontend-select').value;
            setFrontend(selected);
            overlay.remove();
            dialog.remove();
            alert(`Frontend changed to ${FRONTENDS[selected]}. Reload the page for changes to take effect. If it is not in the current list, you may want to add it in the @include list.`);
        });
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            overlay.remove();
            dialog.remove();
        });
        
        overlay.addEventListener('click', () => {
            overlay.remove();
            dialog.remove();
        });
    }
    
    // Register menu command
    GM_registerMenuCommand('⚙️ Configure Frontend', showConfigDialog);
    
    // Get all frontend domains for checking
    const frontendDomains = Object.keys(FRONTENDS);
    const isOnFrontend = frontendDomains.some(domain => location.hostname === domain || location.hostname.endsWith('.' + domain));
    
    // If we're on x.com or twitter.com, handle the redirect
    if (location.hostname === 'x.com' || location.hostname === 'twitter.com') {
        // Check if the ?no parameter exists in the URL
        const urlParams = new URLSearchParams(location.search);
        
        if (urlParams.has('no')) {
            // If ?no exists, clean the parameter from the URL without redirecting
            urlParams.delete('no');
            const cleanUrl = location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + location.hash;
            history.replaceState(null, '', cleanUrl);
            return; // Don't redirect
        }
        
        // Get the preferred frontend and redirect
        const frontend = getFrontend();
        const sourceUrl = location.hostname === 'x.com' ? 'https://x.com' : 'https://twitter.com';
        const newUrl = location.href.replace(sourceUrl, 'https://' + frontend);
        
        if (newUrl !== location.href) {
            location.replace(newUrl);
        }
    }
    
    // If we're on any frontend, modify links back to x.com/twitter.com
    if (isOnFrontend) {
        // Function to add ?no to links
        function addNoParamToLinks() {
            // Find all links pointing to x.com or twitter.com
            const links = document.querySelectorAll('a[href^="https://x.com"], a[href^="https://twitter.com"]');
            
            links.forEach(link => {
                const url = new URL(link.href);
                
                // If it doesn't have the ?no parameter yet, add it
                if (!url.searchParams.has('no')) {
                    url.searchParams.set('no', '');
                    link.href = url.toString();
                }
            });
        }
        
        // Execute on page load
        addNoParamToLinks();
        
        // Observe DOM changes for dynamically added links
        const observer = new MutationObserver(addNoParamToLinks);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
