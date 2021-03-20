const AWS = require('aws-sdk');
const dynamodb= new AWS.DynamoDB({
  endpoint: "http://localhost:8000"
});
const s3 = new AWS.S3({
  accessKeyId: 'S3RVER', // This specific key is required when working offline
  secretAccessKey: 'S3RVER',
  endpoint: new AWS.Endpoint('http://localhost:9090'),
  s3ForcePathStyle: true
})

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

    const destparams = {
      Bucket: 'local-bucket',
      // Key: `${String(id)}.txt`,
      // Body: memo,
      // ContentType: " text/plain"
    };

    const r = await s3.listObjects(destparams).promise(); 


    callback(null,{
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success !!',
        r
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

    console.log(res)

    callback(null,{
      statusCode: 200,
      body: JSON.stringify({
        items: res.Items
      }),
    })

  } catch (e) {
    console.error(e);
    callback(e);
  }
}