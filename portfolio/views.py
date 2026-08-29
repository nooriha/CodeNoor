from django.shortcuts import render,redirect
from .models import webproject,AIProject,Article,About,experience
from .form import ContactsForm

# Create your views here.
def home(request):
    projects=webproject.objects.all()
    ai_projects =AIProject.objects.all()
    article =Article.objects.all()
    about_me = About.objects.first()
    ExperienceView=experience.objects.all()
    return render(
                 request,
                 "index.html",
            {
                "projects":projects,
                "ai_projects":ai_projects,
                "article": article,
                "about_me":about_me,
                "ExperienceView":ExperienceView,

            })


def Contacts(request):
    if request.method == "POST":
        form=ContactsForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("home")

    else:
        form=ContactsForm

    return render(request,"index.html",{
        "form":form
    })        