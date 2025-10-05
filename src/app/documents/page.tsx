"use client";

import { useState } from "react";
import { FileText, Upload, Plus, Search } from "lucide-react";
import { DragDropWrapper } from "@/components/DragDropWrapper";
import { useFileUpload } from "@/hooks/useFileUpload";



const documentCategories = [
  {
    id: "policies-compliance",
    name: "Policies & Compliance",
    icon: "🛡️",
    subsections: [
      { id: "company-policies", name: "Company Policies", description: "AUP, Code of Conduct" },
      { id: "security-policies", name: "Security Policies", description: "Access Control, Password, Encryption" },
      { id: "privacy-data", name: "Privacy & Data", description: "POPIA/GDPR, DPIAs" },
      { id: "incident-dr", name: "Incident & DR", description: "Incident Response Plan, BCP/DR" },
      { id: "vendor-risk", name: "Vendor/Risk", description: "Vendor Management, Risk Register" },
      { id: "public-policies", name: "Public Policies", description: "Privacy Policy, Terms, DPA—website-ready" },
    ]
  },
  {
    id: "customer-relations",
    name: "Customer Relations",
    icon: "👥",
    subsections: [
      { id: "onboarding", name: "Onboarding", description: "Playbooks, success plans" },
      { id: "slas-olas", name: "SLAs/OLAs", description: "Escalation paths" },
      { id: "support", name: "Support", description: "Runbooks, canned responses, macros" },
      { id: "qbr-renewal", name: "QBR/Renewal", description: "QBR decks, renewal notes, case studies" },
    ]
  },
  {
    id: "sales-partnerships",
    name: "Sales & Partnerships",
    icon: "💼",
    subsections: [
      { id: "sales-materials", name: "Sales Materials", description: "ICP, pricing, pitch decks, proposals" },
      { id: "partnerships", name: "Partnerships", description: "Partner agreements, channel docs" },
      { id: "competitive", name: "Competitive Intel", description: "Objection handling" },
    ]
  },
  {
    id: "product-ux",
    name: "Product & UX",
    icon: "🎨",
    subsections: [
      { id: "product-docs", name: "Product Docs", description: "PRDs, specs, roadmaps, release notes" },
      { id: "user-research", name: "User Research", description: "Personas, usability test reports" },
      { id: "design", name: "Design", description: "Copy docs, UX guidelines" },
    ]
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "⚙️",
    subsections: [
      { id: "architecture", name: "Architecture", description: "Diagrams, ADRs (decision records)" },
      { id: "api-docs", name: "API Docs", description: "OpenAPI, SDK notes" },
      { id: "sdlc", name: "Secure SDLC", description: "Code review checklists" },
      { id: "runbooks", name: "Runbooks", description: "Deploy, rollback, hotfix, SRE postmortems" },
    ]
  },
  {
    id: "data-ai",
    name: "Data & AI/ML",
    icon: "🤖",
    subsections: [
      { id: "models", name: "Models", description: "Model cards, evaluation reports" },
      { id: "prompts", name: "Prompts", description: "Prompt libraries, safety notes" },
      { id: "data-schemas", name: "Data Schemas", description: "Migration plans" },
      { id: "datasets", name: "Datasets", description: "Documentation, retention rules" },
    ]
  },
  {
    id: "devops-infrastructure",
    name: "DevOps & Infrastructure",
    icon: "🏗️",
    subsections: [
      { id: "environments", name: "Environments", description: "Dev/Staging/Pilot/Prod overviews" },
      { id: "cicd", name: "CI/CD", description: "IaC modules, secrets mgmt procedures" },
      { id: "observability", name: "Observability", description: "Dashboards, alerts catalogs" },
      { id: "certificates", name: "Certificates & DNS", description: "Certbot steps, renewal" },
    ]
  },
  {
    id: "operations",
    name: "Operations (SOPs)",
    icon: "📋",
    subsections: [
      { id: "sops", name: "Standard Procedures", description: "Day-to-day SOPs" },
      { id: "checklists", name: "Checklists", description: "Release, on-call, security scans" },
      { id: "procurement", name: "Procurement", description: "Asset processes" },
    ]
  },
  {
    id: "legal",
    name: "Legal",
    icon: "⚖️",
    subsections: [
      { id: "contracts", name: "Contracts", description: "MSAs, DPAs, NDAs, SOW templates" },
      { id: "playbooks", name: "Contract Playbooks", description: "Clause libraries" },
    ]
  },
  {
    id: "finance",
    name: "Finance",
    icon: "💰",
    subsections: [
      { id: "budgets", name: "Budgets/Forecasts", description: "Invoices, vendor quotes" },
      { id: "cost-reports", name: "Cost Reports", description: "Cloud spend, tooling" },
    ]
  },
  {
    id: "hr-admin",
    name: "HR & Admin",
    icon: "👤",
    subsections: [
      { id: "hiring", name: "Hiring", description: "Kits, onboarding, role ladders" },
      { id: "policies", name: "Policies", description: "Leave policies, performance templates" },
    ]
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "📢",
    subsections: [
      { id: "brand", name: "Brand", description: "Assets, messaging, campaign briefs" },
      { id: "content", name: "Content", description: "Web/SEO content, social calendars" },
    ]
  },
  {
    id: "pilots-research",
    name: "Pilots & Research",
    icon: "🔬",
    subsections: [
      { id: "pilots", name: "Pilots", description: "Charters, success criteria, timelines" },
      { id: "research", name: "Research", description: "Results summaries, learnings, roll-out decisions" },
    ]
  },
];

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    attachedFiles,
    addFiles,
    removeFile,
    clearAllFiles,
    updateFilesWithRemotePaths
  } = useFileUpload();

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && selectedCategory && selectedSubsection) {
      // Add all files to the attached files list
      addFiles(files);

      // Upload all files to backend with category and subsection
      try {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });
        formData.append('category', selectedCategory);
        formData.append('subsection', selectedSubsection);
        
        const response = await fetch(`http://localhost:8787/documents/uploadMultiple`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const result = await response.json();
        console.log('Documents uploaded successfully:', result);
        
        // Update all files with their remote paths
        updateFilesWithRemotePaths(files, result.results);
      } catch (error) {
        console.error('Failed to upload files:', error);
      }
    }
  };

  const filteredCategories = documentCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subsections.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="h-screen bg-black">

      <DragDropWrapper
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Top bar */}
        <div className="h-14 border-b flex items-center px-4 justify-between">
          <div className="font-semibold">Documents Library</div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#212121' }}>
          <div className="max-w-6xl mx-auto">
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-white text-lg font-semibold">{category.name}</h3>
                  </div>
                  
                  {/* Subsections */}
                  {selectedCategory === category.id && (
                    <div className="space-y-3">
                      {category.subsections.map((subsection) => (
                        <div
                          key={subsection.id}
                          className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubsection(selectedSubsection === subsection.id ? null : subsection.id);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium">{subsection.name}</h4>
                              <p className="text-gray-400 text-sm">{subsection.description}</p>
                            </div>
                            <Plus size={16} className="text-gray-400" />
                          </div>
                          
                          {/* Upload area for selected subsection */}
                          {selectedSubsection === subsection.id && (
                            <div className="mt-4 p-4 bg-gray-600 rounded-lg border-2 border-dashed border-gray-500">
                              <div className="text-center">
                                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-300 text-sm">Drop files here to upload to {subsection.name}</p>
                                <p className="text-gray-500 text-xs mt-1">Supports PDF, DOC, DOCX, TXT files</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* File uploads display */}
            {attachedFiles.length > 0 && (
              <div className="mt-8 bg-gray-800 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Uploaded Files</h3>
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-white text-sm">{file.path}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1 rounded-full hover:bg-gray-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {attachedFiles.length > 1 && (
                  <button
                    onClick={clearAllFiles}
                    className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear All ({attachedFiles.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </DragDropWrapper>
    </div>
  );
}
