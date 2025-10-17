"use client";

import { TopBar } from "@/components/TopBar";
import { API_BASE_URL } from "@/types/contstants";
import { useState, useEffect } from "react";
import { apiClient } from "@/utils/apiClient";

interface JiraCredentials {
  id?: string;
  jiraUrl: string;
  jiraUser: string;
  jiraApiKey: string;
}

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export default function SettingsPage() {
  const [jiraCredentials, setJiraCredentials] = useState<JiraCredentials>({
    jiraUrl: '',
    jiraUser: '',
    jiraApiKey: ''
  });
  const [jiraProjects, setJiraProjects] = useState<JiraProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadJiraCredentials();
  }, []);

  const loadJiraCredentials = async () => {
    try {
      const credentials: JiraCredentials = await apiClient.get('/jira-credentials');
      if (credentials) {
        setJiraCredentials({
          jiraUrl: credentials.jiraUrl || '',
          jiraUser: credentials.jiraUser || '',
          jiraApiKey: credentials.jiraApiKey || ''
        });
      }
    } catch (error) {
      console.log('No existing credentials found');
    }
  };

  const saveJiraCredentials = async () => {
    setSaving(true);
    setMessage('');
    try {
      await apiClient.post('/jira-credentials', jiraCredentials);
      setMessage('Jira credentials saved successfully!');
      await loadJiraProjects();
    } catch (error) {
      setMessage('Error saving credentials: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const loadJiraProjects = async () => {
    setLoading(true);
    try {
      const projects: JiraProject[] = await apiClient.get('/jira-tickets/projects');
      setJiraProjects(projects as JiraProject[]);
    } catch (error) {
      setMessage('Error loading projects: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const ingestProject = async () => {
    if (!selectedProject) {
      setMessage('Please select a project first');
      return;
    }
    
    setIngesting(true);
    setMessage('');
    try {
      await apiClient.post('/jira-tickets/ingest', { projectKey: selectedProject });
      setMessage(`Successfully ingested project ${selectedProject}`);
    } catch (error) {
      setMessage('Error ingesting project: ' + (error as Error).message);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <>
      <TopBar title="Settings" />
      <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#212121' }}>
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Jira Configuration */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-white text-xl font-semibold mb-4">Jira Integration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium">Jira URL</label>
                <input
                  type="url"
                  value={jiraCredentials.jiraUrl}
                  onChange={(e) => setJiraCredentials({...jiraCredentials, jiraUrl: e.target.value})}
                  placeholder="https://yourcompany.atlassian.net"
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="text-white text-sm font-medium">Jira User (Email)</label>
                <input
                  type="email"
                  value={jiraCredentials.jiraUser}
                  onChange={(e) => setJiraCredentials({...jiraCredentials, jiraUser: e.target.value})}
                  placeholder="your.email@company.com"
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="text-white text-sm font-medium">Jira API Key</label>
                <input
                  type="password"
                  value={jiraCredentials.jiraApiKey}
                  onChange={(e) => setJiraCredentials({...jiraCredentials, jiraApiKey: e.target.value})}
                  placeholder="Your Jira API token"
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              
              <button
                onClick={saveJiraCredentials}
                disabled={saving || !jiraCredentials.jiraUrl || !jiraCredentials.jiraUser || !jiraCredentials.jiraApiKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Credentials'}
              </button>
            </div>
          </div>

          {/* Jira Projects */}
          {jiraCredentials.jiraUrl && jiraCredentials.jiraUser && jiraCredentials.jiraApiKey && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Jira Projects</h3>
              
              <div className="space-y-4">
                <button
                  onClick={loadJiraProjects}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load Projects'}
                </button>
                
                {jiraProjects.length > 0 && (
                  <div>
                    <label className="text-white text-sm font-medium">Select Project to Ingest</label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="">Select a project...</option>
                      {jiraProjects.map((project) => (
                        <option key={project.id} value={project.key}>
                          {project.name} ({project.key})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {selectedProject && (
                  <button
                    onClick={ingestProject}
                    disabled={ingesting}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {ingesting ? 'Ingesting...' : `Ingest ${selectedProject}`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('Error') ? 'bg-red-800 text-red-200' : 'bg-green-800 text-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* Other Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-white text-xl font-semibold mb-4">Other Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium">API Base URL</label>
                <input
                  type="text"
                  defaultValue={API_BASE_URL}
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium">Theme</label>
                <select className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option>Dark</option>
                  <option>Light</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
