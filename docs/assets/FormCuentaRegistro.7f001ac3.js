import{Q as H}from"./QBtnToggle.bfaab28d.js";import{r as A,I as J,c as h,f as W,ag as F,aK as Y,aj as f,ai as x,aM as Z,aN as ee,aq as g,u as oe,ah as q,ap as P,Q as te,E as ae,z as w,P as se}from"./index.20d4ad85.js";import{a as re,Q as ne}from"./useNotificacion.79136029.js";import{g as m,C as ie}from"./index.804869e1.js";import{_ as le,b as ue}from"./CategoriaSelect.674cba46.js";import{c as ce,P as de,d as z}from"./FormRegistroCategoria.298f8369.js";import{u as pe}from"./useFormato.c7e3ed92.js";import{s as R,u as ge}from"./index.27a31e1c.js";import{b as L,u as me}from"./useCuentasCrud.5ef3cef5.js";import{D as Ie}from"./DialogTitle.a45c2883.js";const je=m`
  query obtenerRegistros(
    $cuentaId: ID
    $categoriaId: ID
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
  ) {
    obtenerRegistros(
      cuentaId: $cuentaId
      categoriaId: $categoriaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      id
      estadoRegistroId
      tipoAfectacion
      fecha
      importe
      observaciones
      importe
      cargo
      abono
      disable
      cuenta {
        id
        nombre
      }
      categoria {
        id
        nombre
        tipoMovimientoId
      }
      registroTarjeta {
        id
        fecha
        cuenta {
          id
          nombre
        }
      }
      traspasoDetalle {
        id
        traspasoId
        tipoCuentaTraspasoId
        importe
      }
      userId
    }
  }
`,ve=m`
  mutation registroCreate($input: RegistroInput!) {
    registroCreate(registroInput: $input) {
      registro {
        id
        estadoRegistroId
        tipoAfectacion
        fecha
        importe
        observaciones
        importe
        cuenta {
          id
          nombre
        }
        categoria {
          id
          nombre
          tipoMovimientoId
        }
      }
    }
  }
`,fe=m`
  mutation registroUpdate($id: ID!, $input: RegistroInput!) {
    registroUpdate(id: $id, registroInput: $input) {
      registro {
        id
        estadoRegistroId
        tipoAfectacion
        fecha
        importe
        observaciones
        importe
        cuenta {
          id
          nombre
        }
        categoria {
          id
          nombre
          tipoMovimientoId
        }
      }
    }
  }
`,De=m`
  mutation registroDelete($id: ID!) {
    registroDelete(id: $id) {
      registro {
        id
        cuenta {
          id
          nombre
        }
        estadoRegistroId
      }
    }
  }
`,Te=m`
  mutation registrosDelete($ids: String!) {
    registrosDelete(ids: $ids) {
      cuentasIds
    }
  }
`,be=m`
  mutation importarRegistros(
    $registrosInput: [RegistroInput!]!
    $traspasosInput: [TraspasoInput!]!
  ) {
    importarRegistros(
      registrosInput: $registrosInput
      traspasosInput: $traspasosInput
    ) {
      registros {
        id
        estadoRegistroId
        tipoAfectacion
        fecha
        importe
        observaciones
        importe
        cuenta {
          id
          nombre
        }
        categoria {
          id
          nombre
          tipoMovimientoId
        }
      }
    }
  }
`;function Re(){const p=L();A({fetchPolicy:"network-only"});const{mutate:U,onDone:c,onError:d}=R(ve),{mutate:i,onDone:$,onError:D}=R(fe),{mutate:T,onDone:l,onError:_}=R(De),{mutate:y,onDone:C,onError:E}=R(Te),{mutate:I,onDone:r,onError:e}=R(be);return c(({data:s})=>{console.log("registro creado",s);const n=s.registroCreate.registro;p.cuentaSaldoUpdate({cuentaId:n.cuenta.id})}),$(({data:s})=>{console.log("registro actualizado",s);const n=s.registroUpdate.registro;p.cuentaSaldoUpdate({cuentaId:n.cuenta.id})}),l(({data:s})=>{console.log("registro actualizado",s);const n=s.registroDelete.registro;p.cuentaSaldoUpdate({cuentaId:n.cuenta.id})}),r(({data:s})=>{console.log("Registros importados",s),console.log(s.importarRegistros.registros[0].cuenta.id);const n=s.importarRegistros.registros[0].cuenta.id;p.cuentaSaldoUpdate({cuentaId:n})}),C(({data:s})=>{console.log("useRegistroCrud registros eliminados",s.registrosDelete.cuentasIds),s.registrosDelete.cuentasIds.forEach(n=>{console.log("cuenta element",n),p.cuentaSaldoUpdate({cuentaId:n})})}),E(s=>{console.log("ocurrio un error"),console.log(s)}),{createRegistro:U,importarRegistros:I,onDoneRegistroCreate:c,onDoneImportarRegistros:r,onErrorImportarRegistros:e,deleteRegistro:T,onDoneRegistroDelete:l,onErrorRegistroDelete:_,registroUpdate:i,onDoneRegistroUpdate:$,onErrorRegistroCreate:d,onErrorRegistroUpdate:D,registrosDelete:y,onDoneRegistrosDelete:C,onErrorRegistrosDelete:E}}const Ce=m`
  mutation traspasoCreate(
    $input: TraspasoInput!
    $inputDetalle: [TraspasoDetalleInput!]!
  ) {
    traspasoCreate(
      traspasoInput: $input
      traspasosDetalleInput: $inputDetalle
    ) {
      traspaso {
        id
        detalleOrigen {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
        detalleDestino {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
      }
    }
  }
`,Ee=m`
  mutation traspasoUpdate(
    $id: ID!
    $input: TraspasoInput!
    $inputDetalle: [TraspasoDetalleInput!]!
  ) {
    traspasoUpdate(
      id: $id
      traspasoInput: $input
      traspasosDetalleInput: $inputDetalle
    ) {
      traspaso {
        detalleOrigen {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
        detalleDestino {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
      }
      cuentasIds
      cuentas {
        id
        nombre
        saldo
      }
    }
  }
`,Se=m`
  mutation traspasoDelete($id: ID!) {
    traspasoDelete(id: $id) {
      traspaso {
        id
        detalleOrigen {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
        detalleDestino {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
      }
    }
  }
`,he=m`
  query listaTraspasos($id: ID) {
    listaTraspasos(id: $id) {
      id
      fecha
      observaciones
      traspasoDetalles {
        id
        tipoCuentaTraspasoId
        importe
        cuenta {
          id
          nombre
          identificador
        }
        registro {
          id
          fecha
          importe
        }
      }
      createdAt
    }
  }
`;function Ue(){const p=L(),U=me(),{mutate:c,onDone:d,onError:i}=R(Ce),{mutate:$,onDone:D,onError:T}=R(Ee),{mutate:l,onDone:_,onError:y}=R(Se),{load:C,onResult:E}=ge(he);d(({data:r})=>{const e=r.traspasoCreate.traspaso;console.log("onDonetraspasoCreate",e),I(e.detalleOrigen.cuentaId,e.detalleDestino.cuentaId)}),D(({data:r})=>{console.log("onDonetraspasoUpdate",r),r.traspasoUpdate.traspaso,r.traspasoUpdate.cuentasIds,r.traspasoUpdate.cuentas.forEach(s=>{console.log(s);const n=U.listaCuentas.findIndex(V=>V.id===s.id);U.listaCuentas[n].saldo=s.saldo})}),_(({data:r})=>{const e=r.traspasoDelete.traspaso;console.log("onDonetraspasoDelete",e),I(e.detalleOrigen.cuentaId,e.detalleDestino.cuentaId)});function I(r,e){p.cuentaSaldoUpdate({cuentaId:r}),p.cuentaSaldoUpdate({cuentaId:e})}return{traspasoCreate:c,traspasoUpdate:$,onDoneTraspasoCreate:d,onDoneTraspasoUpdate:D,onErrorTraspasoCreate:i,onErrorTraspasoUpdate:T,traspasoDelete:l,onDoneTraspasoDelete:_,onErrorTraspasoDelete:y,loadListaTraspasos:C,onResultListaTraspasos:E}}const $e={class:"my-card",style:{width:"630px","min-width":"630px"}},_e={class:"q-px-xl q-pb-lg"},ye={class:"q-py-lg"},Ae={class:"row"},Ve={class:"col q-mr-xs"},Me={class:"col q-ml-xs"},Oe={class:""},Fe={class:""},Ne={class:"col row justify-end q-gutter-x-md"},Ke={__name:"FormCuentaRegistro",props:{editedItem:{type:Object,required:!1,default:()=>({id:null})},editedIndex:{type:Number,required:!1,default:-1},fecha:{type:String,required:!1}},emits:["itemSaved","itemUpdated"],setup(p,{emit:U}){const c=pe(),d=Re(),i=Ue(),$=ce(),{mostrarNotificacionPositiva:D,mostrarNotificacionNegativa:T}=re(),l=A(null),_={tipoMovimientoId:"1",tipoAfectacion:"A",categoria:null,cuenta:null,estadoRegistroId:2,importe:"500",fecha:c.formatoFecha(new Date),observaciones:""},y=A(!0),C=A({..._}),E=A([]);J(()=>{O.value?X():e.value.fecha=I.fecha?c.convertDateFromIsoToInput(I.fecha):c.formatoFecha(new Date),E.value.push(e.value.cuenta.id.toString())});const I=p,r=U;d.onDoneRegistroCreate(({data:t})=>{D("El registro se cre\xF3 correctamente.",2100);const a=t.registroCreate.registro;r("itemSaved",a)}),d.onErrorRegistroCreate(t=>{T("Surgi\xF3 un error al intentar guardar el movimiento.",2100)}),i.onDoneTraspasoCreate(({data:t})=>{console.log("traspaso creado",t),D("El traspaso se cre\xF3 correctamente.",2100),r("itemSaved")}),i.onErrorTraspasoCreate(t=>{T("No fue posible generar el traspaso. Revisar log.",2100)}),d.onDoneRegistroUpdate(({data:t})=>{console.log("Registro update",t);const a=t.registroUpdate.registro;r("itemUpdated",a)}),d.onErrorRegistroUpdate(t=>{T("No es posible actualizar el movimiento con la informaci\xF3n ingresada. Favor de verificar.",2100)}),i.onResultListaTraspasos(({data:t})=>{const a=e.value.traspasoDetalle.tipoCuentaTraspasoId;l.value=t.listaTraspasos[0];const o=l.value.traspasoDetalles.find(u=>u.tipoCuentaTraspasoId!==a);e.value.cuentaDestino=o.cuenta,e.value.observaciones=l.value.observaciones});const e=h({get(){return I.editedItem.cuenta?I.editedItem:C.value},set(t){C.value=t}}),s=h({get(){return e.value.id?"Actualizar Movimiento":`Nuevo ${n.value}`}}),n=h({get(){switch(e.value.tipoMovimientoId){case"1":return"Ingreso";case"2":return"Gasto";case"3":return"Traspaso";default:return""}}}),V=h({get(){return e.value.id?"Actualizar":"Guardar"}}),M=h({get(){return e.value.tipoMovimientoId==="3"}}),O=h({get(){return!!e.value.id}}),k=new Map([["1","ingreso-button"],["2","egreso-button"],["3","traspaso-button"]]),G=h({get(){return k.get(e.value.tipoMovimientoId)}});function Q(t){e.value.tipoAfectacion=t==="2"?"C":"A",e.value.categoria=null,console.dir(t)}function B(){const t=se.getItem("user").id,a=e.value.categoria,o=parseFloat(e.value.importe);if(console.dir(e.value),M.value)if(O.value){const u=l.value.id,v={...l.value,fecha:c.convertDateFromInputToIso(e.value.fecha),observaciones:e.value.observaciones,__typename:void 0,traspasoDetalles:void 0},b=[];console.table(l.value.traspasoDetalles),console.log("inputDetalle",b),l.value.traspasoDetalles.forEach(S=>{console.log("cuenta",S.tipoCuentaTraspasoId,S.cuenta.id.toString()),console.assert(S.tipoCuentaTraspasoId===1);let N={...S,importe:o,cuentaId:S.tipoCuentaTraspasoId===1?S.cuenta.id.toString():e.value.cuentaDestino.id,cuenta:void 0,__typename:void 0,registroId:S.registro.id.toString(),registro:void 0};console.log("traspasoDetalle",N),b.push(N)}),console.log("Mandar actualizar traspaso",u,v,b),i.traspasoUpdate({id:u,input:v,inputDetalle:b})}else{const u=[],v={fecha:c.convertDateFromInputToIso(e.value.fecha),observaciones:e.value.observaciones,userId:t};u.push({cuentaId:parseInt(e.value.cuenta.id),tipoCuentaTraspasoId:1,importe:o}),u.push({cuentaId:parseInt(e.value.cuentaDestino.id),tipoCuentaTraspasoId:2,importe:o}),i.traspasoCreate({input:v,inputDetalle:u})}else{let u,v;switch(a.tipoMovimientoId){case"1":u="A",v=o;break;case"2":u="C",v=o*-1;break}console.log("importe_real",v);const b={id:e.value.id,tipoAfectacion:u,estadoRegistroId:2,categoriaId:parseInt(e.value.categoria.id),cuentaId:parseInt(e.value.cuenta.id),importe:v,fecha:c.convertDateFromInputToIso(e.value.fecha),observaciones:e.value.observaciones,userId:t};console.log("saveItem input:",b),e.value.id?d.registroUpdate({id:e.value.id,input:b}):d.createRegistro({input:b})}}i.onDoneTraspasoUpdate(({data:t})=>{console.log("Al terminar de actualizar traspaso",t),D("Traspaso actualizado",2100),r("itemUpdated")}),i.onErrorTraspasoUpdate(t=>{T("Ocurri\xF3 un error al intentar actualizar el movimiento. Favor de verificar.",2100)});function j(t){var a;if(!O.value&&!!t){const o=(a=t.importeDefault)!=null?a:0;console.log("Nuevo registro categoria:",o),e.value.importe=parseFloat(o)===0?"":o.toString(),e.value.concepto=t.descripcion}}const K=W({fetchPolicy:"no-cache"});function X(){if(console.log("verificando si es traspaso",e.value),e.value.traspasoDetalle){const t=e.value.traspasoDetalle.traspasoId;i.loadListaTraspasos(null,{id:t},K)}}return(t,a)=>(F(),Y("div",$e,[f(Ie,null,{default:x(()=>[Z(ee(s.value),1)]),_:1}),g("div",_e,[f(ne,{onSubmit:B,class:"q-gutter-y-md"},{default:x(()=>[g("div",ye,[f(H,{modelValue:e.value.tipoMovimientoId,"onUpdate:modelValue":[a[0]||(a[0]=o=>e.value.tipoMovimientoId=o),Q],spread:"","no-caps":"",color:"disable-button","text-color":"gray-2","toggle-color":G.value,"toggle-text-color":"toggle-text-button",options:oe($).listaTiposMovimiento,push:""},null,8,["modelValue","toggle-color","options"])]),g("div",null,[M.value?P("",!0):(F(),q(le,{key:0,modelValue:e.value.categoria,"onUpdate:modelValue":[a[1]||(a[1]=o=>e.value.categoria=o),j],"tipo-afectacion":e.value.tipoAfectacion,"is-cambiable":!1,rules:[o=>!!o||"Favor de ingresar la categoria"],agregar:!0},null,8,["modelValue","tipo-afectacion","rules"]))]),g("div",Ae,[g("div",Ve,[f(ue,{modelValue:e.value.fecha,"onUpdate:modelValue":a[2]||(a[2]=o=>e.value.fecha=o),lbl_field:"Fecha",opcional:!1,rules:[o=>!!o||"Favor de ingresar la fecha"]},null,8,["modelValue","rules"])]),g("div",Me,[f(de,{"currency-code":"MNX",modelValue:e.value.importe,"onUpdate:modelValue":a[3]||(a[3]=o=>e.value.importe=o),opcional:!1,rules:[o=>!!o&&o!=="0"&&o!=="$0.00"&&o!=="$NaN.undefined"||"Favor de ingresar un valor mayor a cero"]},null,8,["modelValue","rules"])])]),g("div",Oe,[f(z,{modelValue:e.value.cuenta,"onUpdate:modelValue":a[4]||(a[4]=o=>e.value.cuenta=o),readonly:y.value},null,8,["modelValue","readonly"])]),g("div",Fe,[M.value?(F(),q(z,{key:0,modelValue:e.value.cuentaDestino,"onUpdate:modelValue":a[5]||(a[5]=o=>e.value.cuentaDestino=o),label:"Cuenta Destino","filter-array":["1","2"],"filter-id-array":E.value,rules:[o=>!!o||"Favor de ingresar la cuenta destino"]},null,8,["modelValue","filter-id-array","rules"])):P("",!0)]),g("div",null,[f(te,{modelValue:e.value.observaciones,"onUpdate:modelValue":a[6]||(a[6]=o=>e.value.observaciones=o),type:"textarea",label:"Obsevaciones",dense:"",rows:"3",outlined:"",color:"secondary"},null,8,["modelValue"])]),g("div",Ne,[ae(f(w,{label:"Cancelar",flat:"",color:"negative-pastel",push:"","no-caps":""},null,512),[[ie]]),f(w,{label:V.value,type:"submit",color:"primary-button",push:"","no-caps":""},null,8,["label"])])]),_:1})])]))}};export{je as L,Ke as _,Ue as a,Re as u};
