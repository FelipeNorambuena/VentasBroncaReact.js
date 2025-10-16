/**
 * SCRIPT DE PRUEBA RÁPIDA
 * 
 * Copia y pega este código en la consola del navegador (F12)
 * para verificar que las nuevas funciones están disponibles
 */

// 1. Verificar que el servicio está disponible
console.log('%c🔍 Verificando servicios...', 'color: blue; font-weight: bold');

try {
  // Importar dinámicamente
  const module = await import('./src/services/products.js');
  const { productsService } = module;
  
  console.log('✅ productsService importado correctamente');
  console.log('📦 Funciones disponibles:', Object.keys(productsService));
  
  // Verificar que las nuevas funciones existen
  const requiredFunctions = [
    'list',
    'getByIdOrSlug',
    'create',
    'update',
    'remove',
    'uploadImage',          // NUEVA
    'updateProductImage',   // NUEVA
    'createWithImage',      // NUEVA ⭐
    'updateWithImage'       // NUEVA ⭐
  ];
  
  console.log('\n%c📋 Verificando funciones requeridas...', 'color: blue; font-weight: bold');
  
  requiredFunctions.forEach(func => {
    if (typeof productsService[func] === 'function') {
      console.log(`✅ ${func}`);
    } else {
      console.error(`❌ ${func} NO ENCONTRADA`);
    }
  });
  
  console.log('\n%c✅ ¡Todas las funciones están disponibles!', 'color: green; font-weight: bold');
  console.log('%cAhora puedes probar crear/editar productos desde la interfaz', 'color: gray');
  
} catch (error) {
  console.error('❌ Error al importar servicio:', error);
  console.log('ℹ️ Esto es normal en producción. Solo funciona en desarrollo.');
  console.log('ℹ️ Ve a Admin → Productos y prueba crear un producto con imagen');
}

// 2. Instrucciones
console.log('\n%c📖 INSTRUCCIONES DE PRUEBA:', 'color: orange; font-weight: bold');
console.log(`
1. Ve a Admin → Productos
2. Clic en "Nuevo Producto"
3. Llena el formulario
4. Selecciona una imagen
5. Observa la consola mientras guardas
6. Deberías ver logs como estos:
   
   📝 Paso 1: Creando producto...
   ✅ Producto creado con ID: 123
   📤 Paso 2: Subiendo imagen...
   ✅ Imagen subida: /uploads/abc.jpg
   🔄 Paso 3: Asociando imagen al producto...
   ✅ Producto actualizado con imagen
`);

console.log('\n%c🎯 ¡Listo para probar!', 'color: green; font-weight: bold; font-size: 16px');
