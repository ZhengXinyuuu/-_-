const form = document.querySelector('#profile-form');
const dialog = document.querySelector('#birthday-dialog');
const birthday = document.querySelector('#birthday');
const display = document.querySelector('#birthday-value');
let chosenBirthday = '2003-12-10';
let step = 1;
const today = new Date();
birthday.max = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.querySelector('#birthday-button').addEventListener('click', () => { birthday.value = chosenBirthday; dialog.showModal(); });
dialog.addEventListener('close', () => { if(dialog.returnValue === 'confirm' && birthday.value && birthday.validity.valid) { chosenBirthday = birthday.value; display.textContent = chosenBirthday.replaceAll('-', '–'); } });
dialog.addEventListener('click', event => { if(event.target === dialog) { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close('cancel'); } });
const styles = ['简约','甜美少女','中性','复古','国风','职场商务','休闲风','法式优雅','小众个性'];
document.querySelector('.style-options').innerHTML = styles.map(style => `<label><input type="checkbox" name="style" value="${style}">${style}</label>`).join('');
function setStep(value) { step = value; document.querySelector('#basic-fields').hidden = step !== 1; document.querySelector('#style-fields').hidden = step !== 2; document.querySelector('.next').textContent = step === 1 ? '下一步' : '确定'; document.querySelector('.progress').setAttribute('aria-valuenow', step); document.querySelector('.progress').dataset.step = String(step); document.querySelector('.notice').textContent = ''; }
function save(skipped=false) { const data = { gender: form.elements.gender.value, birthday: chosenBirthday, styles: [...form.querySelectorAll('input[name="style"]:checked')].map(input => input.value), skipped }; try { localStorage.setItem('wuxing-profile', JSON.stringify(data)); document.querySelector('.notice').textContent = '信息已保存'; } catch { document.querySelector('.notice').textContent = '当前浏览器无法保存信息，请稍后重试'; } }
form.addEventListener('submit', event => { event.preventDefault(); if(step === 1) setStep(2); else save(); });
document.querySelector('.skip').addEventListener('click', () => { if(step === 1) setStep(2); else save(true); });
document.querySelector('.back').addEventListener('click', event => { if(step === 2) { event.preventDefault(); setStep(1); } });
let photoUrl;
document.querySelector('#photo').addEventListener('change', event => { const file = event.target.files[0]; if(!file) return; if(!file.type.startsWith('image/')) { document.querySelector('.notice').textContent = '请选择图片文件'; return; } if(photoUrl) URL.revokeObjectURL(photoUrl); photoUrl = URL.createObjectURL(file); const img = document.querySelector('.photo-box img'); img.src = photoUrl; img.hidden = false; document.querySelector('.photo-box span').hidden = true; });

setStep(new URLSearchParams(location.search).get('step') === '2' ? 2 : 1);

