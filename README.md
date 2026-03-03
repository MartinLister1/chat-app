# Real Time Chat App
Built by Martin Lister | Python, Flask, JavaScript & WebSockets

A real time chat app where multiple users can send messages to each other instantly without refreshing the page.

## How to run

1. Install the required packages:
```
pip install flask flask-socketio
```

2. Run the app:
```
python app.py
```

3. Open your browser and go to:
```
http://localhost:5000
```

4. To test it with multiple users open the same link in two different browser tabs!

## Features
- Real time messaging using WebSockets
- Enter a username before joining
- Shows how many users are currently online
- System messages when someone joins or leaves
- Press Enter or click Send to send a message

## How it works
The app uses WebSockets to keep an open connection between the browser and the server. When someone sends a message the server instantly passes it on to everyone else connected. This is different to normal websites where you have to refresh the page to see new content.

## Technologies used
- Python
- Flask
- Flask-SocketIO (WebSockets)
- HTML
- CSS
- JavaScript