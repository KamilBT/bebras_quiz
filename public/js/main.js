const quizSpace = document.querySelector('.quiz-space');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join quizroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// add manager html if user is quiz manager
socket.on('room_creator', (data) => {
  //console.log(data);
  
  let m_message = document.getElementById('admin_messages');
  m_message.innerHTML = data.message_form;
  let m_panel = document.getElementById('manager-panel');
  m_panel.innerHTML = data.manager_panel;
  let m_setup = document.getElementById('quiz-setup');
  m_setup.innerHTML = data.setup_panel;


  //show message pane
  const quizForm = document.getElementById('quiz-form');
  // Message submit
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();
    console.log(msg);
    if (!msg) {
      return false;
    }

    // Emit message to server
    socket.emit('quizMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });

  //show setup section
  $('#setup').on('click', function(){
    $('#quiz-setup').toggleClass('active');
  });
  //show list of tasks
  $('#setup_next').on('click', function(){
    console.log('get next');
  });

  //start quiz
  $('#start_quiz').on('click', function(){
    let u = data.user;
    socket.emit('startQuiz', { u });
  });
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  quizSpace.scrollTop = quizSpace.scrollHeight;
});

//starting quiz transition
socket.on('quiz_start_transition', (data) => {

  let m = $('#start_quiz').length;
  //hide stats if open
  $('#quiz_status').removeClass('active');
  $('#quiz_transition_start').addClass('active');
  $('#quiz_transition_start .timer').html(data.timer);
  if(data.timer === 0){
    if(m === 0) $('#quiz_task').addClass('active');
    $('#solve').on('click', function(){
      console.log(data);  
      let task = data.task;
      let task_next = data.task_next;
      let answer = localStorage.getItem(data.task);
      socket.emit('solveTask', {task, answer, task_next});
      $('#quiz_status').addClass('active');
      //hide task
      $('#quiz_task').removeClass('active');   

      $('#task_name').html(data.task);
      switch(answer){
        case 'x':         
          $("#my_answer").addClass('bg-black');
          $("#my_answer").html('None');
          break;
        case 'b':
          $("#my_answer").addClass('bg-red');
          $("#my_answer").html('Wrong');
          break;
        case 'a':
          $("#my_answer").addClass('bg-green');
          $("#my_answer").html('Correct');
          break;
      }
      $('#solve').off('click');
      
    });
  }
});




// update Quiz status after users submit solution (stats for all)
socket.on('solutionUsers', (data) => {
  console.log(data);
  $("#correct_count").html(data.correct);
  $("#wrong_count").html(data.wrong);
  $("#none_count").html(data.none);
  $("#on_task").html(data.on_task);
  if(data.on_task === 0){
    //get next task
    let nex_task = data.nex_task;
    $('#quiz_task_frame').attr('src', './task/'+nex_task);
    socket.emit('nextTask', {room, nex_task});
  }
});

function updateQuizStatus(task, answer){
  console.log(task, answer);
  $('#solution_img').html(task);

}

//QUIZ END
socket.on('quiz_end', (data) => {

  console.log('quiz_end');
  console.log(data);

  let stats = {};
  for(let i=0; i<data.users.length; i++){
    if(!data.users[i].hasOwnProperty('status')){
      for (const [key, value] of Object.entries(data.users[i].quiz)) {
        //console.log(`${key}: ${value}`);
        if (!stats.hasOwnProperty(key)) stats[key] = {};
        
        if (!stats[key].hasOwnProperty(value)) stats[key][value] = 1;
        else stats[key][value]++;
        
      }
    }
  }
  console.log(stats);

  $('#quiz_transition_start').removeClass('active');
  $('#quiz_status').removeClass('active');
  if(data.export_result === true){
    //screen for quiz admins
    $('#quiz_export').addClass('active');
  
      var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats));
      var a = document.createElement('a');
      a.href = 'data:' + data;
      a.download = 'quiz.json';
      a.innerHTML = 'download JSON';
      var container = document.getElementById('quiz_export');
      container.appendChild(a);
  
  }
  else{
    //screen for quiz solvers
    $('#quiz_end').addClass('active');
  } 

});


// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.quiz-space').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave quiz room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the quiz?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
