var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tblClientes";

    const idMdl_Colums = "#mdlColumns";
    const nameColsStorage = "stColsDt_ClientesFIEL";
    
    var tblPrincipal = new clsDataTable();    
    var colsPrincipal;
    var listaPermisos = {};

    //! Filtros
    var $fl_nombre = $("#fl_nombre");
    var $fl_rfc = $("#fl_rfc");
    var $fl_ddlRegimen = $("#fl_ddlRegimen");

    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        await initTables();

        Promise.all([GetCatalogos(), GetPermisos(), GetListaPrincipal()]).then(function (values) {
            initEvents();
            mdlActividades.inicio();
            mdlActividades.inicializarValidaciones();
            mdlEstatus.inicio();
            mdlEstatus.inicializarValidaciones();
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    async function refresh() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        Promise.all([GetPermisos(), GetListaPrincipal(), GetCatalogos()]).then(function (values) {
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetClientes, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblPrincipal.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
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

        filters.fl_nombre = $fl_nombre.val();
        filters.fl_rfc = $fl_rfc.val();
        filters.fl_ddlRegimen = $fl_ddlRegimen.val();
        filters.fl_RdbEstatus = $("input[name='fl_RdbEstatus']:checked").val();

        return filters;
    }

    function clearFilterSearch() {
        $fl_nombre.val("");
        $fl_rfc.val("");
        $fl_ddlRegimen.val("");
        $("#fl_RdbTodos").prop('checked', true);
    }

    function GetCatalogos() {
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: "tbc_Regimenes,tbc_Tipo_Persona,"
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
        if (contenido.hasOwnProperty("tbc_Regimenes")) {
            $("#fr_id_regimen").html(dataToStringDropDown(contenido.tbc_Regimenes, true));
        }
        if (contenido.hasOwnProperty("tbc_Tipo_Persona")) {
            $("#fr_id_tipo_persona").html(dataToStringDropDown(contenido.tbc_Tipo_Persona, true));
            $fl_ddlRegimen.html(dataToStringDropDown(contenido.tbc_Tipo_Persona, true));
        }
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
        //! Definir columnas
        let columnDefs = [
            { visible: false, orderable: false, searchable: false, targets: 0, width: 0, name: "id_cliente", data: "id_cliente" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 150, name: "rfc", data: "rfc" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 300, name: "nombre_razon", data: "nombre_razon" } ,         
            { visible: true, orderable: true, searchable: true, targets: 3, width: 250, name: "fecha_caducidad_fiel", data: "fecha_caducidad_fiel" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 250, name: "fecha_cita", data: "fecha_cita" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "fecha_fecha_fiel_representante", data: "fecha_fiel_representante" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [[3, "asc"]]
        }

        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        colsPrincipal = new clsColumns($(idTable_Principal).DataTable(), nameColsStorage);//! Inicializar clase columnas
        colsPrincipal.init(); //! Init config
        
    }

    function initEvents() {
        let tmpTbl_Principal = tblPrincipal.getTable();       
       

        //******Eventos botones modal columns******//
        $('#btnModalColsAceptar').on('click', function () {
            colsPrincipal.setConfigColumns();
            $.modal.close();
        });

        $('#btnModalColsRefresh').on('click', function () {
            colsPrincipal.reset();
        });        

        //******Eventos de busqueda con filtros******//
        $('#btnClearFilters').on('click', function () {
            clearFilterSearch();
        });

        $('#btnSearchWFilter').on('click', function () {
            GetListaPrincipal(true, true);
        });

        $("#close-sidebar").on('click', async function () {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
        });

    }

    function initEventsPermissions() {
        //! ******Eventos botones permission******//       

        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $('#BTN-COLS').on('click', function () {
            $(idMdl_Colums).modal();
        });        

        setParamsDatePickerNacimiento();
    }

    function isRowSelected(button, event) {
        let tmpTbl_Principal = tblPrincipal.getTable();
        let rowSelected = tmpTbl_Principal.$('tr.selected');

        if (rowSelected.length <= 0)
            return jsSimpleAlert("Alerta", "No ha seleccionado una fila", "orange");

        if (!listaPermisos.hasOwnProperty(button))
            return jsSimpleAlert("Alerta", "No tiene permiso para realizar esta acción", "orange");


        tblPrincipal.setRowSelected(rowSelected);

        if (event == enumEventoPermisos.CFDI) {            
            $frs_id_cliente.val(tblPrincipal.getRowSelected().id_cliente);
            $frs_id_regimen.val(tblPrincipal.getRowSelected().id_regimen);
            $frs_rfc.val(tblPrincipal.getRowSelected().rfc);
            $frs_nombre_razon.val(tblPrincipal.getRowSelected().nombre_razon);
            $frs_es_asesoria.val(tblPrincipal.getRowSelected().es_asesoria);
            $frs_aplica_coi.val(tblPrincipal.getRowSelected().aplica_coi);
            $frmSolicitud.submit();
        }
    }

    return {
        init: init,        
        tblPrincipal: tblPrincipal,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal        
    }
};