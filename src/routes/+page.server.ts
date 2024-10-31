import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { handleSignInWith0Auth } from '$lib/helperFns/handleAuth0SignIn.js';
import type { RequestEvent } from './$types.js';
import { error, fail, redirect } from '@sveltejs/kit';
import axios from "axios"


export const load = async ({ locals: { supabase } }) => {
    try {
        const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
        const userID = (await supabase.auth.getUser()).data.user?.id;

        console.log("userID",userID)
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
    }
}