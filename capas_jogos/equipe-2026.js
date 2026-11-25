document.querySelectorAll(".project-player-page").forEach((page) => {
  const backLink = page.querySelector('.project-player-header .back-link[href*="ano-2026"], .project-player-header .back-link[href*="ano-2024"], .project-player-header .back-link[href*="ano-2023"]');
  const panel = page.querySelector(".project-authors-panel");
  const year = backLink?.getAttribute("href").match(/ano-(2023|2024|2026)/)?.[1];
  const authors = [...page.querySelectorAll(".project-author-card h3")]
    .map((heading) => heading.textContent.trim())
    .filter(Boolean);

  if (!backLink || !panel || authors.length === 0) return;

  const card = document.createElement("article");
  card.className = "project-group-card";

  const turmaMatch = window.location.pathname.match(/(2023|2024|2026)-t([1-4])-/i);
  const turma = turmaMatch?.[1] === year ? turmaMatch[2] : null;
  const classPhotos = {
    "2023-1": "../FTS_Turmas/2023/T1-Quinta-feira-tarde.png",
    "2023-2": "../FTS_Turmas/2023/T2%20-Sexta-feira-Manh%C3%A3.png",
    "2023-3": "../FTS_Turmas/2023/T3-Sexta-feira-tarde.png",
    "2023-4": "../FTS_Turmas/2023/T4%20-S%C3%A1bado-Manh%C3%A3.png",
    "2024-1": "../FTS_Turmas/2024/T1-Quinta-feira-tarde.png",
    "2024-2": "../FTS_Turmas/2024/T2-Sexta-feira-manh%C3%A3.png",
    "2024-3": "../FTS_Turmas/2024/T3-Sexta-feira-tarde.png",
    "2026-1": "../FTS_Turmas/2026/Turma_quinta_manh%C3%A32026.png",
    "2026-3": "../FTS_Turmas/2026/Turma-s%C3%A1bado-manh%C3%A3.png"
  };
  const classPhoto = turma ? classPhotos[`${year}-${turma}`] : null;
  const photo = classPhoto ? document.createElement("img") : document.createElement("div");
  photo.className = "project-group-photo";
  if (classPhoto) {
    photo.src = classPhoto;
    photo.alt = `Foto da turma T${turma} de ${year}`;
    photo.loading = "lazy";
  } else {
    photo.setAttribute("role", "img");
    photo.setAttribute("aria-label", `Espaço para foto do grupo: ${authors.join(", ")}`);
    photo.textContent = "Foto do grupo";
  }

  const label = document.createElement("h3");
  label.textContent = "Desenvolvedores";

  const names = document.createElement("p");
  names.className = "project-group-names";
  names.textContent = authors.join(" e ");

  card.append(photo, label, names);
  panel.querySelector(".project-authors")?.replaceChildren(card);
  panel.querySelector("h2")?.remove();
});
