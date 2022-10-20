
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

    $fl_periodo = $("#fl_periodo");
    


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
        filter.periodo = $fl_periodo.val();
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetReporteGeneral, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
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
            { visible: true, orderable: true, searchable: true, targets: 1, width: 200, name: "nombre_razon", data: "nombre_razon" },
			 { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "regimen", data: "regimen" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "ingreso_1", data: "ingreso_1", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "gasto_1", data: "gasto_1", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "ingreso_2", data: "ingreso_2", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "gasto_2", data: "gasto_2", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 150, name: "ingreso_3", data: "ingreso_3", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "gasto_3", data: "gasto_3", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "ingreso_4", data: "ingreso_4", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "gasto_4", data: "gasto_4", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 150, name: "ingreso_5", data: "ingreso_5", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 150, name: "gasto_5", data: "gasto_5", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 150, name: "ingreso_6", data: "ingreso_6", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 150, name: "gasto_6", data: "gasto_6", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 15, width: 150, name: "ingreso_7", data: "ingreso_7", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 16, width: 150, name: "gasto_7", data: "gasto_7", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 17, width: 150, name: "ingreso_8", data: "ingreso_8", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 18, width: 150, name: "gasto_8", data: "gasto_8", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 19, width: 150, name: "ingreso_9", data: "ingreso_9", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 20, width: 150, name: "gasto_9", data: "gasto_9", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 21, width: 150, name: "ingreso_10", data: "ingreso_10", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 22, width: 150, name: "gasto_10", data: "gasto_10", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 23, width: 150, name: "ingreso_11", data: "ingreso_11", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 24, width: 150, name: "gasto_11", data: "gasto_11", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 25, width: 150, name: "ingreso_12", data: "ingreso_12", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 26, width: 150, name: "gasto_12", data: "gasto_12", render: formatCurrency },
			{ visible: true, orderable: true, searchable: true, targets: 27, width: 150, name: "ingreso_total", data: "ingreso_total", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 28, width: 150, name: "gasto_total", data: "gasto_total", render: formatCurrency },

            { visible: true, orderable: true, searchable: true, targets: 29, width: 150, name: "nomina", data: "nomina", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 30, width: 150, name: "nota_credito_emitidas", data: "nota_credito_emitidas", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 31, width: 150, name: "notas_credito_recibidas", data: "notas_credito_recibidas", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 32, width: 150, name: "utilidad", data: "utilidad", render: formatCurrency }
            
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [0, 'asc'],
            fixedColumns : {
                leftColumns: 2
            }
        }
        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        function formatCurrency(data, type, row) {


            const options2 = { style: 'currency', currency: 'USD' };
            const numberFormat2 = new Intl.NumberFormat('en-US', options2);

            var valor = numberFormat2.format(data);


            if (data < 0) {
                return "-" + valor.substring(2);
            }

            return valor.substring(1);


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