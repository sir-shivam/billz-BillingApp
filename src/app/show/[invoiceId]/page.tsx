// // src/app/show/[invoiceId]/page.tsx
// import { Metadata } from 'next';
// import InvoicePage1 from '@/app/components/serverButt';
// import React from 'react';

// // Define the structure for the route parameters
// interface Params {
//     invoiceId: string;
// }

// // Define the API response structure
// interface ApiResponse {
//     message: string;
//     invoice: InvoiceDetail;
// }

// interface InvoiceDetail {
//     billNo: number;
//     clientName: string;
//     invoiceDate: string;
//     balance: number;
//     paid: number;
//     items: Item[];
//     extra: Extra[];
//     notes: string;
//     total: number;
// }

// interface Item {
//     description: string;
//     comm: number;
//     fare: number;
//     quantity: number;
//     price: number;
//     eachItemTotal: number;
//     carat: number;
//     perCarat: number;
// }

// interface Extra {
//     description: string;
//     amount: number;
// }

// // Generate metadata for SEO
// export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
//     const { invoiceId } = params;
//     return {
//         title: `Invoice view`,
//         description: `View details for invoice ID ${invoiceId}.`,
//     };
// }

// // Fetch the invoice data
// async function fetchInvoiceData(invoiceId: string): Promise<InvoiceDetail | null> {
//     try {
//         // const url = `https://billz-billing-app.vercel.app/api/invoices/find?invoiceId=${encodeURIComponent(invoiceId)}`;
//         const url = `http://localhost:3000/api/invoices/find?invoiceId=${encodeURIComponent(invoiceId)}`; 
//         const response = await fetch(url, { cache: 'no-store' });

//         if (response.ok) {
//             const data: ApiResponse = await response.json();
//             return data.invoice;
//         }
//     } catch (error) {
//         console.error('Error fetching invoice data:', error);
//     }
//     return null;
// }

// // Page component
// const UserProfilePage = async ({ params }: { params: Params }) => {
//     const { invoiceId } = params;

//     // Fetch the invoice data
//     const invoice = await fetchInvoiceData(invoiceId);

//     if (!invoice) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen py-2">
//                 <h1>Invoice Not Found</h1>
//                 <p>The requested invoice could not be found. Please check the ID and try again.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen py-2">
//             <h1>Invoice Details</h1>
//             <p className="text-lg">
//                 Viewing details for invoice ID: <strong>{invoiceId}</strong>
//             </p>
//             <InvoicePage1 invoiceDetail={invoice} download={false} />
//         </div>
//     );
// };

// export default UserProfilePage;
