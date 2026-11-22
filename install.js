'use strict';
(()=>{
 let deferred;
 const text=s=>typeof localize==='function'?localize(s):s;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferred=event});
 window.addEventListener('appinstalled',()=>{deferred=null;document.querySelectorAll('[data-mobile-install]').forEach(b=>{b.disabled=true;b.textContent=text('已添加到主屏幕')})});
 const button=document.createElement('button');button.type='button';button.className='mobile-install-entry';button.dataset.mobileInstall='';button.textContent=text('添加到主屏幕');document.getElementById('login-form').after(button);
 document.addEventListener('click',async event=>{
  if(!event.target.closest('[data-mobile-install]'))return;
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone){showWorkbookNotice(text('已通过主屏幕打开'));return}
  if(deferred){const prompt=deferred;deferred=null;try{await prompt.prompt();await prompt.userChoice}catch{}return}
  const local=location.protocol==='file:',wechat=/MicroMessenger/i.test(navigator.userAgent),ios=/iPhone|iPad|iPod/i.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
  const steps=local?['请在正式在线地址打开，才能添加桌面快捷方式。']:wechat?['点击微信右上角“…” → 在浏览器打开。','在 Safari 或 Chrome 中选择“添加到主屏幕”。']:ios?['点击 Safari 的分享按钮。','选择“添加到主屏幕”，再点击“添加”。']:['打开浏览器菜单“⋮”。','选择“添加到主屏幕”或“安装应用”。'];
  const dialog=document.createElement('dialog');dialog.className='mobile-install-dialog';dialog.innerHTML='<form method="dialog"><button class="install-close" aria-label="'+text('关闭')+'">×</button></form><img src="pacific-coffee-logo.png" alt="Pacific Coffee" width="64" height="64"><h2>'+text('添加到主屏幕')+'</h2><p>'+text('太平洋咖啡营销分析工作台')+'</p><ol>'+steps.map(s=>'<li>'+text(s)+'</li>').join('')+'</ol><form method="dialog"><button class="primary">'+text('知道了')+'</button></form>';document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
 });
})();
