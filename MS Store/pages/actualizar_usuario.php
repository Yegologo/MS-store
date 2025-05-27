<?php
header('Content-Type: application/json');
include 'conexion.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['id'], $data['nombre'], $data['email'], $data['estado'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos o JSON inválido']);
    exit();
}

$id = intval($data['id']);
$nombre = trim($data['nombre']);
$email = trim($data['email']);
$estado = intval($data['estado']);

try {
    $conn = getDBConnection();

    // Verificar si el email está en uso por otro usuario
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
    $stmt->bind_param("si", $email, $id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'El email ya está en uso por otro usuario']);
        exit();
    }
    $stmt->close();

    // Actualizar usuario
    $stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, email = ?, estado = ? WHERE id = ?");
    $stmt->bind_param("ssii", $nombre, $email, $estado, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el usuario']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>
