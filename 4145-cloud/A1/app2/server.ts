import express, { Request, Response } from "express";
import fs from "fs";
import md5File from "md5-file";

const PORT = 8081;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req: Request, res: Response) => {
  console.log("App 2: ", req.body);

  const { file } = req.body;
  const path = `./temp/${file}`;

  if (fs.existsSync(path)) {
    const checksum = md5File.sync(path);
    res.json({ file, checksum });

    return;
  } else {
    res.json({ file, error: "File not found." });
    return;
  }
});

app.listen(PORT);
