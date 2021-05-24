const quiz = {
  tasks: ['obliekanie'],
  current: 'obliekanie', //zatial vopred definovany 
  stats: {}
};

// add taskt to quiz
function addTask(id, username, room) {
  //TODO
}

// Set current task
function setCurrentTask(name) {
  quiz.current = name;
}

// Get current task
function getCurrentTask() {
  return quiz.current;
}

//set stats
function setStats()



module.exports = {
  addTask,
  setCurrentTask,
  getCurrentTask,
  getRoomUsers,
  answerTask
};
