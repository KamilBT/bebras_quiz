const users = [];

// Join user to quiz
function userJoin(id, username, room) {
  const user = { id, username, room };

  //check nuber of users
  const count = users.filter(item => item.room === room).length;
  if(count == 0){
    //1st user is room creator and can manage quiz
    user.status = 'creator';
  }
  user.quiz = {};
  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves quiz
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

//add task answr to user
function answerTask(id, task, answer){
  const index = users.findIndex(user => user.id === id);
  users[index].quiz[task] = answer;
}

function getCountsTask(users, task, nex_task){
  let none = 0;
  let wrong = 0;
  let correct = 0;
  let on_task = 0
  for(let i=0; i< users.length; i++){
    if(users[i].quiz.hasOwnProperty(task)){
      if(users[i].quiz[task] === 'x') none++;
      else if(users[i].quiz[task] === 'b') wrong++;
      else correct++;    
    }
    else{
      // task not yet completed and user is not admin
      if(!users[i].hasOwnProperty('status')){
        on_task++;
      }
    }
  }

  return {none, wrong, correct, on_task, nex_task};
}


module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  answerTask,
  getCountsTask,
};
