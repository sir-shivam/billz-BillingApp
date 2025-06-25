
// src/app/api/generate-invoice-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import puppeteer from 'puppeteer';
import Invoice from "@/models/invoices";
import { v2 as cloudinary } from 'cloudinary';

//@ts-expect-error
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:   process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const fileName = formData.get('fileName') as string;
    const invoiceId = formData.get("invoiceId") as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'invoices',
          public_id: fileName.replace('.png', ''),
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    await Invoice.findByIdAndUpdate(invoiceId, {
    cloudinaryUrl: result.secure_url,
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Error uploading invoice:", err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
