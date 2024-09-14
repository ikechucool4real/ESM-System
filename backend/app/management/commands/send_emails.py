from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from time import sleep
from app.models import Task, Participant  # Update with your actual app name and models

class Command(BaseCommand):
    help = 'Send scheduled emails to participants'

    def handle(self, *args, **kwargs):
        # Get the current time
        now = timezone.now()

        # Fetch all tasks that are scheduled to be delivered today
        tasks = Task.objects.filter(start_date__lte=now.date(), end_date__gte=now.date())

        for task in tasks:
            # Calculate the delivery time for today
            delivery_time_today = timezone.datetime.combine(now.date(), task.delivery_time)
            delivery_time_today = timezone.make_aware(delivery_time_today)

            if delivery_time_today > now:
                delay = (delivery_time_today - now).total_seconds()
                self.stdout.write(f"Waiting {delay} seconds to send email for task '{task.title}'")
                sleep(delay)

            # Send emails to all participants of the task
            participants = Participant.objects.filter(study=task.study)

            for participant in participants:
                send_mail(
                    subject=f"Task Reminder: {task.study.title}",
                    message=f"Dear participant,\n\nThis is a reminder for the task: {task.study.title}.\n\nPlease use this details into your account via this link 'http://localhost:5173/' \n\nEmail Address: {participant.email}\nLogin Code: {participant.code}\n\nYours Sincerely",
                    from_email=task.study.email,  # Assuming Task has a user field representing the task owner
                    recipient_list=[participant.email],
                    fail_silently=False,
                )

            self.stdout.write(self.style.SUCCESS(f'Successfully sent email for task "{task.title}"'))

        self.stdout.write(self.style.SUCCESS('All emails sent'))
