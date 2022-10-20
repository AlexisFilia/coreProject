import { Request, Response } from "express";
require("isomorphic-fetch");

const options = {
  hostname: "mieltemspmtdyniitwlc.nhost.run",
  port: 443,
  path: "/v1/graphql",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": "0af0accb632b22d41834c793f66395bb",
  },
};

// function createGqlRequest(body): string {
//   return JSON.stringify({
//     query: `
//     mutation {
//       insert_email(
//           objects: {
//               body: "premier test",
//               fullRequest: "coucou"
//           }
//       ) {
//           returning {
//               id
//           }
//       }
//   }`,
//   });
// }
function createGqlRequest(body): string {
  return JSON.stringify({
    query: `
    mutation {
      insert_email(
          objects: {
              body: ${body.text},
              fullRequest: ${JSON.stringify(body)}
          }
      ) {
          returning {
              id
          }
      }
  }`,
  });
}

export default (req: Request, res: Response) => {
  console.log("J'ai reçu un email from: " + JSON.stringify(req.body.from));
  console.log("Le subject est: " + req.body.subject);

  fetch("https://mieltemspmtdyniitwlc.nhost.run/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "0af0accb632b22d41834c793f66395bb",
    },
    body: createGqlRequest(req.body),
  })
    .then((res) => res.json())
    .then((res) => console.log(res.data));

  console.log("---------FIN du SCRIPT-----------");
};
