// require("isomorphic-fetch");
// const { NhostClient } = require("@nhost/nhost-js");
// const FormData = require("form-data");
// const fs = require("fs");

// // TODO: (Alexis) Manage attachments
// // TODO: (Alexis) Manage inlines attachments
// // There is an issue when Uploading files... 403 - Forbidden

// const endPointUrl = "https://salwxqscgfcsfgnlpaju.nhost.run/v1/graphql";
// const endPointSecret = "5d11ac1aa30bad1362671f4164aa05ff";
// const regex = /(.*)@dots.cool/i;

// function generateRequest(req) {
//   return {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-hasura-admin-secret": endPointSecret,
//     },
//     body: createGqlRequestBody(req),
//   };
// }

// function createGqlRequestBody(body) {
//   const { subject, text, html, from: fromObj, to: toObj, date } = body;
//   const fullRequest = JSON.stringify(body);
//   const from = fromObj.email;
//   const to = toObj[0].email;
//   const workspace = to.match(regex)[1];

//   const query = `
//   mutation InsertEmail($subject: String, $fullRequest: String, $text: String, $from: String, $date: String) {
//     ${workspace} {
//       insert_email(objects: {
//           subject: $subject,
//           fullRequest: $fullRequest,
//           body: $text,
//           from: $from,
//           date: $date
//         }) {
//         returning {
//             id
//         }
//       }
//     }
//   }`;

//   return JSON.stringify({
//     query,
//     variables: { subject, fullRequest, text, from, date },
//   });
// }

// async function toTest() {
//   const rawdata = fs.readFileSync("./nhost/functions/request.json");
//   const rawdataJson = JSON.parse(rawdata);
//   const { subject, from, to, text, attachments, inlines } = rawdataJson;
//   console.log(`J'ai reçu un email from: ${from.name} - ${from.email}`);
//   console.log("Le subject est: " + subject);

//   const nhost = new NhostClient({
//     subdomain: "salwxqscgfcsfgnlpaju",
//     region: "eu-central-1",
//   });

//   await nhost.auth.signIn({
//     email: "alexis@dots.cool",
//     password: "aaaaaaaa",
//   });

//   const isAuthenticated = nhost.auth.isAuthenticated();

//   if (isAuthenticated) {
//     console.log("User is authenticated");
//   }

//   // Parse and save the Email
//   const response = await fetch(endPointUrl, generateRequest(rawdataJson));

//   // Manage the email attachments
//   const { name: fileName, type, content } = attachments[0];
//   const formdata = new FormData();
//   formdata.append("file", content, fileName);

//   const resFileUpload = await nhost.storage.upload({
//     name: fileName,
//     formData: formdata,
//   });

//   console.log("resFileUpload", resFileUpload);

//   if (response.status === 200) {
//     console.log("200");
//   } else {
//     console.log(`There is an issue with the request sent to: ${endPointUrl}`);
//   }
//   console.log("---------FIN du SCRIPT-----------");
// }

// toTest();
