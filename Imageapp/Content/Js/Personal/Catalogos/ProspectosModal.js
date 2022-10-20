const mdlClientes = function () {
    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $modalPrincipal = $("#mdlClientes"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};

    //! Inputs del modal
    var


        $fr_correo_electronico = $("#fr_correo_electronico"),
        $fr_telefono = $("#fr_telefono"),
        $fr_telefono_movil = $("#fr_telefono_movil"),

        $fr_rfc = $("#fr_rfc"),

        $fr_nombre_razon = $("#fr_nombre_razon");
        

    //! Validaciones personalizadas
    jQuery.validator.addMethod('isSamePassword', function (value, element, isactive) {
        return isactive;
    }, "Las contraseñas no coincinden");

    //! Asigna el tipo de evento del modal
    function typeEvent(flag) {
        eventModal = flag;
    }

    //! Obtiene el tipo de evento del modal
    function getTypeEvent() {
        return eventModal;
    }

    function setArrayCtHospitales(array) {
        arrayCtHospitales = array;
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

    //! Asigna los valores al modal
    function setDatosModal() {
        setDatosFromRow();//Enviar los datos de la fila seleccionada al formulario del modal
        $modalPrincipal.modal();//Mostrar modal
    }

    function setDatosFromRow() {
        let tableRow = objClsCliente.tblPrincipal.getRowSelected();
        objOriginal = tableRow;
               
        $fr_correo_electronico.val(tableRow.correo_electronico)
        $fr_telefono.val(tableRow.telefono)
        $fr_telefono_movil.val(tableRow.telefono_movil)
                $fr_rfc.val(tableRow.rfc)
        
        $fr_nombre_razon.val(tableRow.nombre_razon)

    }

    function getDatosFromForm() {
        let objSendStored = {};

        if (eventModal != "delete") {
            
            objSendStored.correo_electronico = $fr_correo_electronico.val();
            objSendStored.telefono = $fr_telefono.val();
            objSendStored.telefono_movil = $fr_telefono_movil.val();
            objSendStored.rfc = $fr_rfc.val();            
            objSendStored.nombre_razon = $fr_nombre_razon.val();            
                        
        }

        if (eventModal == "edit" || eventModal == "delete") {
            objSendStored.id_cliente = objOriginal.id_cliente;
            objSendStored.id_usuario = objOriginal.id_usuario;
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
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-NEW"].id_RVA;

        //! Peticion para agregar registro
        doAjax("POST", url_Catalogos_AddCliente, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
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
                
                
                fr_nombre_razon: "required",
                
            },
            messages: {
               
                fr_nombre_razon: "Ingrese un nombre o razón soocial",
                
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