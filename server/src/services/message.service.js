import { Messages } from "../model/message.model.js"


class MessageService {

    async create(body , user){
        // authication 
        const { receiver , message } = body
        const { id , friends } = user 

        // is friends 
        
        const isExist = friends.find((item) => String(item) === receiver ) 
        if(!isExist){
          throw new Error(" reciver not your friend ")
        }

        const chat = await Messages.create({
            sender : id ,
            ...body 
        })

        // socket.io , reciver message ... 

        return chat
    } 
}

export default new MessageService()