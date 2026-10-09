'use strict';
(() => {
  document.documentElement.classList.add('js');
  const root = 'https://integrate-your-mind.github.io/books/im-sorry-youre-right/';
  const title = 'I’m Sorry. You’re Right.';
  const pitch = 'An entire book of AI apologies. 42 chapters. Still sorry. Read or listen free.';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem('sorry.' + k); } catch { return null; } }, set(k,v) { try { localStorage.setItem('sorry.' + k, String(v)); } catch {} }, remove(k) { try { localStorage.removeItem('sorry.' + k); } catch {} } };
  let toastTimer;
  function notify(message) { const box = $('#toast'); if (!box) return; box.textContent = message; box.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => box.hidden = true, 4200); }
  async function copy(text) { try { await navigator.clipboard.writeText(text); notify('Copied.'); } catch { const input = $('#share-url'); if (input) { if(!$('#share-dialog').open)openShare(text,pitch); input.value = text; input.focus(); input.select(); notify('Copy is blocked here. The link is selected so you can copy it.'); } else { window.prompt('Copy this link:', text); } } }
  function shareUrl(platform, url, text) {
    const enc = encodeURIComponent, message = text + '\n' + url;
    return { x: 'https://x.com/intent/tweet?text=' + enc(text) + '&url=' + enc(url), bluesky: 'https://bsky.app/intent/compose?text=' + enc(message), reddit: 'https://www.reddit.com/submit?url=' + enc(url) + '&title=' + enc(text), linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url), whatsapp: 'https://wa.me/?text=' + enc(message), telegram: 'https://t.me/share/url?url=' + enc(url) + '&text=' + enc(text), facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url), email: 'mailto:?subject=' + enc(title) + '&body=' + enc(message) }[platform];
  }
  const platforms = [['x','Post on X'],['bluesky','Bluesky'],['reddit','Reddit'],['linkedin','LinkedIn'],['whatsapp','WhatsApp'],['telegram','Telegram'],['facebook','Facebook'],['email','Email']];
  let shareData = { url: root, text: pitch };
  function shareLinks(el, url, text) { el.replaceChildren(); for (const [key,label] of platforms) { const a = document.createElement('a'); a.className = 'btn' + (key === 'x' ? ' primary' : ''); a.textContent = label; a.href = shareUrl(key,url,text); if (key !== 'email') { a.target = '_blank'; a.rel = 'noopener noreferrer'; } el.append(a); } }
  function openShare(url = root, text = pitch) { shareData = {url,text}; $('#quote-preview').textContent = text; $('#share-url').value = url; shareLinks($('#dialog-share-links'),url,text); const dialog = $('#share-dialog'); if (typeof dialog.showModal === 'function') dialog.showModal(); else { dialog.setAttribute('open',''); dialog.scrollIntoView(); } }
  $$('[data-share-book]').forEach(b => b.addEventListener('click', () => openShare()));
  $('#share-close')?.addEventListener('click', () => $('#share-dialog').close());
  $('#share-dialog')?.addEventListener('click', e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close(); } });
  $('#copy-share')?.addEventListener('click', () => copy(shareData.url));
  $('#copy-post')?.addEventListener('click', () => copy(shareData.text + '\n' + shareData.url));
  if (navigator.share && $('#native-share')) { $('#native-share').hidden = false; $('#native-share').addEventListener('click', async () => { try { await navigator.share({title, text:shareData.text, url:shareData.url}); } catch(e) { if(e.name !== 'AbortError') notify('Sharing was unavailable. Use a direct share link or copy the link.'); } }); }
  $$('[data-copy-url]').forEach(b => b.addEventListener('click', () => copy(b.dataset.copyUrl)));
  const theme = store.get('theme'); if (['light','sepia','dark'].includes(theme)) document.body.dataset.theme = theme;
  const font = store.get('font'); if (['18','21','24','27'].includes(font)) document.documentElement.style.setProperty('--size',font+'px');
  $('#theme') && ($('#theme').value = theme || 'light');
  $('#font-size') && ($('#font-size').value = font || '21');
  $('#theme')?.addEventListener('change', e => { document.body.dataset.theme = e.target.value; store.set('theme',e.target.value); });
  $('#font-size')?.addEventListener('change', e => { document.documentElement.style.setProperty('--size',e.target.value+'px'); store.set('font',e.target.value); });
  if (!$('#book-content')) return;
  const loadStatus = $('#load-status');
  let chapters = [], currentChapter = 0, audioChapter = 0, lastSaved = '', quoteSelection = null;
  // Read the two XHTML entries from the existing, unchanged EPUB. No third-party script is loaded.
  async function readEpub() {
    const response = await fetch($('#book-content').dataset.epub || 'Im_Sorry_Youre_Right.epub', {cache:'no-cache'});
    if (!response.ok) throw new Error('The ebook could not be loaded.');
    const data = await response.arrayBuffer();
    if (data.byteLength > 5 * 1024 * 1024) throw new Error('Unexpected ebook size.');
    const hash = crypto.subtle ? [...new Uint8Array(await crypto.subtle.digest('SHA-256',data))].map(x=>x.toString(16).padStart(2,'0')).join('') : null;
    if (hash && hash !== '9b7a3227689ef3ecb94b3e06377a547bab7eec08dc4ef77814d1a7b05f030f84') throw new Error('The ebook edition has changed. Please reload or download the EPUB.');
    const view = new DataView(data), bytes = new Uint8Array(data), decode = new TextDecoder();
    let end = data.byteLength - 22;
    for (; end >= Math.max(0,data.byteLength-65557); end--) if (view.getUint32(end,true) === 0x06054b50) break;
    if (end < 0 || view.getUint32(end,true) !== 0x06054b50) throw new Error('Invalid ebook archive.');
    let offset = view.getUint32(end+16,true); const count = view.getUint16(end+10,true), entries = {};
    for (let i=0;i<count;i++) {
      if (offset+46 > data.byteLength || view.getUint32(offset,true) !== 0x02014b50) throw new Error('Invalid ebook directory.');
      const method=view.getUint16(offset+10,true), compressed=view.getUint32(offset+20,true), uncompressed=view.getUint32(offset+24,true), nameLength=view.getUint16(offset+28,true), extra=view.getUint16(offset+30,true), comment=view.getUint16(offset+32,true), local=view.getUint32(offset+42,true);
      const name=decode.decode(bytes.slice(offset+46,offset+46+nameLength));
      if (['EPUB/book.xhtml','EPUB/sources.xhtml'].includes(name)) {
        if(local+30>data.byteLength || view.getUint32(local,true)!==0x04034b50 || uncompressed>2*1024*1024) throw new Error('Invalid ebook entry.');
        const start=local+30+view.getUint16(local+26,true)+view.getUint16(local+28,true);
        if(start+compressed>data.byteLength) throw new Error('Truncated ebook entry.');
        const chunk=bytes.slice(start,start+compressed); let output;
        if(method===0) output=chunk;
        else if(method===8 && 'DecompressionStream' in window) output=new Uint8Array(await new Response(new Blob([chunk]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
        else throw new Error('This browser cannot open the online reader. Please use a recent browser or download the EPUB.');
        if(output.length!==uncompressed) throw new Error('Incomplete ebook entry.');
        entries[name]=decode.decode(output);
      }
      offset+=46+nameLength+extra+comment;
    }
    if(!entries['EPUB/book.xhtml'] || !entries['EPUB/sources.xhtml']) throw new Error('The ebook is missing content.');
    return entries;
  }
  function cleanTree(node) { $$('script,style,iframe,object,embed',node).forEach(n=>n.remove()); $$('*',node).forEach(n=>{ for(const a of [...n.attributes]) if(a.name.startsWith('on') || a.name.startsWith('epub:')) n.removeAttribute(a.name); }); return node; }
  function plain(el) { const c=el.cloneNode(true); $$('sup,.chapter-actions',c).forEach(n=>n.remove()); return c.textContent.replace(/\s+/g,' ').trim(); }
  function chapterLink(index,paragraph) { return root+'read.html#'+(paragraph || chapters[index].id); }
  function closeContents() { if(matchMedia('(max-width:720px)').matches) { $('#contents').classList.remove('is-open'); $('#contents-toggle').setAttribute('aria-expanded','false'); } }
  function goToChapter(index, updateHash=true) { index=Math.max(0,Math.min(chapters.length-1,index)); currentChapter=index; chapters[index].scrollIntoView({block:'start'}); if(updateHash) { try { history.replaceState(null,'','#'+chapters[index].id); } catch {} } $('#chapter-select').value=String(index); closeContents(); }
  function markChapter(index) { currentChapter=index; $$('#toc-list a[aria-current]').forEach(a=>a.removeAttribute('aria-current')); const a=$('#toc-list a[href="#'+chapters[index].id+'"]'); a?.setAttribute('aria-current','true'); $('#reading-location').textContent=String(index+1).padStart(2,'0')+' / 42'; if(mode==='stopped') $('#chapter-select').value=String(index); if(lastSaved!==chapters[index].id){lastSaved=chapters[index].id;store.set('place',lastSaved);} }
  function buildContents() {
    const toc=$('#toc-list'); let year=''; if(!matchMedia('(max-width:720px)').matches){$('#contents').classList.add('is-open');$('#contents-toggle').setAttribute('aria-expanded','true');}
    chapters.forEach((ch,i)=>{
      const y=ch.closest('.year-section').id.replace('year-','');
      if(y!==year){const p=document.createElement('p');p.className='toc-year';p.textContent=y;toc.append(p);year=y;}
      const a=document.createElement('a');a.href='#'+ch.id;a.textContent=String(i+1).padStart(2,'0')+'. '+$('h3',ch).textContent;a.dataset.search=a.textContent.toLowerCase();a.addEventListener('click',()=>closeContents());toc.append(a);
      const o=document.createElement('option');o.value=String(i);o.textContent=String(i+1).padStart(2,'0')+'. '+$('h3',ch).textContent;$('#chapter-select').append(o);
      $$(':scope > p:not(.chapter-number)',ch).forEach((p,j)=>p.id=ch.id+'-p'+(j+1));
      const actions=document.createElement('div');actions.className='chapter-actions';
      const listen=document.createElement('button');listen.type='button';listen.textContent='Listen to chapter';listen.addEventListener('click',()=>startAudio(i));
      const x=document.createElement('a');x.className='btn';x.textContent='Share on X';x.href=shareUrl('x',chapterLink(i),'“'+$('h3',ch).textContent+'”\nFrom a whole book of AI apologies. Read it free.');x.target='_blank';x.rel='noopener noreferrer';
      const more=document.createElement('button');more.type='button';more.textContent='More ways to share';more.addEventListener('click',()=>openShare(chapterLink(i),'“'+$('h3',ch).textContent+'”\nFrom a whole book of AI apologies.'));
      const link=document.createElement('button');link.type='button';link.textContent='Copy chapter link';link.addEventListener('click',()=>copy(chapterLink(i)));
      actions.append(listen,x,more,link);ch.append(actions);
    });
    $('#contents-search').addEventListener('input',e=>{ const q=e.target.value.toLowerCase().trim(); $$('#toc-list a').forEach(a=>a.hidden=!a.dataset.search.includes(q)); });
    $('#contents-toggle').addEventListener('click',()=>{const c=$('#contents');const expanded=c.classList.toggle('is-open');if(!matchMedia('(max-width:720px)').matches)c.hidden=!expanded;$('#contents-toggle').setAttribute('aria-expanded',String(expanded));});
    $('#chapter-select').addEventListener('change',e=>{const i=Number(e.target.value);if(mode!=='stopped') startAudio(i);else goToChapter(i);});
    $('#random-chapter').addEventListener('click',()=>goToChapter(Math.floor(Math.random()*chapters.length)));
    const resume=store.get('place'),idx=chapters.findIndex(c=>c.id===resume);
    if(idx>=0 && !location.hash){const a=$('#resume-link');a.href='#'+resume;a.textContent='Continue at chapter '+String(idx+1).padStart(2,'0');$('#resume-box').hidden=false;}
    $('#clear-place').addEventListener('click',()=>{store.remove('place');lastSaved='';$('#resume-box').hidden=true;notify('Saved reading position cleared.');});
    let scheduled=false;
    addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;let idx=0;for(let i=0;i<chapters.length;i++){if(chapters[i].getBoundingClientRect().top<innerHeight*.4)idx=i;else break;}markChapter(idx);const start=chapters[0].offsetTop, end=chapters.at(-1).offsetTop+chapters.at(-1).offsetHeight-innerHeight;$('#read-progress').value=Math.max(0,Math.min(100,100*(scrollY-start)/Math.max(1,end-start)));});},{passive:true});
    function hashTarget(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(!id)return;const node=document.getElementById(id);if(node){node.scrollIntoView({block:'start'});const ch=node.closest('.chapter');if(ch)markChapter(chapters.indexOf(ch));}}
    addEventListener('hashchange',hashTarget);requestAnimationFrame(hashTarget);
    $('#quote-selection').addEventListener('click',()=>{if(!quoteSelection)return;const {text,id}=quoteSelection;const display=text.length>165?text.slice(0,162).replace(/\s+\S*$/,'')+'…':text;openShare(root+'read.html#'+id,'“'+display+'”\nAn entire book of AI apologies.');});
    $('#dismiss-selection').addEventListener('click',()=>{$('#selection-tools').hidden=true;window.getSelection()?.removeAllRanges();});
    document.addEventListener('selectionchange',()=>{const selection=getSelection();if(!selection || selection.isCollapsed || !selection.rangeCount){if(!$('#share-dialog').open)$('#selection-tools').hidden=true;return;}const range=selection.getRangeAt(0),node=range.startContainer.nodeType===1?range.startContainer:range.startContainer.parentElement,p=node.closest?.('.chapter > p:not(.chapter-number)');const text=selection.toString().replace(/\s+/g,' ').trim();if(p && p.contains(range.endContainer) && text.length>=15 && text.length<=1200){quoteSelection={text,id:p.id};$('#selection-tools').hidden=false;}});
  }
  // Browser/device TTS. Small chunks avoid long-utterance stalls; no autoplay or server-side synthesis.
  const synth=('speechSynthesis' in window)?window.speechSynthesis:null;
  let mode='stopped',queue=[],position=0,generation=0,activeUtterance=null,watchdog,voices=[];
  function updateAudio() { $('#play-audio').textContent=mode==='playing'?'Pause':mode==='paused'?'Resume':'Play';$('#play-audio').setAttribute('aria-label',mode==='playing'?'Pause narration':mode==='paused'?'Resume narration':'Play narration');$('#audio-prev').disabled=audioChapter<=0;$('#audio-next').disabled=audioChapter>=chapters.length-1;$('#audio-seek').max=String(Math.max(0,queue.length-1));$('#audio-seek').value=String(position);$('#audio-seek').setAttribute('aria-valuetext','Sentence '+(position+1)+' of '+queue.length);$('#audio-meter').max=Math.max(1,queue.length);$('#audio-meter').value=position; }
  function chunks(text){const result=[];for(const sentence of text.match(/[^.!?]+[.!?]+(?:[”’"']|$)?|[^.!?]+$/g)||[text]){let rest=sentence.trim();while(rest.length>170){let cut=rest.lastIndexOf(' ',170);if(cut<50)cut=170;result.push(rest.slice(0,cut).trim());rest=rest.slice(cut).trim();}if(rest)result.push(rest);}return result;}
  function prepare(index){audioChapter=index;const chapter=chapters[index];const elements=[];if(index===0)elements.push(...$$('#editorial > h2,#editorial > p'));if(index%6===0){const year=chapter.closest('.year-section');elements.push(...$$(':scope > .year,:scope > h2,:scope > .epigraph',year));}elements.push(...$$(':scope > h3,:scope > p:not(.chapter-number)',chapter));queue=elements.flatMap(el=>chunks(plain(el)).map(text=>({el,text})));position=0;$('#audio-title').textContent='Chapter '+String(index+1).padStart(2,'0')+' · '+$('h3',chapter).textContent;$('#chapter-select').value=String(index);updateAudio();}
  function clearSpeaking(){ $$('.speaking-paragraph').forEach(el=>el.classList.remove('speaking-paragraph')); }
  function cancelSpeech(){generation++;clearTimeout(watchdog);if(synth){synth.cancel();}activeUtterance=null;}
  function stopAudio(close=false){cancelSpeech();mode='stopped';clearSpeaking();position=0;updateAudio();$('#audio-status').textContent='Stopped. Press Play to restart this chapter.';if(close){$('#audio-panel').hidden=true;document.body.classList.remove('audio-active');document.body.style.paddingBottom='';}}
  function narrationFailed(message){cancelSpeech();mode='paused';clearSpeaking();updateAudio();$('#audio-status').textContent=message;}
  function speakChunk(){
    if(mode!=='playing'||!synth)return;
    if(position>=queue.length){if($('#auto-next').checked && audioChapter<chapters.length-1){prepare(audioChapter+1);if($('#follow-audio').checked)goToChapter(audioChapter);speakChunk();}else{mode='stopped';clearSpeaking();updateAudio();$('#audio-status').textContent=audioChapter===chapters.length-1?'You have reached the last apology.':'Chapter finished. Choose another chapter or press Play to replay.';}return;}
    const token=generation,chunk=queue[position],u=new SpeechSynthesisUtterance(chunk.text);activeUtterance=u;u.lang='en-US';u.rate=Number($('#speed').value);const chosen=voices.find(v=>v.voiceURI===$('#voice').value);if(chosen){u.voice=chosen;u.lang=chosen.lang;}
    clearSpeaking();chunk.el.classList.add('speaking-paragraph');if($('#follow-audio').checked){const r=chunk.el.getBoundingClientRect();if(r.top<110||r.bottom>innerHeight-300)chunk.el.scrollIntoView({block:'center'});}
    $('#audio-status').textContent='Reading sentence '+(position+1)+' of '+queue.length+'.';updateAudio();
    watchdog=setTimeout(()=>{if(token===generation&&mode==='playing')narrationFailed('This browser interrupted narration. Press Resume to try the current sentence again.');},60000);
    u.onend=()=>{if(token!==generation||mode!=='playing')return;clearTimeout(watchdog);position++;setTimeout(()=>{if(token===generation && mode==='playing')speakChunk();},0);};
    u.onerror=e=>{if(token!==generation || ['canceled','interrupted'].includes(e.error))return;narrationFailed(e.error==='not-allowed'?'Your browser blocked narration. Press Resume to allow playback.':'This browser could not speak with that voice. Choose another voice, or use a browser with text-to-speech enabled.');};
    try{synth.resume();synth.speak(u);}catch{narrationFailed('Text-to-speech is unavailable in this browser. You can still read the complete book.');}
  }
  function openAudio(){ $('#audio-panel').hidden=false;document.body.classList.add('audio-active');document.body.style.paddingBottom='280px'; }
  function startAudio(index){openAudio();if(!synth){$('#audio-status').textContent='This browser does not support read-aloud. Try a browser with text-to-speech, or read the text below.';$('#play-audio').disabled=true;return;}cancelSpeech();prepare(index);mode='playing';updateAudio();speakChunk();}
  function populateVoices(){if(!synth)return;voices=synth.getVoices().filter(v=>/^en(?:[-_]|$)/i.test(v.lang));const chosen=store.get('voice') || $('#voice').value;const sel=$('#voice');sel.replaceChildren(new Option('Browser default voice',''));voices.sort((a,b)=>Number(b.localService)-Number(a.localService)||a.name.localeCompare(b.name)).forEach(v=>sel.add(new Option(v.name+(v.localService?' · on device':' · online'),v.voiceURI)));if(voices.some(v=>v.voiceURI===chosen))sel.value=chosen;$('#voice-note').textContent=voices.length?'Voices come from your browser or device. Online voices may use their provider’s service.':'No named voices are available yet. Play will try your browser’s default voice.';}
  function setupAudio(){
    populateVoices();synth?.addEventListener('voiceschanged',populateVoices);setTimeout(populateVoices,1000);
    const speed=store.get('speed');if(['0.75','1','1.25','1.5','2'].includes(speed))$('#speed').value=speed;
    $('#listen-button').addEventListener('click',()=>startAudio(currentChapter));
    $('#audio-close').addEventListener('click',()=>stopAudio(true));
    $('#play-audio').addEventListener('click',()=>{if(mode==='playing'){cancelSpeech();mode='paused';$('#audio-status').textContent='Paused. Resume starts at the current sentence.';updateAudio();}else{if(!queue.length||position>=queue.length)prepare(audioChapter);mode='playing';updateAudio();speakChunk();}});
    $('#stop-audio').addEventListener('click',()=>stopAudio());
    $('#audio-prev').addEventListener('click',()=>startAudio(Math.max(0,audioChapter-1)));
    $('#audio-next').addEventListener('click',()=>startAudio(Math.min(chapters.length-1,audioChapter+1)));
    $('#audio-seek').addEventListener('input',e=>{const playing=mode==='playing';cancelSpeech();position=Number(e.target.value);mode=playing?'playing':'paused';updateAudio();if(playing)speakChunk();else $('#audio-status').textContent='Ready at sentence '+(position+1)+'. Press Resume to listen.';});
    for(const id of ['speed','voice'])$('#'+id).addEventListener('change',e=>{store.set(id,e.target.value);if(mode==='playing'){cancelSpeech();speakChunk();}});
    addEventListener('pagehide',()=>{cancelSpeech();mode='stopped';});
    if(new URLSearchParams(location.search).has('listen')){openAudio();prepare(currentChapter);$('#audio-status').textContent='Press Play to start. Audio never starts automatically.';}
  }
  async function init(){try{
    const files=await readEpub(),parser=new DOMParser(),doc=parser.parseFromString(files['EPUB/book.xhtml'],'text/html');
    if(doc.querySelectorAll('.chapter').length!==42)throw new Error('The book did not contain all 42 chapters.');
    const fragment=document.createDocumentFragment();
    for(const section of doc.body.children)if(section.id!=='title')fragment.append(document.importNode(cleanTree(section),true));
    $('#book-content').replaceChildren(fragment);chapters=$$('.chapter',$('#book-content'));
    $$('#book-content a[href^="sources.xhtml"]').forEach(a=>{a.href='#'+a.getAttribute('href').split('#')[1];});
    const sources=parser.parseFromString(files['EPUB/sources.xhtml'],'text/html');const sourceNode=cleanTree(sources.body.firstElementChild);sourceNode.id='source-notes';
    $$('p',sourceNode).forEach(p=>{if(p.textContent.includes('https://')){for(const br of $$('br',p)){const next=br.nextSibling;if(next?.nodeType===3)next.textContent='\n'+next.textContent;}const text=p.textContent; if(text.includes('https://medium.com/')){p.replaceChildren();text.split(/(https:\/\/\S+)/g).forEach(part=>{if(part.startsWith('https://')){const a=document.createElement('a');a.href=part;a.textContent=part;p.append(a);}else p.append(document.createTextNode(part));});}}});
    $('#source-content').append(document.importNode(sourceNode,true));
    buildContents();setupAudio();$('#reader-controls').hidden=false;loadStatus.hidden=true;$('#loaded-note').hidden=false;$('#end-note').hidden=false;
    if(location.hash.startsWith('#source-'))$('#source-details').open=true;
    document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#source-"]');if(a)$('#source-details').open=true;});
    addEventListener('hashchange',()=>{if(location.hash.startsWith('#source-'))$('#source-details').open=true;});
    if(location.hash){const target=document.getElementById(location.hash.slice(1));requestAnimationFrame(()=>target?.scrollIntoView({block:'start'}));}
  }catch(e){loadStatus.textContent=e.message+' The complete EPUB download is still available above.';loadStatus.setAttribute('role','alert');$('#contents').hidden=true;$('#reader-controls').hidden=true;}}
  init();
})();
