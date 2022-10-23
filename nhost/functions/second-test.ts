import { Request, Response } from "express";
import { NhostClient } from "@nhost/nhost-js";
import FormData from "form-data";
import fs from "fs";

require("isomorphic-fetch");

const nhost = new NhostClient({
  subdomain: "salwxqscgfcsfgnlpaju",
  region: "eu-central-1",
});

export default async (req: Request, res: Response) => {
  console.log(`Test`);

  const fd = new FormData();
  fd.append("file", fs.createReadStream("logo.png"));

  const response = await nhost.storage.upload({
    formData: fd,
  });

  console.log("resFileUpload", response);

  if (response.status === 200) {
    res.status(200).send();
  } else {
    console.log(`There is an issue with the request sent`);
    res.status(500).send();
  }
  console.log("---------FIN du SCRIPT-----------");
};
