<?php
header('Content-Type: application/json');
include_once("../_config/conexion.php");
include_once("../php/funciones.php");

$archivojson = "../canje/canje.json";

$hash = hash("sha256",$_POST['id_proveedor'].$_POST["clavecanje"]);

// Buscar datos de proveedor
$query = "select * from proveedores where id=".$_POST['id_proveedor'];
// $query = "select * from proveedores where id=1";

$result = mysqli_query($link, $query);
if ($row = mysqli_fetch_array($result)) {
	$clavecanje=$row["clavecanje"];
	// if ($clavecanje==$_POST["clavecanje"]) {
	if ($clavecanje==$hash) {
		$respuesta = '{"exito":"SI","mensaje":""}';
	} else {
		$respuesta = '{"exito":"NO","mensaje":' . mensajes($archivojson,"claveincorrecta") . '}';
	}
}

echo $respuesta;

?>
