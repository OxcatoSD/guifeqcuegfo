window.addEventListener("load", () => {
  // ==========================================
  // 🥚 EASTER EGGS
  // ==========================================
  const probabilidadInicio = Math.floor(Math.random() * 1000) + 1;
  if (probabilidadInicio === 1) {
    const pantallaInicio = document.getElementById("pantalla-inicio");
    const tituloInicio = pantallaInicio.querySelector("h2");
    const textoInicio = pantallaInicio.querySelector("p");
    tituloInicio.textContent = "¿QUIÉN ERES?";
    tituloInicio.style.color = "#ff0000";
    tituloInicio.style.textShadow = "0 0 10px red, 0 0 20px darkred";
    pantallaInicio.style.backgroundImage = "url('img/background/IMG-20261019-WA0007.jpg')";
    pantallaInicio.style.backgroundSize = "cover";
    pantallaInicio.style.backgroundPosition = "center";
    pantallaInicio.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    textoInicio.textContent = "Escribe tu nombre si te atreves...";
    textoInicio.style.color = "#ff3333";
  }

  // ==========================================
  // 🎵 AUDIO DE BIENVENIDA
  // ==========================================
  const introAudio = new Audio("sound/bienvenida1.mp3");
  introAudio.preload = "auto";
  introAudio.volume = 0.8;

  // ==========================================
  // 🎧 AUDIO DE EQUIPAR/DESEQUIPAR OBJETO
  // ==========================================
  const equipSound = new Audio("sound/equip.mp3");
  equipSound.preload = "auto";
  equipSound.volume = 0.8;

  // ==========================================
  // 🔨 SONIDOS DEL MARTILLO AL GOLPEAR A MINIHUPI
  // ==========================================
  const martilloSonidosPool = [
    new Audio("sound/dialogos/medio_turbio/turbio1.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio2.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio3.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio4.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio5.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio6.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio7.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio8.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio9.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio10.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio11.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio12.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio13.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio14.m4a"),
    new Audio("sound/dialogos/medio_turbio/turbio15.m4a"),
  ];
  martilloSonidosPool.forEach((audio) => (audio.volume = 0.8));

  const probabilidadJuego = Math.floor(Math.random() * 1000) + 1;
  let easterEggJuegoActivo = false;
  let clicsEasterEgg = 0;
  const imgEasterNormal = "img/hupiframes/easteregg1.jpg";
  const imgEasterPresionada = "img/hupiframes/easteregg2.jpg";
  if (probabilidadJuego === 1) easterEggJuegoActivo = true;

  // === REFERENCIAS DEL DOM ===
  const scoreEl = document.getElementById("score");
  const hupibotsEl = document.getElementById("hupibots");
  const hupibotsContainer = document.getElementById("hupibots-container");

  const clickBtn = document.getElementById("clickBtn");
  const btnImage = document.getElementById("btnImage");
  const squeakSound = document.getElementById("dogToySound");
  const metalSound = document.getElementById("crakckedSound");
  const rockSound = document.getElementById("rockSound");
  const leaderboardList = document.getElementById("leaderboard-list");
  const fondoDiv = document.getElementById("fondo");
  const scoreLabel = document.querySelector(".score-label");
  const sideImage = document.getElementById("sideImage");
  const missionList = document.getElementById("mission-list");

  const btnToggleLeaderboard = document.getElementById("btnToggleLeaderboard");
  const leaderboardPanel = document.getElementById("leaderboardPanel");
  const btnToggleInventory = document.getElementById("btnToggleInventory");
  const inventoryPanel = document.getElementById("inventoryPanel");
  const invGrid = document.getElementById("inv-grid");

  const btnToggleCredits = document.getElementById("btnToggleCredits");
  const creditsPanel = document.getElementById("creditsPanel");

  const hammerImage = document.getElementById("hammerImage");
  const hammerHitSound = document.getElementById("hammerHitSound");
  const levelUpSound = document.getElementById("levelUpSound");

  // 🎭 DIARIO
  const diarioBouncing = document.getElementById("diarioBouncing");
  const imagenDiarioModal = document.getElementById("imagenDiarioModal");
  const btnCerrarDiario = document.getElementById("btnCerrarDiario");

  const bgMusic = new Audio();
  bgMusic.loop = true;
  bgMusic.volume = 0.5;

  // ==========================================
  // 🔊 CONFIGURACIÓN DE AUDIOS
  // ==========================================
  const dialogos = [
    "sound/dialogos/chillido1.m4a",
    "sound/dialogos/chillido2.m4a",
    "sound/dialogos/chillido3.m4a",
    "sound/dialogos/chillido4.m4a",
    "sound/dialogos/chillido5.m4a",
    "sound/dialogos/chillido6.m4a",
    "sound/dialogos/chillido7.m4a",
    "sound/dialogos/datointeresante1.m4a",
    "sound/dialogos/datointeresante2.m4a",
    "sound/dialogos/datointeresante3.m4a",
    "sound/dialogos/datointeresante4.m4a",
    "sound/dialogos/datointeresante5.m4a",
    "sound/dialogos/datointeresante6.m4a",
    "sound/dialogos/doom.mp3",
  ];
  const dialogosAudioPool = dialogos.map((src) => new Audio(src));
  dialogosAudioPool.forEach((audio) => (audio.volume = 0.8));

  const audiosReinicioPool = [
    new Audio("sound/dialogos/grito1.m4a"),
    new Audio("sound/dialogos/grito2.m4a"),
    new Audio("sound/dialogos/grito3.m4a"),
    new Audio("sound/dialogos/grito4.m4a"),
    new Audio("sound/dialogos/grito5.m4a"),
    new Audio("sound/dialogos/grito6.m4a"),
  ];
  audiosReinicioPool.forEach((audio) => (audio.volume = 1.0));

  const notificacionSound = new Audio("sound/notificacion1.mp3");
  notificacionSound.volume = 0.7;

  const elementosUI = [
    document.querySelector("h1"),
    document.querySelector(".score-container"),
    leaderboardPanel,
    document.querySelector("#mission-bar"),
  ];
  const glitchOverlay = document.getElementById("glitch-overlay");
  const tituloH1 = document.querySelector("h1");

  const pantallaInicio = document.getElementById("pantalla-inicio");
  const inputNombre = document.getElementById("input-nombre");
  const btnEmpezar = document.getElementById("btn-empezar");

  squeakSound.volume = 0.2;
  metalSound.volume = 0.5;
  rockSound.volume = 1.0;
  hammerHitSound.volume = 1.0;
  levelUpSound.volume = 1.0;

  function playThickMetalSound() {
    metalSound.currentTime = 0;
    metalSound.playbackRate = 0.7;
    metalSound.play().catch((e) => console.log("Audio bloqueado"));
  }

  function playEquipSound() {
    equipSound.currentTime = 0;
    equipSound.play().catch((e) => console.log("Audio de equipar no encontrado"));
  }

  function playRandomMartilloSound() {
    const audio = martilloSonidosPool[Math.floor(Math.random() * martilloSonidosPool.length)];
    audio.currentTime = 0;
    audio.play().catch((e) => console.log("Audio de martillo bloqueado o no encontrado"));
  }

  function playRandomDialog() {
    const audio = dialogosAudioPool[Math.floor(Math.random() * dialogosAudioPool.length)];
    audio.currentTime = 0;
    audio.play().catch((e) => console.log("Audio de diálogo bloqueado o no encontrado"));
  }

  function playRandomReinicioSound() {
    const audio = audiosReinicioPool[Math.floor(Math.random() * audiosReinicioPool.length)];
    audio.currentTime = 0;
    audio.play().catch((e) => console.log("Audio de reinicio bloqueado o no encontrado"));
  }

  function updateBackgroundMusic(nivel) {
    if (nivel >= 5) {
      const parte = nivel - 4;
      const musicPath = `sound/backsound/background_musicparte${parte}.mp3`;

      bgMusic.loop = nivel !== 8;

      if (!bgMusic.src.includes(musicPath)) {
        bgMusic.src = musicPath;
        bgMusic.play().catch((e) => console.log(`🎵 Música no encontrada o bloqueada: ${musicPath}`, e));
      }
    } else {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.loop = true;
    }
  }

  function triggerGlitch() {
    glitchOverlay.classList.add("active");
    fondoDiv.classList.add("bg-roto");
    tituloH1.classList.add("glitch-text");
    elementosUI.forEach((el) => {
      el.style.transition = "none";
      el.style.transform = `translate(${(Math.random() - 0.5) * 300}px, ${(Math.random() - 0.5) * 300}px) rotate(${(Math.random() - 0.5) * 45}deg)`;
    });
    setTimeout(() => {
      glitchOverlay.classList.remove("active");
      tituloH1.classList.remove("glitch-text");
      elementosUI.forEach((el) => {
        el.style.transition = "none";
        el.style.transform = "";
      });
    }, 800);
  }

  let historialTiempos = [];
  let bloqueadoPorAutoclicker = false;
  function esAutoclicker() {
    const ahora = performance.now();
    historialTiempos.push(ahora);
    if (historialTiempos.length > 10) historialTiempos.shift();
    if (historialTiempos.length === 10) {
      let difs = [];
      for (let i = 1; i < historialTiempos.length; i++)
        difs.push(historialTiempos[i] - historialTiempos[i - 1]);
      if (Math.max(...difs) - Math.min(...difs) < 3) return true;
    }
    return false;
  }

  const state = { clicks: 0 };
  let playerName = "Anónimo";
  let juegoIniciado = false;
  let temporizadorInactividad;
  let ultimoClicTiempo = Date.now();
  let clicsRapidos = 0;
  let temporizadorEstadoMini;
  let rockTotal = 0, studyTotal = 0, clicsRapidosTotales = 0;

  let hupibotsCount = parseInt(localStorage.getItem("lux_hupibots")) || 0;
  let unlockedLevel = 0;
  let isLocked = false;
  let inventoryItems = [];
  let targetClicks = 250;
  let levelStartClicks = 0;
  let clickPower = 1;

  let hammerActive = false;
  let hammerCharge = 0;
  let hammerFallTimer;
  let isSwinging = false;

  let nextPrestigeThreshold = 8000;
  let isAskingPrestige = false;

  // 🎭 VARIABLES DEL DIARIO
  let diarioTarget = Math.floor(Math.random() * 401) + 200; // Entre 200 y 600
  let diarioMostrado = false;
  let diarioAnimacionId = null;
  let diarioX = 0;
  let diarioY = 0;
  let diarioVx = 3;
  let diarioVy = 3;

  const imagenesMini = {
    idle: "img/minihupibot/idle.png",
    relaxing: "img/minihupibot/relaxing.png",
    study: "img/minihupibot/study.png",
    rock: "img/minihupibot/rock.png",
    jumping: "img/minihupibot/jumping.png",
    delado: "img/minihupibot/delado.png",
  };
  Object.values(imagenesMini).forEach((ruta) => {
    const img = new Image();
    img.src = ruta;
  });

  btnToggleLeaderboard.addEventListener("click", () => {
    leaderboardPanel.classList.toggle("show");
    if (window.innerWidth <= 600) inventoryPanel.classList.remove("show");
  });

  btnToggleInventory.addEventListener("click", () => {
    if (hammerActive) return;
    inventoryPanel.classList.toggle("show");
    if (window.innerWidth <= 600) leaderboardPanel.classList.remove("show");
  });

  btnToggleCredits.addEventListener("click", () => {
    creditsPanel.classList.toggle("show");
  });

  function renderInventory() {
    invGrid.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const slot = document.createElement("div");
      slot.className = "inv-slot";

      if (inventoryItems[i]) {
        slot.classList.add("has-item");
        if (inventoryItems[i].equipped) slot.classList.add("equipped");
        slot.innerHTML = `<img src="${inventoryItems[i].img}" alt="${inventoryItems[i].name}">`;
        slot.title = inventoryItems[i].name;
        slot.addEventListener("click", () => useItem(i));
      }
      invGrid.appendChild(slot);
    }
  }

  function useItem(index) {
    let item = inventoryItems[index];
    if (!item) return;

    if (item.type === "hammer") {
      if (isLocked) {
        isLocked = false;
        unlockedLevel = 5;
        targetClicks = state.clicks + 100;
        levelStartClicks = state.clicks;

        inventoryItems.forEach((invItem) => (invItem.equipped = false));
        item.equipped = true;
        hammerActive = true;
        hammerImage.style.display = "block";
        hammerImage.style.transition = "none";
        hammerImage.style.transform = `translate(0px, 0px) rotate(15deg)`;
        clickPower = 1;
        inventoryPanel.classList.remove("show");

        levelUpSound.currentTime = 0;
        levelUpSound.play().catch((e) => {});
        triggerGlitch();
        updateBackgroundMusic(5);
      } else {
        if (item.equipped) {
          item.equipped = false;
          hammerActive = false;
          hammerImage.style.display = "none";
          clearTimeout(hammerFallTimer);
          hammerCharge = 0;
          hammerImage.style.transform = `translate(0px, 0px) rotate(15deg)`;
          clickPower = 1;
        } else {
          inventoryItems.forEach((invItem) => (invItem.equipped = false));
          item.equipped = true;
          hammerActive = true;
          hammerImage.style.display = "block";
          hammerImage.style.transition = "none";
          hammerImage.style.transform = `translate(0px, 0px) rotate(15deg)`;
          clickPower = 1;
          inventoryPanel.classList.remove("show");
        }
        playEquipSound();
      }
      renderInventory();
      actualizarUI();
      actualizarMisiones();
      btnImage.src = niveles[Math.min(unlockedLevel, 11)].normal;
      return;
    }

    if (item.type === "glove" || item.type === "flyswatter") {
      if (item.equipped) {
        item.equipped = false;
        clickPower = 1;
      } else {
        inventoryItems.forEach((invItem) => (invItem.equipped = false));
        item.equipped = true;
        clickPower = item.type === "glove" ? 2 : 5;

        hammerActive = false;
        hammerImage.style.display = "none";
        clearTimeout(hammerFallTimer);
        hammerCharge = 0;
        hammerImage.style.transform = `translate(0px, 0px) rotate(15deg)`;
      }
      playEquipSound();
    }

    renderInventory();
    actualizarUI();
    actualizarMisiones();
    btnImage.src = niveles[Math.min(unlockedLevel, 11)].normal;
  }

  let misiones = [
    { id: "m_fast10", texto: "Da 10 clics rápidos", meta: 10, actual: 0, completada: false, nivelRequerido: 0, requiereHupi: false },
    { id: "m_rock1", texto: "Haz rockear a Hupi", meta: 1, actual: 0, completada: false, nivelRequerido: 0, requiereHupi: true },
    { id: "m_study1", texto: "Haz estudiar a Hupi", meta: 1, actual: 0, completada: false, nivelRequerido: 2, requiereHupi: true },
    { id: "m_fast50", texto: "Da 50 clics rápidos", meta: 50, actual: 0, completada: false, nivelRequerido: 2, requiereHupi: false },
    { id: "m_rock3", texto: "Haz rockear a Hupi 3 veces", meta: 3, actual: 0, completada: false, nivelRequerido: 3, requiereHupi: true },
    { id: "m_study3", texto: "Haz estudiar a Hupi 3 veces", meta: 3, actual: 0, completada: false, nivelRequerido: 5, requiereHupi: true },
    { id: "m_fast150", texto: "Da 150 clics rápidos", meta: 150, actual: 0, completada: false, nivelRequerido: 5, requiereHupi: false },
    { id: "m_rock6", texto: "Haz rockear a Hupi 6 veces", meta: 6, actual: 0, completada: false, nivelRequerido: 6, requiereHupi: true },
    { id: "m_study5", texto: "Haz estudiar a Hupi 5 veces", meta: 5, actual: 0, completada: false, nivelRequerido: 8, requiereHupi: true },
    { id: "m_fast300", texto: "Da 300 clics rápidos", meta: 300, actual: 0, completada: false, nivelRequerido: 8, requiereHupi: false },
    { id: "m_rock10", texto: "Haz rockear a Hupi 10 veces", meta: 10, actual: 0, completada: false, nivelRequerido: 9, requiereHupi: true },
    { id: "m_max", texto: "Alcanza el Nivel Máximo", meta: 2000, actual: 0, completada: false, nivelRequerido: 11, requiereHupi: false },
  ];

  function renderMisiones() {
    missionList.innerHTML = "";
    let nivelActualIndex = unlockedLevel;
    let sigNivelIndex = nivelActualIndex + 1;
    let misionPrincipalHtml = "";

    if (isLocked) {
      misionPrincipalHtml = `
        <div class="mission-item" style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
            <div class="mission-header" style="color: #ff0000;"><span>Nivel Bloqueado</span></div>
            <div style="font-size: 0.55rem; margin-top: 5px; color: #ffcc00;">Usa el objeto en la Mochila 🎒 para continuar.</div>
        </div>`;
    } else if (sigNivelIndex < 12) {
      let faltantes = targetClicks - state.clicks;
      let progresoActual = state.clicks - levelStartClicks;
      let totalNecesario = targetClicks - levelStartClicks;

      if (progresoActual < 0) progresoActual = 0;
      if (totalNecesario <= 0) totalNecesario = 1;

      let porcentaje = (progresoActual / totalNecesario) * 100;
      if (faltantes < 0) faltantes = 0;
      if (porcentaje > 100) porcentaje = 100;
      if (porcentaje < 0) porcentaje = 0;

      let nombreMision = state.clicks >= 1000 ? "Que sienta tu amor" : `Nivel ${sigNivelIndex + 1}`;

      misionPrincipalHtml = `
        <div class="mission-item" style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
            <div class="mission-header"><span>${nombreMision}</span><span>Faltan ${faltantes}</span></div>
            <div class="mission-bar-bg"><div class="mission-bar-fill" style="width: ${porcentaje}%; background: #ffcc00;"></div></div>
        </div>`;
    } else {
      misionPrincipalHtml = `<div class="mission-item" style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;"><div class="mission-header" style="color: #ffcc00;"><span>Nivel Máximo Alcanzado</span></div></div>`;
    }

    let secundariasActivas = misiones
      .filter((m) => {
        let hupiVisible = !m.requiereHupi || state.clicks >= 29;
        return !m.completada && m.nivelRequerido <= nivelActualIndex && hupiVisible;
      })
      .slice(0, 2);

    let htmlSecundarias = secundariasActivas
      .map((m) => {
        let faltantes = m.meta - m.actual;
        let porcentaje = Math.min((m.actual / m.meta) * 100, 100);
        return `<div class="mission-item"><div class="mission-header"><span>${m.texto}</span><span>${faltantes === 1 ? "Falta 1" : "Faltan " + faltantes}</span></div><div class="mission-bar-bg"><div class="mission-bar-fill" style="width: ${porcentaje}%"></div></div></div>`;
      })
      .join("");

    missionList.innerHTML = misionPrincipalHtml + htmlSecundarias;
  }

  function actualizarMisiones() {
    misiones.forEach((m) => {
      if (m.id.includes("rock")) m.actual = rockTotal;
      if (m.id.includes("study")) m.actual = studyTotal;
      if (m.id.includes("fast")) m.actual = clicsRapidosTotales;
      if (m.id === "m_max") m.actual = state.clicks;
      if (!m.completada && m.actual >= m.meta) m.completada = true;
    });
    renderMisiones();
  }

  function cambiarEstadoMiniHupi(estado, duracion = 0) {
    if (sideImage.src.includes(estado)) return;
    sideImage.src = imagenesMini[estado];

    sideImage.classList.remove("estado-relaxing", "estado-jumping");
    if (estado === "relaxing") sideImage.classList.add("estado-relaxing");
    else if (estado === "jumping") sideImage.classList.add("estado-jumping");

    clearTimeout(temporizadorEstadoMini);
    if (duracion > 0) temporizadorEstadoMini = setTimeout(() => cambiarEstadoMiniHupi("idle"), duracion);
  }

  function showItemNotification() {
    notificacionSound.currentTime = 0;
    notificacionSound.play().catch((e) => console.log("Audio de notificación no encontrado"));
    cambiarEstadoMiniHupi("jumping", 2000);
  }

  function resetearInactividad() {
    clearTimeout(temporizadorInactividad);
    temporizadorInactividad = setTimeout(() => {
      if (juegoIniciado) cambiarEstadoMiniHupi("relaxing");
    }, 120000);
  }

  sideImage.addEventListener("click", (e) => {
    e.preventDefault();
    if (!juegoIniciado) return;

    if (hammerActive) {
      cambiarEstadoMiniHupi("delado", 6000);
      playRandomMartilloSound();
    } else {
      cambiarEstadoMiniHupi("rock", 6000);
      rockSound.currentTime = 0;
      rockSound.play().catch((err) => {});
      rockTotal++;
      actualizarMisiones();
    }
    resetearInactividad();
  });

  // 🎭 FUNCIONES DEL DIARIO
  function resetearDiario() {
    diarioTarget = Math.floor(Math.random() * 401) + 200;
    diarioMostrado = false;
    detenerDiarioBouncing();
    imagenDiarioModal.style.display = "none";
  }

  function iniciarDiarioBouncing() {
    diarioBouncing.style.display = "block";
    diarioX = Math.random() * (window.innerWidth - 100);
    diarioY = Math.random() * (window.innerHeight - 100);
    diarioVx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
    diarioVy = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
    animarDiario();
  }

  function detenerDiarioBouncing() {
    diarioBouncing.style.display = "none";
    if (diarioAnimacionId) {
      cancelAnimationFrame(diarioAnimacionId);
      diarioAnimacionId = null;
    }
  }

  function animarDiario() {
    if (diarioBouncing.style.display === "none") return;
    
    const rect = diarioBouncing.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    diarioX += diarioVx;
    diarioY += diarioVy;

    if (diarioX <= 0 || diarioX >= maxX) {
      diarioVx *= -1;
      diarioX = Math.max(0, Math.min(diarioX, maxX));
    }
    if (diarioY <= 0 || diarioY >= maxY) {
      diarioVy *= -1;
      diarioY = Math.max(0, Math.min(diarioY, maxY));
    }

    diarioBouncing.style.left = diarioX + "px";
    diarioBouncing.style.top = diarioY + "px";

    diarioAnimacionId = requestAnimationFrame(animarDiario);
  }

  function checkDiario() {
    if (!diarioMostrado && juegoIniciado) {
      if (state.clicks >= diarioTarget || state.clicks >= 666) {
        diarioMostrado = true;
        iniciarDiarioBouncing();
      }
    }
  }

  diarioBouncing.addEventListener("click", () => {
    detenerDiarioBouncing();
    imagenDiarioModal.style.display = "flex";
  });

  btnCerrarDiario.addEventListener("click", () => {
    imagenDiarioModal.style.display = "none";
  });

  function cargarTablaLocal() {
    if (!leaderboardList) return;
    try {
      let records = JSON.parse(localStorage.getItem("lux_records")) || [];
      records = records.filter((r) => r && r.nombre && !isNaN(r.puntos));
      records.sort((a, b) => Number(b.puntos) - Number(a.puntos));
      records = records.slice(0, 5);
      leaderboardList.innerHTML = "";
      if (records.length === 0) {
        leaderboardList.innerHTML = "<li>Sin récords</li>";
        return;
      }
      records.forEach((record) => {
        const li = document.createElement("li");
        li.textContent = `${record.nombre.includes("Cheat") ? "🛠️ " + record.nombre.replace(" (Cheat)", "") : record.nombre}: ${record.puntos}`;
        leaderboardList.appendChild(li);
      });
    } catch (e) {
      localStorage.removeItem("lux_records");
    }
  }

  function procesarSesionAnterior() {
    try {
      let sesionGuardada = sessionStorage.getItem("lux_sesion_actual");
      if (sesionGuardada) {
        let datos = JSON.parse(sesionGuardada);
        if (datos && datos.puntos > 5) {
          let records = JSON.parse(localStorage.getItem("lux_records")) || [];
          records.push({ nombre: String(datos.nombre), puntos: Number(datos.puntos) });
          records.sort((a, b) => Number(b.puntos) - Number(a.puntos));
          localStorage.setItem("lux_records", JSON.stringify(records.slice(0, 5)));
        }
        sessionStorage.removeItem("lux_sesion_actual");
      }
      cargarTablaLocal();
    } catch (e) {}
  }
  procesarSesionAnterior();

  btnEmpezar.addEventListener("click", () => {
    if (probabilidadInicio !== 1) {
      try {
        introAudio.currentTime = 0;
        introAudio.play().catch((err) => console.warn("🎵 Audio de bienvenida bloqueado:", err.name, err.message));
      } catch (err) {
        console.warn("🎵 Error al reproducir bienvenida:", err);
      }
    }

    playerName = inputNombre.value.trim() === "" ? "Anónimo" : inputNombre.value.trim().substring(0, 12);
    pantallaInicio.style.display = "none";
    juegoIniciado = true;

    state.clicks = 0;
    unlockedLevel = 0;
    isLocked = false;
    inventoryItems = [];
    targetClicks = 250;
    levelStartClicks = 0;
    clickPower = 1;
    hammerActive = false;
    isSwinging = false;
    nextPrestigeThreshold = 8000;
    isAskingPrestige = false;

    bgMusic.pause();
    bgMusic.currentTime = 0;

    resetearDiario(); // 🎭 Reiniciar diario

    renderInventory();
    actualizarUI();
    resetearInactividad();
    renderMisiones();
    btnImage.src = niveles[0].normal;
    sideImage.style.display = "none";
  });

  function abrirMenuTrampas() {
    if (!juegoIniciado) return;
    let codigo = prompt("MODO DESARROLLADOR\n\nEscribe:\n- Un número (ej. 500)\n- 'max' (2100 clics)\n- 'reset' (Volver a 0)");
    if (codigo === null) return;
    codigo = codigo.toLowerCase().trim();

    if (codigo === "max") {
      state.clicks = 2100;
      unlockedLevel = 11;
      targetClicks = 2200;
      levelStartClicks = 2100;
      isLocked = false;
      inventoryItems = [];
      hammerActive = false;
      hammerImage.style.display = "none";
      clickPower = 1;
      updateBackgroundMusic(11);
      resetearDiario();
    } else if (codigo === "reset") {
      state.clicks = 0;
      unlockedLevel = 0;
      isLocked = false;
      inventoryItems = [];
      targetClicks = 250;
      levelStartClicks = 0;
      clickPower = 1;
      rockTotal = 0;
      studyTotal = 0;
      clicsRapidosTotales = 0;
      nextPrestigeThreshold = 8000;
      isAskingPrestige = false;
      hammerActive = false;
      hammerImage.style.display = "none";
      bgMusic.pause();
      bgMusic.currentTime = 0;
      resetearDiario();

      misiones.forEach((m) => {
        m.completada = false;
        m.actual = 0;
      });
      renderInventory();
    } else if (!isNaN(codigo) && codigo !== "") {
      let target = parseInt(codigo);

      inventoryItems = [];
      hammerActive = false;
      hammerImage.style.display = "none";
      isLocked = false;
      clickPower = 1;
      state.clicks = target;
      resetearDiario();

      if (state.clicks < 250) {
        unlockedLevel = 0; levelStartClicks = 0; targetClicks = 250;
      } else if (state.clicks < 500) {
        unlockedLevel = 1; levelStartClicks = 250; targetClicks = 500;
        inventoryItems.push({ name: "Guante de lana", type: "glove", img: "img/guante.png", equipped: false });
      } else if (state.clicks < 750) {
        unlockedLevel = 2; levelStartClicks = 500; targetClicks = 750;
        inventoryItems.push({ name: "Guante de lana", type: "glove", img: "img/guante.png", equipped: false });
      } else if (state.clicks < 1000) {
        unlockedLevel = 3; levelStartClicks = 750; targetClicks = 1000;
        inventoryItems.push({ name: "Guante de lana", type: "glove", img: "img/guante.png", equipped: false });
        inventoryItems.push({ name: "Matamoscas", type: "flyswatter", img: "img/matamoscas.png", equipped: false });
      } else if (state.clicks < 1250) {
        unlockedLevel = 4; levelStartClicks = 1000; targetClicks = 1250;
        inventoryItems.push({ name: "Guante de lana", type: "glove", img: "img/guante.png", equipped: false });
        inventoryItems.push({ name: "Matamoscas", type: "flyswatter", img: "img/matamoscas.png", equipped: false });
      } else {
        unlockedLevel = 5 + Math.floor((state.clicks - 1250) / 100);
        if (unlockedLevel > 11) unlockedLevel = 11;
        levelStartClicks = 1250 + (unlockedLevel - 5) * 100;
        targetClicks = 1250 + (unlockedLevel - 4) * 100;
        if (targetClicks <= state.clicks) targetClicks = state.clicks + 100;

        inventoryItems.push({ name: "Guante de lana", type: "glove", img: "img/guante.png", equipped: false });
        inventoryItems.push({ name: "Matamoscas", type: "flyswatter", img: "img/matamoscas.png", equipped: false });
        inventoryItems.push({ name: "Martillo", type: "hammer", img: "img/martillo.png", equipped: false });
      }

      updateBackgroundMusic(unlockedLevel);
      renderInventory();
    } else {
      alert("Código no válido.");
      return;
    }

    playThickMetalSound();
    triggerGlitch();
    actualizarUI();
    actualizarMisiones();
    btnImage.src = niveles[Math.min(unlockedLevel, 11)].normal;
  }

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      abrirMenuTrampas();
    }
    if (e.key.toLowerCase() === "b" || e.key.toLowerCase() === "i") {
      if (!hammerActive) inventoryPanel.classList.toggle("show");
    }
  });

  let pressTimer;
  const tiempoPresionado = 3000;

  tituloH1.addEventListener("pointerdown", (e) => {
    if (!juegoIniciado) return;
    tituloH1.style.color = "#ff3333";
    pressTimer = setTimeout(() => {
      abrirMenuTrampas();
      tituloH1.style.color = "#ffffff";
    }, tiempoPresionado);
  });

  const cancelarPresion = () => {
    clearTimeout(pressTimer);
    tituloH1.style.color = "#ffffff";
  };

  tituloH1.addEventListener("pointerup", cancelarPresion);
  tituloH1.addEventListener("pointerleave", cancelarPresion);

  const niveles = [
    { limite: 0, normal: "img/hupiframes/hupi frames 1.png", presionada: "img/hupiframes/hupi frames 2.png" },
    { limite: 250, normal: "img/hupiframes/hupi frames 3.png", presionada: "img/hupiframes/hupi frames 4.png" },
    { limite: 500, normal: "img/hupiframes/hupi frames 5.png", presionada: "img/hupiframes/hupi frames 6.png" },
    { limite: 750, normal: "img/hupiframes/hupi frames 7.png", presionada: "img/hupiframes/hupi frames 8.png" },
    { limite: 1000, normal: "img/hupiframes/hupi frames 9.png", presionada: "img/hupiframes/hupi frames 10.png" },
    { limite: 1250, normal: "img/hupiframes/hupi frames 11.png", presionada: "img/hupiframes/hupi frames 12.png" },
    { limite: 1350, normal: "img/hupiframes/hupi frames 13.png", presionada: "img/hupiframes/hupi frames 14.png" },
    { limite: 1450, normal: "img/hupiframes/hupi frames 15.png", presionada: "img/hupiframes/hupi frames 16.png" },
    { limite: 1550, normal: "img/hupiframes/hupi frames 17.png", presionada: "img/hupiframes/hupi frames 18.png" },
    { limite: 1650, normal: "img/hupiframes/hupi frames 19.png", presionada: "img/hupiframes/hupi frames 20.png" },
    { limite: 1750, normal: "img/hupiframes/hupi frames 21.png", presionada: "img/hupiframes/hupi frames 22.png" },
    { limite: 1850, normal: "img/hupiframes/hupi frames 23.png", presionada: "img/hupiframes/hupi frames 24.png" },
  ];

  const fondos = [
    { limite: 0, ruta: "img/background/IMG-20261019-WA0003.jpg" },
    { limite: 250, ruta: "img/background/IMG-20261019-WA0004.jpg" },
    { limite: 500, ruta: "img/background/IMG-20261019-WA0005.jpg" },
    { limite: 750, ruta: "img/background/IMG-20261019-WA0006.jpg" },
    { limite: 1000, ruta: "img/background/IMG-20261019-WA0007.jpg" },
  ];

  function actualizarUI() {
    scoreEl.textContent = Math.floor(state.clicks);
    hupibotsEl.textContent = hupibotsCount;

    if (hupibotsCount > 0) hupibotsContainer.style.display = "block";
    else hupibotsContainer.style.display = "none";

    let nivelVisualIndex = unlockedLevel;
    if (nivelVisualIndex > 11) nivelVisualIndex = 11;
    let nivelActual = niveles[nivelVisualIndex];

    if (easterEggJuegoActivo) {
      tituloH1.textContent = "no quiero amar";
      tituloH1.style.color = "#ff0000";
      tituloH1.style.textShadow = "0 0 10px red, 0 0 20px darkred";
      fondoDiv.style.filter = "sepia(1) hue-rotate(-50deg) saturate(2) brightness(0.5)";
    } else {
      if (state.clicks >= 1000) tituloH1.textContent = "Que sienta tu amor";
      else tituloH1.textContent = "Acaricia a Hupibot";

      clickBtn.className = "click-btn";

      if (hammerActive) {
        clickBtn.classList.add("square-btn");
        fondoDiv.style.backgroundImage = "none";
        fondoDiv.style.backgroundColor = "#000000";
      } else {
        if (nivelVisualIndex >= 1) clickBtn.classList.add("stage-300");
        if (nivelVisualIndex >= 2) clickBtn.classList.add("stage-700");
        if (nivelVisualIndex >= 3) clickBtn.classList.add("stage-1100");
        if (nivelVisualIndex >= 4) clickBtn.classList.add("stage-1500");

        let fondoIndex = Math.min(nivelVisualIndex, fondos.length - 1);
        let fondoActual = fondos[fondoIndex];

        if (fondoDiv.style.backgroundImage !== `url("${fondoActual.ruta}")`) {
          fondoDiv.style.backgroundImage = `url('${fondoActual.ruta}')`;
        }
        fondoDiv.style.backgroundColor = "transparent";
      }
    }

    if (state.clicks >= 29) {
      if (sideImage.style.display === "none" || sideImage.style.display === "") sideImage.style.display = "block";
    } else {
      sideImage.style.display = "none";
    }

    if (hammerActive) {
      btnToggleInventory.textContent = "🔒";
      btnToggleInventory.style.opacity = "0.5";
      btnToggleInventory.style.cursor = "not-allowed";
    } else {
      btnToggleInventory.textContent = "🎒";
      btnToggleInventory.style.opacity = "1";
      btnToggleInventory.style.cursor = "pointer";
    }
  }

  function mostrarFlotante(x, y, texto = "+1", color = "#00ffff") {
    const div = document.createElement("div");
    div.className = "floating-text";
    div.textContent = texto;
    div.style.color = color;
    div.style.textShadow = `2px 2px 0 #000`;
    div.style.left = x + "px";
    div.style.top = y + "px";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 800);
  }

  function checkPrestige() {
    if (hammerActive && state.clicks >= nextPrestigeThreshold && !isAskingPrestige) {
      isAskingPrestige = true;

      setTimeout(() => {
        if (confirm(`¡Has alcanzado los ${nextPrestigeThreshold} clics!\n\n¿Quieres reemplazar a la Hupibot descompuesta?`)) {
          playRandomReinicioSound();

          hupibotsCount++;
          localStorage.setItem("lux_hupibots", hupibotsCount);

          state.clicks = 0;
          unlockedLevel = 0;
          targetClicks = 250;
          levelStartClicks = 0;
          nextPrestigeThreshold = 8000;

          inventoryItems = [];
          hammerActive = false;
          clickPower = 1;
          hammerImage.style.display = "none";
          clearTimeout(hammerFallTimer);
          hammerCharge = 0;

          resetearDiario();

          renderInventory();
          playThickMetalSound();
          triggerGlitch();
          actualizarUI();
          actualizarMisiones();
          btnImage.src = niveles[0].normal;
          updateBackgroundMusic(0);
        }
        isAskingPrestige = false;
      }, 100);
    }
  }

  function dropHammer() {
    if (isSwinging) return;
    isSwinging = true;
    clearTimeout(hammerFallTimer);

    hammerImage.style.transition = "transform 0.15s cubic-bezier(0.6, -0.28, 0.735, 0.045)";
    hammerImage.style.transform = `translate(-100px, 80px) rotate(-70deg)`;

    setTimeout(() => {
      let ganancia = hammerCharge * clickPower;
      state.clicks += ganancia;
      checkDiario();

      hammerHitSound.currentTime = 0;
      hammerHitSound.play().catch((e) => {});

      triggerGlitch();
      mostrarFlotante(window.innerWidth / 2, window.innerHeight / 2, `+${ganancia}`, "#ffcc00");

      hammerCharge = 0;

      hammerImage.style.transition = "transform 0.3s ease-out";
      hammerImage.style.transform = `translate(0px, 0px) rotate(15deg)`;

      checkLevelUp(true);
      actualizarUI();
      actualizarMisiones();

      btnImage.src = niveles[Math.min(unlockedLevel, 11)].normal;

      checkPrestige();

      setTimeout(() => {
        isSwinging = false;
      }, 300);
    }, 150);
  }

  function checkLevelUp(isHammer = false) {
    let leveledUp = false;

    while (unlockedLevel < 11 && state.clicks >= targetClicks && !isLocked) {
      let nextLevel = unlockedLevel + 1;

      if (nextLevel === 1) {
        unlockedLevel = 1;
        inventoryItems.push({ name: "Guante de lana", type: "glove", img: "img/guante.png", equipped: false });
        renderInventory();
        showItemNotification();
      } else if (nextLevel === 3) {
        unlockedLevel = 3;
        inventoryItems.push({ name: "Matamoscas", type: "flyswatter", img: "img/matamoscas.png", equipped: false });
        renderInventory();
        showItemNotification();
      } else if (nextLevel === 5) {
        isLocked = true;
        inventoryItems.push({ name: "Martillo", type: "hammer", img: "img/martillo.png", equipped: false });
        renderInventory();
        showItemNotification();
        break;
      } else {
        unlockedLevel = nextLevel;
      }

      leveledUp = true;
      let increment = unlockedLevel < 5 ? 250 : 100;
      targetClicks = state.clicks + increment;
      levelStartClicks = state.clicks;

      updateBackgroundMusic(unlockedLevel);
    }

    if (leveledUp) {
      if (isHammer) {
        levelUpSound.currentTime = 0;
        levelUpSound.play().catch((e) => {});
      } else {
        playThickMetalSound();
      }
      triggerGlitch();
    }
  }

  clickBtn.addEventListener("pointerdown", (e) => {
    if (!juegoIniciado) return;
    e.preventDefault();

    if (isSwinging) return;

    if (easterEggJuegoActivo) {
      clicsEasterEgg++;
      if (clicsEasterEgg >= 6) {
        window.open("", "_self", "");
        window.close();
        setTimeout(() => {
          document.body.innerHTML = "<h1 style='color:white; font-family:sans-serif; text-align:center; margin-top:20%;'>El vacío te ha consumido.</h1>";
        }, 100);
        return;
      }
    }

    if (esAutoclicker()) {
      if (!bloqueadoPorAutoclicker) {
        bloqueadoPorAutoclicker = true;
        if (state.clicks >= 50) {
          state.clicks -= 50;
          mostrarFlotante(e.clientX, e.clientY, "-50", "#ff0000");
        } else {
          state.clicks = 0;
          mostrarFlotante(e.clientX, e.clientY, "¡BOT!", "#ff0000");
        }
        playThickMetalSound();
        triggerGlitch();
        actualizarUI();
        actualizarMisiones();
        setTimeout(() => {
          bloqueadoPorAutoclicker = false;
        }, 2000);
      }
      return;
    }

    if (hammerActive) {
      hammerCharge++;

      let pull = Math.min(hammerCharge, 50);
      let angle = 15 + pull * 1.5;
      let offsetX = pull * 0.5;
      let offsetY = -pull * 0.5;

      hammerImage.style.transition = "transform 0.1s ease-out";
      hammerImage.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${angle}deg)`;

      clearTimeout(hammerFallTimer);
      if (hammerCharge >= 50) {
        dropHammer();
      } else {
        hammerFallTimer = setTimeout(dropHammer, 2500);
      }
      return;
    }

    mostrarFlotante(e.clientX, e.clientY, "+" + clickPower, "#00ffff");
    resetearInactividad();

    let ahora = Date.now();
    let esRapido = ahora - ultimoClicTiempo < 300;
    if (esRapido) {
      clicsRapidos++;
      clicsRapidosTotales++;
    } else {
      clicsRapidos = 1;
    }
    ultimoClicTiempo = ahora;

    if (clicsRapidos >= 10) {
      cambiarEstadoMiniHupi("study", 4000);
      studyTotal++;
      clicsRapidos = 0;
    } else if (
      !sideImage.src.includes("study") &&
      !sideImage.src.includes("rock") &&
      !sideImage.src.includes("delado") &&
      !sideImage.src.includes("jumping")
    ) {
      cambiarEstadoMiniHupi("idle");
    }

    let nextThreshold = targetClicks;
    if (state.clicks + clickPower >= nextThreshold && !isLocked && unlockedLevel < 11) {
      state.clicks = nextThreshold;
    } else {
      state.clicks += clickPower;
    }

    checkLevelUp(false);
    checkDiario();

    let nivelVisualIndex = unlockedLevel;
    if (nivelVisualIndex > 11) nivelVisualIndex = 11;
    let nivelVisualActual = niveles[nivelVisualIndex];

    squeakSound.currentTime = 0;
    squeakSound.play().catch((e) => console.log("Audio de juguete bloqueado"));

    if (unlockedLevel < 5) {
      if (Math.floor(Math.random() * 40) === 0) {
        playRandomDialog();
      }
    }

    if (easterEggJuegoActivo) btnImage.src = imgEasterPresionada;
    else btnImage.src = nivelVisualActual.presionada;

    try {
      sessionStorage.setItem("lux_sesion_actual", JSON.stringify({ nombre: playerName, puntos: state.clicks }));
    } catch (e) {}

    actualizarUI();
    actualizarMisiones();

    checkPrestige();
  });

  clickBtn.addEventListener("pointerup", () => {
    if (!juegoIniciado) return;
    let nivelVisualIndex = unlockedLevel;
    if (nivelVisualIndex > 11) nivelVisualIndex = 11;
    let nivelVisualActual = niveles[nivelVisualIndex];

    if (easterEggJuegoActivo) btnImage.src = imgEasterNormal;
    else btnImage.src = nivelVisualActual.normal;
  });

  clickBtn.addEventListener("pointerleave", () => {
    if (!juegoIniciado) return;
    let nivelVisualIndex = unlockedLevel;
    if (nivelVisualIndex > 11) nivelVisualIndex = 11;
    let nivelVisualActual = niveles[nivelVisualIndex];

    if (easterEggJuegoActivo) btnImage.src = imgEasterNormal;
    else btnImage.src = nivelVisualActual.normal;
  });

  actualizarUI();
});