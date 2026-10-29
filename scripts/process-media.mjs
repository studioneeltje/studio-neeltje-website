import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';

export async function command(binary,args,{timeout=900000}={}) {
  return new Promise((resolve,reject)=>{
    const child=spawn(binary,args,{stdio:['ignore','pipe','pipe'],timeout});let out='',err='';
    child.stdout.on('data',d=>{out+=d;if(out.length>2000000)child.kill();});
    child.stderr.on('data',d=>{err=(err+d).slice(-12000);});
    child.once('error',reject);child.once('close',code=>code===0?resolve(out):reject(new Error(`${path.basename(binary)} kon dit bestand niet verwerken (${code}): ${err.slice(-1200)}`)));
  });
}
export function videoDimensions(width,height,maxWidth,maxHeight=1080) {
  const scale=Math.min(1,maxWidth/width,maxHeight/height);
  return {width:Math.max(2,Math.floor(width*scale/2)*2),height:Math.max(2,Math.floor(height*scale/2)*2)};
}
export async function readSource(asset,root,maxBytes,cacheDir) {
  if(/^https:\/\//.test(asset.source)) {
    const url=new URL(asset.source);
    if(url.hostname!=='static.wixstatic.com' || !url.pathname.startsWith('/media/')) throw new Error(`Externe bron niet toegestaan voor ${asset.id}. Upload het bronbestand via de mediabibliotheek.`);
    const cache=path.join(cacheDir,'originals',crypto.createHash('sha256').update(asset.source).digest('hex'));
    try{return await fs.readFile(cache);}catch(error){if(error.code!=='ENOENT')throw error;}
    const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(60000)});
    if(!response.ok)throw new Error(`Bronfoto ${asset.id} laden mislukt (${response.status}).`);
    let size=0;const chunks=[];
    for await(const chunk of response.body){size+=chunk.length;if(size>maxBytes)throw new Error(`Bronbestand ${asset.id} is te groot.`);chunks.push(chunk);}
    const buffer=Buffer.concat(chunks);await fs.mkdir(path.dirname(cache),{recursive:true});await fs.writeFile(cache,buffer);return buffer;
  }
  const name=String(asset.source||'').replace(/^\//,'');
  const absolute=path.resolve(root,name);
  if(!absolute.startsWith(path.resolve(root,'media/originals')+path.sep))throw new Error(`Ongeldig bronpad voor ${asset.id}.`);
  const stat=await fs.stat(absolute);if(stat.size>maxBytes)throw new Error(`${asset.id} is te groot voor deze opslagopzet.`);
  return fs.readFile(absolute);
}

