
function updatePreview() {
  const preview = document.getElementById('preview');
  preview.setAttribute('data', getLink()+'&preview=true');
}

function getLink() {
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const offset = document.getElementById('timezone-offset').value;
  const image = document.getElementById('image').value;
  const font = document.getElementById('font').value;
  const effect = document.getElementById('effect').value;

  let cleanOffset = offset
  // if offset matches pattern +/-HH:MM
  if (!offset.match(/^[+-]\d{2}:\d{2}$/)) {
    console.log('offset does not match pattern')
    cleanOffset = ""
  } else {
    cleanOffset = offset.replace("+", "%2B").replace(":", "%3A")
  }

  const link = `countdown.html?title=${title}&date=${date}${cleanOffset}&image=${image}&font=${font}&effect=${effect}`;
  return link;
}

function openCountdown() {
  const link = getLink();
  window.open(link, '_blank');
  return false;
}

function setImage(img) {
  img = img.substring(img.lastIndexOf("/")+1)
  img = img.substring(0,img.lastIndexOf("."))
  document.getElementById('image').value = img;
  updatePreview();
}

function log(x) {
  if (window.location.href.includes('localhost')) {
    console.log(x);
  }
}
