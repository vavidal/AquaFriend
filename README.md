**1. INTRODUCCIÓN A ESTE PROYECTO**

Aquafriend un proyecto académico de innovación digital el cual busca conjugar tecnología web y accesibilidad mediante el desarrollo de un sistema interactivo e inmersivo para el Acuario de Puyehue y su Granja Educativa.

Este sistema permitirá a estudiantes, familias, docentes y público general visualizar los espacios del acuario y la granja en 360°, además de eso acceder a información e historia del Acuario Puyehue. También se le permitirá a los diferentes colegios que quieran reservar una visita, poder contactarse directamente mediante un formulario a la coordinación del acuario.

**2. ¿QUÉ PROBLEMA BUSCAMOS RESOLVER?**

Hoy en día, muchas personas, especialmente niños, niñas y adultos mayores, no pueden acceder físicamente a espacios como acuarios o centros educativos rurales debido a la distancia geográfica, recursos económicos limitados o condiciones de discapacidad.

Además, la enseñanza de temáticas ambientales aún presenta barreras de acceso y métodos poco interactivos, lo que dificulta su comprensión y motivación por parte de los estudiantes.

**3. ¿QUÉ OFRECE LA PLATAFORMA AQUAFRIEND?**

**Zonas disponibles en la experiencia 360°**

- Recepcion Acuario
- Entrada al acuario
- Mirador de los 3 volcanes 
- Granja Educativa
- Exterior de la Granja

**Características principales**

- Vistas en 360° desde navegador web
- Información contextual integrada
- Diseño responsive (compatible con PC, tablet y móvil)
- Panel administrativo para gestionar imágenes, contenido y usuarios
- Formulario de contacto y agenda para establecimientos educacionales

**4. REQUISITOS PARA EJECUTAR LA PLATAFORMA**
   
**Requisitos mínimos**
- Node.js 18+
- Angular 17+ (Frontend)
- MySQL 8.x como gestor de base de datos
- API backend en Node.js + Express
- Git para control de versiones


**Recomendaciones adicionales**
- XAMPP / PHPMyAdmin para administrar la base de datos
- GitHub para sincronizar el repositorio

**5. ¿QUÉ NECESITA PARA PONER EN MARCHA EL SISTEMA?**

✔ Un servidor (local o en la nube) con Node.js 18+

 ✔ Un servidor MySQL con los scripts proporcionados
 
 ✔ Un entorno donde ejecutar el frontend (Angular build)
 
 ✔ Configurar variables de entorno (.env)
 
 ✔ Ejecutar:

**Frontend**

npm install

ng serve

Al ejecutarlo deberá salir lo siguiente: http://localhost:4200
Esto indica que el sistema ya esta corriendo y se puede ingresar presionando la tecla ‘CTRL + clik sobre el link ‘http://localhost:4200’

**Backend**

Creación del archivo .env, se debe crear dentro de la carpeta backend.

Tener andando XAMP:

Ubicarse en la carpeta ‘backend’

npm install express

node server.js

**6. MANTENIMIENTO Y ACTUALIZACIONES**

Se recomienda:

- Crear un respaldo semanal de la base de datos.
- Actualizar Node y Angular cada 6 meses aproximadamente.
- Mantener cuenta activa en GitHub para control de versiones.
- Respaldar imágenes 360° en un servidor seguro.

