import { Request, Response } from "express";

export default (req: Request, res: Response) => {
  // res.status(200).send(`Req: ${req}!`);
  console.log(req);
};
