const mdlConfiguracion = function () {

    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $modalPrincipal = $("#mdlConfiguracion"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};

    //! Inputs del modal
    var $fr_hospital = $("#fr_hospital"),
        $fr_ruta_iis_proyecto = $("#fr_ruta_iis_proyecto"),
        $fr_subraiz_iis_proyecto = $("#fr_subraiz_iis_proyecto"),
        $fr_ruta_ws_servidor = $("#fr_ruta_ws_servidor"),
        $fr_es_servidor = $("#fr_es_servidor"),
        $fr_ruta_dicoms = $("#fr_ruta_dicoms")

    //! Asigna el tipo de evento del modal
    function typeEvent(flag) {
        eventModal = flag;
    }

    //! Obtiene el tipo de evento del modal
    function getTypeEvent() {
        return eventModal;
    }

    //! Accion para mostrar el modal
    function mostrarModal() {
        resetModal();

        switch (eventModal) {
            case 'create':
                $titleModal.text("Agregar");
                $btnAceptar.text("Agregar");

                if (objClsConfiguracion.tblPrincipal.getAllDataToArray().length > 0)
                    return jsSimpleAlert("Alerta", "No puede generar mas una configuración para esta estancia.", "orange");

                $modalPrincipal.modal()
                break;
            case 'edit':
                $titleModal.text("Editar");
                $btnAceptar.text("Actualizar");

                setDatosModal();
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    //! Asigna los valores al modal
    function setDatosModal() {
        setDatosFromRow();//Enviar los datos de la fila seleccionada al formulario del modal
        $modalPrincipal.modal();//Mostrar modal
    }

    function setDatosFromRow() {
        let tableRow = objClsConfiguracion.tblPrincipal.getRowSelected();
        objOriginal = tableRow;

        //! Asginar datos
        $fr_hospital.val(tableRow.id_hospital);
        $fr_ruta_iis_proyecto.val(tableRow.ruta_iis_proyecto);
        $fr_subraiz_iis_proyecto.val(tableRow.subraiz_iis_proyecto);
        $fr_ruta_ws_servidor.val(tableRow.ruta_ws_servidor);
        $fr_es_servidor.prop('checked', tableRow.es_servidor == 1);
        $fr_ruta_dicoms.val(tableRow.ruta_dicoms);
    }

    function getDatosFromForm() {
        let objSendStored = {};

        if (eventModal != "delete") {
            objSendStored.hospital = $fr_hospital.val();
            objSendStored.ruta_iis_proyecto = $fr_ruta_iis_proyecto.val();
            objSendStored.subraiz_iis_proyecto = $fr_subraiz_iis_proyecto.val();
            objSendStored.ruta_ws_servidor = $fr_ruta_ws_servidor.val();
            objSendStored.ruta_dicoms = $fr_ruta_dicoms.val();
            objSendStored.es_servidor = $fr_es_servidor.is(':checked') ? 1 : 0;
        }

        if (eventModal == "edit" || eventModal == "delete") {
            objSendStored.id_hospital = objOriginal.id_hospital;
        }

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
        objSend = getDatosFromForm();

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
        let id_RVA = objClsConfiguracion.getListaPermisos()["BTN-NEW"].id_RVA;

        //! Peticion para agregar registro
        doAjax("POST", url_Administrador_AddConfiguracion, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedUpdate(objSend) {
        let id_RVA = objClsConfiguracion.getListaPermisos()["BTN-EDIT"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_UpdateConfiguracion, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    //! Tratar resultado del stored procedure
    async function finishStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {

            closeModal();
            await sleep(200);
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            objClsConfiguracion.getListaPrincipal(true);
        }
    }

    //! Reiniciar valores del formulario
    function resetModal() {
        enabledElements("#frmPrincipal input, #frmPrincipal select");
        //! Reset forms
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
                default:
                    jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
            }
        }

        return false;
    }

    function initValidations() {
        let principalForm = {};

        //Setear rules
        principalForm = {
            rules: {
                fr_hospital: "required"
            },
            messages: {
                fr_hospital: "Ingrese el Hospital"
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
        initValidations: initValidations
    }
};