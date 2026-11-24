// Configuración pública. La clave publicable de Supabase está hecha para ir en el navegador:
// los permisos los controla la seguridad por filas (RLS) de la base de datos.
// Nunca pongas aquí la clave secreta (service_role) ni el token de facturación.
window.REYNAS = {
  supabaseUrl: 'https://cauphvgvqtcvmcsvbyry.supabase.co',
  supabaseKey: 'sb_publishable_gpHao0azXWKB31UoQrRt-w_pFBnE3bY',
  whatsapp: '51918515262',
  // Súbelo (2, 3, 4…) cada vez que cambies fotos, CSS o JS: obliga a los navegadores a bajar la versión nueva.
  // Cambia también el mismo número en index.html (preload, styles.css y los scripts).
  version: '2'
};
