(() => {
  const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
  const grid = document.getElementById("projectGrid");
  const searchInput = document.getElementById("searchInput");
  const filterRow = document.getElementById("filterRow");
  const emptyState = document.getElementById("emptyState");
  const visibleCount = document.getElementById("visibleCount");
  const projectCount = document.getElementById("projectCount");
  const modal = document.getElementById("projectModal");
  const toast = document.getElementById("toast");
  let activeCategory = "All";
  let selectedProject = null;
  let toastTimer;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function cardTemplate(project) {
    return `<article class="project-card">
      <div class="card-art" style="--artcolor:${escapeHTML(project.artColor)};--artglow:${escapeHTML(project.glow)}">
        <span class="card-number">SP / ${escapeHTML(project.number)}</span>
        <span class="art-icon" aria-hidden="true">${escapeHTML(project.icon)}</span>
        <span class="art-label">SACHIT PROJECTS / BUILD ${escapeHTML(project.number)}</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span class="category-tag">${escapeHTML(project.category)}</span><span class="difficulty">${escapeHTML(project.difficulty)}</span></div>
        <h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p>
        <div class="card-footer"><span>${escapeHTML(project.tags.join(" / "))}</span><button class="card-open" data-open="${escapeHTML(project.id)}">View build ↗</button></div>
      </div>
    </article>`;
  }

  function renderProjects() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = projects.filter(project => {
      const categoryMatch = activeCategory === "All" || project.category === activeCategory || project.tags.includes(activeCategory);
      const searchable = [project.title, project.category, project.description, ...project.tags, ...project.parts].join(" ").toLowerCase();
      return categoryMatch && searchable.includes(query);
    });
    grid.innerHTML = filtered.map(cardTemplate).join("");
    visibleCount.textContent = String(filtered.length).padStart(2, "0");
    projectCount.textContent = String(projects.length).padStart(2, "0");
    emptyState.classList.toggle("hidden", filtered.length !== 0);
    grid.classList.toggle("hidden", filtered.length === 0);
    filterRow.querySelectorAll("[data-category]").forEach(button => {
      button.classList.toggle("active", button.dataset.category === activeCategory);
      const count = button.querySelector("span");
      if (count) count.textContent = String(button.dataset.category === "All" ? projects.length : projects.filter(p => p.category === button.dataset.category || p.tags.includes(button.dataset.category)).length).padStart(2, "0");
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function syntaxHighlight(source) {
    // Basic presentation only; code is still plain text and can be copied as-is.
    const escaped = escapeHTML(source);
    const tokens = escaped.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n]*|\b(?:void|const|int|float|unsigned|long|if|else|return|true|false|HIGH|LOW|INPUT|OUTPUT|Serial|pinMode|digitalWrite|digitalRead|analogRead|delay|delayMicroseconds|pulseIn|println|print|begin|setup|loop)\b)/g);
    return tokens.map(token => {
      if (/^\/\//.test(token)) return `<span class="comment">${token}</span>`;
      if (/^["']/.test(token)) return `<span class="str">${token}</span>`;
      if (/^(void|const|int|float|unsigned|long|if|else|return|true|false|HIGH|LOW|INPUT|OUTPUT)$/.test(token)) return `<span class="kw">${token}</span>`;
      if (/^(Serial|pinMode|digitalWrite|digitalRead|analogRead|delay|delayMicroseconds|pulseIn|println|print|begin|setup|loop)$/.test(token)) return `<span class="fn">${token}</span>`;
      return token;
    }).join("");
  }

  function setCode(project) {
    document.getElementById("codeFilename").textContent = project.filename;
    document.getElementById("codeDisplay").innerHTML = syntaxHighlight(project.code);
    document.getElementById("code-lab").dataset.projectId = project.id;
  }

  
function openProject(project) {
  selectedProject = project;

  document.getElementById("modalCategory").textContent =
    `PROJECT / ${project.number} • ${project.category.toUpperCase()}`;
  document.getElementById("modalTitle").textContent = project.title;
  document.getElementById("modalDescription").textContent = project.description;

  document.getElementById("modalParts").innerHTML =
    project.parts.map(item => `<li>${escapeHTML(item)}</li>`).join("");
  document.getElementById("modalSteps").innerHTML =
    project.steps.map(item => `<li>${escapeHTML(item)}</li>`).join("");

  let diagramArea = document.getElementById("modalDiagram");

  if (!diagramArea) {
    diagramArea = document.createElement("section");
    diagramArea.id = "modalDiagram";
    diagramArea.style.margin = "24px 0";
    diagramArea.innerHTML =
      '<h3>Circuit / Wiring Diagram</h3><div id="modalDiagramContent"></div>';

    document.getElementById("modalDescription")
      .insertAdjacentElement("afterend", diagramArea);
  }

  const diagramContent = document.getElementById("modalDiagramContent");
  diagramContent.replaceChildren();

  if (project.diagram) {
    diagramContent.innerHTML = project.diagram;
    diagramContent.querySelectorAll("svg").forEach(svg => {
      svg.style.maxWidth = "100%";
      svg.style.height = "auto";
      svg.style.display = "block";
    });
  } else {
    diagramContent.textContent =
      "The wiring diagram for this project is coming soon.";
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("closeModal").focus();
}


  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Code copied to clipboard!");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const success = document.execCommand("copy");
      area.remove();
      showToast(success ? "Code copied to clipboard!" : "Copy blocked by browser. Select the code and copy it manually.");
    }
  }

  function downloadProject(project) {
    if (!project) return;
    const blob = new Blob([project.code + "\n"], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = project.filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Downloading ${project.filename}`);
  }

  filterRow.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderProjects();
  });
  searchInput.addEventListener("input", renderProjects);
  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-open]");
    if (!button) return;
    const project = projects.find(item => item.id === button.dataset.open);
    if (project) openProject(project);
  });
  document.getElementById("resetSearch").addEventListener("click", () => {
    searchInput.value = "";
    activeCategory = "All";
    renderProjects();
  });
  document.getElementById("copyCode").addEventListener("click", () => {
    const project = projects.find(item => item.id === document.getElementById("code-lab").dataset.projectId) || projects.find(item => item.id === "arduino-blink") || projects[0];
    if (project) copyText(project.code);
  });
  document.getElementById("downloadCode").addEventListener("click", () => {
    const project = projects.find(item => item.id === document.getElementById("code-lab").dataset.projectId) || projects.find(item => item.id === "arduino-blink") || projects[0];
    downloadProject(project);
  });
  document.getElementById("closeModal").addEventListener("click", closeModal);
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });
  document.getElementById("openProjectCode").addEventListener("click", () => {
    if (!selectedProject) return;
    setCode(selectedProject);
    closeModal();
    document.getElementById("code-lab").scrollIntoView({behavior: "smooth"});
    showToast(`Loaded ${selectedProject.filename} in Code Lab`);
  });
  document.getElementById("modalDownload").addEventListener("click", () => downloadProject(selectedProject));
  document.getElementById("year").textContent = new Date().getFullYear();
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.addEventListener("click", () => {
    const nav = document.querySelector(".nav-links");
    const isOpen = nav.classList.toggle("open");
    mobileMenu.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.textContent = isOpen ? "×" : "☰";
  });
  document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("open");
    mobileMenu.setAttribute("aria-expanded", "false");
    mobileMenu.textContent = "☰";
  }));
  document.getElementById("backTop").addEventListener("click", event => {
    event.preventDefault();
    window.scrollTo({top: 0, behavior: "smooth"});
  });

  renderProjects();
  setCode(projects.find(item => item.id === "arduino-blink") || projects[0]);
})();
