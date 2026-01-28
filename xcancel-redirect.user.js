// ==UserScript==
// @name         X → XCancel Redirect
// @namespace    http://rukko.es
// @version      v4.0
// @license      MIT
// @description  Instantly redirects x.com to xcancel.com, replacing current tab. Use ?no to bypass.
// @author       Rukko
// @match        https://x.com/*
// @match        https://xcancel.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Rukko/xcancel-redirect/main/xcancel-redirect.user.js
// @updateURL    https://raw.githubusercontent.com/Rukko/xcancel-redirect/main/xcancel-redirect.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Si estamos en x.com, manejar la redirección
    if (location.hostname === 'x.com') {
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
    }
    
    // Si estamos en xcancel.com, modificar los enlaces a x.com
    if (location.hostname === 'xcancel.com') {
        // Función para añadir ?no a los enlaces
        function addNoParamToLinks() {
            // Buscar todos los enlaces que apunten a x.com
            const links = document.querySelectorAll('a[href^="https://x.com"]');
            
            links.forEach(link => {
                const url = new URL(link.href);
                
                // Si no tiene ya el parámetro ?no, añadirlo
                if (!url.searchParams.has('no')) {
                    url.searchParams.set('no', '');
                    link.href = url.toString();
                }
            });
        }
        
        // Ejecutar al cargar la página
        addNoParamToLinks();
        
        // Observar cambios en el DOM para enlaces que se añadan dinámicamente
        const observer = new MutationObserver(addNoParamToLinks);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
