class Card {
  constructor(idcard, imgprov, tipocrd, cnumber, nombres, validez, code_qr) {
    // Inicializa variables
    this.padre = '';
    this.idcard = idcard;
    this.imgprov = 'https://pruebas.cash-flag.com/img/'+imgprov;
    this.tipocrd = tipocrd;
    this.msjtipo = (tipocrd=='giftcard') ? 'Tarjeta de regalo' : 'Tarjeta prepagada';
    this.cnumber = cnumber;
    this.numcard = cnumber.substr(0,4)+' '+cnumber.substr(4,4)+' '+cnumber.substr(8,4)+' '+cnumber.substr(12,4);
    this.nombres = nombres;
    this.validez = "Valida hasta: "+validez;
    // this.code_qr = code_qr;
    // this.code_qr = "./premium.png";
    this.code_qr = (tipocrd=='giftcard') ? "https://pruebas.cash-flag.com/img/negro_hori.png" : "https://pruebas.cash-flag.com/img/blanco_hori.png";
    this.icongft = (tipocrd=='giftcard') ? "https://pruebas.cash-flag.com/img/gift-solid.svg" : "https://pruebas.cash-flag.com/img/monedas.png";
  }

  dibuja(padre) {
    this.padre = padre;
    // Crea objetos
    // Variables auxiliares
    const ancho = '340px';
    // alto es el ancho por .65
    const alto = '221px';
    // Crear base de la tarjeta
    let card = document.createElement("div");
    card.id = this.idcard;
    card.style.width = ancho;
    card.style.height = alto;
    card.style.margin = 'auto';
    card.style.position = 'relative';
    card.style.top = '10%';
    card.style.borderRadius = '6%';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    // card.style.background = (this.tipocrd=='prepago') ? 'black' : 'white' ;
    // card.style.background = (this.tipocrd=='prepago') ? 'black' : '#C09E70' ;
    if (this.tipocrd=='prepago') {
        card.style.background = 'black';
        // card.style.backgroundImage = 'radial-gradient(#C09E70, black)';
    } else {
        card.style.backgroundImage = 'radial-gradient(white, #C09E70)'; // dorada
        // card.style.backgroundImage = 'radial-gradient(white, #CBC0BC)'; // plateada
    }
    card.style.color = (this.tipocrd=='prepago') ? 'white' : 'black' ;
    card.style.border = (this.tipocrd=='prepago') ? 'solid 2px white' : 'solid 2px black' ;

        // Crear borde de la tarjeta
        let card2 = document.createElement("div");
        card2.style.border = (this.tipocrd=='prepago') ? 'solid 2px white' : 'solid 2px black' ;
        card2.style.margin = '5px';
        card2.style.borderRadius = '5%';
        card2.style.height = '94%';

            // Crear area del logo y logo
            let area_logo = document.createElement("div");
            area_logo.style.width = '30%';
            area_logo.style.height = '20%';
            area_logo.style.top = '5px';
            area_logo.style.left = '5px';
            area_logo.style.position = 'relative';
            area_logo.style.padding = '2% 0 0 2%';
                let img_logo = document.createElement("img");
                img_logo.style.width = '90%';
                img_logo.style.height = 'auto';
                img_logo.src = this.imgprov;
            area_logo.appendChild(img_logo);

            // Crear cuerpo de la tarjeta
            let cuerpo = document.createElement("div");
            cuerpo.style.display = 'flex';
            cuerpo.style.flexDirection = 'column';
            cuerpo.style.alignItems = 'flex-end';
            cuerpo.style.marginRight = '7.5px';
                // tipo
                let tipo = document.createElement("span");
                tipo.style.fontSize = '100%';
                let txttipo = document.createTextNode(this.msjtipo);
                tipo.appendChild(txttipo);
                // numero
                let numero = document.createElement("span");
                numero.style.fontSize = '120%';
                let txtnumero = document.createTextNode(this.numcard);
                numero.appendChild(txtnumero);
                // nombre
                let nombre = document.createElement("span");
                nombre.style.fontSize = '100%';
                let txtnombre = document.createTextNode(this.nombres);
                nombre.appendChild(txtnombre);
                // valida
                let valida = document.createElement("span");
                valida.style.fontSize = '80%';
                let txtvalida = document.createTextNode(this.validez);
                valida.appendChild(txtvalida);

            cuerpo.appendChild(tipo);
            cuerpo.appendChild(numero);
            cuerpo.appendChild(nombre);
            cuerpo.appendChild(valida);

            // Parte baja de la tarjeta
            let debajo = document.createElement("div");
            debajo.style.display = 'flex';
            debajo.style.flexDirection = 'row';
            debajo.style.justifyContent = 'space-between';
            debajo.style.marginTop = '-3%';
            debajo.style.height = '40%';
                // Área del QR
                let area_qr = document.createElement("div");
                area_qr.style.width = '25%';
                area_qr.style.height = '15px';
                area_qr.style.position = 'relative';
                area_qr.style.top = '85%';
                area_qr.style.left = '-16px';
                area_qr.style.bottom = '0px';
                area_qr.style.padding = '0 0 2% 7%';
                // area_qr.style.width = '25%';
                // area_qr.style.height = 'auto';
                // area_qr.style.position = 'relative';
                // area_qr.style.bottom = '0px';
                // area_qr.style.padding = '0 0 2% 7%';
                    let codigo_qr = document.createElement("img");
                    codigo_qr.style.width = '95%';
                    codigo_qr.style.height = 'auto';
                    codigo_qr.src = this.code_qr;
                area_qr.appendChild(codigo_qr);

                // Si tuviera que colocar cash-flag arriba coordenadas serían width 70%, position absolute, top -175px, left 265px

                // Ícono de giftcard
                let area_ico = document.createElement("div");
                area_ico.style.width = '15%';
                area_ico.style.height = 'auto';
                area_ico.style.position = 'relative';
                area_ico.style.bottom = '-20px';
                area_ico.style.padding = '0 5% 2% 0';
                    let img_gift = document.createElement("img");
                    img_gift.style.width = '100%';
                    img_gift.style.height = 'auto';
                    img_gift.src = this.icongft;
                area_ico.appendChild(img_gift);
            debajo.appendChild(area_qr);
            debajo.appendChild(area_ico);

            // Pie de la tarjeta
            let pie = document.createElement("div");
            pie.style.width = '100%';
            pie.style.textAlign = 'center';
            pie.style.fontSize = '55%';
            pie.style.marginTop = '0.5em';
                let mensaje = document.createElement("span");
                // let txtmensaje = document.createTextNode('Tarjeta generada por SGC Consultores C.A. ');
                let url = document.createElement("a");
                url.href = "https://www.sgc-consultores.com.ve";
                url.style.textDecoration = 'none';
                url.style.color = 'black';
                let txturl = document.createTextNode('Tarjeta generada por SGC Consultores C.A.');
                let txtur2 = document.createTextNode(' - ');
                let txtur3 = document.createTextNode('www.sgc-consultores.com.ve');
                // let txturl = document.createTextNode('Tarjeta generada por SGC Consultores C.A.');
                // mensaje.appendChild(txtmensaje);
                url.appendChild(txturl);
                url.appendChild(txtur2);
                url.appendChild(txtur3);
                mensaje.appendChild(url);
            pie.appendChild(mensaje);


        card2.appendChild(area_logo);
        card2.appendChild(cuerpo);
        card2.appendChild(debajo);
    card.appendChild(card2);
    card.style.boxShadow = "2px 2px 5px black";


    // return this;

    // Coloca la tarjeta donde se llame
    document.getElementById(this.padre).appendChild(card);
    document.getElementById(this.padre).appendChild(pie);
  }

