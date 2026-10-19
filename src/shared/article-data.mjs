// Shared by the public article and every Journal listing.
export function articleText(record) {
  const sections=(record.sections||[]).map(s=>[s.title,s.text,s.caption,...(s.items||[])].filter(Boolean).join(' ')).join(' ');
  return [record.title,record.excerpt,...(record.summary||[]),record.body,sections].filter(Boolean).join(' ').replace(/<[^>]*>/g,' ').replace(/!\[[^\]]*\]\([^)]*\)/g,' ').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/[#*_>`~]/g,' ');
}
export function articleReadTime(record) {
  const words=articleText(record).trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1,Math.ceil(words/200))} min lezen`;
}
