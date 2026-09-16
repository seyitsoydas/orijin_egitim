const header = document.querySelector('.header');
const toggle = document.querySelector('.menu-toggle');
const progress = document.querySelector('.page-progress');

if (toggle && header) {
  toggle.addEventListener('click', () => header.classList.toggle('nav-open'));
}

document.querySelectorAll('.nav-item.has-dropdown > .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    if (window.innerWidth <= 920) {
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    }
  });
});

function onScroll(){
  if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  if(progress){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, p)}%`;
  }
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12, rootMargin:'0px 0px -40px 0px'});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.faq-item').classList.toggle('open'));
});

document.querySelectorAll('[data-counter]').forEach(el => {
  const end = Number(el.dataset.counter || 0);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const t0 = performance.now();
      const dur = 900;
      function tick(now){
        const p = Math.min(1,(now-t0)/dur);
        const eased = 1-Math.pow(1-p,3);
        el.textContent = prefix + Math.floor(end*eased) + suffix;
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  },{threshold:.55});
  io.observe(el);
});

document.querySelectorAll('form[data-demo-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    if(status){
      status.classList.add('show');
      status.textContent = 'Talebiniz alındı. Bu demo sürümde form gönderimi simüle edilmiştir.';
    }
  });
});

window.addEventListener('resize', () => {
  if(window.innerWidth > 920 && header) header.classList.remove('nav-open');
});
