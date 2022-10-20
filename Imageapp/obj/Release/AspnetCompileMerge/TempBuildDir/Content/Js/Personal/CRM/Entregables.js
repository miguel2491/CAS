
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
    $txtMes.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL";
        tblPrincipal.table.search(texto, true,false).draw();

    });

    $txtPeriodo.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL";
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
            doAjax("POST", url_Cliente_GetEntregables, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
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
                                    item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download="' + item.entregable + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                                }
                            }
                            
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
                var periodo_select = $txtPeriodo.val();
                var mes_select = $txtMes.children("option:selected").text();
                var texto = periodo_select + "/" + mes_select + "|" + periodo_select + "/ANUAL";
                tblPrincipal.table.search(texto, true,false).draw();
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
            { visible: true, orderable: true, searchable: true, targets: 0, width: '50%', name: "entregable", data: "entregable" },
            { visible: false, orderable: false, searchable: false, targets: 1, width: '0%', name: "descripcion", data: "descripcion" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '30%', name: "fecha", data: "fecha" },
            { visible: true, orderable: false, searchable: false, targets: 3, width: '20%', name: "acciones", data: "acciones" },
            { visible: false, orderable: false, searchable: false, targets: 4, width: '0%', name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 4, width: '0%', name: "url_archivo", data: "url_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 4, width: '0%', name: "id_entregable_rfc", data: "id_entregable_rfc" },
            { visible: false, orderable: false, searchable: false, targets: 5, width: '0%', name: "id_cliente", data: "id_cliente" },
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


        $("#btnGenerarZip").on('click', function () {



            var lista = tblPrincipal.getTable().rows({ filter: 'applied' }).data();

            if (lista.length == 0) {
                return jsSimpleAlert("Alerta", "No se encontraron registros.");
            }



            var modal = jsSimpleAlertReturn("Cargando", "Comprimiendo archivos...");

            modal.open();

            var zip = new JSZip();
            var img = zip.folder("Entregables");

            var peticiones = [];

            for (var i = 0; i < lista.length; i++) {
                var item = lista[i];
                var url = item.subraizIIS + item.url_archivo + item.nombre_archivo;

                if (item.nombre_archivo != '') {
                    peticiones.push(new Promise((resolve, reject) => {
                        var extension = item.nombre_archivo.split('.');
                        let nombre = item.entregable + " " + item.fecha.replace('/','-') + "." + extension[1];
                        var request = new XMLHttpRequest();
                        request.open('GET', url, true);
                        request.responseType = 'blob';
                        request.onload = function () {
                            var reader = new FileReader();
                            reader.readAsDataURL(request.response);
                            reader.onload = function (e) {
                                
                                var blob = e.target.result.split(',')[1];
                                img.file(nombre, blob, { base64: true });
                                resolve();
                            };
                        };
                        request.send();
                    }));
                }
            }


            Promise.all(peticiones).then(values => {
                zip.generateAsync({ type: "blob" })
                    .then(function (content) {
                        // see FileSaver.js
                        saveAs(content, "Entregables.zip");
                        modal.close();
                    });
            });



           


            

            
        });

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



    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal
    }
};
