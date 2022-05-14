import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { MissingFieldError, validateAsRecipeEntry} from '../Shared/InputValidator';
import { v4 } from 'uuid';
import { getEventBody, addCorsHeader } from '../Shared/Utils';
// import { generateRandomId } from '../Shared/Utils';


const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DynamoDB'
    }
    addCorsHeader(result)
    try {
        const item = getEventBody(event);
        // item.recipeId = generateRandomId();
        item.recipeId = v4();
        validateAsRecipeEntry(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item,
        }).promise()
        result.body = JSON.stringify({
            id: item.recipeId
        })
    } catch (error) {
        if (error instanceof MissingFieldError){
            result.statusCode = 403;
        }
        if (error instanceof Error) {
            result.statusCode = 403;
            result.body = error.message;
        }
    }
    

    return result
}

export { handler }