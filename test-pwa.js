const {readFileSync,existsSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

function installUI({agent='Android',secure=true,protocol='https:',standalone=false,failRegistration=false}={}) {
  const events={}, elements={};let registrations=0;
  const document={getElementById(id){return elements[id]||=(
    {hidden:true,attributes:{},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){this[k]=fn;},focus(){this.focused=true;}}
  );}};
  const navigator={userAgent:agent,serviceWorker:{register(path){registrations++;assert.equal(path,'./sw.js');return failRegistration?Promise.reject(Error('blocked')):Promise.resolve();}}};
  vm.runInNewContext(readFileSync('pwa.js','utf8'),{
    window:{isSecureContext:secure,matchMedia:()=>({matches:standalone}),addEventListener(k,fn){events[k]=fn;}},
    document,navigator,location:{protocol},console:{warn(){}}
  });
  return {events,elements,registrations};
}

(async()=>{
  const manifest=JSON.parse(readFileSync('manifest.webmanifest','utf8'));
  assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
  for(const icon of manifest.icons) {
    assert.ok(existsSync(icon.src));
    const png=readFileSync(icon.src), size=Number(icon.sizes.split('x')[0]);
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);
  }
  const ios=installUI({agent:'iPhone'});await ios.elements.installApp.click();
  assert.match(ios.elements.installInstructions.textContent,/Safari.*Share.*Add to Home Screen/);
  assert.equal(ios.elements.installApp.attributes['aria-expanded'],'true');
  ios.elements.closeInstallHelp.click();assert.equal(ios.elements.installHelp.hidden,true);
  assert.equal(installUI({standalone:true}).elements.installApp.hidden,true);
  const file=installUI({protocol:'file:'});assert.equal(file.registrations,0);
  await file.elements.installApp.click();assert.match(file.elements.installInstructions.textContent,/HTTPS/);
  assert.equal(installUI({secure:false}).registrations,0);
  installUI({failRegistration:true}); // A rejected registration must not break the app.
  const android=installUI();await android.elements.installApp.click();
  assert.match(android.elements.installInstructions.textContent,/Chrome/);
  let prompts=0,prevented=false;
  android.events.beforeinstallprompt({preventDefault(){prevented=true;},async prompt(){prompts++;},userChoice:Promise.resolve({outcome:'dismissed'})});
  await android.elements.installApp.click();assert.equal(prevented,true);assert.equal(prompts,1);
  assert.equal(android.elements.installApp.hidden,false);
  await android.elements.installApp.click();assert.equal(prompts,1); // Each browser prompt can only be used once.
  android.events.beforeinstallprompt({preventDefault(){},async prompt(){throw Error('unavailable');}});
  await android.elements.installApp.click();assert.equal(android.elements.installHelp.hidden,false);
  assert.equal(android.elements.installApp.disabled,false);
  android.events.beforeinstallprompt({preventDefault(){},async prompt(){},userChoice:Promise.resolve({outcome:'accepted'})});
  await android.elements.installApp.click();assert.equal(android.elements.installApp.hidden,true);
  console.log('PASS phone installation: manifest/icons, iPhone/Android instructions, prompts, dismissal, errors, standalone, insecure URLs.');

  const events={}, scope='https://example.com/wardrobe/', stored=new Map();
  const cache={async addAll(urls){for(const url of urls){assert.ok(existsSync(new URL(url).pathname.replace('/wardrobe/','')||'index.html'));stored.set(url,{url});}},async match(url){return stored.get(url);}};
  const old='wardrobe-picker:'+scope+':v0', unrelated='wardrobe-picker:https://example.com/other/:v1';
  let names=[old,unrelated], claimed=false;
  const caches={async open(name){if(!names.includes(name))names.push(name);return cache;},async keys(){return names;},async delete(name){names=names.filter(n=>n!==name);}};
  vm.runInNewContext(readFileSync('sw.js','utf8'),{
    self:{registration:{scope},clients:{async claim(){claimed=true;}},addEventListener(k,fn){events[k]=fn;}},
    caches,URL,fetch(){throw Error('offline');}
  });
  let pending;
  events.install({waitUntil(promise){pending=promise;}});await pending;
  events.activate({waitUntil(promise){pending=promise;}});await pending;
  assert.equal(claimed,true);assert.ok(!names.includes(old));assert.ok(names.includes(unrelated));
  function request(url,mode='cors',method='GET') {
    let response;
    events.fetch({request:{url,mode,method},respondWith(promise){response=promise;}});
    return response;
  }
  assert.equal((await request(scope+'?outfit=1','navigate')).url,scope+'index.html');
  assert.equal((await request(scope+'data.js')).url,scope+'data.js');
  assert.equal(request('https://example.com/other/app.js'),undefined);
  assert.equal(request(scope+'data.js','cors','POST'),undefined);
  assert.equal(request('https://external.example/data.js'),undefined);
  console.log('PASS offline cache: all assets exist, subdirectory navigation, cached catalog, scoped updates, unrelated requests excluded.');
})().catch(error=>{console.error(error);process.exitCode=1;});
