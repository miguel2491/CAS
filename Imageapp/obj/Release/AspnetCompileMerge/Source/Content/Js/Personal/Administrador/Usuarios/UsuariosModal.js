const mdlUsuarios = function () {
    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $modalPrincipal = $("#mdlUsuarios"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};
    
    //! Inputs del modal
    var $fr_nombre = $("#fr_nombre"),
        $fr_apellido_paterno = $("#fr_apellido_paterno"),
        $fr_apellido_materno = $("#fr_apellido_materno"),
        $fl_rol = $("#fr_rol"),
        $fr_usuario = $("#fr_usuario"),
        $fr_contrasenia = $("#fr_contrasenia"),
        $fr_contrasenia2 = $("#fr_contrasenia2"),
        $fr_id_estatus = $("#fr_id_estatus"),

        $fr_fecha_nacimiento = $("#fr_fecha_nacimiento"),
        $fr_correo_electronico = $("#fr_correo_electronico"),
        $fr_telefono = $("#fr_telefono"),
        $fr_telefono_movil = $("#fr_telefono_movil")
        
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
                disabledElements("#frmPrincipal input,#frmPrincipal select, #frmPrincipal password");
                $titleModal.text("Eliminar");
                $btnAceptar.text("Eliminar");
                setDatosModal();
                break;
            case 'regimen':

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
        let tableRow = objClsUsuario.tblPrincipal.getRowSelected();
        objOriginal = tableRow;

        //! Asignar datos
        $fr_nombre.val(tableRow.nombre);
        $fr_apellido_paterno.val(tableRow.apellido_paterno)
        $fr_apellido_materno.val(tableRow.apellido_materno)
        $fl_rol.val(tableRow.id_rol)
        $fr_usuario.val(tableRow.usuario)
        $fr_contrasenia.val("")
        $fr_contrasenia2.val("")
        $fr_id_estatus.prop('checked', tableRow.id_estatus == 1)


        $fr_fecha_nacimiento.val(tableRow.fecha_nacimiento)
        $fr_correo_electronico.val(tableRow.correo_electronico)
        $fr_telefono.val(tableRow.telefono)
        $fr_telefono_movil.val(tableRow.telefono_movil)


    }

    function getDatosFromForm() {
        let objSendStored = {};

        if (eventModal != "delete") {
            objSendStored.nombre = $fr_nombre.val();
            objSendStored.apellido_paterno = $fr_apellido_paterno.val();
            objSendStored.apellido_materno = $fr_apellido_materno.val();
            objSendStored.rol = $fl_rol.val();
            objSendStored.usuario = $fr_usuario.val();
            objSendStored.contrasenia = $fr_contrasenia.val();
            objSendStored.id_estatus = $fr_id_estatus.is(':checked') ? "1" : "2";


            objSendStored.fecha_nacimiento = $fr_fecha_nacimiento.val();
            objSendStored.correo_electronico = $fr_correo_electronico.val();
            objSendStored.telefono = $fr_telefono.val();
            objSendStored.telefono_movil = $fr_telefono_movil.val();

        }

        if (eventModal == "edit" || eventModal == "delete") {
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
        let id_RVA = objClsUsuario.getlistaPermisos()["BTN-NEW"].id_RVA;

        //! Peticion para agregar registro
        doAjax("POST", url_Administrador_AddUsuario, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedUpdate(objSend) {
        let id_RVA = objClsUsuario.getlistaPermisos()["BTN-EDIT"].id_RVA;
        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_UpdateUsuario, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedDelete(objSend) {
        let id_RVA = objClsUsuario.getlistaPermisos()["BTN-ERASE"].id_RVA;

        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_DeleteUsuario, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    async function finishStoredProcedure(data) {
        let result = new Result(data);
        
        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            closeModal();
            await sleep(200);

            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            objClsUsuario.getListaPrincipal(true);
        }
    }

    function resetModal() {
        enabledElements("#frmPrincipal input, #frmPrincipal select, #frmPrincipal password");
        //Reset forms
        $formPrincipal.validate().resetForm();
        $formPrincipal[0].reset();
        $fr_contrasenia.removeClass("error");
        
        $('.nav-tabs a[href="#formTab"]').tab('show');
        $('.nav-tabs a[href="#rlVistas"]').removeClass('disabled');

        //Establecer status
        $fr_id_estatus.prop('checked', eventModal == "create");
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
                fr_nombre: "required",
                fr_apellido_paterno: "required",
                fr_apellido_materno: "required",
                fr_rol: "required",
                fr_usuario: "required",
                fr_fecha_nacimiento: "required",
                fr_correo_electronico: "required",
                fr_telefono: "required",
                fr_telefono_movil: "required",
                fr_contrasenia: {
                    required: {
                        depends: function (element) {
                            return (eventModal == "create");
                        }
                    }
                },
                fr_contrasenia2: {
                    isSamePassword: function (element) { return ($fr_contrasenia.val() == $fr_contrasenia2.val()) }
                }
            },
            messages: {
                fr_nombre: "Ingrese el nombre",
                fr_apellido_paterno: "Ingrese el apellido paterno",
                fr_apellido_materno: "Ingrese el apellido materno",
                fr_rol: "Seleccione un perfil",
                fr_usuario: "Ingrese el usuario",
                fr_fecha_nacimiento: "Ingrese una fecha de nacimiento",
                fr_correo_electronico: "Ingrese un correo electrónico",
                fr_telefono: "Ingrese un teléfono",
                fr_telefono_movil: "Ingrese un teléfono móvil",
                fr_contrasenia: "Ingrese la contraseña"
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