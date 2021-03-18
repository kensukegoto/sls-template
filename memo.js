const AWS = require('aws-sdk');
const dynamodb= new AWS.DynamoDB();

module.exports.submit = async (event, context, callback) => {

  const { memo } = JSON.parse(event.body);
  if(typeof memo !== 'string') callback(new Error('memo was invalid'));

  const id = new Date().getTime();

  const params = {
    Item: {
    "id": {
      S: String(id)
      }, 
    "memo": {
      S: memo
      }, 
    }, 
    TableName: process.env.MEMO_TABLE
  };

  try {

    await dynamodb.putItem(params).promise();


    callback(null,{
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success !!',
      }),
    })

  } catch (e) {
    console.error(e);
    callback(e);
  }

};

module.exports.listMemos = async (event, context, callback) => {

  const params = {
    TableName: process.env.MEMO_TABLE,
    ProjectionExpression: "id, memo" // 結果に含めたい属性
};

  try {

    const res = await dynamodb.scan(params).promise();

    callback(null,{
      statusCode: 200,
      body: JSON.stringify({
        items: res.items
      }),
    })

  } catch (e) {
    console.error(e);
    callback(e);
  }
}