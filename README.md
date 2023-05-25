# realtime_chatroom
Client-server program

###############
To run server:
    node server.js
To connect with client:
    localhost:3000 in browser
###############

Functionality and overview:
1. Log in, duplicate usernames are not accpeted
2. User list updates dynamically
3. General chatroom setup 
4. To whisper, "/w username message"
5. File transfer (navigate to file transfer window)
    -> 1. clients can upload files to server
    -> 2. clients can download files from server

6. Next is VOIP and voice notes
https://www.geeksforgeeks.org/how-to-make-a-video-call-app-in-node-js/

###############
BUGS:
- currently, a user can whisper to anything... 
    e.g. /w not_a_username hello void
