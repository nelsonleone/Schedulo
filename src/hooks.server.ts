// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),

      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' })
      },

      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' })
      }, 
    },
  })

  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }

    return { session, user }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    }
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session } = await event.locals.safeGetSession()
  const user = (await event.locals.supabase.auth.getUser()).data.user;
  event.locals.session = session;
  event.locals.user = user;


  if (!event.locals.session && event.url.pathname.startsWith('/dashboard')) {
    return redirect(303, '/admin/sign_in')
  }

  return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)