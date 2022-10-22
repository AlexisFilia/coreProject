import { Request, Response } from "express";
require("isomorphic-fetch");

// TODO: (Alexis) Use federation to create elements depending on the Alias instead of sending straight the request to the service
// TODO: (Alexis) Manage attachments
// TODO: (Alexis) Manage inlines attachments

function createGqlRequest(body): string {
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

  try {
    const response = await fetch(
      "https://mieltemspmtdyniitwlc.nhost.run/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "0af0accb632b22d41834c793f66395bb",
        },
        body: createGqlRequest(req.body),
      }
    );

    console.log("---------FIN du SCRIPT-----------");

    res.statusCode = 200;
    res.statusMessage = "Succes";
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.statusMessage = e;
  }
  return res;
};
