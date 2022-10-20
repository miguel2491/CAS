
var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales

    const idTable_Principal2 = "#tbl_Gastos";
    const idTable_Nominas = "#tbl_Nominas";
    const idTable_Pagos = "#tbl_Pagos";
    const idTable_Egresos = "#tbl_Egresos";
    const idTable_Canceladas = "#tbl_Canceladas";

    var tblPrincipal2 = new clsDataTable();
    var tblNominas = new clsDataTable();
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

        Promise.all([GetPermisos(), GetListaPrincipal(), GetListaNominas(), GetListaPagos(), GetListaEgresos(), GetListaCanceladas()]).then(function (values) {
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

        Promise.all([GetPermisos(), GetListaPrincipal(), GetListaNominas(), GetListaPagos(), GetListaEgresos(), GetListaCanceladas()]).then(function (values) {
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
            doAjax("POST", url_Cliente_GetGastos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.acciones = '<a href="#" onclick="objClsCliente.getPDF(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.acciones += '<a href="#" onclick="objClsCliente.getXML(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';
                    });


                    tblPrincipal2.addRows(contenido, true, true, forzeDraw);

                    $btnDescarga.attr("href", url_Catalogo_Descargar + "?jsonJS=" + filtersSearch + "&id_RV=" + id_RV);


                }
                else {

                    tblPrincipal2.clearRows();
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaNominas(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = data_rfc;
        filter.mes = $fl_mes.val();
        filter.periodo = $fl_periodo.val();
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetNominas, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.acciones = '<a href="#" onclick="objClsCliente.getPDF(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.acciones += '<a href="#" onclick="objClsCliente.getXML(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';
                    });


                    tblNominas.addRows(contenido, true, true, forzeDraw);




                }
                else {

                    tblNominas.clearRows();
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
            doAjax("POST", url_Cliente_GetCanceladosRecibidos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
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


        let columnDefs2 = [

            { visible: true, orderable: true, searchable: true, targets: 0, width: '50%', name: "nombre_emisor", data: "nombre_emisor" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: '8%', name: "folio", data: "folio" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '10%', name: "fecha", data: "fecha"},
            { visible: true, orderable: true, searchable: true, targets: 3, width: '10%', name: "subtotal", data: "subtotal", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 4, width: '10%', name: "total", data: "total", render: formatCurrency  },
            { visible: true, orderable: false, searchable: false, targets: 5, width: '12%', name: "acciones", data: "acciones" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: '0%', name: "uuid", data: "uuid" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: '0%', name: "url_xml", data: "url_xml" },
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable2 = {
            columnDefs: columnDefs2,
            idTable: idTable_Principal2,
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
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(4)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(3).footer()).html(formatCurrency(subtotal));
                $(api.column(4).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable2); //! Inicializar datatable
        tblPrincipal2.setTable($(idTable_Principal2).DataTable()); //! Inicializar clase datatable

        //! Definir objeto estructura del datatable
        let paramsDataTable3 = {
            columnDefs: columnDefs2,
            idTable: idTable_Nominas,
            order: [1, 'desc'],
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
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(4)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(3).footer()).html(formatCurrency(subtotal));
                $(api.column(4).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable3); //! Inicializar datatable
        tblNominas.setTable($(idTable_Nominas).DataTable()); //! Inicializar clase datatable

        //! Definir objeto estructura del datatable
        let paramsDataTable4 = {
            columnDefs: columnDefs2,
            idTable: idTable_Pagos,
            order: [1, 'desc'],
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
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(4)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(3).footer()).html(formatCurrency(subtotal));
                $(api.column(4).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable4); //! Inicializar datatable
        tblPagos.setTable($(idTable_Pagos).DataTable()); //! Inicializar clase datatable

        //! Definir objeto estructura del datatable
        let paramsDataTable5 = {
            columnDefs: columnDefs2,
            idTable: idTable_Egresos,
            order: [1, 'desc'],
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
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(4)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(3).footer()).html(formatCurrency(subtotal));
                $(api.column(4).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable5); //! Inicializar datatable
        tblEgresos.setTable($(idTable_Egresos).DataTable()); //! Inicializar clase datatable

        //! Definir objeto estructura del datatable
        let paramsDataTable6 = {
            columnDefs: columnDefs2,
            idTable: idTable_Canceladas,
            order: [1, 'desc'],
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
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                var total = (api
                    .column(4)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + (intVal(b) * 100);
                    }, 0) / 100);

                // Update footer by showing the total with the reference of the column index 
                $(api.column(3).footer()).html(formatCurrency(subtotal));
                $(api.column(4).footer()).html(formatCurrency(total));
            },
        }
        initDataTable(paramsDataTable6); //! Inicializar datatable
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
            GetListaNominas(true, true);
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
           
            await sleep(500);
            tblPrincipal2.getTable().columns.adjust().draw(false);
            tblNominas.getTable().columns.adjust().draw(false);
            tblPagos.getTable().columns.adjust().draw(false);
            tblEgresos.getTable().columns.adjust().draw(false);
            tblCanceladas.getTable().columns.adjust().draw(false);
        });

        $(".reload").on('click', async function (a) {
            await sleep(200);
            tblPrincipal2.getTable().columns.adjust().draw(false);
            tblNominas.getTable().columns.adjust().draw(false);
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
