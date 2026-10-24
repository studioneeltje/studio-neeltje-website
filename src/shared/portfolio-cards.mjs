// One shared pair of Sveltia cards, with the same heading as the Bordeaux page.
export function portfolioCardsProps(settings={}){
 const heading=settings.editorial?.portfolioCards||{};
 return {eyebrow:heading.eyebrow??'DIT WIL IK',title:heading.title??'Ontdek jouw',emphasis:heading.emphasis??'mogelijkheden.',background:heading.background||'white',portfolioLinked:true};
}
export function withPortfolioCards(page){
 if(!page?.content||!(/^reportage-/.test(page.id||'')||page.content.some(block=>block.type==='ProjectStory')))return page;
 let inserted=false;
 const ids=new Set(page.content.map(block=>block.props?.id));
 let id=`${page.id}-portfolio-cards`,suffix=2;while(ids.has(id))id=`${page.id}-portfolio-cards-${suffix++}`;
 const linked=page.content.flatMap(block=>{
  if(block.type!=='InfoCards')return [block];
  if(inserted)return [];
  inserted=true;
  return [{...block,props:{...block.props,portfolioLinked:true}}];
 });
 if(!inserted)linked.push({type:'InfoCards',props:{id,...portfolioCardsProps()}});
 return {...page,content:linked};
}
