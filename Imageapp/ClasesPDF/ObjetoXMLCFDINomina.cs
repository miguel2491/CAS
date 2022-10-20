using System;
using System.IO;
using System.IO.Compression;

namespace sat_ws
{
    class CFDINomina
    {
        //Generales CFDI
        private string efectoComprobante = "";
        private string total = "";
        private string subTotal = "";
        private string fechaGeneracion = "";
        private string version = "";
        private string serie = "";
        private string folio = "";
        private string lugarExpedicion = "";
        private string metodoPago = "";
        private string formaPago = "";
        private string moneda = "";
        private string nombreEmisor = "";
        private string rfcEmisor = "";
        private string regimenFiscalEmsior = "";
        private string nombreReceptor = "";
        private string rfcReceptor = "";
        private string usoCFDI = ""; 
        private string totalImpuestosTrasladados = "";
        private string totalImpuestosRetenidos = "";        
        private string uuid = "";
        private string fechaTimbrado = "";
        private string rfcProvCertif = "";

        //Generales Nómina
        private string tipoNomina = "";
        private string fechaPago = "";
        private string fechaFinalPago = "";
        private string fechaInicialPago = "";
        private string numDiasPagados = "";
        private string totalPercepciones = "";
        private string totalPercepcionesExentas = "";
        private string totalPercepcionesGravadas = "";
        private string totalDeducciones = "";
        private string totalDeduccionesImpuestosRetenidos = "";
        private string totalDeduccionesOtrasDeducciones = "";
        private string totalOtrosPagos = "";
        //Receptor
        private string curp = "";
        private string fechaInicioRelLaboral = ""; 
        private string antiguedad = "";
        private string numSeguridadSocial = "";
        private string tipoContrato = "";
        private string sindicalizado = "";
        private string tipoJornada = "";
        private string tipoRegimen = "";
        private string numeroEmpleado = "";
        private string departamento = "";
        private string puesto = "";
        private string riesgoPuesto = "";
        private string periodicidadPago = "";
        private string banco = "";
        private string cuentaBancaria = "";
        private string salarioDiarioIntegrado = ""; 
        private string claveEntFed = "";
        //Horas extra
        private string dias = "";
        private string tipoHoras = "";
        private string horasExtra = "";
        private string importePagado = "";
        //Incapacidades
        private string diasIncapacidad = "";
        private string tipoIncapacidad = "";
        private string importeMonetario = "";
        //Separacion Indemnizacion
        private string indemnizacionTotalPagado = "";
        private string indemnizacionNumAñosServicio = "";
        private string indemnizacionUltimoSueldoMensOrd = "";
        private string indemnizacionIngresoAcumulable = "";
        private string indemnizacionIngresoNoAcumulable = "";
        //Jubilacion Pension Retiro
        private string jubilacionTotalUnaExhibicion = "";
        private string jubilacionTotalParcialidad = "";
        private string jubilacionMontoDiario = "";
        private string jubilacionIngresoAcumulable = "";
        private string jubilacionIngresoNoAcumulable = "";
        //Sub Contratacion
        private string rfcLabora = "";
        private string porcentajeTiempo = "";


        public string EfectoComprobante
        {
            get
            {
                return efectoComprobante;
            }
            set
            {
                efectoComprobante = value;
            }
        }
        
        public string  Total
        {
            get
            {
                return total;
            }

            set
            {
                total = value;
            }
        }

        public string SubTotal
        {
            get
            {
                return subTotal;
            }

            set
            {
                subTotal = value;
            }
        }

        public string FechaGeneracion
        {
            get
            {
                return fechaGeneracion;
            }

            set
            {
                fechaGeneracion = value;
            }
        }

        public string Version
        {
            get
            {
                return version;
            }

            set
            {
                version = value;
            }
        }

        public string Serie
        {
            get
            {
                return serie;
            }

            set
            {
                serie = value;
            }
        }

        public string Folio
        {
            get
            {
                return folio;
            }

            set
            {
                folio = value;
            }
        }

        public string LugarExpedicion
        {
            get
            {
                return lugarExpedicion;
            }

            set
            {
                lugarExpedicion = value;
            }
        }

        public string MetodoPago
        {
            get
            {
                return metodoPago;
            }

            set
            {
                metodoPago = value;
            }
        }

        public string FormaPago
        {
            get
            {
                return formaPago;
            }

            set
            {
                formaPago = value;
            }
        }

        public string Moneda
        {
            get
            {
                return moneda;
            }

            set
            {
                moneda = value;
            }
        }

        public string NombreEmisor
        {
            get
            {
                return nombreEmisor;
            }

            set
            {
                nombreEmisor = value;
            }
        }

