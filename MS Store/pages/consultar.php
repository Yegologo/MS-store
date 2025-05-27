<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Usuarios</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body class="bg-light">
<div class="container py-4">
    <h2 class="mb-4">Gestión de Usuarios</h2>

    <!-- Filtros -->
    <div class="row mb-3">
        <div class="col-md-4">
            <input id="busqueda" type="text" class="form-control" placeholder="Buscar por nombre o email">
        </div>
        <div class="col-md-3">
            <select id="filtro-estado" class="form-select">
                <option value="all">Todos los estados</option>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
            </select>
        </div>
        <div class="col-md-2">
            <button id="btn-buscar" class="btn btn-primary w-100">Buscar</button>
        </div>
    </div>

    <!-- Tabla de usuarios -->
    <div id="alertas"></div>
    <table class="table table-bordered table-hover" id="tabla-usuarios">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Registro</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Aquí se llenan los usuarios -->
        </tbody>
    </table>

    <!-- Modal de edición -->
    <div class="modal fade" id="modal-editar" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <form id="form-editar">
              <div class="modal-header">
                <h5 class="modal-title">Editar Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                  <input type="hidden" name="id" id="edit-id">
                  <div class="mb-3">
                      <label for="edit-nombre" class="form-label">Nombre</label>
                      <input type="text" class="form-control" name="nombre" id="edit-nombre" required>
                  </div>
                  <div class="mb-3">
                      <label for="edit-email" class="form-label">Email</label>
                      <input type="email" class="form-control" name="email" id="edit-email" required>
                  </div>
                  <div class="mb-3">
                      <label for="edit-estado" class="form-label">Estado</label>
                      <select class="form-select" name="estado" id="edit-estado">
                          <option value="1">Activo</option>
                          <option value="0">Inactivo</option>
                      </select>
                  </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-success">Guardar cambios</button>
              </div>
          </form>
        </div>
      </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
let usuarioActual = null;

// Cargar usuarios al iniciar
$(document).ready(function(){
    cargarUsuarios();

    $("#btn-buscar").click(function(){
        cargarUsuarios();
    });

    $("#busqueda").on('keypress', function(e){
        if(e.which === 13) cargarUsuarios();
    });

    $("#filtro-estado").change(function(){
        cargarUsuarios();
    });

    // Guardar cambios de edición
    $("#form-editar").submit(function(e){
        e.preventDefault();
        let datos = {
            id: $("#edit-id").val(),
            nombre: $("#edit-nombre").val(),
            email: $("#edit-email").val(),
            estado: parseInt($("#edit-estado").val())
        };
        $.ajax({
            url: "actualizar_usuario.php",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(datos),
            dataType: "json",
            success: function(res){
                mostrarAlerta(res.message, res.success ? 'success' : 'danger');
                if(res.success){
                    $("#modal-editar").modal('hide');
                    cargarUsuarios();
                }
            },
            error: function(){
                mostrarAlerta("Error de servidor al actualizar.", "danger");
            }
        });
    });
});

// Función para cargar usuarios
function cargarUsuarios(){
    let search = $("#busqueda").val();
    let estado = $("#filtro-estado").val();

    $.ajax({
        url: "datos.php",
        type: "GET",
        data: { search: search, estado: estado, limite: 50 },
        dataType: "json",
        success: function(data){
            let tbody = $("#tabla-usuarios tbody");
            tbody.empty();
            if(data.success && data.data.length > 0){
                data.data.forEach(function(u){
                    let estadoBtn = u.estado == 1
                        ? `<button class="btn btn-sm btn-outline-danger me-1" onclick="cambiarEstado(${u.id},0)">Inactivar</button>`
                        : `<button class="btn btn-sm btn-outline-success me-1" onclick="cambiarEstado(${u.id},1)">Activar</button>`;
                    tbody.append(`
                        <tr>
                            <td>${u.id}</td>
                            <td>${u.nombre}</td>
                            <td>${u.email}</td>
                            <td>${u.estado == 1 ? 'Activo' : 'Inactivo'}</td>
                            <td>${u.fecha_formateada ?? ''}</td>
                            <td>
                                <button class="btn btn-sm btn-warning me-1" onclick="mostrarEditar(${u.id}, '${u.nombre}', '${u.email}', ${u.estado})">Editar</button>
                                ${estadoBtn}
                                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id})">Eliminar</button>
                            </td>
                        </tr>
                    `);
                });
            }else{
                tbody.append('<tr><td colspan="6" class="text-center">No se encontraron usuarios.</td></tr>');
            }
        },
        error: function(){
            mostrarAlerta("Error al cargar usuarios.", "danger");
        }
    });
}

// Mostrar modal de edición
function mostrarEditar(id, nombre, email, estado){
    $("#edit-id").val(id);
    $("#edit-nombre").val(nombre);
    $("#edit-email").val(email);
    $("#edit-estado").val(estado);
    let modal = new bootstrap.Modal(document.getElementById('modal-editar'));
    modal.show();
}

// Cambiar estado (activo/inactivo)
function cambiarEstado(id, nuevoEstado){
    $.ajax({
        url: "cambiar_estado.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id: id, estado: nuevoEstado }),
        dataType: "json",
        success: function(res){
            mostrarAlerta(res.message, res.success ? 'success' : 'danger');
            if(res.success) cargarUsuarios();
        },
        error: function(){
            mostrarAlerta("Error al cambiar el estado.", "danger");
        }
    });
}

// Eliminar usuario
function eliminarUsuario(id){
    if(confirm("¿Seguro que deseas eliminar este usuario?")){
        $.ajax({
            url: "eliminar_usuario.php",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ id: id }),
            dataType: "json",
            success: function(res){
                mostrarAlerta(res.message, res.success ? 'success' : 'danger');
                if(res.success) cargarUsuarios();
            },
            error: function(){
                mostrarAlerta("Error al eliminar usuario.", "danger");
            }
        });
    }
}

// Mostrar alertas
function mostrarAlerta(msg, tipo){
    $("#alertas").html(`<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`);
}
</script>
</body>
</html>
