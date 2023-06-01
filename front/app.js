const divSelectUsers = document.querySelector('.div_select_users');
const divUser = document.querySelector('.div_user');
const divRooms = document.querySelector('.div_rooms');
const divChat = document.querySelector('.div_chat');
const domain = ('http://localhost:8000/api/');

let sn =  'sn' + Math.floor(Math.random() * 10000 + 1);


const socket = new WebSocket('ws://127.0.0.1:8000/ws/apps/'+ sn);
const chatSocket = new WebSocket('ws://localhost:8000/ws/chat/' + sn);

socket.onclose = async (event) => {
    console.error(event);
    // window.alert('Server offline');
    // console.log('Server offline');
};

socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log(data);


    if ('message' in data) {
        document.querySelector('#message').innerText = data.message;
    };

    if ('UserList' in data) {

        if (userLoggedId) {
            viewUserCard(userLoggedId);
        } else {
            console.log('текущий юзер не выбран');
            printUsers(data);
        };
    };

    if ('RoomList' in data) {

        if (userLoggedId) {
            printRooms(data);
        };
    };

    if ('MessageList' in data) {

        if (userLoggedId) {
            printChat(data);
        };
    };
};
document.querySelector('.create_users').addEventListener('click', () => {
    let name = document.getElementById("input_user");
    if (name.value !== "") {
        socket.send(JSON.stringify({'create_user': name.value}));
        console.log({'create_user': name.value});
        name.value = "";
    };
});

function printUsers(data) {
    delete data.UserList;
    let list = '';
    for (let key in data) {
        const newString = `<tr><td>${data[key]}</td>
        <td><button onclick="userLogged(${key})">выбрать</button></td>
        <td><button onclick="deleteUser(${key})">удалить</button></td>`;
        list = list + newString;
    };
    divSelectUsers.innerHTML = `<table> ${list}</table><br>`;
};


function deleteUser(id) {
    socket.send(JSON.stringify({'delete_user': id}));
    console.log({'delete_user': id});
};

function userLogged(userId) {
    // удалим уже ненужный div выбора юзера если он был выбран
    if (userLoggedId == undefined) {
        document.querySelector('.div_main').removeChild(document.querySelector('.div_start'));
    };
    userLoggedId = userId;
    viewUserCard(userId);
};

function viewUserCard(userId) {
    fetch(domain + 'users/' + userId +'/')
        .catch(err => console.log(err))
        .then(response => response.json())
        .then(result => printUserCard(result))
    socket.send(JSON.stringify({'load': 'rooms'}));
};

function printUserCard(item) {
    if (item.room == null) {
        room = "не выбрана";
    } else {
        let idRoom = item.room[item.room.length-2];
        room = listrooms[idRoom];
    };
    divUser.innerHTML = `
    <div class="div">
        <img src="${item.avatar}">
        <br>
        <strong>Сменить аватарку:</strong><br>
        <input id="avatar-input" type="file" accept="image/*"><br>
        <button onclick="editAvatar(${item.id})">отправить</button>
        <p>ID: ${item.id}</p>
        <p>Имя: ${item.name} <button onclick="changeUserName(${item.id})">изменить</button></p>
        <p>Комната в чате: ${room}</p>
        <h4 class="message" id="message"></h4>
    </div>
    `;
};

function printUserCard(item) {
    if (item.room == null) {
        room = "не выбрана";
    } else {
        let idRoom = item.room[item.room.length-2];
        room = listrooms[idRoom];
    };

    divUser.innerHTML = `
    <div class="div">
        <img src="${item.avatar}">
        <br>
        <strong>Сменить аватарку:</strong><br>
        <input id="avatar-input" type="file" accept="image/*"><br>
        <button onclick="editAvatar(${item.id})">отправить</button>
        <p>ID: ${item.id}</p>
        <p>Имя: ${item.name} <button onclick="changeUserName(${item.id})">изменить</button></p>
        <p>Комната в чате: ${room}</p>
        <h4 class="message" id="message"></h4>
    </div>
    `;
};

