# Guia de desarrollo - ParkOn BA

Esta guia resume que deberia construir el grupo si la profesora exige recortar el alcance a un solo perfil. Hay dos caminos posibles: encarar solo el perfil Conductor o solo el perfil Operador. No conviene mezclar ambos en el MVP porque el plan anterior fue observado por abarcar los dos flujos al mismo tiempo.

Fuentes revisadas:

- `Hito 1/ParkOnBA_Project_Charter_v3.docx`
- `Hito 1/Copia de ParkOnBA_Analisis_Integral_version 3.docx`
- `Hito 2/Hito 2/ParkOnBA_Modulo2_Consolidado v 2.0.docx`
- `Hito 2/Hito 2/ParkOnBA_Modulo3_SRS.docx`
- `Hito 2/Hito 2/ParkOnBA_Modulo3_Modelado.docx`
- `ParkOn_BA_brief.pptx`
- maqueta previa en `parkon-ba-app/`

## Decision de alcance

La consigna deberia quedar planteada asi:

> Para esta etapa se desarrollara una aplicacion Angular + Ionic centrada en un unico perfil de usuario. El sistema completo ParkOn BA contempla conductor y operador, pero el desarrollo del grupo implementara solo uno de esos dos recorridos para mantener un alcance viable.

## Opcion A - Si se encara el Conductor

### Objetivo del modulo

Permitir que una persona busque estacionamientos en CABA, compare disponibilidad y precio, reserve una cochera, simule el pago y vea una confirmacion con QR.

Este camino es el mas alineado con el problema central del Hito 1: el conductor pierde tiempo buscando estacionamiento sin informacion confiable de disponibilidad, tarifa y reserva anticipada.

### Vistas importantes

1. Login / Registro
   - Email y contraseña.
   - Datos minimos: nombre, telefono, patente y vehiculo.
   - Para simplificar: OAuth Google y recuperacion de contraseña pueden quedar fuera.

2. Inicio / Busqueda
   - Barra de busqueda por zona o direccion.
   - Lista de estacionamientos cercanos.
   - Datos visibles sin entrar al detalle: nombre, distancia, precio, disponibilidad y zona.
   - Filtros basicos: precio, distancia, cubierto, disponibilidad.

3. Mapa / Resultados
   - Puede ser un mapa simulado si no se integra Google Maps.
   - Pins con estado por color:
     - verde: alta disponibilidad
     - amarillo: poca disponibilidad
     - rojo/gris: sin disponibilidad
   - Debe permitir seleccionar un estacionamiento.

4. Detalle del estacionamiento
   - Nombre, direccion, servicios, altura maxima, precio por hora, disponibilidad.
   - Boton principal: Reservar.
   - Mostrar ultima actualizacion de disponibilidad para reforzar confianza.

5. Seleccion de horario
   - Fecha.
   - Hora de entrada.
   - Duracion o hora de salida.
   - Calculo de total estimado.

6. Pago simulado
   - Resumen de estacionamiento, horario, tarifa y total.
   - Medio de pago simulado: Mercado Pago / tarjeta.
   - No integrar pago real en esta etapa.

7. Confirmacion
   - Numero de reserva.
   - QR o codigo visual simulado.
   - Direccion, horario y patente.
   - Mensaje claro de exito.

8. Historial / Perfil
   - Reservas activas y pasadas.
   - Acceso al QR de la reserva activa.
   - Cancelacion simulada de reserva.

### Requerimientos del SRS que aplican

- RF-01: Registro de usuario.
- RF-03: Inicio de sesion.
- RF-05: Edicion de perfil.
- RF-07: Busqueda geolocalizada.
- RF-08: Visualizacion en mapa.
- RF-09: Disponibilidad.
- RF-10: Comparacion de tarifas y servicios.
- RF-11: Filtros.
- RF-13: Creacion de reserva.
- RF-15: Cancelacion de reserva.
- RF-19: Historial.
- RF-20/RF-21: Pago simulado y manejo de fallo simulado.
- RF-24/RF-25: Notificaciones solo como mensajes en pantalla, no push reales.

### Reglas de negocio minimas

- Una reserva queda bloqueada hasta 15 minutos despues del horario de llegada.
- Cancelacion:
  - hasta 1 hora antes: reembolso total simulado;
  - entre 1 hora y 30 minutos: reembolso parcial;
  - menos de 30 minutos: sin reembolso.
- Las tarifas mostradas deben ser finales.
- Un usuario puede tener hasta 3 reservas activas.
- El QR es valido solo durante la ventana de reserva.

### Que dejar fuera

- Panel del operador.
- Reportes.
- Alta real de estacionamientos.
- Pagos reales.
- Push notifications reales.
- IA real de prediccion.
- Integracion real con sensores, barreras o hardware.
- Facturacion AFIP.
- Cobertura fuera de CABA.

