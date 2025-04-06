import { model, Schema } from "mongoose";


const todoSchema = new Schema({
    title : {
        type : String ,
        required : [ true , "Title must be required !"] ,
        trim : true ,
        minLength : [3 , "title must be 3 char or more "] , 
        maxLangth : [60 , "title must be under 60 char"]
    } , 
    description : {
        type : String  ,
        trim : true ,
        maxLangth : [ 500 , "title must be under 500 char"]
    } , 
    isComplete : {
        type : Boolean , 
        default : false ,
    } , 

    completeAt : {
        type : Date
    }

} , { timestamps : true } )

export const Todos = model( "todo" , todoSchema )