// Мини-настройки и логика
(async function () {
  // Подтягиваем конфиг
  const res = await fetch('config.json', { cache: 'no-store' });
  const cfg = await res.json();

  // Применяем профиль
  const el = (id) => document.getElementById(id);

  if (cfg.profile?.avatar) el('avatar').src = cfg.profile.avatar;
  if (cfg.profile?.name) el('name').childNodes[0].nodeValue = cfg.profile.name + ' ';
  if (cfg.profile?.username) el('username').textContent = cfg.profile.username;
  if (cfg.profile?.bio) el('bio').textContent = cfg.profile.bio;

  if (cfg.profile?.verified) el('verified').hidden = false;
  if (cfg.profile?.location) {
    const loc = el('location');
    loc.hidden = false;
    loc.textContent = '· ' + cfg.profile.location;
  }

  // Титулы/мета
  const title = (cfg.site?.title) || `${cfg.profile?.name || 'Профиль'} — все ссылки`;
  document.title = title;
  setMeta('og:title', title);
  setMeta('og:description', cfg.site?.description || cfg.profile?.bio || 'Мои соцсети и проекты');
  if (cfg.site?.ogImage) setMeta('og:image', cfg.site.ogImage);

  // Тема
  const root = document.documentElement;
  const themePref = cfg.site?.theme || 'auto'; // 'auto' | 'light' | 'dark'
  applyTheme(themePref);
  if (cfg.site?.accentColor) document.documentElement.style.setProperty('--accent', cfg.site.accentColor);

  // Ссылки
  const linksEl = document.getElementById('links');
  const links = Array.isArray(cfg.links) ? cfg.links : [];
  linksEl.innerHTML = links.map(ln => linkItem(ln)).join('');

  // Копировать ссылку
  const copyBtn = document.getElementById('copyLink');
  copyBtn.addEventListener('click', async () => {
    const toCopy = cfg.site?.shareUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(toCopy);
      copyBtn.textContent = 'Скопировано ✔';
      setTimeout(() => copyBtn.textContent = 'Скопировать ссылку', 1400);
    } catch {
      prompt('Скопируйте ссылку:', toCopy);
    }
  });

  // Переключение темы
  const toggle = document.getElementById('toggleTheme');
  toggle.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || themePref;
    const next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  // Вспомогательные
  function linkItem(ln) {
    const label = ln.label || ln.url;
    const url = ln.url;
    const icon = iconMarkup(ln.icon);
    const rel = url.startsWith('http') ? 'noopener noreferrer' : '';
    return `
      <li>
        <a href="${escapeHtml(url)}" target="_blank" rel="${rel}">
          <span class="i">${icon}</span>
          <span class="l">${escapeHtml(label)}</span>
        </a>
      </li>`;
  }

  function iconMarkup(name) {
    if (!name) return chainIcon();
    const key = String(name).toLowerCase().trim();
    if (key === 'mail' || key === 'email') return mailIcon();
    if (['link','website','globe'].includes(key)) return chainIcon();
    // Simple Icons CDN (CC0). Цвет — белый; CSS перекрасит фоном/контрастом.
    const safe = encodeURIComponent(key);
    return `<img class="icon" src="https://cdn.simpleicons.org/${safe}/ffffff" alt="" loading="lazy" decoding="async" />`;
  }

  function mailIcon() {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
      <path d="m22 8-10 6L2 8"/>
    </svg>`;
  }
  function chainIcon() {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M10.5 13.5 9 15a5 5 0 0 1-7-7l2-2a5 5 0 0 1 7 7"/>
      <path d="M13.5 10.5 15 9a5 5 0 1 1 7 7l-2 2a5 5 0 0 1-7-7"/>
    </svg>`;
  }

  function applyTheme(mode) {
    const stored = localStorage.getItem('theme');
    const finalMode = stored || mode || 'auto';
    document.documentElement.setAttribute('data-theme', finalMode);
    const isDark = finalMode === 'dark' || (finalMode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    // meta theme-color для статус-бара
    const themeMeta = document.querySelector('#theme-color');
    themeMeta?.setAttribute('content', isDark ? '#0b0b0f' : '#ffffff');
  }

  function setMeta(property, content) {
    let m = document.querySelector(`meta[property="${property}"]`);
    if (!m) {
      m = document.createElement('meta');
      m.setAttribute('property', property);
      document.head.appendChild(m);
    }
    m.setAttribute('content', content);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }
})();
