<?php 
// session_start();
header('Content-Type: application/json');
include_once("../_config/conexion.php");

$saldo = 0.00;
// Buscar prepago
$query = "SELECT * from prepago where card=".$_GET["t"];
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	$idproveedor = $row["id_proveedor"];
	$tipo = 'prepago';
	$nombres = trim($row["nombres"])." ".trim($row["apellidos"]);
	$saldo = $row["saldo"]-$row["saldoentransito"];
	$vencimiento = '12/2020';
	$qr = '';
} else {
	$query = "SELECT * from giftcards where card=".$_GET["t"];
	$result = mysqli_query($link, $query);
	if ($row = mysqli_fetch_array($result)) {
		$idproveedor = $row["id_proveedor"];
		$tipo = 'giftcard';
		$nombres = trim($row["nombres"])." ".trim($row["apellidos"]);
		$saldo = $row["saldo"];
		$vencimiento = '12/2020';
		$qr = '';
	}
}

// Buscar proveedor
$query = "SELECT * from proveedores where id=".$idproveedor;
$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	$logo = $row["logocard"];
}

$respuesta = '{"logocard":"'.$logo.'","tipo":"'.$tipo.'","nombres":"'.$nombres.'","vencimiento":"'.$vencimiento.'","saldo":'.$saldo.',"qr":"'.$qr.'"}';

echo $respuesta;
?>
