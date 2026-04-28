# Dashboard Radio UTPL — inventario detallado + cotejo con memoria

Fecha del documento: 2026-04-27

Este documento resume **qué hay actualmente en el dashboard de Radio UTPL**, cómo está armado el proyecto, qué estados figuran hoy y cómo eso **coincide o no** con lo que fui guardando en memoria durante las últimas conversaciones sobre el dashboard.

---

## 1) Estado técnico actual del dashboard

### Dominio y publicación
- Dominio público: `https://radio.backstageec.com/`
- Versión visible actual del dashboard: **`version 2026-04-23 03:09`**
- Estado central publicado (`radio-planner-state.json`): **`updatedAt = 2026-04-23T03:09:00Z`**
- Verificación hecha contra la copia pública y coincide con la copia local del proyecto.

### Archivos principales del proyecto
Los archivos clave del dashboard son:
- `dashboard.html` → interfaz principal visible
- `radio-planner-state.json` → estado operativo central del planner
- `index.php` → sirve `dashboard.html` como portada del subdominio
- `.htaccess` → reglas de HTTPS y anticaché

### Cómo funciona
- `index.php` entrega `dashboard.html` con headers de no caché.
- `.htaccess` fuerza HTTPS y desactiva caché para:
  - `index.php`
  - `dashboard.html`
  - `radio-planner-state.json`
- El dashboard mezcla dos capas:
  1. **parrilla/horarios visibles** en `dashboard.html`
  2. **estado operativo real** en `radio-planner-state.json`

---

## 2) Qué programas están visibles en la parrilla del dashboard

### Lunes
- **08:00 — Equinoccio**
  - Área: Radio Loja
  - Meta visible: retransmisión / enlace de señal
- **11:30 — Derechos a Boca**
  - Área: Derecho
  - Meta visible: Cristian envía el programa para carga en ZaraRadio

### Martes
- **11:00 — Nutri Academia**
  - Área: Nutrición
  - Meta visible: programa quincenal; encargado Alex; contacto relacionado Pablo Cueva

### Miércoles
- **09:00 — Un café con Fabiola**
  - Área: Psicología
  - Meta visible: programa de 30 minutos + mini podcast posterior
- **11:00 — Ecoconexión**
  - Área: Biología y Gestión Ambiental
  - Meta visible: Salomé; semanal; insumos 2 días antes; sale por Facebook y streaming

### Jueves
- **09:30 — Cosechando Prevención**
  - Área: Salomé
  - Meta visible: quincenal; insumos 2 días antes; Facebook + streaming
- **11:30 — Huella**
  - Área: Salomé
  - Meta visible: “ya se transmitió el jueves anterior, 2026-04-09”; auspicio Ecolac
- **15:00 — Rincón Económico**
  - Área: Vanessa
  - Meta visible: se mantiene jueves 15:00; Facebook + ZaraRadio
- **17:00 — Sembrando Salud**
  - Área: Enfermería
  - Meta visible: desde el 14 de mayo pasa a jueves 17:00 en formato podcast pregrabado
- **17:00 — Empresaurios**
  - Área: Administración de Empresas
  - Meta visible: cada 3 semanas; requiere video expectativa y artes previos

### Viernes
- **11:00 — Rehab Project**
  - Área: Fisioterapia
  - Meta visible: mensual; ya incorporado en la parrilla visible

---

## 3) Estado operativo actual según `radio-planner-state.json`

Aquí ya no hablo de la parrilla “bonita”, sino del **estado operativo real** que quedó guardado en el JSON.

### Programas
- **Equinoccio**
  - Estado: `Pendiente`
  - Nota: verificar streaming listo el lunes antes de las 08:00

- **Derechos a Boca**
  - Estado: `Pendiente`
  - Nota: escribir a Cristian el lunes para que envíe el programa

- **Nutri Academia**
  - Estado: `Pendiente`
  - Nota: quincenal; martes 11:00

- **Sembrando Salud**
  - Estado: `Pendiente`
  - Nota: la franja jueves 17:00 todavía no está confirmada para este programa; desde 2026-05-14 se plantea moverlo a jueves 17:00 como podcast pregrabado; imagen el lunes previo; grabación propuesta miércoles 10:00–11:00

- **Un café con Fabiola**
  - Estado: `Pendiente`
  - Nota: miércoles 09:00; programa largo + mini podcast posterior

- **Ecoconexión**
  - Estado: `Transmitido`
  - Nota: miércoles 11:00; el programa de ese día ya fue transmitido; arte ya publicado; insumos recibidos; referencia temática de café sostenible

- **Cosechando Prevención**
  - Estado: `Arte publicado`
  - Nota: jueves 09:30; quincenal; arte ya publicado en Facebook e insumos ya recibidos

