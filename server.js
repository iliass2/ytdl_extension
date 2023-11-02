const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const fs = require("fs");
const app = express();

//app start
app.use(cors());
app.listen(4000, () => {
  console.log("Server Works !!! At port 4000");
});

//routes

app.get("/getSongs", async (req, res) => {
  const path = require("path");
  const fs = require("fs");
  var URL = req.query.URL;

  //joining path of directory
  //passsing directoryPath and callback function
  var files = fs.readdirSync("music");
  let info = await ytdl.getBasicInfo(URL).then((value) => {
    res.json({ lenghth: files.length, title: value.videoDetails.title });
    console.log("sending songs");
  });
});

app.get("/downloadClick", async (req, res) => {
  var URL = req.query.URL;
  var extension = req.query.Extension;
  var title = req.query.title;
  if (!check_downloads(req.query.title, extension)) {
    console.log("donwload by click " + title + " and exten is " + extension);
    ytdl(URL, {
      filter: extension == "mp3" ? "audioonly" : "audioandvideo",
    }).pipe(
      fs
        .createWriteStream("./music/" + title + "." + extension)
        .on("finish", () => {
          console.log("donwloading complete");
          deleteLineFromFile("Youtube_music_history.txt", URL.split("&")[0]);
        })
    );
  }
});

app.get("/download", async (req, res) => {
  var URL = req.query.URL;
  let info = await ytdl.getBasicInfo(URL).then((value) => {
    //check if its music
    if (value.videoDetails.category != "Music") {
      return console.log("Not music");
    } else if (check_downloads(value.videoDetails.title))
      return console.log("already downloaded");
    else {
      saveUrl(URL).then(() => {
        if (check_playlist(URL)) {
          Download_video(value, URL);
        } else {
          return console.log("not listened enough times");
        }
      });

      /* if (!check_playlist(URL)) {
      saveUrl(URL);
    } else if (check_downloads(URL)) {
      console.log("downloading " + value.videoDetails.title);
      Download_video(value, URL);
    } else {
      return console.log("not listened enough times");
     */
    }
  });

  /* funcionelle 
  ytdl(URL,{filter:"audioonly"})
  .pipe(res); */
});

//functions

function Download_video(value, URL) {
  filename = value.videoDetails.title.replace(/[/\\?%*:|"<>]/g, "-");

  console.log(value.videoDetails.category + "and" + value.videoDetails.title);
  if (value.videoDetails.category === "Music") {
    ytdl(URL, { filter: "audioonly" }).pipe(
      fs.createWriteStream("./music/" + filename + ".mp3").on("finish", () => {
        console.log("donwloading complete");
        deleteLineFromFile("Youtube_music_history.txt", URL);
      })
    );
  }
}

// clean text file

function deleteLineFromFile(filePath, lineToDelete) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split("\n");
    const filteredLines = lines.filter((line) => line !== lineToDelete);

    const updatedContent = filteredLines.join("\n");

    fs.writeFile(filePath, updatedContent, "utf8", (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Deleted line: ${lineToDelete}`);
    });
  });
}

// checkers
function check_playlist(URL) {
  const nReadlines = require("n-readlines");
  const broadbandLines = new nReadlines("Youtube_music_history.txt");
  let line;
  let lineNumber = 1;
  let Music_Compt = 0;

  while ((line = broadbandLines.next())) {
    //check if is needed to download
    if (Music_Compt >= 2) {
      console.log("Exit Here because compt is " + Music_Compt);
      break;
    }
    //show URLS Lines

    //Urls Compt
    if (line.toString("ascii") == URL) {
      Music_Compt++;
    }
    lineNumber++;
  }
  return Music_Compt >= 2;
}

function check_downloads(music_name_bef, extension = "mp3") {
  music_name = music_name_bef.replace(/[/\\?%*:|"<>]/g, "-");

  //get files
  const path = require("path");
  const fs = require("fs");
  //joining path of directory
  var exist = false;
  //passsing directoryPath and callback function
  var files = fs.readdirSync("music");
  files.every((file) => {
    if (music_name + "." + extension == file) {
      exist = true;
      return false;
    }

    return true;
  });
  return exist;
}

// url save
async function saveUrl(URL) {
  await fs.appendFile("Youtube_music_history.txt", URL + "\n", function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
}
