const messageInput = document.getElementById("messageInput");
const sendButton = document.querySelector(".send-button");
const chatArea = document.querySelector(".chat-area");
const newChatButton = document.querySelector(".new-chat");


// ======================================
// VARIABLES
// ======================================

let currentConversation = [];


// ======================================
// SEND MESSAGE
// ======================================

sendButton.addEventListener("click", sendMessage);


messageInput.addEventListener("keydown", function(event) {

  if (event.key === "Enter" && !event.shiftKey) {

    event.preventDefault();

    sendMessage();

  }

});


function sendMessage() {

  const message = messageInput.value.trim();

  if (message === "") {
    return;
  }


  // Remove welcome screen
  const welcome = document.querySelector(".welcome");

  if (welcome) {
    welcome.remove();
  }


  // Save user message
  currentConversation.push({
    sender: "You",
    text: message
  });


  // Display user message
  displayMessage("You", message);


  // Clear input
  messageInput.value = "";


  // Temporary NARS response
  setTimeout(function() {

    const response =
      "Thank you for your question. NARS is currently being prepared to provide medication safety information.";


    // Save NARS response
    currentConversation.push({
      sender: "NARS",
      text: response
    });


    // Display NARS response
    displayMessage("NARS", response);


    // Save conversation
    saveConversation();


  }, 600);

}


// ======================================
// DISPLAY MESSAGE
// ======================================

function displayMessage(sender, text) {

  const message = document.createElement("div");

  message.classList.add(
    "message",
    sender === "You" ? "user-message" : "nars-message"
  );


  message.innerHTML = `
    <div class="message-label">${sender}</div>
    <div class="message-text">${text}</div>
  `;


  chatArea.appendChild(message);


  chatArea.scrollTop = chatArea.scrollHeight;

}


// ======================================
// SAVE CONVERSATION
// ======================================

function saveConversation() {

  if (currentConversation.length === 0) {
    return;
  }


  let conversations =
    JSON.parse(localStorage.getItem("narsConversations")) || [];


  const title = currentConversation[0].text;


  conversations.unshift({
    title: title,
    messages: currentConversation
  });


  // Keep only the 10 most recent conversations
  conversations = conversations.slice(0, 10);


  localStorage.setItem(
    "narsConversations",
    JSON.stringify(conversations)
  );


  displayRecentConversations();

}


// ======================================
// DISPLAY RECENT CONVERSATIONS
// ======================================

function displayRecentConversations() {

  const historyContainer =
    document.querySelector(".chat-history");


  // Remove existing history items
  const oldItems =
    historyContainer.querySelectorAll(".history-item");


  oldItems.forEach(function(item) {
    item.remove();
  });


  const conversations =
    JSON.parse(localStorage.getItem("narsConversations")) || [];


  conversations.forEach(function(conversation, index) {

    const button =
      document.createElement("button");


    button.classList.add("history-item");


    // Limit title length
    let title = conversation.title;

    if (title.length > 30) {
      title = title.substring(0, 30) + "...";
    }


    button.textContent = title;


    button.addEventListener("click", function() {

      loadConversation(index);

    });


    historyContainer.appendChild(button);

  });

}


// ======================================
// LOAD CONVERSATION
// ======================================

function loadConversation(index) {

  const conversations =
    JSON.parse(localStorage.getItem("narsConversations")) || [];


  const conversation =
    conversations[index];


  if (!conversation) {
    return;
  }


  // Remove current messages
  const messages =
    chatArea.querySelectorAll(".message");


  messages.forEach(function(message) {
    message.remove();
  });


  // Remove welcome screen
  const welcome =
    document.querySelector(".welcome");


  if (welcome) {
    welcome.remove();
  }


  // Load selected conversation
  currentConversation =
    conversation.messages;


  currentConversation.forEach(function(message) {

    displayMessage(
      message.sender,
      message.text
    );

  });

}


// ======================================
// NEW CHAT
// ======================================

newChatButton.addEventListener("click", function() {

  // Clear current conversation
  currentConversation = [];


  // Remove messages
  const messages =
    chatArea.querySelectorAll(".message");


  messages.forEach(function(message) {
    message.remove();
  });


  // Clear input
  messageInput.value = "";


  // Add welcome screen
  const welcome =
    document.createElement("div");


  welcome.classList.add("welcome");


  welcome.innerHTML = `
    <div class="logo">
      N
    </div>

    <h1>How can I help you today?</h1>

    <p>
      Ask NARS about medication safety and responsible
      self-medication practices.
    </p>
  `;


  chatArea.appendChild(welcome);

});


// ======================================
// LOAD RECENT CHATS WHEN PAGE OPENS
// ======================================

displayRecentConversations();