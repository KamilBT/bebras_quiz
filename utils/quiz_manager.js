
function quiz_manager(user) {
  return {
    user: user,
    message_form:
    `<form id="quiz-form">
      <input
        id="msg"
        type="text"
        placeholder="Enter Message"
        required
        autocomplete="off"
      />
      <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
    </form>`,
    manager_panel:
      `<h3><i class="fas fa-comments"></i> Quiz settings:</h3>
        <button class="btn with_icon" id="setup"><i class="fas fa-object-group"></i>Setup</button>
        <button class="btn with_icon" id="start_quiz"><i class="fas fa-play"></i> Start the quiz</button>`,
    setup_panel:
      `<h3><i class="fas fa-comments"></i> Quiz Setup:</h3>
      <div id="quiz-settings">
        <div class="form-control">
          <label for="username">Number of quiz tasks</label>
          <input
            type="number"
            name="count"
            id="count"
            placeholder="Enter number"
            required
          />
        </div>
  
        <button type="button" class="btn" id="setup_next">Next</button>
      </div>`,

  };
}

module.exports = quiz_manager;
