(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[`p1`,`p11g`,`p1m1`,`p11m`,`p2`,`p2mg`,`p2mm`],t={p1:`p1 — лише перенесення`,p11g:`p11g — ковзна симетрія`,p1m1:`p1m1 — вертикальні дзеркала`,p11m:`p11m — горизонтальне дзеркало`,p2:`p2 — поворот на 180°`,p2mg:`p2mg — вертикальні дзеркала + ковзна`,p2mm:`p2mm — обидва дзеркала`};function n(e){return{id:([e,t])=>[e,t],mirrorV:([e,t])=>[-e,t],mirrorH:([e,t])=>[e,-t],rot:([e,t])=>[-e,-t],glide:([t,n])=>[t+e/2,-n],translate:([t,n])=>[t+e,n]}}var r=(...e)=>t=>e.reduceRight((e,t)=>t(e),t);function i(e,t){let i=n(t);switch(e){case`p1`:return[i.id];case`p11g`:return[i.id,i.glide];case`p1m1`:return[i.id,i.mirrorV];case`p11m`:return[i.id,i.mirrorH];case`p2`:return[i.id,i.rot];case`p2mg`:return[i.id,i.mirrorV,i.glide,r(i.glide,i.mirrorV)];case`p2mm`:return[i.id,i.mirrorV,i.mirrorH,i.rot]}}var a=e=>e===`p11g`||e===`p2mg`,o=e=>e!==`p1`&&e!==`p1m1`,s=(e,t)=>(e%t+t)%t;function c(e,t,n){let r=null;for(let a of i(e,t)){let[e,i]=a(n),o=[s(e,t),i===0?0:i];(!r||o[0]<r[0]||o[0]===r[0]&&o[1]<r[1])&&(r=o)}return r}var l=(e,t)=>(e%t+t)%t,u=(e,t)=>[(e+t)/2,(e-t)/2],d=(e,t)=>[e+t,e-t];function f(e,t){return Number.isInteger(e)&&Number.isInteger(t)&&l(e+t,2)===0}function p(e,t,n){if(!f(e,t))return!1;let[r,i]=u(e,t);return l(r,n)===0||l(i,n)===0}var m=(e,t)=>`${e},${t}`;function h(e){let t=e.indexOf(`,`);return[Number(e.slice(0,t)),Number(e.slice(t+1))]}var g=e=>`${e.a},${e.b}`;function _(e,t){let n=e.a*t,r=n+t,i=e.b*t,a=i+t,o=(e,n,r,i)=>{let a=[];for(let o=0;o<=t;o++){let s=e+(r-e)/t*o,c=n+(i-n)/t*o;a.push(d(s,c))}return a};return[o(n,i,n,a),o(n,a,r,a),o(r,a,r,i),o(r,i,n,i)]}function v(e,t){let n=new Set,r=new Set;for(let i of e)for(let e of _(i,t))for(let t=0;t<e.length;t++){let i=m(e[t][0],e[t][1]);n.add(i),t>0&&r.add(ee(m(e[t-1][0],e[t-1][1]),i))}return{beads:n,threads:r}}var ee=(e,t)=>e<t?`${e}|${t}`:`${t}|${e}`,y=(e,t)=>Math.max(Math.abs(e),Math.abs(t)),b=(e,t,n)=>e%n===0&&t%n===0,x={contour:{id:`contour`,name:`Ромб-контур`,roles:1,symmetry:`D4`,filler:!0,fn:(e,t,n,r)=>y(e,t)===r?0:y(e,t)<r?-1:null},contourCross:{id:`contourCross`,name:`Ромб із хрестиком`,roles:2,symmetry:`D4`,filler:!1,fn:(e,t,n,r)=>{let i=y(e,t);return i>r?null:i===r?0:e===0||t===0?1:-1}},rings:{id:`rings`,name:`Концентричні кільця`,roles:3,symmetry:`D4`,filler:!1,fn:(e,t,n,r)=>{let i=y(e,t);return i>r?null:(r-i)%3}},nodeDots:{id:`nodeDots`,name:`Крапки у вузлах`,roles:1,symmetry:`D4`,filler:!0,fn:(e,t,n,r)=>y(e,t)>r?null:b(e,t,n)?0:-1},roof:{id:`roof`,name:`«Дах» із парочками`,roles:2,symmetry:`V`,filler:!1,fn:(e,t,n,r)=>{if(y(e,t)>r)return null;let i=e>=-r&&e<=-r+n&&t<=r,a=t>=r-n&&t<=r&&e>=-r;if(!i&&!a)return-1;if(e===-r||t===r||e===-r+n&&t<=r-n||t===r-n&&e>=-r+n)return 0;let o=e>-r&&e<-r+n&&t%n===0&&t>-r&&t<=r-n,s=t>r-n&&t<r&&e%n===0&&e<r&&e>=-r+n;return o||s?1:-1}},chevron:{id:`chevron`,name:`Шеврон`,roles:2,symmetry:`V`,filler:!1,fn:(e,t,n,r)=>y(e,t)>r?null:e===-r||t===r?0:e===0&&t===0||e===-r+n&&t<=r-n&&t>=0||t===r-n&&e>=-r+n&&e<=0?1:-1},squareCenter:{id:`squareCenter`,name:`Квадрат із серединкою`,roles:2,symmetry:`D4`,filler:!1,fn:(e,t,n,r)=>{let i=y(e,t);return i>r?null:i===r?0:i<=1?1:-1}},flower:{id:`flower`,name:`Квітка`,roles:2,symmetry:`D4`,filler:!1,fn:(e,t,n,r)=>{let i=y(e,t);return i>r?null:i===r?0:i===0?1:-1}},dot:{id:`dot`,name:`Крапка`,roles:1,symmetry:`D4`,filler:!0,fn:(e,t,n,r)=>{let i=y(e,t);return i>r?null:i===0?0:null}}},S=Object.keys(x);S.filter(e=>!x[e].filler||e===`contour`),S.filter(e=>x[e].filler);var C=1.24,w=2.3/Math.SQRT2;function te(e){let t=e.k+1,n=e.band,r=4*t,i=4*t;return{s:t,band:n,slots:e.rapports*n.perRapport+1,X0:r,Ymid:i+2*t*(n.rows-1),P:4*t*n.perRapport}}function T(e,t,n){let{s:r,band:i}=e,a=t/(2*r),o=(n+2*r*(i.rows-1))/(2*r),s=i.perRapport;return l(o,2)===0?{spec:i.main[o/2]?.[l(a/2,s)]??null,main:!0}:{spec:i.fillers[(o-1)/2]?.[l((a-1)/2,s)]??null,main:!1}}function E(e,t,n){let[r,i]=u(t,n),a=t=>{let n=t/(2*e),r=Math.floor(n),i=new Set;for(let n of[r,r+1])Math.abs(t-2*e*n)<=e&&i.add(n);return[...i]},o=[];for(let t of a(r))for(let n of a(i))o.push([2*e*(t+n),2*e*(t-n)]);return o}function ne(e,t,n,r=!0){let{s:a,band:o,P:s}=e,c=2*o.rows-2,l=E(a,t,n).filter(([t,n])=>{let i=(n+2*a*(o.rows-1))/(2*a);if(i<0||i>c)return!1;if(!r)return!0;let s=t/(2*a);return s>=0&&s<=2*(e.slots-1)});if(l.length===0)return 0;let d=o.group,f=null,p=[];for(let e of i(d,s)){let[r,i]=e([t,n]),a=s*Math.floor(r/s),o=[r-a,i];!f||o[0]<f[0]||o[0]===f[0]&&o[1]<f[1]?(f=o,p=[{g:e,shift:a}]):o[0]===f[0]&&o[1]===f[1]&&p.push({g:e,shift:a})}let m=f,h=null,g=null;for(let[t,n]of l)for(let{g:r,shift:i}of p){let[o,s]=r([t,n]),c=o-i,{spec:l,main:d}=T(e,c,s);if(!l)continue;let[f,p]=u(m[0]-c,m[1]-s),_=x[l.motif].fn(f,p,a,a);if(_===null)continue;let v=_===-1?0:l.colors[_]??0;d?h=h===null?v:Math.max(h,v):g=g===null?v:Math.max(g,v)}return h??g??0}function D(e){let t=te(e),n=new Map,r=2*e.band.rows-1;for(let i=0;i<r;i++)for(let r=i%2;r<=2*(t.slots-1);r+=2){let a=2*t.s*r,o=2*t.s*i-2*t.s*(e.band.rows-1),[s,l]=c(e.band.group,t.P,[a,o]),{spec:u}=T(t,s,l);u&&n.set(JSON.stringify(u),u)}return[...n.values()]}function O(e,t,n,r,i,a,o){let s=[];for(let c=r;c<i;c+=n)for(let r=a;r<o;r+=n)s.push({a:(e+c)/n,b:(t+r)/n});return s}function k(e,t,n,r,i){let a=t*n;if(r<0||r>a||i>0||i<-a)return null;if(r===0||r===a||i===0||i===-a)return e.rhombContour;if(t%2!=0&&a%2!=0)return 0;let o=r-a/2,s=i+a/2,c=Math.max(Math.abs(o),Math.abs(s));switch(e.inner){case`cross`:return o===0||s===0?e.innerColor:0;case`rings`:return c%n===0?e.innerColor:0;case`dots`:return o%n===0&&s%n===0?e.innerColor:0;default:return 0}}function re(e,t,n,r){if(e.shape===`roof`){let i=e.size,a=i-1;return{cells:[...O(n,r,t,-t,0,0,t),...O(n,r,t,-t,0,-i*t,0),...O(n,r,t,0,i*t,0,t),...a>0?O(n,r,t,0,a*t,-a*t,0):[]],color:(n,r)=>{let o=n>=-t&&n<=0&&r>=-i*t&&r<=t,s=r>=0&&r<=t&&n>=-t&&n<=i*t;return o||s?n%t===0&&r%t===0||(n===-t||n===0)&&r>=-i*t&&r<=0||(r===0||r===t)&&n>=0&&n<=i*t?e.railColor:o&&n>-t&&n<0&&r%t===0?r>-i*t?e.pairColor:e.railColor:s&&r>0&&r<t&&n%t===0?n<i*t?e.pairColor:e.railColor:0:a>0?k(e,a,t,n,r):null},picots:[[0,-i*t],[i*t,0]],tip:a>0?[a*t,-a*t]:[0,0],halfWidth:(i+1)*t}}if(e.shape===`rhomb`){let i=e.size;return{cells:O(n,r,t,0,i*t,-i*t,0),color:(n,r)=>k(e,i,t,n,r),picots:[[i*t,0],[0,-i*t]],tip:[i*t,-i*t],halfWidth:i*t}}let i=e.size,a=(i+1)*t/2,o=n+r,s=n-r,c=[];for(let e=0;e<i;e++)for(let n=0;n<i-e;n++){let r=o+t*(2*n-(i-1-e)),a=s+t+e*t;c.push({a:(r/t-1+a/t)/2,b:(r/t-1-a/t)/2})}return{cells:c,color:(n,r)=>{if(r<-a||n>a||n-r<0)return null;if(r===-a||n===a)return e.railColor;let i=(a-n)/t,o=(r+a)/t;return Number.isInteger(i)&&i%2==1||Number.isInteger(o)&&o%2==1?e.pairColor:0},picots:[[-a+t,-a],[a,a-t]],tip:[a,-a],halfWidth:i*t}}function ie(e){let t=e.k+1,n=te(e),r=2*n.slots+1,i=2*e.band.rows,a=2*t,o=2*t+4*t*e.band.rows,s=e.ladder,c=e.bottom.rows,d=s?[1+i,Math.max(1,c)]:[1+i+c],f=[],p=new Map,_=new Set,y=e=>{let t=p.get(e.id);return t===void 0?(p.set(e.id,f.length),f.push(e),f.length-1):t},b=(e,t)=>{_.add(ee(e,t))},x=(e,t,n)=>`${e}:${m(t,n)}`,S=[],w=0,T=d.length-1,E=d.map(e=>{let n=[];for(let i=0;i<e;i++)for(let e=0;e<r;e++){let r=(2*e+2)*t,a=(2*i+1)*t;n.push({a:(r/t-1+a/t)/2,b:(r/t-1-a/t)/2})}return n}),D=[],O=[],k=2*t*d[T],ie=(2*r+1)*t;if(e.pendants&&d[T]>0){let r=e.pendants,i=n.X0+2*t*(n.slots-1),a=4*t*r.every,o=[];if(r.centerOnly)o.push(i);else{let e=re(r,t,0,0).halfWidth;for(let n=-200;n<=200;n++){let r=i+n*a;r-e>=0&&r+e<=ie+t&&o.push(r)}}let s=new Set;for(let e of o){let[n,i]=u(e,k),a=re(r,t,n,i);if(a.cells.some(e=>s.has(g(e))))continue;a.cells.forEach(e=>s.add(g(e))),E[T].push(...a.cells);let o={x:e,shape:r.shape,anchors:[],ids:[]};D.push(o),O.push({geom:a,X:e,info:o})}}for(let e=0;e<d.length;e++){S.push(w);let n=v(E[e],t),i=v(E[e].slice(0,d[e]*r),t).beads;for(let t of[...n.beads].sort(oe)){let[n,r]=h(t),s=i.has(t),c=`bottom`;s?e===0&&r<a?c=`neck`:e===0&&r<=o&&(c=`band`):c=`pendant`,y({id:x(e,n,r),kind:`mesh`,layer:c,piece:e,x:n,y:r,px:n,py:r+w,color:0,size:C})}for(let t of n.threads){let[n,r]=t.split(`|`);b(`${e}:${n}`,`${e}:${r}`)}let c=2*t*d[e];e===0&&s&&(w+=c+(s.length+1)*Math.SQRT2)}for(let e of f)e.piece!==0||e.y<a||e.y>o||(e.color=ne(n,e.x-n.X0,e.y-n.Ymid));if(s){let e=2*t*d[0];for(let n=0;n<r;n++){let r=(2*n+2)*t,i=x(0,r,e);for(let t=1;t<=s.length;t++){let n=`L:${r}:${t}`;y({id:n,kind:`ladder`,layer:`ladder`,piece:-1,x:NaN,y:NaN,px:r,py:e+t*Math.SQRT2,color:s.accentIndex===t?s.accentColor:s.color,size:C}),b(i,n),i=n}b(i,x(1,r,0))}}let se=e.bottom.betweenColor;if(se!==null&&O.length>1){let e=O.map(e=>e.X).sort((e,t)=>e-t);for(let n=0;n+1<e.length;n++){let r=(e[n]+e[n+1])/2;if(l(r,2*t)!==0)continue;let i=k-t,a=[];for(let e of f){if(e.piece!==T)continue;let[n,o]=u(e.x-r,e.y-i);Math.max(Math.abs(n),Math.abs(o))*2===t&&(e.color=se,a.push(e.id))}D.push({x:r,shape:`between`,anchors:[],ids:a})}}if(e.pendants){let n=e.pendants,i=v(E[T].slice(0,d[T]*r),t).beads;for(let{geom:e,X:r,info:a}of O){let o=v(e.cells,t).beads;for(let t of o){let[n,o]=h(t),s=x(T,n,o);a.ids.push(s),i.has(t)&&a.anchors.push(s);let[c,l]=u(n-r,o-k),d=e.color(c,l);d!==null&&(f[p.get(s)].color=d)}let s=([e,t])=>f[p.get(x(T,r+e+t,k+e-t))];if(n.picot)for(let t of e.picots){let e=s(t);if(!e)continue;let r=n.picot.beads,i=Math.SQRT2/(2*Math.sin(Math.PI/(r+1))),o=e.id;for(let t=0;t<r;t++){let s=2*Math.PI*(t+1)/(r+1),c=`K:${e.id}:${t}`;y({id:c,kind:`picot`,layer:`picot`,piece:-1,x:NaN,y:NaN,px:e.px+i*Math.sin(s),py:e.py+i-i*Math.cos(s),color:n.picot.color,size:C}),b(o,c),o=c,a.ids.push(c)}b(o,e.id)}if(n.tip&&e.tip){let t=s(e.tip);if(t){let e=`T:${t.id}`;y({id:e,kind:`tip`,layer:`tip`,piece:-1,x:NaN,y:NaN,px:t.px,py:t.py+Math.SQRT2,color:n.tip.beadColor,size:C});let r=n.tip.sizeMm/2.3*Math.SQRT2,i=`D:${t.id}`;y({id:i,kind:n.tip.kind,layer:`tip`,piece:-1,x:NaN,y:NaN,px:t.px,py:t.py+Math.SQRT2+C/2+r*.55,color:n.tip.color,size:r}),b(t.id,e),b(e,i),a.ids.push(e,i)}}}}let A=[];for(let e of _){let[t,n]=ae(e),r=p.get(t),i=p.get(n);r!==void 0&&i!==void 0&&A.push([r,i])}let j=1/0,M=-1/0,N=-1/0;for(let e of f)j=Math.min(j,e.px-e.size/2),M=Math.max(M,e.px+e.size/2),N=Math.max(N,e.py+e.size/2);return{spec:e,beads:f,threads:A,index:p,pendants:D,layout:{s:t,slots:n.slots,P:n.P,X0:n.X0,Y0:4*t,cols:r,rows:d,pieceOffset:S,bandTop:a,bandBottom:o,width:M-Math.min(0,j),height:N}}}function ae(e){let t=e.indexOf(`|`);return[e.slice(0,t),e.slice(t+1)]}function oe(e,t){let[n,r]=h(e),[i,a]=h(t);return r-a||n-i}var se=`00050|r|B7AEA3||crystal
01111|s|B7733E|SG|brown 2 dyed crystal
01112|s|C36B46|SG|brown 2 dyed crystal
01113|s|925E5C|SG|brown 2 dyed crystal
01121|s|6A6374|SG|violet 2 dyed crystal
01122|s|5C486D|SG|violet 2 dyed crystal
01123|s|7B37A5|SG|violet 2 dyed crystal
01125|s|714A9B|SG|violet 2 dyed crystal
01127|s|A3A4C3|SG|violet 2 dyed crystal
01131|s|515FB6|SG|blue 2 dyed crystal
01132|s|3A6B98|SG|blue 2 dyed crystal
01133|s|29667C|SG|blue-green 2 dyed crystal
01134|s|37A8DC|SG|blue-green 2 dyed crystal
01141|s|5B534D|SG|grey 2 dyed crystal
01151|s|A7962A|SG|green 2 dyed crystal
01152|s|98903E|SG|green 2 dyed crystal
01153|s|9AA628|SG|green 2 dyed crystal
01154|s|699732|SG|green 2 dyed crystal
01161|s|53AA5D|SG|green 2 dyed crystal
01162|s|6EAC80|SG|green 2 dyed crystal
01163|s|4A684A|SG|green 2 dyed crystal
01164|s|3C8D77|SG|green 2 dyed crystal
01165|s|30AAAA|SG|green 2 dyed crystal
01181|s|EBBC3A|SG|yellow 2 dyed crystal
01182|s|DE8534|SG|yellow 2 dyed crystal
01183|s|EC7C26|SG|orange 2 dyed crystal
01184|s|F87840|SG|orange 2 dyed crystal
01185|s|CF5C33|SG|orange 2 dyed crystal
01191|s|FE625A|SG|red 2 dyed crystal
01192|s|E562C3|SG|pink 2 dyed crystal
01193|s|B04054|SG|red 2 dyed crystal
01194|s|763B36|SG|pink 2 dyed crystal
01195|s|804762|SG|violet 2 dyed crystal
01211|s|E39771|SG|brown 1 dyed crystal
01212|s|D1896C|SG|brown 1 dyed crystal
01213|s|D1969A|SG|brown 1 dyed crystal
01221|s|9E94C2|SG|violet 1 dyed crystal
01222|s|A180AE|SG|violet 1 dyed crystal
01223|s|B58CED|SG|violet 1 dyed crystal
01231|s|7D9DFA|SG|blue 1 dyed crystal
01232|s|67AAE4|SG|blue 1 dyed crystal
01233|s|55AFCF|SG|blue-green 1 dyed crystal
01234|s|3DCBFB|SG|blue-green 1 dyed crystal
01241|s|A49A96|SG|grey 1 dyed crystal
01251|s|D8BA56|SG|green 1 dyed crystal
01252|s|BFB673|SG|green 1 dyed crystal
01253|s|CDC951|SG|green 1 dyed crystal
01254|s|A8CC76|SG|green 1 dyed crystal
01261|s|84C88D|SG|green 1 dyed crystal
01262|s|8FB9A0|SG|green 1 dyed crystal
01263|s|8AA990|SG|green 1 dyed crystal
01264|s|5ECAC4|SG|green 1 dyed crystal
01265|s|51CDE0|SG|green 1 dyed crystal
01281|s|EDC93B|SG|yellow 1 dyed crystal
01282|s|F1B96C|SG|yellow 1 dyed crystal
01283|s|F8AC53|SG|orange 1 dyed crystal
01284|s|FB9C57|SG|orange 1 dyed crystal
01285|s|F88E5F|SG|orange 1 dyed crystal
01291|s|FB7969|SG|red 1 dyed crystal
01292|s|F383CB|SG|pink 1 dyed crystal
01293|s|EC7C84|SG|red 1 dyed crystal
01294|s|CD9792|SG|pink 1 dyed crystal
01295|s|CD8EB1|SG|violet 1 dyed crystal
01610|s|6F6653|Me|soft bronze multi
01611|s|9B5724|SG|brown 3 dyed crystal
01612|s|703822|SG|brown 3 dyed crystal
01613|s|865144|SG|brown 3 dyed crystal
01620|s|675546|Me|soft bronze multi
01621|s|343345|SG|violet 3 dyed crystal
01622|s|46384A|SG|violet 3 dyed crystal
01623|s|622482|SG|violet 3 dyed crystal
01631|s|373698|SG|blue 3 dyed crystal
01632|s|0D73B4|SG|blue 3 dyed crystal
01633|s|397E8F|SG|blue 3 dyed crystal
01634|s|0C91C9|SG|blue 3 dyed crystal
01640|s|634D41|Me|soft bronze multi
01641|s|322C28|SG|grey 3 dyed crystal
01651|s|937413|SG|green 3 dyed crystal
01652|s|6C6D1A|SG|green 3 dyed crystal
01653|s|848A0F|SG|green 3 dyed crystal
01654|s|4E8410|SG|green 3 dyed crystal
01661|s|27903C|SG|green 3 dyed crystal
01662|s|3A7550|SG|green 3 dyed crystal
01663|s|365E43|SG|green 3 dyed crystal
01664|s|0D7A64|SG|green 3 dyed crystal
01665|s|0D8C88|SG|green 3 dyed crystal
01670|s|4C4A48|Me|soft bronze multi
01681|s|D79B28|SG|yellow 3 dyed crystal
01682|s|CA6625|SG|yellow 3 dyed crystal
01683|s|EE742A|SG|orange 3 dyed crystal
01684|s|F25E24|SG|orange 3 dyed crystal
01685|s|AF4622|SG|orange 3 dyed crystal
01691|s|F3412C|SG|pink 3 dyed crystal
01692|s|AC2176|SG|pink 3 dyed crystal
01693|s|8B323A|SG|pink 3 dyed crystal
01694|s|6D3839|SG|pink 3 dyed crystal
01695|s|6E3C49|SG|violet 3 dyed crystal
01700|s|92908E|Me|soft silver
01710|s|A07651|Me|soft gold
01720|s|78663B|Me|soft bronze
01740|s|5E412B|Me|soft bronze
01750|s|773D34|Me|soft dk.copper
01760|s|936963|Me|soft copper
01770|s|7A4B3C|Me|soft copper
01780|s|76494A|Me|soft copper
01790|s|49313D|Me|soft red
01913|s|2A8997||teal dyed chalkwhite
01914|s|125A6B||teal dyed chalkwhite
02052|s|C5AD5E|SG|green dyed crystal
02090|r|B5ADA2||alabaster white
02111|s|B0826B|SG|brown 2 dyed alabaster
02112|s|B57B67|SG|brown 2 dyed alabaster
02113|s|846263|SG|brown 2 dyed alabaster
02121|s|7E707C|SG|violet 2 dyed alabaster
02122|s|70556A|SG|violet 2 dyed alabaster
02123|s|825099|SG|violet 2 dyed alabaster
02131|s|6067A0|SG|blue 2 dyed alabaster
02132|s|5D7AB4|SG|blue 2 dyed alabaster
02133|s|4C797E|SG|blue-green 2 dyed alabaster
02134|s|4797BF|SG|blue-green 2 dyed alabaster
02141|s|5D5956|SG|grey 2 dyed alabaster
02151|s|CCBF6E|SG|green 2 dyed alabaster
02152|s|978F46|SG|green 2 dyed alabaster
02153|s|A9B359|SG|green 2 dyed alabaster
02154|s|909E44|SG|green 2 dyed alabaster
02161|s|64915D|SG|green 2 dyed alabaster
02162|s|87B593|SG|green 2 dyed alabaster
02163|s|809378|SG|green 2 dyed alabaster
02164|s|609E87|SG|green 2 dyed alabaster
02165|s|51AED5|SG|green 2 dyed alabaster
02181|s|F4D169|SG|yellow 2 dyed alabaster
02182|s|D7A05B|SG|yellow 2 dyed alabaster
02183|s|F79656|SG|orange 2 dyed alabaster
02184|s|E48C4F|SG|orange 2 dyed alabaster
02185|s|F68E77|SG|orange 2 dyed alabaster
02191|s|EF7278|SG|red 2 dyed alabaster
02192|s|B6649F|SG|pink 2 dyed alabaster
02193|s|A7515F|SG|red 2 dyed alabaster
02194|s|89596B|SG|pink 2 dyed alabaster
02195|s|8F5A79|SG|violet 2 dyed alabaster
02211|s|EABA9B|SG|brown 1 dyed alabaster
02212|s|C2917F|SG|brown 1 dyed alabaster
02213|s|E0BBC1|SG|brown 1 dyed alabaster
02221|s|CAC6DF|SG|violet 1 dyed alabaster
02222|s|D5C3E0|SG|violet 1 dyed alabaster
02223|s|C49ACB|SG|violet 1 dyed alabaster
02231|s|7A87D4|SG|blue 1 dyed alabaster
02232|s|93C4F1|SG|blue 1 dyed alabaster
02233|s|8CCFEC|SG|blue-green 1 dyed alabaster
02234|s|85D4E2|SG|blue-green 1 dyed alabaster
02241|s|A9A39D|SG|grey 1 dyed alabaster
02251|s|E2C989|SG|green 1 dyed alabaster
02252|s|C5BF93|SG|green 1 dyed alabaster
02253|s|D7D68C|SG|green 1 dyed alabaster
02254|s|BDDA9E|SG|green 1 dyed alabaster
02261|s|A8DDB5|SG|green 1 dyed alabaster
02262|s|9DC1AC|SG|green 1 dyed alabaster
02263|s|91AF9D|SG|green 1 dyed alabaster
02264|s|7ED7CE|SG|green 1 dyed alabaster
02265|s|7ADEF0|SG|green 1 dyed alabaster
02281|s|E5D184|SG|yellow 1 dyed alabaster
02282|s|F9C184|SG|yellow 1 dyed alabaster
02283|s|FBBD8F|SG|orange 1 dyed alabaster
02284|s|F9A488|SG|orange 1 dyed alabaster
02285|s|FBAC91|SG|orange 1 dyed alabaster
02291|s|F6908A|SG|red 1 dyed alabaster
02292|s|FBAFE1|SG|pink 1 dyed alabaster
02293|s|FAA0AA|SG|red 1 dyed alabaster
02294|s|CC9B7E|SG|pink 1 dyed alabaster
02295|s|DEA8C4|SG|violet 1 dyed alabaster
02611|s|9A6148|SG|brown 3 dyed alabaster
02612|s|8D543D|SG|brown 3 dyed alabaster
02613|s|865B51|SG|brown 3 dyed alabaster
02621|s|7A6A75|SG|violet 3 dyed alabaster
02622|s|76616C|SG|violet 3 dyed alabaster
02623|s|855D99|SG|violet 3 dyed alabaster
02631|s|5E66AC|SG|blue 3 dyed alabaster
02632|s|5881A8|SG|blue 3 dyed alabaster
02633|s|588991|SG|blue 3 dyed alabaster
02634|s|7EC1E5|SG|blue 3 dyed alabaster
02641|s|625E5B|SG|grey 3 dyed alabaster
02651|s|B28E40|SG|green 3 dyed alabaster
02652|s|8A7941|SG|green 3 dyed alabaster
02653|s|A69B39|SG|green 3 dyed alabaster
02654|s|839340|SG|green 3 dyed alabaster
02661|s|5A8741|SG|green 3 dyed alabaster
02662|s|668258|SG|green 3 dyed alabaster
02663|s|60724E|SG|green 3 dyed alabaster
02664|s|65A78B|SG|green 3 dyed alabaster
02665|s|4FB0B0|SG|green 3 dyed alabaster
02681|s|F4BE47|SG|yellow 3 dyed alabaster
02682|s|F59654|SG|yellow 3 dyed alabaster
02683|s|F38B4F|SG|orange 3 dyed alabaster
02684|s|EE7E4F|SG|orange 3 dyed alabaster
02685|s|CE6C49|SG|orange 3 dyed alabaster
02691|s|F66467|SG|pink 3 dyed alabaster
02692|s|D1608A|SG|pink 3 dyed alabaster
02693|s|B8535A|SG|pink 3 dyed alabaster
02694|s|9A6058|SG|pink 3 dyed alabaster
02695|s|9D6172|SG|violet 3 dyed alabaster
03011|s|F7D0AD|SG|beige dyed crystal
03050|r|D3CDC2||chalkwhite
03093|s|D68E83|SG|pink dyed crystal
03111|s|E3C1B5|SG|brown 2 dyed chalkwhite
03112|s|DBAFA5|SG|brown 2 dyed chalkwhite
03113|s|D7BDBD|SG|brown 2 dyed chalkwhite
03121|s|B4ABCC|SG|violet 2 dyed chalkwhite
03122|s|BFA7CE|SG|violet 2 dyed chalkwhite
03123|s|C2A6EF|SG|violet 2 dyed chalkwhite
03131|s|A3AFF7|SG|blue 2 dyed chalkwhite
03132|s|8CB6EA|SG|blue 2 dyed chalkwhite
03133|s|83B7CA|SG|blue-green 2 dyed chalkwhite
03134|s|73CAF9|SG|blue-green 2 dyed chalkwhite
03141|s|BBB5B3|SG|grey 2 dyed chalkwhite
03151|s|D3C493|SG|green 2 dyed chalkwhite
03152|s|B9C5AA|SG|green 2 dyed chalkwhite
03153|s|C3CD85|SG|green 2 dyed chalkwhite
03154|s|AEC78D|SG|green 2 dyed chalkwhite
03161|s|A2CAA5|SG|green 2 dyed chalkwhite
03162|s|9EC6B4|SG|green 2 dyed chalkwhite
03163|s|AAC1B4|SG|green 2 dyed chalkwhite
03164|s|85D5CD|SG|green 2 dyed chalkwhite
03165|s|75CDDC|SG|green 2 dyed chalkwhite
03181|s|EBD68D|SG|yellow 2 dyed chalkwhite
03182|s|F9CE9A|SG|yellow 2 dyed chalkwhite
03183|s|F9B67C|SG|orange 2 dyed chalkwhite
03184|s|FAB591|SG|orange 2 dyed chalkwhite
03185|s|F0A895|SG|orange 2 dyed chalkwhite
03191|s|F99396|SG|red 2 dyed chalkwhite
03192|s|F09CD4|SG|pink 2 dyed chalkwhite
03193|s|F3A5BD|SG|red 2 dyed chalkwhite
03194|s|D6AEB5|SG|pink 2 dyed chalkwhite
03195|s|D2A3C9|SG|violet 2 dyed chalkwhite
03211|s|EEC6B2|SG|brown 1 dyed chalkwhite
03212|s|D9C0BB|SG|brown 1 dyed chalkwhite
03213|s|D9CDD3|SG|brown 1 dyed chalkwhite
03221|s|ADB3CC|SG|violet 1 dyed chalkwhite
03222|s|C0C0E0|SG|violet 1 dyed chalkwhite
03223|s|B6AEED|SG|violet 1 dyed chalkwhite
03231|s|A7B7EF|SG|blue 1 dyed chalkwhite
03232|s|98C3F1|SG|blue 1 dyed chalkwhite
03233|s|96BDC3|SG|blue-green 1 dyed chalkwhite
03234|s|A0E6FB|SG|blue-green 1 dyed chalkwhite
03241|s|B1B1B1|SG|grey 1 dyed chalkwhite
03251|s|D1CC96|SG|green 1 dyed chalkwhite
03252|s|C3C8A8|SG|green 1 dyed chalkwhite
03253|s|BDC79C|SG|green 1 dyed chalkwhite
03254|s|B2CCA2|SG|green 1 dyed chalkwhite
03261|s|99C4A5|SG|green 1 dyed chalkwhite
03262|s|A0BAAD|SG|green 1 dyed chalkwhite
03263|s|BFD1C5|SG|green 1 dyed chalkwhite
03264|s|92D1D3|SG|green 1 dyed chalkwhite
03265|s|85CDDE|SG|green 1 dyed chalkwhite
03281|s|DACE9C|SG|yellow 1 dyed chalkwhite
03282|s|E2C8A8|SG|yellow 1 dyed chalkwhite
03283|s|EBC19B|SG|orange 1 dyed chalkwhite
03284|s|EEBB9F|SG|orange 1 dyed chalkwhite
03285|s|E4BCB7|SG|orange 1 dyed chalkwhite
03291|s|F8B4C3|SG|red 1 dyed chalkwhite
03292|s|F1BAEB|SG|pink 1 dyed chalkwhite
03293|s|F5B7D3|SG|red 1 dyed chalkwhite
03294|s|D2B8C1|SG|pink 1 dyed chalkwhite
03295|s|CEACC9|SG|violet 1 dyed chalkwhite
03434|s|C0EFF5|SG|blue dyed crystal
03441|s|C2B6AB|SG|grey dyed crystal
03481|s|F1DC9C|SG|yellow dyed crystal
03491|s|FACBCF|SG|pink dyed crystal
03611|s|C19374|SG|brown 3 dyed chalkwhite
03612|s|9B6B5E|SG|brown 3 dyed chalkwhite
03613|s|997774|SG|brown 3 dyed chalkwhite
03621|s|786E80|SG|violet 3 dyed chalkwhite
03622|s|75657D|SG|violet 3 dyed chalkwhite
03623|s|7F5A97|SG|violet 3 dyed chalkwhite
03631|s|646AA8|SG|blue 3 dyed chalkwhite
03632|s|5178A5|SG|blue 3 dyed chalkwhite
03633|s|508E9E|SG|blue 3 dyed chalkwhite
03634|s|3CA2D2|SG|blue 3 dyed chalkwhite
03641|s|605F5F|SG|grey 3 dyed chalkwhite
03651|s|A19656|SG|green 3 dyed chalkwhite
03652|s|84885C|SG|green 3 dyed chalkwhite
03653|s|999E4A|SG|green 3 dyed chalkwhite
03654|s|749453|SG|green 3 dyed chalkwhite
03661|s|669F75|SG|green 3 dyed chalkwhite
03662|s|648A71|SG|green 3 dyed chalkwhite
03663|s|607C6B|SG|green 3 dyed chalkwhite
03664|s|4BAEA2|SG|green 3 dyed chalkwhite
03665|s|3DA8B6|SG|green 3 dyed chalkwhite
03681|s|D7B853|SG|yellow 3 dyed chalkwhite
03682|s|DFA660|SG|yellow 3 dyed chalkwhite
03683|s|DD985F|SG|orange 3 dyed chalkwhite
03684|s|D4855D|SG|orange 3 dyed chalkwhite
03685|s|C0795A|SG|orange 3 dyed chalkwhite
03691|s|E5778B|SG|pink 3 dyed chalkwhite
03692|s|BA66A0|SG|pink 3 dyed chalkwhite
03693|s|AF6380|SG|pink 3 dyed chalkwhite
03694|s|A88486|SG|pink 3 dyed chalkwhite
03695|s|996C98|SG|violet 3 dyed chalkwhite
03730|r|9897C9|H|harlequin chalkwhite-blue
06012|s|E7C490|Sh,SG|beige dyed chalkwhite
06013|s|EAD7B1|Sh,SG|beige dyed chalkwhite
07012|s|D2CBC7|SG|pink dyed crystal
07022|s|DC736B|SG|pink dyed crystal
07112|s|DA9D95|R,SG|pink dyed crystal, rainbow
07122|s|CB6252|R,SG|pink dyed crystal, rainbow
07331|s|C58C7B|TD|Rose terra
07332|s|F1BCA3|TD|Rose terra
07512|s|6B3E32|CuL,SG|pink dyed crystal, copper lined
07522|s|874334|CuL,SG|pink dyed crystal, copper lined
07612|s|E2D0CC|Sx,SG|pink dyed crystal, sfinx
07622|s|CB665F|Sx,SG|pink dyed crystal, sfinx
07631|s|C0A297|Sx,TD|Rose terra, sfinx
07633|s|B79B91|Sx,TD|Rose terra, sfinx
07712|s|D39D8F|SL,SG|pink dyed crystal, silver lined
07722|s|A94B50|SL,SG|pink dyed crystal, silver lined
08128|s|DCD1D8|Pe,TD|violet terra pearl dyed crystal
08198|s|E9E0D9|Pe,TD|pink terra pearl dyed crystal
08225|s|9B4F7D|SL,TD|violet dyed crystal, silver lined
08228|s|85658B|SL,TD|violet dyed crystal, silver lined
08236|s|5E9CBF|SL,TD|blue dyed crystal, silver lined
08256|s|93B180|SL,TD|green dyed crystal, silver lined
08258|s|88C0AA|SL,TD|green dyed crystal, silver lined
08265|s|548CAA|SL,TD|blue-green dyed crystal, silver lined
08273|s|C99A8F|SL,TD|pink dyed crystal, silver lined
08275|s|CA7A88|SL,TD|pink dyed crystal, silver lined
08277|s|CB7799|SL,TD|pink dyed crystal, silver lined
08283|s|C8AE50|SL,TD|yellow dyed crystal, silver lined
08286|s|C9AD40|SL,TD|yellow dyed crystal, silver lined
08288|s|C3916E|SL,TD|orange dyed crystal, silver lined
08289|s|CB7B43|SL,TD|orange dyed crystal, silver lined
08298|s|A8466F|SL,TD|pink dyed crystal, silver lined
08336|s|8FB3D0|Pe,TD|blue terra pearl dyed crystal
08349|s|AAA5A1|Pe,TD|grey terra pearl dyed crystal
08728|s|9F498D|FL|crystal, neon violet lined
08756|s|4ACF1B|FL|crystal, neon green lined
08777|s|F55185|FL|crystal, neon pink lined
08786|s|C4EA57|FL|crystal, neon yellow lined
08789|s|F87948|FL|crystal, neon orange lined
08A18|s|6D3C3D|CL,TIL|crystal, intensive brown lined
08A19|s|4D4541|CL,TIL|crystal, intensive dark brown lined
08A26|s|A2336A|CL,TIL|crystal, intensive pink lined
08A28|s|47485D|CL,TIL|crystal, intensive violet lined
08A38|s|346293|CL,TIL|crystal, intensive blue lined
08A54|s|67B114|CL,TIL|crystal, intensive green lined
08A58|s|1D7568|CL,TIL|crystal, intensive dark green lined
08A77|s|C13C5F|CL,TIL|crystal, intensive pink lined
08A86|s|E9BF05|CL,TIL|crystal, intensive yellow lined
08A91|s|D84C46|CL,TIL|crystal, intensive orange lined
08A98|s|CB3B4B|CL,TIL|crystal, intensive red lined
09351|s|FD8D7B|SG|coraline dyed chalkwhite
09451|s|FB8370|R,SG|coraline dyed chalkwhite, rainbow
0T930|s|9E8A78|Tv|blue and red stripes on chalkwhite, travertine
10020|r|D19125||lt. topaz
10022|s|EAA188|CL|lt. topaz, colour lined violet
10023|s|8C9F9B|CL|lt. topaz, colour lined blue
10050|r|C97A19||topaz
10070|r|A45619||topaz
10090|r|793616||topaz
10110|r|4C281B||dark topaz
10140|r|372B24||dark topaz
10705|r|C28539|H|harlequin crystal-topaz
11020|s|EDB157|R|lt. topaz, rainbow
11022|s|697674|CL,Sx|lt. topaz, colour lined blue, sfinx
11024|s|70975B|CL,Sx|lt. topaz, colour lined green, sfinx
11027|s|D44F6E|CL,Sx|lt. topaz, colour lined pink, sfinx
11028|s|D3645B|CL,Sx|lt. topaz, colour lined pink, sfinx
11050|s|DF9534|R|topaz, rainbow
11070|s|F09636|R|topaz, rainbow
11090|s|A65239|R|topaz, rainbow
11110|s|7C4A42|R|dark topaz, rainbow
11140|s|473B41|R|dark topaz, rainbow
11337|s|627F8B|CL,Sx,TL|lt. topaz, colour lined blue, sfinx
11355|s|69A176|CL,Sx,TL|lt. topaz, colour lined green, sfinx
11396|s|D35E49|CL,Sx,TL|lt. topaz, colour lined red, sfinx
11398|s|C97668|CL,Sx,TL|lt. topaz, colour lined red, sfinx
13600|r|763C26||opaque brown "tango"
13780|r|533F36||opaque brown "tango"
14600|s|70323A|R|opaque brown "tango", rainbow
14780|s|704B55|R|opaque brown "tango", rainbow
15026|s|F1AF4A|CL|lt. topaz, colour lined chalkwhite
15056|s|E5932D|CL|topaz, colour lined chalkwhite
15076|s|D77E21|CL|topaz, colour lined chalkwhite
15096|s|8E4C22|CL|topaz, colour lined chalkwhite
16020|s|EDBB6E|Sx|lt. topaz, sfinx
16050|s|DC9B4C|Sx|topaz, sfinx
16070|s|E29555|Sx|topaz, sfinx
16090|s|BC6B52|Sx|topaz, sfinx
16110|s|5F4C4B|Sx|dark topaz, sfinx
16125|s|CC5BCA|Sx|violet dyed chalkwhite, sfinx
16128|s|885DC9|Sx|violet dyed chalkwhite, sfinx
16136|s|268DEB|Sx|blue dyed chalkwhite, sfinx
16140|s|454A57|Sx|dark topaz, sfinx
16156|s|7ED381|Sx|green dyed chalkwhite, sfinx
16158|s|3BCACD|Sx|green dyed chalkwhite, sfinx
16165|s|1F93E4|Sx|blue-green dyed chalkwhite, sfinx
16172|s|FACDE8|Sx|pink dyed chalkwhite, sfinx
16173|s|EF90DF|Sx|pink dyed chalkwhite, sfinx
16177|s|FA57D9|Sx|pink dyed chalkwhite, sfinx
16183|s|EBAD57|Sx|yellow dyed chalkwhite, sfinx
16186|s|F3E13D|Sx|yellow dyed chalkwhite, sfinx
16189|s|F36B26|Sx|orange dyed chalkwhite, sfinx
16198|s|A54965|Sx|red dyed chalkwhite, sfinx
16228|s|B9A7B6|Pe,TD|violet terra pearl dyed chalkwhite
16325|s|BC6FB5|Sx,TD|violet dyed chalkwhite, sfinx
16328|s|957AC4|Sx,TD|violet dyed chalkwhite, sfinx
16336|s|71A5EB|Sx,TD|blue dyed chalkwhite, sfinx
16356|s|A0CD8B|Sx,TD|green dyed chalkwhite, sfinx
16358|s|72BDA8|Sx,TD|green dyed chalkwhite, sfinx
16365|s|61A3D5|Sx,TD|blue-green dyed chalkwhite, sfinx
16383|s|F5CE25|Sx,TD|yellow dyed chalkwhite, sfinx
16386|s|F6D622|Sx,TD|yellow dyed chalkwhite, sfinx
16389|s|F59F50|Sx,TD|orange dyed chalkwhite, sfinx
16398|s|E984AA|Sx,TD|pink dyed chalkwhite, sfinx
16536|s|6DA6D9|Me,Sx,TD|blue metallic dyed chalkwhite, sfinx
16541|s|CCCDD4|Me,Sx,TD|grey metallic dyed chalkwhite, sfinx
16565|s|63AAD4|Me,Sx,TD|blue-green metallic dyed chalkwhite, sfinx
16584|s|A39369|Me,Sx,TD|orange metallic dyed chalkwhite, sfinx
16586|s|BCB06F|Me,Sx,TD|yellow metallic dyed chalkwhite, sfinx
16717|s|C7A082|Me,TD|beige metallic dyed chalkwhite
16726|s|C2BDD8|Me,TD|violet metallic dyed chalkwhite
16728|s|A692CD|Me,TD|violet metallic dyed chalkwhite
16736|s|5F9ED9|Me,TD|blue metallic dyed chalkwhite
16742|s|A5AAB9|Me,TD|grey metallic dyed chalkwhite
16756|s|69B198|Me,TD|green metallic dyed chalkwhite
16786|s|C1B774|Me,TD|yellow metallic dyed chalkwhite
16918|s|C18459|Pe,TD|brown terra pearl dyed chalkwhite
16949|s|A9A6A0|Pe,TD|grey terra pearl dyed chalkwhite
16958|s|73E1CE|Pe,TD|green terra pearl dyed chalkwhite
16992|s|E3A87E|Pe,TD|orange terra pearl dyed chalkwhite
16A18|s|953538|TID|brown intensive dyed chalkwhite
16A19|s|874C40|TID|dark brown intensive dyed chalkwhite
16A26|s|F24DB4|TID|pink intensive dyed chalkwhite
16A28|s|6D45A6|TID|violet intensive dyed chalkwhite
16A38|s|1575C5|TID|blue intensive dyed chalkwhite
16A54|s|A1DF0E|TID|green intensive dyed chalkwhite
16A58|s|0DC0A7|TID|dark green intensive dyed chalkwhite
16A77|s|F24C8D|TID|pink intensive dyed chalkwhite
16A86|s|FAE336|TID|yellow intensive dyed chalkwhite
16A91|s|F95C33|TID|orange intensive dyed chalkwhite
16A98|s|F53445|TID|red intensive dyed chalkwhite
17029|s|BB9464|SL,Sx,R|lt. topaz, silver lined, rainbow
17050|s|B7823E|SL|topaz, silver lined
17059|s|E5B258|SL,Sx,R|topaz, silver lined, rainbow
17070|s|EAC46C|SL|topaz, silver lined
17090|s|BA845E|SL|topaz, silver lined
17110|s|AB7966|SL|dark topaz, silver lined
17119|s|B79685|SL,Sx,R|dark topaz, silver lined, rainbow
17125|s|BC549F|Lu-white|violet dyed alabaster, lustered
17128|s|6D5EB4|Lu-white|violet dyed alabaster, lustered
17136|s|2D63AC|Lu-white|blue dyed alabaster, lustered
17140|s|8C756B|SL|dark topaz, silver lined
17156|s|4DAA26|Lu-white|green dyed alabaster, lustered
17158|s|5ED2D4|Lu-white|green dyed alabaster, lustered
17165|s|2280B1|Lu-white|blue-green dyed alabaster, lustered
17173|s|FBB6D6|Lu-white|pink dyed alabaster, lustered
17183|s|DD9C10|Lu-white|yellow dyed alabaster, lustered
17186|s|DFC516|Lu-white|yellow dyed alabaster, lustered
17189|s|D26D3A|Lu-white|orange dyed alabaster, lustered
17218|s|CEBFC6|Pe,TD|brown terra pearl dyed alabaster
17286|s|CFCCAF|Pe,TD|yellow terra pearl dyed alabaster
17298|s|DBA3BC|Pe,TD|pink terra pearl dyed alabaster
17325|s|A060A6|Lu-white,TD|ceylon violet
17328|s|835CA7|Lu-white,TD|ceylon violet
17336|s|4D88C1|Lu-white,TD|ceylon blue
17356|s|76B871|Lu-white,TD|ceylon green
17358|s|59A494|Lu-white,TD|ceylon green
17365|s|4F8BB6|Lu-white,TD|ceylon blue-green
17383|s|E9B42E|Lu-white,TD|ceylon yellow
17386|s|E3C110|Lu-white,TD|ceylon yellow
17389|s|E9904C|Lu-white,TD|ceylon orange
17398|s|E16779|Lu-white,TD|ceylon pink
17436|s|92B9D0|Me,R,TD|blue metallic dyed alabaster, rainbow
17486|s|B6BF8F|Me,R,TD|yellow metallic dyed alabaster, rainbow
17549|s|9A9997|Me,Sx,TD|black metallic dyed alabaster, sfinx
17705|s|AB6C37|H,SL|harlequin crystal-topaz, silver lined
17708|s|AFB3BD|Me|silver metallic dyed alabaster
17728|s|8B77BA|Me,TD|violet metallic dyed alabaster
17736|s|5491CD|Me,TD|blue metallic dyed alabaster
17758|s|419387|Me,TD|green metallic dyed alabaster
17783|s|9C7C6B|Me,TD|orange metallic dyed alabaster
17784|s|DDB681|Me,TD|orange metallic dyed alabaster
17786|s|B1A55A|Me,TD|yellow metallic dyed alabaster
17796|s|854C86|Me,TD|violet metallic dyed alabaster
17836|s|64B3DF|TD|blue dyed alabaster
17856|s|36CD76|TD|green dyed alabaster
17858|s|51C9B0|TD|green dyed alabaster
17886|s|F4C92A|TD|yellow dyed alabaster
17899|s|F33F46|TD|pink dyed alabaster
17918|s|D0A076|Pe,TD|brown terra pearl dyed alabaster
17986|s|DFC64B|Pe,TD|yellow terra pearl dyed alabaster
17992|s|D08E6B|Pe,TD|orange terra pearl dyed alabaster
17998|s|B4447B|Pe,TD|pink terra pearl dyed alabaster
18112|s|BA9A80|Me,SG|brown solgel metallic
18113|s|BEA689|Me,SG|brown solgel metallic
18123|s|B4959C|Me,SG|violet solgel metallic
18131|s|979191|Me,SG|blue solgel metallic
18134|s|929D86|Me,SG|blue solgel metallic
18141|s|A1937F|Me,SG|grey solgel metallic
18151|s|AB9970|Me,SG|green solgel metallic
18154|s|AEA36D|Me,SG|green solgel metallic
18161|s|A8AB7C|Me,SG|green solgel metallic
18165|s|88977D|Me,SG|green solgel metallic
18181|s|BAA264|Me,SG|gold solgel metallic
18184|s|C9976D|Me,SG|orange solgel metallic
18191|s|DF8E93|Me,SG|pink solgel metallic
18192|s|BE9595|Me,SG|red solgel metallic
18225|s|E587DB|SL|violet dyed crystal, silver lined
18228|s|9157AA|SL|violet dyed crystal, silver lined
18236|s|2C84CB|SL|blue dyed crystal, silver lined
18256|s|6BAE5A|SL|green dyed crystal, silver lined
18258|s|43C9CA|SL|green dyed crystal, silver lined
18265|s|208CB4|SL|blue-green dyed crystal, silver lined
18273|s|EB8CAB|SL|pink dyed crystal, silver lined
18275|s|EA5CA3|SL|pink dyed crystal, silver lined
18286|s|D7B81C|SL|yellow dyed crystal, silver lined
18288|s|DB8739|SL|orange dyed crystal, silver lined
18289|s|E46715|SL|orange dyed crystal, silver lined
18298|s|B83643|SL|red dyed crystal, silver lined
18302|s|CAC7BE|Me|silver metallic
18303|s|ACA999|Me|silver metallic
18304|s|A1764E|Me|gold metallic
18325|s|8A2D61|Me|violet metallic
18328|s|50357B|Me|violet metallic
18336|s|3174A5|Me|blue metallic
18356|s|5EA45F|Me|green metallic
18358|s|30817E|Me|green metallic
18377|s|B33B8E|Me|pink metallic
18383|s|C6B149|Me|gold metallic
18386|s|C9AD5A|Me|gold metallic
18388|s|A56F28|Me|gold metallic
18389|s|E87A21|Me|gold metallic
18398|s|AF414B|Me|red metallic
18486|s|D0D7A3|Me,R,TD|yellow metallic dyed crystal, rainbow
18503|s|C0B49C|Me,TD|silver metallic dyed crystal
18528|s|8F688C|Me,TD|violet metallic dyed crystal
18536|s|96AAAD|Me,TD|blue metallic dyed crystal
18542|s|B0A894|Me,TD|grey metallic dyed crystal
18549|s|807160|Me,TD|beige metallic dyed crystal
18556|s|89A573|Me,TD|green metallic dyed crystal
18558|s|7AA481|Me,TD|green metallic dyed crystal
18565|s|729B92|Me,TD|blue-green metallic dyed crystal
18581|s|C4995F|Me,TD|gold metallic dyed crystal
18583|s|A17148|Me,TD|gold metallic dyed crystal
18586|s|C6A93E|Me,TD|gold metallic dyed crystal
18589|s|B78F77|Me,TD|pink gold metallic dyed crystal
18595|s|BD8E9B|Me,TD|pink metallic dyed crystal
18598|s|CF7783|Me,TD|red metallic dyed crystal
18600|s|704C4C|Sx|opaque brown "tango", sfinx
18601|s|644A40|Lu-white|opaque brown "tango", 2x lustered
18780|s|3C3641|Sx|opaque brown "tango", sfinx
18908|s|B0ADA9|Me|silver metallic dyed crystal
18928|s|836393|Me,TD|violet metallic dyed crystal
18936|s|4A84BC|Me,TD|blue metallic dyed crystal
18942|s|868584|Me,TD|grey metallic dyed crystal
18949|s|6A6158|Me,TD|black metallic dyed crystal
18958|s|4BA79E|Me,TD|green metallic dyed crystal
18965|s|75B6C9|Me,TD|blue-green metallic dyed crystal
18983|s|B06C45|Me,TD|orange metallic dyed crystal
18984|s|A27C4B|Me,TD|orange metallic dyed crystal
18986|s|A2B241|Me,TD|yellow metallic dyed crystal
18996|s|D8687E|Me,TD|violet metallic dyed crystal
18998|s|C68297|Me,TD|pink metallic dyed crystal
19020|s|98592F|CuL|lt. topaz, copper lined
19050|s|623C1C|CuL|topaz, copper lined
19090|s|4D3F34|CuL|topaz, copper lined
19102|s|664B37|Me,Sx,Lu-bronze|dark topaz, bronze iris sfinx
19135|s|4A3C3C|Me,Lu-bronze,Ir-blue|dark topaz, bronze blue iris
19155|s|464643|Me,Lu-bronze,Ir-green|dark topaz, bronze green iris
19195|s|634A35|Me,Lu-bronze,Ir-red|dark topaz, bronze red iris
20010|r|704F5F||lt. amethyst
20060|r|35262C||amethyst
20080|r|302529||dark amethyst
20206|s|AA8956|FC,Au,Me|crystal, genuine gold plated
21010|s|A07B8B|R|lt. amethyst, rainbow
21060|s|634244|R|amethyst, rainbow
21080|s|544753|R|dark amethyst, rainbow
22001|s|F2CE5F|PL|PermaLux dyed chalk, lt. yellow
22002|s|F3A820|PL|PermaLux dyed chalk, dark yellow
22003|s|D48F3F|PL|PermaLux dyed chalk, yellow-brown
22004|s|E15F3D|PL|PermaLux dyed chalk, orange
22005|s|EB8A64|PL|PermaLux dyed chalk, apricot
22006|s|BC6A56|PL|PermaLux dyed chalk, lt. brown
22007|s|944230|PL|PermaLux dyed chalk, brown
22008|s|E8443E|PL|PermaLux dyed chalk, red
22009|s|ED726E|PL|PermaLux dyed chalk, pink
22010|s|E66B79|PL|PermaLux dyed chalk, lt. pink
22011|s|DE3C6A|PL|PermaLux dyed chalk, fuchsia
22012|s|C16B88|PL|PermaLux dyed chalk, violet
22013|s|983654|PL|PermaLux dyed chalk, purple
22014|s|7A6493|PL|PermaLux dyed chalk, levander
22015|s|4E3E6D|PL|PermaLux dyed chalk, dark violet
22016|s|6AB6A1|PL|PermaLux dyed chalk, mint
22017|s|43815A|PL|PermaLux dyed chalk, sea green
22018|s|407770|PL|PermaLux dyed chalk, teal
22019|s|2182AE|PL|PermaLux dyed chalk, dark turquoise
22020|s|3780AD|PL|PermaLux dyed chalk, lt. blue
22021|s|185487|PL|PermaLux dyed chalk, blue
22022|s|554C45|PL|PermaLux dyed chalk, grey
22m01|s|EBCF56|PL|PermaLux dyed chalk, lt. yellow, matt
22m02|s|F7A513|PL|PermaLux dyed chalk, dark yellow, matt
22m03|s|CA853B|PL|PermaLux dyed chalk, yellow-brown, matt
22m04|s|DE5A38|PL|PermaLux dyed chalk, orange, matt
22m05|s|EAA181|PL|PermaLux dyed chalk, apricot, matt
22m06|s|BF7770|PL|PermaLux dyed chalk, lt. brown, matt
22m07|s|8B3D2B|PL|PermaLux dyed chalk, brown, matt
22m08|s|DA4959|PL|PermaLux dyed chalk, red, matt
22m09|s|E97676|PL|PermaLux dyed chalk, pink, matt
22m10|s|E6929C|PL|PermaLux dyed chalk, lt. pink, matt
22m11|s|D53D4E|PL|PermaLux dyed chalk, fuchsia, matt
22m12|s|C37596|PL|PermaLux dyed chalk, violet, matt
22m13|s|94395D|PL|PermaLux dyed chalk, purple, matt
22m14|s|937AAA|PL|PermaLux dyed chalk, levander, matt
22m15|s|3D2E64|PL|PermaLux dyed chalk, dark violet, matt
22m16|s|70B79B|PL|PermaLux dyed chalk, mint, matt
22m17|s|247151|PL|PermaLux dyed chalk, sea green, matt
22m18|s|0F695B|PL|PermaLux dyed chalk, teal, matt
22m19|s|1797A7|PL|PermaLux dyed chalk, dark turquoise, matt
22m20|s|3879AC|PL|PermaLux dyed chalk, lt. blue, matt
22m21|s|315D9C|PL|PermaLux dyed chalk, blue, matt
22m22|s|3B3B3B|PL|PermaLux dyed chalk, grey, matt
23020|r|9A7776||opaque violet
23040|r|765958||opaque dark violet
23300|r|252423|St-4|white stripes on black
23420|r|DCD4EA||opaque lilac
23530|s|80AB5B|Pe|soft neon green dyed chalkwhite
23630|s|81C2BC|Pe|soft pearl aqua dyed chalkwhite
23730|s|EA98B6|Pe|
23830|s|D9D52C|Pe|
23980|r|232320||black
24020|s|996C87|R|opaque violet, rainbow
24040|s|4B3841|R|opaque dark violet, rainbow
24420|s|C3B6D4|R|opaque lilac, rainbow
25014|s|483B33|BrL|lt. amethyst, bronze lined
25016|s|A08493|CL|lt. amethyst, colour lined chalkwhite
25066|s|6E5062|CL|amethyst, colour lined chalkwhite
25086|s|4D3A42|CL|dark amethyst, colour lined chalkwhite
26010|s|9D849E|Sx|lt. amethyst, sfinx
26060|s|6B585B|Sx|amethyst, sfinx
26080|s|4A4D5E|Sx|dark amethyst, sfinx
26210|s|E2D5E3|Pe|soft pearl violet dyed chalkwhite
26630|s|379EC1|Pe|
26631|s|77A2C1|Pe|soft pearl aqua dyed chalkwhite
26850|s|F79D61|Pe|
26960|s|A53B45|Pe|
26970|s|D96F63|Pe|chalkwhite, soft coral red
27019|s|6E6074|SL,Sx,R|lt. amethyst, silver lined, rainbow
27060|s|76626B|SL|amethyst, silver lined
27080|s|7D7474|SL|dark amethyst, silver lined
28020|s|9B8089|Sx|opaque violet, sfinx
28040|s|746977|Sx|opaque dark violet, sfinx
28420|s|C1B5BD|Sx|opaque lilac, sfinx
28928|s|33323C|Pe,TD|violet pearl dyed black
28936|s|919395|Pe,TD|blue pearl dyed black
28958|s|798180|Pe,TD|green pearl dyed black
28998|s|969391|Pe,TD|red pearl dyed black
29010|s|5D424B|CuL|lt. amethyst, copper lined
29980|s|5E5E54|Tv|travertine on black
30030|r|505BDC||lt. sapphire
30050|r|3C38BC||sapphire
30080|r|27207F||sapphire
30100|r|1E1A49||dark sapphire
30110|r|302F34||dark sapphire
31030|s|778DF8|R|lt. sapphire, rainbow
31050|s|555BD0|R|sapphire, rainbow
31080|s|4446BF|R|sapphire, rainbow
31100|s|39388C|R|dark sapphire, rainbow
31110|s|2A2934|R|dark sapphire, rainbow
32010|r|7489E6||alabaster blue
33000|r|BDC8E6||opaque lt. blue
33020|r|93A6E4||opaque blue
33021|s|7A7A81|Lu-yellow-brown|opaque blue, yellow-brown luster
33023|s|586784|Lu-blue|opaque blue, blue luster
33025|s|687887|Lu-green|opaque blue, green luster
33040|r|5964C8||opaque blue
33050|r|272683||opaque blue
33060|r|27218F||opaque blue
33061|s|414257|Lu-yellow-brown|opaque blue, yellow-brown luster
33062|s|4A3B4F|Lu-lila|opaque blue, lila luster
33070|r|242758||opaque dark blue
33080|r|2C2931||opaque dark blue
33210|r|446BA2||opaque blue
33220|r|436B97||opaque blue
34000|s|869BBF|R|opaque lt. blue, rainbow
34020|s|98ABE2|R|opaque blue, rainbow
34040|s|4156A6|R|opaque blue, rainbow
34050|s|2B3279|R|opaque blue, rainbow
34060|s|2D306C|R|opaque blue, rainbow
34070|s|222345|R|opaque dark blue, rainbow
34210|s|526AAE|R|opaque blue, rainbow
34220|s|2A4E6A|R|opaque blue, rainbow
35036|s|5485EF|CL|lt. sapphire, colour lined chalkwhite
35056|s|4267DD|CL|sapphire, colour lined chalkwhite
35086|s|3945CC|CL|sapphire, colour lined chalkwhite
36030|s|506AF0|Sx|lt. sapphire, sfinx
36050|s|5462CF|Sx|sapphire, sfinx
36080|s|525CCC|Sx|sapphire, sfinx
36100|s|3F3F97|Sx|dark sapphire, sfinx
36110|s|363F57|Sx|dark sapphire, sfinx
37030|s|88ABD5|SL|lt. sapphire, silver lined
37039|s|899CC8|SL,Sx,R|lt. sapphire, silver lined, rainbow
37050|s|75A1EF|SL|sapphire, silver lined
37059|s|6C81C1|SL,Sx,R|sapphire, silver lined, rainbow
37080|s|212956|SL|sapphire, silver lined
37100|s|696EB8|SL|dark sapphire, silver lined
37109|s|3D3B68|SL,Sx,R|dark sapphire, silver lined, rainbow
37126|s|D48FAE|CL,Lu-white|ceylon violet
37128|s|BD98CD|CL,Lu-white|ceylon violet
37132|s|9EB1B4|CL,Lu-white|ceylon blue
37136|s|7DB2E6|CL,Lu-white|ceylon blue
37149|s|8590A5|CL,Lu-white|ceylon grey
37152|s|B1CD94|CL,Lu-white|ceylon green
37156|s|90CFAB|CL,Lu-white|ceylon green
37158|s|ABD8D4|CL,Lu-white|ceylon green
37173|s|E29CA7|CL,Lu-white|ceylon pink
37175|s|E28EB7|CL,Lu-white|ceylon pink
37177|s|EB9ED5|CL,Lu-white|ceylon pink
37186|s|E4CC76|CL,Lu-white|ceylon yellow
37188|s|E0A68A|CL,Lu-white|ceylon orange
37189|s|F8BAA2|CL,Lu-white|ceylon orange
37325|s|D1A8BC|CL,Sx,Lu-white,TL|ceylon violet
37328|s|BF98B5|CL,Sx,Lu-white,TL|ceylon violet
37336|s|95ABBA|CL,Sx,Lu-white,TL|ceylon blue
37342|s|A0A6B2|CL,Sx,Lu-white,TL|ceylon grey
37356|s|88B086|CL,Sx,Lu-white,TL|ceylon green
37358|s|8EBFAF|CL,Sx,Lu-white,TL|ceylon green
37365|s|85B3C4|CL,Sx,Lu-white,TL|ceylon blue-green
37383|s|D9A27B|CL,Sx,Lu-white,TL|ceylon yellow
37386|s|DEBC76|CL,Sx,Lu-white,TL|ceylon yellow
37389|s|D4A697|CL,Sx,Lu-white,TL|ceylon orange
37398|s|D09196|CL,Sx,Lu-white,TL|ceylon pink
38000|s|7C95CF|Sx|opaque lt. blue, sfinx
38002|s|DFDBD7|CL|crystal, colour lined chalkwhite
38011|s|908F88|CL|crystal, colour lined brown
38019|s|574E4D|CL|crystal, colour lined brown
38020|s|7F92C7|Sx|opaque blue, sfinx
38029|s|5D3C55|CL|crystal, colour lined violet
38039|s|5C5F61|CL|crystal, colour lined blue
38040|s|455FBD|Sx|opaque blue, sfinx
38044|s|818087|CL|crystal, colour lined grey
38050|s|39455E|Sx|opaque blue, sfinx
38059|s|696B62|CL|crystal, colour lined green
38060|s|2D3782|Sx|opaque blue, sfinx
38066|s|4A5967|CL|crystal, colour lined blue-green
38070|s|2F375F|Sx|opaque dark blue, sfinx
38080|s|393E55|Sx|opaque dark blue, sfinx
38099|s|755361|CL|crystal, colour lined red
38102|s|E4E3E3|CL,Sx|crystal, colour lined chalkwhite, sfinx
38116|s|B08E8B|CL,Sx|crystal, colour lined brown, sfinx
38117|s|B28783|CL,Sx|crystal, colour lined brown, sfinx
38118|s|8C696A|CL,Sx|crystal, colour lined brown, sfinx
38123|s|F688D4|CL,Sx|crystal, colour lined pink, sfinx
38124|s|E880B7|CL,Sx|crystal, colour lined pink, sfinx
38125|s|BB66B4|CL,Sx|crystal, colour lined pink, sfinx
38126|s|FBC9E7|CL,Sx|crystal, colour lined pink, sfinx
38127|s|D488DA|CL,Sx|crystal, colour lined pink, sfinx
38128|s|A063C5|CL,Sx|crystal, colour lined violet, sfinx
38132|s|70B6E5|CL,Sx|crystal, colour lined blue, sfinx
38134|s|70BDF5|CL,Sx|crystal, colour lined blue, sfinx
38136|s|7083BB|CL,Sx|crystal, colour lined blue, sfinx
38149|s|797982|CL,Sx|crystal, colour lined black, sfinx
38152|s|A0CEAC|CL,Sx|crystal, colour lined green, sfinx
38153|s|C2E9E2|CL,Sx|crystal, colour lined green, sfinx
38154|s|BDDD8A|CL,Sx|crystal, colour lined green, sfinx
38155|s|4DC0C9|CL,Sx|crystal, colour lined green, sfinx
38156|s|85BE7E|CL,Sx|crystal, colour lined green, sfinx
38158|s|7CDBE0|CL,Sx|crystal, colour lined green, sfinx
38162|s|A5CFD7|CL,Sx|crystal, colour lined blue-green, sfinx
38163|s|83C9F0|CL,Sx|crystal, colour lined blue-green, sfinx
38165|s|61A0D1|CL,Sx|crystal, colour lined blue-green, sfinx
38173|s|F8C4D9|CL,Sx|crystal, colour lined pink, sfinx
38175|s|F47BB2|CL,Sx|crystal, colour lined pink, sfinx
38177|s|E2589E|CL,Sx|crystal, colour lined pink, sfinx
38181|s|E3D380|CL,Sx|crystal, colour lined yellow, sfinx
38182|s|F7D85E|CL,Sx|crystal, colour lined yellow, sfinx
38183|s|D9A75A|CL,Sx|crystal, colour lined yellow, sfinx
38184|s|DFD578|CL,Sx|crystal, colour lined yellow, sfinx
38185|s|DBC661|CL,Sx|crystal, colour lined yellow, sfinx
38186|s|F4DC57|CL,Sx|crystal, colour lined yellow, sfinx
38187|s|E1A286|CL,Sx|crystal, colour lined orange, sfinx
38188|s|FB9F72|CL,Sx|crystal, colour lined orange, sfinx
38189|s|FA915C|CL,Sx|crystal, colour lined orange, sfinx
38194|s|E69FB5|CL,Sx|crystal, colour lined red, sfinx
38196|s|E68AA0|CL,Sx|crystal, colour lined red, sfinx
38198|s|B2727A|CL,Sx|crystal, colour lined red, sfinx
38210|s|566F90|Sx|opaque blue, sfinx
38218|s|E1D8CD|CL,Pe,TL|crystal, colour lined brown pearl
38220|s|315A88|Sx|opaque blue, sfinx
38228|s|C7C4C4|CL,Pe,TL|crystal, colour lined violet pearl
38236|s|D7D8D9|CL,Pe,TL|crystal, colour lined blue pearl
38249|s|E5E1DD|CL,Pe,TL|crystal, colour lined grey pearl
38258|s|D1E7DC|CL,Pe,TL|crystal, colour lined green pearl
38286|s|DCD7A4|CL,Pe,TL|crystal, colour lined yellow pearl
38292|s|E0DCD5|CL,Pe,TL|crystal, colour lined orange pearl
38298|s|E1AFB0|CL,Pe,TL|crystal, colour lined red pearl
382PA|s|F5BE80|CL,Sx,Pe,TL|crystal, colour lined apricot pearl, sfinx
382PB|s|B4BDC1|CL,Sx,Pe,TL|crystal, colour lined blue pearl, sfinx
382PC|s|9A8F7C|CL,Sx,Pe,TL|crystal, colour lined mocca pearl, sfinx
382PD|s|CCC8C5|CL,Sx,Pe,TL|crystal, colour lined grey pearl, sfinx
382PG|s|9EDCCF|CL,Sx,Pe,TL|crystal, colour lined green pearl, sfinx
382PI|s|E6DDC6|CL,Sx,Pe,TL|crystal, colour lined ivory pearl, sfinx
382PP|s|F2BCBC|CL,Sx,Pe,TL|crystal, colour lined pink pearl, sfinx
382PS|s|E3C1AC|CL,Sx,Pe,TL|crystal, colour lined salmon pearl, sfinx
382PV|s|B3B0C5|CL,Sx,Pe,TL|crystal, colour lined violet pearl, sfinx
382PY|s|E7C67D|CL,Sx,Pe,TL|crystal, colour lined yellow pearl, sfinx
38317|s|948381|CL,TL|crystal, colour lined brown
38318|s|6F5E5C|CL,TL|crystal, colour lined brown
38319|s|765C60|CL,TL|crystal, colour lined brown
38325|s|D8B5C5|CL,TL|crystal, colour lined violet
38326|s|A86CB4|CL,TL|crystal, colour lined violet
38327|s|CAAAAF|CL,TL|crystal, colour lined violet
38328|s|C6ADC0|CL,TL|crystal, colour lined violet
38332|s|68B0EE|CL,TL|crystal, colour lined blue
38338|s|456396|CL,TL|crystal, colour lined blue
38342|s|696D78|CL,TL|crystal, colour lined grey
38349|s|393A3B|CL,TL|crystal, colour lined black
38352|s|ABD3B7|CL,TL|crystal, colour lined green
38353|s|C0D7CE|CL,TL|crystal, colour lined green
38357|s|5F9055|CL,TL|crystal, colour lined green
38358|s|34BB95|CL,TL|crystal, colour lined green
38359|s|617161|CL,TL|crystal, colour lined green
38362|s|68C4F1|CL,TL|crystal, colour lined blue-green
38365|s|BCCED8|CL,TL|crystal, colour lined blue-green
38381|s|D8D7BF|CL,TL|crystal, colour lined yellow
38383|s|E8B132|CL,TL|crystal, colour lined yellow
38386|s|E9DA9B|CL,TL|crystal, colour lined yellow
38387|s|E3DAD4|CL,TL|crystal, colour lined orange
38389|s|F59B86|CL,TL|crystal, colour lined orange
38395|s|E0CACA|CL,TL|crystal, colour lined red
38397|s|E75055|CL,TL|crystal, colour lined red
38398|s|E14C65|CL,TL|crystal, colour lined red
38418|s|675A54|CL|crystal, colour lined brown
38428|s|C3BFC1|CL|crystal, colour lined violet
38436|s|C9D2D9|CL|crystal, colour lined blue
38449|s|B4B2AD|CL|crystal, colour lined black
38458|s|749A8C|CL|crystal, colour lined green
38481|s|E2D182|CL|crystal, colour lined yellow
38498|s|DEC6C4|CL|crystal, colour lined red
38602|s|C9C7C2|CL,Sx,TL|crystal, colour lined chalkwhite, sfinx
38617|s|B19486|CL,Sx,TL|crystal, colour lined brown, sfinx
38618|s|B19282|CL,Sx,TL|crystal, colour lined brown, sfinx
38619|s|957567|CL,Sx,TL|crystal, colour lined brown, sfinx
38625|s|E198C6|CL,Sx,TL|crystal, colour lined violet, sfinx
38626|s|D7B7CD|CL,Sx,TL|crystal, colour lined violet, sfinx
38627|s|CB8CA9|CL,Sx,TL|crystal, colour lined violet, sfinx
38628|s|B889AB|CL,Sx,TL|crystal, colour lined violet, sfinx
38632|s|9FBBCD|CL,Sx,TL|crystal, colour lined blue, sfinx
38636|s|6190C3|CL,Sx,TL|crystal, colour lined blue, sfinx
38638|s|7186A7|CL,Sx,TL|crystal, colour lined blue, sfinx
38642|s|8B8785|CL,Sx,TL|crystal, colour lined grey, sfinx
38649|s|6A696B|CL,Sx,TL|crystal, colour lined black, sfinx
38652|s|83AB78|CL,Sx,TL|crystal, colour lined green, sfinx
38653|s|9FC9B3|CL,Sx,TL|crystal, colour lined green, sfinx
38656|s|6DD7AF|CL,Sx,TL|crystal, colour lined green, sfinx
38657|s|7B7D52|CL,Sx,TL|crystal, colour lined green, sfinx
38658|s|7CB8A3|CL,Sx,TL|crystal, colour lined green, sfinx
38659|s|777B69|CL,Sx,TL|crystal, colour lined green, sfinx
38662|s|83C1DD|CL,Sx,TL|crystal, colour lined blue-green, sfinx
38665|s|66A6CD|CL,Sx,TL|crystal, colour lined blue-green, sfinx
38681|s|EEDD8C|CL,Sx,TL|crystal, colour lined yellow, sfinx
38683|s|F7CD72|CL,Sx,TL|crystal, colour lined yellow, sfinx
38686|s|F0DA48|CL,Sx,TL|crystal, colour lined yellow, sfinx
38687|s|EAB297|CL,Sx,TL|crystal, colour lined orange, sfinx
38689|s|F19582|CL,Sx,TL|crystal, colour lined orange, sfinx
38694|s|F5C2D6|CL,Sx,TL|crystal, colour lined pink, sfinx
38695|s|DD8F95|CL,Sx,TL|crystal, colour lined red, sfinx
38697|s|F08084|CL,Sx,TL|crystal, colour lined red, sfinx
38698|s|F57B99|CL,Sx,TL|crystal, colour lined red, sfinx
38818|s|545057|CL,Sx|crystal, colour lined brown, sfinx
38828|s|806BB7|CL,Sx|crystal, colour lined violet, sfinx
38836|s|4F71B5|CL,Sx|crystal, colour lined blue, sfinx
38858|s|4FB8C6|CL,Sx|crystal, colour lined green, sfinx
38877|s|DC74D5|CL,Sx|crystal, colour lined pink, sfinx
38886|s|DDC73E|CL,Sx|crystal, colour lined yellow, sfinx
38889|s|DF706B|CL,Sx|crystal, colour lined orange, sfinx
38898|s|B25883|CL,Sx|crystal, colour lined red, sfinx
38918|s|D7AD91|CL,Pe,TL|crystal, colour lined brown pearl
38928|s|A69DBE|CL,Pe,TL|crystal, colour lined violet pearl
38936|s|98ADD7|CL,Pe,TL|crystal, colour lined blue pearl
38958|s|C1DCD5|CL,Pe,TL|crystal, colour lined green pearl
38986|s|DED27D|CL,Pe,TL|crystal, colour lined yellow pearl
38992|s|E8C3A8|CL,Pe,TL|crystal, colour lined orange pearl
38998|s|F3B0B4|CL,Pe,TL|crystal, colour lined red pearl
39000|s|7E5933|Tv|travertine on opaque lt. blue
39050|s|5E6FAB|CuL|sapphire, copper lined
39940|s|43433E|Tv|travertine on opaque blue
40010|r|3A3A38||transp. grey
41010|s|4A4948|R|transp. grey, rainbow
41123|s|AA89D1|R,SG|violet dyed crystal, rainbow
41134|s|3697DB|R,SG|blue dyed crystal, rainbow
41141|s|897C72|R,SG|grey dyed crystal, rainbow
41161|s|92C591|R,SG|green dyed crystal, rainbow
41181|s|ECB121|R,SG|yellow dyed crystal, rainbow
41184|s|F88A5B|R,SG|yellow dyed crystal, rainbow
41191|s|F35B5A|R,SG|red dyed crystal, rainbow
41192|s|AE5C91|R,SG|red dyed crystal, rainbow
42181|s|DEC387|R,SG|yellow dyed alabaster white, rainbow
43020|r|817B70||opaque grey
43141|s|99938E|R,SG|grey dyed chalkwhite, rainbow
43191|s|FB868E|R,SG|pink dyed chalkwhite, rainbow
44020|s|7C7263|R|opaque grey, rainbow
45016|s|6D6D6D|CL|transp. grey, colour lined chalkwhite
45017|s|606D7C|CL,Sx|transp. grey, colour lined chalkwhite, sfinx
45018|s|4F4F4D|CL,R|transp. grey, colour lined chalkwhite, rainbow
46010|s|6A6E6B|Sx|transp. grey, sfinx
46025|s|714D6C|Lu-lila|chalkwhite, lila lustered
46035|s|747D7F|Lu-blue|chalkwhite, blue lustered
46055|s|909E8F|Lu-green|chalkwhite, green lustered
46085|s|D4AF7B|Lu-yellow-brown|chalkwhite, yellow-brown lustered
46088|s|9D8D78|Lu-beige|chalkwhite, beige lustered
46095|s|BA6D58|Lu-rose|chalkwhite, rose lustered
46102|s|D0CDC8|Sx|chalkwhite, sfinx
46112|s|CCA280|Sx,Lu-yellow-brown,Sh|shell
46113|s|D2C1A4|Sx,Lu-whiteyellow-brown,Sh|shell
46205|s|D2CCBF|R|chalkwhite, rainbow
46316|s|B38E72|Lu-white,Pe,TD|beige pearl dyed chalkwhite, lustered
46381|s|D6D3CA|Lu-white,Pe,TD|chalkwhite pearl dyed chalkwhite, lustered
47019|s|969692|SL,Sx,R|transp. grey, silver lined, rainbow
47102|s|C6B5A6|Lu-whiteyellow-brown,Sh|shell
47112|s|D6AA6A|Sx,Lu-whiteyellow-brown,Sh|shell
47113|s|E1CE98|Lu-whiteyellow-brown,Sh|shell
47115|s|D5A775|Lu-whiteyellow-brown,Sh|shell
47185|s|DEB868|Lu-whiteyellow,Sh|shell
48013|s|EBD386|Lu-yellow|crystal, yellow lustered
48015|s|E5C084|Lu-yellow-brown|crystal, yellow-brown lustered
48018|s|C29265|Lu-orange|crystal, orange lustered
48020|s|5C595C|Sx|opaque grey, sfinx
48025|s|7E6266|Lu-lila|crystal, lila lustered
48035|s|868F92|Lu-blue|crystal, blue lustered
48042|s|B39B7B|Lu-beige|crystal, beige lustered
48049|s|6D685F|Lu-black|crystal, black lustered
48055|s|9EA7A0|Lu-green|crystal, green lustered
48095|s|9E6442|Lu-rose|crystal, rose lustered
48102|s|C1BCB4|Sx|crystal, sfinx
49010|s|4B3E3B|CuL|transp. grey, copper lined
49055|s|35372A|Lu-rose|black, rose lustered
49095|s|3D2B2A|Lu-lila|black, lila lustered
49102|s|565858|Me,Sx|hematite
50060|r|274123||transp. green
50100|r|50893C||transp. lt. green
50105|s|256952|CL|transp. lt. green, colour lined green
50120|r|253D1D||transp. green
50150|r|292E25||transp. dark green
50220|r|95AA1C||transp. lt. green
50290|r|21241D||transp. dark green
50430|r|45711A||transp. green
50620|r|405747||transp. dark green
50710|r|2A4C43||transp. teal green
51060|s|2E6C5B|R|transp. green, rainbow
51100|s|41A66A|R|transp. lt. green, rainbow
51120|s|46662D|R|transp. green, rainbow
51128|s|495E49|CL,Sx|transp. green, colour lined red, sfinx
51150|s|404C5B|R|transp. dark green, rainbow
51220|s|79AA4A|R|transp. lt. green, rainbow
51228|s|947344|CL,Sx|transp. lt. green, colour lined red, sfinx
51290|s|495457|R|transp. dark green, rainbow
51396|s|415650|CL,Sx,TL|transp. green, colour lined red, sfinx
51430|s|5C9123|R|transp. green, rainbow
51710|s|3B8288|R|transp. teal green, rainbow
52240|r|5D9E79||alabaster green
52797|r|342D26|H|harlequin green-red
53210|r|67A253||opaque green
53230|r|629C48||opaque green
53233|s|4D6D50|Lu-blue|opaque green, blue lustered
53240|r|3B725A||opaque dark green
53250|r|5EAB63||opaque green
53270|r|3E5351||opaque dark green
53310|r|91BE4A||opaque lt. green
53410|r|AFD674||opaque lt. green
53430|r|888E15||opaque green
53800|r|5C7F4C|St-4|yellow stripes on green
54210|s|54905F|R|opaque green, rainbow
54230|s|538144|R|opaque green, rainbow
54240|s|285950|R|opaque dark green, rainbow
54250|s|75A269|R|opaque green, rainbow
54270|s|2C2F34|R|opaque dark green, rainbow
54310|s|75953D|R|opaque lt. green, rainbow
54410|s|83A757|R|opaque lt. green, rainbow
54430|s|6B5D24|R|opaque green, rainbow
55066|s|28672F|CL|transp. green, colour lined chalkwhite
55106|s|4BAE5C|CL|transp. lt. green, colour lined chalkwhite
55126|s|317A2D|CL|transp. green, colour lined chalkwhite
55226|s|8BC935|CL|transp. lt. green, colour lined chalkwhite
55436|s|66BC35|CL|transp. green, colour lined chalkwhite
55437|s|78AF6F|CL,Sx|transp. green, colour lined chalkwhite, sfinx
55438|s|417A2E|CL,R|transp. green, colour lined chalkwhite, rainbow
55716|s|237E73|CL|transp. teal green, colour lined chalkwhite
56060|s|3D6B55|Sx|transp. green, sfinx
56100|s|50B180|Sx|transp. lt. green, sfinx
56120|s|50784B|Sx|transp. green, sfinx
56150|s|3E4F56|Sx|transp. dark green, sfinx
56220|s|95C65C|Sx|transp. lt. green, sfinx
56290|s|394046|Sx|transp. dark green, sfinx
56430|s|67973D|Sx|transp. green, sfinx
56620|s|80948D|Sx|transp. dark green, sfinx
56710|s|39818C|Sx|transp. teal green, sfinx
57100|s|7AC77A|SL|transp. lt. green, silver lined
57102|s|B1AEA9|Sx|alabaster white, sfinx
57120|s|5D9C4B|SL|transp. green, silver lined
57129|s|629B59|SL,Sx,R|transp. green, silver lined, rainbow
57150|s|626D63|SL|transp. dark green, silver lined
57159|s|373D3E|SL,Sx,R|transp. dark green, silver lined, rainbow
57205|s|D1D1D6|R|alabaster white, rainbow
57206|s|E3DEC6|Lu-white,R,Sh|alabaster white, rainbow, lustered
57220|s|7A9B23|SL|transp. lt. green, silver lined
57290|s|72746A|SL|transp. dark green, silver lined
57526|s|E1A1D6|CL,R|alabaster white, colour lined violet, rainbow
57534|s|9CB9C5|CL,R|alabaster white, colour lined blue, rainbow
57549|s|6A6B6F|CL,R|alabaster white, colour lined grey, rainbow
57552|s|B7D0B2|CL,R|alabaster white, colour lined green, rainbow
57573|s|F89CC4|CL,R|alabaster white, colour lined pink, rainbow
57620|s|54735D|SL|transp. dark green, silver lined
57710|s|22423E|SL|transp. teal green, silver lined
57719|s|3B625E|SL,Sx,R|transp. teal green, silver lined, rainbow
57797|s|534530|H,SL|harlequin green-red, silver lined
58135|s|B5B2B3|Ir-blue|crystal, blue iris
58141|s|8E725A|Lu-goldenbronze|golden bronze
58142|s|8A6B67|Me,Lu-bronze|crystal, bronze lustered
58205|s|9E9381|R|crystal, rainbow
58210|s|5E976D|Sx|opaque green, sfinx
58230|s|619665|Sx|opaque green, sfinx
58240|s|4D949B|Sx|opaque dark green, sfinx
58250|s|729965|Sx|opaque green, sfinx
58270|s|30404D|Sx|opaque dark green, sfinx
58310|s|80A960|Sx|opaque lt. green, sfinx
58410|s|93BB7C|Sx|opaque lt. green, sfinx
58430|s|93A259|Sx|opaque green, sfinx
58502|s|E1E1E2|CL,R|crystal, colour lined chalkwhite, rainbow
58516|s|AB8B8B|CL,R|crystal, colour lined brown, rainbow
58517|s|947378|CL,R|crystal, colour lined brown, rainbow
58518|s|7B5E5F|CL,R|crystal, colour lined brown, rainbow
58523|s|F99FED|CL,R|crystal, colour lined violet, rainbow
58525|s|DA7DD5|CL,R|crystal, colour lined violet, rainbow
58526|s|F3B7E7|CL,R|crystal, colour lined violet, rainbow
58528|s|C185DA|CL,R|crystal, colour lined violet, rainbow
58532|s|9CDFFC|CL,R|crystal, colour lined blue, rainbow
58536|s|5490DB|CL,R|crystal, colour lined blue, rainbow
58549|s|555D70|CL,R|crystal, colour lined black, rainbow
58552|s|B3E6B3|CL,R|crystal, colour lined green, rainbow
58553|s|D1EEEA|CL,R|crystal, colour lined green, rainbow
58556|s|6AB667|CL,R|crystal, colour lined green, rainbow
58558|s|58C3D3|CL,R|crystal, colour lined green, rainbow
58562|s|CFE7EA|CL,R|crystal, colour lined blue-green, rainbow
58565|s|70A6D5|CL,R|crystal, colour lined blue-green, rainbow
58573|s|F9B4E4|CL,R|crystal, colour lined pink, rainbow
58577|s|E47FD1|CL,R|crystal, colour lined pink, rainbow
58582|s|CBC393|CL,R|crystal, colour lined yellow, rainbow
58583|s|E2B041|CL,R|crystal, colour lined yellow, rainbow
58586|s|EACE49|CL,R|crystal, colour lined yellow, rainbow
58589|s|DC6F50|CL,R|crystal, colour lined orange, rainbow
58594|s|D891A3|CL,R|crystal, colour lined pink, rainbow
58598|s|A04B63|CL,R|crystal, colour lined red, rainbow
59115|s|545049|Ir-brown|brown iris
59135|s|424A54|Ir-blue|blue iris
59142|s|6C543A|Me,Lu-goldenbronze|bronze
59145|s|704C2E|Me,Lu-goldenbronze,Ir-copper|bronze copper
59148|s|8C7640|Me,Lu-goldenbronze,Ir-gold|golden bronze
59150|s|50574D|CuL|transp. dark green, copper lined
59155|s|676E6D|Ir-green|green iris
59195|s|64605F|Ir-red|red iris
59205|s|393431|R|black, rainbow
59310|s|626A3F|Tv|travertine on opaque lt. green
59430|s|51592B|CuL|transp. green, copper lined
59943|s|513E20|Tv|travertine on opaque green
60000|r|94D7EE||lt. aquamarine
60010|r|64BBEF||aquamarine
60030|r|63B5E9||aquamarine
60100|r|1F2636||dark aquamarine
60150|r|409BD4||aquamarine
60210|r|188582||green aqua
60300|r|212D92||dark aquamarine
61000|s|73D1F6|R|lt. aquamarine, rainbow
61005|s|4BB9D3|CL,Sx|lt. aquamarine, colour lined blue-green, sfinx
61006|s|BEAAD9|CL,Sx|lt. aquamarine, colour lined pink, sfinx
61010|s|60C7F4|R|aquamarine, rainbow
61015|s|42C0DE|CL,Sx|aquamarine, colour lined aqua, sfinx
61016|s|4F5BB8|CL,Sx|aquamarine, colour lined pink, sfinx
61017|s|768D8F|CL,Sx|aquamarine, colour lined brown, sfinx
61018|s|747A9C|CL,Sx|aquamarine, colour lined pink, sfinx
61030|s|5CA0E3|R|aquamarine, rainbow
61100|s|505E90|R|dark aquamarine, rainbow
61134|s|5FC4E5|Sx,SG|blue 2 dyed crystal, sfinx
61141|s|B6B1B2|Sx,SG|grey 2 dyed crystal, sfinx
61150|s|48AFF6|R|aquamarine, rainbow
61181|s|DEA725|Sx,SG|yellow 2 dyed crystal, sfinx
61191|s|D64D4E|Sx,SG|pink 2 dyed crystal, sfinx
61210|s|2A6266|R|aquamarine, rainbow
61300|s|3F3A8D|R|dark aquamarine, rainbow
61328|s|5988C4|CL,Sx,TL|aquamarine, colour lined violet, sfinx
61353|s|37C6DA|CL,Sx,TL|aquamarine, colour lined green, sfinx
62134|s|36A0D8|Sx,SG|blue 2 dyed alabaster, sfinx
62141|s|6D6A66|Sx,SG|grey 2 dyed alabaster, sfinx
62161|s|5E9B61|Sx,SG|green 2 dyed alabaster, sfinx
62181|s|C19429|Sx,SG|yellow 2 dyed alabaster, sfinx
62191|s|D3585E|Sx,SG|pink 2 dyed alabaster, sfinx
63000|r|8AC1DF||lt. turquoise
63020|r|72A9CE||turquoise
63021|s|869483|Lu-yellow-brown|turquoise, yellow-brown lustered
63022|s|61557D|Lu-lila|turquoise, lila lustered
63025|s|678987|Lu-green|turquoise, green lustered
63030|r|67A0BA||turquoise
63050|r|6BA5CC||turquoise
63080|r|577AB4||dark turquoise
63130|r|66B0A5||green turquoise
63134|s|50A1C0|Sx,SG|blue 2 dyed chalkwhite, sfinx
63161|s|A4C496|Sx,SG|green 2 dyed chalkwhite, sfinx
63181|s|E2C45F|Sx,SG|yellow 2 dyed chalkwhite, sfinx
63191|s|DB6B6B|Sx,SG|pink 2 dyed chalkwhite, sfinx
64000|s|8CCDF7|R|lt. turquoise, rainbow
64020|s|3F91C8|R|turquoise, rainbow
64030|s|46899C|R|turquoise, rainbow
64050|s|6AA3D5|R|turquoise, rainbow
64080|s|3B649D|R|dark turquoise, rainbow
64130|s|448A86|R|green turquoise, rainbow
65014|s|AED4CF|BrL|aquamarine, bronze lined
65016|s|59CFF7|CL|aquamarine, colour lined white
65106|s|253D70|CL|dark aquamarine, colour lined chalkwhite
65156|s|23A8E8|CL|aquamarine, colour lined chalkwhite
66000|s|75DCFD|Sx|lt. aquamarine, sfinx
66010|s|48C4FC|Sx|aquamarine, sfinx
66030|s|66A3E1|Sx|aquamarine, sfinx
66100|s|3E4D68|Sx|dark aquamarine, sfinx
66150|s|3187D2|Sx|aquamarine, sfinx
66209|s|B88E42|Tv|travertine on chalkwhite
66210|s|458782|Sx|green aqua, sfinx
66300|s|5D71B6|Sx|dark aquamarine, sfinx
67000|s|AFCBCE|SL|lt. aquamarine, silver lined
67019|s|499ED3|SL,Sx,R|aquamarine, silver lined, rainbow
67030|s|88D6F3|SL|aquamarine, silver lined
67100|s|677996|SL|dark aquamarine, silver lined
67150|s|4CA8CC|SL|aquamarine, silver lined
67159|s|3679AB|SL,Sx,R|aquamarine, silver lined, rainbow
67210|s|387972|SL|green aqua, silver lined
68000|s|82CAF0|Sx|lt. turquoise, sfinx
68020|s|52A4DB|Sx|turquoise, sfinx
68030|s|54A1BC|Sx|turquoise, sfinx
68050|s|72A0BA|Sx|turquoise, sfinx
68080|s|61AFEC|Sx|dark turquoise, sfinx
68105|s|C68A65|Me,CuL|crystal, copper lined
68106|s|C4A77C|Me,BrL|crystal, colour lined bronze
68108|s|CDC8BE|Me,CL|crystal, aluminium lined
68130|s|4DA193|Sx|green turquoise, sfinx
68228|s|968898|Me,CL,TL|crystal, metallic colour lined violet
68236|s|BECCD2|Me,CL,TL|crystal, metallic colour lined blue
68258|s|A1CAC2|Me,CL,TL|crystal, metallic colour lined green
68283|s|C9BAA6|Me,CL,TL|crystal, metallic colour lined gold
68284|s|E7AD5E|Me,CL,TL|crystal, metallic colour lined yellow
68286|s|DBCB70|Me,CL,TL|crystal, metallic colour lined yellow
68298|s|D6C3BE|Me,CL,TL|crystal, metallic colour lined red
68301|s|888075|FC,Arg,Me|silver
68304|s|B8883D|FC,Au,Me|crystal, genuine gold plated
68388|s|AC7E47|Me,TD|gold iris
68428|s|9486A7|Me,CL,R,TL|crystal, metallic colour lined violet, rainbow
68436|s|B0B9BF|Me,CL,R,TL|crystal, metallic colour lined blue, rainbow
68483|s|E0C5AF|Me,CL,R,TL|crystal, metallic colour lined orange, rainbow
68498|s|C47171|Me,CL,R,TL|crystal, metallic colour lined pink, rainbow
68505|s|CBB6B3|Me,CuL,R|crystal, copper lined, rainbow
68506|s|C89E7A|Me,BrL,R|crystal, colour lined bronze, rainbow
68683|s|D4BEA9|Me,CL,Sx,TL|crystal, metallic colour lined orange, sfinx
68805|s|DD8167|Me,TD|copper dyed crystal
68807|s|6D6154|Me,TD|steel dyed crystal
69000|s|A2A7A2|CuL|lt. aquamarine, copper lined
69130|s|79A076|Tv|travertine on green turquoise
69930|s|7E9569|Tv|travertine on turquoise
73420|r|F4E0E2||opaque pink
74420|s|E7D0D6|R|opaque pink, rainbow
78102|s|E4E0DB|Me,SL|crystal, silver lined
78109|s|CFC5BF|Me,SL,Sx,R|crystal, silver lined, rainbow
78111|s|B08169|SL,SG|brown 2 dyed crystal, silver lined
78112|s|9A6E5C|SL,SG|brown 2 dyed crystal, silver lined
78113|s|8F6D6D|SL,SG|brown 2 dyed crystal, silver lined
78121|s|71656D|SL,SG|violet 2 dyed crystal, silver lined
78122|s|6D5463|SL,SG|violet 2 dyed crystal, silver lined
78123|s|664664|SL,SG|violet 2 dyed crystal, silver lined
78131|s|5E668D|SL,SG|blue 2 dyed crystal, silver lined
78132|s|5C7B8C|SL,SG|blue 2 dyed crystal, silver lined
78133|s|7B979D|SL,SG|blue-green 2 dyed crystal, silver lined
78134|s|55909A|SL,SG|blue-green 2 dyed crystal, silver lined
78141|s|66605B|SL,SG|grey 2 dyed crystal, silver lined
78151|s|A2854D|SL,SG|green 2 dyed crystal, silver lined
78152|s|918960|SL,SG|green 2 dyed crystal, silver lined
78153|s|9F934C|SL,SG|green 2 dyed crystal, silver lined
78154|s|7E854E|SL,SG|green 2 dyed crystal, silver lined
78161|s|617F4E|SL,SG|green 2 dyed crystal, silver lined
78162|s|4A5F40|SL,SG|green 2 dyed crystal, silver lined
78163|s|596549|SL,SG|green 2 dyed crystal, silver lined
78164|s|567F66|SL,SG|green 2 dyed crystal, silver lined
78165|s|48847E|SL,SG|green 2 dyed crystal, silver lined
78181|s|BA9D54|SL,SG|yellow 2 dyed crystal, silver lined
78182|s|B98B49|SL,SG|yellow 2 dyed crystal, silver lined
78183|s|CA8D4D|SL,SG|orange 2 dyed crystal, silver lined
78184|s|C27B58|SL,SG|orange 2 dyed crystal, silver lined
78185|s|B8755A|SL,SG|orange 2 dyed crystal, silver lined
78191|s|A24944|SL,SG|red 2 dyed crystal, silver lined
78192|s|A84E6F|SL,SG|pink 2 dyed crystal, silver lined
78193|s|9B534C|SL,SG|red 2 dyed crystal, silver lined
78194|s|7E5445|SL,SG|pink 2 dyed crystal, silver lined
78195|s|9B6872|SL,SG|violet 2 dyed crystal, silver lined
78211|s|D0A886|SL,SG|brown 1 dyed crystal, silver lined
78212|s|C6967E|SL,SG|brown 1 dyed crystal, silver lined
78213|s|C2A4A4|SL,SG|brown 1 dyed crystal, silver lined
78221|s|BCB2C5|SL,SG|violet 1 dyed crystal, silver lined
78222|s|BEA6B4|SL,SG|violet 1 dyed crystal, silver lined
78223|s|B9A0CD|SL,SG|violet 1 dyed crystal, silver lined
78231|s|9CA8D7|SL,SG|blue 1 dyed crystal, silver lined
78232|s|99C3DF|SL,SG|blue 1 dyed crystal, silver lined
78233|s|91C2C9|SL,SG|blue-green 1 dyed crystal, silver lined
78234|s|6DCAD4|SL,SG|blue-green 1 dyed crystal, silver lined
78241|s|A39893|SL,SG|grey 1 dyed crystal, silver lined
78251|s|D1B77C|SL,SG|green 1 dyed crystal, silver lined
78252|s|B9AC87|SL,SG|green 1 dyed crystal, silver lined
78253|s|C5BC7C|SL,SG|green 1 dyed crystal, silver lined
78254|s|AEB986|SL,SG|green 1 dyed crystal, silver lined
78261|s|97B996|SL,SG|green 1 dyed crystal, silver lined
78262|s|9EB69F|SL,SG|green 1 dyed crystal, silver lined
78263|s|B6C4B2|SL,SG|green 1 dyed crystal, silver lined
78264|s|86BEB8|SL,SG|green 1 dyed crystal, silver lined
78265|s|74C1C0|SL,SG|green 1 dyed crystal, silver lined
78281|s|DBC483|SL,SG|yellow 1 dyed crystal, silver lined
78282|s|EFCD9A|SL,SG|yellow 1 dyed crystal, silver lined
78283|s|F2C089|SL,SG|orange 1 dyed crystal, silver lined
78284|s|F1B793|SL,SG|orange 1 dyed crystal, silver lined
78285|s|E0A791|SL,SG|orange 1 dyed crystal, silver lined
78291|s|F6A09B|SL,SG|red 1 dyed crystal, silver lined
78292|s|DA99B8|SL,SG|pink 1 dyed crystal, silver lined
78293|s|E4969C|SL,SG|red 1 dyed crystal, silver lined
78294|s|CA9D98|SL,SG|pink 1 dyed crystal, silver lined
78295|s|BF8D98|SL,SG|violet 1 dyed crystal, silver lined
78358|s|9AE4D0|SL,Pe,TD|green pearl dyed crystal, silver lined
78420|s|E3D5DB|Sx|opaque pink, sfinx
78611|s|A96A4D|SL,SG|brown 3 dyed crystal, silver lined
78612|s|814A34|SL,SG|brown 3 dyed crystal, silver lined
78613|s|7B544C|SL,SG|brown 3 dyed crystal, silver lined
78621|s|6F5F6D|SL,SG|violet 3 dyed crystal, silver lined
78622|s|604657|SL,SG|violet 3 dyed crystal, silver lined
78623|s|5D3062|SL,SG|violet 3 dyed crystal, silver lined
78631|s|515398|SL,SG|blue 3 dyed crystal, silver lined
78632|s|43667F|SL,SG|blue 3 dyed crystal, silver lined
78633|s|357980|SL,SG|blue 3 dyed crystal, silver lined
78634|s|43C0E9|SL,SG|blue 3 dyed crystal, silver lined
78641|s|4A473D|SL,SG|grey 3 dyed crystal, silver lined
78651|s|927439|SL,SG|green 3 dyed crystal, silver lined
78652|s|7B753B|SL,SG|green 3 dyed crystal, silver lined
78653|s|9A9A39|SL,SG|green 3 dyed crystal, silver lined
78654|s|788738|SL,SG|green 3 dyed crystal, silver lined
78661|s|4E7F41|SL,SG|green 3 dyed crystal, silver lined
78662|s|506948|SL,SG|green 3 dyed crystal, silver lined
78663|s|47593D|SL,SG|green 3 dyed crystal, silver lined
78664|s|408264|SL,SG|green 3 dyed crystal, silver lined
78665|s|459491|SL,SG|green 3 dyed crystal, silver lined
78681|s|C4992A|SL,SG|yellow 3 dyed crystal, silver lined
78682|s|D18446|SL,SG|yellow 3 dyed crystal, silver lined
78683|s|E1803B|SL,SG|orange 3 dyed crystal, silver lined
78684|s|D7662E|SL,SG|orange 3 dyed crystal, silver lined
78685|s|AF5530|SL,SG|orange 3 dyed crystal, silver lined
78691|s|D0423C|SL,SG|pink 3 dyed crystal, silver lined
78692|s|BD4479|SL,SG|pink 3 dyed crystal, silver lined
78693|s|A33B3C|SL,SG|pink 3 dyed crystal, silver lined
78694|s|7F443D|SL,SG|pink 3 dyed crystal, silver lined
78695|s|7B4358|SL,SG|violet 3 dyed crystal, silver lined
80010|r|DCAD0A||transp. yellow amber
80060|r|CE7F0C||hyacinth
80358|s|359596|CL,SG,TL|blue dyed crystal, colour lined green
80383|s|C5BAA3|CL,SG,TL|blue dyed crystal, colour lined yellow
80489|s|874D42|CL,SG,TL|grey dyed crystal, colour lined orange
80628|s|7D5572|CL,SG,TL|green dyed crystal, colour lined violet
80658|s|76D1B1|CL,SG,TL|green dyed crystal, colour lined green
80698|s|C7B6B4|CL,SG,TL|green dyed crystal, colour lined red
80836|s|9EB59D|CL,SG,TL|yellow dyed crystal, colour lined blue
80883|s|DAA127|CL,SG,TL|yellow dyed crystal, colour lined yellow
80898|s|F59271|CL,SG,TL|yellow dyed crystal, colour lined red
80936|s|74719E|CL,SG,TL|red dyed crystal, colour lined blue
80998|s|F99FA9|CL,SG,TL|red dyed crystal, colour lined red
81010|s|F1CF1F|R|transp. yellow amber, rainbow
81012|s|69A124|CL,Sx|transp. yellow amber, colour lined blue, sfinx
81014|s|69895B|CL,Sx|transp. yellow amber, colour lined blue, sfinx
81016|s|DC6C29|CL,Sx|transp. yellow amber, colour lined pink, sfinx
81036|s|697E20|CL,TL|transp. yellow amber, colour lined blue
81060|s|F19812|R|hyacinth, rainbow
81358|s|5D9637|CL,Sx,TL|transp. yellow amber, colour lined green, sfinx
81391|s|EC7531|CL,Sx,TL|transp. yellow amber, colour lined pink, sfinx
81393|s|F28437|CL,Sx,TL|transp. yellow amber, colour lined red, sfinx
81733|r|565E3C|H|harlequin sapphire-yellow
81761|r|736D3D|H|harlequin aquamarine-yellow
81797|r|CA3627|H|harlequin red-yellow
83110|r|EFD60A||opaque yellow "limon"
83111|s|DDAC23|Lu-yellow-brown|opaque yellow "limon", yellow-brown luster
83112|s|65442B|Lu-lila|opaque yellow "limon", lila luster
83113|s|6A7229|Lu-blue|opaque yellow "limon", blue luster
83119|s|9A6424|Lu-rose|opaque yellow "limon", rose luster
83130|r|F9D106||opaque yellow "limon"
83730|r|656355|H|harlequin yellow-blue
84110|s|E7CB23|R|opaque yellow "limon", rainbow
84130|s|EDA708|R|opaque yellow "limon", rainbow
85016|s|F2C60F|CL|transp. yellow amber, colour lined chalkwhite
85066|s|F4900A|CL|hyacinth, colour lined chalkwhite
85067|s|F5A841|CL,Sx|hyacinth, colour lined chalkwhite, sfinx
86010|s|CEA725|Sx|transp. yellow amber, sfinx
86060|s|F7B531|Sx|hyacinth, sfinx
87010|s|F6E140|SL|transp. yellow amber, silver lined
87019|s|D0B11D|SL,Sx,R|transp. yellow amber, silver lined, rainbow
87060|s|F0BD35|SL|hyacinth, silver lined
87069|s|EEA837|SL,Sx,R|hyacinth, silver lined, rainbow
87733|s|535431|H,SL|harlequin sapphire-yellow, silver lined
87761|s|736C3C|H,SL|harlequin aquamarine-yellow, silver lined
87797|s|BB4A2F|H,SL|harlequin red-yellow, silver lined
88110|s|ECCC18|Sx|opaque yellow "limon", sfinx
88130|s|FBD81D|Sx|opaque yellow "limon", sfinx
89010|s|825011|CuL|transp. yellow amber, copper lined
89110|s|604F34|Tv|travertine on opaque yellow "limon"
90000|r|E66C11||hyacinth
90030|r|EE412A||hyacinth
90050|r|D2311E||transp. lt.red
90070|r|AB191B||transp. red
90090|r|881517||ruby
90120|r|3D1313||garnet
91000|s|EA7D36|R|hyacinth, rainbow
91004|s|644F48|CL,Sx|hyacinth, colour lined blue, sfinx
91028|s|862014|CL,TL|hyacinth, colour lined violet
91030|s|EC4E35|R|hyacinth, rainbow
91050|s|F14C35|R|transp. lt. red, rainbow
91070|s|F04B54|R|transp. red, rainbow
91090|s|B23648|R|ruby, rainbow
91120|s|8C2538|R|garnet, rainbow
93110|r|F29F08||opaque orange
93140|r|F7651F||opaque orange
93141|s|E2553E|Lu-yellow-brown|opaque orange, yellow-brown luster
93170|r|D6342A||opaque red coral
93190|r|B71F27||opaque red coral
93192|s|5B322D|Lu-lila|opaque red coral, lila luster
93195|s|684842|Lu-green|opaque red coral, green luster
93199|s|90492A|Lu-rose|opaque red coral, rose luster
93210|r|821C1B||opaque red coral
93300|r|5D2728||opaque red coral
93310|r|4D2828||opaque red coral
93870|s|A4332F|SG|red dyed coral
94110|s|E56A09|R|opaque orange, rainbow
94140|s|F0652D|R|opaque orange, rainbow
94170|s|C52C29|R|opaque red coral, rainbow
94190|s|D34952|R|opaque red coral, rainbow
94210|s|902429|R|opaque red coral, rainbow
94300|s|532624|R|opaque red coral, rainbow
94310|s|622229|R|opaque red coral, rainbow
95004|s|D94F0D|BrL|hyacinth, colour lined bronze
95006|s|F96609|CL|hyacinth, colour lined chalkwhite
95036|s|FC5D11|CL|hyacinth, colour lined chalkwhite
95056|s|FC4216|CL|transp. lt. red, colour lined chalkwhite
95074|s|9A211A|BrL|transp. red, bronze lined
95076|s|EE2B27|CL|transp. red, colour lined chalkwhite
96000|s|F18142|Sx|hyacinth, sfinx
96030|s|FB6E2E|Sx|hyacinth, sfinx
96050|s|F76752|Sx|transp. lt. red, sfinx
96070|s|B03E50|Sx|transp. red, sfinx
96090|s|BB484F|Sx|ruby, sfinx
96120|s|7F3445|Sx|garnet, sfinx
97000|s|F6AF4D|SL|hyacinth, silver lined
97009|s|ED814B|SL,Sx,R|hyacinth, silver lined, rainbow
97050|s|ED7A5F|SL|transp. lt. red, silver lined
97070|s|95201F|SL|transp. red, silver lined
97079|s|CB6C6C|SL,Sx,R|transp. red, silver lined, rainbow
97090|s|D08483|SL|ruby, silver lined
97120|s|8C6663|SL|garnet, silver lined
97512|s|9F8882|CuL,R,SG|pink dyed crystal, copper lined, rainbow
97522|s|5D4140|CuL,R,SG|pink dyed crystal, copper lined, rainbow
98110|s|FDA033|Sx|opaque orange, sfinx
98140|s|E97D4D|Sx|opaque orange, sfinx
98170|s|E83D43|Sx|opaque red coral, sfinx
98190|s|AD4755|Sx|opaque red coral, sfinx
98210|s|A13646|Sx|opaque red coral, sfinx
98300|s|5B3840|Sx|opaque red coral, sfinx
98310|s|76303E|Sx|opaque red coral, sfinx
99110|s|4D2E1B|Tv|travertine on opaque orange
99190|s|472B22|Tv|travertine on opaque red coral
B2805|s|989BE7|Sx,SG|violet dyed chalkwhite, sfinx`;function A(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function j(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function M(e,t){let n=(e^Math.imul(t,2654435761))>>>0;return n=Math.imul(n^n>>>16,2246822507),n=Math.imul(n^n>>>13,3266489909),(n^n>>>16)>>>0}function N(e,t){return M(e>>>0,j(t))}function P(e,t,n){return t+Math.floor(e()*(n-t+1))}function F(e,t){return t[Math.floor(e()*t.length)]}function I(e,t){let n=t.reduce((e,[,t])=>e+t,0),r=e()*n;for(let[e,n]of t)if(r-=n,r<0)return e;return t[t.length-1][0]}function L(e,t){return e()<t}function R(e,t){let n=[...t];for(let t=n.length-1;t>0;t--){let r=Math.floor(e()*(t+1));[n[t],n[r]]=[n[r],n[t]]}return n}function ce(){return typeof crypto<`u`&&crypto.getRandomValues?crypto.getRandomValues(new Uint32Array(1))[0]%1e9:Math.floor(Math.random()*1e9)}var le=e=>Math.min(1,Math.max(0,e));function ue(e){let t=e.replace(`#`,``);return[0,2,4].map(e=>parseInt(t.slice(e,e+2),16)/255)}function de([e,t,n]){return(`#`+[e,t,n].map(e=>Math.round(le(e)*255).toString(16).padStart(2,`0`)).join(``)).toUpperCase()}var fe=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,pe=e=>e<=.0031308?12.92*e:1.055*e**(1/2.4)-.055;function me([e,t,n]){let r=fe(e),i=fe(t),a=fe(n),o=Math.cbrt(.4122214708*r+.5363325363*i+.0514459929*a),s=Math.cbrt(.2119034982*r+.6806995451*i+.1073969566*a),c=Math.cbrt(.0883024619*r+.2817188376*i+.6299787005*a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]}function he([e,t,n]){let r=(e+.3963377774*t+.2158037573*n)**3,i=(e-.1055613458*t-.0638541728*n)**3,a=(e-.0894841775*t-1.291485548*n)**3;return[4.0767416621*r-3.3077115913*i+.2309699292*a,-1.2684380046*r+2.6097574011*i-.3413193965*a,-.0041960863*r-.7034186147*i+1.707614701*a]}function ge(e){return he(e).map(e=>le(pe(e)))}var z=e=>me(ue(e));function _e([e,t,n]){let r=n*Math.PI/180;return[e,t*Math.cos(r),t*Math.sin(r)]}function ve(e){return he(e).every(e=>e>=-1e-4&&e<=1.0001)}function ye([e,t,n]){let r=t;for(;r>0&&!ve(_e([e,r,n]));)r-=.005;return de(ge(_e([e,Math.max(0,r),n])))}function be(e,t){let n=z(e),r=z(t);return Math.hypot(n[0]-r[0],n[1]-r[1],n[2]-r[2])}var B=[{id:`black-bordo-gold`,name:`Чорний / бордо / золото`,colors:[`#141414`,`#7A1428`,`#C9A232`,`#F2EEE4`]},{id:`white-red-black`,name:`Білий / червоний / чорний`,colors:[`#F4F1EA`,`#C0182A`,`#161616`,`#E0A526`]},{id:`black-red-white`,name:`Чорний / червоний / білий`,colors:[`#141414`,`#C21B2C`,`#F4F1EA`,`#2E7D4F`]},{id:`blue-yellow`,name:`Синій / жовтий`,colors:[`#F4F1EA`,`#1F4FA8`,`#F2C12E`,`#10245A`]},{id:`navy-yellow-white`,name:`Темно-синій / жовтий / білий`,colors:[`#13234F`,`#F2C12E`,`#F4F1EA`,`#3F7BD6`]},{id:`hutsul`,name:`Гуцульський (червоний / зелений / жовтий)`,colors:[`#F4F1EA`,`#B3162B`,`#2F7A45`,`#E8B321`,`#161616`]},{id:`turquoise-coral`,name:`Бірюза / корал / білий`,colors:[`#F4F1EA`,`#2A9D9A`,`#E0674B`,`#1E3B4F`]},{id:`green-white-red`,name:`Зелений / білий / червоний`,colors:[`#1F5E3A`,`#F4F1EA`,`#C0182A`,`#E3B230`]}];function xe(e,t,n){let r=e()<.5,i=e()*360,a=r?[.2+e()*.06,.02+e()*.03,i]:[.95+e()*.02,.01+e()*.02,i+40],o=[];for(let e=0;e<n-1;e++)t===`analog`?o.push(i+(e-(n-2)/2)*30):o.push(i+e%2*180+Math.floor(e/2)*25);let s=[ye(a)];for(let t=0;t<o.length;t++){let n=r?.62+t*.13%.3:.42+t*.13%.3,i=ye([n,.13+e()*.05,(o[t]+360)%360]);for(let e=0;e<12&&s.some(e=>be(e,i)<.12);e++)n+=r?.04:-.04,n=Math.min(.92,Math.max(.25,n)),i=ye([n,.15,(o[t]+17*e+360)%360]);s.push(i)}return{id:`harmony-${t}`,name:t===`analog`?`Гармонія: аналогові`:`Гармонія: комплементарні`,colors:s}}function Se(e,t){return t===`harmony-analog`?xe(e,`analog`,P(e,3,5)):t===`harmony-complementary`?xe(e,`complementary`,P(e,3,5)):B.find(e=>e.id===t)||F(e,B)}var Ce=null;function we(){return Ce||=se.split(`
`).map(e=>{let[t,n,r,i,a]=e.split(`|`);return{code:t,article:n===`r`?`311-19001`:`331-19001`,hex:`#${r}`,finish:i,en:a,lab:z(`#${r}`)}}),Ce}function Te(e){let t=z(e),n=we()[0],r=1/0;for(let e of we()){let i=Math.hypot(e.lab[0]-t[0],e.lab[1]-t[1],e.lab[2]-t[2]);i<r&&(r=i,n=e)}return{...n,dE:r}}var Ee=e=>(Math.round(e*1e3)/1e3).toFixed(3);function De(e,t=Date.now()){let n=e.layout.s,r=e.spec.k+2,i=e.spec.ladder!==null,a=e.layout.cols,o=0;for(let t of e.beads)t.kind===`mesh`&&t.piece===0&&(o=Math.max(o,t.y));let s=i?e.layout.rows[0]:Math.ceil(o/(2*n)),c=e.spec.colors.map(e=>`p:${Te(e).code}`),l={},u=0;for(let t of e.beads){if(t.kind!==`mesh`||t.piece!==0){u++;continue}let e=t.x/n-1,r=t.y/n;if(e<-1e-9||r<-1e-9||e>2*a+1e-9||r>2*s+1e-9){u++;continue}l[`${Ee(e)},${Ee(r)}`]=c[t.color]}let d=2*e.spec.band.perRapport;return{skipped:u,file:{app:`sylianka`,format:2,project:{name:e.spec.name.slice(0,80),rows:s,cols:a,side:r,palette:[...new Set(c)],fills:{[String(r)]:l},woven:{[String(r)]:[]},gaps:{unit:2520,x:[],y:[]},repeat:d,shape:{},createdAt:t,updatedAt:t},colors:[]}}}function Oe(e,t){return JSON.stringify({app:`sylianka-generator`,version:1,seed:t.seed,params:t.params,layerSeeds:t.seeds,spec:e.spec,colors:e.spec.colors.map((e,t)=>{let n=Te(e);return{index:t,hex:e,preciosa:n.code,article:n.article}}),beads:e.beads.map(e=>({id:e.id,kind:e.kind,layer:e.layer,x:Number.isFinite(e.x)?e.x:null,y:Number.isFinite(e.y)?e.y:null,px:Math.round(e.px*1e3)/1e3,py:Math.round(e.py*1e3)/1e3,color:e.color})),threads:e.threads},null,1)}function ke(e,t=8,n=!0){let r=e.beads.reduce((e,t)=>Math.min(e,t.px-t.size/2),0),i=(e.layout.width+4)*t,a=(e.layout.height+4)*t,o=e=>Math.round((e-r+2)*t*100)/100,s=e=>Math.round((e+2)*t*100)/100,c=[`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(i)}" height="${Math.ceil(a)}" viewBox="0 0 ${Math.ceil(i)} ${Math.ceil(a)}">`,`<rect width="100%" height="100%" fill="#F7F4EE"/>`];if(n){c.push(`<g stroke="#9A948A" stroke-width="${(t*.08).toFixed(2)}" fill="none">`);for(let[t,n]of e.threads){let r=e.beads[t],i=e.beads[n];c.push(`<line x1="${o(r.px)}" y1="${s(r.py)}" x2="${o(i.px)}" y2="${s(i.py)}"/>`)}c.push(`</g>`)}for(let n of e.beads){let r=e.spec.colors[n.color],i=n.size/2*t,a=o(n.px),l=s(n.py);if(n.kind===`drop`){let e=l-i*1.3;c.push(`<path d="M${a} ${e.toFixed(2)} C ${(a+i).toFixed(2)} ${(l-i*.2).toFixed(2)}, ${(a+i).toFixed(2)} ${(l+i).toFixed(2)}, ${a} ${(l+i).toFixed(2)} C ${(a-i).toFixed(2)} ${(l+i).toFixed(2)}, ${(a-i).toFixed(2)} ${(l-i*.2).toFixed(2)}, ${a} ${e.toFixed(2)} Z" fill="${r}" stroke="#00000055"/>`)}else n.kind===`bicone`?c.push(`<path d="M${a} ${(l-i).toFixed(2)} L${(a+i*.8).toFixed(2)} ${l} L${a} ${(l+i).toFixed(2)} L${(a-i*.8).toFixed(2)} ${l} Z" fill="${r}" stroke="#00000055"/>`):c.push(`<circle cx="${a}" cy="${l}" r="${i.toFixed(2)}" fill="${r}" stroke="#00000040" stroke-width="${(t*.06).toFixed(2)}"/>`)}return c.push(`</svg>`),c.join(`
`)}var Ae={choker:`Чокер`,collar:`Комірець з підвісками`,bracelet:`Браслет`,gerdan:`Гердан`},V={colors:[2,5],background:[.4,.7],bandRows:[1,3],ladderLength:[3,8],complexity:[1,5]},H={type:`collar`,k:2,rapports:0,palette:`auto`,symmetry:`auto`,complexity:3},U=[`palette`,`band`,`ladder`,`bottom`,`pendants`],je={palette:`Палітра`,band:`Смуга мотивів`,ladder:`Драбинка`,bottom:`Нижня сітка`,pendants:`Підвіски`};function Me(e,t){let n=Array.from({length:e},()=>[]);for(let[e,r]of t)n[e].push(r),n[r].push(e);let r=new Int32Array(e).fill(-1),i=0;for(let t=0;t<e;t++){if(r[t]!==-1)continue;let e=[t];for(r[t]=i;e.length;){let t=e.pop();for(let a of n[t])r[a]===-1&&(r[a]=i,e.push(a))}i++}return{count:i,comp:r}}function Ne(e,t){let n=new Int32Array(e);for(let[e,r]of t)n[e]++,n[r]++;return n}function Pe(e){let t=[],n=e.beads.length,{count:r}=Me(n,e.threads),i=Ne(n,e.threads).reduce((e,t)=>e+ +(t===0),0);r!==1&&t.push(`граф розпадається на ${r} частин`),i>0&&t.push(`${i} бісерин без нитки`);let a=e.layout.s,o=e.beads.every(e=>e.kind!==`mesh`||p(e.x,e.y,a));o||t.push(`бісерина сітки поза лініями ґратки`);let s=e.beads.filter(e=>e.kind!==`drop`&&e.kind!==`bicone`),c=s.filter(e=>e.color===0).length/s.length,l=new Set(e.beads.map(e=>e.color)).size;(c<V.background[0]||c>V.background[1])&&t.push(`фон ${(c*100).toFixed(0)} % (потрібно 40–70 %)`),(l<V.colors[0]||l>V.colors[1])&&t.push(`${l} кольорів (потрібно 2–5)`);let u=1/0,d=e.spec.colors,f=new Set;for(let[t,n]of e.threads){let r=e.beads[t].color,i=e.beads[n].color;if(r===i)continue;let a=r<i?`${r}-${i}`:`${i}-${r}`;f.has(a)||(f.add(a),u=Math.min(u,be(d[r],d[i])))}u<.1&&t.push(`сусідні кольори надто схожі (ΔE ${u.toFixed(3)})`);let m=e.pendants.every(e=>e.shape===`between`||e.anchors.length>0);return m||t.push(`підвіска не кріпиться до сітки`),{ok:t.length===0,components:r,isolated:i,onLattice:o,bgFraction:c,colorsUsed:l,minAdjacentContrast:Number.isFinite(u)?u:1,pendantsAttached:m,problems:t}}function Fe(e){let t={};for(let n of U)t[n]=e.frozen[n]??N(e.seed,n);return t}var W=(e,t,n)=>Math.max(t,Math.min(n,Math.round(e)));function Ie(e,t){let n=Se(e,t.palette===`auto`?I(e,[...B.map(e=>[e.id,1]),[`harmony-analog`,1.5],[`harmony-complementary`,1.5]]):t.palette),r=W(2+Math.floor(t.complexity/2)+(e()<.5?0:1),2,5);return{...n,colors:n.colors.slice(0,Math.min(r,n.colors.length))}}var Le=[`contour`,`contourCross`,`rings`,`nodeDots`,`roof`,`chevron`,`squareCenter`,`flower`],Re=[`dot`,`nodeDots`,`contour`];function ze(e,t,n,r){let i=x[t].roles,a=[];for(let e=0;e<i;e++)a.push(n[(r+e)%n.length]);return i>1&&n.length>1&&a[0]===a[1]&&(a[1]=n[(r+1)%n.length]),e()<.15&&i>1&&a.reverse(),a}function Be(t,n,r){let i=W(n.complexity,1,5),s=P(t,1,n.type===`gerdan`?1:n.type===`bracelet`?2:i>=4?3:i>=3?2:1),c=n.symmetry===`auto`?I(t,e.map(e=>[e,e===`p1`?.6:1])):n.symmetry,l=W([1,2,2+(t()<.5?0:1),3+(t()<.5?0:1),4][i-1],1,4);(c===`p1m1`||c===`p2mm`||c===`p2`)&&(l=Math.max(l,2)),a(c)&&l%2==1&&l++;let u=R(t,Array.from({length:r-1},(e,t)=>t+1)),d=Le.filter(e=>x[e].symmetry===`D4`||!o(c)||t()<.35),f=R(t,d).slice(0,Math.min(d.length,Math.max(1,Math.ceil(i/1.5)))),p=[];for(let e=0;e<s;e++){let n=[];for(let r=0;r<l;r++){let i=f[(r+e)%f.length];n.push({motif:i,colors:ze(t,i,u,r+e)})}p.push(n)}let m=[];for(let e=0;e<s-1;e++){let n=t()<.7,r=F(t,Re),i=u[(e+1)%u.length];m.push(Array.from({length:l},()=>n?{motif:r,colors:[i]}:null))}let h={choker:[10,14],collar:[10,14],bracelet:[4,6],gerdan:[16,22]}[n.type],g=n.rapports>0?n.rapports:Math.max(1,Math.round(P(t,h[0],h[1])/l));return{band:{rows:s,group:c,perRapport:l,main:p,fillers:m},rapports:g}}function Ve(e,t,n){let r={choker:.5,collar:.7,bracelet:0,gerdan:.3}[t.type];if(!L(e,r))return null;let i=P(e,3,8),a=L(e,.6)&&n>1;return{length:i,color:0,accentIndex:a?P(e,1,i):null,accentColor:a?P(e,1,n-1):0}}function He(e,t,n,r){let i=n!==null||t.type===`collar`||t.type===`gerdan`,a=0;a=t.type===`bracelet`?1:i?P(e,1,2):+!!L(e,.4);let o=t.type===`collar`&&L(e,.6)&&r>1?P(e,1,r-1):null;return{rows:a,betweenColor:o}}function Ue(e,t,n,r){if(t.type!==`collar`&&t.type!==`gerdan`)return null;let i=R(e,Array.from({length:r-1},(e,t)=>t+1)),a=i[0],o=i[1%i.length],s=L(e,.85)?{beadColor:o,kind:L(e,.6)?`drop`:`bicone`,color:a,sizeMm:F(e,[4,4,6])}:null,c=L(e,.6)?{beads:P(e,2,4),color:L(e,.5)?0:o}:null;if(t.type===`gerdan`)return{shape:`rhomb`,size:4,every:1,centerOnly:!0,railColor:a,pairColor:o,rhombContour:a,inner:F(e,[`cross`,`rings`,`dots`]),innerColor:o,picot:c,tip:s??{beadColor:o,kind:`drop`,color:a,sizeMm:6}};let l=I(e,[[`roof`,.45],[`rhomb`,.35],[`triangle`,.2]]),u=n>=2?n:2,d=4*u/2,f;return f=l===`roof`?W(P(e,2,3),1,d-1):l===`rhomb`?W(F(e,[1,2,2]),1,d):W(F(e,[1,3]),1,d%2==0?d-1:d),{shape:l,size:f,every:u,centerOnly:!1,railColor:a,pairColor:o,rhombContour:a,inner:F(e,[`cross`,`cross`,`dots`,`none`]),innerColor:o,picot:c,tip:s}}function We(e,t){let n=Ie(A(t.palette),e),r=n.colors.length,{band:i,rapports:a}=Be(A(t.band),e,r),o=Ve(A(t.ladder),e,r),s=He(A(t.bottom),e,o,r),c=Ue(A(t.pendants),e,i.perRapport,r);return{version:1,name:`${Ae[e.type]} — ${n.name}`,type:e.type,k:W(e.k,1,4),rapports:a,colors:n.colors,paletteName:n.name,band:i,ladder:o,bottom:s,pendants:c}}function Ge(e,t){let n=Fe(t),r=null;for(let i=0;i<24;i++){let a={...n};if(i>0)for(let e of U)t.frozen[e]===void 0&&(a[e]=M(n[e],i));let o=ie(We(e,a)),s=Pe(o),c={design:o,report:s,seeds:a,attempts:i+1};if(s.ok)return c;(!r||s.problems.length<r.report.problems.length)&&(r=c)}return r}function Ke(e,t=12){return Array.from({length:t},(t,n)=>n===0?e:M(e,n+1)%1e9)}var qe={version:1,name:`Референс: чорний / бордо / золото`,type:`collar`,k:2,rapports:8,colors:[`#141414`,`#7A1428`,`#C9A232`],paletteName:`Чорний / бордо / золото`,band:{rows:1,group:`p1m1`,perRapport:2,main:[[{motif:`flower`,colors:[2,1]},{motif:`squareCenter`,colors:[1,2]}]],fillers:[]},ladder:{length:4,color:0,accentIndex:2,accentColor:2},bottom:{rows:1,betweenColor:1},pendants:{shape:`roof`,size:3,every:4,centerOnly:!1,railColor:1,pairColor:2,rhombContour:1,inner:`cross`,innerColor:2,picot:{beads:3,color:0},tip:{beadColor:2,kind:`drop`,color:1,sizeMm:4}}},Je=`#F7F4EE`,G=1.5;function Ye(e){return z(e)[0]>.6?`rgba(0,0,0,0.35)`:`rgba(0,0,0,0.55)`}function Xe(e,t,n,r,i,a,o){let s=i/2*o;e.fillStyle=a,e.strokeStyle=Ye(a),e.lineWidth=Math.max(.6,o*.06),e.beginPath(),t===`drop`?(e.moveTo(n,r-s*1.3),e.bezierCurveTo(n+s,r-s*.2,n+s,r+s,n,r+s),e.bezierCurveTo(n-s,r+s,n-s,r-s*.2,n,r-s*1.3)):t===`bicone`?(e.moveTo(n,r-s),e.lineTo(n+s*.8,r),e.lineTo(n,r+s),e.lineTo(n-s*.8,r),e.closePath()):e.arc(n,r,s,0,Math.PI*2),e.fill(),e.stroke(),s>=3&&(e.fillStyle=`rgba(255,255,255,0.28)`,e.beginPath(),e.ellipse(n-s*.3,r-s*.35,s*.32,s*.22,-.6,0,Math.PI*2),e.fill())}function Ze(e,t){let n=t.view??{x0:K(e),y0:0,x1:K(e)+e.layout.width,y1:e.layout.height};return{w:Math.ceil((n.x1-n.x0+2*G)*t.scale),h:Math.ceil((n.y1-n.y0+2*G)*t.scale)}}var K=e=>e.beads.reduce((e,t)=>Math.min(e,t.px-t.size/2),0);function q(e,t,n){let r=typeof window<`u`?Math.min(2,window.devicePixelRatio||1):1,{w:i,h:a}=Ze(t,n);e.width=Math.ceil(i*r),e.height=Math.ceil(a*r),e.style.width=`${i}px`,e.style.height=`${a}px`;let o=e.getContext(`2d`);o.setTransform(r,0,0,r,0,0),o.fillStyle=n.paper??`#F7F4EE`,o.fillRect(0,0,i,a);let s=n.view??{x0:K(t),y0:0,x1:K(t)+t.layout.width,y1:t.layout.height},c=e=>(e-s.x0+G)*n.scale,l=e=>(e-s.y0+G)*n.scale,u=(e,t)=>e>=s.x0-2&&e<=s.x1+2&&t>=s.y0-2&&t<=s.y1+2;if(n.rapport){let{X0:e,P:r,s:i}=t.layout;o.fillStyle=`rgba(210, 160, 40, 0.10)`;let a=Math.floor(t.spec.rapports/2),s=e-2*i+a*r;o.fillRect(c(s),l(t.layout.bandTop-.5),r*n.scale,(t.layout.bandBottom-t.layout.bandTop+1)*n.scale)}if(n.threads!==!1){o.strokeStyle=`rgba(120,112,100,0.55)`,o.lineWidth=Math.max(.5,n.scale*.08),o.beginPath();for(let[e,n]of t.threads){let r=t.beads[e],i=t.beads[n];(u(r.px,r.py)||u(i.px,i.py))&&(o.moveTo(c(r.px),l(r.py)),o.lineTo(c(i.px),l(i.py)))}o.stroke()}for(let e of t.beads)u(e.px,e.py)&&Xe(o,e.kind,c(e.px),l(e.py),e.size,t.spec.colors[e.color],n.scale)}function Qe(e,t,n,r,i){let a=r,o=(4*a+2*G)*i,s=typeof window<`u`?Math.min(2,window.devicePixelRatio||1):1;e.width=Math.ceil(o*s),e.height=Math.ceil(o*s),e.style.width=`${Math.ceil(o)}px`,e.style.height=`${Math.ceil(o)}px`;let c=e.getContext(`2d`);c.setTransform(s,0,0,s,0,0),c.fillStyle=Je,c.fillRect(0,0,o,o);let l=x[t.motif];for(let e=-a;e<=a;e++)for(let o=-a;o<=a;o++){let[s,u]=d(e,o);if(!p(s,u,r))continue;let f=l.fn(e,o,r,a),m=f===null||f<0?0:t.colors[f]??0;Xe(c,`mesh`,(s+2*a+G)*i,(u+2*a+G)*i,C,n[m],i)}}function $e(e,t){return e<=0?0:Math.ceil(e*(1+t/100)/90*10-1e-9)/10}function et(e){let{X0:t,P:n,s:r}=e.layout,i=Math.floor(e.spec.rapports/2),a=t-2*r+i*n;return[a,a+n]}function tt(e,t=10){let n=e.spec.colors,r=new Map,i=new Map,[a,o]=et(e),s=new Map,c=0,l=0;for(let t of e.beads){if(t.kind===`drop`||t.kind===`bicone`){let r=e.spec.pendants?.tip?.sizeMm??4,i=`${t.kind}-${t.color}`,a=s.get(i)??{index:t.color,hex:n[t.color],kind:t.kind,sizeMm:r,count:0};a.count++,s.set(i,a);continue}c++,r.set(t.color,(r.get(t.color)??0)+1),t.px>=a&&t.px<o&&(l++,i.set(t.color,(i.get(t.color)??0)+1))}return{rows:[...r.keys()].sort((e,t)=>e-t).map(e=>{let a=Te(n[e]),o=r.get(e)??0;return{index:e,hex:n[e],code:a.code,article:a.article,en:a.en,dE:a.dE,perRapport:i.get(e)??0,total:o,grams:$e(o,t)}}),totalBeads:c,perRapportBeads:l,drops:[...s.values()],lengthCm:e.layout.width*w/10,heightCm:e.layout.height*w/10}}var J=e=>{let t=document.getElementById(e);if(!t)throw Error(`Немає #${e}`);return t},Y={params:{...H},master:0,items:[],selected:-1,current:null,frozen:new Set,galleryFrozen:{}};function nt(e,t,n){e.innerHTML=``;for(let[n,r]of t){let t=document.createElement(`option`);t.value=n,t.textContent=r,e.append(t)}e.value=n}function rt(){nt(J(`p-type`),Object.entries(Ae),Y.params.type),nt(J(`p-palette`),[[`auto`,`Авто`],...B.map(e=>[e.id,e.name]),[`harmony-analog`,`Гармонія OKLCH: аналогові`],[`harmony-complementary`,`Гармонія OKLCH: комплементарні`]],Y.params.palette),nt(J(`p-symmetry`),[[`auto`,`Авто`],...e.map(e=>[e,t[e]])],Y.params.symmetry),J(`p-k`).value=String(Y.params.k),J(`p-rapports`).value=String(Y.params.rapports),J(`p-complexity`).value=String(Y.params.complexity),J(`p-complexity-out`).textContent=String(Y.params.complexity);let n=J(`p-freeze`);n.innerHTML=``;for(let e of U){let t=document.createElement(`label`),r=document.createElement(`input`);r.type=`checkbox`,r.checked=Y.frozen.has(e),r.addEventListener(`change`,()=>{r.checked?Y.frozen.add(e):Y.frozen.delete(e)}),t.append(r,` ${je[e]}`),n.append(t)}}function it(){return{type:J(`p-type`).value,k:Number(J(`p-k`).value),rapports:Math.max(0,Math.min(30,Math.round(Number(J(`p-rapports`).value)||0))),palette:J(`p-palette`).value,symmetry:J(`p-symmetry`).value,complexity:Number(J(`p-complexity`).value)}}function at(){let e={},t=Y.current?.seeds;if(!t)return e;for(let n of Y.frozen)e[n]=t[n];return e}function ot(e,t,n){let r=new URLSearchParams({seed:String(e),type:t.type,k:String(t.k),r:String(t.rapports),pal:t.palette,sym:t.symmetry,c:String(t.complexity)}),i=Object.entries(n).map(([e,t])=>`${e}:${t}`).join(`,`);return i&&r.set(`fz`,i),`#${r.toString()}`}function st(){let t=location.hash.slice(1);if(t===`ref`)return`ref`;let n=new URLSearchParams(t),r=Number(n.get(`seed`));if(!n.has(`seed`)||!Number.isFinite(r))return null;let i=n.get(`type`),a={type:i in Ae?i:H.type,k:Math.min(4,Math.max(1,Number(n.get(`k`))||H.k)),rapports:Math.min(30,Math.max(0,Number(n.get(`r`))||0)),palette:n.get(`pal`)||`auto`,symmetry:e.includes(n.get(`sym`)??``)?n.get(`sym`):`auto`,complexity:Math.min(5,Math.max(1,Number(n.get(`c`))||H.complexity))},o={};for(let e of(n.get(`fz`)??``).split(`,`)){let[t,n]=e.split(`:`);U.includes(t)&&Number.isFinite(Number(n))&&(o[t]=Number(n)>>>0)}return{seed:Math.floor(r)>>>0,params:a,frozen:o}}function ct(){let e=J(`gallery`);e.innerHTML=``,Y.items.forEach((t,n)=>{let r=document.createElement(`button`);r.type=`button`,r.className=`card`+(n===Y.selected?` selected`:``);let i=document.createElement(`canvas`),a=t.gen.design;q(i,a,{scale:560/a.layout.width,threads:!1}),i.style.width=`100%`,i.style.height=`auto`;let o=document.createElement(`div`);o.className=`cap`;let s=t.gen.report;o.innerHTML=`<span>seed <b>${t.seed}</b></span><span>${a.spec.band.group} · ${s.colorsUsed} кол. · фон ${Math.round(s.bgFraction*100)}%</span>`,r.append(i,o),r.addEventListener(`click`,()=>lt(n)),e.append(r)})}function X(e,t){Y.params=it(),Y.master=e,Y.galleryFrozen=t,Y.items=Ke(e).map(e=>({seed:e,gen:Ge(Y.params,{seed:e,frozen:t})})),Y.selected=-1,ct(),lt(0)}function lt(e){let t=Y.items[e];Y.selected=e;for(let[t,n]of[...J(`gallery`).children].entries())n.classList.toggle(`selected`,t===e);dt({design:t.gen.design,report:t.gen.report,seed:t.seed,seeds:t.gen.seeds,params:Y.params,attempts:t.gen.attempts}),history.replaceState(null,``,ot(t.seed,Y.params,Y.galleryFrozen))}function ut(){let e=ie(qe);Y.selected=-1;for(let e of J(`gallery`).children)e.classList.remove(`selected`);dt({design:e,report:Pe(e),seed:null,seeds:null,params:null,attempts:1}),history.replaceState(null,``,`#ref`)}function dt(e){Y.current=e,J(`detail`).hidden=!1,J(`seed-input`).value=e.seed===null?``:String(e.seed);let n=e.design;J(`d-title`).textContent=n.spec.name;let r=n.layout.slots;J(`d-meta`).textContent=[e.seed===null?`фіксовані параметри`:`seed ${e.seed}`,`k = ${n.spec.k}`,`група ${t[n.spec.band.group]}`,`${n.spec.rapports} раппортів × ${n.spec.band.perRapport} мотиви + замикальний (${r} мотивів)`,`раппорт ${2*n.spec.band.perRapport} комірок`,n.spec.ladder?`драбинка ${n.spec.ladder.length}`:`без драбинки`,n.spec.pendants?`підвіски: ${ft(n)}`:`без підвісок`].join(` · `);let i=Math.floor((J(`detail`).clientWidth-40)/n.layout.width);J(`d-scale`).value=String(Math.max(3,Math.min(14,i))),pt(),mt(e),ht(n),gt(),J(`detail`).scrollIntoView({behavior:`smooth`,block:`nearest`})}function ft(e){let t=e.spec.pendants,n={roof:`«дах» із ромбом`,rhomb:`ромб`,triangle:`трикутник`}[t.shape];return t.centerOnly?`медальйон-${n}`:n}function pt(){let e=Y.current;e&&q(J(`d-canvas`),e.design,{scale:Number(J(`d-scale`).value),threads:J(`d-threads`).checked,rapport:J(`d-rapport`).checked})}function mt(e){let t=e.report,n=[[t.components===1&&t.isolated===0,`зв'язність: ${t.components} компонента, без ізольованих бісерин`],[t.onLattice,`усі бісерини сітки на лініях ґратки`],[t.pendantsAttached,`підвіски кріпляться до сітки`],[t.bgFraction>=.4&&t.bgFraction<=.7,`фон ${(t.bgFraction*100).toFixed(1)} %`],[t.colorsUsed>=2&&t.colorsUsed<=5,`${t.colorsUsed} кольорів`],[t.minAdjacentContrast>=.1,`мін. контраст сусідніх кольорів ΔE ${t.minAdjacentContrast.toFixed(3)}`]];J(`d-report`).innerHTML=n.map(([e,t])=>`<span class="${e?`ok`:`bad`}">${e?`✓`:`✗`} ${t}</span>`).join(` · `)+(e.attempts>1?` · <span>спроба ${e.attempts}</span>`:``)}function ht(e){let t=J(`d-motifs`);t.innerHTML=``;let n=e.layout.s;for(let r of D(e.spec)){let i=document.createElement(`div`);i.className=`motif`;let a=document.createElement(`canvas`);Qe(a,r,e.spec.colors,n,9),i.append(a,x[r.motif].name),t.append(i)}let r=new Set;for(let i of e.pendants){if(r.has(i.shape))continue;r.add(i.shape);let a=i.ids.map(t=>e.beads[e.index.get(t)]);if(!a.length)continue;let o=i.shape===`between`?2*n:1,s=Math.min(...a.map(e=>e.px))-o,c=Math.max(...a.map(e=>e.px))+o,l=Math.min(...a.map(e=>e.py))-o,u=Math.max(...a.map(e=>e.py+e.size/2))+.5,d=document.createElement(`div`);d.className=`motif`;let f=document.createElement(`canvas`);q(f,e,{scale:Math.min(9,200/(c-s)),threads:!0,view:{x0:s,y0:l,x1:c,y1:u}}),d.append(f,i.shape===`between`?`Малий ромб між підвісками`:`Підвіска: ${ft(e)}`),t.append(d)}}function gt(){let e=Y.current;if(!e)return;let t=Number(J(`d-reserve`).value),n=tt(e.design,t),r=e=>e.toLocaleString(`uk-UA`),i=n.rows.map(e=>`<tr>
        <td><span class="swatch" style="background:${e.hex}"></span>${e.index===0?`фон`:`колір ${e.index}`}</td>
        <td><b>${e.code}</b> <small>${e.article}</small></td>
        <td><small>${e.en} (ΔE ${e.dE.toFixed(3)})</small></td>
        <td class="n">${r(e.perRapport)}</td>
        <td class="n">${r(e.total)}</td>
        <td class="n">${e.grams.toLocaleString(`uk-UA`)} г</td>
      </tr>`).join(``),a=n.rows.reduce((e,t)=>e+t.grams,0),o=n.drops.map(e=>`<tr><td><span class="swatch" style="background:${e.hex}"></span>${e.kind===`drop`?`крапля`:`біконус`} ${e.sizeMm} мм</td><td colspan="3"></td><td class="n">${e.count} шт.</td><td></td></tr>`).join(``);J(`d-stats`).innerHTML=`<table class="stats">
      <thead><tr><th>Колір</th><th>Preciosa 10/0</th><th>Опис каталогу</th><th>На раппорт</th><th>Усього</th><th>Грами (+${t} %)</th></tr></thead>
      <tbody>${i}${o}</tbody>
      <tfoot><tr><th colspan="3">Разом · довжина ≈ ${n.lengthCm.toFixed(1)} см, висота ≈ ${n.heightCm.toFixed(1)} см</th>
      <th class="n">${r(n.perRapportBeads)}</th><th class="n">${r(n.totalBeads)}</th><th class="n">${(Math.round(a*10)/10).toLocaleString(`uk-UA`)} г</th></tr></tfoot>
    </table>
    <p class="hint">≈ 90 бісерин у грамі. Коди — найближчі за ΔE в OKLab з каталогу sylianka; кольори каталогу обчислено з фото, тож вони приблизні.</p>`}function Z(e,t){let n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=e,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),2e3)}var Q=()=>{let e=Y.current;return e.seed===null?`sylianka-reference`:`sylianka-${e.seed}`};function $(e){let t=document.createElement(`div`);t.className=`toast`,t.textContent=e,document.body.append(t),setTimeout(()=>t.remove(),2200)}function _t(){J(`x-png`).addEventListener(`click`,()=>{let e=Y.current;if(!e)return;let t=document.createElement(`canvas`);q(t,e.design,{scale:12,threads:J(`d-threads`).checked}),t.toBlob(e=>e&&Z(`${Q()}.png`,e),`image/png`)}),J(`x-svg`).addEventListener(`click`,()=>{let e=Y.current;e&&Z(`${Q()}.svg`,new Blob([ke(e.design,8,J(`d-threads`).checked)],{type:`image/svg+xml`}))}),J(`x-json`).addEventListener(`click`,()=>{let e=Y.current;e&&Z(`${Q()}.json`,new Blob([Oe(e.design,{seed:e.seed,params:e.params,seeds:e.seeds})],{type:`application/json`}))}),J(`x-sylianka`).addEventListener(`click`,()=>{let e=Y.current;if(!e)return;let{file:t,skipped:n}=De(e.design);Z(`${Q()}.sylianka.json`,new Blob([JSON.stringify(t,null,1)],{type:`application/json`})),n&&$(`У трафарет sylianka не ввійшло ${n} бісерин (драбинка й частини поза сіткою).`)})}function vt(){let e=st();if(e&&e!==`ref`){Y.params=e.params;for(let t of Object.keys(e.frozen))Y.frozen.add(t)}rt(),_t(),J(`p-complexity`).addEventListener(`input`,()=>{J(`p-complexity-out`).textContent=J(`p-complexity`).value}),J(`new`).addEventListener(`click`,()=>X(ce(),at())),J(`reference`).addEventListener(`click`,ut),J(`seed-open`).addEventListener(`click`,()=>{let e=Number(J(`seed-input`).value.trim());if(!Number.isFinite(e)||e<0)return $(`Seed — ціле невід'ємне число`);X(Math.floor(e)>>>0,at())}),J(`seed-input`).addEventListener(`keydown`,e=>{e.key===`Enter`&&J(`seed-open`).click()}),J(`seed-copy`).addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(location.href),$(`Посилання скопійовано`)}catch{J(`seed-input`).select(),$(`Скопіюйте seed вручну`)}});for(let e of[`d-threads`,`d-rapport`,`d-scale`])J(e).addEventListener(`input`,pt);if(J(`d-reserve`).addEventListener(`change`,gt),e===`ref`)X(ce(),{}),ut();else if(e){let t={seed:e.seed,frozen:e.frozen};X(t.seed,t.frozen)}else X(ce(),{})}vt();