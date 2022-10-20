

var MONTHS = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Total'];

var myChart;
var objClsCliente;
var datos_reportes;
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


    var $periodo_grafica = $("#select_periodo_grafica");
    var periodo_grafica = 2021;

    $periodo_grafica.change(function () {
        periodo_grafica = $periodo_grafica.val();
        GetListaPrincipal();
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

    async function refreshReporte() {

        await sleep(200);

        var lista_meses = datos_reportes.meses;
        var meses = [], ingresos = [], gastos = [], ingresos_nomina = [], gastos_nomina = [], canceladas_ingreso = [], canceladas_gasto = [];
        for (var a in lista_meses) {

            if (lista_meses[a].mes != 13) {
                meses.push(MONTHS[lista_meses[a].mes]);
                ingresos.push(lista_meses[a].ingreso);
                gastos.push(lista_meses[a].gasto);

                ingresos_nomina.push(lista_meses[a].nominas_ingreso);
                gastos_nomina.push(lista_meses[a].nominas_gasto);

                canceladas_ingreso.push(lista_meses[a].facturas_canceladas_ingreso);
                canceladas_gasto.push(lista_meses[a].facturas_canceladas_gasto);
            }
        }

        let total_ingresos = datos_reportes.total_ingresos;
        let total_gastos = datos_reportes.total_gastos;
        let subtotal_ingresos = datos_reportes.subtotal_ingresos;
        let subtotal_gastos = datos_reportes.subtotal_gastos;

        let total_ingresos_nomina = datos_reportes.total_ingresos_nomina;
        let total_gastos_nomina = datos_reportes.total_gastos_nomina;
        let subtotal_ingresos_nomina = datos_reportes.subtotal_ingresos_nomina;
        let subtotal_gastos_nomina = datos_reportes.subtotal_gastos_nomina;



        if ($("#option1").prop("checked")) {
            $("#spanTotal").text(total_ingresos);
            $("#spanSubtotal").text(subtotal_ingresos);
            $("#nameTotal").text("Ingreso Total");
            $("#nameSubtotal").text("Ingreso Subtotal");


            if (id_regimen == 5) {
                $("#spanTotalN").text("");
                $("#spanSubtotalN").text("");
                $("#nameTotalN").text("");
                $("#nameSubtotalN").text("");
                $("#leyendaDespues").hide();
                $("#leyendaAntes").hide();
            }
            else {
                $("#spanTotalN").text(total_gastos_nomina);
                $("#spanSubtotalN").text(subtotal_gastos_nomina);
                $("#nameTotalN").text("Sueldos y Salarios");
                $("#nameSubtotalN").text("Sueldos y Salarios");
                $("#leyendaDespues").show();
                $("#leyendaAntes").show();
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
                    label: 'Sueldos y Salarios',
                    backgroundColor: "#0498b9",
                    borderColor: "#0498b9",
                    borderWidth: 1,
                    data: gastos_nomina
                }
                ]

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
                    },
                    animation: {
                        onComplete: function () {
                            //var chartInstance = this.chart,
                            //    ctx = chartInstance.ctx;
                            //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                            //ctx.textAlign = 'center';
                            //ctx.textBaseline = 'bottom';

                            //this.data.datasets.forEach(function (dataset, i) {
                            //    var meta = chartInstance.controller.getDatasetMeta(i);
                            //    meta.data.forEach(function (bar, index) {
                            //        var data = dataset.data[index];
                            //        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                            //    });
                            //});
                        }
                    }
                }
            });

        } else {
            $("#spanTotal").text(total_gastos);
            $("#spanSubtotal").text(subtotal_gastos);
            $("#nameTotal").text("Gastos Total");
            $("#nameSubtotal").text("Gastos Subtotal");

            $("#spanTotalN").text(total_ingresos_nomina);
            $("#spanSubtotalN").text(subtotal_ingresos_nomina);
            $("#nameTotalN").text("Nóminas");
            $("#nameSubtotalN").text("Nóminas");

            $("#leyendaDespues").show();
            $("#leyendaAntes").show();

            var barChartData = {
                labels: meses,
                datasets: [{
                    label: 'Gastos',
                    backgroundColor: "#00c777",
                    borderColor: "#00c777",
                    borderWidth: 1,
                    data: gastos
                }, {
                    label: 'Nóminas',
                    backgroundColor: "#077860",
                    borderColor: "#077860",
                    borderWidth: 1,
                    data: ingresos_nomina
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
                    },
                    animation: {
                        onComplete: function () {
                            //var chartInstance = this.chart,
                            //    ctx = chartInstance.ctx;
                            //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                            //ctx.textAlign = 'center';
                            //ctx.textBaseline = 'bottom';

                            //this.data.datasets.forEach(function (dataset, i) {
                            //    var meta = chartInstance.controller.getDatasetMeta(i);
                            //    meta.data.forEach(function (bar, index) {
                            //        var data = dataset.data[index];
                            //        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                            //    });
                            //});
                        }
                    }
                }
            });
        }



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
                    //tblPrincipal.addRows(result.resultStoredProcedure.msnSuccess.ultimos_ingresos, true, true, forzeDraw);
                    //tblPrincipal2.addRows(result.resultStoredProcedure.msnSuccess.ultimos_gastos, true, true, forzeDraw);

                    datos_reportes = result.resultStoredProcedure.msnSuccess;
                    var datosReporte = [];
                    for (var i = 0; i < datos_reportes.meses.length; i++) {
                        var item = datos_reportes.meses[i];
                        datosReporte.push({
                            mes: MONTHS[item.mes],
                            ingreso: item.ingreso,
                            gasto: item.gasto,
                            facturas_ingreso: item.facturas_ingreso,
                            facturas_gasto: item.facturas_gasto,
                            posicion: item.mes,
                            nominas_gasto: item.nominas_gasto,
                            nominas_ingreso: item.nominas_ingreso,
                            facturas_canceladas_gasto: item.facturas_canceladas_gasto,
                            facturas_canceladas_ingreso: item.facturas_canceladas_ingreso
                        });
                    }

                    tblPrincipal.addRows(datosReporte);
                    refreshReporte();
                }
                else {
                    tblPrincipal.clearRows();
                    //tblPrincipal2.clearRows();
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
            { visible: false, orderable: true, searchable: false, targets: 0, width: 120, name: "posicion", data: "posicion" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 120, name: "mes", data: "mes" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 120, name: "ingreso", data: "ingreso", render: formatCurrency },
            { visible: (id_regimen == 5 ? false : true), orderable: (id_regimen == 5 ? false : true), searchable: (id_regimen == 5 ? false : true), targets: 3, width: 120, name: "nominas_gasto", data: "nominas_gasto", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 100, name: "facturas_ingreso", data: "facturas_ingreso" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 100, name: "facturas_canceladas_ingreso", data: "facturas_canceladas_ingreso" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 120, name: "gasto", data: "gasto", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 120, name: "nominas_ingreso", data: "nominas_ingreso", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 100, name: "facturas_gasto", data: "facturas_gasto" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 100, name: "facturas_canceladas_gasto", data: "facturas_canceladas_gasto" },
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [0, 'asc'],
            descLength: {
                arrayTotal: [-1],
                arrayDes: ["Todas"]
            },
            customizeExcel: function (xlsx) {
                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                var indice = 0;
                var ultimo = $('row', sheet).length;
                $('row', sheet).each(function () {
                    indice++;
                    if (indice == 1) {
                        var heads = $('is t', this);
                        heads.each(function () {
                            var elemento = $(this.parentNode.parentNode);
                            elemento.attr('s', '46');
                        });
                        return false;
                    }
                });
                indice = 0;
                $('row', sheet).each(function () {
                    indice++
                    if (indice == ultimo) {
                        var heads = $('is t', this);
                        heads.each(function () {
                            var elemento = $(this.parentNode.parentNode);
                            elemento.attr('s', '68');
                        });
                        var number = $('v', this);
                        number.each(function () {

                            var numero = this.innerHTML;
                            var array = numero.split(".")
                            if (array.length == 1) {
                                var elemento = $(this.parentNode);
                                elemento.attr('s', '68');
                            }
                            else {
                                var elemento = $(this.parentNode);
                                elemento.attr('s', '62');
                            }
                            
                        });
                        return false;
                    }
                });
            }
        }
        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        function formatCurrency(data, type, row) {


            const options2 = { style: 'currency', currency: 'USD' };
            const numberFormat2 = new Intl.NumberFormat('en-US', options2);

            var valor = numberFormat2.format(data);

            return valor.substring(1);


        }


    }

    function formatCurrency(cantidad) {
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);

        return numberFormat2.format(cantidad);
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

        });
    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        refreshReporte: refreshReporte,
        tblReporte: tblPrincipal
    }
};
