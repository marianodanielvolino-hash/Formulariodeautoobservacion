document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    const adminTokenInput = document.getElementById('adminToken');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const exportBtn = document.getElementById('exportBtn');
    const respuestasLista = document.getElementById('respuestasLista');
    const loginError = document.getElementById('loginError');

    let currentToken = sessionStorage.getItem('adminToken');

    // Si ya hay token en sesión, intentamos cargar datos
    if (currentToken) {
        mostrarPanel();
    }

    loginBtn.addEventListener('click', () => {
        const token = adminTokenInput.value.trim();
        if (token) {
            currentToken = token;
            sessionStorage.setItem('adminToken', currentToken);
            mostrarPanel();
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminToken');
        currentToken = null;
        adminTokenInput.value = '';
        adminPanel.style.display = 'none';
        loginSection.style.display = 'block';
    });

    exportBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/exportar', {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            
            if (!response.ok) throw new Error('No autorizado');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'respuestas.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            alert('Error al exportar. Verifique su token.');
        }
    });

    async function mostrarPanel() {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        loginError.style.display = 'none';
        await cargarRespuestas();
    }

    async function cargarRespuestas() {
        try {
            const response = await fetch('/api/respuestas', {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });

            if (response.status === 401) {
                // Token inválido
                sessionStorage.removeItem('adminToken');
                currentToken = null;
                adminPanel.style.display = 'none';
                loginSection.style.display = 'block';
                loginError.textContent = 'Token inválido';
                loginError.style.display = 'block';
                return;
            }

            const respuestas = await response.json();
            renderizarRespuestas(respuestas);
        } catch (error) {
            console.error('Error:', error);
            respuestasLista.innerHTML = '<p>Error al cargar las respuestas.</p>';
        }
    }

    function renderizarRespuestas(respuestas) {
        if (respuestas.length === 0) {
            respuestasLista.innerHTML = '<p>No hay respuestas registradas aún.</p>';
            return;
        }

        respuestasLista.innerHTML = '';
        respuestas.forEach(r => {
            const date = new Date(r.fecha_creacion).toLocaleString('es-AR');
            const sede = r.datos.sede || 'Sin nombre';
            const estado = r.datos.estado_edificio || '-';
            
            const card = document.createElement('div');
            card.className = 'respuesta-card';
            card.innerHTML = `
                <div class="respuesta-info">
                    <h3>${sede}</h3>
                    <p><strong>Fecha:</strong> ${date}</p>
                    <p><strong>Estado:</strong> ${estado}</p>
                </div>
                <div class="respuesta-actions">
                    <button class="btn-secondary" onclick="verDetalle(${r.id})">Ver</button>
                    <button class="btn-danger" onclick="eliminarRespuesta(${r.id})">Eliminar</button>
                </div>
            `;
            respuestasLista.appendChild(card);
        });
    }

    // Hacer funciones globales para que las llamen los botones generados
    window.verDetalle = async (id) => {
        try {
            const response = await fetch(`/api/respuestas/${id}`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            const data = await response.json();
            
            let html = `Detalles de Sede:\n\n`;
            for (const [key, value] of Object.entries(data.datos)) {
                html += `${key}: ${value}\n`;
            }
            alert(html);
        } catch (error) {
            alert('Error al cargar detalle');
        }
    };

    window.eliminarRespuesta = async (id) => {
        if (confirm('¿Está seguro de eliminar esta respuesta?')) {
            try {
                const response = await fetch(`/api/respuestas/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                
                if (response.ok) {
                    cargarRespuestas();
                } else {
                    alert('Error al eliminar');
                }
            } catch (error) {
                alert('Error al eliminar');
            }
        }
    };
});
