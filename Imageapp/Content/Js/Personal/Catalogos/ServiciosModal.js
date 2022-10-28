const mdlServiciosCliente = function () {
    //! Doom del modal
    var $formServicios = $("#frmServicios"),
        $modalServicios = $("#mdlServicios"),
        eventModal = 'BTN-SERVICIO',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD] 
    var $fr_rfc_servicio = $("#fr_rfc_servicio");
    var $fr_servicio = $("#fr_servicio");
    var $fr_Ingreso = $("#fr_Ingreso");
    var $fr_NumeroTrabajadores = $("#fr_NumeroTrabajadores");
    var $fr_Cantidad = $("#fr_Cantidad");
    var $id_opcion_porcentaje = $("#id_opcion_porcentaje");
    var $fr_inicio_servicio = $("#fr_inicio_servicio");
    var $fr_numero_periodos = $("#fr_numero_periodos");

    var id_cliente;

    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsCliente.tblServicios;
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
        objClsCliente.tblServicios.adjustColumns();//renderiza mejor las columnas
        GetServiciosCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetServiciosCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIO"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetServicios, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);
            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {
                    //item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';

                    //item.acciones += '<a href="#" class="btn btn-style btn-warning" title="editar pago"><i class="fa fa-edit"></i ></a>&nbsp;&nbsp;';
                    item.acciones = '<a href="#" onclick="objClsCliente.mdlServicio.eliminar(' + item.id_cliente_servicio + ')" class="btn btn-style btn-danger" title="eliminar servicio"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
            tblPrincipal.adjustColumns();
        });
    }

    function eliminar(id_cliente_servicio, showWait = false) {

        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIO"].id_RVA;
                    var objSend = JSON.stringify({ id_cliente_servicio: id_cliente_servicio });
                    doAjax("POST", url_Catalogos_EliminarServicio, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
                        console.log(data)
                        let result = new Result(data);

                        //! Si tiene registros
                        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                            GetServiciosCliente(true);

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
        $fr_rfc_servicio.val(tableRow.rfc);
        id_cliente = tableRow.id_cliente;
    }

    //! Obtener los datos de formulario de la table principal de pacientes
    function getDatosFomulario() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.id_servicio = $fr_servicio.val();
        objSendStored.ingreso = $fr_Ingreso.val();
        objSendStored.numero_trabajadores = $fr_NumeroTrabajadores.val();
        objSendStored.cantidad = $fr_Cantidad.val();
        objSendStored.porcentaje = $id_opcion_porcentaje.val();
        objSendStored.descuento = 0;
        objSendStored.fecha_inicio_servicio = $fr_inicio_servicio.val();
        objSendStored.numero_periodos = $fr_numero_periodos.val();
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
            url: url_Catalogos_AddServicio,
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
                                        
                    $fr_Ingreso.css("display", "none");
                    $fr_Ingreso.val(0);
                    $("#labIngreso").css("display", "none");

                    $fr_NumeroTrabajadores.css("display", "none");
                    $fr_NumeroTrabajadores.val(0);
                    $("#labNumerotrabajadores").css("display", "none");

                    $fr_Cantidad.css("display", "none");
                    $fr_Cantidad.val(0);
                    $("#labCantidad").css("display", "none");

                    $id_opcion_porcentaje.css("display", "none");
                    $id_opcion_porcentaje.val(0);
                    $("#labPorcentaje").css("display", "none");

                    $fr_inicio_servicio.css("display", "none");
                    $fr_inicio_servicio.val(0);
                    $("#labFechaInicioServicio").css("display", "none");

                    $fr_numero_periodos.css("display", "none");
                    $fr_numero_periodos.val(0);
                    $("#labNumeroPeriodos").css("display", "none");
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
            GetServiciosCliente(true);
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
                fr_servicio: "required",
                fr_Ingreso: "required",
                fr_NumeroTrabajadores: "required",
                fr_Cantidad: "required",
                id_opcion_porcentaje: "required",
                fr_inicio_servicio: "required",
                fr_numero_periodos: "required"
            },
            messages: {
                fr_servicio: "Debe seleccionar un servicio",
                fr_Ingreso: "Este cambo no puede estar vacío.",
                fr_NumeroTrabajadores: "Este cambo no puede estar vacío.",
                fr_Cantidad: "Este cambo no puede estar vacío.",
                id_opcion_porcentaje: "Este cambo no puede estar vacío.",
                fr_inicio_servicio: "Este cambo no puede estar vacío.",
                fr_numero_periodos: "Este cambo no puede estar vacío."
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