
var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const id_Table_Repositorio = "#tblRepositorio";

    var tblRepositorio = new clsDataTable();
    var listaPermisos = {};
    var listaDocumentos = null;
    
    var $txtArchivo = $("#fr_urlArchivo");
    var $txtDocumento = $("#fr_repositorio");
    var $txtCategoria = $("#fr_tipo_repositorio");

    $txtCategoria.change(function () {
        var categoria_select = $txtCategoria.children("option:selected").text();
        tblRepositorio.table.search(categoria_select).draw();
        
    });

    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        await initTables();

        Promise.all([GetPermisos(), GetListaPrincipal(), GetDocumentosDigitales()]).then(function (values) {
            initEvents();

            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    async function refresh() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        Promise.all([GetPermisos(), GetListaPrincipal(), GetDocumentosDigitales()]).then(function (values) {
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        let objSend = JSON.stringify({ rfc: data_rfc });

        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Cliente_GetDocumentos, { jsonJS: objSend, id_RV: id_RV }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {
                    var extension = item.nombre_archivo.split('.');
                    item.acciones = "";

                    if (item.nombre_archivo != '') {

                        if (extension[1] == "pdf") {
                            item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" target="_blank" download="' + item.repositorio + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                        }
                        else {
                            item.acciones = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download="' + item.repositorio + '.' + extension[1] + '" class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                        }
                    }
                    //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                    //item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlSecundario.eliminar(' + item.id_repositorio + ',\'' + item.url_archivo + '\',\'' + item.nombre_archivo + '\',true)" class="btn btn-style btn-danger" title="eliminar archivo"><i class="fa fa-trash"></i ></a>';
                });
                tblRepositorio.addRows(contenido);
                var categoria_select = $txtCategoria.children("option:selected").text();
                tblRepositorio.table.search(categoria_select).draw();
            }
            tblRepositorio.adjustColumns();
        });
    }

    function GetDocumentosDigitales(showWait = false) {
        
        let objSend = JSON.stringify({ id_regimen: id_regimen });
        


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetDocumentosDigitales, { jsonJS: objSend, id_RV: id_RV }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                listaDocumentos = result.resultStoredProcedure.msnSuccess;

                
                
                if (listaDocumentos.length > 0) {
                    var strOption = "";
                    for (var i = 0; i < listaDocumentos.length; i++) {
                        var item = listaDocumentos[i];
                        if (item.id_tipo_repositorio == 1) {
                            strOption += "<option value='" + item.id_lista_repositorio + "'>" + item.repositorio + "</option>";
                        }
                    }

                    for (var i = 0; i < listaDocumentos.length; i++) {
                        var item = listaDocumentos[i];
                        if (item.id_tipo_repositorio == 4) {
                            strOption += "<option value='" + item.id_lista_repositorio + "'>" + item.repositorio + "</option>";
                        }
                    }


                    $txtDocumento.html(strOption);
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
        let columnDefsRepo = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: "15%", name: "acciones", data: "acciones" },

            { visible: true, orderable: true, searchable: true, targets: 1, width: 300, name: "repositorio", data: "repositorio" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 200, name: "tipo_repositorio", data: "tipo_repositorio" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "fecha_vigencia", data: "fecha_vigencia" },

            { visible: true, orderable: true, searchable: true, targets: 4, width: "70%", name: "descripcion", data: "descripcion" },
            { visible: false, orderable: false, searchable: false, targets: 5, width: 250, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: "15%", name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 150, name: "url_archivo", data: "url_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 10, width: 300, name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 11, width: 250, name: "id_repositorio", data: "id_repositorio" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableRepo = {
            columnDefs: columnDefsRepo,
            idTable: id_Table_Repositorio,
            fixedColumns: null,
            order: [1, "asc"],
            descLength: {
                arrayTotal: [-1],
                arrayDes: ["Todas"]
            }

        }

        initDataTable(paramsDataTableRepo);
        tblRepositorio.setTable($(id_Table_Repositorio).DataTable());

    }

    function initEvents() {
        

        $('#btnAceptarMdlRepo').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            var frmData = new FormData();           
            var objSendStored = {};
            objSendStored.rfc = data_rfc;
            objSendStored.id_lista_repositorio = $txtDocumento.val();
            objSendStored.descripcion = '';
            frmData.append('url_archivo', $txtArchivo.val() != "" ? $txtArchivo[0].files[0] : "");
            frmData.append('jsonJS', JSON.stringify(objSendStored));
            frmData.append('id_RV', id_RV);

            let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
            $msnWait.open();

            $.ajax({
                type: "POST",
                url: url_Catalogos_AddRepositorio,
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

    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });
    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal
    }
};
