using System;
using System.Linq;
//using System.Windows.Forms;
using System.Xml.Linq;
using System.IO;

namespace sat_ws
{
    class XMLConfiguracion
    {
        /// <summary>
        /// Método encargado de Genenerar un XML para el resguardo de Archivos PFX
        /// </summary>
        public static void CrearXMLArchivosPFX()
        {
            var RutaRelativaXML = "\\XMLConfiguracion.xml";

            if (!File.Exists(RutaRelativaXML))
            {
                XDocument miXML = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), new XElement("Configuraciones"));
                miXML.Save(RutaRelativaXML);

                XDocument xmlDoc = XDocument.Load(RutaRelativaXML);
                xmlDoc.Element("Configuraciones").Add(
                    new XElement("Configuracion",
                    new XAttribute("ColorPlantillaPDF", "255,0,128"),                    
                    new XAttribute("CarpetaRepositorio", "C:\\"),
                    new XAttribute("TipoOrganizacionCarpetas", "3")
                )
                );
                xmlDoc.Save(RutaRelativaXML);

            }
        }



        public static void ActualizarConfiguracionXML(string ElementoActualizar, string Valor)
        {
            CrearXMLArchivosPFX();
            var RutaRelativaXML =  "\\XMLConfiguracion.xml";
            XDocument xmlFile = XDocument.Load(RutaRelativaXML);

            var Consulta = from c in xmlFile.Elements("Configuraciones").Elements("Configuracion")
                           select c;

            foreach (XElement Parametro in Consulta)
            {
                Parametro.Attribute(ElementoActualizar).Value = Valor;
            }
            xmlFile.Save(RutaRelativaXML);
        }

        public static string LeerAtributoConfiguracionXML(string ElementoActualizar)
        {
            CrearXMLArchivosPFX();
            var RutaRelativaXML =  "\\XMLConfiguracion.xml";
            XDocument xmlFile = XDocument.Load(RutaRelativaXML);

            var Consulta = from c in xmlFile.Elements("Configuraciones").Elements("Configuracion")
                           select c;

            string Valor = "";
            foreach (XElement Parametro in Consulta)
            {
                Valor = Parametro.Attribute(ElementoActualizar).Value;
            }
            return Valor;
        }
    }
}

