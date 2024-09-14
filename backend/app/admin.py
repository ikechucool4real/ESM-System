from django.contrib import admin
from . import models

@admin.register(models.CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active', 'is_staff', 'is_superuser']
    ordering = ['email']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ()}),  # Add personal info fields if any
        ('Permissions', {'fields': ( 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)


# Register your models here.
@admin.register(models.Study)
class StudyAdmin(admin.ModelAdmin):
    list_display = ['title', 'about', 'status', 'code', 'email']
    ordering = ['title']
    search_fields = ['title__istartswith']


@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['study', 'title', 'type', 'delivery_time', 'start_date', 'end_date']
    ordering = ['title']
    search_fields = ['title__istartswith']

@admin.register(models.Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['task','text']
    ordering = ['text']
    search_fields = ['text']

@admin.register(models.Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['study', 'email', 'code']
    ordering = ['email']
    search_fields = ['email']

@admin.register(models.Reply)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ['participant', 'date', 'question', 'answer']
    ordering = ['participant', 'date']
    search_fields = ['participant', 'date']