(function () {
  // Add event listeners
  const chatInput = document.getElementById("chat-input");
  const chatSubmit = document.getElementById("chat-submit");
  const chatMessages = document.getElementById("chat-messages");
  const btnStart = document.getElementById("btn-start");
  //get project id
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const projectId = urlParams.get("projectId");
  const API_URL = `${window.location.origin}/api/v1/chat-stream`;
  const API_GUEST_USER_URL = `${window.location.origin}/api/v1/guest-users`;
  var histories = [];

  // Get uuid local storage
  const uuidGuestUser = localStorage.getItem("uuid_guest_user_chat");

  //get chat interface
  const chatbotName = document.getElementById("chatbot_name");
  const chatbotAvatar = document.getElementById("chatbot_avatar");
  const chatHeader = document.getElementById("chat-header");
  const chatInitial = document.getElementById("chat_initial");
  const suggestMessage = document.getElementById("suggest_mess");
  const brand = document.getElementById("brand");
  const API_CHAT_INTERFACE = `${window.location.origin}/api/v1/chat_interface/${projectId}`;
  const loadingScreen = document.getElementById("loading-screen");
  const chatInputContainer = document.getElementById("chat-input-container");
  const formStart = document.getElementById("form-start");
  const showChat = document.getElementById("show-chat");
  const formChat = document.getElementById("form-chat");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", API_CHAT_INTERFACE, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var chatInterface = JSON.parse(xhr.responseText);

      if (chatInterface) {
        //Start guest user chat
        const flagCollectInformation =
          chatInterface.data?.project?.flag_collect_information ?? 1;
        loadingScreen.style.display = "none";
        if (flagCollectInformation === 1 && uuidGuestUser === null) {
          // Open collect user information
          formStart.style.display = "block";
          chatMessages.style.display = "none";
          chatInputContainer.style.display = "none";
          formStart.style.display = "block";
          if (showChat) showChat.style.display = "none";
          if (formChat) formChat.style.display = "none";
        } else {
          formStart.style.display = "none";
          chatMessages.style.display = "block";
          chatInputContainer.style.display = "block";
          if (showChat) showChat.style.display = "block";
          if (formChat) formChat.style.display = "block";
        }
        //Chatbot name
        if (chatInterface.data.chatbot_name) {
        }
        //avatar
        if (chatInterface.data.chatbot_picture) {
          chatbotAvatar.src = `${window.location.origin}/${chatInterface.data.chatbot_picture}`;
          if (chatInterface.data.chatbot_picture_active == 0) {
            chatbotAvatar.style.display = "block";
          }
        }
        //Chatbot color
        if (chatInterface.data.theme_color) {
          chatHeader.style.backgroundColor = chatInterface.data.theme_color;
          const backgroundColor = getComputedStyle(chatHeader).backgroundColor;
          const rgb = backgroundColor.match(/\d+/g);
          const brightness =
            (parseInt(rgb[0]) * 299 +
              parseInt(rgb[1]) * 587 +
              parseInt(rgb[2]) * 114) /
            1000;
          if (brightness < 128) {
            chatbotName.style.color = "#fff";
          } else {
            chatbotName.style.color = "#000000";
          }
        }
        //Chatbot initial message
        if (chatInterface.data.initial_message) {
          chatInitial.innerHTML = chatInterface.data.initial_message;
        }
        //Chatbot suggest message
        if (chatInterface.data.suggest_message) {
          const currentValue = chatInterface.data.suggest_message;
          contentArray = currentValue.split("\n");
          suggestMessage.innerHTML = "";
          contentArray.forEach((content, index) => {
            if (content !== "") {
              const buttonSuggest = document.createElement("button");
              buttonSuggest.setAttribute("type", "button");
              buttonSuggest.classList =
                "rounded-xl border-0 whitespace-nowrap mx-1 mt-1 py-2 px-3 text-sm text-nowrap bg-gray-50 hover:bg-gray-200";
              buttonSuggest.textContent = content;
              buttonSuggest.addEventListener("click", function () {
                suggestFunction(content);
              });
              suggestMessage.appendChild(buttonSuggest);
            }
          });
        } else {
          suggestMessage.style.display = "none";
        }

        //Brand name and link
        if (
          chatInterface.hasOwnProperty("data") &&
          JSON.stringify(chatInterface.data) !== "{}"
        ) {
          if (chatInterface.data.brand_name) {
            brand.innerHTML = chatInterface.data.brand_name;
            brand.href = "https://#";
            if (
              chatInterface.data.brand_link &&
              chatInterface.data.brand_link.trim() !== ""
            ) {
              brand.href = chatInterface.data.brand_link;
            }
          } else {
            brand.parentNode.style.display = "none";
          }
        }
      }
    } else {
      console.error("Request failed with status: " + xhr.status);
    }
  };

  xhr.onerror = function () {
    console.error("Network error occurred");
  };
  xhr.send();

  function suggestFunction(content) {
    onUserRequest(content);
  }

  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function toggleErrorMessage(display) {
    const errorEmail = document.getElementById("error-email");
    errorEmail.style.display = display ? "block" : "none";
  }

  btnStart.addEventListener("click", function () {
    event.preventDefault();
    document.getElementById("error-email").display = "none";
    const inputLastName = document.getElementById("input-last-name").value;
    const inputFirstName = document.getElementById("input-first-name").value;
    const inputEmail = document.getElementById("input-email").value;

    if (inputEmail && inputEmail.trim() !== "") {
      if (!validateEmail(inputEmail)) {
        toggleErrorMessage(true);
        return;
      } else {
        toggleErrorMessage(false);
      }
    }

    sendInfoGuestUser(inputLastName, inputFirstName, inputEmail).then(
      (success) => {
        if (success) {
          document.getElementById("chat-messages").style.display = "block";
          document.getElementById("chat-input-container").style.display =
            "block";
          document.getElementById("form-start").style.display = "none";
          document.getElementById("show-chat").style.display = "block";
          document.getElementById("form-chat").style.display = "block";
        }
      }
    );
  });

  function sendInfoGuestUser(inpLastName, inpFirstName, inpEmail) {
    const userData = {
      project_id: projectId,
      last_name: inpLastName,
      first_name: inpFirstName,
      email_address: inpEmail,
      integrate: 4,
    };

    return new Promise((resolve, reject) => {
      fetch(API_GUEST_USER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (response.ok) {
            resolve(true);
            return response.json();
          }
        })
        .then((dataResponse) => {
          localStorage.setItem("uuid_guest_user_chat", dataResponse.data.uuid);
        })
        .catch((error) => {
          reject(false);
        });
    });
  }

  chatSubmit.addEventListener("click", function () {
    const message = chatInput.value.trim();
    if (!message) return;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = "";
    onUserRequest(message);
  });

  chatInput.addEventListener("keydown", function (event) {
    if (event.keyCode == 13 && !event.shiftKey) {
      chatSubmit.click();
    }
  });

  async function onUserRequest(message) {
    if (chatSubmit.disabled == true) {
      return;
    }
    chatSubmit.disabled = true;
    // Handle user request here
    const chatMessages = document.getElementById("chat-messages");
    // Display user message
    const messageElement = document.createElement("div");
    messageElement.className = "flex justify-end mb-3";
    messageElement.innerHTML = `
        <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]" style="background-color: rgb(111, 68, 252); color: white;">
          ${message}
        </div>
      `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = "";

    const replyElement = document.createElement("div");
    replyElement.className = "flex mb-3";
    replyElement.innerHTML = `
        <div class="reply text-black rounded-lg py-2 px-4 max-w-[70%] typing">
          <span></span>
          <span></span>
          <span></span>
        </div>`;

    chatMessages.appendChild(replyElement);

    // Create a new AbortController instance
    controller = new AbortController();
    const signal = controller.signal;
    try {
      // Fetch the response from the OpenAI API with the signal from AbortController
      const response = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          question: message,
          histories: histories.slice(-6),
          uuid_guest_user: uuidGuestUser,
        }),
        signal, // Pass the signal to the fetch request
      });

      // Read the response as a stream of data
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      // replyElement.innerText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        // Massage and parse the chunk of data
        const content = decoder.decode(value);
        replyElement
          .getElementsByTagName("div")[0]
          .classList.add("bg-gray-200");
        replyElement.getElementsByTagName("div")[0].innerText += content;
        answer = replyElement.getElementsByTagName("div")[0].innerText;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      histories.push(
        {
          role: "user",
          content: message,
        },
        {
          role: "assistant",
          content: answer,
        }
      );
      chatSubmit.disabled = false;
    } catch (error) {
      // Handle fetch request errors
      if (signal.aborted) {
        replyElement.innerText = "Request aborted.";
      } else {
        replyElement.innerText = "Error occurred while generating.";
        return true;
      }
      chatSubmit.disabled = false;
    } finally {
      chatSubmit.disabled = false;
      // Enable the generate button and disable the stop button
      controller = null; // Reset the AbortController instance
    }
  }
})();
