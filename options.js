// options.js
// Gère le stockage et la récupération du prompt par défaut pour ChatGPT
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("defaultPrompt");
  const status = document.getElementById("status");

  chrome.storage.local.get(["defaultPrompt"], (res) => {
    input.value = res.defaultPrompt || "";
  });

  document.getElementById("save").onclick = () => {
    chrome.storage.local.set({ defaultPrompt: input.value }, () => {
      status.textContent = "Options enregistrées !";
      status.className = "status success";

      // Faire disparaître le message après 2 secondes
      setTimeout(() => {
        status.className = "status";
      }, 2000);
    });
  };
});
