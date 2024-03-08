import{l as M,t as i,_ as me,az as yt,ao as Fe,g as z,m as Ce,q as ye,c as f,r as F,w as O,bg as Le,I as Ne,C as ht,B as _t,a as Ue,Z as qt,L as xe,D as Ve,bd as wt,be as Pt,bp as Tt,bq as Be,br as Se,bs as Ee,bt as Dt,n as je,bu as kt,bv as ge,bw as V,z as ee,aG as Rt,j as Me,f as $t}from"./index.20d4ad85.js";import{b as pt}from"./QList.5cb48b53.js";import{u as xt,a as Bt,c as ze,Q as Et}from"./DialogTitle.a45c2883.js";import{r as Qe,s as te}from"./index.27a31e1c.js";import{g as p}from"./index.804869e1.js";var It=M({name:"QTh",props:{props:Object,autoWidth:Boolean},emits:["click"],setup(e,{slots:l,emit:n}){const d=z(),{proxy:{$q:r}}=d,b=u=>{n("click",u)};return()=>{if(e.props===void 0)return i("th",{class:e.autoWidth===!0?"q-table--col-auto-width":"",onClick:b},me(l.default));let u,o;const s=d.vnode.key;if(s){if(u=e.props.colsMap[s],u===void 0)return}else u=e.props.col;if(u.sortable===!0){const a=u.align==="right"?"unshift":"push";o=yt(l.default,[]),o[a](i(Fe,{class:u.__iconClass,name:r.iconSet.table.arrowUp}))}else o=me(l.default);const v={class:u.__thClass+(e.autoWidth===!0?" q-table--col-auto-width":""),style:u.headerStyle,onClick:a=>{u.sortable===!0&&e.props.sort(u),b(a)}};return i("th",v,o)}}});const Ot=["horizontal","vertical","cell","none"];var At=M({name:"QMarkupTable",props:{...Ce,dense:Boolean,flat:Boolean,bordered:Boolean,square:Boolean,wrapCells:Boolean,separator:{type:String,default:"horizontal",validator:e=>Ot.includes(e)}},setup(e,{slots:l}){const n=z(),d=ye(e,n.proxy.$q),r=f(()=>`q-markup-table q-table__container q-table__card q-table--${e.separator}-separator`+(d.value===!0?" q-table--dark q-table__card--dark q-dark":"")+(e.dense===!0?" q-table--dense":"")+(e.flat===!0?" q-table--flat":"")+(e.bordered===!0?" q-table--bordered":"")+(e.square===!0?" q-table--square":"")+(e.wrapCells===!1?" q-table--no-wrap":""));return()=>i("div",{class:r.value},[i("table",{class:"q-table"},me(l.default))])}});function He(e,l){return i("div",e,[i("table",{class:"q-table"},l)])}const Ft={list:pt,table:At},Lt=["list","table","__qtable"];var Nt=M({name:"QVirtualScroll",props:{...xt,type:{type:String,default:"list",validator:e=>Lt.includes(e)},items:{type:Array,default:()=>[]},itemsFn:Function,itemsSize:Number,scrollTarget:{default:void 0}},setup(e,{slots:l,attrs:n}){let d;const r=F(null),b=f(()=>e.itemsSize>=0&&e.itemsFn!==void 0?parseInt(e.itemsSize,10):Array.isArray(e.items)?e.items.length:0),{virtualScrollSliceRange:u,localResetVirtualScroll:o,padVirtualScroll:s,onVirtualScrollEvt:v}=Bt({virtualScrollLength:b,getVirtualScrollTarget:S,getVirtualScrollEl:w}),a=f(()=>{if(b.value===0)return[];const x=(B,D)=>({index:u.value.from+D,item:B});return e.itemsFn===void 0?e.items.slice(u.value.from,u.value.to).map(x):e.itemsFn(u.value.from,u.value.to-u.value.from).map(x)}),g=f(()=>"q-virtual-scroll q-virtual-scroll"+(e.virtualScrollHorizontal===!0?"--horizontal":"--vertical")+(e.scrollTarget!==void 0?"":" scroll")),q=f(()=>e.scrollTarget!==void 0?{}:{tabindex:0});O(b,()=>{o()}),O(()=>e.scrollTarget,()=>{y(),C()});function w(){return r.value.$el||r.value}function S(){return d}function C(){d=qt(w(),e.scrollTarget),d.addEventListener("scroll",v,xe.passive)}function y(){d!==void 0&&(d.removeEventListener("scroll",v,xe.passive),d=void 0)}function k(){let x=s(e.type==="list"?"div":"tbody",a.value.map(l.default));return l.before!==void 0&&(x=l.before().concat(x)),Ve(l.after,x)}return Le(()=>{o()}),Ne(()=>{C()}),ht(()=>{C()}),_t(()=>{y()}),Ue(()=>{y()}),()=>{if(l.default===void 0){console.error("QVirtualScroll: default scoped slot is required for rendering");return}return e.type==="__qtable"?He({ref:r,class:"q-table__middle "+g.value},k()):i(Ft[e.type],{...n,ref:r,class:[n.class,g.value],...q.value},k)}}});const Ut={xs:2,sm:4,md:6,lg:10,xl:14};function Ie(e,l,n){return{transform:l===!0?`translateX(${n.lang.rtl===!0?"-":""}100%) scale3d(${-e},1,1)`:`scale3d(${e},1,1)`}}var Vt=M({name:"QLinearProgress",props:{...Ce,...wt,value:{type:Number,default:0},buffer:Number,color:String,trackColor:String,reverse:Boolean,stripe:Boolean,indeterminate:Boolean,query:Boolean,rounded:Boolean,animationSpeed:{type:[String,Number],default:2100},instantFeedback:Boolean},setup(e,{slots:l}){const{proxy:n}=z(),d=ye(e,n.$q),r=Pt(e,Ut),b=f(()=>e.indeterminate===!0||e.query===!0),u=f(()=>e.reverse!==e.query),o=f(()=>({...r.value!==null?r.value:{},"--q-linear-progress-speed":`${e.animationSpeed}ms`})),s=f(()=>"q-linear-progress"+(e.color!==void 0?` text-${e.color}`:"")+(e.reverse===!0||e.query===!0?" q-linear-progress--reverse":"")+(e.rounded===!0?" rounded-borders":"")),v=f(()=>Ie(e.buffer!==void 0?e.buffer:1,u.value,n.$q)),a=f(()=>`with${e.instantFeedback===!0?"out":""}-transition`),g=f(()=>`q-linear-progress__track absolute-full q-linear-progress__track--${a.value} q-linear-progress__track--${d.value===!0?"dark":"light"}`+(e.trackColor!==void 0?` bg-${e.trackColor}`:"")),q=f(()=>Ie(b.value===!0?1:e.value,u.value,n.$q)),w=f(()=>`q-linear-progress__model absolute-full q-linear-progress__model--${a.value} q-linear-progress__model--${b.value===!0?"in":""}determinate`),S=f(()=>({width:`${e.value*100}%`})),C=f(()=>`q-linear-progress__stripe absolute-${e.reverse===!0?"right":"left"} q-linear-progress__stripe--${a.value}`);return()=>{const y=[i("div",{class:g.value,style:v.value}),i("div",{class:w.value,style:q.value})];return e.stripe===!0&&b.value===!1&&y.push(i("div",{class:C.value,style:S.value})),i("div",{class:s.value,style:o.value,role:"progressbar","aria-valuemin":0,"aria-valuemax":1,"aria-valuenow":e.indeterminate===!0?void 0:e.value},Ve(l.default,y))}}});let j=0;const jt={fullscreen:Boolean,noRouteFullscreenExit:Boolean},Mt=["update:fullscreen","fullscreen"];function zt(){const e=z(),{props:l,emit:n,proxy:d}=e;let r,b,u;const o=F(!1);Tt(e)===!0&&O(()=>d.$route.fullPath,()=>{l.noRouteFullscreenExit!==!0&&a()}),O(()=>l.fullscreen,g=>{o.value!==g&&s()}),O(o,g=>{n("update:fullscreen",g),n("fullscreen",g)});function s(){o.value===!0?a():v()}function v(){o.value!==!0&&(o.value=!0,u=d.$el.parentNode,u.replaceChild(b,d.$el),document.body.appendChild(d.$el),j++,j===1&&document.body.classList.add("q-body--fullscreen-mixin"),r={handler:a},Be.add(r))}function a(){o.value===!0&&(r!==void 0&&(Be.remove(r),r=void 0),u.replaceChild(d.$el,b),o.value=!1,j=Math.max(0,j-1),j===0&&(document.body.classList.remove("q-body--fullscreen-mixin"),d.$el.scrollIntoView!==void 0&&setTimeout(()=>{d.$el.scrollIntoView()})))}return Le(()=>{b=document.createElement("span")}),Ne(()=>{l.fullscreen===!0&&v()}),Ue(a),Object.assign(d,{toggleFullscreen:s,setFullscreen:v,exitFullscreen:a}),{inFullscreen:o,toggleFullscreen:s}}function Qt(e,l){return new Date(e)-new Date(l)}const Ht={sortMethod:Function,binaryStateSort:Boolean,columnSortOrder:{type:String,validator:e=>e==="ad"||e==="da",default:"ad"}};function Gt(e,l,n,d){const r=f(()=>{const{sortBy:o}=l.value;return o&&n.value.find(s=>s.name===o)||null}),b=f(()=>e.sortMethod!==void 0?e.sortMethod:(o,s,v)=>{const a=n.value.find(w=>w.name===s);if(a===void 0||a.field===void 0)return o;const g=v===!0?-1:1,q=typeof a.field=="function"?w=>a.field(w):w=>w[a.field];return o.sort((w,S)=>{let C=q(w),y=q(S);return a.rawSort!==void 0?a.rawSort(C,y,w,S)*g:C==null?-1*g:y==null?1*g:a.sort!==void 0?a.sort(C,y,w,S)*g:Se(C)===!0&&Se(y)===!0?(C-y)*g:Ee(C)===!0&&Ee(y)===!0?Qt(C,y)*g:typeof C=="boolean"&&typeof y=="boolean"?(C-y)*g:([C,y]=[C,y].map(k=>(k+"").toLocaleString().toLowerCase()),C<y?-1*g:C===y?0:g)})});function u(o){let s=e.columnSortOrder;if(Dt(o)===!0)o.sortOrder&&(s=o.sortOrder),o=o.name;else{const g=n.value.find(q=>q.name===o);g!==void 0&&g.sortOrder&&(s=g.sortOrder)}let{sortBy:v,descending:a}=l.value;v!==o?(v=o,a=s==="da"):e.binaryStateSort===!0?a=!a:a===!0?s==="ad"?v=null:a=!1:s==="ad"?a=!0:v=null,d({sortBy:v,descending:a,page:1})}return{columnToSort:r,computedSortMethod:b,sort:u}}const Jt={filter:[String,Object],filterMethod:Function};function Kt(e,l){const n=f(()=>e.filterMethod!==void 0?e.filterMethod:(d,r,b,u)=>{const o=r?r.toLowerCase():"";return d.filter(s=>b.some(v=>{const a=u(v,s)+"";return(a==="undefined"||a==="null"?"":a.toLowerCase()).indexOf(o)!==-1}))});return O(()=>e.filter,()=>{je(()=>{l({page:1},!0)})},{deep:!0}),{computedFilterMethod:n}}function Wt(e,l){for(const n in l)if(l[n]!==e[n])return!1;return!0}function Oe(e){return e.page<1&&(e.page=1),e.rowsPerPage!==void 0&&e.rowsPerPage<1&&(e.rowsPerPage=0),e}const Xt={pagination:Object,rowsPerPageOptions:{type:Array,default:()=>[5,7,10,15,20,25,50,0]},"onUpdate:pagination":[Function,Array]};function Zt(e,l){const{props:n,emit:d}=e,r=F(Object.assign({sortBy:null,descending:!1,page:1,rowsPerPage:n.rowsPerPageOptions.length!==0?n.rowsPerPageOptions[0]:5},n.pagination)),b=f(()=>{const a=n["onUpdate:pagination"]!==void 0?{...r.value,...n.pagination}:r.value;return Oe(a)}),u=f(()=>b.value.rowsNumber!==void 0);function o(a){s({pagination:a,filter:n.filter})}function s(a={}){je(()=>{d("request",{pagination:a.pagination||b.value,filter:a.filter||n.filter,getCellValue:l})})}function v(a,g){const q=Oe({...b.value,...a});if(Wt(b.value,q)===!0){u.value===!0&&g===!0&&o(q);return}if(u.value===!0){o(q);return}n.pagination!==void 0&&n["onUpdate:pagination"]!==void 0?d("update:pagination",q):r.value=q}return{innerPagination:r,computedPagination:b,isServerSide:u,requestServerInteraction:s,setPagination:v}}function Yt(e,l,n,d,r,b){const{props:u,emit:o,proxy:{$q:s}}=e,v=f(()=>d.value===!0?n.value.rowsNumber||0:b.value),a=f(()=>{const{page:D,rowsPerPage:R}=n.value;return(D-1)*R}),g=f(()=>{const{page:D,rowsPerPage:R}=n.value;return D*R}),q=f(()=>n.value.page===1),w=f(()=>n.value.rowsPerPage===0?1:Math.max(1,Math.ceil(v.value/n.value.rowsPerPage))),S=f(()=>g.value===0?!0:n.value.page>=w.value),C=f(()=>(u.rowsPerPageOptions.includes(l.value.rowsPerPage)?u.rowsPerPageOptions:[l.value.rowsPerPage].concat(u.rowsPerPageOptions)).map(R=>({label:R===0?s.lang.table.allRows:""+R,value:R})));O(w,(D,R)=>{if(D===R)return;const Q=n.value.page;D&&!Q?r({page:1}):D<Q&&r({page:D})});function y(){r({page:1})}function k(){const{page:D}=n.value;D>1&&r({page:D-1})}function x(){const{page:D,rowsPerPage:R}=n.value;g.value>0&&D*R<v.value&&r({page:D+1})}function B(){r({page:w.value})}return u["onUpdate:pagination"]!==void 0&&o("update:pagination",{...n.value}),{firstRowIndex:a,lastRowIndex:g,isFirstPage:q,isLastPage:S,pagesNumber:w,computedRowsPerPageOptions:C,computedRowsNumber:v,firstPage:y,prevPage:k,nextPage:x,lastPage:B}}const ea={selection:{type:String,default:"none",validator:e=>["single","multiple","none"].includes(e)},selected:{type:Array,default:()=>[]}},ta=["update:selected","selection"];function aa(e,l,n,d){const r=f(()=>{const S={};return e.selected.map(d.value).forEach(C=>{S[C]=!0}),S}),b=f(()=>e.selection!=="none"),u=f(()=>e.selection==="single"),o=f(()=>e.selection==="multiple"),s=f(()=>n.value.length!==0&&n.value.every(S=>r.value[d.value(S)]===!0)),v=f(()=>s.value!==!0&&n.value.some(S=>r.value[d.value(S)]===!0)),a=f(()=>e.selected.length);function g(S){return r.value[S]===!0}function q(){l("update:selected",[])}function w(S,C,y,k){l("selection",{rows:C,added:y,keys:S,evt:k});const x=u.value===!0?y===!0?C:[]:y===!0?e.selected.concat(C):e.selected.filter(B=>S.includes(d.value(B))===!1);l("update:selected",x)}return{hasSelectionMode:b,singleSelection:u,multipleSelection:o,allRowsSelected:s,someRowsSelected:v,rowsSelectedNumber:a,isRowSelected:g,clearSelection:q,updateSelection:w}}function Ae(e){return Array.isArray(e)?e.slice():[]}const la={expanded:Array},na=["update:expanded"];function oa(e,l){const n=F(Ae(e.expanded));O(()=>e.expanded,u=>{n.value=Ae(u)});function d(u){return n.value.includes(u)}function r(u){e.expanded!==void 0?l("update:expanded",u):n.value=u}function b(u,o){const s=n.value.slice(),v=s.indexOf(u);o===!0?v===-1&&(s.push(u),r(s)):v!==-1&&(s.splice(v,1),r(s))}return{isRowExpanded:d,setExpanded:r,updateExpanded:b}}const ra={visibleColumns:Array};function ia(e,l,n){const d=f(()=>{if(e.columns!==void 0)return e.columns;const o=e.rows[0];return o!==void 0?Object.keys(o).map(s=>({name:s,label:s.toUpperCase(),field:s,align:Se(o[s])?"right":"left",sortable:!0})):[]}),r=f(()=>{const{sortBy:o,descending:s}=l.value;return(e.visibleColumns!==void 0?d.value.filter(a=>a.required===!0||e.visibleColumns.includes(a.name)===!0):d.value).map(a=>{const g=a.align||"right",q=`text-${g}`;return{...a,align:g,__iconClass:`q-table__sort-icon q-table__sort-icon--${g}`,__thClass:q+(a.headerClasses!==void 0?" "+a.headerClasses:"")+(a.sortable===!0?" sortable":"")+(a.name===o?` sorted ${s===!0?"sort-desc":""}`:""),__tdStyle:a.style!==void 0?typeof a.style!="function"?()=>a.style:a.style:()=>null,__tdClass:a.classes!==void 0?typeof a.classes!="function"?()=>q+" "+a.classes:w=>q+" "+a.classes(w):()=>q}})}),b=f(()=>{const o={};return r.value.forEach(s=>{o[s.name]=s}),o}),u=f(()=>e.tableColspan!==void 0?e.tableColspan:r.value.length+(n.value===!0?1:0));return{colList:d,computedCols:r,computedColsMap:b,computedColspan:u}}const ae="q-table__bottom row items-center",Ge={};ze.forEach(e=>{Ge[e]={}});var _a=M({name:"QTable",props:{rows:{type:Array,default:()=>[]},rowKey:{type:[String,Function],default:"id"},columns:Array,loading:Boolean,iconFirstPage:String,iconPrevPage:String,iconNextPage:String,iconLastPage:String,title:String,hideHeader:Boolean,grid:Boolean,gridHeader:Boolean,dense:Boolean,flat:Boolean,bordered:Boolean,square:Boolean,separator:{type:String,default:"horizontal",validator:e=>["horizontal","vertical","cell","none"].includes(e)},wrapCells:Boolean,virtualScroll:Boolean,virtualScrollTarget:{default:void 0},...Ge,noDataLabel:String,noResultsLabel:String,loadingLabel:String,selectedRowsLabel:Function,rowsPerPageLabel:String,paginationLabel:Function,color:{type:String,default:"grey-8"},titleClass:[String,Array,Object],tableStyle:[String,Array,Object],tableClass:[String,Array,Object],tableHeaderStyle:[String,Array,Object],tableHeaderClass:[String,Array,Object],cardContainerClass:[String,Array,Object],cardContainerStyle:[String,Array,Object],cardStyle:[String,Array,Object],cardClass:[String,Array,Object],hideBottom:Boolean,hideSelectedBanner:Boolean,hideNoData:Boolean,hidePagination:Boolean,onRowClick:Function,onRowDblclick:Function,onRowContextmenu:Function,...Ce,...jt,...ra,...Jt,...Xt,...la,...ea,...Ht},emits:["request","virtualScroll",...Mt,...na,...ta],setup(e,{slots:l,emit:n}){const d=z(),{proxy:{$q:r}}=d,b=ye(e,r),{inFullscreen:u,toggleFullscreen:o}=zt(),s=f(()=>typeof e.rowKey=="function"?e.rowKey:t=>t[e.rowKey]),v=F(null),a=F(null),g=f(()=>e.grid!==!0&&e.virtualScroll===!0),q=f(()=>" q-table__card"+(b.value===!0?" q-table__card--dark q-dark":"")+(e.square===!0?" q-table--square":"")+(e.flat===!0?" q-table--flat":"")+(e.bordered===!0?" q-table--bordered":"")),w=f(()=>`q-table__container q-table--${e.separator}-separator column no-wrap`+(e.grid===!0?" q-table--grid":q.value)+(b.value===!0?" q-table--dark":"")+(e.dense===!0?" q-table--dense":"")+(e.wrapCells===!1?" q-table--no-wrap":"")+(u.value===!0?" fullscreen scroll":"")),S=f(()=>w.value+(e.loading===!0?" q-table--loading":""));O(()=>e.tableStyle+e.tableClass+e.tableHeaderStyle+e.tableHeaderClass+w.value,()=>{g.value===!0&&a.value!==null&&a.value.reset()});const{innerPagination:C,computedPagination:y,isServerSide:k,requestServerInteraction:x,setPagination:B}=Zt(d,N),{computedFilterMethod:D}=Kt(e,B),{isRowExpanded:R,setExpanded:Q,updateExpanded:Je}=oa(e,n),le=f(()=>{let t=e.rows;if(k.value===!0||t.length===0)return t;const{sortBy:c,descending:m}=y.value;return e.filter&&(t=D.value(t,e.filter,E.value,N)),Ye.value!==null&&(t=et.value(e.rows===t?t.slice():t,c,m)),t}),he=f(()=>le.value.length),A=f(()=>{let t=le.value;if(k.value===!0)return t;const{rowsPerPage:c}=y.value;return c!==0&&(G.value===0&&e.rows!==t?t.length>J.value&&(t=t.slice(0,J.value)):t=t.slice(G.value,J.value)),t}),{hasSelectionMode:L,singleSelection:Ke,multipleSelection:_e,allRowsSelected:We,someRowsSelected:qe,rowsSelectedNumber:ne,isRowSelected:oe,clearSelection:Xe,updateSelection:H}=aa(e,n,A,s),{colList:Ze,computedCols:E,computedColsMap:we,computedColspan:Pe}=ia(e,y,L),{columnToSort:Ye,computedSortMethod:et,sort:re}=Gt(e,y,Ze,B),{firstRowIndex:G,lastRowIndex:J,isFirstPage:ie,isLastPage:ue,pagesNumber:K,computedRowsPerPageOptions:tt,computedRowsNumber:W,firstPage:se,prevPage:ce,nextPage:de,lastPage:ve}=Yt(d,C,y,k,B,he),at=f(()=>A.value.length===0),lt=f(()=>{const t={};return ze.forEach(c=>{t[c]=e[c]}),t.virtualScrollItemSize===void 0&&(t.virtualScrollItemSize=e.dense===!0?28:48),t});function nt(){g.value===!0&&a.value.reset()}function ot(){if(e.grid===!0)return St();const t=e.hideHeader!==!0?$e:null;if(g.value===!0){const m=l["top-row"],h=l["bottom-row"],_={default:T=>De(T.item,l.body,T.index)};if(m!==void 0){const T=i("tbody",m({cols:E.value}));_.before=t===null?()=>T:()=>[t()].concat(T)}else t!==null&&(_.before=t);return h!==void 0&&(_.after=()=>i("tbody",h({cols:E.value}))),i(Nt,{ref:a,class:e.tableClass,style:e.tableStyle,...lt.value,scrollTarget:e.virtualScrollTarget,items:A.value,type:"__qtable",tableColspan:Pe.value,onVirtualScroll:it},_)}const c=[ut()];return t!==null&&c.unshift(t()),He({class:["q-table__middle scroll",e.tableClass],style:e.tableStyle},c)}function rt(t,c){if(a.value!==null){a.value.scrollTo(t,c);return}t=parseInt(t,10);const m=v.value.querySelector(`tbody tr:nth-of-type(${t+1})`);if(m!==null){const h=v.value.querySelector(".q-table__middle.scroll"),_=m.offsetTop-e.virtualScrollStickySizeStart,T=_<h.scrollTop?"decrease":"increase";h.scrollTop=_,n("virtualScroll",{index:t,from:0,to:C.value.rowsPerPage-1,direction:T})}}function it(t){n("virtualScroll",t)}function Te(){return[i(Vt,{class:"q-table__linear-progress",color:e.color,dark:b.value,indeterminate:!0,trackColor:"transparent"})]}function De(t,c,m){const h=s.value(t),_=oe(h);if(c!==void 0)return c(ke({key:h,row:t,pageIndex:m,__trClass:_?"selected":""}));const T=l["body-cell"],P=E.value.map($=>{const Z=l[`body-cell-${$.name}`],Y=Z!==void 0?Z:T;return Y!==void 0?Y(st({key:h,row:t,pageIndex:m,col:$})):i("td",{class:$.__tdClass(t),style:$.__tdStyle(t)},N($,t))});if(L.value===!0){const $=l["body-selection"],Z=$!==void 0?$(ct({key:h,row:t,pageIndex:m})):[i(ge,{modelValue:_,color:e.color,dark:b.value,dense:e.dense,"onUpdate:modelValue":(Y,Ct)=>{H([h],[t],Y,Ct)}})];P.unshift(i("td",{class:"q-table--col-auto-width"},Z))}const I={key:h,class:{selected:_}};return e.onRowClick!==void 0&&(I.class["cursor-pointer"]=!0,I.onClick=$=>{n("RowClick",$,t,m)}),e.onRowDblclick!==void 0&&(I.class["cursor-pointer"]=!0,I.onDblclick=$=>{n("RowDblclick",$,t,m)}),e.onRowContextmenu!==void 0&&(I.class["cursor-pointer"]=!0,I.onContextmenu=$=>{n("RowContextmenu",$,t,m)}),i("tr",I,P)}function ut(){const t=l.body,c=l["top-row"],m=l["bottom-row"];let h=A.value.map((_,T)=>De(_,t,T));return c!==void 0&&(h=c({cols:E.value}).concat(h)),m!==void 0&&(h=h.concat(m({cols:E.value}))),i("tbody",h)}function ke(t){return fe(t),t.cols=t.cols.map(c=>V({...c},"value",()=>N(c,t.row))),t}function st(t){return fe(t),V(t,"value",()=>N(t.col,t.row)),t}function ct(t){return fe(t),t}function fe(t){Object.assign(t,{cols:E.value,colsMap:we.value,sort:re,rowIndex:G.value+t.pageIndex,color:e.color,dark:b.value,dense:e.dense}),L.value===!0&&V(t,"selected",()=>oe(t.key),(c,m)=>{H([t.key],[t.row],c,m)}),V(t,"expand",()=>R(t.key),c=>{Je(t.key,c)})}function N(t,c){const m=typeof t.field=="function"?t.field(c):c[t.field];return t.format!==void 0?t.format(m,c):m}const U=f(()=>({pagination:y.value,pagesNumber:K.value,isFirstPage:ie.value,isLastPage:ue.value,firstPage:se,prevPage:ce,nextPage:de,lastPage:ve,inFullscreen:u.value,toggleFullscreen:o}));function dt(){const t=l.top,c=l["top-left"],m=l["top-right"],h=l["top-selection"],_=L.value===!0&&h!==void 0&&ne.value>0,T="q-table__top relative-position row items-center";if(t!==void 0)return i("div",{class:T},[t(U.value)]);let P;if(_===!0?P=h(U.value).slice():(P=[],c!==void 0?P.push(i("div",{class:"q-table__control"},[c(U.value)])):e.title&&P.push(i("div",{class:"q-table__control"},[i("div",{class:["q-table__title",e.titleClass]},e.title)]))),m!==void 0&&(P.push(i("div",{class:"q-table__separator col"})),P.push(i("div",{class:"q-table__control"},[m(U.value)]))),P.length!==0)return i("div",{class:T},P)}const Re=f(()=>qe.value===!0?null:We.value);function $e(){const t=vt();return e.loading===!0&&l.loading===void 0&&t.push(i("tr",{class:"q-table__progress"},[i("th",{class:"relative-position",colspan:Pe.value},Te())])),i("thead",t)}function vt(){const t=l.header,c=l["header-cell"];if(t!==void 0)return t(be({header:!0})).slice();const m=E.value.map(h=>{const _=l[`header-cell-${h.name}`],T=_!==void 0?_:c,P=be({col:h});return T!==void 0?T(P):i(It,{key:h.name,props:P},()=>h.label)});if(Ke.value===!0&&e.grid!==!0)m.unshift(i("th",{class:"q-table--col-auto-width"}," "));else if(_e.value===!0){const h=l["header-selection"],_=h!==void 0?h(be({})):[i(ge,{color:e.color,modelValue:Re.value,dark:b.value,dense:e.dense,"onUpdate:modelValue":pe})];m.unshift(i("th",{class:"q-table--col-auto-width"},_))}return[i("tr",{class:e.tableHeaderClass,style:e.tableHeaderStyle},m)]}function be(t){return Object.assign(t,{cols:E.value,sort:re,colsMap:we.value,color:e.color,dark:b.value,dense:e.dense}),_e.value===!0&&V(t,"selected",()=>Re.value,pe),t}function pe(t){qe.value===!0&&(t=!1),H(A.value.map(s.value),A.value,t)}const X=f(()=>{const t=[e.iconFirstPage||r.iconSet.table.firstPage,e.iconPrevPage||r.iconSet.table.prevPage,e.iconNextPage||r.iconSet.table.nextPage,e.iconLastPage||r.iconSet.table.lastPage];return r.lang.rtl===!0?t.reverse():t});function ft(){if(e.hideBottom===!0)return;if(at.value===!0){if(e.hideNoData===!0)return;const m=e.loading===!0?e.loadingLabel||r.lang.table.loading:e.filter?e.noResultsLabel||r.lang.table.noResults:e.noDataLabel||r.lang.table.noData,h=l["no-data"],_=h!==void 0?[h({message:m,icon:r.iconSet.table.warning,filter:e.filter})]:[i(Fe,{class:"q-table__bottom-nodata-icon",name:r.iconSet.table.warning}),m];return i("div",{class:ae+" q-table__bottom--nodata"},_)}const t=l.bottom;if(t!==void 0)return i("div",{class:ae},[t(U.value)]);const c=e.hideSelectedBanner!==!0&&L.value===!0&&ne.value>0?[i("div",{class:"q-table__control"},[i("div",[(e.selectedRowsLabel||r.lang.table.selectedRecords)(ne.value)])])]:[];if(e.hidePagination!==!0)return i("div",{class:ae+" justify-end"},gt(c));if(c.length!==0)return i("div",{class:ae},c)}function bt(t){B({page:1,rowsPerPage:t.value})}function gt(t){let c;const{rowsPerPage:m}=y.value,h=e.paginationLabel||r.lang.table.pagination,_=l.pagination,T=e.rowsPerPageOptions.length>1;if(t.push(i("div",{class:"q-table__separator col"})),T===!0&&t.push(i("div",{class:"q-table__control"},[i("span",{class:"q-table__bottom-item"},[e.rowsPerPageLabel||r.lang.table.recordsPerPage]),i(Et,{class:"q-table__select inline q-table__bottom-item",color:e.color,modelValue:m,options:tt.value,displayValue:m===0?r.lang.table.allRows:m,dark:b.value,borderless:!0,dense:!0,optionsDense:!0,optionsCover:!0,"onUpdate:modelValue":bt})])),_!==void 0)c=_(U.value);else if(c=[i("span",m!==0?{class:"q-table__bottom-item"}:{},[m?h(G.value+1,Math.min(J.value,W.value),W.value):h(1,he.value,W.value)])],m!==0&&K.value>1){const P={color:e.color,round:!0,dense:!0,flat:!0};e.dense===!0&&(P.size="sm"),K.value>2&&c.push(i(ee,{key:"pgFirst",...P,icon:X.value[0],disable:ie.value,onClick:se})),c.push(i(ee,{key:"pgPrev",...P,icon:X.value[1],disable:ie.value,onClick:ce}),i(ee,{key:"pgNext",...P,icon:X.value[2],disable:ue.value,onClick:de})),K.value>2&&c.push(i(ee,{key:"pgLast",...P,icon:X.value[3],disable:ue.value,onClick:ve}))}return t.push(i("div",{class:"q-table__control"},c)),t}function mt(){const t=e.gridHeader===!0?[i("table",{class:"q-table"},[$e()])]:e.loading===!0&&l.loading===void 0?Te():void 0;return i("div",{class:"q-table__middle"},t)}function St(){const t=l.item!==void 0?l.item:c=>{const m=c.cols.map(_=>i("div",{class:"q-table__grid-item-row"},[i("div",{class:"q-table__grid-item-title"},[_.label]),i("div",{class:"q-table__grid-item-value"},[_.value])]));if(L.value===!0){const _=l["body-selection"],T=_!==void 0?_(c):[i(ge,{modelValue:c.selected,color:e.color,dark:b.value,dense:e.dense,"onUpdate:modelValue":(P,I)=>{H([c.key],[c.row],P,I)}})];m.unshift(i("div",{class:"q-table__grid-item-row"},T),i(Rt,{dark:b.value}))}const h={class:["q-table__grid-item-card"+q.value,e.cardClass],style:e.cardStyle};return(e.onRowClick!==void 0||e.onRowDblclick!==void 0)&&(h.class[0]+=" cursor-pointer",e.onRowClick!==void 0&&(h.onClick=_=>{n("RowClick",_,c.row,c.pageIndex)}),e.onRowDblclick!==void 0&&(h.onDblclick=_=>{n("RowDblclick",_,c.row,c.pageIndex)})),i("div",{class:"q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3"+(c.selected===!0?" q-table__grid-item--selected":"")},[i("div",h,m)])};return i("div",{class:["q-table__grid-content row",e.cardContainerClass],style:e.cardContainerStyle},A.value.map((c,m)=>t(ke({key:s.value(c),row:c,pageIndex:m}))))}return Object.assign(d.proxy,{requestServerInteraction:x,setPagination:B,firstPage:se,prevPage:ce,nextPage:de,lastPage:ve,isRowSelected:oe,clearSelection:Xe,isRowExpanded:R,setExpanded:Q,sort:re,resetVirtualScroll:nt,scrollTo:rt,getCellValue:N}),kt(d.proxy,{filteredSortedRows:()=>le.value,computedRows:()=>A.value,computedRowsNumber:()=>W.value}),()=>{const t=[dt()],c={ref:v,class:S.value};return e.grid===!0?t.push(mt()):Object.assign(c,{class:[c.class,e.cardClass],style:e.cardStyle}),t.push(ot(),ft()),e.loading===!0&&l.loading!==void 0&&t.push(l.loading()),i("div",c,t)}}});const ua=p`
  query listaBancos($id: ID) {
    listaBancos(id: $id) {
      id
      nombre
      icono
    }
  }
`,qa=p`
  mutation bancoCreate($input: BancoInput!) {
    bancoCreate(bancoInput: $input) {
      banco {
        id
        nombre
        icono
      }
    }
  }
`,wa=p`
  mutation bancoUpdate($id: ID!, $input: BancoInput!) {
    bancoUpdate(id: $id, bancoInput: $input) {
      banco {
        id
        nombre
        icono
      }
    }
  }
`,Pa=p`
  mutation bancoDelete($id: ID!) {
    bancoDelete(id: $id) {
      banco {
        id
        nombre
        icono
      }
    }
  }
`,Ta=Me("bancoStore",()=>{const e=F([]),l=$t({fetchPolicy:"no-cache"}),{onResult:n,onError:d}=Qe(ua,{id:0},l);n(({data:o})=>{var s;o&&(console.log("cargando lista de bancos al store ...."),e.value=(s=JSON.parse(JSON.stringify(o.listaBancos)))!=null?s:[])}),d(o=>{console.trace(o)});function r(o){e.value.push(o)}function b(o){const s=e.value.findIndex(v=>v.id===o.id);e.value[s]=o}function u(o){const s=e.value.findIndex(v=>v.id===o.id);e.value.splice(s,1)}return{listaBancos:e,bancoCreated:r,bancoUpdated:b,bancoDeleted:u}}),sa=p`
  query listaCuentas {
    listaCuentas {
      id
      nombre
      identificador
      diaCorte
      cuentaContableId
      cuentaContable {
        id
        nombre
        nombreCompleto
      }
      tipoCuenta {
        id
        nombre
        label
        value
        icon
      }
      banco {
        id
        nombre
        icono
      }
      saldo
      propietario
      diasGracia
    }
  }
`;p`
  query listaCuentas {
    listaCuentas {
      id
      nombre
      tipoCuenta {
        id
        nombre
      }
    }
  }
`;const Da=p`
  query listaTiposCuenta {
    listaTiposCuenta {
      id
      nombre
      label
      value
      icon
    }
  }
`,ka=p`
  query saldoAFecha($cuentaId: ID!, $fechaFin: ISO8601Date!) {
    obtenerSaldoAFecha(cuentaId: $cuentaId, fechaFin: $fechaFin)
  }
`,ca=p`
  mutation cuentaCreate($input: CuentaInput!) {
    cuentaCreate(cuentaInput: $input) {
      cuenta {
        id
        nombre
        identificador
        cuentaContableId
        diaCorte
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCuenta {
          id
          nombre
          label
          value
          icon
        }
        banco {
          id
          nombre
          icono
        }
        saldo
        propietario
        diasGracia
      }
    }
  }
`,da=p`
  mutation cuentaUpdate($id: ID!, $input: CuentaInput!) {
    cuentaUpdate(id: $id, cuentaInput: $input) {
      cuenta {
        id
        nombre
        identificador
        cuentaContableId
        diaCorte
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCuenta {
          id
          nombre
          label
          value
          icon
        }
        banco {
          id
          nombre
          icono
        }
        saldo
        propietario
        diasGracia
      }
    }
  }
`,va=p`
  mutation cuentaSaldoUpdate($cuentaId: ID!) {
    cuentaSaldoUpdate(cuentaId: $cuentaId) {
      cuenta {
        id
        saldo
      }
    }
  }
`,fa=p`
  mutation cuentaDelete($id: ID!) {
    cuentaDelete(id: $id) {
      cuenta {
        id
        nombre
        identificador
        cuentaContableId
        diaCorte
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCuenta {
          id
          nombre
          label
          value
          icon
        }
        banco {
          id
          nombre
          icono
        }
        saldo
        diasGracia
      }
    }
  }
`,Ra=p`
  query saldoTarjetaCredito(
    $cuentaId: ID!
    $fechaFin: ISO8601Date
    $isDetalle: Int!
  ) {
    saldoTarjetaCredito(
      cuentaId: $cuentaId
      fechaFin: $fechaFin
      isDetalle: $isDetalle
    )
  }
`,$a=p`
  query saldoPagarTarjetaCredito(
    $cuentaId: ID!
    $fechaFin: ISO8601Date
    $isDetalle: Int!
  ) {
    saldoPagarTarjetaCredito(
      cuentaId: $cuentaId
      fechaFin: $fechaFin
      isDetalle: $isDetalle
    )
  }
`,ba=Me("cuentaStore",()=>{ga();const e=F({fetchPolicy:"no-cache"}),{onError:l,refetch:n,result:d}=Qe(sa,null,e);l(v=>{});function r(){n()}const b=f({get(){var v,a,g,q;return console.log(((a=(v=d.value)==null?void 0:v.listaCuentas)==null?void 0:a.length)||0),(q=(g=d.value)==null?void 0:g.listaCuentas)!=null?q:[]}}),u=f({get(){var v;return(v=b.value.filter(a=>a.tipoCuenta.id!=="3"))!=null?v:[]}}),o=f({get(){var v;return(v=b.value.filter(a=>a.tipoCuenta.id==="3"))!=null?v:[]}});function s(v,a){const g=b.value.findIndex(w=>w.id===v),q=b.value[g];q.saldo=a}return{listaCuentas:b,listaCuentasTarjeta:o,listaCuentasAhorro:u,loadOrRefetchListaCuentas:r,actualizarSaldoCuenta:s}});function ga(){const e=ba(),{mutate:l,onDone:n,onError:d}=te(ca),{mutate:r,onDone:b,onError:u}=te(da),{mutate:o,onDone:s,onError:v}=te(fa),{mutate:a,onDone:g,onError:q}=te(va);n(({data:S})=>{const C=S.cuentaCreate.cuenta;e.listaCuentas.push(C)}),b(({data:S})=>{if(S){const C=S.cuentaUpdate.cuenta,y=e.listaCuentas.findIndex(k=>k.id===C.id);e.listaCuentas[y]=C}}),s(({data:S})=>{const C=S.cuentaDelete.cuenta,y=e.listaCuentas.findIndex(k=>k.id===C.id);e.listaCuentas.splice(y,1)}),g(({data:S})=>{console.log("Se actualizo el saldo de la cuenta",S);const C=S.cuentaSaldoUpdate.cuenta;w(C)});function w(S){console.log("Se actualiza el saldo de la cuenta interfaz",S);const C=e.listaCuentas.findIndex(y=>y.id===S.id);e.listaCuentas[C].saldo=S.saldo}return d(S=>{console.trace(S)}),u(S=>{console.trace(S)}),q(S=>{console.trace(S)}),{cuentaCreate:l,cuentaUpdate:r,cuentaDelete:o,cuentaSaldoUpdate:a,onDoneCuentaCreate:n,onDoneCuentaUpdate:b,onDoneCuentaDelete:s,onDoneCuentaSaldoUpdate:g,onErrorCuentaCreate:d,onErrorCuentaUpdate:u,onErrorCuentaDelete:v}}export{qa as B,Da as L,ka as O,It as Q,Ra as S,_a as a,ga as b,Ta as c,Vt as d,$a as e,wa as f,Pa as g,ba as u};
