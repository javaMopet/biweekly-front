import{s as r}from"./index.27a31e1c.js";import{g as a}from"./index.804869e1.js";import{b as R}from"./useCuentasCrud.5ef3cef5.js";const S=a`
  query listaRegistrosTarjeta(
    $cuentaId: ID
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
    $isMsi: Boolean
    $estadoRegistroTarjetaId: ID
  ) {
    listaRegistrosTarjeta(
      cuentaId: $cuentaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      isMsi: $isMsi
      estadoRegistroTarjetaId: $estadoRegistroTarjetaId
    ) {
      id
      cuentaId
      categoriaId
      importe
      fecha
      concepto
      isMsi
      numeroMsi
      tipoAfectacion
      cargo
      abono
      importeMensual
      estadoRegistroTarjeta {
        id
        nombre
      }
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
`,p=a`
  mutation registroTarjetaCreate($input: RegistroTarjetaInput!) {
    registroTarjetaCreate(registroTarjetaInput: $input) {
      registroTarjeta {
        id
        cuentaId
        categoriaId
        importe
        fecha
        concepto
        isMsi
        numeroMsi
        estadoRegistroTarjeta {
          id
          nombre
        }
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
`,l=a`
  mutation registroTarjetaUpdate($id: ID!, $input: RegistroTarjetaInput!) {
    registroTarjetaUpdate(id: $id, registroTarjetaInput: $input) {
      registroTarjeta {
        id
        cuentaId
        categoriaId
        importe
        fecha
        concepto
        isMsi
        numeroMsi
        estadoRegistroTarjeta {
          id
          nombre
        }
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
`,D=a`
  mutation registroTarjetaDelete($id: ID!) {
    registroTarjetaDelete(id: $id) {
      registroTarjeta {
        id
        cuentaId
        cuenta {
          id
          nombre
        }
        categoriaId
        importe
        fecha
        concepto
        isMsi
        numeroMsi
      }
    }
  }
`,E=a`
  mutation registrosTarjetaDelete($ids: String!) {
    registrosTarjetaDelete(ids: $ids) {
      saldo
    }
  }
`;function b(){const o=R(),{mutate:d,onDone:i,onError:T}=r(p),{mutate:g,onDone:s,onError:u}=r(l),{mutate:j,onDone:n,onError:m}=r(D),{mutate:I,onDone:c,onError:$}=r(E);return i(({data:e})=>{console.log("registroTarjeta creado",e);const t=e.registroTarjetaCreate.registroTarjeta;o.cuentaSaldoUpdate({cuentaId:t.cuenta.id})}),s(({data:e})=>{console.log("registroTarjeta actualizado",e);const t=e.registroTarjetaUpdate.registroTarjeta;o.cuentaSaldoUpdate({cuentaId:t.cuenta.id})}),n(({data:e})=>{console.log("registroTarjeta actualizado",e);const t=e.registroTarjetaDelete.registroTarjeta;o.cuentaSaldoUpdate({cuentaId:t.cuenta.id})}),c(({data:e})=>{console.log("registroTarjeta actualizado",e.registrosTarjetaDelete.saldo)}),{createRegistroTarjeta:d,onDoneRegistroTarjetaCreate:i,registroTarjetaDelete:j,onDoneRegistroTarjetaDelete:n,onErrorRegistroTarjetaDelete:m,registroTarjetaUpdate:g,onDoneRegistroTarjetaUpdate:s,onErrorRegistroTarjetaCreate:T,onErrorRegistroTarjetaUpdate:u,registrosTarjetaDelete:I,onDoneRegistrosTarjetaDelete:c}}export{S as L,b as u};
