async function showLinkedInWarning(
    expectedLinkedIn,
    pastedLinkedIn
  ) {
    removeLinkedInWarning();
  
    const htmlUrl =
      chrome.runtime.getURL("content/modal.html");
  
    const response =
      await fetch(htmlUrl);
  
    const html =
      await response.text();
  
    const container =
      document.createElement("div");
  
    container.innerHTML = html;
  
    const overlay =
      container.firstElementChild;
  
    document.body.appendChild(overlay);
  
    const expectedElement =
      overlay.querySelector(
        "#linkedin-warning-expected"
      );
  
    const pastedElement =
      overlay.querySelector(
        "#linkedin-warning-pasted"
      );
  
    const closeButton =
      overlay.querySelector(
        "#linkedin-warning-close"
      );

    const copyButton =
      overlay.querySelector(
        "#linkedin-warning-copy"
    );
  
    // Use textContent so clipboard content
    // cannot inject HTML into the page.
    expectedElement.textContent =
      expectedLinkedIn;
  
    pastedElement.textContent =
      pastedLinkedIn;
  
  
    closeButton.addEventListener(
      "click",
      removeLinkedInWarning
    );
  
  
    overlay.addEventListener(
      "click",
      (event) => {
        if (event.target === overlay) {
          removeLinkedInWarning();
        }
      }
    );

    copyButton.addEventListener(
        "click",
        async () => {
          try {
            await navigator.clipboard.writeText(
              expectedLinkedIn
            );
      
            copyButton.textContent = "Copied!";
            copyButton.classList.add("copied");
      
            setTimeout(() => {
              copyButton.textContent = "Copy";
              copyButton.classList.remove("copied");
            }, 1500);
      
          } catch (error) {
            console.error(
              "Failed to copy LinkedIn URL:",
              error
            );
      
            copyButton.textContent = "Copy failed";
          }
        }
      );
  }
  
  
  function removeLinkedInWarning() {
    const existing =
      document.getElementById(
        "linkedin-paste-warning-overlay"
      );
  
    if (existing) {
      existing.remove();
    }
  }

