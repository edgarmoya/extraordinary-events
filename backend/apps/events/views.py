from rest_framework import viewsets, status, exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import EventSerializer, MeasureSerializer, AttachmentSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Event, Measure, Attachment
from apps.users.models import CustomUserGroup
from .permissions import HasPermissionForAction
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from django.http import HttpResponse
from rest_framework.views import APIView
from apps.dashboard.services import get_event_summary
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle,
    Paragraph, Spacer
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime

class EventPagination(PageNumberPagination):
    page_size = 25

class EventView(viewsets.ModelViewSet):
    # Verifica que el usuario esté autenticado y tenga los permisos necesarios
    authentication_classes = [JWTAuthentication]  # Requiere autenticación basada en JWT
    permission_classes = [IsAuthenticated, HasPermissionForAction]

    # Define el serializador para procesar los datos de entrada y salida
    serializer_class = EventSerializer

    # Establece la clase de paginación personalizada
    pagination_class = EventPagination

    def get_queryset(self):
        """
        Devuelve el conjunto de datos que será procesado por las operaciones de la vista.
        Aplica filtros opcionales según los parámetros 'search' y 'status' proporcionados en la solicitud.
        """
        # Obtiene los parámetros de búsqueda y estado de la solicitud
        search_term = self.request.query_params.get('search', '')
        status = self.request.query_params.get('status', '')
        user = self.request.user # Usuario autenticado

        # Si el usuario es superusuario, devuelve todos los usuarios
        if user.is_superuser:
            queryset = Event.objects.all()
        else:
            # Obtiene las entidades donde el usuario autenticado es operador o consultor
            entities = CustomUserGroup.objects.filter(
                user=user, group__name__in=['operador', 'consultor']
            ).values_list('entity', flat=True)

            # Si el usuario no es operador o consultor en ninguna entidad, devuelve un queryset vacío
            if not entities:
                return Event.objects.none()

            # Filtra los hechos que pertenecen a esas entidades
            queryset = Event.objects.filter(entity__id__in=entities).distinct()

        # Aplica el filtro por término de búsqueda si está presente
        if search_term:
            queryset = queryset.filter(synthesis__icontains=search_term)

        # Aplica el filtro por estado si está presente
        if status:
            queryset = queryset.filter(status=status)

        # Ordena los resultados por fecha de ocurrencia y creación de forma descendente
        return queryset.order_by('-occurrence_date', '-created_date')

    def perform_create(self, serializer):
        """
        Sobrescribe el método para asignar automáticamente el usuario autenticado 
        como creador del evento al guardar un nuevo registro.
        """
        serializer.save(created_by=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        """
        Sobrescribe el método de eliminación para evitar borrar eventos que estén 
        en estado 'closed'. Si el evento está cerrado, devuelve un error adecuado.
        """
        # Obtiene el evento que se desea eliminar
        event = self.get_object()

        # Comprueba si el evento está cerrado
        if event.status == 'closed':
            return Response({'detail': 'No se puede eliminar un hecho cerrado anteriormente'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Elimina el evento si no está cerrado
        event.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def handle_exception(self, exc):
        """
        Maneja excepciones específicas para proporcionar mensajes personalizados
        """
        if isinstance(exc, exceptions.PermissionDenied):
            return Response(
                {'detail': 'No tiene permiso para realizar esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        if isinstance(exc, exceptions.AuthenticationFailed):
            return Response(
                {'detail': 'Autenticación fallida. Por favor, inicie sesión nuevamente'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if isinstance(exc, exceptions.NotAuthenticated):
            return Response(
                {'detail': 'No autenticado. Se requiere autenticación para acceder a este recurso'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return super().handle_exception(exc)

class MeasureView(viewsets.ModelViewSet):
    # Define las clases de permisos requeridas
    permission_classes = [IsAuthenticated, ]
    serializer_class = MeasureSerializer

    # Deshabilitar paginación en esta vista
    pagination_class = None

    def get_queryset(self):
        """
        Retorna el conjunto de medidas filtrado por el 'event_id' proporcionado 
        en los parámetros de la solicitud
        """
        # Obtiene el parámetro 'event_id' de la consulta
        event_id = self.request.query_params.get('event_id', '')

        # Valida que el 'event_id' sea proporcionado
        if not event_id:
            raise ValidationError({'detail': 'El parámetro event_id es obligatorio'})

        # Filtra las medidas relacionadas con el hecho especificado
        return Measure.objects.filter(event=event_id)

    def get_object(self):
        """
        Obtiene una medida específica utilizando su ID como clave primaria
        """
        measure_id = self.kwargs.get('pk')  # Obtiene el parámetro 'pk' de la URL
        try:
            return Measure.objects.get(id=measure_id)
        except Measure.DoesNotExist:
            raise NotFound(f'No se encontró la medida con el identificador {measure_id}')

    def destroy(self, request, *args, **kwargs):
        """
        Elimina una medida específica
        """
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Measure.DoesNotExist:
            return NotFound(f'Medida no encontrada')
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AttachmentView(viewsets.ModelViewSet):
    # Define las clases de permisos requeridas
    permission_classes = [IsAuthenticated, ]
    serializer_class = AttachmentSerializer

    # Deshabilitar paginación en esta vista
    pagination_class = None

    def get_queryset(self):
        """
        Retorna el conjunto de anexos filtrado por el 'event_id' proporcionado 
        en los parámetros de la solicitud
        """
        # Obtiene el parámetro 'event_id' de la consulta
        event_id = self.request.query_params.get('event_id', '')

        # Valida que el 'event_id' sea proporcionado
        if not event_id:
            raise ValidationError({'detail': 'El parámetro event_id es obligatorio'})

        # Filtra los anexos relacionadas con el hecho especificado
        return Attachment.objects.filter(event=event_id)

    def get_object(self):
        """
        Obtiene un anexo específico utilizando su ID como clave primaria
        """
        attach_id = self.kwargs.get('pk')  # Obtiene el parámetro 'pk' de la URL
        try:
            return Attachment.objects.get(id=attach_id)
        except Attachment.DoesNotExist:
            raise NotFound(f'No se encontró el anexo con el identificador {attach_id}')

    def destroy(self, request, *args, **kwargs):
        """
        Elimina un anexo específico
        """
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Attachment.DoesNotExist:
            return NotFound(f'Anexo no encontrado')
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def header_footer(canvas, doc):
    canvas.saveState()
    logo_path = "static/logo.jpg"
    LEFT_MARGIN = 80

    # ENCABEZADO
    try:
        canvas.drawImage(logo_path, LEFT_MARGIN, letter[1] - 60, width=50, height=50, preserveAspectRatio=True)
    except:
        pass  # Si no encuentra el logo, que no falle

    fecha_reporte = datetime.now().strftime("%d/%m/%Y, %H:%M")
    canvas.setFont('Helvetica-Bold', 14)
    canvas.drawString(LEFT_MARGIN + 60, letter[1] - 30, "Reporte de hecho")

    canvas.setFont('Helvetica', 9)
    canvas.drawString(LEFT_MARGIN + 60, letter[1] - 45, f"Fecha de reporte: {fecha_reporte}")

    # PIE DE PÁGINA
    canvas.setFont('Helvetica', 9)
    canvas.drawString(LEFT_MARGIN, 30, "Elaborado por Hechos Extraordinarios")
    canvas.drawRightString(letter[0] - 40, 30, f"Página {doc.page}")

    canvas.restoreState()

class ReportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id, *args, **kwargs):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response(
                {'detail': 'El hecho extraordinario con ese id no fue encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        summary_data = get_event_summary(event=event)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="reporte_hecho_{event_id}.pdf"'

        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()

        style_centered_heading = ParagraphStyle(
            name='CenteredHeading',
            parent=styles['Heading2'],
            alignment=1  # 0 = izquierda, 1 = centro, 2 = derecha
        )

        table_style = TableStyle([
            ('SPAN', (0, 0), (1, 0)),  # El título ocupa las dos columnas
            ('BACKGROUND', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ])

        # Entidad asociada
        entity = summary_data.get("entity", {})
        entidad_data = [
            ("Nombre", entity.get("name", "")),
            ("Dirección", entity.get("address", "") or "No especificada"),
            ("Municipio", entity.get("municipality", "")),
            ("Provincia", entity.get("province", "")),
            ("Sector", entity.get("sector", "")),
        ]

        header_entity_table = [Paragraph("Entidad Asociada", style_centered_heading)]
        table_entity = Table([[header_entity_table[0]]] + entidad_data, hAlign='LEFT', colWidths=[150, 350])
        table_entity.setStyle(table_style)
        elements.append(table_entity)
        elements.append(Spacer(1, 12))

        # Campos principales
        campos_principales = [
            ("Síntesis", Paragraph(summary_data.get("synthesis", ""), styles['Normal'])),
            ("Causa", Paragraph(summary_data.get("cause", "") or "No especificada", styles['Normal'])),
            ("Alcance", summary_data.get("scope", "")),
            ("Fecha del hecho", summary_data.get("occurrence_date", "")),
            ("Clasificación", Paragraph(summary_data.get("classification", ""), styles['Normal'])),
            ("Tipo de evento", summary_data.get("event_type", "")),
            ("Estado", summary_data.get("status", "")),
            ("Creado por", summary_data.get("created_by", "")),
            ("Fecha de creación", summary_data.get("created_date", "")),
            ("Cerrado por", summary_data.get("closed_by", "")),
            ("Fecha de cierre", summary_data.get("closed_date", "")),
        ]

        header_general_table = [Paragraph("Información General", style_centered_heading)]
        table = Table([[header_general_table[0]]] + campos_principales, hAlign='LEFT', colWidths=[150, 350])
        table.setStyle(table_style)
        elements.append(table)
        elements.append(Spacer(1, 12))

        # Medidas tomadas
        table_measure_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ])

        measures = summary_data.get("measures", [])
        if measures:
            # Construir el texto con viñetas
            bullet_measures = ""
            for measure in measures:
                desc = str(measure.get("description", ""))
                bullet_measures += f"• {desc}<br/>"

            bullet_paragraph = Paragraph(bullet_measures, styles['Normal'])
            measures_data = [[Paragraph("Medidas tomadas", style_centered_heading)],
                    [bullet_paragraph]]

            table_measures = Table(measures_data, hAlign='LEFT', colWidths=[500])
            table_measures.setStyle(table_measure_style)
            elements.append(table_measures)
            elements.append(Spacer(1, 12))

        # Campos adicionales
        additional_fields = summary_data.get("additional_fields", [])
        if additional_fields:
            adicionales = [[Paragraph("Campos Adicionales", style_centered_heading)]]
            for item in additional_fields:
                campo = item.get("field", "")
                valor = Paragraph(str(item.get("value", "")), styles['Normal'])  # Soporte para textos largos
                adicionales.append([campo, valor])

            table_additional = Table(adicionales, hAlign='LEFT', colWidths=[150, 350])
            table_additional.setStyle(table_style)
            elements.append(table_additional)
            elements.append(Spacer(1, 12))

        doc.build(elements, onFirstPage=header_footer, onLaterPages=header_footer)
        return response