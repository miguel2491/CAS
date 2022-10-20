var objClsVistas;

//Cargar vista
$(document).ready(function () {
    objClsVistas = new clsVistas();
    objClsVistas.init();
});

const clsVistas = function () {
    //! Variables globales
    const idTable_Principal = "#tblVistas";
    const idMdl_Colums = "#mdlColumns";
    const nameColsStorage = "stColsDt_Vista";

    var tblPrincipal = new clsDataTable();
    var mdlPrincipal = new mdlVistas();
    var colsPrincipal;
    var listaPermisos = {};

    //! Filters
    var $fl_nombre = $("#fl_nombre");
    var $fl_adminCtMenu = $("#fl_adminCtMenu");
    var $fl_id_menu = $("#fl_id_menu");

    //! Campos modal
    var $fr_adminCtMenu = $("#fr_adminCtMenu");
    var $fr_id_menu = $("#fr_id_menu");

    //! Arrays
    var arrayMenus = [];

    function getlistaPermisos() {
        return listaPermisos;
    }

    function getArrayCatalogs() {
        return arrayMenus;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        initTables();
        mdlPrincipal.initValidations();

        Promise.all([GetCatalogos(), GetPermisos(),GetListaPrincipal()]).then(function (values) {
            initEvents();
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    async function refresh() {
        validateFilters();

        var $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
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
            doAjax("POST", url_Administrador_GetVistas, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) 
                    tblPrincipal.addRows(result.resultStoredProcedure.msnSuccess,true,true, forzeDraw);
                else
                    tblPrincipal.clearRows();
                
                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function validateFilters() {
        let flag = false;

        //! Validar que la seleccion del menu, se encuentre en la lista
        let filtroMenu = $fl_adminCtMenu.val();
        arrayMenus.forEach(function (item) {
            if (item.label == filtroMenu) {
                flag = true;
            }
        });

        if (!flag) {
            $fl_adminCtMenu.val("");
            $fl_id_menu.val("");
        }
    }

    function getFilterSearch() {
        let filters = {};

        filters.fl_nombre = $fl_nombre.val();
        filters.fl_id_menu = $fl_id_menu.val();
        filters.fl_RdbEstatus = $("input[name='fl_RdbEstatus']:checked").val();
        
        return filters;
    }

    function clearFilterSearch() {
        $fl_nombre.val("");
        $fl_adminCtMenu.val("");
        $fl_id_menu.val("");
        $("#fl_RdbTodos").prop('checked',true);
    }

    function GetPermisos() {
        return new Promise(function (resolve, reject) {
            //! Peticion de la lista de permisos para la vista
            doAjax("POST", url_Administrador_GetPermisos, { id_RV: id_RV }).done(function (data) {
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

    function GetCatalogos() {
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: "tbc_Menus,"
        });

        return new Promise(function (resolve, reject) {
            //! Peticion de la lista de catalogos
            doAjax("POST", url_Administrador_GetCatalogos, { jsonJS: arrayCatalogos }).done(function (data) {
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
        if (contenido.hasOwnProperty("tbc_Menus")) {
            initDropDownMenu(contenido.tbc_Menus);
        }
    }

    function initDropDownMenu(datos) {
        let jsonData = datos;
        arrayMenus = datos;

        //! FIltro menu
        if ($fl_adminCtMenu.autocomplete("instance") != undefined)
            $fl_adminCtMenu.autocomplete("destroy");
        
        $fl_adminCtMenu.autocomplete({
            minLength: 0,
            source: jsonData,
            select: function (event, ui) {
                $fl_adminCtMenu.val(ui.item.label);
                $fl_id_menu.val(ui.item.value);
                return false;
            }
        }).focus(function () {
            $(this).data("uiAutocomplete").search($(this).val());
        });

        //! Campo modal menu
        if ($fr_adminCtMenu.autocomplete("instance") != undefined)
            $fr_adminCtMenu.autocomplete("destroy");

        $fr_adminCtMenu.autocomplete({
            minLength: 0,
            source: jsonData,
            select: function (event, ui) {
                $fr_adminCtMenu.val(ui.item.label);
                $fr_id_menu.val(ui.item.value);
                return false;
            }
        }).focus(function () {
            $(this).data("uiAutocomplete").search($(this).val());
        });
    }

    function initTables() {
        //! Definir columnas
        let columnDefs = [
            { visible: true, orderable: true, searchable: true, targets: 0, width: 80, name: "id_vista", data: "id_vista" },
            { visible: false, orderable: false, searchable: false, targets: 1, width: 150, name: "id_menu", data: "id_menu" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 250, name: "pathDescription", data: "pathDescription" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "nombre", data: "nombre" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "controller", data: "controller" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "action", data: "action" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 100, name: "id_estatus", data: "id_estatus" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 100, name: "descripcion_estatus", data: "descripcion_estatus" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "fecha_creacion", data: "fecha_creacion" }
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
        $(idTable_Principal + ' tbody').on('click', 'tr', function () {//Evento de seleccion en el cuDemoVisoro del DataTable
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                tmpTbl_Principal.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
            tmpTbl_Principal.fixedColumns().update();
        });

        $(idTable_Principal + ' tbody').on('dblclick', 'tr', function () {//Evento de doble clic en el cuDemoVisoro del DataTable
            let tr = $(this);

            if (!$(this).hasClass('selected')) {
                tmpTbl_Principal.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            tmpTbl_Principal.fixedColumns().update();
            
            isRowSelected("BTN-EDIT","edit");
        });
        
        //! ******Eventos botones modal******//

        //Evento de [cerrar] modal de la entidad
        $('#btnCloseMdl').on('click', function () {
            mdlPrincipal.confirmModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        //Evento de [aceptar] modal de la entidad
        $('#btnAceptarMdl').on('click', function (e) {
            
            let eventType = mdlPrincipal.getTypeEvent();

            if (eventType == "delete") {
                mdlPrincipal.confirmModal({ eventButton: "eliminar", title: "Confirma!", message: "¿Segúro que deséa eliminar el registro?" });
            }
            else if (eventType == "create" || eventType == "edit") {
                mdlPrincipal.sendToStored();
            }
        });

        //! ******Eventos botones modal columns******//
        $('#btnModalColsAceptar').on('click', function () {
            colsPrincipal.setConfigColumns();
            $.modal.close();
        });

        $('#btnModalColsRefresh').on('click', function () {
            colsPrincipal.reset();
        });
        
        //! ******Eventos de busqueda con filtros******//
        $('#btnClearFilters').on('click', function () {
            clearFilterSearch();
        });

        $('#btnSearchFilter').on('click', function () {
            validateFilters();
            GetListaPrincipal(true, true);
        });
    }

    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-NEW').on('click', function () {
            mdlPrincipal.eventModal("create");
            mdlPrincipal.mostrarModal();
        });
        
        $('#BTN-EDIT').on('click', function () {
            isRowSelected("BTN-EDIT","edit");
        });

        $('#BTN-ERASE').on('click', function () {
            isRowSelected("BTN-ERASE", "delete");
        });

        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $('#BTN-COLS').on('click', function () {
            $(idMdl_Colums).modal();
        });
    }

    function isRowSelected(button,event) {
        let tmpTbl_Principal = tblPrincipal.getTable();
        let rowSelected = tmpTbl_Principal.$('tr.selected');

        if (rowSelected.length <= 0)
            return jsSimpleAlert("Alerta", "No ha seleccionado una fila", "orange");

        if (!listaPermisos.hasOwnProperty(button))
            return jsSimpleAlert("Alerta", "No tiene permiso para realizar esta acción", "orange");
        
        tblPrincipal.setRowSelected(rowSelected);
        mdlPrincipal.eventModal(event);
        mdlPrincipal.mostrarModal();
    }
    
    return {
        init: init,
        mdlPrincipal: mdlPrincipal,
        tblPrincipal: tblPrincipal,
        getlistaPermisos: getlistaPermisos,
        getListaPrincipal: GetListaPrincipal,
        getArrayCatalogs: getArrayCatalogs
    }
};