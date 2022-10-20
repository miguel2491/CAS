const mdlMenus = function () {
    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $modalPrincipal = $("#mdlMenus"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};
    
    //! Inputs del modal
    var $fr_nombre = $("#fr_nombre"),
        $fr_adminCtMenu = $("#fr_adminCtMenu"),
        $fr_id_menu = $("#fr_id_menu"),
        $fr_pathDescription = $("#fr_pathDescription"),
        $fr_descripcion = $("#fr_descripcion"),
        $fr_isRaiz = $("#fr_isRaiz"),
        $fr_isVisible = $("#fr_isVisible")

    //! Validaciones personalizadas
    jQuery.validator.addMethod('isMenuInList', function (value, element) {
        let flag = false;
        let listMenu = objClsMenus.getArrayCatalogs();
        let campoMenu = $fr_adminCtMenu.val();

        listMenu.forEach(function (item) {
            if (item.label == campoMenu) {
                flag = true;
            }
        });

        return flag;
    }, "Seleccione una opción válida dentro de la lista");

    //Asigna el tipo de evento del modal
    function typeEvent(flag) {
        eventModal = flag;
    }

    //Obtiene el tipo de evento del modal
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
        let tableRow = objClsMenus.tblPrincipal.getRowSelected();
        objOriginal = tableRow;

        //! Asginar datos
        $fr_nombre.val(tableRow.nombre);
        $fr_id_menu.val(tableRow.id_menuPadre);
        $fr_adminCtMenu.val(tableRow.pathDescriptionPadre);
        $fr_pathDescription.val(tableRow.pathDescription);
        $fr_descripcion.val(tableRow.descripcion);
        $fr_isRaiz.prop('checked', tableRow.isRaiz == 1)
        $fr_isVisible.prop('checked', tableRow.isVisible == 1)
        
        if (tableRow.isRaiz == 1) {
            $fr_adminCtMenu.val("N/A");
            $fr_id_menu.val("");
            $fr_adminCtMenu.prop("disabled", true);
        }
    }

    function getDatosFromForm() {
        let objSendStored = {};

        if (eventModal != "delete") {
            objSendStored.nombre = $fr_nombre.val();
            objSendStored.id_menuPadre = $fr_id_menu.val() == "" ? 0 : $fr_id_menu.val();
            objSendStored.pathDescription = $fr_pathDescription.val();
            objSendStored.descripcion = $fr_descripcion.val();
            objSendStored.isRaiz = $fr_isRaiz.is(':checked') ? 1 : 0;
            objSendStored.isVisible = $fr_isVisible.is(':checked') ? 1 : 0;
        }

        if (eventModal == "edit" || eventModal == "delete") {
            objSendStored.id_menu = objOriginal.id_menu;
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
        let id_RVA = objClsMenus.getListaPermisos()["BTN-NEW"].id_RVA;

        //! Peticion para agregar registro
        doAjax("POST", url_Administrador_AddMenu, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedUpdate(objSend) {
        let id_RVA = objClsMenus.getListaPermisos()["BTN-EDIT"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_UpdateMenu, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedDelete(objSend) {
        let id_RVA = objClsMenus.getListaPermisos()["BTN-ERASE"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_DeleteMenu, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    async function finishStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            closeModal();
            await sleep(200);

            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            objClsMenus.refresh();
            
        }
    }

    function resetModal() {
        enabledElements("#frmPrincipal input, #frmPrincipal select");
        //! Reset forms
        $formPrincipal.validate().resetForm();
        $formPrincipal[0].reset();

        //! Establecer status
        $fr_isRaiz.prop('checked', false);
        $fr_isVisible.prop('checked', eventModal == "create");
        $fr_adminCtMenu.prop("disabled", false);
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
                fr_pathDescription: "required",
                fr_descripcion: "required",
                fr_adminCtMenu: "isMenuInList"
            },
            messages: {
                fr_nombre: "Ingrese el nombre",
                fr_pathDescription: "Ingrese la ruta del menú",
                fr_descripcion: "Ingrese la descripción"
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