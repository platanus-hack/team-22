# Yournal - La Aplicación Inteligente de Reflexión y Recomendaciones 🦾🧠😊

![WhatsApp Image 2024-11-24 at 05 19 09](https://github.com/user-attachments/assets/8ddb2e1f-44bb-4f12-a663-c513467ac540)

Yournal es una aplicación innovadora que utiliza inteligencia artificial avanzada para analizar y proporcionar recomendaciones personalizadas basadas en el día a día de los usuarios. Mediante un flujo sofisticado de procesamiento de datos, Yournal transforma las entradas de los usuarios en insights valiosos que fomentan el bienestar y el autoconocimiento. A continuación, se describe la arquitectura de IA y el flujo de trabajo que hace posible esta experiencia única.

## 🧠 Arquitectura y Flujo de Inteligencia Artificial

### 1. **Recopilación de Inputs del Usuario 📲**
El flujo comienza cuando el usuario comparte su experiencia diaria escribiendo en su *yournal*. Esta entrada inicial, que puede incluir texto o voz, constituye la base sobre la que el sistema genera recomendaciones personalizadas. Cada nueva entrada agrega un nuevo nivel de conocimiento sobre el usuario, mejorando las decisiones futuras que la aplicación puede tomar.

### 2. **Transformación de Datos con Whisper 🤖**
La información proporcionada por el usuario se convierte en texto mediante el uso del modelo **Whisper**, que transcribe voz a texto de manera precisa. Esto permite extraer datos valiosos independientemente del formato de entrada, ya sea hablado o escrito.

### 3. **Organización de Datos: Hechos y Emociones 🗂️**
Una vez convertida la entrada en texto, se organiza la información en dos categorías clave:
- **Hechos**: Los eventos o acciones descritas.
- **Emociones**: Los sentimientos asociados a esos hechos.

Este paso es fundamental para establecer relaciones entre los hechos y las emociones, lo que facilita el reconocimiento de patrones que serán utilizados más adelante para la generación de insights. Lo más interesante es que **cada entrada nueva ayuda a refinar la comprensión que Yournal tiene del usuario**, creando una representación cada vez más precisa de su vida emocional y sus hábitos.

### 4. **Generación de Resumen y Estado Anímico 😊💬**
Para ayudar al usuario a reflexionar sobre su día, se genera un resumen del input proporcionado, junto con una evaluación del estado anímico representado. Este análisis se realiza mediante un modelo de IA que examina el texto y evalúa la emocionalidad de los eventos descritos.

### 5. **Creación de JSON de Hechos y Emociones 📊**
La información sobre hechos y emociones se convierte en un archivo JSON estructurado, con los atributos de los hechos y las emociones principales claramente definidos. Este formato facilita la posterior manipulación y consulta de los datos. **Este proceso es dinámico**, ya que con cada entrada del usuario, la base de datos se va actualizando y enriqueciéndose.

### 6. **Generación de Embeddings y Almacenamiento en Pinecone 🔑**
En esta fase, se generan embeddings tanto para los hechos como para las emociones, que se almacenan en una **tabla vectorial en Pinecone**. Pinecone es una solución de almacenamiento vectorial que permite manejar grandes volúmenes de datos de manera eficiente. 

- **Cálculo de Producto Punto**: Para obtener una representación conjunta de hechos y emociones, se calcula el producto punto entre los embeddings de ambos. Esto permite medir la relación entre las acciones y los sentimientos del usuario.
  
- **Poda de Vectores**: Para reducir el ruido y optimizar el procesamiento, se poda el vector combinado utilizando un threshold. Esto elimina los valores de baja relevancia, asegurando que solo se mantengan los datos que aportan valor a la toma de decisiones.

  Lo más importante es que **la tabla vectorial es dinámica**, lo que significa que con cada nueva entrada del usuario, los embeddings se recalculan y la base de datos se actualiza. A medida que el sistema conoce más al usuario, las recomendaciones y decisiones se vuelven más precisas y personalizadas.

### 7. **Consultas y Búsquedas de Resultados 🔍**
Con la tabla vectorial en Pinecone lista, se pueden realizar diferentes tipos de consultas:
- **Recomendaciones**: Sugerencias personalizadas basadas en patrones emocionales.
- **Reconocimiento de Patrones**: Identificación de ten- **Búsqueda por Hechos o Emociones**: Localización de eventos o sentimientos similares en el historial del usuario.

#### ⚡ **Técnica K-Nearest Neighbors (KNN) para Consultas**
El proceso de consulta se realiza utilizando la técnica de **K-Nearest Neighbors (KNN)**, que es fundamental para obtener patrones y correlaciones entre los hechos y las emociones del usuario.

##### ¿Cómo Funciona el Flujo de KNN en Yournal?

1. **Generación del Vector de Consulta 🧳**: Cuando un usuario solicita una recomendación, por ejemplo, sobre qué acciones o hechos contribuyen a la felicidad, se crea un vector de consulta. Este vector se genera a partir de los hechos y emociones más relevantes del input reciente del usuario o de un conjunto de datos proporcionado por el sistema.

2. **Posicionamiento del Vector en el Espacio de Embeddings 📍**: Este vector de consulta se coloca en el espacio de embeddings de Pinecone, que almacena representaciones vectoriales de hechos y emociones anteriores. El vector de consulta actúa como un punto de referencia para realizar comparaciones en el espacio vectorial.

3. **Cálculo de Distancias en el Espacio Vectorial 📏**: Una vez el vector de consulta está posicionado, el sistema calcula las distancias entre este vector y todos los demás vectores en la tabla vectorial. Las distancias son medidas usando una métrica de distancia, generalmente el **producto punto** o **distancia euclidiana**, que nos indica qué tan cerca están los datos en el espacio de embeddings.

4. **Selección de los Vecinos Más Cercanos (KNN) 🔍**: El algoritmo KNN selecciona los *K* vecinos más cercanos al vector de consulta en el espacio vectorial. Estos vecinos representan los eventos o emociones más similares a los que el usuario ha experimentado o ha mencionado.

   - Por ejemplo, si el vector de consulta está orientado hacia hechos que han generado emociones positivas (como felicidad o satisfacción), el sistema buscará los hechos previos que están más cerca de ese vector en el espacio de embeddings, identificando patrones de acciones que frecuentemente contribuyen a estas emociones.

5. **Obtención de Resultados Relevantes 🎯**: Los resultados de esta búsqueda de KNN son entonces los hechos y las emociones que están más estrechamente relacionados con el estado emocional actual del usuario o con la consulta realizada. Esta información se utiliza para generar recomendaciones o patrones recurrentes.

   - Por ejemplo, si el usuario está buscando mejorar su felicidad, el sistema le sugerirá acciones que históricamente han estado asociadas con emociones positivas, basadas en los datos más cercanos obtenidos a través de KNN.

6. **Generación de Respuestas con un Modelo Generativo 🎨**: Finalmente, con los resultados obtenidos de la consulta KNN, se utiliza un modelo de IA generativa para formular una respuesta coherente y personalizada. Esta respuesta puede ser una recomendación sobre qué acciones tomar o una reflexión sobre cómo mejorar el bienestar emocional.

7. **Envío de Resultados al Frontend 📤**: Los resultados procesados, junto con la recomendación generada, se envían al frontend de la aplicación en formato JSON, que es luego desplegado para que el usuario lo vea de manera clara y comprensible.

### 8. **Generación del Dashboard del Usuario 🧑‍💻**
En el centro de la experiencia de Yournal se encuentra el **Dashboard del Usuario**, una interfaz visual donde se presentan las recomendaciones personalizadas basadas en el análisis emocional y los patrones de comportamiento del usuario. Este dashboard se actualiza continuamente en función de los nuevos inputs proporcionados y las consultas realizadas, lo que garantiza que las recomendaciones y consejos estén siempre alineados con el estado más reciente del usuario.

#### 💡 Funcionalidad del Dashboard:
- **Recomendaciones de Bienestar**: Basadas en el análisis de los eventos más frecuentes que afectan el estado emocional del usuario. Se presentan recomendaciones para mantener o aumentar la felicidad, como actividades específicas que han demostrado generar emociones positivas.
  
- **Hábitos que Están Funcionando**: El sistema identifica y resalta los hábitos o acciones recurrentes que están contribuyendo positivamente al bienestar del usuario. Esto permite que el usuario reconozca lo que está haciendo bien y continúe con esos comportamientos.

- **Áreas de Mejora**: A través de consultas vectoriales filtradas por el usuario, el sistema identifica patrones negativos o áreas donde el usuario podría mejorar. Por ejemplo, si ciertas actividades o situaciones generan emociones negativas de forma recurrente, el sistema sugiere formas de cambiarlas o evitarlas para mejorar el bienestar general.

#### 🛠️ **Consultas Vectoriales Filtradas por Usuario**
Para generar las recomendaciones y análisis que aparecen en el Dashboard, se utilizan consultas vectoriales avanzadas. El sistema filtra la información según el historial del usuario, lo que permite obtener insights basados exclusivamente en los datos relevantes de esa persona. A través de estas consultas, se buscan patrones específicos de comportamientos, hechos y emociones dentro del espacio vectorial de Pinecone. Este enfoque personalizado asegura que las recomendaciones sean precisas y adaptadas a las necesidades individuales de cada usuario.



# Yournal Backend

Este es el backend para la aplicación Yournal, un diario inteligente que procesa entradas de texto para proporcionar insights emocionales.

## Estructura del Proyecto

### Configuración (`/config`)
- `openai.js` - Configuración y credenciales para la API de OpenAI
- `pinecone.js` - Configuración para la base de datos vectorial Pinecone
- `supabase.js` - Configuración para la base de datos principal Supabase

### Núcleo de la Aplicación
- `app.js` - Configuración y middleware de la aplicación Express
- `server.js` - Punto de entrada y configuración del servidor

### API (`/routes`)
- `index.js` - Definición de endpoints y rutas de la API

### Servicios (`/services`)
- `aiService.js` - Lógica de procesamiento de IA y comunicación con OpenAI
- `embeddingService.js` - Generación y gestión de embeddings vectoriales
- `factService.js` - Extracción y procesamiento de datos factuales
- `journalProcessor.js` - Procesamiento principal de las entradas del diario

### Utilidades (`/utils`)
- `insightAnalyzer.js` - Análisis y generación de insights emocionales
- `userRequests.js` - Helpers para manejo de peticiones de usuario


