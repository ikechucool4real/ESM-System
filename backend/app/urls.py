from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  NewStudyViewSet, ParticipantLoginView, ParticipantViewSet, QuestionViewSet, RegistrationViewSet, CustomTokenObtainPairView, ReplyViewSet, StudyViewSet, TaskViewSet, ParticipantTaskViewSet, GetReplyViewSet


router = DefaultRouter()
router.register(r'studies', StudyViewSet, basename='studies')
router.register(r'newstudies', NewStudyViewSet, basename='newstudies')
router.register(r'tasks', TaskViewSet, basename='tasks')
router.register(r'participanttasks', ParticipantTaskViewSet, basename='participanttasks')
router.register(r'questions', QuestionViewSet, basename='questions')
router.register(r'participants', ParticipantViewSet, basename='participants')
router.register(r'replies', ReplyViewSet, basename='replies')
router.register(r'getreplies', GetReplyViewSet, basename='getreplies')

urlpatterns = [
    path('register/', RegistrationViewSet.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('participant_login/', ParticipantLoginView.as_view(), name='participant_login'),
    path('', include(router.urls)),
]



