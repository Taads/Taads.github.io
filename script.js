// Animações baseadas em scroll usando IntersectionObserver
const sections = document.querySelectorAll("[data-section]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    // Dispara assim que a seção entra na tela (porcentagem fixa falhava em seções altas
    // em telas baixas, como celular deitado)
    threshold: 0,
    rootMargin: "0px 0px -10% 0px",
  }
);

sections.forEach((section) => observer.observe(section));

// Menu mobile
const header = document.querySelector(".header");
const navToggle = document.querySelector(".nav-toggle");

function setMenuOpen(open) {
  header.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

navToggle?.addEventListener("click", () => setMenuOpen(!header.classList.contains("is-open")));
document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
document.addEventListener("click", (e) => {
  if (header.classList.contains("is-open") && !header.contains(e.target)) setMenuOpen(false);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenuOpen(false); });

// Dados dinâmicos dos projetos
const projectsData = [
  {
    title: "Fluxo Transporte",
    type: "Web App",
    description: "Plataforma onde o usuário pode visualizar e analisar a otimização de redes de transporte urbano, distribuição de recursos e infraestrutura crítica.",
    image: "imagens/Fluxo.png",
    tags: ["HTML5", "CSS3", "JavaScript"],
    live: "https://luttudo.github.io/Fluxo/",
    repo: "https://github.com/Taads/Fluxo_Transporte.git",
  },
  {
    title: "Universo Virtual",
    type: "TCC · Jogo em VR",
    description: "Meu TCC: um jogo em realidade virtual sobre o Sistema Solar, com os detalhes de cada planeta. Voltado para a educação, ajuda alunos de diversas idades a ampliar o conhecimento sobre o espaço.",
    image: "imagens/SistemaSolar.jpg",
    tags: ["Unity", "C#", "Inteligência Artificial", "Realidade Virtual"],
    live: "https://drive.google.com/file/d/1ErqufFEgrneTZhKJccy_CU5ySTvRUkxd/view?usp=sharing",
    repo: "https://github.com/Taads/TCC-SistemaSolar.git",
  },
  {
    title: "Gerador de Senha",
    type: "WEB APP",
    description: "Gerador de senhas para proteger suas contas: cria senhas de 7 a 30 caracteres com símbolos e números para maior segurança.",
    image: "imagens/geradordesenha.png",
    tags: ["HTML", "CSS", "JavaScript"],
    live: "https://taads.github.io/Gerador-de-senhas/",
    repo: "https://github.com/Taads/Gerador-de-senhas.git",
  },
  {
    title: "Acolhendo Patas",
    type: "WEB APP",
    description: "Site de adoção onde é possível anunciar ou adotar um pet, desenvolvido como projeto da faculdade.",
    image: "imagens/Patas.png",
    tags: ["HTML", "CSS"],
    live: "https://github.com/Taads/AcolhendoPatas.git",
    repo: "https://github.com/Taads/AcolhendoPatas.git",
  },
  {
    title: "MS Project",
    type: "WEB APP",
    description: "Portfólio profissional para uma empresa de consultoria, com um sistema de venda dos treinamentos que a empresa oferece.",
    image: "imagens/J&A.png",
    tags: ["HTML", "CSS", "JavaScript", "Canva"],
    live: "https://github.com/Taads/MS-Project.git",
    repo: "https://github.com/Taads/MS-Project.git",
  },
];

// Elementos DOM
const projectsGrid = document.getElementById("projects-grid");
const projectFocus = document.getElementById("project-focus");
const surpriseButton = document.getElementById("surprise-project");
const focusImg = document.getElementById("focus-image");
const focusTitle = document.getElementById("focus-title");
const focusType = document.getElementById("focus-type");
const focusDescription = document.getElementById("focus-description");
const focusTags = document.getElementById("focus-tags");
const focusLive = document.getElementById("focus-live");
const focusRepo = document.getElementById("focus-repo");
const focusClose = document.querySelector(".focus-close");
const glow = document.querySelector(".body-glow");

// Renderiza projetos
function renderProjects() {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = projectsData
    .map(
      (project, index) => `
      <article class="project-card" data-scroll-tilt data-project-index="${index}">
        <div class="project-image-wrapper">
          <img src="${project.image}" alt="${project.title}" class="project-image" />
          <div class="project-gradient"></div>
          <span class="project-label">${project.type}</span>
        </div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-meta">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="project-links">
            <a href="${project.live}" target="_blank" rel="noreferrer">Ver projeto</a>
            <a href="${project.repo}" target="_blank" rel="noreferrer">Código no GitHub</a>
          </div>
        </div>
      </article>
    `
    )
    .join("");
  initTilt();
}

// Efeito parallax suave (reduzido em mobile)
const parallaxEls = document.querySelectorAll("[data-parallax]");
const isMobile = window.innerWidth <= 720;
window.addEventListener("scroll", () => {
  if (isMobile) return; // Desabilita parallax em mobile para melhor performance
  const scrollY = window.scrollY || window.pageYOffset;
  const viewportHeight = window.innerHeight;
  parallaxEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const offset = (rect.top - viewportHeight / 2) / viewportHeight;
    const translateY = -offset * 18;
    const rotate = -offset * 4;
    el.style.transform = `translateY(${translateY}px) rotate3d(0, 1, 0, ${rotate}deg)`;
  });
});

