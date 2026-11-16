(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sections slide in; their children follow one after another */
  var els = document.querySelectorAll('section:not(.hero):not(.page-hero)');
  els.forEach(function (el) {
    el.classList.add('reveal');
    var kids = el.querySelectorAll('.gallery img, .cards .card, .stack .card, .milestones li, .render, .masterplan');
    kids.forEach(function (k, i) {
      k.classList.add('stag');
      k.style.setProperty('--d', (0.25 + Math.min(i, 8) * 0.09).toFixed(2) + 's');
    });
  });
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  if (reduce) return;

  /* Gold scroll progress line + hero photo parallax */
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  var heroImg = document.querySelector('.hero-photo img');
  var ticking = false;
  function update() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY || 0;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    if (heroImg) heroImg.style.translate = '0 ' + Math.min(y * 0.08, 20) + 'px';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* Mark the menu link of the section currently on screen */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var links = {};
  document.querySelectorAll('nav a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
      var a = links[e.target.id];
      if (a) a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  Object.keys(links).forEach(function (id) {
    var s = document.getElementById(id);
    if (s) spy.observe(s);
  });
})();
