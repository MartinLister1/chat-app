from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from datetime import datetime
import os

app = Flask(__name__)

# secret key is needed for socketio to work
app.config['SECRET_KEY'] = 'mysecretkey'

# set up socketio
socketio = SocketIO(app)

# keep track of how many users are in the chat
connected_users = 0


@app.route('/')
def home():
    return render_template('index.html')


# runs when someone opens the page
@socketio.on('connect')
def handle_connect():
    global connected_users
    connected_users += 1
    emit('user_joined', {'users': connected_users}, broadcast=True)
    print('user connected, total: ' + str(connected_users))


# runs when someone closes the page
@socketio.on('disconnect')
def handle_disconnect():
    global connected_users
    connected_users -= 1
    emit('user_left', {'users': connected_users}, broadcast=True)
    print('user disconnected, total: ' + str(connected_users))


# runs when someone sends a message
# added timestamp so we can show what time each message was sent
@socketio.on('send_message')
def handle_message(data):
    time = datetime.now().strftime('%H:%M')
    print('message from ' + data['username'] + ': ' + data['message'])
    emit('new_message', {
        'username': data['username'],
        'message': data['message'],
        'time': time
    }, broadcast=True)


port = int(os.environ.get('PORT', 5000))
socketio.run(app, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)