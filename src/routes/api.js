const express = require('express');
const router = express.Router();
const supabase = require('../db');

// Middleware para verificar el token de administración
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token === process.env.ADMIN_TOKEN) {
            return next();
        }
    }
    res.status(401).json({ error: 'No autorizado' });
};

// POST /api/respuestas - Guardar una nueva respuesta
router.post('/respuestas', async (req, res) => {
    const datos = req.body; // Guardaremos directamente el objeto en la columna JSONB de Supabase
    
    const { data, error } = await supabase
        .from('respuestas')
        .insert([{ datos: datos }])
        .select();

    if (error) {
        console.error('Error al guardar en Supabase:', error);
        return res.status(500).json({ error: 'Error al guardar la respuesta' });
    }
    
    res.status(201).json({ message: 'Respuesta guardada con éxito', id: data[0].id });
});

// GET /api/respuestas - Listar todas las respuestas (Requiere token)
router.get('/respuestas', adminAuth, async (req, res) => {
    const { data, error } = await supabase
        .from('respuestas')
        .select('*')
        .order('fecha_creacion', { ascending: false });

    if (error) {
        console.error('Error al obtener respuestas:', error);
        return res.status(500).json({ error: 'Error al obtener las respuestas' });
    }
    
    // Supabase ya devuelve JSON nativo
    res.json(data);
});

// GET /api/respuestas/:id - Ver detalle de una respuesta (Requiere token)
router.get('/respuestas/:id', adminAuth, async (req, res) => {
    const id = req.params.id;
    const { data, error } = await supabase
        .from('respuestas')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error al obtener respuesta:', error);
        return res.status(500).json({ error: 'Error al obtener la respuesta' });
    }
    
    if (!data) {
        return res.status(404).json({ error: 'Respuesta no encontrada' });
    }
    
    res.json(data);
});

// DELETE /api/respuestas/:id - Eliminar una respuesta (Requiere token)
router.delete('/respuestas/:id', adminAuth, async (req, res) => {
    const id = req.params.id;
    
    const { error } = await supabase
        .from('respuestas')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error al eliminar:', error);
        return res.status(500).json({ error: 'Error al eliminar la respuesta' });
    }
    
    res.json({ message: 'Respuesta eliminada con éxito' });
});

// GET /api/exportar - Exportar todas las respuestas a JSON (Requiere token)
router.get('/exportar', adminAuth, async (req, res) => {
    const { data, error } = await supabase
        .from('respuestas')
        .select('*')
        .order('fecha_creacion', { ascending: false });

    if (error) {
        console.error('Error al exportar:', error);
        return res.status(500).json({ error: 'Error al exportar las respuestas' });
    }
    
    res.setHeader('Content-disposition', 'attachment; filename=respuestas.json');
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(data, null, 2));
    res.end();
});

module.exports = router;
