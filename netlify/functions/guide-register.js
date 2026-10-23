const {sign}=require('./_guide-token');
const clean=(x,max)=>typeof x==='string'?x.trim().slice(0,max):'';
const emailOk=s=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const json=(status,obj)=>({statusCode:status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(obj)});
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return json(405,{error:'Method not allowed'});
 if(!process.env.GUIDE_TOKEN_SECRET||process.env.GUIDE_TOKEN_SECRET.length<32)return json(503,{error:'Guide registration is not configured yet.'});
 let d;try{if((event.body||'').length>12000)throw Error();d=JSON.parse(event.body)}catch{return json(400,{error:'Invalid registration request.'})}
 if(clean(d['bot-field'],200))return json(200,{error:'Unable to process registration.'});
 const first=clean(d.first_name,80),last=clean(d.last_name,80),email=clean(d.email,254),phone=clean(d.phone,40),source=clean(d.source,100);
 if(!first||!last||!emailOk(email)||!phone)return json(400,{error:'Please complete all required fields.'});
 // Netlify Forms must be enabled/detected in the deployed site. Fail closed if the lead is not captured.
 const host=process.env.URL;
 if(!host)return json(503,{error:'Form service is not configured.'});
 const form=new URLSearchParams({'form-name':'buyer-guide-registration',first_name:first,last_name:last,email,phone,source});
 let saved=false;
 try{const r=await fetch(host+'/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form.toString()});saved=r.ok}catch{}
 if(!saved)return json(503,{error:'We could not save your registration. Please try again.'});
 const token=sign({scope:'buyer-guide',exp:Date.now()+7*86400000,emailHash:require('node:crypto').createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0,20)});
 const url=host.replace(/\/$/,'')+'/.netlify/functions/guide-download?token='+encodeURIComponent(token);
 let emailSent=false;
 if(process.env.RESEND_API_KEY&&process.env.GUIDE_FROM_EMAIL){
  const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.GUIDE_FROM_EMAIL,to:[email],subject:'Your Free Homebuyer’s Guide | Stimpson Realty',html:`<p>Hi ${escape(first)},</p><p>Thanks for requesting our free 32-page homebuyer's guide.</p><p><a href="${escape(url)}">Access your guide here</a>. Your private link is valid for seven days.</p><p>Whether you're planning to buy soon or just exploring, I'm happy to help with questions.</p><p>Zach Stimpson<br>Stimpson Realty | Silvercreek Realty Group<br>704-775-3208<br>stimpsonventures@gmail.com</p><p><em>Rooted in Relationships.</em></p>`})});emailSent=r.ok}catch{}
 }
 return json(200,{token,emailSent});
};