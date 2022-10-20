const mdlServiciosCliente = function () {    
    //! Doom del modal
    var $formServicios = $("#frmServicios"),
        $modalServicios = $("#mdlServicios"),
        eventModal = 'BTN-SERVICIO',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD]
    //var $fr_id_cliente = $("#fr_id_paciente");
    var $fr_rfc_contacto = $("#fr_rfc_contacto");
    var $fr_tipo_contacto = $("#fr_tipo_contacto"); //la descripcion del modal 
    var $fr_nombre_completo_contacto = $("#fr_nombre_completo_contacto");
    var $fr_telefono_contacto = $("#fr_telefono_contacto");
    var $fr_correo_contacto = $("#fr_correo_contacto");

    var id_cliente;

    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsCliente.tblContactos;
    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-SERVICIO':
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
        $modalServicios.modal();//Mostrar modal
        await sleep(200);//Dale tiempo para mostrar el modal
        objClsCliente.tblContactos.adjustColumns();//renderiza mejor las columnas
        GetContactosCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetContactosCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIO"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetContactos, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {
                    //item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';

                    //item.acciones += '<a href="#" class="btn btn-style btn-warning" title="editar pago"><i class="fa fa-edit"></i ></a>&nbsp;&nbsp;';
                    item.acciones = '<a href="#" onclick="objClsCliente.mdlContactos.eliminar(' + item.id_contacto_cliente + ')" class="btn btn-style btn-danger" title="eliminar contactos"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
        });
    }

    function eliminar(id_contacto_cliente, showWait = false) {

        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIO"].id_RVA;
                    var objSend = JSON.stringify({ id_contacto_cliente: id_contacto_cliente });
                    doAjax("POST", url_Catalogos_EliminarContactos, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
                        let result = new Result(data);

                        //! Si tiene registros
                        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                            GetContactosCliente(true);

                        }

                    });
                },
                CANCELAR: function () {

                }
            }
        });



    }

    //! Asignar los valores de la fila seleccionada al formulario de repositorio
    function setDatosFormulario() {
        let tableRow = objClsCliente.tblPrincipal.getRowSelected();
        objOriginal = tableRow;
        ////! Asignar datos
        $fr_rfc_contacto.val(tableRow.rfc);
        id_cliente = tableRow.id_cliente;
    }

    //! Obtener los datos de formulario de la table principal de pacientes
    function getDatosFomulario() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.tipo_contacto = $fr_tipo_contacto.val();
        objSendStored.nombre_completo_contacto = $fr_nombre_completo_contacto.val();
        objSendStored.telefono_contacto = $fr_telefono_contacto.val();
        objSendStored.correo_contacto = $fr_correo_contacto.val();
        return objSendStored;
    }

    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-SERVICIO') {
            if (!$formServicios.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-SERVICIO':
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
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIO"].id_RVA;

        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddContactos,
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
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIO"].id_RVA;
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
            GetContactosCliente(true);
            //clearData();
            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
        }
    }

    //! Reiniciar valores del formulario
    function resetearModal() {
        $formServicios.validate().resetForm();
        $formServicios[0].reset();
        tblPrincipal.clearRows();
        setDatosFormulario();
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
                fr_tipo_contacto: "required",
                fr_nombre_completo_contacto: "required",
                fr_telefono_contacto: "required",
                fr_correo_contacto: "required",

            },
            messages: {
                fr_tipo_contacto: "Ingrese un tipo",
                fr_porcentaje: "Ingrese un porcentaje",
                fr_telefono_contacto: "Ingrese un teléfono",
                fr_correo_contacto: "Ingrese un correo",
            }
        }
        $formServicios.validate(principalForm);
    }

    function EliminarPagos() {

        objSend = JSON.stringify({ id_RIF_pago: row.id_RIF_pago, id_cliente: row.id_cliente });
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-ADD-PAGOS"].id_RVA;

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
        eliminar: eliminar
    }
};
//sfsdfdsf