
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
    $fl_mes = $("#fl_mes");


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
        filter.mes = $fl_mes.val();
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
            { visible: true, orderable: true, searchable: true, targets: 1, width: 120, name: "nombre_razon", data: "nombre_razon" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 100, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 100, name: "ingreso", data: "ingreso", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 100, name: "gasto", data: "gasto", render: formatCurrency }
            
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [0, 'asc'],
            fixedColumns: {
                leftColumns: 2
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