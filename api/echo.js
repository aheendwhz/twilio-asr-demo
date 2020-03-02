
// echo test
module.exports = async (req, res) => {

  const { body } = req;

  res.status(200);
  res.end(`The request param was ${body.foo}`);

};
