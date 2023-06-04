# Real-time Chatroom
## Client-server program with: chat, file upload/download, voice message, and weather API functionality.

This project is an introductory project I undertook to learn and develop my web development skills. 
I undertook this project with limited web development skills, and I plan to update and expand the existing code. This particular server-client chatroom has the following functionality:

* Socket.io and NodeJS chatroom with username and whisper functionality
* File-to-server upload using XHR (XMLHttpRequest)
* Download file with href download link
* Voice messages are sent as JS Objects
* OpenWeatherApp API to fetch weather information
* Video chat functionality coming soon

![Demo_photo](demo.png)

## Getting Started
To clone and run the project, follow these steps:

1. Clone the repository and navigate to the project directory:
    ```bash
    git clone <repository-url>
    cd realtime_chatroom
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    node server.js
    ```

4. Connect to the client by opening the following URL in your browser:
    ```
    http://localhost:3000
    ```

## User Functionality and Overview
1. Chatroom functionality
2. Duplicate usernames are not accepted
3. User list updates dynamically
4. Whisper functionality: Use "/w username message" to send a private message
5. File transfer:
    - Clients can upload files to the server
    - Clients can download files from the server
6. Voice messages:
    - Click "Record" to start recording and "Stop" to end the recording
    - Follow on-screen prompts for recording voice messages
7. Weather API: Use "weather city_name" to receive temperature and wind speeds of a city

### Coming Soon!
1. Video calling
2. Interactive chatbot

### Known Bugs
- Currently, a user can whisper to anything, including non-existing usernames (e.g., "/w not_a_username hello void").
- Messages currently have a size limit.
- When a voice message is canceled, the audio must stop playing.

