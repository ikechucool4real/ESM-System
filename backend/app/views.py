from .models import Question, Reply, Study, Task, Participant, CustomUser 
from .serializers import NewStudySerializer, StudySerializer,  QuestionSerializer,  ReplySerializer, TaskSerializer, ParticipantTaskSerializer, ParticipantSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer, GetReplySerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics, viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

class RegistrationViewSet(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ParticipantLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        try:
            participant = Participant.objects.get(email=email, code=code)
            participant_data = ParticipantSerializer(participant).data
            return Response({"message": "Login successful", "user": participant_data}, status=status.HTTP_200_OK)
        except Participant.DoesNotExist:
            return Response({"message": "Invalid email or study code"}, status=status.HTTP_400_BAD_REQUEST)

class StudyViewSet(viewsets.ModelViewSet):
    queryset = Study.objects.all()
    serializer_class = StudySerializer

class NewStudyViewSet(viewsets.ModelViewSet):
    queryset = Study.objects.all()
    serializer_class = NewStudySerializer

class ParticipantTaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related('study').all()  # Use select_related for efficiency
    serializer_class = ParticipantTaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()  # Use select_related for efficiency
    serializer_class = TaskSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer


class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

class GetReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all() 
    serializer_class = GetReplySerializer

