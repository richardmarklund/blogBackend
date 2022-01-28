import moment from "moment";

 async function getAllPosts() {
   var data = await client
     .scan({
       TableName: tableName,
       Limit: 1,
       ScanIndexForward: false,
     }).promise();
    return data;

}

async function addPost(post) {
   client.put(
    {
       Item: post,
       TableName: tableName,

    }
  ).promise().then(data => console.log(data));
}

export { getAllPosts, addPost };
