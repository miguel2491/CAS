var objClsRoles;

//! Cargar vista
$(document).ready(function () {
    objClsRoles = new clsRoles();
    objClsRoles.init();
});

const clsRoles = function () {
    //! Variables globales
    const idTable_Principal = "#tblRoles";
    const idTable_RlVistas = "#tblRlVistas";
    const idTable_CtVistas = "#tblCatVistas";
    const idTable_CtActions = "#tblCatActions";
    const idTable_RlActions = "#tblRlActions";

    const idMdl_Colums = "#mdlColumns";
    const nameColsStorage = "stColsDt_Rol";

    var tblPrincipal = new clsDataTable();
    var tblCtVistas = new clsDataTable();
    var tblCtActions = new clsDataTable();
    var tblRlVistas = new clsDataTable();
    var tblRlActions = new clsDataTable();

    var mdlPrincipal = new mdlRoles();
    var mdlActions = new mdlRlActions();
    var lista_permisos_servidor = [];

    var colsPrincipal;
    var listaPermisos = {};

    //! Filters
    var $fl_nombre = $("#fl_nombre");

    function getListaPermisos() {
        return listaPermisos;
    }

    function getListaPermisos_servidor() {
        return lista_permisos_servidor;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        await initTables();

        Promise.all([GetCatalogos(), GetPermisos(), GetListaPrincipal()]).then(function (values) {
            initEvents();
            mdlPrincipal.init();
            mdlActions.init();

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
            doAjax("POST", url_Administrador_GetRoles, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblPrincipal.addRows(result.resultStoredProcedure.msnSuccess,true,true,forzeDraw);
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
        filters.fl_RdbEstatus = $("input[name='fl_RdbEstatus']:checked").val();

        return filters;
    }

    function clearFilterSearch() {
        $fl_nombre.val("");
        $("#fl_RdbTodos").prop('checked',true);
    }

    function GetCatalogos() {
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: "tbc_Vistas,tbc_Acciones,"
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
        if (contenido.hasOwnProperty("tbc_Vistas")) {

            contenido["tbc_Vistas"].forEach(function (item,index) {
                item.acciones = '<div class="custom-control custom-checkbox">';
                item.acciones += '<input type="checkbox" class="custom-control-input" id="fr_chkRlVista'+index+'" name="fr_chkRlVista">';
                item.acciones += '<label class="custom-control-label" for="fr_chkRlVista' + index +'"></label>';
                item.acciones += ' </div>';
            });

            mdlPrincipal.setArrayCtVistas(contenido["tbc_Vistas"]);
        }

        if (contenido.hasOwnProperty("tbc_Acciones")) {

            contenido["tbc_Acciones"].forEach(function (item, index) {
                item.acciones = '<div class="custom-control custom-checkbox">';
                item.acciones += '<input type="checkbox" class="custom-control-input" id="fr_chkRlAction' + index + '" name="fr_chkRlAction">';
                item.acciones += '<label class="custom-control-label" for="fr_chkRlAction' + index + '"></label>';
                item.acciones += ' </div>';
            });

            mdlActions.setArrayCtActions(contenido["tbc_Acciones"]);
        }
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

    async function initTables() {
        //! Datatable roles
        let columnDefs = [
            { visible: true, orderable: true, searchable: true, targets: 0, width: 150, name: "id_rol", data: "id_rol" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 150, name: "nombre", data: "nombre" },
            { visible: false, orderable: false, searchable: false, targets: 2, width: 100, name: "id_estatus", data: "id_estatus" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 100, name: "descripcion_estatus", data: "descripcion_estatus" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "fecha_creacion", data: "fecha_creacion" }
        ];

        //Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            fixedColumns: null
        }

        initDataTable(paramsDataTable); //Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //Inicializar clase datatable
        colsPrincipal = new clsColumns($(idTable_Principal).DataTable(), nameColsStorage);// Inicializar clase columnas
        colsPrincipal.init(); //Init config

        //! Datatable Catálogo Vistas
        columnDefs = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 60, name: "acciones", data: "acciones", className: "text-center" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 60, name: "value", data: "value" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "label", data: "label" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "pathDescription", data: "pathDescription" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 60, name: "isRaiz", data: "isRaiz" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 60, name: "isVisible", data: "isVisible" }
        ];

        //Definir objeto estructura del datatable
        paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_CtVistas,
            fixedColumns: null,
            order: [[1, "asc"]]
        }

        initDataTable(paramsDataTable); //Inicializar datatable
        tblCtVistas.setTable($(idTable_CtVistas).DataTable()); //Inicializar clase datatable

        //! Datatable RlVistas
        //Definir columnas
        columnDefs = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 40, name: "acciones", data: "acciones", className: "text-center" },
            { visible: false, orderable: true, searchable: false, targets: 1, width: 80, name: "id_rol_vista", data: "id_rol_vista" },
            { visible: false, orderable: false, searchable: false, targets: 2, width: 100, name: "id_rol", data: "id_rol" },
            { visible: false, orderable: false, searchable: false, targets: 3, width: 100, name: "id_vista", data: "id_vista" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "nombre", data: "nombre" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "pathDescription", data: "pathDescription" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 120, name: "id_permiso_servidor", data: "id_permiso_servidor" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 120, name: "permiso_servidor", render: renderDdl_Vista_Permiso_Servidor, data: null }
        ];

        //Definir objeto estructura del datatable
        paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_RlVistas,
            fixedColumns: null,
            order: [[4,"asc"]]
        }

        initDataTable(paramsDataTable); //Inicializar datatable
        tblRlVistas.setTable($(idTable_RlVistas).DataTable()); //Inicializar clase datatable

        //! Datatable Catálogo Actions
        columnDefs = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 60, name: "acciones", data: "acciones", className: "text-center" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 60, name: "value", data: "value" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "label", data: "label" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "nombre", data: "nombre" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 60, name: "visible", data: "visible" }
        ];

        //Definir objeto estructura del datatable
        paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_CtActions,
            fixedColumns: null,
            order: [[1, "asc"]]
        }

        initDataTable(paramsDataTable); //Inicializar datatable
        tblCtActions.setTable($(idTable_CtActions).DataTable()); //Inicializar clase datatable

        //! Datatable RlRol_Vistas_Acciones
        columnDefs = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 40, name: "acciones", data: "acciones", className: "text-center" },
            { visible: false, orderable: true, searchable: false, targets: 1, width: 80, name: "id_rol_vista_accion", data: "id_rol_vista_accion" },
            { visible: false, orderable: false, searchable: false, targets: 2, width: 100, name: "id_rol_vista", data: "id_rol_vista" },
            { visible: false, orderable: false, searchable: false, targets: 3, width: 100, name: "id_accion", data: "id_accion" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "codigo", data: "codigo" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "nombre", data: "nombre" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 120, name: "id_permiso_servidor", data: "id_permiso_servidor" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 120, name: "permiso_servidor", render: renderDdl_Accion_Permiso_Servidor, data: null }
        ];

        //Definir objeto estructura del datatable
        paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_RlActions,
            fixedColumns: null,
            order: [[4, "asc"]]
        }

        initDataTable(paramsDataTable); //Inicializar datatable
        tblRlActions.setTable($(idTable_RlActions).DataTable()); //Inicializar clase datatable
    }

    function renderDdl_Vista_Permiso_Servidor(data, type, row) {
        if (type == 'display') {
            let html = listaPermisos_to_ddl_html(row.id_permiso_servidor, "ddl_vista_permiso_servidor");
            return html;
        } else
            return data;
    }

    function renderDdl_Accion_Permiso_Servidor(data, type, row) {
        if (type == 'display') {
            let html = listaPermisos_to_ddl_html(row.id_permiso_servidor, "ddl_accion_permiso_servidor");
            return html;
        } else
            return data;
    }

    function listaPermisos_to_ddl_html(default_opt, clase) {
        let html = "";
        html += '<select class="form-control '+clase+' ">';
        lista_permisos_servidor.forEach(function (item, index) {
            if (item.value == default_opt) html += '<option value = "' + item.value + '" selected="selected"> ' + item.text + '</option>';
            else html += '<option value="' + item.value + '">' + item.text + '</option>';
        });
        html += '</select>';
        return html;
    }

    function initEvents() {
        let tmpTbl_Principal = tblPrincipal.getTable();

        //! ******Eventos DataTable******//
        $(idTable_Principal + ' tbody').on('click', 'tr', function () {//Evento de seleccion del DataTable
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

        //! Evento agragar vistas
        $('#btnShowCtVistas').on('click', async function (e) {
            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición", "orange");
            $msnWait.open();

            mdlPrincipal.depurarCtVistas();
            await sleep(200);
            $(idTable_CtVistas).DataTable().columns.adjust().draw(false);

            $msnWait.close();
        });

        $('#btnShowCtAcciones').on('click', async function (e) {
            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición", "orange");
            $msnWait.open();

            mdlActions.depurarCtActions();
            await sleep(200);
            $(idTable_CtActions).DataTable().columns.adjust().draw(false);

            $msnWait.close();
        });

        //! Tabs modal principal
        $('#rlVistas-tab').on('click', async function (e) {
            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición", "orange");
            $msnWait.open();

            await sleep(200);
            $(idTable_RlVistas).DataTable().columns.adjust().draw(false);

            $msnWait.close();
        });

        $('#btnAceptarMdlRlAcciones').on('click', function (e) {
            mdlActions.addRlActionsToObj();
        });

        //! *******Eventos modal catalogos vistas*****//
        //agregar vistas del catalogo al modal de relacion R-V
        $('#btnAceptarMdlCtVistas').on('click', function (e) {
            mdlPrincipal.addViewsToDtRl();
        });

        //agregar vistas del catalogo al modal de relacion R-V
        $('#btnAceptarMdlCtActions').on('click', function (e) {
            mdlActions.addActionsToDtRl();
        });

        //eliminar de la vistas la relacions R-V 
        $('#tblRlVistas').on('click', '.btnDeleteRlVistas', function (e) {
            let closesTr = $(this).closest('tr');
            tblRlVistas.setRowSelected(closesTr);
            mdlPrincipal.confirmModal({ eventButton: "deleteRlVista", title: "Confirma!", message: "¿Segúro que deséa eliminar el registro?" });
        });

        $('#tblRlVistas').on('change', '.ddl_vista_permiso_servidor', function (e) {
            let closesTr = $(this).closest('tr');
            tblRlVistas.setRowSelected(closesTr);
            mdlPrincipal.cambiar_ddl_permiso_servidor($(this).val());
        });

        $('#tblRlVistas').on('click', '.btnEdtiRlVistas', async function (e) {
            let closesTr = $(this).closest('tr');
            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición", "orange");
            $msnWait.open();
            
            tblRlVistas.setRowSelected(closesTr);
            mdlActions.mostrarModal();
            await sleep(200);
            $(idTable_RlActions).DataTable().columns.adjust().draw(false);

            $msnWait.close();
        });

        $('#tblRlActions').on('click', '.btnDeleteRlActions', function (e) {
            let closesTr = $(this).closest('tr');
            tblRlActions.setRowSelected(closesTr);
            mdlActions.confirmModal({ eventButton: "deleteRlActions", title: "Confirma!", message: "¿Segúro que deséa eliminar el registro?" });
        });

        $('#tblRlActions').on('change', '.ddl_accion_permiso_servidor', function (e) {
            let closesTr = $(this).closest('tr');
            tblRlActions.setRowSelected(closesTr);
            mdlActions.cambiar_ddl_permiso_servidor($(this).val());
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
            GetListaPrincipal(true,true);
        });

        $("#close-sidebar").on('click', async function () {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
        });
        
    }

    function initEventsPermissions() {
        //! *****Eventos botones permission******//
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
        mdlActions: mdlActions,
        tblPrincipal: tblPrincipal,
        tblRlVistas: tblRlVistas,
        tblCtVistas: tblCtVistas,
        tblCtActions:tblCtActions,
        tblRlActions: tblRlActions,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        getListaPermisos_servidor: getListaPermisos_servidor
    }
};