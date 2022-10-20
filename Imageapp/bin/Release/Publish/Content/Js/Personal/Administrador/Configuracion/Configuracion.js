var objClsConfiguracion;

//! Cargar vista
$(document).ready(function () {
    objClsConfiguracion = new clsConfiguracion();
    objClsConfiguracion.init();
});

const clsConfiguracion = function () {
    //! Variables globales
    const idTable_Principal = "#tblConfiguracion";
    const idMdl_Colums = "#mdlColumns";
    const nameColsStorage = "stColsDt_Configuracion";

    var tblPrincipal = new clsDataTable();
    var mdlPrincipal = new mdlConfiguracion();
    var colsPrincipal;
    var listaPermisos = {};

    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        initTables();
        mdlPrincipal.initValidations();

        Promise.all([GetPermisos(), GetListaPrincipal(), GetHospital()]).then(function (values) {
            initEvents();
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    async function refresh() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        Promise.all([GetPermisos(), GetListaPrincipal()], GetHospital()).then(function (values) {
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Administrador_GetConfiguracion, { jsonJS: "", id_RV: id_RV }, showWait).done(function (data) {
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

    //Catalogo de Hospitales
    function GetHospital() {
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: "tbc_Hospitales_configuracion,"
        });

        return new Promise(function (resolve, reject) {
            //! Peticion de la lista de Modalidades
            doAjax("POST", url_Administrador_GetCatalogos, { jsonJS: arrayCatalogos }).done(function (data) {
                let result = new Result(data);

                if (result.validResult(false,false) && result.resultStoredProcedure.validResultStored()) {
                    initHospital(result.resultStoredProcedure.msnSuccess);
                }

                resolve();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function initHospital(contenido) {
        if (contenido.hasOwnProperty("tbc_Hospitales_configuracion")) {
            $("#fr_hospital").html(dataToStringDropDown(contenido.tbc_Hospitales_configuracion, true));
        }
    }
    //Fin Catalogo de Hospitales

    function GetPermisos() {
        return new Promise(function (resolve, reject) {
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
            { visible: true, orderable: true, searchable: true, targets: 0, width: 100, name: "id_hospital", data: "id_hospital" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 200, name: "ruta_iis_proyecto", data: "ruta_iis_proyecto" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 200, name: "subraiz_iis_proyecto", data: "subraiz_iis_proyecto" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 200, name: "ruta_ws_servidor", data: "ruta_ws_servidor" },
            { visible: false, orderable: false, searchable: false, targets: 4, width: 100, name: "es_servidor", data: "es_servidor" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 100, name: "servidor", data: "servidor" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 200, name: "ruta_dicoms", data: "ruta_dicoms" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal
        }

        initDataTable(paramsDataTable); //Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //Inicializar clase datatable
        colsPrincipal = new clsColumns($(idTable_Principal).DataTable(), nameColsStorage);// Inicializar clase columnas
        colsPrincipal.init(); //Init config
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

        //! Evento de [cerrar] modal de la entidad
        $('#btnCloseMdl').on('click', function () {
            mdlPrincipal.confirmModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        //! Evento de [aceptar] modal de la entidad
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
        getListaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal
    }
};