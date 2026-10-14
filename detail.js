const products=[{name:'针织开衫',closet:'夹克衫',color:'红色',tone:'red',tags:'针织、简约',description:'红色针织开衫作为整套搭配的亮点，搭配白色内搭，简约又有活力。'},{name:'阔腿裤',closet:'阔腿裤',color:'米色',tone:'cream',tags:'高腰、休闲',description:'米色高腰阔腿裤，宽松利落，以柔和的浅色平衡红色上装。'},{name:'小白鞋',closet:'小白鞋',color:'白色',tone:'white',tags:'皮质、运动',description:'白色运动鞋呼应浅色内搭，红色细节与开衫相呼应。'}];
function card(p,i,closet=false){return `<button class="item" data-item="${i}" data-closet="${closet}"><span class="product-art art-${i}" aria-hidden="true"></span>${closet?'<span>':''}<strong>${closet?p.closet:p.name}</strong><span class="color"><i class="${p.tone}"></i>${p.color}</span>${closet?'</span>':`<small>${p.tags}</small>`}</button>`}
document.querySelector('.outfit .items').innerHTML=products.map((p,i)=>card(p,i)).join('');document.querySelector('.closet').innerHTML=products.map((p,i)=>card(p,i,true)).join('');

// Touch and trackpad scrolling stay native; mouse users can drag either strip.
document.querySelectorAll('.items').forEach(strip=>{
  strip.tabIndex=0;
  strip.setAttribute('role','region');
  let drag=null;
  let suppressClick=false;
  strip.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0)return;
    suppressClick=false;
    drag={id:event.pointerId,x:event.clientX,left:strip.scrollLeft,moved:false};
  });
  strip.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const delta=event.clientX-drag.x;
    if(!drag.moved&&Math.abs(delta)<5)return;
    if(!drag.moved){
      drag.moved=true;
      strip.classList.add('is-dragging');
      strip.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    strip.scrollLeft=drag.left-delta;
  });
  function finish(event){
    if(!drag||event.pointerId!==drag.id)return;
    suppressClick=drag.moved;
    drag=null;
    strip.classList.remove('is-dragging');
    if(strip.hasPointerCapture(event.pointerId))strip.releasePointerCapture(event.pointerId);
  }
  strip.addEventListener('pointerup',finish);
  strip.addEventListener('pointercancel',finish);
  strip.addEventListener('lostpointercapture',finish);
  strip.addEventListener('pointerleave',event=>{if(drag&&!drag.moved)finish(event)});
  strip.addEventListener('click',event=>{
    if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false}
  },true);
  strip.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const step=strip.querySelector('.item').getBoundingClientRect().width+parseFloat(getComputedStyle(strip).gap);
    const left=event.key==='Home'?0:event.key==='End'?strip.scrollWidth:strip.scrollLeft+(event.key==='ArrowRight'?step:-step);
    strip.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
});
const panel=document.querySelector('#panel'),content=document.querySelector('#panel-content');function openPanel(html){content.innerHTML=html;panel.showModal()}document.querySelector('.close').onclick=()=>panel.close();panel.onclick=e=>{if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)panel.close()}};
document.querySelector('#expand').onclick=e=>{const button=e.currentTarget;const expanded=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',expanded);document.querySelector('#analysis-more').hidden=!expanded;button.innerHTML=`${expanded?'收起':'展开'} <span class="chevron"></span>`};
const favorite=document.querySelector('#favorite');let saved=false;try{saved=localStorage.getItem('wuxing-outfit')==='saved'}catch{}function renderSaved(){favorite.setAttribute('aria-pressed',saved);favorite.setAttribute('aria-label',saved?'取消收藏穿搭':'收藏穿搭')}renderSaved();let toastTimer;function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2200)}favorite.onclick=()=>{try{localStorage.setItem('wuxing-outfit',saved?'':'saved');saved=!saved;renderSaved();toast(saved?'已收藏穿搭':'已取消收藏')}catch{toast('暂时无法保存，请重试')}};
const secondProducts=[
  {name:'无袖上衣',color:'红色',tone:'red',tags:'复古、法式'},
  {name:'半身裙',color:'米色',tone:'cream',tags:'法式、温柔'},
  {name:'高跟鞋',color:'红色',tone:'red',tags:'复古、法式'}
];
const hero=document.querySelector('.hero');
hero.removeAttribute('role');
hero.setAttribute('aria-label','穿搭轮播，可左右滑动');
hero.setAttribute('aria-roledescription','轮播');
const track=document.createElement('div');
track.className='hero-track';track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-label','穿搭效果图，使用左右方向键切换');
track.innerHTML='<div class="hero-slide look-first" role="img" aria-label="第1套：红色针织开衫、米色阔腿裤与小白鞋"></div><div class="hero-slide look-second" role="img" aria-label="第2套：红色无袖上衣、米色半身裙与红色高跟鞋"></div>';
hero.prepend(track);
const indicators=document.querySelector('.slide-indicator');indicators.removeAttribute('aria-hidden');
indicators.innerHTML='<button aria-label="切换到第1套穿搭" aria-pressed="true"></button><button aria-label="切换到第2套穿搭" aria-pressed="false"></button>';
const indicatorButtons=[...indicators.children];
let activeLook=0;
const savedLooks=[saved,false];try{savedLooks[1]=localStorage.getItem('wuxing-outfit-second')==='saved'}catch{}
function activateLook(index){
  if(index===activeLook)return;
  activeLook=index;hero.dataset.look=index;
  const items=document.querySelector('.outfit .items');
  items.classList.toggle('second-items',index===1);
  items.innerHTML=(index===1?secondProducts:products).map((p,i)=>card(p,i)).join('');items.scrollLeft=0;
  indicatorButtons.forEach((button,i)=>button.setAttribute('aria-pressed',i===index));
  saved=savedLooks[index];renderSaved();
}
favorite.onclick=()=>{try{const key=activeLook===0?'wuxing-outfit':'wuxing-outfit-second';localStorage.setItem(key,saved?'':'saved');saved=!saved;savedLooks[activeLook]=saved;renderSaved();toast(saved?'已收藏穿搭':'已取消收藏')}catch{toast('暂时无法保存，请重试')}};
function goToLook(index){index=Math.max(0,Math.min(1,index));track.scrollTo({left:index*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
indicatorButtons.forEach((button,i)=>button.onclick=()=>goToLook(i));
track.addEventListener('scroll',()=>activateLook(Math.max(0,Math.min(1,Math.round(track.scrollLeft/track.clientWidth)))),{passive:true});
track.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();goToLook(e.key==='Home'?0:e.key==='End'?1:activeLook+(e.key==='ArrowRight'?1:-1))});
let heroDrag=null;
track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;heroDrag={id:e.pointerId,x:e.clientX,left:track.scrollLeft,index:activeLook};track.setPointerCapture(e.pointerId);track.classList.add('is-dragging')});
track.addEventListener('pointermove',e=>{if(!heroDrag||e.pointerId!==heroDrag.id)return;e.preventDefault();track.scrollLeft=heroDrag.left+heroDrag.x-e.clientX});
function endHeroDrag(e){if(!heroDrag||e.pointerId!==heroDrag.id)return;const drag=heroDrag;heroDrag=null;track.classList.remove('is-dragging');if(track.hasPointerCapture(e.pointerId))track.releasePointerCapture(e.pointerId);const delta=drag.x-e.clientX;goToLook(e.type==='pointercancel'?drag.index:Math.abs(delta)>track.clientWidth*.12?drag.index+(delta>0?1:-1):drag.index)}
track.addEventListener('pointerup',endHeroDrag);track.addEventListener('pointercancel',endHeroDrag);
new ResizeObserver(()=>track.scrollTo({left:activeLook*track.clientWidth,behavior:'instant'})).observe(track);

// Reuse the existing wardrobe page from the outfit detail section.
document.querySelector('[data-dialog="wardrobe"]').onclick=()=>{location.href='./closet.html'};
