// ==UserScript==
// @name        Yotsuba Stock Exchange Remember Amount and Remember Order Type
// @match       https://boards.4chan.org/yse.html
// @version     0.1
// @author      adpy824
// @grant       unsafeWindow
// ==/UserScript==

// Tested on Chrome with Violentmonkey


(function() {
    'use strict';

    // Function to check and update values if reset to zero
    function checkAndUpdateValues() {
        // Remember the selected radio button
        let lastRadio = localStorage.getItem('lastRadio');
        if (lastRadio && !document.querySelector('input[name="ot"]:checked')) {
            document.getElementById(lastRadio).checked = true;
        }

        // Remember the last value in the amount text box
        let lastAmount = localStorage.getItem('lastAmount');
        if (lastAmount) {
            let currentAmount = document.getElementById('js-amount').value;
            if (currentAmount === '0') {
                document.getElementById('js-amount').value = lastAmount;
            }
        }
    }

    // Initial check and update
    checkAndUpdateValues();

    // Check and update values every second
    setInterval(checkAndUpdateValues, 1000);

    // Add event listener to the "Confirm Order" button
    document.getElementById('js-order-btn').addEventListener('click', function() {
        // Remember the selected radio button only if no radio button is currently selected
        let selectedRadio = document.querySelector('input[name="ot"]:checked');
        if (!selectedRadio) {
            let lastRadio = localStorage.getItem('lastRadio');
            if (lastRadio) {
                document.getElementById(lastRadio).checked = true;
            }
        }

        // Remember the last value in the amount text box
        let amountValue = document.getElementById('js-amount').value;
        if (amountValue) {
            localStorage.setItem('lastAmount', amountValue);
        }
    });
})();