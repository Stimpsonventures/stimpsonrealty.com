/* Search Homes form: sends visitors to the IDX Broker results page with their filters.
   Requires assets/idx-config.js. */
(function(){
  var idx=window.StimpsonIDX, form=document.getElementById('homeSearch');
  if(!idx||!form) return;
  var msg=document.getElementById('searchMessage');
  var cityInput=form.elements.city, list=document.getElementById('srCityList');
  if(list){Object.keys(idx.cities).forEach(function(k){var o=document.createElement('option');o.value=idx.cityLabel(k);list.appendChild(o);});}

  function filters(){
    return {city:cityInput.value.trim(),minPrice:form.elements.lp.value,maxPrice:form.elements.hp.value,beds:form.elements.bd.value,type:form.elements.pt.value};
  }
  function say(t){if(msg){msg.textContent=t;msg.scrollIntoView({block:'center',behavior:'smooth'});}}
  function go(f,replace){
    if(f.city&&!idx.cityId(f.city)){say('We couldn’t match “'+f.city+'”. Pick an area from the list, or leave it blank to search all of East Idaho.');cityInput.focus();return;}
    if(f.minPrice&&f.maxPrice&&+f.minPrice>+f.maxPrice){say('Minimum price is higher than maximum price.');return;}
    if(!idx.live){say('Live MLS search is being connected. Your search will open here as soon as it is.');return;}
    var url=idx.resultsUrl(f);
    if(replace) window.location.replace(url); else window.location.href=url;
  }
  form.addEventListener('submit',function(e){e.preventDefault();go(filters(),false);});

  // City tiles link here as homes.html?city=Rexburg
  var city=new URLSearchParams(window.location.search).get('city');
  if(city){cityInput.value=city; if(idx.live&&idx.cityId(city)) go(filters(),true);}
})();