// Tilt nos cards de projeto (reduzido em mobile)
let tiltCards = [];
const isMobileDevice = window.innerWidth <= 720;
function handleTilt() {
  if (isMobileDevice) return; // Desabilita tilt em mobile
  const scrollY = window.scrollY || window.pageYOffset;
  tiltCards.forEach((card, index) => {
    const speed = 0.05 + index * 0.02;
    const tilt = Math.sin(scrollY * speed * 0.02) * 4;
    card.style.transform = `rotate3d(1, 0, 0, ${tilt}deg) translateY(${tilt * -0.4}px)`;
  });
}
function initTilt() {
  tiltCards = Array.from(document.querySelectorAll("[data-scroll-tilt]"));
  if (!isMobileDevice) handleTilt();
}
if (!isMobileDevice) {
  window.addEventListener("scroll", handleTilt);
}

// Modal de projeto
function openProjectFocus(project, card) {
  if (!projectFocus) return;
  document.querySelectorAll(".project-card.is-selected").forEach((c) => c.classList.remove("is-selected"));
  if (card) card.classList.add("is-selected");

  focusImg.src = project.image;
  focusImg.alt = project.title;
  focusTitle.textContent = project.title;
  focusType.textContent = project.type;
  focusDescription.textContent = project.description;
  focusTags.innerHTML = project.tags.map((tag) => `<span class="chip">${tag}</span>`).join("");
  focusLive.href = project.live;
  focusRepo.href = project.repo;

  projectFocus.classList.add("is-open");
  projectFocus.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("focus-open");
}
function closeProjectFocus() {
  if (!projectFocus) return;
  document.documentElement.classList.remove("focus-open");
  projectFocus.classList.remove("is-open");
  projectFocus.setAttribute("aria-hidden", "true");
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeProjectFocus(); });
if (projectFocus) {
  projectFocus.addEventListener("click", (e) => {
    if (e.target === projectFocus || e.target.classList.contains("focus-backdrop")) closeProjectFocus();
  });
}
focusClose?.addEventListener("click", closeProjectFocus);
projectsGrid?.addEventListener("click", (e) => {
  if (e.target.closest("a")) return; // links do card abrem só a página, sem o destaque
  const card = e.target.closest(".project-card");
  if (!card) return;
  const index = Number(card.dataset.projectIndex);
  const project = projectsData[index];
  if (project) openProjectFocus(project, card);
});
surpriseButton?.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * projectsData.length);
  const project = projectsData[randomIndex];
  const card = document.querySelector(`[data-project-index="${randomIndex}"]`);
  if (project) {
    openProjectFocus(project, card);
    surpriseButton.classList.add("is-pressed");
    setTimeout(() => surpriseButton.classList.remove("is-pressed"), 160);
  }
});

renderProjects();

