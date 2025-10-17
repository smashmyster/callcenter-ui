"use client";

import { useState, useEffect } from 'react';
import { Search, Bell, Upload, Filter, Phone, Ticket, FileText } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { DocumentCard } from '@/components/DocumentCard';
import { SectionHeader } from '@/components/SectionHeader';
import { FilePicker } from '@/components/FilePicker';
import { CallsTab } from '@/components/CallsTab';
import { JiraTicketsTab } from '@/components/JiraTicketsTab';
import { useDocuments, PolicyDocument } from '@/hooks/useDocuments';
import { useCalls } from '@/hooks/useCalls';
import { apiClient } from '@/utils/apiClient';

// Policy Document Types enum
enum PolicyDocumentType {
  CODE_OF_CONDUCT = 'CODE_OF_CONDUCT',
  DATA_PRIVACY_POLICY = 'DATA_PRIVACY_POLICY',
  IT_SECURITY_POLICY = 'IT_SECURITY_POLICY',
  REMOTE_WORK_POLICY = 'REMOTE_WORK_POLICY',
  ONBOARDING = 'ONBOARDING',
  PERFORMANCE = 'PERFORMANCE',
  LEAVE = 'LEAVE',
  EMPLOYEE_HANDBOOK = 'EMPLOYEE_HANDBOOK',
}

// Policy Document Parent IDs enum (from schema)
enum PolicyDocumentParentId {
  POLICY = 'POLICY',
  HR = 'HR',
  SALES = 'SALES',
  MARKETING = 'MARKETING',
  ENGINEERING = 'ENGINEERING',
  PRODUCT = 'PRODUCT',
  OPS = 'OPS',
  FINANCE = 'FINANCE',
  LEGAL = 'LEGAL',
  OTHER = 'OTHER',
}

// Mapping of section headers to parent IDs
const sectionToParentId: Record<string, PolicyDocumentParentId> = {
  'Policy Documents': PolicyDocumentParentId.POLICY,
  'HR Documents': PolicyDocumentParentId.HR,
  'Sales Documents': PolicyDocumentParentId.SALES,
  'Marketing Documents': PolicyDocumentParentId.MARKETING,
  'Engineering Documents': PolicyDocumentParentId.ENGINEERING,
  'Product Documents': PolicyDocumentParentId.PRODUCT,
  'Operations Documents': PolicyDocumentParentId.OPS,
  'Finance Documents': PolicyDocumentParentId.FINANCE,
  'Legal Documents': PolicyDocumentParentId.LEGAL,
  'Recently Viewed': PolicyDocumentParentId.OTHER, // Default for recently viewed
};

