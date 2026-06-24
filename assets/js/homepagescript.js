/* ── Canvas particle network ── */
const cv = document.getElementById('bg-canvas'), cx = cv.getContext('2d');
let W, H, ns = [];
const G = 'rgba(129,180,65,', N = 55, MD = 160;
function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight }
function init() { ns = []; for (let i = 0; i < N; i++)ns.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 2 + 1, p: Math.random() * Math.PI * 2, ps: Math.random() * .02 + .008 }) }
function draw() {
    cx.clearRect(0, 0, W, H);
    ns.forEach(n => { n.x += n.vx; n.y += n.vy; n.p += n.ps; if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1; });
    for (let i = 0; i < ns.length; i++)for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < MD) { cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.strokeStyle = G + (1 - d / MD) * .18 + ')'; cx.lineWidth = .6; cx.stroke(); }
    }
    ns.forEach(n => {
        const g = (Math.sin(n.p) + 1) / 2, al = .25 + g * .4;
        cx.beginPath(); cx.arc(n.x, n.y, n.r + g * .8, 0, Math.PI * 2); cx.fillStyle = G + al + ')'; cx.fill();
        if (n.r > 2.2) { cx.beginPath(); cx.arc(n.x, n.y, n.r + 3 + g * 2, 0, Math.PI * 2); cx.strokeStyle = G + (al * .3) + ')'; cx.lineWidth = .5; cx.stroke(); }
    });
    requestAnimationFrame(draw);
}
resize(); init(); draw();
window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

/* ── Typing effect ── */
const words = ["ServiceNow Developer", "Integration Engineer", "Platform Engineer", "Workflow Automation Specialist"];
let wi = 0, ci = 0, del = false;
function type() {
    const cur = words[wi], el = document.getElementById('typing');
    if (!del) { el.textContent = cur.substring(0, ci++); if (ci > cur.length) { del = true; setTimeout(type, 1600); return; } }
    else { el.textContent = cur.substring(0, ci--); if (ci < 0) { del = false; wi = (wi + 1) % words.length; } }
    setTimeout(type, del ? 42 : 90);
}
type();

/* ── Snap scroll tracking ── */
const sections = ['hero', 'about', 'skills', 'experience', 'certs', 'contact'];
const dots = document.querySelectorAll('.side-dot');
const navLinks = document.querySelectorAll('.nav-links a');

function setActive(id) {
    dots.forEach((d, i) => { d.classList.toggle('active', sections[i] === id); });
    navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
}

/* Use IntersectionObserver on sections for snapping */
const snapObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            setActive(e.target.id);
        }
    });
}, { threshold: 0.5 });

sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) snapObs.observe(el);
});

/* ── Reveal animation ── */
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: .1 });
document.querySelectorAll('.hidden').forEach(el => revObs.observe(el));

/* ── Theme toggle ── */
const toggleBtn = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') { html.classList.add('light'); toggleBtn.textContent = '☀️'; }
toggleBtn.addEventListener('click', () => {
    const isLight = html.classList.toggle('light');
    toggleBtn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

/* Set hero active on load */
setActive('hero');