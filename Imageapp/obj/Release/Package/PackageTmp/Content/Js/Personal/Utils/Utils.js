//Document ready
$(document).ready(function () {
    //$('form').submit(false);

    $('form').on('keyup keypress', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            if (e.currentTarget.id === "frmFichaTecnica") {
                console.log(e);
                return true;
            } else {
                e.preventDefault();
                return false;
            }
        }
    });
});

//Peticiones
function doAjax(method, url, data, showWait = false) {
    let $objWait;

    if (showWait) {
        $objWait = jsSimpleAlertReturn("Espera", "Realizando petición...");
        $objWait.open();
    }
    let $peticion = $.ajax({
        method: method,
        url: url,
        data: data,
        success: function (a, b, c) {
            var result = a;
        }
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
                  
                jsSimpleAlert("Error", "Estatus:" + textStatus + ", HTTP:" + errorThrown);
    })
    .always(function () {
        if (showWait) $objWait.close();
    });

    return $peticion;
}

//Alertas
function showWait() {
    let $objWait;

    $objWait = jsSimpleAlertReturn("Espera", "Realizando petición...");
    $objWait.open();
}

function jsSimpleAlertReturn(title, content, theme = 'orange', icon = "fa fa-spinner fa-spin", animated = true) {
    return $.confirm({
        columnClass: 'col-md-6 col-md-offset-3',
        icon: icon,
        lazyOpen: true,
        title: title,
        content: content,
        type: theme,
        theme: 'modern',
        typeAnimated: animated,
        buttons: {
            close: {
                text: 'Aceptar',
                btnClass: 'd-none',
                action: function () { return false; }
            }
        }
    });
}

function jsSimpleAlert(title, content, theme = 'dark') {
    let icon;
    if (theme == "red")
        icon = "fa fa-times";
    else if (theme == "green")
        icon = "fa fa-check";
    else if (theme == "orange")
        icon = "fa fa-exclamation";
    else
        icon = "fa fa-info"

    $.confirm({
        columnClass: 'col-md-6 col-md-offset-3',
        icon: icon,
        title: title,
        content: content,
        type: theme,
        typeAnimated: true,
        theme: 'modern',
        buttons: {
            close: {
                text: 'Aceptar',
                action: function () { }
            }
        }
    });
}

