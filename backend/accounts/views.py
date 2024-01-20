import json
from django.http import JsonResponse
from django.contrib.auth import login
from rest_framework.authtoken.models import Token
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from jose import jwt
from rest_framework.permissions import AllowAny

# ...

@authentication_classes([])
@permission_classes([AllowAny])
class GoogleSignInView(APIView):
    def validate_and_decode_jwt(self, credential, expected_audience):
        
            decoded_token = jwt.decode(
                credential,
                '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',  # your_google_client_secret
                algorithms=['RS256'],
                audience=expected_audience,
                options={"verify_signature": False}  # Disable signature verification temporarily
            )

            return decoded_token
 
  

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body.decode('utf-8'))

        # Extract relevant information
        credential = data.get('credential')
        client_id = data.get('clientId')
        select_by = data.get('select_by')

        decoded_token = self.validate_and_decode_jwt(credential, expected_audience='491131327205-foeif4n807dfsf3iishrt86a6s8v23pr.apps.googleusercontent.com')
        print(decoded_token)
        if not decoded_token:
            # If JWT validation fails, respond with an error
            return JsonResponse({'error': 'Invalid JWT'}, status=400)

        # The rest of your code remains the same...
        # Extract user information from the decoded token
        user_email = decoded_token.get('email')
        user_first_name = decoded_token.get('given_name')
        user_last_name = decoded_token.get('family_name')

        # Check if the user already exists in your system
        try:
            user = get_user_model().objects.get(email=user_email)
        except get_user_model().DoesNotExist:
            # If the user doesn't exist, create a new user
            user = get_user_model().objects.create_user(email=user_email)

        # Set user fields provided by Google
        user.first_name = user_first_name
        user.last_name = user_last_name
        user.is_verified = True  # Assuming Google verifies users

        # Set social authentication fields
        user.social_provider = 'google'
        user.social_uid = decoded_token.get('sub')  # Use the appropriate field from the Google token
        user.social_extra_data = {'google': decoded_token}  # Store additional data if needed

        # Save the user
        user.save()

        # Log the user in
        login(request, user)

        # Generate or retrieve the authentication token
        token, created = Token.objects.get_or_create(user=user)

        # Example: Respond with a success message and the authentication token
        return JsonResponse({'message': 'Google Sign-In successful!', 'token': token.key})
