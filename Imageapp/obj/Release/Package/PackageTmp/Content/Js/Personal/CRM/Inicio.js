
var MONTHS = ['','Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Total'];

var myChart;
var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tbl_Ingresos";
    const idTable_Principal2 = "#tbl_Gastos";

    var tblPrincipal = new clsDataTable();
    var tblPrincipal2 = new clsDataTable();
    var listaPermisos = {};

    var $periodo_grafica = "#select_periodo_grafica";
    var periodo_grafica = 2021;

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

    function formatCurrency(cantidad) {
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);

        return numberFormat2.format(cantidad);
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = data_rfc;
        filter.periodo = periodo_grafica;
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetInicio, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    tblPrincipal.addRows(result.resultStoredProcedure.msnSuccess.ultimos_ingresos, true, true, forzeDraw);
                    tblPrincipal2.addRows(result.resultStoredProcedure.msnSuccess.ultimos_gastos, true, true, forzeDraw);

                    var mejor_cliente = result.resultStoredProcedure.msnSuccess.mejor_cliente;
                    var mejor_proveedor = result.resultStoredProcedure.msnSuccess.mejor_proveedor;

                    var total_clientes = result.resultStoredProcedure.msnSuccess.total_clientes;
                    var total_proveedores = result.resultStoredProcedure.msnSuccess.total_proveedores;
                                        
                    $("#txtTotalClientes").text(total_clientes);
                    $("#txtTotalProveedores").text(total_proveedores);

                    if (mejor_cliente != null && mejor_cliente.length > 0) {
                        $("#txtRFCMC").text(mejor_cliente[0].rfc);
                        $("#txtRazonMC").text(mejor_cliente[0].nombre_razon);
                        $("#txtSubtotalMC").text(mejor_cliente[0].subtotal);
                        $("#txtTotalMC").text(mejor_cliente[0].total);
                        $("#txtFacturasMC").text("Facturas(" + mejor_cliente[0].facturas + ")");
                    }
                    if (mejor_proveedor != null && mejor_proveedor.length > 0) {
                        $("#txtRFCMP").text(mejor_proveedor[0].rfc);
                        $("#txtRazonMP").text(mejor_proveedor[0].nombre_razon);
                        $("#txtSubtotalMP").text(mejor_proveedor[0].subtotal);
                        $("#txtTotalMP").text(mejor_proveedor[0].total);
                        $("#txtFacturasMP").text("Facturas(" + mejor_proveedor[0].facturas + ")");
                    }

                    var lista_meses = result.resultStoredProcedure.msnSuccess.meses;
                    var lista_meses_anterior = result.resultStoredProcedure.msnSuccess.meses_anterior;
                    var meses = [], ingresos = [], gastos = [];
                    var ingresos_anterior = [], gastos_anterior = [];
                    for (var a in lista_meses) {

                        if (lista_meses[a].mes != 13) {
                            meses.push(MONTHS[lista_meses[a].mes]);
                            ingresos.push(lista_meses[a].ingreso);
                            gastos.push(lista_meses[a].gasto);
                        }
                        
                    }

                    for (var a in lista_meses_anterior) {

                        if (lista_meses_anterior[a].mes != 13) {
                            //meses_anterior.push(MONTHS[lista_meses_anterior[a].mes]);
                            ingresos_anterior.push(lista_meses_anterior[a].ingreso);
                            gastos_anterior.push(lista_meses_anterior[a].gasto);
                        }

                    }

                    var barChartData = {
                        labels: meses,
                        datasets: [{
                            label: 'Ingresos',
                            backgroundColor: "#041eb9",
                            borderColor: "#041eb9",
                            borderWidth: 1,
                            data: ingresos
                        }, {
                                label: 'Año Anterior',
                                backgroundColor: "#ffffff",
                                borderColor: "#041eb9",
                                borderWidth: 1,
                                data: ingresos_anterior
                            }, {
                            label: 'Gastos',
                            backgroundColor: "#00c777",
                            borderColor: "#00c777",
                            borderWidth: 1,
                            data: gastos
                            }, {
                                label: 'Año Anterior',
                                backgroundColor: "#ffffff",
                                borderColor: "#00c777",
                                borderWidth: 1,
                                data: gastos_anterior
                            }]

                    };

                    try {
                        myChart.destroy();
                    } catch (e) {

                    }

                    var ctx = document.getElementById('myChart').getContext('2d');
                    
                    myChart = new Chart(ctx, {
                        type: 'bar',
                        data: barChartData,
                        options: {
                            tooltips: {
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var label = data.datasets[tooltipItem.datasetIndex].label || '';

                                        if (label) {
                                            label += ': ';
                                        }
                                        label += formatCurrency(tooltipItem.yLabel);
                                        return label;
                                    }
                                }
                            },
                            responsive: true,
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false,
                                text: ''
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });

                }
                else {
                    tblPrincipal.clearRows();
                    tblPrincipal2.clearRows();
                }
                
                resolve();
                //jsSimpleAlert("Aviso", "Estimado Cliente, nuestro servicio de descarga masiva de XML está en mantenimiento, por lo cual sus CFDI´s no se verán actualizados por el momento. Disculpe las molestias.");
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

            { visible: true, orderable: true, searchable: true, targets: 0, width: '60%', name: "nombre_receptor", data: "nombre_receptor" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: '20%', name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '20%', name: "subtotal", data: "subtotal" },
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            dom: 
                "<'row'<'col-sm-12'tr>>",
            order: [1, 'desc']
        }
        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        let columnDefs2 = [

            { visible: true, orderable: true, searchable: true, targets: 0, width: '60%', name: "nombre_emisor", data: "nombre_emisor" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: '20%', name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '20%', name: "subtotal", data: "subtotal" },
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable2 = {
            columnDefs: columnDefs2,
            idTable: idTable_Principal2,
            dom: 
                "<'row'<'col-sm-12'tr>>",
            order: [1, 'desc']
        }
        initDataTable(paramsDataTable2); //! Inicializar datatable
        tblPrincipal2.setTable($(idTable_Principal2).DataTable()); //! Inicializar clase datatable
    }

    function initEvents() {

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
            tblPrincipal.getTable().columns.adjust().draw(false);
            tblPrincipal2.getTable().columns.adjust().draw(false);
        });

    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal
    }
};
