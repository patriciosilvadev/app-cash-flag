<?php
header('Content-Type: application/json');
include_once("../_config/conexion.php");
include_once("funciones.php");
include_once("../lib/phpqrcode/qrlib.php");

$archivojson = "../cupones/cupon.json";

// Si no es socio, verificar si se quiere afiliar o no
$nuevosocio = ($_POST["socio"]=="true") ? 1 : 0 ;
$socio = 0;
// $socio = 1;
// $email = 'soluciones3000@gmail.com';

// Buscar datos de socio
$query = "select * from socios where email='".$_POST['email']."'";
// $query = "select * from socios where email='".$email."'";
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	$id=$row["id"];
	$socio = 1;
} else {
	if ($nuevosocio) {
		$query = "INSERT INTO socios (email, status, telefono, nombres, apellidos, idproveedor, fechanacimiento, sexo, pais, estado, ciudad, nombre_pais, nombre_estado, nombre_ciudad, sector, direccion, donde_entregar, direccion_entrega, edocivil, nombrepareja, cumplepareja, aniversario, padre, nombrepadre, cumplepadre, madre, nombremadre, cumplemadre, hijos, menores5, menores10, menores20, mayores, otrotelef, vehiculo, cedula, rif, profesion, ocupacion, nombretrabajo, direcciontrabajo, emailtrabajo, telefonotrabajo, fecha_afiliacion, registro, secretkey, account) VALUES ('".$_POST["email"]."', 'Activo', '".$_POST["telefono"]."', '".$_POST["nombres"]."', '".$_POST["apellidos"]."',".$_POST["id_proveedor"].", '0000-00-00', '', 0, 0, 0, '', '', '', '', '', '', '', '', '', '0000-00-00', '0000-00-00', 0, '', '0000-00-00', 0, '', '0000-00-00', 0, 0, 0, 0, 0, '', 0, '', '', '', '', '', '', '', '', '".date("Y-m-d")."', 'Pendiente', '".$_POST["secretkey"]."', '".$_POST["account"]."')";
		// $query = "INSERT INTO socios (email,telefono,nombres,apellidos) VALUES ('".$email."','0414','xxx','yyy')";
		$result = mysqli_query($link,$query);
		$query = "select * from socios where email='".$_POST['email']."'";
		// $query = "select * from socios where email='".$email."'";
		$result = mysqli_query($link, $query);
		if ($row = mysqli_fetch_array($result)) {
			$id=$row["id"];
			$socio = 1;
			mensajebienvenida($row);
			generatarjetaAE($_POST, $link);
		} else {
			$id=0;
		}
	} else {
		$id=0;
	}
}

// Buscar datos de proveedor
$query = "select * from proveedores where id=".$_POST['id_proveedor'];
// $query = "select * from proveedores where id=1";
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	$nombreproveedor=$row["nombre"];
}

// Buscar premio activo
$query = "select * from premios where id_proveedor=".$_POST['id_proveedor'] . " and clasepremio='consumo' and activo=1";
// $query = "select * from premios where id_proveedor=1 and activo=1";
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	$id_premio=$row["id"];
	$tipopremio=$row["tipopremio"];
	$montopremio=$row["montopremio"];
	$descpremio=$row["descpremio"];
	$diasvalidez=$row["diasvalidez"];
}

// Asignar el número de cupón
$query = "select max(cupon) as ultcupon from cupones";
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	if (strlen($row["ultcupon"])==0) {
		$numcupon = asignacodigo('0000000000');
		$cuponlargo = asignacodigolargo($numcupon);
	} else {
		$numcupon = asignacodigo($row["ultcupon"]);
		$cuponlargo = asignacodigolargo($numcupon);
	}
}


