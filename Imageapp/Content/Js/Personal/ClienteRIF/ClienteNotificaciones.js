const mdlNotificaciones = function () {
    //! Doom del modal
    var $formEstadoCuenta = $("#frmNotificaciones"),
        $modalEstadoCuenta = $("#mdlNotificaciones"),
        eventModal = 'BTN-NOTIFICACIONES',
        tblPrincipal = null,
        objOriginal = {};


    

    var $modalCarga = $("#mdlCargar");
    var $txtCarga = $("#txtCarga");
    //! Campos modal [CRUD]
    //! Entregable 1
    var $txtAutoridadEmisora = $("#fr_autoridad_emisora"); //la descripcion del modal
    var $txtActoAdimistrativo = $("#fr_acto_administrativo");
    var $txtFechaRecepcion = $("#fr_fecha_recepcion");
    var $txtfechaNotificacion = $("#fr_fecha_notificacion");
    var $txtMes = $("#fr_mesNotificacion");
    var $txtPeriodo = $("#fr_periodoNotificacion");
    var $txtEsAnual = $("#fr_es_anual");


    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsClienteRIF.tblNotificaciones;

    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-NOTIFICACIONES':
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
        $modalEstadoCuenta.modal();//Mostrar modal
        await sleep(200);//Dale tiempo para mostrar el modal
        objClsClienteRIF.tblNotificaciones.adjustColumns();//renderiza mejor las columnas
        GetEstadoCuentaCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function refresh() {
        GetEstadoCuentaCliente(true);
    }

    function GetEstadoCuentaCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-NOTIFICACIONES"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetNotificaciones, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {

                   

                    item.acciones = "";                   
                    item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlNotificacionesm.eliminar(' + item.id_notificacion + ',true)" class="btn btn-style btn-danger" title="eliminar notificacion"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();

            
           
        });
    }


    function cargarArchivo(id_notificacion, tipo, texto, showWait = true) {

        $id = id_notificacion, $tipo = tipo;
        $txtCarga.text(texto);
        $modalCarga.modal();

    }


    function eliminar(id_notificacion, showWait = false) {


        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ESTADO-CUENTA"].id_RVA;
                    var objSend = JSON.stringify({ id_notificacion: id_notificacion, id_cliente: id_cliente });
                    doAjax("POST", url_Catalogos_EliminarNotificacion, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
                        let result = new Result(data);

                        //! Si tiene registros
                        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                            GetEstadoCuentaCliente(true);

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
        let month = moment().format('M');
        $txtMes.val(month);
        //let tableRow = objClsPacientes.tblPrincipal.getRowSelected();
        //objOriginal = tableRow;
        ////! Asignar datos
        //$fr_id_paciente.val(tableRow.id_paciente);
    }

    //! Obtener los datos de formulario de la table principal de pacientes
    function getDatosFomulario() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.autoridad_emisora = $txtAutoridadEmisora.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.acto_administrativo = $txtActoAdimistrativo.val();
        objSendStored.fecha_recepcion = $txtFechaRecepcion.val();
        objSendStored.fecha_notificacion = $txtfechaNotificacion.val();
        objSendStored.es_anual = $txtEsAnual.is(':checked') ? "1" : "2";

        return objSendStored;
    }

    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-NOTIFICACIONES') {
            if (!$formEstadoCuenta.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-NOTIFICACIONES':
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-NOTIFICACIONES"].id_RVA;
        var obj = JSON.parse(objSend);
        if (obj.estado_cuenta != "") {
           
            frmData.append('jsonJS', objSend);
            frmData.append('id_RV', id_RV);
            frmData.append('id_RVA', id_RVA);

            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddNotificacion,
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

    }

    //! Peticion para eliminar respositorio de paciente
    function storedDelete(objSend) {
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-NOTIFICACIONES"].id_RVA;
        doAjax("POST", url_Catalogos_UpdEntregable, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finalizarStoredProcedure(data);
        });
    }

    //! Tratar resultado del stored procedure
    async function finalizarStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            resetearModal();
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            GetEstadoCuentaCliente(true);
            //clearData();
            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
        }
    }

    //! Reiniciar valores del formulario
    function resetearModal() {
        $formEstadoCuenta.validate().resetForm();
        $formEstadoCuenta[0].reset();
        tblPrincipal.clearRows();
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
                    EliminarEstadoCuenta();
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
                fr_periodoEstadoCuenta: "required",
                fr_urlArchivoEstadoCuenta: "required",
                fr_acto_administrativo: "required",
                fr_fecha_recepcion: "required",
                fr_fecha_notificacion: "required"
            },
            messages: {
                fr_periodoEstadoCuenta: "Ingresa el año",
                fr_urlArchivoEstadoCuenta: "Debe cargar un archivo",
                fr_acto_administrativo: "Ingresar acto administrativo",
                fr_fecha_recepcion: "Ingresa fecha de recepción",
                fr_fecha_notificacion: "Ingresa fecha de notificación"

            }
        }
        $formEstadoCuenta.validate(principalForm);
    }

    function EliminarEstadoCuenta() {

        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    objSend = JSON.stringify({ id_entregable_rfc: row.id_entregable_rfc, id_cliente: row.id_cliente, nombre_archivo: row.nombre_archivo });
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-NOTIFICACIONES"].id_RVA;

                    doAjax("POST", url_Catalogos_UpdEntregable, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
                        finalizarStoredProcedure(data);
                    });
                },
                CANCELAR: function () {

                }
            }
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
        EliminarEstadoCuenta: EliminarEstadoCuenta,
        eliminar: eliminar,
        cargarArchivo: cargarArchivo,
        refresh: refresh
    }
};