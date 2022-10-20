const mdlValidarSAT = function () {   

    function isCheckSelected() {
        var arrayData;
        if (objClsClienteRIF.getSelect() == "XML Emitidos") {
            arrayData = objClsClienteRIF.tblPrincipal.getAllDataToArray()
        }
        else {
            arrayData = objClsClienteRIF.tblSecundario.getAllDataToArray()
        }
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
        var indice = 0;
        arrayData.forEach(function (item) {
            indice++;
            if (item.isSelected == 1) { //! Solo los elementos seleccionados            
                arrayLista.push(new Promise((resolve, reject) => {                    
                    setTimeout(function () {
                        doAjax("POST", url_Catalogo_ValidaSAT, { jsonJS: JSON.stringify({ id_xml: item.id_xml }), id_RV: id_RV, uuid: item.UUID, rfcEmisor: item.RFCEmisor, rfcReceptor: item.RFCReceptor, total: item.total, total_original: item.total_original, moneda: item.moneda }).done(function (data) {
                            conta++;
                            $initProgressAlert.text(conta);
                            resolve();
                        }).fail(function () {
                            conta++;
                            $initProgressAlert.text(conta);
                            reject();
                        })
                    }, (indice * 80));                    
                }));
                aux++;
            }
        });

        if (aux <= 0) {
            $waitMsn.close();
            return jsSimpleAlert("Alerta", "No ha seleccionado una fila", "orange");
        }

        $initProgressAlert.text(conta);
        $totalProgressAlert.text(aux)

        Promise.all(arrayLista).then(values => {
            $waitMsn.close();
            window.clearInterval(intervalTimer); //? Cerrra timer del modal de informacion de espera...
            jsSimpleAlert("Correcto", "Los datos se actualizaron correctamente.", "green");
            objClsClienteRIF.refresh();
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


    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }

    return {
        isCheckSelected: isCheckSelected,
        
    }
};