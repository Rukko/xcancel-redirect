// ==UserScript==
// @name         X → XCancel Redirect
// @namespace    http://rukko.es
// @version      v3.1
// @license      MIT
// @description  Instantly redirects x.com to xcancel.com, replacing current tab. Use ?no to bypass.
// @author       Rukko
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL  https://github
// @updateURL    https://github
// ==/UserScript==

(function() {
    'use strict';
    
    // Verificar si existe el parámetro ?no en la URL
    const urlParams = new URLSearchParams(location.search);
    
    if (urlParams.has('no')) {
        // Si existe ?no, limpiar el parámetro de la URL sin redirigir
        urlParams.delete('no');
        const cleanUrl = location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + location.hash;
        history.replaceState(null, '', cleanUrl);
        return; // No redirigir
    }
    
    // Si no hay parámetro ?no, proceder con la redirección
    const newUrl = location.href.replace('https://x.com', 'https://xcancel.com');
    if (newUrl !== location.href) {
        location.replace(newUrl);
    }
})();