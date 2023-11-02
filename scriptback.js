console.log("ooky im running ss");
let last_url = ["", new Date().getMinutes()];

 chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  last_url[1]=new Date().getMinutes()
  if (
    changeInfo.status == "complete" &&
    tab.status == "complete" &&
    tab.url != undefined
  ) {
    console.log(tab.url);
    url_here=tab.url.split("&")[0];
    console.log(url_here+"====ssss");

    if (
      last_url[0] != url_here ||
      (last_url[0] == url_here && new Date().getMinutes() != last_url[1] )) {
      if (checkUrl(url_here)) {
        sendURL(tab.url);
        last_url[0] = url_here;
        console.log("sended");
      }
    } else {
      console.log("repeated ");
    }
  }
}); 
/* chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) {
        // Fires only when details.url === currentTab.url
        chrome.tabs.get(details.tabId, function(tab) {
            if(tab.url === details.url) {
                console.log("onHistoryStateUpdated"+tab.url);
            }
        });
    }
}); */
function checkUrl(url) {
  if (url != undefined || url != "") {
    var regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      // Do anything for being valid
      // if need to change the url to embed url then use below line
      return true;
    } else {
      return false;
    }
  }
}

function sendURL(URL) {
  fetch(`http://localhost:4000/download?URL=${URL}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((json) => console.log(json + " Sended to server "));
}
