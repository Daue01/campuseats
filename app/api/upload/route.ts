import { NextRequest } from 'next/server'
import { jsonError, jsonOk } from '@/lib/server/http'
import { saveUpload } from '@/lib/server/storage'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return jsonError(400, 'A file upload is required.')
  }

  try {
    const url = await saveUpload(file)
    return jsonOk({ url }, 201)
  } catch (error) {
    return jsonError(400, error instanceof Error ? error.message : 'Upload failed.')
  }
}
