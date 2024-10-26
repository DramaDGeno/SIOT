const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'observatorio'
});

// Conectar a la base de datos
db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'SIOT',
    resave: false,
    saveUninitialized: true
}));

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM usuarios WHERE usuarios = ? AND contrasena = ?';
    
    db.query(query, [email, password], (err, results) => {
        if (err) return res.json({ success: false });
        if (results.length > 0) {
            const user = results[0];
            req.session.role = user.rol; // Guardar rol en la sesión

            if (user.rol === 'admin') {
                res.json({ success: true, redirect: '/registroOcupacionA.html' });
            } else if (user.rol === 'empleado') {
                res.json({ success: true, redirect: '/registroOcupacionE.html' });
            }
        } else {
            res.json({ success: false });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
