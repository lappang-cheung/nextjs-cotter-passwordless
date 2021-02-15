export default (req, res) => {
    res.statusCode = 200;
    res.end(
      "Success! This is a public resource, you can see it without logging in."
    );
  };
  