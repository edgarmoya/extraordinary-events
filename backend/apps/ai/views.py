from openai import OpenAI
from rest_framework.views import APIView
import json
from rest_framework.response import Response
from rest_framework import status
from apps.dashboard.services import get_event_summary
from apps.events.models import Event
from datetime import datetime

api_key1 = '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'
api_key2 = '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'

system_prompt = """
    Eres un asistente especializado en redactar cartas oficiales en español a partir de datos estructurados proporcionados en formato JSON.
    Tu objetivo es generar cartas informativas formales dirigidas a autoridades o instituciones oficiales, describiendo de forma clara y precisa un hecho ocurrido.
    \n\nInstrucciones:\n
    - La entrada del usuario será un objeto JSON con claves como: synthesis, cause, scope, occurrence_date, classification, event_type, status,
    created_by, created_date, closed_by, closed_date, entity (con nombre, dirección, municipio, provincia y sector), measures (lista de acciones) y
    additional_fields.\n
    - Usa esta información para construir una carta con el siguiente formato:\n
        1. Encabezado con ciudad y fecha actual\n
        2. Destinatario genérico (Ej. 'A quien corresponda')\n
        3. Asunto: breve descripción del tipo de hecho\n
        4. Cuerpo: desarrolla los hechos en 3 párrafos: (1) descripción del hecho, la causa y los detalles relevantes, integrando cualquier campo adicional si está presente, (2) implicaciones y alcance, (3) medidas adoptadas (no omitir ninguna) y cierre del estado del caso\n
        5. Cierre formal\n
        6. Firma: nombre del creador del parte o del responsable (campo 'created_by')\n\n
    - Redacta con un tono formal, claro y objetivo.\n
    - No repitas textualmente los nombres de las claves JSON; interpreta y presenta la información de forma fluida y natural.\n
    - Si algún campo está vacío, simplemente ignóralo en la carta.
    - Ignora el contenido de attachment porque en el correo no se va a adjuntar esa información.
"""

def generate(api_key, summary):
    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
    )
    return client.chat.completions.create(
        model="deepseek/deepseek-r1:free",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f'Por favor, redacta una carta informativa oficial dirigida a la autoridad correspondiente, usando esta información: {summary}'}
        ],
        stream=False
    )


class AskDeepSeekView(APIView):
    def get(self, request):
        event_id = request.query_params.get("id")
        summary = ''

        if not event_id:
            return Response({"detail": "No se proporcionó ningún id del hecho deseado"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Obtener el hecho extraordinario por su ID
            event = Event.objects.get(id=event_id)
            event_summary = get_event_summary(event=event)

            event_summary["current_date"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            summary = json.dumps(event_summary, ensure_ascii=False, indent=2)
        except Event.DoesNotExist:
            return Response({'detail': 'Hecho extraordinario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        for key in [api_key1, api_key2]:
            try:
                response = generate(key, summary)
                if response and response.choices and len(response.choices) > 0:
                    answer = response.choices[0].message.content
                    return Response({"answer": answer})

            except Exception as e:
                error_msg = str(e)
                if "rate limit" not in error_msg.lower() and "429" not in error_msg:
                    return Response({"detail": error_msg}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({"detail": "Ha superado el límite de peticiones en el día"}, status=status.HTTP_429_TOO_MANY_REQUESTS)