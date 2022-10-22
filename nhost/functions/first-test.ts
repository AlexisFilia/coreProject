import { Request, Response } from "express";
require("isomorphic-fetch");

// TODO: (Alexis) Manage attachments
// TODO: (Alexis) Manage inlines attachments
// TODO: (Alexis) Use main endpoint

const endPointUrl = "https://mieltemspmtdyniitwlc.nhost.run/v1/graphql";
function generateRequest(req) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "0af0accb632b22d41834c793f66395bb",
    },
    body: createGqlRequestBody(req.body),
  };
}

function createGqlRequestBody(body): string {
  const { subject, text, html, from: fromObject, date } = body;
  const fullRequest = JSON.stringify(body);
  const from = JSON.stringify(fromObject);
  const query = `
  mutation InsertEmail($subject: String, $fullRequest: String, $text: String, $from: String, $date: String) {
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
  }`;

  return JSON.stringify({
    query,
    variables: { subject, fullRequest, text, from, date },
  });
}

export default async (req: Request, res: Response) => {
  console.log("J'ai reçu un email from: " + JSON.stringify(req.body.from));
  console.log("Le subject est: " + req.body.subject);

  const response = await fetch(endPointUrl, generateRequest(req));

  if (response.status === 200) {
    console.log("---------FIN du SCRIPT-----------");

    res.statusCode = 200;
    res.statusMessage = "Succes";
  } else {
    console.log(`There is an issue with the request sent to: ${endPointUrl}`);
    console.log(response);
    res.statusCode = 500;
    res.statusMessage = JSON.stringify(response);
  }
  return res;
};
