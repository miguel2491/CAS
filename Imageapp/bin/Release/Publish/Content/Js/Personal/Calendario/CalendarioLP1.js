
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

    var listaCalendario = [];

    var $periodo = $("#fl_periodo");
    var $mes = $("#fl_mes");


    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        await initTables(null, null);

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

    function getDaysInMonth(month, year) {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.mes = $mes.val();
        filter.periodo = $periodo.val();
        let filtersSearch = JSON.stringify(filter);

        var dias = getDaysInMonth(Number($mes.val()) - 1, Number($periodo.val()));

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetCalendarioLP1, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);



                var datos_reportes;



                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {

                    datos_reportes = result.resultStoredProcedure.msnSuccess;



                    //tblPrincipal.addRows(datos_reportes);
                }

                initTables(dias, datos_reportes);


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

    function initTables(data, reporte) {
        //! Definir columnas


        var columnDefs;
        var lista;
        if (data == null) {
            columnDefs = [
                { visible: false, orderable: false, searchable: false, targets: 0, width: 150, name: "id_actividad_calendario", data: "id_actividad_calendario" },
                { visible: true, orderable: true, searchable: true, targets: 1, width: 45, name: "paso", data: "paso" },
                { visible: true, orderable: true, searchable: true, targets: 2, width: 100, name: "area", data: "area" },
                { visible: true, orderable: true, searchable: true, targets: 3, width: 200, name: "actividad", data: "actividad" },

            ];

        }

        else {

            $(idTable_Principal).DataTable().clear().destroy();

            columnDefs = [];
            columnDefs.push({ visible: false, orderable: false, searchable: false, targets: 0, width: 150, name: "id_actividad_calendario", data: "id_actividad_calendario" },);
            columnDefs.push({ visible: true, orderable: true, searchable: true, targets: 1, width: 45, name: "paso", data: "paso" });
            columnDefs.push({ visible: true, orderable: true, searchable: true, targets: 2, width: 100, name: "area", data: "area" });
            columnDefs.push({ visible: true, orderable: true, searchable: true, targets: 3, width: 200, name: "actividad", data: "actividad" });
            var $headers = $("#headers");
            $headers.html("<td>id</td><td>Num</td><td>Área</td><td>Actividad</td>");
            lista = [
                { id_actividad_calendario: 1, paso: "1", area: "PROCESO CONTABLE", actividad: "SOLICITUD DE DESCARGA DE LIQUIDACIONES IDSE" },
                { id_actividad_calendario: 2, paso: "2", area: "PROCESO CONTABLE", actividad: "DESCARGA DE LIQUIDACIÓN DE IDSE COLOCAR EN CARPETA DEL CLIENTE" },
                { id_actividad_calendario: 3, paso: "3", area: "PROCESO CONTABLE", actividad: "PROCESO PROVISIÓN NÓMINA Y ASIMILADOS EN COI TODOS LOS QUE TENGAN IMSS" },
                { id_actividad_calendario: 4, paso: "4", area: "PROCESO CONTABLE", actividad: "CONCILIACION REPORTE NOMINA DE SUELDOS Y SALARIOS EN BALANZA COI, VS TIMBRADO SAT, EMITIR REPORTE DE REVISION" },
                { id_actividad_calendario: 5, paso: "5", area: "PROCESO CONTABLE", actividad: "PROCESO PROVISIÓN IMPUESTOS DE NÓMINA PM,PFAE  EN COI" },
                { id_actividad_calendario: 6, paso: "6", area: "PROCESO CONTABLE", actividad: "PRESENTACION DE DECLARACIONES EN CEROS  EMPRESAS ASIGNADAS" },
                { id_actividad_calendario: 7, paso: "7", area: "PROCESO CONTABLE", actividad: "SUBIR CARPETA DIGITAL DECLARACIONES EN CEROS" },
                { id_actividad_calendario: 8, paso: "1", area: "ACTIVIDADES DE APOYO", actividad: "IMPRESIÓN DE CEDULAS FISCALES , OPINIONES DE CUMPLIMIENTO , REALIZAR ACTUALIZACION AL RFC SOLICITADAS" },
                { id_actividad_calendario: 9, paso: "2", area: "ACTIVIDADES DE APOYO", actividad: "SUBIR  ENTREGABLES AL ERP DE CASTELAN . (15 PUNTOS ) DE FORMA DIGITAL " },
                { id_actividad_calendario: 10, paso: "3", area: "ACTIVIDADES DE APOYO", actividad: "SOLICITUD DE OPINIÓN DE CUMPLIMIENTO, ELABORACIÓN DE LISTAS Y ARCHIVAR EN CARPETA CORRESPONDIENTE" },
                { id_actividad_calendario: 11, paso: "4", area: "ACTIVIDADES DE APOYO", actividad: "REVISION PAGOS IMPUESTOS CLIENTES " }

            ];

            var weekdays = new Array(7);
            weekdays[0] = "Dom";
            weekdays[1] = "Lun";
            weekdays[2] = "Mar";
            weekdays[3] = "Mie";
            weekdays[4] = "Jue";
            weekdays[5] = "Vie";
            weekdays[6] = "Sab";
            var indice = 4;
            for (var i = 0; i < data.length; i++) {
                if (data[i].getDay() != 0) {
                    $headers.append("<td>" + weekdays[data[i].getDay()] + " " + data[i].getDate().toString() + "</td>");
                    columnDefs.push({ visible: true, orderable: true, searchable: true, targets: indice, width: 30, name: "act_" + data[i].getDate().toString(), data: "act_" + data[i].getDate().toString(), render: renderBadgeEstatus});

                    for (var j = 0; j < lista.length; j++) {
                        lista[j]["act_" + data[i].getDate().toString()] = "";
                    }

                    indice++;
                }
            }


            //!Proceso Calendario
            var fecha_hoy = new Date(Date.now());
            var hoy = formatDate(fecha_hoy);


            for (var i = 0; i < lista.length; i++) {
                var actividad = lista[i];
                var mes = $mes.val() - 1;
                var periodo = $periodo.val();

                //!Dias posteriores
                for (var j = 0; j < data.length; j++) {
                    if (data[j].getDay() != 0) {
                        var f = formatDate(data[j]);
                        if (Number(f.split("/")[0] + f.split("/")[1] + f.split("/")[2]) > Number(hoy.split("/")[0] + hoy.split("/")[1] + hoy.split("/")[2])) {
                            actividad["act_" + Number(data[j].getDate())] = "/////|" + actividad.id_actividad_calendario + "|" + f;
                        }
                    }
                }

                //!Dias cumplidos
                if (reporte != null) {
                    var act_bool = false;
                    for (var j = 0; j < reporte.length; j++) {
                        var report = reporte[j]
                        if (actividad.id_actividad_calendario == report.id_actividad_calendario) {
                            var f = formatDate(report.fecha_finalizo);
                            actividad["act_" + Number(report.fecha_finalizo.split('/')[2])] = "√|" + actividad.id_actividad_calendario + "|" + f;
                            act_bool = true;
                        }
                    }
                    //!Dias transcurridos sin cumplir
                    if (act_bool == false) {
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].getDay() != 0) {
                                var f = formatDate(data[j]);
                                if (Number(f.split("/")[0] + f.split("/")[1] + f.split("/")[2]) < Number(hoy.split("/")[0] + hoy.split("/")[1] + hoy.split("/")[2])) {
                                    actividad["act_" + Number(data[j].getDate())] = "X|" + actividad.id_actividad_calendario + "|" + f;
                                }
                            }
                        }
                    }
                }
                else {
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].getDay() != 0) {
                            var f = formatDate(data[j]);
                            if (Number(f.split("/")[0] + f.split("/")[1] + f.split("/")[2]) < Number(hoy.split("/")[0] + hoy.split("/")[1] + hoy.split("/")[2])) {
                                actividad["act_" + Number(data[j].getDate())] = "X|" + actividad.id_actividad_calendario + "|" + f;
                            }
                        }
                    }
                }

            }


        }

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [[2, 'desc'], [1, 'asc']],
            descLength: {
                arrayTotal: [-1],
                arrayDes: ["Todas"]
            },
            fixedColumns: {
                leftColumns: 4
            }
        }
        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        if (data != null) {
            tblPrincipal.addRows(lista);
        }

        function renderBadgeEstatus(data, type, row) {
            if (type == 'display') {
                let color = "";

                var dato = data.split("|")[0];
                var id = data.split("|")[1];
                var fecha = data.split("|")[2];
                var link = "";
                if (dato == "√") {
                    color = "success";
                    link = "<a href='#' onclick=\"objClsCliente.quitarFecha(" + id + ",'"+ fecha +"')\"><h5><span class='badge badge-" + color + "'>" + dato + "</span></h5><a>";
                }
                else if (dato == "/////") {
                    color = "info";
                    link = "<h5><span class='badge badge-" + color + "'>" + dato + "</span></h5>";
                }
                else {
                    color = "danger";
                    link = "<a href='#' onclick=\"objClsCliente.agregarFecha(" + id + ",'" + fecha +"')\"><h5><span class='badge badge-" + color + "'>" + dato + "</span></h5><a>";
                }

                return link;
            } else
                return data;
        }

    }


    function quitarFecha(a,b) {
        var objSend = JSON.stringify({ id: a, fecha: b });
        doAjax("POST", url_Catalogos_QuitarFechaCalendario, { jsonJS: objSend, id_RV: id_RV }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                GetListaPrincipal(true);
            }

        });
    }

    function agregarFecha(a, b) {
        
        var objSend = JSON.stringify({ id: a, fecha: b });
        doAjax("POST", url_Catalogos_AgregarFechaCalendario, { jsonJS: objSend, id_RV: id_RV }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                GetListaPrincipal(true);
            }

        });
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
        tblReporte: tblPrincipal,
        quitarFecha: quitarFecha,
        agregarFecha: agregarFecha
    }
};