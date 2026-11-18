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

/* Embedded map on the Search Homes page.
   IDX Broker only serves the map widget to the one page address saved in the widget's settings
   ("Page the Map will be used on"), which must be on the account's own domain. Anywhere else the
   widget hangs on "Loading...", so the page shows a link tile unless the address matches. */
(function(){
  var idx=window.StimpsonIDX, box=document.getElementById('srMap');
  if(!idx||!box) return;
  var links=box.querySelectorAll('a'), mapLink=document.getElementById('srMapLink');
  for(var i=0;i<links.length;i++) links[i].href=idx.mapUrl();
  if(mapLink) mapLink.href=idx.mapUrl();
  var w=idx.mapWidget;
  if(!w||!w.page||(location.host+location.pathname)!==w.page||location.search) return;
  box.innerHTML='';
  var s=document.createElement('script');
  s.id='idxwidgetsrc-'+w.id; s.charset='UTF-8';
  s.src='https://'+idx.host+'/idx/mapwidgetjs.php?widgetid='+w.id;
  box.appendChild(s);
})();
