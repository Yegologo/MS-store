<?php
$result = $conn->query("SELECT * FROM productos ORDER BY fecha_creacion DESC");
$productos = [];
while($row = $result->fetch_assoc()) $productos[] = $row;
echo json_encode(['success' => true, 'data' => $productos]);
?>
