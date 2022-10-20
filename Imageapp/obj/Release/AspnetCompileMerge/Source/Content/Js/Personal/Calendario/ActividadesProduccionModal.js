const mdlClientes = function () {
    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $modalPrincipal = $("#mdlClientes"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};
    var listaDocumentos = null;
    //! Inputs del modal
    var $fr_id_actividad_calendario = $("#fr_id_actividad_calendario"),
        $fr_mes = $("#fr_mes"),
        $fr_periodo = $("#fr_periodo"),
        $fr_fecha_inicio = $("#fr_fecha_inicio"),
        $fr_fecha_termino = $("#fr_fecha_termino");
    var $txtCategoria = $("#fr_linea");




    $txtCategoria.change(function () {
        var categoria_select = $txtCategoria.children("option:selected").text();
        
        var id_categoria = $txtCategoria.val();
        if (listaDocumentos.length > 0) {
            var strOption = "";
            for (var i = 0; i < listaDocumentos.length; i++) {
                var item = listaDocumentos[i];
                if (item.id_lineas_produccion == id_categoria) {
                    strOption += "<option value='" + item.id_actividad_calendario + "'>" + item.actividad + "</option>";
                }
            }
            $fr_id_actividad_calendario.html(strOption);
        }
    });

    //! Asigna el tipo de evento del modal
    function typeEvent(flag) {
        eventModal = flag;
    }

    //! Obtiene el tipo de evento del modal
    function getTypeEvent() {
        return eventModal;
    }
        

    function init() {
        initValidations();



        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetActividadesCalendario, { jsonJS: JSON.stringify({}), id_RV: id_RV }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                listaDocumentos = result.resultStoredProcedure.msnSuccess;

                var categoria_select = $txtCategoria.children("option:selected").text();
                
                var id_categoria = $txtCategoria.val();
                if (listaDocumentos.length > 0) {
                    var strOption = "";
                    for (var i = 0; i < listaDocumentos.length; i++) {
                        var item = listaDocumentos[i];
                        if (item.id_lineas_produccion == id_categoria) {
                            strOption += "<option value='" + item.id_actividad_calendario + "'>" + item.actividad + "</option>";
                        }
                    }
                    $fr_id_actividad_calendario.html(strOption);
                }
            }
        });

    }

    //! Accion para mostrar el modal
    function mostrarModal() {
        resetModal();

        switch (eventModal) {
            case 'create':
                $titleModal.text("Agregar");
                $btnAceptar.text("Agregar");
                $modalPrincipal.modal()
                break;
            case 'edit':
                $titleModal.text("Editar");
                $btnAceptar.text("Actualizar");
                setDatosModal();
                break;
            case 'delete':
                disabledElements("#frmPrincipal input,#frmPrincipal select, #frmPrincipal password, #frmPrincipal textarea");
                $titleModal.text("Eliminar");
                $btnAceptar.text("Eliminar");
                setDatosModal();
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    function getDatosFomulario() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        
        objSendStored.fecha_inicio = $fr_fecha_inicio.val();
        objSendStored.fecha_termino = $fr_fecha_termino.val();
        objSendStored.mes = $fr_mes.val();
        objSendStored.periodo = $fr_periodo.val();
        objSendStored.id_actividad_calendario = $fr_id_actividad_calendario.val();
        return objSendStored;
    }

    function sendToStored() {
        let objSend = {};

        //! Valildar formulario
        if (eventModal == "create" || eventModal == "edit") {
            if (!$formPrincipal.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }

        //! Objeto de envio al stored
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'create':
                storedAdd(JSON.stringify(objSend));
                break;
            case 'edit':
                storedUpdate(JSON.stringify(objSend));
                break;
            case 'delete':
                storedDelete(JSON.stringify(objSend));
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    function storedAdd(objSend) {
        var frmData = new FormData();
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-NEW"].id_RVA;

        
        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddActividadesProduccion,
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
                    finishStoredProcedure(data);
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) { jsSimpleAlert("Error", errorThrown); })
            .always(function () { $msnWait.close() });
    }

    function storedUpdate(objSend) {
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-EDIT"].id_RVA;
        //! Peticion para actualizar registro
        doAjax("POST", url_Catalogos_UpdateCliente, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedDelete(objSend) {
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-ERASE"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Catalogos_DeleteCliente, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    async function finishStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            closeModal();
            await sleep(200);

            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            objClsCliente.getListaPrincipal(true);
        }
    }

    function resetModal() {
        enabledElements("#frmPrincipal input, #frmPrincipal select, #frmPrincipal password");
        //Reset forms
        $formPrincipal.validate().resetForm();
        $formPrincipal[0].reset();
       

        $('.nav-tabs a[href="#formTab"]').tab('show');
        $('.nav-tabs a[href="#rlVistas"]').removeClass('disabled');

        //Establecer status
        
        countNewRl = 0;
    }

    //! Mensaje de confirmacion
    function confirmModal(paramsConfirm) {
        jsConfirmAlert(this.waitResultModal, paramsConfirm);
    }

    //! Funcion que detona la respuesta del mensaje de confirmacion
    function waitResultModal(params) {
        //Si la respuesta fue SI, en el mensaje de confirmacion
        if (params.status) {
            //Determinar por el tipo de evento del modal, que accion realizar
            switch (params.paramsConfirm.eventButton) {
                case 'cerrar_modal':
                    closeModal();
                    break;
                case 'eliminar':
                    sendToStored();
                    break;
                case 'deleteRlHospital':
                    deleteHospitalToDtRl();
                    break;
                default:
                    jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
            }
        }

        return false;
    }

    function initValidations() {
        let principalForm = {};

        //! Setear reglas del formulario
        principalForm = {
            rules: {
                fr_actividad: "required",
                fr_paso: "required"
            },
            messages: {
                fr_actividad: "debe especificar la actividad",
                fr_paso: "debe especificar el orden de la actividad"
            }
        }

        $formPrincipal.validate(principalForm);
    }

    function closeModal() {
        $.modal.close();
    }

    return {
        mostrarModal: mostrarModal,
        sendToStored: sendToStored,
        confirmModal: confirmModal,
        waitResultModal: waitResultModal,
        eventModal: typeEvent,
        getTypeEvent: getTypeEvent,
        initValidations: initValidations,
        init: init
    }
};