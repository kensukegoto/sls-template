'use strict';

module.exports.submit = (event, context, callback) => {

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v5.12! Your function executed successfully!',
      input: JSON.parse(event.body).memo
    }),
  };

  callback(null, response);

};