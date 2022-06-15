const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function getRecipeById(recipeId: string) {
    const params = {
        TableName: process.env.RECIPE_TABLE,
        Key: { id: recipeId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getRecipeById