  pulsar(mensaje) {
    alert(mensaje);
  }
}

class Campo {
  constructor(padre,mrc_id,etq_id,etq_txt,cmp_id,cmp_clase,cmp_tipo,cmp_size,cmp_maxlength) {
    // Objeto que contendrá el marco con los campos
    this.padre = padre;
    // Marco
    this.mrc_id = mrc_id;
    // Etiqueta
    this.etq_id = etq_id;
    this.etq_txt = etq_txt;
    // Campo
    this.cmp_id = cmp_id;
    this.cmp_clase = cmp_clase;
    this.cmp_tipo = cmp_tipo;
    this.cmp_size = cmp_size;
    this.cmp_maxlength = cmp_maxlength;

    // Construcción de los campos
    let marco, label, field;
    // variables auxiliares
    let txtlabel;
    marco = document.createElement("div");

    txtlabel = document.createTextNode(this.etq_txt);
    label = document.createElement("span");
    label.id = this.etq_id;
    label.appendChild(txtlabel);

    field = document.createElement("input");
    field.id = this.cmp_id;
    field.classList.add(this.cmp_clase);

    field.type = this.cmp_tipo;
    field.size = this.cmp_size;
    field.maxlength = this.cmp_maxlength;

    marco.appendChild(label);
    marco.appendChild(field);
    this.padre.appendChild(marco);
  }
}

