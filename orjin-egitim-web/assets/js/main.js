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

// Program seçimine göre YKS öğrenci grubu / Maarif sınıfı seçenekleri.
const programSelect = document.querySelector('#program-select');
const studentGroupSelect = document.querySelector('#student-group');
const studentGroupLabel = document.querySelector('#student-group-label');
const studentGroupHelp = document.querySelector('#student-group-help');

if (programSelect && studentGroupSelect && studentGroupLabel && studentGroupHelp) {
  const groupOptions = {
    'yks': {
      label: 'Öğrenci Grubu',
      help: '12. sınıf veya mezun grubunu seçiniz.',
      options: [
        ['12-sinif', '12. Sınıf'],
        ['mezun', 'Mezun']
      ]
    },
    'ara-sinif': {
      label: 'Sınıf / Maarif Modeli',
      help: 'Türkiye Yüzyılı Maarif Modeli kapsamındaki sınıfınızı seçiniz.',
      options: [
        ['9-sinif', '9. Sınıf – Maarif Modeli'],
        ['10-sinif', '10. Sınıf – Maarif Modeli'],
        ['11-sinif', '11. Sınıf – Maarif Modeli']
      ]
    }
  };

  function updateStudentGroups() {
    const group = groupOptions[programSelect.value];
    // Başka programa geçildiğinde eski seçimin kalmasını önle.
    studentGroupSelect.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = group ? 'Öğrenci grubunu seçiniz' : 'Önce program seçiniz';
    studentGroupSelect.appendChild(placeholder);
    studentGroupSelect.disabled = !group;
    studentGroupLabel.textContent = group ? group.label : 'Öğrenci Grubu / Sınıf';
    studentGroupHelp.textContent = group
      ? group.help
      : 'Seçtiğiniz programa göre seçenekler görünecek.';
    if (!group) return;
    group.options.forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      studentGroupSelect.appendChild(option);
    });
  }

  programSelect.addEventListener('change', updateStudentGroups);
  updateStudentGroups();
}
