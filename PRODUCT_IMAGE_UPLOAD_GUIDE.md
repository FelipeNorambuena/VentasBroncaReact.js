# Guía: Carga de Productos con Imágenes

## 📋 Descripción del Flujo

Este sistema implementa un flujo de 3 pasos para crear/actualizar productos con imágenes:

1. **POST** `/product` - Crear el producto y obtener su ID
2. **POST** `/upload/image` - Subir la imagen al servidor
3. **PATCH** `/product/{id}` - Asociar la imagen al producto

## 🔧 Funciones Disponibles

### 1. `createWithImage(productData, imageFile)`

Crea un producto completo con imagen en un solo llamado.

**Parámetros:**
- `productData` (Object): Datos del producto (nombre, precio, descripción, etc.)
- `imageFile` (File|null): Archivo de imagen opcional

**Ejemplo de uso:**

```javascript
import { productsService } from './services/products'

// En un componente React con formulario
const handleSubmit = async (e) => {
  e.preventDefault()
  
  const productData = {
    nombre: 'Mochila Táctica',
    precio: 45000,
    descripcion: 'Mochila militar de alta resistencia',
    categoria: 'tactico',
    stock: 15,
    codigo_sku: 'MT-001'
  }
  
  // Obtener el archivo del input
  const imageFile = e.target.imagen.files[0]
  
  try {
    const product = await productsService.createWithImage(productData, imageFile)
    console.log('Producto creado:', product)
    alert('Producto creado exitosamente')
  } catch (error) {
    console.error('Error:', error)
    alert('Error al crear producto: ' + error.message)
  }
}
```

### 2. `updateWithImage(productId, productData, imageFile)`

Actualiza un producto existente y opcionalmente cambia su imagen.

**Parámetros:**
- `productId` (number): ID del producto a actualizar
- `productData` (Object): Datos a actualizar
- `imageFile` (File|null): Nueva imagen opcional

**Ejemplo de uso:**

```javascript
import { productsService } from './services/products'

const handleUpdate = async (productId) => {
  const productData = {
    nombre: 'Mochila Táctica Mejorada',
    precio: 48000,
    stock: 20
  }
  
  // Si hay nueva imagen
  const imageFile = document.getElementById('imagen').files[0]
  
  try {
    const product = await productsService.updateWithImage(
      productId,
      productData,
      imageFile // puede ser null si no se quiere cambiar la imagen
    )
    console.log('Producto actualizado:', product)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### 3. Funciones individuales (para uso manual)

#### `uploadImage(imageFile)`
Sube solo una imagen y retorna su ruta.

```javascript
const imageFile = document.getElementById('imagen').files[0]
const response = await productsService.uploadImage(imageFile)
console.log('Imagen subida:', response.path)
```

#### `updateProductImage(productId, imagePath)`
Asocia una imagen a un producto existente.

```javascript
await productsService.updateProductImage(123, '/path/to/image.jpg')
```

## 🎨 Ejemplo Completo: Formulario de Creación

```jsx
import React, { useState } from 'react'
import { productsService } from '../services/products'

function CrearProducto() {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = {
      nombre: e.target.nombre.value,
      precio: parseFloat(e.target.precio.value),
      descripcion: e.target.descripcion.value,
      categoria: e.target.categoria.value,
      stock: parseInt(e.target.stock.value),
      codigo_sku: e.target.codigo_sku.value,
    }

    const imageFile = e.target.imagen.files[0]

    try {
      const product = await productsService.createWithImage(formData, imageFile)
      alert('Producto creado exitosamente con ID: ' + product.id)
      e.target.reset()
      setPreview(null)
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Producto</h2>
      
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del producto"
        required
      />
      
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        step="0.01"
        required
      />
      
      <textarea
        name="descripcion"
        placeholder="Descripción"
        required
      />
      
      <select name="categoria" required>
        <option value="">Seleccionar categoría</option>
        <option value="tactico">Táctico</option>
        <option value="militar">Militar</option>
        <option value="camping">Camping</option>
        <option value="otros">Otros</option>
      </select>
      
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        required
      />
      
      <input
        type="text"
        name="codigo_sku"
        placeholder="Código SKU"
        required
      />
      
      <div>
        <label>Imagen del producto:</label>
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleImageChange}
        />
        {preview && (
          <img src={preview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
        )}
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Producto'}
      </button>
    </form>
  )
}

export default CrearProducto
```

## 🔍 Respuestas de los Endpoints

### POST `/product`
```json
{
  "id": 123,
  "nombre": "Mochila Táctica",
  "precio": 45000,
  "descripcion": "Mochila militar de alta resistencia",
  "categoria": "tactico",
  "stock": 15,
  "codigo_sku": "MT-001",
  "imagen": null,
  "created_at": 1234567890
}
```

### POST `/upload/image`
```json
{
  "path": "/uploads/images/abc123def456.jpg"
}
```
o
```json
{
  "url": "https://ejemplo.com/imagen.jpg"
}
```

### PATCH `/product/{id}`
```json
{
  "id": 123,
  "nombre": "Mochila Táctica",
  "precio": 45000,
  "descripcion": "Mochila militar de alta resistencia",
  "categoria": "tactico",
  "stock": 15,
  "codigo_sku": "MT-001",
  "imagen": "/uploads/images/abc123def456.jpg",
  "created_at": 1234567890,
  "updated_at": 1234567900
}
```

## ⚠️ Manejo de Errores

Todas las funciones lanzan errores que puedes capturar:

```javascript
try {
  const product = await productsService.createWithImage(data, image)
} catch (error) {
  if (error.code === 401) {
    console.error('No autorizado')
  } else if (error.code === 400) {
    console.error('Datos inválidos:', error.details)
  } else {
    console.error('Error general:', error.message)
  }
}
```

## 📝 Notas Importantes

1. **Autenticación**: Todas las operaciones requieren autenticación (token Bearer)
2. **Formato de imagen**: El endpoint acepta FormData con el campo `image`
3. **Respuesta flexible**: El código maneja diferentes formatos de respuesta del servidor (path, url, imagen)
4. **Logs detallados**: Todas las operaciones generan logs en consola para debugging
5. **Transaccionalidad**: Si falla la subida de imagen, el producto ya está creado (considera implementar rollback si es necesario)

## 🚀 Uso Rápido

```javascript
// Crear producto sin imagen
const product = await productsService.createWithImage(productData)

// Crear producto con imagen
const product = await productsService.createWithImage(productData, imageFile)

// Actualizar producto sin cambiar imagen
const product = await productsService.updateWithImage(productId, productData)

// Actualizar producto y su imagen
const product = await productsService.updateWithImage(productId, productData, newImageFile)
```
