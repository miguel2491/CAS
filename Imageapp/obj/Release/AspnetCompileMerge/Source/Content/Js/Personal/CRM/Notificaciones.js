
var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tbl_Entregables";

    var tblPrincipal = new clsDataTable();
    var listaPermisos = {};  


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
        filter.rfc = data_rfc;
        let filtersSearch = JSON.stringify(filter);
        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetNotificaciones, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
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
            
            { visible: true, orderable: true, searchable: true, targets: 0, width: 100, name: "es_anual", data: "es_anual" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 150, name: "autoridad_emisora", data: "autoridad_emisora" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 350, name: "acto_administrativo", data: "acto_administrativo" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 100, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 120, name: "fecha_recepcion", data: "fecha_recepcion" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 120, name: "fecha_notificacion", data: "fecha_notificacion" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 180, name: "notificaciones", data: "notificaciones" },
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [5, 'desc'],
            descLength: {
                arrayTotal :[-1],
                arrayDes :["Todas"]
            }
        }
        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable


        
    }

    function initEvents() {

    }    

    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $("#close-sidebar").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
        });       

        

    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal
    }
};
