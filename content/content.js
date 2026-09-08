const LINKEDIN_PREFIX = "https://www.linkedin.com/in/";

document.addEventListener("paste", async (event) => {
  const pastedText =
    event.clipboardData?.getData("text/plain")?.trim();

  if (!pastedText) {
    return;
  }

  // Ignore normal non-LinkedIn pastes.
  if (!pastedText.startsWith(LINKEDIN_PREFIX)) {
    return;
  }

  // Block the original paste until we validate it.
  event.preventDefault();

  const { expectedLinkedIn } =
    await chrome.storage.local.get("expectedLinkedIn");

  if (!expectedLinkedIn) {
    showLinkedInWarning(
      "No LinkedIn profile configured",
      pastedText
    );

    return;
  }

  const expectedUrl =
    normalizeLinkedInUrl(expectedLinkedIn);

  const pastedUrl =
    normalizeLinkedInUrl(pastedText);

  // Wrong LinkedIn profile.
  if (expectedUrl !== pastedUrl) {
    showLinkedInWarning(
      expectedUrl,
      pastedUrl
    );

    return;
  }

  // Correct LinkedIn profile.
  insertText(event.target, pastedText);
});


function normalizeLinkedInUrl(url) {
  try {
    const parsed = new URL(url.trim());

    parsed.search = "";
    parsed.hash = "";

    return parsed.href.replace(/\/$/, "");
  } catch {
    return url.trim().replace(/\/$/, "");
  }
}


function insertText(element, text) {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    const start =
      element.selectionStart ?? element.value.length;

    const end =
      element.selectionEnd ?? element.value.length;

    element.setRangeText(
      text,
      start,
      end,
      "end"
    );

    element.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    return;
  }

  if (element.isContentEditable) {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);

    range.deleteContents();

    const textNode =
      document.createTextNode(text);

    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    element.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }
}