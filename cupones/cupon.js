var busca1 = function () { buscasocio(this.value,1); }
var busca2 = function () { buscasocio(document.getElementById("email").value,2); }
var nuevoSocio = false, prKey = "", pbKey = "";

// Cargar los datos iniciales de la forma y la etiquetas
function cargaforma() {
	buscatitulo();
	var logo;

	var params = fparamurl(window.location.search.substr(1));
	var oParams, prov;

	if (params==undefined) {
		prov = localStorage.getItem("id_proveedor");
	} else {
		if(params.reg==undefined) {
			prov = params.id;
		} else {
			oParams = JSON.parse(params.reg);
			prov = oParams.id;
		}
		console.log(oParams);
		localStorage.setItem("id_proveedor",prov);
		if (params.btn!=1) {
	        document.getElementById("botonvolver").style.display = 'none';
		}
	}

	var titulo = localStorage.getItem("nombresistema");
	// cargar parámetros de la tabla
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			respuesta = JSON.parse(this.responseText);
			if (respuesta.exito == 'SI') {
				document.title = titulo;
				logo = respuesta.proveedor.logo;
				if (logo!="") {
					document.getElementById("logo").src = "../img/" + logo;
				} else {
					document.getElementById("logo").src = "../img/" + 'sin_imagen.jpg';
				}
				document.getElementById("logo").title = respuesta.proveedor.nombre;
			}
		}
	};
	console.log("../php/proveedores.php?prov=" + prov);
	xmlhttp.open("GET", "../php/proveedores.php?prov=" + prov, false);
	xmlhttp.send();

	// cargar parámetros del json: etiquetas y elementos de forma
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			respuesta = JSON.parse(this.responseText);
			modulo = respuesta.titulo;
			document.title = document.title + ' - ' + modulo;
			tituloformulario = modulo.toUpperCase();
			document.getElementById("tituloformulario").innerHTML = tituloformulario;
			for (campo = 0; campo < document.getElementsByClassName("campo").length; campo++) {
				if (campo<document.getElementsByClassName("campo").length-1) {
					document.getElementsByClassName("etiq")[campo].innerHTML = respuesta.etiquetas[campo];
				}
				document.getElementsByClassName("campo")[campo].id = respuesta.campos[campo];
			}
		}
	};
	xmlhttp.open("GET", "cupon.json", false);
	xmlhttp.send();

	document.getElementById("email").addEventListener('change', busca1);
	document.getElementById("enviar").innerHTML = 'Buscar';
	document.getElementById("enviar").addEventListener('click', busca2);
}

// limpia el formulario
function limpiar() {
	for (campo = 0; campo < document.getElementsByClassName("campo").length; campo++) {
		document.getElementsByClassName("campo")[campo].value = "";
	}
	for (campo = 1; campo < document.getElementsByClassName("cmps").length; campo++) {
		document.getElementsByClassName("cmps")[campo].style.display = 'none';
	}

	document.getElementById("email").addEventListener('change', busca1);
	document.getElementById("enviar").innerHTML = 'Buscar';
	document.getElementById("enviar").removeEventListener('click', enviar);
	document.getElementById("enviar").addEventListener('click', busca2);

	document.getElementById("email").style.background = "";
	document.getElementById("nombres").style.background = "";
	document.getElementById("apellidos").style.background = "";
	document.getElementById("telefono").style.background = "";

	document.getElementById("email").readOnly = false;
	document.getElementById("nombres").readOnly = false;
	document.getElementById("apellidos").readOnly = false;
	document.getElementById("telefono").readOnly = false;

	document.getElementById("email").focus();
}

// Enviar los datos del formulario para procesar en el servidor
async function enviar() {
	var id_proveedor = localStorage.getItem("id_proveedor");
	document.getElementById("id_proveedor").value = id_proveedor;

	var datos = new FormData();
	for (campo = 0; campo < document.getElementsByClassName("campo").length; campo++) {
		if (document.getElementsByClassName("campo")[campo].type=='checkbox'){
			datos.append(document.getElementsByClassName("campo")[campo].id, document.getElementsByClassName("campo")[campo].checked);
		} else {
			datos.append(document.getElementsByClassName("campo")[campo].id, document.getElementsByClassName("campo")[campo].value);
		}
	}
	if(nuevoSocio) {
		// Crear cuenta en Aeternity
		let KeyPairObj = await crearCuenta();
		// Se muestran las llaves
		prKey = KeyPairObj.privateKey;
		pbKey = KeyPairObj.publicKey;
	}
	datos.append("secretkey", prKey);
	datos.append("account", pbKey);

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
			respuesta = JSON.parse(this.responseText);
			if (respuesta.exito == 'SI') {
				alert(fmensaje(respuesta.mensaje)+"\n# de cupón: "+respuesta.cuponlargo);
				limpiar();
			} else {
				alert(fmensaje(respuesta.mensaje));
			}
		}
	};
	xmlhttp.open("POST", "../php/registracupon.php", false);
	xmlhttp.send(datos);
}

