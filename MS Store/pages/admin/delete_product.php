<?php
$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id']);
$stmt = $conn->prepare("DELETE FROM productos WHERE id = ?");
$stmt->bind_param("i", $id);
if($stmt->execute()){
    echo json_encode(['success' => true, 'message' => 'Producto eliminado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar producto']);
}
$stmt->close();
$conn->close();
?>
