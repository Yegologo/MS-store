<?php
$id = intval($_GET['id']);
$res = $conn->query("SELECT * FROM productos WHERE id = $id");
echo json_encode($res->fetch_assoc());
?>
