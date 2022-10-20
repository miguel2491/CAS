const mdlRepositorio = function () {
    //! Doom del modal
    var $formRepositorio = $("#frmRepositorio"),
        $modalRepositorio = $("#mdlRepositorio"),
        eventModal = 'BTN-ADD-FILE',
        tblPrincipal = null,
        objOriginal = {};

    var listaDocumentos = null;
    //! Campos modal [CRUD]
    //var $fr_id_cliente = $("#fr_id_paciente");
    var $txtDescripcion = $("#fr_descripcion"); //la descripcion del modal 
    var $txtArchivo = $("#fr_urlArchivo");

    var $txtCategoria = $("#fr_tipo_repositorio");
    var $txtDocumento = $("#fr_repositorio");
    var $txtVigencia = $("#fr_fecha_vigencia");


    

    $txtCategoria.change(function () {
        var categoria_select = $txtCategoria.children("option:selected").text();
        objClsClienteRIF.tblRepositorio.table.search(categoria_select).draw();
        var id_categoria = $txtCategoria.val();
        if (listaDocumentos.length > 0) {
            var strOption = "";
            for (var i = 0; i < listaDocumentos.length; i++) {
                var item = listaDocumentos[i];
                if (item.id_tipo_repositorio == id_categoria) {
                    strOption += "<option value='" + item.id_lista_repositorio + "'>" + item.repositorio + "</option>";
                }                
            }
            $txtDocumento.html(strOption);
        }
    });


    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsClienteRIF.tblRepositorio;
    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-ADD-FILE':
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
        $modalRepositorio.modal();//Mostrar modal
        await sleep(200);//Dale tiempo para mostrar el modal
        objClsClienteRIF.tblRepositorio.adjustColumns();//renderiza mejor las columnas
        GetRepositorioCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
        GetDocumentosDigitales(false);
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetRepositorioCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetRepositorio, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {

                    var extension = item.nombre_archivo.split('.');

                    item.acciones = "";

                    if (item.nombre_archivo != '') {

                        if (extension[1] == "pdf") {
                            item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" target="_blank" download="' + item.repositorio + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                        }
                        else {
                            item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download="' + item.repositorio + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                        }
                    }
                    
                    //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                    item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlSecundario.eliminar(' + item.id_repositorio + ',\'' + item.url_archivo + '\',\'' + item.nombre_archivo + '\',true)" class="btn btn-style btn-danger" title="eliminar archivo"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
        });
    }

    function GetDocumentosDigitales(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_regimen: id_regimen });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE"].id_RVA;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetDocumentosDigitales, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                listaDocumentos = result.resultStoredProcedure.msnSuccess;

                var categoria_select = $txtCategoria.children("option:selected").text();
                objClsClienteRIF.tblRepositorio.table.search(categoria_select).draw();
                var id_categoria = $txtCategoria.val();
                if (listaDocumentos.length > 0) {
                    var strOption = "";
                    for (var i = 0; i < listaDocumentos.length; i++) {
                        var item = listaDocumentos[i];
                        if (item.id_tipo_repositorio == id_categoria) {
                            strOption += "<option value='" + item.id_lista_repositorio + "'>" + item.repositorio + "</option>";
                        }
                    }
                    $txtDocumento.html(strOption);
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
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE"].id_RVA;
                    var objSend = JSON.stringify({ id_repositorio: id_repositorio, nombre_archivo: nombre_archivo, url_archivo: url_archivo, id_cliente: id_cliente });
                    doAjax("POST", url_Catalogos_EliminarRepositorio, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
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
        objSendStored.descripcion = $txtDescripcion.val();
        objSendStored.id_lista_repositorio = $txtDocumento.val();
        objSendStored.fecha_vigencia = $txtVigencia.val();
        return objSendStored;
    }

    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-ADD-FILE') {
            if (!$formRepositorio.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-ADD-FILE':
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE"].id_RVA;

        frmData.append('url_archivo', $txtArchivo.val() != "" ? $txtArchivo[0].files[0] : "");
        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddRepositorio,
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE"].id_RVA;
        doAjax("POST", url_Catalogos_UpdRepositorio, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
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
        $formRepositorio.validate().resetForm();
        $formRepositorio[0].reset();
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

                //fr_urlArchivo: "required"

            },
            messages: {

                //fr_urlArchivo: "Favor de cargar archivo"
            }
        }
        $formRepositorio.validate(principalForm);
    }

    function EliminarRepositorio() {

        objSend = JSON.stringify({ id_repositorio: row.id_repositorio, id_cliente: row.id_cliente, nombre_archivo: row.nombre_archivo });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-FILE"].id_RVA;

        doAjax("POST", url_Catalogos_UpdRepositorio, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
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
        EliminarRepositorio: EliminarRepositorio,
        eliminar: eliminar
    }
};