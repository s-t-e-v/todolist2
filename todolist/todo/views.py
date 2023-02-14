from django.shortcuts import render

from .models import Todo
from django.http import JsonResponse


import json
# Create your views here.

def index(request):

    todo = Todo.objects.all()

    context = {"todo": todo}

    return render(request, 'index.html', context)


def add(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        taskname = body.get('taskname', '')
        newtask = Todo.objects.create(checkstate=False, taskname=taskname)
        return JsonResponse({'sucess': True, 'id': newtask.id})
    else:
        return JsonResponse({'sucess': False, 'error': 'Invalid request method'})
    
def delete(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        id = body.get('id', '')

        Todo.objects.filter(id=id).delete()
        return JsonResponse({'sucess': True})
    else:
        return JsonResponse({'sucess': False, 'error': 'Invalid request method'})
    

def checkstate_update(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        id = body.get('id', '')
        checkstate = body.get('checkstate', '')

        task = Todo.objects.get(id=id)
        task.checkstate = checkstate
        task.save()

        return JsonResponse({'sucess': True})
    else:
        return JsonResponse({'sucess': False, 'error': 'Invalid request method'})
    
    