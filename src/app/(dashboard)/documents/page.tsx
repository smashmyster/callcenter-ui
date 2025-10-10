"use client";

import { useState } from 'react';
import { Search, Bell, Upload, Filter } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { DocumentCard } from '@/components/DocumentCard';
import { SectionHeader } from '@/components/SectionHeader';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterModified, setFilterModified] = useState('Last Modified');

  // Mock data for recently viewed documents
  const recentlyViewed = [
    {
      title: "Employee Handbook 2024",
      description: "Updated version of the company-wide employee handbook.",
      lastModified: "2 days ago",
      icon: "document" as const
    },
    {
      title: "Social Media Guidelines",
      description: "Rules and best practices for company social media accounts.",
      lastModified: "1 week ago",
      icon: "image" as const
    },
    {
      title: "Q3 Sales Report",
      description: "Comprehensive analysis of sales performance for the third quarter.",
      lastModified: "3 days ago",
      icon: "chart" as const
    }
  ];

  // Mock data for policy documents
  const policyDocuments = [
    { title: "Code of Conduct", description: "Company code of conduct and ethical guidelines" },
    { title: "Data Privacy Policy", description: "Data protection and privacy policy" },
    { title: "IT Security Policy", description: "Information technology security guidelines" }
  ];

  // Mock data for HR documents
  const hrDocuments = [
    { title: "Onboarding Checklist", description: "New employee onboarding process" },
    { title: "Performance Review Template", description: "Employee performance evaluation form" },
    { title: "Leave Request Form", description: "Employee leave request and approval process" }
  ];

  return (
    <>
      <TopBar title="Dashboard" />
      
      <div className="flex-1 overflow-auto p-6 min-h-screen" style={{ backgroundColor: '#212121' }}>
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-white text-3xl font-bold">Welcome, John!</h1>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell size={20} />
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Upload size={16} />
                  Upload Document
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents, policies, and more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option>All Types</option>
                  <option>PDF</option>
                  <option>DOC</option>
                  <option>Images</option>
                </select>
                <select
                  value={filterModified}
                  onChange={(e) => setFilterModified(e.target.value)}
                  className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option>Last Modified</option>
                  <option>Recently Added</option>
                  <option>Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recently Viewed Section */}
          <div className="mb-8">
            <SectionHeader title="Recently Viewed" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyViewed.map((doc, index) => (
                <DocumentCard
                  key={index}
                  title={doc.title}
                  description={doc.description}
                  lastModified={doc.lastModified}
                  icon={doc.icon}
                />
              ))}
              <DocumentCard
                title="Add to Favorites"
                description=""
                lastModified=""
                isAddCard={true}
              />
            </div>
          </div>

          {/* Policy Documents Section */}
          <div className="mb-8">
            <SectionHeader title="Policy Documents" showViewAll={true} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policyDocuments.map((doc, index) => (
                <DocumentCard
                  key={index}
                  title={doc.title}
                  description={doc.description}
                  lastModified=""
                />
              ))}
            </div>
          </div>

          {/* HR Documents Section */}
          <div className="mb-8">
            <SectionHeader title="HR Documents" showViewAll={true} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hrDocuments.map((doc, index) => (
                <DocumentCard
                  key={index}
                  title={doc.title}
                  description={doc.description}
                  lastModified=""
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}