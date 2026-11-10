(() => {
    document.querySelectorAll(".year-section").forEach((year) => {
        const classList = year.querySelector(".class-list");
        if (!classList) return;

        const panels = Array.from(classList.querySelectorAll(":scope > .class-section"));
        if (panels.length < 2) return;

        const navigation = document.createElement("nav");
        navigation.className = "class-carousel-nav";
        navigation.setAttribute("aria-label", "Navegação entre turmas");

        const previous = document.createElement("button");
        previous.className = "class-carousel-arrow";
        previous.type = "button";
        previous.setAttribute("aria-label", "Turma anterior");
        previous.textContent = "‹";

        const tabs = document.createElement("div");
        tabs.className = "class-carousel-tabs";
        tabs.setAttribute("role", "tablist");
        tabs.setAttribute("aria-label", "Selecionar turma");

        const next = document.createElement("button");
        next.className = "class-carousel-arrow";
        next.type = "button";
        next.setAttribute("aria-label", "Próxima turma");
        next.textContent = "›";

        const tabButtons = panels.map((panel, index) => {
            const heading = panel.querySelector(".class-title");
            const match = heading ? heading.textContent.trim().match(/T\d+/) : null;
            const label = match ? match[0] : `T${index + 1}`;
            const panelId = `${year.id}-${label.toLowerCase()}-panel`;
            const tabId = `${year.id}-${label.toLowerCase()}-tab`;

            panel.id = panelId;
            panel.setAttribute("role", "tabpanel");
            panel.setAttribute("aria-labelledby", tabId);
            panel.tabIndex = 0;
            panel.hidden = true;

            const tab = document.createElement("button");
            tab.className = "class-carousel-tab";
            tab.type = "button";
            tab.id = tabId;
            tab.setAttribute("role", "tab");
            tab.setAttribute("aria-controls", panelId);
            tab.setAttribute("aria-label", heading ? heading.textContent.trim() : label);
            tab.textContent = label;
            tab.addEventListener("click", () => select(index));
            tabs.appendChild(tab);
            return tab;
        });

        let activeIndex = 0;
        function select(index, moveFocus = false) {
            activeIndex = Math.max(0, Math.min(index, panels.length - 1));
            panels.forEach((panel, panelIndex) => {
                panel.hidden = panelIndex !== activeIndex;
                tabButtons[panelIndex].setAttribute("aria-selected", String(panelIndex === activeIndex));
                tabButtons[panelIndex].tabIndex = panelIndex === activeIndex ? 0 : -1;
                tabButtons[panelIndex].classList.toggle("is-active", panelIndex === activeIndex);
            });
            previous.disabled = activeIndex === 0;
            next.disabled = activeIndex === panels.length - 1;
            if (moveFocus) tabButtons[activeIndex].focus();
        }

        previous.addEventListener("click", () => select(activeIndex - 1));
        next.addEventListener("click", () => select(activeIndex + 1));
        tabs.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                select((activeIndex + 1) % panels.length, true);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                select((activeIndex - 1 + panels.length) % panels.length, true);
            } else if (event.key === "Home") {
                event.preventDefault();
                select(0, true);
            } else if (event.key === "End") {
                event.preventDefault();
                select(panels.length - 1, true);
            }
        });

        const carousel = document.createElement("div");
        carousel.className = "class-carousel";
        navigation.append(tabs);
        carousel.append(navigation, previous, next);
        classList.before(carousel);
        carousel.append(classList);
        select(0);
    });
})();
