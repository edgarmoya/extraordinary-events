from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Count
from django.utils import timezone
from events.models import Event
from locations.models import Municipality, Province
from sectors.models import Sector
from type_events.models import Type
from events.models import Measure


@require_http_methods(["GET"])
def event_counts(request):
    total_events_count = Event.objects.count()
    open_events_count = Event.objects.filter(status=Event.OPEN).count()
    closed_events_count = Event.objects.filter(status=Event.CLOSED).count()

    if total_events_count == 0:
        percentage_open = 0
        percentage_closed = 0
    else:
        percentage_open = (open_events_count / total_events_count) * 100
        percentage_closed = (closed_events_count / total_events_count) * 100
    
    # Obtener eventos abiertos que llevan más de 30 días sin cerrar
    thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
    overdue_events = Event.objects.filter(status=Event.OPEN, closed_date__isnull=True, occurrence_date__lt=thirty_days_ago).count()

    if overdue_events == 0:
        percentage_overdue = 0
    else:
        percentage_overdue = (overdue_events / total_events_count) * 100

    response_data = {
        'total_events_count': total_events_count,
        'open_events_count': open_events_count,
        'closed_events_count': closed_events_count,
        'percentage_open': round(percentage_open, 2),
        'percentage_closed': round(percentage_closed, 2),
        'overdue_events_count': overdue_events,
        'percentage_overdue': round(percentage_overdue, 2),
    }

    return JsonResponse(response_data)


@require_http_methods(["GET"])
def events_count_by_province(request, province_name):
    try:
        # Obtener la provincia por el nombre
        province = Province.objects.get(description=province_name)
    except Province.DoesNotExist:
        return JsonResponse({'error': 'Provincia no encontrada'}, status=404)

    # Obtener todos los municipios asociados a la provincia
    municipalities = Municipality.objects.filter(province=province)

    # Obtener todos los eventos asociados a los municipios de la provincia
    events = Event.objects.filter(entity__municipality__in=municipalities)

    # Contar la cantidad de eventos
    events_count = events.count()

    # Contar la cantidad de medidas por provincia
    measures_count = Measure.objects.filter(event__in=events).count()

    response_data = {
        'province_name': province.description,
        'events_count': events_count,
        'measures_count': measures_count,  # Nueva línea
    }

    return JsonResponse(response_data)


@require_http_methods(["GET"])
def percentage_of_events_by_sector(request):
    # Obtener todos los sectores activos
    active_sectors = Sector.objects.filter(is_active=True)

    # Obtener la cantidad total de eventos
    total_events_count = Event.objects.count()

    # Inicializar una lista para almacenar los resultados
    results = []

    # Calcular el porcentaje de eventos por cada sector
    for sector in active_sectors:
        events_in_sector_count = Event.objects.filter(entity__sector=sector).count()
        
        if events_in_sector_count > 0:
            percentage_in_sector = (events_in_sector_count / total_events_count) * 100
            results.append({
                'sector_name': sector.description,
                'percentage_in_sector': round(percentage_in_sector, 2),
        })

    response_data = {
        'results': results,
    }

    return JsonResponse(response_data)


@require_http_methods(["GET"])
def events_count_scope(request):
    # Obtener todas las provincias
    provinces = Municipality.objects.filter(province__isnull=False).values('province__description').distinct()

    # Obtener la cantidad de hechos relevantes y de corrupción por cada provincia
    results = []
    for province in provinces:
        province_name = province['province__description']
        municipalities = Municipality.objects.filter(province__description=province_name)
        relevant_events_count = Event.objects.filter(entity__municipality__in=municipalities, scope='relevant').count()
        corruption_events_count = Event.objects.filter(entity__municipality__in=municipalities, scope='corruption').count()

        results.append({
            'province_name': province_name,
            'relevant_events_count': relevant_events_count,
            'corruption_events_count': corruption_events_count,
        })

    return JsonResponse({'results': results})


@require_http_methods(["GET"])
def events_count_by_type(request):
    # Obtener todos los tipos activos
    active_types = Type.objects.filter(is_active=True)

    # Obtener la cantidad de hechos por cada tipo
    results = []
    for event_type in active_types:
        events_count = Event.objects.filter(event_type=event_type).count()

        results.append({
            'type_description': event_type.description,
            'events_count': events_count,
        })

    response_data = {
        'results': results,
    }

    return JsonResponse(response_data)