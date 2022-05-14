import { Recipe } from './Model';


export class MissingFieldError extends Error {}

export function validateAsRecipeEntry(arg: any){
    if(!(arg as Recipe).name){
        throw new MissingFieldError('Value for name required')
    }
    if(!(arg as Recipe).cuisine){
        throw new MissingFieldError('Value for cuisine required')
    }
    if(!(arg as Recipe).recipeId){
        throw new MissingFieldError('Value for recipeId required')
    }
}