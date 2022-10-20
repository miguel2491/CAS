const mdlPagos = function () {
    //! Doom del modal
    var $formPagos = $("#frmPagos"),
        $modalPagos = $("#mdlPagos"),        
        eventModal = 'BTN-ADD-PAGOS',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD]
    //var $fr_id_cliente = $("#fr_id_paciente");
    var $fr_fecha_pago_sat = $("#fr_fecha_pago_sat"); //la descripcion del modal 
    var $fr_bimestre_pago_sat = $("#fr_bimestre_pago_sat");
    var $fr_periodo_bimestre_pago_sat = $("#fr_periodo_bimestre_pago_sat");
    var $fr_monto_pago_sat = $("#fr_monto_pago_sat");

    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsClienteRIF.tblPagos;
    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-ADD-PAGOS':                
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
        $modalPagos.modal();//Mostrar modal
        await sleep(200);//Dale tiempo para mostrar el modal
        objClsClienteRIF.tblPagos.adjustColumns();//renderiza mejor las columnas
        GetPagosCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetPagosCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-PAGOS"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetPagos, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {
                    //item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                    item.acciones = '<a href="#" onclick="objClsClienteRIF.mdlPagosCliente.recalcular(' + item.id_bimestre + ',' + item.periodo + ',' + item.id_pago + ',true)" class="btn btn-style btn-success" title="recalcular"><i class="fa fa-refresh"></i ></a>&nbsp;&nbsp;';
                    //item.acciones += '<a href="#" class="btn btn-style btn-warning" title="editar pago"><i class="fa fa-edit"></i ></a>&nbsp;&nbsp;';
                    item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlPagosCliente.eliminar(' + item.id_pago + ',true)" class="btn btn-style btn-danger" title="eliminar pago"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
        });
    }

    function recalcular(bimestre, periodo, id_pago, showWait = false) {
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-PAGOS"].id_RVA;
        var objSend = JSON.stringify({ bimestre: bimestre, periodo_fiscal: periodo, id_pago: id_pago, id_cliente: id_cliente, fl_rfc: $("#fl_rfc").val() });
        doAjax("POST", url_Catalogos_Recalcular, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {

                GetPagosCliente(true);

            }
            
        });
    }

    function eliminar(id_pago, showWait = false) {
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-PAGOS"].id_RVA;
        var objSend = JSON.stringify({ id_pago: id_pago });
        doAjax("POST", url_Catalogos_EliminarPago, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                GetPagosCliente(true);

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
        objSendStored.fecha_pago_sat = $fr_fecha_pago_sat.val();
        objSendStored.bimestre_pago_sat = $fr_bimestre_pago_sat.val();
        objSendStored.monto_pago_sat = $fr_monto_pago_sat.val();
        objSendStored.periodo_bimestre_pago_sat = $fr_periodo_bimestre_pago_sat.val();
        return objSendStored;
    }

    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-ADD-PAGOS') {
            if (!$formPagos.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-ADD-PAGOS':
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-PAGOS"].id_RVA;

        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddPagos,
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-PAGOS"].id_RVA;
        doAjax("POST", url_Catalogos_UpdPagos, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finalizarStoredProcedure(data);
        });
    }

    //! Tratar resultado del stored procedure
    async function finalizarStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            resetearModal();
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            GetPagosCliente(true);
            //clearData();
            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
        }
    }

    //! Reiniciar valores del formulario
    function resetearModal() {
        $formPagos.validate().resetForm();
        $formPagos[0].reset();
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
                    EliminarPagos();
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
                fr_fecha_pago_sat: "required",
                fr_bimestre_pago_sat: "required",
                fr_monto_pago_sat: "required",
                fr_periodo_bimestre_pago_sat: "required"
            },
            messages: {
                fr_fecha_pago_sat: "Ingrese una fecha",
                fr_bimestre_pago_sat: "Ingrese un bimestre",
                fr_monto_pago_sat: "Ingrese un monto",
                fr_periodo_bimestre_pago_sat: "Ingrese un año"
            }
        }
        $formPagos.validate(principalForm);
    }

    function EliminarPagos() {

        objSend = JSON.stringify({ id_RIF_pago: row.id_RIF_pago, id_cliente: row.id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-PAGOS"].id_RVA;

        doAjax("POST", url_Catalogos_UpdPagos, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finalizarStoredProcedure(data);
        });
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
        EliminarPagos: EliminarPagos,
        recalcular: recalcular,
        eliminar: eliminar
    }
};