async function editAvatar(userId) {
    const formData = new FormData();
    let fileField = document.querySelector('#avatar-input');
    if (fileField.files[0]) {
        formData.append('avatar', fileField.files[0]);
        formData.append('avatar_small', fileField.files[0]);
        try {
            const response = await fetch(domain + 'users/' + userId +'/', {
                method: 'PATCH',
                body: formData
            });
            const result = await response.json();
            console.log('Фото юзера сохранено:', JSON.stringify(result));
        } catch (error) {
            console.log('Все пропало!!!');
            console.error('Ошибка:', error);
        }
        viewUserCard(userId);
    } else {
        console.log('Файл не выбран!');
        document.querySelector('#message').innerText = '!!! файл не выбран';
    };
};

function changeUserName(userId) {
    let name = prompt('Введите новое имя');
    socket.send(JSON.stringify({'order': 'changeUserName', 'id': userId, 'name': name }));
    console.log('Отправлен запрос на сервер изменить имя на:', name);
};


function printRooms(data) {
    delete data.RoomList;
    let list = '';
    for (let key in data) {
        const newString = `<tr><td><b>${data[key]}</b></td>
        <td><button onclick="deleteRoom(${key})">удалить</button></td>
        <td><button onclick="editRoom(${key})">изменить</button></td>
        <td><button onclick="selectRoom(${key})">подключиться</button></td></tr>`;
        list = list + newString;
    };
    list = '<table>' + list + '</table><br>'
    list = list + `<input type="text" id="input_room" name="name_new_room" size="22" placeholder="Введите имя новой комнаты"><br>`
    list = list + `<button class="btn btn_new_room">Создать комнату</button>`
    divRooms.innerHTML = list;


    document.querySelector('.btn_new_room').addEventListener('click', () => {
        let name = document.getElementById("input_room");
        if (name.value !== "") {
            socket.send(JSON.stringify({'create_room': name.value}));
            console.log({'create_room': name.value});
            name.value = "";
        };
    });
};


function deleteRoom(id) {
    socket.send(JSON.stringify({'delete_room': id}));
    console.log({'delete_room': id});
}


function editRoom(id) {
    let name = prompt('Введите новое имя комнаты');
    socket.send(JSON.stringify({'order': 'changeRoomName', 'id': id, 'name': name }));
    console.log('Отправлен запрос на сервер изменить имя комнаты на:', name);
};

// Рисуем модуль чата
function printChat(data) {
    divChat.innerHTML = `<h3 style="text-align: center;">Комната: ${data['MessageList']}</h3>
    <textarea class="textarea" name="textarea"></textarea><br>
    <input type="text" id="input_message" name="input_message" size="22" placeholder="Введите сообщение"><br>
    <button class="btn btn_message">Отправить</button>`;
    delete data.MessageList;
    let textarea = document.querySelector('.textarea');

    for (let messageElement in data) {
        for (let key in data[messageElement]) {
            let newString = `${key}: ${data[messageElement][key]}\n`;
            textarea.value += newString;
        };
    };


    document.querySelector('.btn_message').addEventListener('click', () => {
        let message = document.getElementById("input_message");
        if (message.value !== "") {
            chatSocket.send(JSON.stringify({'usersendcommandroom': 'message', 'room_id': currentRoom, 'userid': userLoggedId, 'message': message.value}));
            console.log({'usersendcommandroom': 'message', 'room_id': currentRoom, 'user': userLoggedId, 'message': message.value});
            message.value = "";
        };
    });


    chatSocket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        console.log(data);
        textarea.value += `${data['name']}: ${data['message']}\n`;
    };
};

    function selectRoom(id) {

        socket.send(JSON.stringify({'load': 'messageList', 'newroom_id': id}));
        console.log({'load': 'messageList', 'newroom_id': id});

        chatSocket.send(JSON.stringify({'usersendcommandroom': 'roomselect', 'newroom_id': id, 'oldroom_id': currentRoom}));
        currentRoom = id;
    };
