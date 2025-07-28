
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
if (modeBtn){
  modeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
  });
}
