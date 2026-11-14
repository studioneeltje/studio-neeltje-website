const historicPages = {
  over: 'over-studio-neeltje',
  werkwijze: 'investering',
  journal: 'blogs',
  weddingschecklist: 'gratis-trouwchecklist',
  'veelgestelde-vragen': 'veelgestelde-vragen-trouwfotograaf',
};

const historicStories = {
  bordeaux: 'destination-wedding-fotograaf-bordeaux-frankrijk',
  dengh: 'trouwfotograaf-utrecht-intieme-bruiloft',
  keukenhof: 'trouwfotograaf-kasteel-keukenhof-lisse',
  malaga: 'destination-wedding-fotograaf-malaga-spanje',
  castricum: 'trouwfotograaf-castricum-noord-holland',
};

const historicArticles = {
  'fotoshoot-trouwdag': 'fotoshoot-trouwdag-hoeveel-tijd',
  'niet-graag-op-de-foto': 'niet-graag-op-de-foto-trouwfotografie',
  'onvergetelijke-bruiloft': 'trouwdag-tips',
  'spontane-trouwfotos-tips': 'spontane-trouwfotos-tips',
  'voorbereiden-op-je-trouwdag': 'voorbereiden-op-je-trouwdag',
};

export function publicPagePath(id) {
  return id === 'home' ? '' : historicPages[id] || id;
}

export function publicStoryPath(story) {
  return historicStories[story.cmsSlug] || historicStories[story.id] || story.id;
}

export function publicArticlePath(article) {
  return `blogs/${historicArticles[article.cmsSlug] || article.id}`;
}

export function apacheRules(routes, sitePath, staging) {
  const pattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rules = [
    'Options -MultiViews -Indexes',
    'DirectorySlash Off',
    'RewriteEngine On',
    'RewriteOptions AllowNoSlash',
    `ErrorDocument 404 ${sitePath}404.html`,
  ];
  if (staging) rules.push('Header always set X-Robots-Tag "noindex, nofollow"');
  for (const rule of routes.redirectRules()) {
    const [source, target] = rule.split(' ');
    // THE_REQUEST keeps an internal rewrite to a .html file from redirecting again.
    rules.push(`RewriteCond %{THE_REQUEST} "\\s${pattern(source)}(?:[?\\s])"`,
      `RewriteRule ^${pattern(source.slice(sitePath.length))}$ ${target} [R=301,L]`);
  }
  for (const { file, canonical } of routes.files.values()) {
    if (canonical) rules.push(`RewriteRule ^${pattern(canonical)}/?$ ${file} [L]`);
  }
  return rules.join('\n') + '\n';
}

export function createRoutes({production, siteURL}) {
  const aliases = new Map();
  const canonicals = new Map();
  const files = new Map();

  function add({legacy, preferred, alternatives = [], indexable = true}) {
    const file = production ? (preferred ? `${preferred}.html` : 'index.html') : legacy;
    const canonical = production ? preferred : legacy === 'index.html' ? '' : legacy;
    if (files.has(file) || canonicals.has(canonical)) throw Error(`Dubbel openbaar pagina-adres: ${file}`);
    const route = {file, canonical, indexable};
    files.set(file, route);
    canonicals.set(canonical, route);
    for (const name of new Set([legacy, ...alternatives, ...(production ? [file] : [])])) {
      if (!name) continue;
      for (const alias of [name, name.replace(/\.html$/, '')]) {
        if (aliases.has(alias) && aliases.get(alias) !== route) throw Error(`Dubbel historisch pagina-adres: ${alias}`);
        aliases.set(alias, route);
      }
    }
    return route;
  }

  function resolve(value) {
    if (!value || value.startsWith('#') || value.startsWith('//')) return;
    let url;
    try { url = new URL(value, siteURL); } catch { return; }
    const isHistoricOrigin = ['studioneeltje.com', 'www.studioneeltje.com'].includes(url.hostname);
    if (url.origin !== siteURL.origin && !(production && isHistoricOrigin && /^https?:$/.test(url.protocol))) return;
    const name = (url.pathname.startsWith(siteURL.pathname) ? url.pathname.slice(siteURL.pathname.length) : url.pathname.slice(1)).replace(/\/$/, '');
    const route = canonicals.get(name) || aliases.get(name);
    if (route) return {route, suffix: url.search + url.hash};
  }

  function redirectRules() {
    const redirects = [];
    for (const [alias, route] of aliases) {
      const other = canonicals.get(alias);
      if (other && other !== route) throw Error(`Oud adres overlapt een openbaar adres: ${alias}`);
      if (alias !== route.canonical) {
        redirects.push(`${siteURL.pathname}${alias} ${siteURL.pathname}${route.canonical} 301`);
      }
    }
    return redirects;
  }

  return {add, resolve, redirectRules, files};
}
