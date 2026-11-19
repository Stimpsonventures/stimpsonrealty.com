/* Homepage featured cards: fills the three cards in #featured with live listings.
   The data comes from an IDX Broker Showcase widget, loaded out of sight; its listings are copied
   into the site's own card design. If the widget is missing, slow or changes shape, the cards keep
   their default links to live searches. Requires assets/idx-config.js. */
(function(){
  var idx=window.StimpsonIDX, grid=document.querySelector('#featured .v6-listings');
  if(!grid) return;
  var cards=grid.querySelectorAll('a.v6-listing');
  // Default cards link to live searches.
  if(idx&&idx.live) for(var i=0;i<cards.length;i++){
    try{cards[i].href=idx.resultsUrl(JSON.parse(cards[i].getAttribute('data-idx-search')||'{}'));}catch(e){}
  }
  var w=idx&&idx.featuredWidget;
  if(!idx||!idx.live||!w||!w.id) return;

  var holder=document.createElement('div');
  holder.hidden=true; holder.setAttribute('aria-hidden','true');
  var s=document.createElement('script');
  s.id='idxwidgetsrc-'+w.id; s.charset='UTF-8'; s.async=true;
  s.src='https://'+idx.host+'/idx/customshowcasejs.php?widgetid='+w.id;
  holder.appendChild(s); document.body.appendChild(holder);

  function text(cell,sel){var e=cell.querySelector(sel);return e?e.textContent.replace(/\s+/g,' ').trim():'';}
  function largest(img){
    var best=img.getAttribute('src')||'', bw=0;
    (img.getAttribute('srcset')||'').split(',').forEach(function(part){
      var p=part.trim().split(/\s+/), n=parseInt(p[1],10)||0;
      if(p[0]&&n>bw){bw=n;best=p[0];}
    });
    return best;
  }
  function read(cell){
    var a=cell.querySelector('a.IDX-showcaseLink'), img=cell.querySelector('img.IDX-showcasePhoto');
    var o={url:a&&a.href, photo:img&&largest(img), address:text(cell,'.IDX-showcaseAddress'),
           city:text(cell,'.IDX-showcaseCity'), price:text(cell,'.IDX-showcasePrice'),
           beds:parseInt(text(cell,'.IDX-showcaseBeds'),10), baths:parseInt(text(cell,'.IDX-showcaseBaths'),10)};
    var ok=o.url&&/^https:\/\//.test(o.url)&&o.photo&&/^https:\/\//.test(o.photo)&&o.address&&/^\$[\d,]+$/.test(o.price);
    return ok?o:null;
  }
  function fill(card,o){
    var details=[idx.cityLabel(o.city)];
    if(o.beds>0) details.push(o.beds+' bd');
    if(o.baths>0) details.push(o.baths+' ba');
    card.href=o.url;
    card.style.setProperty('--listing-photo','url("'+o.photo.replace(/["\\)]/g,'')+'")');
    card.querySelector('.tag').textContent=o.price;
    card.querySelector('h3').textContent=o.address;
    card.querySelector('p').textContent=details.filter(Boolean).join(' \u00b7 ');
  }
  var tries=0, timer=setInterval(function(){
    var cells=holder.querySelectorAll('.IDX-showcaseCell');
    if(cells.length<cards.length){ if(++tries>40) clearInterval(timer); return; } // gives up after 10s
    clearInterval(timer);
    var data=[]; for(var i=0;i<cards.length;i++){var o=read(cells[i]); if(!o) return; data.push(o);}
    for(var j=0;j<cards.length;j++) fill(cards[j],data[j]);
    grid.setAttribute('data-live','true');
    var copy=document.querySelector('#featured .v6-copy');
    if(copy) copy.textContent='The newest homes on the market in Idaho Falls, Ammon, Rigby and Rexburg, straight from the Snake River MLS.';
  },250);
})();
