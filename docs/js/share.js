const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get('link');

const preview = document.getElementById('preview');
preview.setAttribute('data', link+'&preview=true');


const shareText = document.getElementById('link');
shareText.value = link;

function copyToClipboard() {
  // Get the text field
  let copyText = document.getElementById("link");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied link to clipboard: " + copyText.value);
}
