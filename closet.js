const $=s=>document.querySelector(s);
const palette={红色:'#d15441',米色:'#f4efe9',蓝色:'#9bc3ff',灰色:'#a6a6a6',白色:'#fff',粉色:'#f3d5de'};
const initial=[{name:'衬衫',color:'蓝色',category:'上装',x:78,y:895},{name:'卫衣',color:'灰色',category:'上装',x:300,y:895},{name:'牛仔裤',color:'蓝色',category:'下装',x:520,y:895},{name:'小白鞋',color:'白色',category:'鞋履',x:78,y:1225},{name:'毛衣开衫',color:'米色',category:'上装',x:300,y:1225},{name:'高跟鞋',color:'粉色',category:'鞋履',x:520,y:1225}];
initial.push({name:'夹克衫',color:'红色',category:'上装',x:343,y:457,compact:true},{name:'阔腿裤',color:'米色',category:'下装',x:510,y:457,compact:true});
const recommendations=[{name:'夹克衫',color:'红色',category:'上装',x:343,y:457},{name:'阔腿裤',color:'米色',category:'下装',x:510,y:457},{name:'小白鞋',color:'白色',category:'鞋履',x:78,y:1225}];
let extra=[];try{const data=JSON.parse(localStorage.getItem('wuxing-garments')||'[]');if(Array.isArray(data))extra=data.filter(p=>typeof p.name==='string'&&p.name.length<=40&&palette[p.color]&&['上装','下装','鞋履','配饰'].includes(p.category)).map(p=>({name:p.name,color:p.color,category:p.category,photo:typeof p.photo==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(p.photo)?p.photo:undefined}));}catch{}
let category='全部',color='全部';
const panel=$('#panel');function open(html){panel.classList.remove('add-garment-panel','filter-panel');$('#panel-content').innerHTML=html;panel.showModal()}$('.close').onclick=()=>panel.close();
function card(p,small=false){const b=document.createElement('article');b.className='garment';b.setAttribute('aria-label',`${p.name}，${p.color}`);const art=document.createElement('span');art.className='art';art.setAttribute('aria-hidden','true');if(p.x!==undefined){art.style.backgroundPosition=`${-p.x/7.8}cqw ${-p.y/7.8}cqw`;if(small&&p.name==='小白鞋'){art.style.backgroundSize='70cqw auto';art.style.backgroundPosition=`${-p.x/7.8*.7}cqw ${-p.y/7.8*.7}cqw`;}if(p.compact&&!small){art.style.backgroundImage='none';art.classList.add('expanded-art');const crop=document.createElement('span');crop.className='compact-crop';crop.style.backgroundPosition=`${-p.x/7.8*1.35}cqw ${-p.y/7.8*1.35}cqw`;art.append(crop);}}else if(p.photo){art.style.backgroundImage='none';const img=document.createElement('img');img.src=p.photo;img.alt=p.name;img.className='uploaded-garment';art.append(img);}else{art.classList.add('custom-art');art.textContent='衣';}const name=document.createElement('strong');name.textContent=p.name;const tone=document.createElement('span');tone.className='tone';const dot=document.createElement('i');dot.style.setProperty('--tone',palette[p.color]);tone.append(dot,document.createTextNode(p.color));b.append(art,name,tone);return b;}
recommendations.forEach(p=>$('.recommend-items').append(card(p,true)));
// Native touch/trackpad scrolling, with mouse dragging and keyboard navigation.
const matchStrip=$('.recommend-items');
matchStrip.tabIndex=0;
matchStrip.setAttribute('role','region');
matchStrip.setAttribute('aria-label','今日匹配衣物，可左右滑动');
matchStrip.lastElementChild.querySelector('.art').classList.add('match-shoes-art');
let matchDrag=null;
matchStrip.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0)return;
  matchDrag={id:event.pointerId,x:event.clientX,left:matchStrip.scrollLeft,moved:false};
});
matchStrip.addEventListener('pointermove',event=>{
  if(!matchDrag||event.pointerId!==matchDrag.id)return;
  const delta=event.clientX-matchDrag.x;
  if(!matchDrag.moved&&Math.abs(delta)<5)return;
  if(!matchDrag.moved){
    matchDrag.moved=true;
    matchStrip.classList.add('is-dragging');
    matchStrip.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  matchStrip.scrollLeft=matchDrag.left-delta;
});
function finishMatchDrag(event){
  if(!matchDrag||event.pointerId!==matchDrag.id)return;
  matchDrag=null;
  matchStrip.classList.remove('is-dragging');
  if(matchStrip.hasPointerCapture(event.pointerId))matchStrip.releasePointerCapture(event.pointerId);
}
matchStrip.addEventListener('pointerup',finishMatchDrag);
matchStrip.addEventListener('pointercancel',finishMatchDrag);
matchStrip.addEventListener('lostpointercapture',finishMatchDrag);
matchStrip.addEventListener('pointerleave',event=>{if(matchDrag&&!matchDrag.moved)finishMatchDrag(event)});
matchStrip.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const step=matchStrip.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(matchStrip).gap);
  const left=event.key==='Home'?0:event.key==='End'?matchStrip.scrollWidth:matchStrip.scrollLeft+(event.key==='ArrowRight'?step:-step);
  matchStrip.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
