### src/bridge/browserRuntime.ts
# BrowserRuntime

## Clase encargada de:
### mantener, exponer y liberar las instancias activas del navegador y sus páginas.

---

## Variables:

### `browser`: privada, se inicializa como `undefined`, se inicia usando la función `launch`. Almacena la instancia única del navegador Puppeteer.

### `pages`: privada, mapa de páginas lanzadas, la key es un string (ID proporcionado por el usuario), su value será un objeto `Page` de Puppeteer.

---

## Funciones:

### `launch`: async, Promise\<void>. Esta función sirve para inicializar la variable `browser`. Esta función debería ser la primera ejecutada luego de crear la instancia del `BrowserRuntime`. Si la variable `browser` ya existe, la función retorna sin crear un nuevo navegador.

### `launchPage`: async, Promise\<Page>. Esta función sirve para inicializar una nueva página y retorna esa misma página. Esta función debería ser ejecutada luego de llamar a `launch`. Si la variable `browser` es nula, devuelve un error. Requiere un ID único para asociar y poder recuperar la página posteriormente.

### `getPage`: (id: string) => Page. Esta función devuelve la página asociada con el ID proporcionado. Si el ID no existe en el mapa de páginas, lanza un error indicando que la página no fue encontrada. Útil para recuperar una página previamente creada sin necesidad de almacenar referencias externas.

### `disposePage`: async, (id: string) => Promise\<void>. Cierra la página asociada con el ID proporcionado y la elimina del mapa de páginas. Si el ID no existe, la función retorna sin realizar ninguna acción. Importante para liberar recursos cuando una página ya no es necesaria.

### `dispose`: async, Promise\<void>. Cierra todas las páginas activas y el navegador, liberando todos los recursos. Limpia el mapa de páginas y establece la variable `browser` como `undefined`. Debería llamarse al finalizar el uso completo del `BrowserRuntime` para evitar fugas de memoria.

---

## Ejemplo de uso:

```typescript
const runtime = new BrowserRuntime();

// Iniciar el navegador
await runtime.launch();

// Crear páginas
const page1 = await runtime.launchPage('pagina1');
const page2 = await runtime.launchPage('pagina2');

// Obtener una página por su ID
const paginaRecuperada = runtime.getPage('pagina1');

// Cerrar una página específica
await runtime.disposePage('pagina2');

// Cerrar todo
await runtime.dispose();