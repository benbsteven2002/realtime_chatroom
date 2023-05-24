# realtime_chatroom
Client-server program

######################
To run server:
    node server.js
To connect with client:
    localhost:3000 in browser
######################

Functionality and overview:
1. Log in, duplicate usernames are not accpeted
2. User list updates dynamically
3. General chatroom setup 
4. To whisper, "/w username message"

5. Going to add -> file transfer
                -> 1. client can upload files to server
                -> 2. clients can download files from server

######################
BUGS:
- currently, a user can whisper to anything... 
    e.g. /w not_a_username hello void

UPGRADES:
- multiple file upload