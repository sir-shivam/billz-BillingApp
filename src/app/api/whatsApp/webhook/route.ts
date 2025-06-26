import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import Client from '@/models/clientModel';

const OWNER_NUMBER = process.env.WHATSAPP_OWNER!; // With country code
const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0/";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

// for verification 
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get('hub.mode');
  const challenge = searchParams.get('hub.challenge');
  const token = searchParams.get('hub.verify_token');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN; // set this in your .env

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return new Response(challenge, { status: 200 });
    } else {
      return new Response('Forbidden', { status: 403 });
    }
  }

  return new Response('Bad Request', { status: 400 });
}





export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log(body);

  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];
  console.log(message , "message");

  if (!message) return NextResponse.json({ success: true });

  const from = message.from; // WhatsApp number of sender
  let phone = from;
  if (phone.startsWith("91") && phone.length === 12) {
  phone = phone.slice(2); // becomes '9876543210'
}
  const name = message?.profile?.name || "User";

  if (message?.type === "interactive" && message?.interactive?.type === "button_reply") {
  const payload = message.interactive.button_reply.id; // e.g., "invoice_1:67703ddd94a311b22a936043"
  const [invoiceType, clientId] = payload.split(":");

  const client = await Client.findById(clientId).populate({
    path: "invoices",
    options: { sort: { createdAt: -1 }, limit: 3 }
  });

  

  if (!client || !client.invoices?.length) {
    await sendTextMessage(from, "❌ No invoices found for this client.");
    return new Response("OK");
  }

  const invoiceIndex = parseInt(invoiceType.split("_")[1], 10) - 1;
  const invoice = client.invoices[invoiceIndex];
  console.log(invoice , "this is index");

  if (!invoice) {
    await sendTextMessage(from, "⚠️ Invoice not found.");
    return new Response("OK");
  }

  if (invoice.cloudinaryUrl) {
    await sendTextMessage(from, "Just a Second...");
    await sendMediaMessage(from, invoice.cloudinaryUrl);
  } else {
    await sendTextMessage(from, "📎 Image not available for this invoice.");
  }

  return new Response("OK");
}



  await sendTextMessage(from, "👋 Welcome to Billz - A webApp made by *Shivam Krishnaohan Gupta*");

  const client = await Client.findOne({ contact : phone });
  console.log(phone , "this is my phone");
  if (client) {
    // Send 3 buttons: latest 3 invoices
    await sendInvoiceOptions(from , name , client._id );
    return new Response("OK");
  }
  

  return NextResponse.json({ status: "done" });
}

async function sendTextMessage(to: string, text: string) {
  await axios.post(`${WHATSAPP_API_URL}${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  }, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
}

async function sendMediaMessage(to: string, imageUrl: string) {
  return axios.post(`${WHATSAPP_API_URL}${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp",
    to,
    type: "image",
    image: {
      link: imageUrl
    }
  }, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    }
  });
}

async function sendInvoiceOptions(to: string, name: string, clientId: string) {
  await axios.post(`${WHATSAPP_API_URL}${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `Hi ${name}, please choose your invoice:`,
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: `invoice_1:${clientId}`, title: "📄 Latest Bill" } },
          { type: "reply", reply: { id: `invoice_2:${clientId}`, title: "📄 2nd Latest Bill" } },
          { type: "reply", reply: { id: `invoice_3:${clientId}`, title: "📄 3rd Latest Bill" } },
        ],
      },
    },
  }, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
}

