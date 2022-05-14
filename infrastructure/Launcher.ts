import { RecipeStack } from './RecipeStack';
import { App } from 'aws-cdk-lib';

const app = new App()
new RecipeStack(app, 'Andys-Recipes', {
    stackName:'AndysRecipes'
})