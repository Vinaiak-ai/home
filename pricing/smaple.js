let answer = null;

// Event listener for send button
document.getElementById("sendButton").addEventListener("click", async () => {
  const userInput = document.getElementById("userInput").value;

  if (userInput.trim() !== "") {
    // Add user's message to chat
    addMessage(userInput, "user-message");

    // Get response from API
    const response = await getBotResponse(userInput);
    if (response) {
      addMessage(response, "bot-message");
    }
  }
});

async function getBotResponse(query) {
  try {
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        "6Lffi5YqAAAAADnWze7vgQJf6VTa908gS0v5lLhu",
        { action: "LOGIN" }
      );
      const response = await fetch("https://api.vinaiak.com/demo/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sysprompt: "Reply How are you on Hi",
          query,
          token,
        }),
      });
      const data = await response.text();
      answer = data;
    });
    return answer;
  } catch (error) {
    console.error("Error fetching bot response:", error);
    return "Sorry, something went wrong.";
  }
}

// Function to add a message to the chat
function addMessage(text, type) {
  const chatMessages = document.querySelector(".chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);
  messageElement.innerHTML = `
    <div class="${type === "bot-message" ? "bot-avatar" : ""}">
      ${
        type === "bot-message"
          ? '<img src="assets/bot-avatar.png" alt="Bot Avatar">'
          : ""
      }
    </div>
    <div class="${type === "bot-message" ? "bot-text" : "user-text"}">${text}</div>
  `;
  chatMessages.appendChild(messageElement);

  // Scroll to the bottom of the chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
