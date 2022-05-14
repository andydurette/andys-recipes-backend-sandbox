import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/RecipesTable/Create';

const event: APIGatewayProxyEvent = {
    // queryStringParameters: {
    //     recipeId: '9ebab7db-0d37-4622-b83b-c209b203ba17'
    // }
    body: {
        name: 'Burrito',
        cuisine: 'Mexican'
    }
} as any;


// Event and context
const result = handler(event, {} as any).then((apiResult) => {
    const items = JSON.parse(apiResult.body);
    console.log(123)
});