export async function processMedia({root=process.cwd(),outputDir=path.join(root,'dist'),cacheDir=path.join(root,'.cache')}={}) {
  const settings=JSON.parse(await fs.readFile(path.join(root,'content/settings/media.json'),'utf8'));
  const config={imageWidths:[480,800,1280,1920,2560],webpQuality:85,avifQuality:65,videoWidths:[640,1280],videoCRF:23,maxVideoMinutes:15,maxUploadMB:45,...settings};
  if(!Array.isArray(config.imageWidths)||config.imageWidths.some(w=>!Number.isInteger(w)||w<100||w>4096))throw new Error('Ongeldige fotoformaten.');
  if(config.webpQuality<1||config.webpQuality>100||config.avifQuality<1||config.avifQuality>100)throw new Error('Ongeldige beeldkwaliteit.');
  if(!Array.isArray(config.videoWidths)||config.videoWidths.some(w=>!Number.isInteger(w)||w<100||w>1920))throw new Error('Ongeldige videoformaten.');
  if(config.videoCRF<16||config.videoCRF>35||config.maxVideoMinutes<1||config.maxVideoMinutes>30||config.maxUploadMB<1||config.maxUploadMB>90)throw new Error('Ongeldige verwerkingslimiet.');
  const manifest={};
  const entries=(await fs.readdir(path.join(root,'content/media'))).filter(n=>n.endsWith('.json')).sort();
  for(const filename of entries){
    const asset=JSON.parse(await fs.readFile(path.join(root,'content/media',filename),'utf8'));
    if(!/^[a-z0-9][a-z0-9-]{0,100}$/.test(asset.id))throw new Error('Ongeldige media-identificatie.');
    if(asset.deletedAt){manifest[asset.id]={deleted:true,kind:asset.kind,...asset.dimensions};continue;}
    let input;
    try{input=await readSource(asset,root,config.maxUploadMB*1024*1024,cacheDir);}
    catch(error){
      if(error.code!=='ENOENT'||/^https:\/\//.test(asset.source))throw error;
      manifest[asset.id]={missing:true,kind:asset.kind,...asset.dimensions};
      console.warn(`Bronbestand ontbreekt: ${asset.id}; een leeg mediavlak wordt getoond.`);
      continue;
    }
    const hash=crypto.createHash('sha256').update(input).update(JSON.stringify(config)).update('neeltje-media-v1').digest('hex').slice(0,24);
    const work=path.join(cacheDir,'processed',hash);let result;
    try{result=JSON.parse(await fs.readFile(path.join(work,'result.json'),'utf8'));}
    catch(error){
      if(error.code!=='ENOENT')throw error;
      await fs.mkdir(work,{recursive:true});
      if(asset.kind==='video'){
        const inputPath=path.join(work,'source');await fs.writeFile(inputPath,input);
        const info=JSON.parse(await command(process.env.FFPROBE_PATH||ffprobe.path,['-v','error','-show_streams','-show_format','-of','json',inputPath]));
        const stream=info.streams.find(s=>s.codec_type==='video');
        if(!stream)throw new Error(`${asset.title}: geen videobeeld gevonden.`);
        const duration=Number(info.format.duration);
        if(!Number.isFinite(duration)||duration<=0||duration>config.maxVideoMinutes*60)throw new Error(`${asset.title}: video moet korter zijn dan ${config.maxVideoMinutes} minuten.`);
        const rotation=Math.abs(Number(stream.tags?.rotate||stream.side_data_list?.find(s=>s.rotation)?.rotation||0))%180;
        const width=rotation===90?stream.height:stream.width,height=rotation===90?stream.width:stream.height;
        const variants=[],seen=new Set();
        for(const max of config.videoWidths){const dims=videoDimensions(width,height,max);if(seen.has(dims.width))continue;seen.add(dims.width);const name=`video-${dims.width}.mp4`;
          await command(process.env.FFMPEG_PATH||ffmpeg.path,['-y','-v','error','-i',inputPath,'-map','0:v:0','-map','0:a:0?','-vf',`scale=${dims.width}:${dims.height},setsar=1`,'-c:v','libx264','-preset','medium','-crf',String(config.videoCRF),'-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-map_metadata','-1',path.join(work,name)]);
          variants.push({...dims,file:name});}
        await command(process.env.FFMPEG_PATH||ffmpeg.path,['-y','-v','error','-ss',String(Math.min(1,duration*.1)),'-i',inputPath,'-frames:v','1','-vf',`scale=${videoDimensions(width,height,1280).width}:-2`,path.join(work,'poster.jpg')]);
        result={kind:'video',width,height,duration,variants,poster:'poster.jpg'};await fs.rm(inputPath);
      }else{
        const original=sharp(input,{limitInputPixels:100000000}).rotate();const meta=await original.metadata();
        const orientation=meta.orientation||1,width=orientation>=5?meta.height:meta.width,height=orientation>=5?meta.width:meta.height;
        if(!width||!height)throw new Error(`${asset.title}: onleesbare foto.`);
        const widths=[...new Set(config.imageWidths.map(w=>Math.min(w,width)))].sort((a,b)=>a-b),variants=[];
        for(const w of widths){for(const format of ['webp','avif']){const name=`foto-${w}.${format}`;const resized=original.clone().resize({width:w,withoutEnlargement:true});if(format==='avif')await resized.avif({quality:config.avifQuality,effort:4}).toFile(path.join(work,name));else await resized.webp({quality:config.webpQuality,effort:4}).toFile(path.join(work,name));variants.push({width:w,height:Math.round(height*w/width),format,file:name});}}
        result={kind:'image',width,height,variants};
      }
      // A complete result is written only after every variant succeeded.
      await fs.writeFile(path.join(work,'result.json'),JSON.stringify(result));
    }
    const prefix=`media/derived/${asset.id}-${hash.slice(0,8)}`;
    const target=path.join(outputDir,prefix);await fs.mkdir(target,{recursive:true});
    for(const item of [...result.variants,...(result.poster?[{file:result.poster}]:[])])await fs.copyFile(path.join(work,item.file),path.join(target,item.file));
    const variants=result.variants.map(({file,...rest})=>({...rest,src:`${prefix}/${file}`}));
    const fallback=(result.kind==='image'?variants.filter(v=>v.format==='webp'):variants).at(-1);
    manifest[asset.id]={...result,variants,src:fallback.src,full:fallback.src,poster:result.poster?`${prefix}/${result.poster}`:undefined};
    if(input.subarray(0,3).toString()==='GIF'){await fs.writeFile(path.join(target,'animation.gif'),input);manifest[asset.id].animated=`${prefix}/animation.gif`;}
    console.log(`Media gereed: ${asset.id} (${variants.length} varianten)`);
  }
  await fs.mkdir(path.join(outputDir,'media'),{recursive:true});await fs.writeFile(path.join(outputDir,'media/manifest.json'),JSON.stringify(manifest,null,2));return manifest;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))await processMedia();
