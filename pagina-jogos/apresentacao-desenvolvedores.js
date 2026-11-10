(() => {
    const page = document.body;
    const authorsPanel = document.querySelector(".project-authors-panel");
    const stage = document.querySelector(".project-stage-panel");
    const game = stage ? stage.querySelector(".project-frame") : null;
    const authors = authorsPanel ? authorsPanel.querySelectorAll(".project-author-card") : [];

    if (!page.classList.contains("project-player-page") || !authorsPanel || !stage || !game || !authors.length) {
        return;
    }

    const gameSource = game.getAttribute("src");
    game.removeAttribute("src");

    const intro = document.createElement("section");
    intro.className = "developer-intro-overlay";
    intro.setAttribute("role", "dialog");
    intro.setAttribute("aria-modal", "true");
    intro.setAttribute("aria-label", "Apresentação dos desenvolvedores");

    const content = document.createElement("div");
    content.className = "developer-intro-content";

    const heading = document.createElement("h2");
    heading.className = "developer-intro-heading";
    heading.textContent = "Desenvolvedores";
    content.appendChild(heading);

    const cards = document.createElement("div");
    cards.className = "developer-intro-cards";

    authors.forEach((author) => {
        const card = document.createElement("article");
        card.className = "developer-intro-card";

        const photo = author.querySelector(".project-author-photo");
        if (photo) {
            const photoCopy = photo.cloneNode(true);
            photoCopy.classList.add("developer-intro-photo");
            cards.appendChild(card);
            card.appendChild(photoCopy);
        } else {
            cards.appendChild(card);
        }

        const name = author.querySelector("h3");
        if (name) {
            const nameCopy = document.createElement("h3");
            nameCopy.textContent = name.textContent;
            card.appendChild(nameCopy);
        }
    });

    content.appendChild(cards);
    intro.appendChild(content);
    page.classList.add("developer-intro-running");
    page.appendChild(intro);

    window.setTimeout(() => {
        if (gameSource) {
            game.setAttribute("src", gameSource);
        }
        intro.classList.add("is-fading");
        window.setTimeout(() => {
            page.classList.remove("developer-intro-running");
            intro.remove();
        }, 700);
    }, 2000);
})();
