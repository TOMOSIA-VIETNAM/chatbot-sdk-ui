(function () {
  // Get the script tag
  const scriptTag = document.currentScript;
  const domain = scriptTag.getAttribute("domain");

  // Validate inputs
  if (!domain) {
    console.error("Missing projectId or domain attribute.");
    return;
  }

  // Create the style element
  const style = document.createElement("style");
  style.innerHTML = `
    .hide-bubble {
      display: none;
    }

    @media (max-width: 768px) {
      .chat-bubble-window {
        width: 100%!important;
        height: 100dvh!important;
        max-height: 100%!important;
        right: 0!important;
        top: 0!important;
        border-radius: unset!important;
      }

      .visible-icon-button {
        display: block!important;
      }
    }
  `;
  document.head.appendChild(style);

  // Create chat widget container
  const chatInterfaceContainer = document.createElement("div");
  document.body.appendChild(chatInterfaceContainer);

  // Inject the chat widget and button bubble HTML
  chatInterfaceContainer.innerHTML = `
    <button type="button" id="chatBubbleButton" aria-label="chat-button" style="position: fixed; border: 0; bottom: 1rem; right: 1rem; width: 55px; height: 55px; border-radius: 27.5px; background-color: rgb(0, 0, 0); box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px; cursor: pointer; z-index: 100; transition: 0.2s ease-in-out;">
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 100;">
        <svg id="chatBubbleOpenIcon" width="55" height="55" viewBox="0 0 1120 1120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M252 434C252 372.144 302.144 322 364 322H770C831.856 322 882 372.144 882 434V614.459L804.595 585.816C802.551 585.06 800.94 583.449 800.184 581.405L763.003 480.924C760.597 474.424 751.403 474.424 748.997 480.924L711.816 581.405C711.06 583.449 709.449 585.06 707.405 585.816L606.924 622.997C600.424 625.403 600.424 634.597 606.924 637.003L707.405 674.184C709.449 674.94 711.06 676.551 711.816 678.595L740.459 756H629.927C629.648 756.476 629.337 756.945 628.993 757.404L578.197 825.082C572.597 832.543 561.403 832.543 555.803 825.082L505.007 757.404C504.663 756.945 504.352 756.476 504.073 756H364C302.144 756 252 705.856 252 644V434ZM633.501 471.462C632.299 468.212 627.701 468.212 626.499 471.462L619.252 491.046C618.874 492.068 618.068 492.874 617.046 493.252L597.462 500.499C594.212 501.701 594.212 506.299 597.462 507.501L617.046 514.748C618.068 515.126 618.874 515.932 619.252 516.954L626.499 536.538C627.701 539.788 632.299 539.788 633.501 536.538L640.748 516.954C641.126 515.932 641.932 515.126 642.954 514.748L662.538 507.501C665.788 506.299 665.788 501.701 662.538 500.499L642.954 493.252C641.932 492.874 641.126 492.068 640.748 491.046L633.501 471.462Z" fill="white"></path>
          <path d="M771.545 755.99C832.175 755.17 881.17 706.175 881.99 645.545L804.595 674.184C802.551 674.94 800.94 676.551 800.184 678.595L771.545 755.99Z" fill="white"></path>
        </svg>
        <svg id="chatBubbleCloseIcon" class="hide-bubble" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="white" width="24" height="24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
        </svg>
      </div>
    </button>
    <div id="chatBubbleWindow" class="hide-bubble chat-bubble-window" style="border: none; position: fixed; flex-direction: column; justify-content: space-between; box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px; bottom: 5rem; right: 1rem; width: 448px; height: 85dvh; max-height: 824px; border-radius: 0.75rem; z-index: 100; overflow: hidden; background-color: white;">
      <button id="xIconButton" class="visible-icon-button" style="display: none; background: transparent; position: fixed; color: gray; border: 0; top: 1rem; right: 1rem; cursor: pointer; z-index: 1000; transition: 0.2s ease-in-out;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-full w-full p-1"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
      </button>
    </div>`;

  // Get the elements
  const chatBubble = document.getElementById("chatBubbleButton");
  const chatBubbleOpenIcon = document.getElementById("chatBubbleOpenIcon");
  const chatBubbleCloseIcon = document.getElementById("chatBubbleCloseIcon");
  const chatBubbleWindow = document.getElementById("chatBubbleWindow");
  const xIconButton = document.getElementById("xIconButton");

  // Inject the iframe
  const iframe = document.createElement("iframe");
  iframe.style = `
    height: 100%; width: 100%; border: none; display: block;
  `;
  iframe.src = `${domain}`;
  iframe.title = "Chat Interface";
  chatBubbleWindow.appendChild(iframe);

  // Toggle the chat bubble
  function toggleVisibility() {
    chatBubbleOpenIcon.classList.toggle("hide-bubble");
    chatBubbleCloseIcon.classList.toggle("hide-bubble");
    chatBubbleWindow.classList.toggle("hide-bubble");
  }

  // Add event listeners
  chatBubble.addEventListener("click", toggleVisibility);
  xIconButton.addEventListener("click", toggleVisibility);
})();


