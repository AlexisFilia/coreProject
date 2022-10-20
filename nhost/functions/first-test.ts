import { Request, Response } from "express";
require("isomorphic-fetch");

function createGqlRequest(body): string {
  return JSON.stringify({
    query: `
    mutation {
      insert_email(
          objects: {
              body: "${body.text}",
              fullRequest: "${body.html}"
          }
      ) {
          returning {
              id
          }
      }
  }`,
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

  console.log(responseJson.status);
  console.log(responseJson.body);

  console.log("---------FIN du SCRIPT-----------");
};
