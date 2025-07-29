
const toggle = document.querySelector('.nav-toggle');
const list = document.getElementById('nav-list');
if (toggle && list){
  toggle.addEventListener('click', () => {
    const open = list.style.display === 'block';
    list.style.display = open ? 'none' : 'block';
    toggle.setAttribute('aria-expanded', (!open).toString());
  });
}
const modeBtn = document.getElementById('modeToggle');
if (modeBtn){ modeBtn.addEventListener('click', () => document.documentElement.classList.toggle('light')); }
const form = document.querySelector('form.contact');
if (form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const resEl = document.getElementById('formResult');
    resEl.textContent = '';
    try{
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const out = await res.json();
      if(res.ok){
        resEl.textContent = out.message || 'Danke! Ihre Nachricht wurde versendet.';
        resEl.className = 'form-success';
        form.reset();
      }else{
        resEl.textContent = out.message || 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.';
        resEl.className = 'form-error';
      }
    }catch(err){
      resEl.textContent = 'Es gab ein Problem beim Senden. Bitte versuchen Sie es später erneut.';
      resEl.className = 'form-error';
    }
  });
}
