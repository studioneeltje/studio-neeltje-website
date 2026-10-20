// Describe usage without changing page content or replacing references.
export function mediaUses(id,{pages=[],stories=[],articles=[],settings={}}={}){
 const result=[];
 function contains(value){return value===id||Array.isArray(value)&&value.some(contains)||Boolean(value&&typeof value==='object'&&Object.values(value).some(contains));}
 for(const page of pages){for(const block of page.content||[])if(contains(block.props))result.push({label:`${page.title} · ${block.type}`,pageId:page.id,blockId:block.props.id});for(const [zone,blocks]of Object.entries(page.zones||{}))for(const block of blocks)if(contains(block.props))result.push({label:`${page.title} · ${block.type}`,pageId:page.id,blockId:block.props.id});}
 for(const record of stories)if(contains(record))result.push({label:`Reportage · ${record.title}`});
 for(const record of articles)if(contains(record))result.push({label:`Journal · ${record.title}`});
 for(const [key,value]of Object.entries(settings))if(contains(value))result.push({label:`Algemene instellingen · ${{editorial:'Kaarten & reviews',experience:'Auteur',checklist:'Trouwchecklist'}[key]||key}`});
 return result;
}
export function withLocalPages(pages,read){return pages.map(page=>read(`page:${page.id}`,page));}
