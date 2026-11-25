(() => {
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

  // Architecture layer tabs
  const expTitle = document.getElementById("expTitle");
  const expBody = document.getElementById("expBody");
  const expTags = document.getElementById("expTags");
  const expTabs = document.querySelectorAll(".exp-tab");

  expTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const layer = LAYERS[tab.dataset.layer];
      if (!layer) return;
      expTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      expTitle.textContent = layer.title;
      expBody.innerHTML = layer.body;
      expTags.innerHTML = layer.tags.map((tag) => `<span>${tag}</span>`).join("");
    });
  });

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

  function renderModules() {
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
      .map((m) => {
        const meta = CATEGORY_META[m.cat];
        const cfgPath = `LabAPI/configs/global/FULT-ENGINE/ModuleConfig/${m.name}.yml`;
        const cmdsHtml = m.cmds.length
          ? `<div class="mod-cmds">${m.cmds.map((c) => `<code>${esc(c)}</code>`).join("")}</div>`
          : "";
        return `
          <article class="mod-row">
            <button type="button" class="mod-btn" aria-expanded="false">
              <div class="mod-top">
                <strong class="mod-name">${esc(m.name)}</strong>
                <span class="mod-cat"><i class="dot ${meta.dot}" aria-hidden="true"></i>${meta.label}</span>
              </div>
              <p class="mod-desc">${esc(m.desc)}</p>
              ${cmdsHtml}
            </button>
            <div class="mod-detail">
              <span class="mod-path">${esc(cfgPath)}</span>
              <button type="button" class="mod-copy" data-copy="${esc(cfgPath)}">Скопировать путь</button>
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

  modulesList.addEventListener("click", async (e) => {
    if (e.target.closest("#showAllModulesBtn")) {
      expandedAll = true;
      renderModules();
      return;
    }
    const copyBtn = e.target.closest(".mod-copy");
    if (copyBtn) {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy || "");
        copyBtn.textContent = "Скопировано";
        setTimeout(() => {
          copyBtn.textContent = "Скопировать путь";
        }, 1600);
      } catch {
        copyBtn.textContent = "Ошибка";
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
      renderModules();
    });
  });

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    renderModules();
  });

  renderModules();

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
      segBtns.forEach((b) => {
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

  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy || "");
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
