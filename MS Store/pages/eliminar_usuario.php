<?php
header('Content-Type: application/json');
include 'conexion.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID no proporcionado o JSON inválido']);
    exit();
}

$id = intval($data['id']);

try {
    $conn = getDBConnection();
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuario eliminado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se pudo eliminar el usuario']);
    }
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>
