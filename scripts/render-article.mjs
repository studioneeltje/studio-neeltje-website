import {load} from 'cheerio';
import {renderArticle as sharedArticle} from '../src/shared/article.mjs';
export function renderArticle(record,context){
 return sharedArticle(record,context,markup=>{
 const $=load(markup,null,false);
 const headings=[];const used=new Set();
 $('h2,h3').each((i,el)=>{const title=$(el).text();const base=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'onderwerp';let id='lees-'+base;let n=2;while(used.has(id))id='lees-'+base+'-'+n++;used.add(id);$(el).attr('id',id);headings.push({id,title,sub:el.tagName==='h3'});});
 return {html:$.html(),headings};
 });
}