### Datos mock necesarios

Entidades minimas:

- Usuario: id, nombre, email, telefono, patente, vehiculo.
- Estacionamiento: id, nombre, direccion, zona, distancia, tarifaHora, disponibilidad, servicios, lat/lng opcional.
- Reserva: id, usuarioId, estacionamientoId, fecha, horaEntrada, horaSalida, total, estado, codigoQR.
- Pago: id, reservaId, medio, monto, estado.

### Orden de desarrollo sugerido

1. Crear proyecto Angular + Ionic.
2. Definir branding global: colores, tipografia, nombre y componentes base.
3. Crear modelos TypeScript para usuario, estacionamiento, reserva y pago.
4. Crear servicios mock con arrays locales.
5. Implementar routing Ionic.
6. Construir login/registro.
7. Construir busqueda/listado.
8. Construir mapa simulado o integracion simple.
9. Construir detalle.
10. Construir flujo reserva -> pago -> confirmacion.
11. Construir historial/perfil.
12. Pulir responsive mobile, estados vacios, errores y validaciones.

## Opcion B - Si se encara el Operador

### Objetivo del modulo

Permitir que un estacionamiento administre su disponibilidad, vea reservas entrantes, valide ingresos y configure tarifas.

Este camino es mas acotado funcionalmente que el del conductor y evita depender de mapas/pagos. Tambien esta respaldado por el Hito 1 y el SRS como modulo de estacionamiento: panel basico para disponibilidad, reservas y tarifas.

### Vistas importantes

1. Login del operador
   - Usuario y contraseña.
   - Acceso a un establecimiento asociado.
   - No hace falta registro publico completo; puede ser usuario precargado.

2. Dashboard del dia
   - Ocupacion actual.
   - Cocheras libres.
   - Reservas activas.
   - Proximos ingresos.
   - Ingresos estimados del dia.
   - Alertas operativas.

3. Disponibilidad
   - Campo principal editable: cocheras libres.
   - Capacidad total.
   - Sectores opcionales: subsuelo, planta baja, EV, techado.
   - Boton guardar.
   - Mostrar ultima actualizacion.

4. Reservas entrantes
   - Lista cronologica de reservas de hoy y proximos 7 dias.
   - Datos: codigo, conductor, patente, horario, estado.
   - Acciones: confirmar ingreso, marcar demora, cancelar/no show.

5. Validacion QR / PIN
   - Puede ser simulada con input de codigo.
   - Estados:
     - valido
     - vencido
     - ya usado
     - inexistente
   - Al validar, la reserva cambia de estado.

6. Tarifas
   - Tarifa por hora.
   - Media jornada.
   - Jornada completa.
   - Tarifa especial opcional.
   - Los cambios aplican a nuevas reservas, no a reservas ya confirmadas.

7. Historial / Reporte basico
   - Reservas finalizadas.
   - Ocupacion del dia.
   - Ingresos estimados.
   - No hace falta analytics avanzado.

### Requerimientos del SRS que aplican

- RF-29: Autenticacion independiente del operador.
- RF-30: Actualizacion manual de disponibilidad.
- RF-31: Gestion de tarifas.
- RF-32: Visualizacion de reservas activas y pendientes.
- RF-33: Escaneo/validacion de QR.
- RF-34: Reportes operativos basicos.
- RF-27: Notificacion al operador, simulada como alerta/badge en pantalla.

### Reglas de negocio minimas

- El operador debe actualizar disponibilidad al menos cada 15 minutos.
- La disponibilidad modificada debe impactar visualmente en el sistema.
- Las tarifas nuevas no deben modificar reservas ya confirmadas.
- El QR/PIN solo es valido dentro de la ventana de reserva mas tolerancia de 15 minutos.
- Si el conductor no llega, la reserva puede pasar a no-show y liberar la cochera.

### Que dejar fuera

- App del conductor.
- Busqueda en mapa.
- Pago del usuario.
- Mercado Pago real.
- IA de prediccion.
- Push notifications reales.
- Reportes avanzados.
- Alta compleja de operadores con verificacion de 48 hs.
- Integracion con camara real si complica; usar input de codigo.
- Hardware de barreras o sensores.

### Datos mock necesarios

Entidades minimas:

- Operador: id, nombre, email, establecimientoId.
- Establecimiento: id, nombre, direccion, capacidadTotal, cocherasLibres, ultimaActualizacion.
- Tarifa: id, nombre, tipo, monto, descripcion.
- Reserva: id, conductorNombre, patente, horarioEntrada, horarioSalida, estado, codigoQR, total.
- EventoOperativo: id, reservaId, tipo, fechaHora.

### Orden de desarrollo sugerido