        public string RfcEmisor
        {
            get
            {
                return rfcEmisor;
            }

            set
            {
                rfcEmisor = value;
            }
        }


        public string RegimenFiscalEmsior
        {
            get
            {
                return regimenFiscalEmsior;
            }

            set
            {
                regimenFiscalEmsior = value;
            }
        }

        public string NombreReceptor
        {
            get
            {
                return nombreReceptor;
            }

            set
            {
                nombreReceptor = value;
            }
        }

        public string RfcReceptor
        {
            get
            {
                return rfcReceptor;
            }

            set
            {
                rfcReceptor = value;
            }
        }

        public string UsoCFDI
        {
            get
            {
                return usoCFDI;
            }

            set
            {
                usoCFDI = value;
            }
        }
        public string TotalImpuestosTrasladados
        {
            get
            {
                return totalImpuestosTrasladados;
            }

            set
            {
                totalImpuestosTrasladados = value;
            }
        }
        public string TotalImpuestosRetenidos
        {
            get
            {
                return totalImpuestosRetenidos;
            }

            set
            {
                totalImpuestosRetenidos = value;
            }
        }


        public string UUID
        {
            get
            {
                return uuid;
            }

            set
            {
                uuid = value;
            }
        }
        public string FechaTimbrado
        {
            get
            {
                return fechaTimbrado;
            }

            set
            {
                fechaTimbrado = value;
            }
        }

        public string RfcProvCertif
        {
            get
            {
                return rfcProvCertif;
            }

            set
            {
                rfcProvCertif = value;
            }
        }

        //Complemento Nomina

        public string TipoNomina
        {
            get
            {
                return tipoNomina;
            }

            set
            {
                tipoNomina = value;
            }
        }
        public string FechaPago
        {
            get
            {
                return fechaPago;
            }

            set
            {
                fechaPago = value;
            }
        }
        public string FechaFinalPago
        {
            get
            {
                return fechaFinalPago;
            }

            set
            {
                fechaFinalPago = value;
            }
        }
        public string FechaInicialPago
        {
            get
            {
                return fechaInicialPago;
            }

            set
            {
                fechaInicialPago = value;
            }
        }
        public string NumDiasPagados
        {
            get
            {
                return numDiasPagados;
            }

            set
            {
                numDiasPagados = value;
            }
        }
        public string TotalPercepciones
        {
            get
            {
                return totalPercepciones;
            }

            set
            {
                totalPercepciones = value;
            }
        }
        public string TotalPercepcionesExentas
        {
            get
            {
                return totalPercepcionesExentas;
            }

            set
            {
                totalPercepcionesExentas = value;
            }
        }
        public string TotalPercepcionesGravadas
        {
            get
            {
                return totalPercepcionesGravadas;
            }

            set
            {
                totalPercepcionesGravadas = value;
            }
        }
        public string TotalDeducciones
        {
            get
            {
                return totalDeducciones;
            }

            set
            {
                totalDeducciones = value;
            }
        }
        public string TotalDeduccionesImpuestosRetenidos
        {
            get
            {
                return totalDeduccionesImpuestosRetenidos;
            }

            set
            {
                totalDeduccionesImpuestosRetenidos = value;
            }
        }
        public string TotalDeduccionesOtrasDeducciones
        {
            get
            {
                return totalDeduccionesOtrasDeducciones;
            }

            set
            {
                totalDeduccionesOtrasDeducciones = value;
            }
        }
        public string TotalOtrosPagos
        {
            get
            {
                return totalOtrosPagos;
            }

            set
            {
                totalOtrosPagos = value;
            }
        }
        public string Curp
        {
            get
            {
                return curp;
            }

            set
            {
                curp = value;
            }
        }
        public string FechaInicioRelLaboral
        {
            get
            {
                return fechaInicioRelLaboral;
            }

            set
            {
                fechaInicioRelLaboral = value;
            }
        }

