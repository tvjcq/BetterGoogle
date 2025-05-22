// injectChat.js : polling pour envoyer le prompt dès que le bouton existe
(function () {
  const poll = setInterval(() => {
    const sendBtn = document.getElementById("composer-submit-button");
    if (sendBtn) {
      sendBtn.click();
      clearInterval(poll);
    }
  }, 500);
})();
