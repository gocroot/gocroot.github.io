// /*config in html login page*/
const id_user = 'user_name';
const id_pass = 'user_pass';
const id_form = 'loginform';
const id_button = 'login';
const using_click = true;
// /*end of config in html login page*/

/*whatsauth/svgqrjs */
!function(r,t){"use strict";for(var e="length",n=[null,[[10,7,17,13],[1,1,1,1],[]],[[16,10,28,22],[1,1,1,1],[4,16]],[[26,15,22,18],[1,1,2,2],[4,20]],[[18,20,16,26],[2,1,4,2],[4,24]],[[24,26,22,18],[2,1,4,4],[4,28]],[[16,18,28,24],[4,2,4,4],[4,32]],[[18,20,26,18],[4,2,5,6],[4,20,36]],[[22,24,26,22],[4,2,6,6],[4,22,40]],[[22,30,24,20],[5,2,8,8],[4,24,44]],[[26,18,28,24],[5,4,8,8],[4,26,48]],[[30,20,24,28],[5,4,11,8],[4,28,52]],[[22,24,28,26],[8,4,11,10],[4,30,56]],[[22,26,22,24],[9,4,16,12],[4,32,60]],[[24,30,24,20],[9,4,16,16],[4,24,44,64]],[[24,22,24,30],[10,6,18,12],[4,24,46,68]],[[28,24,30,24],[10,6,16,17],[4,24,48,72]],[[28,28,28,28],[11,6,19,16],[4,28,52,76]],[[26,30,28,28],[13,6,21,18],[4,28,54,80]],[[26,28,26,26],[14,7,25,21],[4,28,56,84]],[[26,28,28,30],[16,8,25,20],[4,32,60,88]],[[26,28,30,28],[17,8,25,23],[4,26,48,70,92]],[[28,28,24,30],[17,9,34,23],[4,24,48,72,96]],[[28,30,30,30],[18,9,30,25],[4,28,52,76,100]],[[28,30,30,30],[20,10,32,27],[4,26,52,78,104]],[[28,26,30,30],[21,12,35,29],[4,30,56,82,108]],[[28,28,30,28],[23,12,37,34],[4,28,56,84,112]],[[28,30,30,30],[25,12,40,34],[4,32,60,88,116]],[[28,30,30,30],[26,13,42,35],[4,24,48,72,96,120]],[[28,30,30,30],[28,14,45,38],[4,28,52,76,100,124]],[[28,30,30,30],[29,15,48,40],[4,24,50,76,102,128]],[[28,30,30,30],[31,16,51,43],[4,28,54,80,106,132]],[[28,30,30,30],[33,17,54,45],[4,32,58,84,110,136]],[[28,30,30,30],[35,18,57,48],[4,28,56,84,112,140]],[[28,30,30,30],[37,19,60,51],[4,32,60,88,116,144]],[[28,30,30,30],[38,19,63,53],[4,28,52,76,100,124,148]],[[28,30,30,30],[40,20,66,56],[4,22,48,74,100,126,152]],[[28,30,30,30],[43,21,70,59],[4,26,52,78,104,130,156]],[[28,30,30,30],[45,22,74,62],[4,30,56,82,108,134,160]],[[28,30,30,30],[47,24,77,65],[4,24,52,80,108,136,164]],[[28,30,30,30],[49,25,81,68],[4,28,56,84,112,140,168]]],a=/^\d*$/,o=/^[A-Za-z0-9 $%*+\-./:]*$/,u=/^[A-Z0-9 $%*+\-./:]*$/,i=[],f=[-1],l=0,s=1;l<255;++l)i.push(s),f[s]=l,s=2*s^(s>=128?285:0);for(var c=[[]],v=0;v<30;++v){for(var h=c[v],p=[],d=0;d<=v;++d){var g=d<v?i[h[d]]:0,m=i[(v+(h[d-1]||0))%255];p.push(f[g^m])}c.push(p)}for(var w={},b=0;b<45;++b)w["0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(b)]=b;var x=[function(r,t){return(r+t)%2==0},function(r){return r%2==0},function(r,t){return t%3==0},function(r,t){return(r+t)%3==0},function(r,t){return((r/2|0)+(t/3|0))%2==0},function(r,t){return r*t%2+r*t%3==0},function(r,t){return(r*t%2+r*t%3)%2==0},function(r,t){return((r+t)%2+r*t%3)%2==0}],F=function(r){return r>6},N=function(r,t){var a=-8&function(r){var t=n[r],a=16*r*r+128*r+64;return F(r)&&(a-=36),t[2][e]&&(a-=25*t[2][e]*t[2][e]-10*t[2][e]-55),a}(r),o=n[r];return a-=8*o[0][t]*o[1][t]},A=function(r,t){switch(t){case 1:return r<10?10:r<27?12:14;case 2:return r<10?9:r<27?11:13;case 4:return r<10?8:16;case 8:return r<10?8:r<27?10:12}},C=function(r,t,e){var n=N(r,e)-4-A(r,t);switch(t){case 1:return 3*(n/10|0)+(n%10<4?0:n%10<7?1:2);case 2:return 2*(n/11|0)+(n%11<6?0:1);case 4:return n/8|0;case 8:return n/13|0}},S=function(r,t){for(var n=r.slice(0),a=r[e],o=t[e],u=0;u<o;++u)n.push(0);for(var l=0;l<a;){var s=f[n[l++]];if(s>=0)for(var c=0;c<o;++c)n[l+c]^=i[(s+t[c])%255]}return n.slice(a)},y=function(r,t,e,n){for(var a=r<<n,o=t-1;o>=0;--o)a>>n+o&1&&(a^=e<<o);return r<<n|a},M=function(r,t,n){for(var a=x[n],o=r[e],u=0;u<o;++u)for(var i=0;i<o;++i)t[u][i]||(r[u][i]^=a(u,i));return r},k=function(r,t,n,a){for(var o=r[e],u=21522^y(n<<3|a,5,1335,10),i=0;i<15;++i){var f=[o-1,o-2,o-3,o-4,o-5,o-6,o-7,o-8,7,5,4,3,2,1,0][i];r[[0,1,2,3,4,5,7,8,o-7,o-6,o-5,o-4,o-3,o-2,o-1][i]][8]=r[8][f]=u>>i&1}return r},E=function(r){for(var t=function(r){for(var t=0,n=0;n<r[e];++n)r[n]>=5&&(t+=r[n]-5+3);for(var a=5;a<r[e];a+=2){var o=r[a];r[a-1]===o&&r[a-2]===3*o&&r[a-3]===o&&r[a-4]===o&&(r[a-5]>=4*o||r[a+1]>=4*o)&&(t+=40)}return t},n=r[e],a=0,o=0,u=0;u<n;++u){var i,f=r[u];i=[0];for(var l=0;l<n;){var s;for(s=0;l<n&&f[l];++s)++l;for(i.push(s),s=0;l<n&&!f[l];++s)++l;i.push(s)}a+=t(i),i=[0];for(var c=0;c<n;){var v;for(v=0;c<n&&r[c][u];++v)++c;for(i.push(v),v=0;c<n&&!r[c][u];++v)++c;i.push(v)}a+=t(i);var h=r[u+1]||[];o+=f[0];for(var p=1;p<n;++p){var d=f[p];o+=d,f[p-1]===d&&h[p]===d&&h[p-1]===d&&(a+=3)}}return a+=10*(Math.abs(o/n/n-.5)/.05|0)},L=function(r,t,a,o,u){var i=n[t],f=function(r,t,n,a){var o=[],u=0,i=8,f=n[e],l=function(r,t){if(t>=i){for(o.push(u|r>>(t-=i));t>=8;)o.push(r>>(t-=8)&255);u=0,i=8}t>0&&(u|=(r&(1<<t)-1)<<(i-=t))},s=A(r,t);switch(l(t,4),l(f,s),t){case 1:for(var c=2;c<f;c+=3)l(parseInt(n.substring(c-2,c+1),10),10);l(parseInt(n.substring(c-2),10),[0,4,7][f%3]);break;case 2:for(var v=1;v<f;v+=2)l(45*w[n.charAt(v-1)]+w[n.charAt(v)],11);f%2==1&&l(w[n.charAt(v-1)],6);break;case 4:for(var h=0;h<f;++h)l(n[h],8)}for(l(0,4),i<8&&o.push(u);o[e]+1<a;)o.push(236,17);return o[e]<a&&o.push(236),o}(t,a,r,N(t,o)>>3);f=function(r,t,n){for(var a=[],o=r[e]/t|0,u=0,i=t-r[e]%t,f=0;f<i;++f)a.push(u),u+=o;for(var l=i;l<t;++l)a.push(u),u+=o+1;a.push(u);for(var s=[],c=0;c<t;++c)s.push(S(r.slice(a[c],a[c+1]),n));for(var v=[],h=r[e]/t|0,p=0;p<h;++p)for(var d=0;d<t;++d)v.push(r[a[d]+p]);for(var g=i;g<t;++g)v.push(r[a[g+1]-1]);for(var m=0;m<n[e];++m)for(var w=0;w<t;++w)v.push(s[w][m]);return v}(f,i[1][o],c[i[0][o]]);var l=function(r){for(var t=n[r],a=function(r){return 4*r+17}(r),o=[],u=[],i=0;i<a;++i)o.push([]),u.push([]);var f=function(r,t,e,n,a){for(var i=0;i<e;++i)for(var f=0;f<n;++f)o[r+i][t+f]=a[i]>>f&1,u[r+i][t+f]=1};f(0,0,9,9,[127,65,93,93,93,65,383,0,64]),f(a-8,0,8,9,[256,127,65,93,93,93,65,127]),f(0,a-8,9,8,[254,130,186,186,186,130,254,0,0]);for(var l=9;l<a-8;++l)o[6][l]=o[l][6]=1&~l,u[6][l]=u[l][6]=1;for(var s=t[2],c=s[e],v=0;v<c;++v)for(var h=0===v?c-1:c,p=0===v||v===c-1?1:0;p<h;++p)f(s[v],s[p],5,5,[31,17,21,17,31]);if(F(r))for(var d=y(r,6,7973,12),g=0,m=0;m<6;++m)for(var w=0;w<3;++w)o[m][a-11+w]=o[a-11+w][m]=d>>g++&1,u[m][a-11+w]=u[a-11+w][m]=1;return{matrix:o,reserved:u}}(t),s=l.matrix,v=l.reserved;if(function(r,t,n){for(var a=r[e],o=0,u=-1,i=a-1;i>=0;i-=2){6===i&&--i;for(var f=u<0?a-1:0,l=0;l<a;++l){for(var s=i;s>i-2;--s)t[f][s]||(r[f][s]=n[o>>3]>>(7&~o)&1,++o);f+=u}u=-u}}(s,v,f),u<0){M(s,v,0),k(s,0,o,0);var h=0,p=E(s);for(M(s,v,0),u=1;u<8;++u){M(s,v,u),k(s,0,o,u);var d=E(s);p>d&&(p=d,h=u),M(s,v,u)}u=h}return M(s,v,u),k(s,0,o,u),s},R={generate:function(r,t){var n=t||{},i={numeric:1,alphanumeric:2,octet:4},f={L:1,M:0,Q:3,H:2},l=n.version||-1,s=f[(n.ecclevel||"L").toUpperCase()],c=n.mode?i[n.mode.toLowerCase()]:-1,v="mask"in n?n.mask:-1;if(c<0)c="string"==typeof r?r.match(a)?1:r.match(u)?2:4:4;else if(1!==c&&2!==c&&4!==c)throw"invalid or unsupported mode";if(r=function(r,t){switch(r){case 1:return t.match(a)?t:null;case 2:return t.match(o)?t.toUpperCase():null;case 4:if("string"==typeof t){for(var n=[],u=0;u<t[e];++u){var i=t.charCodeAt(u);i<128?n.push(i):i<2048?n.push(192|i>>6,128|63&i):i<65536?n.push(224|i>>12,128|i>>6&63,128|63&i):n.push(240|i>>18,128|i>>12&63,128|i>>6&63,128|63&i)}return n}return t}}(c,r),null===r)throw"invalid data format";if(s<0||s>3)throw"invalid ECC level";if(l<0){for(l=1;l<=40&&!(r[e]<=C(l,c,s));++l);if(l>40)throw"too large data"}else if(l<1||l>40)throw"invalid version";if(-1!==v&&(v<0||v>8))throw"invalid mask";return L(r,l,c,s,v)},generateHTML:function(r,n){for(var a=n||{},o=a.fillcolor?a.fillcolor:"#FFFFFF",u=a.textcolor?a.textcolor:"#000000",i=R.generate(r,a),f=Math.max(a.modulesize||5,.5),l=Math.max(null!==a.margin?a.margin:4,0),s=t.createElement("div"),c=i[e],v=['<table border="0" cellspacing="0" cellpadding="0" style="border:'+f*l+"px solid "+o+";background:"+o+'">'],h=0;h<c;++h){v.push("<tr>");for(var p=0;p<c;++p)v.push('<td style="width:'+f+"px;height:"+f+"px"+(i[h][p]?";background:"+u:"")+'"></td>');v.push("</tr>")}s.className="qrcode";var d=t.createRange();d.selectNodeContents(s);var g=d.createContextualFragment(v.join("")+"</table>");return s.appendChild(g),s},generateSVG:function(r,n){var a=n||{},o=a.fillcolor?a.fillcolor:"#FFFFFF",u=a.textcolor?a.textcolor:"#000000",i=R.generate(r,a),f=i[e],l=Math.max(a.modulesize||5,.5),s=Math.max(a.margin?a.margin:4,0),c=l*(f+2*s),v=t.createElementNS("http://www.w3.org/2000/svg","svg");v.setAttributeNS(null,"onclick","svgqrjsonclick()"),v.setAttributeNS(null,"viewBox","0 0 "+c+" "+c),v.setAttributeNS(null,"style","shape-rendering:crispEdges");var h="svgqrjson";v.setAttributeNS(null,"id",h);var p=t.createDocumentFragment(),d=t.createElementNS("http://www.w3.org/2000/svg","style");d.appendChild(t.createTextNode("#"+h+" .bg{fill:"+o+"}#"+h+" .fg{fill:"+u+"}")),p.appendChild(d);var g=function(r,e,n,a,o){var u=t.createElementNS("http://www.w3.org/2000/svg","rect")||"";return u.setAttributeNS(null,"class",r),u.setAttributeNS(null,"fill",e),u.setAttributeNS(null,"x",n),u.setAttributeNS(null,"y",a),u.setAttributeNS(null,"width",o),u.setAttributeNS(null,"height",o),u};p.appendChild(g("bg","none",0,0,c));for(var m=s*l,w=0;w<f;++w){for(var b=s*l,x=0;x<f;++x)i[w][x]&&p.appendChild(g("fg","none",b,m,l)),b+=l;m+=l}return v.appendChild(p),v},generatePNG:function(r,n){var a,o=n||{},u=o.fillcolor||"#FFFFFF",i=o.textcolor||"#000000",f=R.generate(r,o),l=Math.max(o.modulesize||5,.5),s=Math.max(null!==o.margin&&void 0!==o.margin?o.margin:4,0),c=f[e],v=l*(c+2*s),h=t.createElement("canvas");if(h.width=h.height=v,!(a=h.getContext("2d")))throw"canvas support is needed for PNG output";a.fillStyle=u,a.fillRect(0,0,v,v),a.fillStyle=i;for(var p=0;p<c;++p)for(var d=0;d<c;++d)f[p][d]&&a.fillRect(l*(s+d),l*(s+p),l,l);return h.toDataURL()}};r.QRCode=R}("undefined"!=typeof window?window:this,document);
/*img */
var refreshbutton=`
<svg onclick="location.reload()" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 496.166 496.166" xml:space="preserve" fill="#000000">
<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
<g id="SVGRepo_iconCarrier"> 
<path style="fill:#32BEA6;" d="M0.005,248.087C0.005,111.063,111.073,0,248.079,0c137.014,0,248.082,111.062,248.082,248.087 c0,137.002-111.068,248.079-248.082,248.079C111.073,496.166,0.005,385.089,0.005,248.087z"></path> 
<path style="fill:#F7F7F7;" d="M400.813,169.581c-2.502-4.865-14.695-16.012-35.262-5.891 c-20.564,10.122-10.625,32.351-10.625,32.351c7.666,15.722,11.98,33.371,11.98,52.046c0,65.622-53.201,118.824-118.828,118.824 c-65.619,0-118.82-53.202-118.82-118.824c0-61.422,46.6-111.946,106.357-118.173v30.793c0,0-0.084,1.836,1.828,2.999 c1.906,1.163,3.818,0,3.818,0l98.576-58.083c0,0,2.211-1.162,2.211-3.436c0-1.873-2.211-3.205-2.211-3.205l-98.248-57.754 c0,0-2.24-1.605-4.23-0.826c-1.988,0.773-1.744,3.481-1.744,3.481v32.993c-88.998,6.392-159.23,80.563-159.23,171.21 c0,94.824,76.873,171.696,171.693,171.696c94.828,0,171.707-76.872,171.707-171.696 C419.786,219.788,412.933,193.106,400.813,169.581z"></path>
</g></svg>
`;
const auth_ws = 'd3NzOi8vYXV0aC51bGJpLmFjLmlkL3dzL3doYXRzYXV0aC9xcg==';
const keyword = 'aHR0cHM6Ly93YS5tZS82Mjg3NzUyMDAwMzAwP3RleHQ9d2g0dDVhdXRoMA==';

const interval = 30;
const maxqrwait = 90;
const tokencookiename = "login";
const tokencookiehourslifetime = 2;
const id_qr = "whatsauthqr";
const id_counter = "whatsauthcounter";

const apphost = btoa(document.location.protocol + '//' +document.location.host+document.location.pathname);
let jsonres;
let rto =0;
let countdown=0;
let uuid;
let wsocket=0;
let mobile;
let waurl;

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    mobile = true;
  }else{
    mobile = false;
  }

const urlgetparams = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

function svgqrjsonclick(){
  if (mobile){
    window.open(waurl);
  }
}

function main() {
  deleteCookie(tokencookiename);
  qrController();
}


function connect(id) {
  return new Promise(function(resolve, reject) {
      let wsconn = new WebSocket(atob(auth_ws));
      wsconn.onopen = function() {
        wsconn.send(id);
        console.log("connected and set id");
        resolve(wsconn);
      };
      wsconn.onerror = function(err) {
        console.log("socket error rejected");
        reject(err);
      };
      wsconn.onclose = function (evt) {
        console.log("connection closed");
      };
      wsconn.onmessage = function (evt) {
        let messages = evt.data;
        console.log("incoming message");
        catcher(messages);
      };

  });
}

function openWebSocketSetId(id){
  if (window["WebSocket"]) { //check browser support
    connect(id).then(function(server) {
      wsocket=server;
    }).catch(function(err) {
      console.log("socket error");
    });
  } else {
      alert("Please Update Your browser to the latest version.");
  }
}

function closeWebSocket(){
  if (wsocket !== 0){
    wsocket.close();
  }
}

function sendMessagetoWebSocket(msg){
  if (wsocket.readyState === WebSocket.OPEN){
    wsocket.send(msg);
  }
}

function generatePassword() {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.";
  var passwordLength = 17;
  var password = "";
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber +1);
   }
  return password;
}

