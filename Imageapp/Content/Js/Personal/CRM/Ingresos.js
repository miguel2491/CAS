
var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tbl_Ingresos";
    const idTable_Sueldos = "#tbl_Sueldos";
    const idTable_Pagos = "#tbl_Pagos";
    const idTable_Egresos = "#tbl_Egresos";
    const idTable_Canceladas = "#tbl_Canceladas";

    var tblPrincipal = new clsDataTable();
    var tblSueldos = new clsDataTable();
    var tblPagos = new clsDataTable();
    var tblEgresos = new clsDataTable();
    var tblCanceladas = new clsDataTable();

    var listaPermisos = {};

    $fl_periodo = $("#fl_periodo");
    $fl_mes = $("#fl_mes");
    var $btnDescarga = $("#btnDescargarXML");

    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        await initTables();

        Promise.all([GetPermisos(), GetListaPrincipal(), GetListaSueldos(), GetListaPagos(), GetListaEgresos(), GetListaCanceladas()]).then(function (values) {
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

        Promise.all([GetPermisos(), GetListaPrincipal(), GetListaSueldos(), GetListaPagos(), GetListaEgresos(), GetListaCanceladas()]).then(function (values) {
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = data_rfc;
        filter.mes = $fl_mes.val();
        filter.periodo = $fl_periodo.val();
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetIngresos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {


                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.acciones = '<a href="#" onclick="objClsCliente.getPDF(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.acciones += '<a href="#" onclick="objClsCliente.getXML(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';
                    });


                    tblPrincipal.addRows(contenido, true, true, forzeDraw);
                    $btnDescarga.attr("href", url_Catalogo_Descargar + "?jsonJS=" + filtersSearch + "&id_RV=" + id_RV);
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

    function GetListaSueldos(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = data_rfc;
        filter.mes = $fl_mes.val();
        filter.periodo = $fl_periodo.val();
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetSueldos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {


                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.acciones = '<a href="#" onclick="objClsCliente.getPDF(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.acciones += '<a href="#" onclick="objClsCliente.getXML(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';
                    });


                    tblSueldos.addRows(contenido, true, true, forzeDraw);

                }
                else {
                    tblSueldos.clearRows();
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaPagos(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = data_rfc;
        filter.mes = $fl_mes.val();
        filter.periodo = $fl_periodo.val();
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetPagos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {


                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.acciones = '<a href="#" onclick="objClsCliente.getPDF(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.acciones += '<a href="#" onclick="objClsCliente.getXML(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';
                    });


                    tblPagos.addRows(contenido, true, true, forzeDraw);

                }
                else {
                    tblPagos.clearRows();
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaEgresos(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = data_rfc;
        filter.mes = $fl_mes.val();
        filter.periodo = $fl_periodo.val();
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetEgresos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {


                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.acciones = '<a href="#" onclick="objClsCliente.getPDF(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.acciones += '<a href="#" onclick="objClsCliente.getXML(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';
                    });


                    tblEgresos.addRows(contenido, true, true, forzeDraw);

                }
                else {
                    tblEgresos.clearRows();
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaCanceladas(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = data_rfc;
        filter.mes = $fl_mes.val();
        filter.periodo = $fl_periodo.val();
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetCanceladosEmitidos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {


                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.acciones = '<a href="#" onclick="objClsCliente.getPDF(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.acciones += '<a href="#" onclick="objClsCliente.getXML(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';
                    });


                    tblCanceladas.addRows(contenido, true, true, forzeDraw);

                }
                else {
                    tblCanceladas.clearRows();
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
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 80, name: "version", data: "version" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 120, name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 80, name: "folio", data: "folio" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 250, name: "uuid", data: "uuid" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "nombre_receptor", data: "nombre_receptor" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "subtotal", data: "subtotal", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 150, name: "impuesto_trasladado", data: "impuesto_trasladado", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "total", data: "total", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 100, name: "metodo_pago", data: "metodo_pago" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 100, name: "forma_pago", data: "forma_pago" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 400, name: "conceptos", data: "conceptos" },
            { visible: false, orderable: false, searchable: false, targets: 12, width: '0%', name: "url_xml", data: "url_xml" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [2, 'desc'],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // computing column Total of the complete result 
                var subtotal = (api
                    .column(6)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var iva = (api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(8)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(6).footer()).html(formatCurrency(subtotal));
                $(api.column(7).footer()).html(formatCurrency(iva));
                $(api.column(8).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable


        //! Definir objeto estructura del datatable
        let paramsDataTable2 = {
            columnDefs: columnDefs,
            idTable: idTable_Sueldos,
            order: [2, 'desc'],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // computing column Total of the complete result 
                var subtotal = (api
                    .column(6)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var iva = (api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(8)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(6).footer()).html(formatCurrency(subtotal));
                $(api.column(7).footer()).html(formatCurrency(iva));
                $(api.column(8).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable2); //! Inicializar datatable
        tblSueldos.setTable($(idTable_Sueldos).DataTable()); //! Inicializar clase datatable

        //! Definir objeto estructura del datatable
        let paramsDataTable3 = {
            columnDefs: columnDefs,
            idTable: idTable_Pagos,
            order: [2, 'desc'],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // computing column Total of the complete result 
                var subtotal = (api
                    .column(6)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var iva = (api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(8)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(6).footer()).html(formatCurrency(subtotal));
                $(api.column(7).footer()).html(formatCurrency(iva));
                $(api.column(8).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable3); //! Inicializar datatable
        tblPagos.setTable($(idTable_Pagos).DataTable()); //! Inicializar clase datatable

        //! Definir objeto estructura del datatable
        let paramsDataTable4 = {
            columnDefs: columnDefs,
            idTable: idTable_Egresos,
            order: [2, 'desc'],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // computing column Total of the complete result 
                var subtotal = (api
                    .column(6)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var iva = (api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(8)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(6).footer()).html(formatCurrency(subtotal));
                $(api.column(7).footer()).html(formatCurrency(iva));
                $(api.column(8).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable4); //! Inicializar datatable
        tblEgresos.setTable($(idTable_Egresos).DataTable()); //! Inicializar clase datatable

        //! Definir objeto estructura del datatable
        let paramsDataTable5 = {
            columnDefs: columnDefs,
            idTable: idTable_Canceladas,
            order: [2, 'desc'],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // computing column Total of the complete result 
                var subtotal = (api
                    .column(6)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var iva = (api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(8)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(6).footer()).html(formatCurrency(subtotal));
                $(api.column(7).footer()).html(formatCurrency(iva));
                $(api.column(8).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable5); //! Inicializar datatable
        tblCanceladas.setTable($(idTable_Canceladas).DataTable()); //! Inicializar clase datatable
    }

    function formatCurrency(cantidad) {
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);

        var valor = numberFormat2.format(cantidad);
        
        return valor.substring(1);
    }

    function initEvents() {
        $('#btnSearchFilter').on('click', function () {
            GetListaPrincipal(true, true);
            GetListaSueldos(true, true);
            GetListaPagos(true, true);
            GetListaEgresos(true, true);
            GetListaCanceladas(true, true);
        });
    }

    function getPDF(uuid, xml) {
        window.location = url_Descarga + '?file=' + xml + '&uuid=' + uuid + '&tipo=2';
    }
    function getXML(uuid, xml) {
        window.location = url_Descarga + '?file=' + xml + '&uuid=' + uuid + '&tipo=1';
    }

    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $("#close-sidebar").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
            tblSueldos.getTable().columns.adjust().draw(false);
            tblPagos.getTable().columns.adjust().draw(false);
            tblEgresos.getTable().columns.adjust().draw(false);
            tblCanceladas.getTable().columns.adjust().draw(false);
        });

        $(".reload").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
            tblSueldos.getTable().columns.adjust().draw(false);
            tblPagos.getTable().columns.adjust().draw(false);
            tblEgresos.getTable().columns.adjust().draw(false);
            tblCanceladas.getTable().columns.adjust().draw(false);
        });

    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        getPDF: getPDF,
        getXML: getXML
    }
};
