//CLASE COLUMNS
const clsColumns = function (table, nameColsStorage) {
    var nameColsStorage = nameColsStorage;
    var tblPrincipal = table;
    var configColumns = null;
    var originalConfig = null;
    var isFromStorage = false;

    const $contentColums = $("#mdlColumns #contentColumns");

    //Funcion auto ejecutable
    (function () {
        let arrayCols = [];
        let tempCol = {};
        
        table.settings()[0].aoColumns.forEach(function (column) {
            tempCol = {
                bVisible: column.bVisible,
                sTitle: column.sTitle,
                targets: column.targets
            }

            arrayCols.push(tempCol);
        });

        originalConfig = arrayCols;

    })();

    function init() {
        let html = "";
        let count = 0;
        let isCkecked;
        let itemCols;

        $contentColums.html("");

        //Obtener la configuracion de las columnas
        configColumns = getLocalStorage();
        
        if (configColumns == null) {
            isFromStorage = false;
            itemCols = originalConfig;
        }
        else {
            itemCols = configColumns.columns;
            isFromStorage = true;
            setConfigColumns(isInit = true); //Iniciar datatable con configuracion
        }

        if (itemCols.length > 0) {
            html += '<div class="form-row">';
            itemCols.forEach(function (column) {
                if (column.bVisible || isFromStorage) {
                    //Se cumplieron los tres elementos por linea
                    if (count == 3) {
                        html += '</div>';
                        html += '<div class="form-row">';
                        count = 0;
                    }

                    isCkecked = column.bVisible ? 'checked' : '';
                    html += '<div class="form-group col-md-4 col-sm-6">';
                    html += '<label>' + column.sTitle + '</label>';
                    html += '<input type="checkbox" ' + isCkecked + '  data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-target="' + column.targets + '" data-text="' + column.sTitle + '" data-size="small">';
                    html += '</div>';

                    count++;
                }
            });
            html += '</div>';
        }
        $contentColums.html(html);

        $('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();
    }

    function setConfigColumns(isInit = false) {
        if (!isInit) {
            getConfigColumns();
            setLocalStorage();
        }

        tblPrincipal.columns(configColumns.visible).visible(true);
        tblPrincipal.columns(configColumns.hidden).visible(false);
        tblPrincipal.rows().recalcHeight();
        tblPrincipal.columns.adjust();
        tblPrincipal.draw(false);
    }

    function getConfigColumns() {
        let objColumns = {
            visible: [], hidden: [], columns: []
        };
        let column = {};

        let target = 0;
        let $toggle;
        let visible;

        $("#mdlColumns input[type = checkbox]").each(function (index) {
            $toggle = $(this).parent();
            target = this.getAttribute("data-target");

            visible = !($($toggle).hasClass("off"));

            column = {
                targets: target,
                sTitle: this.getAttribute("data-text"),
                bVisible: visible
            }

            visible ? objColumns.visible.push(target) : objColumns.hidden.push(target);
            objColumns.columns.push(column);
        });

        configColumns = objColumns;
    }

    function setLocalStorage() {
        let jsonTemp = JSON.stringify(configColumns);

        localStorage.setItem(nameColsStorage, jsonTemp);
    }

    function getLocalStorage() {
        if (nameColsStorage == null)
            return null;

        let jsonTemp = localStorage.getItem(nameColsStorage);

        if (jsonTemp != null)
            return JSON.parse(jsonTemp);
        else
            return null;
    }

    function reset() {
        configColumns = null;
        localStorage.removeItem(nameColsStorage);
        init();
    }

    return {
        init: init,
        setConfigColumns : setConfigColumns,
        reset: reset,
        originalConfig: originalConfig
    }
};