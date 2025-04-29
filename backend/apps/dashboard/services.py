from apps.events.models import Measure, Attachment
from apps.additional_fields.models import EventFieldValue

def get_event_summary(event):
    """
    Función que dado un hecho retorna un diccionario con el resumen de este
    """
    measures = Measure.objects.filter(event=event.id)
    add_fields = EventFieldValue.objects.filter(event=event.id)
    attachments = Attachment.objects.filter(event=event.id)

    full_name = lambda created_by: f'{created_by.first_name} {created_by.last_name}'
    format_date = lambda date, format: date.strftime(format)
    format_scope = lambda s: 'Corrupción' if s == 'corruption' else 'Relevante'
    format_status = lambda s: 'Abierto' if s == 'open' else 'Cerrado'

    return {
        'synthesis': event.synthesis,
        'cause': event.cause,
        'scope': format_scope(event.scope),
        'occurrence_date': format_date(event.occurrence_date, "%d/%m/%Y"),
        'classification': event.classification.description,
        'event_type': event.event_type.description,
        'status': format_status(event.status),
        'created_by': full_name(event.created_by),
        'created_date': format_date(event.created_date, "%d/%m/%Y %H:%M:%S"),
        'closed_by': full_name(event.closed_by) if event.closed_by else None,
        'closed_date': format_date(event.closed_date, "%d/%m/%Y %H:%M:%S") if event.closed_date else None,
        'entity': {
            'name': event.entity.description,
            'address': event.entity.address,
            'municipality': event.entity.municipality.description,
            'province': event.entity.municipality.province.description,
            'sector': event.entity.sector.description,
        },
        'measures': [
            {
                'description': measure.description,
            } for measure in measures
        ],
        'additional_fields': [
            {
                'field': add_field.add_field.description,
                'value': add_field.value,
            } for add_field in add_fields
        ],
        'attachments': [
            {
                'image': attachment.image.url,
            } for attachment in attachments
        ],
    }