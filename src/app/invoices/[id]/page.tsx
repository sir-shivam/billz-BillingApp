// /app/invoices/[id]/page.tsx

"use client";
import { FC } from "react";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InvoicePage from "@/app/components/DwnBtn"; // Adjust the path if needed
import axios from "axios";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  // const router = useRouter();

  const [invoiceDetail, setInvoiceDetail] = useState<any | null>(null);
  const [userBusinessId, setUserBusinessId] = useState<string | null>(null);
  const [editAllowed, setEditAllowed] = useState(false);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`/api/invoices/i/${id}`);
const invoice = res.data.invoice;

invoice.invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

setInvoiceDetail(invoice);
    } catch (err) {
      console.error("Failed to fetch invoice:", err);
    }
  };

  const fetchUserBusiness = async () => {
    try {
      const res = await axios.get("/api/getUser");
      const businessId = res.data.business?._id;
      setUserBusinessId(businessId);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  useEffect(() => {
    fetchInvoice();
    fetchUserBusiness();
  }, []);

  useEffect(() => {
    if (invoiceDetail && userBusinessId) {
      setEditAllowed(invoiceDetail.businessId === userBusinessId);
    }
  }, [invoiceDetail, userBusinessId]);

  if (!invoiceDetail) return <div className="p-4">Loading invoice...</div>;

  const handleClose = () => {
    router.push("/invoices");
  };

  return (
    <div className="relative h-screen ">
      <InvoicePage
        invoiceDetail={invoiceDetail}
        butFun={handleClose}
        download={false}
        invoiceId={id}
      />

      {editAllowed && (
        <div className="absolute top-5 right-5 z-20">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600"
            onClick={() => router.push(`/invoices/edit/${id}`)}
          >
            Edit Invoice
          </button>
        </div>
      )}
    </div>
  );
};


