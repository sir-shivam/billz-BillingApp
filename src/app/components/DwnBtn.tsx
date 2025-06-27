"use client"

import React, { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toJpeg } from 'html-to-image';

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

interface InvoicePageProps {
  invoiceDetail: {
    billNo: number;
    clientName: string;
    invoiceDate: string;
    balance: number;
    paid: number;
    items: Item[];
    extra: Extra[];
    notes: string;
    total: number;
  };
  butFun: () => void;
  download: boolean;
  invoiceId: string;
}

const InvoicePage: React.FC<InvoicePageProps> = ({ invoiceDetail, butFun, download, invoiceId }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  console.log(invoiceId, "this is id");
  console.log(download, "download");

  const handleDownloadJPG = async () => {
    if (invoiceRef.current) {
      try {
        // Wait for any pending renders
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const dataUrl = await toJpeg(invoiceRef.current, {
          quality: 0.8,
          pixelRatio: 2, // Higher pixel ratio for better quality
          width: 375, // Mobile width (iPhone standard)
          height: invoiceRef.current.scrollHeight, // Use scroll height for full content
          style: {
            // Ensure consistent styling during capture
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: '375px',
            maxWidth: '375px',
            minWidth: '375px',
          },
          // Skip elements that might cause issues
          skipFonts: false,
          canvasWidth: 375,
          canvasHeight: invoiceRef.current.scrollHeight,
        });

        const blob = await (await fetch(dataUrl)).blob();

        const formData = new FormData();
        formData.append('file', blob);
        formData.append('fileName', `invoice_${invoiceId}.png`);
        formData.append('invoiceId', invoiceId);

        const res = await fetch('/api/upload-invoice-image', {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();
        console.log("✅ Cloudinary URL:", result.url);
      } catch (error) {
        console.error("❌ Error generating/uploading invoice:", error);
        // Fallback to html2canvas if toJpeg fails
        await handleDownloadJPGFallback();
      }
    }
  };
  const downloadBill = async () => {
  if (invoiceRef.current) {
    try {
      const width = invoiceRef.current.scrollWidth;
      const height = invoiceRef.current.scrollHeight;

      const dataUrl = await toJpeg(invoiceRef.current, {
        quality: 0.8,
        pixelRatio: 2,
        width,
        height,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${width}px`,
          maxWidth: `${width}px`,
          minWidth: `${width}px`,
        },
        canvasWidth: width,
        canvasHeight: height,
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `invoice_${invoiceId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }
};



  const handleDownloadJPGFallback = async () => {
    if (invoiceRef.current) {
      try {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2, // Higher scale for better quality
          width: 375, // Mobile width
          height: invoiceRef.current.scrollHeight,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc, element) => {
            // Ensure the cloned element has consistent styling
            element.style.width = '375px';
            element.style.maxWidth = '375px';
            element.style.minWidth = '375px';
            element.style.transform = 'scale(1)';
          }
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append('file', blob);
            formData.append('fileName', `invoice_${invoiceId}.png`);
            formData.append('invoiceId', invoiceId);

            const res = await fetch('/api/upload-invoice-image', {
              method: 'POST',
              body: formData,
            });

            const result = await res.json();
            console.log("✅ Cloudinary URL (fallback):", result.url);
          }
        }, 'image/png', 0.9);
      } catch (error) {
        console.error("❌ Fallback method also failed:", error);
      }
    }
  };

  useEffect(() => {
    if (invoiceRef.current && download) {
      // Add a small delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        handleDownloadJPG();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [download]);

  const handleDownloadPDF = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        width: 375,
        height: invoiceRef.current.scrollHeight,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoiceId}.pdf`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="relative w-full max-w-sm max-h-[95vh] overflow-auto">
        <button
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-red-600 z-10 shadow-lg"
          onClick={butFun}
        >
          ×
        </button>
        
        <div className="text-black font-sans">
          {/* Invoice Container with fixed width for consistent capture */}
          <div
            ref={invoiceRef}
            className="bg-white border border-gray-300 rounded-lg shadow-lg"
            style={{
              width: '375px', // Mobile width (iPhone standard)
              maxWidth: '375px',
              minWidth: '375px',
              margin: '0 auto',
              padding: '16px',
              fontSize: '12px',
              lineHeight: '1.3',
            }}
          >
            {/* Business Details */}
            <div className="text-center border-b pb-3 mb-3">
              <h1 className="text-lg font-bold mb-1">Shree Balaji Fruit & Vegetables</h1>
              <p className="text-xs mb-0.5">S-4, Anand Nagar, Vasai (West)</p>
              <p className="text-xs">Phone: 9730419160</p>
            </div>

            {/* Client and Invoice Details */}
            <div className="text-xs mb-3">
              <h2 className="text-sm font-semibold mb-2">Invoice Details</h2>
              <div className="space-y-1">
                <p><span className="font-bold">Client:</span> {invoiceDetail.clientName}</p>
                <p><span className="font-bold">Date:</span> {invoiceDetail.invoiceDate}</p>
                <p><span className="font-bold">Invoice #:</span> {invoiceDetail.billNo}</p>
              </div>
            </div>

            {/* Invoice Table - Mobile Optimized */}
            <div className="mb-3">
              <table className="w-full border-collapse border border-gray-300 text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-1 py-1 text-left" style={{ width: '35%' }}>Item</th>
                    <th className="border border-gray-300 px-1 py-1 text-center" style={{ width: '13%' }}>Carat</th>
                    <th className="border border-gray-300 px-1 py-1 text-center" style={{ width: '13%' }}>Kg</th>
                    <th className="border border-gray-300 px-1 py-1 text-center" style={{ width: '13%' }}>₹/Kg</th>
                    <th className="border border-gray-300 px-1 py-1 text-center" style={{ width: '13%' }}>₹/Car</th>
                    <th className="border border-gray-300 px-1 py-1 text-center" style={{ width: '13%' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceDetail.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-1 py-1">
                        <div className="font-bold text-xs leading-tight">{item.description}</div>
                        <div className="text-xs text-gray-600 leading-tight">C:{item.comm}</div>
                        <div className="text-xs text-gray-600 leading-tight">F:{item.fare}</div>
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center text-xs">{item.carat}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center text-xs">{item.quantity}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center text-xs">{item.price}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center text-xs">{item.perCarat}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">₹{item.eachItemTotal}</td>
                    </tr>
                  ))}
                  {invoiceDetail.extra.map((item, index) => (
                    <tr key={`extra-${index}`}>
                      <td className="border border-gray-300 px-1 py-1 font-semibold text-xs" colSpan={4}>
                        {item.description}
                      </td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes and Total - Mobile Optimized */}
            <div className="text-xs space-y-1">
              <p><span className="font-bold">Previous Balance:</span> ₹{invoiceDetail.balance}</p>
              <p><span className="font-bold">Notes:</span> {invoiceDetail.notes}</p>
              <div className="border-t pt-2 mt-2 space-y-1">
                <p className="text-sm"><span className="font-bold">Total:</span> ₹{invoiceDetail.total + invoiceDetail.balance}</p>
                <p><span className="font-bold">Paid:</span> ₹{invoiceDetail.paid}</p>
                <p className="font-bold text-sm text-orange-800">
                  <span className="font-bold">Bill Balance:</span> ₹{invoiceDetail.total + invoiceDetail.balance - invoiceDetail.paid}
                </p>
              </div>
            </div>
          </div>

          {/* Download Buttons - Mobile Optimized */}
          <div className="flex justify-center mt-3 space-x-2">
            <button
              onClick={handleDownloadJPG}
              className={`bg-green-500 text-white px-3 py-2 text-sm rounded shadow hover:bg-green-600 flex-1 max-w-xs ${download? "hidden" : "hidden" }`}
            >
              📱 Save
            </button>
            <button
              onClick={downloadBill}
              className= {`bg-green-500 text-white px-3 py-2 text-sm rounded shadow hover:bg-green-600 flex-1 max-w-xs `}
            >
              📄 Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;