import { Request, Response } from "express";
import { NhostClient } from "@nhost/nhost-js";
import slugify from "slugify";
import FormData from "form-data";

require("isomorphic-fetch");

type AttachementType = {
  type: string;
  name: string;
  content: any;
};

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

  const nhost = new NhostClient({
    subdomain: "salwxqscgfcsfgnlpaju",
    region: "eu-central-1",
  });

  // Parse and save the Email
  const response = await fetch(endPointUrl, generateRequest(req));

  // Manage the email attachments
  const uploadResponses = [] as number[];

  for (let index = 0; index < attachments.length; index++) {
    const attachment = attachments[index];
    const { name: fileName, type, content } = attachment as AttachementType;
    const slug = slugify(fileName) || `unknown.${type}`;
    const formdata = new FormData();

    formdata.append("file", content, slug);

    const uploadResponse = await nhost.storage.upload({
      name: slug,
      formData: formdata,
    });

    if (uploadResponse.error) {
      console.log(uploadResponse.error);
      uploadResponses.push(1);
    }
  }

  if (response.status === 200 && uploadResponses.length === 0) {
    res.status(200).send();
  } else {
    console.log(`There is an issue with the request sent to: ${endPointUrl}`);
    res.status(500).send();
  }
  console.log("---------FIN du SCRIPT-----------");
};
