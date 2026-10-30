import { JOB_APPLICATION_FORM_ENDPOINT, JOB_APPLICATION_FORM_NAME } from '../../lib/jobApplications'

/** Netlify accepts named forms on any path. Never allow careers to bypass its guarded endpoint. */
export default async function blockJobApplicationBypass(request: Request, context: { next(): Promise<Response> }) {
  if (request.method !== 'POST' || new URL(request.url).pathname === JOB_APPLICATION_FORM_ENDPOINT) return context.next()
  const type = request.headers.get('content-type') || ''
  if (!type.startsWith('multipart/form-data') && !type.startsWith('application/x-www-form-urlencoded')) return context.next()
  try {
    const form = await request.clone().formData()
    if (form.getAll('form-name').some((name) => typeof name === 'string' && name.trim() === JOB_APPLICATION_FORM_NAME)) {
      return Response.json({ success: false, message: 'Please submit through the role’s application form.' }, { status: 403 })
    }
  } catch {
    return Response.json({ success: false, message: 'The submitted form could not be read.' }, { status: 400 })
  }
  return context.next()
}

export const config = { path: '/*', method: 'POST', onError: 'fail' }