- **Huella**
  - Estado: `Arte publicado`
  - Nota: jueves 11:30; arte de esa semana ya publicado; Salomé envía insumos; auspicio Ecolac

- **Empresaurios**
  - Estado: `Confirmado`
  - Nota: jueves 17:00 confirmado; el otro programa de esa franja todavía no está confirmado; revisar video expectativa y artes previos

- **Rincón Económico**
  - Estado: `Pendiente`
  - Nota: jueves 15:00; docente Vanessa; Facebook + ZaraRadio

- **Rehab Project**
  - Estado: `Pendiente`
  - Nota: viernes 11:00; mensual; inicio confirmado 2026-05-08; primeras cuatro fechas confirmadas: 2026-05-08, 2026-06-05, 2026-07-03, 2026-07-31

### Podcasts
- **Maestría en Ciencias Políticas**
  - Estado: `Por confirmar`
  - Nota: podcast de Derecho; tentativo martes 10:00–11:00; cuando confirmen, enviar Zoom; carpeta `Diálogos Jurídicos`

- **Neuro Relatos**
  - Estado: `Por subir`
  - Nota: Lourdes debería subirlo a Spotify

- **Bienestar Psicología**
  - Estado: `En proceso`
  - Nota: 5 grabados y 2 por grabar con Jhon y María Dolores

### Alertas actuales
- El jueves sigue siendo el día más cargado
- Salomé concentra varios flujos de programas e insumos
- Derechos a Boca depende del recordatorio a Cristian
- Empresaurios requiere coordinación anticipada de video y artes
- Posible choque jueves 17:00 entre Sembrando Salud y Empresaurios desde 2026-05-14

### Próximas acciones guardadas en el JSON
- Mantener el calendario de arranque desde el 20 de abril
- Tener presentes las primeras cuatro fechas de Rehab Project
- Mantener recordatorio a Cristian por Derechos a Boca
- Esperar confirmación del podcast de Derecho y luego enviar Zoom
- Revisar Neuro Relatos en Spotify
- Confirmar si Empresaurios mantiene jueves 17:00 antes de fijar Sembrando Salud al aire en ese mismo horario

---

## 4) Cotejo con memoria: qué ya sabíamos y qué quedó cambiado después

### 4.1 Origen del proyecto y forma de publicación
En memoria quedó registrado que el subdominio `radio.backstageec.com` fue asignado para este planner, que primero salió una v1 y luego una v2 más pulida con estado central en `radio-planner-state.json`. También quedó guardado que la publicación correcta terminó haciéndose por FTP al docroot del subdominio.  
Referencia: `memory/2026-04-01.md`

### 4.2 Ajustes técnicos importantes que sí siguen vigentes
En memoria también quedó asentado que:
- se activó no-cache para `index.html`/`index.php` y `radio-planner-state.json`
- se forzó HTTPS
- se añadió una marca visible de versión
- luego `index.php` pasó a servir `dashboard.html` como portada principal

Eso **sí coincide** con los archivos actuales (`index.php` y `.htaccess`).  
Referencia: `memory/2026-04-15.md`

### 4.3 Cambios operativos recordados en memoria y reflejados hoy
#### Rehab Project
- Memoria: quedó incorporado en viernes 11:00 y luego quedaron confirmadas sus primeras cuatro fechas.
- Dashboard actual: sigue visible en viernes 11:00 y el JSON guarda las cuatro fechas.
- Resultado: **coincide**.

#### Ecoconexión
- Memoria 2026-04-20: quedó como `Insumos recibidos`.
- Memoria 2026-04-21: se corrigió a `Arte publicado`.
- Memoria 2026-04-23: se corrigió otra vez y quedó `Transmitido` porque Daniel aclaró que el transmitido era Ecoconexión y no Rincón Económico.
- Dashboard actual: `Transmitido`.
- Resultado: **coincide con la última corrección registrada**.

#### Cosechando Prevención
- Memoria 2026-04-20: primero quedó como `Insumos recibidos`.
- Memoria 2026-04-21: se corrigió a `Arte publicado` porque Daniel aclaró que ya estaba publicado.
- Dashboard actual: `Arte publicado`.
- Resultado: **coincide**.

#### Huella
- Memoria 2026-04-20: se dejó como `Arte publicado`.
- Dashboard actual: `Arte publicado`.
- Resultado: **coincide**.

#### Rincón Económico
- Memoria 2026-04-23: hubo una marca errónea como `Transmitido`, luego Daniel corrigió que el transmitido era Ecoconexión y Rincón se revirtió a `Pendiente`.
- Dashboard actual: `Pendiente`.
- Resultado: **coincide con la corrección final**.

#### Empresaurios
- Memoria 2026-04-23: Daniel confirmó el programa para jueves 17:00.
- Dashboard actual: `Confirmado`.
- Resultado: **coincide**.

