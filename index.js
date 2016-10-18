var express = require('express');
var app = express();

var mappings = {}; // {3842: "https://google.com"}

var next = 1202;
function getNext() {
  next++;
  return next;
}

app.all("*", function(req, res){
  if (req.path === "/" || req.path === "/index.html") {
    res.sendFile(__dirname + "/index.html");
  } else if (req.path.substring(0, 5) === "/new/") {
    // new link
    var link = req.path.substring(5, req.path.length);
    var code = getNext();
    mappings[code] = link;
    var new_link = "http://" + req.headers.host + "/" + code;
    var new_object = {"originial_url": link, "short_url": new_link};
    res.end(JSON.stringify(new_object));
  } else if (!isNaN(req.path.replace("/", ""))) {
    // integer
    var code = parseInt(req.path.replace("/", ""));
    var link = mappings[code];
    res.end("<script>location.href = '" + link + "';</script>");
  } else {
    res.end("<h1>Invalid Link</h1>");
  }
});

app.listen(process.env.PORT || 8080, function () {
  console.log('listening on port 8080');
});