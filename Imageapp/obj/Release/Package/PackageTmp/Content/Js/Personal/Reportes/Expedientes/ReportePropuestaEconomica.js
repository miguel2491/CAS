
var objClsCliente;
//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tblReporte";

    var tblPrincipal = new clsDataTable();
    //var tblPrincipal2 = new clsDataTable();
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

            $waitMsn.close();
        }).catch((r) => {
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
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetReporteExpedienteFiscalSueldos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    
                    var datos_reportes = result.resultStoredProcedure.msnSuccess;
                    
                    tblPrincipal.addRows(datos_reportes);
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
            { visible: true, orderable: true, searchable: true, targets: 0, width: 120, name: "rfc", data: "rfc" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 120, name: "nombre_razon", data: "nombre_razon" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 180, name: "linea", data: "linea" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "encargado", data: "encargado" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 100, name: "entregable_1", data: "entregable_1", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 100, name: "entregable_2", data: "entregable_2", render: formatDato },            
            { visible: true, orderable: true, searchable: true, targets: 6, width: 100, name: "entregable_3", data: "entregable_3", render: formatDato },            
            { visible: true, orderable: true, searchable: true, targets: 7, width: 100, name: "entregable_4", data: "entregable_4", render: formatDato },            
            { visible: true, orderable: true, searchable: true, targets: 8, width: 100, name: "entregable_5", data: "entregable_5", render: formatDato },            
            { visible: true, orderable: true, searchable: true, targets: 9, width: 100, name: "entregable_6", data: "entregable_6", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 100, name: "entregable_7", data: "entregable_7", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 100, name: "entregable_8", data: "entregable_8", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 100, name: "entregable_9", data: "entregable_9", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 100, name: "entregable_10", data: "entregable_10", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 100, name: "entregable_11", data: "entregable_11", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 15, width: 100, name: "entregable_12", data: "entregable_12", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 16, width: 100, name: "entregable_13", data: "entregable_13", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 17, width: 100, name: "entregable_14", data: "entregable_14", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 18, width: 100, name: "entregable_15", data: "entregable_15", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 19, width: 100, name: "entregable_16", data: "entregable_16", render: formatDato }
            
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [0, 'asc']            
        }
        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        function formatDato(data, type, row) {
            if (type == 'display') {
                if (data != "") {
                    return data + "X";
                }
                else {
                    return data;
                }
            } else
                return data;
        }
    }

    

    function initEvents() {
        $('#btnSearchFilter').on('click', function () {
            GetListaPrincipal(true, true);            
        });
    }



    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $("#close-sidebar").on('click', async function (a) {
            await sleep(500);
            try {
                myChart.resize();
            } catch (e) {
                alert(e.message);
            }

        });
    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        tblReporte: tblPrincipal
    }
};