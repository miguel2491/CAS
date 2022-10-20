const mdlRlActions = function () {
    //Doom del modal
    var $modalPrincipal = $("#mdlRlActions"),
        eventModal = "edit";

    var tblRlActions = null;
    var tblCtActions = null;
    var objRlActions = {};

    function init() {
        tblRlActions = objClsRoles.tblRlActions;
        tblCtActions = objClsRoles.tblCtActions;
    }

    function setArrayCtActions(array) {
        arrayCtActions = array;
    }

    function setObjRlActions(obj) {
        objRlActions = obj;
    }

    function getObjRlActions() {
        return objRlActions;
    }

    //! Peticiones
    function GetRlAcciones(showWait = false, id_rol_vista, id_vista) {
        let filtersSearch = JSON.stringify({ id_rol_vista: id_rol_vista });

        doAjax("POST", url_Administrador_GetRlVistaAccion, { jsonJS: filtersSearch }, showWait).done(function (data) {
            let arrayRlActions = [];
            let result = new Result(data);
            
            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                arrayRlActions = result.resultStoredProcedure.msnSuccess;

                arrayRlActions.forEach(function (itemRlAction) {
                    itemRlAction.acciones = '<button type="button" class="btn btn-style btn-danger btnDeleteRlActions"><i class="fa fa-trash"></i ></button >';
                    itemRlAction.status = 0; //! Estado por defecto
                    itemRlAction.id_vista = id_vista;
                });

                tblRlActions.addRows($.extend(true, [], arrayRlActions),false,true,true);
            } else
                tblRlActions.clearRows();

            objRlActions[id_rol_vista] = arrayRlActions;
        });
    }

    function GetRlAccionesToObject(id_rol_vista) {
        let arrayRlActions = objRlActions[id_rol_vista];
        let tempArrayRlActions = [];
        
        arrayRlActions.forEach(function (item) {
            if (item.status != -1) {
                tempArrayRlActions.push(item);
            }
        });

        tblRlActions.addRows(tempArrayRlActions,false,true,true);
    }

    function mostrarModal() {
        resetModal();

        switch (eventModal) {
            case 'edit':
                setDatosModal();
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    function resetModal() {
        if (tblCtActions != null) tblCtActions.clearRows();
        if (tblRlActions != null) tblRlActions.clearRows();
    }

    //! Asigna los valores al modal
    function setDatosModal() {
        let selectedRow = objClsRoles.tblRlVistas.getRowSelected();
        let id_rol_vista = selectedRow.id_rol_vista;
        let id_vista = selectedRow.id_vista;

        tblRlActions.clearRows();

        //! Verificar de donde obtener los datos de la RL rol-vista
        if (objRlActions.hasOwnProperty(id_rol_vista))
            GetRlAccionesToObject(id_rol_vista);
        else
            GetRlAcciones(true, id_rol_vista, id_vista);

        //Mostrar modal
        $modalPrincipal.modal();
    }

    function depurarCtActions() {
        let arrayCtActionsTemp = [];
        let tempArrayRlActions = tblRlActions.getAllDataToArray();

        let flag;

        //! Recorrer el catalogo de acciones
        arrayCtActions.forEach(function (itemCt) {
            flag = true; 

            //! Recorrer acciones ya relacionadas a la vista
            tempArrayRlActions.forEach(function (itemRl) {
                if (itemCt.value == itemRl.id_accion) {
                    flag = false; //! Ya esta en en la relacion, por lo que ya no se debe agregar
                }
            });

            if (flag)
                arrayCtActionsTemp.push(itemCt);
        });

        tblCtActions.addRows(arrayCtActionsTemp,true,true,true);
        $("#mdlCtActions").modal();
    }

    //! Establecer el status con el que permanecen las acciones en el objeto contenedor
    function addRlActionsToObj() {
        
        let arrayTblRlActions = tblRlActions.getAllDataToArray();
        let tableRow = objClsRoles.tblRlVistas.getRowSelected();
        let id_rol_vista = tableRow.id_rol_vista;
        let arrayRlActions = objRlActions.hasOwnProperty(id_rol_vista) ? objRlActions[id_rol_vista] : [];
        let flagExist = false;
        let flagExist2 = false;

        //! Buscar los elementos que se agregaran
        arrayTblRlActions.forEach(function (itemRl) { //! Datatable
            flagExist = false;
            for (var i = 0; i < arrayRlActions.length; i++) {
                if (arrayRlActions[i].id_accion == itemRl.id_accion) {
                    if (arrayRlActions[i].id_rol_vista_accion != enumListEstatus.NUEVO && arrayRlActions[i].status != 2) { //! Si existe y tiene un id de relacion, regresar su estatus a 0
                        arrayRlActions[i].status = 0; //! Estado por defecto
                    }
                    flagExist = true
                    break;
                }
            }

            if (!flagExist) {
                arrayRlActions.push({
                    acciones: '<button type="button" class="btn btn-style btn-danger btnDeleteRlActions"><i class="fa fa-trash"></i ></button >  ',
                    id_rol_vista_accion: enumListEstatus.NUEVO,
                    id_rol_vista: tableRow.id_rol_vista,
                    id_accion: itemRl.id_accion,
                    id_vista: tableRow.id_vista,
                    codigo: itemRl.codigo,
                    nombre: itemRl.nombre,
                    status: 1, //! Nuevo registro para asignar nueva relacion
                    id_permiso_servidor: itemRl.id_permiso_servidor
                });
            }
        });

        //! Buscar los elementos que se eliminaran
        arrayRlActions.forEach(function (itemObj,index) {
            flagExist2 = false;
            for (var i = 0; i < arrayTblRlActions.length; i++) {
                if (arrayTblRlActions[i].id_accion == itemObj.id_accion) {
                    flagExist2 = true;
                    break;
                }
            }

            if (!flagExist2) {
                itemObj.status = -1; //! Se elimina
            }
        });
        
        closeModal();
    }

    function addActionsToDtRl() {
        let arrayElementsToAdd = [];
        let closesTrDt = null;
        let dataCt = null;
        let tableRow = objClsRoles.tblRlVistas.getRowSelected();
        let id_rol_vista = tableRow.id_rol_vista;
        let tempRowRl = {};
        
        //! Busca los elementos seleccionados del modal Ct Actions
        $(tblCtActions.getTable().$("input[name='fr_chkRlAction']:checked").map(function () {
            //? obtener datos del catalogo seleccionado
            closesTrDt = $(this).closest('tr');
            dataCt = tblCtActions.getDataFromClosest(closesTrDt);
            
            tempRowRl = {
                acciones: '<button type="button" class="btn btn-style btn-danger btnDeleteRlActions"><i class="fa fa-trash"></i ></button >  ',
                id_rol_vista_accion: getIdRls(dataCt.value, id_rol_vista),
                id_rol_vista: tableRow.id_rol_vista,
                id_accion: dataCt.value,
                id_vista: tableRow.id_vista,
                codigo: dataCt.label,
                nombre: dataCt.nombre,
                id_permiso_servidor: 3
            }
            
            arrayElementsToAdd.push(tempRowRl);
        }));

        if (arrayElementsToAdd.length <= 0)
            return jsSimpleAlert("Alerta", "No ha seleccionado elementos para añadir", "red");
        
        tblRlActions.addRows(arrayElementsToAdd,false);

        closeModal();
    }

    function getIdRls(id_accion, id_rol_vista) {
        let arrayRlActions = objRlActions.hasOwnProperty(id_rol_vista) ? objRlActions[id_rol_vista] : [];

        //! Si se agregan elementos, verificar si ya estaban con anterioridad en la relacion vista-accion, para  así recuperar el id de relacion
        for (var i = 0; i < arrayRlActions.length; i++) {
            if (arrayRlActions[i].id_accion == id_accion) {
                return arrayRlActions[i].id_rol_vista_accion;
            }
        }

        return -1;
    }

    function getRlActions() {
        let arrayRlActions = [];
        let jsonRlsActions = { add: [], delete: [], update: [] };
        
        for (var prop in objRlActions) {
            arrayRlActions = objRlActions[prop];

            arrayRlActions.forEach(function (itemObj) {
                //! Elementos que tengan estatus -1, eliminar, y que tengas id de relacion
                if (itemObj.status == -1 && itemObj.id_rol_vista_accion != enumListEstatus.NUEVO) {
                    jsonRlsActions["delete"].push({
                        id_rol_vista_accion: itemObj.id_rol_vista_accion,
                        id_rol_vista: itemObj.id_rol_vista,
                        id_accion: itemObj.id_accion,
                        id_vista: itemObj.id_vista,
                        id_permiso_servidor: itemObj.id_permiso_servidor
                    });
                }

                //! Elementos que tengan estatus 1, añadir, y que no tengas id de relacion
                if (itemObj.status == 1 && itemObj.id_rol_vista_accion == enumListEstatus.NUEVO) {
                    jsonRlsActions["add"].push({
                        id_rol_vista_accion: enumListEstatus.NUEVO,
                        id_rol_vista: itemObj.id_rol_vista,
                        id_accion: itemObj.id_accion,
                        id_vista: itemObj.id_vista,
                        id_permiso_servidor: itemObj.id_permiso_servidor
                    });
                }

                //! Elementos que tengan estatus 2, update, y que no tengas id de relacion
                if (itemObj.status == 2 && itemObj.id_rol_vista_accion != enumListEstatus.NUEVO) {
                    jsonRlsActions["update"].push({
                        id_rol_vista_accion: itemObj.id_rol_vista_accion,
                        id_rol_vista: itemObj.id_rol_vista,
                        id_accion: itemObj.id_accion,
                        id_vista: itemObj.id_vista,
                        id_permiso_servidor: itemObj.id_permiso_servidor
                    });
                }
            });
        }
        
        return jsonRlsActions;
    }

    function closeModal() {
        $.modal.close();
    }

    //Mensaje de confirmacion
    function confirmModal(paramsConfirm) {
        jsConfirmAlert(this.waitResultModal, paramsConfirm);
    }

    //Funcion que detona la respuesta del mensaje de confirmacion
    function waitResultModal(params) {
        //Si la respuesta fue SI, en el mensaje de confirmacion
        if (params.status) {
            //Determinar por el tipo de evento del modal, que accion realizar
            switch (params.paramsConfirm.eventButton) {
                case 'deleteRlActions':
                    deleteViewsToDtRl();
                    break;
                default:
                    console.log('Lo lamentamos, por el momento no disponemos de ' + params.paramsConfirm.eventButton + '.');
            }
        }

        return false;
    }

    function deleteViewsToDtRl() {
        tblRlActions.deleteRow();
    }

    function cambiar_ddl_permiso_servidor(value_selected_ddl) {
        let row = tblRlActions.getRowSelected();
        let arrayRlActions = objRlActions.hasOwnProperty(row.id_rol_vista) ? objRlActions[row.id_rol_vista] : [];

        //! Elementos que ya tienen una Rlacion en el objeto [objRlActions], son ediciones
        for (var i = 0; i < arrayRlActions.length; i++) {
            if (arrayRlActions[i].id_accion == row.id_accion) {
                if (arrayRlActions[i].status == 0) {
                    arrayRlActions[i].id_permiso_servidor = parseInt(value_selected_ddl);
                    arrayRlActions[i].status = 2;
                }
                break;
            }
        }

        row.id_permiso_servidor = parseInt(value_selected_ddl);
        tblRlActions.updateRow(row);
    }

    return {
        init: init,
        mostrarModal: mostrarModal,
        depurarCtActions: depurarCtActions,
        addActionsToDtRl: addActionsToDtRl,
        addRlActionsToObj: addRlActionsToObj,
        confirmModal: confirmModal,
        waitResultModal: waitResultModal,
        getObjRlActions: getObjRlActions,
        setObjRlActions: setObjRlActions,
        getRlActions: getRlActions,
        setArrayCtActions: setArrayCtActions,
        cambiar_ddl_permiso_servidor: cambiar_ddl_permiso_servidor
    }
};