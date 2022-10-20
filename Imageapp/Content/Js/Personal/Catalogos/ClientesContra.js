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
    const nameColsStorage = "stColsDt_ClientesContra";
    
    var tblPrincipal = new clsDataTable();
    
    var $frs_id_cliente = $("#frs_id_cliente");
    var $frs_id_regimen = $("#frs_id_regimen");
    var $frs_rfc = $("#frs_rfc");
    var $frs_nombre_razon = $("#frs_nombre_razon");
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
            { visible: true, orderable: true, searchable: true, targets: 2, width: 300, name: "nombre_razon", data: "nombre_razon" },
            { visible: false, orderable: false, searchable: false, targets: 3, width: 0, name: "id_tipo_persona", data: "id_tipo_persona" },
            { visible: false, orderable: false, searchable: false, targets: 4, width: 150, name: "tipo_persona", data: "tipo_persona" },           
            { visible: false, orderable: false, searchable: false, targets: 5, width: 0, name: "id_estatus", data: "id_estatus" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 100, name: "descripcion_estatus", data: "descripcion_estatus" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 120, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 200, name: "correo_electronico", data: "correo_electronico" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 150, name: "telefono", data: "telefono" },
            { visible: false, orderable: false, searchable: false, targets: 10, width: 150, name: "telefono_movil", data: "telefono_movil" },
            { visible: false, orderable: false, searchable: false, targets: 11, width: 350, name: "direccion_fiscal", data: "direccion_fiscal" },
            { visible: false, orderable: false, searchable: false, targets: 12, width: 0, name: "id_usuario", data: "id_usuario" },
            { visible: false, orderable: false, searchable: false, targets: 13, width: 160, name: "nombre", data: "nombre" },
            { visible: false, orderable: false, searchable: false, targets: 14, width: 160, name: "apellido_paterno", data: "apellido_paterno" },
            { visible: false, orderable: false, searchable: false, targets: 15, width: 160, name: "apellido_materno", data: "apellido_materno" },
            { visible: false, orderable: false, searchable: false, targets: 16, width: 150, name: "regimen", data: "regimen" },
            { visible: false, orderable: false, searchable: false, targets: 17, width: 0, name: "id_regimen", data: "id_regimen" },
            { visible: false, orderable: false, searchable: false, targets: 18, width: 250, name: "actividad_principal", data: "actividad_principal" },
            { visible: false, orderable: false, searchable: false, targets: 19, width: 250, name: "es_asesoria", data: "es_asesoria" },
            { visible: false, orderable: false, searchable: false, targets: 20, width: 250, name: "aplica_coi", data: "aplica_coi" },
            { visible: false, orderable: false, searchable: false, targets: 21, width: 250, name: "fecha_caducidad_fiel", data: "fecha_caducidad_fiel" },
            { visible: true, orderable: true, searchable: true, targets: 22, width: 250, name: "password", data: "password" }
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

        //! ******Eventos botones modal******//

       

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

        

        setParamsDatePickerNacimiento();
    }

    function isRowSelected(button, event) {
        

       
    }

    return {
        init: init,
        tblPrincipal: tblPrincipal,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal
    }
};