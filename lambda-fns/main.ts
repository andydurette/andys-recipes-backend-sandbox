import getRecipeById from './getRecipesById';
import createRecipe from './createRecipe';
import listRecipes from './listRecipes';
import deleteRecipe from './deleteRecipe';
import updateRecipe from './updateRecipe';
import recipesByCuisine from './recipesByCuisine';
import Recipe from './recipe';
import { Handler } from 'aws-lambda';

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     recipeId: string,
     category: string
     recipe: Recipe,
  },
  identity: {
    username: string,
    claims: {
      [key: string]: string[]
    }
  }
}

export const handler: Handler = async (event:AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "getRecipeById":
      return await getRecipeById(event.arguments.recipeId)
    case "createRecipe":
      return await createRecipe(event.arguments.recipe)
    case "listRecipes":
      return await listRecipes()
    case "deleteRecipe":
      return await deleteRecipe(event.arguments.recipeId)
    case "updateRecipe":
      return await updateRecipe(event.arguments.recipe)
    case "recipesByCuisine":
      return await recipesByCuisine(event.arguments.category)
    default:
      return null
  }
}