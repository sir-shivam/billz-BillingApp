"use client"

import { useRouter } from "next/navigation"
// import { button } from "@/components/ui/button"
import { Edit, ArrowLeft } from "lucide-react"

interface EditbuttonProps {
  invoiceId: string
}

export default function Editbutton({ invoiceId }: EditbuttonProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/invoices/edit/${invoiceId}`)
  }

  const handleBack = () => {
    router.push("/invoices")
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        // variant="outline"
        onClick={handleBack}
        className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Invoices
      </button>
      <button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
        <Edit className="w-4 h-4 mr-2" />
        Edit Invoice
      </button>
    </div>
  )
}