function jsConfirmAlert(functionListen, paramsConfirm) {
    $.confirm({
        theme: 'modern',
        type: "red",
        title: paramsConfirm.title,
        content: paramsConfirm.message,
        buttons: {
            SI: function () {
                waitResultConfirm(functionListen, {
                    status: true, paramsConfirm: paramsConfirm
                });
            },
            CANCELAR: function () {
                waitResultConfirm(functionListen, {
                    status: false, paramsConfirm: paramsConfirm
                });
            }
        }
    });
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function waitResultConfirm(functionLinsten, paramsResponse) {
    await sleep(200);
    functionLinsten.apply(this, [paramsResponse]);
}

function jsAlertDtServerSide(jqXHR, textStatus) {
    if (textStatus == "success") {
        let jsonResult = jqXHR.responseJSON;

        if (!jsonResult.status)
            jsSimpleAlert("Error", jsonResult.msnError, "red");
        else {
            if (jsonResult.msnSuccess == "")
                jsSimpleAlert("Alerta", "No se encontraron registros", "orange");
        }
    }
}

//Datatable

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (fun /*, initialValue */) {
        "use strict";

        if (this === void  this === null)
        throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var k = 0;
        var accumulator;
        if (arguments.length >= 2) {
            accumulator = arguments[1];
        }
        else {
            do {
                if (k in t) {
                    accumulator = t[k++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++k >= len)
                    throw new TypeError();
            }
            while (true);
        }

        while (k < len) {
            if (k in t)
                accumulator = fun.call(undefined, accumulator, t[k], k, t);
            k++;
        }

        return accumulator;
    };
}


function initDataTable(paramsTable) {
    let dom,
        buttons,
        fixedColumns,
        arrayTotal,
        arrayDes,
        scrollX,
        order,
        rowCallback,
        customizeExcel,
        exportOptionsExcel,
        footerCallback;

    //! configuracion de los botones
    if (!paramsTable.hasOwnProperty('dom')) {
        dom = "<'row'<'col-sm-12 col-md-4'B><'col-sm-12 col-md-4 text-left'l><'col-sm-12 col-md-4 text-right'f>>" +
            "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>";
    } else 
        dom = paramsTable.dom;

    if (!paramsTable.hasOwnProperty('fixedColumns')) {
        fixedColumns = {
            leftColumns: 1
        }
    }
    else
        fixedColumns = paramsTable.fixedColumns;

    if (!paramsTable.hasOwnProperty('descLength')) {
        arrayTotal = [10, 25, 50, -1];
        arrayDes = [10, 25, 50, "Todas"];
    }
    else {
        arrayTotal = paramsTable["descLength"]["arrayTotal"];
        arrayDes = paramsTable["descLength"]["arrayDes"];
    }

    if (!paramsTable.hasOwnProperty('scrollX'))
        scrollX = true
    else
        scrollX = paramsTable.scrollX

    if (paramsTable.hasOwnProperty('serverSide')) {
        processing = true;
        serverSide = true;
        ajax = paramsTable.serverSide;
    } else {
        processing = false;
        serverSide = false;
        ajax = "";
    }

    if (!paramsTable.hasOwnProperty('order'))
        order = [[0, "asc"]];
    else
        order = paramsTable.order;



    if (paramsTable.hasOwnProperty('customizeExcel')) {
        customizeExcel = paramsTable.customizeExcel;
    }
    else {
        customizeExcel = function (xlsx) {
            var sheet = xlsx.xl.worksheets['sheet1.xml'];
            //$('row:first c', sheet).attr('s', '7');

            var indice = 0;
            $('row', sheet).each(function () {
                indice++;
                if (indice == 1) {
                    var heads = $('is t', this);
                    heads.each(function () {
                        var elemento = $(this.parentNode.parentNode);
                        elemento.attr('s', '46');
                    });
                    return false;
                }
            });
        }
    }

    if (paramsTable.hasOwnProperty('exportOptionsExcel')) {
        exportOptionsExcel = paramsTable.exportOptionsExcel;
    }
    else {
        exportOptionsExcel = {
            columns: ':visible' 
        }
    }

    if (paramsTable.hasOwnProperty('buttons')) {
        buttons = paramsTable.buttons;
    } else {
        buttons = [
            {
                extend: 'excelHtml5',
                footer: true,
                title:'',
                text: "Exportar a Excel",
                filename: function () {
                    var name = $(paramsTable.idTable).attr("data-title-datatable");
                    var d = new Date();
                    return name + "_" + d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate();
                },
                customize: customizeExcel,
                exportOptions: exportOptionsExcel
            }
        ];
    }

    if (!paramsTable.hasOwnProperty('rowCallback'))
        rowCallback = null;
    else
        rowCallback = paramsTable.rowCallback;

    if (!paramsTable.hasOwnProperty('footerCallback'))
        footerCallback = null;
    else
        footerCallback = paramsTable.footerCallback;

    $(paramsTable.idTable).DataTable({
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        dom: dom,
        order: order,
        buttons: buttons,
        "lengthMenu": [arrayTotal, arrayDes],
        "scrollX": scrollX,
        columnDefs: paramsTable.columnDefs,
        fixedColumns: fixedColumns,
        rowCallback: rowCallback,
        footerCallback: footerCallback,
        "search": {
            "regex": true
        }
    });
}

//! Funciones generales
function dataToStringDropDown(data, hasAll = true) {
    let html = "";

    if (data.length <= 0)
        return "";
    
    if (hasAll)
        html = '<option value=""> - </option>';

    data.forEach(function (element) {
        html += '<option value="' + element.value + '">' + element.text+ '</option>';
    });

    return html;
}

function setParamsDatePicker() {
    //! Estilo por defecto del timepicker
    $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        closeText: 'Cerrar',
        prevText: '<Ant', nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    }); //Initialise any date pickers
}

function setParamsDatePickerNacimiento() {
    //! Estilo por defecto del timepicker
    $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        closeText: 'Cerrar',
        prevText: '<Ant', nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        //yearRange: "c-120:c"
    }); //Initialise any date pickers
}

