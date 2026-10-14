const spaces=[10,10,10,12,13,14,20,21,22,30];
const transfers=[50000,60000,70000,100000,110000,120000,200000,210000,220000,300000];
const recycleDays=[30,40,50,60,70,80,90,100,120,180];
const downloadTB=[2,2,2,6,6,6,12,12,12,12];
const upgradeGifts=[
  '3元超会代金券','5元超会代金券','7元超会代金券',
  '25元超会代金券<br>神秘礼物','35元超会代金券<br>神秘礼物','40元超会代金券<br>神秘礼物',
  '88元超会代金券<br>10天会员分享红包<br>神秘礼物',
  '100元超会代金券<br>15天会员分享红包<br>神秘礼物',
  '108元超会代金券<br>20天会员分享红包<br>神秘礼物',
  '1元开年费<br>25天会员分享红包<br>神秘礼物'
];
const birthdayDays=[1,1,2,3,4,5,7,10,15,20];
const birthdayGrowth=[20,30,50,80,100,120,150,200,300,400];
document.querySelector('#benefit-rows').innerHTML=spaces.map((space,i)=>`<tr><td><img src="assets/frame100-svip-${i+1}.png" alt="SVIP${i+1}" width="63" height="22"></td><td>${space}TB</td><td>${transfers[i]}</td><td>${recycleDays[i]}天</td><td>${downloadTB[i]}TB/月</td><td>${i<6?'有':`SVIP${i+1}专属`}</td><td>${upgradeGifts[i]}</td><td>${birthdayDays[i]}天超级会员<br>${birthdayGrowth[i]}点成长值</td></tr>`).join('');
const benefitScroller=document.querySelector('.benefit-clip');
benefitScroller.addEventListener('scroll',()=>{
  const remaining=benefitScroller.scrollWidth-benefitScroller.clientWidth-benefitScroller.scrollLeft;
  const atEnd=benefitScroller.classList.contains('at-end');
  if((remaining<=1)===atEnd)return;
  const oldWidth=benefitScroller.clientWidth;
  const oldLeft=benefitScroller.scrollLeft;
  benefitScroller.classList.toggle('at-end',remaining<=1);
  const offset=oldWidth-benefitScroller.clientWidth;
  benefitScroller.scrollLeft=oldLeft+offset;
  if(tableDrag)tableDrag.scrollLeft+=offset;
});
let tableDrag=null;
benefitScroller.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0)return;
  tableDrag={pointerId:event.pointerId,x:event.clientX,scrollLeft:benefitScroller.scrollLeft};
  benefitScroller.setPointerCapture(event.pointerId);
  benefitScroller.classList.add('dragging');
  event.preventDefault();
});
benefitScroller.addEventListener('pointermove',event=>{
  if(!tableDrag||event.pointerId!==tableDrag.pointerId)return;
  benefitScroller.scrollLeft=tableDrag.scrollLeft+tableDrag.x-event.clientX;
});
function endTableDrag(){tableDrag=null;benefitScroller.classList.remove('dragging')}
benefitScroller.addEventListener('pointerup',endTableDrag);
benefitScroller.addEventListener('pointercancel',endTableDrag);
benefitScroller.addEventListener('lostpointercapture',endTableDrag);
benefitScroller.addEventListener('dragstart',event=>event.preventDefault());
document.querySelector('#back').addEventListener('click',()=>{if(history.length>1)history.back();else location.href='me.html'});

