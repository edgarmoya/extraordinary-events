from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer
from .models import CustomUser
from rest_framework.decorators import action
from rest_framework.response import Response


# Create your views here.
class UserView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()

    @action(detail=True, methods=['POST'])
    def change_password(self, request, pk=None):
        # Get the user instance
        user = self.get_object()

        # Check if the current user is the same as the requested user or is an admin
        if request.user != user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to change this user\'s password.'},
                            status=status.HTTP_403_FORBIDDEN)

        # Get the old and new passwords from the request data
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        # Check if the old password matches the user's current password
        if not user.check_password(old_password):
            return Response({'detail': 'The old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        # Set the new password and save the user
        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)
