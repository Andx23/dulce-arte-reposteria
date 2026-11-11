
/* =========================================
   DULCE ARTE - FUNCIONALIDAD DEL FOOTER
   ========================================= */

(function () {
    'use strict';

    const currentYearElement = document.getElementById('current-year');

    if (!currentYearElement) {
        return;
    }

    const currentYear = new Date().getFullYear();

    currentYearElement.textContent = currentYear;
})();
