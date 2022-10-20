var objClsClienteRIF;

//Cargar vista
$(document).ready(function () {
    objClsClienteRIF = new clsClienteRIF();
    objClsClienteRIF.init();
});

const clsClienteRIF = function () {
    //! Variables globales
    const idTable_Principal = "#tblXMLEmitidos";
    const idTable_Secundario = "#tblXMLRecibidos";
    const id_Table_Repositorio = "#tblRepositorio";
    const id_Table_RepositorioNomina = "#tblRepositorioNomina";
    const id_Table_Entregable = "#tblEntregable";
    const id_Table_OtrosServicios = "#tblOtrosServicios";
    const id_Table_EstadoCuenta = "#tblEstadoCuenta";
    const id_Table_Notificaciones = "#tblNotificaciones";

    //!Tipos CFDI
    const idTable_ingresos = "#tbl-ingresos";
    const idTable_ingresos_sueldos = "#tbl-ingresos-sueldos";
    const idTable_complemento_cobro = "#tbl-complemento-cobro";
    const idTable_ingreso_notas = "#tbl-ingreso-notas";
    const idTable_ingreso_canceladas = "#tbl-ingreso-canceladas";
    const idTable_ingresos_traslado = "#tbl-ingresos-traslado";

    const idTable_gastos = "#tbl-gastos";
    const idTable_gastos_sueldos = "#tbl-gastos-sueldos";
    const idTable_complemento_pago = "#tbl-complemento-pago";
    const idTable_gastos_notas = "#tbl-gastos-notas";
    const idTable_gastos_canceladas = "#tbl-gastos-canceladas";
    const idTable_gastos_traslado = "#tbl-gastos-traslado";

    const idTable_proveedores = "#tbl_Proveedores";
    const idTable_clientes = "#tbl_Clientes";

    var tblIngresos = new clsDataTable();
    var tblIngresosSueldos = new clsDataTable();
    var tblComplementoCobro = new clsDataTable();
    var tblIngresoNotas = new clsDataTable();
    var tblIngresoCanceladas = new clsDataTable();
    var tblIngresosTraslado = new clsDataTable();

    var tblGastos = new clsDataTable();
    var tblGastosSueldos = new clsDataTable();
    var tblComplementoPago = new clsDataTable();
    var tblGastosNotas = new clsDataTable();
    var tblGastosCanceladas = new clsDataTable();
    var tblGastosTraslado = new clsDataTable();

    var tblProveedores = new clsDataTable();
    var tblClientes = new clsDataTable();

    var tblPrincipal = new clsDataTable();
    var tblSecundario = new clsDataTable();
    var tblRepositorio = new clsDataTable();
    var tblRepositorioNomina = new clsDataTable();
    var tblEntregable = new clsDataTable();
    var tblOtrosServicios = new clsDataTable();
    var tblEstadoCuenta = new clsDataTable();
    var tblNotificaciones = new clsDataTable();

    var mdlValidarSATMasivo = new mdlValidarSAT();
    var mdlSecundario = new mdlRepositorio();
    var mdlSecundarioNomina = new mdlRepositorioNomina();
    var mdlEntregablem = new mdlEntregable();
    var mdlOtrosServiciosm = new mdlOtrosServicios();
    var mdlEstadoCuentam = new mdlEstadoCuenta();
    var mdlNotificacionesm = new mdlNotificaciones();
    var listaPermisos = {};


    var $modalCarga = $("#mdlCargar");

    //! Filtros

    var $frmFilterPrincipal = $("#frmFilterPrincipal");

    var $fl_fecha_inicial = $("#fl_fecha_inicial");
    var $fl_fecha_final = $("#fl_fecha_final");
    var $fl_periodo_filtro = $("#fl_periodo_filtro");
    //var $fl_nombre = $("#fl_nombre");
    var $fl_rfc = $("#fl_rfc");
    //var $fl_ddlRegimen = $("#fl_ddlRegimen");

    var rfc = $fl_rfc.val();

    //!Descarga
    var $btnDescarga = $("#btnDescargarXML");

    var $fr_entregable = $("#fr_entregable");

    var xmlSelect = "XML Emitidos";


    if (id_regimen == 5) {
        $("#pills-ingresos-sueldos-tab").hide();
        $("#pills-ingresos-sueldos").hide();

    }


    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        GetCliente();
        GetListaProveedores();
        GetListaClientes();
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();
        $fl_fecha_inicial.val(moment().format("YYYY-MM-DD"));
        $fl_fecha_final.val(moment().format("YYYY-MM-DD"));
        configModals();
        validaciones();
        await initTables();

        Promise.all([GetCatalogos(), GetPermisos(), GetListaPrincipal(), GetListaSecundario()]).then(function (values) {
            initEvents();
            mdlSecundario.inicializarValidaciones();
            mdlSecundario.inicio();

            mdlSecundarioNomina.inicializarValidaciones();
            mdlSecundarioNomina.inicio();

            mdlEntregablem.inicializarValidaciones();
            mdlEntregablem.inicio();

            mdlOtrosServiciosm.inicializarValidaciones();
            mdlOtrosServiciosm.inicio();

            mdlEstadoCuentam.inicializarValidaciones();
            mdlEstadoCuentam.inicio();

            mdlNotificacionesm.inicializarValidaciones();
            mdlNotificacionesm.inicio();

            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    async function refresh() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        Promise.all([GetPermisos(), GetListaPrincipal(), GetListaSecundario()]).then(function (values) {

            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaClientes(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = $fl_rfc.val();
        
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetListaClientes, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    let contenido = result.resultStoredProcedure.msnSuccess;
                    tblClientes.addRows(contenido, true, true, forzeDraw);
                }
                else {
                    tblClientes.clearRows();
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaProveedores(showWait = false, forzeDraw = false) {
        var filter = {};
        filter.rfc = $fl_rfc.val();
        
        let filtersSearch = JSON.stringify(filter);

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Cliente_GetListaProveedores, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    let contenido = result.resultStoredProcedure.msnSuccess;
                    tblProveedores.addRows(contenido, true, true, forzeDraw);
                }
                else {
                    tblProveedores.clearRows();
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }



    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLEmitidos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);
                console.log(result);
                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    

                    var lista1 = [];
                    var lista2 = [];
                    var lista3 = [];
                    var lista4 = [];
                    var lista5 = [];
                    var lista6 = [];

                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.descargas = '<a href="#" onclick="objClsClienteRIF.getPDF(\'' + item.UUID + '\',\'' + item.url_xml_2 + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.descargas += '<a href="#" onclick="objClsClienteRIF.getXML(\'' + item.UUID + '\',\'' + item.url_xml_2 + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';

                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "I") {
                            lista1.push(item);
                        }
                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "N") {
                            lista2.push(item);
                        }
                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "P") {
                            lista3.push(item);
                        }
                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "E") {
                            lista4.push(item);
                        }
                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "T") {
                            lista6.push(item);
                        }
                        if (item.estatus == "CANCELADO") {
                            lista5.push(item);
                        }
                    });


                    tblPrincipal.addRows(contenido, true, true, forzeDraw);

                    tblIngresos.addRows(lista1, true, true, forzeDraw);
                    tblIngresosSueldos.addRows(lista2, true, true, forzeDraw);
                    tblComplementoCobro.addRows(lista3, true, true, forzeDraw);
                    tblIngresoNotas.addRows(lista4, true, true, forzeDraw);
                    tblIngresoCanceladas.addRows(lista5, true, true, forzeDraw);
                    tblIngresosTraslado.addRows(lista6, true, true, forzeDraw);
                }
                    
                else
                    tblPrincipal.clearRows();




                $btnDescarga.attr("href", url_Catalogo_Descargar + "?jsonJS=" + filtersSearch + "&id_RV=" + id_RV);

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetCliente(showWait = false) {

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetClienteCaducidad, { jsonJS: JSON.stringify({ id_cliente: id_cliente}), id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);
                
                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    let { fecha_caducidad_fiel } = result.resultStoredProcedure.msnSuccess || null;
                   
                    if (fecha_caducidad_fiel) {
                        fecha_caducidad_fiel = moment(fecha_caducidad_fiel);
                        let caducidad = fecha_caducidad_fiel.diff(moment(), 'week');

                        console.log(caducidad);

                        if (caducidad <= 3) {
                            console.log(caducidad);
                            let alert = jsSimpleAlertReturn("CADUCIDAD FIEL", "La caducidad de la FIEL, esta pronta a caducar (menos de 3 semanas).<br\> Actualizala para poder acceder a la consulta.<br/>Fecha límite: " + fecha_caducidad_fiel.format("YYYY-MM-DD")+" ", "red", "fa fa-times", false)
                            alert.open();
                        } else if (caducidad <= 8) {
                            console.log(caducidad);
                            jsSimpleAlert("CADUCIDAD FIEL", "La caducidad de la FIEL, esta pronta a caducar (en al menos 8 semanas).<br/>Fecha límite: " + fecha_caducidad_fiel.format("YYYY-MM-DD") +"","orange");
                        } else {
                            console.log(caducidad);
                            return false;
                        }
                    }
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaSecundario(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLRecibidos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);
                console.log(result);
                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {

                    var lista1 = [];
                    var lista2 = [];
                    var lista3 = [];
                    var lista4 = [];
                    var lista5 = [];
                    var lista6 = [];

                    let contenido = result.resultStoredProcedure.msnSuccess;
                    contenido.forEach(function (item) {
                        item.descargas = '<a href="#" onclick="objClsClienteRIF.getPDF(\'' + item.UUID + '\',\'' + item.url_xml_2 + '\')" class="btn btn-style btn-danger "><i class="fa fa-file-pdf-o"></i ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        //item.acciones += '<a href="#"  class="btn btn-style btn-danger btnViewMdlRepositorio"><i class="fa fa-trash"></i ></a>';
                        item.descargas += '<a href="#" onclick="objClsClienteRIF.getXML(\'' + item.UUID + '\',\'' + item.url_xml_2 + '\')" class="btn btn-style btn-info "><i class="fa fa-file-o"></i ></a>';

                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "I") {
                            lista1.push(item);
                        }
                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "N") {
                            lista2.push(item);
                        }
                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "P") {
                            lista3.push(item);
                        }
                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "E") {
                            lista4.push(item);
                        }
                        if (item.estatus == "VIGENTE" && item.tipo_comprobante == "T") {
                            lista6.push(item);
                        }
                        if (item.estatus == "CANCELADO") {
                            lista5.push(item);
                        }
                    });
                    tblSecundario.addRows(contenido, true, true, forzeDraw);

                    tblGastos.addRows(lista1, true, true, forzeDraw);
                    tblGastosSueldos.addRows(lista2, true, true, forzeDraw);
                    tblComplementoPago.addRows(lista3, true, true, forzeDraw);
                    tblGastosNotas.addRows(lista4, true, true, forzeDraw);
                    tblGastosCanceladas.addRows(lista5, true, true, forzeDraw);
                    tblGastosTraslado.addRows(lista6, true, true, forzeDraw);
                }
                    
                else
                    tblSecundario.clearRows();


                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function getPDF(uuid, xml) {
        //window.location = url_Descarga + '?file=' + xml + '&uuid=' + uuid + '&tipo=2';
        window.open(url_Descarga + '?file=' + xml + '&uuid=' + uuid + '&tipo=2', "_blank");
        
    }
    function getXML(uuid, xml) {
        window.location = url_Descarga + '?file=' + xml + '&uuid=' + uuid + '&tipo=1';
    }

    function getFilterSearch() {
        let filters = {};

        filters.fl_rfc = $fl_rfc.val();

        let fecha_inicial = moment($fl_fecha_inicial.val());
        let fecha_final = moment($fl_fecha_final.val());

        if (!fecha_inicial.isValid())
            return jsSimpleAlert("Alerta", "La fecha inicial no es válida", "orange");

        if (!fecha_final.isValid())
            return jsSimpleAlert("Alerta", "La fecha final no es válida", "orange");

        filters.fl_fecha_inicial = fecha_inicial.format("YYYY-MM-DD HH:mm:ss");
        fecha_final.add(23, "hours").add(59, "minutes").add(59, "seconds");
        filters.fl_fecha_final = fecha_final.format("YYYY-MM-DD HH:mm:ss");
        filters.fl_periodo_filtro = $fl_periodo_filtro.val();
        return filters;
    }

    function clearFilterSearch() {
        $fl_fecha_inicial.val(moment().format("YYYY-MM-DD"));
        $fl_fecha_final.val(moment().format("YYYY-MM-DD"));
    }

    function GetCatalogos() {
        var cat = "";
        if (es_asesoria == "True") {
            cat = "tbc_Lista_Entregables_99,";
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
        }
        else if (aplica_coi == "True") {
            cat = "tbc_Lista_Entregables_98,";
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
            
        }
        else {
            switch (Number(id_regimen)) {
                case 1:
                    cat = "tbc_Lista_Entregables_1,";
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
                    cat = "tbc_Lista_Entregables_2,";
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
                    cat = "tbc_Lista_Entregables_3,";
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
                    cat = "tbc_Lista_Entregables_4,";
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
                    cat = "tbc_Lista_Entregables_5,";
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
                    cat = "tbc_Lista_Entregables_6,";
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
                case 7:
                    cat = "tbc_Lista_Entregables_7,";
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
                case 8:
                    cat = "tbc_Lista_Entregables_8,";
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
        }

        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: cat
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
        //if (contenido.hasOwnProperty("tbc_RIF_Sectores")) {
        //    $("#fl_ddlSector").html(dataToStringDropDown(contenido.tbc_RIF_Sectores, true));
        //}
        //if (contenido.hasOwnProperty("tbc_Uso_CFDI_I")) {
        //    $("#fr_clasificacion_activo_fijo").html(dataToStringDropDown(contenido.tbc_Uso_CFDI_I, true));
        //}

        if (contenido.hasOwnProperty("tbc_Lista_Entregables_2")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_2, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_2, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_2, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_2, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_2, true));
        }
        if (contenido.hasOwnProperty("tbc_Lista_Entregables_1")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_1, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_1, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_1, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_1, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_1, true));
        }

        if (contenido.hasOwnProperty("tbc_Lista_Entregables_3")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_3, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_3, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_3, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_3, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_3, true));
        }
        if (contenido.hasOwnProperty("tbc_Lista_Entregables_4")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_4, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_4, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_4, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_4, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_4, true));
        }
        if (contenido.hasOwnProperty("tbc_Lista_Entregables_5")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_5, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_5, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_5, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_5, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_5, true));
        }
        if (contenido.hasOwnProperty("tbc_Lista_Entregables_6")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_6, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_6, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_6, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_6, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_6, true));
        }
        if (contenido.hasOwnProperty("tbc_Lista_Entregables_7")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_7, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_7, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_7, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_7, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_7, true));
        }
        if (contenido.hasOwnProperty("tbc_Lista_Entregables_8")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_8, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_8, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_8, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_8, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_8, true));
        }
        if (contenido.hasOwnProperty("tbc_Lista_Entregables_99")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_99, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_99, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_99, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_99, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_99, true));
        }
        if (contenido.hasOwnProperty("tbc_Lista_Entregables_98")) {
            $("#fr_entregable").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_98, true));
            $("#fr_entregable2").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_98, true));
            $("#fr_entregable3").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_98, true));
            $("#fr_entregable4").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_98, true));
            $("#fr_entregable5").html(dataToStringDropDown(contenido.tbc_Lista_Entregables_98, true));
        }
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
        //! Definir columnas Emitidas
        let columnDefs = [
            { visible: true, orderable: false, targets: 0, width: 40, className: "text-center", data: null, render: drawCheckBox, title:"Acciones" },
            { visible: true, orderable: false, searchable: false, targets: 1, width: 90, name: "descargas", data: "descargas", title: "Descarga" },
            { visible: false, orderable: false, searchable: false, targets: 2, width: 0, name: "id_xml", data: "id_xml" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 100, name: "estatus", data: "estatus", title: "Estatus", render: renderBadgeEstatus },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 120, name: "tipo", data: "tipo" , title: "Tipo"},
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "fecha", data: "fecha", title: "Fecha" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "fecha_timbrado", data: "fecha_timbrado", title: "Fecha timbrado" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 150, name: "serie", data: "serie" , title: "Serie"}, //Serie
            { visible: true, orderable: true, searchable: true, targets: 8, width: 120, name: "folio", data: "folio" , title: "Folio"},
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "UUID", data: "UUID", title: "UUID" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "cfdi_relacionados", data: "cfdi_relacionados", title: "CFDI relacionados" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 130, name: "RFCReceptor", data: "RFCReceptor" , title: "RFC receptor"},
            { visible: true, orderable: true, searchable: true, targets: 12, width: 250, name: "nombre_receptor", data: "nombre_receptor", title: "Nombre receptor" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 150, name: "subtotal", data: "subtotal", title:"Subtotal" },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 150, name: "descuento", data: "descuento", title:"Descuento"},
            { visible: true, orderable: true, searchable: true, targets: 15, width: 150, name: "subtotal_neto", data: "subtotal_neto" , title: "Subtotal neto"},
            { visible: true, orderable: true, searchable: true, targets: 16, width: 150, name: "impuesto_trasladado", data: "impuesto_trasladado", title: "Impuesto IVA" },

            { visible: true, orderable: true, searchable: true, targets: 17, width: 150, name: "ish", data: "ish", title: "ISH" },

            { visible: true, orderable: true, searchable: true, targets: 18, width: 150, name: "retencion_iva", data: "retencion_iva", title: "Retención IVA" },
            { visible: true, orderable: true, searchable: true, targets: 19, width: 150, name: "retencion_isr", data: "retencion_isr", title: "Retención ISR" },
            { visible: true, orderable: true, searchable: true, targets: 20, width: 150, name: "total", data: "total", title: "Total" },
            { visible: true, orderable: true, searchable: true, targets: 21, width: 350, name: "conceptos", data: "conceptos", render: maxContent, title: "Conceptos" },
            { visible: true, orderable: true, searchable: true, targets: 22, width: 100, name: "moneda", data: "moneda" , title: "Moneda"},
            { visible: true, orderable: true, searchable: true, targets: 23, width: 150, name: "total_original", data: "total_original" , title: "Total original"},
            { visible: true, orderable: true, searchable: true, targets: 24, width: 150, name: "tipo_cambio", data: "tipo_cambio" , title: "Tipo cambio"},
            { visible: true, orderable: true, searchable: true, targets: 25, width: 150, name: "forma_pago", data: "forma_pago", title: "Forma pago" },
            { visible: true, orderable: true, searchable: true, targets: 26, width: 150, name: "metodo_pago", data: "metodo_pago" , title: "Método pago"},
            
            { visible: true, orderable: true, searchable: true, targets: 27, width: 150, name: "monto", data: "monto", title: "Monto" },
            { visible: true, orderable: true, searchable: true, targets: 28, width: 120, name: "usoCFDI", data: "usoCFDI", title:"Uso CFDI" },
            { visible: true, orderable: true, searchable: true, targets: 29, width: 150, name: "ieps", data: "ieps", title: "IEPS" },
            { visible: true, orderable: true, searchable: true, targets: 30, width: 150, name: "retencion_ieps", data: "retencion_ieps", title:"Retención IEPS" },
            { visible: true, orderable: true, searchable: true, targets: 31, width: 150, name: "traslado_local", data: "traslado_local", title: "Total traslado local" },
            { visible: true, orderable: true, searchable: true, targets: 32, width: 150, name: "retencion_local", data: "retencion_local", title: "Total retención local" },
            { visible: false, orderable: false, searchable: false, targets: 33, width: 100, name: "isr_nomina", data: "isr_nomina", title: "ISR nómina" },
            { visible: false, orderable: false, searchable: false, targets: 34, width: 130, name: "subsidio_nomina", data: "subsidio_nomina", title: "Subsidio nómina" },
            { visible: true, orderable: true, searchable: true, targets: 35, width: 150, name: "nombre_xml", data: "nombre_xml" , title: "XML"},




           
            { visible: false, orderable: false, searchable: false, targets: 36, width: 130, name: "RFCEmisor", data: "RFCEmisor" },
            { visible: false, orderable: false, searchable: false, targets: 37, width: 250, name: "nombre_emisor", data: "nombre_emisor" },           
            { visible: false, orderable: false, searchable: false, targets: 38, width: 150, name: "fecha_pago", data: "fecha_pago" },
            { visible: true, orderable: true, searchable: true, targets: 39, width: 80, name: "version", data: "version" },
            { visible: false, orderable: false, searchable: false, targets: 40, width: 150, name: "tipo_comprobante", data: "tipo_comprobante" },            
            { visible: false, orderable: false, searchable: false, targets: 41, width: 150, name: "impuesto_retenido", data: "impuesto_retenido" },
            { visible: false, orderable: false, searchable: false, targets: 42, width: 250, name: "cfdi_relacionados", data: "cfdi_relacionados" },
            { visible: false, orderable: false, searchable: false, targets: 43, width: 200, name: "tipo_relacion_cfdi", data: "tipo_relacion_cfdi" },
            { visible: false, orderable: false, searchable: false, targets: 44, width: 150, name: "url_xml", data: "url_xml" },

            
            { visible: true, orderable: true, searchable: false, targets: 45, width: 150, name: "fecha_validacion", data: "fecha_validacion", title: "Fecha de validación" },
            { visible: true, orderable: true, searchable: false, targets: 46, width: 150, name: "EFOS", data: "EFOS", title: 'EFOS' },
            

        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [[4, "asc"]]
            //exportOptionsExcel: {
            //    columns: [2,3,4,5,6,7,8,9,10]
            //}

        }

        function maxContent(data, type, row) {
            //if (data.length > 100) {
            //    return String(data).substring(0, 100);
            //}
            return data;
        }

        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        let paramsDataTablea = {
            columnDefs: columnDefs,
            idTable: idTable_ingresos,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTablea); //! Inicializar datatable
        tblIngresos.setTable($(idTable_ingresos).DataTable()); //! Inicializar clase datatable

        

        let paramsDataTablec = {
            columnDefs: columnDefs,
            idTable: idTable_complemento_cobro,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTablec); //! Inicializar datatable
        tblComplementoCobro.setTable($(idTable_complemento_cobro).DataTable()); //! Inicializar clase datatable

        let paramsDataTabled = {
            columnDefs: columnDefs,
            idTable: idTable_ingreso_notas,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTabled); //! Inicializar datatable
        tblIngresoNotas.setTable($(idTable_ingreso_notas).DataTable()); //! Inicializar clase datatable

        let paramsDataTablee = {
            columnDefs: columnDefs,
            idTable: idTable_ingreso_canceladas,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTablee); //! Inicializar datatable
        tblIngresoCanceladas.setTable($(idTable_ingreso_canceladas).DataTable()); //! Inicializar clase datatable


        let paramsDataTablef = {
            columnDefs: columnDefs,
            idTable: idTable_ingresos_traslado,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTablef); //! Inicializar datatable
        tblIngresosTraslado.setTable($(idTable_ingresos_traslado).DataTable()); //! Inicializar clase datatable





        //! Definir columnas Recibidas
        let columnDefs2 = [
            { visible: true, orderable: false, targets: 0, width: 40, className: "text-center", data: null, render: drawCheckBox, title: "Acciones" },
            { visible: true, orderable: false, searchable: false, targets: 1, width: 90, name: "descargas", data: "descargas", title: "Descargas"},
            { visible: false, orderable: false, searchable: false, targets: 2, width: 0, name: "id_xml", data: "id_xml" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 100, name: "estatus", data: "estatus", title: "Estatus", render: renderBadgeEstatus },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 120, name: "tipo", data: "tipo", title: "Tipo" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "fecha", data: "fecha", title: "Fecha" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "fecha_timbrado", data: "fecha_timbrado", title: "Fecha timbrado" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 150, name: "serie", data: "serie", title: "Serie" }, //Serie
            { visible: true, orderable: true, searchable: true, targets: 8, width: 120, name: "folio", data: "folio", title: "Folio" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "UUID", data: "UUID", title: "UUID" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "cfdi_relacionados", data: "cfdi_relacionados", title: "CFDI relacionados" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 130, name: "RFCEmisor", data: "RFCEmisor", title: "RFC emisor" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 250, name: "nombre_emisor", data: "nombre_emisor", title: "Nombre emisor" },           
            { visible: true, orderable: true, searchable: true, targets: 13, width: 150, name: "subtotal", data: "subtotal", title: "Subtotal" },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 150, name: "descuento", data: "descuento", title: "Descuento" },
            { visible: true, orderable: true, searchable: true, targets: 15, width: 150, name: "subtotal_neto", data: "subtotal_neto", title: "Subtotal neto" },
            { visible: true, orderable: true, searchable: true, targets: 16, width: 150, name: "impuesto_trasladado", data: "impuesto_trasladado", title: "Impuesto IVA" },

            { visible: true, orderable: true, searchable: true, targets: 17, width: 150, name: "ish", data: "ish", title: "ISH" },

            { visible: true, orderable: true, searchable: true, targets: 18, width: 150, name: "retencion_iva", data: "retencion_iva", title: "Retención IVA" },
            { visible: true, orderable: true, searchable: true, targets: 19, width: 150, name: "retencion_isr", data: "retencion_isr", title: "Retención ISR" },
            { visible: true, orderable: true, searchable: true, targets: 20, width: 150, name: "total", data: "total", title: "Total" },
            { visible: true, orderable: true, searchable: true, targets: 21, width: 350, name: "conceptos", data: "conceptos", title: "Conceptos" },
            { visible: true, orderable: true, searchable: true, targets: 22, width: 100, name: "moneda", data: "moneda", title: "Moneda" },
            { visible: true, orderable: true, searchable: true, targets: 23, width: 150, name: "total_original", data: "total_original", title: "Total original" },
            { visible: true, orderable: true, searchable: true, targets: 24, width: 150, name: "tipo_cambio", data: "tipo_cambio", title: "Tipo cambio" },
            { visible: true, orderable: true, searchable: true, targets: 25, width: 150, name: "forma_pago", data: "forma_pago", title: "Forma pago" },
            { visible: true, orderable: true, searchable: true, targets: 26, width: 150, name: "metodo_pago", data: "metodo_pago", title: "Método pago" },
            
            { visible: true, orderable: true, searchable: true, targets: 27, width: 350, name: "monto", data: "monto", title: "Monto" },
            { visible: true, orderable: true, searchable: true, targets: 28, width: 120, name: "usoCFDI", data: "usoCFDI", title: "Uso CFDI" },
            { visible: true, orderable: true, searchable: true, targets: 29, width: 150, name: "ieps", data: "ieps", title: "IEPS" },
            { visible: true, orderable: true, searchable: true, targets: 30, width: 150, name: "retencion_ieps", data: "retencion_ieps", title: "Retención IEPS" },
            { visible: true, orderable: true, searchable: true, targets: 31, width: 150, name: "traslado_local", data: "traslado_local", title: "Total traslado local" },
            { visible: true, orderable: true, searchable: true, targets: 32, width: 150, name: "retencion_local", data: "retencion_local", title: "Total retención local" },
            { visible: true, orderable: true, searchable: true, targets: 33, width: 150, name: "divisa_opc", data: "divisa_opc", title: "Divisa" },
            { visible: true, orderable: true, searchable: true, targets: 34, width: 150, name: "nombre_xml", data: "nombre_xml", title: "XML" },

            

            
            { visible: false, orderable: false, searchable: false, targets: 35, width: 130, name: "RFCReceptor", data: "RFCReceptor" },
            { visible: false, orderable: false, searchable: false, targets: 36, width: 250, name: "nombre_receptor", data: "nombre_receptor" },            
            { visible: false, orderable: false, searchable: false, targets: 37, width: 150, name: "fecha_pago", data: "fecha_pago" },
            { visible: true, orderable: true, searchable: true, targets: 38, width: 80, name: "version", data: "version" },
            { visible: false, orderable: false, searchable: false, targets: 39, width: 150, name: "tipo_comprobante", data: "tipo_comprobante" },            
            { visible: false, orderable: false, searchable: false, targets: 40, width: 150, name: "impuesto_retenido", data: "impuesto_retenido" },
            { visible: false, orderable: false, searchable: false, targets: 41, width: 250, name: "cfdi_relacionados", data: "cfdi_relacionados" },
            { visible: false, orderable: false, searchable: false, targets: 42, width: 200, name: "tipo_relacion_cfdi", data: "tipo_relacion_cfdi" },
            { visible: false, orderable: false, searchable: false, targets: 43, width: 150, name: "url_xml", data: "url_xml" },
            { visible: true, orderable: true, searchable: false, targets: 44, width: 150, name: "fecha_validacion", data: "fecha_validacion", title: "Fecha de validación" },
            { visible: true, orderable: true, searchable: false, targets: 45, width: 150, name: "EFOS", data: "EFOS", title: 'EFOS' },
            

        ];


        let paramsDataTableSecundario = {
            columnDefs: columnDefs2,
            idTable: idTable_Secundario,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTableSecundario);
        tblSecundario.setTable($(idTable_Secundario).DataTable()); //! Inicializar clase datatable


        let paramsDataTableSecundarioa = {
            columnDefs: columnDefs2,
            idTable: idTable_gastos,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTableSecundarioa); //! Inicializar datatable
        tblGastos.setTable($(idTable_gastos).DataTable()); //! Inicializar clase datatable

        

        let paramsDataTableSecundarioc = {
            columnDefs: columnDefs2,
            idTable: idTable_complemento_pago,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTableSecundarioc); //! Inicializar datatable
        tblComplementoPago.setTable($(idTable_complemento_pago).DataTable()); //! Inicializar clase datatable

        let paramsDataTableSecundariod = {
            columnDefs: columnDefs2,
            idTable: idTable_gastos_notas,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTableSecundariod); //! Inicializar datatable
        tblGastosNotas.setTable($(idTable_gastos_notas).DataTable()); //! Inicializar clase datatable

        let paramsDataTableSecundarioe = {
            columnDefs: columnDefs2,
            idTable: idTable_gastos_canceladas,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTableSecundarioe); //! Inicializar datatable
        tblGastosCanceladas.setTable($(idTable_gastos_canceladas).DataTable()); //! Inicializar clase datatable


        let paramsDataTableSecundariof = {
            columnDefs: columnDefs2,
            idTable: idTable_gastos_traslado,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTableSecundariof); //! Inicializar datatable
        tblGastosTraslado.setTable($(idTable_gastos_traslado).DataTable()); //! Inicializar clase datatable


        //Tabla Nominas
        let columnDefs3 = [
            { visible: true, orderable: false, targets: 0, width: 40, className: "text-center", data: null, render: drawCheckBox, title: "Acciones" },
            { visible: true, orderable: false, searchable: false, targets: 1, width: 90, name: "descargas", data: "descargas", title: "Descargas" },
            { visible: false, orderable: false, searchable: false, targets: 2, width: 0, name: "id_xml", data: "id_xml" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 120, name: "tipo", data: "tipo", title: "Tipo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "fecha", data: "fecha", title: "Fecha" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "fecha_timbrado", data: "fecha_timbrado", title: "Fecha timbrado" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "serie", data: "serie", title: "Serie" }, //Serie
            { visible: true, orderable: true, searchable: true, targets: 7, width: 120, name: "folio", data: "folio", title: "Folio" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "UUID", data: "UUID", title: "UUID" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "cfdi_relacionados", data: "cfdi_relacionados", title: "CFDI relacionados" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 130, name: "RFCEmisor", data: "RFCEmisor", title: "RFC emisor" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 250, name: "nombre_emisor", data: "nombre_emisor", title: "Nombre emisor" },
            { visible: false, orderable: false, searchable: false, targets: 12, width: 150, name: "subtotal", data: "subtotal", title: "Subtotal" },
            { visible: false, orderable: false, searchable: false, targets: 13, width: 150, name: "descuento", data: "descuento", title: "Descuento" },
            { visible: false, orderable: false, searchable: false, targets: 14, width: 150, name: "subtotal_neto", data: "subtotal_neto", title: "Subtotal neto" },
            { visible: false, orderable: false, searchable: false, targets: 15, width: 150, name: "impuesto_trasladado", data: "impuesto_trasladado", title: "Impuesto IVA" },
            { visible: false, orderable: false, searchable: false, targets: 16, width: 150, name: "retencion_iva", data: "retencion_iva", title: "Retención IVA" },
            { visible: false, orderable: false, searchable: false, targets: 17, width: 150, name: "retencion_isr", data: "retencion_isr", title: "Retención ISR" },
            { visible: false, orderable: false, searchable: false, targets: 18, width: 150, name: "total", data: "total", title: "Total" },
            { visible: true, orderable: true, searchable: true, targets: 19, width: 350, name: "conceptos", data: "conceptos", title: "Conceptos" },
            { visible: true, orderable: true, searchable: true, targets: 20, width: 100, name: "moneda", data: "moneda", title: "Moneda" },
            { visible: false, orderable: false, searchable: false, targets: 21, width: 150, name: "total_original", data: "total_original", title: "Total original" },
            { visible: false, orderable: false, searchable: false, targets: 22, width: 150, name: "tipo_cambio", data: "tipo_cambio", title: "Tipo cambio" },
            { visible: true, orderable: true, searchable: true, targets: 23, width: 150, name: "forma_pago", data: "forma_pago", title: "Forma pago" },
            { visible: true, orderable: true, searchable: true, targets: 24, width: 150, name: "metodo_pago", data: "metodo_pago", title: "Método pago" },
            
            { visible: false, orderable: false, searchable: false, targets: 25, width: 350, name: "monto", data: "monto", title: "Monto" },
            { visible: false, orderable: false, searchable: false, targets: 26, width: 120, name: "usoCFDI", data: "usoCFDI", title: "Uso CFDI" },
            { visible: false, orderable: false, searchable: false, targets: 27, width: 150, name: "ieps", data: "ieps", title: "IEPS" },
            { visible: false, orderable: false, searchable: false, targets: 28, width: 150, name: "retencion_ieps", data: "retencion_ieps", title: "Retención IEPS" },
            { visible: false, orderable: false, searchable: false, targets: 29, width: 150, name: "traslado_local", data: "traslado_local", title: "Total traslado local" },
            { visible: false, orderable: false, searchable: false, targets: 30, width: 150, name: "retencion_local", data: "retencion_local", title: "Total retención local" },
            { visible: false, orderable: false, searchable: false, targets: 31, width: 150, name: "divisa_opc", data: "divisa_opc", title: "Divisa" },
            { visible: false, orderable: false, searchable: false, targets: 32, width: 150, name: "nombre_xml", data: "nombre_xml", title: "XML" },
                       

            { visible: true, orderable: true, searchable: true, targets: 33, width: 130, name: "RFCReceptor", data: "RFCReceptor", title: "RFC receptor" },
            { visible: true, orderable: true, searchable: true, targets: 34, width: 250, name: "nombre_receptor", data: "nombre_receptor", title: "Nombre receptor" }, 

            { visible: true, orderable: true, searchable: true, targets: 35, width: 150, name: "registropatronal", data: "registropatronal", title: "Registro Patronal" },
            { visible: true, orderable: true, searchable: true, targets: 36, width: 150, name: "tiponomina", data: "tiponomina", title: "Tipo nómina" },
            { visible: true, orderable: true, searchable: true, targets: 37, width: 150, name: "fechapago", data: "fechapago", title: "Fecha pago" },
            { visible: true, orderable: true, searchable: true, targets: 38, width: 150, name: "fechainicialpago", data: "fechainicialpago", title: "Fecha inicial pago" },
            { visible: true, orderable: true, searchable: true, targets: 39, width: 150, name: "fechafinalpago", data: "fechafinalpago", title: "Fecha final pago" },
            { visible: true, orderable: true, searchable: true, targets: 40, width: 150, name: "numdiaspagados", data: "numdiaspagados", title: "Num dias pagados" },
            
            { visible: true, orderable: true, searchable: true, targets: 41, width: 150, name: "curp", data: "curp", title: "CURP" },
            { visible: true, orderable: true, searchable: true, targets: 42, width: 150, name: "numseguridadsocial", data: "numseguridadsocial", title: "Num seguridad social" },
            { visible: true, orderable: true, searchable: true, targets: 43, width: 150, name: "fechainiciorellaboral", data: "fechainiciorellaboral", title: "Fcha inicio rel laboral" },
            { visible: true, orderable: true, searchable: true, targets: 44, width: 150, name: "numempleado", data: "numempleado", title: "Num empleado" },
            { visible: true, orderable: true, searchable: true, targets: 45, width: 150, name: "departamento", data: "departamento", title: "Departamento" },
            { visible: true, orderable: true, searchable: true, targets: 46, width: 150, name: "puesto", data: "puesto", title: "Puesto" },
            { visible: true, orderable: true, searchable: true, targets: 47, width: 150, name: "periodicidadpago", data: "periodicidadpago", title: "Periodicidad pago" },
            { visible: true, orderable: true, searchable: true, targets: 48, width: 150, name: "salariobasecotapor", data: "salariobasecotapor", title: "Salario base secot apor" },
            { visible: true, orderable: true, searchable: true, targets: 49, width: 150, name: "salariodiariointegrado", data: "salariodiariointegrado", title: "Salario diario integrado" },




            { visible: true, orderable: true, searchable: true, targets: 50, width: 150, name: "totalsueldos", data: "totalsueldos", title: "Total sueldos" },
            { visible: true, orderable: true, searchable: true, targets: 51, width: 150, name: "totalgravado", data: "totalgravado", title: "Total Gravado" },
            { visible: true, orderable: true, searchable: true, targets: 52, width: 150, name: "totalexento", data: "totalexento", title: "Total Exento" },

            { visible: true, orderable: true, searchable: true, targets: 53, width: 150, name: "sueldosGravado", data: "sueldosGravado", title: "Sueldo gravado" },
            { visible: true, orderable: true, searchable: true, targets: 54, width: 150, name: "sueldosExento", data: "sueldosExento", title: "Sueldo exento" },

            { visible: true, orderable: true, searchable: true, targets: 55, width: 150, name: "aguinaldoGravado", data: "aguinaldoGravado", title: "Aguinaldo gravado" },
            { visible: true, orderable: true, searchable: true, targets: 56, width: 150, name: "aguinaldoExento", data: "aguinaldoExento", title: "Aguinaldo exento" },
            { visible: true, orderable: true, searchable: true, targets: 57, width: 150, name: "primaDominicalGravado", data: "primaDominicalGravado", title: "Prima Dominical gravado" },
            { visible: true, orderable: true, searchable: true, targets: 58, width: 150, name: "primaDominicalExento", data: "primaDominicalExento", title: "Prima Dominical exento" },
            { visible: true, orderable: true, searchable: true, targets: 59, width: 150, name: "primaVacacionalGravado", data: "primaVacacionalGravado", title: "Prima Vacacional gravado" },
            { visible: true, orderable: true, searchable: true, targets: 60, width: 150, name: "primaVacacionalExento", data: "primaVacacionalExento", title: "Prima Vacacional exento" },
            { visible: true, orderable: true, searchable: true, targets: 61, width: 150, name: "primaAntiguedadGravado", data: "primaAntiguedadGravado", title: "Prima Antiguedad gravado" },
            { visible: true, orderable: true, searchable: true, targets: 62, width: 150, name: "primaAntiguedadExento", data: "primaAntiguedadExento", title: "Prima Antiguedad exento" },
            { visible: true, orderable: true, searchable: true, targets: 63, width: 150, name: "indemnizacionGravado", data: "indemnizacionGravado", title: "Indemnizacion gravado" },
            { visible: true, orderable: true, searchable: true, targets: 64, width: 150, name: "indemnizacionExento", data: "indemnizacionExento", title: "Indemnizacion exento" },
            
            { visible: true, orderable: true, searchable: true, targets: 65, width: 150, name: "subsidioCausado", data: "subsidioCausado", title: "Subsidio Causado" },
            { visible: true, orderable: true, searchable: true, targets: 66, width: 150, name: "subsidioPagado", data: "subsidioPagado", title: "Subsidio Pagado" },

            { visible: true, orderable: true, searchable: true, targets: 67, width: 150, name: "_seguroSocial", data: "_seguroSocial", title: "IMSS" },
            { visible: true, orderable: true, searchable: true, targets: 68, width: 150, name: "_isrDeduccion", data: "_isrDeduccion", title: "ISR Deducción" },
            { visible: true, orderable: true, searchable: true, targets: 69, width: 150, name: "_aportaciones", data: "_aportaciones", title: "RCV" },
            { visible: true, orderable: true, searchable: true, targets: 70, width: 150, name: "_infonavit", data: "_infonavit", title: "Infonavit" },



        ];

        let paramsDataTableb = {
            columnDefs: columnDefs3,
            idTable: idTable_gastos_sueldos,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTableb); //! Inicializar datatable
        tblIngresosSueldos.setTable($(idTable_gastos_sueldos).DataTable()); //! Inicializar clase datatable

        let paramsDataTableSecundariob = {
            columnDefs: columnDefs3,
            idTable: idTable_ingresos_sueldos,
            order: [[4, "asc"]]
        }
        initDataTable(paramsDataTableSecundariob); //! Inicializar datatable
        tblGastosSueldos.setTable($(idTable_ingresos_sueldos).DataTable()); //! Inicializar clase datatable




        //! Definir columnas Repositorio
        let columnDefsRepo = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },

            { visible: true, orderable: true, searchable: true, targets: 1, width: 300, name: "repositorio", data: "repositorio" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 200, name: "tipo_repositorio", data: "tipo_repositorio" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "fecha_vigencia", data: "fecha_vigencia" },

            { visible: true, orderable: true, searchable: true, targets: 4, width: 450, name: "descripcion", data: "descripcion" },
            { visible: false, orderable: false, searchable: false, targets: 5, width: 250, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 250, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "url_archivo", data: "url_archivo" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 300, name: "nombre_archivo", data: "nombre_archivo" },
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

        //! Definir columnas Repositorio Nomina
        let columnDefsRepoNomina = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 200, name: "categoria", data: "categoria" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 200, name: "entregable", data: "entregable" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 120, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 120, name: "periodicidad", data: "periodicidad" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 200, name: "observacion", data: "observacion" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 200, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 200, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 250, name: "fecha_carga", data: "fecha_carga" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 10, width: 150, name: "url_archivo", data: "url_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 11, width: 300, name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 12, width: 250, name: "id_entregable_nomina_RFC", data: "id_entregable_nomina_RFC" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableRepoNomina = {
            columnDefs: columnDefsRepoNomina,
            idTable: id_Table_RepositorioNomina,
            fixedColumns: null

        }

        initDataTable(paramsDataTableRepoNomina);
        tblRepositorioNomina.setTable($(id_Table_RepositorioNomina).DataTable());


        //! Definir columnas Entregables
        let columnDefsEntregables = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 250, name: "entregable", data: "entregable" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 200, name: "descripcion", data: "descripcion" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 100, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 100, name: "regimen", data: "regimen" },
            
            { visible: false, orderable: false, searchable: false, targets: 5, width: 0, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 120, name: "fecha_carga", data: "fecha_carga" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 150, name: "url_archivo", data: "url_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 10, width: 300, name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 11, width: 250, name: "id_entregable_rfc", data: "id_entregable_rfc" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableEntregable = {
            columnDefs: columnDefsEntregables,
            idTable: id_Table_Entregable,
            fixedColumns: null,
            order: [1, 'asc'],
            descLength: {
                arrayTotal: [-1],
                arrayDes: ["Todas"]
            }
        }

        initDataTable(paramsDataTableEntregable);
        tblEntregable.setTable($(id_Table_Entregable).DataTable());

        //! Definir columnas Otros Servicios
        let columnDefsOtrosServicios = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 250, name: "servicio", data: "servicio" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 200, name: "descripcion", data: "descripcion" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 100, name: "periodo", data: "periodo" },
            { visible: false, orderable: false, searchable: false, targets: 4, width: 0, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 120, name: "fecha_carga", data: "fecha_carga" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 150, name: "url_archivo", data: "url_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 300, name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 10, width: 250, name: "id_otro_servicio_rfc", data: "id_otro_servicio_rfc" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableOtrosServicios = {
            columnDefs: columnDefsOtrosServicios,
            idTable: id_Table_OtrosServicios,
            fixedColumns: null,
            order: [1, 'asc'],
            descLength: {
                arrayTotal: [-1],
                arrayDes: ["Todas"]
            }
        }

        initDataTable(paramsDataTableOtrosServicios);
        tblOtrosServicios.setTable($(id_Table_OtrosServicios).DataTable());


        //! Definir columnas Estado Cuenta
        let columnDefsEstadoCuenta = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 250, name: "estado_cuenta", data: "estado_cuenta" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 200, name: "descripcion", data: "descripcion" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 100, name: "periodo", data: "periodo" },
            { visible: false, orderable: false, searchable: false, targets: 4, width: 0, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 120, name: "fecha_carga", data: "fecha_carga" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 150, name: "url_archivo", data: "url_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 300, name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 10, width: 250, name: "id_estado_cuenta", data: "id_estado_cuenta" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableEstadoCuenta = {
            columnDefs: columnDefsEstadoCuenta,
            idTable: id_Table_EstadoCuenta,
            fixedColumns: null,
            order: [1, 'asc'],
            descLength: {
                arrayTotal: [-1],
                arrayDes: ["Todas"]
            }
        }

        initDataTable(paramsDataTableEstadoCuenta);
        tblEstadoCuenta.setTable($(id_Table_EstadoCuenta).DataTable());


        //! Definir columnas Notificaciones
        let columnDefsNotificaciones = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 80, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 100, name: "es_anual", data: "es_anual" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "autoridad_emisora", data: "autoridad_emisora" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 350, name: "acto_administrativo", data: "acto_administrativo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 100, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 120, name: "fecha_recepcion", data: "fecha_recepcion" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 120, name: "fecha_notificacion", data: "fecha_notificacion" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 180, name: "cargas", data: "cargas" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 180, name: "notificaciones", data: "notificaciones" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 0, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 10, width: 0, name: "id_notificacion", data: "id_notificacion" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableNotificaciones = {
            columnDefs: columnDefsNotificaciones,
            idTable: id_Table_Notificaciones,
            fixedColumns: null,
            order: [6, 'desc'],
            descLength: {
                arrayTotal: [-1],
                arrayDes: ["Todas"]
            }
        }

        initDataTable(paramsDataTableNotificaciones);
        tblNotificaciones.setTable($(id_Table_Notificaciones).DataTable());
        

        //! Definir columnas
        let columnDefsProveedores = [

            { visible: true, orderable: true, searchable: true, targets: 0, width: '55%', name: "nombre_razon", data: "nombre_razon" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: '15%', name: "rfc", data: "rfc" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '10%', name: "facturas", data: "facturas" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: '10%', name: "subtotal", data: "subtotal", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 4, width: '10%', name: "total", data: "total", render: formatCurrency }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableProveedores = {
            columnDefs: columnDefsProveedores,
            idTable: idTable_proveedores,
            order: [2, 'desc']
        }

        initDataTable(paramsDataTableProveedores); //! Inicializar datatable
        tblProveedores.setTable($(idTable_proveedores).DataTable()); //! Inicializar clase datatable

        //! Definir columnas
        let columnDefsClientes = [

            { visible: true, orderable: true, searchable: true, targets: 0, width: '55%', name: "nombre_razon", data: "nombre_razon" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: '15%', name: "rfc", data: "rfc" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: '10%', name: "facturas", data: "facturas" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: '10%', name: "subtotal", data: "subtotal", render: formatCurrency },
            { visible: true, orderable: true, searchable: true, targets: 4, width: '10%', name: "total", data: "total", render: formatCurrency }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableClientes = {
            columnDefs: columnDefsClientes,
            idTable: idTable_clientes,
            order: [2, 'desc']
        }

        initDataTable(paramsDataTableClientes); //! Inicializar datatable
        tblClientes.setTable($(idTable_clientes).DataTable()); //! Inicializar clase datatable

    }

    function formatCurrency(cantidad) {
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);

        var valor = numberFormat2.format(cantidad);

        return valor.substring(1);
    }

    function renderBadgeEstatus(data, type, row) {
        if (type == 'display') {
            let color = "";

            if (row.estatus == "VIGENTE") color = "success"            
            else color = "danger"

            return "<span class='badge badge-" + color + "'>" + row.estatus + "</span>";
        } else
            return data;
    }



    function drawCheckBox(data, type, row) {

        if (type == 'display') {
            let html = "";
            let isSelected = row.isSelected == 1 ? "checked" : "";

            html += "<input type='checkbox' " + isSelected + " class='chkSelected'></>";

            return html;

        } else return data;
    }

    $(idTable_Principal).on('change', '.chkSelected', function (e) {
        let closesTr = $(this).closest('tr');
        tblPrincipal.setRowSelected(closesTr);

        let row = tblPrincipal.getRowSelected();
        $(this).prop('checked') ? row.isSelected = 1 : row.isSelected = 0;

        tblPrincipal.updateRow(row);

    });

    $(idTable_Secundario).on('change', '.chkSelected', function (e) {
        let closesTr = $(this).closest('tr');
        tblSecundario.setRowSelected(closesTr);

        let row = tblSecundario.getRowSelected();
        $(this).prop('checked') ? row.isSelected = 1 : row.isSelected = 0;

        tblSecundario.updateRow(row);

    });

    function initEvents() {
        //let tmpTbl_Principal = tblPrincipal.getTable();

        ////! ******Eventos DataTable******//
        //$(idTable_Principal + ' tbody').on('click', 'tr', function () {//Evento de seleccion DataTable
        //    if ($(this).hasClass('selected')) {
        //        $(this).removeClass('selected');
        //    }
        //    else {
        //        tmpTbl_Principal.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }
        //    tmpTbl_Principal.fixedColumns().update();
        //});

        //$(idTable_Principal + ' tbody').on('dblclick', 'tr', function () {//Evento de doble clic DataTable
        //    let tr = $(this);

        //    if (!$(this).hasClass('selected')) {
        //        tmpTbl_Principal.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }

        //    tmpTbl_Principal.fixedColumns().update();

        //    isRowSelected("BTN-EDIT", "edit");
        //});

        $('#btnCloseMdlRepo').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlSecundario.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlRepo').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlSecundario.enviarStoredProcedure();
        });

        $('#btnCloseMdlRepoNomina').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlSecundarioNomina.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlRepoNomina').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlSecundarioNomina.enviarStoredProcedure();
        });

        $('#btnAceptarMdlRepoNomina2').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlSecundarioNomina.enviarStoredProcedure2();
        });


        $('#btnCloseMdlEntregable').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlEntregablem.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlEntregable').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlEntregablem.enviarStoredProcedure();
        });

        $('#btnCloseMdlOtrosServicios').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlOtrosServiciosm.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlOtrosServicios').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlOtrosServiciosm.enviarStoredProcedure();
        });

        $('#btnCloseMdlEstadoCuenta').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlEstadoCuentam.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlEstadoCuenta').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlEstadoCuentam.enviarStoredProcedure();
        });

        $('#btnCloseMdlNotificaciones').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlNotificacionesm.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlNotificaciones').on('click', function (e) { //Evento boton aceptar [modal] Repositorio
            mdlNotificacionesm.enviarStoredProcedure();
        });


        //Evento de [cerrar] modal de la entidad        
        $('#btnCloseMdlCargar').on('click', function () {
            $.modal.close();
        });

        $('#btnSubirMdlCargar').on('click', function () {


            let objSendStored = {};

            objSendStored.id = $id;
            objSendStored.tipo = $tipo;            


            var $fr_urlArchivo = $("#fl_archivo_notificacion");

            if ($fr_urlArchivo.val() != "") {



                var frmData = new FormData();
                frmData.append('url_archivo', $fr_urlArchivo.val() != "" ? $fr_urlArchivo[0].files[0] : "");
                frmData.append('jsonJS', JSON.stringify(objSendStored));
                frmData.append('id_RV', id_RV);


                let $msnWait = jsSimpleAlertReturn("Espera", "Realizando petición...", "orange");
                $msnWait.open();

                $.ajax({
                    type: "POST",
                    url: url_Catalogos_AddDocumentoNotificacion,
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
                            //finalizarStoredProcedure(data);
                            $.modal.close();
                            mdlNotificacionesm.refresh();
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) { jsSimpleAlert("Error", errorThrown); })
                    .always(function () { $msnWait.close() });
            } else {
                jsSimpleAlert("Error", "Debe cargar un archivo.");
            }
        });


        

        $('#btnSelectAllEmitidos').on('click', function () {
            seleccionarTodosEmitidos();
        });
        $('#btnSelectAllRecibidos').on('click', function () {
            seleccionarTodosRecibidos();
        });

        $('#btnQuitarAllEmitidos').on('click', function () {
            deseleccionarTodosEmitidos();
        });
        $('#btnQuitarAllRecibidos').on('click', function () {
            deseleccionarTodosRecibidos();
        });
        ////! ******Eventos botones modal******//

        ////Evento de [cerrar] modal de la entidad
        //$('#btnCloseMdl').on('click', function () {
        //    mdlPrincipal.confirmModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        //});

        ////Evento de [aceptar] modal de la entidad
        //$('#btnAceptarMdl').on('click', function (e) {

        //    let eventType = mdlPrincipal.getTypeEvent();

        //    if (eventType == "delete") {
        //        mdlPrincipal.confirmModal({ eventButton: "eliminar", title: "Confirma!", message: "¿Segúro que deséa eliminar el registro?" });
        //    }
        //    else if (eventType == "create" || eventType == "edit") {
        //        mdlPrincipal.sendToStored();
        //    }
        //});

        ////******Eventos botones modal columns******//
        //$('#btnModalColsAceptar').on('click', function () {
        //    colsPrincipal.setConfigColumns();
        //    $.modal.close();
        //});

        //$('#btnModalColsRefresh').on('click', function () {
        //    colsPrincipal.reset();
        //});

        ////******Eventos de busqueda con filtros******//
        $('#btnClearFilters').on('click', function () {
            window.location = url_Regresar_RFC;
        });

        $('#btnAceptaFrm').on('click', function () {
            SaveCabeceraPrincipal(true);
        });

        $('#btnSearchFilter').on('click', function () {

            if (!$frmFilterPrincipal.valid()) {
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
            }

            GetListaPrincipal(true, true);
            GetListaSecundario(true, true);
            
        });

        $("#close-sidebar").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
            tblSecundario.getTable().columns.adjust().draw(false);
            tblGastos.getTable().columns.adjust().draw(false);
            tblComplementoCobro.getTable().columns.adjust().draw(false);
            tblComplementoPago.getTable().columns.adjust().draw(false);
            tblGastosCanceladas.getTable().columns.adjust().draw(false);
            tblGastosNotas.getTable().columns.adjust().draw(false);
            tblGastosSueldos.getTable().columns.adjust().draw(false);
            tblIngresoCanceladas.getTable().columns.adjust().draw(false);
            tblIngresoNotas.getTable().columns.adjust().draw(false);
            tblIngresos.getTable().columns.adjust().draw(false);
            tblIngresosSueldos.getTable().columns.adjust().draw(false);
            objClsCliente.tblReporte.getTable().columns.adjust().draw(false);
            tblIngresosTraslado.getTable().columns.adjust().draw(false);
            tblGastosTraslado.getTable().columns.adjust().draw(false);
            tblClientes.getTable().columns.adjust().draw(false);
            tblProveedores.getTable().columns.adjust().draw(false);
           
        });

        $(".reload").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
            tblSecundario.getTable().columns.adjust().draw(false);
            tblGastos.getTable().columns.adjust().draw(false);
            tblComplementoCobro.getTable().columns.adjust().draw(false);
            tblComplementoPago.getTable().columns.adjust().draw(false);
            tblGastosCanceladas.getTable().columns.adjust().draw(false);
            tblGastosNotas.getTable().columns.adjust().draw(false);
            tblGastosSueldos.getTable().columns.adjust().draw(false);
            tblIngresoCanceladas.getTable().columns.adjust().draw(false);
            tblIngresoNotas.getTable().columns.adjust().draw(false);
            tblIngresos.getTable().columns.adjust().draw(false);
            tblIngresosSueldos.getTable().columns.adjust().draw(false);
            objClsCliente.tblReporte.getTable().columns.adjust().draw(false);
            tblIngresosTraslado.getTable().columns.adjust().draw(false);
            tblGastosTraslado.getTable().columns.adjust().draw(false);
            tblClientes.getTable().columns.adjust().draw(false);
            tblProveedores.getTable().columns.adjust().draw(false);
            xmlSelect = a.currentTarget.text;
            if (xmlSelect == 'XML Recibidos' || xmlSelect == 'XML Emitidos') {
                $('#BTN-VALIDA-SAT').show();
            }
            else {
                $('#BTN-VALIDA-SAT').hide();
            }
        });
    }

    function getSelect() {
        return xmlSelect;
    }

    function seleccionarTodosEmitidos() {
        let arrayData = tblPrincipal.getAllDataToArray();
        let total = tblPrincipal.table.rows({ search: 'applied' })[0].length;
        let arrayCheck = tblPrincipal.table.rows({ search: 'applied' }).data();
        arrayData.forEach(function (item) {
            for (var i = 0; i < total; i++) {
                if (item.UUID == arrayCheck[i].UUID) item.isSelected = 1;
            }
        });
        tblPrincipal.addRows(arrayData, true, true, true);
    }

    function seleccionarTodosRecibidos() {
        let arrayData = tblSecundario.getAllDataToArray();
        let total = tblSecundario.table.rows({ search: 'applied' })[0].length;
        let arrayCheck = tblSecundario.table.rows({ search: 'applied' }).data();
        arrayData.forEach(function (item) {
            for (var i = 0; i < total; i++) {
                if (item.UUID == arrayCheck[i].UUID) item.isSelected = 1;
            }
        });
        tblSecundario.addRows(arrayData, true, true, true);
    }

    function deseleccionarTodosEmitidos() {
        let arrayData = tblPrincipal.getAllDataToArray();

        arrayData.forEach(function (item) {
            item.isSelected = 0;
        });

        tblPrincipal.addRows(arrayData, true, true, true);
    }

    function deseleccionarTodosRecibidos() {
        let arrayData = tblSecundario.getAllDataToArray();

        arrayData.forEach(function (item) {
            item.isSelected = 0;
        });

        tblSecundario.addRows(arrayData, true, true, true);
    }


    function initEventsPermissions() {
        //! ******Eventos botones permission******//
        //$('#BTN-NEW').on('click', function () {
        //    mdlPrincipal.eventModal(enumEventosModal.NUEVO);
        //    mdlPrincipal.mostrarModal();
        //});

        //$('#BTN-EDIT').on('click', function () {
        //    isRowSelected("BTN-EDIT", enumEventosModal.EDITAR);
        //});

        //$('#BTN-ERASE').on('click', function () {
        //    isRowSelected("BTN-ERASE", enumEventosModal.ELIMINAR);
        //});

        
        $('#BTN-VALIDA-SAT').on('click', function () {
            mdlValidarSATMasivo.isCheckSelected();
        });

        

        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $('#BTN-ADD-FILE').on('click', function () {
            mdlSecundario.setTipoEvento("BTN-ADD-FILE");
            mdlSecundario.mostrarModal();
        });

        $('#BTN-ADD-FILE-NOMINA').on('click', function () {
            mdlSecundarioNomina.setTipoEvento("BTN-ADD-FILE-NOMINA");
            mdlSecundarioNomina.mostrarModal();
        });

        $('#BTN-ADD-ENTREGABLES').on('click', function () {
            mdlEntregablem.setTipoEvento("BTN-ADD-ENTREGABLES");
            mdlEntregablem.mostrarModal();
        });

        $('#BTN-OTROS-SERVICIOS').on('click', function () {
            mdlOtrosServiciosm.setTipoEvento("BTN-OTROS-SERVICIOS");
            mdlOtrosServiciosm.mostrarModal();
        });

        $('#BTN-ESTADO-CUENTA').on('click', function () {
            mdlEstadoCuentam.setTipoEvento("BTN-ESTADO-CUENTA");
            mdlEstadoCuentam.mostrarModal();
        });
        $('#BTN-NOTIFICACIONES').on('click', function () {
            mdlNotificacionesm.setTipoEvento("BTN-NOTIFICACIONES");
            mdlNotificacionesm.mostrarModal();
        });


        //setParamsDatePickerNacimiento();
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


        mdlPrincipal.eventModal(event);
        mdlPrincipal.mostrarModal();


    }

    function validaciones() {


        let principalForm = {};
        //! Setear reglas del formulario
        principalForm = {
            rules: {
                fl_fecha_inicial: "required",
                fl_fecha_final: "required",
                fl_periodo_filtro: "required"
            },
            messages: {
                fl_fecha_inicial: "Ingresa una fecha inicial",
                $fl_fecha_final: "Ingresa una fecha final",
                fl_periodo_filtro: "Ingresa un año"
            }
        }
        $frmFilterPrincipal.validate(principalForm);
    }

    function GenerarPlantillaCOI() {
        let filtersSearch = JSON.stringify(getFilterSearch());

        //window.location = url_Descarga + '?file=' + xml + '&uuid=' + uuid + '&tipo=2';
        window.open(url_Entregable_Excel + '?jsonJS=' + filtersSearch + '&id_RV=' + id_RV, "_blank");


    }

    return {
        init: init,
        //mdlPrincipal: mdlPrincipal,
        tblPrincipal: tblPrincipal,
        tblSecundario: tblSecundario,
        getSelect: getSelect,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        
        refresh: refresh,
        mdlSecundario: mdlSecundario,
        tblRepositorio: tblRepositorio,
        mdlSecundarioNomina: mdlSecundarioNomina,
        tblRepositorioNomina: tblRepositorioNomina,

        mdlEntregablem: mdlEntregablem,
        tblEntregable: tblEntregable,

        mdlOtrosServiciosm: mdlOtrosServiciosm,
        tblOtrosServicios: tblOtrosServicios,

        mdlEstadoCuentam: mdlEstadoCuentam,
        tblEstadoCuenta: tblEstadoCuenta,

        mdlNotificacionesm: mdlNotificacionesm,
        tblNotificaciones: tblNotificaciones,

        getPDF: getPDF,
        getXML: getXML,

        rfc: rfc,
        GenerarPlantillaCOI: GenerarPlantillaCOI

    }
};