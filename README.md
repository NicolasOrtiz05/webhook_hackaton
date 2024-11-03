# Proyecto de Webhook Hackathon

Este proyecto es un servidor Node.js que utiliza la API de Azure OpenAI y Twilio para responder a mensajes de WhatsApp.
En primera instancia se puede usar el prooyecto de manera funcional sin necesidad de desplegar los servicios, simplemnete agregando nuestro asistente virtual por medio del siguiente link 
Esto funciona ya que mantendremos nuestro servidor encendido en toda la fase de prueba.

Se accede al chat con el siguiente link http://wa.me/+14155238886?text=join%20flag-whale
Una vez dentro se mande el siguiente mensaje: flag-whale


También, si deseen desplegar la aplicación pueden realizar las siguiente configuración

## Configuración

1. Clona el repositorio:

   ```sh
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   
2. Instala las dependencias

    ```sh
   npm start

3. Es necesario tener las claves necesarias para la implementación del projecto, estas se pueden obtener realizando los siguientes pasos:

Crea una cuenta en Twilio.
Accede a tu consola de Twilio y navega a Project Settings.
Copia tu Account SID y Auth Token.
Configura el Sandbox de WhatsApp:
Ve a Twilio Sandbox for WhatsApp.
Configura un número de teléfono y sigue las instrucciones para unirte al sandbox.
Obtener la API de Azure OpenAI
Crea una cuenta en Azure y accede al portal de Azure OpenAI Studio.
Crea un recurso de OpenAI en tu cuenta de Azure.
Navega a tu recurso de OpenAI y copia el endpoint y la clave de API desde la sección de Keys and Endpoints.

4. Para desplegar la aplicación node.js se puede realizar un servidor propio, pero es necesario tener un dominio público, esto se puede usar la herramienta Ngrok o con alguna infraestructura en la nube.

5. Cambia el nombre del archivo env.example a .env y rellena los valores en el archivo .env con tus propias claves de API:


   AZURE_OPENAI_API_KEY=your_azure_openai_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token

6. Iniciar el servidor con node index.js
