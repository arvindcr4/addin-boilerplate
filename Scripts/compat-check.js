// Compatibility check for Word add-in running old Office versions
window.addEventListener('load', function () {
  // Do UserAgent check before any React runs to ensure compatibility
  if (navigator.userAgent.indexOf('Trident') !== -1 || navigator.userAgent.indexOf('Edge') !== -1) {
    // create a message div, and add our error message to it.
    const messageContainer = document.createElement('div');
    const icon = document.createElement('img');
    icon.src = './assets/spellbook-icon-v2-64.png';
    icon.alt = 'Spellbook';

    const errorMessage = document.createTextNode(
      "Spellbook can't run in your version of Office. Please upgrade either to perpetual Office 2021 or to a Microsoft 365 account."
    );

    messageContainer.appendChild(icon);
    messageContainer.appendChild(document.createElement('br'));
    messageContainer.appendChild(errorMessage);
    messageContainer.style.textAlign = 'center';
    messageContainer.style.padding = '200px 20px';

    // insert the message div before the container div.
    document.body.appendChild(messageContainer);
  }
});
