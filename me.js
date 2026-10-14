const $=s=>document.querySelector(s);
const panel=$('#panel');
function open(title,html){$('#panel-content').innerHTML=`<h2 id="panel-title">${title}</h2>${html}`;panel.showModal();}
$('.close').onclick=()=>panel.close();
panel.addEventListener('click',e=>{if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)panel.close();}});
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}}
let identity=read('wuxing-identity',{});
function showAvatar(element,value){
  element.replaceChildren();
  if(typeof value==='string' && /^data:image\/(jpeg|png|webp);base64,/.test(value)){
    const img=document.createElement('img');img.src=value;img.alt='个人头像';element.append(img);
  }
}
function render(){ showAvatar($('.account .avatar'),identity.avatar); $('#nickname').textContent=identity.name||'星河漫游';$('#bio').textContent=identity.bio||'遇见更好的自己'; }
render();
const profile=read('wuxing-profile',{});
if(typeof profile.birthday==='string')$('#birth-value').textContent=profile.birthday.replaceAll('-','.');
if(profile.gender)$('#gender-value').textContent=profile.gender==='male'?'男':'女';
if(Array.isArray(profile.styles)&&profile.styles.length){$('#styles-value').textContent=profile.styles.join('、');$('#styles-value').title=profile.styles.join('、');}
// The design supplies the zodiac; do not infer it from a Gregorian year alone.
$('#edit').onclick=()=>{
  open('编辑个人资料','<form id="identity-form"><label>昵称<input name="name" maxlength="20" required></label><label>个人签名<input name="bio" maxlength="40" required></label><p class="form-status" role="status"></p><button class="primary">保存</button></form>');
  const form=$('#identity-form');const avatar=identity.avatar;
  form.elements.name.value=identity.name||'星河漫游';form.elements.bio.value=identity.bio||'遇见更好的自己';
  form.onsubmit=e=>{e.preventDefault();const next={name:form.elements.name.value.trim(),bio:form.elements.bio.value.trim(),avatar};if(!next.name||!next.bio){form.querySelector('.form-status').textContent='请填写昵称和个人签名';return;}try{localStorage.setItem('wuxing-identity',JSON.stringify(next));identity=next;render();panel.close();}catch{form.querySelector('.form-status').textContent='保存失败，请重试';}};
};
function about(){open('关于我们','<p>五行衣橱</p><p>记录衣物与穿搭偏好，发现每日配色灵感，遇见更好的自己。</p>');}

document.querySelectorAll('[data-href]').forEach(b=>b.onclick=()=>location.href=b.dataset.href);


