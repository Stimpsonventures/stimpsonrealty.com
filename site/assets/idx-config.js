/* IDX Broker settings for Stimpson Realty. No secrets belong in this file.
   `live:false` makes the search form show a notice instead of leaving the site. */
(function(){
  var cfg={
    host:'search.stimpsonrealty.com', // IDX Broker custom domain (CNAME to subdomains.idxbroker.com)
    live:true,
    // Embedded map widget. `page` must equal the address saved in IDX Broker under Designs > Widgets >
    // Map Search > "Page the Map will be used on" (host + path, e.g. 'stimpsonrealty.com/homes.html').
    // IDX Broker matches it exactly (query string ignored); any other address shows a link tile instead.
    mapWidget:{id:'29558',page:'stimpsonrealty.com/homes.html'},
    idxID:'b370',                        // Snake River MLS
    // City name -> Snake River MLS cityID, ordered by active listing count (from the IDX Broker API).
    cities:{"IDAHO FALLS":"22399","RIGBY":"39387","REXBURG":"39097","ISLAND PARK":"22832","BLACKFOOT":"4286","AMMON":"1120","POCATELLO":"37157","SHELLEY":"42566","SALMON":"41128","ASHTON":"1827","ST ANTHONY":"40784","CHUBBUCK":"8732","IRWIN":"22796","ROBERTS":"39680","CHALLIS":"8124","SUGAR CITY":"45120","AMERICAN FALLS":"1069","ARCO":"1486","DRIGGS":"12778","MENAN":"29667","MACKAY":"27811","TETONIA":"46110","DOWNEY":"12688","RIRIE":"39490","VICTOR":"49037","LAVA HOT SPRINGS":"25751","SWAN VALLEY":"45504","FIRTH":"16012","IONA":"22679","LEADORE":"25874","MOORE":"31063","CARMEN":"7358","NORTH FORK":"33327","PINGREE":"36737","GRACE":"18573","INKOM":"22627","TERRETON":"46086","DUBOIS":"12855","MCCAMMON":"29269","CHESTER":"8483","SODA SPRINGS":"43401","ABERDEEN":"106","GIBBONSVILLE":"17827","MALAD":"28009","ARIMO":"1559","BLOOMINGTON":"4496","FELT":"15828","FISH HAVEN":"16020","MARYSVILLE":"28779","MONTPELIER":"30991","SHOUP":"42812","SWANLAKE":"45507","TENDOY":"46032","TWIN FALLS":"47240","UCON":"47331","BANCROFT":"2473","CLAYTON":"9043","FRANKLIN":"16876","HOLBROOK":"21492","MONTEVIEW":"30922","PALISADES":"35201","PRESTON":"37808","ROCKLAND":"39863","ATOMIC CITY":"1966","BASALT":"2747","CAREY":"7284","CLIFTON":"9220","GOODING":"18425","HAGERMAN":"19650","HOWE":"22001","JEROME":"23312","LEMHI":"26079","LEWISVILLE":"26300","MALTA":"28053","MAY":"28980","NEWDALE":"32813","PARIS":"35469","RUPERT":"40535","SPENCER":"44053","STANLEY":"44424","WARM RIVER":"49941","WEISER":"50482"},
    aliases:{'MALAD CITY':'MALAD','SAINT ANTHONY':'ST ANTHONY','ST. ANTHONY':'ST ANTHONY'},
    propertyTypes:{house:'1',land:'4',multi:'2',farm:'5'}
  };
  function norm(s){return String(s||'').toUpperCase().replace(/\./g,'').replace(/,\s*(ID|IDAHO)$/,'').replace(/\s+/g,' ').trim();}
  cfg.cityId=function(name){
    var n=norm(name); if(!n) return null;
    var a={}; Object.keys(cfg.aliases).forEach(function(k){a[norm(k)]=cfg.aliases[k];});
    if(a[n]) n=a[n];
    return cfg.cities[n]||null;
  };
  cfg.cityLabel=function(key){return key.toLowerCase().replace(/\b[a-z]/g,function(c){return c.toUpperCase();});};
  // filters: {city, minPrice, maxPrice, beds, type} - all optional.
  cfg.resultsUrl=function(f){
    f=f||{}; var q=['idxID='+cfg.idxID];
    var pt=cfg.propertyTypes[f.type]; if(pt) q.push('pt='+pt);
    if(f.minPrice) q.push('lp='+encodeURIComponent(f.minPrice));
    if(f.maxPrice) q.push('hp='+encodeURIComponent(f.maxPrice));
    if(f.beds) q.push('bd='+encodeURIComponent(f.beds));
    var id=cfg.cityId(f.city); if(id) q.push('ccz=city','city%5B%5D='+id);
    q.push('srt=newest'); // IDX Broker's default is price high-to-low, which leads with commercial listings
    return 'https://'+cfg.host+'/idx/results/listings?'+q.join('&');
  };
  cfg.mapUrl=function(){return 'https://'+cfg.host+'/idx/map/mapsearch';};
  window.StimpsonIDX=cfg;
})();
