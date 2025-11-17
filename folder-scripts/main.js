document.addEventListener('DOMContentLoaded', function () {
  const pre = document.getElementById('preloader');
  if (pre) { setTimeout(() => { pre.style.display = 'none' }, 1800) }

  const logo = document.getElementById('logoBtn');
  const nav = document.getElementById('mainNav');
  logo.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('open');
    logo.classList.toggle('glow');
    nav.setAttribute('aria-hidden', !nav.classList.contains('open'));
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !logo.contains(e.target)) {
      nav.classList.remove('open');
      logo.classList.remove('glow');
      nav.setAttribute('aria-hidden', 'true');
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { nav.classList.remove('open'); logo.classList.remove('glow'); } });

  const slides = Array.from(document.querySelectorAll('.slide'));
  let si = 0;
  function show(i) { slides.forEach((s, idx) => s.classList.toggle('active', idx === i)); }
  function next() { si = (si + 1) % slides.length; show(si); }
  show(0);
  const autoplay = setInterval(next, 4500);
  slides.forEach(s => s.addEventListener('click', () => { const link = s.dataset.link || '#'; if (link && link !== '#') window.location.href = link; }));

  document.querySelectorAll('.mini-carousel').forEach(car => {
    const track = car.querySelector('.track');
    const prev = car.querySelector('.prev-btn');
    const nextBtn = car.querySelector('.next-btn');
    const card = car.querySelector('.project-card');
    const itemW = card ? (card.getBoundingClientRect().width + 16) : 276;
    let pos = 0;
    prev && prev.addEventListener('click', () => { pos = Math.max(0, pos - itemW * 3); track.scrollTo({ left: pos, behavior: 'smooth' }); });
    nextBtn && nextBtn.addEventListener('click', () => { pos = Math.min(track.scrollWidth - track.clientWidth, pos + itemW * 3); track.scrollTo({ left: pos, behavior: 'smooth' }); });
  });

  const modal = document.getElementById('caseModal');
  const caseContent = document.getElementById('caseContent');
  const closeModalBtn = document.getElementById('closeModal');

  function buildModalContent(card) {
    // read data- attributes with fallbacks
    const title = card.dataset.title || card.querySelector('.pc-meta h5')?.innerText || 'Projeto sem título';
    const role = card.dataset.role || card.querySelector('.pc-meta span')?.innerText || '';
    const img = card.dataset.img || card.querySelector('img')?.src || 'folder-images/misc/demo-poster.svg';
    const oneliner = card.dataset.oneliner || 'One-liner: (adicione data-oneliner no card)';
    const tools = card.dataset.tools || 'Ferramentas não informadas';
    const impact = card.dataset.impact || 'Resultado em breve';
    const credits = card.dataset.credits || 'Créditos serão atualizados';
    const desc = card.dataset.desc || 'Sem descrição'
    const processURL = card.dataset.processUrl || '';
    const gallery = card.dataset.gallery ? card.dataset.gallery.split(',') : [];
    const video = card.dataset.video || '';

    // gallery HTML (shows placeholder message if empty)
    let galleryHtml = '';
    if (gallery.length) {
      galleryHtml = '<div class="modal-gallery">';
      gallery.forEach(src => {
        galleryHtml += `<img loading="lazy" src="${src.trim()}" alt="${title}" />`;
      });
      galleryHtml += '</div>';
    } else {
      galleryHtml = '<div class="modal-gallery placeholder">Nenhuma imagem adicionada ainda.</div>';
    }

    // video HTML
    let videoHtml = '';
    if (video) {
      videoHtml = `<div class="modal-video"><video controls src="${video}" poster="${img}" style="width:100%;border-radius:8px"></video></div>`;
    } else {
      videoHtml = ''; // show nothing if no video
    }

    // Compose final HTML
    return `
      <div class="modal-grid">
        <div class="modal-left">
          <img src="${img}" alt="${title}" class="modal-cover"/>
          ${videoHtml}
        </div>
        <div class="modal-right">
          <h2 class="modal-title">${title}</h2>
          <p class="modal-role">${role}</p>
          <p><strong>One-liner:</strong> ${oneliner}</p><br>
          <p><strong>Descrição:</strong></p>
          <p> ${desc}</p>
          <p><strong>Ferramentas:</strong> ${tools}</p><br>
          <p><strong>Resultado / Impacto:</strong> ${impact}</p><br>
          <p><strong>Créditos:</strong> ${credits}</p><br>
          ${ processURL ? `<p><a class="btn ghost" href="${processURL}" target="_blank">Ver processo completo →</a></p>` : `<p class="placeholder">Processo não disponível.</p>` }
          <div class="modal-actions" style="margin-top:14px;">
            <a class="btn" href="#">Ver projeto</a>
            <a class="btn ghost" href="#contact">Quero conversar</a>
          </div>

          <hr style="margin:18px 0;border-color:rgba(255,255,255,0.04)">

          <h4>Galeria</h4>
          ${galleryHtml}
        </div>
      </div>
    `;
  }

  document.querySelectorAll('.project-card .view-case').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      caseContent.innerHTML = buildModalContent(card);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      // focus trap/simple autofocus
      closeModalBtn && closeModalBtn.focus();
    });
  });

  // close modal (button)
  closeModalBtn?.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });

  // close clicking outside
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
  document.getElementById('closeModal')?.addEventListener('click', () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true') });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      form.addEventListener("submit", () => {
  alert("Mensagem enviada! Obrigado pelo contato.");
    });
    });
  }

  const skills = document.querySelectorAll('.skill-bar');
  const io = new IntersectionObserver((ents) => { ents.forEach(e => { if (e.isIntersecting) { const el = e.target; const v = getComputedStyle(el).getPropertyValue('--v') || '60%'; el.style.width = v.trim(); io.unobserve(el); } }); }, { threshold: 0.2 });
  skills.forEach(s => io.observe(s));

  const ambient = document.getElementById('ambientAudio');
  if (ambient) { document.addEventListener('click', () => { ambient.play().catch(() => { }); }, { once: true }); }
});

// ===== Slideshow principal =====
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.slideshow-dots');
let currentSlide = 0;

// Cria dots dinamicamente
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dotsContainer.appendChild(dot);
  dot.addEventListener('click', () => showSlide(i));
});

function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  document.querySelectorAll('.slideshow-dots span').forEach((d, i) => d.classList.toggle('active', i === index));
  currentSlide = index;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Troca automática a cada 8s
setInterval(nextSlide, 8000);

// Clique no slide leva ao link
slides.forEach(slide => {
  slide.addEventListener('click', () => {
    const link = slide.dataset.link;
    if (link) window.location.href = link;
  });
});


// animation reveal
function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  reveals.forEach((reveal) => {
    var windowHeight = window.innerHeight;
    var elementTop = reveal.getBoundingClientRect().top;
    var elementVisible = 100;

    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add("active");
    } else {
      reveal.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", reveal);


//footer credits
document.getElementById('easterEgg').addEventListener('click', () => {
  window.open("https://vimeo.com/1137250774?fl=ip&fe=ec", "_blank");
});
