
// echo test
module.exports = (req, res) => {

  console.log('request:', req.body);

  const respond = {
    echo: req.body
  } 

  res.status(200);
  res.send(respond);

};
