 
from rest_framework import serializers
from accounts.models import MyUser
from rest_framework import serializers
from .models import Posts, Comment, Reply, UserProfile
 
# serializers.py
 
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_picture']

class ReplySerializer(serializers.ModelSerializer):
    user_fullname = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    user_id = serializers.ReadOnlyField(source='user.id')  # Add this line
    def get_likes_count(self, instance):
        return instance.likes.count()

    def get_user_fullname(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    class Meta:
        model = Reply
        fields = ['id','user_id', 'user', 'user_fullname', 'content', 'created_at', 'likes_count']

class CommentSerializer(serializers.ModelSerializer):
    user_fullname = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    replies = ReplySerializer(many=True, read_only=True)
    user_id = serializers.ReadOnlyField(source='user.id')  # Add this line
    def get_likes_count(self, instance):
        return instance.likes.count()
    def get_user_fullname(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    class Meta:
        model = Comment
        fields = ['id', 'user_id','user', 'content', 'user_fullname', 'created_at','likes_count', 'replies']

class PostSerializer(serializers.ModelSerializer):
    user_fullname = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    # user_id = serializers.ReadOnlyField(source='user.id')  # Add this line
 

    def get_user_fullname(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_likes_count(self, instance):
        return instance.likes.count()

    class Meta:
        model = Posts
        fields = ['id','user_id', 'user_fullname', 'title', 'description', 'image', 'likes_count', 'comments'] 


