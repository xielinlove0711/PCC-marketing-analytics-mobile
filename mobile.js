'use strict';
(()=>{
 const sidebar=document.querySelector('.sidebar'),top=document.querySelector('.top');
 if(!sidebar||!top)return;
 const mobile=matchMedia('(max-width:760px)');
 const copy=(zh,tw,en)=>typeof uiLanguage!=='undefined'&&uiLanguage==='en'?en:typeof uiLanguage!=='undefined'&&uiLanguage==='zh-HK'?tw:zh;
 const toggle=document.createElement('button');toggle.type='button';toggle.className='mobile-nav-toggle';toggle.setAttribute('aria-expanded','false');sidebar.id='workspace-navigation';toggle.setAttribute('aria-controls',sidebar.id);toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';top.prepend(toggle);
 const close=document.createElement('button');close.type='button';close.className='mobile-nav-close';close.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';sidebar.prepend(close);
 const backdrop=document.createElement('button');backdrop.type='button';backdrop.className='mobile-nav-backdrop';backdrop.tabIndex=-1;document.body.append(backdrop);
 const labels=()=>{toggle.setAttribute('aria-label',copy('打开导航','開啟導覽','Open navigation'));close.setAttribute('aria-label',copy('关闭导航','關閉導覽','Close navigation'));backdrop.setAttribute('aria-label',close.getAttribute('aria-label'))};
 const setOpen=(open,restore=false)=>{document.body.classList.toggle('mobile-nav-open',open);toggle.setAttribute('aria-expanded',String(open));sidebar.inert=mobile.matches&&!open;if(open)close.focus();else if(restore)toggle.focus();};
 toggle.addEventListener('click',()=>{labels();setOpen(true)});close.addEventListener('click',()=>setOpen(false,true));backdrop.addEventListener('click',()=>setOpen(false,true));
 sidebar.addEventListener('click',e=>{if(mobile.matches&&e.target.closest('a[href]'))setOpen(false,true)});
 document.addEventListener('keydown',e=>{if(!mobile.matches||!document.body.classList.contains('mobile-nav-open'))return;if(e.key==='Escape')setOpen(false,true);if(e.key==='Tab'){const focusable=[...sidebar.querySelectorAll('a,button,summary')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
 mobile.addEventListener('change',()=>setOpen(false));window.addEventListener('hashchange',()=>setOpen(false));labels();setOpen(false);

})();

(()=>{
 const root=document.querySelector('main');let pending=false;
 const nav=document.createElement('nav');nav.className='mobile-bottom-nav no-print';nav.setAttribute('aria-label','主要导航');
 const icons=['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z','M4 5h16v15H4zM8 3v4M16 3v4M4 10h16','M6 3h12v18l-6-4-6 4z','M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7'];
 nav.innerHTML=[['#summary','总览'],['#summary/activity','活动'],['#reports/materials','素材库'],['#reports/drafts','报告']].map(([href,label],i)=>'<a href="'+href+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+icons[i]+'"/></svg><span>'+label+'</span></a>').join('');document.body.append(nav);
 const txt=s=>typeof localize==='function'?localize(s):s;
 function enhance(){
  pending=false;const hash=location.hash||'#summary';
  document.body.classList.toggle('mobile-report-reading',hash==='#reports');
  nav.querySelectorAll('a').forEach((a,i)=>{const on=i===0?hash.startsWith('#summary')&&!hash.includes('/activity'):i===1?hash.includes('activity')||hash.startsWith('#analysis'):i===2?hash==='#reports/materials':hash.startsWith('#reports')&&hash!=='#reports/materials';a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(hash.startsWith('#summary')&&!root.querySelector('.mobile-summary-tabs')){const tabs=document.createElement('nav');tabs.className='mobile-summary-tabs';tabs.innerHTML=[['#summary','概况'],['#summary/day','按日'],['#summary/store','按门店'],['#summary/activity','按活动']].map(([h,t])=>'<a href="'+h+'" class="'+(hash===h?'active':'')+'">'+txt(t)+'</a>').join('');root.prepend(tabs)}
  root.querySelectorAll('table').forEach(table=>{
   if(table.dataset.mobileCards||table.closest('.performance-cross,.member-composition-wrap'))return;
   const headers=[...table.querySelectorAll('thead th')];if(headers.length<5||!table.querySelector('tbody'))return;
   table.dataset.mobileCards='true';table.classList.add('mobile-card-table');
   [...table.querySelectorAll('tbody tr')].forEach(row=>[...row.cells].forEach((cell,i)=>cell.dataset.mobileLabel=headers[i]?.textContent.trim()||''));
  });
  root.querySelectorAll('table.activity-list-table.mobile-card-table tbody tr').forEach(row=>{
   if(row.dataset.compactCampaign)return;row.dataset.compactCampaign='true';row.classList.add('mobile-campaign-card');
   const cells=[...row.cells],more=[];
   for(const cell of cells){
    const label=cell.dataset.mobileLabel||'';
    if(/活动名称|活動名稱|^活动$|^活動$|Campaign name/.test(label)){cell.classList.add('mobile-campaign-name');continue}
    if(/档期|檔期/.test(label)){cell.classList.add('mobile-campaign-period');continue}
    if(/总营收|總營收|Total revenue/.test(label)){cell.classList.add('mobile-campaign-revenue');continue}
    if(/ROI/.test(label)){cell.classList.add('mobile-campaign-roi');continue}
    if(/操作|Actions/.test(label)){cell.classList.add('mobile-campaign-actions');continue}
    if(!cell.classList.contains('checkcell'))more.push(cell);
   }
   if(more.length){const td=document.createElement('td');td.className='mobile-campaign-extra';const details=document.createElement('details');details.innerHTML='<summary>'+txt('更多数据')+'</summary>';const grid=document.createElement('div');grid.className='mobile-campaign-extra-grid';for(const cell of more){const item=document.createElement('div');item.className='mobile-campaign-extra-item';item.dataset.mobileLabel=cell.dataset.mobileLabel;while(cell.firstChild)item.append(cell.firstChild);cell.remove();grid.append(item)}details.append(grid);td.append(details);row.append(td)}
  });
  root.querySelectorAll('.overview-pattern-grid').forEach(grid=>{if(grid.parentElement.classList.contains('mobile-secondary'))return;const fold=document.createElement('details');fold.className='mobile-secondary panel pad';fold.innerHTML='<summary>'+txt('更多经营表现')+'</summary>';grid.before(fold);fold.append(grid)});
  root.querySelectorAll('.work-fields').forEach(form=>{if(form.dataset.mobileSteps)return;form.dataset.mobileSteps='true';const heading=document.createElement('p');heading.className='mobile-step-label';heading.textContent=txt('选择活动与指标，再运行对比');form.prepend(heading)});
  if(hash==='#reports'&&!root.querySelector('.mobile-report-tools')){
   const tools=document.createElement('div');tools.className='mobile-report-tools no-print';tools.innerHTML='<button data-mobile-edit>'+txt('编辑文字')+'</button><a href="#reports/materials">'+txt('加入素材')+'</a><button data-mobile-ai>'+txt('AI报告助手')+'</button><button data-mobile-more>'+txt('更多')+'</button>';root.append(tools);
   root.querySelectorAll('[contenteditable]').forEach(n=>n.contentEditable='false');
   document.getElementById('scratch-drawer')?.setAttribute('hidden','');
  }
 }
 const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(enhance)};
 new MutationObserver(schedule).observe(root,{childList:true,subtree:true});window.addEventListener('hashchange',schedule);schedule();
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-mobile-logout]'))document.getElementById('logout')?.click();
  if(e.target.closest('[data-mobile-edit]')){document.body.classList.toggle('mobile-report-editing');const edit=document.body.classList.contains('mobile-report-editing');root.querySelectorAll('[contenteditable]').forEach(n=>n.contentEditable=String(edit));e.target.textContent=txt(edit?'完成编辑':'编辑文字');if(edit)root.querySelector('[contenteditable]')?.focus();else if(typeof saveRichReport==='function')saveRichReport()}
  if(e.target.closest('[data-mobile-ai]'))root.querySelector('[data-work="toggle-ai"]')?.click();
  if(e.target.closest('[data-mobile-more]'))document.body.classList.toggle('mobile-report-more');
 });
 document.addEventListener('pointerdown',e=>{if(e.target.closest('#report-body-editor')&&!document.body.classList.contains('mobile-report-editing'))e.stopImmediatePropagation()},true);
})();

// Phone charts use explicit selection, rather than transient desktop hover.
(()=>{
 let selected=null,start=null,dragging=false;
 const selector='[data-overview-point],[data-tip],[data-metric-help],[data-insight-extreme]';
 function clear(){
  selected=null;hideMetricHelp();document.querySelectorAll('.tooltip').forEach(n=>n.hidden=true);
  document.querySelectorAll('.channel-highlighted,.mobile-touch-selected').forEach(n=>n.classList.remove('channel-highlighted','mobile-touch-selected'));
  if(typeof pinnedOverviewPoint!=='undefined'){pinnedOverviewPoint=null;hideOverviewPoint();const status=document.querySelector('#trend-pin-status');if(status)status.textContent=''}
  if(typeof hideReportExtrema==='function')hideReportExtrema();
 }
 function show(target){
  selected=target;
  if(target.matches('[data-overview-point]'))showOverviewPoint(target);
  else if(target.matches('[data-tip]'))tip({target},false);
  else if(target.matches('[data-insight-extreme]'))void highlightReportExtremum(target);
  else showMetricHelp(target);
  if(target.matches('[data-channel-index]'))highlightChannel(target,true);
  if(target.matches('.goal-ring-segment'))target.classList.add('mobile-touch-selected');
 }
 document.addEventListener('click',event=>{
  const target=event.target.closest(selector);
  if(target){if(target===selected){clear();return}clear();show(target);return}
  if(!event.target.closest('#metric-help,.tooltip'))clear();
 });
 document.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse')return;
  const chart=event.target.closest('.chart,.overview-interactive-chart');
  if(chart)start={chart,x:event.clientX,y:event.clientY,id:event.pointerId};
 },{passive:true});
 document.addEventListener('pointermove',event=>{
  if(!start||start.id!==event.pointerId)return;
  const dx=event.clientX-start.x,dy=event.clientY-start.y;
  if(!dragging&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){start=null;clear();return}
  if(!dragging&&Math.abs(dx)<8)return;dragging=true;
  const points=[...start.chart.querySelectorAll('[data-tip],[data-overview-point]')];
  const nearest=points.reduce((best,n)=>{const r=n.getBoundingClientRect(),distance=Math.abs(r.left+r.width/2-event.clientX);return !best||distance<best.distance?{n,distance}:best},null);
  if(nearest)show(nearest.n);
 },{passive:true});
 const end=()=>{start=null;dragging=false};document.addEventListener('pointerup',end);document.addEventListener('pointercancel',()=>{end();clear()});
 window.addEventListener('hashchange',clear);window.addEventListener('scroll',()=>{if(!dragging)clear()},true);
 // Promote title-only explanations to tappable help, without swallowing button actions.
 const prepare=()=>document.querySelectorAll('main [title],.top [title]').forEach(node=>{
  if(node.dataset.mobileTitleReady||node.closest('[contenteditable]'))return;node.dataset.mobileTitleReady='true';
  if(!node.matches('button,a,input,select,textarea')&&!node.dataset.metricHelp){node.dataset.metricHelp=node.title;node.tabIndex=0}
  if(node.matches('button')&&!node.getAttribute('aria-label'))node.setAttribute('aria-label',node.title);
 });
 new MutationObserver(prepare).observe(document.querySelector('main'),{childList:true,subtree:true});prepare();
})();
