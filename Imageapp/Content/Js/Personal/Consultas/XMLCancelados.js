var objClsClienteRIF;

//Cargar vista
$(document).ready(function () {
    objClsClienteRIF = new clsClienteRIF();
    objClsClienteRIF.init();
});

const clsClienteRIF = function () {
    //! Variables globales
    const idTable_Principal = "#tblXMLEmitidos";

    var tblPrincipal = new clsDataTable();
    
    var listaPermisos = {};


    //! Filtros

    var $frmFilterPrincipal = $("#frmFilterPrincipal");

    var $fl_fecha_inicial = $("#fl_fecha_inicial");
    var $fl_fecha_final = $("#fl_fecha_final");
        

    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();
        $fl_fecha_inicial.val(moment().format("YYYY-MM-DD"));
        $fl_fecha_final.val(moment().format("YYYY-MM-DD"));
        configModals();
        validaciones();
        await initTables();

        Promise.all([GetCatalogos(), GetPermisos(), GetListaPrincipal()]).then(function (values) {
            initEvents();           

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
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Consulta_GetXMLCancelados, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {


                    let contenido = result.resultStoredProcedure.msnSuccess;
                    
                    tblPrincipal.addRows(contenido, true, true, forzeDraw);
                                       
                }

                else
                    tblPrincipal.clearRows();
                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }    

    function getFilterSearch() {
        let filters = {};

        let fecha_inicial = moment($fl_fecha_inicial.val());
        let fecha_final = moment($fl_fecha_final.val());

        if (!fecha_inicial.isValid())
            return jsSimpleAlert("Alerta", "La fecha inicial no es válida", "orange");

        if (!fecha_final.isValid())
            return jsSimpleAlert("Alerta", "La fecha final no es válida", "orange");

        filters.fl_fecha_inicial = fecha_inicial.format("YYYY-MM-DD HH:mm:ss");
        fecha_final.add(23, "hours").add(59, "minutes").add(59, "seconds");
        filters.fl_fecha_final = fecha_final.format("YYYY-MM-DD HH:mm:ss");        
        return filters;
    }

    function clearFilterSearch() {
        $fl_fecha_inicial.val(moment().format("YYYY-MM-DD"));
        $fl_fecha_final.val(moment().format("YYYY-MM-DD"));
    }

    function GetCatalogos() {
        var cat = "";
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: cat
        });

        return new Promise(function (resolve, reject) {
            //! Peticion de la lista de catalogos
            doAjax("POST", url_Catalogos_GetCatalogos, { jsonJS: arrayCatalogos }).done(function (data) {
                let result = new Result(data);

                if (result.validResult(false, false) && result.resultStoredProcedure.validResultStored()) {
                    initCatalogos(result.resultStoredProcedure.msnSuccess);
                }

                resolve();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function initCatalogos(contenido) {
        //if (contenido.hasOwnProperty("tbc_RIF_Sectores")) {
        //    $("#fl_ddlSector").html(dataToStringDropDown(contenido.tbc_RIF_Sectores, true));
        //}
        //if (contenido.hasOwnProperty("tbc_Uso_CFDI_I")) {
        //    $("#fr_clasificacion_activo_fijo").html(dataToStringDropDown(contenido.tbc_Uso_CFDI_I, true));
        //}        
    }

    function GetPermisos() {
        return new Promise(function (resolve, reject) {
            //! Peticion de la lista de permisos para la vista
            doAjax("POST", url_Catalogos_GetPermisos, { id_RV: id_RV }).done(function (data) {
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
        //! Definir columnas Emitidas
        let columnDefs = [
            { visible: false, orderable: false, searchable: false, targets: 0, width: 0, data: null },
            { visible: false, orderable: false, searchable: false, targets: 1, width: 90, name: "descargas", data: "descargas" },
            { visible: false, orderable: false, searchable: false, targets: 2, width: 0, name: "id_xml", data: "id_xml" },

            { visible: true, orderable: true, searchable: true, targets: 3, width: 120, name: "tipo", data: "tipo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "fecha_timbrado", data: "fecha_timbrado" },

            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "serie", data: "serie" }, //Serie

            { visible: true, orderable: true, searchable: true, targets: 7, width: 120, name: "folio", data: "folio" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "UUID", data: "UUID" },

            { visible: true, orderable: true, searchable: true, targets: 9, width: 130, name: "RFCReceptor", data: "RFCReceptor" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 250, name: "nombre_receptor", data: "nombre_receptor" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 150, name: "subtotal", data: "subtotal" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 150, name: "descuento", data: "descuento" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 150, name: "impuesto_trasladado", data: "impuesto_trasladado" },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 150, name: "retencion_iva", data: "retencion_iva" },
            { visible: true, orderable: true, searchable: true, targets: 15, width: 150, name: "retencion_isr", data: "retencion_isr" },
            { visible: true, orderable: true, searchable: true, targets: 16, width: 150, name: "total", data: "total" },
            { visible: true, orderable: true, searchable: true, targets: 17, width: 150, name: "forma_pago", data: "forma_pago" },
            { visible: true, orderable: true, searchable: true, targets: 18, width: 350, name: "conceptos", data: "conceptos", render: maxContent },

            { visible: true, orderable: true, searchable: true, targets: 19, width: 150, name: "cfdi_relacionados", data: "cfdi_relacionados" },
            { visible: true, orderable: true, searchable: true, targets: 20, width: 350, name: "monto", data: "monto" },



            { visible: true, orderable: true, searchable: true, targets: 21, width: 100, name: "estatus", data: "estatus" },
            { visible: true, orderable: true, searchable: true, targets: 22, width: 130, name: "RFCEmisor", data: "RFCEmisor" },
            { visible: true, orderable: true, searchable: true, targets: 23, width: 250, name: "nombre_emisor", data: "nombre_emisor" },
            { visible: true, orderable: true, searchable: true, targets: 24, width: 150, name: "metodo_pago", data: "metodo_pago" },
            { visible: false, orderable: false, searchable: false, targets: 25, width: 150, name: "fecha_pago", data: "fecha_pago" },
            { visible: false, orderable: false, searchable: false, targets: 26, width: 80, name: "version", data: "version" },
            { visible: true, orderable: true, searchable: true, targets: 27, width: 120, name: "usoCFDI", data: "usoCFDI" },
            { visible: true, orderable: true, searchable: true, targets: 28, width: 150, name: "tipo_comprobante", data: "tipo_comprobante" },
            { visible: true, orderable: true, searchable: true, targets: 29, width: 150, name: "ieps", data: "ieps" },
            { visible: true, orderable: true, searchable: true, targets: 30, width: 150, name: "impuesto_retenido", data: "impuesto_retenido" },
            { visible: true, orderable: true, searchable: true, targets: 31, width: 150, name: "retencion_ieps", data: "retencion_ieps" },
            { visible: true, orderable: true, searchable: true, targets: 32, width: 150, name: "traslado_local", data: "traslado_local" },
            { visible: true, orderable: true, searchable: true, targets: 33, width: 150, name: "retencion_local", data: "retencion_local" },
            { visible: false, orderable: false, searchable: false, targets: 34, width: 250, name: "cfdi_relacionados", data: "cfdi_relacionados" },
            { visible: false, orderable: false, searchable: false, targets: 35, width: 200, name: "tipo_relacion_cfdi", data: "tipo_relacion_cfdi" },
            { visible: true, orderable: true, searchable: true, targets: 36, width: 150, name: "total_original", data: "total_original" },
            { visible: true, orderable: true, searchable: true, targets: 37, width: 150, name: "tipo_cambio", data: "tipo_cambio" },
            { visible: true, orderable: true, searchable: true, targets: 38, width: 100, name: "moneda", data: "moneda" },
            { visible: false, orderable: false, searchable: false, targets: 39, width: 150, name: "url_xml", data: "url_xml" },

            { visible: true, orderable: true, searchable: true, targets: 40, width: 100, name: "isr_nomina", data: "isr_nomina" },
            { visible: true, orderable: true, searchable: true, targets: 41, width: 130, name: "subsidio_nomina", data: "subsidio_nomina" },

            { visible: true, orderable: true, searchable: true, targets: 42, width: 150, name: "nombre_xml", data: "nombre_xml" }

        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [[5, "asc"]]
            //exportOptionsExcel: {
            //    columns: [2,3,4,5,6,7,8,9,10]
            //}

        }

        function maxContent(data, type, row) {
            //if (data.length > 100) {
            //    return String(data).substring(0, 100);
            //}
            return data;
        }

        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable


    }    

    function initEvents() {
       
        $('#btnSearchFilter').on('click', function () {

            if (!$frmFilterPrincipal.valid()) {
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
            }
            GetListaPrincipal(true, true);

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

    function getSelect() {
        return xmlSelect;
    }

    

    


    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        
        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });   
        setParamsDatePicker();


    }    

    function validaciones() {


        let principalForm = {};
        //! Setear reglas del formulario
        principalForm = {
            rules: {
                fl_fecha_inicial: "required",
                fl_fecha_final: "required"
            },
            messages: {
                fl_fecha_inicial: "Ingresa una fecha inicial",
                $fl_fecha_final: "Ingresa una fecha final"
                
            }
        }
        $frmFilterPrincipal.validate(principalForm);
    }

    return {
        init: init,
        tblPrincipal: tblPrincipal,        
        getSelect: getSelect,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        refresh: refresh
    }
};