const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

let result = "";

app.post("/api/send-diary-content", (req, res) => {
  let data = "";
  const content = req.body.content.toString();
  const genre1 = req.body.genre1.toString();
  const genre2 = req.body.genre2.toString();
  const genre3 = req.body.genre3.toString();
  const singer1 = req.body.singer1.toString();
  const singer2 = req.body.singer2.toString();
  const singer3 = req.body.singer3.toString();

  const datas = {
    content: content,
    genre1: genre1,
    genre2: genre2,
    genre3: genre3,
    singer1: singer1,
    singer2: singer2,
    singer3: singer3,
  };
  let pythonProcess = spawn("python", ["test.py"]);
  pythonProcess.stdin.setEncoding("utf8");
  pythonProcess.stdout.setEncoding("utf8");

  const jsonData = JSON.stringify(datas);
  console.log(jsonData);
  pythonProcess.stdin.write(jsonData);
  pythonProcess.stdin.end();
  // res.json({ success: true });
  pythonProcess.stdout.on("data", (chunk) => {
    data += chunk;
  });

  pythonProcess.stdout.on("end", (code) => {
    try {
      const parsedData = JSON.parse(data);
      result = JSON.stringify(parsedData);
      console.log("정보:", result);
      res.json({ inform: result });
    } catch (error) {
      console.error("Error parsing or stringifying JSON:", error);
    }
  });
});

app.get("/api/send-diary-content", (req, res) => {
  console.log("get 요청:", result);
  res.json({ inform: result });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
