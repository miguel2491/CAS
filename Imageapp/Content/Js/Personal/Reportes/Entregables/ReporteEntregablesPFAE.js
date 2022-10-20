
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


    var $periodo = $("#fl_periodo");
    var $mes = $("#fl_mes");
    var $linea = $("#fl_linea");

    $linea.change(function () {
        var linea_select = $linea.children("option:selected").text();
        var searchTerm = linea_select,
            regex = '\\b' + searchTerm + '\\b';
        tblPrincipal.table.search(regex, true, false).draw();

    });

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
        filter.mes = $mes.val();
        filter.periodo = $periodo.val();;
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetReporteEntregablesPFAE, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    
                    var datos_reportes = result.resultStoredProcedure.msnSuccess;
                    
                    tblPrincipal.addRows(datos_reportes);
                    var $linea = $("#fl_linea");

                    
                    var linea_select = $linea.children("option:selected").text();
                    var searchTerm = linea_select,
                        regex = '\\b' + searchTerm + '\\b';
                    tblPrincipal.table.search(regex, true, false).draw();

                   
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
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "linea", data: "linea" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 120, name: "encargado", data: "encargado" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 120, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 100, name: "Entregable_1", data: "Entregable_1", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 100, name: "Entregable_2", data: "Entregable_2", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 100, name: "Entregable_3", data: "Entregable_3", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 100, name: "Entregable_4", data: "Entregable_4", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 100, name: "Entregable_5", data: "Entregable_5", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 100, name: "Entregable_6", data: "Entregable_6", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 100, name: "Entregable_7", data: "Entregable_7", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 100, name: "Entregable_8I", data: "Entregable_8I", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 100, name: "Entregable_8", data: "Entregable_8", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 100, name: "Entregable_9", data: "Entregable_9", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 15, width: 100, name: "Entregable_10", data: "Entregable_10", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 16, width: 100, name: "Entregable_11", data: "Entregable_11", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 17, width: 100, name: "Entregable_12", data: "Entregable_12", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 18, width: 100, name: "Entregable_13I", data: "Entregable_13I", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 19, width: 100, name: "Entregable_13", data: "Entregable_13", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 20, width: 100, name: "Entregable_14", data: "Entregable_14", render: formatDato },
            { visible: true, orderable: true, searchable: true, targets: 21, width: 100, name: "Entregable_15", data: "Entregable_15", render: formatDato },
            
            { visible: true, orderable: true, searchable: true, targets: 22, width: 100, name: "Entregable_16", data: "Entregable_16", render: formatDato }
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
                var dato = "";
                var color = "";
                if (data == 0) {
                    dato = "X";
                    color = "danger"
                }
                else if (data == 1) {
                    dato = "✓";
                    color = "success"
                }
                else {
                    dato = "NO APLICA";
                    color = "info"
                }

                return "<h5><span class='badge badge-" + color + "'>" + dato + "</span></h5>";
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