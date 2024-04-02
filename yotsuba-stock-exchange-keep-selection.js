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
        // Remember the selected buy and sell radio buttons
        let lastBuyRadio = localStorage.getItem('lastBuyRadio');
        if (lastBuyRadio && !document.querySelector('input[value="buy"]:checked')) {
            document.getElementById(lastBuyRadio).checked = true;
        }

        let lastSellRadio = localStorage.getItem('lastSellRadio');
        if (lastSellRadio && !document.querySelector('input[value="sell"]:checked')) {
            document.getElementById(lastSellRadio).checked = true;
        }

        // Remember the last value in the amount text box
        let lastAmount = localStorage.getItem('lastAmount');
        if (lastAmount) {
            let currentAmount = document.getElementById('js-amount').value;
            if ((currentAmount === '0' || currentAmount === '') && lastAmount !== '0') {
                document.getElementById('js-amount').value = lastAmount;
            }
        }
    }

    // Function to scan and replace 0 in the text box every 3/16th second with 1000 if the value is 0 or empty
    function scanAndReplaceZeroTextBox() {
        let amountInput = document.getElementById('js-amount');
        let amountValue = amountInput.value;

        // Replace 0 with 1000 if the value is 0 or empty
        if (amountValue === '0' || amountValue === '') {
            amountInput.value = '1000';
        }
    }

    // Function to scan both radio buttons and update selection
    function scanAndUpdateRadioButtons() {
        let lastBuyRadio = localStorage.getItem('lastBuyRadio');
        let lastSellRadio = localStorage.getItem('lastSellRadio');
        let selectedBuyRadio = document.querySelector('input[value="buy"]:checked');
        let selectedSellRadio = document.querySelector('input[value="sell"]:checked');

        // If both radio buttons are empty, overwrite with saved button selection
        if (!selectedBuyRadio && !selectedSellRadio && lastBuyRadio) {
            document.getElementById(lastBuyRadio).checked = true;
        }

        if (!selectedBuyRadio && !selectedSellRadio && lastSellRadio) {
            document.getElementById(lastSellRadio).checked = true;
        }
    }

    // Function to scan for "for a total of ..." and update the text box
    function scanAndUpdateTextBox() {
        let totalText = document.documentElement.innerHTML;
        let match = totalText.match(/for a total of (\d+)/);
        if (match) {
            let totalValue = match[1];
            let amountInput = document.getElementById('js-amount');
            amountInput.value = ''; // Clear the current value
            // Simulate keyboard typing the value into the text box
            totalValue.split('').forEach(char => {
                let event = new KeyboardEvent('keypress', {'key': char});
                amountInput.dispatchEvent(event);
            });
            // Remember the last value in the amount text box
            localStorage.setItem('lastAmount', totalValue);
        }
    }

    // Initial check and update
    checkAndUpdateValues();

    // Check and update values every second
    setInterval(checkAndUpdateValues, 1000);

    // Scan and replace 0 in the text box every 3/16th second
    setInterval(scanAndReplaceZeroTextBox, 187.5);

    // Scan radio buttons and update selection every 1/8th second
    setInterval(scanAndUpdateRadioButtons, 125);

    // Scan and update text box every 1/4 second
    setInterval(scanAndUpdateTextBox, 250);

    // Add event listener to the "Confirm Order" button
    document.getElementById('js-order-btn').addEventListener('click', function() {
        // Remember the selected buy and sell radio buttons
        let selectedBuyRadio = document.querySelector('input[value="buy"]:checked');
        if (selectedBuyRadio) {
            localStorage.setItem('lastBuyRadio', selectedBuyRadio.id);
        }

        let selectedSellRadio = document.querySelector('input[value="sell"]:checked');
        if (selectedSellRadio) {
            localStorage.setItem('lastSellRadio', selectedSellRadio.id);
        }
    });
})();
