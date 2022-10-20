const mdlFichaTecnica = function () {
    //! Doom del modal
    let $formPrincipal = $("#frmFichaTecnica"),
        $modalPrincipal = $("#mdlFichaTecnica"),
        eventModal = enumEventosModal.EDITAR,
        objOriginal = {};

    var id_regimen = 0;

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

        let tableRow = objClsCliente.tblPrincipal.getRowSelected();
        objOriginal = { ...tableRow };
        
        if (eventModal !== enumEventosModal.NUEVO) getDatosCliente(tableRow.id_cliente);

        id_regimen = tableRow.id_regimen;
    }

    async function setDatosModal(ficha = {}) {
        //servicios
        const servicios = ficha.servicios ?
            ficha.servicios.map((servicio, index) => { return `${index + 1}) ${servicio.servicio} "${servicio.inicio_servicio || "N/E"}"\n` }).join('')
            : '';
        const clientes = ficha.clientes ?
            ficha.clientes.map((cliente, index) => { return `${index + 1}) ${cliente.nombre_razon}\n` }).join('')
            : '';
        const proveedores = ficha.proveedores
            ? ficha.proveedores.map((proveedor, index) => { return `${index + 1}) ${proveedor.nombre_razon}\n` }).join('')
            : '';
        const actividades = ficha.actividades
            ? ficha.actividades.map((actividad, index) => { return `${index + 1}) ${actividad.actividad} (${actividad.porcentaje}%)\n` }).join('')
            : '';
        let grupo_empresarial = ficha.grupo_empresarial
            ? ficha.grupo_empresarial.map((grupo, index) => { return `${index + 1}) ${grupo.grupo_empresarial}\n` }).join('')
            : '';

        if (grupo_empresarial === '') grupo_empresarial = 'N/A'

        //! Asignar datos
        $("#fr_ficha_domicilio").val(ficha.matriz);
        $("#fr_ficha_sucursales").val(ficha.sucursales);
        $("#fr_ficha_actividad").val(actividades);
        $("#fr_ficha_razon").val(ficha.inicio_razon);
        $("#fr_ficha_servicios").val(servicios);
        $("#fr_ficha_patronal").val(ficha.patronal);
        $("#fr_ficha_representante").val(ficha.representante);
        $("#fr_ficha_objetivo").val(ficha.objeto_social);
        $("#fr_ficha_capital").val(ficha.capital_inicial);
        $("#fr_ficha_recomendacion").val(ficha.recomendacion);
        $("#fr_ficha_humano").val(ficha.humano);
        $("#fr_ficha_inmobiliario").val(ficha.inmobiliario);
        $("#fr_ficha_equipo").val(ficha.equipo);
        $("#fr_ficha_costos").val(ficha.costos);
        $("#fr_ficha_grupo").val(grupo_empresarial);
        $("#fr_ficha_canales").val(ficha.canales);
        $("#fr_ficha_proveedores").val(proveedores);
        $("#fr_ficha_clientes").val(clientes);
        $("#fr_ficha_alianzas").val(ficha.alianzas);
        $("#fr_ficha_prestamos").val(ficha.prestamos);
        $("#fr_ficha_politicas").val(ficha.politicas);
        $("#fr_ficha_contratos").val(ficha.contratos);
        $("#fr_ficha_observaciones").val(ficha.observaciones);

        $modalPrincipal.modal();
    }

    const getDatosModal = () => ({
        id_cliente: objOriginal.id_cliente,
        matriz: $("#fr_ficha_domicilio").val(),
        sucursales: $("#fr_ficha_sucursales").val(),
        actividad: $("#fr_ficha_actividad").val(),
        razon: $("#fr_ficha_razon").val(),
        servicios: $("#fr_ficha_servicios").val(),
        patronal: $("#fr_ficha_patronal").val(),
        representante: $("#fr_ficha_representante").val(),
        objeto_social: $("#fr_ficha_objetivo").val(),
        capital_inicial: $("#fr_ficha_capital").val(),
        recomendacion: $("#fr_ficha_recomendacion").val(),
        humano: $("#fr_ficha_humano").val(),
        inmobiliario: $("#fr_ficha_inmobiliario").val(),
        equipo: $("#fr_ficha_equipo").val(),
        costos: $("#fr_ficha_costos").val(),
        grupo: $("#fr_ficha_grupo").val(),
        canales: $("#fr_ficha_canales").val(),
        proveedores: $("#fr_ficha_proveedores").val(),
        clientes: $("#fr_ficha_clientes").val(),
        alianzas: $("#fr_ficha_alianzas").val(),
        prestamos: $("#fr_ficha_prestamos").val(),
        politicas: $("#fr_ficha_politicas").val(),
        contratos: $("#fr_ficha_contratos").val(),
        observaciones: $("#fr_ficha_observaciones").val(),
    })

    const getDatosCliente = (id_cliente) => (

        new Promise(function (resolve, reject) {
            //! Peticion de la lista de permisos para la vista
            doAjax("POST", url_Catalogos_GetFichaTecnica, { jsonJS: JSON.stringify({id_cliente }),id_RV: id_RV }, true).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    console.log(result);
                    const ficha = result.resultStoredProcedure.msnSuccess == null ? {} : result.resultStoredProcedure.msnSuccess;
                    setDatosModal(ficha);
                }
                resolve();

        }).fail(function (jqXHR, textStatus, errorThrown) {
            jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
            reject();
        });

    }))

    function loadFile(url, callback) {
        JSZipUtils2.getBinaryContent(url, callback);
    }

    const convertirHTML = (text) => {
        if (!text) text = "";
        text = text.replaceAll('\n', '<w:br/>');
        text = `<w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="47"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`;
        return text;
    }

    const previewPDF = () => {

        var url = '';
        var flag = false;
        switch (id_regimen) {
            case 1:
                url = '../Documentos/FichaTecnica/RIF.docx';
                break;
            case 2:
            case 3:
            case 4:
                url = '../Documentos/FichaTecnica/OTROS.docx';
                break;
            case 5:
                url = '../Documentos/FichaTecnica/PM.docx';
                break;
            case 6:
                flag = true;
                break;
        }

        if (flag) {
            jsSimpleAlert("Error", "El regimen del cliente no cuenta con ficha técnica.", "red")
        }
        else {
            loadFile(url, function (error, content) {
                if (error) { return jsSimpleAlert("Error", "Error al obtener la plantilla", "red") }

                var zip = new JSZip2(content);
                var doc = new Docxtemplater().loadZip(zip);

                const ficha = getDatosModal();

                doc.setData({
                    fecha: moment().format('DD/MM/YYYY'),
                    nombre_razon: objOriginal.nombre_razon,
                    matriz: convertirHTML(ficha.matriz),
                    sucursales: convertirHTML(ficha.sucursales),
                    actividad_principal: convertirHTML(ficha.actividad),
                    fecha_razon: convertirHTML(ficha.inicio_razon),
                    servicios: convertirHTML(ficha.servicios),
                    registro_patronal: convertirHTML(ficha.patronal),
                    representante: convertirHTML(ficha.representante),
                    objeto_social: convertirHTML(ficha.objeto_social),
                    capital_inicial: convertirHTML(ficha.capital_inicial),
                    recomendacion: convertirHTML(ficha.recomendacion),
                    humano: convertirHTML(ficha.humano),
                    inmobiliario: convertirHTML(ficha.inmobiliario),
                    equipo: convertirHTML(ficha.equipo),
                    costos: convertirHTML(ficha.costos),
                    grupo_empresarial: convertirHTML(ficha.grupo),
                    canales: convertirHTML(ficha.canales),
                    proveedores: convertirHTML(ficha.proveedores),
                    clientes: convertirHTML(ficha.clientes),
                    alianzas: convertirHTML(ficha.alianzas),
                    prestamos: convertirHTML(ficha.prestamos),
                    politicas: convertirHTML(ficha.politicas),
                    contratos: convertirHTML(ficha.contratos),
                    observaciones: convertirHTML(ficha.observaciones),
                });

                try {
                    doc.render();

                    var out = doc.getZip().generate({
                        type: "blob",
                        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    });

                    saveAs(out, "Ficha_Tecnica_" + objOriginal.nombre_razon + ".docx");

                    //sendToStored(out);
                }
                catch (error) {
                    return jsSimpleAlert("Error", "Error al generar el archivo WORD, [" + error.message + "]", "red");
                }

            });
        }
        
    }

    $("#btnAceptarMdlFichaTecnica").on("click", sendToStored);
    $("#btnGenerarMdlFichaTecnica").on("click", previewPDF);
    $("#btnCloseMdlFichaTecnica").on("click", () => {
        confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa salir?" });
    });
    
    function sendToStored(docx) {
        let frmData = new FormData();
        let id_RVA = objClsCliente.getlistaPermisos()["BTN-FICHATECNICA"].id_RVA;

        //! Valildar formulario
        if (eventModal === enumEventosModal.EDITAR) {
            if (!$formPrincipal.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }
        
        //! Objeto de envio al stored
        //frmData.append('url_archivo', docx);
        frmData.append('id_cliente', objOriginal.id_cliente);
        frmData.append('jsonJS', JSON.stringify(getDatosModal()));
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);
        
        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_UpdFichaTecnica,
            contentType: false,
            processData: false,
            data: frmData
        })
        .done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {

                //var xhr = new XMLHttpRequest();
                //xhr.open('GET', 'http://castelanauditores.com/castelan/Documentos/FichaTecnica/' + result.resultStoredProcedure.msnSuccess, true);
                ////xhr.open('GET', result.resultStoredProcedure.msnSuccess, true);
                //xhr.responseType = 'blob';

                //xhr.onload = function (e) {
                //    if (this.status == 200) {
                //        var blob = new Blob([this.response], { type: 'application/pdf' });
                //        var link = document.createElement('a');
                //        link.href = window.URL.createObjectURL(blob);
                //        link.download = "report.pdf";
                //        link.click();
                //    }
                //};

                //xhr.send();

            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) { jsSimpleAlert("Error", errorThrown); })
        .always(function () { $msnWait.close() });
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
            },
            messages: {
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