class Card_cashflag {
  constructor(idcard, imgprov, tipocrd, cnumber, nombres, validez, code_qr, dibujomoneda, dibujomonedablanco) {
    // Inicializa variables
    this.padre = '';
    this.idcard = idcard;
    this.imgprov = '../img/'+imgprov;
    this.tipocrd = tipocrd;
    this.msjtipo = (tipocrd=='giftcard') ? 'Tarjeta de regalo' : 'Tarjeta prepagada';
    this.cnumber = cnumber;
    this.numcard = cnumber.substr(0,4)+' '+cnumber.substr(4,4)+' '+cnumber.substr(8,4)+' '+cnumber.substr(12,4);
    this.nombres = nombres;
    this.validez = "Valida hasta: "+validez;
    // this.code_qr = code_qr;
    this.code_qr = "https://pruebas.cash-flag.com/img/premium.png";
    this.dibujomoneda = (tipocrd=='giftcard') ? 'https://pruebas.cash-flag.com/img/'+dibujomoneda : 'https://pruebas.cash-flag.com/img/'+dibujomonedablanco;
    // this.code_qr = (tipocrd=='giftcard') ? "../img/negro_hori.png" : "../img/blanco_hori.png";
    this.icongft = (tipocrd=='giftcard') ? "https://pruebas.cash-flag.com/img/gift-solid.svg" : "https://pruebas.cash-flag.com/img/monedas.png";
  }

