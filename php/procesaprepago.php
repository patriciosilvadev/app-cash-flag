<?php 
include_once("../_config/conexion.php");
include_once("./funciones.php");

$registro = json_decode($_GET['registro'],true);
$url = (isset($_GET['url'])) ? $_GET['url'] : "https://app.cash-flag.com" ;
// $_GET["tk"]

// Asignación de variables
$nombres = $registro['nombres'];
$apellidos = $registro['apellidos'];
$telefono = $registro['telefono'];
$email = $registro['email'];
$moneda = $registro['moneda'];
$monto = $registro['monto'];
switch ($moneda) {
	case 'bs':
		$montobs = $monto; $montodolares = 0.00; $montocripto = 0.00; 
		break;
	case 'dolar':
		$montobs = 0.00; $montodolares = $monto; $montocripto = 0.00; 
		break;
	case 'ae':
		$montobs = 0.00; $montodolares = 0.00; $montocripto = $monto; 
		break;
	default:
		$montobs = $monto; $montodolares = 0.00; $montocripto = 0.00; 
		break;
}
$tipotransaccion = '01';
$tasadolarbs = 1.00;
$tasadolarcripto = 1.00;
$idproveedor = $registro['idproveedor'];
$tipopago = $registro['tipopago'];
$origen = $registro['origen'];
$referencia = $_GET["tk"];

// Buscar el nombre del proveedor para generar la giftcard
$query = "select * from proveedores where id=".$idproveedor;
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
    $nombreproveedor = $row["nombre"];
} else {
    $nombreproveedor = '';
}

// Buscar el id del socio (si existe)
$query = "select * from socios where email='".trim($email)."'";
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
    $idsocio = $row["id"];
} else {
    $idsocio = 0;
}

// Buscaar datos de la tarjeta
$tarjetaexiste = false;
$query = "select * from prepago where email='".trim($email)."' and moneda='".trim($moneda)."'";
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	// Busca la tarjeta existente
	$tarjetaexiste = true;
    $card = $row["card"];
    $saldoant = $row["saldo"];
    $saldo = ($tipopago == 'efectivo' || $tipopago == 'online') ? $row["saldo"]+$monto : $row["saldo"] ;
} else {
	// Generar la tarjeta
	$tarjetaexiste = false;
	$card = generaprepago($nombres,$apellidos,$telefono,$email,$nombreproveedor,$moneda,$link);
    $saldoant = 0.00;
    $saldo = ($tipopago == 'efectivo' || $tipopago == 'online') ? $monto : 0.00 ;
}

// Fecha de compra
$fecha = date('Y-m-d');

// // Fecha de vecnimiento (1 año)
// $fechavencimiento = strtotime('+1 year', strtotime ($fecha));
// $fechavencimiento = date('Y-m-d', $fechavencimiento);

// $datetime1 = date_create($fecha);
// $datetime2 = date_create($fechavencimiento);
// $diferencia = date_diff($datetime1, $datetime2);

// Status, si es en efectivo queda lista para usar de inmediato, si no queda por conciliar
$status = ( $tipopago == 'efectivo' || $tipopago == 'online') ? 'Lista para usar' : 'Por confirmar pago' ;

// Encripta la giftcard
$hash = hash("sha256",$card.$nombres.$apellidos.$telefono.$email.$monto.$idproveedor.$moneda);

$query = "INSERT INTO prepago_transacciones (idsocio, fecha, tipotransaccion, tipomoneda, montobs, montodolares, montocripto, tasadolarbs, tasadolarcripto, documento, origen, status, card) VALUES (".$idsocio.",'".$fecha."','".$tipotransaccion."','".$moneda."',".$montobs.",".$montodolares.",".$montocripto.",".$tasadolarbs.",".$tasadolarcripto.",'".$referencia."','".$origen."','".$status."','".$card."')";
if ($result = mysqli_query($link,$query)) {
	if ($tarjetaexiste) {
		$query = "UPDATE prepago SET saldo=".$saldo." WHERE card='".trim($card)."'";
		$result = mysqli_query($link,$query);
	} else {
		$query = "INSERT INTO prepago (card, nombres, apellidos, telefono, email, saldo, saldoentransito, moneda, fechacompra, status, id_socio, id_proveedor, hash) VALUES ('".$card."','".$nombres."','".$apellidos."','".$telefono."','".$email."',".$monto.",0.00,'".$moneda."','".$fecha."','".$status."',".$idsocio.",".$idproveedor.",'".$hash."')";
		$result = mysqli_query($link,$query);
	}
}
?>
