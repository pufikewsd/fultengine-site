(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const CATEGORY_META = {
    roles: { label: "Роли и отряды", dot: "dot-cobalt" },
    scp: { label: "SCP", dot: "dot-orange" },
    facility: { label: "Комплекс", dot: "dot-emerald" },
    gameplay: { label: "Механики", dot: "dot-violet" },
    ui: { label: "Интерфейс", dot: "dot-sky" },
    admin: { label: "Сервер и админ", dot: "dot-slate" }
  };

  const MODULES = [
    // Роли и отряды (5)
    { name: "Subclass", cat: "roles", desc: "Выдаёт подклассы ролей: состав, предметы, имена учёных и описание персонажа.", cmds: ["Configs/subclasses.yml"] },
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
  ];

  function esc(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Toast helper
  const toastEl = document.getElementById("toast");
  let toastTimer = 0;
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-shown");
    }, 2200);
  }

  // Scroll progress & header nav indicator
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
    navIndicator.style.transform = `translate3d(${linkRect.left - navRect.left}px, -50%, 0)`;
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

  // Scroll reveals & counters
  function animateCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || prefersReduced) return;
    const duration = target > 1000 ? 950 : 650;
    const start = performance.now();
    const fmt = new Intl.NumberFormat("ru-RU");
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt.format(target);
    }
    requestAnimationFrame(step);
  }

  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll("[data-reveal]").forEach((el) => revealObs.observe(el));

    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll("[data-count]").forEach((el) => countObs.observe(el));
  } else {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  }

  // Smooth 3D tilt + magnetic buttons
  if (!prefersReduced && finePointer) {
    const tiltEls = Array.from(document.querySelectorAll("[data-tilt]"));
    const states = tiltEls.map((el, i) => ({
      el,
      inner: el.querySelector(".tilt-inner"),
      sheen: el.querySelector(".tilt-sheen"),
      tx: 0, ty: 0, cx: 0, cy: 0, hovering: false, phase: i * 1.9, visible: true
    }));

    if ("IntersectionObserver" in window) {
      const visObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const st = states.find((s) => s.el === e.target);
          if (st) st.visible = e.isIntersecting;
        });
      });
      states.forEach((s) => visObs.observe(s.el));
    }

    states.forEach((s) => {
      s.el.addEventListener("pointermove", (e) => {
        const rect = s.el.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        s.tx = (0.5 - ny) * 10;
        s.ty = (nx - 0.5) * 12;
        s.hovering = true;
        if (s.sheen) {
          s.sheen.style.setProperty("--mx", `${(nx * 100).toFixed(1)}%`);
          s.sheen.style.setProperty("--my", `${(ny * 100).toFixed(1)}%`);
        }
      });
      s.el.addEventListener("pointerleave", () => { s.tx = 0; s.ty = 0; s.hovering = false; });
    });

    function tickTilt(now) {
      const t = now * 0.0014;
      for (const s of states) {
        if (!s.visible || !s.inner) continue;
        s.cx += (s.tx - s.cx) * 0.09;
        s.cy += (s.ty - s.cy) * 0.09;
        const floatY = s.hovering ? 0 : Math.sin(t + s.phase) * 5;
        const floatR = s.hovering ? 0 : Math.cos(t * 0.7 + s.phase) * 0.6;
        s.inner.style.transform = `translate3d(0, ${floatY.toFixed(2)}px, 0) rotateX(${s.cx.toFixed(2)}deg) rotateY(${(s.cy + floatR).toFixed(2)}deg)`;
      }
      requestAnimationFrame(tickTilt);
    }
    requestAnimationFrame(tickTilt);

    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  // ======================================================
  // 1. INTERACTIVE BUILD CONFIGURATOR (COBALT BAND)
  // ======================================================
  const PRESETS = {
    full: { roles: true, scp: true, facility: true, gameplay: true, ui: true, admin: true },
    event: { roles: true, scp: true, facility: false, gameplay: false, ui: true, admin: true },
    minimal: { roles: false, scp: false, facility: false, gameplay: false, ui: true, admin: true }
  };

  const cfgModuleCount = document.getElementById("cfgModuleCount");
  const cfgStats = document.getElementById("cfgStats");
  const cfgCode = document.getElementById("cfgCode");
  const presetBtns = document.querySelectorAll(".preset-btn");
  const subCheckboxes = Array.from(document.querySelectorAll("#subsystemList input[data-sub]"));

  function getSelectedSubs() {
    const map = {};
    subCheckboxes.forEach((cb) => { map[cb.dataset.sub] = cb.checked; });
    return map;
  }

  function renderBuildConfig() {
    const sel = getSelectedSubs();
    const enabledCats = Object.keys(sel).filter((k) => sel[k]);
    const activeMods = MODULES.filter((m) => sel[m.cat]);
    const modeName = activeMods.length === 0 ? "off" : "rp";

    cfgModuleCount.textContent = String(activeMods.length);
    cfgStats.textContent = `${activeMods.length} модулей / ${enabledCats.length} подсистем / режим ${modeName.toUpperCase()}`;

    const lines = [
      "# Конфиг FULT-ENGINE v2.0 (собран в веб-конструкторе)",
      `default_mode: ${modeName}`,
      "debug: false",
      "subsystems:",
      ...Object.keys(CATEGORY_META).map((k) => `  ${k}: ${sel[k] ? "true" : "false"}`),
      `enabled_modules: # всего ${activeMods.length}`
    ];

    if (activeMods.length === 0) {
      lines.push("  [] # все модули выключены");
    } else {
      const preview = activeMods.slice(0, 14);
      preview.forEach((m) => lines.push(`  - ${m.name}`));
      if (activeMods.length > preview.length) {
        lines.push(`  # ... и ещё ${activeMods.length - preview.length} модулей`);
      }
    }

    cfgCode.textContent = lines.join("\n");
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = PRESETS[btn.dataset.preset];
      if (!preset) return;
      presetBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      subCheckboxes.forEach((cb) => { cb.checked = Boolean(preset[cb.dataset.sub]); });
      renderBuildConfig();
    });
  });

  subCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      presetBtns.forEach((b) => b.classList.remove("is-active"));
      renderBuildConfig();
    });
  });

  document.getElementById("copyCfgBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(cfgCode.textContent);
      showToast("FultEngine.yml скопирован");
    } catch {
      showToast("Не удалось скопировать");
    }
  });

  document.getElementById("downloadCfgBtn").addEventListener("click", () => {
    const blob = new Blob([cfgCode.textContent + "\n"], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FultEngine.yml";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Файл FultEngine.yml скачан");
  });

  renderBuildConfig();

  // ======================================================
  // 2. INTERACTIVE SANDBOX: THEME.YML + COMMAND CONSOLE
  // ======================================================
  const sbTabs = document.querySelectorAll(".sb-tab");
  const sbTheme = document.getElementById("sbTheme");
  const sbConsole = document.getElementById("sbConsole");

  sbTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const isTheme = tab.dataset.sb === "theme";
      sbTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      sbTheme.hidden = !isTheme;
      sbConsole.hidden = isTheme;
      if (!isTheme) document.getElementById("consoleInput").focus();
    });
  });

  // Theme.yml Live Studio
  const THEME_PRESETS = {
    studio: { accent: "#2347f2", good: "#16a34a", warn: "#ff6428", bad: "#e11d48" },
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
  const tpBtns = document.querySelectorAll(".tp-btn");

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
    const rendered = raw.replace(
      /&lt;color=@(accent|good|warn|bad)&gt;([\s\S]*?)&lt;\/color&gt;/gi,
      (_, key, inner) => `<span style="color:${colors[key.toLowerCase()]};font-weight:600">${inner}</span>`
    );
    hudPreview.innerHTML = rendered || "<span style='opacity:0.5'>Введите текст хинта слева...</span>";

    themeYamlOut.textContent = [
      "# LabAPI/configs/global/FULT-ENGINE/ModuleConfig/Theme.yml",
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
    try {
      await navigator.clipboard.writeText(themeYamlOut.textContent);
      showToast("Theme.yml скопирован в буфер");
    } catch {
      showToast("Не удалось скопировать");
    }
  });

  renderThemePreview();

  // Interactive Command Console
  const consoleLog = document.getElementById("consoleLog");
  const consoleForm = document.getElementById("consoleForm");
  const consoleInput = document.getElementById("consoleInput");
  const cDot = document.getElementById("cDot");
  const cModeLabel = document.getElementById("cModeLabel");
  const cActiveModules = document.getElementById("cActiveModules");
  const cassieBanner = document.getElementById("cassieBanner");
  const cassieText = document.getElementById("cassieText");

  const simState = {
    mode: "rp",
    requests: [
      { id: 14, squad: "МОГ Ню-7 «Удар молота»", author: "Доктор Иван Золо" },
      { id: 15, squad: "Отряд Ро-9", author: "Доктор Феликс" }
    ],
    cassieIdx: 0
  };

  const CASSIE_PRESETS = [
    "Внимание. В секторе тяжёлого содержания объявлен код Красный.",
    "Отряд МОГ Ню-7 «Удар молота» прибыл на КПП. Всем сотрудникам оставаться на местах.",
    "Протокол 106-N активирован. Зачистка сектора начнётся через 15 секунд."
  ];

  let cassieHideTimer = 0;

  function logTime() {
    return new Date().toTimeString().slice(0, 8);
  }

  function pushLog(cls, tag, text) {
    const div = document.createElement("div");
    div.className = "clog-row";
    div.innerHTML = `<span class="clog-time">[${logTime()}]</span> <span class="${cls}">${tag}</span> ${esc(text)}`;
    consoleLog.appendChild(div);
    consoleLog.scrollTop = consoleLog.scrollHeight;
  }

  function syncConsoleHeader() {
    const isOn = simState.mode === "rp";
    cDot.classList.toggle("is-off", !isOn);
    cModeLabel.textContent = isOn ? "Режим: RP" : "Режим: OFF";
    cActiveModules.textContent = isOn ? "Активно модулей: 65" : "Активно модулей: 0";
  }

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    pushLog("clog-cmd", ">", cmd);
    const parts = cmd.toLowerCase().split(/\s+/);
    const base = parts[0];

    if (base === "clear") {
      consoleLog.innerHTML = "";
      cassieBanner.hidden = true;
      return;
    }

    if (base === "help") {
      pushLog("clog-accent", "HELP", "Доступно: fultmode rp | fultmode off | cra list | cra y <№> | cas | fmem top | antiraid | clear");
      return;
    }

    if (base === "fultmode") {
      if (parts[1] === "off") {
        simState.mode = "off";
        syncConsoleHeader();
        pushLog("clog-warn", "MODE", "Все 65 модулей остановлены. Сервер переведён в базовый режим.");
      } else if (parts[1] === "rp") {
        simState.mode = "rp";
        syncConsoleHeader();
        pushLog("clog-ok", "MODE", "Режим RP включён. Загружено 65 модулей FULT-ENGINE.");
      } else {
        pushLog("clog-warn", "USAGE", "Укажите режим: fultmode rp или fultmode off");
      }
      return;
    }

    if (simState.mode === "off") {
      pushLog("clog-warn", "DENY", `Модули выключены. Сначала выполните «fultmode rp».`);
      return;
    }

    if (base === "cra") {
      if (parts[1] === "list") {
        if (simState.requests.length === 0) {
          pushLog("clog-ok", "CIR", "Активных заявок КИР нет.");
        } else {
          simState.requests.forEach((r) => {
            pushLog("clog-accent", `CIR #${r.id}`, `${r.squad} (запросил ${r.author}). Одобрить: cra y ${r.id}`);
          });
        }
        return;
      }
      if (parts[1] === "y" || parts[1] === "n") {
        const id = Number(parts[2]);
        const idx = simState.requests.findIndex((r) => r.id === id);
        if (idx === -1) {
          pushLog("clog-warn", "CIR", `Заявка #${parts[2] || "?"} не найдена. Посмотрите список: cra list`);
          return;
        }
        const [item] = simState.requests.splice(idx, 1);
        if (parts[1] === "y") {
          pushLog("clog-ok", "CIR", `Заявка #${item.id} (${item.squad}) одобрена. Отряд вызван.`);
        } else {
          pushLog("clog-warn", "CIR", `Заявка #${item.id} (${item.squad}) отклонена.`);
        }
        return;
      }
      pushLog("clog-warn", "USAGE", "Используйте: cra list, cra y <№> или cra n <№>");
      return;
    }

    if (base === "cas") {
      const msg = CASSIE_PRESETS[simState.cassieIdx % CASSIE_PRESETS.length];
      simState.cassieIdx += 1;
      cassieText.textContent = msg;
      cassieBanner.hidden = false;
      clearTimeout(cassieHideTimer);
      cassieHideTimer = setTimeout(() => { cassieBanner.hidden = true; }, 6000);
      pushLog("clog-accent", "CASSIE", `Отправлено объявление: ${msg}`);
      return;
    }

    if (base === "fmem") {
      pushLog("clog-ok", "MEM", "GC Heap: 412 MB | Unity Objects: 14 280 | Топ ассетов: MapSchematic (64 MB), AudioClips (28 MB)");
      return;
    }

    if (base === "antiraid") {
      pushLog("clog-ok", "GUARD", "AntiRaid активен. Блокировок за последние 10 минут: 0.");
      return;
    }

    pushLog("clog-warn", "ERR", `Неизвестная команда «${cmd}». Введите help для списка команд.`);
  }

  pushLog("clog-ok", "BOOT", "FULT-ENGINE v2.0 готов (LabAPI 1.1.4). Введите help или нажмите кнопку выше.");

  consoleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    runCommand(consoleInput.value);
    consoleInput.value = "";
  });

  document.querySelectorAll(".q-cmd").forEach((btn) => {
    btn.addEventListener("click", () => runCommand(btn.dataset.run));
  });

  // ======================================================
  // 3. KINETIC TICKER & MODULE CATALOG
  // ======================================================
  const tickerTrack = document.getElementById("tickerTrack");
  const FEATURED = [
    "Subclass", "InjurySystem", "BetterCassie", "Scp106Capture", "WarheadCode",
    "MemoryWatch", "RoleDistribution", "DispatchHack", "Cpc", "Turrets",
    "AntiRaid", "BackGun", "Scramble", "KillZone", "CameraWatch", "AutoMapLoader"
  ];
  const featuredItems = FEATURED.map((n) => MODULES.find((m) => m.name === n)).filter(Boolean);
  const tickerChunk = featuredItems
    .map((m) => `<button type="button" class="ticker-chip" data-pick="${m.name}"><i class="dot ${CATEGORY_META[m.cat].dot}" aria-hidden="true"></i>${m.name}</button>`)
    .join("");
  tickerTrack.innerHTML = tickerChunk + tickerChunk;

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
      modulesList.innerHTML = `<div class="mod-empty">Ничего не найдено по запросу «${esc(q)}». Очистите поиск или выберите другую категорию.</div>`;
      return;
    }

    const cardsHtml = visible
      .map((m, idx) => {
        const meta = CATEGORY_META[m.cat];
        const cfgPath = `LabAPI/configs/global/FULT-ENGINE/ModuleConfig/${m.name}.yml`;
        const cmdsHtml = m.cmds.length
          ? `<div class="mod-cmds">${m.cmds.map((c) => `<code>${esc(c)}</code>`).join("")}</div>`
          : "";
        const enterCls = animate && !prefersReduced ? " mod-enter" : "";
        const delayStyle = animate && !prefersReduced ? ` style="--md: ${Math.min(idx * 18, 180)}ms"` : "";
        return `
          <article class="mod-row${enterCls}" data-mod="${esc(m.name)}"${delayStyle}>
            <button type="button" class="mod-btn" aria-expanded="false">
              <div class="mod-top">
                <strong class="mod-name">${esc(m.name)}</strong>
                <span class="mod-top-right">
                  <span class="mod-cat"><i class="dot ${meta.dot}" aria-hidden="true"></i>${meta.label}</span>
                  <svg class="mod-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
              <p class="mod-desc">${esc(m.desc)}</p>
              ${cmdsHtml}
            </button>
            <div class="mod-detail-wrap">
              <div class="mod-detail-inner">
                <div class="mod-detail">
                  <span class="mod-path">${esc(cfgPath)}</span>
                  <button type="button" class="mod-copy" data-copy="${esc(cfgPath)}">Скопировать путь</button>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    const moreHtml = limitDefault
      ? `<div class="mod-more-wrap"><button type="button" class="mod-more-btn" id="showAllModulesBtn">Показать все ${MODULES.length} модулей</button></div>`
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
    const row = modulesList.querySelector(`[data-mod="${CSS.escape(modName)}"]`);
    if (row) {
      row.classList.add("is-open", "is-flash");
      row.querySelector(".mod-btn")?.setAttribute("aria-expanded", "true");
    }
  }

  tickerTrack.addEventListener("click", (e) => {
    const chip = e.target.closest(".ticker-chip");
    if (chip) focusModuleInCatalog(chip.dataset.pick);
  });

  modulesList.addEventListener("click", async (e) => {
    if (e.target.closest("#showAllModulesBtn")) {
      expandedAll = true;
      renderModules(true);
      return;
    }
    const copyBtn = e.target.closest(".mod-copy");
    if (copyBtn) {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy || "");
        copyBtn.textContent = "Скопировано";
        showToast("Путь к конфигу скопирован");
        setTimeout(() => { copyBtn.textContent = "Скопировать путь"; }, 1600);
      } catch {
        showToast("Не удалось скопировать");
      }
      return;
    }
    const btn = e.target.closest(".mod-btn");
    if (!btn) return;
    const row = btn.closest(".mod-row");
    const open = row.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
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

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    renderModules(false);
  });

  renderModules(false);

  // ======================================================
  // 4. CTRL+K COMMAND PALETTE
  // ======================================================
  const cmdkModal = document.getElementById("cmdkModal");
  const cmdkInput = document.getElementById("cmdkInput");
  const cmdkResults = document.getElementById("cmdkResults");
  const openCmdkBtn = document.getElementById("openCmdk");
  const closeCmdkBtn = document.getElementById("closeCmdk");

  const SECTION_ITEMS = [
    { type: "section", title: "Конструктор сборки", sub: "Собрать FultEngine.yml из пресетов и тумблеров", badge: "#engine", target: "#engine" },
    { type: "section", title: "Песочница Theme.yml и команд", sub: "Живой редактор цветов и консоль команд", badge: "#sandbox", target: "#sandbox" },
    { type: "section", title: "Топология кодовой базы", sub: "Граф graphify: 9 345 узлов и 449 сообществ", badge: "#topology", target: "#topology" },
    { type: "section", title: "Установка и NuGet", sub: "Релиз v2.0 и GitHub Packages", badge: "#install", target: "#install" }
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
        badge: m.cmds[0] || CATEGORY_META[m.cat].label,
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
    if (item.type === "module") {
      focusModuleInCatalog(item.title);
    } else if (item.target) {
      document.querySelector(item.target)?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
  }

  openCmdkBtn.addEventListener("click", openCmdk);
  closeCmdkBtn.addEventListener("click", closeCmdk);
  cmdkModal.addEventListener("click", (e) => {
    if (e.target === cmdkModal) closeCmdk();
  });

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
    if (!cmdkModal.hidden) {
      if (e.key === "Escape") { closeCmdk(); return; }
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

  // Graph toggle + Lightbox
  const graphImage = document.getElementById("graphImage");
  const graphCaption = document.getElementById("graphCaption");
  const segBtns = document.querySelectorAll(".seg-btn");
  const graphZoomBtn = document.getElementById("graphZoomBtn");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  segBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-active")) return;
      segBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      graphImage.classList.add("is-fading");
      const nextSrc = btn.dataset.src;
      const nextCaption = btn.dataset.caption;
      setTimeout(() => {
        graphImage.src = nextSrc;
        graphCaption.textContent = nextCaption;
        graphImage.classList.remove("is-fading");
      }, prefersReduced ? 0 : 150);
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    setTimeout(() => {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      graphZoomBtn.focus();
    }, prefersReduced ? 0 : 200);
  }

  graphZoomBtn.addEventListener("click", () => {
    lightboxImg.src = graphImage.src;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    lightboxClose.focus();
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  // Generic copy buttons
  document.querySelectorAll(".copy-btn[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy || "");
        const orig = btn.textContent;
        btn.textContent = "Скопировано";
        showToast("Команда скопирована в буфер");
        setTimeout(() => { btn.textContent = orig; }, 1600);
      } catch {
        showToast("Не удалось скопировать");
      }
    });
  });
})();
