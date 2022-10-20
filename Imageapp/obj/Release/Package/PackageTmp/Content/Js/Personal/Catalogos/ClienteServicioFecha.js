const mdlFechaServicio = function () {
    //! Doom del modal
    let $formPrincipal = $("#frmFechaServicio"),
        $modalPrincipal = $("#mdlFechaServicio"),
        eventModal = enumEventosModal.EDITAR,
        objOriginal = {};

    const typeEvent = (flag) => { eventModal = flag }
    const getTypeEvent = () => (eventModal)

    //! Accion para mostrar el modal
    function mostrarModal() {

        switch (eventModal) {
            case enumEventosModal.EDITAR:
                setupModal();
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }

    }

    //! Configurar estado del MODAL
    function setupModal() {
        resetModal();

        let tableRow = objClsCliente.tblServicios.getRowSelected();
        objOriginal = { ...tableRow };

        if (eventModal !== enumEventosModal.NUEVO) setDatosModal(tableRow);
    }

    async function setDatosModal(servicio) {

        //! Asignar datos
        $("#fr_inicio_servicio_up").val(servicio.inicio_servicio);
        $("#fr_grupo_empresarial_up").val(servicio.id_grupo_empresarial);

        $modalPrincipal.modal();
    }

    const getDatosModal = () => ({
        id_servicio_cliente: objOriginal.id_servicio_cliente,
        inicio_servicio: $("#fr_inicio_servicio_up").val(),
        id_grupo_empresarial: $("#fr_grupo_empresarial_up").val()
    })
    
    $("#btnAceptarMdlFechaServicio").on("click", sendToStored);
    $("#btnCloseMdlFechaServicio").on("click", () => {
        confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa salir?" });
    });

    function sendToStored() {
        let objSend = {};
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIOS"].id_RVA;

        //! Valildar formulario
        if (eventModal === enumEventosModal.EDITAR) {
            if (!$formPrincipal.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }

        objSend = JSON.stringify(getDatosModal());

        //! Peticion para agregar registro
        doAjax("POST", url_Catalogos_UpdateServicioAdicional, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    async function finishStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            closeModal();
            await sleep(200);

            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            let tableRow = objClsCliente.tblServicios.getRowSelected();
            tableRow.inicio_servicio = $("#fr_inicio_servicio_up").val();
            tableRow.id_grupo_empresarial = $("#fr_grupo_empresarial_up").val();
            tableRow.grupo_empresarial = $("#fr_grupo_empresarial_up option:selected").text();
            objClsCliente.tblServicios.updateRow(tableRow);
        }
    }

    //! Reiniciar valores del formulario
    function resetModal() {
        //enabledElements("#frmFichaTecnica input, #frmFichaTecnica select");
        //! Reset forms
        $formPrincipal[0].reset();
        $formPrincipal.validate().resetForm();
        objOriginal = {};
    }

    //! Mensaje de confirmacion
    function confirmarModal(paramsConfirm) {
        jsConfirmAlert(waitResultModal, paramsConfirm);
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
                //fr_inicio_servicio_up: 'required',
                fr_grupo_empresarial_up: 'required',
            },
            messages: {
                //fr_inicio_servicio_up: 'Ingresa la fecha',
                fr_grupo_empresarial_up: 'Seleccione el grupo empresarial',
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
        confirmarModal: confirmarModal,
        waitResultModal: waitResultModal,
        eventModal: typeEvent,
        getTypeEvent: getTypeEvent,
        initValidations: initValidations
    }
};