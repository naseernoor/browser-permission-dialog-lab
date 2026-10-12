'use strict';
let fonts = [];
const output = document.getElementById('output');
function log(event, data) { output.textContent += JSON.stringify({time:new Date().toISOString(),event,...data})+'\n'; }
async function state() { const p=await navigator.permissions.query({name:'local-fonts'}); log('permission',{state:p.state}); return p.state; }
async function enumerate() { log('enumerate-start',{activation:navigator.userActivation.isActive}); const next=await window.queryLocalFonts(); fonts=next; log('enumerate-result',{count:fonts.length,metadataFields:fonts.length?['family','fullName','postscriptName','style'].filter(k=>typeof fonts[0][k]==='string'):[],blobMethod:fonts.length?typeof fonts[0].blob==='function':false}); }
function bind(id, fn) { document.getElementById(id).onclick=async()=>{try{await fn();}catch(e){log('error',{action:id,name:e.name,message:e.message});}}; }
bind('state',state);
bind('enumerate',enumerate);
bind('bytes',async()=>{if(!fonts.length)throw new Error('Enumerate successfully first.');log('blob-start',{activation:navigator.userActivation.isActive});const blob=await fonts[0].blob();const bytes=await blob.arrayBuffer();log('blob-result',{blobSize:blob.size,arrayBufferBytes:bytes.byteLength});});
bind('filter',async()=>{if(!fonts.length)throw new Error('Enumerate successfully first.');const result=await queryLocalFonts({postscriptNames:[fonts[0].postscriptName]});log('filtered-result',{count:result.length});});
bind('delayed',async()=>{log('delayed-scheduled',{delayMs:8000});setTimeout(()=>enumerate().catch(e=>log('error',{action:'delayed',name:e.name,message:e.message})),8000);});
bind('reload',()=>location.reload());
log('environment',{userAgent:navigator.userAgent,language:navigator.language,secureContext:isSecureContext,origin:location.origin});
state().catch(e=>log('error',{action:'initial-state',name:e.name,message:e.message}));

bind('second',async()=>{if(fonts.length<2)throw new Error('Enumerate successfully first.');log('second-blob-start',{index:1});const blob=await fonts[1].blob();const bytes=await blob.arrayBuffer();log('second-blob-result',{index:1,blobSize:blob.size,arrayBufferBytes:bytes.byteLength});});
