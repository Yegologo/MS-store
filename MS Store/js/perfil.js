document.addEventListener("DOMContentLoaded", () => {
    const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
    const mainContent = document.querySelector(".perfil-main");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const section = link.dataset.section;

            // Remueve la clase 'active' de todos
            document.querySelectorAll(".sidebar-nav li").forEach(li => li.classList.remove("active"));
            // Añade 'active' al elemento actual
            link.parentElement.classList.add("active");

            // Cargar contenido dinámico
            loadSectionContent(section);
        });
    });

    function loadSectionContent(section) {
        switch(section) {
            case "datos":
                mainContent.innerHTML = `
                    <h2>Datos Personales</h2>
                    <p>Aquí van los datos personales del usuario.</p>
                `;
                break;
            case "historial":
                mainContent.innerHTML = `
                    <h2>Historial de Pedidos</h2>
                    <p>Aquí se muestra el historial de pedidos del usuario.</p>
                `;
                break;
            case "cerrar":
                mainContent.innerHTML = `
                    <h2>Cerrar sesión</h2>
                    <p>¿Estás seguro que deseas cerrar sesión?</p>
                    <button id="confirmar-cierre">Cerrar sesión</button>
                `;
                // Simula una acción
                document.getElementById("confirmar-cierre").addEventListener("click", () => {
                    alert("Sesión cerrada.");
                    // Aquí podrías redirigir o limpiar localStorage/sessionStorage
                });
                break;
            default:
                mainContent.innerHTML = `<p>Sección no encontrada.</p>`;
        }
    }

    // Opcional: Carga inicial
    loadSectionContent("datos");
});
