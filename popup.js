const input = document.getElementById("linkedinUrl");
const status = document.getElementById("status");

chrome.storage.local
  .get("expectedLinkedIn")
  .then(({ expectedLinkedIn }) => {

    if (expectedLinkedIn) {
      input.value = expectedLinkedIn;
    }

  });


document
  .getElementById("save")
  .addEventListener("click", async () => {

    const url = input.value.trim();

    await chrome.storage.local.set({
      expectedLinkedIn: url
    });

    status.textContent = "✓ Profile saved";

  });