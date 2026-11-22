/* Load before the application: compatibility for older Android WebViews. */
(function(){
 if(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{value:function(index){index=Math.trunc(Number(index)||0);return this[index<0?this.length+index:index]}});
 if(!String.prototype.replaceAll)Object.defineProperty(String.prototype,'replaceAll',{value:function(search,replacement){if(search instanceof RegExp)return this.replace(search,replacement);return this.split(String(search)).join(String(replacement))}});
 if(!window.queueMicrotask)window.queueMicrotask=function(fn){Promise.resolve().then(fn)};
 if(!window.structuredClone)window.structuredClone=function(value){return JSON.parse(JSON.stringify(value))};
 if(window.crypto&&!crypto.randomUUID)crypto.randomUUID=function(){var bytes=new Uint8Array(16);crypto.getRandomValues(bytes);bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;var hex=Array.from(bytes,function(x){return x.toString(16).padStart(2,'0')}).join('');return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20)};
 if(!window.ResizeObserver)window.ResizeObserver=function(callback){this.observe=function(){callback([])};this.unobserve=function(){};this.disconnect=function(){}};
 var media=window.matchMedia('(min-width:0)');if(!media.addEventListener&&window.MediaQueryList)MediaQueryList.prototype.addEventListener=function(type,fn){if(type==='change')this.addListener(fn)};
})();
