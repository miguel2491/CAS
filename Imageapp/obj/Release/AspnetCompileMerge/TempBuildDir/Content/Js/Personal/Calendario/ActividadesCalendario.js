var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tblActividades";
    const nameColsStorage = "stColsDt_Actividades";
    var tblPrincipal = new clsDataTable();
    var mdlPrincipal = new mdlClientes();
    
    var colsPrincipal;
    var listaPermisos = {};
        

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
            mdlPrincipal.init();
            
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
        let filtersSearch = JSON.stringify({});

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetActividadesCalendario, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {

                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.acciones = '';
                        //item.acciones = '<a href="#" onclick="objClsCliente.eliminar(' + item.id_formato + ',true)" class="btn btn-style btn-danger" title="eliminar formato"><i class="fa fa-trash"></i ></a>';
                    });


                    tblPrincipal.addRows(contenido, true, true, forzeDraw);
                }
                else
                    tblPrincipal.clearRows();

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function eliminar(id_formato, showWait = false) {

        $.confirm({
            theme: 'modern',
            type: "red",
            title: "Alerta",
            content: "¿Desea eliminar este elemento?",
            buttons: {
                SI: function () {
                        let id_RVA = objClsCliente.getlistaPermisos()["BTN-NEW"].id_RVA;
                                var objSend = JSON.stringify({ id_formato: id_formato });
                                doAjax("POST", url_Catalogos_DeleteFormato, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, showWait).done(function (data) {
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
            doAjax("POST", url_Catalogos_GetPermisos, { id_RV: id_RV }).done(function (data) {
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
            { visible: true, orderable: true, searchable: true, targets: 1, width: 100, name: "paso", data: "paso" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "linea", data: "linea" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "area", data: "area" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 500, name: "actividad", data: "actividad" },
            { visible: false, orderable: false, searchable: false, targets: 5, width: 250, name: "id_lineas_produccion", data: "id_lineas_produccion" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 150, name: "id_actividad_calendario", data: "id_actividad_calendario" }
            
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal
        }

        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        colsPrincipal = new clsColumns($(idTable_Principal).DataTable(), nameColsStorage);//! Inicializar clase columnas
        colsPrincipal.init(); //! Init config

        
    }

    function initEvents() {
        let tmpTbl_Principal = tblPrincipal.getTable();

                

        //! ******Eventos botones modal******//

        //Evento de [cerrar] modal de la entidad
        $('#btnCloseMdl').on('click', function () {
            mdlPrincipal.confirmModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        //Evento de [aceptar] modal de la entidad
        $('#btnAceptarMdl').on('click', function (e) {

            let eventType = mdlPrincipal.getTypeEvent();

            if (eventType == "delete") {
                mdlPrincipal.confirmModal({ eventButton: "eliminar", title: "Confirma!", message: "¿Segúro que deséa eliminar el registro?" });
            }
            else if (eventType == "create" || eventType == "edit") {
                mdlPrincipal.sendToStored();
            }
        });

        

        $("#close-sidebar").on('click', async function () {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
        });


        
    }



    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-NEW').on('click', function () {
            mdlPrincipal.eventModal(enumEventosModal.NUEVO);
            mdlPrincipal.mostrarModal();
        });

        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });
    }

    

    return {
        init: init,
        mdlPrincipal: mdlPrincipal,
        tblPrincipal: tblPrincipal,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        eliminar: eliminar
    }
};