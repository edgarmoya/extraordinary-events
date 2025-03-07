from django.http import JsonResponse
from rest_framework import status, viewsets
from django.utils import timezone
from apps.events.models import Event, Measure
from apps.locations.models import Municipality, Province
from apps.sectors.models import Sector
from apps.type_events.models import Type
from .services import get_event_summary
from rest_framework.permissions import IsAuthenticated

class EventsCountViewSet(viewsets.ViewSet):
    # Verifica que el usuario esté autenticado
    permission_classes = [IsAuthenticated, ]

    def list(self, request):
        total_events_count = Event.objects.count()

        if total_events_count == 0:
            return JsonResponse({'detail': 'No existen hechos extraordinarios registrados'}, status=status.HTTP_404_NOT_FOUND)

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
        percentage_overdue = (overdue_events / total_events_count) * 100 if overdue_events is not None else 0

        return JsonResponse({
            'total_events_count': total_events_count,
            'open_events_count': open_events_count,
            'closed_events_count': closed_events_count,
            'percentage_open': round(percentage_open, 2),
            'percentage_closed': round(percentage_closed, 2),
            'overdue_events_count': overdue_events,
            'percentage_overdue': round(percentage_overdue, 2),
        })

class EventsCountByProvinceViewSet(viewsets.ViewSet):
    # Verifica que el usuario esté autenticado
    permission_classes = [IsAuthenticated, ]

    def retrieve(self, request, pk):
        # Obtener la provincia por el nombre
        try:
            province = Province.objects.get(id=pk)
        except Province.DoesNotExist:
            return JsonResponse({'detail': 'Provincia no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener todos los municipios asociados a la provincia
        municipalities = Municipality.objects.filter(province=province)

        # Obtener todos los eventos asociados a los municipios de la provincia
        events = Event.objects.filter(entity__municipality__in=municipalities)

        # Contar la cantidad de medidas por provincia
        measures_count = Measure.objects.filter(event__in=events).count()

        return JsonResponse({
            'province_name': province.description,
            'events_count': events.count(),  # Contar la cantidad de eventos
            'measures_count': measures_count,
        })

class PercentageOfEventsBySectorViewSet(viewsets.ViewSet):
    # Verifica que el usuario esté autenticado
    permission_classes = [IsAuthenticated, ]

    def list(self, request):
        # Obtener todos los sectores activos
        active_sectors = Sector.objects.filter(is_active=True)

        # Obtener la cantidad total de eventos
        total_events_count = Event.objects.count()
        if total_events_count == 0:
            return JsonResponse({'detail': 'No existen hechos extraordinarios registrados'}, status=status.HTTP_404_NOT_FOUND)

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

        if not results:
            return JsonResponse({'detail': 'No existen hechos asociados a sectores activos'}, status=status.HTTP_200_OK)

        return JsonResponse({'results': results})

class EventsCountScopeViewSet(viewsets.ViewSet):
    # Verifica que el usuario esté autenticado
    permission_classes = [IsAuthenticated, ]

    def list(self, request):
        # Obtener todas las provincias
        provinces = Municipality.objects.filter(province__isnull=False).values('province__description').distinct()
        if not provinces.exists():
            return JsonResponse({'detail': 'No existen provincias con municipios registrados'}, status=status.HTTP_404_NOT_FOUND)

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

        if not results:
            return JsonResponse({'detail': 'No existen eventos registrados por alcance'}, status=status.HTTP_404_NOT_FOUND)

        return JsonResponse({'results': results})

class EventsCountByTypeViewSet(viewsets.ViewSet):
    # Verifica que el usuario esté autenticado
    permission_classes = [IsAuthenticated, ]

    def list(self, request):
        # Obtener todos los tipos activos
        active_types = Type.objects.filter(is_active=True)
        if not active_types.exists():
            return JsonResponse({'detail': 'No existen tipos activos'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener la cantidad de hechos por cada tipo
        results = []
        for event_type in active_types:
            events_count = Event.objects.filter(event_type=event_type).count()

            results.append({
                'type_description': event_type.description,
                'events_count': events_count,
            })

        if not results:
            return JsonResponse({'detail': 'No existen eventos registrados por tipo'}, status=status.HTTP_404_NOT_FOUND)

        return JsonResponse({'results': results})

class EventSummaryViewSet(viewsets.ModelViewSet):
    # Verifica que el usuario esté autenticado
    permission_classes = [IsAuthenticated, ]

    def retrieve(self, request, pk=None):
        """Obtener el hecho extraordinario por su ID"""
        try:
            event = Event.objects.get(id=pk)
            summary = get_event_summary(event=event)
            return JsonResponse(summary)
        except Event.DoesNotExist:
            return JsonResponse({'detail': 'Hecho extraordinario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    def list(self, request):
        """Obtener todos los hechos extraordinarios"""
        events = Event.objects.all()
        events_list = [get_event_summary(event=event) for event in events]
        return JsonResponse({'events': events_list})