#### Sembrando Salud
- Memoria 2026-04-14: quedó como nuevo plan para arrancar el **2026-05-14**, jueves 17:00, formato podcast pregrabado.
- Memoria 2026-04-23: al revisar el correo, quedó claro que el hilo original no confirmaba jueves 17:00; en el correo aparecía más bien una revisión de martes 17:00–17:45, y el cambio a jueves vino después.
- Dashboard actual: `Pendiente`, con nota de que la franja jueves 17:00 todavía no está confirmada para este programa.
- Resultado: **coincide con el entendimiento más fino y más reciente**.

---

## 5) Cotejo interno: cosas que en el dashboard visual todavía no están totalmente alineadas con el JSON

Aquí está lo más importante si vas a editar manualmente.

### Inconsistencias o desalineaciones detectadas
1. **Ecoconexión**
   - En la parrilla HTML aparece con meta genérica: semanal, Salomé, insumos 2 días antes.
   - En el JSON ya está como `Transmitido`.
   - Recomendación: si quieres que la vista sea más explícita, actualizar el texto/meta visible del HTML.

2. **Cosechando Prevención**
   - En la parrilla HTML aparece solo como quincenal con insumos 2 días antes.
   - En el JSON ya está como `Arte publicado` + insumos recibidos.
   - Recomendación: si quieres una vista más operativa, reflejarlo también en la capa visual.

3. **Huella**
   - En el HTML la meta dice “ya se transmitió el jueves anterior, 2026-04-09”.
   - En el JSON el estado actual está como `Arte publicado` para la semana en curso.
   - Recomendación: aquí sí hay una desalineación clara entre mensaje histórico y estado operativo actual.

4. **Empresaurios**
   - En el HTML solo figura como programa cada 3 semanas con artes previos.
   - En el JSON ya está `Confirmado` para jueves 17:00.
   - Recomendación: si quieres que el dashboard visual comunique mejor el cierre de esa franja, conviene reflejar la confirmación también arriba.

5. **Rincón Económico**
   - El HTML solo dice que se mantiene jueves 15:00.
   - El JSON lo deja `Pendiente`.
   - No es inconsistencia grave, pero sí falta más contexto visual si quieres que el dashboard sea más ejecutivo.

---

## 6) Resumen ejecutivo de lo que “tenemos hoy” en el dashboard

### Lo ya bastante consolidado
- Infraestructura del dashboard funcionando con no-cache + HTTPS
- Publicación por FTP ya dominada
- Parrilla general visible por días
- JSON central operativo como fuente de estado
- Rehab Project ya incorporado con fechas futuras guardadas
- Ecoconexión, Cosechando Prevención, Huella, Empresaurios y la corrección de Rincón ya reflejados en memoria y en el JSON

### Lo que sigue más flojo o pendiente
- Nutri Academia sigue muy verde operativamente
- Un café con Fabiola sigue sin cierre operativo visible
- Derechos a Boca depende de seguimiento manual
- Neuro Relatos sigue pendiente por Spotify
- Sembrando Salud todavía requiere definición fina de horario real y comunicación final
- Hay varias diferencias entre la **parrilla visible del HTML** y el **estado operativo del JSON**

---

## 7) Si vas a modificarlo manualmente en tu computadora, qué tocar primero

### Archivos que conviene editar primero
1. `radio-planner-state.json`
   - si quieres corregir estados, notas, alertas y próximos pasos

2. `dashboard.html`
   - si quieres cambiar horarios visibles, textos de la parrilla, estructura visual o alinear mejor la vista con los estados reales

3. `index.php`
   - solo si quieres cambiar la forma en que se sirve la portada

4. `.htaccess`
   - solo si quieres tocar caché, redirecciones o comportamiento del hosting

### Recomendación práctica
Si tu idea es hacer cambios manuales sin romper nada, el orden más seguro es:
1. editar `radio-planner-state.json`
2. editar `dashboard.html`
3. revisar en navegador local
4. recién después tocar `index.php` o `.htaccess` si hace falta

---

## 8) Conclusión del cotejo

El dashboard actual **sí conserva la estructura y la lógica** que fuimos construyendo, y la mayor parte de los cambios importantes de nuestras últimas conversaciones **sí quedaron reflejados**.

Lo más importante del cotejo es esto:
- la **infraestructura técnica** coincide con memoria,
- el **estado operativo del JSON** coincide bastante bien con las últimas correcciones que fuimos haciendo,
- pero la **capa visual del HTML** todavía arrastra algunos textos más genéricos o históricos que no siempre cuentan la última verdad operativa.

Si quieres, el siguiente paso puede ser que te prepare un **segundo documento** todavía más útil: uno que diga **archivo por archivo qué líneas o bloques deberías tocar** para actualizarlo manualmente rápido.
