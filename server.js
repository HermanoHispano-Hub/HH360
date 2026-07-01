const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ikjndcivkhumxjmwekcn.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlram5kY2l2a2h1bXhqbXdla2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjcwMDksImV4cCI6MjA5ODUwMzAwOX0.9IgJYZp3NwXCkSgQ3TijLpaP_iAKYuEdeG__GnMRieI';
const PORT = process.env.PORT || 3000;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.post('/api/sos', async (req, res) => {
  try {
    const { nombre, telefono, latitud, longitud, precision_metros, mapa_url } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const { error } = await supabase.from('alertas_sos').insert([{
      nombre,
      telefono,
      latitud: latitud || null,
      longitud: longitud || null,
      precision_metros: precision_metros || null,
      mapa_url: mapa_url || null
    }]);

    if (error) throw error;

    console.log(`[SOS RECIBIDO] ${nombre} - ${telefono} - ${new Date().toLocaleString('es-SV', { timeZone: 'America/El_Salvador' })}`);
    res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Error guardando alerta:', err);
    res.status(500).json({ error: 'No se pudo guardar la alerta.' });
  }
});

app.get('/', (req, res) => res.send('HH360 SOS backend activo.'));

app.listen(PORT, () => console.log(`Servidor HH360 corriendo en puerto ${PORT}`));
