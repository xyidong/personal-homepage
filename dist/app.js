import { translations } from './content.js';

const languageButtons = [...document.querySelectorAll('[data-lang]')];
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
let currentLanguage = 'zh';
let toastTimeout;

function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', translations[currentLanguage].menuOpen);
}

function setLanguage(language) {
  currentLanguage = language in translations ? language : 'zh';
  const copy = translations[currentLanguage];
  document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
  document.title = copy.pageTitle;
  document.querySelector('meta[name="description"]').content = copy.description;
  document.querySelector('meta[property="og:title"]').content = copy.pageTitle;
  document.querySelector('meta[property="og:description"]').content = copy.description;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = copy[element.dataset.i18n];
    if (value !== undefined) element.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const value = copy[element.dataset.i18nAria];
    if (value !== undefined) element.setAttribute('aria-label', value);
  });
  languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === currentLanguage)));
  closeMenu();
  document.querySelector('#toast').classList.remove('visible');
  try { localStorage.setItem('yidong-language', currentLanguage); } catch { /* Works without storage permission. */ }
}

let initialLanguage = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
try { initialLanguage = localStorage.getItem('yidong-language') || initialLanguage; } catch { /* Use browser language. */ }
const queryLanguage = new URLSearchParams(location.search).get('lang');
if (queryLanguage === 'zh' || queryLanguage === 'en') initialLanguage = queryLanguage;
setLanguage(initialLanguage);
languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));

menuButton.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', translations[currentLanguage][opening ? 'menuClose' : 'menuOpen']);
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !document.querySelector('.site-header').contains(event.target)) closeMenu();
});
matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

document.querySelector('#copy-email').addEventListener('click', async () => {
  let copied = false;
  try { await navigator.clipboard.writeText('xuyidong@bupt.edu.cn'); copied = true; } catch {
    // Fallback for browsers without clipboard API or where clipboard access is denied.
    const field = document.createElement('textarea');
    field.value = 'xuyidong@bupt.edu.cn';
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    try { copied = document.execCommand('copy'); } catch { /* Show manual-copy hint. */ }
    field.remove();
    document.querySelector('#copy-email').focus({ preventScroll: true });
  }
  const toast = document.querySelector('#toast');
  toast.textContent = translations[currentLanguage][copied ? 'copied' : 'copyFailed'];
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3200);
});

document.querySelector('#year').textContent = new Date().getFullYear();
const header = document.querySelector('.site-header');
function updateHeader() { header.classList.toggle('scrolled', scrollY > 15); }
addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if ('IntersectionObserver' in window) {
  const navigationObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      document.querySelectorAll('.desktop-nav a').forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main > section').forEach(section => navigationObserver.observe(section));
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.section-intro, .about-content, .section-heading, .project-card, .timeline-item, .education-card, .exchange-item, .skills-row, .contact-panel').forEach(element => {
      element.classList.add('reveal');
      revealObserver.observe(element);
    });
  }
}
