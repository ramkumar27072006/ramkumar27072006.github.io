// ===== PARTICLES =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`; ctx.fill();
  }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== CURSOR GLOW =====
const glow = document.querySelector('.cursor-glow');
if (glow && window.innerWidth > 768) {
  document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
} else if (glow) { glow.style.display = 'none'; }

// ===== NAVBAR =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

// ===== MOBILE NAV =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = 'none'; spans[1].style.opacity = '1'; spans[2].style.transform = 'none';
  }
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'none'; spans[1].style.opacity = '1'; spans[2].style.transform = 'none';
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(s => {
    const top = s.offsetTop, h = s.offsetHeight, id = s.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) { link.classList.toggle('active', scrollY >= top && scrollY < top + h); }
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ===== TYPING EFFECT =====
const typedEl = document.getElementById('typed-text');
const words = ['AI & ML Enthusiast', 'Data Science Explorer', 'Embedded Systems Developer', 'Research Innovator', 'Full-Stack Builder'];
let wordIdx = 0, charIdx = 0, isDeleting = false;
function typeEffect() {
  const current = words[wordIdx];
  if (isDeleting) { charIdx--; } else { charIdx++; }
  typedEl.textContent = current.substring(0, charIdx);
  let speed = isDeleting ? 40 : 80;
  if (!isDeleting && charIdx === current.length) { speed = 2000; isDeleting = true; }
  if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; speed = 400; }
  setTimeout(typeEffect, speed);
}
typeEffect();

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let current = 0; const step = target / 60;
  const timer = setInterval(() => {
    current += step; if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + '+';
  }, 20);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.count);
      animateCounter(e.target, target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== TILT EFFECT ON PROJECT CARDS =====
if (window.innerWidth > 768) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ===== CONTACT FORM SUBMISSION =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('contact-submit');
    const status = document.getElementById('form-status');
    const btnText = btn.querySelector('span');
    const btnIcon = btn.querySelector('i');

    // Loading state
    btn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    status.className = 'form-status';
    status.textContent = '';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.className = 'form-status success';
        status.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
        contactForm.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      status.className = 'form-status error';
      status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send. Please try again or reach out via LinkedIn.';
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      btnIcon.className = 'fas fa-paper-plane';
    }
  });
}

// ===== CERTIFICATE VIEWER MODAL =====
const certMapping = {
  "Innovating with Google Cloud AI": ["INNOVATING WITH GOOGLE CLOUD AI.pdf"],
  "AI Agents": ["AI agents.pdf"],
  "RAG and Agentic AI": ["RAG and Agentic AI.pdf"],
  "Object Detection with Deep Learning": ["Object Detection with Deep Learning.pdf"],
  "MATLAB Onramp & Plots": ["MATLAB_ONRAMP_certificate.pdf", "Matlab_Plots_certificate.pdf"],
  "Python Course — Mastering Essentials": ["Python Course - Scaler.png"],
  "Data Science Certification": ["RAMKUMAR_R_Data Science.pdf"],
  "WordPress Development": ["Coursera Wordpress.pdf"],
  "Cybersecurity Analyst Job Simulation": ["Cyber Job Simulation DELOITTE.pdf"],
  "Dark Web, Anonymity & Cryptocurrency": ["Introduction to Dark Web, Anonymity, and Cryptocurrency.png"],
  "IBM Design Thinking": ["IBMDesign20251102-30-l8qqav.pdf"],
  "Generative AI Tools": ["Ramkumar R_Generative AI Tools.pdf"],
  "Jailbreaking Large Language Models": ["Event-certificate-22007--1729793309.253968.pdf"],
  "NatuRx Bio-Med Quiz": ["1745466202705.png"],
  "DECODEX — Kanam 2025": ["1745466139592.jpg"],
  "Infosys Springboard AI Masterclass": [
    "infosys springerboard AI/0002f2a3-6369-4bf9-86fe-3de650a2689a.pdf",
    "infosys springerboard AI/0c6de93e-6c14-44a8-bc4b-081a6301a97d.pdf",
    "infosys springerboard AI/167a9bfa-5551-415f-8a30-229c0972c2d5.pdf",
    "infosys springerboard AI/316c040c-d884-40fc-a856-ab736bedf50a.pdf",
    "infosys springerboard AI/36e60e97-bc15-4c26-97b2-abdad1c741b2.pdf",
    "infosys springerboard AI/4b211836-434c-4072-9bb7-b14e4040d3d4.pdf",
    "infosys springerboard AI/8c5398ad-42b1-4320-9c9f-44f5cfa0d227.pdf",
    "infosys springerboard AI/8fdef9bc-d516-46e8-9fec-3cc3bdff979c.pdf",
    "infosys springerboard AI/9667080b-6dfb-4356-9e2d-5a991d866d0e.pdf",
    "infosys springerboard AI/aaea440e-488e-4b8e-84ab-3d9659a489dd.pdf",
    "infosys springerboard AI/dd3ba10c-f278-47d2-94e4-6a47ca839f78.pdf",
    "infosys springerboard AI/f1a524b5-e97a-4ff8-a210-9df00263c118.pdf"
  ]
};

const certModal = document.getElementById('cert-modal');
const certModalTitle = document.getElementById('cert-modal-title');
const certModalBody = document.getElementById('cert-modal-body');
const certCloseBtn = document.getElementById('cert-close');
const certPrevBtn = document.getElementById('cert-prev');
const certNextBtn = document.getElementById('cert-next');
const certCounter = document.getElementById('cert-counter');
const certNav = document.getElementById('cert-nav');

let currentCerts = [];
let currentCertIndex = 0;
const assetsBaseUrl = 'assets/certificates/';

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h4').textContent;
    currentCerts = certMapping[title] || [];

    if (currentCerts.length === 0) {
      alert("Certificate document is not available for this course yet.");
      return;
    }

    currentCertIndex = 0;
    certModalTitle.textContent = title;

    if (currentCerts.length > 1) {
      certNav.classList.add('active');
      updateCertNav();
    } else {
      certNav.classList.remove('active');
    }

    loadCert();
    certModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

if (certCloseBtn) certCloseBtn.addEventListener('click', closeCertModal);
if (certModal) certModal.addEventListener('click', (e) => {
  if (e.target === certModal) closeCertModal();
});

function closeCertModal() {
  certModal.classList.remove('show');
  document.body.style.overflow = '';
  certModalBody.innerHTML = '';
}

function loadCert() {
  const file = currentCerts[currentCertIndex];
  const url = assetsBaseUrl + file;

  if (file.toLowerCase().endsWith('.pdf')) {
    certModalBody.innerHTML = `<iframe src="${url}#toolbar=0" frameborder="0"></iframe>`;
  } else {
    certModalBody.innerHTML = `<img src="${url}" alt="Certificate">`;
  }
}

function updateCertNav() {
  certCounter.textContent = `${currentCertIndex + 1} / ${currentCerts.length}`;
  certPrevBtn.disabled = currentCertIndex === 0;
  certNextBtn.disabled = currentCertIndex === currentCerts.length - 1;
}

if (certPrevBtn) certPrevBtn.addEventListener('click', () => {
  if (currentCertIndex > 0) {
    currentCertIndex--;
    loadCert();
    updateCertNav();
  }
});

if (certNextBtn) certNextBtn.addEventListener('click', () => {
  if (currentCertIndex < currentCerts.length - 1) {
    currentCertIndex++;
    loadCert();
    updateCertNav();
  }
});
