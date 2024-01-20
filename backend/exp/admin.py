from django.contrib import admin
 
from .models import Posts, Comment, Reply, UserProfile


admin.site.register(UserProfile)
 
admin.site.register(Comment)
admin.site.register(Reply)
admin.site.register(Posts)
 
 