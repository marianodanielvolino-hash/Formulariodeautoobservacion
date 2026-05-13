document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('relevamientoForm');
    const statusMessage = document.getElementById('statusMessage');
    const formInputs = form.querySelectorAll('input, select, textarea');

    // Cargar borrador si existe
    const draft = localStorage.getItem('formDraft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            Object.keys(data).forEach(key => {
                const input = form.elements[key];
                if (input) {
                    input.value = data[key];
                }
            });
        } catch (e) {
            console.error('Error parseando el borrador', e);
        }
    }

    // Guardar borrador en cada cambio
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            const data = {};
            new FormData(form).forEach((value, key) => {
                data[key] = value;
            });
            localStorage.setItem('formDraft', JSON.stringify(data));
        });
    });

    // Manejar envío
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/respuestas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showMessage('Formulario enviado con éxito.', 'success');
                form.reset();
                localStorage.removeItem('formDraft');
            } else {
                const errorData = await response.json();
                showMessage(errorData.error || 'Error al enviar el formulario.', 'error');
            }
        } catch (error) {
            console.error('Error de red:', error);
            showMessage('Error de conexión. Intente nuevamente.', 'error');
        }
    });

    function showMessage(text, type) {
        statusMessage.textContent = text;
        statusMessage.className = `status-message ${type}`;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            statusMessage.style.display = 'none';
            statusMessage.className = 'status-message';
        }, 5000);
    }
});
