const mdlEstadoCuenta = function () {
    //! Doom del modal
    var $formEstadoCuenta = $("#frmEstadoCuenta"),
        $modalEstadoCuenta = $("#mdlEstadoCuenta"),        
        eventModal = 'BTN-ESTADO-CUENTA',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD]
    //! Entregable 1
    var $txtDescripcion = $("#fr_descripcionEstadoCuenta"); //la descripcion del modal 
    var $txtArchivo = $("#fr_urlArchivoEstadoCuenta");
    var $txtMes = $("#fr_mesEstadoCuenta");
    var $txtPeriodo = $("#fr_periodoEstadoCuenta");
    var $selectEntregable = $("#fr_estado_cuenta");
       


    $txtMes.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select;
        //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
        //$("body").find("[aria-controls='tblEntregable']").val(texto);
        objClsClienteRIF.tblEstadoCuenta.table.search(texto, true,false).draw();

    });

    $txtPeriodo.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select;
        //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
        //$("body").find("[aria-controls='tblEntregable']").val(texto);
        objClsClienteRIF.tblEstadoCuenta.table.search(texto, true, false).draw();
    });

    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsClienteRIF.tblEstadoCuenta;
        
    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-ESTADO-CUENTA':                
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
        objClsClienteRIF.tblEstadoCuenta.adjustColumns();//renderiza mejor las columnas
        GetEstadoCuentaCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetEstadoCuentaCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ESTADO-CUENTA"].id_RVA;
        

        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetEstadoCuenta, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
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
                            item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download="' + item.estado_cuenta + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                        }                        
                    }
                    
                    //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                    item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlEstadoCuentam.eliminar(' + item.id_estado_cuenta + ',\'' + item.url_archivo + '\',\'' + item.nombre_archivo + '\',true)" class="btn btn-style btn-danger" title="eliminar archivo"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();

            let month = moment().format('M');
            $txtMes.val(month);

            var periodo_select = $txtPeriodo.val();
            var mes_select = $txtMes.children("option:selected").text();
            var texto = periodo_select + "/" + mes_select;
            //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
            //$("body").find("[aria-controls='tblEntregable']").val(texto);
            objClsClienteRIF.tblEstadoCuenta.table.search(texto, true, false).draw();
        });
    }

    function eliminar(id_estado_cuenta, url_archivo, nombre_archivo, showWait = false) {


        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ESTADO-CUENTA"].id_RVA;
                    var objSend = JSON.stringify({ id_estado_cuenta: id_estado_cuenta, nombre_archivo: nombre_archivo, url_archivo: url_archivo, id_cliente: id_cliente });
                    doAjax("POST", url_Catalogos_EliminarEstadoCuenta, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
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
        objSendStored.descripcion = $txtDescripcion.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.estado_cuenta = $selectEntregable.val();
        objSendStored.rfc = objClsClienteRIF.rfc;

        return objSendStored;
    }

    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-ESTADO-CUENTA') {
            if (!$formEstadoCuenta.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-ESTADO-CUENTA':
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ESTADO-CUENTA"].id_RVA;
        var obj = JSON.parse(objSend);
        if (obj.estado_cuenta != "") {
            frmData.append('url_archivo', $txtArchivo.val() != "" ? $txtArchivo[0].files[0] : "");
            frmData.append('jsonJS', objSend);
            frmData.append('id_RV', id_RV);
            frmData.append('id_RVA', id_RVA);

            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddEstadoCuenta,
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ESTADO-CUENTA"].id_RVA;
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
                
            },
            messages: {
                fr_periodoEstadoCuenta: "Ingresa el año",
                fr_urlArchivoEstadoCuenta: "Debe cargar un archivo",
                
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
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ESTADO-CUENTA"].id_RVA;

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
        eliminar: eliminar
    }
};