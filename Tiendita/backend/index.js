const express = require('express');
const cors = require('cors');
const sequelize = require('./models');
const Usuario = require('./models/Usuario');
const Orden = require('./models/Orden');
const Producto = require('./models/Producto');
const Categoria = require('./models/Categoria'); 

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para ver usuarios
app.get('/api/usuarios', async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

// Ruta para registrar usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nombre, apellido, correo, password, rol } = req.body;
    const nuevoUsuario = await Usuario.create({ nombre, apellido, correo, password, rol });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para crear una orden
app.post('/api/ordenes', async (req, res) => {
  try {
    const { usuarioId, total, estado, fecha } = req.body;
    const nuevaOrden = await Orden.create({ usuarioId, total, estado, fecha });
    res.status(201).json(nuevaOrden);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para registrar productos
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, precio, categoria, imagen, descripcion } = req.body;
    const nuevoProducto = await Producto.create({ nombre, precio, categoria, imagen, descripcion });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para ver productos
app.get('/api/productos', async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

// Ruta para ver todas las órdenes o filtrar por usuario y/o fechas
app.get('/api/ordenes', async (req, res) => {
  try {
    const { usuarioId, desde, hasta } = req.query;
    const where = {};
    if (usuarioId) where.usuarioId = usuarioId;
    if (desde || hasta) {
      where.fecha = {};
      if (desde) where.fecha['$gte'] = new Date(desde + 'T00:00:00');
      if (hasta) where.fecha['$lte'] = new Date(hasta + 'T23:59:59');
    }
    console.log('Filtro usado:', where); // Para debug
    const ordenes = await Orden.findAll({
      where,
      order: [['fecha', 'DESC']]
    });
    res.json(ordenes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rutas para categorías
app.get('/api/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categorias', async (req, res) => {
  try {
    const { nombre, imagen } = req.body;
    if (!nombre || !imagen) return res.status(400).json({ error: 'Nombre e imagen son obligatorios' });
    const nuevaCategoria = await Categoria.create({ nombre, imagen });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Actualizar datos de usuario
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { nombre, apellido, correo } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.correo = correo;
    await usuario.save();
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//asignar categoría a varios productos
app.put('/api/productos/asignar-categoria', async (req, res) => {
  try {
    const { categoria, productos } = req.body;
    if (!categoria || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    await Producto.update(
      { categoria },
      { where: { id: productos } }
    );
    res.json({ message: 'Productos actualizados' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});





sequelize.sync().then(() => {
  app.listen(3001, () => console.log('API corriendo en http://localhost:3001'));
});
