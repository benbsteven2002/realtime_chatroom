# realtime_chatroom
Client-server program with: chat, file upload/download, voice message and weather API functionality.

###############
To run server:
    node server.js
To connect with client:
    localhost:3000 in browser
###############

Functionality and overview:
1. Chatroom functionality
2. Duplicate usernames are not accpeted
3. User list updates dynamically
4. Whisper -> "/w username message"
5. File transfer (navigate to file transfer window)
    -> 1. clients can upload files to server
    -> 2. clients can download files from server
6. Voice message -> "click record to start and stop to end, follow on screen prompts"
7. Weather API -> "weather city_name" to receive tempreature and wind speeds of city

TODO
7. Next is VOIP  (and maybe video call..?)
https://www.geeksforgeeks.org/how-to-make-a-video-call-app-in-node-js/
8. I would love to add an interactive chatbot at some point

###############
BUGS:
- currently, a user can whisper to anything... 
    e.g. /w not_a_username hello void
- I need to dynamically add new lines when a message reaches a certain size
- When I cancel a voice message, audio must stop playing...
