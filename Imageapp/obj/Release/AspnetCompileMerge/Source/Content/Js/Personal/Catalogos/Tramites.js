var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tbl_tramites";
    var $modalCarga = $("#mdlCargar");
    var $txtCarga = $("#txtCarga");
    var tblPrincipal = new clsDataTable();
    //var mdlPrincipal = new mdlClientes();
    var listaPermisos = {};

    var $id, $tipo, $indice;

    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        await initTables();

        Promise.all([GetPermisos(), GetListaPrincipal()]).then(function (values) {
            initEvents();
            //mdlPrincipal.init();
            initEventsPermissions();
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    async function refresh() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        Promise.all([GetPermisos(), GetListaPrincipal()]).then(function (values) {
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        var filter = {};

        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetListaTramites, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    let contenido = result.resultStoredProcedure.msnSuccess;


                    tblPrincipal.addRows(contenido, true, true, forzeDraw);
                }
                else {
                    tblPrincipal.clearRows();
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }



    function GetPermisos() {
        return new Promise(function (resolve, reject) {
            //! Peticion de la lista de permisos para la vista
            doAjax("POST", url_Cliente_GetPermisos, { id_RV: id_RV }).done(function (data) {
                let result = new Result(data);

                if (result.validResult(false, false) && result.resultStoredProcedure.validResultStored()) {
                    listaPermisos = initPermisions(result.resultStoredProcedure.msnSuccess);
                    initEventsPermissions();
                }
                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function initTables() {
        //! Definir columnas
        let columnDefs = [
            { visible: true, orderable: true, searchable: true, targets: 0, width: '100', name: "rfc", data: "rfc" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: '250', name: "tramite", data: "tramite" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '150', name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: '120', name: "estatus", data: "estatus" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: '120', name: "plantillas", data: "plantillas" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: '120', name: "documentos", data: "documentos" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: '120', name: "acciones", data: "acciones" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [0, 'desc']
        }

        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

    }


    function cargarArchivo(id, indice, tipo, texto) {

        $id = id, $tipo = tipo, $indice = indice;
        $txtCarga.text(texto);
        $modalCarga.modal();

    }

    function plantilla(json, tipo) {

        var datos = JSON.parse(json.replaceAll('\'', "\""));
        var url = '../Documentos/Tramites/' + tipo +'.docx';
        

        loadFile(url, function (error, content) {
            if (error) { return jsSimpleAlert("Error", "Error al obtener la plantilla", "red") }

            var zip = new JSZip2(content);
            var doc = new Docxtemplater().loadZip(zip);
            doc.setData(datos);
            try {
                doc.render();

                var out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                });

                saveAs(out, "Tramite.docx");

                //sendToStored(out);
            }
            catch (error) {
                return jsSimpleAlert("Error", "Error al generar el archivo WORD, [" + error.message + "]", "red");
            }
        });

    }



    function formatCurrency(cantidad) {
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);

        var valor = numberFormat2.format(cantidad);

        return valor.substring(1);
    }

    function initEvents() {

        //Evento de [cerrar] modal de la entidad        
        $('#btnCloseMdlCargar').on('click', function () {
            $.modal.close();
        });

        $('#btnSubirMdlCargar').on('click', function () {


            let objSendStored = {};

            objSendStored.id = $id;
            objSendStored.tipo = $tipo;
            objSendStored.indice = $indice;


            var $fr_urlArchivo = $("#fl_archivo");

            if ($fr_urlArchivo.val() != "") {



                var frmData = new FormData();
                frmData.append('url_archivo', $fr_urlArchivo.val() != "" ? $fr_urlArchivo[0].files[0] : "");
                frmData.append('jsonJS', JSON.stringify(objSendStored));
                frmData.append('id_RV', id_RV);


                let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
                $msnWait.open();

                $.ajax({
                    type: "POST",
                    url: url_Catalogos_AddDocumentoTramite,
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
                            //finalizarStoredProcedure(data);
                            $.modal.close();
                            refresh();
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) { jsSimpleAlert("Error", errorThrown); })
                    .always(function () { $msnWait.close() });
            } else {
                jsSimpleAlert("Error", "Debe cargar un archivo.");
            }
        });
    }




    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $('#BTN-NEW').on('click', function () {
            mdlPrincipal.eventModal(enumEventosModal.NUEVO);
            mdlPrincipal.mostrarModal();
        });

        $("#close-sidebar").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);

        });

        $(".reload").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);

        });

    }


    function loadFile(url, callback) {
        JSZipUtils2.getBinaryContent(url, callback);
    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        cargarArchivo: cargarArchivo,
        plantilla: plantilla
    }
};
