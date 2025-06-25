import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OWNER_NUMBER = process.env.WHATSAPP_OWNER!; // With country code
const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0/";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;


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

  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (!message) return NextResponse.json({ success: true });

  const from = message.from; // WhatsApp number of sender
  const name = message?.profile?.name || "User";

  if (from === OWNER_NUMBER) {
    // Reply to owner
    await sendTextMessage(from, "👋 Welcome to Billz, Admin!");
  } else {
    // Show latest bills as buttons
    await sendInvoiceOptions(from, name);
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

async function sendInvoiceOptions(to: string, name: string) {
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
          { type: "reply", reply: { id: "invoice_1", title: "📄 Latest Bill" } },
          { type: "reply", reply: { id: "invoice_2", title: "📄 2nd Latest Bill" } },
          { type: "reply", reply: { id: "invoice_3", title: "📄 3rd Latest Bill" } },
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
