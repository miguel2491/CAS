const mdlServiciosCliente = function () {
    //! Doom del modal
    var $formServicios = $("#frmServicios"),
        $modalServicio = $("#mdlServicios"),
        eventModal = 'BTN-SERVICIOS',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD]
    //var $fr_id_cliente = $("#fr_id_paciente");
    var $fr_rfc_servicio = $("#fr_rfc_servicio"); //la descripcion del modal 
    var $fr_servicio = $("#fr_servicio");

    var $fr_id_linea = $("#fr_id_linea");
    var $fr_encargado = $("#fr_encargado");
    var $fr_inicio_servicio = $("#fr_inicio_servicio");
    var $fr_grupo_empresarial = $("#fr_grupo_empresarial");

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
            case 'BTN-SERVICIOS':
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
        $modalServicio.modal();//Mostrar modal
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
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIOS"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetServicios, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {
                    //item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                    
                    //item.acciones += '<a href="#" class="btn btn-style btn-warning" title="editar pago"><i class="fa fa-edit"></i ></a>&nbsp;&nbsp;';
                    item.acciones = '<a href="#" onclick="objClsCliente.mdlServicios.eliminar(' + item.id_servicio_cliente + ')" class="btn btn-style btn-danger" title="eliminar servicio"><i class="fa fa-trash"></i ></a>';
                    item.acciones += '<a href="#" class="btn btn-style btn-ok btnServicioUpdateFecha ml-2" title="actualizar fecha"><i class="fa fa-edit"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
        });
    }

    function eliminar(id_servicio_cliente, showWait = false) {

        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIOS"].id_RVA;
                                var objSend = JSON.stringify({ id_servicio_cliente: id_servicio_cliente });
                                doAjax("POST", url_Catalogos_EliminarServicio, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
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
        $fr_inicio_servicio.val(tableRow.inicio_servicio);
        $fr_grupo_empresarial.val(tableRow.id_grupo_empresarial);
        
        id_cliente = tableRow.id_cliente;
    }

    //! Obtener los datos de formulario de la table principal de pacientes
    function getDatosFomulario() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.servicio = $fr_servicio.val();  

        objSendStored.id_linea = $fr_id_linea.val();
        objSendStored.encargado = $fr_encargado.val();
        objSendStored.inicio_servicio = $fr_inicio_servicio.val();
        objSendStored.id_grupo_empresarial = $fr_grupo_empresarial.val();

        return objSendStored;
    }

    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-SERVICIOS') {
            if (!$formServicios.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-SERVICIOS':
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
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIOS"].id_RVA;

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
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) { jsSimpleAlert("Error", errorThrown); })
            .always(function () { $msnWait.close() });
    }

    //! Peticion para eliminar respositorio de paciente
    function storedDelete(objSend) {
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-SERVICIOS"].id_RVA;
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
                fr_encargado: "required",
                //fr_inicio_servicio: "required",
                fr_grupo_empresarial: "required",
                fr_id_linea: 'required',

            },
            messages: {
                fr_servicio: "Ingrese un servicio",
                fr_encargado: "Ingrese un encargado",
                //fr_inicio_servicio: "Ingrese la fecha",
                fr_grupo_empresarial: "Seleccione el grupo empresarial",
                fr_id_linea: 'Seleccione la linea de producción',
            }
        }
        $formServicios.validate(principalForm);
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