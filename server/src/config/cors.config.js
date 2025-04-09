import cors from "cors"


 const corsConfig = cors(
    {
      origin : [ 'http://localhost:3000' , '*'] , 
      methods : ["GET" , "POST" , "PUT" , "PATCH" , "DELETE"] , 
      credentials: true
    }
 )


 export default corsConfig ; 