// Mapping of section headers to policy document types
const sectionToPolicyType: Record<string, PolicyDocumentType> = {
  'Policy Documents': PolicyDocumentType.CODE_OF_CONDUCT, // Default for policy section
  'HR Documents': PolicyDocumentType.ONBOARDING, // Default for HR section
  'Recently Viewed': PolicyDocumentType.EMPLOYEE_HANDBOOK, // Default for recently viewed
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'calls' | 'tickets' | 'documents'>('calls');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterModified, setFilterModified] = useState('Last Modified');
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [jiraTickets, setJiraTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Use the documents hook
  const {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocumentsBySection,
    searchDocuments,
    uploadDocument,
  } = useDocuments();
  const {
    calls,
    fetchCalls
  } = useCalls();
  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setInitialLoading(true);
      
      try {
        // Fetch documents
        await fetchDocuments();
        
        // Fetch calls
        await fetchCalls();
        
        // Fetch Jira tickets
        setTicketsLoading(true);
        setTicketsError(null);
        try {
          const response = await apiClient.get('/jira-tickets');
          console.log('response', response);
          
          setJiraTickets(response as any || []);
        } catch (error) {
          setTicketsError(error instanceof Error ? error.message : 'Failed to fetch tickets');
        } finally {
          setTicketsLoading(false);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Fetch Jira tickets (keep for manual refresh)
  const fetchJiraTickets = async () => {
    setTicketsLoading(true);
    setTicketsError(null);
    try {
      const response = await apiClient.get('/jira-tickets');
      console.log('response', response);
      
      setJiraTickets(response as any || []);
    } catch (error) {
      setTicketsError(error instanceof Error ? error.message : 'Failed to fetch tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm.trim()) {
      searchDocuments(searchTerm);
    } else {
      // fetchDocuments();
    }
  }, [searchTerm, searchDocuments]);
  // Mock data for recently viewed documents (fallback)
  const recentlyViewed = [
    {
      title: "Employee Handbook 2024",
      description: "Updated version of the company-wide employee handbook.",
      lastModified: "2 days ago",
      icon: "document" as const,
      fileUrl: undefined
    },
    {
      title: "Social Media Guidelines",
      description: "Rules and best practices for company social media accounts.",
      lastModified: "1 week ago",
      icon: "image" as const,
      fileUrl:undefined
    },
    {
      title: "Q3 Sales Report",
      description: "Comprehensive analysis of sales performance for the third quarter.",
      lastModified: "3 days ago",
      icon: "chart" as const,
      fileUrl: undefined
    }
  ];

  // Mock data for policy documents
  const policyDocuments = [
    { 
      title: "Code of Conduct", 
      description: "Company code of conduct and ethical guidelines",
      fileUrl: undefined
    },
    { 
      title: "Data Privacy Policy", 
      description: "Data protection and privacy policy",
      fileUrl: undefined
    },
    { 
      title: "IT Security Policy", 
      description: "Information technology security guidelines",
      fileUrl:undefined
    },
    { 
      title: "Remote Work Policy", 
      description: "Guidelines for remote work arrangements",
      fileUrl: undefined // No file URL - will show upload icon
    }
  ];

  // Mock data for HR documents
  const hrDocuments = [
    { 
      title: "Onboarding Checklist", 
      description: "New employee onboarding process",
      fileUrl: "/documents/onboarding-checklist.pdf"
    },
    { 
      title: "Performance Review Template", 
      description: "Employee performance evaluation form",
      fileUrl: "/documents/performance-review-template.pdf"
    },
    { 
      title: "Leave Request Form", 
      description: "Employee leave request and approval process",
      fileUrl: "/documents/leave-request-form.pdf"
    },
    { 
      title: "Employee Handbook", 
      description: "Comprehensive employee handbook and guidelines",
      fileUrl: undefined // No file URL - will show upload icon
    }
  ];

  const handleFileSelect = async (file: File) => {
    setSelectedFiles(prev => [...prev, file]);
    setIsUploading(true);
    
    try {
      // Show loading state
      // Upload the file to backend
      const uploadData = {
        title: file.name,
        description: `Uploaded document: ${file.name}`,
        type: PolicyDocumentType.EMPLOYEE_HANDBOOK,
        uploadedBy: 'user-123',
        version: '1.0',
        effectiveDate: new Date().toISOString(),
        parentId: PolicyDocumentParentId.OTHER, // Default parent ID for favorites
        headers: {
          originalFileName: file.name,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          source: 'dashboard-favorites',
          fileSize: file.size,
        },
      };

      const result = await uploadDocument(file, uploadData);
      
      // Refresh documents to show the newly uploaded document
      await fetchDocuments();
      
      
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileReplace = async (file: File, cardTitle: string, sectionTitle?: string) => {
    setIsUploading(true);
    
    try {
      // Determine policy document type based on section and card title
      let policyType = PolicyDocumentType.EMPLOYEE_HANDBOOK; // Default
      
      if (sectionTitle) {
        // Map specific card titles to policy types
        const cardToPolicyType: Record<string, PolicyDocumentType> = {
          'Code of Conduct': PolicyDocumentType.CODE_OF_CONDUCT,
          'Data Privacy Policy': PolicyDocumentType.DATA_PRIVACY_POLICY,
          'IT Security Policy': PolicyDocumentType.IT_SECURITY_POLICY,
          'Remote Work Policy': PolicyDocumentType.REMOTE_WORK_POLICY,
          'Onboarding Checklist': PolicyDocumentType.ONBOARDING,
          'Performance Review Template': PolicyDocumentType.PERFORMANCE,
          'Leave Request Form': PolicyDocumentType.LEAVE,
          'Employee Handbook': PolicyDocumentType.EMPLOYEE_HANDBOOK,
        };
        
        policyType = cardToPolicyType[cardTitle] || sectionToPolicyType[sectionTitle] || PolicyDocumentType.EMPLOYEE_HANDBOOK;
      }

      // Get parent ID based on section
      const parentId = sectionTitle ? sectionToParentId[sectionTitle] || PolicyDocumentParentId.OTHER : PolicyDocumentParentId.OTHER;

      // Prepare upload data
      const uploadData = {
        title: cardTitle,
        description: `Policy document for ${cardTitle}`,
        type: policyType,
        uploadedBy: 'user-123',
        version: '1.0',
        effectiveDate: new Date().toISOString(),
        parentId: parentId,
        headers: {
          originalFileName: file.name,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          source: 'dashboard-upload',
          cardTitle: cardTitle,
          sectionTitle: sectionTitle,
          policyType: policyType,
          parentId: parentId,
        },
      };

      // Upload using the hook
      const result = await uploadDocument(file, uploadData);
      
      // Refresh documents to show the newly uploaded document
      await fetchDocuments();
      
      alert(`Policy document "${cardTitle}" uploaded successfully as ${policyType}!`);
      
    } catch (error) {
      console.error('Failed to upload policy document:', error);
      alert('Failed to upload policy document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCardClick = (title: string) => {
    // You can add navigation logic here
  };

  // Get all documents for a section (both uploaded and not uploaded)
  const getDocumentsBySection = (sectionTitle: string) => {
    const expectedParentId = sectionToParentId[sectionTitle];
    
    // Get uploaded documents for this section
    const uploadedDocs = documents.filter(doc => {
      if (expectedParentId) {
        return doc.parentId === expectedParentId;
      }
      
      // Fallback to type-based filtering
      const sectionMapping: Record<string, string[]> = {
        'Policy Documents': ['CODE_OF_CONDUCT', 'DATA_PRIVACY_POLICY', 'IT_SECURITY_POLICY', 'REMOTE_WORK_POLICY'],
        'HR Documents': ['ONBOARDING', 'PERFORMANCE', 'LEAVE', 'EMPLOYEE_HANDBOOK'],
        'Recently Viewed': ['EMPLOYEE_HANDBOOK', 'CODE_OF_CONDUCT', 'ONBOARDING'],
      };
      
      const allowedTypes = sectionMapping[sectionTitle] || [];
      return allowedTypes.includes(doc.type);
    });

    // Define expected documents for each section
    const expectedDocuments = getExpectedDocumentsForSection(sectionTitle);
    
    // Merge uploaded documents with expected documents
    const allDocuments = expectedDocuments.map(expected => {
      const uploaded = uploadedDocs.find(doc => 
        doc.title.toLowerCase() === expected.title.toLowerCase() ||
        doc.fileName.toLowerCase().includes(expected.title.toLowerCase())
      );
      
      return {
        ...expected,
        id: uploaded?.id || `placeholder-${expected.title.toLowerCase().replace(/\s+/g, '-')}`,
        fileUrl: uploaded?.filePath,
        lastModified: uploaded ? new Date(uploaded.createdAt).toLocaleDateString() : '',
        isUploaded: !!uploaded,
        uploadedDoc: uploaded
      };
    });

    return allDocuments;
  };

  // Define expected documents for each section
  const getExpectedDocumentsForSection = (sectionTitle: string) => {
    const sectionDocuments: Record<string, Array<{title: string, description: string}>> = {
      'Policy Documents': [
        { title: 'Code of Conduct', description: 'Company code of conduct and ethical guidelines' },
        { title: 'Data Privacy Policy', description: 'Data protection and privacy policy' },
        { title: 'IT Security Policy', description: 'Information technology security guidelines' },
        { title: 'Remote Work Policy', description: 'Guidelines for remote work arrangements' }
      ],
      'HR Documents': [
        { title: 'Onboarding Checklist', description: 'New employee onboarding process' },
        { title: 'Performance Review Template', description: 'Employee performance evaluation form' },
        { title: 'Leave Request Form', description: 'Employee leave request and approval process' },
        { title: 'Employee Handbook', description: 'Comprehensive employee handbook and guidelines' }
      ],
      'Sales Documents': [
        { title: 'Sales Process Guide', description: 'Step-by-step sales process documentation' },
        { title: 'Customer Onboarding', description: 'Customer onboarding and setup procedures' },
        { title: 'Sales Training Manual', description: 'Sales training and development materials' },
        { title: 'Customer Success Playbook', description: 'Customer success strategies and procedures' }
      ],
      'Engineering Documents': [
        { title: 'Development Guidelines', description: 'Software development best practices and guidelines' },
        { title: 'Code Review Process', description: 'Code review standards and procedures' },
        { title: 'API Documentation', description: 'API design and implementation guidelines' },
        { title: 'Testing Standards', description: 'Software testing procedures and standards' }
      ]
    };

    return sectionDocuments[sectionTitle] || [];
  };

  // Get recently viewed documents (last 3 uploaded documents)
  const getRecentlyViewedDocuments = () => {
    const recentDocs = documents
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return recentDocs.map(doc => ({
      id: doc.id,
      title: doc.title,
      description: doc.description || '',
      lastModified: new Date(doc.createdAt).toLocaleDateString(),
      fileUrl: doc.filePath,
      isUploaded: true,
      uploadedDoc: doc
    }));
  };

  // Show loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="flex-1 overflow-auto p-6 max-h-[90vh] min-h-[90vh] flex items-center justify-center" style={{ backgroundColor: '#212121' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      
      <div className="flex-1 overflow-auto p-6  max-h-[90vh] min-h-[90vh]" style={{ backgroundColor: '#212121' }}>
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
  {/* Welcome Section with Gradient Text */}
  <div className="group">
    <h1 className="cursor-pointer text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2 transition-all duration-300 group-hover:scale-105">
      Welcome, John!
    </h1>
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span>Online • Ready to work</span>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex items-center gap-3">
    {/* Notification Bell with Badge */}
    <div className="relative group">
      <button className="cursor-pointer p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 shadow-lg">
        <Bell size={20} />
      </button>
      {/* Notification Badge */}
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse shadow-lg">
        0
      </span>
    </div>

    {/* Upload Button with Enhanced Design */}
    <button 
      onClick={() => setShowFilePicker(true)}
      disabled={isUploading}
      className={`cursor-pointer px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 transform relative overflow-hidden group ${
        isUploading 
          ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed backdrop-blur-xl border border-gray-600/30' 
          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 border border-green-500/20'
      }`}
    >
      {/* Shimmer Effect */}
      {!isUploading && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      )}
      
      {/* Icon with Animation */}
      <Upload 
        size={18} 
        className={`relative z-10 transition-all duration-300 ${
          isUploading ? 'animate-bounce' : 'group-hover:-translate-y-0.5'
        }`}
      />
      
      {/* Text */}
      <span className="relative z-10">
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </span>

      {/* Loading Spinner Overlay */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700/80 backdrop-blur-sm">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  </div>
</div>

<style jsx>{`
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`}</style>


            {/* Tabs */}
       <div className="flex gap-2 mb-8 bg-white/5 backdrop-blur-2xl rounded-2xl p-2 border border-white/10 shadow-2xl">
  <button
    onClick={() => setActiveTab('calls')}
    className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${
      activeTab === 'calls'
        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105'
        : 'text-gray-400 hover:text-white hover:bg-white/10'
    }`}
  >
    {/* Active indicator line */}
    {activeTab === 'calls' && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50 animate-slideIn"></div>
    )}
    
    {/* Icon with animation */}
    <Phone 
      size={18} 
      className={`transition-transform duration-300 ${
        activeTab === 'calls' ? 'scale-110' : 'group-hover:scale-110'
      }`}
    />
    
    <span>Calls</span>
    
    {/* Count badge */}
    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
      activeTab === 'calls'
        ? 'bg-white/20 text-white'
        : 'bg-white/10 text-gray-400 group-hover:bg-white/15 group-hover:text-gray-300'
    }`}>
      {calls.length}
    </span>

    {/* Shimmer effect on hover */}
    {activeTab !== 'calls' && (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    )}
  </button>

  <button
    onClick={() => setActiveTab('tickets')}
    className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${
      activeTab === 'tickets'
        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg transform scale-105'
        : 'text-gray-400 hover:text-white hover:bg-white/10'
    }`}
  >
    {/* Active indicator line */}
    {activeTab === 'tickets' && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50 animate-slideIn"></div>
    )}
    
    {/* Icon with animation */}
    <Ticket 
      size={18} 
      className={`transition-transform duration-300 ${
        activeTab === 'tickets' ? 'scale-110' : 'group-hover:scale-110'
      }`}
    />
    
    <span>Jira Tickets</span>
    
    {/* Count badge */}
    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
      activeTab === 'tickets'
        ? 'bg-white/20 text-white'
        : 'bg-white/10 text-gray-400 group-hover:bg-white/15 group-hover:text-gray-300'
    }`}>
      {jiraTickets.length}
    </span>

    {/* Shimmer effect on hover */}
    {activeTab !== 'tickets' && (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    )}
  </button>

  <button
    onClick={() => setActiveTab('documents')}
    className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${
      activeTab === 'documents'
        ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg transform scale-105'
        : 'text-gray-400 hover:text-white hover:bg-white/10'
    }`}
  >
    {/* Active indicator line */}
    {activeTab === 'documents' && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50 animate-slideIn"></div>
    )}
    
    {/* Icon with animation */}
    <FileText 
      size={18} 
      className={`transition-transform duration-300 ${
        activeTab === 'documents' ? 'scale-110' : 'group-hover:scale-110'
      }`}
    />
    
    <span>Documents</span>
    
    {/* Count badge */}
    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
      activeTab === 'documents'
        ? 'bg-white/20 text-white'
        : 'bg-white/10 text-gray-400 group-hover:bg-white/15 group-hover:text-gray-300'
    }`}>
      {documents.length}
    </span>

    {/* Shimmer effect on hover */}
    {activeTab !== 'documents' && (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    )}
  </button>
</div>

{/* Add this animation if not already present in your existing styles */}
<style jsx>{`
  @keyframes slideIn {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`}</style>


            {/* Search and Filters - Only show for documents tab */}
            {activeTab === 'documents' && (
  <div className="flex items-center gap-4 mb-8 animate-fadeIn">
    {/* Search Bar - Enhanced Design Only */}
    <div className="flex-1 relative group">
      <Search 
        size={18} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" 
      />
      <input
        type="text"
        placeholder="Search documents, policies, and more..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 shadow-lg focus:shadow-2xl"
      />
    </div>

    {/* Filter Dropdowns - Enhanced Design Only */}
    <div className="flex items-center gap-3">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="px-4 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 cursor-pointer shadow-lg hover:bg-white/10 hover:scale-105"
      >
        <option className="bg-gray-900">All Types</option>
        <option className="bg-gray-900">PDF</option>
        <option className="bg-gray-900">DOC</option>
        <option className="bg-gray-900">Images</option>
      </select>

      <select
        value={filterModified}
        onChange={(e) => setFilterModified(e.target.value)}
        className="px-4 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 cursor-pointer shadow-lg hover:bg-white/10 hover:scale-105"
      >
        <option className="bg-gray-900">Last Modified</option>
        <option className="bg-gray-900">Recently Added</option>
        <option className="bg-gray-900">Alphabetical</option>
      </select>
    </div>
  </div>
)}

<style jsx>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
  }
`}</style>

          </div>

          {/* Tab Content */}
          {activeTab === 'calls' && (
            <CallsTab 
              calls={calls}
              loading={false}
              error={null}
              onRefresh={fetchCalls}
            />
          )}

          {activeTab === 'tickets' && (
            <JiraTicketsTab 
              tickets={jiraTickets}
              loading={false}
              error={null}
              onRefresh={fetchJiraTickets}
            />
          )}

          {activeTab === 'documents' && (
            <>
              {/* Recently Viewed Section */}
              <div className="mb-8">
                <SectionHeader title="Recently Viewed" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {loading || isUploading ? (
                    <div className="col-span-full text-center text-gray-400">
                      {isUploading ? 'Uploading document...' : 'Loading documents...'}
                    </div>
                  ) : error ? (
                    <div className="col-span-full text-center text-red-400">Error: {error}</div>
                  ) : (
                    <>
                      {getRecentlyViewedDocuments().map((doc, index) => (
                        <DocumentCard
                          key={doc.id}
                          title={doc.title}
                          description={doc.description}
                          lastModified={doc.lastModified}
                          icon="document"
                          fileUrl={doc.fileUrl}
                          onClick={() => handleCardClick(doc.title)}
                          onDownload={doc.isUploaded ? () => handleDownload(doc.fileUrl!, doc.uploadedDoc!.fileName) : undefined}
                          onFileReplace={(file) => handleFileReplace(file, doc.title, 'Recently Viewed')}
                        />
                      ))}
                      <DocumentCard
                        title="Add to Favorites"
                        description=""
                        lastModified=""
                        isAddCard={true}
                        onFileSelect={() => setShowFilePicker(true)}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Policy Documents Section */}
              <div className="mb-8">
                <SectionHeader title="Policy Documents" showViewAll={true} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getDocumentsBySection('Policy Documents').map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      title={doc.title}
                      description={doc.description}
                      lastModified={doc.lastModified}
                      fileUrl={doc.fileUrl}
                      onClick={() => handleCardClick(doc.title)}
                      onDownload={doc.isUploaded ? () => handleDownload(doc.fileUrl!, doc.uploadedDoc!.fileName) : undefined}
                      onFileReplace={(file) => handleFileReplace(file, doc.title, 'Policy Documents')}
                    />
                  ))}
                </div>
              </div>

              {/* HR Documents Section */}
              <div className="mb-8">
                <SectionHeader title="HR Documents" showViewAll={true} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getDocumentsBySection('HR Documents').map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      title={doc.title}
                      description={doc.description}
                      lastModified={doc.lastModified}
                      fileUrl={doc.fileUrl}
                      onClick={() => handleCardClick(doc.title)}
                      onDownload={doc.isUploaded ? () => handleDownload(doc.fileUrl!, doc.uploadedDoc!.fileName) : undefined}
                      onFileReplace={(file) => handleFileReplace(file, doc.title, 'HR Documents')}
                    />
                  ))}
                </div>
              </div>

              {/* Sales Documents Section */}
              <div className="mb-8">
                <SectionHeader title="Sales Documents" showViewAll={true} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getDocumentsBySection('Sales Documents').map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      title={doc.title}
                      description={doc.description}
                      lastModified={doc.lastModified}
                      fileUrl={doc.fileUrl}
                      onClick={() => handleCardClick(doc.title)}
                      onDownload={doc.isUploaded ? () => handleDownload(doc.fileUrl!, doc.uploadedDoc!.fileName) : undefined}
                      onFileReplace={(file) => handleFileReplace(file, doc.title, 'Sales Documents')}
                    />
                  ))}
                </div>
              </div>

              {/* Engineering Documents Section */}
              <div className="mb-8">
                <SectionHeader title="Engineering Documents" showViewAll={true} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getDocumentsBySection('Engineering Documents').map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      title={doc.title}
                      description={doc.description}
                      lastModified={doc.lastModified}
                      fileUrl={doc.fileUrl}
                      onClick={() => handleCardClick(doc.title)}
                      onDownload={doc.isUploaded ? () => handleDownload(doc.fileUrl!, doc.uploadedDoc!.fileName) : undefined}
                      onFileReplace={(file) => handleFileReplace(file, doc.title, 'Engineering Documents')}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="mb-8 bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Selected Files</h3>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-2">
                    <span className="text-white text-sm">{file.name}</span>
                    <button
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="ml-2 p-1 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Picker Modal */}
      <FilePicker
        isOpen={showFilePicker}
        onClose={() => setShowFilePicker(false)}
        onFileSelect={handleFileSelect}
      />
    </>
  );
}
