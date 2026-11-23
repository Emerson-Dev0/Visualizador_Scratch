document.querySelectorAll(".project-player-page").forEach((page) => {
  const backLink = page.querySelector('.project-player-header .back-link[href*="ano-2026"], .project-player-header .back-link[href*="ano-2024"]');
  const panel = page.querySelector(".project-authors-panel");
  const authors = [...page.querySelectorAll(".project-author-card h3")]
    .map((heading) => heading.textContent.trim())
    .filter(Boolean);

  if (!backLink || !panel || authors.length === 0) return;

  const card = document.createElement("article");
  card.className = "project-group-card";

  const photo = document.createElement("div");
  photo.className = "project-group-photo";
  photo.setAttribute("role", "img");
  photo.setAttribute("aria-label", `Espaço para foto do grupo: ${authors.join(", ")}`);
  photo.textContent = "Foto do grupo";

  const label = document.createElement("h3");
  label.textContent = "Desenvolvedores";

  const names = document.createElement("p");
  names.className = "project-group-names";
  names.textContent = authors.join(" e ");

  card.append(photo, label, names);
  panel.querySelector(".project-authors")?.replaceChildren(card);
  panel.querySelector("h2")?.remove();
});