// Verificar si ya existe el cupón, si existe responder, si no, agregar y responder 
$query = "select * from cupones where id_proveedor=".$_POST['id_proveedor']." and factura='" . $_POST['factura'] . "'";
// $query = "select * from cupones where id_proveedor=1 and factura='8888888'";
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	$respuesta = '{"exito":"NO","mensaje":'. mensajes($archivojson,"cuponyaregistrado") .',"cupon":"0","cuponlargo":"0"}';
} else {

	$fechacupon = date ('Y-m-d');
	$fechavencimiento = strtotime('+'.$diasvalidez.' days', strtotime ($fechacupon));
	$fechavencimiento = date ('Y-m-d' , $fechavencimiento);
	$fechavencstr = substr($fechavencimiento,8,2).'/'.substr($fechavencimiento,5,2).'/'.substr($fechavencimiento,0,4);

	/*
	Hash para insertar en el blockchain
	-----------------------------------
	El hash se va a armar con los siguientes datos:
	- Cupon
	- Proveedor
	- Socio
	- Tipo premio
	- Monto premio
	- Descripción premio
	- Status cupón
	*/
	$hash = hash("sha256",$numcupon.$_POST['id_proveedor']. $id.$tipopremio.$montopremio.$descpremio."Generado");

	$query = "INSERT INTO cupones (cupon,cuponlargo,id_proveedor,id_comercio,id_socio,status,factura,monto,id_premio,tipopremio,montopremio,descpremio,socio,email,telefono,nombres,apellidos,fechacupon,fechavencimiento,fechacanje,facturacanje,montocanje,hash) VALUES ('".$numcupon."','".$cuponlargo."'," . $_POST['id_proveedor'] . ",".$_POST['id_proveedor']."," . $id . ",'Generado','" . $_POST["factura"] . "'," . $_POST["monto"] . ",".$id_premio.",'".$tipopremio."',".$montopremio.",'".$descpremio."'," . $socio . ",'" . $_POST["email"] . "','" . $_POST["telefono"] . "','" . $_POST["nombres"] . "','" . $_POST["apellidos"] . "','".$fechacupon."','".$fechavencimiento."','0000-00-00','',0,'".$hash."')";
	if ($result = mysqli_query($link, $query)) {

		$correo = $_POST["email"];

		$mensaje = 'Hola '.trim($_POST["nombres"]).',<br/><br/>';
		$mensaje .= '¡Gracias por preferir a <b>'.trim($nombreproveedor).'</b> para tus compras!<br/><br/>';
		$mensaje .= 'En reconimiento a tu preferencia, queremos darte un obsequio, ';
		$mensaje .= 'la próxima que nos visites podrás reclamar el siguiente premio:'.'<br/><br/>';
		switch ($tipopremio) {
			case 'porcentaje':
				$mensaje .= '<h3 style="text-align:center;"><b>'.number_format($montopremio,2,',','.').'% de descuento sobre el monto total de tu factura.</b></h3>';
				break;
			case 'monto':
				$mensaje .= '<h3 style="text-align:center;"><b>'.number_format($montopremio,2,',','.').' Bs. de descuento en sobre el monto total de tu factura.</b></h3>';
				break;
			case 'producto':
				$mensaje .= '<h3 style="text-align:center;"><b>'.trim($descpremio).'.</b></h3>';
				break;
			default:
				$mensaje .= '<h3 style="text-align:center;"><b>Premio especial sorpresa.</b></h3>';
				break;
		}

		$mensaje .= 'Este premio podrás reclamarlo cualquier día, siempre que sea antes del <b>'.$fechavencstr.'</b>.<br/><br/>';
		$mensaje .= 'Sólo debes presentar este correo electrónico o indicar el siguiente código:'.'<br/>';
		$mensaje .= '<h2 style="text-align:center"><b>'.$cuponlargo.'</b></h2>';

		// codigo de barras
		$mensaje .= '<p style="text-align:center;">';
			$mensaje .= '<img src="https://app.cash-flag.com/php/barcode.php?';
			$mensaje .= 'text='.$cuponlargo;
			$mensaje .= '&size=50';
			$mensaje .= '&orientation=horizontal';
			$mensaje .= '&codetype=Code39';
			$mensaje .= '&print=true';
			$mensaje .= '&sizefactor=1" />';
		$mensaje .= '</p>';

		// código qr
		$mensaje .= '<p style="text-align:center;">Para canjear desde el móvil:</p>';

//		$dir = 'https://app.cash-flag.com/php/temp/';
//		if(!file_exists($dir)) mkdir($dir);
		$ruta = 'https://app.cash-flag.com/php/';
		$dir = 'qr/';
		if(!file_exists($dir)) mkdir($dir);

//		$filename = $dir.'test.png';
		$tamanio = 5;
		$level = 'H';
		$frameSize = 1;
//		$contenido = $cuponlargo;
//		$contenido = '{"id_proveedor":'.$_POST['id_proveedor'].',"cupon":"'.$cuponlargo.'"}';
		$contenido = 'https://app.cash-flag.com/canje/canje.html?cJson={"id_proveedor":'.$_POST['id_proveedor'].',"cupon":"'.$cuponlargo.'"}';

//		QRcode::png($contenido, $filename, $level, $tamanio, $frameSize);
		QRcode::png($contenido,$dir.$numcupon.'.png', $level, $tamanio, $frameSize);
		$mensaje .= '<p style="text-align:center;">';
			$mensaje .= '<img src="'.$ruta.$dir.$numcupon.'.png" height="200" width="200" />';
		$mensaje .= '</p>';
		// Hasta aqui
		$mensaje .= '<p style="text-align:center;">'.$hash.'</p>';

		$mensaje .= '¡Te esperamos!'.'<br/><br/>';

		$mensaje .= 'Atentamente'.'<br/><br/>';
		$mensaje .= 'Cash-Flag'.'<br/><br/>';

		$mensaje .= '<b>Nota:</b> Esta cuenta no es monitoreada, por favor no respondas este email, si deseas comunicarte con tu club escribe a: <b><a href="mailto:info@cash-flag.com">info@cash-flag.com</a></b>'.'<br/><br/>';

		// $mensaje .= $numcupon;

		$asunto = trim($_POST["nombres"]).' ganaste un premio en '.($nombreproveedor).' por tu compra.';
		// $cabeceras = 'Content-type: text/html;';

		$cabeceras = 'Content-type: text/html'."\r\n";
		$cabeceras .= 'From: Cash-Flag <info@cash-flag.com>';
	//   if ($_SERVER["HTTP_HOST"]!='localhost') {
			// mail($correo,$asunto,$mensaje,$cabeceras);
			cashflagemail($correo, trim($_POST["nombres"]), $asunto, $mensaje);
			// }

		$a = fopen('log.html','w+');
		fwrite($a,$asunto);
		fwrite($a,'-');
		fwrite($a,$mensaje);

		$respuesta = '{"exito":"SI","mensaje":' . mensajes($archivojson,"exitoregistrocupon") . ',"cupon":"'.$numcupon.'","cuponlargo":"'.$cuponlargo.'"}';
//		$respuesta = '{"exito":"SI","mensaje":' . mensajes($archivojson,"exitoregistrocupon") . ',"cupon":"'.$numcupon.'",';
//		$respuesta .= '"contenido":'.$contenido.',"filename":"'.$filename.'"}';

	} else {
		$respuesta = '{"exito":"NO","mensaje":' . mensajes($archivojson,"fallaregistrocupon") . ',"cupon":"0","cuponlargo":"0"}';
	}
}
echo $respuesta;


