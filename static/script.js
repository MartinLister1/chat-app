// connect to the server using socketio
var socket = io();

var username = '';

// runs when the user clicks join
function joinChat() {
  var input = document.getElementById('username-input');
  var name = input.value.trim();

  if (name == '') {
    alert('Please enter your name!');
    return;
  }

  username = name;

  // hide the name screen and show the chat
  document.getElementById('username-screen').classList.add('hidden');
  document.getElementById('chat-screen').classList.remove('hidden');

  addSystemMessage('You joined the chat as ' + username);

  // focus the input so they can start typing straight away
  document.getElementById('message-input').focus();
}

// runs when the message form is submitted
document.getElementById('message-form').addEventListener('submit', function(e) {
  e.preventDefault();

  var input = document.getElementById('message-input');
  var message = input.value.trim();

  if (message == '') return;

  socket.emit('send_message', {
    username: username,
    message: message
  });

  input.value = '';
});

// runs when a new message comes in from the server
socket.on('new_message', function(data) {
  addMessage(data.username, data.message, data.time);
});

// runs when someone joins
socket.on('user_joined', function(data) {
  document.getElementById('user-count').textContent = data.users;
  // only show this if we already have a username set
  // otherwise it fires before we even get to the chat
  if (username != '') {
    addSystemMessage('Someone joined the chat');
  }
});

// runs when someone leaves
socket.on('user_left', function(data) {
  document.getElementById('user-count').textContent = data.users;
  addSystemMessage('Someone left the chat');
});

// adds a chat message to the messages box
function addMessage(name, text, time) {
  var messages = document.getElementById('messages');

  var messageEl = document.createElement('article');
  messageEl.className = 'message';

  var nameEl = document.createElement('span');
  nameEl.className = 'name';
  nameEl.textContent = name + ':';

  var textEl = document.createElement('span');
  textEl.className = 'text';
  textEl.textContent = text;

  // show the time the message was sent
  var timeEl = document.createElement('span');
  timeEl.className = 'time';
  timeEl.textContent = time || '';

  messageEl.appendChild(nameEl);
  messageEl.appendChild(textEl);
  messageEl.appendChild(timeEl);
  messages.appendChild(messageEl);

  // scroll to the bottom so the latest message is always visible
  messages.scrollTop = messages.scrollHeight;
}

// adds a system message like joined or left
function addSystemMessage(text) {
  var messages = document.getElementById('messages');

  var el = document.createElement('p');
  el.className = 'system-message';
  el.textContent = text;

  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

// press enter to join
document.getElementById('username-input').addEventListener('keypress', function(e) {
  if (e.key == 'Enter') {
    joinChat();
  }
});