function setParamsDateTimePicker() {
    //Estilo por defecto del timepicker
    $('.datetimepicker').datetimepicker({
        changeMonth: true,
        changeYear: true,
        closeText: 'Cerrar',
        prevText: '<Ant', nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        minDate:0
    }); //Initialise any date pickers
}

function validarLetras(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla == 8) return true; // 3
    patron = new RegExp(/[A-zÁ-Úá-ú\s]/); // 4
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}

function validarAlfanumericos(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla == 8) return true; // 3
    patron = new RegExp(/[\wÁ-Úá-ú\s]/); // 4
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}

function validarAlfanumericosEspeciales(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla == 8) return true; // 3
    patron = new RegExp(/[\wÁ-Úá-ú\s.,-\\%()]/); // 4
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}

function validarNumeros(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla == 8) return true; // 3
    patron = new RegExp(/[\d\s]/); // Solo acepta números// 4
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}

function validarNumDecimal(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla == 8) return true; // 3
    patron = new RegExp(/[/^\d*(\.\d{1})?\d{0,1}$/]/); // Numeros decimales 2 digitos// 4
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}

function validarEmail(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla == 8) return true; // 3
    patron = new RegExp(/[\wÁ-Úá-ú\s-.@_]/); // 4
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}

function configModals() {
    let config = {
        escapeClose: false,
        clickClose: false,
        showClose: false,
        closeExisting: false,
        fadeDuration: 100
    }

    $.modal.defaults = config;
}

function initPermisions(contenido) {
    let html = "";
    let listPermissions = {};
    $("#actionView").html(html);

    contenido.forEach(function (permission) {
        if (permission.isVisible) {
            html += '<button type="button" id="' + permission.codigo + '" class="btn btn-action" data-idRUVA="' + permission.id_rol_vista_accion + '">';
            html += '<i class="fa ' + permission.fontAwesome + '"></i>';
            html += '<div>' + permission.nombre + '</div>';
            html += '</button>';
        }
        listPermissions[permission.codigo] = { id_RVA: permission.id_rol_vista_accion, nombre: permission.nombre, isVisible: permission.isVisible == 1 };
    });

    $("#actionView").html(html);
    return listPermissions;
}

function disabledElements(elementDom) {
    $(elementDom).each(function (index, element) {
        $(element).attr('disabled', true);
    });
}

function enabledElements(elementDom) {
    $(elementDom).each(function (index, element) {
        $(element).attr('disabled', false);
    });
}

//CLASE DATATABLE
class clsDataTable {
    constructor() {
        this.table = null;
        this.rowData = null;
        this.closestRow = null;
    }

    setTable(dataTable) {
        this.table = dataTable;
    }

    getTable() {
        return this.table;
    }

    getAllDataToArray() {
        return this.table.rows().data().toArray();
    }

    setRowSelected(rw) {
        this.rowData = this.table.row(rw).data();
        this.closestRow = rw;
    }

    getClosestRow() {
        return this.closestRow;
    }

    getDataFromClosest(tr) {
        return this.table.row(tr).data();
    }

    getRowSelected() {
        return this.rowData;
    }

    addRow(row, hasDraw = true, flagDraw = false) {
        this.table.row.add(row);
        if (hasDraw) this.table.draw(flagDraw);
    }

    addRows(rows, clearRows = true, hasDraw = true, flagDraw = false) {
        if (clearRows) this.table.clear();
        this.table.rows.add(rows);
        if (hasDraw) this.table.draw(flagDraw);
    }

    updateRow(row, hasDraw = true, flagDraw = false ) {
        this.table.row(this.closestRow).data(row);
        if (hasDraw) this.table.draw(flagDraw);
    }

    deleteRow() {
        this.table.row(this.closestRow).remove();
        this.table.draw(false);
    }

    clearRows(hasDraw = true, flagDraw = false) {
        this.table.clear();
        if (hasDraw) this.table.draw(flagDraw);
    }

    adjustColumns() {
        this.table.columns.adjust().draw();
    }

    draw(flagDraw = false) {
        this.table.draw(false);
    }
}

class Result{
    constructor(objResultController) {
        objResultController = JSON.parse(objResultController);

        this.status = objResultController.status;
        this.msnSuccess = objResultController.msnSuccess;
        this.msnError = objResultController.msnError;
        this.msnErrorComplete = objResultController.msnErrorComplete;
        this.resultStoredProcedure = new ResultStoredProcedure(objResultController.resultStoredProcedure);
    }

