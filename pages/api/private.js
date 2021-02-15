import { CotterValidateJWT } from "cotter-node";

const checkJWT = (handler) => async (req, res) => {
    // 1) Check that the access_token exists
    if (!("authorization" in req.headers)) {
      res.statusCode = 401;
      res.end("Authorization header missing");
    }
    const auth = await req.headers.authorization;
    const bearer = auth.split(" ");
    const token = bearer[1];
    
    let valid = false;
    try {
      valid = await CotterValidateJWT(token);
    } catch (e) {
      console.error(e);
      valid = false;
    }
    if (!valid) {
      res.statusCode = 403;
      res.end("Authorization header is invalid");
    }
      
    handler(req, res);
  }
  
  const handler = (req, res) => {
    res.statusCode = 200;
    res.end(
      `Success! This is a private resource and you have the access_token to view it.`
    );
  };
  
  export default checkJWT(handler);