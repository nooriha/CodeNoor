from django.urls import path
from .views import home, Contacts

urlpatterns=[
    path("",home, name="home"),
    path("contact/", Contacts, name="Contacts"),
]