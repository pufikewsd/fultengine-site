(() => {
  const CATEGORY_LABELS = {
    roles: "Роли и отряды",
    scp: "SCP",
    facility: "Комплекс и протоколы",
    gameplay: "Механики игроков",
    ui: "Интерфейс",
    admin: "Администрирование"
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

    // Комплекс и протоколы (16)
    { name: "Protocol", cat: "facility", desc: "Запускает протоколы комплекса с подтверждением.", cmds: ["protocol", "protocolapprove"] },
    { name: "ProtocolPanel", cat: "facility", desc: "Ставит физическую панель протоколов на карте.", cmds: [] },
    { name: "WarheadCode", cat: "facility", desc: "Управляет пультом диспетчерской и запуском протоколов.", cmds: ["warhead", "cirs", "protocols", "panel_block", "ro9", "cancel"] },
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
    { name: "CameraWatch", cat: "facility", desc: "Даёт смотреть в камеры и блокировать их.", cmds: ["cam look", "cam block", "cam unblock", "cam off"] },

    // Механики игроков (15)
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

    // Администрирование и сервер (8)
    { name: "AdminToggle", cat: "admin", desc: "Переключает админские режимы прямо в раунде.", cmds: ["breakdoor", "dspl", "instakill", "size"] },
    { name: "AntiRaid", cat: "admin", desc: "Защищает сервер от рейда и блокирует вход при тревоге.", cmds: ["antiraid", "lockdown", "restore", "revoke"] },
    { name: "AudioDebug", cat: "admin", desc: "Проверяет работу звуковой подсистемы сервера.", cmds: [] },
    { name: "MemoryWatch", cat: "admin", desc: "Замеряет память сервера, ассеты, объекты и сборку мусора.", cmds: ["fmem", "fmem top", "fmem assets", "fmem gc"] },
    { name: "ServerPerf", cat: "admin", desc: "Убирает роли-сироты и следит за утечками памяти.", cmds: [] },
    { name: "TeleportGuard", cat: "admin", desc: "Возвращает игроков, провалившихся под карту.", cmds: [] },
    { name: "Protections", cat: "admin", desc: "Защищает в безопасных зонах от боеголовки и тесла-ворот, бережёт двери от стрельбы.", cmds: [] },
    { name: "AutoMapLoader", cat: "admin", desc: "Подгружает схематики карты, пока сервер ждёт игроков.", cmds: [] }
  ];

  // Interactive console simulator
  const consoleOutput = document.getElementById("consoleOutput");
  const activeCount = document.getElementById("activeCount");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const cmdChips = document.querySelectorAll(".cmd-chip");

  let currentMode = "rp";

  function nowTime() {
    const d = new Date();
    return d.toTimeString().slice(0, 8);
  }

  function appendLog(levelClass, levelLabel, text) {
    const line = document.createElement("div");
    line.className = "log-line";
    line.innerHTML = `<span class="log-time">[${nowTime()}]</span> <span class="${levelClass}">${levelLabel}</span> ${text}`;
    consoleOutput.appendChild(line);
    while (consoleOutput.children.length > 9) {
      consoleOutput.removeChild(consoleOutput.firstChild);
    }
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      if (mode === currentMode) return;
      currentMode = mode;

      modeButtons.forEach((b) => {
        const active = b.dataset.mode === mode;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      if (mode === "rp") {
        activeCount.textContent = "65 / 65";
        statusDot.classList.remove("is-off");
        statusText.classList.remove("is-off");
        statusText.textContent = "ONLINE";
        appendLog("log-ok", "MODE", "fultmode rp: включены все 65 модулей FULT-ENGINE.");
      } else {
        activeCount.textContent = "0 / 65";
        statusDot.classList.add("is-off");
        statusText.classList.add("is-off");
        statusText.textContent = "STANDBY";
        appendLog("log-warn", "MODE", "fultmode off: модули остановлены, сервер переведён в базовый режим.");
      }
    });
  });

  const CMD_RESPONSES = {
    "fmem top": ["log-ok", "MEM", "GC Heap: 412 MB | Unity Objects: 14 280 | Топ: MapSchematic (64 MB)"],
    "cas": ["log-accent", "CASSIE", "Озвучен пресет: «Внимание. В секторе тяжёлого содержания объявлен код Красный»."],
    "cra list": ["log-ok", "CIR", "Активных заявок КИР: 2 (#14 МОГ Ню-7, #15 Отряд Ро-9)."],
    "scp131 give": ["log-accent", "SCP-131", "Игроку #7 выдана роль SCP-131-A. Фиксация SCP-173 активна."],
    "antiraid": ["log-warn", "GUARD", "AntiRaid: активен. Подозрительных подключений за 10 мин: 0."]
  };

  cmdChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const cmd = chip.dataset.cmd;
      if (currentMode === "off") {
        appendLog("log-warn", "DENY", `Команда «${cmd}» недоступна в режиме OFF. Включите RP.`);
        return;
      }
      const [cls, label, msg] = CMD_RESPONSES[cmd] || ["log-ok", "OK", `Выполнена команда ${cmd}`];
      appendLog(cls, label, msg);
    });
  });

  // Modules catalog rendering & filtering
  const modulesGrid = document.getElementById("modulesGrid");
  const resultsMeta = document.getElementById("resultsMeta");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("moduleSearch");
  const countAll = document.getElementById("countAll");

  countAll.textContent = String(MODULES.length);

  let selectedCat = "all";
  let searchQuery = "";

  function renderModules() {
    const q = searchQuery.trim().toLowerCase();
    const filtered = MODULES.filter((m) => {
      const matchCat = selectedCat === "all" || m.cat === selectedCat;
      if (!matchCat) return false;
      if (!q) return true;
      const haystack = `${m.name} ${m.desc} ${m.cmds.join(" ")} ${CATEGORY_LABELS[m.cat]}`.toLowerCase();
      return haystack.includes(q);
    });

    resultsMeta.textContent = `Показано ${filtered.length} из ${MODULES.length} модулей`;

    if (filtered.length === 0) {
      modulesGrid.innerHTML = `<div class="empty-state">Ничего не найдено по запросу «${q.replace(/</g, "&lt;")}». Попробуйте очистить поиск или выбрать другую категорию.</div>`;
      return;
    }

    modulesGrid.innerHTML = filtered
      .map((m) => {
        const cmdsHtml = m.cmds.length
          ? `<div class="module-cmds">${m.cmds.map((c) => `<code>${c}</code>`).join("")}</div>`
          : "";
        return `
          <article class="module-item">
            <div class="module-item-top">
              <strong class="module-name">${m.name}</strong>
              <span class="module-cat">${CATEGORY_LABELS[m.cat]}</span>
            </div>
            <p class="module-desc">${m.desc}</p>
            ${cmdsHtml}
          </article>
        `;
      })
      .join("");
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCat = btn.dataset.cat;
      filterButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      renderModules();
    });
  });

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderModules();
  });

  renderModules();

  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = "Скопировано";
        setTimeout(() => {
          btn.textContent = orig;
        }, 1800);
      } catch {
        btn.textContent = "Не удалось скопировать";
      }
    });
  });
})();
