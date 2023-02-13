from django.db import models

# Create your models here.

class Todo(models.Model):
    checkstate = models.BooleanField(default=False)
    taskname = models.CharField(max_length=200)

    def __str__(self) -> str:
        return self.taskname