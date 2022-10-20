const mdlRoles = function () {
    //! Doom del modal
    var $formPrincipal = $("#frmPrincipal"),
        $modalPrincipal = $("#mdlRoles"),
        $titleModal = $("#titleModal"),
        $btnAceptar = $("#titleBtnAceptar"),
        eventModal = "create",
        objOriginal = {};

    var tblRlVistas = null;
    var tblCtVistas = null;
    var arrayCtVistas = [];
    var arrayRlVistas = [];
    var countNewRl = 0;

    //! Inputs del modal
    var $fr_nombre = $("#fr_nombre"),
        $fr_id_estatus = $("#fr_activo")
        
    function init() {
        tblRlVistas = objClsRoles.tblRlVistas;
        tblCtVistas = objClsRoles.tblCtVistas;
        initValidations();
    }

    //! Asigna el tipo de evento del modal
    function typeEvent(flag) {
        eventModal = flag;
    }

    //! Obtiene el tipo de evento del modal
    function getTypeEvent() {
        return eventModal;
    }

    function setArrayCtVistas(array) {
        arrayCtVistas = array;
    }

    //! Peticiones
    function GetRlVistas(showWait = false, id_rol) {
        let dataJS = JSON.stringify({ id_rol: id_rol });
        doAjax("POST", url_Administrador_GetRlVista, { jsonJS: dataJS ,id_RV: id_RV }, showWait).done(function (data) {
            let result = new Result(data);

            if (result.validResult() && result.resultStoredProcedure.validResultStored()) {
                arrayRlVistas = result.resultStoredProcedure.msnSuccess;

                arrayRlVistas.forEach(function (itemRlVista) {
                    itemRlVista.acciones = '<button type="button" class="btn btn-style btn-danger btnDeleteRlVistas"><i class="fa fa-trash"></i ></button>  ';
                    itemRlVista.acciones += '<button type="button" class="btn btn-style btn-info btnEdtiRlVistas"><i class="fa fa-pencil"></i ></button>';
                });

                tblRlVistas.addRows($.extend(true, [], arrayRlVistas));
            } else
                tblRlVistas.clearRows();
        });
    }

    //! Accion para mostrar el modal
    function mostrarModal() {
        resetModal();

        switch (eventModal) {
            case 'create':
                $titleModal.text("Agregar");
                $btnAceptar.text("Agregar");
                $modalPrincipal.modal()
                break;
            case 'edit':
                $titleModal.text("Editar");
                $btnAceptar.text("Actualizar");
                setDatosModal();
                break;
            case 'delete':
                disabledElements("#frmPrincipal input,#frmPrincipal select");
                $titleModal.text("Eliminar");
                $btnAceptar.text("Eliminar");
                setDatosModal();
                $('.nav-tabs a[href="#rlVistas"]').addClass('disabled');
                break;
            default:
                jsSimpleAlert("Alerta","No se ha configurado el tipo de evento," + eventModal,"red");
        }
    }

    //! Asigna los valores al modal
    function setDatosModal() {
        setDatosFromRow();//Enviar los datos de la fila seleccionada al formulario del modal
        $modalPrincipal.modal();//Mostrar modal
    }

    function setDatosFromRow() {
        let tableRow = objClsRoles.tblPrincipal.getRowSelected();
        objOriginal = tableRow;

        //! Asignar datos
        $fr_nombre.val(tableRow.nombre);
        $fr_id_estatus.prop('checked', tableRow.id_estatus == enumListEstatus.ACTIVO)

        GetRlVistas(true, tableRow.id_rol);
    }

    function getDatosFromForm() {
        let objSendStored = {};

        if (eventModal != "delete") {
            objSendStored.nombre = $fr_nombre.val();
            objSendStored.id_estatus = $fr_id_estatus.is(':checked') ? enumListEstatus.ACTIVO : enumListEstatus.INACTIVO;
            objSendStored.RlVistas = getRlViews();
            objSendStored.RlActions = objClsRoles.mdlActions.getRlActions();
        }

        if (eventModal == "edit" || eventModal == "delete") {
            objSendStored.id_rol = objOriginal.id_rol;
        }

        return objSendStored;
    }

    function getRlViews() {
        let tableRow = objClsRoles.tblPrincipal.getRowSelected();
        let jsonRlsViews = { add: [], delete:[], update : [] };
        let tempRlVistasDt = tblRlVistas.getTable().rows().data().toArray();
        let flagDel = false;
        let flagAdd = false;
        let fladUpdate = false;
        let objRlAcciones = objClsRoles.mdlActions.getObjRlActions();
        
        //! Recorrer las relación de vistas original, y verificar las que fueron eliminadas con IdRl y las que la deebn recuperar el idRl
        arrayRlVistas.forEach(function (oriRl) { //? Array de relacion original
            flagDel = false;

            tempRlVistasDt.forEach(function (nowRl) { //? Array de relacion actual
                if (oriRl.id_vista == nowRl.id_vista) {
                    flagDel = true;
                }
            });

            if (!flagDel) { //? No esta en la lista original, por lo que se elimino
                if (eventModal != "create")
                    delete objRlAcciones[oriRl.id_rol_vista]; //! Eliminar las acciones que tenga la vista en el objeto temporal

                jsonRlsViews["delete"].push({ //! Recuperar su id de relacion
                    id_rol: eventModal == "create" ? enumListEstatus.NUEVO: tableRow.id_rol,
                    id_vista: oriRl.id_vista,
                    id_rol_vista: oriRl.id_rol_vista,
                    id_permiso_servidor: oriRl.id_permiso_servidor
                });
            }
        });

        tempRlVistasDt.forEach(function (nowRl) {//? Array de relacion actual
            flagAdd = false; fladUpdate = false;

            arrayRlVistas.forEach(function (oriRl) {//? Array de relacion original
                if (oriRl.id_vista == nowRl.id_vista) {
                    flagAdd = true;
                    if (oriRl.id_permiso_servidor != nowRl.id_permiso_servidor) {
                        fladUpdate = true;
                    }
                }
            });

            if (!flagAdd) { //? No esta en la lista original, por lo que se agrega
                jsonRlsViews["add"].push({ //! Recuperar su id de relacion
                    id_rol: eventModal == "create" ? enumListEstatus.NUEVO : tableRow.id_rol,
                    id_vista: nowRl.id_vista,
                    id_rol_vista: nowRl.id_rol_vista,
                    id_permiso_servidor: nowRl.id_permiso_servidor
                });
            }

            if (flagAdd && fladUpdate) {
                jsonRlsViews["update"].push({ //! Recuperar su id de relacion
                    id_rol: eventModal == "create" ? enumListEstatus.NUEVO : tableRow.id_rol,
                    id_vista: nowRl.id_vista,
                    id_rol_vista: nowRl.id_rol_vista,
                    id_permiso_servidor: nowRl.id_permiso_servidor 
                });
            }

        });

        objClsRoles.mdlActions.setObjRlActions(objRlAcciones);
        return jsonRlsViews;
    }

    function sendToStored() {
        let objSend = {};

        //Valildar formulario
        if (eventModal == "create" || eventModal == "edit") {
            if (!$formPrincipal.valid())
                return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");
        }

        //Objeto de envio al stored
        objSend = getDatosFromForm();
        
        switch (eventModal) {
            case 'create':
                storedAdd(JSON.stringify(objSend));
                break;
            case 'edit':
                storedUpdate(JSON.stringify(objSend));
                break;
            case 'delete':
                storedDelete(JSON.stringify(objSend));
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }
    
    function storedAdd(objSend) {
        let id_RVA = objClsRoles.getlistaPermisos()["BTN-NEW"].id_RVA;
        
        //! Peticion para agregar registro
        doAjax("POST", url_Administrador_AddRol, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA}, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedUpdate(objSend) {
        let id_RVA = objClsRoles.getlistaPermisos()["BTN-NEW"].id_RVA;
        
        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_UpdateRol, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    function storedDelete(objSend) {
        let id_RVA = objClsRoles.getlistaPermisos()["BTN-NEW"].id_RVA;
        
        //! Peticion para actualizar registro
        doAjax("POST", url_Administrador_DeleteRol, { jsonJS: objSend, id_RV: id_RV, id_RVA: id_RVA }, true).done(function (data) {
            finishStoredProcedure(data);
        });
    }

    async function finishStoredProcedure(data) {
        let result = new Result(data);
        
        if (result.validResult() && result.resultStoredProcedure.validResultStored(false, true)) {
            closeModal();
            await sleep(200);

            objClsRoles.getListaPrincipal(true);
            jsSimpleAlert("Correcto", result.resultStoredProcedure.msnSuccess, "green");
        }
    }

    function resetModal() {
        enabledElements("#frmPrincipal input, #frmPrincipal select");
        //Reset forms
        $formPrincipal.validate().resetForm();
        $formPrincipal[0].reset();

        //Establecer status
        $fr_id_estatus.prop('checked', eventModal == "create");

        if (tblRlVistas != null) tblRlVistas.clearRows();
        if (tblCtVistas != null) tblCtVistas.clearRows();
        $('.nav-tabs a[href="#formTab"]').tab('show');
        $('.nav-tabs a[href="#rlVistas"]').removeClass('disabled');

        arrayRlVistas = []; //! Inicializar a vacio, lista de vistas relacionadas
        objClsRoles.mdlActions.setObjRlActions({}); //! Inicializar a vacio lista de acciones relacionadas
        countNewRl = 0;
    }

    //Mensaje de confirmacion
    function confirmModal(paramsConfirm) {
        jsConfirmAlert(this.waitResultModal, paramsConfirm);
    }

    //! Funcion que detona la respuesta del mensaje de confirmacion
    function waitResultModal(params) {
        //Si la respuesta fue SI, en el mensaje de confirmacion
        if (params.status) {
            //Determinar por el tipo de evento del modal, que accion realizar
            switch (params.paramsConfirm.eventButton) {
                case 'cerrar_modal':
                    closeModal();
                    break;
                case 'eliminar':
                    sendToStored();
                    break;
                case 'deleteRlVista':
                    deleteViewsToDtRl();
                    break;
                default:
                    jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
            }
        }

        return false;
    }

    function initValidations() {
        let principalForm = {};

        //Setear rules
        principalForm = {
            rules: {
                fr_nombre: "required"
            },
            messages: {
                fr_nombre: "Ingrese el nombre"
            }
        }

        $formPrincipal.validate(principalForm);
    }

    function closeModal() {
        $.modal.close();
    }

    //! Filtar los registros (vista) que ya esten seleccionadas del catalogo original
    function depurarCtVistas() {
        let arrayCtVistasTemp = [];
        let tempArrayRlVistas = tblRlVistas.getAllDataToArray();

        let flag;

        //! Recorrer el catalogo de las vistas
        arrayCtVistas.forEach(function (itemCt) {
            flag = true; 

            //! Recorrer vistas ya relacionadas al rol
            tempArrayRlVistas.forEach(function (itemRl) {
                if (itemCt.value == itemRl.id_vista) {
                    flag = false; //! Ya esta en en la relacion, por lo que ya no se debe agregar
                }
            });

            if (flag)
                arrayCtVistasTemp.push(itemCt);
        });

        tblCtVistas.addRows(arrayCtVistasTemp,true,true,true);
        $("#mdlCtVistas").modal();
    }

    //! Agregar las vista seleccionadas del catalogo al datatable de relacion rol-vista
    function addCtVistasToDtRlVistas() {
        let arrayElementsToAdd = [];
        let closesTrDt = null;
        let dataCt = null;
        let tableRow = objClsRoles.tblPrincipal.getRowSelected();
        let tempRowRl = {};

        //! Busca los elementos seleccionados del modal Ct Vistas
        $(tblCtVistas.getTable().$("input[name='fr_chkRlVista']:checked").map(function () {
            //? obtener datos del catalogo seleccionado
            closesTrDt = $(this).closest('tr');
            dataCt = tblCtVistas.getDataFromClosest(closesTrDt);

            tempRowRl = {
                acciones: '<button type="button" class="btn btn-style btn-danger btnDeleteRlVistas"><i class="fa fa-trash"></i ></button >  ',
                id_rol_vista: getIdRls(dataCt.value),
                id_rol: eventModal == "create" ? enumListEstatus.NUEVO : tableRow.id_rol,
                id_vista: dataCt.value,
                nombre: dataCt.label,
                pathDescription: dataCt.pathDescription,
                id_permiso_servidor: 3
            }
            tempRowRl.acciones += '<button type="button" class="btn btn-style btn-info btnEdtiRlVistas"><i class="fa fa-pencil"></i ></button>';
            
            arrayElementsToAdd.push(tempRowRl);
        }));

        if (arrayElementsToAdd.length <= 0)
            return jsSimpleAlert("Alerta", "No ha seleccionado elementos para añadir", "red");

        tblRlVistas.addRows(arrayElementsToAdd, false,true,true);
        closeModal();
    }

    function getIdRls(id_vista) {
        //! Si se agregan elementos, verificar si ya estaban con anterioridad en el proceso. Esto para recuperar el id de relacion
        for (var i = 0; i < arrayRlVistas.length; i++) {
            if (arrayRlVistas[i].id_vista == id_vista) {
                return arrayRlVistas[i].id_rol_vista;
            }
        }

        countNewRl--;

        return countNewRl;
    }

    function deleteViewsToDtRl() {
        tblRlVistas.deleteRow();
    }

    function cambiar_ddl_permiso_servidor(value_selected_ddl) {
        let row = tblRlVistas.getRowSelected();
        row.id_permiso_servidor = parseInt(value_selected_ddl);
        tblRlVistas.updateRow(row);
    }
    
    return {
        mostrarModal: mostrarModal,
        sendToStored: sendToStored,
        confirmModal: confirmModal,
        waitResultModal: waitResultModal,
        eventModal: typeEvent,
        getTypeEvent: getTypeEvent,
        depurarCtVistas: depurarCtVistas,
        setArrayCtVistas: setArrayCtVistas,
        addViewsToDtRl: addCtVistasToDtRlVistas,
        deleteViewsToDtRl: deleteViewsToDtRl,
        init: init,
        cambiar_ddl_permiso_servidor: cambiar_ddl_permiso_servidor
    }
};