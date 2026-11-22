'use strict';

function decorateCurrency(root){
  if(root.nodeType===Node.TEXT_NODE){
    const parent=root.parentElement;
    if(!parent||parent.closest('script,style,textarea,option,select,input,svg,.currency-unit,.change-up,.change-down,[contenteditable],[data-language-original],#workspace-user'))return;
    // Units share the dashboard convention; descriptive parentheses stay intact.
    const original=root.nodeValue;
    const text=original.replace(/[（(]\s*(HKD(?:\s*\/\s*(?:order|person|store|day|member|1,?000 impressions))?|%|orders?|people|persons?|members?|days?|stores?|items?|messages?|impressions?|clicks?)\s*[）)]/gi,' $1').replace(/ {2,}/g,' ');
    if(text!==original)root.nodeValue=text;
    if(!/HKD|[（(](?:单|人|天|家|条|件|次|场)[）)]|↑|↓|高于基准|低于基准/.test(text))return;
    const fragment=document.createDocumentFragment();
    let start=0;
    for(const match of text.matchAll(/HKD|[（(](?:单|人|天|家|条|件|次|场)[）)]|高于基准|低于基准|↑|↓/g)){
      fragment.append(document.createTextNode(text.slice(start,match.index)));
      const token=document.createElement('span');
      token.className=/HKD|[（(]/.test(match[0])?'currency-unit':
        /高于|↑/.test(match[0])?'change-up':'change-down';
      token.textContent=match[0]==='高于基准'?'↑':match[0]==='低于基准'?'↓':match[0];
      fragment.append(token);
      start=match.index+match[0].length;
    }
    fragment.append(document.createTextNode(text.slice(start)));
    root.replaceWith(fragment);
    return;
  }
  if(root.nodeType!==Node.ELEMENT_NODE||root.matches('script,style,textarea,select,input,svg,.currency-unit,.change-up,.change-down'))return;
  for(const child of [...root.childNodes])decorateCurrency(child);
}
let currencyStylePending=false;
const currencyDirty=new Set();
new MutationObserver(records=>{
 for(const record of records){
  if(record.type==='characterData')currencyDirty.add(record.target);
  else for(const node of record.addedNodes)currencyDirty.add(node);
 }
 if(currencyStylePending)return;currencyStylePending=true;
 requestAnimationFrame(()=>{currencyStylePending=false;const nodes=[...currencyDirty];currencyDirty.clear();for(const node of nodes)if(node.isConnected)decorateCurrency(node)});
}).observe(document.body,{childList:true,subtree:true,characterData:true});
decorateCurrency(document.body);

// Fit long values without changing their precision or hiding any digits.
let numberFitFrame;
const numberFitObserved=new Set();
const numberFitSizes=new WeakMap();
function fitChartNumbers(){
 cancelAnimationFrame(numberFitFrame);
 numberFitFrame=requestAnimationFrame(()=>{
  for(const node of numberFitObserved)if(!node.isConnected){chartNumberResize.unobserve(node);numberFitObserved.delete(node)}
  document.querySelectorAll('.donut-center strong,.goal-ring strong,.metric .big,.goal-main-number,.incremental-result-stat strong').forEach(node=>{
   if(!node.clientWidth||!node.textContent.trim())return;
   const signature=node.textContent+'|'+node.parentElement.clientWidth+'|'+document.documentElement.lang;
   if(numberFitSizes.get(node)===signature)return;numberFitSizes.set(node,signature);
   if(!node.dataset.numberFitBase)node.dataset.numberFitBase=parseFloat(getComputedStyle(node).fontSize);
   const base=Number(node.dataset.numberFitBase);node.style.fontSize=base+'px';
   const width=node.clientWidth;
   if(node.scrollWidth>width)node.style.fontSize=Math.max(12,Math.floor(base*width/node.scrollWidth)-1)+'px';
   if(!numberFitObserved.has(node)){numberFitObserved.add(node);chartNumberResize.observe(node)}
  });
 });
}
const chartNumberResize=new ResizeObserver(fitChartNumbers);
new MutationObserver(fitChartNumbers).observe(document.body,{childList:true,subtree:true,characterData:true});
window.addEventListener('resize',fitChartNumbers);document.fonts?.ready.then(fitChartNumbers);fitChartNumbers();
