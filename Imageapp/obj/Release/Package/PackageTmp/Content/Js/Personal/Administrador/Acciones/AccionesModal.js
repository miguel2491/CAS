const mdlActions = function () {
    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $modalPrincipal = $("#mdlActions"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};
    
    //! Inputs del modal
    var $fr_nombre = $("#fr_nombre"),
        $fr_codigo = $("#fr_codigo"),
        $fr_id_estatus = $("#fr_id_estatus"),
        $fr_nombre = $("#fr_nombre"),
        $fr_fontAwesome = $("#fr_fontAwesome"),
        $fr_order = $("#fr_order"),
        $fr_visible = $("#fr_visible")

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
                $modalPrincipal.modal()
                break;
            case 'edit':
                $titleModal.text("Editar");
                $btnAceptar.text("Actualizar");
                setDatosModal();
                break;
            case 'delete':
                disabledElements("#frmPrincipal input,#frmPrincipal select");
                $titleModal.text("Eliminar");
                $btnAceptar.text("Eliminar");
                setDatosModal();
                break;
            default:
                jsSimpleAlert("Alerta","No se ha configurado el tipo de evento," + eventModal,"red");
        }
    }

    //! Asigna los valores al modal
    function setDatosModal() {
        setDatosFromRow();//Enviar los datos de la fila seleccionada al formulario del modal
        $modalPrincipal.modal();//Mostrar modal
    }

    function setDatosFromRow() {
        let tableRow = objClsActions.tblPrincipal.getRowSelected();
        objOriginal = tableRow;

        //! Asginar datos
        $fr_codigo.val(tableRow.codigo);
        $fr_nombre.val(tableRow.nombre);
        $fr_fontAwesome.val(tableRow.fontAwesome);
        $fr_order.val(tableRow.order_position);
        $fr_visible.prop('checked', tableRow.isVisible == enumListEstatus.SI);
        $fr_id_estatus.prop('checked', tableRow.id_estatus == enumListEstatus.ACTIVO);
    }

    function getDatosFromForm() {
        let objSendStored = {};

        if (eventModal != "delete") {
            objSendStored.codigo = $fr_codigo.val();
            objSendStored.nombre = $fr_nombre.val();
            objSendStored.fontAwesome = $fr_fontAwesome.val();
            objSendStored.order = $fr_order.val();
            objSendStored.isVisible = $fr_visible.is(':checked') ? enumListEstatus.SI : enumListEstatus.NO;
            objSendStored.id_estatus = $fr_id_estatus.is(':checked') ? enumListEstatus.ACTIVO : enumListEstatus.INACTIVO;
        }

        if (eventModal == "edit" || eventModal == "delete") {
            objSendStored.id_accion = objOriginal.id_accion;
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
        let id_RVA = objClsActions.getListaPermisos()["BTN-NEW"].id_RVA;

        //! Peticion para agregar registro
        doAjax("POST", url_Administrador_AddAccion, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA },true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedUpdate(objSend) {
        let id_RVA = objClsActions.getListaPermisos()["BTN-EDIT"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_UpdateAccion, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedDelete(objSend) {
        let id_RVA = objClsActions.getListaPermisos()["BTN-ERASE"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_DeleteAccion, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    async function finishStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            
            closeModal();
            await sleep(200);
            objClsActions.getListaPrincipal(true);
            
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
        }
    }

    function resetModal() {
        enabledElements("#frmPrincipal input, #frmPrincipal select");
        //! Reset forms
        $formPrincipal.validate().resetForm();
        $formPrincipal[0].reset();

        //! Establecer status
        $fr_id_estatus.prop('checked', eventModal == "create");
        $fr_visible.prop('checked', eventModal == "create");
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
                fr_codigo: "required",
                fr_nombre: "required",
                fr_fontAwesome: "required",
                fr_order: "required"
            },
            messages: {
                fr_codigo: "Ingrese el código",
                fr_nombre: "Ingrese el nombre",
                fr_fontAwesome: "Ingrese el ícono",
                fr_order: "Ingrese la posición"
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