const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// Función auxiliar: devuelve true si falta alguno de los tres campos obligatorios
function faltanCampos(nombre, descripcion, precio) {
    return [nombre, descripcion, precio].some(valor => valor === undefined || valor === null || valor === '')
}

// Función auxiliar (reto opcional): el precio debe ser un número mayor que cero
function precioValido(precio) {
    return !isNaN(precio) && precio > 0
}

// POST /productos - Crear nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body || {}

    // Si falta alguno de los tres campos: 400
    if (faltanCampos(nombre, descripcion, precio)) {
        return res.status(400).json({ mensaje: 'Los campos nombre, descripcion y precio son obligatorios' })
    }

    // Convierto el precio a número y valido que sea mayor que cero
    const precioNumerico = parseFloat(precio)
    if (!precioValido(precioNumerico)) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número mayor que cero' })
    }

    // Nuevo id = el id más alto que existe + 1 (así nunca se repite, aunque se hayan eliminado productos)
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1

    const nuevoProducto = { id: nuevoId, nombre, descripcion, precio: precioNumerico }
    productos.push(nuevoProducto)

    res.status(201).json(nuevoProducto)
})


// PUT /productos/:id - Actualizar producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // Si el producto no existe: 404
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const { nombre, descripcion, precio } = req.body || {}

    // Si falta alguno de los tres campos: 400
    if (faltanCampos(nombre, descripcion, precio)) {
        return res.status(400).json({ mensaje: 'Los campos nombre, descripcion y precio son obligatorios' })
    }

    const precioNumerico = parseFloat(precio)
    if (!precioValido(precioNumerico)) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número mayor que cero' })
    }

    // Reemplazo los datos del producto conservando su mismo id
    productos[indice] = { id: id, nombre, descripcion, precio: precioNumerico }

    res.status(200).json(productos[indice])
})


// DELETE /productos/:id - Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // Si el producto no existe: 404
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // splice elimina el producto del arreglo y devuelve un arreglo con lo eliminado
    const productoEliminado = productos.splice(indice, 1)[0]

    res.status(200).json({ mensaje: 'Producto eliminado', producto: productoEliminado })
})


// Manejo de errores: si el JSON de la petición está mal escrito, se responde 400 en formato JSON
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' })
    }
    console.error(err)
    res.status(500).json({ mensaje: 'Error interno del servidor' })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
