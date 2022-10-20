using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Imageapp.Models.Utils
{
    public class Result
    {
        public int status { get; set; }
        public string msnSuccess { get; set; }
        public string msnError { get; set; }
        public string msnErrorComplete { get; set; }
        public ResultStoredProcedure resultStoredProcedure { get; set; }

        public Result()
        {
            this.status = (int)ListaEstatus.Error;
            this.msnSuccess = string.Empty;
            this.msnError = string.Empty;
            this.msnErrorComplete = string.Empty;
            this.resultStoredProcedure = new ResultStoredProcedure();
        }

        public Result(int cabecera, int detalle)
        {
            this.status = cabecera;
            this.msnSuccess = string.Empty;
            this.msnError = string.Empty;
            this.msnErrorComplete = string.Empty;
            this.resultStoredProcedure = new ResultStoredProcedure();
            this.resultStoredProcedure.status = detalle;
        }

        public void returnStored(string msnSuccess)
        {
            //this.msnSuccess = msnSuccess;
            this.resultStoredProcedure = JsonConvert.DeserializeObject<ResultStoredProcedure>(msnSuccess.Substring(1, msnSuccess.Length - 2));
        }

        public T returnJson<T>()
        {
            return JsonConvert.DeserializeObject<T>(this.resultStoredProcedure.msnSuccess.Substring(1, this.resultStoredProcedure.msnSuccess.Length -2));
        }

        public T returnJsonObject<T>()
        {
            return JsonConvert.DeserializeObject<T>(this.resultStoredProcedure.msnSuccess);
        }
        
        public String returnToJsonString()
        {
            return JsonConvert.SerializeObject(this);
        }

        public void setErrorExeption(string error, Exception e, string tipo = "Alerta")
        {
            this.msnError = string.Concat("[", tipo, "]", "[", error, "]", "[", e.Message, "]");
            this.msnErrorComplete = string.Concat("[", tipo, "]", "[", error, "]", "[", e.ToString(), "]");
            this.status = (int)ListaEstatus.Error;
            this.resultStoredProcedure.status = (int)ListaEstatus.Error;
        }

        public void setError(string error, string tipo = "Alerta")
        {
            this.msnError = string.Concat("[", tipo, "]", "[", error, "]");
            this.msnErrorComplete = string.Concat("[", tipo, "]", "[", error, "]");
            this.status = (int)ListaEstatus.Error;
            this.resultStoredProcedure.status = (int)ListaEstatus.Error;
        }
    }

    //! Clase para serializar o deserealizar JSON Stores procedure
    public class ResultStoredProcedure
    {
        public int status { get; set; }
        public string msnSuccess { get; set; }
        public string msnError { get; set; }
        public string newGuid { get; set; }
        public string arrayGuid { get; set; }

        public ResultStoredProcedure()
        {
            this.status = (int)ListaEstatus.Error;
            this.msnSuccess = string.Empty;
            this.msnError = string.Empty;
            this.newGuid = null;
            this.arrayGuid = null;
        }

        public String returnToJsonString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}