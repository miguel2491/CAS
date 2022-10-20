using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Web;

namespace Imageapp.Models.Utils
{
    public class Helper
    {
        public string returnToJsonString(Object objJson)
        {
            return JsonConvert.SerializeObject(objJson);
        }

        public T returnJson<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json.Substring(1, json.Length - 2));
        }

        public T returnJsonObject<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }
    }

    public enum ListaEstatus{
        Success = 0,
        Error = -1
    }
    

    //! Clase usuario, para tener disponible los datos del acceso al sistema
    public class tbc_Usuarios
    {
        public int? id_usuario { get; set; }
        public string rol { get; set; }
        public int? id_rol { get; set; }
        public string nombre { get; set; }
        public string apellido_paterno { get; set; }
        public string apellido_materno { get; set; }
        public string usuario { get; set; }
        public string ultimo_movimiento { get; set; }
        public int activo { get; set; }
        public int id_regimen { get; set; }

        
        public tbc_Usuarios()
        {
            this.id_usuario = -1;
            this.id_rol = -1;
        }
    }

    //! Clase Estudios para Formato JSON
    public class Estudy
    {
        public string patientName { get; set; }
        public string patientId { get; set; }
        public string studyDate { get; set; }
        public string modality { get; set; }
        public string studyDescription { get; set; }
        public string numImages { get; set; }
        public string studyId { get; set; }
        public List<Serie> seriesList { get; set; }
    }

    public class Serie
    {
        public string seriesDescription { get; set; }
        public string seriesNumber { get; set; }
        public List<Image> instanceList { get; set; }
        public string ruta { get; set; }
    }

    public class Image
    {
        public string imageId { get; set; }
        public string temp_id_serie { get; set; }
    }

    //! Clase para asignar parametros al estored procedure
    public class DataParam
    {
        public string Name { get; set; }
        public object Value { get; set; }

        public DataParam(string campo, object valor)
        {
            Name = campo;
            Value = valor;
        }

    }

    //! Clase para asignar obtener datos del result Integracion
    public class ParamsIntegracion
    {
        public string nameStored { get; set; }
        public int id_tipo_integracion { get; set; }
        public string ruta_fisica_archivo { get; set; }
        public string nombre_archivo { get; set; }
        public string ruta_ws_servidor { get; set; }
        public string url_archivo { get; set; }

        public ParamsIntegracion()
        {
            this.nameStored = string.Empty;
            this.id_tipo_integracion = -1;
            this.ruta_fisica_archivo = string.Empty;
            this.nombre_archivo = string.Empty;
            this.ruta_ws_servidor = string.Empty;
            this.url_archivo = string.Empty;
        }

    }

    //public class ParamsConexion
    //{
    //    public string host { get; set; }
    //    public string database { get; set; }
    //    public string username { get; set; }
    //    public string password { get; set; }
    //    public string instancia_servidor { get; set; }

    //    public ParamsConexion()
    //    {
    //        this.host = string.Empty;
    //        this.database = string.Empty;
    //        this.username = string.Empty;
    //        this.password = string.Empty;
    //        this.instancia_servidor = string.Empty;
    //    }
    //}

    public class QR
    {
        public string dataQR { get; set; }
        public string ruta_iis_proyecto { get; set; }
        public string url_qr { get; set; }
        public string url_whats { get; set; }

        public QR()
        {
            this.dataQR = string.Empty;
            this.ruta_iis_proyecto = string.Empty;
            this.url_qr = string.Empty;
            this.url_whats = string.Empty;
        }
    }

    //class Interpretacion_Imagen
    //{
    //    public string ruta { get; set; }
    //    public string nombre { get; set; }
    //    public string ruta_ws_servidor { get; set; }

    //    public Interpretacion_Imagen()
    //    {
    //        this.ruta = string.Empty;
    //        this.nombre = string.Empty;
    //        this.ruta_ws_servidor = string.Empty;
    //    }
    //}

    //class Interpretacion_Archivo
    //{
    //    public string ruta { get; set; }
    //    public string nombre { get; set; }
    //    public string ruta_ws_servidor { get; set; }

    //    public Interpretacion_Archivo()
    //    {
    //        this.ruta = string.Empty;
    //        this.nombre = string.Empty;
    //        this.ruta_ws_servidor = string.Empty;
    //    }
    //}

    class Archivo_Dicom
    {
        public string id_paciente { get; set; }
        public string estudios { get; set; }
        public string id_study_dicom { get; set; }
        public string series { get; set; }
        public string id_estudio_serie { get; set; }
        public string id_imagen_dicom { get; set; }
        public string ruta_local_fisica_inicial { get; set; }
        public string ruta_server_fisica_inicial { get; set; }
        public string ruta_local_fisica_completa { get; set; }
        public string ruta_ws_servidor { get; set; }

        public Archivo_Dicom()
        {
            this.id_paciente = string.Empty;
            this.estudios = string.Empty;
            this.id_study_dicom = string.Empty;
            this.series = string.Empty;
            this.id_estudio_serie = string.Empty;
            this.id_imagen_dicom = string.Empty;
            this.ruta_ws_servidor = string.Empty;
            this.ruta_local_fisica_inicial = string.Empty;
            this.ruta_server_fisica_inicial = string.Empty;
            this.ruta_local_fisica_completa = string.Empty;

        }
    }

    class Datos_Configuracion
    {
        public string id_hospital { get; set; }
        public string ruta_iis_proyecto { get; set; }
        public string subraiz_iis_proyecto { get; set; }
        public string es_servidor { get; set; }
        public string ruta_dicoms { get; set; }
        public string ruta_ws_servidor { get; set; }

        public Datos_Configuracion()
        {
            this.id_hospital = string.Empty;
            this.ruta_iis_proyecto = string.Empty;
            this.subraiz_iis_proyecto = string.Empty;
            this.ruta_dicoms = string.Empty;
            this.es_servidor = string.Empty;
            this.ruta_ws_servidor = string.Empty;
        }
    }
}