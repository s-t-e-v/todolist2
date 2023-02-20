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
    
    
def taskname_update(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        id = body.get('id', '')
        newtaskname = body.get('newtaskname', '')

        task = Todo.objects.get(id=id)
        task.taskname = newtaskname
        task.save()

        return JsonResponse({'sucess': True, 'newtaskname': newtaskname})
    elif request.method == 'GET':

        task_id = request.GET.get('id', '')
        task = Todo.objects.get(id=task_id)
        
        print(task.taskname)

        return JsonResponse({'sucess': True, 'taskname': task.taskname})
    else:
        return JsonResponse({'sucess': False, 'error': 'Invalid request method'})
    