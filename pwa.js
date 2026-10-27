(function() {
  const button=document.getElementById('installApp');
  const help=document.getElementById('installHelp');
  const instructions=document.getElementById('installInstructions');
  const standalone=window.matchMedia('(display-mode: standalone)');
  let prompt=null, installed=standalone.matches||navigator.standalone===true;

  function closeHelp() {
    help.hidden=true;
    button.setAttribute('aria-expanded','false');
  }
  function syncButton() {
    button.hidden=installed;
    if(installed) closeHelp();
  }
  function showHelp(message) {
    instructions.textContent=message;
    help.hidden=false;
    button.setAttribute('aria-expanded','true');
  }
  function manualInstructions() {
    if(!window.isSecureContext||location.protocol==='file:') return 'Open the app at its HTTPS website address on your phone to install it.';
    const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    if(ios) return 'In Safari, tap Share, then Add to Home Screen and Add. Leave Open as Web App on if shown.';
    if(/Android/.test(navigator.userAgent)) return 'In Chrome, open the menu (⋮), then Install app or Add to Home screen.';
    return 'Use your browser’s Install app option. On iPhone, open this address in Safari and choose Share → Add to Home Screen. On Android, use Chrome’s menu → Install app or Add to Home screen.';
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    prompt=event;
    syncButton();
  });
  window.addEventListener('appinstalled',()=>{installed=true;prompt=null;syncButton();});
  standalone.addEventListener?.('change',event=>{installed=event.matches||navigator.standalone===true;syncButton();});
  button.addEventListener('click',async()=>{
    if(!prompt) {showHelp(manualInstructions());return;}
    const pending=prompt;
    prompt=null;
    button.disabled=true;
    closeHelp();
    try {
      await pending.prompt();
      const choice=await pending.userChoice;
      if(choice.outcome==='accepted') {installed=true;syncButton();}
    } catch (_) {showHelp(manualInstructions());}
    finally {button.disabled=false;}
  });
  document.getElementById('closeInstallHelp').addEventListener('click',()=>{closeHelp();button.focus();});
  syncButton();

  if('serviceWorker' in navigator&&window.isSecureContext&&location.protocol!=='file:') {
    navigator.serviceWorker.register('./sw.js').catch(()=>{
      // Installation and normal use can continue if offline storage is blocked.
      console.warn('Offline setup failed. Reopen the app online to try again.');
    });
  }
})();
