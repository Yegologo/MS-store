<?php
$id = intval($_POST['id']);
$nombre = $_POST['nombre'] ?? '';
$categoria = $_POST['categoria'] ?? '';
$precio = $_POST['precio'] ?? '';
$stock = $_POST['stock'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$estado = $_POST['estado'] ?? 'activo';

$imagen = '';
if(isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0){
    $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $nombreImg = uniqid().'.'.$ext;
    move_uploaded_file($_FILES['imagen']['tmp_name'], '../../img/products/'.$nombreImg);
    $imagen = $nombreImg;
    $stmt = $conn->prepare("UPDATE productos SET nombre=?, categoria=?, precio=?, stock=?, descripcion=?, imagen=?, estado=? WHERE id=?");
    $stmt->bind_param("sssdissi", $nombre, $categoria, $precio, $stock, $descripcion, $imagen, $estado, $id);
} else {
    $stmt = $conn->prepare("UPDATE productos SET nombre=?, categoria=?, precio=?, stock=?, descripcion=?, estado=? WHERE id=?");
    $stmt->bind_param("sssdssi", $nombre, $categoria, $precio, $stock, $descripcion, $estado, $id);
}

if($stmt->execute()){
    echo json_encode(['success' => true, 'message' => 'Producto actualizado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar producto']);
}
$stmt->close();
$conn->close();
?>
