const mdlRepositorioNomina = function () {
    //! Doom del modal
    var $formRepositorioNomina = $("#frmRepositorioNomina"),
        $modalRepositorioNomina = $("#mdlRepositorioNomina"),        
        eventModal = 'BTN-ADD-FILE-NOMINA',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD]
    //var $fr_id_cliente = $("#fr_id_paciente");
    var $txtDescripcionNomina = $("#fr_descripcionNomina"); //la descripcion del modal 
    var $txtArchivoNomina = $("#fr_urlArchivoNomina");
    var $txtMes = $("#fr_mesEntregableNomina");
    var $txtPeriodo = $("#fr_periodoEntregableNomina");
    var $txtEntregable = $("#fr_entregable_nomina");
    var $txtPeriodicidad = $("#fr_periodicidad_nomina");
    var $txtCategoria = $("#fr_tipo_nomina");

    var listaDocumentos = null;

    $txtMes.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select;
        objClsClienteRIF.tblRepositorioNomina.table.search(texto).draw();
    });

    $txtPeriodo.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select;
        objClsClienteRIF.tblRepositorioNomina.table.search(texto).draw();
    });

    $txtCategoria.change(function () {
        //var categoria_select = $txtCategoria.children("option:selected").text();
        //objClsClienteRIF.tblRepositorio.table.search(categoria_select).draw();
        

        var id_categoria = $txtCategoria.val();
        if (listaDocumentos.length > 0) {
            var strOption = "";
            for (var i = 0; i < listaDocumentos.length; i++) {
                var item = listaDocumentos[i];
                if (item.id_tipo_nomina_entregable == id_categoria) {
                    strOption += "<option value='" + item.id_lista_entregable_nomina + "'>" + item.entregable + "</option>";
                }
            }
            $txtEntregable.html(strOption);
        }
    });

    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsClienteRIF.tblRepositorioNomina;
    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-ADD-FILE-NOMINA':                
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
        $modalRepositorioNomina.modal();//Mostrar modal
        await sleep(200);//Dale tiempo para mostrar el modal
        objClsClienteRIF.tblRepositorioNomina.adjustColumns();//renderiza mejor las columnas
        GetRepositorioCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
        GetDocumentosNomina(false);
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetRepositorioCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE-NOMINA"].id_RVA;
        

        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetRepositorioNomina, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {
                    item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                    //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                    item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlSecundarioNomina.eliminar(' + item.id_entregable_nomina_RFC + ',\'' + item.url_archivo + '\',\'' + item.nombre_archivo + '\',true)" class="btn btn-style btn-danger" title="eliminar archivo"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
        });
    }

    function GetDocumentosNomina(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetDocumentosNomina, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                listaDocumentos = result.resultStoredProcedure.msnSuccess;

                var periodo_select = $txtPeriodo.val();
                var mes_select = $txtMes.children("option:selected").text();
                var texto = periodo_select + "/" + mes_select;
                objClsClienteRIF.tblRepositorioNomina.table.search(texto).draw();

                var id_categoria = $txtCategoria.val();
                if (listaDocumentos.length > 0) {
                    var strOption = "";
                    for (var i = 0; i < listaDocumentos.length; i++) {
                        var item = listaDocumentos[i];
                        if (item.id_tipo_nomina_entregable == id_categoria) {
                            strOption += "<option value='" + item.id_lista_entregable_nomina + "'>" + item.entregable + "</option>";
                        }
                    }
                    $txtEntregable.html(strOption);
                }
            }
        });
    }

    function eliminar(id_repositorio, url_archivo, nombre_archivo, showWait = false) {


        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE-NOMINA"].id_RVA;
                    var objSend = JSON.stringify({ id_repositorio: id_repositorio, nombre_archivo: nombre_archivo, url_archivo: url_archivo, id_cliente: id_cliente });
                    doAjax("POST", url_Catalogos_EliminarRepositorioNomina, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
                        let result = new Result(data);

                        //! Si tiene registros
                        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                            GetRepositorioCliente(true);

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
        objSendStored.observaciones = $txtDescripcionNomina.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.id_lista_entregable_nomina = $txtEntregable.val();
        objSendStored.periodicidad = $txtPeriodicidad.val();
        objSendStored.id_regimen = id_regimen;

        return objSendStored;
    }

    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-ADD-FILE-NOMINA') {
            if (!$formRepositorioNomina.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-ADD-FILE-NOMINA':
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE-NOMINA"].id_RVA;

        frmData.append('url_archivo', $txtArchivoNomina.val() != "" ? $txtArchivoNomina[0].files[0] : "");
        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddRepositorioNomina,
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


    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure2() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-ADD-FILE-NOMINA') {
            if (!$formRepositorioNomina.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-ADD-FILE-NOMINA':
                storedAdd2(JSON.stringify(objSend));
                break;
            case enumEventosModal.ELIMINAR:
                storedDelete(JSON.stringify(objSend));
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    //! Peticion para agregar registro
    function storedAdd2(objSend) {
        var frmData = new FormData();
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE-NOMINA"].id_RVA;

        frmData.append('url_archivo', $txtArchivoNomina.val() != "" ? $txtArchivoNomina[0].files[0] : "");
        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddRepositorioNomina2,
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE-NOMINA"].id_RVA;
        doAjax("POST", url_Catalogos_UpdRepositorioNomina, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finalizarStoredProcedure(data);
        });
    }

    //! Tratar resultado del stored procedure
    async function finalizarStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            resetearModal();
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            GetRepositorioCliente(true);
            //clearData();
            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
        }
    }

    //! Reiniciar valores del formulario
    function resetearModal() {
        $formRepositorioNomina.validate().resetForm();
        $formRepositorioNomina[0].reset();
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
                    EliminarRepositorio();
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
                
                fr_urlArchivo: "required"
            },
            messages: {
               
                fr_urlArchivo: "Favor de cargar archivo"
            }
        }
        $formRepositorioNomina.validate(principalForm);
    }

    function EliminarRepositorio() {
        
        objSend = JSON.stringify({ id_repositorio: row.id_repositorio_nomina, id_cliente: row.id_cliente, nombre_archivo: row.nombre_archivo });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE-NOMINA"].id_RVA;

        doAjax("POST", url_Catalogos_UpdRepositorioNomina, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finalizarStoredProcedure(data);
        });
    }

    return {
        inicio: inicio,
        mostrarModal: mostrarModal,
        enviarStoredProcedure: enviarStoredProcedure,
        enviarStoredProcedure2: enviarStoredProcedure2,
        confirmarModal: confirmarModal,
        waitResultModal: waitResultModal,
        setTipoEvento: tipoEvento,
        getTipoEvento: getTipoEvento,
        inicializarValidaciones: inicializarValidaciones,
        EliminarRepositorio: EliminarRepositorio,
        eliminar: eliminar
    }
};