import{j as P,r as y,f as x,c as N,I as Q,ag as S,aK as D,aj as m,ai as I,aM as $,aN as F,aq as f,Q as V,E as w,z as q,k as z,ap as R,ah as k,b5 as j,b6 as J,aO as M}from"./index.20d4ad85.js";import{Q as G,a as K}from"./QList.5cb48b53.js";import{l as W,D as Y,Q as B}from"./DialogTitle.a45c2883.js";import{a as H,Q as X}from"./useNotificacion.79136029.js";import{g as E,C as Z}from"./index.804869e1.js";import{r as T,s as U}from"./index.27a31e1c.js";const ee=E`
  query listaCuentasContables(
    $subnivel: Int
    $clasificacion: String
    $tipoAfectacion: String
  ) {
    listaCuentasContables(
      subnivel: $subnivel
      clasificacion: $clasificacion
      tipoAfectacion: $tipoAfectacion
    ) {
      id
      nombre
      nombreCompleto
      padreId
      subnivel
      tipoAfectacion
    }
  }
`,te=E`
  query arbolCuentasContables {
    arbolCuentasContables
  }
`,ae=E`
  mutation cuentaContableCreate($input: CuentaContableInput!) {
    cuentaContableCreate(cuentaContableInput: $input) {
      cuentaContable {
        id
        nombre
        nombreCompleto
        tipoAfectacion
        subnivel
        padreId
        padre {
          id
          nombre
          nombreCompleto
        }
      }
    }
  }
`,ne=E`
  mutation cuentaContableUpdate($id: ID!, $input: CuentaContableInput!) {
    cuentaContableUpdate(id: $id, cuentaContableInput: $input) {
      cuentaContable {
        id
        nombre
        nombreCompleto
        tipoAfectacion
        subnivel
        padreId
        padre {
          id
          nombre
          nombreCompleto
        }
      }
    }
  }
`,oe=E`
  mutation cuentaContableDelete($id: ID!) {
    cuentaContableDelete(id: $id) {
      cuentaContable {
        id
        nombre
        nombreCompleto
        tipoAfectacion
        subnivel
        padreId
      }
    }
  }
`,O=P("cuentaContableStore",()=>{const u=y([]),A=y([]);L();const c=x({fetchPolicy:"cache-first"}),{onResult:d,loading:v,onError:g}=T(te,null,c),r=x({subnivel:null,clasificacion:null,tipoAfectacion:null}),p=y({fetchPolicy:"no-cache"}),{onResult:C,onError:l,loading:_}=T(ee,r,p);function s(e){return t(u.value[0],e)}function t(e,a){if(e.id==a)return e;if(e.children!=null){var n,o=null;for(n=0;o==null&&n<e.children.length;n++)o=t(e.children[n],a);return o}return null}return d(({data:e})=>{e&&(u.value=JSON.parse(JSON.stringify(e.arbolCuentasContables)))}),C(({data:e})=>{var a;e&&(console.log("loading lista de cuentas contables...",e),A.value=JSON.parse(JSON.stringify((a=e.listaCuentasContables)!=null?a:[])))}),l(e=>{W(e)}),{arbolCuentasContables:u,loadingArbolCuentas:v,findTreeElementById:s,listaCuentasContables:A}});function L(){const u=O(),{mutate:A,onDone:c,onError:d}=U(ae),{mutate:v,onDone:g,onError:r}=U(ne),{mutate:p,onDone:C,onError:l,error:_}=U(oe);return c(({data:s})=>{if(s){const t=JSON.parse(JSON.stringify(s.cuentaContableCreate.cuentaContable));t.id=Number(t.id),t.label=`${t.id} - ${t.nombre}`,t.selectable=!0,u.listaCuentasContables.length>0&&u.listaCuentasContables.push(t);const e=t.padreId;u.findTreeElementById(e).children.push(t)}}),g(({data:s})=>{if(console.log("refrescando cuentasContables en el crud"),s){const t=s.cuentaContableUpdate.cuentaContable;t.label=`${t.id} - ${t.nombre}`,t.selectable=t.subnivel===0;const e=u.findTreeElementById(t.padreId),a=e.children.findIndex(n=>n.id===Number(t.id));console.log("itemIndex",a),e.children[a].nombre=t.nombre,e.children[a].label=t.nombreCompleto,e.children[a].selectable=t.selectable,console.log("itemUpdated",t),console.log("itemUpdated origen",e.children[a])}}),C(({data:s})=>{const t=s.cuentaContableDelete.cuentaContable,e=t.id,a=u.listaCuentasContables.findIndex(h=>h.id===e);u.listaCuentasContables.splice(a,1);const n=t.padreId,o=u.findTreeElementById(n),b=o.children.findIndex(h=>h.id.toString()===e.toString());o.children.splice(b,1)}),d(s=>{console.trace(s)}),r(s=>{console.trace(s)}),l(s=>{console.log(s)}),{cuentaContableCreate:A,cuentaContableUpdate:v,cuentaContableDelete:p,onDoneCuentaContableCreate:c,onDoneCuentaContableUpdate:g,onDoneCuentaContableDelete:C,onErrorCuentaContableCreate:d,onErrorCuentaContableUpdate:r,onErrorCuentaContableDelete:l}}const le={class:"my-card",style:{width:"450px"}},ie={class:"main-content q-pt-md q-pb-md"},re={class:"q-gutter-md"},se={class:""},ue={class:"row inline fit"},de={class:"col q-mr-md"},ce={class:"col"},be={class:""},me={class:"col"},pe=f("div",null,null,-1),Ce={align:"right",class:"q-gutter-x-md q-mt-lg"},fe={__name:"FormRegistroCuentaContable",props:{editedItem:{type:Object,required:!1,default:()=>null},isPadreDefault:{type:Boolean,required:!0,default:!1}},emits:["cuentaContableSaved","cuentaContableUpdated"],setup(u,{emit:A}){const c=H(),d=L(),v=y({id:void 0,nombre:"",subnivel:0,padre:null,tipoAfectacion:""}),g=y([{id:"C",nombre:"Cargo"},{id:"A",nombre:"Abono"}]),r=y(!1),p=u,C=A,l=N({get(){return p.editedItem?p.editedItem:v.value},set(n){v.value=n}}),_=N({get(){return p.editedItem.action==="edit"?"Actualizar Cuenta Contable":"Nueva Cuenta Contable"}}),s=N({get(){return p.editedItem.action==="edit"?"Actualizar":"Guardar"}}),t=N({get(){return p.editedItem.action==="edit"}});Q(()=>{const n=p.editedItem.tipoAfectacion,o=g.value.findIndex(b=>b.id===n);l.value.tipoAfectacion=g.value[o]});function e(){const n=l.value.id,o=parseInt(l.value.padre.id);l.value.tipoAfectacion;const b={...l.value,tipoAfectacion:l.value.tipoAfectacion.id,padreId:o,padre:void 0,action:void 0,tipo_afectacion:void 0,label:void 0,selectable:void 0,nombreCompleto:void 0,__typename:void 0};p.editedItem.action==="add"?d.cuentaContableCreate({input:b}):d.cuentaContableUpdate({id:n,input:b})}d.onDoneCuentaContableCreate(({data:n})=>{n&&(c.mostrarNotificacionPositiva("Cuenta Contable creada.",1200),C("cuentaContableSaved"))}),d.onDoneCuentaContableUpdate(({data:n})=>{n&&(c.mostrarNotificacionPositiva("Cuenta Contable actualizada correctamente.",1200),C("cuentaContableUpdated"))}),d.onErrorCuentaContableCreate(n=>{c.mostrarNotificacionNegativa("Ocurri\xF3 un error al intentar crear la cuenta contable",1200)}),d.onErrorCuentaContableUpdate(n=>{c.mostrarNotificacionNegativa("Ocurri\xF3 un error al intentar actualizar la cuenta contable",1200)});function a(n){const o=n.target.value;console.log("value",o),console.log("value",o.length),o.length===6&&(console.log("recuperando...."),z.get(`/cuentas_contable/${o}`).then(({data:b})=>{console.log("response",b),b?(c.mostrarNotificacionNegativa("Ya existe una cuenta con el id ingresado",600),r.value=!0):r.value=!1}).catch(b=>{b.message.includes("404")?r.value=!1:(console.log("error",b.message),c.mostrarNotificacionNegativa("Surgi\xF3 un error con la cuenta contable",1e3),r.value=!0)}))}return(n,o)=>(S(),D("div",le,[m(Y,null,{default:I(()=>[$(F(_.value),1)]),_:1}),f("div",ie,[m(X,{onSubmit:e,class:"q-gutter-y-md q-mt-xs form-componente__body"},{default:I(()=>{var b,h;return[f("div",re,[f("div",se,[f("div",ue,[f("div",de,[m(B,{modelValue:l.value.tipoAfectacion,"onUpdate:modelValue":o[0]||(o[0]=i=>l.value.tipoAfectacion=i),options:g.value,label:"Tipo de Afectaci\xF3n","option-label":"nombre","option-value":"id","lazy-rules":"",rules:[i=>!!i||"Favor de ingresar el tipo de afectaci\xF3n de la cuenta contable"],outlined:"",color:"positive",dense:"",readonly:t.value},null,8,["modelValue","options","rules","readonly"])]),f("div",ce,[m(V,{modelValue:l.value.subnivel,"onUpdate:modelValue":o[1]||(o[1]=i=>l.value.subnivel=i),type:"text",label:"Subnivel",dense:"",readonly:"",outlined:"",color:"positive"},null,8,["modelValue"])])])]),f("div",be,[m(ye,{modelValue:l.value.padre,"onUpdate:modelValue":o[2]||(o[2]=i=>l.value.padre=i),subnivel:1,"tipo-afectacion":(h=(b=l.value.tipoAfectacion)==null?void 0:b.id)!=null?h:"C","input-label":"Padre",readonly:t.value,disable:u.isPadreDefault,rules:[i=>i&&i.length>0||"Favor de ingresar el nombre de la Cuenta Contable"]},null,8,["modelValue","tipo-afectacion","readonly","disable","rules"])]),f("div",me,[m(V,{modelValue:l.value.id,"onUpdate:modelValue":o[3]||(o[3]=i=>l.value.id=i),type:"text",label:"Id",placeholder:"Favor de ingresar el Id",dense:"",maxlength:"6",min:"",mask:"######","lazy-rules":"",rules:[i=>!!i||"Favor de ingresar el Id",i=>!!i&&i.length>=6||"Please use maximum 5 character"],readonly:t.value,outlined:"",color:"positive",onBlur:a},null,8,["modelValue","rules","readonly"])]),f("div",null,[m(V,{modelValue:l.value.nombre,"onUpdate:modelValue":o[4]||(o[4]=i=>l.value.nombre=i),type:"text",label:"Nombre",dense:"","lazy-rules":"",autofocus:"",rules:[i=>i&&i.length>0||"Favor de ingresar el nombre de la Cuenta Contable"],outlined:"",color:"positive"},null,8,["modelValue","rules"])]),pe]),f("div",Ce,[w(m(q,{label:"Cancelar",color:"negative",class:"q-ml-sm",flat:"","no-caps":"",rounded:""},null,512),[[Z]]),m(q,{label:s.value,type:"submit",color:"primary-button",disable:r.value},null,8,["label","disable"])])]}),_:1})])]))}},ve={class:"column",style:{border:"0px solid red"}},ge={key:0,class:"",style:{border:"0px solid red"}},ye={__name:"CuentaContableSelect",props:{modelValue:{type:Object,required:!1,default:()=>({id:500,nombre:"mi nombre"})},subnivel:{type:Number,required:!1,default:0},clasificacion:{type:String,required:!1,default:""},tipoAfectacion:{type:String,required:!1,default:()=>null},inputLabel:{type:String,required:!1,default:"Cuenta Contable"},readonly:{type:Boolean,required:!1,default:!1},isAlta:{type:Boolean,required:!1,default:!1},rules:{type:Array,required:!1,default:()=>[]},disable:{type:Boolean,required:!1,default:!1}},emits:["update:modelValue"],setup(u,{emit:A}){const c=y([]),d=y(!1),v=y(null),g=O(),r=u,p=A,C=N({get(){return r.modelValue},set(e){p("update:modelValue",e)}}),l=N({get(){var e;return((e=g.listaCuentasContables)!=null?e:[]).filter(a=>a.subnivel===r.subnivel&&a.tipoAfectacion===r.tipoAfectacion&&a.id.toString().startsWith(r.clasificacion))}});function _(e,a){if(e===""){a(()=>{c.value=l.value});return}a(()=>{const n=e.toLowerCase();c.value=l.value.filter(o=>o.nombreCompleto.toLowerCase().indexOf(n)>-1)})}function s(){console.log("registrar una cuenta contable");const e=r.tipoAfectacion?r.tipoAfectacion:{A:"Abono"};v.value={padre:null,tipoAfectacion:e,subnivel:0,action:"add"},console.log(v.value),d.value=!0}function t(e){d.value=!1,C.value=e}return(e,a)=>(S(),D(M,null,[f("div",ve,[m(B,{outlined:"",color:"positive",modelValue:C.value,"onUpdate:modelValue":a[1]||(a[1]=n=>C.value=n),options:c.value,"option-label":"nombreCompleto",label:r.inputLabel,"use-input":"","input-debounce":"0",onFilter:_,behavior:"menu",clearable:"",dense:"","map-options":"","hide-selected":"","fill-input":"","lazy-rules":"",rules:u.rules,readonly:r.readonly,disable:r.disable},{after:I(()=>[u.isAlta?(S(),D("div",ge,[m(q,{color:"accent",class:"small-button",icon:"add",onClick:a[0]||(a[0]=n=>s(r))})])):R("",!0)]),"no-option":I(()=>[m(G,null,{default:I(()=>[m(K,{class:"text-grey"},{default:I(()=>[$(" No results ")]),_:1})]),_:1})]),_:1},8,["modelValue","options","label","rules","readonly","disable"])]),(S(),k(J,{to:"#modal"},[m(j,{modelValue:d.value,"onUpdate:modelValue":a[3]||(a[3]=n=>d.value=n),persistent:"","transition-show":"jump-up","transition-hide":"jump-down"},{default:I(()=>[m(fe,{modelValue:C.value,"onUpdate:modelValue":a[2]||(a[2]=n=>C.value=n),"edited-item":v.value,onCuentaContableSaved:t,"is-padre-default":!1},null,8,["modelValue","edited-item"])]),_:1},8,["modelValue"])]))],64))}};export{ye as _,L as a,fe as b,O as u};
