import { Request, Response } from "express";
import { File } from "File";
import { NhostClient } from "@nhost/nhost-js";
require("isomorphic-fetch");

const nhost = new NhostClient({
  subdomain: "salwxqscgfcsfgnlpaju",
  region: "eu-central-1",
});

type AttachementType = {
  type: string;
  name: string;
  content: any;
};

// TODO: (Alexis) Manage attachments
// TODO: (Alexis) Manage inlines attachments

const endPointUrl = "https://salwxqscgfcsfgnlpaju.nhost.run/v1/graphql";
const endPointSecret = "5d11ac1aa30bad1362671f4164aa05ff";
const regex = /(.*)@dots.cool/i;

function generateRequest(req) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": endPointSecret,
    },
    body: createGqlRequestBody(req.body),
  };
}

function createGqlRequestBody(body): string {
  const { subject, text, html, from: fromObj, to: toObj, date } = body;
  const fullRequest = JSON.stringify(body);
  const from = fromObj.email;
  const to = toObj[0].email;
  const workspace = to.match(regex)[1];

  const query = `
  mutation InsertEmail($subject: String, $fullRequest: String, $text: String, $from: String, $date: String) {
    ${workspace} {
      insert_email(objects: {
          subject: $subject,
          fullRequest: $fullRequest,
          body: $text,
          from: $from,
          date: $date
        }) {
        returning {
            id
        }
      }
    }
  }`;

  return JSON.stringify({
    query,
    variables: { subject, fullRequest, text, from, date },
  });
}

export default async (req: Request, res: Response) => {
  const { attachments, inlines } = req.body;
  const { name, email } = req.body.from;
  console.log(`J'ai reçu un email from: ${name} - ${email}`);
  console.log("Le subject est: " + req.body.subject);

  const response = await fetch(endPointUrl, generateRequest(req));

  // Manage the email attachments
  // if (attachments) {
  //   for (let index = 0; index < attachments.length; index++) {
  //     const attachment = attachments[index] as AttachementType;
  // const { name, type, content } = attachment;
  const { name: fileName, type, content } = attachments[0] as AttachementType;
  const file = new File(content, fileName, { type: type });
  await nhost.storage.upload(file);
  // }
  // }

  // Manage email inline attachments
  // if (inlines) {
  //   for (let index = 0; index < inlines.length; index++) {
  //     const inline = inlines[index] as AttachementType;
  //     const { name, type, content, cid } = inline;
  //     const file = new File(content, name, { type: type });
  //     // await nhost.storage.upload(inline);
  //   }
  // }

  if (response.status === 200) {
    res.status(200).send();
  } else {
    console.log(`There is an issue with the request sent to: ${endPointUrl}`);
    res.status(500).send();
  }
  console.log("---------FIN du SCRIPT-----------");
};
