# Credential Management
This is an internal web application for managing credentials such as login details (username and password) for various resources.

# Features
- User registration and login with JWT authentication
- Different user roles: normal users, management users, and admin users
- Resource access control based on user roles and permissions
- Organizational units (OU) and divisions for organizing credentials
- Credential repositories for each division
- View, add, and update credentials in the repositories
- Assign and unassign users from divisions and OUs (admin only)
- Change user roles (admin only)


# Start the Server

1. Navigate to the backend directory: `cd project/backend`
2. Install the dependencies: `npm install`
3. Start the backend server: `npm start`


# Frontend Setup
1. Navigate to the frontend directory: `cd project/frontend`
2. Install the dependencies: `npm install`
3. Start the backend server: `npm start` 

# Technologies Used
1. Frontend: React.js
2. Backend: Express.js
3. Database: MongoDB with Mongoose (ODM)
4. Authentication: JSON Web Tokens (JWT)

# Note:

1. In order to view the credential repositories for a division, a user must belong to at least one Organizational Unit (OU) and one division associated with that repository. If a user does not belong to any division, a message will be displayed indicating that they do not have access to any credential repository.
2.  Please note that some of the credential repositories that have been created may not have been populated with credentials yet. You can add credentials to the repositories using the provided user interface (UI).