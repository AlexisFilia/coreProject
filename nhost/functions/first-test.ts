import { Request, Response } from "express";
const https = require("node:https");

const options = {
  hostname: "mieltemspmtdyniitwlc.nhost.run/v1/graphql",
  port: 443,
  path: "/",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": "0af0accb632b22d41834c793f66395bb",
  },
};

function createGqlRequest(body): string {
  return JSON.stringify({
    query: `
    mutation {
      insert_email(
          objects: {
              body: ${body.text.toString()},
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

  var postData = createGqlRequest(req.body);

  var request = https.request(options, (res) => {
    console.log("statusCode:", res.statusCode);
    console.log("headers:", res.headers);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  request.on("error", (e) => {
    console.error(e);
  });

  request.write(postData);
  request.end();

  console.log("---------FIN du SCRIPT-----------");
};
