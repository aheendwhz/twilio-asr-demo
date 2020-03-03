
// echo test
module.exports = async (req, res) => {

  const { body } = req;

  res.status(200);
  res.send(`The request param was ${body.foo}`);

};
