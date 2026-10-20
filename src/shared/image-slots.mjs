// Restore the fixed slots, never overwrite a chosen photo, an explicit empty ID
// or its crops. This is a view of old data; it does not save a page by itself.
export function imageSlots(value,defaults=[]){
 const saved=Array.isArray(value)?value:[];
 const used=new Set();
 const slots=defaults.map((fallback,index)=>{
  const key=String(fallback.key??index);
  const at=saved.findIndex((item,i)=>item&&String(item.key??i)===key);
  if(at<0)return {...fallback};
  used.add(at);return {...fallback,...saved[at],key};
 });
 return [...slots,...saved.filter((item,index)=>item&&!used.has(index))];
}
