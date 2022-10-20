

function convertHTMLToXML(value) {
    var str = "";
    var elements = $(value).find("p");     
        //! Arreglo de Parrafos
    elements.prevObject.each(function () {
        var elem = $(this);

        str += "<w:p><w:pPr>";
        if ($(elem).css("text-align")== "left") {
            str += "<w:jc w:val=\"left\"/>";
        }
        if ($(elem).css("text-align") == "center") {
            str += "<w:jc w:val=\"center\"/>";
        }
        if ($(elem).css("text-align") == "right") {
            str += "<w:jc w:val=\"right\"/>";
        }
        if ($(elem).css("text-align") == "justify") {
            str += "<w:jc w:val=\"both\"/>";
        }

        str += "<w:pStyle w:val=\"Normal\"/><w:spacing w:before=\"0\" w:after=\"200\"/><w:u w:val=\"single\"/><w:rPr/></w:pPr>";      


        $(elem).contents().each(function () {

            var child = $(this);

            if (child[0].nodeName == "#text") {
                str += "<w:r><w:rPr></w:rPr><w:t xml:space=\"preserve\">" + child[0].nodeValue +"</w:t></w:r>";
            }
            if (child[0].nodeName == "STRONG") {
                str += "<w:r><w:rPr><w:b/>";
                $(child).contents().each(function () {

                    var child2 = $(this);

                    if (child2[0].nodeName == "#text") {
                        str += "</w:rPr><w:t xml:space=\"preserve\">" + child2[0].nodeValue + "</w:t></w:r>";
                    }
                    if (child2[0].nodeName == "EM") {
                        str += "<w:i/></w:rPr><w:t xml:space=\"preserve\">" + child2[0].firstChild.nodeValue + "</w:t></w:r>";
                    }
                });                    
            }
            if (child[0].nodeName == "EM") {
                str += "<w:r><w:rPr><w:i/>";
                $(child).contents().each(function () {

                    var child2 = $(this);

                    if (child2[0].nodeName == "#text") {
                        str += "</w:rPr><w:t xml:space=\"preserve\">" + child2[0].nodeValue + "</w:t></w:r>";
                    }
                    if (child2[0].nodeName == "STRONG") {
                        str += "<w:b/></w:rPr><w:t xml:space=\"preserve\">" + child2[0].firstChild.nodeValue + "</w:t></w:r>";
                    }
                });    
            }

            if (child[0].nodeName == "SPAN") {
                var size = Number(child.css("font-size").replace("px", "")) * 2;

                str += "<w:r><w:rPr><w:sz w:val=\"" + size + "\"/><w:szCs w:val=\"" + size + "\"/>";

                $(child).contents().each(function () {

                    var child2 = $(this);

                    if (child2[0].nodeName == "#text") {
                        str += "</w:rPr><w:t xml:space=\"preserve\">" + child2[0].nodeValue + "</w:t></w:r>";
                    }
                    if (child2[0].nodeName == "STRONG") {
                        str += "<w:b/></w:rPr><w:t xml:space=\"preserve\">" + child2[0].firstChild.nodeValue + "</w:t></w:r>";
                    }
                    if (child2[0].nodeName == "EM") {
                        str += "<w:i/></w:rPr><w:t xml:space=\"preserve\">" + child2[0].firstChild.nodeValue + "</w:t></w:r>";
                    }

                    if (child2[0].nodeName == "SPAN") {
                        var size = Number(child2.css("font-size").replace("px", "")) * 2;

                        str += "<w:r><w:rPr><w:sz w:val=\"" + size + "\"/><w:szCs w:val=\"" + size + "\"/>";

                        $(child2).contents().each(function () {

                            var child3 = $(this);

                            if (child3[0].nodeName == "#text") {
                                str += "</w:rPr><w:t xml:space=\"preserve\">" + child3[0].nodeValue + "</w:t></w:r>";
                            }
                            if (child3[0].nodeName == "STRONG") {
                                str += "<w:b/></w:rPr><w:t xml:space=\"preserve\">" + child3[0].firstChild.nodeValue + "</w:t></w:r>";
                            }
                            if (child3[0].nodeName == "EM") {
                                str += "<w:i/></w:rPr><w:t xml:space=\"preserve\">" + child3[0].firstChild.nodeValue + "</w:t></w:r>";
                            }
                        });
                    }
                });
            }
        });
        str += "</w:p>";
});

    return str;
}
        //! span cambio de tamaño o alineación
        //! strong negrita
        //! em cursiva
