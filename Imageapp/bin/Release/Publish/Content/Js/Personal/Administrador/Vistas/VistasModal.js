const mdlVistas = function () {
    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $formAuditoria = $("#frmAuditoria"),
        $modalPrincipal = $("#mdlVistas"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};
    
    //! Inputs del modal
    var $fr_nombre = $("#fr_nombre"),
        $fr_adminCtMenu = $("#fr_adminCtMenu"),
        $fr_id_menu = $("#fr_id_menu"),
        $fr_controller = $("#fr_controller"),
        $fr_action = $("#fr_action"),
        $fr_id_estatus = $("#fr_id_estatus")

    //! Validaciones personalizadas
    jQuery.validator.addMethod('isMenuInList', function (value, element) {
        let flag = false;
        let listMenu = objClsVistas.getArrayCatalogs();
        let campoMenu = $fr_adminCtMenu.val();

        listMenu.forEach(function (item) {
            if (item.label == campoMenu) {
                flag = true;
            }
        });

        return flag;
    }, "Seleccione una opción válida dentro de la lista");

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
        let tableRow = objClsVistas.tblPrincipal.getRowSelected();
        objOriginal = tableRow;

        //! Asginar datos
        $fr_nombre.val(tableRow.nombre);
        $fr_id_menu.val(tableRow.id_menu);
        $fr_adminCtMenu.val(tableRow.pathDescription);
        $fr_controller.val(tableRow.controller);
        $fr_action.val(tableRow.action);
        $fr_id_estatus.prop('checked', tableRow.id_estatus == enumListEstatus.ACTIVO)
    }

    function getDatosFromForm() {
        let objSendStored = {};

        if (eventModal != "delete") {
            objSendStored.nombre = $fr_nombre.val();
            objSendStored.id_menu = $fr_id_menu.val();
            objSendStored.action = $fr_action.val();
            objSendStored.controller = $fr_controller.val();
            objSendStored.id_estatus = $fr_id_estatus.is(':checked') ? enumListEstatus.ACTIVO : enumListEstatus.INACTIVO;
        }

        if (eventModal == "edit" || eventModal == "delete") {
            objSendStored.id_vista = objOriginal.id_vista;
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
        let id_RVA = objClsVistas.getlistaPermisos()["BTN-NEW"].id_RVA;

        //! Peticion para agregar registro
        doAjax("POST", url_Administrador_AddVista, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedUpdate(objSend) {
        let id_RVA = objClsVistas.getlistaPermisos()["BTN-EDIT"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_UpdateVista, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedDelete(objSend) {
        let id_RVA = objClsVistas.getlistaPermisos()["BTN-ERASE"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_DeleteVista, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    async function finishStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            closeModal();
            await sleep(200);

            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            objClsVistas.getListaPrincipal(true);
        }
    }

    function resetModal() {
        enabledElements("#frmPrincipal input, #frmPrincipal select");
        //! Reset forms
        $formPrincipal.validate().resetForm();
        $formPrincipal[0].reset();

        //! Establecer status
        $fr_id_estatus.prop('checked', eventModal == "create");
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

        //! Setear rules
        principalForm = {
            rules: {
                fr_nombre: "required",
                fr_controller: "required",
                fr_action: "required",
                fr_id_menu: "isMenuInList"
            },
            messages: {
                fr_nombre: "Ingrese el nombre",
                fr_controller: "Ingrese el controlador",
                fr_action: "Ingrese la acción"
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