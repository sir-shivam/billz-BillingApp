import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className=" min-h-[calc(100svh-8rem)] flex flex-col justify-center items-center text-center ">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Billz</h1>
      <p className="text-xl text-gray-600 mb-4 max-w-2xl">
        This is a personal project created by <span className="font-semibold text-blue-600">Shivam Krishnamohan Gupta</span>.
        The primary goal of this project is to make invoicing intuitive, easy to use, and accessible for everyone. It is designed to work seamlessly on any device, whether mobile, tablet, or desktop, ensuring business owners can manage their operations from anywhere.
      </p>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        With a focus on simplicity and efficiency, this solution aims to empower entrepreneurs by streamlining the invoicing process.
        We hope this project becomes a valuable tool for many business owners, helping them save time and improve productivity in their daily operations.
      </p>


      <div className="flex space-x-4">
        <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
          Sign Up
        </Link>
        <Link href="/login" className="bg-white hover:bg-gray-100 text-green-600 font-bold py-2 px-4 rounded border border-green-600 transition duration-300">
          Log In
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {['Stock Management', 'Invoicing', 'History Tracking', 'Multi-User Access'].map((feature) => (
          <div key={feature} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature}</h3>
            <p className="text-gray-600">Efficiently manage your business with our powerful {feature.toLowerCase()} tools.</p>
          </div>
        ))}
      </div>
      <Link href="/learn-more" className="mt-12 inline-flex items-center text-green-600 hover:text-green-700">
        Learn more about our features
        <ArrowRightIcon className="ml-2 h-5 w-5" />
      </Link>
    </div>
  )
}

