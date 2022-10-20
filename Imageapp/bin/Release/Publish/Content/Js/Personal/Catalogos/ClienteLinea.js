var objClsClienteLinea;

//Cargar vista
$(document).ready(function () {
    objClsClienteLinea = new clsClienteLinea();
    objClsClienteLinea.init();
});

const clsClienteLinea = function () {
    //! Variables globales
    const idTable_Principal = "#tblClientesLinea";
    const idMdl_Colums = "#mdlColumns";
    const nameColsStorage = "stColsDt_ClientesLinea";
    let $frmSolicitud = $("#frmSolicitud");
    let tblPrincipal = new clsDataTable();
    
    let colsPrincipal;
    let listaPermisos = {};

    //! Filtros
    let $fl_nombre = $("#fl_nombre");
    let $fl_rfc = $("#fl_rfc");
    //let $fl_ddlRegimen = $("#fl_ddlRegimen");
    let $fl_ddlLinea = $("#fl_ddlLinea");

    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();
        
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

        Promise.all([GetPermisos(), GetListaPrincipal(), GetCatalogos()]).then(function (values) {
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetClientesLinea, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    tblPrincipal.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
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

        filters.fl_nombre = $fl_nombre.val();
        filters.fl_rfc = $fl_rfc.val();
        //filters.fl_ddlRegimen = $fl_ddlRegimen.val();
        filters.fl_ddlLinea = $fl_ddlLinea.val();
        filters.fl_RdbEstatus = $("input[name='fl_RdbEstatus']:checked").val();

        return filters;
    }

    function clearFilterSearch() {
        $fl_nombre.val("");
        $fl_rfc.val("");
        //$fl_ddlRegimen.val("");
        $fl_ddlLinea.val("");
        $("#fl_RdbTodos").prop('checked', true);
    }

    function GetCatalogos() {
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: "tbc_Tipo_Persona,tbc_Lineas_Produccion,"
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
        if (contenido.hasOwnProperty("tbc_Lineas_Produccion")) {
            $fl_ddlLinea.html(dataToStringDropDown(contenido.tbc_Lineas_Produccion, true));
        }
        //if (contenido.hasOwnProperty("tbc_Tipo_Persona")) {
        //    $("#fr_id_tipo_persona").html(dataToStringDropDown(contenido.tbc_Tipo_Persona, true));
        //    $fl_ddlRegimen.html(dataToStringDropDown(contenido.tbc_Tipo_Persona, true));
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
        //! Definir columnas
        let columnDefs = [
            { visible: false, orderable: false, searchable: false, targets: 0, width: 0, name: "id_cliente", data: "id_cliente" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 150, name: "rfc", data: "rfc" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 250, name: "nombre_razon", data: "nombre_razon" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "linea", data: "linea" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "encargado", data: "encargado" },
            { visible: false, orderable: false, searchable: false, targets: 5, width: 0, name: "id_tipo_persona", data: "id_tipo_persona" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "tipo_persona", data: "tipo_persona" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 100, name: "descripcion_estatus", data: "descripcion_estatus" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 200, name: "servicio", data: "servicio" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 200, name: "regimen", data: "regimen" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 200, name: "grupo_empresarial", data: "grupo_empresarial" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 200, name: "actividad", data: "actividad" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal
        }

        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        colsPrincipal = new clsColumns($(idTable_Principal).DataTable(), nameColsStorage);//! Inicializar clase columnas
        colsPrincipal.init(); //! Init config
    }

    function initEvents() {
        let tmpTbl_Principal = tblPrincipal.getTable();

        //! ******Eventos DataTable******//
        $(idTable_Principal + ' tbody').on('click', 'tr', function () {//Evento de seleccion DataTable
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                tmpTbl_Principal.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
            tmpTbl_Principal.fixedColumns().update();
        });

        $(idTable_Principal + ' tbody').on('dblclick', 'tr', function () {//Evento de doble clic DataTable
            let tr = $(this);

            if (!$(this).hasClass('selected')) {
                tmpTbl_Principal.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            tmpTbl_Principal.fixedColumns().update();

            isRowSelected("BTN-EDIT", "edit");
        });

        
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
    }

    function isRowSelected(button, event) {
        let tmpTbl_Principal = tblPrincipal.getTable();
        let rowSelected = tmpTbl_Principal.$('tr.selected');

        if (rowSelected.length <= 0)
            return jsSimpleAlert("Alerta", "No ha seleccionado una fila", "orange");

        if (!listaPermisos.hasOwnProperty(button))
            return jsSimpleAlert("Alerta", "No tiene permiso para realizar esta acción", "orange");


        tblPrincipal.setRowSelected(rowSelected);
        
    }

    return {
        init: init,
        tblPrincipal: tblPrincipal,
        getlistaPermisos: getListaPermisos,
    }
};