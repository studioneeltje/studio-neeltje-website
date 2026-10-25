// One shared pair of Sveltia cards, with the same heading as the Bordeaux page.
export function portfolioCardsProps(settings={}){
 const heading=settings.editorial?.portfolioCards||{};
 return {eyebrow:heading.eyebrow??'DIT WIL IK',title:heading.title??'Ontdek jouw',emphasis:heading.emphasis??'mogelijkheden.',background:heading.background||'white',portfolioLinked:true};
}
// Keep the export name for saved editor versions. Project pages now share one
// personal invitation instead of the former pair of linked information cards.
export function withPortfolioCards(page){
 if(!page?.content||!(/^reportage-/.test(page.id||'')||page.content.some(block=>block.type==='ProjectStory')))return page;
 const existing=page.content.find(block=>block.type==='PersonalInvite');
 const content=page.content.filter(block=>block.type!=='PersonalInvite'&&block.type!=='ContactCTA'&&!(block.type==='InfoCards'&&(block.props?.portfolioLinked||String(block.props?.id||'').includes('portfolio-cards'))));
 const ids=new Set(content.map(block=>block.props?.id));
 let id=existing?.props?.id||`${page.id}-personal-invite`,suffix=2;
 while(ids.has(id))id=`${page.id}-personal-invite-${suffix++}`;
 content.push({type:'PersonalInvite',props:{...existing?.props,id,background:existing?.props?.background||'wine',portfolioInvite:true}});
 return {...page,content};
}
