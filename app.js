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

  const LAYERS = {
    loader: {
      title: "Единая точка входа в LabAPI",
      body: "Режим <code>RP</code> включается по умолчанию. Администратор может выключить все модули командой <code>fultmode off</code> и вернуть их обратно командой <code>fultmode rp</code> без перезапуска процесса. Почти каждый модуль наследует <code>BaseModule&lt;Config&gt;</code> из <code>API/EngineCompat</code>.",
      tags: ["LoaderModule/", "IFultEngineModule", "fultmode rp", "fultmode off"]
    },
    gameplay: {
      title: "Роли, отряды, ранения и КПК",
      body: "<code>Subclass</code> и <code>RoleDistribution</code> распределяют роли по квотам, выдают снаряжение и имена учёных (включая новых персонажей в v2.0). Внутри работают <code>InjurySystem</code> с кровотечением и переломами по частям тела, КПК с мессенджером (<code>cpc help</code>), <code>BetterCassie</code> и 17 модулей SCP.",
      tags: ["Subclass", "InjurySystem", "BetterCassie", "cra list", "cpc help"]
    },
    admin: {
      title: "Мониторинг памяти и защита от рейда",
      body: "<code>MemoryWatch</code> показывает снимки кучи, ассеты и объекты Unity (<code>fmem top</code>, <code>fmem gc</code>), <code>ServerPerf</code> убирает роли-сироты, <code>AntiRaid</code> закрывает вход при тревоге, а <code>TeleportGuard</code> возвращает игроков, провалившихся под карту.",
      tags: ["fmem top", "antiraid", "AdminToggle", "ServerPerf", "TeleportGuard"]
    },
    obf: {
      title: "Защита релизной сборки ConfuserEx2",
      body: "Перед публикацией файл <code>Fust-MODULE.dll</code> проходит через <code>_Obfuscation/FultEngine.crproj</code>: запутывание потока управления, шифрование констант, ref proxy и anti-tamper. Переименование отключено, чтобы корректно работали конфиги YamlDotNet, команды и Harmony-патчи.",
      tags: ["ConfuserEx2", "ctrl flow", "constants", "anti tamper"]
    }
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

  // Scroll progress bar & sticky header state
  const siteHeader = document.getElementById("siteHeader");
  const scrollProgress = document.getElementById("scrollProgress");
  let scrollRaf = 0;

  function updateScrollUi() {
    scrollRaf = 0;
    const y = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, y / maxScroll));
    scrollProgress.style.transform = `scaleX(${ratio})`;
    siteHeader.classList.toggle("is-scrolled", y > 24);
  }

  window.addEventListener("scroll", () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScrollUi);
  }, { passive: true });
  updateScrollUi();

  // Sliding active section pill in nav
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

  // Scroll-triggered reveals + live counters
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

  // Smooth 3D tilt + subtle floating levitation for sculptural renders
  if (!prefersReduced && finePointer) {
    const tiltEls = Array.from(document.querySelectorAll("[data-tilt]"));
    const states = tiltEls.map((el, i) => ({
      el,
      inner: el.querySelector(".tilt-inner"),
      sheen: el.querySelector(".tilt-sheen"),
      tx: 0,
      ty: 0,
      cx: 0,
      cy: 0,
      hovering: false,
      phase: i * 1.9,
      visible: true
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

      s.el.addEventListener("pointerleave", () => {
        s.tx = 0;
        s.ty = 0;
        s.hovering = false;
      });
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

    // Subtle magnetic buttons
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // Architecture layer tabs with smooth card swap
  const explorerCard = document.getElementById("explorerCard");
  const expTitle = document.getElementById("expTitle");
  const expBody = document.getElementById("expBody");
  const expTags = document.getElementById("expTags");
  const expTabs = Array.from(document.querySelectorAll(".exp-tab"));
  let swapTimer = 0;

  expTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const layer = LAYERS[tab.dataset.layer];
      if (!layer || tab.classList.contains("is-active")) return;
      expTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      clearTimeout(swapTimer);
      explorerCard.classList.add("is-swapping");
      swapTimer = setTimeout(() => {
        expTitle.textContent = layer.title;
        expBody.innerHTML = layer.body;
        expTags.innerHTML = layer.tags.map((tag) => `<span>${tag}</span>`).join("");
        explorerCard.classList.remove("is-swapping");
      }, prefersReduced ? 0 : 140);
    });
  });

  // Kinetic module ticker (interactive shortcut into catalog)
  const tickerTrack = document.getElementById("tickerTrack");
  const FEATURED = [
    "Subclass", "InjurySystem", "BetterCassie", "Scp106Capture", "WarheadCode",
    "MemoryWatch", "RoleDistribution", "DispatchHack", "Cpc", "Turrets",
    "AntiRaid", "BackGun", "Scramble", "KillZone", "CameraWatch", "AutoMapLoader"
  ];
  const featuredItems = FEATURED
    .map((name) => MODULES.find((m) => m.name === name))
    .filter(Boolean);

  function buildTickerHtml() {
    const chunk = featuredItems
      .map((m) => {
        const meta = CATEGORY_META[m.cat];
        return `<button type="button" class="ticker-chip" data-pick="${m.name}"><i class="dot ${meta.dot}" aria-hidden="true"></i>${m.name}</button>`;
      })
      .join("");
    return chunk + chunk;
  }

  tickerTrack.innerHTML = buildTickerHtml();

  // Modules explorer
  const modulesList = document.getElementById("modulesList");
  const resultsMeta = document.getElementById("resultsMeta");
  const searchInput = document.getElementById("moduleSearch");
  const catPills = document.querySelectorAll(".cat-pill");
  const countAll = document.getElementById("countAll");

  countAll.textContent = String(MODULES.length);

  let activeCat = "all";
  let query = "";
  let expandedAll = false;

  function esc(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderModules(animate = false) {
    const q = query.trim().toLowerCase();
    const filtered = MODULES.filter((m) => {
      if (activeCat !== "all" && m.cat !== activeCat) return false;
      if (!q) return true;
      const meta = CATEGORY_META[m.cat];
      const hay = `${m.name} ${m.desc} ${m.cmds.join(" ")} ${meta.label}`.toLowerCase();
      return hay.includes(q);
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

  tickerTrack.addEventListener("click", (e) => {
    const chip = e.target.closest(".ticker-chip");
    if (!chip) return;
    const modName = chip.dataset.pick;
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
        setTimeout(() => {
          copyBtn.textContent = "Скопировать путь";
        }, 1600);
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

  // Graph toggle with smooth crossfade + animated Lightbox
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
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  // Copy buttons with toast feedback
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy || "");
        const orig = btn.textContent;
        btn.textContent = "Скопировано";
        showToast("Команда скопирована в буфер");
        setTimeout(() => {
          btn.textContent = orig;
        }, 1600);
      } catch {
        showToast("Не удалось скопировать");
      }
    });
  });
})();
