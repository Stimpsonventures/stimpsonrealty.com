const {verify}=require('./_guide-token');
const crypto=require('node:crypto');
const hmac=(key,msg)=>crypto.createHmac('sha256',key).update(msg).digest();
const hash=msg=>crypto.createHash('sha256').update(msg).digest('hex');
const encode=s=>encodeURIComponent(s).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
function signedUrl(){
  const account=process.env.R2_ACCOUNT_ID,bucket=process.env.R2_BUCKET,id=process.env.R2_ACCESS_KEY_ID,secret=process.env.R2_SECRET_ACCESS_KEY;
  const key=process.env.R2_OBJECT_KEY||'Stimpson_Realty_Buyer_Guide.pdf';
  if(!account||!bucket||!id||!secret)throw Error('Private guide storage not configured');
  const host=account+'.r2.cloudflarestorage.com',region='auto',service='s3';
  const now=new Date(),date=now.toISOString().replace(/[-:]|\.\d{3}/g,'').slice(0,15)+'Z',day=date.slice(0,8);
  const scope=day+'/'+region+'/'+service+'/aws4_request';
  const path='/'+[bucket,...key.split('/')].map(encode).join('/');
  const params=new URLSearchParams({'X-Amz-Algorithm':'AWS4-HMAC-SHA256','X-Amz-Credential':id+'/'+scope,'X-Amz-Date':date,'X-Amz-Expires':'600','X-Amz-SignedHeaders':'host'});
  const query=[...params.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>encode(k)+'='+encode(v)).join('&');
  const request=['GET',path,query,'host:'+host+'\n','host','UNSIGNED-PAYLOAD'].join('\n');
  const string=['AWS4-HMAC-SHA256',date,scope,hash(request)].join('\n');
  const keySig=hmac(hmac(hmac(hmac('AWS4'+secret,day),region),service),'aws4_request');
  return 'https://'+host+path+'?'+query+'&X-Amz-Signature='+crypto.createHmac('sha256',keySig).update(string).digest('hex');
}
exports.handler=async event=>{
 if(event.httpMethod!=='GET')return {statusCode:405,body:'Method not allowed'};
 if(!verify(event.queryStringParameters?.token))return {statusCode:403,headers:{'Cache-Control':'no-store','Content-Type':'text/plain'},body:'This guide link is invalid or expired. Please register again.'};
 try{return {statusCode:302,headers:{Location:signedUrl(),'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'},body:''}}catch(e){console.error('Guide storage not configured');return {statusCode:503,body:'Guide temporarily unavailable. Please contact Stimpson Realty.'}}
};