        public string Antiguedad
        {
            get
            {
                return antiguedad;
            }

            set
            {
                antiguedad = value;
            }
        }
        public string NumSeguridadSocial
        {
            get
            {
                return numSeguridadSocial;
            }

            set
            {
                numSeguridadSocial = value;
            }
        }
        public string TipoContrato
        {
            get
            {
                return tipoContrato;
            }

            set
            {
                tipoContrato = value;
            }
        }
        public string Sindicalizado
        {
            get
            {
                return sindicalizado;
            }

            set
            {
                sindicalizado = value;
            }
        }
        public string TipoJornada
        {
            get
            {
                return tipoJornada;
            }

            set
            {
                tipoJornada = value;
            }
        }
        public string TipoRegimen
        {
            get
            {
                return tipoRegimen;
            }

            set
            {
                tipoRegimen = value;
            }
        }
        public string NumeroEmpleado
        {
            get
            {
                return numeroEmpleado;
            }

            set
            {
                numeroEmpleado = value;
            }
        }
        public string Departamento
        {
            get
            {
                return departamento;
            }

            set
            {
                departamento = value;
            }
        }
        public string Puesto
        {
            get
            {
                return puesto;
            }

            set
            {
                puesto = value;
            }
        }
        public string RiesgoPuesto
        {
            get
            {
                return riesgoPuesto;
            }

            set
            {
                riesgoPuesto = value;
            }
        }
        public string PeriodicidadPago
        {
            get
            {
                return periodicidadPago;
            }

            set
            {
                periodicidadPago = value;
            }
        }
        public string Banco
        {
            get
            {
                return banco;
            }

            set
            {
                banco = value;
            }
        }
        public string CuentaBancaria
        {
            get
            {
                return cuentaBancaria;
            }

            set
            {
                cuentaBancaria = value;
            }
        }
        public string SalarioDiarioIntegrado
        {
            get
            {
                return salarioDiarioIntegrado;
            }

            set
            {
                salarioDiarioIntegrado = value;
            }
        }

        public string ClaveEntFed
        {
            get
            {
                return claveEntFed;
            }

            set
            {
                claveEntFed = value;
            }
        }

        public string Dias
        {
            get
            {
                return dias;
            }

            set
            {
                dias = value;
            }
        }
        public string TipoHoras
        {
            get
            {
                return tipoHoras;
            }

            set
            {
                tipoHoras = value;
            }
        }
        public string HorasExtra
        {
            get
            {
                return horasExtra;
            }

            set
            {
                horasExtra = value;
            }
        }
        public string ImportePagado
        {
            get
            {
                return importePagado;
            }

            set
            {
                importePagado = value;
            }
        }
        public string DiasIncapacidad
        {
            get
            {
                return diasIncapacidad;
            }

            set
            {
                diasIncapacidad = value;
            }
        }
        public string TipoIncapacidad
        {
            get
            {
                return tipoIncapacidad;
            }

            set
            {
                tipoIncapacidad = value;
            }
        }
        public string ImporteMonetario
        {
            get
            {
                return importeMonetario;
            }

            set
            {
                importeMonetario = value;
            }
        }
        public string IndemnizacionTotalPagado
        {
            get
            {
                return indemnizacionTotalPagado;
            }

            set
            {
                indemnizacionTotalPagado = value;
            }
        }
        public string IndemnizacionNumAñosServicio
        {
            get
            {
                return indemnizacionNumAñosServicio;
            }

            set
            {
                indemnizacionNumAñosServicio = value;
            }
        }
        public string IndemnizacionUltimoSueldoMensOrd
        {
            get
            {
                return indemnizacionUltimoSueldoMensOrd;
            }

            set
            {
                indemnizacionUltimoSueldoMensOrd = value;
            }
        }
        public string IndemnizacionIngresoAcumulable
        {
            get
            {
                return indemnizacionIngresoAcumulable;
            }

            set
            {
                indemnizacionIngresoAcumulable = value;
            }
        }
        public string IndemnizacionIngresoNoAcumulable
        {
            get
            {
                return indemnizacionIngresoNoAcumulable;
            }

            set
            {
                indemnizacionIngresoNoAcumulable = value;
            }
        }
        public string JubilacionTotalUnaExhibicion
        {
            get
            {
                return jubilacionTotalUnaExhibicion;
            }

            set
            {
                jubilacionTotalUnaExhibicion = value;
            }
        }
        public string JubilacionTotalParcialidad
        {
            get
            {
                return jubilacionTotalParcialidad;
            }

            set
            {
                jubilacionTotalParcialidad = value;
            }
        }
        public string JubilacionMontoDiario
        {
            get
            {
                return jubilacionMontoDiario;
            }

            set
            {
                jubilacionMontoDiario = value;
            }
        }
        public string JubilacionIngresoAcumulable
        {
            get
            {
                return jubilacionIngresoAcumulable;
            }

            set
            {
                jubilacionIngresoAcumulable = value;
            }
        }
        public string JubilacionIngresoNoAcumulable
        {
            get
            {
                return jubilacionIngresoNoAcumulable;
            }

            set
            {
                jubilacionIngresoNoAcumulable = value;
            }
        }
        public string RfcLabora
        {
            get
            {
                return rfcLabora;
            }

            set
            {
                rfcLabora = value;
            }
        }
        public string PorcentajeTiempo
        {
            get
            {
                return porcentajeTiempo;
            }

            set
            {
                porcentajeTiempo = value;
            }
        }

    }
}
