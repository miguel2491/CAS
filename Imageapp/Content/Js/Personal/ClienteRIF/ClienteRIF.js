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
    const id_Table_Deposito = "#tblDeposito";
    const id_Table_Activo_Fijo = "#tblActivoFijo";
    const id_Table_Totales = "#tblTotales";
    const id_Table_IVAs = "#tblIVAs";
    const id_Table_ISRs = "#tblISRs";
    const id_Table_Pagos = "#tblPagos";
    const id_Table_PagosISR = "#tblPagosISR";

    const id_Table_OtrosGastos = "#tblOtrosGastos";

    const id_Table_Ingresos = "#tblXMLIngresos";
    const id_Table_Gastos = "#tblXMLGastos";
    const id_Table_DPersonales = "#tblXMLDPersonales";
    const id_Table_Nominas = "#tblXMLNominas";
    const id_Table_Sueldos = "#tblXMLSueldos";
    const id_Table_Depreciaciones = "#tblXMLDepreciaciones";
    //const id_Table_DepreciacionesTotal = "#tblXMLDepreciacionesTotal";
    const id_Table_DepreciacionesCategoria = "#tblXMLDepreciacionesCategoria";

    const id_Table_NoDeducibles = "#tblXMLNoDeducibles";
    //const idMdl_Colums = "#mdlColumns";
    //const nameColsStorage = "stColsDt_ClientesRIF";
    //var $frmSolicitud = $("#frmSolicitud");
    var tblPrincipal = new clsDataTable();
    var tblSecundario = new clsDataTable();
    var tblRepositorio = new clsDataTable();
    var tblDeposito = new clsDataTable();
    var tblPagos = new clsDataTable();
    var tblPagosISR = new clsDataTable();
    var tblActivoFijo = new clsDataTable();

    var tblTotales = new clsDataTable();
    var tblIVAs = new clsDataTable();
    var tblISRs = new clsDataTable();

    var tblIngresos = new clsDataTable();
    var tblEgresos = new clsDataTable();

    var tblDPersonales = new clsDataTable();
    var tblNominas = new clsDataTable();
    var tblSueldos = new clsDataTable();

    var tblDepreciaciones = new clsDataTable();
    //var tblDepreciacionesTotal = new clsDataTable();
    var tblDepreciacionesCategoria = new clsDataTable();
    var tblNoDeducibles = new clsDataTable();

    var tblOtrosGastos = new clsDataTable();
    //var mdlPrincipal = new mdlClientes();
    var mdlSecundario = new mdlRepositorio();
    var mdlFechaPagoMasivo = new mdlFechaPago();
    var mdlValidarSATMasivo = new mdlValidarSAT();
    var mdlestatusXMLMasivo = new mdlestatusXML();
    var mdlTercero = new mdlDeposito();
    var mdlPagosCliente = new mdlPagos();
    var mdlPagosISRCliente = new mdlPagosISR();
    var mdlActivoFijoCliente = new mdlActivoFijo();

    var mdlOtrosGastos = new mdlOtrosGastosCs();
    //var $frs_id_cliente = $("#frs_id_cliente");
    //var $frs_id_regimen = $("#frs_id_regimen");
    //var colsPrincipal;
    //var colsSecundario;
    var listaPermisos = {};

    var xmlSelect = "Ficha Técnica";
    //! Filtros

    var $frmFilterPrincipal = $("#frmFilterPrincipal");

    var $fl_fecha_inicial = $("#fl_fecha_inicial");
    var $fl_fecha_final = $("#fl_fecha_final");
    var $fl_periodo_filtro = $("#fl_periodo_filtro");
    //var $fl_nombre = $("#fl_nombre");
    var $fl_rfc = $("#fl_rfc");
    var $fl_nombre_razon = $("#fl_nombre_razon");
    //var $fl_ddlRegimen = $("#fl_ddlRegimen");

    //! Datos cabecera
    var $fl_fecha_inicial_RIF = $("#fl_fecha_inicial_RIF");
    var $fl_fecha_inicial_servicio = $("#fl_fecha_inicial_servicio");
    var $fl_ddlSector = $("#fl_ddlSector");
    var $fl_actividad_principal = $("#fl_actividad_principal");
    var $fl_tiene_trabajadores = $("#fl_tiene_trabajadores");
    var $fl_estado_cuenta = $("#fl_estado_cuenta");
    var $fl_ingresos_mayores = $("#fl_ingresos_mayores");
    var $fl_observaciones = $("#fl_observaciones");


    function getListaPermisos() {
        return listaPermisos;
    }

    async function init() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();
        $fl_fecha_inicial.val(moment().format("YYYY-MM-DD"));
        $fl_fecha_final.val(moment().format("YYYY-MM-DD"));
        configModals();
        validaciones();
        await initTables();

        Promise.all([GetCatalogos(), GetPermisos(), GetListaPrincipal(), GetListaSecundario(), GetListaBimestres(), GetListaIngresos(), GetListaGastos(), GetListaNominas(), GetListaDPersonales(), GetListaDepreciaciones(), GetListaSueldos(), GetListaNoDeducible()]).then(function (values) {
            initEvents();
            GetCabeceraPrincipal();
            mdlSecundario.inicializarValidaciones();
            mdlSecundario.inicio();
            mdlTercero.inicializarValidaciones();
            mdlTercero.inicio();
            mdlOtrosGastos.inicializarValidaciones();
            mdlOtrosGastos.inicio();
            mdlPagosCliente.inicializarValidaciones();
            mdlPagosCliente.inicio();
            mdlPagosISRCliente.inicializarValidaciones();
            mdlPagosISRCliente.inicio();

            mdlActivoFijoCliente.inicializarValidaciones();
            mdlActivoFijoCliente.inicio();

            mdlFechaPagoMasivo.inicializarValidaciones();
            mdlestatusXMLMasivo.inicializarValidaciones();
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    async function refresh() {
        let $waitMsn = jsSimpleAlertReturn("Cargando información", "Por favor espere hasta que la página cargue la información necesaria...");
        $waitMsn.open();

        Promise.all([GetPermisos(), GetListaPrincipal(), GetListaSecundario(), GetListaBimestres(), GetListaIngresos(), GetCatalogos(), GetListaGastos(), GetListaNominas(), GetListaDPersonales(), GetListaDepreciaciones(), GetListaSueldos(), GetListaNoDeducible()]).then(function (values) {
            GetCabeceraPrincipal();
            if (xmlSelect == "XML Emitidos" || xmlSelect == "XML Recibidos") {
                $('#BTN-ACT-FPAGO').show();
                $('#BTN-VALIDA-SAT').show();
            }
            else {
                $('#BTN-ACT-FPAGO').hide();
                $('#BTN-VALIDA-SAT').hide();
            }
            $waitMsn.close();
        }).catch(() => {
            $waitMsn.close();
        });
    }

    function GetListaPrincipal(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLEmitidos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
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

    function GetListaSecundario(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLRecibidos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblSecundario.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                else
                    tblSecundario.clearRows();


                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaBimestres(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify({ fl_rfc: $fl_rfc.val(), id_cliente: id_cliente, periodo: $fl_periodo_filtro.val() });

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetBimestresRIF, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    tblTotales.addRows(result.resultStoredProcedure.msnSuccess.tabla_totales, true, true, forzeDraw);
                    tblIVAs.addRows(result.resultStoredProcedure.msnSuccess.tabla_iva, true, true, forzeDraw);
                    tblISRs.addRows(result.resultStoredProcedure.msnSuccess.tabla_isr, true, true, forzeDraw);
                }
                //tblSecundario.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                else {
                    tblTotales.clearRows();
                    tblIVAs.clearRows();
                    tblISRs.clearRows();
                }
                //tblSecundario.clearRows();


                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaIngresos(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLIngresos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblIngresos.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                else
                    tblIngresos.clearRows();


                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaGastos(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLEgresos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblEgresos.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                else
                    tblEgresos.clearRows();


                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaDPersonales(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLDPersonales, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblDPersonales.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                else
                    tblDPersonales.clearRows();


                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaNominas(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLNominas, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblNominas.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                else
                    tblNominas.clearRows();


                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaSueldos(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLSueldos, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    tblSueldos.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                else
                    tblSueldos.clearRows();


                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaDepreciaciones(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLDepreciaciones, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {

                    if (result.resultStoredProcedure.msnSuccess.xml_depreciaciones) {
                        tblDepreciaciones.addRows(result.resultStoredProcedure.msnSuccess.xml_depreciaciones, true, true, forzeDraw);
                    }
                    else {
                        tblDepreciaciones.clearRows();
                    }
                    //if (result.resultStoredProcedure.msnSuccess.tabla_depreciaciones) {
                    //    tblDepreciacionesTotal.addRows(result.resultStoredProcedure.msnSuccess.tabla_depreciaciones, true, true, forzeDraw);
                    //}
                    //else {
                    //    tblDepreciacionesTotal.clearRows();
                    //}
                    if (result.resultStoredProcedure.msnSuccess.tabla_categoria) {
                        tblDepreciacionesCategoria.addRows(result.resultStoredProcedure.msnSuccess.tabla_categoria, true, true, forzeDraw);
                    }
                    else {
                        tblDepreciacionesCategoria.clearRows();
                    }

                }
                else {
                    tblDepreciaciones.clearRows();
                    tblDepreciacionesCategoria.clearRows();
                }

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function GetListaNoDeducible(showWait = false, forzeDraw = false) {
        let filtersSearch = JSON.stringify(getFilterSearch());

        return new Promise(function (resolve, reject) {
            doAjax("POST", url_Catalogos_GetXMLNoDeducible, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                    tblNoDeducibles.addRows(result.resultStoredProcedure.msnSuccess, true, true, forzeDraw);
                }
                else {
                    tblNoDeducibles.clearRows();
                }
                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    //! Obtener los datos de cabecera de la solicutud de estudio
    function GetCabeceraPrincipal(showWait = false) {

        return new Promise(function (resolve, reject) {
            let filtersSearch = JSON.stringify({ id_cliente: id_cliente });
            doAjax("POST", url_Catalogos_GetClienteRIF, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    llenarDatosCabecera(result.resultStoredProcedure.msnSuccess);

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }


    function GenerarEntregableRIF() {
        let filtersSearch = JSON.stringify(getFilterSearch());

        //window.location = url_Descarga + '?file=' + xml + '&uuid=' + uuid + '&tipo=2';
        window.open(url_Entregable_Excel + '?jsonJS=' + filtersSearch + '&id_RV=' + id_RV, "_blank");

        
    }


    function llenarDatosCabecera(cliente) {
        objOriginal = cliente[0];

        $fl_fecha_inicial_RIF.val(objOriginal.fecha_inicial_RIF);
        $fl_fecha_inicial_servicio.val(objOriginal.fecha_inicial_servicio);
        $fl_ddlSector.val(objOriginal.ddlSector);
        $fl_actividad_principal.val(objOriginal.actividad_principal);
        $fl_tiene_trabajadores.prop('checked', objOriginal.tiene_trabajadores);
        $fl_estado_cuenta.prop('checked', objOriginal.estado_cuenta);
        $fl_ingresos_mayores.prop('checked', objOriginal.ingresos_mayores);
        $fl_observaciones.val(objOriginal.observaciones);

    }

    function getDatosCabecera() {

        let objSend = {};

        objSend.fecha_inicial_RIF = $fl_fecha_inicial_RIF.val();
        objSend.fecha_inicial_servicio = $fl_fecha_inicial_servicio.val();
        objSend.ddlSector = $fl_ddlSector.val();
        objSend.actividad_principal = $fl_actividad_principal.val();
        objSend.tiene_trabajadores = $fl_tiene_trabajadores.prop('checked');
        objSend.estado_cuenta = $fl_estado_cuenta.prop('checked');
        objSend.observaciones = $fl_observaciones.val();
        objSend.ingresos_mayores = $fl_ingresos_mayores.prop('checked');
        objSend.id_cliente = id_cliente;
        return objSend;
    }

    function SaveCabeceraPrincipal(showWait = false) {

        return new Promise(function (resolve, reject) {
            let filtersSearch = JSON.stringify(getDatosCabecera());
            doAjax("POST", url_Catalogos_SaveClienteRIF, { jsonJS: filtersSearch, id_RV: id_RV }, showWait).done(function (data) {
                let result = new Result(data);

                if (result.validResult() && result.resultStoredProcedure.validResultStored())
                    llenarDatosCabecera(result.resultStoredProcedure.msnSuccess);

                resolve();

            }).fail(function (jqXHR, textStatus, errorThrown) {
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
                reject();
            });
        });
    }

    function getFilterSearch() {
        let filters = {};

        filters.fl_rfc = $fl_rfc.val();
        filters.fl_nombre_razon = $fl_nombre_razon.val();
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
        filters.id_cliente = id_cliente;
        return filters;
    }

    function clearFilterSearch() {
        $fl_fecha_inicial.val(moment().format("YYYY-MM-DD"));
        $fl_fecha_final.val(moment().format("YYYY-MM-DD"));
    }

    function GetCatalogos() {
        let arrayCatalogos = JSON.stringify({
            arrayCatalogos: "tbc_RIF_Sectores,tbc_Uso_CFDI_I,"
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
        if (contenido.hasOwnProperty("tbc_RIF_Sectores")) {
            $("#fl_ddlSector").html(dataToStringDropDown(contenido.tbc_RIF_Sectores, true));
        }
        if (contenido.hasOwnProperty("tbc_Uso_CFDI_I")) {
            $("#fr_clasificacion_activo_fijo").html(dataToStringDropDown(contenido.tbc_Uso_CFDI_I, true));
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
        //! Definir columnas
        let columnDefs = [
            { visible: true, orderable: false, targets: 0, width: 40, className: "text-center", data: null, render: drawCheckBox },
            { visible: false, orderable: false, searchable: false, targets: 1, width: 0, name: "id_xml", data: "id_xml" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 100, name: "estatus", data: "estatus" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "UUID", data: "UUID" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 130, name: "RFCEmisor", data: "RFCEmisor" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "nombre_emisor", data: "nombre_emisor" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 130, name: "RFCReceptor", data: "RFCReceptor" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 250, name: "nombre_receptor", data: "nombre_receptor" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "fecha_timbrado", data: "fecha_timbrado" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "forma_pago", data: "forma_pago" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 150, name: "metodo_pago", data: "metodo_pago" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 150, name: "fecha_pago", data: "fecha_pago" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 80, name: "version", data: "version" },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 120, name: "tipo", data: "tipo" },
            { visible: true, orderable: true, searchable: true, targets: 15, width: 120, name: "folio", data: "folio" },
            { visible: true, orderable: true, searchable: true, targets: 16, width: 120, name: "usoCFDI", data: "usoCFDI" },
            { visible: true, orderable: true, searchable: true, targets: 17, width: 150, name: "tipo_comprobante", data: "tipo_comprobante" },
            { visible: true, orderable: true, searchable: true, targets: 18, width: 150, name: "subtotal", data: "subtotal" },
            { visible: true, orderable: true, searchable: true, targets: 19, width: 150, name: "impuesto_trasladado", data: "impuesto_trasladado" },
            { visible: true, orderable: true, searchable: true, targets: 20, width: 150, name: "impuesto_retenido", data: "impuesto_retenido" },
            { visible: true, orderable: true, searchable: true, targets: 21, width: 150, name: "descuento", data: "descuento" },
            { visible: true, orderable: true, searchable: true, targets: 22, width: 150, name: "total", data: "total" },
            { visible: true, orderable: true, searchable: true, targets: 23, width: 100, name: "moneda", data: "moneda" },
            { visible: false, orderable: false, searchable: false, targets: 24, width: 150, name: "url_xml", data: "url_xml" },

        ];

        //! Definir objeto estructura del datatable
        let paramsDataTable = {
            columnDefs: columnDefs,
            idTable: idTable_Principal,
            order: [[8, "asc"]]
        }

        initDataTable(paramsDataTable); //! Inicializar datatable
        tblPrincipal.setTable($(idTable_Principal).DataTable()); //! Inicializar clase datatable

        //colsPrincipal = new clsColumns($(idTable_Principal).DataTable(), nameColsStorage);//! Inicializar clase columnas
        //colsPrincipal.init(); //! Init config

        let paramsDataTableSecundario = {
            columnDefs: columnDefs,
            idTable: idTable_Secundario,
            order: [[8, "asc"]]
        }
        initDataTable(paramsDataTableSecundario);
        tblSecundario.setTable($(idTable_Secundario).DataTable()); //! Inicializar clase datatable



        //!Ingresos y Gastos

        let columnDefs2 = [
            { visible: false, orderable: false, targets: 0, width: 40, className: "text-center", data: null, render: drawCheckBox },
            { visible: false, orderable: false, searchable: false, targets: 1, width: 0, name: "id_xml", data: "id_xml" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 100, name: "estatus", data: "estatus" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "UUID", data: "UUID" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 130, name: "RFCEmisor", data: "RFCEmisor" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "nombre_emisor", data: "nombre_emisor" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 130, name: "RFCReceptor", data: "RFCReceptor" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 250, name: "nombre_receptor", data: "nombre_receptor" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "fecha", data: "fecha" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "fecha_timbrado", data: "fecha_timbrado" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "forma_pago", data: "forma_pago" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 150, name: "metodo_pago", data: "metodo_pago" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 150, name: "fecha_pago", data: "fecha_pago" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 80, name: "version", data: "version" },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 120, name: "tipo", data: "tipo" },
            { visible: true, orderable: true, searchable: true, targets: 15, width: 120, name: "folio", data: "folio" },
            { visible: true, orderable: true, searchable: true, targets: 16, width: 120, name: "usoCFDI", data: "usoCFDI" },
            { visible: true, orderable: true, searchable: true, targets: 17, width: 150, name: "tipo_comprobante", data: "tipo_comprobante" },
            { visible: true, orderable: true, searchable: true, targets: 18, width: 150, name: "subtotal", data: "subtotal" },
            { visible: true, orderable: true, searchable: true, targets: 19, width: 150, name: "impuesto_trasladado", data: "impuesto_trasladado" },
            { visible: true, orderable: true, searchable: true, targets: 20, width: 150, name: "impuesto_retenido", data: "impuesto_retenido" },
            { visible: true, orderable: true, searchable: true, targets: 21, width: 150, name: "descuento", data: "descuento" },
            { visible: true, orderable: true, searchable: true, targets: 22, width: 150, name: "total", data: "total" },
            { visible: true, orderable: true, searchable: true, targets: 23, width: 100, name: "moneda", data: "moneda" },
            { visible: false, orderable: false, searchable: false, targets: 24, width: 150, name: "url_xml", data: "url_xml" },

        ];

        let paramsDataTableIngresos = {
            columnDefs: columnDefs2,
            idTable: id_Table_Ingresos,
            order: [[12, "asc"]],
            //footerCallback: function (row, data, start, end, display) {
            //    var api = this.api(), data;

            //    // Remove the formatting to get integer data for summation
            //    var intVal = function (i) {
            //        return typeof i === 'string' ?
            //            i.replace(/[\$,]/g, '') * 1 :
            //            typeof i === 'number' ?
            //                i : 0;
            //    };

            //    var total_registros = api.column(18).data().length;
            //    var subtotal = 0, iva = 0, descuento = 0, total = 0;

            //    for (var i = 0; i < total_registros; i++) {
            //        subtotal += Number(api.column(18).data()[i]);
            //        iva += Number(api.column(19).data()[i]);
            //        descuento += Number(api.column(21).data()[i]);
            //        total += Number(api.column(22).data()[i]);
            //        //subtotal = new Decimal(subtotal).plus(api.column(18).data()[i]);
            //        //iva = new Decimal(iva).plus(api.column(19).data()[i]);
            //        //descuento = new Decimal(descuento).plus(api.column(21).data()[i]);
            //        //total = new Decimal(total).plus(api.column(22).data()[i]);
            //    }

            //    // Update footer
            //    $(api.column(18).footer()).html(
            //        '$ ' + subtotal
            //    );
            //    $(api.column(19).footer()).html(
            //        '$ ' + iva
            //    );
            //    $(api.column(21).footer()).html(
            //        '$ ' + descuento
            //    );
            //    $(api.column(22).footer()).html(
            //        '$ ' + total
            //    );
            //}
        }

        initDataTable(paramsDataTableIngresos); //! Inicializar datatable
        tblIngresos.setTable($(id_Table_Ingresos).DataTable()); //! Inicializar clase datatable

        let paramsDataTableGastos = {
            columnDefs: columnDefs2,
            idTable: id_Table_Gastos,
            order: [[12, "asc"]],
            //footerCallback: function (row, data, start, end, display) {
            //    var api = this.api(), data;

            //    // Remove the formatting to get integer data for summation
            //    var intVal = function (i) {
            //        return typeof i === 'string' ?
            //            i.replace(/[\$,]/g, '') * 1 :
            //            typeof i === 'number' ?
            //                i : 0;
            //    };

            //    var total_registros = api.column(18).data().length;
            //    var subtotal = 0, iva = 0, descuento = 0, total = 0;

            //    for (var i = 0; i < total_registros; i++) {
            //        subtotal += Number(api.column(18).data()[i]);
            //        iva += Number(api.column(19).data()[i]);
            //        descuento += Number(api.column(21).data()[i]);
            //        total += Number(api.column(22).data()[i]);
            //        //subtotal = new Decimal(subtotal).plus(api.column(18).data()[i]);
            //        //iva = new Decimal(iva).plus(api.column(19).data()[i]);
            //        //descuento = new Decimal(descuento).plus(api.column(21).data()[i]);
            //        //total = new Decimal(total).plus(api.column(22).data()[i]);
            //    }

            //    // Update footer
            //    $(api.column(18).footer()).html(
            //        '$ ' + subtotal
            //    );
            //    $(api.column(19).footer()).html(
            //        '$ ' + iva
            //    );
            //    $(api.column(21).footer()).html(
            //        '$ ' + descuento
            //    );
            //    $(api.column(22).footer()).html(
            //        '$ ' + total
            //    );
            //}
        }

        initDataTable(paramsDataTableGastos); //! Inicializar datatable
        tblEgresos.setTable($(id_Table_Gastos).DataTable()); //! Inicializar clase datatable

        let paramsDataTableDPersonales = {
            columnDefs: columnDefs2,
            idTable: id_Table_DPersonales,
            order: [[12, "asc"]],
        }
        initDataTable(paramsDataTableDPersonales); //! Inicializar datatable
        tblDPersonales.setTable($(id_Table_DPersonales).DataTable()); //! Inicializar clase datatable

        let paramsDataTableNominas = {
            columnDefs: columnDefs2,
            idTable: id_Table_Nominas,
            order: [[12, "asc"]],
        }
        initDataTable(paramsDataTableNominas); //! Inicializar datatable
        tblNominas.setTable($(id_Table_Nominas).DataTable()); //! Inicializar clase datatable

        let paramsDataTableSueldos = {
            columnDefs: columnDefs2,
            idTable: id_Table_Sueldos,
            order: [[12, "asc"]],
        }
        initDataTable(paramsDataTableSueldos); //! Inicializar datatable
        tblSueldos.setTable($(id_Table_Sueldos).DataTable()); //! Inicializar clase datatable

        let paramsDataTableDepreciaciones = {
            columnDefs: columnDefs2,
            idTable: id_Table_Depreciaciones,
            order: [[12, "asc"]],
        }
        initDataTable(paramsDataTableDepreciaciones); //! Inicializar datatable
        tblDepreciaciones.setTable($(id_Table_Depreciaciones).DataTable()); //! Inicializar clase datatable

        let paramsDataTableNoDeducible = {
            columnDefs: columnDefs2,
            idTable: id_Table_NoDeducibles,
            order: [[12, "asc"]],
        }
        initDataTable(paramsDataTableNoDeducible); //! Inicializar datatable
        tblNoDeducibles.setTable($(id_Table_NoDeducibles).DataTable()); //! Inicializar clase datatable


        //! Definir columnas Depreciacion Total
        //let columnDefsDepreciacionesTotal = [

        //    { visible: true, orderable: true, searchable: true, targets: 0, width: 100, name: "sigla", data: "sigla" },
        //    { visible: true, orderable: true, searchable: true, targets: 1, width: 450, name: "descripcion", data: "descripcion" },
        //    { visible: false, orderable: true, searchable: true, targets: 2, width: 120, name: "acomulado_enero", data: "acomulado_enero" },
        //    { visible: true, orderable: true, searchable: true, targets: 3, width: 120, name: "depreciacion_enero", data: "depreciacion_enero" },
        //    { visible: false, orderable: true, searchable: true, targets: 4, width: 120, name: "acomulado_febrero", data: "acomulado_febrero" },
        //    { visible: true, orderable: true, searchable: true, targets: 5, width: 120, name: "depreciacion_febrero", data: "depreciacion_febrero" },
        //    { visible: false, orderable: true, searchable: true, targets: 6, width: 120, name: "acomulado_marzo", data: "acomulado_marzo" },
        //    { visible: true, orderable: true, searchable: true, targets: 7, width: 120, name: "depreciacion_marzo", data: "depreciacion_marzo" },
        //    { visible: false, orderable: true, searchable: true, targets: 8, width: 120, name: "acomulado_abril", data: "acomulado_abril" },
        //    { visible: true, orderable: true, searchable: true, targets: 9, width: 120, name: "depreciacion_abril", data: "depreciacion_abril" },
        //    { visible: false, orderable: true, searchable: true, targets: 10, width: 120, name: "acomulado_mayo", data: "acomulado_mayo" },
        //    { visible: true, orderable: true, searchable: true, targets: 11, width: 120, name: "depreciacion_mayo", data: "depreciacion_mayo" },
        //    { visible: false, orderable: true, searchable: true, targets: 12, width: 120, name: "acomulado_junio", data: "acomulado_junio" },
        //    { visible: true, orderable: true, searchable: true, targets: 13, width: 120, name: "depreciacion_junio", data: "depreciacion_junio" },
        //    { visible: false, orderable: true, searchable: true, targets: 14, width: 120, name: "acomulado_julio", data: "acomulado_julio" },
        //    { visible: true, orderable: true, searchable: true, targets: 15, width: 120, name: "depreciacion_julio", data: "depreciacion_julio" },
        //    { visible: false, orderable: true, searchable: true, targets: 16, width: 120, name: "acomulado_agosto", data: "acomulado_agosto" },
        //    { visible: true, orderable: true, searchable: true, targets: 17, width: 120, name: "depreciacion_agosto", data: "depreciacion_agosto" },
        //    { visible: false, orderable: true, searchable: true, targets: 18, width: 120, name: "acomulado_septiembre", data: "acomulado_septiembre" },
        //    { visible: true, orderable: true, searchable: true, targets: 19, width: 120, name: "depreciacion_septiembre", data: "depreciacion_septiembre" },
        //    { visible: false, orderable: true, searchable: true, targets: 20, width: 120, name: "acomulado_octubre", data: "acomulado_octubre" },
        //    { visible: true, orderable: true, searchable: true, targets: 21, width: 120, name: "depreciacion_octubre", data: "depreciacion_octubre" },
        //    { visible: false, orderable: true, searchable: true, targets: 22, width: 120, name: "acomulado_noviembre", data: "acomulado_noviembre" },
        //    { visible: true, orderable: true, searchable: true, targets: 23, width: 120, name: "depreciacion_noviembre", data: "depreciacion_noviembre" },
        //    { visible: false, orderable: true, searchable: true, targets: 24, width: 120, name: "acomulado_diciembre", data: "acomulado_diciembre" },
        //    { visible: true, orderable: true, searchable: true, targets: 25, width: 120, name: "depreciacion_diciembre", data: "depreciacion_diciembre" },
        //];

        //let paramsDataTableDepreciacionesTotal = {
        //    columnDefs: columnDefsDepreciacionesTotal,
        //    idTable: id_Table_DepreciacionesTotal,
        //    order: [[0, "asc"]],
        //}
        //initDataTable(paramsDataTableDepreciacionesTotal); //! Inicializar datatable
        //tblDepreciacionesTotal.setTable($(id_Table_DepreciacionesTotal).DataTable()); //! Inicializar clase datatable


        //! Definir columnas Depreciacion Categoria
        let columnDefsDepreCategoria = [

            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "indice", data: "indice" },
            {
                visible: true, orderable: false, searchable: false, targets: 1, width: 120, name: "clave", data: "clave",
                "render": function (data, type, row) {
                    if (data != "") {
                        return "<b>" + data + "</b>"
                    }
                    return data;
                }
            },
            {
                visible: true, orderable: false, searchable: false, targets: 2, width: 450, name: "descripcion", data: "descripcion",
                "render": function (data, type, row) {
                    if (row.clave != "") {
                        return "<span class='badge badge-pill badge-info'><b>" + data + "</b></span>"
                    }
                    return data;
                }
            },
            { visible: true, orderable: false, searchable: false, targets: 3, width: 180, name: "fecha_adquisicion", data: "fecha_adquisicion" },
            { visible: true, orderable: false, searchable: false, targets: 4, width: 180, name: "fecha_baja", data: "fecha_baja" },
            { visible: true, orderable: false, searchable: false, targets: 5, width: 150, name: "moi", data: "moi" },
            { visible: true, orderable: false, searchable: false, targets: 6, width: 150, name: "dep_acomulado", data: "dep_acomulado" },
            { visible: true, orderable: false, searchable: false, targets: 7, width: 150, name: "saldo_reducir", data: "saldo_reducir" },
            { visible: true, orderable: false, searchable: false, targets: 8, width: 150, name: "deduccion_mensual", data: "deduccion_mensual" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableDepreCategoria = {
            columnDefs: columnDefsDepreCategoria,
            idTable: id_Table_DepreciacionesCategoria,
            fixedColumns: null

        }

        initDataTable(paramsDataTableDepreCategoria);
        tblDepreciacionesCategoria.setTable($(id_Table_DepreciacionesCategoria).DataTable());



        //! Definir columnas Repositorio
        let columnDefsRepo = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 450, name: "descripcion", data: "descripcion" },
            { visible: false, orderable: false, searchable: false, targets: 2, width: 250, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 250, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 5, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "url_archivo", data: "url_archivo" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 300, name: "nombre_archivo", data: "nombre_archivo" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 250, name: "id_repositorio", data: "id_repositorio" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableRepo = {
            columnDefs: columnDefsRepo,
            idTable: id_Table_Repositorio,
            fixedColumns: null

        }

        initDataTable(paramsDataTableRepo);
        tblRepositorio.setTable($(id_Table_Repositorio).DataTable());
        //colsSecundario = new clsColumns($(idTable_Secundario).DataTable(), nameColsStorage);//! Inicializar clase columnas
        //colsSecundario.init(); //! Init config

        //! Definir columnas Deposito
        let columnDefsDepo = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 120, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "mes", data: "mes" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 250, name: "monto", data: "monto" },
            { visible: false, orderable: false, searchable: false, targets: 4, width: 250, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 250, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 7, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 250, name: "id_deposito", data: "id_deposito" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableDepo = {
            columnDefs: columnDefsDepo,
            idTable: id_Table_Deposito,
            fixedColumns: null
        }

        initDataTable(paramsDataTableDepo);
        tblDeposito.setTable($(id_Table_Deposito).DataTable());

        let columnDefsOtrosGastos = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 120, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "mes", data: "mes" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 250, name: "monto", data: "monto" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 250, name: "descripcion", data: "descripcion" },
            { visible: false, orderable: false, searchable: false, targets: 5, width: 250, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 250, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 8, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 250, name: "id_otros_gastos", data: "id_otros_gastos" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableOtrosGastos = {
            columnDefs: columnDefsOtrosGastos,
            idTable: id_Table_OtrosGastos,
            fixedColumns: null
        }

        initDataTable(paramsDataTableOtrosGastos);
        tblOtrosGastos.setTable($(id_Table_OtrosGastos).DataTable());


        //! Definir columnas Activo Fijo
        let columnDefsActivo = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 120, name: "fecha_adquisicion", data: "fecha_adquisicion" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 120, name: "fecha_aplicacion", data: "fecha_aplicacion" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "concepto", data: "concepto" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "monto_mensual", data: "monto_mensual" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "fecha_termino", data: "fecha_termino" },
            { visible: false, orderable: false, searchable: false, targets: 6, width: 250, name: "id_uso_cfdi", data: "id_uso_cfdi" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 350, name: "clasificacion", data: "clasificacion" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "monto", data: "monto" },
            { visible: false, orderable: false, searchable: false, targets: 9, width: 250, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 250, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 12, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 13, width: 250, name: "id_activo_fijo", data: "id_activo_fijo" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTableActivo = {
            columnDefs: columnDefsActivo,
            idTable: id_Table_Activo_Fijo,
            fixedColumns: null
        }

        initDataTable(paramsDataTableActivo);
        tblActivoFijo.setTable($(id_Table_Activo_Fijo).DataTable());


        //! Definir columnas Pagos
        let columnDefsPago = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 150, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "bimestre", data: "bimestre" },

            { visible: true, orderable: true, searchable: true, targets: 3, width: 250, name: "fecha_pago", data: "fecha_pago" },


            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "iva", data: "iva" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "importe", data: "importe" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "recargo", data: "recargo" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 150, name: "impuesto_actualizado", data: "impuesto_actualizado" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "total_pagar", data: "total_pagar" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "monto", data: "monto" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "diferencia", data: "diferencia" },


            { visible: false, orderable: false, searchable: false, targets: 11, width: 250, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 250, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 14, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 15, width: 250, name: "id_pago", data: "id_pago" },
            { visible: false, orderable: false, searchable: false, targets: 16, width: 250, name: "id_bimestre", data: "id_bimestre" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTablePago = {
            columnDefs: columnDefsPago,
            idTable: id_Table_Pagos,
            fixedColumns: null
        }

        initDataTable(paramsDataTablePago);
        tblPagos.setTable($(id_Table_Pagos).DataTable());


        //! Definir columnas Pagos ISR
        let columnDefsPagoISR = [
            { visible: true, orderable: false, searchable: false, targets: 0, width: 120, name: "acciones", data: "acciones" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 150, name: "periodo", data: "periodo" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "bimestre", data: "bimestre" },

            { visible: true, orderable: true, searchable: true, targets: 3, width: 250, name: "fecha_pago", data: "fecha_pago" },


            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "isr", data: "isr" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 150, name: "importe", data: "importe" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "recargo", data: "recargo" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 150, name: "impuesto_actualizado", data: "impuesto_actualizado" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 150, name: "total_pagar", data: "total_pagar" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "monto", data: "monto" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "diferencia", data: "diferencia" },


            { visible: false, orderable: false, searchable: false, targets: 11, width: 250, name: "id_usuario_creo", data: "id_usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 250, name: "usuario_creo", data: "usuario_creo" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 250, name: "fecha_creacion", data: "fecha_creacion" },
            { visible: false, orderable: false, searchable: false, targets: 14, width: 100, name: "id_cliente", data: "id_cliente" },
            { visible: false, orderable: false, searchable: false, targets: 15, width: 250, name: "id_pago", data: "id_pago" },
            { visible: false, orderable: false, searchable: false, targets: 16, width: 250, name: "id_bimestre", data: "id_bimestre" }
        ];

        //! Definir objeto estructura del datatable
        let paramsDataTablePagoISR = {
            columnDefs: columnDefsPagoISR,
            idTable: id_Table_PagosISR,
            fixedColumns: null
        }

        initDataTable(paramsDataTablePagoISR);
        tblPagosISR.setTable($(id_Table_PagosISR).DataTable());


        //! Bimestres
        let columnDefsTotales = [
            { visible: false, orderable: false, searchable: false, targets: 0, width: 0, name: "indice", data: "indice" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 90, name: "bimestre", data: "bimestre" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 120, name: "fecha_inicio", data: "fecha_inicio" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 120, name: "fecha_fin", data: "fecha_fin" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 120, name: "total_depositado", data: "total_depositado" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 120, name: "total_cobrado", data: "total_cobrado" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 120, name: "diferencia", data: "diferencia" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 230, name: "subtotal_publico_general", data: "subtotal_publico_general" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 230, name: "subtotal_cliente_especifico", data: "subtotal_cliente_especifico" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 150, name: "otros_gastos", data: "otros_gastos" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 150, name: "activo_fijo", data: "activo_fijo" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 150, name: "subtotal_egresos", data: "subtotal_egresos" }
        ];
        let paramsDataTableTotales = {
            columnDefs: columnDefsTotales,
            idTable: id_Table_Totales,
            fixedColumns: null
        }

        initDataTable(paramsDataTableTotales);
        tblTotales.setTable($(id_Table_Totales).DataTable());


        let columnDefsIVAs = [
            { visible: false, orderable: false, searchable: false, targets: 0, width: 0, name: "indice", data: "indice" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 90, name: "bimestre", data: "bimestre" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 230, name: "subtotal_publico_general", data: "subtotal_publico_general" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 230, name: "subtotal_cliente_especifico", data: "subtotal_cliente_especifico" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 180, name: "iva_publico_general", data: "iva_publico_general" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 100, name: "factor_sector", data: "factor_sector" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 250, name: "descripcion_sector", data: "descripcion_sector" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 180, name: "iva_cliente_especifico", data: "iva_cliente_especifico" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 130, name: "iva_causado", data: "iva_causado" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 130, name: "iva_porcentaje_acreditable", data: "iva_porcentaje_acreditable" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 130, name: "iva_total", data: "iva_total" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 180, name: "iva_acreditable_aplicable", data: "iva_acreditable_aplicable" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 150, name: "iva_original", data: "iva_original" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 150, name: "iva_pagar", data: "iva_pagar" }
        ];
        let paramsDataTableIVAs = {
            columnDefs: columnDefsIVAs,
            idTable: id_Table_IVAs,
            fixedColumns: null
        }

        initDataTable(paramsDataTableIVAs);
        tblIVAs.setTable($(id_Table_IVAs).DataTable());

        let columnDefsISRs = [
            { visible: false, orderable: false, searchable: false, targets: 0, width: 0, name: "indice", data: "indice" },
            { visible: true, orderable: true, searchable: true, targets: 1, width: 90, name: "bimestre", data: "bimestre" },
            { visible: true, orderable: true, searchable: true, targets: 2, width: 150, name: "ingreso_total", data: "ingreso_total" },
            { visible: true, orderable: true, searchable: true, targets: 3, width: 150, name: "deducciones_nomina", data: "deducciones_nomina" },
            { visible: true, orderable: true, searchable: true, targets: 4, width: 150, name: "deducciones", data: "deducciones" },
            { visible: true, orderable: true, searchable: true, targets: 5, width: 180, name: "base_pago_provisional", data: "base_pago_provisional" },
            { visible: true, orderable: true, searchable: true, targets: 6, width: 150, name: "limite_inferior", data: "limite_inferior" },
            { visible: true, orderable: true, searchable: true, targets: 7, width: 150, name: "excedente", data: "excedente" },
            { visible: true, orderable: true, searchable: true, targets: 8, width: 100, name: "factor_isr", data: "factor_isr" },
            { visible: true, orderable: true, searchable: true, targets: 9, width: 100, name: "porcentaje_isr", data: "porcentaje_isr" },
            { visible: true, orderable: true, searchable: true, targets: 10, width: 180, name: "impuesto_marginal", data: "impuesto_marginal" },
            { visible: true, orderable: true, searchable: true, targets: 11, width: 150, name: "cuota_fija", data: "cuota_fija" },
            { visible: true, orderable: true, searchable: true, targets: 12, width: 150, name: "isr", data: "isr" },
            { visible: true, orderable: true, searchable: true, targets: 13, width: 100, name: "antiguedad", data: "antiguedad" },
            { visible: true, orderable: true, searchable: true, targets: 14, width: 120, name: "porcentaje_reduccion", data: "porcentaje_reduccion" },
            { visible: true, orderable: true, searchable: true, targets: 15, width: 150, name: "isr_original", data: "isr_original" },
            { visible: true, orderable: true, searchable: true, targets: 16, width: 150, name: "isr_pagar", data: "isr_pagar" }
        ];
        let paramsDataTableISRs = {
            columnDefs: columnDefsISRs,
            idTable: id_Table_ISRs,
            fixedColumns: null
        }

        initDataTable(paramsDataTableISRs);
        tblISRs.setTable($(id_Table_ISRs).DataTable());

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



        $('#btnCloseMdlRepo').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlSecundario.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlRepo').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlSecundario.enviarStoredProcedure();
        });

        $('#btnCloseMdlDepo').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlTercero.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlDepo').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlTercero.enviarStoredProcedure();
        });

        $('#btnCloseMdlGasto').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlOtrosGastos.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlGasto').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlOtrosGastos.enviarStoredProcedure();
        });


        $('#btnCloseMdlActivo').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlActivoFijoCliente.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlActivo').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlActivoFijoCliente.enviarStoredProcedure();
        });

        $('#btnCloseMdlPago').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlPagosCliente.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlPago').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlPagosCliente.enviarStoredProcedure();
        });

        $('#btnCloseMdlPagoISR').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlPagosISRCliente.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlPagoISR').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlPagosISRCliente.enviarStoredProcedure();
        });


        $('#btnCloseMdlFecha').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlFechaPagoMasivo.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlFecha').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlFechaPagoMasivo.isCheckSelected();
        });

        $('#btnCloseMdlEstatusXML').on('click', function () { //Evento boton cerrar [modal] Repositorio
            mdlestatusXMLMasivo.confirmarModal({ eventButton: "cerrar_modal", title: "Confirma!", message: "¿Segúro que deséa cancelar la operación?" });
        });

        $('#btnAceptarMdlEstatusXML').on('click', function (e) { //Evento boton aceptar [modal] Repositorio 
            mdlestatusXMLMasivo.isCheckSelected();
        });

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
        //$('#btnClearFilters').on('click', function () {
        //    clearFilterSearch();
        //});

        $('#btnAceptaFrm').on('click', function () {
            SaveCabeceraPrincipal(true);
        });

        $('#btnSearchFilter').on('click', function () {

            if (!$frmFilterPrincipal.valid()) {
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
            }

            GetListaPrincipal(true, true);
            GetListaSecundario(true, true);
            GetListaIngresos(true, true);
            GetListaGastos(true, true);
            GetListaDPersonales(false, true);
            GetListaNominas(false, true);
            GetListaDepreciaciones(false, true);
            GetListaSueldos(false, true);
            GetListaNoDeducible(false, true);

            GetListaBimestres(false, true);
        });

        $("#close-sidebar").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
            tblSecundario.getTable().columns.adjust().draw(false);
            tblIngresos.getTable().columns.adjust().draw(false);
            tblEgresos.getTable().columns.adjust().draw(false);
            tblNominas.getTable().columns.adjust().draw(false);
            tblSueldos.getTable().columns.adjust().draw(false);
            tblDPersonales.getTable().columns.adjust().draw(false);
            tblDepreciaciones.getTable().columns.adjust().draw(false);
            //tblDepreciacionesTotal.getTable().columns.adjust().draw(false);
            tblDepreciacionesCategoria.getTable().columns.adjust().draw(false);
            tblTotales.getTable().columns.adjust().draw(false);
            tblIVAs.getTable().columns.adjust().draw(false);
            tblISRs.getTable().columns.adjust().draw(false);
            tblNoDeducibles.getTable().columns.adjust().draw(false);
        });

        $(".reload").on('click', async function (a) {
            await sleep(200);
            tblPrincipal.getTable().columns.adjust().draw(false);
            tblSecundario.getTable().columns.adjust().draw(false);
            tblIngresos.getTable().columns.adjust().draw(false);
            tblEgresos.getTable().columns.adjust().draw(false);
            tblNominas.getTable().columns.adjust().draw(false);
            tblSueldos.getTable().columns.adjust().draw(false);
            tblDPersonales.getTable().columns.adjust().draw(false);
            tblDepreciaciones.getTable().columns.adjust().draw(false);
            //tblDepreciacionesTotal.getTable().columns.adjust().draw(false);
            tblDepreciacionesCategoria.getTable().columns.adjust().draw(false);
            tblTotales.getTable().columns.adjust().draw(false);
            tblIVAs.getTable().columns.adjust().draw(false);
            tblISRs.getTable().columns.adjust().draw(false);
            tblNoDeducibles.getTable().columns.adjust().draw(false);
            if (a.currentTarget.text == "XML Emitidos" || a.currentTarget.text == "XML Recibidos") {
                $('#BTN-ACT-FPAGO').show();
                $('#BTN-VALIDA-SAT').show();
                $('#BTN-ESTATUS-XML').show();
            }
            else {
                $('#BTN-ACT-FPAGO').hide();
                $('#BTN-VALIDA-SAT').hide();
                $('#BTN-ESTATUS-XML').hide();
            }
            xmlSelect = a.currentTarget.text;

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

        $('#BTN-ACT-FPAGO').on('click', function () {
            mdlFechaPagoMasivo.mostrarModal();
        });

        $('#BTN-ESTATUS-XML').on('click', function () {
            mdlestatusXMLMasivo.mostrarModal();
        });


        $('#BTN-VALIDA-SAT').on('click', function () {
            mdlValidarSATMasivo.isCheckSelected();
        });

        $('#BTN-ADD-FILE').on('click', function () {
            mdlSecundario.setTipoEvento("BTN-ADD-FILE");
            mdlSecundario.mostrarModal();
        });

        $('#BTN-REFRESH').on('click', function () {
            refresh();
        });

        $('#BTN-ADD-DEPOSITO').on('click', function () {
            mdlTercero.setTipoEvento("BTN-ADD-DEPOSITO");
            mdlTercero.mostrarModal();
        });

        $('#BTN-ADD-OTROS-GASTOS').on('click', function () {
            mdlOtrosGastos.setTipoEvento("BTN-ADD-OTROS-GASTOS");
            mdlOtrosGastos.mostrarModal();
        });


        $('#BTN-ADD-ACTIVOFIJO').on('click', function () {
            mdlActivoFijoCliente.setTipoEvento("BTN-ADD-ACTIVOFIJO");
            mdlActivoFijoCliente.mostrarModal();
        });

        $('#BTN-ADD-PAGOS').on('click', function () {
            mdlPagosCliente.setTipoEvento("BTN-ADD-PAGOS");
            mdlPagosCliente.mostrarModal();
        });

        $('#BTN-ADD-PAGOS-ISR').on('click', function () {
            mdlPagosISRCliente.setTipoEvento("BTN-ADD-PAGOS-ISR");
            mdlPagosISRCliente.mostrarModal();
        });

        //$('#BTN-REGIMEN').on('click', function () {
        //    isRowSelected("BTN-REGIMEN", enumEventoPermisos.REGIMEN);
        //});

        //setParamsDatePickerNacimiento();
        setParamsDatePicker();

        if (xmlSelect == "") {
            $('#BTN-ACT-FPAGO').hide();
            $('#BTN-VALIDA-SAT').hide();
            $('#BTN-ESTATUS-XML').hide();
        }


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

    return {
        init: init,
        //mdlPrincipal: mdlPrincipal,
        tblPrincipal: tblPrincipal,
        tblSecundario: tblSecundario,
        tblRepositorio: tblRepositorio,
        tblDeposito: tblDeposito,
        tblActivoFijo: tblActivoFijo,
        tblPagos: tblPagos,
        tblPagosISR: tblPagosISR,
        getlistaPermisos: getListaPermisos,
        getListaPrincipal: GetListaPrincipal,
        getSelect: getSelect,
        refresh: refresh,
        mdlPagosCliente: mdlPagosCliente,
        mdlPagosISRCliente: mdlPagosISRCliente,
        mdlTercero: mdlTercero,
        mdlSecundario: mdlSecundario,
        mdlActivoFijoCliente: mdlActivoFijoCliente,
        mdlOtrosGastos: mdlOtrosGastos,
        tblOtrosGastos: tblOtrosGastos,
        GenerarEntregableRIF: GenerarEntregableRIF
    }
};