// function asignacodigo($ultcupon){
// 	$valores = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// 	$a = strlen($valores)-1;
// 	$base = 36;
// 	$codigo = '';
// 	$arriba = 1;
// 	$newcodigo = '';
// 	$numero = $ultcupon;
// 	// echo $numero.'<br>';
// 	for ($i=strlen($ultcupon)-1 ; $i>=0 ; $i--) { 
// 		$pos = strpos($valores, substr($numero,$i,1));
// 		if ($arriba==1) {
// 			if ($pos==$a) {
// 				$codigo = substr($valores,0,1);
// 			} else {
// 				$codigo = substr($valores,$pos+1,1);
// 				$arriba = 0;
// 			}
// 		} else {
// 			$codigo = substr($numero,$i,1);
// 		}
// 		$newcodigo = $codigo.$newcodigo;
// 	}
// 	// switch (strlen($newcodigo)) {
// 	// 	case '1':
// 	// 		$newcodigo = '0000'.$newcodigo;
// 	// 		break;
// 	// 	case '2':
// 	// 		$newcodigo = '000'.$newcodigo;
// 	// 		break;
// 	// 	case '3':
// 	// 		$newcodigo = '00'.$newcodigo;
// 	// 		break;
// 	// 	case '4':
// 	// 		$newcodigo = '0'.$newcodigo;
// 	// 		break;
// 	// }
// 	for ($i=0 ; $i< strlen($newcodigo); $i++) { 
// 		// echo substr($newcodigo,$i,1).'<br>';
// 	}

// 	return $newcodigo;
// }

// function asignacodigolargo($ultcupon){
// 	$newcodigo = $ultcupon;

// 	$cuponlargo = substr($newcodigo,0,2);
// 	// $cuponlargo .= codigocaracter(strtoupper(substr($_POST["email"],-1)));
// 	$cuponlargo .= substr($newcodigo,2,2);
// 	// $cuponlargo .= codigocaracter(strtoupper(substr($_POST["nombres"],-1)));
// 	$cuponlargo .= substr($newcodigo,4,2);
// 	// $cuponlargo .= codigocaracter(strtoupper(substr($_POST["apellidos"],-1)));
// 	$cuponlargo .= substr($newcodigo,6,2);
// 	// $cuponlargo .= codigocaracter(strtoupper(substr($_POST["telefono"],-1)));
// 	$cuponlargo .= substr($newcodigo,8,2);

// 	return $cuponlargo;
// }

// function codigocaracter($valor) {
// 	$llaves = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// 	$codigos =  '111213141A1B1C1D212223242A2B2C2D3132';
// 	$codigos .= '33343A3B3C3D414243444A4B4C4DA1A2A3A4';

// 	$posicion = strpos($llaves, $valor);
// 	$pos2 = $posicion*2;
// 	$newvalor = substr($codigos,$pos2,2);

// 	return $newvalor;
// }
?>
