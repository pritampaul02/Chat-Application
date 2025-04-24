import { Messages } from "../model/message.model.js";

import { Users } from "../model/user.model.js";
import { getSocketId, io } from "../socket/socket.js";

class MessageService {

    sendMessage = async(id , body)=>{

        const sender = await Users.findById(id)
        const reciver = await Users.findById(body.reciverId)

        if(!sender && !reciver){
            
            throw new Error("User not found")

        }
    

        const data = await Messages.create({
            senderId : id ,
            receiverId : body.reciverId ,
            message : body.message                      
        })
        
        const chat = await Messages.findById(data._id).populate("senderId" , "name profile_pic _id email")
          .populate("receiverId" , "name profile_pic _id email")

        const reciverSocketId = getSocketId(body.reciverId)
        console.log("reciver id" , reciverSocketId);
        const senderSocketId = getSocketId(id)
        
        io.to(reciverSocketId).emit("send-message", { reciverId: body.reciverId , chat  });
        io.to(senderSocketId).emit("meg-sent" , { sender : id , chat })
        return chat
    }

    fetchMessage = async(id , reciverId)=>{
       
        const sender = await Users.findById(id)
        const reciver = await Users.findById(reciverId)

        // console.log("sender , reciver" , sender , reciver)
        

        if(!sender && !reciver){
            
            throw new Error("User not found")

        }

        const messages = await Messages.find({
            $or : [
                {senderId : id , receiverId : reciverId} ,
                {senderId : reciverId , receiverId : id}
            ]
        })
        .populate("senderId" , "name profile_pic _id email")
        .populate("receiverId" , "name profile_pic _id email")

        console.log("messaeg" , messages)
        return messages

    }

}

export default new MessageService();

