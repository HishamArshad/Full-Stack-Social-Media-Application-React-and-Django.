from .views import UserViewSet, PostView, ListAllPostView, CommentView, ReplyView,  UserProfileViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'posts', PostView, basename='posts')
router.register(r'allposts', ListAllPostView, basename='allposts')
router.register(r'comments', CommentView, basename='comments')
router.register(r'replies', ReplyView, basename='replies')
 
router.register(r'userme', UserProfileViewSet, basename='user')
# router.register(r'custom', MyUserCustomFieldsViewSet, basename='profile')

# Include the UserDetailView
# router.register(r'user-detail', UserDetailView, basename='user-detail')

urlpatterns = router.urls
