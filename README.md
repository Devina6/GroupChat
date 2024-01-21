# GroupChat
1. create new "server.js" file
2. In terminal install 
-> npm install nodemon --save-dev
-> npm install --save express
-> npm install --save mysql2
-> npm install --save sequelize
3. create "home.html"
4. define database and create user model
5. In terminal install
-> npm install --save cors
-> npm install --save bycrypt
6. create signup page view and link to client side js and connect through routes -> controllers
7. store data in mysql database using sequelize and return response 
8. install cors and handle correctly
9. create front end functionality for login
10. create chat display front end 
11. authenticate user and post message to backend to store in database 
12. get all (everyone) messages from the database
13. on signup assign everyone to a common group
14. display all groups the particular user is part of and allow to read and write messages only to those groups
15. allow user to create custom groups 
16. make group creator user as admin and allow authority to add members to group using user's email
17. In terminal install 
-> npm install @aws-sdk/client-s3
-> npm install multer 
18. Connect aws iam user and necessary bucket to store user images
19. handle to upload either or both image and message, and send to the backend while handling the image by multer middleware
20. store the image in the s3 bucket and organise code to retrieve image or code from aws bucket or database when requested to send to frontend to display them in the chat-display