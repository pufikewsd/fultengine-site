(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const CATEGORY_META = {
    roles: { label: "Роли и отряды", dot: "dot-coral" },
    scp: { label: "SCP", dot: "dot-amber" },
    facility: { label: "Комплекс", dot: "dot-emerald" },
    gameplay: { label: "Механики", dot: "dot-violet" },
    ui: { label: "Интерфейс", dot: "dot-sky" },
    admin: { label: "Сервер и админ", dot: "dot-rose" }
  };

  const PRO_MODULES = new Set([
    "Subclass", "RoleDistribution", "Scp106Capture", "BetterSCP", "WarheadCode",
    "BetterCassie", "Turrets", "CameraWatch", "InjurySystem", "Cpc", "AntiRaid", "MemoryWatch"
  ]);

  const MODULES = [
    // Роли и отряды (5)
    { name: "Subclass", cat: "roles", desc: "Выдаёт подклассы ролей: состав, предметы, имена учёных и описание персонажа.", cmds: ["137 подклассов"] },
    { name: "RoleDistribution", cat: "roles", desc: "Раздаёт роли в начале раунда по квотам, вызывает Повстанцев Хаоса и Длань Змея.", cmds: ["пх", "дх"] },
    { name: "MtfSquads", cat: "roles", desc: "Вызывает отряды МОГ, включая Ню-7 «Удар молота» до 9 бойцов.", cmds: [] },
    { name: "Ro9Call", cat: "roles", desc: "Вызывает отряд Ро-9 по клавише с перезарядкой.", cmds: [] },
    { name: "CirCodes", cat: "roles", desc: "Принимает и обрабатывает заявки на вызов отряда по КИР.", cmds: ["cra list", "cra y", "cra n"] },

    // SCP (17)
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

    // Комплекс (16)
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

    // Механики (15)
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

    // Интерфейс (4)
    { name: "Hud", cat: "ui", desc: "Рисует HUD игрока с названием роли и подсказками.", cmds: [] },
    { name: "Theme", cat: "ui", desc: "Задаёт тему из Theme.yml и красит тексты через цветовые токены.", cmds: ["Theme.yml"] },
    { name: "SpectatorEffects", cat: "ui", desc: "Скрывает выбранные визуальные эффекты от зрителей.", cmds: [] },
    { name: "WelcomeMessage", cat: "ui", desc: "Показывает приветствие при входе на сервер.", cmds: [] },

    // Сервер и админ (8)
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

  // Toast
  const toastEl = document.getElementById("toast");
  let toastTimer = 0;
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.classList.remove("is-shown"); }, 2200);
  }

  // Scroll progress & nav indicator
  const siteHeader = document.getElementById("siteHeader");
  const scrollProgress = document.getElementById("scrollProgress");
  let scrollRaf = 0;

  function updateScrollUi() {
    scrollRaf = 0;
    const y = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, y / maxScroll))})`;
    siteHeader.classList.toggle("is-scrolled", y > 24);
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
    else navIndicator.classList.remove("is-visible");
  }

  window.addEventListener("scroll", syncActiveNav, { passive: true });
  window.addEventListener("resize", () => {
    const activeLink = navLinks.find((a) => a.classList.contains("is-current"));
    if (activeLink) moveNavIndicator(activeLink);
  });
  syncActiveNav();

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
  // 0. KIES WORM MASCOT EXPRESSIONS & RHYTHM STRIPS
  // ======================================================
  const wormBtn = document.getElementById("wormMascotBtn");
  const wormEyes = document.getElementById("wormEyes");
  const wormMouth = document.getElementById("wormMouth");
  const wormMoodLabel = document.getElementById("wormMoodLabel");

  const WORM_MOODS = [
    {
      label: "Фультик: игривый (X / O)",
      eyes: `<path d="M134 89l18 18m0-18l-18 18" stroke="#1C529E" stroke-width="6.5" stroke-linecap="round"/><circle cx="209" cy="98" r="11" stroke="#1C529E" stroke-width="6"/><circle cx="209" cy="98" r="3.5" fill="#1C529E"/>`,
      mouth: `<path d="M159 130c5 8 12 8 17 0 5 8 12 8 17 0" stroke="#E87B25" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`
    },
    {
      label: "Фультик: дразнится (X / X)",
      eyes: `<path d="M134 89l18 18m0-18l-18 18" stroke="#1C529E" stroke-width="6.5" stroke-linecap="round"/><path d="M200 89l18 18m0-18l-18 18" stroke="#1C529E" stroke-width="6.5" stroke-linecap="round"/>`,
      mouth: `<path d="M159 129c5 8 12 8 17 0 5 8 12 8 17 0" stroke="#E87B25" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M170 133c0 12 12 12 12 0Z" fill="#DA3832"/>`
    },
    {
      label: "Фультик: удивлён (O / O)",
      eyes: `<circle cx="143" cy="98" r="11" stroke="#1C529E" stroke-width="6"/><circle cx="143" cy="98" r="3.5" fill="#1C529E"/><circle cx="209" cy="98" r="11" stroke="#1C529E" stroke-width="6"/><circle cx="209" cy="98" r="3.5" fill="#1C529E"/>`,
      mouth: `<ellipse cx="176" cy="133" rx="9" ry="7" fill="#DA3832" stroke="#E87B25" stroke-width="4"/>`
    },
    {
      label: "Фультик: хитрый взгляд",
      eyes: `<circle cx="151" cy="98" r="9.5" fill="#1C529E"/><circle cx="154" cy="95" r="3" fill="#F9F3E2"/><circle cx="217" cy="98" r="9.5" fill="#1C529E"/><circle cx="220" cy="95" r="3" fill="#F9F3E2"/>`,
      mouth: `<path d="M161 131c8 7 22 7 30 0" stroke="#E87B25" stroke-width="5" stroke-linecap="round"/>`
    }
  ];
  let wormMoodIdx = 0;

  if (wormBtn && wormEyes && wormMouth) {
    wormBtn.addEventListener("click", () => {
      wormMoodIdx = (wormMoodIdx + 1) % WORM_MOODS.length;
      const m = WORM_MOODS[wormMoodIdx];
      wormEyes.innerHTML = m.eyes;
      wormMouth.innerHTML = m.mouth;
      if (wormMoodLabel) wormMoodLabel.textContent = m.label;
      wormBtn.classList.remove("is-popping");
      void wormBtn.offsetWidth;
      wormBtn.classList.add("is-popping");
    });
  }

  function fillKiesStrip(el) {
    if (!el) return;
    const starSvg = `<svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M14 2l3.4 7.4 8.1 1-6 5.6 1.6 8L14 20l-7.1 4 1.6-8-6-5.6 8.1-1L14 2Z" fill="#DA3832"/></svg>`;
    const coilSvg = `<svg width="64" height="22" viewBox="0 0 70 24" fill="none"><path d="M3 16c6-12 18-12 20 0 1 6-6 6-7 0-2-12 14-12 18 0 1 6-6 6-7 0-2-12 14-12 18 0 1 6-6 6-7 0-2-12 16-12 22 0" stroke="#1C529E" stroke-width="3.6" stroke-linecap="round"/></svg>`;
    el.innerHTML = Array.from({ length: 12 }, (_, i) => (i % 2 === 0 ? starSvg : coilSvg)).join("");
  }
  fillKiesStrip(document.getElementById("heroStrip"));
  fillKiesStrip(document.getElementById("footerStrip"));

  // ======================================================
  // 1. МЕСТО ОТДЫХА — KIES FLAT-VECTOR PLAYGROUND
  // ======================================================
  const blobsStage = document.getElementById("bubbles");
  const blobsCanvas = document.getElementById("blobsCanvas");
  const scatterBlobsBtn = document.getElementById("scatterBlobsBtn");
  const paletteBlobsBtn = document.getElementById("paletteBlobsBtn");
  const resetBlobsBtn = document.getElementById("resetBlobsBtn");

  const BLOB_PALETTES = {
    kies: [
      { fill: "#F2B743", stroke: "#E87B25" },
      { fill: "#DA3832", stroke: "#F9F3E2" },
      { fill: "#8AD2D2", stroke: "#F9F3E2" },
      { fill: "#F9F3E2", stroke: "#DA3832" }
    ],
    gold: [
      { fill: "#1C529E", stroke: "#F9F3E2" },
      { fill: "#DA3832", stroke: "#F9F3E2" },
      { fill: "#8AD2D2", stroke: "#1C529E" },
      { fill: "#F9F3E2", stroke: "#1C529E" }
    ],
    red: [
      { fill: "#F2B743", stroke: "#F9F3E2" },
      { fill: "#8AD2D2", stroke: "#1C529E" },
      { fill: "#F9F3E2", stroke: "#1C529E" },
      { fill: "#1C529E", stroke: "#F2B743" }
    ]
  };

  const PALETTE_ORDER = ["kies", "gold", "red"];
  const PALETTE_NAMES = { kies: "Палитра: KIES", gold: "Палитра: Жёлтый", red: "Палитра: Красный" };

  let blobPaletteKey = "kies";
  let blobs = [];
  let cw = 1200;
  let ch = 600;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let draggedBlob = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let lastPtrX = 0;
  let lastPtrY = 0;
  let pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
  let stageVisible = true;

  if ("IntersectionObserver" in window && blobsStage) {
    new IntersectionObserver((entries) => {
      stageVisible = entries[0]?.isIntersecting ?? true;
    }).observe(blobsStage);
  }

  function resizeBlobsCanvas() {
    if (!blobsCanvas || !blobsStage) return;
    const rect = blobsStage.getBoundingClientRect();
    cw = Math.max(320, rect.width);
    ch = Math.max(460, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    blobsCanvas.width = Math.round(cw * dpr);
    blobsCanvas.height = Math.round(ch * dpr);
  }

  function createBlobs() {
    resizeBlobsCanvas();
    const scale = cw < 640 ? 0.64 : 1;
    // Playful flat-vector KIES shapes: puffy stars, worm-head pins, rounded blobs & diamonds
    const specs = [
      { rx: 0.74, ry: 0.66, r: 94 * scale, pal: 0, kind: "worm" },
      { rx: 0.52, ry: 0.34, r: 58 * scale, pal: 1, kind: "star" },
      { rx: 0.88, ry: 0.28, r: 44 * scale, pal: 2, kind: "blob" },
      { rx: 0.44, ry: 0.74, r: 54 * scale, pal: 2, kind: "blob" },
      { rx: 0.18, ry: 0.66, r: 46 * scale, pal: 0, kind: "star" },
      { rx: 0.66, ry: 0.24, r: 38 * scale, pal: 3, kind: "diamond" },
      { rx: 0.32, ry: 0.80, r: 36 * scale, pal: 1, kind: "blob" },
      { rx: 0.84, ry: 0.82, r: 48 * scale, pal: 3, kind: "star" }
    ];

    blobs = specs.map((sp, i) => ({
      x: cw * sp.rx,
      y: ch * sp.ry,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      baseR: sp.r / scale,
      r: sp.r,
      pal: sp.pal,
      kind: sp.kind,
      rot: (i * 0.5) % (Math.PI * 2),
      vrot: (Math.random() - 0.5) * 0.012,
      seed: i * 1.7 + Math.random() * 4,
      speed: 0.65 + (i % 3) * 0.18,
      squash: 0,
      squashAngle: 0
    }));
  }

  function drawKiesToken(ctx, b, t, palette) {
    const p = palette[b.pal % palette.length];
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rot + Math.sin(t * 0.7 + b.seed) * 0.06);

    if (b.kind === "worm") {
      // Flat-vector KIES Worm Pin Badge!
      const r = b.r;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#F2B743";
      ctx.fill();
      ctx.lineWidth = Math.max(3, r * 0.06);
      ctx.strokeStyle = "#E87B25";
      ctx.stroke();

      // Cream worm face
      ctx.beginPath();
      ctx.ellipse(0, r * 0.06, r * 0.58, r * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#F9F3E2";
      ctx.fill();

      // Racing Red hood arc
      ctx.beginPath();
      ctx.arc(0, r * 0.04, r * 0.58, Math.PI * 1.05, Math.PI * 1.95);
      ctx.quadraticCurveTo(0, -r * 0.2, -r * 0.57, -r * 0.05);
      ctx.fillStyle = "#DA3832";
      ctx.fill();

      // Chunky red glasses frames
      const gw = r * 0.44;
      const gh = r * 0.34;
      const gy = -r * 0.18;
      ctx.fillStyle = "#F9F3E2";
      ctx.strokeStyle = "#DA3832";
      ctx.lineWidth = Math.max(3, r * 0.085);
      ctx.beginPath();
      ctx.roundRect(-gw - r * 0.05, gy, gw, gh, r * 0.11);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(r * 0.05, gy, gw, gh, r * 0.11);
      ctx.fill();
      ctx.stroke();

      // Steel Azure X and O eyes
      ctx.strokeStyle = "#1C529E";
      ctx.lineWidth = Math.max(2.6, r * 0.07);
      ctx.lineCap = "round";
      const lx = -r * 0.27;
      const ey = gy + gh * 0.5;
      const es = r * 0.09;
      ctx.beginPath();
      ctx.moveTo(lx - es, ey - es);
      ctx.lineTo(lx + es, ey + es);
      ctx.moveTo(lx + es, ey - es);
      ctx.lineTo(lx - es, ey + es);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(r * 0.27, ey, r * 0.1, 0, Math.PI * 2);
      ctx.stroke();

      // Wavy smile
      ctx.strokeStyle = "#E87B25";
      ctx.lineWidth = Math.max(2.4, r * 0.06);
      ctx.beginPath();
      ctx.moveTo(-r * 0.18, r * 0.3);
      ctx.quadraticCurveTo(-r * 0.09, r * 0.42, 0, r * 0.3);
      ctx.quadraticCurveTo(r * 0.09, r * 0.42, r * 0.18, r * 0.3);
      ctx.stroke();
    } else if (b.kind === "star") {
      // KIES puffy 5-point flat vector star
      const spikes = 5;
      const outer = b.r;
      const inner = b.r * 0.52;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const rad = i % 2 === 0 ? outer : inner;
        const a = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.lineJoin = "round";
      ctx.fillStyle = p.fill;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = p.stroke;
      ctx.stroke();
    } else if (b.kind === "diamond") {
      // KIES nested rotated square
      const s = b.r * 1.15;
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = p.fill;
      ctx.beginPath();
      ctx.roundRect(-s * 0.5, -s * 0.5, s, s, 8);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = p.stroke;
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-s * 0.28, -s * 0.28, s * 0.56, s * 0.56, 4);
      ctx.stroke();
    } else {
      // Flat-vector bouncy squishy blob (lineless with clean crisp edge)
      const steps = 14;
      const pts = [];
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const wob = Math.sin(a * 2 + t * b.speed + b.seed) * 0.09 + Math.cos(a * 3 - t * 0.7 + b.seed) * 0.05;
        const rad = b.r * (1 + wob);
        pts.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad });
      }
      ctx.beginPath();
      ctx.moveTo((pts[steps - 1].x + pts[0].x) * 0.5, (pts[steps - 1].y + pts[0].y) * 0.5);
      for (let i = 0; i < steps; i++) {
        const curr = pts[i];
        const next = pts[(i + 1) % steps];
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) * 0.5, (curr.y + next.y) * 0.5);
      }
      ctx.closePath();
      ctx.fillStyle = p.fill;
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = p.stroke;
      ctx.stroke();
    }

    ctx.restore();
  }

  function stepBlobs(now) {
    if (!blobsCanvas) return;
    const ctx = blobsCanvas.getContext("2d");
    if (stageVisible && ctx) {
      const t = prefersReduced ? 1.2 : now * 0.0012;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const pad = 16;
      for (const b of blobs) {
        if (b !== draggedBlob) {
          if (!prefersReduced) {
            b.vx += Math.sin(t * 0.55 + b.seed) * 0.014;
            b.vy += Math.cos(t * 0.48 + b.seed * 1.4) * 0.014;
            b.rot += b.vrot;
          }

          if (pointer.active && !draggedBlob) {
            const dx = b.x - pointer.x;
            const dy = b.y - pointer.y;
            const dist = Math.hypot(dx, dy) || 1;
            const reach = b.r + 115;
            if (dist < reach) {
              const force = (1 - dist / reach) * 0.9;
              b.vx += (dx / dist) * force + pointer.vx * 0.045;
              b.vy += (dy / dist) * force + pointer.vy * 0.045;
            }
          }

          b.vx *= 0.968;
          b.vy *= 0.968;
          b.x += b.vx;
          b.y += b.vy;

          const minX = pad;
          const maxX = cw - pad;
          const minY = pad;
          const maxY = ch - pad;

          if (b.x - b.r < minX) { b.x = minX + b.r; b.vx = Math.abs(b.vx) * 0.72; }
          else if (b.x + b.r > maxX) { b.x = maxX - b.r; b.vx = -Math.abs(b.vx) * 0.72; }
          if (b.y - b.r < minY) { b.y = minY + b.r; b.vy = Math.abs(b.vy) * 0.72; }
          else if (b.y + b.r > maxY) { b.y = maxY - b.r; b.vy = -Math.abs(b.vy) * 0.72; }
        }
      }

      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i];
          const b = blobs[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minDist = (a.r + b.r) * 1.04;
          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const push = (minDist - dist) * 0.06;
            if (a !== draggedBlob) { a.vx -= nx * push; a.vy -= ny * push; }
            if (b !== draggedBlob) { b.vx += nx * push; b.vy += ny * push; }
          }
        }
      }

      const palette = BLOB_PALETTES[blobPaletteKey];
      const sorted = [...blobs].sort((a, b) => a.r - b.r);
      for (const b of sorted) {
        drawKiesToken(ctx, b, t, palette);
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
    // Check largest/topmost first
    const hitOrder = [...blobs].sort((a, b) => b.r - a.r);
    const hit = hitOrder.find((b) => Math.hypot(pos.x - b.x, pos.y - b.y) <= b.r * 1.05);
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
      // Soft radial wave push from clicked empty spot
      for (const b of blobs) {
        const dx = b.x - pos.x;
        const dy = b.y - pos.y;
        const dist = Math.hypot(dx, dy) || 1;
        const power = Math.max(2, 16 - dist * 0.022);
        b.vx += (dx / dist) * power;
        b.vy += (dy / dist) * power;
        b.squash = 0.85;
        b.squashAngle = Math.atan2(dy, dx);
      }
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
      draggedBlob.vx = (pos.x - lastPtrX) * 0.9;
      draggedBlob.vy = (pos.y - lastPtrY) * 0.9;
      draggedBlob.x = pos.x + dragOffsetX;
      draggedBlob.y = pos.y + dragOffsetY;
      draggedBlob.squash = Math.min(1, Math.hypot(draggedBlob.vx, draggedBlob.vy) * 0.04);
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

  scatterBlobsBtn.addEventListener("click", () => {
    for (const b of blobs) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 8 + Math.random() * 14;
      b.vx += Math.cos(angle) * spd;
      b.vy += Math.sin(angle) * spd;
      b.squash = 0.9;
      b.squashAngle = angle;
    }
  });

  paletteBlobsBtn.addEventListener("click", () => {
    const idx = (PALETTE_ORDER.indexOf(blobPaletteKey) + 1) % PALETTE_ORDER.length;
    blobPaletteKey = PALETTE_ORDER[idx];
    blobsStage.classList.toggle("is-gold-pal", blobPaletteKey === "gold");
    blobsStage.classList.toggle("is-red-pal", blobPaletteKey === "red");
    paletteBlobsBtn.textContent = PALETTE_NAMES[blobPaletteKey];
  });

  resetBlobsBtn.addEventListener("click", createBlobs);
  window.addEventListener("resize", () => {
    resizeBlobsCanvas();
    const scale = cw < 640 ? 0.64 : 1;
    for (const b of blobs) {
      b.r = b.baseR * scale;
      b.x = Math.min(cw - b.r, Math.max(b.r, b.x));
      b.y = Math.min(ch - b.r, Math.max(b.r, b.y));
    }
  });

  createBlobs();
  requestAnimationFrame(stepBlobs);

  // ======================================================
  // 2. GENERATORS STUDIO (CINFO / KEYCARD / THEME)
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
        if (panel) panel.hidden = key !== target;
      });
    });
  });

  // 2A. CINFO GENERATOR
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

  // 2B. KEYCARD GENERATOR
  const KC_PRESETS = {
    sb: { type: "KeycardCustomMetalCase", dept: "Служба Безопасности", role: "Лейтенант СБ", callsign: "Агент Рейнольдс", c: "2", a: "2", m: "2", cls: "C", bg: "#262b36", acc: "#7cc4ff" },
    sci: { type: "KeycardCustomSite02", dept: "Научная служба", role: "Доктор Феликс", callsign: "Сектор B-04", c: "3", a: "0", m: "1", cls: "B", bg: "#1e293b", acc: "#facc15" },
    mtf: { type: "KeycardCustomTaskForce", dept: "МОГ Ню-7", role: "Командир отряда", callsign: "Молот-1", c: "3", a: "3", m: "2", cls: "A", bg: "#172038", acc: "#3b82f6" },
    admin: { type: "KeycardCustomManagement", dept: "Администрация комплекса", role: "Директор Зоны", callsign: "O5-Допуск", c: "3", a: "3", m: "3", cls: "A", bg: "#1c1917", acc: "#ff6428" }
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
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    const bg = kcBg.value;
    const acc = kcAccent.value;

    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, 960, 560, 32);
    ctx.fill();

    ctx.fillStyle = acc;
    ctx.fillRect(0, 0, 20, 560);

    ctx.fillStyle = "rgba(255,255,255,0.68)";
    ctx.font = "600 22px monospace";
    ctx.fillText("КАРТА ДОСТУПА / FULT-ENGINE", 54, 68);
    ctx.textAlign = "right";
    ctx.fillText(kcType.value.replace("KeycardCustom", ""), 906, 68);
    ctx.textAlign = "left";

    ctx.fillStyle = acc;
    ctx.font = "700 42px sans-serif";
    ctx.fillText(kcDept.value.trim() || "Служба", 54, 140);

    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 3;
    ctx.strokeRect(54, 190, 120, 140);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 32px monospace";
    ctx.fillText("ID", 92, 272);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 34px sans-serif";
    ctx.fillText(kcRole.value.trim() || "Сотрудник", 206, 232);
    ctx.fillStyle = "#d1d5db";
    ctx.font = "500 26px monospace";
    ctx.fillText(`Допуск: ${kcPermCont.value} / ${kcPermArm.value} / ${kcPermAdm.value}`, 206, 282);
    ctx.fillText(`Класс:  ${kcClass.value}`, 206, 322);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.18)";
        ctx.fillRect(770 + c * 32, 196 + r * 32, 24, 24);
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(54, 444, 852, 2);
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "500 24px monospace";
    ctx.fillText("Срок: до 01.01.2028", 54, 500);
    ctx.textAlign = "right";
    ctx.fillText(kcCallsign.value.trim() || "Позывной", 906, 500);

    const a = document.createElement("a");
    a.download = `fult-keycard-${(kcRole.value || "card").toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    showToast("Карточка сохранена в PNG");
  });

  renderKeycard();

  // 2C. THEME.YML DESIGNER
  const THEME_PRESETS = {
    lava: { accent: "#f26849", good: "#34d399", warn: "#e59838", bad: "#fb7185" },
    tactical: { accent: "#38bdf8", good: "#22c55e", warn: "#f59e0b", bad: "#ef4444" },
    contrast: { accent: "#facc15", good: "#4ade80", warn: "#fb923c", bad: "#f43f5e" },
    mint: { accent: "#2dd4bf", good: "#34d399", warn: "#a78bfa", bad: "#fb7185" }
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
  const tpBtns = document.querySelectorAll("#sbTheme .tp-btn");

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
    hudRoleBadge.style.borderLeft = `3px solid ${colors.accent}`;

    const raw = esc(hintInput.value);
    hudPreview.innerHTML = raw.replace(
      /&lt;color=@(accent|good|warn|bad)&gt;([\s\S]*?)&lt;\/color&gt;/gi,
      (_, key, inner) => `<span style="color:${colors[key.toLowerCase()]};font-weight:600">${inner}</span>`
    ) || "<span style='opacity:0.5'>Введите текст хинта слева...</span>";

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
    try { await navigator.clipboard.writeText(themeYamlOut.textContent); showToast("Theme.yml скопирован в буфер"); }
    catch { showToast("Не удалось скопировать"); }
  });
  renderThemePreview();

  // ======================================================
  // 3. MODULE SHOP & CART DRAWER
  // ======================================================
  const CART_KEY = "fult_engine_cart_v2";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { cart = []; }

  const cartCountEl = document.getElementById("cartCount");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartItemsEl = document.getElementById("cartItems");
  const cartItemCountEl = document.getElementById("cartItemCount");
  const cartDiscountRow = document.getElementById("cartDiscountRow");
  const cartDiscountVal = document.getElementById("cartDiscountVal");
  const cartTotalEl = document.getElementById("cartTotal");
  const orderReceipt = document.getElementById("orderReceipt");
  const receiptId = document.getElementById("receiptId");
  const receiptText = document.getElementById("receiptText");

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
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
    return { subtotal, discount, discRate, total: Math.max(0, subtotal - discount) };
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
    const { discount, discRate, total } = calcCart();

    if (discount > 0) {
      cartDiscountRow.hidden = false;
      cartDiscountVal.textContent = `-${formatRub(discount)} (${Math.round(discRate * 100)}%)`;
    } else {
      cartDiscountRow.hidden = true;
    }
    cartTotalEl.textContent = formatRub(total);

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<div class="cart-empty">Корзина пуста. Выберите модули или готовый набор в магазине.</div>`;
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
    const { discount, total } = calcCart();
    const code = `FULT-${Math.floor(1000 + Math.random() * 9000)}`;
    const lines = [
      `Заказ: #${code}`,
      `Контакт: ${contact}`,
      `Позиции (${cart.length}):`,
      ...cart.map((it) => `  - ${it.name} (${formatRub(it.price)})`),
      discount > 0 ? `Скидка за объём: -${formatRub(discount)}` : null,
      `Итого: ${formatRub(total)}`,
      `Отправьте эту заявку менеджеру FULT-ENGINE для получения сборки.`
    ].filter(Boolean);

    receiptId.textContent = `Заказ #${code}`;
    receiptText.textContent = lines.join("\n");
    orderReceipt.hidden = false;
    showToast(`Заявка #${code} сформирована`);
  });

  document.getElementById("copyReceiptBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(receiptText.textContent); showToast("Заявка скопирована в буфер"); }
    catch { showToast("Не удалось скопировать"); }
  });

  // ======================================================
  // 4. MODULE STORE CATALOG
  // ======================================================
  const modulesList = document.getElementById("modulesList");
  const resultsMeta = document.getElementById("resultsMeta");
  const searchInput = document.getElementById("moduleSearch");
  const catPills = document.querySelectorAll(".cat-pill");
  document.getElementById("countAll").textContent = String(MODULES.length);

  let activeCat = "all";
  let query = "";
  let expandedAll = false;

  function renderModules(animate = false) {
    const q = query.trim().toLowerCase();
    const filtered = MODULES.filter((m) => {
      if (activeCat !== "all" && m.cat !== activeCat) return false;
      if (!q) return true;
      const meta = CATEGORY_META[m.cat];
      return `${m.name} ${m.desc} ${m.cmds.join(" ")} ${meta.label}`.toLowerCase().includes(q);
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
      ? `<div class="modules-more-wrap"><button type="button" class="btn btn-line btn-sm" id="showAllModulesBtn">Показать все ${MODULES.length} модулей</button></div>`
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
    renderModules(true);
    document.getElementById("modules").scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  }

  modulesList.addEventListener("click", (e) => {
    if (e.target.closest("#showAllModulesBtn")) { expandedAll = true; renderModules(true); return; }
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
      renderModules(true);
    });
  });

  searchInput.addEventListener("input", (e) => { query = e.target.value; renderModules(false); });
  renderModules(false);
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
    { type: "section", title: "Место отдыха", sub: "Хватайте и раскидывайте органичные 3D-пузыри", badge: "#bubbles", target: "#bubbles" },
    { type: "section", title: "Генератор CINFO и карточек", sub: "Служебные бейджи Subclass и ключ-карты PNG", badge: "#sandbox", target: "#sandbox" },
    { type: "section", title: "Магазин модулей", sub: "65 модулей, наборы и скидки за объём", badge: "#modules", target: "#modules" },
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
        badge: formatRub(m.price),
        dot: CATEGORY_META[m.cat].dot
      }));

    const secMatches = SECTION_ITEMS.filter((s) => !q || `${s.title} ${s.sub}`.toLowerCase().includes(q));
    cmdkList = q ? [...modMatches, ...secMatches] : [...secMatches, ...modMatches];
    cmdkSel = 0;

    if (cmdkList.length === 0) {
      cmdkResults.innerHTML = `<div style="padding:20px;color:#565c6b;font-size:0.9rem">Ничего не найдено по запросу «${esc(q)}»</div>`;
      return;
    }

    cmdkResults.innerHTML = cmdkList
      .map((item, i) => `
        <button type="button" class="cmdk-item${i === 0 ? " is-selected" : ""}" data-idx="${i}" role="option" aria-selected="${i === 0}">
          <span class="cmdk-item-main">
            <span class="cmdk-item-title">${item.dot ? `<i class="dot ${item.dot}" aria-hidden="true"></i>` : ""}${esc(item.title)}</span>
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