// Busca dato inicial para rellenar el formulario
function buscasocio(valor,opc) {
	arroba = 0;
	punto = 0;
	posa = 0;
	posp = 0;
	for (index = 0; index < valor.length; index++) {
		if (valor[index] == "@") { arroba++; posa = index; }
		if (valor[index] == ".") { punto++; posp = index; }
	}
	if (arroba + punto > 1 && posp > posa) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				respuesta = JSON.parse(this.responseText);
				if (respuesta.exito == 'SI') {
					document.getElementById("nombres").value = respuesta.nombres;
					document.getElementById("apellidos").value = respuesta.apellidos;
					document.getElementById("telefono").value = respuesta.telefono;

					document.getElementById("email").style.background = "yellow";
					document.getElementById("nombres").style.background = "yellow";
					document.getElementById("apellidos").style.background = "yellow";
					document.getElementById("telefono").style.background = "yellow";

					document.getElementById("email").readOnly = true;
					document.getElementById("nombres").readOnly = true;
					document.getElementById("apellidos").readOnly = true;
					document.getElementById("telefono").readOnly = true;

					for (campo = 1; campo < document.getElementsByClassName("cmps").length - 1; campo++) {
						document.getElementsByClassName("cmps")[campo].style.display = 'flex';
					}

					document.getElementById("socio").style.display = 'none';
					localStorage.setItem("socio", true);
					nuevoSocio = false;
					prKey = respuesta.secretkey;
					pbKey = respuesta.account;

					document.getElementById("factura").focus();

				}
			} else {
				for (campo = 1; campo < document.getElementsByClassName("cmps").length - 1; campo++) {
					document.getElementsByClassName("cmps")[campo].style.display = 'flex';
				}
				document.getElementById("socio").style.display = 'flex';
				localStorage.setItem("socio", false);
				nuevoSocio = true;
				document.getElementById("nombres").focus();

			}
			document.getElementById("email").removeEventListener('change', busca1);
			document.getElementById("enviar").innerHTML = 'Enviar';
			document.getElementById("enviar").removeEventListener('click', busca2);
			document.getElementById("enviar").addEventListener('click', enviar);
		};
		xmlhttp.open("GET", "../php/buscasocios.php?email=" + valor, false);
		xmlhttp.send();

	} else {
		if (opc==1) { alert('Email invalido.'); }
		document.getElementById("email").focus();
	}
}

function buscatitulo() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			respuesta = JSON.parse(this.responseText);
			if (respuesta.exito == 'SI') {
				document.title = respuesta.parametros.nombresistema;
				localStorage.setItem("nombresistema", respuesta.parametros.nombresistema);
			}
		}
	};
	xmlhttp.open("GET", "../php/parametros.php", false);
	xmlhttp.send();
}

function volver() {
	window.open(localStorage.getItem("url_back"), "_self");
}

function validanumero(){
	valor = document.getElementById("telefono").value;
	lista = "0123456789";
	if(valor.length<12){
		alert("El campo teléfono debe contener 12 números\ny el fofrmato debe ser:\n- Código país (2 dígitos, ejemplo: 58)\n- Prefijo (4 dígitos, ejemplo 0414)\n- Número (7 dígitos, ejemplo 1234567)");
		document.getElementById("telefono").focus();
	} else {
		let novalido = 0;
		for (let i = 0; i < valor.length; i++) {
			posicion = lista.valor.substr(i,1);
			if (posicion<0) {
				novalido++;
			}
		}
		if (novalido>0) {
			alert("El campo teléfono debe contener sólo números\ny el fofrmato debe ser:\n- Código país (2 dígitos, ejemplo: 58)\n- Prefijo (4 dígitos, ejemplo 0414)\n- Número (7 dígitos, ejemplo 1234567)");
			document.getElementById("telefono").focus();
		}
	}
}
