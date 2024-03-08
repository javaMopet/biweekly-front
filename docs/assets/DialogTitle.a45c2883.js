import{l as Ke,b9 as Qe,ba as vt,bb as mt,bc as St,m as Ft,bd as Lt,q as Tt,be as Rt,c as m,aB as Ht,g as Ue,t as y,ao as Ee,bf as Dt,aL as Pt,$ as ue,K as $t,r as L,w as me,n as G,A as Nt,bg as jt,B as Kt,C as Qt,a as gt,ar as Ut,bh as Wt,bi as rt,bj as pe,bk as Xt,bl as Yt,a1 as Ne,bm as Gt,aa as ve,y as Jt,bn as Zt,b5 as el,D as tl,aI as ll,ag as nl,aK as ul,aq as st,bo as ol,E as il,aj as al,z as rl}from"./index.20d4ad85.js";import{a as sl,Q as cl}from"./QList.5cb48b53.js";import{Q as dl}from"./QItemLabel.be9194dc.js";import{b as fl,C as vl}from"./index.804869e1.js";import{n as ct}from"./format.9422eb17.js";import{p as ml}from"./printer.c268160e.js";var Sl=Ke({name:"QField",inheritAttrs:!1,props:{...Qe,tag:{type:String,default:"label"}},emits:vt,setup(){return mt(St({requiredForAttr:!1,tagProp:!0}))}});const gl={xs:8,sm:10,md:14,lg:20,xl:24};var hl=Ke({name:"QChip",props:{...Ft,...Lt,dense:Boolean,icon:String,iconRight:String,iconRemove:String,iconSelected:String,label:[String,Number],color:String,textColor:String,modelValue:{type:Boolean,default:!0},selected:{type:Boolean,default:null},square:Boolean,outline:Boolean,clickable:Boolean,removable:Boolean,removeAriaLabel:String,tabindex:[String,Number],disable:Boolean,ripple:{type:[Boolean,Object],default:!0}},emits:["update:modelValue","update:selected","remove","click"],setup(e,{slots:r,emit:o}){const{proxy:{$q:c}}=Ue(),C=Tt(e,c),i=Rt(e,gl),p=m(()=>e.selected===!0||e.icon!==void 0),S=m(()=>e.selected===!0?e.iconSelected||c.iconSet.chip.selected:e.icon),v=m(()=>e.iconRemove||c.iconSet.chip.remove),A=m(()=>e.disable===!1&&(e.clickable===!0||e.selected!==null)),s=m(()=>{const f=e.outline===!0&&e.color||e.textColor;return"q-chip row inline no-wrap items-center"+(e.outline===!1&&e.color!==void 0?` bg-${e.color}`:"")+(f?` text-${f} q-chip--colored`:"")+(e.disable===!0?" disabled":"")+(e.dense===!0?" q-chip--dense":"")+(e.outline===!0?" q-chip--outline":"")+(e.selected===!0?" q-chip--selected":"")+(A.value===!0?" q-chip--clickable cursor-pointer non-selectable q-hoverable":"")+(e.square===!0?" q-chip--square":"")+(C.value===!0?" q-chip--dark q-dark":"")}),w=m(()=>{const f=e.disable===!0?{tabindex:-1,"aria-disabled":"true"}:{tabindex:e.tabindex||0},D={...f,role:"button","aria-hidden":"false","aria-label":e.removeAriaLabel||c.lang.label.remove};return{chip:f,remove:D}});function k(f){f.keyCode===13&&x(f)}function x(f){e.disable||(o("update:selected",!e.selected),o("click",f))}function I(f){(f.keyCode===void 0||f.keyCode===13)&&(ue(f),e.disable===!1&&(o("update:modelValue",!1),o("remove")))}function H(){const f=[];A.value===!0&&f.push(y("div",{class:"q-focus-helper"})),p.value===!0&&f.push(y(Ee,{class:"q-chip__icon q-chip__icon--left",name:S.value}));const D=e.label!==void 0?[y("div",{class:"ellipsis"},[e.label])]:void 0;return f.push(y("div",{class:"q-chip__content col row no-wrap items-center q-anchor--skip"},Dt(r.default,D))),e.iconRight&&f.push(y(Ee,{class:"q-chip__icon q-chip__icon--right",name:e.iconRight})),e.removable===!0&&f.push(y(Ee,{class:"q-chip__icon q-chip__icon--remove cursor-pointer",name:v.value,...w.value.remove,onClick:I,onKeyup:I})),f}return()=>{if(e.modelValue===!1)return;const f={class:s.value,style:i.value};return A.value===!0&&Object.assign(f,w.value.chip,{onClick:x,onKeyup:k}),Ht("div",f,H(),"ripple",e.ripple!==!1&&e.disable!==!0,()=>[[Pt,e.ripple]])}}});let Fe=!1;{const e=document.createElement("div");e.setAttribute("dir","rtl"),Object.assign(e.style,{width:"1px",height:"1px",overflow:"auto"});const r=document.createElement("div");Object.assign(r.style,{width:"1000px",height:"1px"}),document.body.appendChild(e),e.appendChild(r),e.scrollLeft=-1e3,Fe=e.scrollLeft>=0,e.remove()}const j=1e3,bl=["start","center","end","start-force","center-force","end-force"],ht=Array.prototype.filter,yl=window.getComputedStyle(document.body).overflowAnchor===void 0?$t:function(e,r){e!==null&&(e._qOverflowAnimationFrame!==void 0&&cancelAnimationFrame(e._qOverflowAnimationFrame),e._qOverflowAnimationFrame=requestAnimationFrame(()=>{if(e===null)return;e._qOverflowAnimationFrame=void 0;const o=e.children||[];ht.call(o,C=>C.dataset&&C.dataset.qVsAnchor!==void 0).forEach(C=>{delete C.dataset.qVsAnchor});const c=o[r];c&&c.dataset&&(c.dataset.qVsAnchor="")}))};function Se(e,r){return e+r}function je(e,r,o,c,C,i,p,S){const v=e===window?document.scrollingElement||document.documentElement:e,A=C===!0?"offsetWidth":"offsetHeight",s={scrollStart:0,scrollViewSize:-p-S,scrollMaxSize:0,offsetStart:-p,offsetEnd:-S};if(C===!0?(e===window?(s.scrollStart=window.pageXOffset||window.scrollX||document.body.scrollLeft||0,s.scrollViewSize+=document.documentElement.clientWidth):(s.scrollStart=v.scrollLeft,s.scrollViewSize+=v.clientWidth),s.scrollMaxSize=v.scrollWidth,i===!0&&(s.scrollStart=(Fe===!0?s.scrollMaxSize-s.scrollViewSize:0)-s.scrollStart)):(e===window?(s.scrollStart=window.pageYOffset||window.scrollY||document.body.scrollTop||0,s.scrollViewSize+=document.documentElement.clientHeight):(s.scrollStart=v.scrollTop,s.scrollViewSize+=v.clientHeight),s.scrollMaxSize=v.scrollHeight),o!==null)for(let w=o.previousElementSibling;w!==null;w=w.previousElementSibling)w.classList.contains("q-virtual-scroll--skip")===!1&&(s.offsetStart+=w[A]);if(c!==null)for(let w=c.nextElementSibling;w!==null;w=w.nextElementSibling)w.classList.contains("q-virtual-scroll--skip")===!1&&(s.offsetEnd+=w[A]);if(r!==e){const w=v.getBoundingClientRect(),k=r.getBoundingClientRect();C===!0?(s.offsetStart+=k.left-w.left,s.offsetEnd-=k.width):(s.offsetStart+=k.top-w.top,s.offsetEnd-=k.height),e!==window&&(s.offsetStart+=s.scrollStart),s.offsetEnd+=s.scrollMaxSize-s.offsetStart}return s}function dt(e,r,o,c){r==="end"&&(r=(e===window?document.body:e)[o===!0?"scrollWidth":"scrollHeight"]),e===window?o===!0?(c===!0&&(r=(Fe===!0?document.body.scrollWidth-document.documentElement.clientWidth:0)-r),window.scrollTo(r,window.pageYOffset||window.scrollY||document.body.scrollTop||0)):window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,r):o===!0?(c===!0&&(r=(Fe===!0?e.scrollWidth-e.offsetWidth:0)-r),e.scrollLeft=r):e.scrollTop=r}function ke(e,r,o,c){if(o>=c)return 0;const C=r.length,i=Math.floor(o/j),p=Math.floor((c-1)/j)+1;let S=e.slice(i,p).reduce(Se,0);return o%j!==0&&(S-=r.slice(i*j,o).reduce(Se,0)),c%j!==0&&c!==C&&(S-=r.slice(c,p*j).reduce(Se,0)),S}const bt={virtualScrollSliceSize:{type:[Number,String],default:null},virtualScrollSliceRatioBefore:{type:[Number,String],default:1},virtualScrollSliceRatioAfter:{type:[Number,String],default:1},virtualScrollItemSize:{type:[Number,String],default:24},virtualScrollStickySizeStart:{type:[Number,String],default:0},virtualScrollStickySizeEnd:{type:[Number,String],default:0},tableColspan:[Number,String]},Tl=Object.keys(bt),wl={virtualScrollHorizontal:Boolean,onVirtualScroll:Function,...bt};function Vl({virtualScrollLength:e,getVirtualScrollTarget:r,getVirtualScrollEl:o,virtualScrollItemSizeComputed:c}){const C=Ue(),{props:i,emit:p,proxy:S}=C,{$q:v}=S;let A,s,w,k=[],x;const I=L(0),H=L(0),f=L({}),D=L(null),W=L(null),R=L(null),M=L({from:0,to:0}),xe=m(()=>i.tableColspan!==void 0?i.tableColspan:100);c===void 0&&(c=m(()=>i.virtualScrollItemSize));const B=m(()=>c.value+";"+i.virtualScrollHorizontal),X=m(()=>B.value+";"+i.virtualScrollSliceRatioBefore+";"+i.virtualScrollSliceRatioAfter);me(X,()=>{K()}),me(B,J);function J(){oe(s,!0)}function ge(l){oe(l===void 0?s:l)}function Z(l,a){const g=r();if(g==null||g.nodeType===8)return;const z=je(g,o(),D.value,W.value,i.virtualScrollHorizontal,v.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd);w!==z.scrollViewSize&&K(z.scrollViewSize),P(g,z,Math.min(e.value-1,Math.max(0,parseInt(l,10)||0)),0,bl.indexOf(a)>-1?a:s>-1&&l>s?"end":"start")}function _e(){const l=r();if(l==null||l.nodeType===8)return;const a=je(l,o(),D.value,W.value,i.virtualScrollHorizontal,v.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd),g=e.value-1,z=a.scrollMaxSize-a.offsetStart-a.offsetEnd-H.value;if(A===a.scrollStart)return;if(a.scrollMaxSize<=0){P(l,a,0,0);return}w!==a.scrollViewSize&&K(a.scrollViewSize),he(M.value.from);const E=Math.floor(a.scrollMaxSize-Math.max(a.scrollViewSize,a.offsetEnd)-Math.min(x[g],a.scrollViewSize/2));if(E>0&&Math.ceil(a.scrollStart)>=E){P(l,a,g,a.scrollMaxSize-a.offsetEnd-k.reduce(Se,0));return}let V=0,b=a.scrollStart-a.offsetStart,F=b;if(b<=z&&b+a.scrollViewSize>=I.value)b-=I.value,V=M.value.from,F=b;else for(let h=0;b>=k[h]&&V<g;h++)b-=k[h],V+=j;for(;b>0&&V<g;)b-=x[V],b>-a.scrollViewSize?(V++,F=b):F=x[V]+b;P(l,a,V,F)}function P(l,a,g,z,E){const V=typeof E=="string"&&E.indexOf("-force")>-1,b=V===!0?E.replace("-force",""):E,F=b!==void 0?b:"start";let h=Math.max(0,g-f.value[F]),$=h+f.value.total;$>e.value&&($=e.value,h=Math.max(0,$-f.value.total)),A=a.scrollStart;const Y=h!==M.value.from||$!==M.value.to;if(Y===!1&&b===void 0){be(g);return}const{activeElement:Ae}=document,Q=R.value;Y===!0&&Q!==null&&Q!==Ae&&Q.contains(Ae)===!0&&(Q.addEventListener("focusout",qe),setTimeout(()=>{Q!==null&&Q.removeEventListener("focusout",qe)})),yl(Q,g-h);const ze=b!==void 0?x.slice(h,g).reduce(Se,0):0;if(Y===!0){const ee=$>=M.value.from&&h<=M.value.to?M.value.to:$;M.value={from:h,to:ee},I.value=ke(k,x,0,h),H.value=ke(k,x,$,e.value),requestAnimationFrame(()=>{M.value.to!==$&&A===a.scrollStart&&(M.value={from:M.value.from,to:$},H.value=ke(k,x,$,e.value))})}requestAnimationFrame(()=>{if(A!==a.scrollStart)return;Y===!0&&he(h);const ee=x.slice(h,g).reduce(Se,0),te=ee+a.offsetStart+I.value,Ie=te+x[g];let we=te+z;if(b!==void 0){const Te=ee-ze,Ve=a.scrollStart+Te;we=V!==!0&&Ve<te&&Ie<Ve+a.scrollViewSize?Ve:b==="end"?Ie-a.scrollViewSize:te-(b==="start"?0:Math.round((a.scrollViewSize-x[g])/2))}A=we,dt(l,we,i.virtualScrollHorizontal,v.lang.rtl),be(g)})}function he(l){const a=R.value;if(a){const g=ht.call(a.children,h=>h.classList&&h.classList.contains("q-virtual-scroll--skip")===!1),z=g.length,E=i.virtualScrollHorizontal===!0?h=>h.getBoundingClientRect().width:h=>h.offsetHeight;let V=l,b,F;for(let h=0;h<z;){for(b=E(g[h]),h++;h<z&&g[h].classList.contains("q-virtual-scroll--with-prev")===!0;)b+=E(g[h]),h++;F=b-x[V],F!==0&&(x[V]+=F,k[Math.floor(V/j)]+=F),V++}}}function qe(){R.value!==null&&R.value!==void 0&&R.value.focus()}function oe(l,a){const g=1*c.value;(a===!0||Array.isArray(x)===!1)&&(x=[]);const z=x.length;x.length=e.value;for(let V=e.value-1;V>=z;V--)x[V]=g;const E=Math.floor((e.value-1)/j);k=[];for(let V=0;V<=E;V++){let b=0;const F=Math.min((V+1)*j,e.value);for(let h=V*j;h<F;h++)b+=x[h];k.push(b)}s=-1,A=void 0,I.value=ke(k,x,0,M.value.from),H.value=ke(k,x,M.value.to,e.value),l>=0?(he(M.value.from),G(()=>{Z(l)})):ie()}function K(l){if(l===void 0&&typeof window!="undefined"){const b=r();b!=null&&b.nodeType!==8&&(l=je(b,o(),D.value,W.value,i.virtualScrollHorizontal,v.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd).scrollViewSize)}w=l;const a=parseFloat(i.virtualScrollSliceRatioBefore)||0,g=parseFloat(i.virtualScrollSliceRatioAfter)||0,z=1+a+g,E=l===void 0||l<=0?1:Math.ceil(l/c.value),V=Math.max(1,E,Math.ceil((i.virtualScrollSliceSize>0?i.virtualScrollSliceSize:10)/z));f.value={total:Math.ceil(V*z),start:Math.ceil(V*a),center:Math.ceil(V*(.5+a)),end:Math.ceil(V*(1+a)),view:E}}function Le(l,a){const g=i.virtualScrollHorizontal===!0?"width":"height",z={["--q-virtual-scroll-item-"+g]:c.value+"px"};return[l==="tbody"?y(l,{class:"q-virtual-scroll__padding",key:"before",ref:D},[y("tr",[y("td",{style:{[g]:`${I.value}px`,...z},colspan:xe.value})])]):y(l,{class:"q-virtual-scroll__padding",key:"before",ref:D,style:{[g]:`${I.value}px`,...z}}),y(l,{class:"q-virtual-scroll__content",key:"content",ref:R,tabindex:-1},a.flat()),l==="tbody"?y(l,{class:"q-virtual-scroll__padding",key:"after",ref:W},[y("tr",[y("td",{style:{[g]:`${H.value}px`,...z},colspan:xe.value})])]):y(l,{class:"q-virtual-scroll__padding",key:"after",ref:W,style:{[g]:`${H.value}px`,...z}})]}function be(l){s!==l&&(i.onVirtualScroll!==void 0&&p("virtualScroll",{index:l,from:M.value.from,to:M.value.to-1,direction:l<s?"decrease":"increase",ref:S}),s=l)}K();const ie=Nt(_e,v.platform.is.ios===!0?120:35);jt(()=>{K()});let ye=!1;return Kt(()=>{ye=!0}),Qt(()=>{if(ye!==!0)return;const l=r();A!==void 0&&l!==void 0&&l!==null&&l.nodeType!==8?dt(l,A,i.virtualScrollHorizontal,v.lang.rtl):Z(s)}),gt(()=>{ie.cancel()}),Object.assign(S,{scrollTo:Z,reset:J,refresh:ge}),{virtualScrollSliceRange:M,virtualScrollSliceSizeComputed:f,setVirtualScrollSize:K,onVirtualScrollEvt:ie,localResetVirtualScroll:oe,padVirtualScroll:Le,scrollTo:Z,reset:J,refresh:ge}}const ft=e=>["add","add-unique","toggle"].includes(e),Cl=".*+?^${}()|[]\\",pl=Object.keys(Qe);var Rl=Ke({name:"QSelect",inheritAttrs:!1,props:{...wl,...Ut,...Qe,modelValue:{required:!0},multiple:Boolean,displayValue:[String,Number],displayValueHtml:Boolean,dropdownIcon:String,options:{type:Array,default:()=>[]},optionValue:[Function,String],optionLabel:[Function,String],optionDisable:[Function,String],hideSelected:Boolean,hideDropdownIcon:Boolean,fillInput:Boolean,maxValues:[Number,String],optionsDense:Boolean,optionsDark:{type:Boolean,default:null},optionsSelectedClass:String,optionsHtml:Boolean,optionsCover:Boolean,menuShrink:Boolean,menuAnchor:String,menuSelf:String,menuOffset:Array,popupContentClass:String,popupContentStyle:[String,Array,Object],useInput:Boolean,useChips:Boolean,newValueMode:{type:String,validator:ft},mapOptions:Boolean,emitValue:Boolean,inputDebounce:{type:[Number,String],default:500},inputClass:[Array,String,Object],inputStyle:[Array,String,Object],tabindex:{type:[String,Number],default:0},autocomplete:String,transitionShow:String,transitionHide:String,transitionDuration:[String,Number],behavior:{type:String,validator:e=>["default","menu","dialog"].includes(e),default:"default"},virtualScrollItemSize:{type:[Number,String],default:void 0},onNewValue:Function,onFilter:Function},emits:[...vt,"add","remove","inputValue","newValue","keyup","keypress","keydown","filterAbort"],setup(e,{slots:r,emit:o}){const{proxy:c}=Ue(),{$q:C}=c,i=L(!1),p=L(!1),S=L(-1),v=L(""),A=L(!1),s=L(!1);let w=null,k=null,x,I,H,f=null,D,W,R,M;const xe=L(null),B=L(null),X=L(null),J=L(null),ge=L(null),Z=Wt(e),_e=Gt(nt),P=m(()=>Array.isArray(e.options)?e.options.length:0),he=m(()=>e.virtualScrollItemSize===void 0?e.optionsDense===!0?24:48:e.virtualScrollItemSize),{virtualScrollSliceRange:qe,virtualScrollSliceSizeComputed:oe,localResetVirtualScroll:K,padVirtualScroll:Le,onVirtualScrollEvt:be,scrollTo:ie,setVirtualScrollSize:ye}=Vl({virtualScrollLength:P,getVirtualScrollTarget:Ct,getVirtualScrollEl:tt,virtualScrollItemSizeComputed:he}),l=St(),a=m(()=>{const t=e.mapOptions===!0&&e.multiple!==!0,u=e.modelValue!==void 0&&(e.modelValue!==null||t===!0)?e.multiple===!0&&Array.isArray(e.modelValue)?e.modelValue:[e.modelValue]:[];if(e.mapOptions===!0&&Array.isArray(e.options)===!0){const n=e.mapOptions===!0&&x!==void 0?x:[],d=u.map(q=>Vt(q,n));return e.modelValue===null&&t===!0?d.filter(q=>q!==null):d}return u}),g=m(()=>{const t={};return pl.forEach(u=>{const n=e[u];n!==void 0&&(t[u]=n)}),t}),z=m(()=>e.optionsDark===null?l.isDark.value:e.optionsDark),E=m(()=>rt(a.value)),V=m(()=>{let t="q-field__input q-placeholder col";return e.hideSelected===!0||a.value.length===0?[t,e.inputClass]:(t+=" q-field__input--padding",e.inputClass===void 0?t:[t,e.inputClass])}),b=m(()=>(e.virtualScrollHorizontal===!0?"q-virtual-scroll--horizontal":"")+(e.popupContentClass?" "+e.popupContentClass:"")),F=m(()=>P.value===0),h=m(()=>a.value.map(t=>N.value(t)).join(", ")),$=m(()=>e.displayValue!==void 0?e.displayValue:h.value),Y=m(()=>e.optionsHtml===!0?()=>!0:t=>t!=null&&t.html===!0),Ae=m(()=>e.displayValueHtml===!0||e.displayValue===void 0&&(e.optionsHtml===!0||a.value.some(Y.value))),Q=m(()=>l.focused.value===!0?e.tabindex:-1),ze=m(()=>{const t={tabindex:e.tabindex,role:"combobox","aria-label":e.label,"aria-readonly":e.readonly===!0?"true":"false","aria-autocomplete":e.useInput===!0?"list":"none","aria-expanded":i.value===!0?"true":"false","aria-controls":`${l.targetUid.value}_lb`};return S.value>=0&&(t["aria-activedescendant"]=`${l.targetUid.value}_${S.value}`),t}),ee=m(()=>({id:`${l.targetUid.value}_lb`,role:"listbox","aria-multiselectable":e.multiple===!0?"true":"false"})),te=m(()=>a.value.map((t,u)=>({index:u,opt:t,html:Y.value(t),selected:!0,removeAtIndex:wt,toggleOption:le,tabindex:Q.value}))),Ie=m(()=>{if(P.value===0)return[];const{from:t,to:u}=qe.value;return e.options.slice(t,u).map((n,d)=>{const q=ae.value(n)===!0,_=De(n)===!0,T=t+d,O={clickable:!0,active:_,activeClass:Ve.value,manualFocus:!0,focused:!1,disable:q,tabindex:-1,dense:e.optionsDense,dark:z.value,role:"option","aria-selected":_===!0?"true":"false",id:`${l.targetUid.value}_${T}`,onClick:()=>{le(n)}};return q!==!0&&(S.value===T&&(O.focused=!0),C.platform.is.desktop===!0&&(O.onMousemove=()=>{i.value===!0&&re(T)})),{index:T,opt:n,html:Y.value(n),label:N.value(n),selected:O.active,focused:O.focused,toggleOption:le,setOptionIndex:re,itemProps:O}})}),we=m(()=>e.dropdownIcon!==void 0?e.dropdownIcon:C.iconSet.arrow.dropdown),Te=m(()=>e.optionsCover===!1&&e.outlined!==!0&&e.standout!==!0&&e.borderless!==!0&&e.rounded!==!0),Ve=m(()=>e.optionsSelectedClass!==void 0?e.optionsSelectedClass:e.color!==void 0?`text-${e.color}`:""),U=m(()=>He(e.optionValue,"value")),N=m(()=>He(e.optionLabel,"label")),ae=m(()=>He(e.optionDisable,"disable")),Oe=m(()=>a.value.map(t=>U.value(t))),yt=m(()=>{const t={onInput:nt,onChange:_e,onKeydown:et,onKeyup:Je,onKeypress:Ze,onFocus:Ye,onClick(u){I===!0&&ve(u)}};return t.onCompositionstart=t.onCompositionupdate=t.onCompositionend=_e,t});me(a,t=>{x=t,e.useInput===!0&&e.fillInput===!0&&e.multiple!==!0&&l.innerLoading.value!==!0&&(p.value!==!0&&i.value!==!0||E.value!==!0)&&(H!==!0&&fe(),(p.value===!0||i.value===!0)&&se(""))},{immediate:!0}),me(()=>e.fillInput,fe),me(i,Pe),me(P,Et);function We(t){return e.emitValue===!0?U.value(t):t}function Re(t){if(t>-1&&t<a.value.length)if(e.multiple===!0){const u=e.modelValue.slice();o("remove",{index:t,value:u.splice(t,1)[0]}),o("update:modelValue",u)}else o("update:modelValue",null)}function wt(t){Re(t),l.focus()}function Xe(t,u){const n=We(t);if(e.multiple!==!0){e.fillInput===!0&&Ce(N.value(t),!0,!0),o("update:modelValue",n);return}if(a.value.length===0){o("add",{index:0,value:n}),o("update:modelValue",e.multiple===!0?[n]:n);return}if(u===!0&&De(t)===!0||e.maxValues!==void 0&&e.modelValue.length>=e.maxValues)return;const d=e.modelValue.slice();o("add",{index:d.length,value:n}),d.push(n),o("update:modelValue",d)}function le(t,u){if(l.editable.value!==!0||t===void 0||ae.value(t)===!0)return;const n=U.value(t);if(e.multiple!==!0){u!==!0&&(Ce(e.fillInput===!0?N.value(t):"",!0,!0),ne()),B.value!==null&&B.value.focus(),(a.value.length===0||pe(U.value(a.value[0]),n)!==!0)&&o("update:modelValue",e.emitValue===!0?n:t);return}if((I!==!0||A.value===!0)&&l.focus(),Ye(),a.value.length===0){const _=e.emitValue===!0?n:t;o("add",{index:0,value:_}),o("update:modelValue",e.multiple===!0?[_]:_);return}const d=e.modelValue.slice(),q=Oe.value.findIndex(_=>pe(_,n));if(q>-1)o("remove",{index:q,value:d.splice(q,1)[0]});else{if(e.maxValues!==void 0&&d.length>=e.maxValues)return;const _=e.emitValue===!0?n:t;o("add",{index:d.length,value:_}),d.push(_)}o("update:modelValue",d)}function re(t){if(C.platform.is.desktop!==!0)return;const u=t>-1&&t<P.value?t:-1;S.value!==u&&(S.value=u)}function Me(t=1,u){if(i.value===!0){let n=S.value;do n=ct(n+t,-1,P.value-1);while(n!==-1&&n!==S.value&&ae.value(e.options[n])===!0);S.value!==n&&(re(n),ie(n),u!==!0&&e.useInput===!0&&e.fillInput===!0&&Be(n>=0?N.value(e.options[n]):D,!0))}}function Vt(t,u){const n=d=>pe(U.value(d),t);return e.options.find(n)||u.find(n)||t}function He(t,u){const n=t!==void 0?t:u;return typeof n=="function"?n:d=>d!==null&&typeof d=="object"&&n in d?d[n]:d}function De(t){const u=U.value(t);return Oe.value.find(n=>pe(n,u))!==void 0}function Ye(t){e.useInput===!0&&B.value!==null&&(t===void 0||B.value===t.target&&t.target.value===h.value)&&B.value.select()}function Ge(t){Jt(t,27)===!0&&i.value===!0&&(ve(t),ne(),fe()),o("keyup",t)}function Je(t){const{value:u}=t.target;if(t.keyCode!==void 0){Ge(t);return}if(t.target.value="",w!==null&&(clearTimeout(w),w=null),k!==null&&(clearTimeout(k),k=null),fe(),typeof u=="string"&&u.length!==0){const n=u.toLocaleLowerCase(),d=_=>{const T=e.options.find(O=>_.value(O).toLocaleLowerCase()===n);return T===void 0?!1:(a.value.indexOf(T)===-1?le(T):ne(),!0)},q=_=>{d(U)!==!0&&(d(N)===!0||_===!0||se(u,!0,()=>q(!0)))};q()}else l.clearValue(t)}function Ze(t){o("keypress",t)}function et(t){if(o("keydown",t),Zt(t)===!0)return;const u=v.value.length!==0&&(e.newValueMode!==void 0||e.onNewValue!==void 0),n=t.shiftKey!==!0&&e.multiple!==!0&&(S.value>-1||u===!0);if(t.keyCode===27){Ne(t);return}if(t.keyCode===9&&n===!1){ce();return}if(t.target===void 0||t.target.id!==l.targetUid.value||l.editable.value!==!0)return;if(t.keyCode===40&&l.innerLoading.value!==!0&&i.value===!1){ue(t),de();return}if(t.keyCode===8&&(e.useChips===!0||e.clearable===!0)&&e.hideSelected!==!0&&v.value.length===0){e.multiple===!0&&Array.isArray(e.modelValue)===!0?Re(e.modelValue.length-1):e.multiple!==!0&&e.modelValue!==null&&o("update:modelValue",null);return}(t.keyCode===35||t.keyCode===36)&&(typeof v.value!="string"||v.value.length===0)&&(ue(t),S.value=-1,Me(t.keyCode===36?1:-1,e.multiple)),(t.keyCode===33||t.keyCode===34)&&oe.value!==void 0&&(ue(t),S.value=Math.max(-1,Math.min(P.value,S.value+(t.keyCode===33?-1:1)*oe.value.view)),Me(t.keyCode===33?1:-1,e.multiple)),(t.keyCode===38||t.keyCode===40)&&(ue(t),Me(t.keyCode===38?-1:1,e.multiple));const d=P.value;if((R===void 0||M<Date.now())&&(R=""),d>0&&e.useInput!==!0&&t.key!==void 0&&t.key.length===1&&t.altKey===!1&&t.ctrlKey===!1&&t.metaKey===!1&&(t.keyCode!==32||R.length!==0)){i.value!==!0&&de(t);const q=t.key.toLocaleLowerCase(),_=R.length===1&&R[0]===q;M=Date.now()+1500,_===!1&&(ue(t),R+=q);const T=new RegExp("^"+R.split("").map($e=>Cl.indexOf($e)>-1?"\\"+$e:$e).join(".*"),"i");let O=S.value;if(_===!0||O<0||T.test(N.value(e.options[O]))!==!0)do O=ct(O+1,-1,d-1);while(O!==S.value&&(ae.value(e.options[O])===!0||T.test(N.value(e.options[O]))!==!0));S.value!==O&&G(()=>{re(O),ie(O),O>=0&&e.useInput===!0&&e.fillInput===!0&&Be(N.value(e.options[O]),!0)});return}if(!(t.keyCode!==13&&(t.keyCode!==32||e.useInput===!0||R!=="")&&(t.keyCode!==9||n===!1))){if(t.keyCode!==9&&ue(t),S.value>-1&&S.value<d){le(e.options[S.value]);return}if(u===!0){const q=(_,T)=>{if(T){if(ft(T)!==!0)return}else T=e.newValueMode;if(Ce("",e.multiple!==!0,!0),_==null)return;(T==="toggle"?le:Xe)(_,T==="add-unique"),e.multiple!==!0&&(B.value!==null&&B.value.focus(),ne())};if(e.onNewValue!==void 0?o("newValue",v.value,q):q(v.value),e.multiple!==!0)return}i.value===!0?ce():l.innerLoading.value!==!0&&de()}}function tt(){return I===!0?ge.value:X.value!==null&&X.value.contentEl!==null?X.value.contentEl:void 0}function Ct(){return tt()}function pt(){return e.hideSelected===!0?[]:r["selected-item"]!==void 0?te.value.map(t=>r["selected-item"](t)).slice():r.selected!==void 0?[].concat(r.selected()):e.useChips===!0?te.value.map((t,u)=>y(hl,{key:"option-"+u,removable:l.editable.value===!0&&ae.value(t.opt)!==!0,dense:!0,textColor:e.color,tabindex:Q.value,onRemove(){t.removeAtIndex(u)}},()=>y("span",{class:"ellipsis",[t.html===!0?"innerHTML":"textContent"]:N.value(t.opt)}))):[y("span",{[Ae.value===!0?"innerHTML":"textContent"]:$.value})]}function lt(){if(F.value===!0)return r["no-option"]!==void 0?r["no-option"]({inputValue:v.value}):void 0;const t=r.option!==void 0?r.option:n=>y(cl,{key:n.index,...n.itemProps},()=>y(sl,()=>y(dl,()=>y("span",{[n.html===!0?"innerHTML":"textContent"]:n.label}))));let u=Le("div",Ie.value.map(t));return r["before-options"]!==void 0&&(u=r["before-options"]().concat(u)),tl(r["after-options"],u)}function kt(t,u){const n=u===!0?{...ze.value,...l.splitAttrs.attributes.value}:void 0,d={ref:u===!0?B:void 0,key:"i_t",class:V.value,style:e.inputStyle,value:v.value!==void 0?v.value:"",type:"search",...n,id:u===!0?l.targetUid.value:void 0,maxlength:e.maxlength,autocomplete:e.autocomplete,"data-autofocus":t===!0||e.autofocus===!0||void 0,disabled:e.disable===!0,readonly:e.readonly===!0,...yt.value};return t!==!0&&I===!0&&(Array.isArray(d.class)===!0?d.class=[...d.class,"no-pointer-events"]:d.class+=" no-pointer-events"),y("input",d)}function nt(t){w!==null&&(clearTimeout(w),w=null),k!==null&&(clearTimeout(k),k=null),!(t&&t.target&&t.target.qComposing===!0)&&(Be(t.target.value||""),H=!0,D=v.value,l.focused.value!==!0&&(I!==!0||A.value===!0)&&l.focus(),e.onFilter!==void 0&&(w=setTimeout(()=>{w=null,se(v.value)},e.inputDebounce)))}function Be(t,u){v.value!==t&&(v.value=t,u===!0||e.inputDebounce===0||e.inputDebounce==="0"?o("inputValue",t):k=setTimeout(()=>{k=null,o("inputValue",t)},e.inputDebounce))}function Ce(t,u,n){H=n!==!0,e.useInput===!0&&(Be(t,!0),(u===!0||n!==!0)&&(D=t),u!==!0&&se(t))}function se(t,u,n){if(e.onFilter===void 0||u!==!0&&l.focused.value!==!0)return;l.innerLoading.value===!0?o("filterAbort"):(l.innerLoading.value=!0,s.value=!0),t!==""&&e.multiple!==!0&&a.value.length!==0&&H!==!0&&t===N.value(a.value[0])&&(t="");const d=setTimeout(()=>{i.value===!0&&(i.value=!1)},10);f!==null&&clearTimeout(f),f=d,o("filter",t,(q,_)=>{(u===!0||l.focused.value===!0)&&f===d&&(clearTimeout(f),typeof q=="function"&&q(),s.value=!1,G(()=>{l.innerLoading.value=!1,l.editable.value===!0&&(u===!0?i.value===!0&&ne():i.value===!0?Pe(!0):i.value=!0),typeof _=="function"&&G(()=>{_(c)}),typeof n=="function"&&G(()=>{n(c)})}))},()=>{l.focused.value===!0&&f===d&&(clearTimeout(f),l.innerLoading.value=!1,s.value=!1),i.value===!0&&(i.value=!1)})}function xt(){return y(fl,{ref:X,class:b.value,style:e.popupContentStyle,modelValue:i.value,fit:e.menuShrink!==!0,cover:e.optionsCover===!0&&F.value!==!0&&e.useInput!==!0,anchor:e.menuAnchor,self:e.menuSelf,offset:e.menuOffset,dark:z.value,noParentEvent:!0,noRefocus:!0,noFocus:!0,square:Te.value,transitionShow:e.transitionShow,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,separateClosePopup:!0,...ee.value,onScrollPassive:be,onBeforeShow:ot,onBeforeHide:_t,onShow:qt},lt)}function _t(t){it(t),ce()}function qt(){ye()}function At(t){ve(t),B.value!==null&&B.value.focus(),A.value=!0,window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,0)}function zt(t){ve(t),G(()=>{A.value=!1})}function It(){const t=[y(Sl,{class:`col-auto ${l.fieldClass.value}`,...g.value,for:l.targetUid.value,dark:z.value,square:!0,loading:s.value,itemAligned:!1,filled:!0,stackLabel:v.value.length!==0,...l.splitAttrs.listeners.value,onFocus:At,onBlur:zt},{...r,rawControl:()=>l.getControl(!0),before:void 0,after:void 0})];return i.value===!0&&t.push(y("div",{ref:ge,class:b.value+" scroll",style:e.popupContentStyle,...ee.value,onClick:Ne,onScrollPassive:be},lt())),y(el,{ref:J,modelValue:p.value,position:e.useInput===!0?"top":void 0,transitionShow:W,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,onBeforeShow:ot,onBeforeHide:Ot,onHide:Mt,onShow:Bt},()=>y("div",{class:"q-select__dialog"+(z.value===!0?" q-select__dialog--dark q-dark":"")+(A.value===!0?" q-select__dialog--focused":"")},t))}function Ot(t){it(t),J.value!==null&&J.value.__updateRefocusTarget(l.rootRef.value.querySelector(".q-field__native > [tabindex]:last-child")),l.focused.value=!1}function Mt(t){ne(),l.focused.value===!1&&o("blur",t),fe()}function Bt(){const t=document.activeElement;(t===null||t.id!==l.targetUid.value)&&B.value!==null&&B.value!==t&&B.value.focus(),ye()}function ce(){p.value!==!0&&(S.value=-1,i.value===!0&&(i.value=!1),l.focused.value===!1&&(f!==null&&(clearTimeout(f),f=null),l.innerLoading.value===!0&&(o("filterAbort"),l.innerLoading.value=!1,s.value=!1)))}function de(t){l.editable.value===!0&&(I===!0?(l.onControlFocusin(t),p.value=!0,G(()=>{l.focus()})):l.focus(),e.onFilter!==void 0?se(v.value):(F.value!==!0||r["no-option"]!==void 0)&&(i.value=!0))}function ne(){p.value=!1,ce()}function fe(){e.useInput===!0&&Ce(e.multiple!==!0&&e.fillInput===!0&&a.value.length!==0&&N.value(a.value[0])||"",!0,!0)}function Pe(t){let u=-1;if(t===!0){if(a.value.length!==0){const n=U.value(a.value[0]);u=e.options.findIndex(d=>pe(U.value(d),n))}K(u)}re(u)}function Et(t,u){i.value===!0&&l.innerLoading.value===!1&&(K(-1,!0),G(()=>{i.value===!0&&l.innerLoading.value===!1&&(t>u?K():Pe(!0))}))}function ut(){p.value===!1&&X.value!==null&&X.value.updatePosition()}function ot(t){t!==void 0&&ve(t),o("popupShow",t),l.hasPopupOpen=!0,l.onControlFocusin(t)}function it(t){t!==void 0&&ve(t),o("popupHide",t),l.hasPopupOpen=!1,l.onControlFocusout(t)}function at(){I=C.platform.is.mobile!==!0&&e.behavior!=="dialog"?!1:e.behavior!=="menu"&&(e.useInput===!0?r["no-option"]!==void 0||e.onFilter!==void 0||F.value===!1:!0),W=C.platform.is.ios===!0&&I===!0&&e.useInput===!0?"fade":e.transitionShow}return Xt(at),Yt(ut),at(),gt(()=>{w!==null&&clearTimeout(w),k!==null&&clearTimeout(k)}),Object.assign(c,{showPopup:de,hidePopup:ne,removeAtIndex:Re,add:Xe,toggleOption:le,getOptionIndex:()=>S.value,setOptionIndex:re,moveOptionSelection:Me,filter:se,updateMenuPosition:ut,updateInputValue:Ce,isOptionSelected:De,getEmittingOptionValue:We,isOptionDisabled:(...t)=>ae.value.apply(null,t)===!0,getOptionValue:(...t)=>U.value.apply(null,t),getOptionLabel:(...t)=>N.value.apply(null,t)}),Object.assign(l,{innerValue:a,fieldClass:m(()=>`q-select q-field--auto-height q-select--with${e.useInput!==!0?"out":""}-input q-select--with${e.useChips!==!0?"out":""}-chips q-select--${e.multiple===!0?"multiple":"single"}`),inputRef:xe,targetRef:B,hasValue:E,showPopup:de,floatingLabel:m(()=>e.hideSelected!==!0&&E.value===!0||typeof v.value=="number"||v.value.length!==0||rt(e.displayValue)),getControlChild:()=>{if(l.editable.value!==!1&&(p.value===!0||F.value!==!0||r["no-option"]!==void 0))return I===!0?It():xt();l.hasPopupOpen===!0&&(l.hasPopupOpen=!1)},controlEvents:{onFocusin(t){l.onControlFocusin(t)},onFocusout(t){l.onControlFocusout(t,()=>{fe(),ce()})},onClick(t){if(Ne(t),I!==!0&&i.value===!0){ce(),B.value!==null&&B.value.focus();return}de(t)}},getControl:t=>{const u=pt(),n=t===!0||p.value!==!0||I!==!0;if(e.useInput===!0)u.push(kt(t,n));else if(l.editable.value===!0){const q=n===!0?ze.value:void 0;u.push(y("input",{ref:n===!0?B:void 0,key:"d_t",class:"q-select__focus-target",id:n===!0?l.targetUid.value:void 0,value:$.value,readonly:!0,"data-autofocus":t===!0||e.autofocus===!0||void 0,...q,onKeydown:et,onKeyup:Ge,onKeypress:Ze})),n===!0&&typeof e.autocomplete=="string"&&e.autocomplete.length!==0&&u.push(y("input",{class:"q-select__autocomplete-input",autocomplete:e.autocomplete,tabindex:-1,onKeyup:Je}))}if(Z.value!==void 0&&e.disable!==!0&&Oe.value.length!==0){const q=Oe.value.map(_=>y("option",{value:_,selected:!0}));u.push(y("select",{class:"hidden",name:Z.value,multiple:e.multiple},q))}const d=e.useInput===!0||n!==!0?void 0:l.splitAttrs.attributes.value;return y("div",{class:"q-field__native row items-center",...d,...l.splitAttrs.listeners.value},u)},getInnerAppend:()=>e.loading!==!0&&s.value!==!0&&e.hideDropdownIcon!==!0?[y(Ee,{class:"q-select__dropdown-icon"+(i.value===!0?" rotate-180":""),name:we.value})]:null}),mt(l)}});function kl(e){const r=[],{graphQLErrors:o,networkError:c}=e,C="operation"in e?e.operation:void 0,i="stack"in e?e.stack:void 0;let p;return C&&(p=ml(C.query)),o&&o.forEach(({message:S,locations:v})=>{r.push(`[GraphQL error] ${S}`),C&&(r.push(xl(p,v)),Object.keys(C.variables).length&&r.push(`with variables: ${JSON.stringify(C.variables,null,2)}`))}),c&&r.push(`[Network error] ${c}`),i&&r.push(i),r}function Hl(e,r=!0){if(kl(e).forEach(o=>{const c=/\[([\w ]*)](.*)/.exec(o);if(c){const[,C,i]=c;console.log(`%c${C}`,"color:white;border-radius:3px;background:#ff4400;font-weight:bold;padding:2px 6px;",i)}else console.log(o)}),r){let o=new Error().stack;if(o==null)return;const c=o.indexOf(`
`);o=o.slice(o.indexOf(`
`,c+1)),console.log(`%c${o}`,"color:grey;")}}function xl(e,r){const o=e.split(`
`),c=o.length,C=o.slice(),i={};for(let p=0;p<c;p++)i[p]=p;if(r)for(const{line:p,column:S}of r){const v=i[p];C.splice(v,0,"\u25B2".padStart(S," "));for(let A=v+1;A<c;A++)i[A]++}return C.join(`
`)}const _l={},ql={class:"dialog-title row fit justify-between items-center"},Al={class:"dialog-title__nombre"},zl={class:"dialog-title__buttonClose"};function Il(e,r){return nl(),ul("div",ql,[st("div",Al,[ol(e.$slots,"default",{},void 0,!0)]),st("div",zl,[il(al(rl,{icon:"close",class:"button-close",round:"",dense:"",glossy:""},null,512),[[vl]])])])}var Dl=ll(_l,[["render",Il],["__scopeId","data-v-bf546bbc"]]);export{Dl as D,Rl as Q,Vl as a,hl as b,Tl as c,Hl as l,Fe as r,wl as u};
