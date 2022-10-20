
var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tbl_Entregables";

    var tblPrincipal = new clsDataTable();
    var listaPermisos = {};
    var $txtMes = $("#fr_mesEntregable");
    var $txtPeriodo = $("#fr_periodoEntregable");

    var $txtDescripcion = $("#fr_descripcionEstadoCuenta");
    var $txtArchivo = $("#fr_urlArchivoEstadoCuenta");    
    var $selectEntregable = $("#fr_estado_cuenta");




    $txtMes.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select ;
        tblPrincipal.table.search(texto, true,false).draw();

    });

    $txtPeriodo.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select ;
        tblPrincipal.table.search(texto,true,false).draw();

    });
    switch (Number(id_regimen)) {
        case 1:
            
            $("#fr_mesEntregable").html('<option value="1">ENERO</option>' +
                '<option value="2">FEBRERO</option>' +
                '<option value="3">MARZO</option>' +
                '<option value="4">ABRIL</option>' +
                '<option value="5">MAYO</option>' +
                '<option value="6">JUNIO</option>' +
                '<option value="7">JULIO</option>' +
                '<option value="8">AGOSTO</option>' +
                '<option value="9">SEPTIEMBRE</option>' +
                '<option value="10">OCTUBRE</option>' +
                '<option value="11">NOVIEMBRE</option>' +
                '<option value="12">DICIEMBRE</option>');
            break;
        case 2:
            
            $("#fr_mesEntregable").html('<option value="1">ENERO</option>' +
                '<option value="2">FEBRERO</option>' +
                '<option value="3">MARZO</option>' +
                '<option value="4">ABRIL</option>' +
                '<option value="5">MAYO</option>' +
                '<option value="6">JUNIO</option>' +
                '<option value="7">JULIO</option>' +
                '<option value="8">AGOSTO</option>' +
                '<option value="9">SEPTIEMBRE</option>' +
                '<option value="10">OCTUBRE</option>' +
                '<option value="11">NOVIEMBRE</option>' +
                '<option value="12">DICIEMBRE</option>');
            break;
        case 3:
            
            $("#fr_mesEntregable").html('<option value="1">ENERO</option>' +
                '<option value="2">FEBRERO</option>' +
                '<option value="3">MARZO</option>' +
                '<option value="4">ABRIL</option>' +
                '<option value="5">MAYO</option>' +
                '<option value="6">JUNIO</option>' +
                '<option value="7">JULIO</option>' +
                '<option value="8">AGOSTO</option>' +
                '<option value="9">SEPTIEMBRE</option>' +
                '<option value="10">OCTUBRE</option>' +
                '<option value="11">NOVIEMBRE</option>' +
                '<option value="12">DICIEMBRE</option>');
            break;
        case 4:
            
            $("#fr_mesEntregable").html('<option value="1">ENERO</option>' +
                '<option value="2">FEBRERO</option>' +
                '<option value="3">MARZO</option>' +
                '<option value="4">ABRIL</option>' +
                '<option value="5">MAYO</option>' +
                '<option value="6">JUNIO</option>' +
                '<option value="7">JULIO</option>' +
                '<option value="8">AGOSTO</option>' +
                '<option value="9">SEPTIEMBRE</option>' +
                '<option value="10">OCTUBRE</option>' +
                '<option value="11">NOVIEMBRE</option>' +
                '<option value="12">DICIEMBRE</option>');
            break;
        case 5:
            
            $("#fr_mesEntregable").html('<option value="1">ENERO</option>' +
                '<option value="2">FEBRERO</option>' +
                '<option value="3">MARZO</option>' +
                '<option value="4">ABRIL</option>' +
                '<option value="5">MAYO</option>' +
                '<option value="6">JUNIO</option>' +
                '<option value="7">JULIO</option>' +
                '<option value="8">AGOSTO</option>' +
                '<option value="9">SEPTIEMBRE</option>' +
                '<option value="10">OCTUBRE</option>' +
                '<option value="11">NOVIEMBRE</option>' +
                '<option value="12">DICIEMBRE</option>');
            break;
        case 6:

            $("#fr_mesEntregable").html('<option value="1">ENERO</option>' +
                '<option value="2">FEBRERO</option>' +
                '<option value="3">MARZO</option>' +
                '<option value="4">ABRIL</option>' +
                '<option value="5">MAYO</option>' +
                '<option value="6">JUNIO</option>' +
                '<option value="7">JULIO</option>' +
                '<option value="8">AGOSTO</option>' +
                '<option value="9">SEPTIEMBRE</option>' +
                '<option value="10">OCTUBRE</option>' +
                '<option value="11">NOVIEMBRE</option>' +
                '<option value="12">DICIEMBRE</option>');
            break;
    }


    let month = moment().format('M');
    $txtMes.val(month);

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
            doAjax("POST", url_Cliente_GetEdoCuenta, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);
                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        if (item.url_archivo != "") {


                            var extension = item.nombre_archivo.split('.');
                            item.acciones = "";

                            if (item.nombre_archivo != '') {

                                if (extension[1] == "pdf") {
                                    item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" target="_blank"  class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                                }
                                else {
                                    item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download="' + item.estado_cuenta + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                                }
                            }

                            item.acciones += '<a href="#" onclick="objClsCliente.eliminar(' + item.id_estado_cuenta + ',\'' + item.url_archivo + '\',\'' + item.nombre_archivo + '\',true)" class="btn btn-style btn-danger" title="eliminar archivo"><i class="fa fa-trash"></i ></a>';
                            
                        }
                        else {
                            item.acciones = "";
                        }
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        //item.acciones += '<a href="#" onclick="objClsCliente.getXML(\'' + item.uuid + '\',\'' + item.url_xml + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';
                    });
                    tblPrincipal.addRows(contenido, true, true, forzeDraw);
                }
                else {
                    tblPrincipal.clearRows();
                }

                let month = moment().format('M');
                $txtMes.val(month);

                var periodo_select = $txtPeriodo.val();
                var mes_select = $txtMes.children("option:selected").text();
                var texto = periodo_select + "/" + mes_select;
                tblPrincipal.table.search(texto, true,false).draw();
                resolve();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function eliminar(id_estado_cuenta, url_archivo, nombre_archivo, showWait = false) {


        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                    
                    var objSend = JSON.stringify({ id_estado_cuenta: id_estado_cuenta, nombre_archivo: nombre_archivo, url_archivo: url_archivo, id_cliente: data_rfc });
                    doAjax("POST", url_Catalogos_EliminarEstadoCuenta, { jsonJS: objSend, id_RV: id_RV }, showWait).done(function (data) {
                        let result = new Result(data);

                        //! Si tiene registros
                        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
                            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
                            GetListaPrincipal(true);

                        }

                    });
                },
                CANCELAR: function () {

                }
            }
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
            { visible: true, orderable: true, searchable: true, targets: 0, width: '40%', name: "estado_cuenta", data: "estado_cuenta" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: '15%', name: "descripcion", data: "descripcion" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '15%', name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: '15%', name: "fecha_carga", data: "fecha_carga" },
            { visible: true, orderable: false, searchable: false, targets: 4, width: '15%', name: "acciones", data: "acciones" },
            { visible: false, orderable: false, searchable: false, targets:5, width: '0%', name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: '0%', name: "url_archivo", data: "url_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: '0%', name: "id_estado_cuenta", data: "id_estado_cuenta" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: '0%', name: "id_cliente", data: "id_cliente" },
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [0, 'asc'],
            descLength: {
                arrayTotal :[-1],
                arrayDes :["Todas"]
            }
        }
        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable


        
    }

    function initEvents() {

    }    

    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $("#close-sidebar").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
        });       

        $("#btnCargar").on('click', async function (a) {
            var frmData = new FormData();
            objSendStored = {};
            objSendStored.rfc = data_rfc;
            objSendStored.descripcion = '';
            objSendStored.mes = $txtMes.val();
            objSendStored.periodo = $txtPeriodo.val();
            objSendStored.estado_cuenta = $selectEntregable.val();
            objSendStored.descripcion = $txtDescripcion.val();


            if (objSendStored.estado_cuenta != "") {


                    if ($txtArchivo[0].files.length == 0) {

                        return jsSimpleAlert("Alerta","Debe seleccionar un archivo.");

                    }


                frmData.append('url_archivo', $txtArchivo.val() != "" ? $txtArchivo[0].files[0] : "");
                frmData.append('jsonJS', JSON.stringify(objSendStored));
                frmData.append('id_RV', id_RV);

                let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
                $msnWait.open();

                $.ajax({
                    type: "POST",
                    url: url_Catalogos_AddEstadoCuenta,
                    contentType: false,
                    processData: false,
                    data: frmData
                })
                    .done(function (data) {
                        let result = new Result(data);

                        //! Si tiene registros
                        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {

                            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
                            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
                            finalizarStoredProcedure(data);
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) { jsSimpleAlert("Error", errorThrown); })
                    .always(function () { $msnWait.close() });
            }

        });       

    }

    async function finalizarStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
            GetListaPrincipal(true);
            //clearData();
            //! INTEGRAR REGISTRO AL SERVIDOR PRINCIPAL
            //IntegrarAlServidor(url_Integracion_SetIntegracion_Servidor, result.resultStoredProcedure.newGuid);
        }
    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        eliminar: eliminar
    }
};
