const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get('link');

const preview = document.getElementById('preview');
preview.setAttribute('data', link+'&preview=true');


const shareText = document.getElementById('link');
shareText.value = link;

function copyToClipboard() {
  const copyText = document.getElementById("link");
  const copyButton = document.querySelector('button[onclick="copyToClipboard()"]');

  if (!copyText || !copyButton) return;

  // Use the modern clipboard API
  navigator.clipboard.writeText(copyText.value).then(() => {
    // Provide non-blocking feedback
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000); // Revert back after 2 seconds
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}
