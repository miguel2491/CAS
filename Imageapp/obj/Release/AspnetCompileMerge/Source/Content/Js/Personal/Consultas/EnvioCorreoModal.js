const mdlFechaPago = function () {

    var $formFechaPago = $("#frmFechaPago"),
        $modalFechaPago = $("#mdlFechaPago"),
        eventModal = 'BTN-ACT-FPAGO';

    var $fl_mes = $("#fl_mes");
    var $fl_periodo = $("#fl_periodo");

    //! Mostrar el modal
    function mostrarModal() {
        resetearModal();
        switch (eventModal) {
            case 'BTN-ACT-FPAGO':
                setDatosModal();
                break;
            default:
                jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + eventModal, "red");
        }
    }

    //! Reiniciar valores del formulario
    function resetearModal() {
        $formFechaPago.validate().resetForm();
        $formFechaPago[0].reset();
    }

    //! Asigna los valores al modal
    async function setDatosModal() {
        //setDatosFormulario();//Enviar los datos de la fila seleccionada al formulario del modal
        $modalFechaPago.modal();//Mostrar modal

    }

    function isCheckSelected() {

        if (!$formFechaPago.valid())
            return jsSimpleAlert("Alerta", "Hay elementos en el formulario que debe validar/verificar.", "orange");

        var arrayData;
        
        arrayData = objClsCliente.tblPrincipal.getAllDataToArray()
        
        closeModal();
        let arrayLista = [];
        var aux = 0, conta = 0;
        var totalSeconds = 0;
        var intervalTimer = null;

        //! Configurar alerta
        var $waitMsn = jsSimpleAlertReturn("Espera", "Cargando... <span id='initProgressAlert'></span> de <span id='totalProgressAlert'></span></br>[<label id='minutesTimer'>00</label>:<label id='secondsTimer'>00</label>]");
        $waitMsn.open();
        $initProgressAlert = $("#initProgressAlert");
        $totalProgressAlert = $("#totalProgressAlert");
        $minutesLabel = $("#minutesTimer");
        $secondsLabel = $("#secondsTimer");
        intervalTimer = setInterval(function () {
            ++totalSeconds;
            $secondsLabel.text(pad(totalSeconds % 60));
            $minutesLabel.text(pad(parseInt(totalSeconds / 60)));
        }, 1000);

        arrayData.forEach(function (item) {
            if (item.isSelected == 1) { //! Solo los elementos seleccionados            
                arrayLista.push(new Promise((resolve, reject) => {
                    doAjax("POST", url_Catalogo_SendCorreo, { id_cliente: item.id_cliente, mes: $fl_mes.val(), periodo: $fl_periodo.val(), id_RV: id_RV }).done(function (data) {
                        conta++;
                        $initProgressAlert.text(conta);
                        resolve();
                    }).fail(function () {
                        conta++;
                        $initProgressAlert.text(conta);
                        reject();
                    })
                }));
                aux++;
            }
        });

        if (aux <= 0) {
            $waitMsn.close();
            return jsSimpleAlert("Alerta", "No ha seleccionado algun cliente", "orange");
        }

        $initProgressAlert.text(conta);
        $totalProgressAlert.text(aux)

        Promise.all(arrayLista).then(values => {
            $waitMsn.close();
            window.clearInterval(intervalTimer); //? Cerrra timer del modal de informacion de espera...
            jsSimpleAlert("Correcto", "Los correos se enviarón correctamente.", "green");
            
        }).catch(reason => {
            console.log(reason)
            $waitMsn.close();
            window.clearInterval(intervalTimer); //? Cerrra timer del modal de informacion de espera...
        });
    }
    //Cerrar Modal
    function closeModal() {
        $.modal.close();
    }

    //! Mensaje de confirmacion
    function confirmarModal(paramsConfirm) {
        jsConfirmAlert(this.waitResultModal, paramsConfirm);
    }

    //! Funcion que detona la respuesta del mensaje de confirmacion
    function waitResultModal(params) {
        if (params.status) { // Confirmar clic boton SI
            switch (params.paramsConfirm.eventButton) { //Determinar la accion a realizar
                case 'cerrar_modal':
                    closeModal();
                    break;

                default:
                    jsSimpleAlert("Alerta", "No se ha configurado el tipo de evento," + params.paramsConfirm.eventButton, "red");
            }
        }
        return false;
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }


    function inicializarValidaciones() {
        let principalForm = {};
        //! Setear reglas del formulario
        principalForm = {
            rules: {
                fl_fecha_pago: "required"
            },
            messages: {
                fl_fecha_pago: "Ingresa la fecha de pago"
            }
        }
        $formFechaPago.validate(principalForm);
    }

    return {
        isCheckSelected: isCheckSelected,
        mostrarModal: mostrarModal,
        confirmarModal: confirmarModal,
        waitResultModal: waitResultModal,
        inicializarValidaciones: inicializarValidaciones
    }
};