1. Crear proyecto Angular + Ionic.
2. Definir layout orientado a panel responsive: mobile/tablet primero.
3. Crear modelos TypeScript para operador, establecimiento, tarifa y reserva.
4. Crear servicios mock con estado local.
5. Implementar routing.
6. Construir login operador.
7. Construir dashboard.
8. Construir edicion de disponibilidad.
9. Construir reservas entrantes.
10. Construir validacion QR/PIN simulada.
11. Construir tarifas.
12. Construir historial/reporte basico.
13. Pulir mensajes de confirmacion, alertas y estados.

## Comparacion rapida para elegir

### Conductor

Ventajas:

- Es el problema principal del proyecto.
- Es mas atractivo para demo mobile.
- Se conecta mejor con el brief y las pantallas sugeridas.
- Permite mostrar el flujo completo de valor: buscar -> reservar -> pagar -> QR.

Riesgos:

- Tiene mas pantallas.
- Mapa y pago pueden tentar a sobreintegrar.
- Hay que simular varias cosas para no exceder el alcance.

### Operador

Ventajas:

- Es mas simple para implementar.
- Menos dependencia de mapa, geolocalizacion y pagos.
- Encaja bien con Angular/Ionic como panel administrativo responsive.
- Es mas facil mostrar datos editables y cambios de estado.

Riesgos:

- Es menos representativo del problema original del conductor.
- Puede sentirse como un panel administrativo comun si no se comunica bien ParkOn BA.
- Necesita datos mock de reservas para que la demo tenga sentido.

## Recomendacion practica

Si la prioridad es una demo mas atractiva y fiel al problema de negocio, elegir Conductor.

Si la prioridad es llegar con algo solido, simple y defendible en menos tiempo, elegir Operador.

En cualquiera de los dos casos, no implementar ambos perfiles. Como maximo, mencionar el otro perfil en la documentacion como actor externo o dependencia futura.

## Branding de ParkOn BA

### Identidad

- Nombre: ParkOn BA.
- Concepto: estacionamiento inteligente en CABA.
- Promesa: encontrar, reservar y gestionar cocheras sin dar vueltas.
- Tono: urbano, claro, confiable, rapido.

### Colores detectados en brief y maqueta

Paleta principal:

- Azul noche: `#1B3055`
- Azul profundo: `#0D1F3C`
- Fondo oscuro app: `#09142D`
- Verde ParkOn/acento: `#2DB84B` o `#3ECF5E`
- Blanco: `#FFFFFF`
- Gris texto secundario: `#8899AA` / `#9DB0D6`

Colores funcionales:

- Exito/disponible: verde.
- Advertencia/poca disponibilidad: amarillo/naranja.
- Error/sin disponibilidad: rojo.
- Informacion secundaria: azul/gris.

### Logo e identificacion

No se encontro un archivo de logo separado en la raiz del proyecto, pero el brief y la maqueta usan la marca textual `ParkOn BA`. Para el desarrollo se puede resolver asi:

- Usar wordmark textual `ParkOn BA`.
- Acompanarlo con icono simple de pin de ubicacion o letra `P`.
- Mantener el verde como acento de marca.
- Usar azul oscuro como base visual.

### Tipografia

La maqueta previa usa:

- Plus Jakarta Sans para interfaz.
- Syne para titulos.

En Ionic puede mantenerse con Google Fonts o simplificarse a una sola fuente sans si el tiempo es corto.

## Guia tecnica Angular + Ionic

### Estructura sugerida

```text
src/app/
  core/
    models/
    services/
  pages/
    login/
    dashboard-o-home/
    ...
  shared/
    components/
    pipes/
```

### Servicios recomendados

- `AuthService`: login simulado y usuario actual.
- `ParkingService`: estacionamientos o establecimiento operador.
- `ReservationService`: reservas, estados, cancelacion, confirmacion.
- `PricingService`: calculo de totales o tarifas.
- `ToastService` / Ionic ToastController: mensajes de exito/error.

### Componentes reutilizables

Para Conductor:

- `parking-card`
- `availability-badge`
- `price-summary`
- `reservation-card`
- `qr-card`

Para Operador:

- `metric-card`
- `reservation-row`
- `availability-editor`
- `tariff-row`
- `status-badge`

## Criterio de entrega

La entrega deberia poder demostrarse con datos mock, navegacion real y acciones simuladas. No hace falta backend real si la consigna no lo exige, pero si se implementa, debe ser minimo y no desviar el alcance.

Checklist final:

- La app abre sin errores.
- Hay navegacion entre vistas.
- Los datos mock se ven coherentes.
- Se puede completar el flujo principal del perfil elegido.
- Hay validaciones basicas.
- Hay estados de exito y error.
- La marca ParkOn BA es consistente.
- El otro perfil queda explicitamente fuera del alcance.
