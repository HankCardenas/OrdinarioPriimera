# API de Conversión de Monedas

API RESTful para la conversión de monedas con funcionalidades extendidas y validaciones robustas.

## Características

- Conversión entre diferentes monedas
- Validación de datos de entrada
- Rate limiting para prevenir abusos
- CORS configurable
- Logging mejorado
- Manejo de errores robusto
- Base de datos SQLite con validaciones

## Requisitos

- Node.js >= 14.x
- npm >= 6.x

## Instalación

1. Clonar el repositorio:
```bash
git clone <tu-repositorio>
cd api-conversion
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crea un archivo `.env` con las siguientes variables:
```env
PORT=3000
DB_PATH=./monedas.sqlite
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
ALLOWED_ORIGINS=http://localhost:3000,http://tudominio.com
NODE_ENV=development
```

4. Iniciar el servidor:
```bash
npm start
```

Para desarrollo:
```bash
npm run dev
```

## Endpoints

### GET /
- Descripción: Información sobre la API
- Respuesta: Lista de endpoints disponibles

### GET /monedas
- Descripción: Obtener todas las monedas
- Respuesta: Array de monedas con sus tasas de conversión

### POST /monedas
- Descripción: Agregar nueva moneda
- Body:
```json
{
    "origen": "USD",
    "destino": "EUR",
    "valor": 0.85
}
```

### PUT /monedas/:id
- Descripción: Actualizar moneda existente
- Parámetros: id (número)
- Body: Igual que POST /monedas

### POST /convertir
- Descripción: Realizar conversión
- Body:
```json
{
    "origen": "USD",
    "destino": "EUR",
    "cantidad": 100
}
```

## Validaciones

### Monedas
- Código de moneda: 2-10 caracteres, mayúsculas
- Valor de conversión: > 0 y < 1,000,000
- No se permiten duplicados de pares origen-destino

### Rate Limiting
- 100 peticiones por IP cada 15 minutos (configurable)

## Seguridad

- Helmet para headers HTTP seguros
- CORS configurable por origen
- Validación de entrada
- Rate limiting
- Sanitización de datos

## Desarrollo

Para ejecutar en modo desarrollo con recarga automática:
```bash
npm run dev
```

## Producción

Para ejecutar en producción:
```bash
NODE_ENV=production npm start
```

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 