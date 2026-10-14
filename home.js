const panel=document.querySelector('#panel');
const content=document.querySelector('#panel-content');
function openPanel(html){content.innerHTML=html;panel.showModal()}
document.querySelector('.close').onclick=()=>panel.close();
panel.addEventListener('click',e=>{if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)panel.close()}});
document.querySelector('#detail').onclick=()=>{location.href='./detail.html'};
let saved=false;try{saved=localStorage.getItem('wuxing-outfit')==='saved'}catch{}
content.addEventListener('click',e=>{if(e.target.id==='save-outfit'){try{localStorage.setItem('wuxing-outfit','saved');saved=true;e.target.textContent='已加入衣橱';e.target.disabled=true}catch{e.target.textContent='保存失败，请重试'}}});
const secondary=document.querySelector('#secondary-view');
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{if(b.dataset.tab==='我的'){location.href='./me.html';return;}if(b.dataset.tab==='衣橱'){location.href='./closet.html';return;}if(b.dataset.tab==='日历'){location.href='./calendar.html';return;}document.querySelectorAll('[data-tab]').forEach(n=>{n.classList.toggle('active',n===b);if(n===b)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current')});const tab=b.dataset.tab;document.querySelector('#home-view').hidden=tab!=='首页';secondary.hidden=tab==='首页';if(tab==='日历'){secondary.innerHTML='<h1>穿搭日历</h1><h2>4月</h2><div class="calendar">'+['一','二','三','四','五','六','日'].map(x=>`<span>${x}</span>`).join('')+'<span></span>'+Array.from({length:30},(_,i)=>`<button class="${i===22?'selected':''}">${i+1}</button>`).join('')+'</div><div class="secondary-card" id="day-info">4月23日 · 今日火旺<br><p>幸运色：红色 / 粉色 / 紫色 / 米色</p></div>';secondary.querySelectorAll('.calendar button').forEach(d=>d.onclick=()=>{secondary.querySelectorAll('.calendar button').forEach(x=>x.classList.toggle('selected',x===d));document.querySelector('#day-info').textContent=d.textContent==='23'?'4月23日 · 今日火旺，幸运色：红色 / 粉色 / 紫色 / 米色':`4月${d.textContent}日 · 暂无穿搭记录`})}if(tab==='衣橱')secondary.innerHTML='<h1>我的衣橱</h1>'+(saved?'<article class="secondary-card"><div class="outfit-image" role="img" aria-label="收藏的红白穿搭"></div><p>活力红 · 米白日常穿搭</p></article>':'<div class="secondary-card empty">还没有收藏的穿搭<p>在首页查看详情，收藏喜欢的搭配。</p></div>');if(tab==='我的')secondary.innerHTML='<h1>我的</h1><div class="secondary-card"><h2>我的穿搭档案</h2><p>管理生日与穿衣风格偏好。</p><a href="./profile.html">完善个人信息 →</a></div>';});


const initialTab=new URLSearchParams(location.search).get("tab");if(initialTab)document.querySelector(`[data-tab="${initialTab=== "closet"?"衣橱":"我的"}"]`)?.click();

const swatches=document.querySelector('.swatches');
swatches.tabIndex=0;
swatches.setAttribute('role','region');
swatches.setAttribute('aria-label','今日幸运色，可左右滑动');
let swatchDrag=null;
swatches.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='mouse'||e.button!==0)return;
  swatchDrag={id:e.pointerId,x:e.clientX,left:swatches.scrollLeft};
  swatches.setPointerCapture(e.pointerId);
  swatches.classList.add('is-dragging');
  swatches.focus({preventScroll:true});
  e.preventDefault();
});
swatches.addEventListener('pointermove',e=>{
  if(swatchDrag&&e.pointerId===swatchDrag.id)swatches.scrollLeft=swatchDrag.left+swatchDrag.x-e.clientX;
});
function endSwatchDrag(e){
  if(!swatchDrag||e.pointerId!==swatchDrag.id)return;
  swatchDrag=null;
  swatches.classList.remove('is-dragging');
  if(swatches.hasPointerCapture(e.pointerId))swatches.releasePointerCapture(e.pointerId);
}
['pointerup','pointercancel','lostpointercapture'].forEach(type=>swatches.addEventListener(type,endSwatchDrag));
swatches.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();
  const step=swatches.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(swatches).columnGap);
  const left=e.key==='Home'?0:e.key==='End'?swatches.scrollWidth:swatches.scrollLeft+(e.key==='ArrowRight'?step:-step);
  swatches.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});

// Advance left through [first, second, first clone], then reset invisibly.
const outfitCarousel=document.querySelector('#home-view>.outfit>.outfit-image');
if(outfitCarousel){
  const labels=[outfitCarousel.getAttribute('aria-label'),'红色无袖上衣搭配白色蕾丝长裙、红色高跟鞋和白色肩包的日常穿搭'];
  const track=document.createElement('div');
  track.className='outfit-carousel-track';
  track.setAttribute('aria-hidden','true');
  const first=document.createElement('div');
  first.className='outfit-carousel-slide outfit-carousel-original';
  const nextLook=new Image();
  nextLook.className='outfit-carousel-slide';
  nextLook.alt='';
  track.append(first,nextLook,first.cloneNode(true));
  outfitCarousel.append(track);
  let index=0,carouselTimer,resetTimer;
  function resetLoop(){
    if(index!==2)return;
    clearTimeout(resetTimer);
    track.classList.add('reset-position');
    track.style.transform='translateX(0)';
    index=0;
    void track.offsetWidth;
    track.classList.remove('reset-position');
  }
  track.addEventListener('transitionend',e=>{if(e.target===track&&e.propertyName==='transform')resetLoop()});
  function startCarousel(){
    clearInterval(carouselTimer);
    if(document.hidden||!nextLook.complete||!nextLook.naturalWidth)return;
    resetLoop();
    carouselTimer=setInterval(()=>{
      if(document.querySelector('#home-view').hidden||panel.open)return;
      resetLoop();
      index++;
      track.style.transform=`translateX(-${index*100}%)`;
      outfitCarousel.setAttribute('aria-label',labels[index%2]);
      if(index===2){
        if(matchMedia('(prefers-reduced-motion: reduce)').matches)resetLoop();
        else resetTimer=setTimeout(resetLoop,750);
      }
    },4000);
  }
  nextLook.addEventListener('load',startCarousel);
  nextLook.src='./assets/outfit-red-lace.png';
  document.addEventListener('visibilitychange',startCarousel);
  window.addEventListener('pagehide',()=>{clearInterval(carouselTimer);clearTimeout(resetTimer)});
  window.addEventListener('pageshow',startCarousel);
}
