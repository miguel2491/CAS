
var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const id_Table_Repositorio = "#tblRepositorio";
    var $formRepositorioNomina = $("#frmRepositorioNomina");
    var tblRepositorio = new clsDataTable();
    var listaPermisos = {};

    var $txtDescripcionNomina = $("#fr_descripcionNomina"); //la descripcion del modal 
    var $txtArchivoNomina = $("#fr_urlArchivoNomina");
    var $txtEntregable = $("#fr_entregable_nomina");
    var $txtPeriodicidad = $("#fr_periodicidad_nomina");
    var $txtCategoria = $("#fr_tipo_nomina");

    var listaDocumentos = null;

    var $txtMes = $("#fr_mesEntregableNomina");
    var $txtPeriodo = $("#fr_periodoEntregableNomina");
    $txtMes.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select;
        tblRepositorio.table.search(texto).draw();

    });

    $txtPeriodo.change(function () {
        var periodo_select = $txtPeriodo.val();
        var mes_select = $txtMes.children("option:selected").text();
        var texto = periodo_select + "/" + mes_select;
        tblRepositorio.table.search(texto).draw();

    });

    $txtCategoria.change(function () {
        //var categoria_select = $txtCategoria.children("option:selected").text();
        //objClsClienteRIF.tblRepositorio.table.search(categoria_select).draw();


        var id_categoria = $txtCategoria.val();
        if (listaDocumentos.length > 0) {
            var strOption = "";
            for (var i = 0; i < listaDocumentos.length; i++) {
                var item = listaDocumentos[i];
                if (item.id_tipo_nomina_entregable == id_categoria) {
                    strOption += "<option value='" + item.id_lista_entregable_nomina + "'>" + item.entregable + "</option>";
                }
            }
            $txtEntregable.html(strOption);
        }
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
            inicializarValidaciones();
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
        let objSend = JSON.stringify({ rfc: data_rfc });

        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Cliente_GetDocumentos, { jsonJS: objSend, id_RV: id_RV }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                let contenido = result.resultStoredProcedure.msnSuccess;
                contenido.forEach(function (item) {
                    var boton = ''
                    if (item.nombre_archivo != '')
                        boton = '<a href="' + item.subraizIIS + item.url_archivo + item.nombre_archivo + '" download class="btn btn-style btn-info "><i class="fa fa-download"></i ></a> ';
                    item.acciones = boton;
                    //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                    //item.acciones += '<a href="#" onclick="objClsClienteRIF.mdlSecundario.eliminar(' + item.id_repositorio + ',\'' + item.url_archivo + '\',\'' + item.nombre_archivo + '\',true)" class="btn btn-style btn-danger" title="eliminar archivo"><i class="fa fa-trash"></i ></a>';
                });
                tblRepositorio.addRows(contenido);

                var periodo_select = $txtPeriodo.val();
                var mes_select = $txtMes.children("option:selected").text();
                var texto = periodo_select + "/" + mes_select;
                tblRepositorio.table.search(texto).draw();

            }
            tblRepositorio.adjustColumns();

            GetDocumentosNomina(false);
        });
    }

    function GetDocumentosNomina(showWait = false) {

        let objSend = JSON.stringify({});
        let id_RVA = 0;


        //Peticion de la lista de registros para Repositorio Pacientes
        doAjax("POST", url_Catalogos_GetDocumentosNomina, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
            let result = new Result(data);

            //! Si tiene registros
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                listaDocumentos = result.resultStoredProcedure.msnSuccess;

                var periodo_select = $txtPeriodo.val();
                var mes_select = $txtMes.children("option:selected").text();
                var texto = periodo_select + "/" + mes_select;
                tblRepositorio.table.search(texto).draw();

                var id_categoria = $txtCategoria.val();
                if (listaDocumentos.length > 0) {
                    var strOption = "";
                    for (var i = 0; i < listaDocumentos.length; i++) {
                        var item = listaDocumentos[i];
                        if (item.id_tipo_nomina_entregable == id_categoria) {
                            strOption += "<option value='" + item.id_lista_entregable_nomina + "'>" + item.entregable + "</option>";
                        }
                    }
                    $txtEntregable.html(strOption);
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
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 200, name: "categoria", data: "categoria" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 200, name: "entregable", data: "entregable" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 120, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 120, name: "periodicidad", data: "periodicidad" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 200, name: "observacion", data: "observacion" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 200, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 200, name: "usuario_creo", data: "usuario_creo" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 250, name: "fecha_carga", data: "fecha_carga" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 10, width: 150, name: "url_archivo", data: "url_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 11, width: 300, name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 12, width: 250, name: "id_entregable_nomina_RFC", data: "id_entregable_nomina_RFC" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableRepo = {
            columnDefs: columnDefsRepo,
            idTable: id_Table_Repositorio,
            fixedColumns: null,
            order: [4, "desc"]

        }

        initDataTable(paramsDataTableRepo);
        tblRepositorio.setTable($(id_Table_Repositorio).DataTable());

    }

    function initEvents() {
        $('#btnCloseMdlRepo').on('click', function () { //Evento boton cerrar [modal] Repositorio
            confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlRepo').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            enviarStoredProcedure();
        });
    }

    function enviarStoredProcedure() {
        let objSend = {};
        //! Valildar formulario

        if (!$formRepositorioNomina.valid())
            return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");

        //! Objeto JSON
        objSend = getDatosFomulario();


        storedAdd(JSON.stringify(objSend));

    }

    //! Peticion para agregar registro
    function storedAdd(objSend) {
        var frmData = new FormData();
        let id_RVA = 0;



        frmData.append('url_archivo', $txtArchivoNomina.val() != "" ? $txtArchivoNomina[0].files[0] : "");
        frmData.append('jsonJS', objSend);
        frmData.append('id_RV', id_RV);
        frmData.append('id_RVA', id_RVA);

        let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
        $msnWait.open();

        $.ajax({
            type: "POST",
            url: url_Catalogos_AddRepositorioNomina,
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
    function getDatosFomulario() {
        let objSendStored = {};
        //let id_paciente = objClsPacientes.tblPrincipal.getRowSelected().id_paciente;

        objSendStored.id_cliente = data_rfc;
        objSendStored.observaciones = $txtDescripcionNomina.val();
        objSendStored.mes = $txtMes.val();
        objSendStored.periodo = $txtPeriodo.val();
        objSendStored.id_lista_entregable_nomina = $txtEntregable.val();
        objSendStored.periodicidad = $txtPeriodicidad.val();
        objSendStored.id_regimen = 0;

        return objSendStored;
    }
    //! Tratar resultado del stored procedure
    async function finalizarStoredProcedure(data) {
        let result = new Result(data);

        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            //resetearModal();
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

    function inicializarValidaciones() {
        let principalForm = {};
        //! Setear reglas del formulario
        principalForm = {
            rules: {

                fr_urlArchivoNomina: "required"
            },
            messages: {

                fr_urlArchivoNomina: "Favor de cargar archivo"
            }
        }
        $formRepositorioNomina.validate(principalForm);
    }

    return {
        init: init,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        enviarStoredProcedure: enviarStoredProcedure,
    }
};
