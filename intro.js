(() => {
  const internal = (() => { try { return new URL(document.referrer).origin === location.origin; } catch { return false; } })();
  const replay = new URLSearchParams(location.search).get('intro') === 'replay';
  if (!replay && (internal || location.search.includes('tab='))) return;
  const home = document.querySelector('.phone');
  const layer = document.createElement('section');
  layer.className = 'intro';
  layer.setAttribute('aria-label', '五行衣橱，正在开启你的穿搭指南');
  layer.innerHTML = '<div class="intro-scene"><iframe class="intro-frame" src="./launch.html" title="五行衣橱启动页" tabindex="-1" aria-hidden="true"></iframe><div class="intro-veil"><canvas aria-hidden="true"></canvas></div></div><div class="intro-chrome"></div>';
  const chrome = layer.querySelector('.intro-chrome');
  for (const selector of ['.status', '.capsule']) {
    const copy = home.querySelector(selector).cloneNode(true);
    copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    copy.querySelectorAll('button').forEach(el => { el.tabIndex = -1; });
    chrome.append(copy);
  }
  chrome.insertAdjacentHTML('beforeend','<div class="intro-indicator"></div>');
  document.body.append(layer);
  home.inert = true;
  document.documentElement.classList.add('intro-running');
  const canvas = layer.querySelector('canvas'), ctx = canvas.getContext('2d');
  const scene = layer.querySelector('.intro-scene'), veil = layer.querySelector('.intro-veil');
  const launchFrame = layer.querySelector('iframe');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width, height, frame, elapsed = 0, previous, launchStar;
  const resize = () => { width = layer.clientWidth; height = layer.clientHeight; const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = width*dpr; canvas.height = height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
  resize();
  window.addEventListener('resize', resize);
  const ease = t => t*t*(3-2*t);
  const clamp = t => Math.max(0,Math.min(1,t));
  const logo = [-2,-34,-12,-34,-24,-33,-31,-32,-36,-12,-36,12,-31,34,-22,34,-10,34,-2,34,-2,12,-2,-12,-2,-34];
  const star = [0,-40,-5,-12,-12,-5,-40,0,-12,5,-5,12,0,40,0,28,0,12,0,0,0,-12,0,-28,0,-40];
  function half(morph, side) {
    const a = logo.map((v,i) => (v+(star[i]-v)*morph)*(i%2===0?side:1));
    ctx.moveTo(a[0],a[1]);
    for(let i=2;i<a.length;i+=6)ctx.bezierCurveTo(...a.slice(i,i+6));
    ctx.closePath();
  }
  function silhouette(m) {
    ctx.beginPath();
    if(m<1){ half(m,1);half(m,-1); }
    else {
      // One continuous outer contour: no shared vertical edge or double shadow.
      ctx.moveTo(0,-40);
      ctx.bezierCurveTo(-5,-12,-12,-5,-40,0);
      ctx.bezierCurveTo(-12,5,-5,12,0,40);
      ctx.bezierCurveTo(5,12,12,5,40,0);
      ctx.bezierCurveTo(12,-5,5,-12,0,-40);
      ctx.closePath();
    }
  }
  function draw(t) {
    ctx.clearRect(0,0,width,height);
    const m = reduced ? 0 : ease(clamp((t-1000)/550));
    const expansion = reduced ? 0 : Math.pow(clamp((t-1550)/780),2.3);
    const unit = width/780;
    const scale = unit*(1+expansion*(Math.max(width,height)*5/(40*unit)));
    // Fade the logo in during the opening hold, without delaying the morph.
    const entrance = reduced ? 1 : ease(clamp(t/650));
    ctx.save();ctx.translate(width/2,height*.916);
    ctx.globalAlpha=entrance;
    // A single, densely sampled Gaussian falloff avoids concentric colour bands.
    const radius = 185*unit + expansion*Math.max(width,height)*1.5;
    const halo = ctx.createRadialGradient(0,0,0,0,0,radius);
    const tail = Math.exp(-6);
    for(let i=0;i<=48;i++){
      const r=i/48;
      const alpha=m*.66*(Math.exp(-6*r*r)-tail)/(1-tail);
      halo.addColorStop(r,`rgba(244,153,126,${alpha})`);
    }
    ctx.fillStyle=halo;ctx.fillRect(-radius,-radius,radius*2,radius*2);
    ctx.scale(scale,scale);
    const gradient=ctx.createLinearGradient(0,-40,0,40);
    gradient.addColorStop(0,'#d35442');
    gradient.addColorStop(1,`rgb(${255-17*m},${255-76*m},${255-90*m})`);
    ctx.fillStyle=gradient;
    ctx.shadowBlur=0;silhouette(m);ctx.fill();
    ctx.globalAlpha=entrance*(1-m);ctx.fillStyle='#fff';
    for(const x of [-10,10]){ctx.beginPath();ctx.moveTo(x,-7);ctx.quadraticCurveTo(x+1,-2,x+5,-1);ctx.quadraticCurveTo(x+1,0,x,5);ctx.quadraticCurveTo(x-1,0,x-5,-1);ctx.quadraticCurveTo(x-1,-2,x,-7);ctx.fill();}
    ctx.restore();
  }
  const finish = () => { cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('pagehide',finish);layer.remove();home.inert=false;document.documentElement.classList.remove('intro-running'); };
  function tick(now) {
    if(previous!==undefined && !document.hidden) elapsed+=Math.min(now-previous,100);
    previous=now;
    if(!launchStar)launchStar=launchFrame.contentDocument?.querySelector('.launch-star');
    draw(elapsed);
    const reveal=ease(clamp((elapsed-2330)/1400));
    const exit=ease(clamp((elapsed-6030)/1500));
    veil.style.opacity=1-reveal;
    scene.style.opacity=1-exit;
    chrome.querySelector('.capsule').style.backgroundColor=`rgba(255,255,255,${reveal*.6})`;
    if(launchStar){
      const p=clamp((elapsed-3930)/900);
      // A quick overshoot, a small recoil, then a soft settle with a playful tilt.
      const poses=[[0,0,-24],[.38,1.32,12],[.62,.88,-7],[.82,1.06,3],[1,1,0]];
      const index=Math.min(poses.length-2,Math.max(0,poses.findIndex((pose,i)=>i<poses.length-1 && p<=poses[i+1][0])));
      const a=poses[index],b=poses[index+1],blend=ease(clamp((p-a[0])/(b[0]-a[0])));
      const pop=a[1]+(b[1]-a[1])*blend, angle=a[2]+(b[2]-a[2])*blend;
      launchStar.style.opacity=clamp(p*3);
      launchStar.style.transform=reduced?'none':`scale(${Math.max(0,pop)}) rotate(${angle}deg)`;
    }
    layer.dataset.phase=elapsed<1000?'logo':elapsed<1550?'morph':elapsed<2330?'expand':elapsed<3930?'launch-reveal':elapsed<4830?'star-pop':elapsed<6030?'launch':'home';
    if(elapsed>=7530){finish();return;}
    frame=requestAnimationFrame(tick);
  }
  draw(0);frame=requestAnimationFrame(tick);
  window.addEventListener('pagehide',finish,{once:true});
})();





