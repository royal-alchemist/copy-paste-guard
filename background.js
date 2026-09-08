chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "CLICK_TARGET_BUTTON") {
      const button = document.querySelector("#showApplyForm");
  
      if (button) {
        button.click();
      } else {
        console.log("Target button not found");
      }
    }
  });