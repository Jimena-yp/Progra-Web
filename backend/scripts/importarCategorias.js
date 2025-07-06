const sequelize = require('../models');
const Categoria = require('../models/Categoria');

const categorias = [
  {
    nombre: "Deporte",
    imagen: "https://guiasdeportivas.com/imagenes/tipos-de-deportes.jpg"
  },
  {
    nombre: "Hogar",
    imagen: "https://tse3.mm.bing.net/th/id/OIP.6o73z9dfwcY1hcinYCDAJwHaHW?r=0&w=470&h=470&c=7"
  },
  {
    nombre: "Electrónica",
    imagen: "https://tse1.mm.bing.net/th/id/OIP.ddGAHAzHMiFHMXTcvxxbswHaFN?r=0&w=333&h=333&c=7"
  },
  {
    nombre: "Frutas y verduras",
    imagen: "https://cdn.shopify.com/s/files/1/0271/8960/8525/files/Tips_para_saber_como_elegir_frutas_y_verduras_480x480.jpg?v=1672343820"
  },
  {
    nombre: "Ropa",
    imagen: "https://tse3.mm.bing.net/th/id/OIP.9CdXdir1WDghlXaJSRrzVgHaGW?w=406&h=406&c=7"
  }
];

async function importar() {
  try {
    await sequelize.sync();
    for (const cat of categorias) {
      const [categoria, created] = await Categoria.findOrCreate({
        where: { nombre: cat.nombre },
        defaults: { imagen: cat.imagen }
      });
      if (!created && categoria.imagen !== cat.imagen) {
        categoria.imagen = cat.imagen;
        await categoria.save();
      }
    }
    console.log('✅ Categorías importadas o actualizadas correctamente');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error importando categorías:', err);
    process.exit(1);
  }
}

importar();
