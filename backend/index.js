// Backend principal de la aplicación
const express = require('express');
const cors = require('cors');
const sequelize = require('./models');
const Usuario = require('./models/Usuario');
const Orden = require('./models/Orden');
const Producto = require('./models/Producto');
const Categoria = require('./models/Categoria');
const { Op, fn, col, where: whereSequelize } = require('sequelize');
const nodemailer = require('nodemailer');
const OrdenProducto = require('./models/OrdenProducto');

const app = express();
app.use(cors());
app.use(express.json());

// Nodemailer Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tienditaprograweb@gmail.com',
    pass: 'bcaj hyxo fwhn ekvo' 
  }
});

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
    const { usuarioId, total, estado, fecha, productos } = req.body;
    const nuevaOrden = await Orden.create({ usuarioId, total, estado, fecha });

    // Guardar productos de la orden
    if (Array.isArray(productos)) {
      for (const prod of productos) {
        await OrdenProducto.create({
          ordenId: nuevaOrden.id,
          productoId: prod.id,
          cantidad: prod.cantidad || 1
        });
      }
    }

    // Buscar el correo del usuario
    const usuario = await Usuario.findByPk(usuarioId);
    if (usuario && usuario.correo) {
      await transporter.sendMail({
        from: '"miTienda" <tienditaprograweb@gmail.com>',
        to: usuario.correo,
        subject: 'Confirmación de compra - miTienda',
        html: `
          <h2>¡Gracias por tu compra, ${usuario.nombre}!</h2>
          <p>Tu orden ha sido registrada correctamente.</p>
          <p><strong>Monto total:</strong> S/. ${total}</p>
          <p>Estado: ${estado}</p>
          <p>Fecha: ${fecha ? new Date(fecha).toLocaleString() : new Date().toLocaleString()}</p>
          <br>
          <p>Gracias por confiar en miTienda.</p>
        `
      });
    }

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

    // Filtro robusto por fecha (solo por día, ignora hora y zona)
    if (desde || hasta) {
      where[Op.and] = [];
      if (desde) {
        where[Op.and].push(whereSequelize(fn('DATE', col('fecha')), '>=', desde));
      }
      if (hasta) {
        where[Op.and].push(whereSequelize(fn('DATE', col('fecha')), '<=', hasta));
      }
    }

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
  const categorias = await Categoria.findAll();
  res.json(categorias);
});

app.post('/api/categorias', async (req, res) => {
  try {
    const { nombre, imagen } = req.body;
    const nuevaCategoria = await Categoria.create({ nombre, imagen });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Agrega esta ruta para borrar categorías
app.delete('/api/categorias/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    console.log('Intentando borrar categoría con id:', id);
    const deleted = await Categoria.destroy({ where: { id } });
    console.log('Resultado deleted:', deleted);
    if (deleted) return res.sendStatus(204);
    res.status(404).json({ error: 'Categoría no encontrada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar producto por ID
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Producto.destroy({ where: { id } });
    if (deleted) return res.sendStatus(204);
    res.status(404).json({ error: 'Producto no encontrado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

// Cambiar contraseña de usuario
app.put('/api/usuarios/:id/password', async (req, res) => {
  try {
    const { actual, nueva } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (usuario.password !== actual) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta.' });
    }
    usuario.password = nueva;
    await usuario.save();
    res.json({ mensaje: 'Contraseña cambiada exitosamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint para productos más vendidos del mes
app.get('/api/mas-vendidos', async (req, res) => {
  try {
    const { fn, col, literal } = require('sequelize');
    const ahora = new Date();
    const mes = ahora.getMonth() + 1;
    const anio = ahora.getFullYear();

    const masVendidos = await OrdenProducto.findAll({
      attributes: [
        'productoId',
        [fn('SUM', col('cantidad')), 'vendidos']
      ],
      include: [
        {
          model: Producto,
          attributes: ['id', 'nombre', 'precio', 'imagen']
        },
        {
          model: Orden,
          attributes: [],
          where: literal(`EXTRACT(MONTH FROM "Orden"."fecha") = ${mes} AND EXTRACT(YEAR FROM "Orden"."fecha") = ${anio}`)
        }
      ],
      group: ['productoId', 'Producto.id', 'Producto.nombre', 'Producto.precio', 'Producto.imagen'],
      order: [[fn('SUM', col('cantidad')), 'DESC']],
      limit: 4
    });

    const resultado = masVendidos.map(item => ({
      id: item.Producto.id,
      nombre: item.Producto.nombre,
      precio: item.Producto.precio,
      imagen: item.Producto.imagen,
      vendidos: parseInt(item.get('vendidos'), 10)
    }));

    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

sequelize.sync().then(() => {
  app.listen(3001, () => console.log('API corriendo en http://localhost:3001'));
});

