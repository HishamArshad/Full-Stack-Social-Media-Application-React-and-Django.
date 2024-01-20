from django.db import models
from django.utils import timezone
from accounts.models import MyUser
from django.conf import settings
 
 
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

class Posts(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    image = models.ImageField(upload_to='user_images/', blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    def __str__(self):
        return self.title

 

class Comment(models.Model):
    post = models.ForeignKey(Posts, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_comments', blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Reply(models.Model):
    comment = models.ForeignKey(Comment, related_name='replies', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_replies', blank=True)


    
# # Create your models here.
# class Team(models.Model):
#     name = models.CharField(max_length=255)
#     users = models.ManyToManyField(MyUser)
#     def __str__(self):
#         return self.name

# class Comment(models.Model):
#     content = models.TextField()
#     created_at = models.DateTimeField(default=timezone.now, editable=False)
#     changed_at = models.DateTimeField(auto_now=True)
#     created_by = models.ForeignKey(MyUser, related_name='Comment',on_delete=models.CASCADE)
#     def __str__(self):
#         return f"Comment by {self.created_by.email} on {self.created_at}"

# class Client(models.Model):
#     team = models.ForeignKey(Team, on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     comment = models.ManyToManyField(Comment, blank=True)
#     created_at = models.DateTimeField(default=timezone.now, editable=False)
#     changed_at = models.DateTimeField(auto_now=True)
#     def __str__(self):
#         return self.name

# class TodoList(models.Model):
#     client = models.ForeignKey(Client, related_name='TodoList',on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     comment = models.ManyToManyField(Comment, blank=True)
#     created_at = models.DateTimeField(default=timezone.now, editable=False)
#     changed_at = models.DateTimeField(auto_now=True)
#     created_by = models.ForeignKey(MyUser, related_name='TodoList',on_delete=models.CASCADE)
#     def __str__(self):
#         return self.name

# class Snippet(models.Model):
#     title = models.CharField(max_length=255)
#     content = models.TextField()
    
#     def __str__(self):
#         return self.name
 
# # Social app
 

# class UserUploadLatest(models.Model):
#     title = models.CharField(max_length=255)
#     description = models.TextField()
#     image = models.ImageField(upload_to='user_uploads/')
#     created_at = models.DateTimeField(auto_now_add=True)
#     likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
#     author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     def __str__(self):
#         return self.title

