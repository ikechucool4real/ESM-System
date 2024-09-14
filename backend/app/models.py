from django.db import models
import string
import random
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def clean(self):
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)




class Study(models.Model):
    STATUS_CHOICES = [
        ("Pending", 'Pending'),
        ("Current", 'Current'),
        ("Completed", 'Completed')
    ]

    title = models.CharField(max_length=100)
    about = models.TextField()
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default="Pending")
    code = models.CharField(max_length=6, unique=True, blank=True)
    email = models.ForeignKey('CustomUser', related_name='studies', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_unique_code()
        super(Study, self).save(*args, **kwargs)

    def generate_unique_code(self):
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            if not Study.objects.filter(code=code).exists():
                return code



class Task(models.Model):
    TYPE_CHOICES = [
        ("Interval-Contingent (daily)", 'Interval-Contingent (daily)')
    ]

    STATUS_CHOICES = [
        ("Pending", 'Pending'),
        ("Current", 'Current'),
        ("Completed", 'Completed')
    ]

    study = models.ForeignKey(Study, related_name='tasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    type = models.CharField(max_length=255, choices=TYPE_CHOICES, 
                            default="Interval-Contingent (daily)")
    delivery_time = models.TimeField()
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['title']


class Question(models.Model):
    task = models.ForeignKey(Task, related_name='questions', on_delete=models.PROTECT)
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text
    

class Participant(models.Model):
    study = models.ForeignKey(Study, related_name='participants', on_delete=models.CASCADE)
    email = models.EmailField()
    code = models.CharField(max_length=6)

    def __str__(self):
        return self.email


class Reply(models.Model):
    participant = models.ForeignKey(Participant, related_name='replies', 
                                    on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    question = models.ForeignKey(Question, related_name='replies', on_delete=models.PROTECT)
    answer = models.TextField()

    def __str__(self):
        return f'{self.participant.id} - {self.date}'