  dibuja(padre) {
    this.padre = padre;
    // Crea objetos
    // Variables auxiliares
    const ancho = '340px';
    // alto es el ancho por .65
    const alto = '221px';
    // Crear base de la tarjeta
    let card = document.createElement("div");
    card.id = this.idcard;
    card.style.width = ancho;
    card.style.height = alto;
    card.style.margin = 'auto';
    card.style.position = 'relative';
    card.style.top = '10%';
    card.style.borderRadius = '6%';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    // card.style.background = (this.tipocrd=='prepago') ? 'black' : 'white' ;
    // card.style.background = (this.tipocrd=='prepago') ? 'black' : '#C09E70' ;
    if (this.tipocrd=='prepago') {
        card.style.background = 'black';
        // card.style.backgroundImage = 'radial-gradient(#C09E70, black)';
    } else {
        card.style.backgroundImage = 'radial-gradient(white, #C09E70)'; // dorada
        // card.style.backgroundImage = 'radial-gradient(white, #CBC0BC)'; // plateada
    }
    card.style.color = (this.tipocrd=='prepago') ? 'white' : 'black' ;
    card.style.border = (this.tipocrd=='prepago') ? 'solid 2px white' : 'solid 2px black' ;

        // Crear borde de la tarjeta
        let card2 = document.createElement("div");
        card2.style.border = (this.tipocrd=='prepago') ? 'solid 2px white' : 'solid 2px black' ;
        card2.style.margin = '5px';
        card2.style.borderRadius = '5%';
        card2.style.height = '94%';

            // Crear area del logo y logo
            let area_logo = document.createElement("div");
            area_logo.style.width = '30%';
            area_logo.style.height = '20%';
            area_logo.style.top = '5px';
            area_logo.style.left = '5px';
            area_logo.style.position = 'relative';
            area_logo.style.padding = '2% 0 0 2%';
                let img_logo = document.createElement("img");
                img_logo.style.width = '90%';
                img_logo.style.height = 'auto';
                img_logo.src = this.imgprov;
            area_logo.appendChild(img_logo);

            // Crear cuerpo de la tarjeta
            let cuerpo = document.createElement("div");
            cuerpo.style.display = 'flex';
            cuerpo.style.flexDirection = 'column';
            cuerpo.style.alignItems = 'flex-end';
            cuerpo.style.marginRight = '7.5px';
                // tipo
                let tipo = document.createElement("span");
                tipo.style.fontSize = '100%';
                let txttipo = document.createTextNode(this.msjtipo);
                tipo.appendChild(txttipo);
                // numero
                let numero = document.createElement("span");
                numero.style.fontSize = '120%';
                let txtnumero = document.createTextNode(this.numcard);
                numero.appendChild(txtnumero);
                // nombre
                let nombre = document.createElement("span");
                nombre.style.fontSize = '100%';
                let txtnombre = document.createTextNode(this.nombres);
                nombre.appendChild(txtnombre);
                // valida
                let valida = document.createElement("span");
                valida.style.fontSize = '80%';
                let txtvalida = document.createTextNode(this.validez);
                valida.appendChild(txtvalida);

            cuerpo.appendChild(tipo);
            cuerpo.appendChild(numero);
            cuerpo.appendChild(nombre);
            cuerpo.appendChild(valida);

            // Parte baja de la tarjeta
            let debajo = document.createElement("div");
            debajo.style.display = 'flex';
            debajo.style.flexDirection = 'row';
            debajo.style.justifyContent = 'space-between';
            debajo.style.marginTop = '-3%';
            debajo.style.height = '40%';
                // Área del QR
                let area_qr = document.createElement("div");
                area_qr.style.width = '25%';
                area_qr.style.height = 'auto';
                area_qr.style.position = 'relative';
                area_qr.style.bottom = '0px';
                area_qr.style.padding = '0 0 2% 7%';
                    // moneda
                    let dibujomoneda = document.createElement("img");
                    dibujomoneda.style.width = '70%';
                    dibujomoneda.style.height = 'auto';
                    dibujomoneda.style.marginTop = '10px';
                    dibujomoneda.style.marginLeft = '5px';
                    dibujomoneda.src = this.dibujomoneda;
                    // premium
                    let codigo_qr = document.createElement("img");
                    codigo_qr.style.width = '50%';
                    codigo_qr.style.height = 'auto';
                    codigo_qr.style.position = 'absolute';
                    codigo_qr.style.top = '-105px';
                    codigo_qr.style.left = '265px';
                    codigo_qr.src = this.code_qr;
                    // let codigo_qr = document.createElement("img");
                    // codigo_qr.style.width = '95%';
                    // codigo_qr.style.height = 'auto';
                    // codigo_qr.src = this.code_qr;

                area_qr.appendChild(dibujomoneda);
                area_qr.appendChild(codigo_qr);
                // Ícono de giftcard
                let area_ico = document.createElement("div");
                area_ico.style.width = '15%';
                area_ico.style.height = 'auto';
                area_ico.style.position = 'relative';
                area_ico.style.bottom = '-20px';
                area_ico.style.padding = '0 5% 2% 0';
                    let img_gift = document.createElement("img");
                    img_gift.style.width = '100%';
                    img_gift.style.height = 'auto';
                    img_gift.src = this.icongft;
                area_ico.appendChild(img_gift);
            debajo.appendChild(area_qr);
            debajo.appendChild(area_ico);

            // Pie de la tarjeta
            let pie = document.createElement("div");
            pie.style.width = '100%';
            pie.style.textAlign = 'center';
            pie.style.fontSize = '55%';
            pie.style.marginTop = '0.5em';
                let mensaje = document.createElement("span");
                // let txtmensaje = document.createTextNode('Tarjeta generada por SGC Consultores C.A. ');
                let url = document.createElement("a");
                url.href = "https://www.sgc-consultores.com.ve";
                url.style.textDecoration = 'none';
                url.style.color = 'black';
                let txturl = document.createTextNode('Tarjeta generada por SGC Consultores C.A.');
                let txtur2 = document.createTextNode(' - ');
                let txtur3 = document.createTextNode('www.sgc-consultores.com.ve');
                // let txturl = document.createTextNode('Tarjeta generada por SGC Consultores C.A.');
                // mensaje.appendChild(txtmensaje);
                url.appendChild(txturl);
                url.appendChild(txtur2);
                url.appendChild(txtur3);
                mensaje.appendChild(url);
            pie.appendChild(mensaje);


        card2.appendChild(area_logo);
        card2.appendChild(cuerpo);
        card2.appendChild(debajo);
    card.appendChild(card2);
    card.style.boxShadow = "2px 2px 5px black";

    // return this;

    // Coloca la tarjeta donde se llame
    document.getElementById(this.padre).appendChild(card);
    document.getElementById(this.padre).appendChild(pie);
  }

  pulsar(mensaje) {
    alert(mensaje);
  }
}
