//! Document ready
$(document).ready(function () {
    $("#actionView").html('');//! Panel de acciones

    getUsuario();
    getMenus();

    $('#btnModalColsCerrar').on('click', function () { //! Boton de cerrar modal columnas
        $.modal.close();
    });

    $("#show-sidebar").click(function () {
        let iconMenu = $(this);
        if (iconMenu.hasClass("active")) {
            iconMenu.removeClass("active");
            $(".page-wrapper").removeClass("toggled");
            $("#menuActions").addClass("active");
            //$("#menuActions").css('left', '35px');

            ($(window).width() > 900) ? $("#menuActions").css('left', '35px') : $("#menuActions").css('left', '0px');
            console.log($(window).width());
        } else {
            iconMenu.addClass("active");
            $(".page-wrapper").addClass("toggled");
            $("#menuActions").removeClass("active");
            //$("#menuActions").css('left', '300px');
            ($(window).width() > 900) ? $("#menuActions").css('left', '300px') : $("#menuActions").css('left', '0px');
        }
    });

    $("#show-sidebar-media").click(function () {
        $(".page-wrapper").removeClass("toggled");
        $("#menuActions").css('left', '0px');
        $("#show-sidebar").removeClass("active");
    });

    if ($(window).width() <= 900) {
        $("#show-sidebar").removeClass("active");
        $(".page-wrapper").removeClass("toggled");
    }
});

//! Obtener datos del usuario
function getUsuario() {
    doAjax("GET", url_Inicio_GetUsuario, {}).done(function (data) {
        let result = new Result(data);

        if (result.validResult(true,false)) {
            setDatosUsuario(result.msnSuccess);
        }
    });
}

//! Obtener los menus a los cuales tiene acceso el usuario
async function getMenus() {
    await doAjax("GET", url_Inicio_GetMenus, {}).done(function (data) {
        let result = new Result(data);

        if (result.validResult(false,false)) {
            createObjectMenu(result.resultStoredProcedure);
        }
    });
}

function setDatosUsuario(usuario) {
    $("#user-name").text(usuario.nombre + " " + usuario.apellido_paterno);
    $("#user-role").text(usuario.rol);


    $("#rfc-cliente").text(usuario.rfc);
    $("#razon-cliente").text(usuario.razon);
    if (usuario.fecha != "") {
        $("#fecha_prueba").html("<br />"+usuario.fecha);
    }
    
}

function createObjectMenu(rsStored) {
    if (!rsStored.validResultStored())
        return false;

    let objMenu = {};
    
    rsStored.msnSuccess.forEach(function (item) {
        if (item.padre_isRaiz) { //! Ligado a menu raiz
            
            if (!objMenu.hasOwnProperty(item.id_menuPadre)) {//! Si no existe el menu raiz se ingresa
                objMenu[item.id_menuPadre] = {};
                objMenu[item.id_menuPadre]["nombre"] = item.menu_padre;
                objMenu[item.id_menuPadre]["subMenus"] = {};
            }

            
            if (!objMenu[item.id_menuPadre]["subMenus"].hasOwnProperty(item.id_menu)) { //! Si no existe el submenu
                objMenu[item.id_menuPadre]["subMenus"][item.id_menu] = { items: [], nombre: item.nombre_menu };
            }

            objMenu[item.id_menuPadre]["subMenus"][[item.id_menu]]["items"].push({
                nombre: item.nombre,
                action: item.action,
                controller: item.controller
            });
        }
    });

    setMenuContent(objMenu);
}

function setMenuContent(objMenu) {
    let html = "";
    let menu = {}, subMenus = {}, vistas = [];

    html += "<ul>";

    //! Recorrer menus raiz
    Object.keys(objMenu).forEach(function (idMenuRaiz) {
        menu = objMenu[idMenuRaiz];
        html += '<li class="header-menu"><span>' + menu.nombre + '</span></li>';

        subMenus = menu.subMenus;

        //! Recorrer submenus
        Object.keys(subMenus).forEach(function (idSubMenu) {
            html += '<li class="sidebar-dropdown">';
            html += '<a href="#"><i class="fa fa-list-ul"></i><span>' + subMenus[idSubMenu].nombre + '</span></a>'

            vistas = subMenus[idSubMenu]["items"];
            html += '<div class="sidebar-submenu"><ul>';

            //! Recorrer vistas
            vistas.forEach(function (view) {
                html += '<li><a href="' +rootPath + '/' + view.controller + '/' + view.action +'">' + view.nombre+'</a></li>';
            });
            html += '</ul></div>';

            html += '</li>'
        });

    });
    html += "</ul>";

    $("#content_menus").html(html); //! Panel de menu
    setEventsMenu();
}

function setEventsMenu() {
    $(".sidebar-dropdown > a").click(function () {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
                .parent()
                .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });
}