function generateUUID(){
  let wuid;
  if (urlgetparams.uuid == null){
    uuid=crypto.randomUUID()+"."+generatePassword()+"."+crypto.randomUUID()+"."+generatePassword()+"."+crypto.randomUUID()+"."+generatePassword()+"."+crypto.randomUUID()+"."+apphost;
    if (mobile){
      wuid = "m."+uuid;
    }else{
      wuid = "d."+uuid;
    }
  }else{
    if (mobile){
      wuid=urlgetparams.uuid;
    }
  }
  return wuid;
}

function qrController() {
  setCounterandQR();
  rto++;
  if (rto < maxqrwait){
    setTimeout('qrController()',1000);
  }else{
	  var svg = document.getElementById(id_qr);
	  svg.innerHTML=refreshbutton;
    document.getElementById(id_counter).innerHTML = "Refresh Your Browser to get QR";
  }
}

function setCounterandQR(){
  document.getElementById(id_counter).innerHTML = countdown;
  if (countdown === 0) {
    closeWebSocket();
    countdown=interval;
    uuid = generateUUID();
    waurl=atob(keyword)+uuid;
    showQR(waurl);
    openWebSocketSetId(uuid);
  }
  countdown--;
}

function makeQrCode(text){
  qr = QRCode.generateSVG(text, {
      ecclevel: "M",
      fillcolor: "#FFFFFF",
      textcolor: "#000000",
      margin: 4,
      modulesize: 8
  });
  var svg = document.getElementById(id_qr);
	svg.replaceChild(qr,svg.firstElementChild);
}

function showQR(text){
  if (typeof text === 'string' && text.length === 0) {
    document.getElementById('qrcode').style.display = 'none';
  } else {
    makeQrCode(text);
  }
}

function setCookieWithExpireDay(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setCookieWithExpireHour(cname, cvalue, exhour) {
  const d = new Date();
  d.setTime(d.getTime() + (exhour * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setCookieWithExpireSecond(cname, cvalue, exsecs) {
  const d = new Date();
  d.setTime(d.getTime() + (exsecs * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
  document.cookie = cname + "= ; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function fillformLogin(resjson){
  document.getElementById(id_user).value = resjson.user_name;
  document.getElementById(id_pass).value = resjson.user_pass;
}

function submitLogin(){
  document.getElementById(id_qr).innerHTML = "Success Login, Please Wait...";
  if (using_click) {
    document.getElementById(id_button).click();
  }else{
    document.getElementById(id_form).submit();
  }
}

function catcher(result){
  if (result.length > 2){
    jsonres = JSON.parse(result);
    console.log("catcher runner");
    console.log(jsonres);
    setCookieWithExpireHour(tokencookiename,jsonres.login,tokencookiehourslifetime);
    fillformLogin(jsonres);
    submitLogin();
  }
}


main();