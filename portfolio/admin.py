from django.contrib import admin
from .models import webproject,AIProject,Article,Contacts,About,experience

# Register your models here.
admin.site.register(webproject)
admin.site.register(AIProject)
admin.site.register(Article)
admin.site.register(Contacts)
admin.site.register(About)



@admin.register(experience)
class ExperienceAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        if experience.objects.count() >= 4:
            return False
        return True