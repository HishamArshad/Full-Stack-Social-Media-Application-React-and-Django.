from accounts.models import MyUser
from django.shortcuts import get_object_or_404
from authemail.serializers import UserSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Posts, Comment, Reply, UserProfile
from .serializers import PostSerializer, ReplySerializer, CommentSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
# from rest_framework.viewsets import ViewSet
# from rest_framework.generics import RetrieveAPIView
# from rest_framework.views import APIView
 
# class UserDetailView(RetrieveAPIView):
#     queryset = MyUser.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated] 
# views.py

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.queryset.get(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
 

class PostView(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Set the owner field to the authenticated user before saving the post
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # Filter the queryset to include only posts of the authenticated user
        return Posts.objects.filter(user=self.request.user)
    @action(detail=True, methods=['post'])
    def like_post(self, request, pk=None):
        post = get_object_or_404(Posts, pk=pk)
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            message = 'Post unliked successfully.'
        else:
            post.likes.add(user)
            message = 'Post liked successfully.'

        post.save()

        # Get the updated likes count
        likes_count = post.likes.count()

        return Response({'message': message, 'likes_count': likes_count}, status=status.HTTP_200_OK)
class ListAllPostView(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    @action(detail=True, methods=['post'])
    def like_post(self, request, pk=None):
        post = get_object_or_404(Posts, pk=pk)
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            message = 'Post unliked successfully.'
        else:
            post.likes.add(user)
            message = 'Post liked successfully.'

        post.save()

        # Get the updated likes count
        likes_count = post.likes.count()

        return Response({'message': message, 'likes_count': likes_count}, status=status.HTTP_200_OK)
    
class CommentView(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        post_id = request.data.get('post')
        post = get_object_or_404(Posts, id=post_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, post=post)
        
        # Include the associated post data in the response
        response_data = serializer.data
        response_data['post'] = PostSerializer(post).data
        
        return Response(response_data)
    @action(detail=False, methods=['GET'])
    def get_comments_for_post(self, request):
        post_id = request.query_params.get('post_id')
        print("Post ID:", post_id)  # Add this line for debugging
        post = get_object_or_404(Posts, id=post_id)
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like_comment(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        user = request.user

        if user in comment.likes.all():
            comment.likes.remove(user)
            message = 'Comment unliked successfully.'
        else:
            comment.likes.add(user)
            message = 'Comment liked successfully.'

        comment.save()
        
        # You can include additional information in the response if needed
        # For example, the updated likes count
        likes_count = comment.likes.count()

        return Response({'message': message, 'likes_count': likes_count}, status=status.HTTP_200_OK)
    
class ReplyView(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        comment_id = request.data.get('comment')
        comment = get_object_or_404(Comment, id=comment_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, comment=comment)
        return Response(serializer.data)
    @action(detail=False, methods=['GET'])
    def get_replies_for_comment(self, request):
        comment_id = request.query_params.get('comment_id')
        print("Comment ID:", comment_id)  # Add this line for debugging
        comment = get_object_or_404(Comment, id=comment_id)
        replies = Reply.objects.filter(comment=comment)
        serializer = ReplySerializer(replies, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['post'])
    def like_reply(self, request, pk=None):
        reply = get_object_or_404(Reply, pk=pk)
        user = request.user

        if user in reply.likes.all():
            reply.likes.remove(user)
            message = 'Reply unliked successfully.'
        else:
            reply.likes.add(user)
            message = 'Reply liked successfully.'

        reply.save()
        
        # You can include additional information in the response if needed
        # For example, the updated likes count
        likes_count = reply.likes.count()

        return Response({'message': message, 'likes_count': likes_count}, status=status.HTTP_200_OK)
class UserViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """
    def list(self, request):
        queryset = MyUser.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = MyUser.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

