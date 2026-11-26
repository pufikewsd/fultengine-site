(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CATEGORY_META = {
    roles: { label: "Роли и отряды" },
    scp: { label: "SCP" },
    facility: { label: "Комплекс" },
    gameplay: { label: "Механики" },
    ui: { label: "Интерфейс" },
    admin: { label: "Сервер и админ" }
  };

  const PRO_MODULES = new Set([
    "Subclass", "RoleDistribution", "Scp106Capture", "BetterSCP", "WarheadCode",
    "BetterCassie", "Turrets", "CameraWatch", "InjurySystem", "Cpc", "AntiRaid", "MemoryWatch"
  ]);

  const MODULES = [
    { name: "Subclass", cat: "roles", desc: "Выдаёт подклассы ролей: состав, предметы, имена учёных и описание персонажа.", cmds: ["137 подклассов"] },
    { name: "RoleDistribution", cat: "roles", desc: "Раздаёт роли в начале раунда по квотам, вызывает Повстанцев Хаоса и Длань Змея.", cmds: ["пх", "дх"] },
    { name: "MtfSquads", cat: "roles", desc: "Вызывает отряды МОГ, включая Ню-7 «Удар молота» до 9 бойцов.", cmds: [] },
    { name: "Ro9Call", cat: "roles", desc: "Вызывает отряд Ро-9 по клавише с перезарядкой.", cmds: [] },
    { name: "CirCodes", cat: "roles", desc: "Принимает и обрабатывает заявки на вызов отряда по КИР.", cmds: ["cra list", "cra y", "cra n"] },

    { name: "Scp008", cat: "scp", desc: "Заражает SCP-008 и назначает нулевого пациента.", cmds: ["infected"] },
    { name: "Scp020", cat: "scp", desc: "Выдаёт роль SCP-020 выбранному игроку.", cmds: ["scp020"] },
    { name: "Scp066", cat: "scp", desc: "Добавляет играбельного SCP-066 с ловушками.", cmds: [] },
    { name: "Scp096Doors", cat: "scp", desc: "Открывает двери камеры SCP-096 как при нарушении условий содержания.", cmds: [] },
    { name: "Scp10035", cat: "scp", desc: "Выдаёт роль SCP-10035.", cmds: ["scp10035"] },
    { name: "Scp106Capture", cat: "scp", desc: "Замораживает жертву SCP-106, уносит в карманное измерение и возвращает в случайную комнату.", cmds: [] },
    { name: "Scp1100", cat: "scp", desc: "Выдаёт роль SCP-1100-RU выбранному игроку.", cmds: ["scp1100"] },
    { name: "Scp131", cat: "scp", desc: "Даёт двум особям SCP-131 удерживать SCP-173 взглядом.", cmds: ["scp131 give"] },
    { name: "ScpAbilities", cat: "scp", desc: "Вешает дополнительные способности SCP на отдельные клавиши.", cmds: [] },
    { name: "ScpItems", cat: "scp", desc: "Добавляет SCP-предметы: распылитель против SCP-008 и SCP-005.", cmds: [] },
    { name: "ScpProximityChat", cat: "scp", desc: "Включает голосовой чат SCP с игроками рядом.", cmds: [] },
    { name: "ScpTweaks", cat: "scp", desc: "Настраивает урон по SCP, возврат SCP-106 по протоколу и ворота SCP-173 на ключ-карты.", cmds: [] },
    { name: "BetterSCP", cat: "scp", desc: "Дорабатывает механики SCP-049, SCP-079 и SCP-018.", cmds: ["pocket", "stalk"] },
    { name: "CageContainment", cat: "scp", desc: "Запирает SCP в клетке-схематике.", cmds: [] },
    { name: "EscapeSCP", cat: "scp", desc: "Держит SCP 15 минут в начале раунда за запертой дверью камеры.", cmds: ["escp"] },
    { name: "DonorScp079", cat: "scp", desc: "Выдаёт SCP-079 донатерам.", cmds: ["aic"] },
    { name: "Scramble", cat: "scp", desc: "Закрывает в ПНВ голову SCP-096 цензурной кляксой и защищает от агра.", cmds: [] },

    { name: "Protocol", cat: "facility", desc: "Запускает протоколы комплекса с подтверждением.", cmds: ["protocol", "protocolapprove"] },
    { name: "ProtocolPanel", cat: "facility", desc: "Ставит физическую панель протоколов на карте.", cmds: [] },
    { name: "WarheadCode", cat: "facility", desc: "Управляет пультом диспетчерской и запуском протоколов.", cmds: ["warhead", "cirs", "protocols", "ro9"] },
    { name: "WarheadBlast", cat: "facility", desc: "Проигрывает музыку весь 120-секундный отсчёт боеголовки.", cmds: [] },
    { name: "PanelBlock", cat: "facility", desc: "Ставит кодовую панель блокировки на схематике.", cmds: [] },
    { name: "Lockdown", cat: "facility", desc: "Принимает запросы и блокирует КПП и двери.", cmds: [] },
    { name: "DispatchHack", cat: "facility", desc: "Даёт взломать диспетчерскую и починить её силами ИТС, СБ или МОГ.", cmds: ["disphack"] },
    { name: "IntercomBreach", cat: "facility", desc: "Взламывает интерком ключ-картой, открывает двери и вызывает отряд Хаоса.", cmds: [] },
    { name: "KillZone", cat: "facility", desc: "Запускает протокол 106-N и зачищает всех внутри схематики вместе с SCP-106.", cmds: [] },
    { name: "HackDoor", cat: "facility", desc: "Позволяет взламывать двери, включая выход в Наземную зону.", cmds: [] },
    { name: "DoorController", cat: "facility", desc: "Открывает Д-блок в начале раунда с заданной задержкой.", cmds: [] },
    { name: "CassieCodes", cat: "facility", desc: "Объявляет коды «Красный» и «Зелёный» через CASSIE.", cmds: [] },
    { name: "BetterCassie", cat: "facility", desc: "Озвучивает CASSIE на английском и выводит русский субтитр по пресетам.", cmds: ["cas"] },
    { name: "Turrets", cat: "facility", desc: "Ставит и управляет турелями ТЗС.", cmds: ["turret", "ps3", "ps4"] },
    { name: "Camera", cat: "facility", desc: "Включает режим камер у пульта наблюдения.", cmds: ["exit_cam"] },
    { name: "CameraWatch", cat: "facility", desc: "Даёт смотреть в камеры и блокировать их.", cmds: ["cam look", "cam block", "cam off"] },

    { name: "InjurySystem", cat: "gameplay", desc: "Считает ранения по частям тела: кровотечение, переломы и влияние обвесов.", cmds: [] },
    { name: "Armory", cat: "gameplay", desc: "Задаёт аптечки с разной силой лечения.", cmds: [] },
    { name: "AllyActions", cat: "gameplay", desc: "Позволяет лечить союзника аптечкой по клавише.", cmds: [] },
    { name: "FunctionMenu", cat: "gameplay", desc: "Открывает меню действий: осмотреть инвентарь, арестовать, схватить и отпустить.", cmds: [] },
    { name: "CorpseCarry", cat: "gameplay", desc: "Позволяет переносить тела по комплексу.", cmds: [] },
    { name: "RagdollSearch", cat: "gameplay", desc: "Даёт обыскивать тела и забирать предметы.", cmds: ["inventory", "intake"] },
    { name: "BackGun", cat: "gameplay", desc: "Отображает убранное оружие за спиной игрока.", cmds: ["bgset"] },
    { name: "BarrierTape", cat: "gameplay", desc: "Натягивает заградительную ленту на проходах.", cmds: [] },
    { name: "BulletPhysics", cat: "gameplay", desc: "Пули передают импульс и толкают физические объекты.", cmds: [] },
    { name: "BetterGraned", cat: "gameplay", desc: "Меняет поведение и физику гранат.", cmds: [] },
    { name: "NightVision", cat: "gameplay", desc: "Выдаёт приборы ночного видения.", cmds: [] },
    { name: "RadioWave", cat: "gameplay", desc: "Переключает каналы рации и передаёт голос по радио.", cmds: [] },
    { name: "Cpc", cat: "gameplay", desc: "Выдаёт КПК игрока с мессенджером и аккаунтами.", cmds: ["cpc help"] },
    { name: "CustomSound", cat: "gameplay", desc: "Проигрывает звуки при подборе ключ-карты, брони или фонарика.", cmds: [] },
    { name: "EscapeCommand", cat: "gameplay", desc: "Засчитывает побег SCP или человека по команде.", cmds: ["escape"] },

    { name: "Hud", cat: "ui", desc: "Рисует HUD игрока с названием роли и подсказками.", cmds: [] },
    { name: "Theme", cat: "ui", desc: "Задаёт тему из Theme.yml и красит тексты через цветовые токены.", cmds: ["Theme.yml"] },
    { name: "SpectatorEffects", cat: "ui", desc: "Скрывает выбранные визуальные эффекты от зрителей.", cmds: [] },
    { name: "WelcomeMessage", cat: "ui", desc: "Показывает приветствие при входе на сервер.", cmds: [] },

    { name: "AdminToggle", cat: "admin", desc: "Переключает админские режимы прямо в раунде.", cmds: ["breakdoor", "dspl", "instakill", "size"] },
    { name: "AntiRaid", cat: "admin", desc: "Защищает сервер от рейда и блокирует вход при тревоге.", cmds: ["antiraid", "lockdown", "restore"] },
    { name: "AudioDebug", cat: "admin", desc: "Проверяет работу звуковой подсистемы сервера.", cmds: [] },
    { name: "MemoryWatch", cat: "admin", desc: "Замеряет память сервера, ассеты, объекты и сборку мусора.", cmds: ["fmem", "fmem top", "fmem gc"] },
    { name: "ServerPerf", cat: "admin", desc: "Убирает роли-сироты и следит за утечками памяти.", cmds: [] },
    { name: "TeleportGuard", cat: "admin", desc: "Возвращает игроков, провалившихся под карту.", cmds: [] },
    { name: "Protections", cat: "admin", desc: "Защищает в безопасных зонах от боеголовки и тесла-ворот, бережёт двери от стрельбы.", cmds: [] },
    { name: "AutoMapLoader", cat: "admin", desc: "Подгружает схематики карты, пока сервер ждёт игроков.", cmds: [] }
  ].map((m) => ({
    ...m,
    price: PRO_MODULES.has(m.name) ? 790 : m.cat === "ui" ? 290 : 490
  }));

  const BUNDLES = {
    bundle_full: { id: "bundle_full", name: "FULT-ENGINE v2.0 (все 65 модулей + WebPanel)", price: 4990, desc: "Полный набор" },
    bundle_scp: { id: "bundle_scp", name: "Набор SCP-объектов (17 модулей)", price: 2490, desc: "Категория SCP" },
    bundle_rp: { id: "bundle_rp", name: "Набор RP, ролей и механик (20 модулей)", price: 2790, desc: "Роли + Механики" }
  };

  function esc(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatRub(val) {
    return `${new Intl.NumberFormat("ru-RU").format(val)} ₽`;
  }

  const toastEl = document.getElementById("toast");
  let toastTimer = 0;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.classList.remove("is-shown"); }, 2200);
  }

  // ======================================================
  // SOUND ENGINE (Real Internet Whip Crack + Web Audio SFX)
  // ======================================================
  let soundOn = true;
  let audioCtx = null;
  const whipSrcEl = document.getElementById("whipAudio");
  const whipPool = Array.from({ length: 4 }, () => {
    const a = new Audio();
    a.preload = "auto";
    a.src = whipSrcEl?.currentSrc || "assets/whip-crack.mp3";
    return a;
  });
  let whipPoolIdx = 0;

  function ensureAudioCtx() {
    if (!soundOn) return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function playWhipCrackSound() {
    if (!soundOn) return;
    const player = whipPool[whipPoolIdx % whipPool.length];
    whipPoolIdx++;
    try {
      player.currentTime = 0;
      player.playbackRate = 0.94 + Math.random() * 0.14;
      player.volume = 0.9;
      const p = player.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => playSynthWhipBackup());
      }
    } catch {
      playSynthWhipBackup();
    }
  }

  function playSynthWhipBackup() {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Whoosh + sharp crack noise burst
    const bufSize = Math.floor(ctx.sampleRate * 0.16);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      const env = i < bufSize * 0.15 ? i / (bufSize * 0.15) : Math.pow(1 - (i - bufSize * 0.15) / (bufSize * 0.85), 3);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1900, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    noise.connect(bp).connect(gain).connect(ctx.destination);
    noise.start(now);
  }

  function playEggChime(isGold = false) {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = isGold ? [587.33, 783.99, 987.77, 1174.66] : [659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);
      gain.gain.setValueAtTime(0.001, now + idx * 0.055);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.055 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.24);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.25);
    });
  }

  function playMascotBoing() {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Header scroll & nav indicator
  const scrollProgress = document.getElementById("scrollProgress");
  let scrollRaf = 0;
  function updateScrollUi() {
    scrollRaf = 0;
    const y = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (scrollProgress) scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, y / maxScroll))})`;
  }
  window.addEventListener("scroll", () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScrollUi);
  }, { passive: true });
  updateScrollUi();

  const siteNav = document.getElementById("siteNav");
  const navIndicator = document.getElementById("navIndicator");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a[data-section]"));
  const sections = navLinks.map((a) => document.getElementById(a.dataset.section)).filter(Boolean);

  function moveNavIndicator(link) {
    if (!link || !navIndicator || !siteNav) return;
    const navRect = siteNav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.width === 0) return;
    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.transform = `translate3d(${linkRect.left - navRect.left}px, 0, 0)`;
    navIndicator.classList.add("is-visible");
  }

  let currentSectionId = "";
  function syncActiveNav() {
    const marker = window.scrollY + 180;
    let activeId = "";
    for (const sec of sections) {
      if (sec.offsetTop <= marker) activeId = sec.id;
    }
    if (activeId === currentSectionId) return;
    currentSectionId = activeId;
    navLinks.forEach((a) => a.classList.toggle("is-current", a.dataset.section === activeId));
    const activeLink = navLinks.find((a) => a.dataset.section === activeId);
    if (activeLink) moveNavIndicator(activeLink);
    else navIndicator?.classList.remove("is-visible");
  }
  window.addEventListener("scroll", syncActiveNav, { passive: true });
  window.addEventListener("resize", () => {
    const activeLink = navLinks.find((a) => a.classList.contains("is-current"));
    if (activeLink) moveNavIndicator(activeLink);
  });
  syncActiveNav();

  // Fill KIES Horizontal Coil + Star Strips
  function fillKiesStrip(el) {
    if (!el) return;
    const starSvg = `<svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M14 2l3.5 7.4 8.1 1.1-5.9 5.6 1.5 8.1L14 20.2l-7.2 4 1.5-8.1-5.9-5.6 8.1-1.1L14 2Z" fill="#DA3832"/></svg>`;
    const coilSvg = `<svg width="64" height="22" viewBox="0 0 70 24" fill="none"><path d="M3 16c6-12 18-12 20 0 1 6-6 6-7 0-2-12 14-12 18 0 1 6-6 6-7 0-2-12 14-12 18 0 1 6-6 6-7 0-2-12 16-12 22 0" stroke="#1C529E" stroke-width="3.8" stroke-linecap="round"/></svg>`;
    el.innerHTML = Array.from({ length: 12 }, (_, i) => (i % 2 === 0 ? starSvg : coilSvg)).join("");
  }
  fillKiesStrip(document.getElementById("heroStrip"));
  fillKiesStrip(document.getElementById("footerStrip"));

  // Hero Worm Mascot bounce + sound
  const wormBtn = document.getElementById("wormMascotBtn");
  if (wormBtn) {
    wormBtn.addEventListener("click", () => {
      playMascotBoing();
      wormBtn.classList.remove("is-popping");
      void wormBtn.offsetWidth;
      wormBtn.classList.add("is-popping");
      showToast("Привет от червяка FULT-ENGINE!");
    });
  }

  // Interactive WebPanel preview tabs
  const wpBody = document.getElementById("wpBody");
  const wpTabs = document.querySelectorAll(".wp-tab");
  const WP_VIEWS = {
    staff: `
      <div class="wp-table">
        <div class="wp-row wp-row-head"><span>Сотрудник</span><span>Должность</span><span>Статус</span></div>
        <div class="wp-row"><span class="wp-user">K. Volkov <em>76561198042</em></span><span>Старший админ</span><span class="wp-stat">В сети</span></div>
        <div class="wp-row"><span class="wp-user">M. Orlov <em>76561198119</em></span><span>Модератор RP</span><span class="wp-stat">В сети</span></div>
        <div class="wp-row"><span class="wp-user">D. Sokolov <em>76561198207</em></span><span>Куратор SCP</span><span class="wp-stat wp-stat-muted">Офлайн</span></div>
        <div class="wp-row"><span class="wp-user">A. Klimov <em>76561198355</em></span><span>Стажёр</span><span class="wp-stat wp-stat-muted">Офлайн</span></div>
      </div>`,
    warns: `
      <div class="wp-table">
        <div class="wp-row wp-row-head"><span>Игрок / админ</span><span>Причина</span><span>Срок</span></div>
        <div class="wp-row"><span class="wp-user">A. Klimov <em>Варн 1/3</em></span><span>Нарушение регламента КПП</span><span class="wp-stat">Активен</span></div>
        <div class="wp-row"><span class="wp-user">R. Petrov <em>Варн 2/3</em></span><span>Игнорирование заявки КИР</span><span class="wp-stat">Активен</span></div>
        <div class="wp-row"><span class="wp-user">N. Gusev <em>Варн 1/3</em></span><span>Неверный тег подкласса</span><span class="wp-stat wp-stat-muted">Снят</span></div>
        <div class="wp-row"><span class="wp-user">S. Belov <em>Варн 1/3</em></span><span>Превышение полномочий RA</span><span class="wp-stat wp-stat-muted">Снят</span></div>
      </div>`,
    sync: `
      <div class="wp-table">
        <div class="wp-row wp-row-head"><span>Узел</span><span>Последний обмен</span><span>Статус</span></div>
        <div class="wp-row"><span class="wp-user">Site-02 Main <em>EU-Central</em></span><span>14 сек. назад (65 модулей)</span><span class="wp-stat">Синхр.</span></div>
        <div class="wp-row"><span class="wp-user">Site-19 Hard RP <em>RU-MSK</em></span><span>28 сек. назад (65 модулей)</span><span class="wp-stat">Синхр.</span></div>
        <div class="wp-row"><span class="wp-user">Event Sandbox <em>RU-SPB</em></span><span>2 мин. назад (42 модуля)</span><span class="wp-stat">Синхр.</span></div>
        <div class="wp-row"><span class="wp-user">Backup Configs <em>SQLite</em></span><span>Автосохранение каждые 5 мин</span><span class="wp-stat wp-stat-muted">Ок</span></div>
      </div>`
  };
  wpTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.wp;
      if (!wpBody || !WP_VIEWS[key]) return;
      wpTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      wpBody.innerHTML = WP_VIEWS[key];
    });
  });

  // ======================================================
  // 1. МЕСТО ОТДЫХА: RED DRAGON + ANIMATED WHIP + DRAGON EGGS
  // ======================================================
  const blobsStage = document.getElementById("bubbles");
  const blobsCanvas = document.getElementById("blobsCanvas");
  const redDragonImg = document.getElementById("redDragonAsset");
  const wormBadgeImg = document.getElementById("wormBadgeAsset");

  const strikeWhipBtn = document.getElementById("strikeWhipBtn");
  const modeWhipBtn = document.getElementById("modeWhipBtn");
  const scatterBlobsBtn = document.getElementById("scatterBlobsBtn");
  const paletteBlobsBtn = document.getElementById("paletteBlobsBtn");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const redeemEggsBtn = document.getElementById("redeemEggsBtn");
  const eggCountHud = document.getElementById("eggCountHud");
  const headerEggCount = document.getElementById("headerEggCount");
  const whipHitsHud = document.getElementById("whipHitsHud");

  let dragonEggsEarned = 0;
  let whipHitsCount = 0;
  let dragonDiscountUnlocked = false;

  try {
    dragonEggsEarned = Math.max(0, Number(localStorage.getItem("fult_dragon_eggs_v1")) || 0);
    whipHitsCount = Math.max(0, Number(localStorage.getItem("fult_whip_hits_v1")) || 0);
    dragonDiscountUnlocked = localStorage.getItem("fult_dragon_disc_v1") === "1";
  } catch {}

  function saveDragonState() {
    try {
      localStorage.setItem("fult_dragon_eggs_v1", String(dragonEggsEarned));
      localStorage.setItem("fult_whip_hits_v1", String(whipHitsCount));
      localStorage.setItem("fult_dragon_disc_v1", dragonDiscountUnlocked ? "1" : "0");
    } catch {}
  }

  function syncDragonHud() {
    if (eggCountHud) eggCountHud.textContent = String(dragonEggsEarned);
    if (headerEggCount) headerEggCount.textContent = String(dragonEggsEarned);
    if (whipHitsHud) whipHitsHud.textContent = String(whipHitsCount);
    if (redeemEggsBtn) {
      redeemEggsBtn.classList.toggle("is-unlocked", dragonDiscountUnlocked);
      redeemEggsBtn.textContent = dragonDiscountUnlocked
        ? "Скидка -10% активна!"
        : `15 яиц = скидка 10%`;
    }
  }
  syncDragonHud();

  const BG_MODES = ["blue", "aqua", "gold"];
  const BG_NAMES = { blue: "Фон: Кобальт", aqua: "Фон: Аква", gold: "Фон: Жёлтый" };
  let bgMode = "blue";
  let whipMode = true;

  let blobs = [];
  let spawnedEggs = [];
  let whipStrikes = [];
  let floatPopups = [];
  let shockwaves = [];

  let cw = 1200;
  let ch = 640;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let draggedBlob = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let lastPtrX = 0;
  let lastPtrY = 0;
  let pointer = { x: 900, y: 420, vx: 0, vy: 0, active: false };
  let stageVisible = true;
  let lastCollisionEggTime = 0;

  if ("IntersectionObserver" in window && blobsStage) {
    new IntersectionObserver((entries) => {
      stageVisible = entries[0]?.isIntersecting ?? true;
    }).observe(blobsStage);
  }

  function resizeBlobsCanvas() {
    if (!blobsCanvas || !blobsStage) return;
    const rect = blobsStage.getBoundingClientRect();
    cw = Math.max(320, rect.width);
    ch = Math.max(480, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    blobsCanvas.width = Math.round(cw * dpr);
    blobsCanvas.height = Math.round(ch * dpr);
  }

  function createBlobs() {
    resizeBlobsCanvas();
    const scale = cw < 640 ? 0.62 : 1;
    const midY = cw < 640 ? 0.62 : 0.56;
    const specs = [
      // Index 0: THE RED DRAGON MEDALLION BOSS!
      { rx: 0.52, ry: midY, r: 92 * scale, kind: "dragon", fill: "#DA3832" },
      { rx: 0.22, ry: 0.62, r: 58 * scale, kind: "worm", fill: "#F2B743" },
      { rx: 0.80, ry: 0.34, r: 48 * scale, kind: "star", fill: "#F2B743" },
      { rx: 0.84, ry: 0.72, r: 44 * scale, kind: "blob", fill: "#8AD2D2" },
      { rx: 0.34, ry: 0.38, r: 42 * scale, kind: "star", fill: "#DA3832" },
      { rx: 0.68, ry: 0.76, r: 36 * scale, kind: "diamond", fill: "#F9F3E2" },
      { rx: 0.14, ry: 0.38, r: 34 * scale, kind: "blob", fill: "#E87B25" }
    ];

    blobs = specs.map((sp, i) => ({
      x: cw * sp.rx,
      y: ch * sp.ry,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      baseR: sp.r / scale,
      r: sp.r,
      kind: sp.kind,
      fill: sp.fill,
      rot: 0,
      vrot: sp.kind === "dragon" ? 0.003 : (Math.random() - 0.5) * 0.012,
      seed: i * 1.7,
      hitFlash: 0
    }));

    // Spawn 2 starter Dragon Eggs so the player immediately sees them!
    spawnedEggs = [];
    spawnDragonEgg(cw * 0.66, ch * 0.46, false);
    spawnDragonEgg(cw * 0.40, ch * 0.68, false);
  }

  function spawnDragonEgg(x, y, forceGold = false) {
    if (spawnedEggs.length >= 18) spawnedEggs.shift();
    const isGold = forceGold || Math.random() < 0.18;
    const angle = -Math.PI * 0.15 - Math.random() * Math.PI * 0.7;
    const spd = 4.5 + Math.random() * 6.5;
    spawnedEggs.push({
      x,
      y,
      vx: Math.cos(angle) * spd + (Math.random() - 0.5) * 4,
      vy: Math.sin(angle) * spd,
      r: isGold ? 24 : 20,
      rot: (Math.random() - 0.5) * 0.5,
      vrot: (Math.random() - 0.5) * 0.06,
      isGold,
      value: isGold ? 5 : 1,
      pulse: Math.random() * Math.PI * 2
    });
  }

  function collectEgg(idx) {
    const egg = spawnedEggs[idx];
    if (!egg) return;
    spawnedEggs.splice(idx, 1);
    dragonEggsEarned += egg.value;
    saveDragonState();
    syncDragonHud();
    if (typeof renderCart === "function") renderCart();
    playEggChime(egg.isGold);
    floatPopups.push({
      x: egg.x,
      y: egg.y - 10,
      text: egg.isGold ? `+${egg.value} ЗОЛОТОЕ ЯЙЦО!` : `+${egg.value} яйцо`,
      color: egg.isGold ? "#F2B743" : "#F9F3E2",
      life: 1
    });
    shockwaves.push({ x: egg.x, y: egg.y, r: 8, maxR: 48, color: egg.isGold ? "#F2B743" : "#8AD2D2", life: 1 });
  }

  function triggerWhipStrike(targetX, targetY) {
    playWhipCrackSound();

    // Whip handle anchor from bottom-right (or offset from target so lash always looks dramatic!)
    const startX = Math.min(cw - 36, Math.max(targetX + 180, cw * 0.82));
    const startY = ch - 26;
    whipStrikes.push({
      sx: startX,
      sy: startY,
      tx: targetX,
      ty: targetY,
      progress: 0
    });

    shockwaves.push({ x: targetX, y: targetY, r: 10, maxR: 78, color: "#F2B743", life: 1 });

    // Check if the whip hit near the Red Dragon medallion (or any token)
    const dragon = blobs.find((b) => b.kind === "dragon");
    if (dragon) {
      const dist = Math.hypot(dragon.x - targetX, dragon.y - targetY);
      if (dist <= dragon.r + 64) {
        whipHitsCount += 1;
        dragon.hitFlash = 1;
        const pushAngle = Math.atan2(dragon.y - startY, dragon.x - startX);
        dragon.vx += Math.cos(pushAngle) * 11 + (Math.random() - 0.5) * 6;
        dragon.vy += Math.sin(pushAngle) * 9 - 3;
        dragon.vrot = (Math.random() > 0.5 ? 1 : -1) * 0.16;

        // Knock out 1 to 3 Dragon Eggs!
        const count = whipHitsCount % 5 === 0 ? 3 : 1 + (Math.random() < 0.4 ? 1 : 0);
        for (let i = 0; i < count; i++) {
          spawnDragonEgg(dragon.x, dragon.y, whipHitsCount % 7 === 0 && i === 0);
        }
        // Also award 1 direct egg for whipping Red Dragon so every hit feels instant & rewarding!
        dragonEggsEarned += 1;
        saveDragonState();
        syncDragonHud();
        floatPopups.push({
          x: dragon.x,
          y: dragon.y - dragon.r * 0.7,
          text: count > 1 ? `ХРЯСЬ! +1 и выбито ${count} яйца!` : `ХРЯСЬ! +1 яйцо дракона!`,
          color: "#F2B743",
          life: 1
        });
      } else {
        // Whip shockwave pushes nearby shapes too
        for (const b of blobs) {
          const d = Math.hypot(b.x - targetX, b.y - targetY) || 1;
          if (d < 170) {
            b.vx += ((b.x - targetX) / d) * 9;
            b.vy += ((b.y - targetY) / d) * 9;
          }
        }
      }
    }
  }

  function drawDragonEgg(ctx, egg, t) {
    ctx.save();
    ctx.translate(egg.x, egg.y);
    ctx.rotate(egg.rot + Math.sin(t * 3 + egg.pulse) * 0.08);
    const rx = egg.r * 0.82;
    const ry = egg.r * 1.06;

    // Flat vector egg silhouette
    ctx.beginPath();
    ctx.moveTo(0, -ry);
    ctx.bezierCurveTo(rx * 0.95, -ry, rx * 1.12, ry * 0.15, rx * 0.88, ry * 0.72);
    ctx.bezierCurveTo(rx * 0.58, ry * 1.05, -rx * 0.58, ry * 1.05, -rx * 0.88, ry * 0.72);
    ctx.bezierCurveTo(-rx * 1.12, ry * 0.15, -rx * 0.95, -ry, 0, -ry);
    ctx.closePath();

    ctx.fillStyle = egg.isGold ? "#F2B743" : "#F9F3E2";
    ctx.fill();

    // Dragon scale spots
    ctx.fillStyle = egg.isGold ? "#DA3832" : "#DA3832";
    ctx.beginPath();
    ctx.arc(-rx * 0.28, -ry * 0.15, egg.r * 0.18, 0, Math.PI * 2);
    ctx.arc(rx * 0.3, ry * 0.22, egg.r * 0.22, 0, Math.PI * 2);
    ctx.arc(-rx * 0.1, ry * 0.48, egg.r * 0.14, 0, Math.PI * 2);
    ctx.fill();

    if (egg.isGold) {
      ctx.fillStyle = "#F9F3E2";
      ctx.beginPath();
      ctx.arc(rx * 0.22, -ry * 0.35, egg.r * 0.13, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawToken(ctx, b, t) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rot);

    if (b.kind === "dragon") {
      const scale = 1 + b.hitFlash * 0.14;
      ctx.scale(scale, scale);
      if (b.hitFlash > 0.05) {
        ctx.beginPath();
        ctx.arc(0, 0, b.r + 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 183, 67, ${b.hitFlash * 0.65})`;
        ctx.fill();
      }
      if (redDragonImg && redDragonImg.complete && redDragonImg.naturalWidth > 0) {
        ctx.drawImage(redDragonImg, -b.r, -b.r, b.r * 2, b.r * 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "#DA3832";
        ctx.fill();
      }
    } else if (b.kind === "worm") {
      if (wormBadgeImg && wormBadgeImg.complete && wormBadgeImg.naturalWidth > 0) {
        ctx.drawImage(wormBadgeImg, -b.r, -b.r * 0.96, b.r * 2, b.r * 1.92);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "#F2B743";
        ctx.fill();
      }
    } else if (b.kind === "star") {
      const spikes = 5;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const rad = i % 2 === 0 ? b.r : b.r * 0.52;
        const a = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = b.fill;
      ctx.fill();
    } else if (b.kind === "diamond") {
      const s = b.r * 1.25;
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = b.fill;
      ctx.beginPath();
      ctx.roundRect(-s * 0.5, -s * 0.5, s, s, 8);
      ctx.fill();
    } else {
      const steps = 14;
      const pts = [];
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const wob = Math.sin(a * 2 + t * 0.8 + b.seed) * 0.08;
        pts.push({ x: Math.cos(a) * b.r * (1 + wob), y: Math.sin(a) * b.r * (1 + wob) });
      }
      ctx.beginPath();
      ctx.moveTo((pts[steps - 1].x + pts[0].x) * 0.5, (pts[steps - 1].y + pts[0].y) * 0.5);
      for (let i = 0; i < steps; i++) {
        const curr = pts[i];
        const next = pts[(i + 1) % steps];
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) * 0.5, (curr.y + next.y) * 0.5);
      }
      ctx.closePath();
      ctx.fillStyle = b.fill;
      ctx.fill();
    }
    ctx.restore();
  }

  function drawIdleWhipCursor(ctx, t) {
    if (!whipMode || !pointer.active || whipStrikes.length > 0) return;
    // Draw coiled KIES whip handle near cursor so the user feels the whip in hand!
    const hx = pointer.x + 26;
    const hy = pointer.y + 28;
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(-0.65);
    // Braided leather/red whip handle
    ctx.fillStyle = "#DA3832";
    ctx.beginPath();
    ctx.roundRect(-6, -22, 12, 36, 5);
    ctx.fill();
    ctx.fillStyle = "#F2B743";
    ctx.beginPath();
    ctx.arc(0, 16, 7, 0, Math.PI * 2);
    ctx.fill();
    // Trailing whip lash ribbon
    ctx.beginPath();
    ctx.moveTo(0, -22);
    const sway = Math.sin(t * 5) * 10;
    ctx.bezierCurveTo(18 + sway, -44, -14 + sway, -62, 10, -82);
    ctx.strokeStyle = "#F9F3E2";
    ctx.lineWidth = 4.5;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawWhipStrikes(ctx) {
    for (let i = whipStrikes.length - 1; i >= 0; i--) {
      const w = whipStrikes[i];
      w.progress += 0.085;
      if (w.progress >= 1) {
        whipStrikes.splice(i, 1);
        continue;
      }

      const p = w.progress;
      const reach = Math.min(1, p * 1.65);
      const ex = w.sx + (w.tx - w.sx) * reach;
      const ey = w.sy + (w.ty - w.sy) * reach;
      const waveAmp = (1 - p * 0.72) * 95;
      const nx = -(w.ty - w.sy);
      const ny = w.tx - w.sx;
      const nLen = Math.hypot(nx, ny) || 1;
      const ux = nx / nLen;
      const uy = ny / nLen;

      const sWave = Math.cos(p * Math.PI * 1.6);
      const c1x = w.sx + (ex - w.sx) * 0.34 + ux * waveAmp * sWave;
      const c1y = w.sy + (ey - w.sy) * 0.34 + uy * waveAmp * sWave;
      const c2x = w.sx + (ex - w.sx) * 0.70 - ux * waveAmp * 0.85 * sWave;
      const c2y = w.sy + (ey - w.sy) * 0.70 - uy * waveAmp * 0.85 * sWave;

      ctx.save();
      ctx.globalAlpha = 1 - Math.max(0, (p - 0.65) / 0.35);

      // Handle at start
      const hAngle = Math.atan2(w.ty - w.sy, w.tx - w.sx);
      ctx.save();
      ctx.translate(w.sx, w.sy);
      ctx.rotate(hAngle);
      ctx.fillStyle = "#DA3832";
      ctx.beginPath();
      ctx.roundRect(-18, -7, 38, 14, 6);
      ctx.fill();
      ctx.fillStyle = "#F2B743";
      ctx.beginPath();
      ctx.arc(-18, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Outer crimson lash stroke + inner cream cord
      ctx.beginPath();
      ctx.moveTo(w.sx, w.sy);
      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
      ctx.strokeStyle = "#E87B25";
      ctx.lineWidth = 9 * (1 - p * 0.35);
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w.sx, w.sy);
      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
      ctx.strokeStyle = "#F9F3E2";
      ctx.lineWidth = 4.5 * (1 - p * 0.35);
      ctx.lineCap = "round";
      ctx.stroke();

      // Sonic crack star burst at tip!
      if (p > 0.32 && p < 0.86) {
        ctx.save();
        ctx.translate(w.tx, w.ty);
        ctx.rotate(p * 6);
        const sr = 28 * Math.sin(((p - 0.32) / 0.54) * Math.PI);
        ctx.fillStyle = "#F2B743";
        ctx.beginPath();
        for (let k = 0; k < 12; k++) {
          const rad = k % 2 === 0 ? sr : sr * 0.35;
          const a = (k * Math.PI) / 6;
          if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
          else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  function stepBlobs(now) {
    if (!blobsCanvas) return;
    const ctx = blobsCanvas.getContext("2d");
    if (stageVisible && ctx) {
      const t = prefersReduced ? 1.2 : now * 0.0012;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const pad = 18;
      for (const b of blobs) {
        if (b !== draggedBlob) {
          if (!prefersReduced) {
            b.vx += Math.sin(t * 0.55 + b.seed) * 0.012;
            b.vy += Math.cos(t * 0.48 + b.seed * 1.4) * 0.012;
            b.rot += b.vrot;
          }
          if (b.kind === "dragon") {
            b.vrot *= 0.985;
            if (Math.abs(b.vrot) < 0.003) b.vrot = 0.003;
          }

          if (!whipMode && pointer.active && !draggedBlob) {
            const dx = b.x - pointer.x;
            const dy = b.y - pointer.y;
            const dist = Math.hypot(dx, dy) || 1;
            const reach = b.r + 100;
            if (dist < reach) {
              const force = (1 - dist / reach) * 0.85;
              b.vx += (dx / dist) * force + pointer.vx * 0.04;
              b.vy += (dy / dist) * force + pointer.vy * 0.04;
            }
          }

          b.vx *= 0.968;
          b.vy *= 0.968;
          b.x += b.vx;
          b.y += b.vy;

          const topSafe = b.kind === "dragon" && cw < 640 ? 205 : pad;
          if (b.x - b.r < pad) { b.x = pad + b.r; b.vx = Math.abs(b.vx) * 0.75; }
          else if (b.x + b.r > cw - pad) { b.x = cw - pad - b.r; b.vx = -Math.abs(b.vx) * 0.75; }
          if (b.y - b.r < topSafe) { b.y = topSafe + b.r; b.vy = Math.abs(b.vy) * 0.75; }
          else if (b.y + b.r > ch - 76) { b.y = ch - 76 - b.r; b.vy = -Math.abs(b.vy) * 0.75; }
        }
        b.hitFlash *= 0.88;
      }

      // Collisions between tokens (slamming a shape into Red Dragon also knocks out Dragon Eggs!)
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i];
          const b = blobs[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minDist = (a.r + b.r) * 1.02;
          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const relSpeed = Math.hypot(b.vx - a.vx, b.vy - a.vy);
            const push = (minDist - dist) * 0.08;
            if (a !== draggedBlob) { a.vx -= nx * push; a.vy -= ny * push; }
            if (b !== draggedBlob) { b.vx += nx * push; b.vy += ny * push; }

            if ((a.kind === "dragon" || b.kind === "dragon") && relSpeed > 3.8 && now - lastCollisionEggTime > 380) {
              lastCollisionEggTime = now;
              const dr = a.kind === "dragon" ? a : b;
              dr.hitFlash = 0.85;
              spawnDragonEgg(dr.x, dr.y, false);
              playEggChime(false);
            }
          }
        }
      }

      // Update & draw Dragon Eggs
      for (let i = spawnedEggs.length - 1; i >= 0; i--) {
        const egg = spawnedEggs[i];
        egg.vy += 0.08; // gentle floaty gravity
        egg.vx *= 0.985;
        egg.vy *= 0.985;
        egg.x += egg.vx;
        egg.y += egg.vy;
        egg.rot += egg.vrot;

        if (egg.x - egg.r < pad) { egg.x = pad + egg.r; egg.vx = Math.abs(egg.vx) * 0.75; }
        else if (egg.x + egg.r > cw - pad) { egg.x = cw - pad - egg.r; egg.vx = -Math.abs(egg.vx) * 0.75; }
        if (egg.y - egg.r < pad) { egg.y = pad + egg.r; egg.vy = Math.abs(egg.vy) * 0.75; }
        else if (egg.y + egg.r > ch - 76) { egg.y = ch - 76 - egg.r; egg.vy = -Math.abs(egg.vy) * 0.68; }

        // Collect when sweeping cursor over egg!
        if (pointer.active && Math.hypot(egg.x - pointer.x, egg.y - pointer.y) <= egg.r + 22) {
          collectEgg(i);
          continue;
        }
        drawDragonEgg(ctx, egg, t);
      }

      // Draw KIES tokens & Red Dragon medallion on top
      for (let i = blobs.length - 1; i >= 0; i--) {
        drawToken(ctx, blobs[i], t);
      }

      // Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.r += (sw.maxR - sw.r) * 0.18;
        sw.life -= 0.06;
        if (sw.life <= 0) { shockwaves.splice(i, 1); continue; }
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.life;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      }

      // Animated Whip Strikes & Idle Whip
      drawWhipStrikes(ctx);
      drawIdleWhipCursor(ctx, t);

      // Floating score popups
      for (let i = floatPopups.length - 1; i >= 0; i--) {
        const fp = floatPopups[i];
        fp.y -= 1.3;
        fp.life -= 0.024;
        if (fp.life <= 0) { floatPopups.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.min(1, fp.life * 1.4);
        ctx.font = "900 18px Rubik, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = fp.color;
        ctx.fillText(fp.text, fp.x, fp.y);
        ctx.restore();
      }
    }

    pointer.vx *= 0.8;
    pointer.vy *= 0.8;
    requestAnimationFrame(stepBlobs);
  }

  function getCanvasPos(e) {
    const rect = blobsCanvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  blobsCanvas.addEventListener("pointerdown", (e) => {
    const pos = getCanvasPos(e);
    pointer.x = pos.x;
    pointer.y = pos.y;
    pointer.active = true;

    // Clicking directly on an egg always collects it
    const eggIdx = spawnedEggs.findIndex((eg) => Math.hypot(pos.x - eg.x, pos.y - eg.y) <= eg.r + 14);
    if (eggIdx >= 0) {
      collectEgg(eggIdx);
      return;
    }

    if (whipMode) {
      triggerWhipStrike(pos.x, pos.y);
      return;
    }

    // Grab / Fling mode
    const hit = blobs.find((b) => Math.hypot(pos.x - b.x, pos.y - b.y) <= b.r * 1.05);
    if (hit) {
      blobsCanvas.setPointerCapture(e.pointerId);
      draggedBlob = hit;
      dragOffsetX = hit.x - pos.x;
      dragOffsetY = hit.y - pos.y;
      lastPtrX = pos.x;
      lastPtrY = pos.y;
      hit.vx = 0;
      hit.vy = 0;
      blobsCanvas.classList.add("is-dragging");
    } else {
      triggerWhipStrike(pos.x, pos.y);
    }
  });

  blobsCanvas.addEventListener("pointermove", (e) => {
    const pos = getCanvasPos(e);
    pointer.vx = pos.x - pointer.x;
    pointer.vy = pos.y - pointer.y;
    pointer.x = pos.x;
    pointer.y = pos.y;
    pointer.active = true;

    if (draggedBlob) {
      draggedBlob.vx = (pos.x - lastPtrX) * 0.92;
      draggedBlob.vy = (pos.y - lastPtrY) * 0.92;
      draggedBlob.x = pos.x + dragOffsetX;
      draggedBlob.y = pos.y + dragOffsetY;
      lastPtrX = pos.x;
      lastPtrY = pos.y;
    }
  });

  const endDrag = () => {
    if (draggedBlob) {
      draggedBlob.vx = Math.max(-24, Math.min(24, draggedBlob.vx * 1.25));
      draggedBlob.vy = Math.max(-24, Math.min(24, draggedBlob.vy * 1.25));
      draggedBlob = null;
      blobsCanvas.classList.remove("is-dragging");
    }
  };
  blobsCanvas.addEventListener("pointerup", endDrag);
  blobsCanvas.addEventListener("pointercancel", endDrag);
  blobsCanvas.addEventListener("pointerleave", () => {
    pointer.active = false;
    endDrag();
  });

  strikeWhipBtn?.addEventListener("click", () => {
    const dragon = blobs.find((b) => b.kind === "dragon");
    const tx = dragon ? dragon.x : cw * 0.5;
    const ty = dragon ? dragon.y : ch * 0.5;
    triggerWhipStrike(tx, ty);
  });

  modeWhipBtn?.addEventListener("click", () => {
    whipMode = !whipMode;
    modeWhipBtn.textContent = whipMode ? "Режим: Плётка" : "Режим: Бросок";
    blobsCanvas.classList.toggle("is-grab-mode", !whipMode);
  });

  scatterBlobsBtn?.addEventListener("click", () => {
    playWhipCrackSound();
    for (const b of blobs) {
      const a = Math.random() * Math.PI * 2;
      const spd = 9 + Math.random() * 12;
      b.vx += Math.cos(a) * spd;
      b.vy += Math.sin(a) * spd;
    }
    const dragon = blobs.find((b) => b.kind === "dragon");
    if (dragon) spawnDragonEgg(dragon.x, dragon.y, false);
  });

  paletteBlobsBtn?.addEventListener("click", () => {
    const idx = (BG_MODES.indexOf(bgMode) + 1) % BG_MODES.length;
    bgMode = BG_MODES[idx];
    blobsStage.classList.toggle("is-aqua-bg", bgMode === "aqua");
    blobsStage.classList.toggle("is-gold-bg", bgMode === "gold");
    paletteBlobsBtn.textContent = BG_NAMES[bgMode];
  });

  soundToggleBtn?.addEventListener("click", () => {
    soundOn = !soundOn;
    soundToggleBtn.textContent = soundOn ? "Звук: Вкл" : "Звук: Выкл";
    showToast(soundOn ? "Звук включён" : "Звук выключен");
  });

  redeemEggsBtn?.addEventListener("click", () => {
    if (dragonDiscountUnlocked) {
      openCartDrawer();
      return;
    }
    if (dragonEggsEarned < 15) {
      showToast(`Нужно ещё ${15 - dragonEggsEarned} яиц дракона! Накажите дракошу плёткой!`);
      return;
    }
    dragonEggsEarned -= 15;
    dragonDiscountUnlocked = true;
    saveDragonState();
    syncDragonHud();
    playEggChime(true);
    renderCart();
    showToast("Бонус от VEX активирован: скидка -10% в корзине!");
  });

  window.addEventListener("resize", () => {
    resizeBlobsCanvas();
    const scale = cw < 640 ? 0.66 : 1;
    for (const b of blobs) {
      b.r = b.baseR * scale;
      b.x = Math.min(cw - b.r, Math.max(b.r, b.x));
      b.y = Math.min(ch - b.r, Math.max(b.r, b.y));
    }
  });

  createBlobs();
  requestAnimationFrame(stepBlobs);

  // ======================================================
  // 2. STUDIO (CINFO / KEYCARD / THEME)
  // ======================================================
  const sbTabs = document.querySelectorAll(".sb-tab");
  const sbPanels = {
    cinfo: document.getElementById("sbCinfo"),
    keycard: document.getElementById("sbKeycard"),
    theme: document.getElementById("sbTheme")
  };

  sbTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.sb;
      sbTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      Object.entries(sbPanels).forEach(([key, panel]) => {
        const show = key === target;
        panel.hidden = !show;
        panel.classList.toggle("is-active", show);
      });
    });
  });

  const CINFO_PRESETS = {
    science: { name: "Доктор Феликс", dept: "Научная служба", role: "Старший исследователь", extra: "A(II)+ | Пропуск 3 ур.", look: "Белый халат | На груди бейдж и КПК", color: "#58a6ff" },
    security: { name: "Агент Рейнольдс", dept: "Служба безопасности", role: "Лейтенант СБ", extra: "O(I)+ | Мини-камера", look: "Тактический бронежилет | На груди жетон СБ", color: "#a8c7fa" },
    mtf: { name: "Командир Вудс", dept: "МОГ Ню-7", role: "Удар молота", extra: "Позывной «Молот-1»", look: "Тяжёлая броня МОГ | Шлем с ПНВ", color: "#3b82f6" },
    med: { name: "Доктор Иван Золо", dept: "Медицинская служба", role: "Травматолог", extra: "Медблок Сектора А", look: "Халат с красным крестом | Полевая аптечка", color: "#34d399" },
    classd: { name: "D-4821", dept: "Класс D", role: "Испытуемый", extra: "Сектор D-блока", look: "Оранжевый комбинезон | Номерной бейдж", color: "#f97316" },
    chaos: { name: "Разведчик Хаоса", dept: "Повстанцы Хаоса", role: "Передовой отряд", extra: "Маскировка снята", look: "Тёмно-зелёная форма | Противогаз и рация", color: "#22c55e" }
  };

  const cinfoStyle = document.getElementById("cinfoStyle");
  const cinfoColor = document.getElementById("cinfoColor");
  const cinfoHex = document.getElementById("cinfoHex");
  const cinfoName = document.getElementById("cinfoName");
  const cinfoDept = document.getElementById("cinfoDept");
  const cinfoRole = document.getElementById("cinfoRole");
  const cinfoExtra = document.getElementById("cinfoExtra");
  const cinfoLook = document.getElementById("cinfoLook");
  const cinfoPreview = document.getElementById("cinfoPreview");
  const cinfoStyleLabel = document.getElementById("cinfoStyleLabel");
  const cinfoCodeOut = document.getElementById("cinfoCodeOut");
  const cinfoPresetBtns = document.querySelectorAll("#cinfoPresets .tp-btn");

  let lastCinfoRaw = "";
  function renderCinfo() {
    const st = cinfoStyle.value;
    const col = cinfoColor.value.toUpperCase();
    const name = cinfoName.value.trim() || "Персонаж";
    const dept = cinfoDept.value.trim();
    const role = cinfoRole.value.trim();
    const extra = cinfoExtra.value.trim();
    const look = cinfoLook.value.trim();
    cinfoHex.textContent = col;

    let raw = "";
    let previewHtml = "";
    if (st === "badge") {
      cinfoStyleLabel.textContent = "Служебный бейдж v5";
      const line2 = [dept, role].filter(Boolean).join(" | ");
      raw = `<size=15><color=${col}>${line2}</color></size>\n<size=12><color=#E2E8F0>« ${look} »</color></size>`;
      previewHtml = `
        <div style="font-size:21px;font-weight:700;color:#ffffff">${esc(name)}</div>
        <div style="font-size:15px;font-weight:600;color:${col};margin-top:2px">${esc(line2)}</div>
        <div style="font-size:12px;color:#e2e8f0;margin-top:3px">« ${esc(look)} »</div>
      `;
    } else if (st === "classic") {
      cinfoStyleLabel.textContent = "Классика Subclass";
      raw = `<size=15><color=#FFFFFF>« ${look} »</color>\n<color=${col}>${role || dept}</color></size>`;
      previewHtml = `
        <div style="font-size:19px;font-weight:600;color:#ffffff">${esc(name)}</div>
        <div style="font-size:14px;color:#ffffff;margin-top:3px">« ${esc(look)} »</div>
        <div style="font-size:15px;font-weight:700;color:${col};margin-top:2px">${esc(role || dept)}</div>
      `;
    } else {
      cinfoStyleLabel.textContent = "Боевой / СБ";
      const line2 = [dept, role, extra].filter(Boolean).join(" | ");
      raw = `<size=15><color=${col}><b>${line2}</b></color></size>\n<size=12><color=#CBD5E1>« ${look} »</color></size>`;
      previewHtml = `
        <div style="font-size:21px;font-weight:700;color:#ffffff">${esc(name)}</div>
        <div style="font-size:15px;font-weight:700;color:${col};margin-top:2px">${esc(line2)}</div>
        <div style="font-size:12px;color:#cbd5e1;margin-top:3px">« ${esc(look)} »</div>
      `;
    }

    lastCinfoRaw = raw;
    cinfoPreview.innerHTML = previewHtml;
    cinfoCodeOut.textContent = `custom_info: "${raw.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"`;
  }

  [cinfoStyle, cinfoColor, cinfoName, cinfoDept, cinfoRole, cinfoExtra, cinfoLook].forEach((el) => {
    el.addEventListener("input", renderCinfo);
    el.addEventListener("change", renderCinfo);
  });

  cinfoPresetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = CINFO_PRESETS[btn.dataset.cp];
      if (!p) return;
      cinfoPresetBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      cinfoName.value = p.name;
      cinfoDept.value = p.dept;
      cinfoRole.value = p.role;
      cinfoExtra.value = p.extra;
      cinfoLook.value = p.look;
      cinfoColor.value = p.color;
      renderCinfo();
    });
  });

  document.getElementById("copyCinfoRaw").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(lastCinfoRaw); showToast("CINFO тег скопирован"); }
    catch { showToast("Не удалось скопировать"); }
  });
  document.getElementById("copyCinfoYaml").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(cinfoCodeOut.textContent); showToast("Строка YAML скопирована"); }
    catch { showToast("Не удалось скопировать"); }
  });
  renderCinfo();

  // Keycard generator
  const KC_PRESETS = {
    sb: { type: "KeycardCustomMetalCase", dept: "Служба Безопасности", role: "Лейтенант СБ", callsign: "Агент Рейнольдс", c: "2", a: "2", m: "2", cls: "C", bg: "#153e7a", acc: "#f2b743" },
    sci: { type: "KeycardCustomSite02", dept: "Научная Служба", role: "Ведущий Учёный", callsign: "Д-р Феликс", c: "3", a: "0", m: "1", cls: "B", bg: "#1c529e", acc: "#8ad2d2" },
    mtf: { type: "KeycardCustomTaskForce", dept: "МОГ Ню-7", role: "Оперативник", callsign: "Молот-1", c: "2", a: "3", m: "2", cls: "A", bg: "#143d78", acc: "#da3832" },
    dir: { type: "KeycardCustomManagement", dept: "Дирекция Зоны", role: "Директор Комплекса", callsign: "Код O5-4", c: "3", a: "3", m: "3", cls: "O5", bg: "#da3832", acc: "#f2b743" }
  };

  const kcType = document.getElementById("kcType");
  const kcDept = document.getElementById("kcDept");
  const kcRole = document.getElementById("kcRole");
  const kcCallsign = document.getElementById("kcCallsign");
  const kcPermCont = document.getElementById("kcPermCont");
  const kcPermArm = document.getElementById("kcPermArm");
  const kcPermAdm = document.getElementById("kcPermAdm");
  const kcClass = document.getElementById("kcClass");
  const kcBg = document.getElementById("kcBg");
  const kcAccent = document.getElementById("kcAccent");
  const kcBgHex = document.getElementById("kcBgHex");
  const kcAccentHex = document.getElementById("kcAccentHex");

  const visualKeycard = document.getElementById("visualKeycard");
  const vkStripe = document.getElementById("vkStripe");
  const vkType = document.getElementById("vkType");
  const vkDept = document.getElementById("vkDept");
  const vkRole = document.getElementById("vkRole");
  const vkPerms = document.getElementById("vkPerms");
  const vkClass = document.getElementById("vkClass");
  const vkCallsign = document.getElementById("vkCallsign");
  const kcCmdOut = document.getElementById("kcCmdOut");
  const kcPresetBtns = document.querySelectorAll("#kcPresets .tp-btn");

  function renderKeycard() {
    const bg = kcBg.value.toUpperCase();
    const acc = kcAccent.value.toUpperCase();
    const type = kcType.value;
    const dept = kcDept.value.trim() || "Служба";
    const role = kcRole.value.trim() || "Сотрудник";
    const call = kcCallsign.value.trim() || "Позывной";
    const pC = kcPermCont.value;
    const pA = kcPermArm.value;
    const pM = kcPermAdm.value;
    const cls = kcClass.value;

    kcBgHex.textContent = bg;
    kcAccentHex.textContent = acc;
    visualKeycard.style.background = bg;
    vkStripe.style.background = acc;
    vkDept.style.color = acc;
    vkType.textContent = type.replace("KeycardCustom", "");
    vkDept.textContent = dept;
    vkRole.textContent = role;
    vkPerms.textContent = `${pC} / ${pA} / ${pM}`;
    vkClass.textContent = cls;
    vkCallsign.textContent = call;

    const u = (s) => s.replace(/\s+/g, "_");
    const maxP = Math.max(Number(pC), Number(pA), Number(pM));
    const permCol = maxP >= 3 ? "#FF6428" : maxP === 2 ? "#FFFF00" : "#00FF00";

    kcCmdOut.textContent = `ckeycard {id} ${type} <size=10>КАРТА_ДОСТУПА</size><br><size=15><color=${acc}>${u(dept)}</color></size><br><size=10><align=left><pos=5%>┌──┐<pos=20%>${u(role)}<pos=75%>▛▗▘▜<br><pos=5%>│_ID_│<pos=20%>Допуск:<pos=35%><color=${permCol}>_${pC}/${pA}/${pM}</color><pos=75%>▖▚▝▘<br><pos=5%>└──┘<pos=20%>Класс:<pos=35%><color=#FFFF00>_${cls}</color><pos=75%>▙▝▞▝<br><br>СРОК_ДЕЙСТВИЯ:_до_01.01.2028___Позывной:_${u(call)}</size> ${pC} ${pA} ${pM} ${bg} ${acc} <align=left><size=28%>Ключ-Карта</size> white _ 0`;
  }

  [kcType, kcDept, kcRole, kcCallsign, kcPermCont, kcPermArm, kcPermAdm, kcClass, kcBg, kcAccent].forEach((el) => {
    el.addEventListener("input", renderKeycard);
    el.addEventListener("change", renderKeycard);
  });

  kcPresetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = KC_PRESETS[btn.dataset.kc];
      if (!p) return;
      kcPresetBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      kcType.value = p.type;
      kcDept.value = p.dept;
      kcRole.value = p.role;
      kcCallsign.value = p.callsign;
      kcPermCont.value = p.c;
      kcPermArm.value = p.a;
      kcPermAdm.value = p.m;
      kcClass.value = p.cls;
      kcBg.value = p.bg;
      kcAccent.value = p.acc;
      renderKeycard();
    });
  });

  async function copyKc() {
    try { await navigator.clipboard.writeText(kcCmdOut.textContent); showToast("Команда ckeycard скопирована"); }
    catch { showToast("Не удалось скопировать"); }
  }
  document.getElementById("copyKcCmd").addEventListener("click", copyKc);
  document.getElementById("copyKcCmd2").addEventListener("click", copyKc);

  document.getElementById("downloadKcPng").addEventListener("click", () => {
    const c = document.createElement("canvas");
    c.width = 760;
    c.height = 440;
    const ctx = c.getContext("2d");
    const bg = kcBg.value;
    const acc = kcAccent.value;

    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, 760, 440, 28);
    ctx.fill();

    ctx.fillStyle = acc;
    ctx.fillRect(0, 0, 18, 440);

    ctx.fillStyle = "rgba(255,255,255,0.68)";
    ctx.font = "600 18px JetBrains Mono, monospace";
    ctx.fillText("КАРТА ДОСТУПА  /  FULT-ENGINE", 48, 56);
    ctx.fillText(kcType.value.replace("KeycardCustom", ""), 580, 56);

    ctx.fillStyle = acc;
    ctx.font = "900 34px Rubik, sans-serif";
    ctx.fillText(kcDept.value || "Служба", 48, 114);

    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.roundRect(48, 152, 108, 108, 16);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px JetBrains Mono, monospace";
    ctx.fillText("ID", 84, 216);

    ctx.font = "700 28px Golos Text, sans-serif";
    ctx.fillText(kcRole.value || "Сотрудник", 184, 184);
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.font = "500 22px JetBrains Mono, monospace";
    ctx.fillText(`Допуск: ${kcPermCont.value} / ${kcPermArm.value} / ${kcPermAdm.value}`, 184, 222);
    ctx.fillText(`Класс: ${kcClass.value}`, 184, 256);

    for (let r = 0; r < 4; r++) {
      for (let col = 0; col < 4; col++) {
        ctx.fillStyle = (r + col) % 2 === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.22)";
        ctx.fillRect(610 + col * 24, 160 + r * 24, 18, 18);
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "500 20px JetBrains Mono, monospace";
    ctx.fillText("Срок: до 01.01.2028", 48, 392);
    ctx.fillText(`Владелец: ${kcCallsign.value || "Агент"}`, 400, 392);

    const a = document.createElement("a");
    a.download = `keycard-${(kcCallsign.value || "fult").replace(/\s+/g, "-").toLowerCase()}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
    showToast("Карточка PNG скачана");
  });
  renderKeycard();

  // Theme.yml Studio
  const THEME_PRESETS = {
    lava: { accent: "#da3832", good: "#8ad2d2", warn: "#f2b743", bad: "#e87b25" },
    cobalt: { accent: "#60a5fa", good: "#34d399", warn: "#fbbf24", bad: "#fb7185" },
    emerald: { accent: "#8ad2d2", good: "#4ade80", warn: "#facc15", bad: "#f87171" },
    amber: { accent: "#f2b743", good: "#34d399", warn: "#fde047", bad: "#da3832" }
  };

  const colAccent = document.getElementById("colAccent");
  const colGood = document.getElementById("colGood");
  const colWarn = document.getElementById("colWarn");
  const colBad = document.getElementById("colBad");
  const hexAccent = document.getElementById("hexAccent");
  const hexGood = document.getElementById("hexGood");
  const hexWarn = document.getElementById("hexWarn");
  const hexBad = document.getElementById("hexBad");
  const hintInput = document.getElementById("hintInput");
  const hudPreview = document.getElementById("hudPreview");
  const hudRoleBadge = document.getElementById("hudRoleBadge");
  const themeYamlOut = document.getElementById("themeYamlOut");
  const tpBtns = document.querySelectorAll("#themePresets .tp-btn");

  function renderThemePreview() {
    const colors = {
      accent: colAccent.value.toUpperCase(),
      good: colGood.value.toUpperCase(),
      warn: colWarn.value.toUpperCase(),
      bad: colBad.value.toUpperCase()
    };
    hexAccent.textContent = colors.accent;
    hexGood.textContent = colors.good;
    hexWarn.textContent = colors.warn;
    hexBad.textContent = colors.bad;
    hudRoleBadge.style.borderLeft = `4px solid ${colors.accent}`;
    hudRoleBadge.style.paddingLeft = "8px";

    const raw = esc(hintInput.value);
    hudPreview.innerHTML = raw.replace(
      /&lt;color=@(accent|good|warn|bad)&gt;([\s\S]*?)&lt;\/color&gt;/gi,
      (_, key, inner) => `<span style="color:${colors[key.toLowerCase()]};font-weight:700">${inner}</span>`
    ) || "<span style='opacity:0.6'>Введите текст хинта слева...</span>";

    themeYamlOut.textContent = [
      "is_enabled: true",
      "tokens:",
      `  accent: "${colors.accent}"`,
      `  good: "${colors.good}"`,
      `  warn: "${colors.warn}"`,
      `  bad: "${colors.bad}"`
    ].join("\n");
  }

  [colAccent, colGood, colWarn, colBad].forEach((inp) => {
    inp.addEventListener("input", () => {
      tpBtns.forEach((b) => b.classList.remove("is-active"));
      renderThemePreview();
    });
  });
  hintInput.addEventListener("input", renderThemePreview);
  tpBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = THEME_PRESETS[btn.dataset.tp];
      if (!p) return;
      tpBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      colAccent.value = p.accent;
      colGood.value = p.good;
      colWarn.value = p.warn;
      colBad.value = p.bad;
      renderThemePreview();
    });
  });
  document.getElementById("copyThemeBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(themeYamlOut.textContent); showToast("Theme.yml скопирован"); }
    catch { showToast("Не удалось скопировать"); }
  });
  renderThemePreview();

  // ======================================================
  // 3. MODULE SHOP & CART DRAWER (+ DRAGON EGG DISCOUNT)
  // ======================================================
  const cartDrawer = document.getElementById("cartDrawer");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartItemCountEl = document.getElementById("cartItemCount");
  const cartDiscountRow = document.getElementById("cartDiscountRow");
  const cartDiscountVal = document.getElementById("cartDiscountVal");
  const cartDragonRow = document.getElementById("cartDragonRow");
  const cartDragonVal = document.getElementById("cartDragonVal");
  const cartTotalEl = document.getElementById("cartTotal");
  const orderReceipt = document.getElementById("orderReceipt");
  const receiptId = document.getElementById("receiptId");
  const receiptText = document.getElementById("receiptText");

  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem("fult_cart_v1") || "[]");
    if (Array.isArray(saved)) cart = saved;
  } catch {}

  function saveCart() {
    try { localStorage.setItem("fult_cart_v1", JSON.stringify(cart)); } catch {}
  }

  function isInCart(id) {
    return cart.some((item) => item.id === id);
  }

  function calcCart() {
    const subtotal = cart.reduce((acc, it) => acc + it.price, 0);
    const singleModCount = cart.filter((it) => it.type === "module").length;
    const discRate = singleModCount >= 15 ? 0.2 : singleModCount >= 5 ? 0.1 : 0;
    const discount = Math.round(
      cart.filter((it) => it.type === "module").reduce((a, b) => a + b.price, 0) * discRate
    );
    const afterVol = Math.max(0, subtotal - discount);
    const dragonDiscount = dragonDiscountUnlocked ? Math.round(afterVol * 0.1) : 0;
    return { subtotal, discount, discRate, dragonDiscount, total: Math.max(0, afterVol - dragonDiscount) };
  }

  function syncShopButtons() {
    document.querySelectorAll(".bundle-add").forEach((btn) => {
      const added = isInCart(btn.dataset.bundle);
      btn.classList.toggle("is-added", added);
      btn.textContent = added ? "В корзине (убрать)" : "Добавить в корзину";
    });
    document.querySelectorAll(".mod-buy").forEach((btn) => {
      const added = isInCart(btn.dataset.buy);
      btn.classList.toggle("is-added", added);
      btn.textContent = added ? "В корзине" : "+ В корзину";
      btn.closest(".mod-row")?.classList.toggle("is-in-cart", added);
    });
  }

  function renderCart() {
    cartCountEl.textContent = String(cart.length);
    document.getElementById("openCart")?.classList.toggle("has-items", cart.length > 0);
    cartItemCountEl.textContent = String(cart.length);
    const { discount, discRate, dragonDiscount, total } = calcCart();

    if (discount > 0) {
      cartDiscountRow.hidden = false;
      cartDiscountVal.textContent = `-${formatRub(discount)} (${Math.round(discRate * 100)}%)`;
    } else {
      cartDiscountRow.hidden = true;
    }

    if (cartDragonRow && cartDragonVal) {
      if (dragonDiscount > 0) {
        cartDragonRow.hidden = false;
        cartDragonVal.textContent = `-${formatRub(dragonDiscount)}`;
      } else {
        cartDragonRow.hidden = true;
      }
    }

    cartTotalEl.textContent = formatRub(total);

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<div class="cart-empty">Корзина пуста. Выберите модули или готовый комплект в магазине.</div>`;
    } else {
      cartItemsEl.innerHTML = cart
        .map((item) => `
          <div class="cart-item">
            <div class="cart-item-info">
              <strong>${esc(item.name)}</strong>
              <span>${esc(item.desc)}</span>
            </div>
            <div class="cart-item-right">
              <span class="cart-item-price">${formatRub(item.price)}</span>
              <button type="button" class="cart-remove" data-rm="${esc(item.id)}" aria-label="Удалить ${esc(item.name)}">×</button>
            </div>
          </div>
        `)
        .join("");
    }
    syncShopButtons();
  }

  function toggleCartItem(item) {
    const idx = cart.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      cart.splice(idx, 1);
      showToast(`Убрано: ${item.name}`);
    } else {
      cart.push(item);
      playEggChime(false);
      showToast(`Добавлено: ${item.name}`);
    }
    orderReceipt.hidden = true;
    saveCart();
    renderCart();
  }

  function openCartDrawer() {
    cartDrawer.hidden = false;
    document.body.style.overflow = "hidden";
    renderCart();
  }

  function closeCartDrawer() {
    cartDrawer.hidden = true;
    document.body.style.overflow = "";
  }

  function addFullAndOpenCart() {
    if (!isInCart("bundle_full")) {
      cart.push({ ...BUNDLES.bundle_full, type: "bundle" });
      saveCart();
    }
    openCartDrawer();
  }

  document.querySelectorAll(".bundle-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const b = BUNDLES[btn.dataset.bundle];
      if (b) toggleCartItem({ ...b, type: "bundle" });
    });
  });

  document.getElementById("openCart").addEventListener("click", openCartDrawer);
  document.getElementById("openCartFromCta").addEventListener("click", openCartDrawer);
  document.getElementById("addFullFromWebpanel").addEventListener("click", addFullAndOpenCart);
  document.getElementById("orderFullNow").addEventListener("click", addFullAndOpenCart);
  document.getElementById("closeCart").addEventListener("click", closeCartDrawer);
  cartDrawer.addEventListener("click", (e) => { if (e.target === cartDrawer) closeCartDrawer(); });

  cartItemsEl.addEventListener("click", (e) => {
    const rm = e.target.closest(".cart-remove");
    if (!rm) return;
    cart = cart.filter((i) => i.id !== rm.dataset.rm);
    orderReceipt.hidden = true;
    saveCart();
    renderCart();
  });

  document.getElementById("clearCartBtn").addEventListener("click", () => {
    cart = [];
    orderReceipt.hidden = true;
    saveCart();
    renderCart();
    showToast("Корзина очищена");
  });

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Сначала добавьте хотя бы один модуль");
      return;
    }
    const contact = document.getElementById("orderContact").value.trim();
    const { discount, dragonDiscount, total } = calcCart();
    const code = `FULT-${Math.floor(1000 + Math.random() * 9000)}`;
    const lines = [
      `Заказ: #${code}`,
      `Контакт: ${contact}`,
      `Позиции (${cart.length}):`,
      ...cart.map((it) => `  - ${it.name} (${formatRub(it.price)})`),
      discount > 0 ? `Скидка за объём: -${formatRub(discount)}` : null,
      dragonDiscount > 0 ? `Бонус от VEX (-10%): -${formatRub(dragonDiscount)}` : null,
      `Итого: ${formatRub(total)}`,
      `Отправьте эту заявку менеджеру FULT-ENGINE для получения сборки.`
    ].filter(Boolean);

    receiptId.textContent = `Заказ #${code}`;
    receiptText.textContent = lines.join("\n");
    orderReceipt.hidden = false;
    playEggChime(true);
    showToast(`Заявка #${code} сформирована`);
  });

  document.getElementById("copyReceiptBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(receiptText.textContent); showToast("Заявка скопирована"); }
    catch { showToast("Не удалось скопировать"); }
  });

  // ======================================================
  // 4. MODULE CATALOG
  // ======================================================
  const modulesList = document.getElementById("modulesList");
  const resultsMeta = document.getElementById("resultsMeta");
  const searchInput = document.getElementById("moduleSearch");
  const catPills = document.querySelectorAll(".cat-pill");
  document.getElementById("countAll").textContent = String(MODULES.length);

  let activeCat = "all";
  let query = "";
  let expandedAll = false;

  function renderModules() {
    const q = query.trim().toLowerCase();
    const filtered = MODULES.filter((m) => {
      if (activeCat !== "all" && m.cat !== activeCat) return false;
      if (!q) return true;
      return `${m.name} ${m.desc} ${m.cmds.join(" ")} ${CATEGORY_META[m.cat].label}`.toLowerCase().includes(q);
    });

    const limitDefault = activeCat === "all" && !q && !expandedAll;
    const visible = limitDefault ? filtered.slice(0, 14) : filtered;

    resultsMeta.textContent = limitDefault
      ? `Показано ${visible.length} из ${MODULES.length} модулей`
      : `Найдено ${filtered.length} из ${MODULES.length} модулей`;

    if (filtered.length === 0) {
      modulesList.innerHTML = `<div class="empty-state">Ничего не найдено по запросу «${esc(q)}». Очистите поиск или выберите другую категорию.</div>`;
      return;
    }

    const cardsHtml = visible
      .map((m) => {
        const meta = CATEGORY_META[m.cat];
        const cmdsHtml = m.cmds.length
          ? `<div class="mod-cmds">${m.cmds.map((c) => `<code>${esc(c)}</code>`).join("")}</div>`
          : "";
        const inCart = isInCart(m.name);
        return `
          <article class="mod-row${inCart ? " is-in-cart" : ""}" data-mod="${esc(m.name)}">
            <div>
              <div class="mod-head">
                <h3 class="mod-name">${esc(m.name)}</h3>
                <span class="mod-cat">${meta.label}</span>
              </div>
              <p class="mod-desc">${esc(m.desc)}</p>
              ${cmdsHtml}
            </div>
            <div class="mod-foot">
              <span class="mod-price">${formatRub(m.price)}</span>
              <button type="button" class="mod-buy${inCart ? " is-added" : ""}" data-buy="${esc(m.name)}">${inCart ? "В корзине" : "+ В корзину"}</button>
            </div>
          </article>
        `;
      })
      .join("");

    const moreHtml = limitDefault
      ? `<div class="modules-more-wrap"><button type="button" class="btn btn-sand btn-sm" id="showAllModulesBtn">Показать все ${MODULES.length} модулей</button></div>`
      : "";

    modulesList.innerHTML = cardsHtml + moreHtml;
  }

  function focusModuleInCatalog(modName) {
    activeCat = "all";
    catPills.forEach((p) => {
      const isAll = p.dataset.cat === "all";
      p.classList.toggle("is-active", isAll);
      p.setAttribute("aria-selected", String(isAll));
    });
    query = modName;
    searchInput.value = modName;
    renderModules();
    document.getElementById("modules").scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  }

  modulesList.addEventListener("click", (e) => {
    if (e.target.closest("#showAllModulesBtn")) { expandedAll = true; renderModules(); return; }
    const buyBtn = e.target.closest(".mod-buy");
    if (buyBtn) {
      const mod = MODULES.find((m) => m.name === buyBtn.dataset.buy);
      if (mod) toggleCartItem({ id: mod.name, name: mod.name, price: mod.price, desc: CATEGORY_META[mod.cat].label, type: "module" });
    }
  });

  catPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      activeCat = pill.dataset.cat;
      catPills.forEach((p) => {
        const active = p === pill;
        p.classList.toggle("is-active", active);
        p.setAttribute("aria-selected", String(active));
      });
      renderModules();
    });
  });

  searchInput.addEventListener("input", (e) => { query = e.target.value; renderModules(); });
  renderModules();
  renderCart();

  // ======================================================
  // 5. CTRL+K COMMAND PALETTE
  // ======================================================
  const cmdkModal = document.getElementById("cmdkModal");
  const cmdkInput = document.getElementById("cmdkInput");
  const cmdkResults = document.getElementById("cmdkResults");
  const openCmdkBtn = document.getElementById("openCmdk");
  const closeCmdkBtn = document.getElementById("closeCmdk");

  const SECTION_ITEMS = [
    { type: "section", title: "Накажи своего дракошу", sub: "Хлестните плёткой дракошу и соберите яйца дракона", badge: "#bubbles", target: "#bubbles" },
    { type: "section", title: "Студия CINFO и карточек", sub: "Служебные бейджи Subclass и ключ-карты PNG", badge: "#sandbox", target: "#sandbox" },
    { type: "section", title: "Магазин модулей", sub: "65 модулей, наборы и скидки", badge: "#modules", target: "#modules" },
    { type: "section", title: "Веб-панель администрации", sub: "Вход через Steam, роли и варны", badge: "#webpanel", target: "#webpanel" }
  ];

  let cmdkList = [];
  let cmdkSel = 0;

  function renderCmdk() {
    const q = cmdkInput.value.trim().toLowerCase();
    const modMatches = MODULES
      .filter((m) => !q || `${m.name} ${m.desc} ${m.cmds.join(" ")}`.toLowerCase().includes(q))
      .slice(0, q ? 12 : 6)
      .map((m) => ({
        type: "module",
        title: m.name,
        sub: m.desc,
        badge: formatRub(m.price)
      }));

    const secMatches = SECTION_ITEMS.filter((s) => !q || `${s.title} ${s.sub}`.toLowerCase().includes(q));
    cmdkList = q ? [...modMatches, ...secMatches] : [...secMatches, ...modMatches];
    cmdkSel = 0;

    if (cmdkList.length === 0) {
      cmdkResults.innerHTML = `<div style="padding:20px;font-weight:600">Ничего не найдено по запросу «${esc(q)}»</div>`;
      return;
    }

    cmdkResults.innerHTML = cmdkList
      .map((item, i) => `
        <button type="button" class="cmdk-item${i === 0 ? " is-selected" : ""}" data-idx="${i}" role="option" aria-selected="${i === 0}">
          <span class="cmdk-item-main">
            <span class="cmdk-item-title">${esc(item.title)}</span>
            <span class="cmdk-item-sub">${esc(item.sub)}</span>
          </span>
          <span class="cmdk-item-badge">${esc(item.badge)}</span>
        </button>
      `)
      .join("");
  }

  function openCmdk() {
    cmdkModal.hidden = false;
    document.body.style.overflow = "hidden";
    cmdkInput.value = "";
    renderCmdk();
    cmdkInput.focus();
  }

  function closeCmdk() {
    cmdkModal.hidden = true;
    document.body.style.overflow = "";
  }

  function activateCmdkItem(index) {
    const item = cmdkList[index];
    if (!item) return;
    closeCmdk();
    if (item.type === "module") focusModuleInCatalog(item.title);
    else if (item.target) document.querySelector(item.target)?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  }

  openCmdkBtn.addEventListener("click", openCmdk);
  closeCmdkBtn.addEventListener("click", closeCmdk);
  cmdkModal.addEventListener("click", (e) => { if (e.target === cmdkModal) closeCmdk(); });
  cmdkInput.addEventListener("input", renderCmdk);
  cmdkResults.addEventListener("click", (e) => {
    const item = e.target.closest(".cmdk-item");
    if (item) activateCmdkItem(Number(item.dataset.idx));
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdkModal.hidden) openCmdk();
      else closeCmdk();
      return;
    }
    if (e.key === "Escape") {
      if (!cartDrawer.hidden) { closeCartDrawer(); return; }
      if (!cmdkModal.hidden) { closeCmdk(); return; }
    }
    if (!cmdkModal.hidden) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdkList.length === 0) return;
        cmdkSel = (cmdkSel + (e.key === "ArrowDown" ? 1 : -1) + cmdkList.length) % cmdkList.length;
        cmdkResults.querySelectorAll(".cmdk-item").forEach((el, idx) => {
          const on = idx === cmdkSel;
          el.classList.toggle("is-selected", on);
          el.setAttribute("aria-selected", String(on));
          if (on) el.scrollIntoView({ block: "nearest" });
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        activateCmdkItem(cmdkSel);
      }
    }
  });
})();
