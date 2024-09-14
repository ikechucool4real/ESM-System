from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, Participant, Study, Task, Question, Reply


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']

    def create(self, validated_data):        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add additional response data here
        data.update({'user': {
            'email': self.user.email,
            'id': self.user.id
        }})
        
        return data


class StudySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='email.email', read_only=True)

    class Meta:
        model = Study
        fields = ['id', 'title', 'about', 'status', 'code', 'email']


class NewStudySerializer(serializers.ModelSerializer):

    class Meta:
        model = Study
        fields = '__all__'

class ParticipantTaskSerializer(serializers.ModelSerializer):
    study = StudySerializer(read_only=True)

    class Meta:
        model = Task
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = '__all__'

class ParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Participant
        fields = '__all__'

    def create(self, validated_data):
        code = validated_data.get('code')
        try:
            study = Study.objects.get(code=code)
        except Study.DoesNotExist:
            raise serializers.ValidationError("Study with this code does not exist.")
        validated_data['study'] = study
        return super().create(validated_data)

class GetReplySerializer(serializers.ModelSerializer):
    participant = serializers.IntegerField(source="participant.id", read_only=True)
    question = serializers.CharField(source="question.text", read_only=True)

    class Meta:
        model = Reply
        fields = ['id', 'participant', 'date','question', 'answer']

class ReplySerializer(serializers.ModelSerializer):

    class Meta:
        model = Reply
        fields = '__all__'

