import { Request, Response } from "express";
require("isomorphic-fetch");

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
      insert_email(
          objects: {
              subject: $subject,
              fullRequest: $fullRequest,
              body: $text,
              from: $from,
              date: $date
          }
      ) {
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
  const { name, email } = req.body.from;
  console.log(`J'ai reçu un email from: ${name} - ${email}`);
  console.log("Le subject est: " + req.body.subject);

  const response = await fetch(endPointUrl, generateRequest(req));

  if (response.status === 200) {
    res.status(200).send();
  } else {
    console.log(`There is an issue with the request sent to: ${endPointUrl}`);
    res.status(500).send();
  }
  console.log("---------FIN du SCRIPT-----------");
};
