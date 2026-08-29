from django.db import models

# Create your models here.


class About(models.Model):
    description1 = models.TextField()
    description2 = models.TextField(blank=True)

    skill1 = models.CharField(max_length=100, blank=True)
    skill2 = models.CharField(max_length=100, blank=True)
    skill3 = models.CharField(max_length=100, blank=True)
    skill4 = models.CharField(max_length=100, blank=True)
    skill5 = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return "About Me"
    
class experience(models.Model):
    title=models.TextField()
    description = models.TextField()
    date=models.TextField()
    def __str__(self):
        return self.title

class  webproject(models.Model):
    title=models.CharField(max_length=200)
    description = models.TextField()
    link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(
        upload_to="projects/images/",
        blank=True,
        null=True
    )

    video = models.FileField(
        upload_to="projects/videos/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title


class AIProject(models.Model) :   
    title=models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(
        upload_to="AiProject",
        blank=True,
        null=True
    )

    video = models.FileField(
        upload_to="AiProject",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title


class Article(models.Model) :   
    title=models.CharField(max_length=200)
    description = models.TextField()
    link = models.URLField(blank=True)
    pdf =models.FileField(
        upload_to="Article/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.title

class Contacts(models.Model) :   
    name=models.CharField(max_length=200)
    email=models.EmailField(max_length=200)
    message = models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
