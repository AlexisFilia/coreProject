import { Request, Response } from "express";
require("isomorphic-fetch");

function createGqlRequest(body): string {
  const { subject, text, html } = body;
  const query = `
  mutation {
    InsertEmail($subject: String, $text: String) {
      insert_email(
          objects: {
              body: $subject,
              fullRequest: $text
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
    variables: { subject, text },
  });
}

export default async (req: Request, res: Response) => {
  console.log("J'ai reçu un email from: " + JSON.stringify(req.body.from));
  console.log("Le subject est: " + req.body.subject);

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

  const responseJson = await response.json();

  console.log(responseJson);

  console.log("---------FIN du SCRIPT-----------");
};
