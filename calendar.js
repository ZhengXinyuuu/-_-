const $=s=>document.querySelector(s);
const elements={木:'#89a892',水:'#80adf6',火:'#ff7866',金:'#d6a16c',土:'#dfc3ac'};
const reference=['土','木','水','火','金','木','水','火','金','木','水','土','火','金','木','水','土','金','木','水','土','火','金','火','水','土','金','火','木','水','土','金','水','土','火'];
let year=2026,month=3,selected='2026-4-23';
const palettes={火:['红色','粉色','紫色','米色','白色'],木:['绿色','青色','蓝色','米色','白色'],水:['蓝色','黑色','白色','米色','银色'],金:['白色','银色','米色','黄色','灰色'],土:['黄色','米色','棕色','粉色','白色']};
const colors={红色:'#df7d70',粉色:'#f6dae0',紫色:'#cfbedf',米色:'#f5f0ea',白色:'#fff',绿色:'#89a892',青色:'#a7c8be',蓝色:'#80adf6',黑色:'#454951',银色:'#e0e2e6',黄色:'#e7c787',灰色:'#b9b9b9',棕色:'#b68f73'};
function showDetails(date,element,isReference){
 $('#chosen-date').textContent=`${date.getMonth()+1}月${date.getDate()}日`;
 $('#chosen-week').textContent=isReference?'周'+['一','二','三','四','五','六','日'][(date.getDate())%7]:'周'+['日','一','二','三','四','五','六'][date.getDay()];
 $('#chosen-element').textContent=element;
 $('#lucky-colors').innerHTML=palettes[element].map((name,i)=>`<div class="color-item" data-color="${name}" style="--swatch:${colors[name]}"><i></i><strong>${name}</strong><em>${['主推','次选','平替','辅助','辅助'][i]}</em></div>`).join('');
 $('#advice').textContent=element==='火'?'今日火旺，宜川红色系与暖色系，激发活力与自信，助力事业与社交运。可搭配白色、米色平衡火气，保持整体和谐。':`今日${element}旺，可选择${palettes[element].slice(0,3).join('、')}作为穿搭灵感，搭配柔和的中性色，保持整体和谐。`;
}
function render(){
 const demo=year===2026&&month===3;
 $('#month-title').textContent=`${year}年${month+1}月`;
 const offset=demo?1:(new Date(year,month,1).getDay()+6)%7;
 const count=demo?35:Math.ceil((offset+new Date(year,month+1,0).getDate())/7)*7;
 $('#days').replaceChildren();
 for(let i=0;i<count;i++){
  const date=new Date(year,month,i-offset+1),key=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  const element=demo?reference[i]:Object.keys(elements)[((Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000)%5)+5)%5];
  const b=document.createElement('button');b.className='day'+(date.getMonth()!==month?' outside':'')+(key===selected?' selected':'');b.style.setProperty('--element',elements[element]);b.setAttribute('aria-label',`${date.getMonth()+1}月${date.getDate()}日 五行${element}`);b.setAttribute('aria-pressed',String(key===selected));b.innerHTML=`<span>${date.getDate()}</span><span class="badge">${element}</span>`;
  b.onclick=()=>{selected=key;render();showDetails(date,element,demo&&date.getMonth()===month)};
  $('#days').append(b);
 }
}
function move(delta){const d=new Date(year,month+delta,1);year=d.getFullYear();month=d.getMonth();selected=`${year}-${month+1}-1`;render();$('#days .selected').click()}
$('#previous').onclick=()=>move(-1);$('#next').onclick=()=>move(1);
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{const tab=b.dataset.nav;if(tab==='home')location.href='./index.html';if(tab==='closet'||tab==='profile')location.href=`./index.html?tab=${tab}`});
const panel=$('#calendar-panel');$('.close').onclick=()=>panel.close();
$('#reset-month').onclick=()=>{year=2026;month=3;selected='2026-4-23';render();showDetails(new Date(2026,3,23),'火',true);panel.close()};
render();showDetails(new Date(2026,3,23),'火',true);
