/* ── main.js ── */

/* ── 1. Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── 2. Mobile menu ── */
const mobileMenu = document.getElementById('mobile-menu');
const hamburger = document.getElementById('hamburger');
const closeMenuBtn = document.getElementById('close-menu');

function openMenu() { mobileMenu.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeMenu() { mobileMenu.classList.add('hidden'); document.body.style.overflow = ''; }

hamburger.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);

/* ── 3. Typed text effect ── */
const phrases = ['Full-Stack Developer', 'UI/UX Designer', 'Creative Thinker', 'Problem Solver'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

/* ── 4. Stat counter animation ── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 50);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 30);
  });
}

/* ── 5. Skill bars animation ── */
function buildSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const skill = bar.dataset.skill;
    const pct = bar.dataset.pct;
    bar.innerHTML = `
      <div class="skill-bar-wrap">
        <div class="skill-bar-label">
          <span>${skill}</span><span class="text-cyan">${pct}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" data-width="${pct}"></div>
        </div>
      </div>`;
  });
}
buildSkillBars();

function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(fill => {
    fill.style.width = fill.dataset.width + '%';
  });
}

/* ── 6. Intersection Observer ── */
let countersRun = false, skillsRun = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('animate-slide-up');
    // Stat counter
    if (el.closest('section')?.querySelector('.stat-num') && !countersRun) {
      countersRun = true;
      animateCounters();
    }
    // Skill bars
    if (el.querySelector('.skill-bar-fill') && !skillsRun) {
      skillsRun = true;
      setTimeout(animateSkillBars, 200);
    }
  });
}, { threshold: 0.15 });

// Observe sections and cards
document.querySelectorAll('section, .service-card, .portfolio-card, .stat-card').forEach(el => {
  observer.observe(el);
});

// Also observe skill section specifically
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !skillsRun) {
      skillsRun = true;
      setTimeout(animateSkillBars, 300);
    }
  }, { threshold: 0.3 }).observe(skillsSection);
}

// Stat counter observer
const statsSection = document.querySelector('.stat-card')?.closest('section');
if (statsSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersRun) {
      countersRun = true;
      animateCounters();
    }
  }, { threshold: 0.3 }).observe(statsSection);
}

/* ── 7. Portfolio filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.transition = 'opacity .3s, transform .3s';
      if (match) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.display = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(.95)';
        setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ── 8. Testimonial slider ── */
const track = document.getElementById('testimonial-track');
const slides = document.querySelectorAll('.testimonial-slide');
let currentSlide = 0;

function goToSlide(idx) {
  currentSlide = (idx + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.getElementById('prev-testimonial').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('next-testimonial').addEventListener('click', () => goToSlide(currentSlide + 1));

// Auto-advance
setInterval(() => goToSlide(currentSlide + 1), 5000);

/* ── 9. Contact form ── */
const contactForm = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFormMsg('Please fill in all required fields.', false);
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormMsg('Please enter a valid email address.', false);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> Sending…';

  // Simulate async send
  await new Promise(r => setTimeout(r, 1500));

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fa fa-paper-plane mr-2"></i> Send Message';
  contactForm.reset();
  showFormMsg('🎉 Your message has been sent! I\'ll get back to you soon.', true);
});

function showFormMsg(text, success) {
  formMsg.textContent = text;
  formMsg.className = `text-center py-3 rounded-xl text-sm font-medium mt-2 ${success ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    : 'bg-red-500/20 text-red-400 border border-red-500/30'
    }`;
  formMsg.classList.remove('hidden');
  setTimeout(() => formMsg.classList.add('hidden'), 5000);
}

/* ── 10. Smooth active nav highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#00d1ff' : '';
  });
}, { passive: true });
