<?php
$host = "localhost";
$usuario = "tu_usuario"; // Cambia esto
$contrasena = "tu_contraseña"; // Cambia esto
$base_de_datos = "nombre_de_tu_base_de_datos"; // Cambia esto

$conexion = new mysqli($host, $usuario, $contrasena, $base_de_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>
