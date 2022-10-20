import { Request, Response } from "express";

export default (req: Request, res: Response) => {
  // res.status(200).send(`Req: ${req}!`);
  console.log("Je reçois des emails");
  console.log(req.body);
  console.log("--------------------");
};