// Carrossel com setas (sem rolagem automática); no celular as setas ficam ocultas pelo CSS
function initCarousel(carousel) {
  const track = carousel.querySelector(".carousel-track");
  const prev = carousel.querySelector(".carousel-arrow.prev");
  const next = carousel.querySelector(".carousel-arrow.next");
  if (!track || !prev || !next) return;

  const step = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card ? card.offsetWidth + gap : track.clientWidth;
  };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= max - 1;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
  next.addEventListener("click", () => track.scrollBy({ left: step() }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);

// Fundo reage ao scroll
window.addEventListener("scroll", () => {
  if (!glow) return;
  const y = window.scrollY || 0;
  glow.style.transform = `translate3d(${y * -0.02}px, ${y * -0.06}px, 0) scale(1.02)`;
});

// Ano no footer
document.getElementById("year").textContent = new Date().getFullYear();

// Animação de montagem do título "Desenvolvedor Full Stack"
function animateTitle() {
  const titleElement = document.getElementById("animated-title");
  if (!titleElement) return;

  // Espaço não separável mantém "Full Stack" junto na mesma linha
  const text = "Desenvolvedor Full Stack";

  // Verifica se já foi animado (usando sessionStorage)
  const hasAnimated = sessionStorage.getItem("titleAnimated");
  if (hasAnimated) {
    // Se já animou antes, apenas mostra o texto normalmente
    titleElement.textContent = text;
    return;
  }

  const letters = text.split("");
  
  // Limpa o conteúdo
  titleElement.innerHTML = "";
  
  // Cria spans para cada letra, agrupadas por palavra para não quebrar no meio
  let word = null;
  letters.forEach((letter, index) => {
    const span = document.createElement("span");
    if (letter === " ") {
      span.className = "space";
      span.innerHTML = "&nbsp;";
      titleElement.appendChild(span);
      word = null;
    } else {
      if (!word) {
        word = document.createElement("span");
        word.className = "word";
        titleElement.appendChild(word);
      }
      span.className = "letter";
      span.textContent = letter;
      // Delay escalonado para cada letra (mais rápido no início, mais lento no final)
      span.style.animationDelay = `${index * 0.08}s`;
      word.appendChild(span);
    }
  });

  // Marca como animado
  sessionStorage.setItem("titleAnimated", "true");
}

// Executa a animação quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", animateTitle);
} else {
  animateTitle();
}

// Mouse glow
const mouseGlow = document.createElement('div');
mouseGlow.classList.add('mouse-glow');
document.body.appendChild(mouseGlow);
document.addEventListener('mousemove', (e) => {
  mouseGlow.style.left = `${e.clientX}px`;
  mouseGlow.style.top = `${e.clientY}px`;
});
document.addEventListener('mouseenter', () => mouseGlow.style.opacity = '0.8');
document.addEventListener('mouseleave', () => mouseGlow.style.opacity = '0');

// === ESTRELAS E METEOROS ===
const starsContainer = document.createElement('div');
starsContainer.classList.add('stars');
document.body.insertBefore(starsContainer, document.body.firstChild);

// 150 estrelas piscando
for (let i = 0; i < 150; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.width = `${Math.random() * 1.8 + 0.6}px`;
  star.style.height = star.style.width;
  star.style.animationDelay = `${Math.random() * 6}s`;
  star.style.animationDuration = `${Math.random() * 3 + 2}s`;
  starsContainer.appendChild(star);
}

// Meteoro com rastro
function createMeteor() {
  const meteor = document.createElement('div');
  meteor.classList.add('meteor');
  meteor.style.left = `${Math.random() * 80 + 10}%`;
  meteor.style.top = `${Math.random() * 70 + 10}%`;
  const angle = Math.random() * 40 - 60;
  meteor.style.transform = `rotate(${angle}deg)`;
  const duration = Math.random() * 0.8 + 1.2;
  meteor.style.animationDuration = `${duration}s`;
  document.body.appendChild(meteor);
  meteor.addEventListener('animationend', () => meteor.remove());
}

function triggerMeteor() {
  createMeteor();
  const nextDelay = Math.random() * 20000 + 10000;
  setTimeout(triggerMeteor, nextDelay);
}
triggerMeteor();

// === NOVO: Formulário de contato com feedback visual ===
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.contact-submit');

    // Mostra estado de envio
    submitBtn.innerHTML = '<span>Enviando...</span>';
    submitBtn.disabled = true;

    // Simula envio (1.5s)
    setTimeout(() => {
      // Fade out do formulário
      contactForm.style.opacity = '0';
      contactForm.style.transition = 'opacity 0.6s ease';

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.style.opacity = '0';
        formSuccess.style.transition = 'opacity 0.8s ease';

        // Fade in da mensagem de sucesso
        requestAnimationFrame(() => {
          formSuccess.style.opacity = '1';
        });
      }, 600);
    }, 1500);
  });
}