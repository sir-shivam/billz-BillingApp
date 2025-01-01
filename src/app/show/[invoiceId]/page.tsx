// app/user-profile/[invoiceId]/page.tsx

import InvoicePage from '@/app/components/DwnBtn';
import InvoicePage1 from '@/app/components/serverButt';
import React from 'react';

interface ApiResponse {
    message: string;
    invoice: invoiceDetail;
}

interface invoiceDetail {
    billNo: number;
    clientName: string;
    invoiceDate: string;
    balance: number;
    paid: number;
    items: Item[];
    extra: Extra[];
    notes: string;
    total: number;
}

interface Item {
    description: string;
    comm: number;
    fare: number;
    quantity: number;
    price: number;
    eachItemTotal: number;
    carat: number;
    perCarat: number;
}

interface Extra {
    description: string;
    amount: number;
}

    const UserProfilePage = async ({ params }: { params: { invoiceId: string } }) => {
        const { invoiceId } = params;

        // Fetch data server-side (Only once per request)
        let invoice = null; 
        try {
            const url = `https://billz-billing-app.vercel.app/api/invoices/find?invoiceId=${encodeURIComponent(invoiceId)}`
            console.log(url, "this")
            const response = await fetch(url, {
                cache: 'no-store', // Disable caching, ensures fresh fetch every time
            });

            const data: ApiResponse = await response.json();

            if (response.ok) {
                invoice = data.invoice;
            }
        } catch (error) {
            console.error('Error fetching invoice data:', error);
        }

        if (!invoice) {
            // Handle case where invoice is not found or there's an error
            return <div>Invoice not found</div>;
        }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1>Profile</h1>
            <hr />
            <p className='text-4xl'>
                Profile Page
                <span className='p-2 rounded bg-green-500 text-black'>{invoiceId}</span>
            </p>

            <InvoicePage1 invoiceDetail={invoice}  download={false} />
        </div>
    );
};

export default UserProfilePage;
