const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function recipesByCuisine(cuisine: string) {
  const params = {
    TableName: process.env.RECIPE_TABLE,
    IndexName: 'recipesByCuisine',
    KeyConditionExpression: '#fieldName = :cuisine',
    ExpressionAttributeNames: { '#fieldName': 'cuisine' },
    ExpressionAttributeValues: { ':cuisine': cuisine },
  }

  try {
      const data = await docClient.query(params).promise()
      return data.Items
  } catch (err) {
      console.log('DynamoDB error: ', err)
      return null
  }
}

export default recipesByCuisine