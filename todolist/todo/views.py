from django.shortcuts import render

from .models import Todo
from django.http import JsonResponse
from django.db import connection



import json
# Create your views here.

# --------------- Normal mode --------------- #

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
    

# --------------- Deletion mode --------------- #

def delete(request):
    """Delete the selected entry.
        update_history will be called"""
    
    if request.method == 'POST':
        body = json.loads(request.body)
        id = body.get('id', '')

        Todo.objects.filter(id=id).delete()
        return JsonResponse({'sucess': True})
    else:
        return JsonResponse({'sucess': False, 'error': 'Invalid request method'})
    

def delete_all(request):
    """Delete all tasks.
        update_history will be called"""
    
    if request.method == 'POST':

        Todo.objects.all().delete()

        # reset index
        # -> this should happen when switch off the deletion mode, a dedicated view should be created
        # with connection.cursor() as cursor:
        #     cursor.execute("DELETE FROM sqlite_sequence WHERE name='todo_todo'")

        return JsonResponse({'sucess': True})
    else:
        return JsonResponse({'sucess': False, 'error': 'Invalid request method'})


# reset index
def reset_index(request):
    """Reset index when every task are deleted and the deletion is confirmed"""
    pass

def undo(request):
    """Undo the previous action.
        update_history will be called"""
    pass

def update_history(request):
    """Update history
        It uses a model keeping track of actions perform during deletion.
        The model is being added entry like following:
            - when delete_entry is called, the task is registered in the model 
            alongside the code "d" standing for "deleted"
            - when delete_all is called, all the taskds deleted are registered
              together with the code "da" standing for "delete all"
            - when no actions has been done, nothing is added to the history,
              even if the user clicks on the "undo" button
            - when undo is called, we check the last entry in the history model.
              depending on the code, we update the Todo database with by readding
              one ("d") or several ("da") tasks, from the history model. When this
              is done, we delete the last entry in the history model to update it.
    """
    pass