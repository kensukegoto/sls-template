## function

### private

`true`とするとAPI Keyが必要になる。別途providerでapiKeysを作成する。

https://fujiyasu.hatenablog.com/entry/2016/10/02/232824

## APIコール時に必須パラメーターをチェックしたい

https://qiita.com/picapica/items/1a47847d3beb689a5740

# 参考

- [【公式】POST出来るAPIの実装例](https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb)



## hello,world

https://github.com/kensukegoto/sls-example
---


# API Gateway + lambda + dynamo

endpointにアクセスするとlambdaで0-9の乱数を作成。その乱数のidのデータをdynamoから取得し、中身をJSONとして返す。

# 使い方

1. serverless.ymlとhandler.js内の`service-mmdd`とあるサービス名とdynamoDBテーブル名を任意のものに変更
2. dyanmoDBにデータを入れる
3. デプロイ

aws dynamodb put-item --table-name service-0318 --item '{"id": {"N": "3"}, "user": {"S": "takahashi"}}' --region ap-northeast-1

```
aws dynamodb put-item --table-name service-mmdd --item '{"id": {"N": "1"}, "user": {"S": "sato"}}' --region ap-northeast-1
aws dynamodb put-item --table-name service-mmdd --item '{"id": {"N": "2"}, "user": {"S": "suzuki"}}' --region ap-northeast-1
aws dynamodb put-item --table-name service-mmdd --item '{"id": {"N": "3"}, "user": {"S": "takahasi"}}' --region ap-northeast-1
```
# つまずいたポイント

- lambdaからdynamoは非同期なので`await`を使わないと返り値が`null`となる
- `AWS.Request.promise`メソッドを知らないと非同期処理が終わらない状態となる（ゾンビプロセス）
- dynamoのschemaを変える際はtable名の変更が必要
- API Gatewayを使いパラーメータを渡した場合は全て文字列となる。例えばid=1を渡す場合、node側ではid="1"となるので数値に戻す必要がある。
- **パラメーターの値が不正な場合は`catch`で処理出来るが`await`に代入した値が結果オブジェクトではなくエラーオブジェクトとなる。通常のオブジェクトの扱いと異なるので注意**

# AWS.Request.promiseメソッド

dynamoへの`query`などのメソッドを`promise`化する。`query`は`promise`ではなく非同期関数。<br>
非同期関数なのでそのまま実行するとjsonを返却する処理が先に実行され`query`の結果をjsonとして返せない。

## await Promiseとすると戻り値が変わる

### 通常

aは`promise`なので`then`で繋げる

```JS
(()=>{
    let a = Promise.resolve(510);
    a.then(num=>{
        console.log(num);
    });
})();
```

### await

aは`promise`ではなく通常`then`された後の成功時に渡る引数となる

```JS
(async ()=>{
    let a = await Promise.resolve(510);
    console.log(a); // 510
})();
```

# 参照

## serverless framework
https://qiita.com/horike37/items/b295a91908fcfd4033a2

## dynamoの操作
https://qiita.com/Fujimon_fn/items/66be7b807a8329496899
