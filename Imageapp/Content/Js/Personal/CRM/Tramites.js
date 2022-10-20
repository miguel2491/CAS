var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tbl_tramites";

    var tblPrincipal = new clsDataTable();
    var mdlPrincipal = new mdlClientes();
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
            mdlPrincipal.init();
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
            doAjax("POST", url_Cliente_GetListaTramites, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    let contenido = result.resultStoredProcedure.msnSuccess;

                    contenido.forEach(function (item) {
                        item.acciones = '';
                    });

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

            { visible: true, orderable: true, searchable: true, targets: 0, width: '45%', name: "tramite", data: "tramite" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: '10%', name: "tipo", data: "tipo" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '15%', name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: '10%', name: "estatus", data: "estatus" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: '20%', name: "acciones", data: "acciones" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [2, 'desc']
        }

        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

    }

    function initEvents() {

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

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal
    }
};
