const mdlActivoFijo = function () {
    //! Doom del modal
    var $formActivoFijo = $("#frmActivoFijo"),
        $modalActivoFijo = $("#mdlActivoFijo"),
        eventModal = 'BTN-ADD-ACTIVOFIJO',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD]
    //var $fr_id_cliente = $("#fr_id_paciente");
    var $fr_fecha_activo_fijo = $("#fr_fecha_activo_fijo"); //la descripcion del modal 
    var $fr_fecha_aplicacion_activo_fijo = $("#fr_fecha_aplicacion_activo_fijo");
    var $fr_concepto_activo_fijo = $("#fr_concepto_activo_fijo");
    var $fr_monto_activo_fijo = $("#fr_monto_activo_fijo");
    var $fr_clasificacion_activo_fijo = $("#fr_clasificacion_activo_fijo");

    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsClienteRIF.tblActivoFijo;
    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-ADD-ACTIVOFIJO':
                setDatosModal();
                // $modalRepositorio.modal()
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    //! Asigna los valores al modal
    async function setDatosModal() {
        setDatosFormulario();//Enviar los datos de la fila seleccionada al formulario del modal
        $modalActivoFijo.modal();//Mostrar modal
        await sleep(200);//Dale tiempo para mostrar el modal
        objClsClienteRIF.tblActivoFijo.adjustColumns();//renderiza mejor las columnas
        GetActivoFijosCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetActivoFijosCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ACTIVOFIJO"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetActivoFijo, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {

                    item.acciones = '<a href="#" onclick="objClsClienteRIF.mdlActivoFijoCliente.eliminar(' + item.id_activo_fijo + ',true)" class="btn btn-style btn-danger" title="eliminar activo fijo"><i class="fa fa-trash"></i ></a>';
                    //item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                    //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                    //item.acciones = ''
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
        });
    }

    function eliminar(id_activo_fijo, showWait = false) {
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ACTIVOFIJO"].id_RVA;
        var objSend = JSON.stringify({ id_activo_fijo: id_activo_fijo });
        doAjax("POST", url_Catalogos_EliminarActivoFijo, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                GetActivoFijosCliente(true);
            }
        });
    }

    //! Asignar los valores de la fila seleccionada al formulario de repositorio
    function setDatosFormulario() {
        //let tableRow = objClsPacientes.tblPrincipal.getRowSelected();
        //objOriginal = tableRow;
        ////! Asignar datos
        //$fr_id_paciente.val(tableRow.id_paciente);
    }

    //! Obtener los datos de formulario de la table principal de pacientes
    function getDatosFomulario() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.fecha_activo_fijo = $fr_fecha_activo_fijo.val();
        objSendStored.fecha_aplicacion_activo_fijo = $fr_fecha_aplicacion_activo_fijo.val();
        objSendStored.concepto_activo_fijo = $fr_concepto_activo_fijo.val();
        objSendStored.monto_activo_fijo = $fr_monto_activo_fijo.val();
        objSendStored.clasificacion_activo_fijo = $fr_clasificacion_activo_fijo.val();
        return objSendStored;
    }

    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-ADD-ACTIVOFIJO') {
            if (!$formActivoFijo.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-ADD-ACTIVOFIJO':
                storedAdd(JSON.stringify(objSend));
                break;
            case enumEventosModal.ELIMINAR:
                storedDelete(JSON.stringify(objSend));
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    //! Peticion para agregar registro
    function storedAdd(objSend) {
        var frmData = new FormData();
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ACTIVOFIJO"].id_RVA;

        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddActivoFijo,
            contentType: false,
            processData: false,
            data: frmData
        })
            .done(function (data) {
                let result = new Result(data);

                //! Si tiene registros
                if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {

                    //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
                    //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
                    finalizarStoredProcedure(data);
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) { jsSimpleAlert("Error", errorThrown); })
            .always(function () { $msnWait.close() });
    }

    //! Peticion para eliminar respositorio de paciente
    function storedDelete(objSend) {
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ACTIVOFIJO"].id_RVA;
        //doAjax("POST", url_Catalogos_UpdDeposito, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
        //    finalizarStoredProcedure(data);
        //});
    }

    //! Tratar resultado del stored procedure
    async function finalizarStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            resetearModal();
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            GetActivoFijosCliente(true);
            //clearData();
            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
        }
    }

    //! Reiniciar valores del formulario
    function resetearModal() {
        $formActivoFijo.validate().resetForm();
        $formActivoFijo[0].reset();
        tblPrincipal.clearRows();
    }

    //! Mensaje de confirmacion
    function confirmarModal(paramsConfirm) {
        jsConfirmAlert(this.waitResultModal, paramsConfirm);
    }

    //! Funcion que detona la respuesta del mensaje de confirmacion
    function waitResultModal(params) {
        if (params.status) { // Confirmar clic boton SI
            switch (params.paramsConfirm.eventButton) { //Determinar la accion a realizar
                case 'cerrar_modal':
                    closeModal();
                    break;
                case 'deleteFile':
                    EliminarDeposito();
                    break;
                default:
                    jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + params.paramsConfirm.eventButton, "red");
            }
        }
        return false;
    }
    //Cerrar Modal
    function closeModal() {
        $.modal.close();
    }

    function inicializarValidaciones() {
        let principalForm = {};
        //! Setear reglas del formulario
        principalForm = {
            rules: {
                fr_fecha_activo_fijo: "required",
                fr_fecha_aplicacion_activo_fijo: "required",
                fr_concepto_activo_fijo: "required",
                fr_monto_activo_fijo: "required",
                fr_clasificacion_activo_fijo: "required"
            },
            messages: {
                fr_fecha_activo_fijo: "Ingrese una fecha",
                fr_fecha_aplicacion_activo_fijo: "Ingrese una fecha",
                fr_concepto_activo_fijo: "Ingrese un mes",
                fr_monto_activo_fijo: "Ingrese un monto",
                fr_clasificacion_activo_fijo: "Ingrese una clasificación"
            }
        }
        $formActivoFijo.validate(principalForm);
    }

    function EliminarDeposito() {

        objSend = JSON.stringify({ id_deposito: row.id_deposito, id_cliente: row.id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-DEPOSITO"].id_RVA;

        //doAjax("POST", url_Catalogos_UpdDeposito, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
        //    finalizarStoredProcedure(data);
        //});
    }

    return {
        inicio: inicio,
        mostrarModal: mostrarModal,
        enviarStoredProcedure: enviarStoredProcedure,
        confirmarModal: confirmarModal,
        waitResultModal: waitResultModal,
        setTipoEvento: tipoEvento,
        getTipoEvento: getTipoEvento,
        inicializarValidaciones: inicializarValidaciones,
        EliminarDeposito: EliminarDeposito,
        eliminar: eliminar
    }
};