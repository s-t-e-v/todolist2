from django.shortcuts import render

from .models import Todo
# Create your views here.

def index(request):

    todo = Todo.objects.all()

    context = {"todo": todo}

    return render(request, 'index.html', context)