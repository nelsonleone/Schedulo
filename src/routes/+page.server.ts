import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { handleSignInWith0Auth } from '$lib/helperFns/handleAuth0SignIn.js';
import type { RequestEvent } from './$types.js';
import { error, fail, redirect } from '@sveltejs/kit';
import axios from "axios"


export const load = async ({ locals: { supabase } }) => {
    try {
        const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
        const userID = (await supabase.auth.getUser()).data.user?.id;

        if (!userID){
            throw new Error("Unauthorized request (unauthenticated user)")
        }
        const getBoardsRes = await axios.get(`${PUBLIC_BACKEND_URL}/boards/${userID}`,{
            headers: {
                Authorization:  `Bearer ${accessToken || ""}`
            }
        })
        
        return {
            boards: getBoardsRes.data
        }
    } 
    catch (err: any | unknown) {
        let errMssg = "An error occurred while fetching boards";
        
        if (err.response) {
            errMssg = err.response.data.error || "Server responded with an error";
        } else if (err.request) {
            console.log(err.request);
            errMssg = "Request Failed - No response from server";
        } else {
            errMssg = err.message || "Unexpected error occurred";
        }

        console.log(errMssg)
                
        return {
            error: {
                status: err.response?.status || 500,
                message: errMssg
            }
        }
    }
}

