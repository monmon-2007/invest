module.exports = (router) => {



  router.post('/hello', function (req, res) {
    Robinhood.quote_data(req.body.ticker, function (error, response, body) {
      if (error) {
        console.log(error);
        process.exit(1);
      }
      res.send(body);
    })
  })

  return router;
}
