// content.js
(function () {
  // Démarrer l'init dès que possible, même si DOMContentLoaded est déjà passé
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    console.log("BetterGoogle: init called");
    removeAds();
    addTabs();
    addSearchButtons();
    setupFilterButton();
  }

  console.log("BetterGoogle: script loaded");
  function removeAds() {
    console.log("BetterGoogle: removing ads");
    const selectors = [
      "#tads",
      ".commercial-unit-mobile-top",
      "#bottomads",
      "[data-text-ad]",
    ];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    });
  }

  function addTabs() {
    console.log("BetterGoogle: adding tabs");
    // Conteneur de tabs Google
    const container = document.querySelector(".crJ18e");
    if (!container) {
      console.warn("BetterGoogle: tab container not found");
      return;
    }
    const query = getQuery();
    const qEnc = encodeURIComponent(query);
    const tabs = [
      { name: "Maps", url: `https://www.google.com/maps/search/${qEnc}` },
      {
        name: "Traduction",
        url: `https://translate.google.com/?sl=auto&tl=fr&text=${qEnc}`,
      },
      {
        name: "Wikipédia",
        url: `https://fr.wikipedia.org/wiki/${query.replace(/ /g, "_")}`,
      },
      {
        name: "Tendances",
        url: `https://trends.google.fr/trends/explore?q=${qEnc}`,
      },
    ];
    tabs.forEach(({ name, url }) => {
      const a = document.createElement("a");
      a.textContent = name;
      a.href = url;
      a.className = "hdtb-mitem";
      a.style.cursor = "pointer";
      container.append(a);
    });
  }

  function addSearchButtons() {
    // Conteneur principal des actions utilisateur
    const container = document.querySelector(".fM33ce.dRYYxd");
    if (!container) {
      console.warn("BetterGoogle: main action container not found");
      return;
    }
    // Boutons icônes pour 'J'ai de la chance' et 'ChatGPT'
    const btnLucky = document.createElement("button");
    btnLucky.type = "button";
    // Utiliser l'icône SVG pour le bouton "J'ai de la chance"
    const svgUrlLucky = chrome.runtime.getURL("lucky.svg");
    btnLucky.innerHTML = `<img src="${svgUrlLucky}" style="width:18px;height:18px;vertical-align:middle; padding:0 8px;" />`;
    btnLucky.title = "J'ai de la chance";
    btnLucky.onclick = onLucky;
    // style monochrome et transparent
    btnLucky.style.background = "transparent";
    btnLucky.style.border = "none";
    btnLucky.style.padding = "0";
    btnLucky.style.color = "inherit";
    btnLucky.style.cursor = "pointer";
    const btnChat = document.createElement("button");
    btnChat.type = "button";
    // Utiliser l'icône SVG pour ChatGPT
    const svgUrlChat = chrome.runtime.getURL("chatgpt.svg");
    btnChat.innerHTML = `<img src="${svgUrlChat}" style="width:18px;height:18px;vertical-align:middle;padding:0 8px;" />`;
    btnChat.title = "ChatGPT";
    btnChat.onclick = onChatGPT;
    btnChat.style.background = "transparent";
    btnChat.style.border = "none";
    btnChat.style.padding = "0";
    btnChat.style.color = "inherit";
    btnChat.style.cursor = "pointer";
    // Insérer à la fin
    container.append(btnLucky, btnChat);

    function onLucky() {
      const q = getQuery();
      window.location.href = `https://www.google.com/search?btnI=I&q=${encodeURIComponent(
        q
      )}`;
    }
    function onChatGPT() {
      const q = getQuery();
      chrome.storage.local.get(["defaultPrompt"], (res) => {
        const prompt = res.defaultPrompt || "";
        const p = encodeURIComponent((prompt + " " + q).trim());
        window.open(`https://chat.openai.com/?prompt=${p}`, "_blank");
      });
    }
  }

  function setupFilterButton() {
    const container = document.querySelector(".fM33ce.dRYYxd");
    if (!container) return;

    // Bouton Filtre en texte au début
    const btnFilter = createBtn("Filtre", toggleFilterUI);
    container.prepend(btnFilter);

    // UI de filtre (cachée)
    const ui = document.createElement("div");
    ui.className = "better-google-filter-ui";
    applyFilterUIStyle(ui);

    // Liste des outils de filtrage disponibles
    const tools = [
      {
        id: "site",
        label: "Site",
        description: "Limite la recherche à un site web spécifique",
        input: "text",
        placeholder: "exemple.com",
        prefix: "site:",
      },
      {
        id: "filetype",
        label: "Type de fichier",
        description: "Recherche par type de fichier",
        options: ["PDF", "DOC", "XLS", "PPT", "TXT"],
        prefix: "filetype:",
      },
      {
        id: "inurl",
        label: "Dans l'URL",
        description: "Recherche des termes dans l'URL",
        input: "text",
        placeholder: "terme",
        prefix: "inurl:",
      },
      {
        id: "intitle",
        label: "Dans le titre",
        description: "Recherche des termes dans le titre",
        input: "text",
        placeholder: "terme",
        prefix: "intitle:",
      },
      {
        id: "after",
        label: "Après date",
        description: "Résultats après une certaine date",
        input: "date",
        prefix: "after:",
      },
      {
        id: "before",
        label: "Avant date",
        description: "Résultats avant une certaine date",
        input: "date",
        prefix: "before:",
      },
    ];

    // Créer l'interface principale
    ui.innerHTML = `
      <div class="filter-tools">
        <h3 style="margin-top:0;color:#333;font-weight:500;font-size:14px;">Outils de filtrage</h3>
        <ul id="filter-tools-list" style="list-style:none;padding:0;margin:0;"></ul>
      </div>
      <div id="filter-tool-ui" style="margin-top:16px;display:none;">
        <h4 id="tool-title" style="margin-top:0;font-weight:500;font-size:14px;color:#1a73e8;"></h4>
        <p id="tool-description" style="font-size:12px;color:#555;margin:4px 0 8px;"></p>
        <div id="tool-input-area"></div>
        <button type="button" id="bg-filter-apply" style="width:100%;margin-top:12px;">Appliquer</button>
      </div>
    `;

    container.append(ui);

    // Style personnalisé pour le bouton Appliquer
    const applyButton = ui.querySelector("#bg-filter-apply");
    applyButton.style.backgroundColor = "#1a73e8";
    applyButton.style.color = "#fff";
    applyButton.style.border = "none";
    applyButton.style.padding = "8px";
    applyButton.style.borderRadius = "4px";
    applyButton.style.cursor = "pointer";
    applyButton.style.marginTop = "8px";

    // Remplir la liste des outils
    const toolsList = ui.querySelector("#filter-tools-list");
    tools.forEach((tool) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" style="display:block;padding:8px 4px;color:#1a73e8;text-decoration:none;">${tool.label}</a>`;
      li.dataset.toolId = tool.id;
      li.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        showToolUI(tool);
      });
      toolsList.appendChild(li);
    });

    // Fonction pour afficher l'interface d'un outil
    function showToolUI(tool) {
      const toolUI = ui.querySelector("#filter-tool-ui");
      toolUI.style.display = "block";
      ui.querySelector("#tool-title").textContent = tool.label;
      ui.querySelector("#tool-description").textContent = tool.description;

      const inputArea = ui.querySelector("#tool-input-area");
      inputArea.innerHTML = "";

      if (tool.options) {
        // Pour les outils avec des choix prédéfinis
        const select = document.createElement("select");
        select.id = "tool-value";
        select.style.width = "100%";
        select.style.boxSizing = "border-box"; // Inclure padding dans la largeur
        select.style.padding = "6px";
        select.style.margin = "4px 0";
        select.innerHTML = '<option value="">-- Sélectionner --</option>';
        tool.options.forEach((opt) => {
          select.innerHTML += `<option value="${opt.toLowerCase()}">${opt}</option>`;
        });
        inputArea.appendChild(select);
      } else if (tool.input === "date") {
        // Pour les filtres de date
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.id = "tool-value";
        dateInput.style.width = "100%";
        dateInput.style.padding = "6px";
        dateInput.style.margin = "4px 0";
        dateInput.style.boxSizing = "border-box"; // Inclure padding dans la largeur

        inputArea.appendChild(dateInput);
      } else {
        // Pour les filtres textuels
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.id = "tool-value";
        textInput.placeholder = tool.placeholder || "";
        textInput.style.width = "100%";
        textInput.style.padding = "6px";
        textInput.style.margin = "4px 0";
        textInput.style.boxSizing = "border-box"; // Inclure padding dans la largeur
        inputArea.appendChild(textInput);
      }

      // Stocker l'outil actif
      inputArea.dataset.activeTool = tool.id;
      inputArea.dataset.prefix = tool.prefix;
    }

    ui.querySelector("#bg-filter-apply").addEventListener("click", (e) => {
      e.preventDefault();
      const inputArea = ui.querySelector("#tool-input-area");
      const prefix = inputArea.dataset.prefix;
      const val = ui.querySelector("#tool-value").value;
      if (!prefix || !val) return;
      const q = getQuery();
      const newQ = `${q} ${prefix}${val}`.trim();
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        newQ
      )}`;
    });

    function toggleFilterUI() {
      ui.style.display = ui.style.display === "none" ? "block" : "none";
      // Réinitialiser l'affichage pour montrer la liste des outils
      if (ui.style.display === "block") {
        ui.querySelector("#filter-tool-ui").style.display = "none";
      }
    }
  }

  function applyFilterUIStyle(ui) {
    // Style pour le conteneur principal
    ui.style.position = "absolute";
    ui.style.top = "100%";
    ui.style.padding = "16px";
    ui.style.background = "#fff";
    ui.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    ui.style.display = "none";
    ui.style.zIndex = "1000";
    ui.style.borderRadius = "8px";
    ui.style.minWidth = "250px";
    ui.style.marginTop = "8px";

    // Styles pour la liste d'outils
    ui.addEventListener("mouseover", (e) => {
      if (e.target.tagName === "A") {
        e.target.style.backgroundColor = "rgba(26, 115, 232, 0.1)";
      }
    });

    ui.addEventListener("mouseout", (e) => {
      if (e.target.tagName === "A") {
        e.target.style.backgroundColor = "transparent";
      }
    });
  }

  function createBtn(text, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = text;
    btn.style.margin = "8px 0";
    btn.style.background = "transparent";
    btn.style.border = "solid 1px #ddd";
    btn.style.color = "#474747";
    btn.style.fontWeight = "500";
    btn.style.padding = "2px 12px";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";

    // Effet hover
    btn.onmouseover = () => {
      btn.style.backgroundColor = "rgba(26, 115, 232, 0.1)";
      btn.style.color = "#1a73e8";
      btn.style.borderColor = "transparent";
    };
    btn.onmouseout = () => {
      btn.style.color = "#474747";
      btn.style.borderColor = "#ddd";
      btn.style.backgroundColor = "transparent";
    };

    btn.onclick = onClick;
    return btn;
  }

  function getQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }
})();
