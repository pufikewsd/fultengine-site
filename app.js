(() => {
  const CATEGORY_LABELS = {
    roles: "Роли и отряды",
    scp: "SCP",
    facility: "Комплекс",
    gameplay: "Механики",
    ui: "Интерфейс",
    admin: "Сервер и админ"
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

  // Solid header once scrolled past hero top
  const topbar = document.getElementById("topbar");
  function syncHeader() {
    topbar.classList.toggle("is-solid", window.scrollY > 48);
  }
  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: "instant" });
      syncHeader();
    }
  }

  // Editorial chapters accordion
  document.querySelectorAll(".chapter-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".chapter-item");
      const wasOpen = item.classList.contains("is-open");
      document.querySelectorAll(".chapter-item").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".chapter-trigger").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Archival paper registry
  const registryList = document.getElementById("registryList");
  const resultsMeta = document.getElementById("resultsMeta");
  const searchInput = document.getElementById("moduleSearch");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const countAll = document.getElementById("countAll");

  countAll.textContent = String(MODULES.length);

  let activeCat = "all";
  let query = "";
  let showAllInDefault = false;

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderRegistry() {
    const q = query.trim().toLowerCase();
    const filtered = MODULES.map((m, idx) => ({ ...m, num: idx + 1 })).filter((m) => {
      if (activeCat !== "all" && m.cat !== activeCat) return false;
      if (!q) return true;
      const hay = `${m.name} ${m.desc} ${m.cmds.join(" ")} ${CATEGORY_LABELS[m.cat]}`.toLowerCase();
      return hay.includes(q);
    });

    const limitDefault = activeCat === "all" && !q && !showAllInDefault;
    const visible = limitDefault ? filtered.slice(0, 16) : filtered;

    resultsMeta.textContent = limitDefault
      ? `Показано ${visible.length} из ${MODULES.length}`
      : `Найдено ${filtered.length} из ${MODULES.length}`;

    if (filtered.length === 0) {
      registryList.innerHTML = `<div class="reg-empty">Ничего не найдено по запросу «${escapeHtml(q)}». Очистите поле поиска или переключите категорию.</div>`;
      return;
    }

    const rowsHtml = visible
      .map((m) => {
        const idxStr = String(m.num).padStart(2, "0");
        const cfgPath = `LabAPI/configs/global/FULT-ENGINE/ModuleConfig/${m.name}.yml`;
        const cmdsHtml = m.cmds.length
          ? `<span class="reg-cmds">${m.cmds.map((c) => `<code>${escapeHtml(c)}</code>`).join("")}</span>`
          : `<span class="reg-cmds"></span>`;

        return `
          <div class="reg-row">
            <button type="button" class="reg-row-btn" aria-expanded="false">
              <span class="reg-idx">${idxStr}</span>
              <span class="reg-name">${escapeHtml(m.name)}</span>
              <span class="reg-cat">${CATEGORY_LABELS[m.cat]}</span>
              <span class="reg-desc">${escapeHtml(m.desc)}</span>
              ${cmdsHtml}
            </button>
            <div class="reg-detail">
              <span class="reg-detail-path">Конфиг: ${escapeHtml(cfgPath)}</span>
              <button type="button" class="reg-copy-btn" data-copy="${escapeHtml(cfgPath)}">Скопировать путь</button>
            </div>
          </div>
        `;
      })
      .join("");

    const moreHtml = limitDefault
      ? `<div class="reg-more-wrap"><button type="button" class="reg-more-btn" id="showAllModulesBtn">Показать все ${MODULES.length} модулей</button></div>`
      : "";

    registryList.innerHTML = rowsHtml + moreHtml;
  }

  registryList.addEventListener("click", async (e) => {
    const moreBtn = e.target.closest("#showAllModulesBtn");
    if (moreBtn) {
      showAllInDefault = true;
      renderRegistry();
      return;
    }

    const copyBtn = e.target.closest(".reg-copy-btn");
    if (copyBtn) {
      e.stopPropagation();
      const text = copyBtn.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Скопировано";
        setTimeout(() => {
          copyBtn.textContent = "Скопировать путь";
        }, 1600);
      } catch {
        copyBtn.textContent = "Ошибка копирования";
      }
      return;
    }

    const rowBtn = e.target.closest(".reg-row-btn");
    if (!rowBtn) return;
    const row = rowBtn.closest(".reg-row");
    const isOpen = row.classList.toggle("is-open");
    rowBtn.setAttribute("aria-expanded", String(isOpen));
  });

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCat = btn.dataset.cat;
      tabButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      renderRegistry();
    });
  });

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    renderRegistry();
  });

  renderRegistry();

  // Graph view switcher + lightbox
  const graphImage = document.getElementById("graphImage");
  const graphCaption = document.getElementById("graphCaption");
  const graphSwitchBtns = document.querySelectorAll(".switch-btn");
  const graphZoomBtn = document.getElementById("graphZoomBtn");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  graphSwitchBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      graphSwitchBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      graphImage.src = btn.dataset.src;
      graphCaption.textContent = btn.dataset.caption;
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    graphZoomBtn.focus();
  }

  graphZoomBtn.addEventListener("click", () => {
    lightboxImg.src = graphImage.src;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  // Inline command copy buttons
  document.querySelectorAll(".copy-inline").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = "Скопировано";
        setTimeout(() => {
          btn.textContent = orig;
        }, 1600);
      } catch {
        btn.textContent = "Ошибка";
      }
    });
  });
})();
