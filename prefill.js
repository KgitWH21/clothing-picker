/* Allowlisted deep links can preselect filters without replacing saved outfits. */
(function(root){
'use strict';
const allowed={occasion:['casual','work','formal','outdoor','active','sleep','fantasy'],presentation:['any','m','f','n']};
function apply(state,search=''){
 const params=new URLSearchParams(search),settings={...state.settings},applied=[];
 for(const [key,values]of Object.entries(allowed)){const value=params.get(key);if(values.includes(value)){settings[key]=value;applied.push(key);}}
 return {state:applied.length?{...state,settings}:state,applied};
}
const api={allowed,apply};root.PickerPrefill=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
