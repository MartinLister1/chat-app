from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)

# secret key is needed for socketio to work
app.config['SECRET_KEY'] = 'mysecretkey'

# this sets up socketio so we can do real time messaging
socketio = SocketIO(app)

# keep track of how many users are connected
connected_users = 0


# this runs when someone opens the chat page
@app.route('/')
def home():
    return render_template('index.html')


# this runs when a user connects to the chat
@socketio.on('connect')
def handle_connect():
    global connected_users
    connected_users += 1
    # tell everyone someone joined
    emit('user_joined', {'users': connected_users}, broadcast=True)
    print('a user connected, total users: ' + str(connected_users))


# this runs when a user closes the chat
@socketio.on('disconnect')
def handle_disconnect():
    global connected_users
    connected_users -= 1
    # tell everyone someone left
    emit('user_left', {'users': connected_users}, broadcast=True)
    print('a user disconnected, total users: ' + str(connected_users))


# this runs when someone sends a message
@socketio.on('send_message')
def handle_message(data):
    print('message from ' + data['username'] + ': ' + data['message'])
    # send the message to everyone in the chat
    emit('new_message', {
        'username': data['username'],
        'message': data['message']
    }, broadcast=True)


if __name__ == '__main__':
   import os
port = int(os.environ.get('PORT', 5000))
socketio.run(app, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)