<?php 
header('Content-Type: application/json');
include_once("../_config/conexion.php");
include_once("./funciones.php");

$query = "INSERT INTO socios (email, status, telefono, nombres, apellidos, idproveedor, fechanacimiento, sexo, pais, estado, ciudad, nombre_pais, nombre_estado, nombre_ciudad, sector, direccion, donde_entregar, direccion_entrega, edocivil, nombrepareja, cumplepareja, aniversario, padre, nombrepadre, cumplepadre, madre, nombremadre, cumplemadre, hijos, menores5, menores10, menores20, mayores, otrotelef, vehiculo, cedula, rif, profesion, ocupacion, nombretrabajo, direcciontrabajo, emailtrabajo, telefonotrabajo, fecha_afiliacion, secretkey, account) VALUES ('".$_POST["email"]."', 'Activo', '".$_POST["telefono"]."', '".$_POST["nombres"]."', '".$_POST["apellidos"]."',".$_POST["idproveedor"].", '0000-00-00', '', 0, 0, 0, '', '', '', '', '', '', '', '', '', '0000-00-00', '0000-00-00', 0, '', '0000-00-00', 0, '', '0000-00-00', 0, 0, 0, 0, 0, '', 0, '', '', '', '', '', '', '', '', '".date("Y-m-d")."', '".$_POST["secretkey"]."', '".$_POST["account"]."')";
if($result = mysqli_query($link, $query)) {
    generatarjetaAE($_POST, $link);
	$respuesta = '{"exito":"SI",';
    $respuesta .= '"mensaje":"Registro exitoso"}';
} else {
	$respuesta = '{"exito":"NO",';
    $respuesta .= '"mensaje":"Falló el registro"}';
}
echo $respuesta;
?>
