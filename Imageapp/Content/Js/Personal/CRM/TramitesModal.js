const mdlClientes = function () {
    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $formPrincipal2 = $("#frmPrincipal2"),
        $formPrincipal3 = $("#frmPrincipal3"),
        $formPrincipal4 = $("#frmPrincipal4"),
        $modalPrincipal = $("#mdlTramites"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};

    //! Inputs del modal Cambio Domicilio
    var
        $fr_calle = $("#fr_calle"),
        $fr_codigo_postal = $("#fr_codigo_postal"),
        $fr_num_ext = $("#fr_num_ext"),
        $fr_num_int = $("#fr_num_int"),
        $fr_entre_calle = $("#fr_entre_calle"),
        $fr_y_calle = $("#fr_y_calle"),
        $fr_colonia = $("#fr_colonia"),
        $fr_localidad = $("#fr_localidad"),
        $fr_entidad_federativa = $("#fr_entidad_federativa"),
        $fr_tipo_inmueble = $("#fr_tipo_inmueble"),
        $fr_tipo_calle = $("#fr_tipo_calle"),
        $fr_caracteristicas_domicilio = $("#fr_caracteristicas_domicilio"),
        $fr_referencias_adicionales = $("#fr_referencias_adicionales"),
        $fr_codigo_fiscal = $("#fr_codigo_fiscal"),
        $fr_url_comprobante = $("#fr_url_comprobante");


    //! Inputs del modal Certificado Digital
    var
        $fr_id_tipo_persona = $("#fr_id_tipo_persona"),
        $fr_usuario_imss = $("#fr_usuario_imss"),
        $fr_telefono = $("#fr_telefono"),
        $fr_correo = $("#fr_correo"),
        $fr_funcion_empresa = $("#fr_funcion_empresa"),
        $fr_url_identificacion = $("#fr_url_identificacion"),
        $fr_url_tarjeta_patronal = $("#fr_url_tarjeta_patronal"),
        $fr_url_comprobante_2 = $("#fr_url_comprobante_2");

    //! Inputs del modal Solicitud de Constancia de Semanas Cotizadas
    var
        $fr_curp = $("#fr_curp"),
        $fr_nss = $("#fr_nss"),
        $fr_correo_2 = $("#fr_correo_2");


    //! Inputs del modal Localización NSS
    var
        $fr_curp_2 = $("#fr_curp_2"),        
        $fr_correo_3 = $("#fr_correo_3");

    //var $fr_urlArchivo = $("#fr_urlArchivo"),
    //    $fr_nombre = $("#fr_nombre"),
    //    $fr_area = $("#fr_area"),
    //    $fr_descripcion = $("#fr_descripcion");




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

            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    function getDatosFomulario() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        var tipo = $("#id_lista_tramite").val();
        if (tipo == "1") {
            objSendStored.calle = $fr_calle.val();
            objSendStored.codigo_postal = $fr_codigo_postal.val();
            objSendStored.num_ext = $fr_num_ext.val();
            objSendStored.num_int = $fr_num_int.val();
            objSendStored.entre_calle = $fr_entre_calle.val();
            objSendStored.y_calle = $fr_y_calle.val();
            objSendStored.colonia = $fr_colonia.val();
            objSendStored.localidad = $fr_localidad.val();
            objSendStored.entidad_federativa = $fr_entidad_federativa.val();
            objSendStored.tipo_inmueble = $fr_tipo_inmueble.val();
            objSendStored.tipo_calle = $fr_tipo_calle.val();
            objSendStored.caracteristicas_domicilio = $fr_caracteristicas_domicilio.val();
            objSendStored.referencias_adicionales = $fr_referencias_adicionales.val();
            objSendStored.codigo_fiscal = $fr_codigo_fiscal.val();
            
            objSendStored.rfc = data_rfc;
            objSendStored.id_lista_tramite = $("#id_lista_tramite").val();
        }

        else if (tipo == "2") {
            objSendStored.id_tipo_persona = $fr_id_tipo_persona.val();
            objSendStored.usuario_imss = $fr_usuario_imss.val();
            objSendStored.telefono = $fr_telefono.val();
            objSendStored.correo = $fr_correo.val();
            objSendStored.funcion_empresa = $fr_funcion_empresa.val();

            objSendStored.rfc = data_rfc;
            objSendStored.id_lista_tramite = $("#id_lista_tramite").val();
        }

        else if (tipo == "3") {
            objSendStored.curp = $fr_curp.val();
            objSendStored.nss = $fr_nss.val();
            objSendStored.correo = $fr_correo_2.val();
            
            objSendStored.rfc = data_rfc;
            objSendStored.id_lista_tramite = $("#id_lista_tramite").val();
        }

        else if (tipo == "4") {
            objSendStored.curp = $fr_curp_2.val();            
            objSendStored.correo = $fr_correo_3.val();

            objSendStored.rfc = data_rfc;
            objSendStored.id_lista_tramite = $("#id_lista_tramite").val();
        }

        return objSendStored;
    }

    function sendToStored() {
        let objSend = {};

        //! Valildar formulario
        if (eventModal == "create" || eventModal == "edit") {

            var tipo = $("#id_lista_tramite").val();
            if (tipo == "1") {
                if (!$formPrincipal.valid())
                    return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
            }
            else if (tipo == "2") {
                if (!$formPrincipal2.valid())
                    return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
            }
            else if (tipo == "3") {
                if (!$formPrincipal3.valid())
                    return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
            }
            else if (tipo == "4") {
                if (!$formPrincipal4.valid())
                    return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
            }



            
        }

        //! Objeto de envio al stored
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'create':
                storedAdd(JSON.stringify(objSend));
                break;

            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    function storedAdd(objSend) {
        var frmData = new FormData();
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-NEW"].id_RVA;

        var tipo = $("#id_lista_tramite").val();
        if (tipo == "1") {
            frmData.append('url_comprobante', $fr_url_comprobante.val() != "" ? $fr_url_comprobante[0].files[0] : "");
        }
        else if (tipo == "2"){
            frmData.append('url_comprobante', $fr_url_comprobante_2.val() != "" ? $fr_url_comprobante_2[0].files[0] : "");
            frmData.append('url_identificacion', $fr_url_identificacion.val() != "" ? $fr_url_identificacion[0].files[0] : "");
            frmData.append('url_tarjeta_patronal', $fr_url_tarjeta_patronal.val() != "" ? $fr_url_tarjeta_patronal[0].files[0] : "");
        }


        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddTramite,
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