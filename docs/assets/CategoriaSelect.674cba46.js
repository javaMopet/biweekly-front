import{l as rt,c as y,t as g,_ as lt,bx as ut,by as Ft,ar as Tt,m as jt,q as $t,bz as At,r as k,bt as Bt,w as oe,T as se,g as Qt,at as Nt,n as Xe,z as N,ag as ie,ah as Me,ai as E,aj as z,ao as Et,aq as st,E as Zt,Q as Lt,I as zt,bA as Rt,aK as Pt,aM as Je,ap as We,b5 as Ut,b6 as Xt,aO as Jt}from"./index.20d4ad85.js";import{u as Wt,Q as Gt,b as Kt,_ as ea}from"./FormRegistroCategoria.298f8369.js";import{g as w}from"./format.9422eb17.js";import{C as ta}from"./index.804869e1.js";import{Q as aa}from"./QTooltip.a2dbcdc4.js";import{Q as na,a as oa}from"./QList.5cb48b53.js";import{Q as ra}from"./DialogTitle.a45c2883.js";var ka=rt({name:"QTr",props:{props:Object,noHover:Boolean},setup(e,{slots:r}){const d=y(()=>"q-tr"+(e.props===void 0||e.props.header===!0?"":" "+e.props.__trClass)+(e.noHover===!0?" q-tr--no-hover":""));return()=>g("tr",{class:d.value},lt(r.default))}});const X=[-61,9,38,199,426,686,756,818,1111,1181,1210,1635,2060,2097,2192,2262,2324,2394,2456,3178];function la(e,r,d){return Object.prototype.toString.call(e)==="[object Date]"&&(d=e.getDate(),r=e.getMonth()+1,e=e.getFullYear()),da(Fe(e,r,d))}function Ge(e,r,d){return dt(ia(e,r,d))}function ua(e){return sa(e)===0}function De(e,r){return r<=6?31:r<=11||ua(e)?30:29}function sa(e){const r=X.length;let d=X[0],l,c,o,D,u;if(e<d||e>=X[r-1])throw new Error("Invalid Jalaali year "+e);for(u=1;u<r&&(l=X[u],c=l-d,!(e<l));u+=1)d=l;return D=e-d,c-D<6&&(D=D-c+x(c+4,33)*33),o=$($(D+1,33)-1,4),o===-1&&(o=4),o}function it(e,r){const d=X.length,l=e+621;let c=-14,o=X[0],D,u,m,_,v;if(e<o||e>=X[d-1])throw new Error("Invalid Jalaali year "+e);for(v=1;v<d&&(D=X[v],u=D-o,!(e<D));v+=1)c=c+x(u,33)*8+x($(u,33),4),o=D;_=e-o,c=c+x(_,33)*8+x($(_,33)+3,4),$(u,33)===4&&u-_===4&&(c+=1);const M=x(l,4)-x((x(l,100)+1)*3,4)-150,A=20+c-M;return r||(u-_<6&&(_=_-u+x(u+4,33)*33),m=$($(_+1,33)-1,4),m===-1&&(m=4)),{leap:m,gy:l,march:A}}function ia(e,r,d){const l=it(e,!0);return Fe(l.gy,3,l.march)+(r-1)*31-x(r,7)*(r-7)+d-1}function da(e){const r=dt(e).gy;let d=r-621,l,c,o;const D=it(d,!1),u=Fe(r,3,D.march);if(o=e-u,o>=0){if(o<=185)return c=1+x(o,31),l=$(o,31)+1,{jy:d,jm:c,jd:l};o-=186}else d-=1,o+=179,D.leap===1&&(o+=1);return c=7+x(o,30),l=$(o,30)+1,{jy:d,jm:c,jd:l}}function Fe(e,r,d){let l=x((e+x(r-8,6)+100100)*1461,4)+x(153*$(r+9,12)+2,5)+d-34840408;return l=l-x(x(e+100100+x(r-8,6),100)*3,4)+752,l}function dt(e){let r=4*e+139361631;r=r+x(x(4*e+183187720,146097)*3,4)*4-3908;const d=x($(r,1461),4)*5+308,l=x($(d,153),5)+1,c=$(x(d,153),12)+1;return{gy:x(r,1461)-100100+x(8-c,6),gm:c,gd:l}}function x(e,r){return~~(e/r)}function $(e,r){return e-~~(e/r)*r}const ca=["gregorian","persian"],va={modelValue:{required:!0},mask:{type:String},locale:Object,calendar:{type:String,validator:e=>ca.includes(e),default:"gregorian"},landscape:Boolean,color:String,textColor:String,square:Boolean,flat:Boolean,bordered:Boolean,readonly:Boolean,disable:Boolean},fa=["update:modelValue"];function P(e){return e.year+"/"+w(e.month)+"/"+w(e.day)}function ma(e,r){const d=y(()=>e.disable!==!0&&e.readonly!==!0),l=y(()=>d.value===!0?0:-1),c=y(()=>{const u=[];return e.color!==void 0&&u.push(`bg-${e.color}`),e.textColor!==void 0&&u.push(`text-${e.textColor}`),u.join(" ")});function o(){return e.locale!==void 0?{...r.lang.date,...e.locale}:r.lang.date}function D(u){const m=new Date,_=u===!0?null:0;if(e.calendar==="persian"){const v=la(m);return{year:v.jy,month:v.jm,day:v.jd}}return{year:m.getFullYear(),month:m.getMonth()+1,day:m.getDate(),hour:_,minute:_,second:_,millisecond:_}}return{editable:d,tabindex:l,headerClass:c,getLocale:o,getCurrentDate:D}}const ct=864e5,ha=36e5,Oe=6e4,vt="YYYY-MM-DDTHH:mm:ss.SSSZ",ga=/\[((?:[^\]\\]|\\]|\\)*)\]|d{1,4}|M{1,4}|m{1,2}|w{1,2}|Qo|Do|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|a{1,2}|[AQExX]/g,ya=/(\[[^\]]*\])|d{1,4}|M{1,4}|m{1,2}|w{1,2}|Qo|Do|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|a{1,2}|[AQExX]|([.*+:?^,\s${}()|\\]+)/g,Ie={};function Ma(e,r){const d="("+r.days.join("|")+")",l=e+d;if(Ie[l]!==void 0)return Ie[l];const c="("+r.daysShort.join("|")+")",o="("+r.months.join("|")+")",D="("+r.monthsShort.join("|")+")",u={};let m=0;const _=e.replace(ya,M=>{switch(m++,M){case"YY":return u.YY=m,"(-?\\d{1,2})";case"YYYY":return u.YYYY=m,"(-?\\d{1,4})";case"M":return u.M=m,"(\\d{1,2})";case"MM":return u.M=m,"(\\d{2})";case"MMM":return u.MMM=m,D;case"MMMM":return u.MMMM=m,o;case"D":return u.D=m,"(\\d{1,2})";case"Do":return u.D=m++,"(\\d{1,2}(st|nd|rd|th))";case"DD":return u.D=m,"(\\d{2})";case"H":return u.H=m,"(\\d{1,2})";case"HH":return u.H=m,"(\\d{2})";case"h":return u.h=m,"(\\d{1,2})";case"hh":return u.h=m,"(\\d{2})";case"m":return u.m=m,"(\\d{1,2})";case"mm":return u.m=m,"(\\d{2})";case"s":return u.s=m,"(\\d{1,2})";case"ss":return u.s=m,"(\\d{2})";case"S":return u.S=m,"(\\d{1})";case"SS":return u.S=m,"(\\d{2})";case"SSS":return u.S=m,"(\\d{3})";case"A":return u.A=m,"(AM|PM)";case"a":return u.a=m,"(am|pm)";case"aa":return u.aa=m,"(a\\.m\\.|p\\.m\\.)";case"ddd":return c;case"dddd":return d;case"Q":case"d":case"E":return"(\\d{1})";case"Qo":return"(1st|2nd|3rd|4th)";case"DDD":case"DDDD":return"(\\d{1,3})";case"w":return"(\\d{1,2})";case"ww":return"(\\d{2})";case"Z":return u.Z=m,"(Z|[+-]\\d{2}:\\d{2})";case"ZZ":return u.ZZ=m,"(Z|[+-]\\d{2}\\d{2})";case"X":return u.X=m,"(-?\\d+)";case"x":return u.x=m,"(-?\\d{4,})";default:return m--,M[0]==="["&&(M=M.substring(1,M.length-1)),M.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}}),v={map:u,regex:new RegExp("^"+_)};return Ie[l]=v,v}function ft(e,r){return e!==void 0?e:r!==void 0?r.date:Ft.date}function Ke(e,r=""){const d=e>0?"-":"+",l=Math.abs(e),c=Math.floor(l/60),o=l%60;return d+w(c)+r+w(o)}function Da(e,r,d,l,c){const o={year:null,month:null,day:null,hour:null,minute:null,second:null,millisecond:null,timezoneOffset:null,dateHash:null,timeHash:null};if(c!==void 0&&Object.assign(o,c),e==null||e===""||typeof e!="string")return o;r===void 0&&(r=vt);const D=ft(d,ut.props),u=D.months,m=D.monthsShort,{regex:_,map:v}=Ma(r,D),M=e.match(_);if(M===null)return o;let A="";if(v.X!==void 0||v.x!==void 0){const F=parseInt(M[v.X!==void 0?v.X:v.x],10);if(isNaN(F)===!0||F<0)return o;const T=new Date(F*(v.X!==void 0?1e3:1));o.year=T.getFullYear(),o.month=T.getMonth()+1,o.day=T.getDate(),o.hour=T.getHours(),o.minute=T.getMinutes(),o.second=T.getSeconds(),o.millisecond=T.getMilliseconds()}else{if(v.YYYY!==void 0)o.year=parseInt(M[v.YYYY],10);else if(v.YY!==void 0){const F=parseInt(M[v.YY],10);o.year=F<0?F:2e3+F}if(v.M!==void 0){if(o.month=parseInt(M[v.M],10),o.month<1||o.month>12)return o}else v.MMM!==void 0?o.month=m.indexOf(M[v.MMM])+1:v.MMMM!==void 0&&(o.month=u.indexOf(M[v.MMMM])+1);if(v.D!==void 0){if(o.day=parseInt(M[v.D],10),o.year===null||o.month===null||o.day<1)return o;const F=l!=="persian"?new Date(o.year,o.month,0).getDate():De(o.year,o.month);if(o.day>F)return o}v.H!==void 0?o.hour=parseInt(M[v.H],10)%24:v.h!==void 0&&(o.hour=parseInt(M[v.h],10)%12,(v.A&&M[v.A]==="PM"||v.a&&M[v.a]==="pm"||v.aa&&M[v.aa]==="p.m.")&&(o.hour+=12),o.hour=o.hour%24),v.m!==void 0&&(o.minute=parseInt(M[v.m],10)%60),v.s!==void 0&&(o.second=parseInt(M[v.s],10)%60),v.S!==void 0&&(o.millisecond=parseInt(M[v.S],10)*10**(3-M[v.S].length)),(v.Z!==void 0||v.ZZ!==void 0)&&(A=v.Z!==void 0?M[v.Z].replace(":",""):M[v.ZZ],o.timezoneOffset=(A[0]==="+"?-1:1)*(60*A.slice(1,3)+1*A.slice(3,5)))}return o.dateHash=w(o.year,6)+"/"+w(o.month)+"/"+w(o.day),o.timeHash=w(o.hour)+":"+w(o.minute)+":"+w(o.second)+A,o}function et(e){const r=new Date(e.getFullYear(),e.getMonth(),e.getDate());r.setDate(r.getDate()-(r.getDay()+6)%7+3);const d=new Date(r.getFullYear(),0,4);d.setDate(d.getDate()-(d.getDay()+6)%7+3);const l=r.getTimezoneOffset()-d.getTimezoneOffset();r.setHours(r.getHours()-l);const c=(r-d)/(ct*7);return 1+Math.floor(c)}function L(e,r,d){const l=new Date(e),c=`set${d===!0?"UTC":""}`;switch(r){case"year":case"years":l[`${c}Month`](0);case"month":case"months":l[`${c}Date`](1);case"day":case"days":case"date":l[`${c}Hours`](0);case"hour":case"hours":l[`${c}Minutes`](0);case"minute":case"minutes":l[`${c}Seconds`](0);case"second":case"seconds":l[`${c}Milliseconds`](0)}return l}function ye(e,r,d){return(e.getTime()-e.getTimezoneOffset()*Oe-(r.getTime()-r.getTimezoneOffset()*Oe))/d}function mt(e,r,d="days"){const l=new Date(e),c=new Date(r);switch(d){case"years":case"year":return l.getFullYear()-c.getFullYear();case"months":case"month":return(l.getFullYear()-c.getFullYear())*12+l.getMonth()-c.getMonth();case"days":case"day":case"date":return ye(L(l,"day"),L(c,"day"),ct);case"hours":case"hour":return ye(L(l,"hour"),L(c,"hour"),ha);case"minutes":case"minute":return ye(L(l,"minute"),L(c,"minute"),Oe);case"seconds":case"second":return ye(L(l,"second"),L(c,"second"),1e3)}}function tt(e){return mt(e,L(e,"year"),"days")+1}function at(e){if(e>=11&&e<=13)return`${e}th`;switch(e%10){case 1:return`${e}st`;case 2:return`${e}nd`;case 3:return`${e}rd`}return`${e}th`}const nt={YY(e,r,d){const l=this.YYYY(e,r,d)%100;return l>=0?w(l):"-"+w(Math.abs(l))},YYYY(e,r,d){return d!=null?d:e.getFullYear()},M(e){return e.getMonth()+1},MM(e){return w(e.getMonth()+1)},MMM(e,r){return r.monthsShort[e.getMonth()]},MMMM(e,r){return r.months[e.getMonth()]},Q(e){return Math.ceil((e.getMonth()+1)/3)},Qo(e){return at(this.Q(e))},D(e){return e.getDate()},Do(e){return at(e.getDate())},DD(e){return w(e.getDate())},DDD(e){return tt(e)},DDDD(e){return w(tt(e),3)},d(e){return e.getDay()},dd(e,r){return this.dddd(e,r).slice(0,2)},ddd(e,r){return r.daysShort[e.getDay()]},dddd(e,r){return r.days[e.getDay()]},E(e){return e.getDay()||7},w(e){return et(e)},ww(e){return w(et(e))},H(e){return e.getHours()},HH(e){return w(e.getHours())},h(e){const r=e.getHours();return r===0?12:r>12?r%12:r},hh(e){return w(this.h(e))},m(e){return e.getMinutes()},mm(e){return w(e.getMinutes())},s(e){return e.getSeconds()},ss(e){return w(e.getSeconds())},S(e){return Math.floor(e.getMilliseconds()/100)},SS(e){return w(Math.floor(e.getMilliseconds()/10))},SSS(e){return w(e.getMilliseconds(),3)},A(e){return this.H(e)<12?"AM":"PM"},a(e){return this.H(e)<12?"am":"pm"},aa(e){return this.H(e)<12?"a.m.":"p.m."},Z(e,r,d,l){const c=l==null?e.getTimezoneOffset():l;return Ke(c,":")},ZZ(e,r,d,l){const c=l==null?e.getTimezoneOffset():l;return Ke(c)},X(e){return Math.floor(e.getTime()/1e3)},x(e){return e.getTime()}};function ba(e,r,d,l,c){if(e!==0&&!e||e===1/0||e===-1/0)return;const o=new Date(e);if(isNaN(o))return;r===void 0&&(r=vt);const D=ft(d,ut.props);return r.replace(ga,(u,m)=>u in nt?nt[u](o,D,l,c):m===void 0?u:m.split("\\]").join("]"))}const G=20,_a=["Calendar","Years","Months"],ot=e=>_a.includes(e),ke=e=>/^-?[\d]+\/[0-1]\d$/.test(e),ne=" \u2014 ";function U(e){return e.year+"/"+w(e.month)}var Ya=rt({name:"QDate",props:{...va,...Tt,...jt,multiple:Boolean,range:Boolean,title:String,subtitle:String,mask:{default:"YYYY/MM/DD"},defaultYearMonth:{type:String,validator:ke},yearsInMonthView:Boolean,events:[Array,Function],eventColor:[String,Function],emitImmediately:Boolean,options:[Array,Function],navigationMinYearMonth:{type:String,validator:ke},navigationMaxYearMonth:{type:String,validator:ke},noUnset:Boolean,firstDayOfWeek:[String,Number],todayBtn:Boolean,minimal:Boolean,defaultView:{type:String,default:"Calendar",validator:ot}},emits:[...fa,"rangeStart","rangeEnd","navigation"],setup(e,{slots:r,emit:d}){const{proxy:l}=Qt(),{$q:c}=l,o=$t(e,c),{getCache:D}=Wt(),{tabindex:u,headerClass:m,getLocale:_,getCurrentDate:v}=ma(e,c);let M;const A=At(e),F=Nt(A),T=k(null),Z=k(Ee()),C=k(_()),p=y(()=>Ee()),H=y(()=>_()),q=y(()=>v()),h=k(Ze(Z.value,C.value)),j=k(e.defaultView),Te=c.lang.rtl===!0?"right":"left",de=k(Te.value),be=k(Te.value),_e=h.value.year,ce=k(_e-_e%G-(_e<0?G:0)),O=k(null),ht=y(()=>{const t=e.landscape===!0?"landscape":"portrait";return`q-date q-date--${t} q-date--${t}-${e.minimal===!0?"minimal":"standard"}`+(o.value===!0?" q-date--dark q-dark":"")+(e.bordered===!0?" q-date--bordered":"")+(e.square===!0?" q-date--square no-border-radius":"")+(e.flat===!0?" q-date--flat no-shadow":"")+(e.disable===!0?" disabled":e.readonly===!0?" q-date--readonly":"")}),J=y(()=>e.color||"primary"),K=y(()=>e.textColor||"white"),ve=y(()=>e.emitImmediately===!0&&e.multiple!==!0&&e.range!==!0),Ye=y(()=>Array.isArray(e.modelValue)===!0?e.modelValue:e.modelValue!==null&&e.modelValue!==void 0?[e.modelValue]:[]),Q=y(()=>Ye.value.filter(t=>typeof t=="string").map(t=>Ce(t,Z.value,C.value)).filter(t=>t.dateHash!==null&&t.day!==null&&t.month!==null&&t.year!==null)),ee=y(()=>{const t=a=>Ce(a,Z.value,C.value);return Ye.value.filter(a=>Bt(a)===!0&&a.from!==void 0&&a.to!==void 0).map(a=>({from:t(a.from),to:t(a.to)})).filter(a=>a.from.dateHash!==null&&a.to.dateHash!==null&&a.from.dateHash<a.to.dateHash)}),fe=y(()=>e.calendar!=="persian"?t=>new Date(t.year,t.month-1,t.day):t=>{const a=Ge(t.year,t.month,t.day);return new Date(a.gy,a.gm-1,a.gd)}),we=y(()=>e.calendar==="persian"?P:(t,a,n)=>ba(new Date(t.year,t.month-1,t.day,t.hour,t.minute,t.second,t.millisecond),a===void 0?Z.value:a,n===void 0?C.value:n,t.year,t.timezoneOffset)),re=y(()=>Q.value.length+ee.value.reduce((t,a)=>t+1+mt(fe.value(a.to),fe.value(a.from)),0)),je=y(()=>{if(e.title!==void 0&&e.title!==null&&e.title.length!==0)return e.title;if(O.value!==null){const n=O.value.init,s=fe.value(n);return C.value.daysShort[s.getDay()]+", "+C.value.monthsShort[n.month-1]+" "+n.day+ne+"?"}if(re.value===0)return ne;if(re.value>1)return`${re.value} ${C.value.pluralDay}`;const t=Q.value[0],a=fe.value(t);return isNaN(a.valueOf())===!0?ne:C.value.headerTitle!==void 0?C.value.headerTitle(a,t):C.value.daysShort[a.getDay()]+", "+C.value.monthsShort[t.month-1]+" "+t.day}),gt=y(()=>Q.value.concat(ee.value.map(a=>a.from)).sort((a,n)=>a.year-n.year||a.month-n.month)[0]),yt=y(()=>Q.value.concat(ee.value.map(a=>a.to)).sort((a,n)=>n.year-a.year||n.month-a.month)[0]),$e=y(()=>{if(e.subtitle!==void 0&&e.subtitle!==null&&e.subtitle.length!==0)return e.subtitle;if(re.value===0)return ne;if(re.value>1){const t=gt.value,a=yt.value,n=C.value.monthsShort;return n[t.month-1]+(t.year!==a.year?" "+t.year+ne+n[a.month-1]+" ":t.month!==a.month?ne+n[a.month-1]:"")+" "+a.year}return Q.value[0].year}),me=y(()=>{const t=[c.iconSet.datetime.arrowLeft,c.iconSet.datetime.arrowRight];return c.lang.rtl===!0?t.reverse():t}),Ae=y(()=>e.firstDayOfWeek!==void 0?Number(e.firstDayOfWeek):C.value.firstDayOfWeek),Mt=y(()=>{const t=C.value.daysShort,a=Ae.value;return a>0?t.slice(a,7).concat(t.slice(0,a)):t}),R=y(()=>{const t=h.value;return e.calendar!=="persian"?new Date(t.year,t.month,0).getDate():De(t.year,t.month)}),Dt=y(()=>typeof e.eventColor=="function"?e.eventColor:()=>e.eventColor),V=y(()=>{if(e.navigationMinYearMonth===void 0)return null;const t=e.navigationMinYearMonth.split("/");return{year:parseInt(t[0],10),month:parseInt(t[1],10)}}),I=y(()=>{if(e.navigationMaxYearMonth===void 0)return null;const t=e.navigationMaxYearMonth.split("/");return{year:parseInt(t[0],10),month:parseInt(t[1],10)}}),Se=y(()=>{const t={month:{prev:!0,next:!0},year:{prev:!0,next:!0}};return V.value!==null&&V.value.year>=h.value.year&&(t.year.prev=!1,V.value.year===h.value.year&&V.value.month>=h.value.month&&(t.month.prev=!1)),I.value!==null&&I.value.year<=h.value.year&&(t.year.next=!1,I.value.year===h.value.year&&I.value.month<=h.value.month&&(t.month.next=!1)),t}),he=y(()=>{const t={};return Q.value.forEach(a=>{const n=U(a);t[n]===void 0&&(t[n]=[]),t[n].push(a.day)}),t}),Be=y(()=>{const t={};return ee.value.forEach(a=>{const n=U(a.from),s=U(a.to);if(t[n]===void 0&&(t[n]=[]),t[n].push({from:a.from.day,to:n===s?a.to.day:void 0,range:a}),n<s){let i;const{year:Y,month:f}=a.from,b=f<12?{year:Y,month:f+1}:{year:Y+1,month:1};for(;(i=U(b))<=s;)t[i]===void 0&&(t[i]=[]),t[i].push({from:void 0,to:i===s?a.to.day:void 0,range:a}),b.month++,b.month>12&&(b.year++,b.month=1)}}),t}),le=y(()=>{if(O.value===null)return;const{init:t,initHash:a,final:n,finalHash:s}=O.value,[i,Y]=a<=s?[t,n]:[n,t],f=U(i),b=U(Y);if(f!==B.value&&b!==B.value)return;const S={};return f===B.value?(S.from=i.day,S.includeFrom=!0):S.from=1,b===B.value?(S.to=Y.day,S.includeTo=!0):S.to=R.value,S}),B=y(()=>U(h.value)),bt=y(()=>{const t={};if(e.options===void 0){for(let n=1;n<=R.value;n++)t[n]=!0;return t}const a=typeof e.options=="function"?e.options:n=>e.options.includes(n);for(let n=1;n<=R.value;n++){const s=B.value+"/"+w(n);t[n]=a(s)}return t}),_t=y(()=>{const t={};if(e.events===void 0)for(let a=1;a<=R.value;a++)t[a]=!1;else{const a=typeof e.events=="function"?e.events:n=>e.events.includes(n);for(let n=1;n<=R.value;n++){const s=B.value+"/"+w(n);t[n]=a(s)===!0&&Dt.value(s)}}return t}),Yt=y(()=>{let t,a;const{year:n,month:s}=h.value;if(e.calendar!=="persian")t=new Date(n,s-1,1),a=new Date(n,s-1,0).getDate();else{const i=Ge(n,s,1);t=new Date(i.gy,i.gm-1,i.gd);let Y=s-1,f=n;Y===0&&(Y=12,f--),a=De(f,Y)}return{days:t.getDay()-Ae.value-1,endDay:a}}),Qe=y(()=>{const t=[],{days:a,endDay:n}=Yt.value,s=a<0?a+7:a;if(s<6)for(let f=n-s;f<=n;f++)t.push({i:f,fill:!0});const i=t.length;for(let f=1;f<=R.value;f++){const b={i:f,event:_t.value[f],classes:[]};bt.value[f]===!0&&(b.in=!0,b.flat=!0),t.push(b)}if(he.value[B.value]!==void 0&&he.value[B.value].forEach(f=>{const b=i+f-1;Object.assign(t[b],{selected:!0,unelevated:!0,flat:!1,color:J.value,textColor:K.value})}),Be.value[B.value]!==void 0&&Be.value[B.value].forEach(f=>{if(f.from!==void 0){const b=i+f.from-1,S=i+(f.to||R.value)-1;for(let ue=b;ue<=S;ue++)Object.assign(t[ue],{range:f.range,unelevated:!0,color:J.value,textColor:K.value});Object.assign(t[b],{rangeFrom:!0,flat:!1}),f.to!==void 0&&Object.assign(t[S],{rangeTo:!0,flat:!1})}else if(f.to!==void 0){const b=i+f.to-1;for(let S=i;S<=b;S++)Object.assign(t[S],{range:f.range,unelevated:!0,color:J.value,textColor:K.value});Object.assign(t[b],{flat:!1,rangeTo:!0})}else{const b=i+R.value-1;for(let S=i;S<=b;S++)Object.assign(t[S],{range:f.range,unelevated:!0,color:J.value,textColor:K.value})}}),le.value!==void 0){const f=i+le.value.from-1,b=i+le.value.to-1;for(let S=f;S<=b;S++)t[S].color=J.value,t[S].editRange=!0;le.value.includeFrom===!0&&(t[f].editRangeFrom=!0),le.value.includeTo===!0&&(t[b].editRangeTo=!0)}h.value.year===q.value.year&&h.value.month===q.value.month&&(t[i+q.value.day-1].today=!0);const Y=t.length%7;if(Y>0){const f=7-Y;for(let b=1;b<=f;b++)t.push({i:b,fill:!0})}return t.forEach(f=>{let b="q-date__calendar-item ";f.fill===!0?b+="q-date__calendar-item--fill":(b+=`q-date__calendar-item--${f.in===!0?"in":"out"}`,f.range!==void 0&&(b+=` q-date__range${f.rangeTo===!0?"-to":f.rangeFrom===!0?"-from":""}`),f.editRange===!0&&(b+=` q-date__edit-range${f.editRangeFrom===!0?"-from":""}${f.editRangeTo===!0?"-to":""}`),(f.range!==void 0||f.editRange===!0)&&(b+=` text-${f.color}`)),f.classes=b}),t}),wt=y(()=>e.disable===!0?{"aria-disabled":"true"}:e.readonly===!0?{"aria-readonly":"true"}:{});oe(()=>e.modelValue,t=>{if(M===t)M=0;else{const a=Ze(Z.value,C.value);te(a.year,a.month,a)}}),oe(j,()=>{T.value!==null&&l.$el.contains(document.activeElement)===!0&&T.value.focus()}),oe(()=>h.value.year+"|"+h.value.month,()=>{d("navigation",{year:h.value.year,month:h.value.month})}),oe(p,t=>{Ue(t,C.value,"mask"),Z.value=t}),oe(H,t=>{Ue(Z.value,t,"locale"),C.value=t});function Ne(){const{year:t,month:a,day:n}=q.value,s={...h.value,year:t,month:a,day:n},i=he.value[U(s)];(i===void 0||i.includes(s.day)===!1)&&pe(s),xe(s.year,s.month)}function St(t){ot(t)===!0&&(j.value=t)}function xt(t,a){["month","year"].includes(t)&&(t==="month"?ze:qe)(a===!0?-1:1)}function xe(t,a){j.value="Calendar",te(t,a)}function Ct(t,a){if(e.range===!1||!t){O.value=null;return}const n=Object.assign({...h.value},t),s=a!==void 0?Object.assign({...h.value},a):n;O.value={init:n,initHash:P(n),final:s,finalHash:P(s)},xe(n.year,n.month)}function Ee(){return e.calendar==="persian"?"YYYY/MM/DD":e.mask}function Ce(t,a,n){return Da(t,a,n,e.calendar,{hour:0,minute:0,second:0,millisecond:0})}function Ze(t,a){const n=Array.isArray(e.modelValue)===!0?e.modelValue:e.modelValue?[e.modelValue]:[];if(n.length===0)return Le();const s=n[n.length-1],i=Ce(s.from!==void 0?s.from:s,t,a);return i.dateHash===null?Le():i}function Le(){let t,a;if(e.defaultYearMonth!==void 0){const n=e.defaultYearMonth.split("/");t=parseInt(n[0],10),a=parseInt(n[1],10)}else{const n=q.value!==void 0?q.value:v();t=n.year,a=n.month}return{year:t,month:a,day:1,hour:0,minute:0,second:0,millisecond:0,dateHash:t+"/"+w(a)+"/01"}}function ze(t){let a=h.value.year,n=Number(h.value.month)+t;n===13?(n=1,a++):n===0&&(n=12,a--),te(a,n),ve.value===!0&&ge("month")}function qe(t){const a=Number(h.value.year)+t;te(a,h.value.month),ve.value===!0&&ge("year")}function qt(t){te(t,h.value.month),j.value=e.defaultView==="Years"?"Months":"Calendar",ve.value===!0&&ge("year")}function pt(t){te(h.value.year,t),j.value="Calendar",ve.value===!0&&ge("month")}function Ht(t,a){const n=he.value[a];(n!==void 0&&n.includes(t.day)===!0?He:pe)(t)}function W(t){return{year:t.year,month:t.month,day:t.day}}function te(t,a,n){if(V.value!==null&&t<=V.value.year&&((a<V.value.month||t<V.value.year)&&(a=V.value.month),t=V.value.year),I.value!==null&&t>=I.value.year&&((a>I.value.month||t>I.value.year)&&(a=I.value.month),t=I.value.year),n!==void 0){const{hour:i,minute:Y,second:f,millisecond:b,timezoneOffset:S,timeHash:ue}=n;Object.assign(h.value,{hour:i,minute:Y,second:f,millisecond:b,timezoneOffset:S,timeHash:ue})}const s=t+"/"+w(a)+"/01";s!==h.value.dateHash&&(de.value=h.value.dateHash<s==(c.lang.rtl!==!0)?"left":"right",t!==h.value.year&&(be.value=de.value),Xe(()=>{ce.value=t-t%G-(t<0?G:0),Object.assign(h.value,{year:t,month:a,day:1,dateHash:s})}))}function Re(t,a,n){const s=t!==null&&t.length===1&&e.multiple===!1?t[0]:t;M=s;const{reason:i,details:Y}=Pe(a,n);d("update:modelValue",s,i,Y)}function ge(t){const a=Q.value[0]!==void 0&&Q.value[0].dateHash!==null?{...Q.value[0]}:{...h.value};Xe(()=>{a.year=h.value.year,a.month=h.value.month;const n=e.calendar!=="persian"?new Date(a.year,a.month,0).getDate():De(a.year,a.month);a.day=Math.min(Math.max(1,a.day),n);const s=ae(a);M=s;const{details:i}=Pe("",a);d("update:modelValue",s,t,i)})}function Pe(t,a){return a.from!==void 0?{reason:`${t}-range`,details:{...W(a.target),from:W(a.from),to:W(a.to)}}:{reason:`${t}-day`,details:W(a)}}function ae(t,a,n){return t.from!==void 0?{from:we.value(t.from,a,n),to:we.value(t.to,a,n)}:we.value(t,a,n)}function pe(t){let a;if(e.multiple===!0)if(t.from!==void 0){const n=P(t.from),s=P(t.to),i=Q.value.filter(f=>f.dateHash<n||f.dateHash>s),Y=ee.value.filter(({from:f,to:b})=>b.dateHash<n||f.dateHash>s);a=i.concat(Y).concat(t).map(f=>ae(f))}else{const n=Ye.value.slice();n.push(ae(t)),a=n}else a=ae(t);Re(a,"add",t)}function He(t){if(e.noUnset===!0)return;let a=null;if(e.multiple===!0&&Array.isArray(e.modelValue)===!0){const n=ae(t);t.from!==void 0?a=e.modelValue.filter(s=>s.from!==void 0?s.from!==n.from&&s.to!==n.to:!0):a=e.modelValue.filter(s=>s!==n),a.length===0&&(a=null)}Re(a,"remove",t)}function Ue(t,a,n){const s=Q.value.concat(ee.value).map(i=>ae(i,t,a)).filter(i=>i.from!==void 0?i.from.dateHash!==null&&i.to.dateHash!==null:i.dateHash!==null);d("update:modelValue",(e.multiple===!0?s:s[0])||null,n)}function Vt(){if(e.minimal!==!0)return g("div",{class:"q-date__header "+m.value},[g("div",{class:"relative-position"},[g(se,{name:"q-transition--fade"},()=>g("div",{key:"h-yr-"+$e.value,class:"q-date__header-subtitle q-date__header-link "+(j.value==="Years"?"q-date__header-link--active":"cursor-pointer"),tabindex:u.value,...D("vY",{onClick(){j.value="Years"},onKeyup(t){t.keyCode===13&&(j.value="Years")}})},[$e.value]))]),g("div",{class:"q-date__header-title relative-position flex no-wrap"},[g("div",{class:"relative-position col"},[g(se,{name:"q-transition--fade"},()=>g("div",{key:"h-sub"+je.value,class:"q-date__header-title-label q-date__header-link "+(j.value==="Calendar"?"q-date__header-link--active":"cursor-pointer"),tabindex:u.value,...D("vC",{onClick(){j.value="Calendar"},onKeyup(t){t.keyCode===13&&(j.value="Calendar")}})},[je.value]))]),e.todayBtn===!0?g(N,{class:"q-date__header-today self-start",icon:c.iconSet.datetime.today,flat:!0,size:"sm",round:!0,tabindex:u.value,onClick:Ne}):null])])}function Ve({label:t,type:a,key:n,dir:s,goTo:i,boundaries:Y,cls:f}){return[g("div",{class:"row items-center q-date__arrow"},[g(N,{round:!0,dense:!0,size:"sm",flat:!0,icon:me.value[0],tabindex:u.value,disable:Y.prev===!1,...D("go-#"+a,{onClick(){i(-1)}})})]),g("div",{class:"relative-position overflow-hidden flex flex-center"+f},[g(se,{name:"q-transition--jump-"+s},()=>g("div",{key:n},[g(N,{flat:!0,dense:!0,noCaps:!0,label:t,tabindex:u.value,...D("view#"+a,{onClick:()=>{j.value=a}})})]))]),g("div",{class:"row items-center q-date__arrow"},[g(N,{round:!0,dense:!0,size:"sm",flat:!0,icon:me.value[1],tabindex:u.value,disable:Y.next===!1,...D("go+#"+a,{onClick(){i(1)}})})])]}const It={Calendar:()=>[g("div",{key:"calendar-view",class:"q-date__view q-date__calendar"},[g("div",{class:"q-date__navigation row items-center no-wrap"},Ve({label:C.value.months[h.value.month-1],type:"Months",key:h.value.month,dir:de.value,goTo:ze,boundaries:Se.value.month,cls:" col"}).concat(Ve({label:h.value.year,type:"Years",key:h.value.year,dir:be.value,goTo:qe,boundaries:Se.value.year,cls:""}))),g("div",{class:"q-date__calendar-weekdays row items-center no-wrap"},Mt.value.map(t=>g("div",{class:"q-date__calendar-item"},[g("div",t)]))),g("div",{class:"q-date__calendar-days-container relative-position overflow-hidden"},[g(se,{name:"q-transition--slide-"+de.value},()=>g("div",{key:B.value,class:"q-date__calendar-days fit"},Qe.value.map(t=>g("div",{class:t.classes},[t.in===!0?g(N,{class:t.today===!0?"q-date__today":"",dense:!0,flat:t.flat,unelevated:t.unelevated,color:t.color,textColor:t.textColor,label:t.i,tabindex:u.value,...D("day#"+t.i,{onClick:()=>{kt(t.i)},onMouseover:()=>{Ot(t.i)}})},t.event!==!1?()=>g("div",{class:"q-date__event bg-"+t.event}):null):g("div",""+t.i)]))))])])],Months(){const t=h.value.year===q.value.year,a=s=>V.value!==null&&h.value.year===V.value.year&&V.value.month>s||I.value!==null&&h.value.year===I.value.year&&I.value.month<s,n=C.value.monthsShort.map((s,i)=>{const Y=h.value.month===i+1;return g("div",{class:"q-date__months-item flex flex-center"},[g(N,{class:t===!0&&q.value.month===i+1?"q-date__today":null,flat:Y!==!0,label:s,unelevated:Y,color:Y===!0?J.value:null,textColor:Y===!0?K.value:null,tabindex:u.value,disable:a(i+1),...D("month#"+i,{onClick:()=>{pt(i+1)}})})])});return e.yearsInMonthView===!0&&n.unshift(g("div",{class:"row no-wrap full-width"},[Ve({label:h.value.year,type:"Years",key:h.value.year,dir:be.value,goTo:qe,boundaries:Se.value.year,cls:" col"})])),g("div",{key:"months-view",class:"q-date__view q-date__months flex flex-center"},n)},Years(){const t=ce.value,a=t+G,n=[],s=i=>V.value!==null&&V.value.year>i||I.value!==null&&I.value.year<i;for(let i=t;i<=a;i++){const Y=h.value.year===i;n.push(g("div",{class:"q-date__years-item flex flex-center"},[g(N,{key:"yr"+i,class:q.value.year===i?"q-date__today":null,flat:!Y,label:i,dense:!0,unelevated:Y,color:Y===!0?J.value:null,textColor:Y===!0?K.value:null,tabindex:u.value,disable:s(i),...D("yr#"+i,{onClick:()=>{qt(i)}})})]))}return g("div",{class:"q-date__view q-date__years flex flex-center"},[g("div",{class:"col-auto"},[g(N,{round:!0,dense:!0,flat:!0,icon:me.value[0],tabindex:u.value,disable:s(t),...D("y-",{onClick:()=>{ce.value-=G}})})]),g("div",{class:"q-date__years-content col self-stretch row items-center"},n),g("div",{class:"col-auto"},[g(N,{round:!0,dense:!0,flat:!0,icon:me.value[1],tabindex:u.value,disable:s(a),...D("y+",{onClick:()=>{ce.value+=G}})})])])}};function kt(t){const a={...h.value,day:t};if(e.range===!1){Ht(a,B.value);return}if(O.value===null){const n=Qe.value.find(i=>i.fill!==!0&&i.i===t);if(e.noUnset!==!0&&n.range!==void 0){He({target:a,from:n.range.from,to:n.range.to});return}if(n.selected===!0){He(a);return}const s=P(a);O.value={init:a,initHash:s,final:a,finalHash:s},d("rangeStart",W(a))}else{const n=O.value.initHash,s=P(a),i=n<=s?{from:O.value.init,to:a}:{from:a,to:O.value.init};O.value=null,pe(n===s?a:{target:a,...i}),d("rangeEnd",{from:W(i.from),to:W(i.to)})}}function Ot(t){if(O.value!==null){const a={...h.value,day:t};Object.assign(O.value,{final:a,finalHash:P(a)})}}return Object.assign(l,{setToday:Ne,setView:St,offsetCalendar:xt,setCalendarTo:xe,setEditingRange:Ct}),()=>{const t=[g("div",{class:"q-date__content col relative-position"},[g(se,{name:"q-transition--fade"},It[j.value])])],a=lt(r.default);return a!==void 0&&t.push(g("div",{class:"q-date__actions"},a)),e.name!==void 0&&e.disable!==!0&&F(t,"push"),g("div",{class:ht.value,...wt.value},[Vt(),g("div",{ref:T,class:"q-date__main col column",tabindex:-1},t)])}}});const wa={class:"row items-center justify-end"},Oa={__name:"DateInput",props:{modelValue:{type:String,default:null,required:!0},lbl_field:{type:String,required:!1,default:"Fecha"},optional:{type:Boolean,required:!1,default:!0},rangoFechaInicio:{type:String,required:!1,default:""},rangoFechaFin:{type:String,required:!1,default:""},readonly:{type:Boolean,required:!1,default:!1},autofocus:{type:Boolean,required:!1,default:!1},rules:{type:Array,required:!1,default:()=>[]}},emits:["update:modelValue"],setup(e,{emit:r}){const d=k(),l=k(null),c=r,o=e,D=y({get(){return o.modelValue},set(_){c("update:modelValue",_)}});function u(_,v,M){console.log("seleccionado",_,v,M),_&&l.value.hide()}function m(_){return!!o.rangoFechaInicio&&!!o.rangoFechaFin?_>=o.rangoFechaInicio&&_<=o.rangoFechaFin:!0}return(_,v)=>(ie(),Me(Lt,{modelValue:D.value,"onUpdate:modelValue":v[1]||(v[1]=M=>D.value=M),dense:"",outlined:"",color:"secondary",label:e.lbl_field,"lazy-rules":"",rules:e.rules,readonly:e.readonly,autofocus:e.autofocus},{append:E(()=>[z(Et,{name:"event",class:"cursor-pointer"},{default:E(()=>[z(Gt,{cover:"","transition-show":"scale","transition-hide":"scale",ref_key:"popUpDate",ref:l},{default:E(()=>[z(Ya,{modelValue:D.value,"onUpdate:modelValue":[v[0]||(v[0]=M=>D.value=M),u],events:d.value,dense:"",mask:"DD/MM/YYYY",options:m,readonly:e.readonly},{default:E(()=>[st("div",wa,[Zt(z(N,{label:"Hecho",color:"primary",flat:""},null,512),[[ta]])])]),_:1},8,["modelValue","events","readonly"])]),_:1},512)]),_:1})]),_:1},8,["modelValue","label","rules","readonly","autofocus"]))}};const Sa={class:"col"},Fa={__name:"CategoriaSelect",props:{modelValue:{type:Object,required:!1,default:()=>null},tipoAfectacion:{type:String,required:!1,default:null},readonly:{type:Boolean,required:!1,default:!1},agregar:{type:Boolean,required:!1,default:!1},rules:{type:Array,required:!1,default:()=>[]},autofocus:{type:Boolean,required:!1,default:!1},isCambiable:{type:Boolean,required:!1,default:!0}},emits:["update:modelValue"],setup(e,{emit:r}){const d=Kt();zt(()=>{o.value=u.tipoAfectacion==="A"?"1":"2"});const l=k([]),c=k(!1),o=k("1"),D=k({tipoMovimientoId:o.value}),u=e,{tipoAfectacion:m}=Rt(u),_=r;oe(m,(p,H)=>{o.value=p==="A"?"1":"2"});const v=y({get(){return o.value==="1"||o.value==="2"}});y({get(){return o.value==="2"?"Ingreso":"Gasto"}});const M=y({get(){return u.modelValue},set(p){_("update:modelValue",p)}}),A=y({get(){var p,H;return o.value?d.listaCategorias.filter(q=>q.tipoMovimientoId===o.value):(H=(p=resultadoLista.value)==null?void 0:p.listaCategorias)!=null?H:[]}}),F=y({get(){return o.value==="1"?"Ingreso":o.value==="2"?"Gasto":"Traspaso"}});function T(p,H){if(p===""){H(()=>{l.value=A.value});return}H(()=>{const q=p.toLowerCase();l.value=A.value.filter(h=>h.nombre.toLowerCase().indexOf(q)>-1)})}function Z(p){D.value={tipoMovimientoId:o.value,cuentaContable:null,cuentaDefault:null,icono:"insert_emoticon",color:"#019A9D"},c.value=!0}function C(p){console.log("categoria saved"),M.value=p,c.value=!1}return(p,H)=>(ie(),Pt(Jt,null,[st("div",Sa,[v.value?(ie(),Me(ra,{key:0,outlined:"",color:"secondary",modelValue:M.value,"onUpdate:modelValue":H[1]||(H[1]=q=>M.value=q),options:l.value,"option-label":"nombre",label:F.value,"use-input":"","fill-input":"","hide-selected":"","input-debounce":"2",onFilter:T,behavior:"menu",rules:e.rules,lazyRules:"",dense:"","map-options":"",readonly:e.readonly,autofocus:e.autofocus,clearable:""},{after:E(()=>[u.agregar?(ie(),Me(N,{key:0,color:"button-new",icon:"add",onClick:H[0]||(H[0]=q=>Z(u)),dense:"",class:"small-button",glossy:"",push:""},{default:E(()=>[z(aa,null,{default:E(()=>[Je(" Nueva Categor\xEDa ")]),_:1})]),_:1})):We("",!0)]),"no-option":E(()=>[z(na,null,{default:E(()=>[z(oa,{class:"text-grey"},{default:E(()=>[Je(" No results ")]),_:1})]),_:1})]),_:1},8,["modelValue","options","label","rules","readonly","autofocus"])):We("",!0)]),(ie(),Me(Xt,{to:"#modal"},[z(Ut,{modelValue:c.value,"onUpdate:modelValue":H[2]||(H[2]=q=>c.value=q),persistent:"","transition-show":"jump-up","transition-hide":"jump-down"},{default:E(()=>[z(ea,{"edited-item":D.value,onCategoriaSaved:C},null,8,["edited-item"])]),_:1},8,["modelValue"])]))],64))}};export{Ya as Q,Fa as _,ka as a,Oa as b};
