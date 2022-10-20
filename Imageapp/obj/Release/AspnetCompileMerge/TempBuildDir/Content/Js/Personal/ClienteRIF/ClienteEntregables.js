const mdlEntregable = function () {
    //! Doom del modal
    var $formEntregable = $("#frmEntregable"),
        $modalEntregable = $("#mdlEntregable"),        
        eventModal = 'BTN-ADD-ENTREGABLES',
        tblPrincipal = null,
        objOriginal = {};

    //! Campos modal [CRUD]
    //! Entregable 1
    var $txtDescripcion = $("#fr_descripcionEntregable"); //la descripcion del modal 
    var $txtArchivo = $("#fr_urlArchivoEntregable");
    var $txtMes = $("#fr_mesEntregable");
    var $txtPeriodo = $("#fr_periodoEntregable");
    var $selectEntregable = $("#fr_entregable");

    

    //! Entregable 2
    var $txtDescripcion2 = $("#fr_descripcionEntregable2"); //la descripcion del modal 
    var $txtArchivo2 = $("#fr_urlArchivoEntregable2");
    var $selectEntregable2 = $("#fr_entregable2");

    //! Entregable 3
    var $txtDescripcion3 = $("#fr_descripcionEntregable3"); //la descripcion del modal 
    var $txtArchivo3 = $("#fr_urlArchivoEntregable3");
    var $selectEntregable3 = $("#fr_entregable3");

    //! Entregable 4
    var $txtDescripcion4 = $("#fr_descripcionEntregable4"); //la descripcion del modal 
    var $txtArchivo4 = $("#fr_urlArchivoEntregable4");
    var $selectEntregable4 = $("#fr_entregable4");

    //! Entregable 5
    var $txtDescripcion5 = $("#fr_descripcionEntregable5"); //la descripcion del modal 
    var $txtArchivo5 = $("#fr_urlArchivoEntregable5");
    var $selectEntregable5 = $("#fr_entregable5");


    $txtMes.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL";
        //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
        //$("body").find("[aria-controls='tblEntregable']").val(texto);
        objClsClienteRIF.tblEntregable.table.search(texto, true,false).draw();

    });

    $txtPeriodo.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL";
        //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
        //$("body").find("[aria-controls='tblEntregable']").val(texto);
        objClsClienteRIF.tblEntregable.table.search(texto, true, false).draw();
    });

    //! Asigna el tipo de evento del modal (CRUD)
    function tipoEvento(flag) {
        eventModal = flag;
    }

    function inicio() {
        tblPrincipal = objClsClienteRIF.tblEntregable;
        
    }

    //! Obtiene el tipo de evento del modal (CRUD)
    function getTipoEvento() {
        return eventModal;
    }

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-ADD-ENTREGABLES':                
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
        $modalEntregable.modal();//Mostrar modal
        await sleep(200);//Dale tiempo para mostrar el modal
        objClsClienteRIF.tblEntregable.adjustColumns();//renderiza mejor las columnas
        GetEntregableCliente(true);//obtiene la lista de repositorios del paciente y los muestra en el modal
    }

    //function clearData() {   
    //    $txtDescripcion.val("");
    //    $txtArchivo.val("");
    //}

    function GetEntregableCliente(showWait = false) {
        tblPrincipal.clearRows();
        let objSend = JSON.stringify({ id_cliente: id_cliente });
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;
        

        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetEntregable, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
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
                            item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download="' + item.entregable + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                        }                        
                    }
                    
                    //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                    item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlEntregablem.eliminar(' + item.id_entregable_rfc + ',\'' + item.url_archivo + '\',\'' + item.nombre_archivo + '\',true)" class="btn btn-style btn-danger" title="eliminar archivo"><i class="fa fa-trash"></i ></a>';
                });
                tblPrincipal.addRows(contenido);
            }
            tblPrincipal.adjustColumns();
            var periodo_select = $txtPeriodo.val();
            var mes_select = $txtMes.children("option:selected").text();
            var texto = periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL";
            //var expresion = "/" + periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL" + "/g";
            //$("body").find("[aria-controls='tblEntregable']").val(texto);
            objClsClienteRIF.tblEntregable.table.search(texto, true, false).draw();
        });
    }

    function eliminar(id_entregable_rfc, url_archivo, nombre_archivo, showWait = false) {


        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;
                    var objSend = JSON.stringify({ id_entregable_rfc: id_entregable_rfc, nombre_archivo: nombre_archivo, url_archivo: url_archivo, id_cliente: id_cliente });
                    doAjax("POST", url_Catalogos_EliminarEntregable, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
                        let result = new Result(data);

                        //! Si tiene registros
                        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                            GetEntregableCliente(true);

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
        objSendStored.id_lista_entregable = $selectEntregable.val();


        return objSendStored;
    }

    function getDatosFomulario2() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.descripcion = $txtDescripcion2.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.id_lista_entregable = $selectEntregable2.val();


        return objSendStored;
    }

    function getDatosFomulario3() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.descripcion = $txtDescripcion3.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.id_lista_entregable = $selectEntregable3.val();


        return objSendStored;
    }

    function getDatosFomulario4() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.descripcion = $txtDescripcion4.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.id_lista_entregable = $selectEntregable4.val();


        return objSendStored;
    }

    function getDatosFomulario5() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = id_cliente;
        objSendStored.descripcion = $txtDescripcion5.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.id_lista_entregable = $selectEntregable5.val();


        return objSendStored;
    }


    //! Validar y enviar datos a los StoredProcedure
    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario
        if (eventModal == 'BTN-ADD-ENTREGABLES') {
            if (!$formEntregable.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        //! Objeto JSON
        objSend = getDatosFomulario();

        switch (eventModal) {
            case 'BTN-ADD-ENTREGABLES':
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
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;
        var obj = JSON.parse(objSend);
        if (obj.id_lista_entregable != "") {
            frmData.append('url_archivo', $txtArchivo.val() != "" ? $txtArchivo[0].files[0] : "");
            frmData.append('jsonJS', objSend);
            frmData.append('id_RV', id_RV);
            frmData.append('id_RVA', id_RVA);

            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddEntregable,
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
        var obj2 = getDatosFomulario2();
        var objSend2 = JSON.stringify(obj2);
        if (obj2.id_lista_entregable != "") {
            var frmData2 = new FormData();
            //let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;


            frmData2.append('url_archivo', $txtArchivo2.val() != "" ? $txtArchivo2[0].files[0] : "");
            frmData2.append('jsonJS', objSend2);
            frmData2.append('id_RV', id_RV);
            frmData2.append('id_RVA', id_RVA);

            let $msnWait2 = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait2.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddEntregable,
                contentType: false,
                processData: false,
                data: frmData2
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
                .always(function () { $msnWait2.close() });
        }

        
        var obj3 = getDatosFomulario3();
        var objSend3 = JSON.stringify(obj3);
        if (obj3.id_lista_entregable != "") {
            var frmData3 = new FormData();
            //let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;


            frmData3.append('url_archivo', $txtArchivo3.val() != "" ? $txtArchivo3[0].files[0] : "");
            frmData3.append('jsonJS', objSend3);
            frmData3.append('id_RV', id_RV);
            frmData3.append('id_RVA', id_RVA);

            let $msnWait3 = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait3.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddEntregable,
                contentType: false,
                processData: false,
                data: frmData3
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
                .always(function () { $msnWait3.close() });
        }

        var obj4 = getDatosFomulario4();
        var objSend4 = JSON.stringify(obj4);
        if (obj4.id_lista_entregable != "") {
            var frmData4 = new FormData();
            //let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;


            frmData4.append('url_archivo', $txtArchivo4.val() != "" ? $txtArchivo4[0].files[0] : "");
            frmData4.append('jsonJS', objSend4);
            frmData4.append('id_RV', id_RV);
            frmData4.append('id_RVA', id_RVA);

            let $msnWait4 = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait4.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddEntregable,
                contentType: false,
                processData: false,
                data: frmData4
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
                .always(function () { $msnWait4.close() });
        }

        var obj5 = getDatosFomulario5();
        var objSend5 = JSON.stringify(obj5);
        if (obj5.id_lista_entregable != "") {
            var frmData5 = new FormData();
            //let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;


            frmData5.append('url_archivo', $txtArchivo5.val() != "" ? $txtArchivo5[0].files[0] : "");
            frmData5.append('jsonJS', objSend5);
            frmData5.append('id_RV', id_RV);
            frmData5.append('id_RVA', id_RVA);

            let $msnWait5 = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait5.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddEntregable,
                contentType: false,
                processData: false,
                data: frmData5
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
                .always(function () { $msnWait5.close() });
        }
    }

    //! Peticion para eliminar respositorio de paciente
    function storedDelete(objSend) {
        let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;
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
            GetEntregableCliente(true);
            //clearData();
            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
        }
    }

    //! Reiniciar valores del formulario
    function resetearModal() {
        $formEntregable.validate().resetForm();
        $formEntregable[0].reset();
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
                    EliminarEntregable();
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
                fr_periodoEntregable: "required",
                
            },
            messages: {
                fr_periodoEntregable: "Ingresa el año",
                
            }
        }
        $formEntregable.validate(principalForm);
    }

    function EliminarEntregable() {

        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    objSend = JSON.stringify({ id_entregable_rfc: row.id_entregable_rfc, id_cliente: row.id_cliente, nombre_archivo: row.nombre_archivo });
                    let id_RVA = objClsClienteRIF.getlistaPermisos()["BTN-ADD-ENTREGABLES"].id_RVA;

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
        EliminarEntregable: EliminarEntregable,
        eliminar: eliminar
    }
};