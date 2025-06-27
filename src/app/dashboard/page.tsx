'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  role: string;
  businesses: string[];
  hasBusiness: boolean;
}

interface Invoice {
  _id: string;
  billNo: number;
  clientName: string;
  total: number;
  invoiceDate: string;
  balance: number;
  paid: number;
}

interface Client {
  _id: string;
  clientName: string;
  contact: string;
  address: string;
  totalAmount?: number;
}

interface Stock {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Business {
  _id: string;
  name: string;
  address: string;
  contact: string;
  clients: string[];
  invoices: string[];
  stocks: string[];
}

interface PaginatedData {
  items: any[];
  hasMore: boolean;
  page: number;
  loading: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'invoices' | 'clients' | 'stocks'>('overview');

  // Paginated data states
  const [invoicesData, setInvoicesData] = useState<PaginatedData>({
    items: [],
    hasMore: true,
    page: 1,
    loading: false
  });
  
  const [clientsData, setClientsData] = useState<PaginatedData>({
    items: [],
    hasMore: true,
    page: 1,
    loading: false
  });
  
  const [stocksData, setStocksData] = useState<PaginatedData>({
    items: [],
    hasMore: true,
    page: 1,
    loading: false
  });

  // Overview stats
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalClients: 0,
    totalStocks: 0
  });

  const fetchPaginatedData = useCallback(async (
    type: 'invoices' | 'clients' | 'stocks',
    page: number,
    businessId: string
  ) => {
    try {
      const response = await fetch(`/api/business/${type}?businessId=${businessId}&page=${page}&limit=6`);
      const data = await response.json();

      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return { items: [], hasMore: false, totalCount: 0 };
    }
  }, []);

  const loadMoreData = useCallback(async (type: 'invoices' | 'clients' | 'stocks') => {
    if (!business) return;
    
    const currentData = type === 'invoices' ? invoicesData : 
                       type === 'clients' ? clientsData : stocksData;
    
    if (currentData.loading || !currentData.hasMore) return;

    // Set loading state
    const setData = type === 'invoices' ? setInvoicesData :
                   type === 'clients' ? setClientsData : setStocksData;

    
    
    setData(prev => ({ ...prev, loading: true }));

    const data = await fetchPaginatedData(type, currentData.page, business._id);
    
    setData(prev => ({
      items: [...prev.items, ...data.items],
      hasMore: data.hasMore,
      page: prev.page + 1,
      loading: false
    }));
  }, [business, invoicesData, clientsData, stocksData, fetchPaginatedData]);

  // Intersection observer for infinite scroll
  const lastElementRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (activeSection === 'invoices') loadMoreData('invoices');
        else if (activeSection === 'clients') loadMoreData('clients');
        else if (activeSection === 'stocks') loadMoreData('stocks');
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [activeSection, loadMoreData]);

  // Initial data fetch
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/api/getUser');
        const data = await res.json();

        if (!data.user) {
          router.push('/login');
        } else {
          setUser(data.user);
          setBusiness(data.business);
          
          // Set overview stats
          if (data.business) {
            setStats({
              totalInvoices: data.business.invoices?.length || 0,
              totalClients: data.business.clients?.length || 0,
              totalStocks: data.business.stocks?.length || 0
            });
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  // Load initial data when section changes
  useEffect(() => {
    if (!business) return;

    const loadInitialData = async () => {
      if (activeSection === 'invoices' && invoicesData.items.length === 0) {
        setInvoicesData(prev => ({ ...prev, loading: true }));
        const data = await fetchPaginatedData('invoices', 1, business._id);
        setInvoicesData({
          items: data.items,
          hasMore: data.hasMore,
          page: 2,
          loading: false
        });
      } else if (activeSection === 'clients' && clientsData.items.length === 0) {
        setClientsData(prev => ({ ...prev, loading: true }));
        const data = await fetchPaginatedData('clients', 1, business._id);
        setClientsData({
          items: data.items,
          hasMore: data.hasMore,
          page: 2,
          loading: false
        });
      } else if (activeSection === 'stocks' && stocksData.items.length === 0) {
        setStocksData(prev => ({ ...prev, loading: true }));
        const data = await fetchPaginatedData('stocks', 1, business._id);
        setStocksData({
          items: data.items,
          hasMore: data.hasMore,
          page: 2,
          loading: false
        });
      }
    };

    loadInitialData();
  }, [activeSection, business, fetchPaginatedData, invoicesData.items.length, clientsData.items.length, stocksData.items.length]);

  if (loading) {
    return (
      <div className="h-svh flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="h-svh flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
            <p className="text-gray-600">You don't have a business registered yet. Let's get you started!</p>
          </div>
          <button
            onClick={() => router.push('/registerbizz')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Register Your Business
          </button>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid  grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Clients</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Stocks</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalStocks}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {invoicesData.items.map((invoice: Invoice, index) => (
          <div 
            key={invoice._id} 
            className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => router.push(`/invoices/${invoice._id}`)}
            ref={index === invoicesData.items.length - 1 ? lastElementRefCallback : null}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Bill #{invoice.billNo}</h4>
                <p className="text-sm text-gray-500">{invoice.clientName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">${invoice.total.toLocaleString()}</p>
                <div className="flex space-x-2 text-xs">
                  <span className="text-green-600">Paid: ${invoice.paid}</span>
                  {invoice.balance > 0 && (
                    <span className="text-red-600">Due: ${invoice.balance}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {invoicesData.loading && (
          <div className="px-6 py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
        
        {!invoicesData.hasMore && invoicesData.items.length > 0 && (
          <div className="px-6 py-4 text-center text-gray-500 text-sm">
            No more invoices to load
          </div>
        )}
        
        {invoicesData.items.length === 0 && !invoicesData.loading && (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Clients</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {clientsData.items.map((client: Client, index) => (
          <div 
            key={client._id} 
            className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => router.push(`/clients/${client._id}`)}
            ref={index === clientsData.items.length - 1 ? lastElementRefCallback : null}
          >
            <div className="flex items-center justify-between  ">
              <div >
                <h4 className="text-sm font-medium text-gray-900">{client.clientName}</h4>
                <p className="text-sm text-gray-500">{client.contact}</p>
                <p className="text-xs text-gray-400">{client.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${client.totalAmount?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-500">Total Amount</p>
              </div>
            </div>
          </div>
        ))}
        
        {clientsData.loading && (
          <div className="px-6 py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
        
        {!clientsData.hasMore && clientsData.items.length > 0 && (
          <div className="px-6 py-4 text-center text-gray-500 text-sm">
            No more clients to load
          </div>
        )}
        
        {clientsData.items.length === 0 && !clientsData.loading && (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No clients found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStocks = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Stocks</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {stocksData.items.map((stock: Stock, index) => (
          <div 
            key={stock._id} 
            className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => router.push(`/stocks/${stock._id}`)}
            ref={index === stocksData.items.length - 1 ? lastElementRefCallback : null}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{stock.name}</h4>
                <p className="text-sm text-gray-500">Quantity: {stock.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">${stock.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Price</p>
              </div>
            </div>
          </div>
        ))}
        
        {stocksData.loading && (
          <div className="px-6 py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
        
        {!stocksData.hasMore && stocksData.items.length > 0 && (
          <div className="px-6 py-4 text-center text-gray-500 text-sm">
            No more stocks to load
          </div>
        )}
        
        {stocksData.items.length === 0 && !stocksData.loading && (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No stocks found</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-[96vh] rounded-lg bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-lg shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                <div className="mt-2 flex flex-col sm:flex-row sm:space-x-6 space-y-1 sm:space-y-0">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contact:</span> {business.contact}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span> {business.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 ">
                <button 
                onClick={() => router.push('/invoicing')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  🧾Create Bill
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-400 transition-colors"
                >
                  🏠Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'invoices', label: 'Invoices', icon: '📄' },
              { id: 'clients', label: 'Clients', icon: '👥' },
              { id: 'stocks', label: 'Stocks', icon: '📦' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'invoices' && renderInvoices()}
          {activeSection === 'clients' && renderClients()}
          {activeSection === 'stocks' && renderStocks()}
        </div>
      </div>
    </div>
  );
}