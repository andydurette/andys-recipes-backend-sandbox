const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
import Recipe from './Recipe'
const { v4: uuid } = require('uuid')

async function createRecipe(recipe: Recipe) {
  if (!recipe.id) {
    recipe.id = uuid()
  }
  const params = {
    TableName: process.env.RECIPE_TABLE,
    Item: recipe
  }
  try {
    await docClient.put(params).promise()
    return recipe
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default createRecipe