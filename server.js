const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const quiz_manager = require('./utils/quiz_manager');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  answerTask,
  getCountsTask
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let timer_default = 5;

//todo
// doplnit naplnanie roznych uloh
let task_list = [
  '02_obliekanie',
  '03_ktory_obrazok',
  '09_sietova_hra'
]

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Bebras bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    let user = userJoin(socket.id, username, room);

    socket.join(user.room);
    console.log('user joined server', user);

    // Welcome current user
    if(user.status != 'creator'){
      socket.emit('message', formatMessage(botName, 'Welcome to Bebras quiz! Please wait until your teacher starts the quiz.'));
    }
    else{
      socket.emit('message', formatMessage(botName, 'Welcome to Bebras quiz! As the first user, you manage the whole quiz. Have fun :)'));
      socket.emit('room_creator', quiz_manager(user));
    }

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the quiz`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  //starting quiz
  socket.on('startQuiz', (u) => {
    console.log('starting quiz');
    //console.log(u);

    //zatial napevno poradie, potom cele doplnat podla generovaneho quizu
    //1 - obliekanie
    let task = '02_obliekanie';
    let task_next = '03_ktory_obrazok';
    
    const user = getCurrentUser(socket.id);

    let timer = timer_default;
    let task_timer = 40;
    const interval = setInterval(function() {
        timer--;
        socket.broadcast
        .to(user.room)
        .emit(
          'quiz_start_transition',
            //todo - doplnit id quizu
            {user, timer, task, task_next}
        );
        if(timer <= 0){
          clearInterval(interval);
          socket.broadcast
          .to(user.room)
          .emit(
            'quiz_task_start',
              //todo - doplnit id tasku
              {user, task_timer}
          );
        }     
    }, 1000);    

  });

  //data = task name + solution
  socket.on('solveTask', (data) => {
    let user = getCurrentUser(socket.id);
    //console.log(user);
    answerTask(user.id, data.task, data.answer);
    user = getCurrentUser(socket.id);    
    if (user) {
      // Send users and room info
      io.to(user.room).emit('solutionUsers', getCountsTask(getRoomUsers(user.room), data.task, data.task_next));
    }
  });

  //data = task name + solution
  socket.on('nextTask', (data) => {
    
    console.log('starting next task '+data.nex_task);
    let task =  data.nex_task;
    //TODO get task list
    task_list = ['02_obliekanie', '03_ktory_obrazok', '09_sietova_hra'];

    let i = task_list[task_list.indexOf(task)];
    let task_next = null;
    if(i < task_list.length -1);
      task_next = task_list[task_list.indexOf(task) + 1];
    
    console.log(task_next);
    if(task_next !== null && task !== undefined){
      const user = getCurrentUser(socket.id);


      let timer = timer_default;
      let task_timer = 40;
      const interval = setInterval(function() {
          timer--;
          socket.broadcast
          .to(user.room)
          .emit(
            'quiz_start_transition',
              //todo - doplnit id quizu
              {user, timer, task, task_next}
          );
          if(timer <= 0){
            clearInterval(interval);
            socket.broadcast
            .to(user.room)
            .emit(
              'quiz_start_transition',
                //todo - doplnit id tasku
                {user, task_timer}
            );
          }     
      }, 1000);
    }
    else{
      // quiz is over
      const user = getCurrentUser(socket.id);
      console.log('current user');
      console.log(user);
      let export_result = false;
      if (user.status === 'creator'){
        export_result = true;
      }

      let users = getRoomUsers(user.room);
      console.log(users);
      //get stats
      socket
        .emit(
          'quiz_end',
            {users, export_result}
        );
    }

  });

  // Listen for chatMessage
  socket.on('quizMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the quiz`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
