// Конфигурация профиля и ссылок.
// Заполните под себя. Можно менять без правки верстки.
window.CONFIG = {
  name: "Ник",
  handle: "@nickname",
  bio: "Короткое био: что делаете, стек, интересы.",
  avatar: "assets/img/avatar.jpg",

  // 'acid' | 'pinkpurple' | 'neon'
  defaultTheme: "acid",

  // 'cdn' | 'local' — откуда брать SVG-иконки
  iconSource: "cdn",

  // Если iconSource === 'local', положите файлы .svg в assets/icons/{type}.svg
  links: [
    { type: "github",    url: "https://github.com/username",     title: "GitHub" },
    { type: "telegram",  url: "https://t.me/username",           title: "Telegram" },
    { type: "x",         url: "https://x.com/username",          title: "X (Twitter)" },
    { type: "instagram", url: "https://instagram.com/username",  title: "Instagram" },
    { type: "discord",   url: "https://discordapp.com/users/ID", title: "Discord" },
    { type: "vk",        url: "https://vk.com/username",         title: "VK" },
    { type: "mail",      url: "mailto:you@example.com",          title: "Email" },
    { type: "website",   url: "https://your-site.com",           title: "Website" }
  ]
};
