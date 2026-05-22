/* =============================================
   YANA KITCHEN — Script
   ============================================= */

// ---------- Loader ----------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 900);
});

// ---------- Header scroll ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------- Hamburger ----------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ---------- Reveal on scroll ----------
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

// ---------- Menu filter tabs ----------
const tabs     = document.querySelectorAll('.menu-tab');
const menuGrid = document.getElementById('menu-grid');
const cards    = menuGrid ? menuGrid.querySelectorAll('.menu-card') : [];

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const filter = tab.dataset.tab;
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---------- Testimonials ----------
const testimonials = [
  {
    quote: "I came to Yana Kitchen as a tourist and left feeling like I had eaten in someone's grandmother's home. The Samay Baji was unlike anything I have ever tasted — deeply layered and full of warmth.",
    name: "Sarah Jennings",
    origin: "London, United Kingdom"
  },
  {
    quote: "The cooking class was the highlight of my entire Nepal trip. Maya explained every spice, every technique with so much love. I've been making Choila at home ever since.",
    name: "Marco Bellini",
    origin: "Milan, Italy"
  },
  {
    quote: "We booked the private feast for our anniversary and it was absolutely magical. The courtyard setting, the copper vessels, the music — a truly unforgettable evening.",
    name: "Priya & Rahul Sharma",
    origin: "Mumbai, India"
  },
  {
    quote: "The Market to Table experience opened my eyes to ingredients I had never heard of. The morning at Asan market followed by cooking and eating together was pure joy.",
    name: "Hana Okamoto",
    origin: "Osaka, Japan"
  }
];

let testiIndex = 0;

const quoteEl   = document.getElementById('testi-quote');
const nameEl    = document.getElementById('testi-name');
const originEl  = document.getElementById('testi-origin');
const dotsWrap  = document.getElementById('testi-dots');
const prevBtn   = document.getElementById('prev-btn');
const nextBtn   = document.getElementById('next-btn');

function renderTesti(idx) {
  if (!quoteEl) return;
  const t = testimonials[idx];
  quoteEl.textContent   = `"${t.quote}"`;
  nameEl.textContent    = t.name;
  originEl.textContent  = t.origin;
  dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

function buildDots() {
  if (!dotsWrap) return;
  testimonials.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'testi-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Testimonial ${i + 1}`);
    btn.addEventListener('click', () => { testiIndex = i; renderTesti(i); });
    dotsWrap.appendChild(btn);
  });
}

buildDots();
renderTesti(0);

if (prevBtn) prevBtn.addEventListener('click', () => {
  testiIndex = (testiIndex - 1 + testimonials.length) % testimonials.length;
  renderTesti(testiIndex);
});
if (nextBtn) nextBtn.addEventListener('click', () => {
  testiIndex = (testiIndex + 1) % testimonials.length;
  renderTesti(testiIndex);
});

// Auto-advance testimonials
setInterval(() => {
  testiIndex = (testiIndex + 1) % testimonials.length;
  renderTesti(testiIndex);
}, 6000);

// ---------- Booking form ----------
const bookingForm    = document.getElementById('booking-form');
const formSuccess    = document.getElementById('form-success');

if (bookingForm) {
  // Set min date to today
  const dateInput = document.getElementById('f-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  bookingForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    const submitBtn = bookingForm.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

    try {
      const response = await fetch('https://formspree.io/f/xojbwage', {
        method: 'POST',
        body: new FormData(bookingForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        bookingForm.style.display = 'none';
        formSuccess.hidden = false;
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alert('Something went wrong. Please try again or reach us on WhatsApp.');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      alert('Something went wrong. Please try again or reach us on WhatsApp.');
    }
  });
}
