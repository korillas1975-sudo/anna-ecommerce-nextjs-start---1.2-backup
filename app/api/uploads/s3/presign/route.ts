import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const region = process.env.AWS_REGION
const bucket = process.env.S3_BUCKET
const baseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL // e.g., https://cdn.example.com or https://bucket.s3.region.amazonaws.com

export async function POST(request: Request) {
  try {
    if (!region || !bucket || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json({ error: 'S3 not configured' }, { status: 500 })
    }
    const { filename, contentType } = await request.json()
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType required' }, { status: 400 })
    }

    const key = `uploads/products/${crypto.randomUUID()}-${filename}`
    const client = new S3Client({ region })
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ACL: 'public-read' as any })
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 })

    const publicUrl = baseUrl
      ? `${baseUrl.replace(/\/$/, '')}/${key}`
      : `https://${bucket}.s3.${region}.amazonaws.com/${key}`

    return NextResponse.json({ uploadUrl, key, publicUrl })
  } catch (e) {
    console.error('S3 presign error:', e)
    return NextResponse.json({ error: 'Failed to create presigned URL' }, { status: 500 })
  }
}

