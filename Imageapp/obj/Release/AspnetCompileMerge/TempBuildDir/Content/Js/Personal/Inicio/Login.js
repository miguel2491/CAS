//Document ready
$(document).ready(function () {
    buttonViewPassword();

    $("form").on('submit', function () {
        showWait();
    });
});

function showWait() {
    let $objWait;

    $objWait = jsSimpleAlertReturn("Espera", "Realizando petición...");
    $objWait.open();
}

function jsSimpleAlertReturn(title, content, theme = 'orange') {
    return $.confirm({
        icon: 'fa fa-spinner fa-spin',
        lazyOpen: true,
        title: title,
        content: content,
        type: theme,
        theme: 'modern',
        typeAnimated: true,
        buttons: {
            close: {
                text: 'Aceptar',
                btnClass: 'd-none',
                action: function () { return false; }
            }
        }
    });
}

function jsSimpleAlert(title, content, theme = 'dark') {
    let icon;
    if (theme == "red")
        icon = "fa fa-times";
    else if (theme == "green")
        icon = "fa fa-check";
    else if (theme == "orange")
        icon = "fa fa-exclamation";
    else
        icon = "fa fa-info"

    $.confirm({
        icon: icon,
        title: title,
        content: content,
        type: theme,
        typeAnimated: true,
        theme: 'modern',
        buttons: {
            close: {
                text: 'Aceptar',
                action: function () { }
            }
        }
    });
}

function buttonViewPassword() {
    $("input[type='password'][data-eye]").each(function (i) {
        var $this = $(this);
        $this.wrap($("<div class='btn-eye'/>"));
        $this.css({
            paddingRight: 60
        });
        $this.after($("<div/>", {
            html: '<span class="fa fa-eye"></span>',
            class: 'btn igp-btn-eye btn-sm',
            id: 'passeye-toggle-' + i,
            style: 'position:absolute;right:10px;top:50%;transform:translate(0,-50%);-webkit-transform:translate(0,-50%);-o-transform:translate(0,-50%);padding: 0px 0px;font-size:12px;cursor:pointer;'
        }));
        $this.after($("<input/>", {
            type: 'hidden',
            id: 'passeye-' + i
        }));
        $this.on("keyup paste", function () {
            $("#passeye-" + i).val($(this).val());
        });
        $("#passeye-toggle-" + i).on("click", function () {
            if ($this.hasClass("show")) {
                $this.attr('type', 'password');
                $this.removeClass("show");
                $(this).html('<span class="fa fa-eye"></span>');
            } else {
                $this.attr('type', 'text');
                $this.val($("#passeye-" + i).val());
                $this.addClass("show");
                $(this).html('<span class="fa fa-eye-slash"></span>');
            }
        });
    });
}
