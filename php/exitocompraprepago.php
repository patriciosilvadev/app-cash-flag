<?php
include_once("../_config/conexion.php");
include_once("./funciones.php");

$registro = json_decode($_GET['registro'],true);
$url = (isset($_GET['url'])) ? $_GET['url'] : "https://app.cash-flag.com" ;

// Asignación de variables
$nombres = $registro['nombres'];
$apellidos = $registro['apellidos'];
$email = $registro['email'];
$moneda = $registro['moneda'];
$idproveedor = $registro['idproveedor'];

// Buscaar logo del proveedor
$query = "select * from proveedores where id=".$idproveedor;
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
    $logo = trim($row["logo"]);
} else {
    $logo = '';
}

// Sección para mostrar la ventana de éxito
echo '
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<!-- <meta name="viewport" content="width=device-width, initial-scale=1.0, scalable=yes"> -->
		<title>Cash-Flag</title>
		<link rel="stylesheet" href="./compra.css">
		<script type="text/javascript" src="../js/funciones.js"></script>
	</head>
	<body">
		<div id="container">
			<div class="logo" align="center">
				<img class="img-logo" id="logo" src="../img/'.$logo.'" alt="">
			</div>
			<h2 style="text-align: center; color: black;">Cash-Flag</h2>
			<h3 align="center">Recargar tarjetas prepagadas</h3>
			<div id="div1" align="center">
				<div class="logo" align="center">
					<img class="img-logo" id="check" src="../img/exito1.png" alt="">
				</div>
				<h3 align="center">Transacción registrada exitosamente!!!</h3>
			</div>
		</div>
	</body>
</html>';
// Hasta aqui

// Buscaar datos de la tarjeta
$query = "select * from prepago where email='".trim($email)."' and moneda='".trim($moneda)."'";
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	// Busca la tarjeta existente
    $card = $row["card"];
    $saldo = $row["saldo"];
} else {
	// Generar la tarjeta
	$card = '';
    $saldo = 0.00;
}

$txtcard = substr($card,0,4).'-'.substr($card,4,4).'-'.substr($card,8,4).'-'.substr($card,12,4);

$mensaje = '["Tarjeta prepagada recargada exitosamente:","",';
$mensaje .= '"A nombre de: '.trim($nombres).' '.trim($apellidos).'",';
$mensaje .= '"Número de tarjeta: '.$txtcard.'",';
$mensaje .= '"Su nuevo saldo es de: ';
switch ($moneda) {
	case 'bs':     $mensaje .= "Bs. ";     break;
	case 'dolar':  $mensaje .= "US$ ";     break;
	case 'ae': $mensaje .= "AE "; break;
}
$mensaje .= number_format($saldo,2,',','.').'"]';

///////////////////////////////////////////////////////////////////////////////////////////////////////
$cadena = $url.'&exito=si&mensaje='.$mensaje; 
// $cadena = 'https://app.cash-flag.com/prepago/exito.html'; 

echo "
	<script>
		parent.opener.location.assign('".$cadena."');
		window.close();
	</script>
	";
?>
