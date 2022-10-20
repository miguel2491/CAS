using Imageapp.Models.Propiedades;
using Imageapp.Models.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Imageapp.Models.DAL
{
    public class DAL_Administrador
    {
        #region Procedimientos
        public enum Procedimientos
        {
            Administrador_SEL_ListaUsuarios,
            Administrador_ADD_Usuario,
            Administrador_UPD_Usuario,
            Administrador_DEL_Usuario,

            Administrador_SEL_ListaRoles,
            Administrador_ADD_Rol,
            Administrador_UPD_Rol,
            Administrador_DEL_Rol,
            Administrador_SEL_RlVista,
            Administrador_SEL_RlVistaAccion,

            Administrador_SEL_ListaVistas,
            Administrador_ADD_Vista,
            Administrador_UPD_Vista,
            Administrador_DEL_Vista,

            Administrador_SEL_ListaAcciones,
            Administrador_ADD_Accion,
            Administrador_UPD_Accion,
            Administrador_DEL_Accion,

            Administrador_SEL_ListaMenus,
            Administrador_ADD_Menu,
            Administrador_UPD_Menu,
            Administrador_DEL_Menu,
        }
        #endregion

        #region Propiedades

        public P_Administrador p_Administrador { get; set; }
        public Result result { get; set; }

        #endregion

        #region Constructores
        public DAL_Administrador()
        {
            p_Administrador = new P_Administrador();
            result = new Result();
        }
        #endregion

        #region Usuarios

        public void GetUsuarios(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_SEL_ListaUsuarios.ToString(), p_Administrador,jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de usuarios", e);
            }
        }

        public void AddUsuario(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_ADD_Usuario.ToString(), p_Administrador ,jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar usuario", e);
            }
        }

        public void UpdateUsuario(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_UPD_Usuario.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar el usuario", e);
            }
        }

        public void DeleteUsuario(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_DEL_Usuario.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar el usuario", e);
            }
        }

        #endregion

        #region Roles

        public void GetRoles(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_SEL_ListaRoles.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de roles", e);
            }
        }

        public void AddRol(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_ADD_Rol.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar rol", e);
            }
        }

        public void UpdateRol(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_UPD_Rol.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar el rol", e);
            }
        }

        public void DeleteRol(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_DEL_Rol.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar el rol", e);
            }
        }

        public void GetRlVista(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_SEL_RlVista.ToString(), jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener relacion rol-vista", e);
            }
        }

        public void GetRlVistaAccion(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_SEL_RlVistaAccion.ToString(), jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar el rol", e);
            }
        }

        #endregion

        #region Vistas

        public void GetVistas(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_SEL_ListaVistas.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de vistas", e);
            }
        }

        public void AddVista(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_ADD_Vista.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar vista", e);
            }
        }

        public void UpdateVista(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_UPD_Vista.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar la vista", e);
            }
        }

        public void DeleteVista(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_DEL_Vista.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar la vista", e);
            }
        }

        #endregion

        #region Acciones

        public void GetAcciones(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_SEL_ListaAcciones.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de vistas", e);
            }
        }

        public void AddAccion(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_ADD_Accion.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar la accion", e);
            }
        }

        public void UpdateAccion(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_UPD_Accion.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar la accion", e);
            }
        }

        public void DeleteAccion(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_DEL_Accion.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar la accion", e);
            }
        }

        #endregion

        #region Menus

        public void GetMenus(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_SEL_ListaMenus.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de menus", e);
            }
        }

        public void AddMenu(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_ADD_Menu.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar el menú", e);
            }
        }

        public void UpdateMenu(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_UPD_Menu.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar el menú", e);
            }
        }

        public void DeleteMenu(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Administrador_DEL_Menu.ToString(), p_Administrador, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar el menú", e);
            }
        }

        #endregion
    }
}