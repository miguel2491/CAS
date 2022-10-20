using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using Newtonsoft.Json;

namespace Imageapp.Models.Utils
{
    public class StoredProcedure
    {
        //! Variables
        public string _jsonJS { get; set; }
        public string _jsonProperties { get; set; }
        public string _nameProcedure { get; set; }
        protected List<DataParam> _lparametros { get; set; }
        public Object _session { get; private set; }
        public bool _isLogin { get; set; }

        private tbc_Usuarios _usuario = null;

        private DbCommand _command = null;

        //! Contructores
        public StoredProcedure()
        {
            this._nameProcedure = string.Empty;
            this._lparametros = new List<DataParam>();
            this._session = this._session = HttpContext.Current.Session != null ? HttpContext.Current.Session["tbc_Usuarios"] : null;
            this._jsonJS = string.Empty;
            this._jsonProperties = string.Empty;
            this._isLogin = false;
        }

        public StoredProcedure(string nameProcedure)
        {
            this._nameProcedure = nameProcedure;
            this._session = this._session = HttpContext.Current.Session != null ? HttpContext.Current.Session["tbc_Usuarios"] : null;
            this._jsonJS = string.Empty;
            this._jsonProperties = string.Empty;
            this._lparametros = new List<DataParam>();
            this._isLogin = false;
        }

        public StoredProcedure(string nameProcedure, Object jsonProperties, string jsonJS = "")
        {
            this._nameProcedure = nameProcedure;
            this._session = this._session = HttpContext.Current.Session != null ? HttpContext.Current.Session["tbc_Usuarios"] : null;
            this._jsonJS = jsonJS;
            this._jsonProperties = JsonConvert.SerializeObject(jsonProperties);
            this._lparametros = new List<DataParam>();
            this._isLogin = false;
        }

        public StoredProcedure(string nameProcedure, string jsonJS, Object jsonProperties = null)
        {
            this._nameProcedure = nameProcedure;
            this._session = this._session = HttpContext.Current.Session != null ? HttpContext.Current.Session["tbc_Usuarios"] : null;
            this._jsonJS = jsonJS;
            this._jsonProperties = jsonProperties != null ? JsonConvert.SerializeObject(jsonProperties) : string.Empty;
            this._lparametros = new List<DataParam>();
            this._isLogin = false;
        }

        //! Funciones

        public Result EjecutarValidacion()
        {
            var result = new Result();

            using (var context = new Modelo())
            {
                try
                {
                    //! Abrir conexion
                    context.Database.Connection.Open();
                    _command = context.Database.Connection.CreateCommand();
                    _command.CommandText = _nameProcedure;
                    _command.CommandType = System.Data.CommandType.StoredProcedure;
                    if (_lparametros.Count > 0) AddParams();

                    //! Realizar lectura
                    var reader = _command.ExecuteReader();
                    if (!reader.HasRows)
                        throw new Exception("no retorno un result de confirmación.");

                    var jsonResult = new StringBuilder();
                    while (reader.Read())
                        jsonResult.Append(reader.GetValue(0).ToString());

                    result.returnStored(jsonResult.ToString());

                    ValidarMensajeStored(result);
                }
                catch (Exception e)
                {
                    result.setErrorExeption("Al ejecutar el stored procedure [" + _nameProcedure + "]", e);
                }
                finally
                {
                    if (_command != null)
                    {
                        _command.Dispose();
                        _command = null;
                    }
                }
            }

            return result;
        }

        public Result Ejecutar()
        {
            var result = new Result();

            using (var context = new Modelo())
            {
                try
                {
                    if (!_isLogin && _session == null)
                        throw new Exception("la session ha expirado, favor de reingresar al sistema");

                    if (!_isLogin && (_usuario.id_usuario == null || _usuario.id_usuario <= 0))
                        throw new Exception("la session ha expirado, favor de reingresar al sistema");

                    //! Abrir conexion
                    context.Database.Connection.Open();
                    _command = context.Database.Connection.CreateCommand();
                    _command.CommandText = _nameProcedure;
                    _command.CommandType = System.Data.CommandType.StoredProcedure;
                    _command.CommandTimeout = 1200;
                    if (_lparametros.Count > 0) AddParams();

                    //! Realizar lectura
                    var reader = _command.ExecuteReader();
                    if (!reader.HasRows)
                        throw new Exception("no retorno un result de confirmación.");

                    var jsonResult = new StringBuilder();
                    while (reader.Read())
                        jsonResult.Append(reader.GetValue(0).ToString());
                    
                    result.returnStored(jsonResult.ToString());
                    
                    ValidarMensajeStored(result);
                }
                catch (Exception e)
                {
                    result.setErrorExeption("Al ejecutar el stored procedure [" + _nameProcedure + "]", e);
                }
                finally
                {
                    if (_command != null)
                    {
                        _command.Dispose();
                        _command = null;
                    }
                }
            }

            return result;
        }

        public virtual void InicializarStored()
        {
            //! Obtener la sesion del usuario
            if (_session != null)
                _usuario = _session as tbc_Usuarios;

            _lparametros = new List<DataParam>();
            _lparametros.Add(new DataParam("@jsonJS", _jsonJS));
            _lparametros.Add(new DataParam("@jsonProperties", _jsonProperties));
            _lparametros.Add(new DataParam("@idUsuario", _usuario == null ? -1 : _usuario.id_usuario));
        }

        public Result ValidarMensajeStored(Result result)
        {
            result.status = (int)ListaEstatus.Success; //! El flujo termino correctamente

            if (result.resultStoredProcedure.status == (int)ListaEstatus.Error) //! Error en el flujo de Stored Procedure
            {
                result.status = (int)ListaEstatus.Error;
                result.msnError = result.resultStoredProcedure.msnError;
                result.msnErrorComplete = result.msnError;
            }

            return result;
        }

        private void AddParameters(DbParameter[] parametros)
        {
            _command.Parameters.Clear();
            for (int i = 0; i < parametros.Length; i++)
                _command.Parameters.Add(parametros[i]);
        }

        private void AddParams()
        {
            DbParameter[] Parametro = new DbParameter[_lparametros.Count];
            for (int i = 0; i < _lparametros.Count; i++)
            {
                Parametro[i] = _command.CreateParameter();
                Parametro[i].ParameterName = _lparametros[i].Name;
                Parametro[i].Value = _lparametros[i].Value;
            }
            AddParameters(Parametro);
        }
    }
}