for(const c of ['全部','上装','下装','鞋履','配饰']){const b=document.createElement('button');b.textContent=c;b.onclick=()=>{category=c;render()};$('.categories').append(b);}
function render(){document.querySelectorAll('.categories button').forEach(b=>{b.classList.toggle('active',b.textContent===category);b.setAttribute('aria-pressed',String(b.textContent===category));});const query=$('#search-input').value.trim();const list=[...initial,...extra].filter(p=>(category==='全部'||p.category===category)&&(color==='全部'||p.color===color)&&(!query||(p.name+p.color).includes(query)));$('.grid').replaceChildren(...list.map(p=>card(p)));$('.empty-result').hidden=list.length>0;$('#filter').style.opacity=color==='全部'?'1':'.5';}
$('#search-input').oninput=render;
$('#filter').onclick=()=>{open('<h2>按颜色筛选</h2><div class="filter-options"></div>');panel.classList.add('filter-panel');for(const c of ['全部',...Object.keys(palette)]){const b=document.createElement('button');b.textContent=c;b.setAttribute('aria-pressed',String(color===c));if(c===color){b.classList.add('selected');}b.onclick=()=>{color=c;render();panel.close()};$('.filter-options').append(b);}};
$('#add').onclick=()=>{open('<h2>添加衣物</h2><form><label class="photo-upload"><input id="garment-photo" type="file" accept="image/png,image/jpeg,image/webp"><span class="photo-placeholder"><span class="photo-plus" aria-hidden="true">+</span>上传衣物照片</span><img id="photo-preview" alt="衣物照片预览" hidden></label><p id="photo-error" role="status" hidden></p><label>衣物名称<input name="name" required maxlength="40" placeholder="例如：亚麻衬衫"></label><label>分类<select name="category"><option>上装</option><option>下装</option><option>鞋履</option><option>配饰</option></select></label><label>颜色<select name="color">'+Object.keys(palette).map(c=>`<option>${c}</option>`).join('')+'</select></label><p id="save-error" hidden>保存失败，请重试。</p><button class="primary" type="submit">添加到衣橱</button></form>');panel.classList.add('add-garment-panel');let photo='',reading=false;$('#garment-photo').onchange=async e=>{const file=e.target.files[0];if(!file)return;const error=$('#photo-error');error.hidden=true;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>2*1024*1024){error.textContent='请选择 2MB 以内的 JPG、PNG 或 WebP 图片';error.hidden=false;e.target.value='';return;}reading=true;$('#panel-content .primary').disabled=true;try{photo=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});$('#photo-preview').src=photo;$('#photo-preview').hidden=false;$('.photo-placeholder').hidden=true;}catch{error.textContent='照片读取失败，请重新选择';error.hidden=false;}finally{reading=false;$('#panel-content .primary').disabled=false;}};$('#panel-content form').onsubmit=e=>{e.preventDefault();if(reading)return;const data=Object.fromEntries(new FormData(e.target));if(photo)data.photo=photo;data.name=data.name.trim();if(!data.name){e.target.elements.name.focus();return;}try{const updated=[...extra,data];localStorage.setItem('wuxing-garments',JSON.stringify(updated));extra=updated;category='全部';color='全部';$('#search-input').value='';render();panel.close()}catch{$('#save-error').hidden=false}};};
document.querySelectorAll('[data-href]').forEach(b=>b.onclick=()=>location.href=b.dataset.href);render();
