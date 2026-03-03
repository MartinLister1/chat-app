// connect to the server using socketio
var socket = io();

var username = '';

// this runs when the user clicks join
function joinChat() {
  var input = document.getElementById('username-input');
  var name = input.value.trim();

  // make sure they entered a name
  if (name == '') {
    alert('Please enter your name!');
    return;
  }

  username = name;

  // hide the username screen and show the chat
  document.getElementById('username-screen').classList.add('hidden');
  document.getElementById('chat-screen').classList.remove('hidden');

  // add a message to say we joined
  addSystemMessage('You joined the chat as ' + username);

  // focus on the message input so they can start typing straight away
  document.getElementById('message-input').focus();
}

// this runs when the message form is submitted
document.getElementById('message-form').addEventListener('submit', function(e) {
  // stop the page from refreshing when form is submitted
  e.preventDefault();

  var input = document.getElementById('message-input');
  var message = input.value.trim();

  // dont send empty messages
  if (message == '') return;

  // send the message to the server
  socket.emit('send_message', {
    username: username,
    message: message
  });

  // clear the input box
  input.value = '';
});

// this runs when we get a new message from the server
socket.on('new_message', function(data) {
  addMessage(data.username, data.message);
});

// this runs when someone joins the chat
socket.on('user_joined', function(data) {
  document.getElementById('user-count').textContent = data.users;
  // only show the joined message if we already have a username
  // otherwise it shows before we have even entered our name
  if (username != '') {
    addSystemMessage('Someone joined the chat');
  }
});

// this runs when someone leaves the chat
socket.on('user_left', function(data) {
  document.getElementById('user-count').textContent = data.users;
  addSystemMessage('Someone left the chat');
});

// adds a normal chat message to the messages box
function addMessage(name, text) {
  var messages = document.getElementById('messages');

  var messageEl = document.createElement('article');
  messageEl.className = 'message';

  var nameEl = document.createElement('span');
  nameEl.className = 'name';
  nameEl.textContent = name + ':';

  var textEl = document.createElement('span');
  textEl.className = 'text';
  textEl.textContent = text;

  messageEl.appendChild(nameEl);
  messageEl.appendChild(textEl);
  messages.appendChild(messageEl);

  // scroll to the bottom so you always see the latest message
  messages.scrollTop = messages.scrollHeight;
}

// adds a system message like joined or left
function addSystemMessage(text) {
  var messages = document.getElementById('messages');

  var messageEl = document.createElement('p');
  messageEl.className = 'system-message';
  messageEl.textContent = text;

  messages.appendChild(messageEl);
  messages.scrollTop = messages.scrollHeight;
}

// allow pressing enter to join the chat
document.getElementById('username-input').addEventListener('keypress', function(e) {
  if (e.key == 'Enter') {
    joinChat();
  }
});