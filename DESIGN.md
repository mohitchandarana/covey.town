## DESIGN

### Frontend
Below is a list of components that were added to the existing codebase or modified in the frontend, along with their responsibilities and collaborators.

**TownsServiceClient**:
1. <Kristi>

**Authentication**: 
1. *AuthHero.tsx*: This component represents a log-in button if there is no user logged in, or a log out button if a user is logged in. We utilize the `useAuth0()` hook for handling authentication all throughout the codebase, and in this particular case to determine whether or not the user has been authenticated. This component collaborates with *PreJoinScreens.tsx*, where it gets rendered.
2. *BackHomeButton.tsx*: Uses the react router we configured to navigate the user back to the home screen upon clicking the Home button. This component collaborates with *Profile.tsx*, where it gets rendered.
3. *LoginButton.tsx*: Represents a Log-In button which, when clicked, promps the user for credentials through Auth0. This component collaborates with *SplashPage.tsx* and *PreJoinScreen.tsx*, where it gets rendered if a user is not yet logged in.
4. *LogoutButton.tsx*: Represents a Log-out button which, when  clicked, returns the user to the main Splash page. This component collaborates with *PreJoinScreen.tsx*, where it gets rendered if a user is logged in.
5. *Profile.tsx*: Represents the user's profile. This page displays the user's email (disabled field as it cannot be allowed to update) and their First and Last name that can be updated with the Update button. It displays the User's current avatar selection and offers a drop down menu with 20 avatars to choose from. The new selection can be previewed in the Selection Preview component above the dropdown and can be saved by clicking on the Save Button. It also has a Table that contains all the saved towns for a user and a Delete Account button. 

**Login**:
1. *Login.tsx*: This component houses the REACT router, which keeps our UI in sync with the URL. It interacts with all components in the codebase, and is used mainly to redirect the user when a button is clicked.
2. *TownSelection.tsx*: This component has been updated to prepopulate any user's username (Authenticated or Guest). If a user is authenticated and logged in, it also has a component that displays a Table of the user's Saved Towns
3. *TownSettings.tsx*: This component has been updated to display a Save To Profile button if a User is Authenticated and Logged in.

**Splash**:
1. *SplashPage.tsx*: This component renders the Splash page, which contains a cloud animation, welcome message, and buttons to either log in or continue as guest.

**PreJoinScreens**:
1. *PreJoinScreens.tsx*: Modified to prepopulate the user's username, contain a link to navigate to the user's profile page, and display a welcome message.


### Backend
Below is a list of components that were added to the existing codebase or modified in the backend, along with their responsibilities and collaborators.
<Kristi>