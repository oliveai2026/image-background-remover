/**
 * Cloudflare Pages Function: /api/remove-bg
 * Proxies image to Remove.bg API, keeping the API key server-side.
 */
export async function onRequestPost(context) {
  const apiKey = context.env.REMOVE_BG_API_KEY

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  let formData
  try {
    formData = await context.request.formData()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const imageFile = formData.get('image')
  if (!imageFile) {
    return new Response(JSON.stringify({ error: 'No image provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const body = new FormData()
  body.append('image_file', imageFile)
  body.append('size', 'auto')

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body
  })

  if (!response.ok) {
    const text = await response.text()
    return new Response(JSON.stringify({ error: 'Remove.bg error', detail: text }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const resultBuffer = await response.arrayBuffer()
  return new Response(resultBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="removed-bg.png"'
    }
  })
}
