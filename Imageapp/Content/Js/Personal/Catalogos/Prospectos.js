var objClsCliente;

//Cargar vista
$(document).ready(function () {
    objClsCliente = new clsCliente();
    objClsCliente.init();
});

const clsCliente = function () {
    //! Variables globales
    const idTable_Principal = "#tblClientes";
    
    const idTable_Contactos = "#tblContactos";    

    const idTable_Seguimiento = "#tblSeguimiento";
    const idTable_Servicios = "#tblServicios";//

    const idMdl_Colums = "#mdlColumns";
    const nameColsStorage = "stColsDt_Prospectos";
    var $frmSolicitud = $("#frmSolicitud");
    var tblPrincipal = new clsDataTable();
    var mdlPrincipal = new mdlClientes();
    
    var tblContactos = new clsDataTable();
    var mdlContactos = new mdlContactosCliente();

    var tblSeguimiento = new clsDataTable();
    var mdlSeguimiento = new mdlSeguimientoCliente();
    var tblServicios = new clsDataTable();//
    var mdlServicio = new mdlServiciosCliente();//
   
    var $frs_id_cliente = $("#frs_id_cliente");   
    var $frs_rfc = $("#frs_rfc");
    var $frs_nombre_razon = $("#frs_nombre_razon");
    var colsPrincipal;
    var listaPermisos = {};

    //! Filtros
    var $fl_nombre = $("#fl_nombre");
    var $fl_rfc = $("#fl_rfc");

    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        configModals();
        await initTables();

        Promise.all([GetCatalogos(), GetPermisos(), GetListaPrincipal()]).then(function (values) {
            initEvents();
            mdlPrincipal.init();            
            mdlContactos.inicio();
            mdlContactos.inicializarValidaciones();
            mdlSeguimiento.inicio();
            mdlSeguimiento.inicializarValidaciones();
            mdlServicio.inicio();//
            mdlServicio.inicializarValidaciones();//
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    async function refresh() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        Promise.all([GetPermisos(), GetListaPrincipal(), GetCatalogos()]).then(function (values) {
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetClientes, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblPrincipal.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                else
                    tblPrincipal.clearRows();

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function getFilterSearch() {
        let filters = {};

        filters.fl_nombre = $fl_nombre.val();
        filters.fl_rfc = $fl_rfc.val();
        

        return filters;
    }

    function clearFilterSearch() {
        $fl_nombre.val("");
        $fl_rfc.val("");
       
    }

    function GetCatalogos() {
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: ""
        });

        return new Promise(function (resolve, reject) {
            //! Peticion de la lista de catalogos
            doAjax("POST", url_Catalogos_GetCatalogos, { jsonJS: arrayCatalogos }).done(function (data) {
                let result = new Result(data);

                if (result.validResult(false, false) && result.resultStoredProcedure.validResultStored()) {
                    initCatalogos(result.resultStoredProcedure.msnSuccess);
                }

                resolve();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function initCatalogos(contenido) {
        
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
            { visible: false, orderable: false, searchable: false, targets: 0, width: 0, name: "id_cliente", data: "id_cliente" },

            
            { visible: true, orderable: true, searchable: true, targets: 1, width: 150, name: "rfc", data: "rfc" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 300, name: "nombre_razon", data: "nombre_razon" },
            
            { visible: true, orderable: true, searchable: true, targets: 3, width: 120, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 200, name: "correo_electronico", data: "correo_electronico" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "telefono", data: "telefono" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "telefono_movil", data: "telefono_movil" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 200, name: "agente", data: "agente" }

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
        

        let columnDefs5 = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 450, name: "nombre_completo_contacto", data: "nombre_completo_contacto" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "tipo_contacto", data: "tipo_contacto" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "telefono_contacto", data: "telefono_contacto" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 200, name: "correo_contacto", data: "correo_contacto" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 250, name: "id_contacto_cliente", data: "id_contacto_cliente" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable5 = {
            columnDefs: columnDefs5,
            idTable: idTable_Contactos
        }

        initDataTable(paramsDataTable5); //! Inicializar datatable
        tblContactos.setTable($(idTable_Contactos).DataTable()); //! Inicializar clase datatable


        let columnDefs6 = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 150, name: "tipo", data: "tipo" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 500, name: "motivo", data: "motivo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 500, name: "respuesta", data: "respuesta" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "agente", data: "agente" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 250, name: "id_seguimiento_cliente", data: "id_seguimiento_cliente" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable6 = {
            columnDefs: columnDefs6,
            idTable: idTable_Seguimiento
        }

        initDataTable(paramsDataTable6); //! Inicializar datatable
        tblSeguimiento.setTable($(idTable_Seguimiento).DataTable()); //! Inicializar clase datatable

        //!Definir columnas
        let columnDefs7 = [
            { visible: true, orderable: false, searchable: false, targets: 0, FormData, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 450, name: "nombre_servicio", data: "nombre_servicio" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "costos", data: "costos", render: formatCurrency  },
            { visible: false, orderable: true, searchable: true, targets: 3, width: 150, name: "ingreso", data: "ingreso" },
            { visible: false, orderable: true, searchable: true, targets: 4, width: 150, name: "numero_trabajadores", data: "numero_trabajadores" },
            { visible: false, orderable: true, searchable: true, targets: 5, width: 200, name: "cantidad", data: "cantidad" },
            { visible: false, orderable: true, searchable: true, targets: 6, width: 250, name: "porcentaje", data: "porcentaje" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 150, name: "iva", data: "iva", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "total", data: "total", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 200, name: "fecha_elaboracion", data: "fecha_elaboracion" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 200, name: "fecha_inicio_servicio", data: "fecha_inicio_servicio" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 200, name: "numero_periodos", data: "numero_periodos" },
            { visible: false, orderable: false, searchable: false, targets: 12, width: 100, name: "id_cliente_servicio", data: "id_cliente_servicio" }
        ];

        let paramsDataTable7 = {
            columnDefs: columnDefs7,
            idTable: idTable_Servicios
        }

        initDataTable(paramsDataTable7);
        tblServicios.setTable($(idTable_Servicios).DataTable());
    }

    function formatCurrency(cantidad) {
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);

        var valor = numberFormat2.format(cantidad);

        return "$" + valor.substring(1);
    }

    function initEvents() {
        let tmpTbl_Principal = tblPrincipal.getTable();

        //! ******Eventos DataTable******//
        $(idTable_Principal + ' tbody').on('click', 'tr', function () {//Evento de seleccion DataTable
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                tmpTbl_Principal.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
            tmpTbl_Principal.fixedColumns().update();
        });
        
        $(idTable_Principal + ' tbody').on('dblclick', 'tr', function () {//Evento de doble clic DataTable
            let tr = $(this);

            if (!$(this).hasClass('selected')) {
                tmpTbl_Principal.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            tmpTbl_Principal.fixedColumns().update();

            isRowSelected("BTN-EDIT", "edit");
        });

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

        //******Eventos botones modal columns******//
        $('#btnModalColsAceptar').on('click', function () {
            colsPrincipal.setConfigColumns();
            $.modal.close();
        });

        $('#btnModalColsRefresh').on('click', function () {
            colsPrincipal.reset();
        });

        //******Eventos de busqueda con filtros******//
        $('#btnClearFilters').on('click', function () {
            clearFilterSearch();
        });

        $('#btnSearchWFilter').on('click', function () {
            GetListaPrincipal(true, true);
        });

        $("#close-sidebar").on('click', async function () {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
        });


        

        $('#btnCloseMdlContactos').on('click', function () { //Evento boton cerrar [modal] Actividades
            mdlContactos.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlContactos').on('click', function (e) { //Evento boton aceptar [modal] Actividades 
            mdlContactos.enviarStoredProcedure();
        });

        $('#btnCloseMdlSeguimiento').on('click', function () { //Evento boton cerrar [modal] Actividades
            mdlSeguimiento.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlSeguimiento').on('click', function (e) { //Evento boton aceptar [modal] Actividades 
            mdlSeguimiento.enviarStoredProcedure();
        });

        //
        $('#btnCloseMdlServicios').on('click', function () { //Evento boton cerrar [modal] Servicios
            mdlServicio.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlServicios').on('click', function (e) { //Evento boton aceptar [modal] Actividades
            mdlServicio.enviarStoredProcedure();
        });
        //
    }



    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        $('#BTN-NEW').on('click', function () {
            mdlPrincipal.eventModal(enumEventosModal.NUEVO);
            mdlPrincipal.mostrarModal();
        });

        $('#BTN-EDIT').on('click', function () {
            isRowSelected("BTN-EDIT", enumEventosModal.EDITAR);
        });
       

        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $('#BTN-COLS').on('click', function () {
            $(idMdl_Colums).modal();
        });


        $('#BTN-CONTACTOS').on('click', function () {

            let tmpTbl_Principal = tblPrincipal.getTable();
            let rowSelected = tmpTbl_Principal.$('tr.selected');
            if (rowSelected.length <= 0)
                return jsSimpleAlert("Alerta", "No ha seleccionado una fila", "orange");
            tblPrincipal.setRowSelected(rowSelected);
            mdlContactos.setTipoEvento("BTN-CONTACTOS");
            mdlContactos.mostrarModal();
        });

        $('#BTN-SEGUIMIENTO').on('click', function () {

            let tmpTbl_Principal = tblPrincipal.getTable();
            let rowSelected = tmpTbl_Principal.$('tr.selected');
            if (rowSelected.length <= 0)
                return jsSimpleAlert("Alerta", "No ha seleccionado una fila", "orange");
            tblPrincipal.setRowSelected(rowSelected);
            mdlSeguimiento.setTipoEvento("BTN-SEGUIMIENTO");
            mdlSeguimiento.mostrarModal();
        });

        //
        $('#BTN-SERVICIO').on('click', function () {

            let tmpTbl_Principal = tblPrincipal.getTable();
            let rowSelected = tmpTbl_Principal.$('tr.selected');
            if (rowSelected.length <= 0)
                return jsSimpleAlert("Alerta", "No ha seleccionado una fila", "orange");
            tblPrincipal.setRowSelected(rowSelected);
            mdlServicio.setTipoEvento("BTN-SERVICIO");
            mdlServicio.mostrarModal();
        });
        //

        setParamsDatePicker();
    }

    function isRowSelected(button, event) {
        let tmpTbl_Principal = tblPrincipal.getTable();
        let rowSelected = tmpTbl_Principal.$('tr.selected');

        if (rowSelected.length <= 0)
            return jsSimpleAlert("Alerta", "No ha seleccionado una fila", "orange");

        if (!listaPermisos.hasOwnProperty(button))
            return jsSimpleAlert("Alerta", "No tiene permiso para realizar esta acción", "orange");
        
        tblPrincipal.setRowSelected(rowSelected);

        if (event != enumEventoPermisos.REGIMEN) {
            
            mdlPrincipal.eventModal(event);
            mdlPrincipal.mostrarModal();
        } else {
            $frs_id_cliente.val(tblPrincipal.getRowSelected().id_cliente);
            $frs_id_regimen.val(tblPrincipal.getRowSelected().id_regimen);
            $frs_rfc.val(tblPrincipal.getRowSelected().rfc);
            $frs_nombre_razon.val(tblPrincipal.getRowSelected().nombre_razon);
            $frmSolicitud.submit();
        }

       
    }

    return {
        init: init,
        mdlPrincipal: mdlPrincipal,
        tblPrincipal: tblPrincipal,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,        
        mdlContactos: mdlContactos,
        tblContactos: tblContactos,
        mdlSeguimiento: mdlSeguimiento,
        tblSeguimiento: tblSeguimiento,
        mdlServicio: mdlServicio,//
        tblServicios: tblServicios
    }
};