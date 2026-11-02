import {escapeHTML as e} from './media.mjs';

function dateLabel(value){
  const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value||''));
  if(!match)return String(value||'');
  const months=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  return `${Number(match[3])} ${months[Number(match[2])-1]||''} ${match[1]}`;
}

export function legalTermsMarkup(props,context){
  const document=context.settings.legal;
  if(!document?.articles?.length)return context.preview?'<section class="sn-legal-empty"><p>De algemene voorwaarden zijn nog niet geladen. Open Sveltia → Algemene instellingen → Algemene voorwaarden.</p></section>':'';
  const prefix=String(props.id||'LegalTerms').replace(/[^\w-]/g,''),anchor=id=>`#${prefix}-av-${id}`;
  const articles=document.articles,groups=[{title:'De opdracht',start:1,end:7},{title:'Betaling en afspraken',start:8,end:12},{title:'Rechten en overige bepalingen',start:13,end:Infinity}];
  const paragraph=value=>{
    const text=String(value||'');
    // Emphasise the supplied definition label without changing its text.
    const match=/^([^:]{2,32}:)(\s.*)?$/.exec(text);
    return `<p>${match?`<strong>${e(match[1])}</strong>${e(match[2]||'')}`:e(text)}</p>`;
  };
  const clauses=article=>{
    let number=0,items=[];const parts=[];
    const flush=()=>{if(items.length){parts.push(`<ol class="sn-legal-clauses" start="${number-items.length+1}">${items.join('')}</ol>`);items=[];}};
    for(const value of article.paragraphs||[]){
      // Introductory labels retain their exact wording, without consuming a clause number.
      if(String(value||'').trim().endsWith(':')){flush();parts.push(paragraph(value));continue;}
      number+=1;
      items.push(`<li class="sn-legal-clause" id="av-lid-${e(article.number)}-${number}"><span class="sn-legal-clause-number">${e(article.number)}.${number}</span>${paragraph(value)}</li>`);
    }
    flush();return parts.join('');
  };
  return `<div class="sn-legal" data-legal-document>
    <header class="sn-legal-hero">
      <div class="sn-legal-heading"><p class="sn-legal-kicker">Studio Neeltje / De afspraken</p><h1>${e(document.title||'Algemene voorwaarden').replace(/\s+(\S+)$/,'<br><em>$1.</em>')}</h1><p class="sn-legal-effective">Deze algemene voorwaarden zijn van kracht per <time datetime="${e(document.effective)}">${e(dateLabel(document.effective))}</time>.</p><div class="sn-legal-actions"><a class="sn-legal-primary" href="${anchor('artikel-'+articles[0].number)}">Lees de voorwaarden <span aria-hidden="true">↓</span></a><button class="sn-legal-print" type="button" data-legal-print hidden>Afdrukken <span aria-hidden="true">↗</span></button></div></div>
      <div class="sn-legal-metadata"><p><span>Laatst bijgewerkt</span><time datetime="${e(document.updated)}">${e(dateLabel(document.updated))}</time></p><p><span>Versie</span>${e(document.version)}</p><p><span>Onderneming</span>${e(document.businessName)} · KvK ${e(document.kvk)}</p></div>
    </header>
    <div class="sn-legal-reading" aria-hidden="true"><span data-legal-progress></span></div>
    <div class="sn-legal-layout">
      <aside class="sn-legal-sidebar"><details class="sn-legal-toc" open><summary>In deze voorwaarden <span aria-hidden="true">↘</span></summary><nav aria-label="Artikelen algemene voorwaarden">${groups.map(group=>`<div class="sn-legal-toc-group"><h2>${e(group.title)}</h2><ol start="${group.start}">${articles.filter(article=>article.number>=group.start&&article.number<=group.end).map(article=>`<li><a href="${anchor('artikel-'+article.number)}" aria-label="Artikel ${e(article.number)}: ${e(article.title)}" data-legal-link="${e(article.number)}"><span class="sn-legal-toc-number" aria-hidden="true">${e(article.number)}</span>${e(article.title)}</a></li>`).join('')}</ol></div>`).join('')}</nav></details><a class="sn-legal-back" href="${anchor('boven')}">Terug naar boven ↑</a></aside>
      <div class="sn-legal-articles" id="av-inhoud">${articles.map(article=>`<article class="sn-legal-article" data-legal-article="${e(article.number)}" id="av-artikel-${e(article.number)}" aria-labelledby="av-kop-${e(article.number)}"><header><h2 id="av-kop-${e(article.number)}"><span class="sn-legal-article-number">Artikel ${e(article.number)}.</span> ${e(article.title)}</h2></header><div class="sn-legal-copy">${clauses(article)}</div></article>`).join('')}
      <aside class="sn-legal-question"><p class="sn-legal-kicker">Een vraag over de voorwaarden?</p><h2>Laat het me <em>weten.</em></h2><div><a class="sn-legal-contact" href="contact.html">Neem contact op <span aria-hidden="true">↗</span></a></div><span class="sn-legal-signature">Neeltje</span></aside></div>
    </div>
    <span class="sn-legal-top-anchor" id="av-boven" aria-hidden="true"></span>
  </div>`;
}
