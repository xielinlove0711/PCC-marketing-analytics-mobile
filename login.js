'use strict';

const loginPage=document.getElementById('login-page');
const loginForm=document.getElementById('login-form');
const loginName=document.getElementById('login-name');
const loginLanguage=document.getElementById('login-language');
const loginStatus=document.getElementById('login-status');
const workspaceUser=document.getElementById('workspace-user');
const logoutButton=document.getElementById('logout');
const sessionKey='pacific-workbench-demo-user';

function updateLoginView(name) {
  document.body.classList.toggle('signed-out',!name);
  loginPage.hidden=!!name;
  workspaceUser.textContent=name||'';
}

function updateLoginLanguage(value) {
  const previousDefault=loginName.defaultValue;
  setUiLanguage(value);
  const localizedDefault=localize('市场经理');
  const usedDefault=loginName.value===previousDefault;
  loginName.defaultValue=localizedDefault;
  if(usedDefault)loginName.value=localizedDefault;
}

loginLanguage.value=uiLanguage;
updateLoginLanguage(uiLanguage);
loginLanguage.addEventListener('change',()=>updateLoginLanguage(loginLanguage.value));

loginForm.addEventListener('submit',event=>{
  event.preventDefault();
  const name=loginName.value.trim();
  if(!name){
    loginStatus.textContent='请输入用户名称。';
    loginStatus.hidden=false;
    loginName.focus();
    return;
  }
  loginStatus.hidden=true;
  try{sessionStorage.setItem(sessionKey,name)}catch{}
  updateLoginView(name);
  // Explicitly initialize after revealing the page; do not rely on a hidden-page render.
  try{render()}catch(error){console.error('Mobile initial render failed',error);document.querySelector('main').innerHTML='<section class="panel pad"><h1>'+localize('页面暂时无法加载')+'</h1><p>'+localize('请刷新重试，或打开总览。')+'</p><a href="#summary">'+localize('数据总览')+'</a></section>'}
  window.scrollTo(0,0);
  applyPersonalSettings();
  updateScratchCount();
  logoutButton.focus();
});

logoutButton.addEventListener('click',()=>{
  try{sessionStorage.removeItem(sessionKey)}catch{}
  const openDialog=document.querySelector('dialog[open]');
  openDialog?.close();
  loginForm.reset();
  loginLanguage.value=uiLanguage;
  loginStatus.hidden=true;
  updateLoginView('');
  loginName.focus();
});

let restoredDemoName='';
try{restoredDemoName=sessionStorage.getItem(sessionKey)||''}catch{}
updateLoginView(restoredDemoName);