    //! Parsea a json el contenido del result
    parseJson() {
        if (this.isEmptyJson())
            return false;

        this.msnSuccess = JSON.parse(this.msnSuccess);
        return true;
    }

    //! Validar el flujo de la petición AJAX al controller.
    validResult(parseJsonData = false, showMessage = true) {
        if (this.status < 0 ) {
            if (showMessage) jsSimpleAlert("Alerta", this.msnError, "blue");
            console.log(this.msnErrorComplete);
            return false;
        }

        if (parseJsonData)
            return this.parseJson();

        return true;
    }

    isEmptyJson() {
        if (this.msnSuccess == "" || this.msnSuccess == null || this.msnSuccess == "{}") {
            return true;
        }
        return false;
    }
}

class ResultStoredProcedure {
    constructor(objResultStoredProcedure) {
        this.status = objResultStoredProcedure.status;
        this.msnSuccess = objResultStoredProcedure.msnSuccess;
        this.msnError = objResultStoredProcedure.msnError;
        this.newGuid = objResultStoredProcedure.hasOwnProperty("newGuid") ? objResultStoredProcedure.newGuid : null;
        this.arrayGuid = objResultStoredProcedure.hasOwnProperty("arrayGuid") ? objResultStoredProcedure.arrayGuid : null;
    }

    //! Parsea a json el contenido del stored procedure
    parseJson() {
        if (this.isEmptyJson())
            return false;

        this.msnSuccess = JSON.parse(this.msnSuccess);
        return true;
    }

    //! Validar el resultado del stored.
    validResultStored(parseJsonData = true, showMessage = false) {
        if (this.status < 0) {
            if (showMessage) jsSimpleAlert("Alerta", this.msnError, "blue");
            return false;
        }

        if (parseJsonData)
            return this.parseJson();

        return true;
    }

    isEmptyJson() {
        if (this.msnSuccess == "" || this.msnSuccess == null || this.msnSuccess == "{}") {
            return true;
        }
        return false;
    }
}

function IntegrarAlServidor(url, id_integracion) {
    doAjax("POST", url, { id_integracion: id_integracion }).done(function (data) {
        let result = new Result(data);
        console.log(result);
    });
}

const enumListEstatus = {
    NUEVO: -1,
    DEFAULT: 0,
    ACTUALIZADO: 0,
    ACTIVO: 1,
    INACTIVO: 2,
    SI: 1,
    NO: 0,
    ALMACENADO: 20,
    ENPROCESO: 21,
    ERRORPROCESO: 22,
    INCOMPLETO: 6
};

const enumEventoPermisos = {
    REGIMEN: "regimen",
    CFDI: "cfdi",
    FICHATECNICA: "ficha_tecnica"
};

const enumEventosModal = {
    NUEVO: "create",
    EDITAR: "edit",
    ELIMINAR: "delete",
    REAGENDAR: "reagendar",
    CANCELAR: "cancelar",
    EDITAR_UGENCIAS : "edit_urgencias"
}

