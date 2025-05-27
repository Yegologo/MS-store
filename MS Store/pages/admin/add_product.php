<?php
$nombre = $_POST['nombre'] ?? '';
$categoria = $_POST['categoria'] ?? '';
$precio = $_POST['precio'] ?? '';
$stock = $_POST['stock'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$estado = 'activo';

$imagen = '';
if(isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0){
    $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $nombreImg = uniqid().'.'.$ext;
    move_uploaded_file($_FILES['imagen']['tmp_name'], '../../img/products/'.$nombreImg);
    $imagen = $nombreImg;
}

$stmt = $conn->prepare("INSERT INTO productos (nombre, categoria, precio, stock, descripcion, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssdiss", $nombre, $categoria, $precio, $stock, $descripcion, $imagen, $estado);

if($stmt->execute()){
    echo json_encode(['success' => true, 'message' => 'Producto agregado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al agregar producto']);
}
$stmt->close();
$conn->close();
?>
