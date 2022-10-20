var objClsUsuario;

//Cargar vista
$(document).ready(function () {
    objClsUsuario = new clsUsuario();
    objClsUsuario.init();
});

const clsUsuario = function () {
    //! Variables globales
    const idTable_Principal = "#tblUsuarios";
    const idMdl_Colums = "#mdlColumns";
    const nameColsStorage = "stColsDt_User";

    var tblPrincipal = new clsDataTable();
    var mdlPrincipal = new mdlUsuarios();

    var colsPrincipal;
    var listaPermisos = {};

    //! Filtros
    var $fl_nombre = $("#fl_nombre");
    var $fl_usuario = $("#fl_usuario");
    var $fl_ddlRol = $("#fl_ddlRol");

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
            mdlPrincipal.init();
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
            doAjax("POST", url_Administrador_GetUsuarios, { jsonJS: filtersSearch, id_RV: id_RV },showWait).done(function (data) {
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
        filters.fl_usuario = $fl_usuario.val();
        filters.fl_ddlRol = $fl_ddlRol.val();
        filters.fl_RdbEstatus = $("input[name='fl_RdbEstatus']:checked").val();

        return filters;
    }

    function clearFilterSearch() {
        $fl_nombre.val("");
        $fl_usuario.val("");
        $fl_ddlRol.val("");
        $("#fl_RdbTodos").prop('checked',true);
    }

    function GetCatalogos() {
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: "tbc_Roles,"
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
        if (contenido.hasOwnProperty("tbc_Roles")) {
            $fl_ddlRol.html(dataToStringDropDown(contenido.tbc_Roles, true));
            $("#fr_rol").html(dataToStringDropDown(contenido.tbc_Roles, true));
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

    function initTables() {
        //! Definir columnas
        let columnDefs = [
            { visible: true, orderable: true, searchable: true, targets: 0, width: 100, name: "id_usuario", data: "id_usuario" },
            { visible: false, orderable: false, searchable: false, targets: 1, width: 150, name: "id_rol", data: "id_rol" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "nombre_rol", data: "nombre_rol" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "nombre", data: "nombre" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "apellido_paterno", data: "apellido_paterno" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "apellido_materno", data: "apellido_materno" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 100, name: "usuario", data: "usuario" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 100, name: "contrasenia", data: "contrasenia" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 100, name: "id_estatus", data: "id_estatus" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 100, name: "descripcion_estatus", data: "descripcion_estatus" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 150, name: "fecha_nacimiento", data: "fecha_nacimiento" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 150, name: "correo_electronico", data: "correo_electronico" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 150, name: "telefono", data: "telefono" },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 150, name: "telefono_movil", data: "telefono_movil" },
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
            GetListaPrincipal(true,true);
        });

        $("#close-sidebar").on('click', async function () {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
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

        setParamsDatePickerNacimiento();
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
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal
    }
};