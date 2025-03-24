
import { axiosInstance } from "./helper"

const getContacts =async (user_id,search_by_name = null)=>{
    let API = process.env.API_URL+`/api/contact/${user_id}`
    if(search_by_name != null){
        API = process.env.API_URL+`/api/contact/${user_id}`+`?search_by_name=${search_by_name}`
    }
    const response = await axiosInstance.get(API);
    if(response.data.flag == 1){
        return response.data.contacts
    }else{
        return [];
    }
}
const getContact = async (user_id,id)=>{
    const response = await axiosInstance.get(process.env.API_URL+`/api/contact/${user_id}/${id}`);
    if(response.data.flag == 1){
        return response.data.contact
    }else{
        return null;
    }
}
export {getContacts, getContact}