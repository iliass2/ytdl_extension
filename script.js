window.addEventListener("load", function () {
  getCurrentTab().then((value) => {
    url = value;
    if (validateYouTubeUrl(url)) {
      get_songs(url);
    }
  });
  button_event();
});

let url;
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  document.getElementById("URL").value = tab.url;
  return tab.url;
}
function getCurrentURL() {
  return window.location.href;
}
function button_event() {
  let button = this.document.getElementById("download");
  button.addEventListener("click", () => {
    button.innerHTML = "kkk";
    sendURL(url);
  });
}

function sendURL(URL) {
  fetch(`http://localhost:4000/download?URL=${URL}&now=true`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}
function get_songs(URL) {
  console.log("ooky decllached");
  fetch(`http://localhost:4000/getSongs?URL=${URL}`, {
    method: "GET",
  }).then((res) => {
    res.json().then((result) => {
      console.log(result["title"]);
      let title = result["title"];
      title = title.replace(/[/\\?%*:|"<>]/g, "-");
      document.getElementById("songs").innerHTML = result["lenghth"];
      document.getElementById("title").value = title;
    });
  });
}
function validateYouTubeUrl(url) {
  if (url != undefined || url != "") {
    var regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return true;
    } else {
      return false;
    }
  }
}
