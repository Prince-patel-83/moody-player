import axios from "../APi/axiosConfig";
import { toast } from "react-toastify";


export const asyncCurrentUser = async () => {
    try{ 
        const user = await axios("/auth/me")
        if(user) return user;
        else console.log("user not logged in!");
        
    }catch(error){
        console.log(error);
    }
}

export const asyncLogOutUser = async () =>{
    try{    
        await axios("/auth/logout");
        toast.success("user Logged out sucessfully");
    }catch(error){
        console.log(error);
    }
}

export const asyncLoginUser = async (user) => {
    try{

        const res = await axios.post(`/auth/login` , user) ;
        console.log("login " , res.data.user);
        let userdetails = res.data.user ;
        if(userdetails){
            toast.success("user login sucessfully");
            return userdetails ;
        }else{
            toast.error("wrong email or password");
        }
    }catch(error){
        console.log(error);
    }
    
}

export const asyncRegisterUser = async (user) => {
    try{
       const res = await axios.post("/auth/register/" , user);
       console.log(res);
       
       toast.success("user registered sucessfully");
       return res.data.user;
    }catch(error){
         toast.error("user registration failed");
         console.log("con",error);
    }
}


// export const asyncUpdateUser = (id , user) => async (dispatch , getState)=>{
//     try{
//        const {data} =  await axios.patch("/user/"+id , user);
//     }catch(error){
//         console.log(error);
//     }
// }

// export const asyncDeleteUser = (id) => async (dispatch , getState)=>{
//     try{
//         await axios.delete("/user/" + id);     
//         dispatch(asyncLogOutUser());
//     }catch(error){
//         console.log(error);
//     }
// }