var getCURP = function (param, search) {
    /**
     * filtraInconvenientes()
     * Filtra palabras altisonantes en los primeros 4 caracteres del CURP
     * @param {string} str - Los primeros 4 caracteres del CURP
     */
    function filtraInconvenientes(str) {
        var inconvenientes = ['BACA', 'LOCO', 'BUEI', 'BUEY', 'MAME', 'CACA', 'MAMO',
            'CACO', 'MEAR', 'CAGA', 'MEAS', 'CAGO', 'MEON', 'CAKA', 'MIAR', 'CAKO', 'MION',
            'COGE', 'MOCO', 'COGI', 'MOKO', 'COJA', 'MULA', 'COJE', 'MULO', 'COJI', 'NACA',
            'COJO', 'NACO', 'COLA', 'PEDA', 'CULO', 'PEDO', 'FALO', 'PENE', 'FETO', 'PIPI',
            'GETA', 'PITO', 'GUEI', 'POPO', 'GUEY', 'PUTA', 'JETA', 'PUTO', 'JOTO', 'QULO',
            'KACA', 'RATA', 'KACO', 'ROBA', 'KAGA', 'ROBE', 'KAGO', 'ROBO', 'KAKA', 'RUIN',
            'KAKO', 'SENO', 'KOGE', 'TETA', 'KOGI', 'VACA', 'KOJA', 'VAGA', 'KOJE', 'VAGO',
            'KOJI', 'VAKA', 'KOJO', 'VUEI', 'KOLA', 'VUEY', 'KULO', 'WUEI', 'LILO', 'WUEY',
            'LOCA'];

        if (inconvenientes.indexOf(str) > -1) {
            str = str.replace(/^(\w)\w/, '$1X');
        }
        return str;
    }

    /**
     * ajustaCompuesto()
     * Cuando el nombre o los apellidos son compuestos y tienen
     * proposiciones, contracciones o conjunciones, se deben eliminar esas palabras
     * a la hora de calcular el CURP.
     * @param {string} str - String donde se eliminarán las partes que lo hacen compuesto
     */
    function ajustaCompuesto(str) {
        var compuestos = [/\bDA\b/, /\bDAS\b/, /\bDE\b/, /\bDEL\b/, /\bDER\b/, /\bDI\b/,
            /\bDIE\b/, /\bDD\b/, /\bEL\b/, /\bLA\b/, /\bLOS\b/, /\bLAS\b/, /\bLE\b/,
            /\bLES\b/, /\bMAC\b/, /\bMC\b/, /\bVAN\b/, /\bVON\b/, /\bY\b/];

        compuestos.forEach(function (compuesto) {
            if (compuesto.test(str)) {
                str = str.replace(compuesto, '');
            }
        });

        return str;
    }

    /**
     * zeropad()
     * Rellena con ceros un string, para que quede de un ancho determinado.
     * @param {number} ancho - Ancho deseado.
     * @param {number} num - Numero que sera procesado.
     */
    function zeropad(ancho, num) {
        var pad = Array.apply(0, Array.call(0, ancho)).map(function () {
            return 0;
        }).join('');

        return (pad + num).replace(new RegExp('^.*([0-9]{' + ancho + '})$'), '$1');
    }

    var pad = zeropad.bind(null, 2);

    /**
     * primerConsonante()
     * Saca la primer consonante interna del string, y la devuelve.
     * Si no hay una consonante interna, devuelve X.
     * @param {string} str - String del cual se va a sacar la primer consonante.
     */
    function primerConsonante(str) {
        str = str.trim().substring(1).replace(/[AEIOU]/ig, '').substring(0, 1);
        return (str === '') ? 'X' : str;
    }

    /**
     * filtraCaracteres()
     * Filtra convirtiendo todos los caracteres no alfabeticos a X.
     * @param {string} str - String el cual sera convertido.
     */
    function filtraCaracteres(str) {
        return str.toUpperCase().replace(/[\d_\-\.\/\\,]/g, 'X');
    }

    /**
     * estadoValido()
     * Valida si el estado esta en la lista de estados, de acuerdo a la RENAPO.
     * @param {string} str - String con el estado.
     */
    function estadoValido(str) {
        var estado = ['AS', 'BC', 'BS', 'CC', 'CS', 'CH', 'CL', 'CM', 'DF', 'DG',
            'GT', 'GR', 'HG', 'JC', 'MC', 'MN', 'MS', 'NT', 'NL', 'OC', 'PL', 'QT',
            'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ', 'YN', 'ZS', 'NE'];



        return (estado.indexOf(str.toUpperCase()) > -1);
    }

    /**
     * normalizaString()
     * Elimina los acentos, eñes y diéresis que pudiera tener el nombre.
     * @param {string} str - String con el nombre o los apellidos.
     */
    function normalizaString(str) {
        var origen, destino, salida;
        origen = ['Ã', 'À', 'Á', 'Ä', 'Â', 'È', 'É', 'Ë', 'Ê', 'Ì', 'Í', 'Ï', 'Î',
            'Ò', 'Ó', 'Ö', 'Ô', 'Ù', 'Ú', 'Ü', 'Û', 'ã', 'à', 'á', 'ä', 'â',
            'è', 'é', 'ë', 'ê', 'ì', 'í', 'ï', 'î', 'ò', 'ó', 'ö', 'ô', 'ù',
            'ú', 'ü', 'û', 'Ñ', 'ñ', 'Ç', 'ç'];
        destino = ['A', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I',
            'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'a', 'a', 'a', 'a', 'a',
            'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'u',
            'u', 'u', 'u', 'n', 'N', 'c', 'c'];
        str = str.split('');
        salida = str.map(function (char) {
            var pos = origen.indexOf(char);
            return (pos > -1) ? destino[pos].toUpperCase() : char;
        });

        return salida.join('');
    }

    /**
     * agregaDigitoVerificador()
     * Agrega el dígito que se usa para validar el CURP.
     * @param {string} curp_str - String que contiene los primeros 17 caracteres del CURP.
     */
    function agregaDigitoVerificador(curp_str) {
        // Convierte el CURP en un arreglo
        var curp, caracteres, curpNumerico, suma, digito;

        curp = curp_str.substring(0, 17).toUpperCase().split('');
        caracteres = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E',
            'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
            'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
        // Convierte el curp a un arreglo de números, usando la posición de cada
        // carácter, dentro del arreglo `caracteres`.
        curpNumerico = curp.map(function (caracter) {
            return caracteres.indexOf(caracter);
        });
        suma = curpNumerico.reduce(function (prev, valor, indice) {
            return prev + (valor * (18 - indice));
        }, 0);
        digito = (10 - (suma % 10));
        if (digito === 10) {
            digito = 0;
        }
        return curp_str + digito;
    }

    var inicial_nombre, vocal_apellido, posicion_1_4, posicion_14_16, curp;
    if (!estadoValido(param.estado || '__')) {
        param.estado = '__';
    }
    param.nombre = ajustaCompuesto(normalizaString(param.nombre.toUpperCase())).trim();
    param.apellido_paterno = ajustaCompuesto(normalizaString(param.apellido_paterno.toUpperCase())).trim();
    param.apellido_materno = ajustaCompuesto(normalizaString(param.apellido_materno.toUpperCase())).trim();
    // La inicial del primer nombre, o, si tiene mas de 1 nombre Y el primer
    // nombre es uno de la lista de nombres comunes, la inicial del segundo nombre
    inicial_nombre = (function (nombre) {
        var comunes, nombres, primerNombreEsComun;
        comunes = ['MARIA', 'MA', 'MA.', 'JOSE', 'J', 'J.'];
        nombres = nombre.toUpperCase().trim().split(/\s+/);
        primerNombreEsComun = (nombres.length > 1 && comunes.indexOf(nombres[0]) > -1);

        if (primerNombreEsComun) {
            return nombres[1].substring(0, 1);
        }
        if (!primerNombreEsComun) {
            return nombres[0].substring(0, 1);
        }
    }(param.nombre));
    vocal_apellido = param.apellido_paterno.trim().substring(1).replace(/[^AEIOU]/g, '').substring(0, 1);
    vocal_apellido = (vocal_apellido === '') ? 'X' : vocal_apellido;
    posicion_1_4 = [
        param.apellido_paterno.substring(0, 1),
        vocal_apellido,
        param.apellido_materno.substring(0, 1),
        inicial_nombre
    ].join('');
    posicion_1_4 = filtraInconvenientes(filtraCaracteres(posicion_1_4));
    posicion_14_16 = [
        primerConsonante(param.apellido_paterno),
        primerConsonante(param.apellido_materno),
        primerConsonante(param.nombre)
    ].join('');
    var fecha_nacimiento = ['__', '__', '__'];
    if (param.fecha_nacimiento) {
        fecha_nacimiento = param.fecha_nacimiento.split('-');
    }
    param.sexo = param.sexo || '_';
    curp = [
        posicion_1_4,
        fecha_nacimiento[0],
        fecha_nacimiento[1],
        fecha_nacimiento[2],
        param.sexo.toUpperCase(),
        param.estado.toUpperCase(),
        posicion_14_16
    ];
    if (!param.fecha_nacimiento || search !== true) {
        curp.push('XX');
        return curp.join('');
    }
    curp.push(param.homonimia || ((param.fecha_nacimiento || new Date()).getYear() > 1999 ? 'A' : 0));
    return agregaDigitoVerificador(curp.join(''));
};

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}