export const actions = {
    login: async({ url, locals: { supabase } }: RequestEvent) => {
        const socialSignInRes = await handleSignInWith0Auth(url, supabase)

        if (socialSignInRes) {
            if (socialSignInRes.data && socialSignInRes.data.url) {
                throw redirect(303, socialSignInRes.data.url);
            } else if (socialSignInRes.error) {
                return fail(socialSignInRes.error?.status || 500, {
                    socialSignInErrorMessage: socialSignInRes.error.message
                })
            }
        }
    },


    createBoard: async({ request, locals: { supabase } }: RequestEvent) => {
        try{
            const data = await request.json()
            const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
            const userID = (await supabase.auth.getUser()).data.user?.id;

            if (!accessToken || !userID){
                return error(401,{
                    message: "Unauthorized request"
                })
            }
    
            const res = await axios.post(`${PUBLIC_BACKEND_URL}/boards/create/${userID}`,{
                ...data,
    
            },{
                headers: {
                    Authorization:  `Bearer ${accessToken || ""}`
                }
            })

            return { success: true, message: res.data.message || "Board Created Successfully"}
        }
        catch(err: any | unknown) {
            let errMssg = "An error occurred";
            
            if (err.response) {
                errMssg = err.response.data.error;
            } 
            else if (err.request) {
                console.log(err.request)
               errMssg = "Request Failed";
            } 
            else {
                errMssg = err.message;
            }
            
            console.log(err)
            return error(500,{
                message: errMssg
            })
        }
    },



    addTask: async({ request, locals: { supabase } }: RequestEvent) => {
        try{
            const data = await request.json()
            const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
            const userID = (await supabase.auth.getUser()).data.user?.id;

            if (!accessToken || !userID){
                return error(401,{
                    message: "Unauthorized request"
                })
            }

            console.log(data)
            
    
            const res = await axios.post(`${PUBLIC_BACKEND_URL}/tasks/create/${userID}`,{
                ...data,
    
            },{
                headers: {
                    Authorization:  `Bearer ${accessToken || ""}`
                }
            })

            return { success: true, message: res.data.message || "Task Added Successfully"}
        }
        catch(err: any | unknown) {
            let errMssg = "An error occurred";
            
            if (err.response) {
                errMssg = err.response.data.error;
            } 
            else if (err.request) {
                console.log(err.request)
               errMssg = "Request Failed";
            } 
            else {
                errMssg = err.message;
            }            
            return error(500,{
                message: errMssg
            })
        }
    },


    editBoard: async({ request, locals: { supabase } }: RequestEvent) => {
        try{
            const data = await request.json()
            const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
            const userID = (await supabase.auth.getUser()).data.user?.id;

            if (!accessToken || !userID){
                return error(401,{
                    message: "Unauthorized request"
                })
            }

            console.log(data)
            
    
            const res = await axios.patch(`${PUBLIC_BACKEND_URL}/boards/update/${userID}`,{
                ...data,
            },{
                headers: {
                    Authorization:  `Bearer ${accessToken || ""}`
                }
            })

            return { success: true, message: res.data.message || "Task Added Successfully"}
        }
        catch(err: any | unknown) {
            let errMssg = "An error occurred";
            
            if (err.response) {
                errMssg = err.response.data.error;
            } 
            else if (err.request) {
                console.log(err.request)
               errMssg = "Request Failed";
            } 
            else {
                errMssg = err.message;
            }            
            return error(500,{
                message: errMssg
            })
        }
    },




    deleteBoard: async ({ request, locals: { supabase } }: RequestEvent) => {
        try {
            const data = await request.json()
            const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
            const userID = (await supabase.auth.getUser()).data.user?.id;
    
            if (!accessToken || !userID) {
                throw error(401, { message: "Unauthorized request" })
            }
    
            const res = await axios.delete(`${PUBLIC_BACKEND_URL}/boards/delete/${userID}?board_id=${data.board_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
    
            return { success: true, message: res.data.message || "Board Deleted Successfully" }
        } catch (err: any) {    
            let errMssg = "An error occurred";
            if (err.response) {
                errMssg = err.response.data.error || errMssg;
            } else if (err.request) {
                console.log("Request error:", err.request)
                errMssg = "Request failed";
            } else {
                errMssg = err.message;
            }
    
            return error(500, { message: errMssg })
        }
    },




    updateTask: async({ request, locals: { supabase } }: RequestEvent) => {
        try{
            const data = await request.json()
            const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
            const userID = (await supabase.auth.getUser()).data.user?.id;

            if (!accessToken || !userID){
                return error(401,{
                    message: "Unauthorized request"
                })
            }            
    
            const res = await axios.patch(`${PUBLIC_BACKEND_URL}/tasks/update/${data.task_id}`,{
                ...data,
    
            },{
                headers: {
                    Authorization:  `Bearer ${accessToken || ""}`
                }
            })

            return { success: true, message: res.data.message || "Task Updated Successfully"}
        }
        catch(err: any | unknown) {
            console.log(err)
            let errMssg = "An error occurred";
            
            if (err.response) {
                errMssg = err.response.data.error;
            } 
            else if (err.request) {
                console.log(err.request)
               errMssg = "Request Failed";
            } 
            else {
                errMssg = err.message;
            }            
            return error(500,{
                message: errMssg
            })
        }
    },




    deleteTask: async ({ request, locals: { supabase } }: RequestEvent) => {
        try {
            const data = await request.json()
            const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
            const userID = (await supabase.auth.getUser()).data.user?.id;
    
            if (!accessToken || !userID) {
                throw error(401, { message: "Unauthorized request" })
            }
    
            const res = await axios.delete(`${PUBLIC_BACKEND_URL}/tasks/delete/${data.task_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
    
            return { success: true, message: res.data.message || "Task Deleted Successfully" }
        } catch (err: any) {
            console.error("Error in deleteTask:", err)
    
            let errMssg = "An error occurred";
            if (err.response) {
                errMssg = err.response.data.error || errMssg;
            } else if (err.request) {
                console.log("Request error:", err.request)
                errMssg = "Request failed";
            } else {
                errMssg = err.message;
            }
    
            return error(500, { message: errMssg })
        }
    },
    
    



    logout: async ({ locals: { supabase } }: RequestEvent) => {
        try {
            
            const { error  } = await supabase.auth.signOut()

            if (error){
                throw new Error(error.message)
            }

            return { success: true, message: "Logout Successfully" }
        } catch (err: any) {
    
            return error(500, { message: err.message })
        }
    }
}