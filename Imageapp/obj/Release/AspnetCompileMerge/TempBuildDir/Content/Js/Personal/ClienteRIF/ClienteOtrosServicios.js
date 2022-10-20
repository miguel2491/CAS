const mdlOtrosServicios = function () {
    //! Doom del modal
    var $formOtrosServicios = $("#frmOtrosServicios"),
        $modalOtrosServicios = $("#mdlOtrosServicios"),        
        eventModal = 'BTN-OTROS-SERVICIOS',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD]
    //! Entregable 1
    var $txtDescripcion = $("#fr_descripcionOtrosServicios"); //la descripcion del modal 
    var $txtArchivo = $("#fr_urlArchivoOtrosServicios");
    var $txtMes = $("#fr_mesOtrosServicios");
    var $txtPeriodo = $("#fr_periodoOtrosServicios");
    var $selectOtrosServicios = $("#fr_OtrosServicios");
        


    $txtMes.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select;
        //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
        //$("body").find("[aria-controls='tblEntregable']").val(texto);
        objClsClienteRIF.tblOtrosServicios.table.search(texto, true,false).draw();

    });

    $txtPeriodo.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select;
        //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
        //$("body").find("[aria-controls='tblEntregable']").val(texto);
        objClsClienteRIF.tblOtrosServicios.table.search(texto, true, false).draw();
    });

    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsClienteRIF.tblOtrosServicios;
        
    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-OTROS-SERVICIOS':                
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
        $modalOtrosServicios.modal();//Mostrar modal
        await sleep(200);//Dale tiempo para mostrar el modal
        objClsClienteRIF.tblOtrosServicios.adjustColumns();//renderiza mejor las columnas
        GetOtrosServiciosCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetOtrosServiciosCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-OTROS-SERVICIOS"].id_RVA;
        

        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetOtrosServicios, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {

                    var extension = item.nombre_archivo.split('.');

                    item.acciones = "";

                    if (item.nombre_archivo != '') {

                        if (extension[1] == "pdf") {
                            item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" target="_blank" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                        }
                        else {
                            item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download="' + item.servicio + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                        }                        
                    }
                    
                    //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                    item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlOtrosServiciosm.eliminar(' + item.id_otro_servicio_rfc + ',\'' + item.url_archivo + '\',\'' + item.nombre_archivo + '\',true)" class="btn btn-style btn-danger" title="eliminar archivo"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
            var periodo_select = $txtPeriodo.val();
            var mes_select = $txtMes.children("option:selected").text();
            var texto = periodo_select + "/" + mes_select;
            //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
            //$("body").find("[aria-controls='tblEntregable']").val(texto);
            objClsClienteRIF.tblOtrosServicios.table.search(texto, true, false).draw();
        });
    }

    function eliminar(id_otro_servicio_rfc, url_archivo, nombre_archivo, showWait = false) {


        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-OTROS-SERVICIOS"].id_RVA;
                    var objSend = JSON.stringify({ id_otro_servicio_rfc: id_otro_servicio_rfc, nombre_archivo: nombre_archivo, url_archivo: url_archivo, id_cliente: id_cliente });
                    doAjax("POST", url_Catalogos_EliminarOtrosServicios, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
                        let result = new Result(data);

                        //! Si tiene registros
                        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                            GetOtrosServiciosCliente(true);

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
        objSendStored.descripcion = $txtDescripcion.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.id_otro_servicio = $selectOtrosServicios.val();


        return objSendStored;
    }   


    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-OTROS-SERVICIOS') {
            if (!$formOtrosServicios.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-OTROS-SERVICIOS':
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-OTROS-SERVICIOS"].id_RVA;
        var obj = JSON.parse(objSend);
        if (obj.id_otro_servicio != "") {
            frmData.append('url_archivo', $txtArchivo.val() != "" ? $txtArchivo[0].files[0] : "");
            frmData.append('jsonJS', objSend);
            frmData.append('id_RV', id_RV);
            frmData.append('id_RVA', id_RVA);

            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddOtrosServicios,
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-OTROS-SERVICIOS"].id_RVA;
        doAjax("POST", url_Catalogos_UpdOtrosServicios, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finalizarStoredProcedure(data);
        });
    }

    //! Tratar resultado del stored procedure
    async function finalizarStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            resetearModal();
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            GetOtrosServiciosCliente(true);
            //clearData();
            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
        }
    }

    //! Reiniciar valores del formulario
    function resetearModal() {
        $formOtrosServicios.validate().resetForm();
        $formOtrosServicios[0].reset();
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
                    EliminarOtrosServicios();
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
            
        }
        $formOtrosServicios.validate(principalForm);
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