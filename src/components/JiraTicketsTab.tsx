"use client";

import { useState, useEffect } from 'react';
import { ExternalLink, User, Calendar, TrendingUp, AlertCircle, Ticket } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';

interface JiraTicket {
  id: string;
  key: string;
  summary: string;
  description: string;
  status: string;
  priority: string;
  assignee?: {
    displayName: string;
    emailAddress: string;
  };
  created: string;
  updated: string;
  issueType: string;
  project: string;
}

interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
}

interface JiraTicketsTabProps {
  tickets: JiraTicket[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function JiraTicketsTab({ tickets, loading, error, onRefresh }: JiraTicketsTabProps) {
  const [users, setUsers] = useState<JiraUser[]>([]);
  const [assigningTicket, setAssigningTicket] = useState<string | null>(null);
  const [selectedAssignees, setSelectedAssignees] = useState<{ [ticketKey: string]: string }>({});
  const [ticketsPerDay, setTicketsPerDay] = useState<{ date: string; count: number }[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchUsers();
    calculateTicketsPerDay();
  }, [tickets]);

  // Initialize selected assignees when users are loaded
  useEffect(() => {
    if (users.length > 0 && tickets.length > 0) {
      const initialAssignees: { [ticketKey: string]: string } = {};
      tickets.forEach(ticket => {
        if (ticket.assignee?.emailAddress) {
          const user = users.find(u => u.emailAddress === ticket.assignee?.emailAddress);
          if (user) {
            initialAssignees[ticket.key] = user.accountId;
          }
        }
      });
      setSelectedAssignees(initialAssignees);
    }
  }, [users, tickets]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/jira-tickets/users');
      setUsers(response as any || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const calculateTicketsPerDay = () => {
    const dayCounts: { [key: string]: number } = {};
    
    tickets.forEach(ticket => {
      const date = new Date(ticket.created).toISOString().split('T')[0];
      dayCounts[date] = (dayCounts[date] || 0) + 1;
    });

    const sortedDays = Object.entries(dayCounts)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, count]) => ({ date, count }));

    setTicketsPerDay(sortedDays);
  };

  // Filter and sort tickets
  const filteredTickets = tickets
    .filter(ticket => {
      const statusMatch = statusFilter === 'all' || ticket.status.toLowerCase() === statusFilter.toLowerCase();
      const priorityMatch = priorityFilter === 'all' || ticket.priority.toLowerCase() === priorityFilter.toLowerCase();
      return statusMatch && priorityMatch;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'key':
          aValue = a.key;
          bValue = b.key;
          break;
        case 'summary':
          aValue = a.summary.toLowerCase();
          bValue = b.summary.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case 'priority':
          aValue = a.priority.toLowerCase();
          bValue = b.priority.toLowerCase();
          break;
        case 'updated':
        default:
          aValue = new Date(a.updated).getTime();
          bValue = new Date(b.updated).getTime();
          break;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Get filter options with counts
  const statusFilters = [
    { value: 'all', label: 'All Status', count: tickets.length },
    { value: 'to do', label: 'To Do', count: tickets.filter(t => t.status.toLowerCase() === 'to do').length },
    { value: 'in progress', label: 'In Progress', count: tickets.filter(t => t.status.toLowerCase() === 'in progress').length },
    { value: 'done', label: 'Done', count: tickets.filter(t => t.status.toLowerCase() === 'done').length },
    { value: 'closed', label: 'Closed', count: tickets.filter(t => t.status.toLowerCase() === 'closed').length },
  ];

  const priorityFilters = [
    { value: 'all', label: 'All Priority', count: tickets.length },
    { value: 'high', label: 'High', count: tickets.filter(t => t.priority.toLowerCase() === 'high').length },
    { value: 'medium', label: 'Medium', count: tickets.filter(t => t.priority.toLowerCase() === 'medium').length },
    { value: 'low', label: 'Low', count: tickets.filter(t => t.priority.toLowerCase() === 'low').length },
  ];

  const handleAssignTicket = async (ticketKey: string, assigneeId: string) => {
    setAssigningTicket(ticketKey);
    try {
      await apiClient.put(`/jira-tickets/${ticketKey}/assign`, { assigneeId });
      onRefresh();
      // Clear the selected assignee for this specific ticket
      setSelectedAssignees(prev => ({ ...prev, [ticketKey]: '' }));
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    } finally {
      setAssigningTicket(null);
    }
  };

  // Helper function to get current assignee account ID
  const getCurrentAssigneeId = (ticket: JiraTicket) => {
    if (ticket.assignee?.emailAddress) {
      const user = users.find(u => u.emailAddress === ticket.assignee?.emailAddress);
      return user?.accountId || '';
    }
    return '';
  };

  // Helper function to check if assignment is needed
  const isAssignmentNeeded = (ticket: JiraTicket) => {
    const currentAssigneeId = getCurrentAssigneeId(ticket);
    const selectedAssigneeId = selectedAssignees[ticket.key] || '';
    return selectedAssigneeId && selectedAssigneeId !== currentAssigneeId;
  };

  // Handle column sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon for column headers
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortDirection === 'asc' ? <span className="text-blue-400">↑</span> : <span className="text-blue-400">↓</span>;
  };

  // Format time ago with appropriate units
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'to do':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'done':
      case 'closed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[90vh] overflow-y-auto pr-2">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Tickets</p>
              <p className="text-2xl font-bold text-white">{tickets.length}</p>
            </div>
            <AlertCircle className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Open Tickets</p>
              <p className="text-2xl font-bold text-white">
                {tickets.filter(t => t.status.toLowerCase() !== 'done' && t.status.toLowerCase() !== 'closed').length}
              </p>
            </div>
            <Calendar className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-white">
                {tickets.filter(t => t.priority.toLowerCase() === 'high').length}
              </p>
            </div>
            <TrendingUp className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tickets Per Day Chart */}
      {ticketsPerDay.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Tickets Created Per Day</h3>
          <div className="space-y-2">
            {ticketsPerDay.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{day.date}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((day.count / Math.max(...ticketsPerDay.map(d => d.count))) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-white w-8 text-right">{day.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        {/* Status Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Status Filter:</h4>
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Priority Filter:</h4>
          <div className="flex gap-2 flex-wrap">
            {priorityFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setPriorityFilter(filter.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  priorityFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No tickets found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('key')}
                  >
                    <div className="flex items-center gap-1">
                      Ticket ID
                      {getSortIcon('key')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('summary')}
                  >
                    <div className="flex items-center gap-1">
                      Summary
                      {getSortIcon('summary')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-1">
                      Priority
                      {getSortIcon('priority')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('updated')}
                  >
                    <div className="flex items-center gap-1">
                      Last Updated
                      {getSortIcon('updated')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-blue-400">
                        {ticket.key}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-white truncate">
                          {ticket.summary}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {ticket.description ? ticket.description.toString().substring(0, 100) + '...' : 'No description'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {formatTimeAgo(ticket.updated)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedAssignees[ticket.key] || (ticket.assignee?.emailAddress ? users.find(u => u.emailAddress === ticket.assignee?.emailAddress)?.accountId || '' : '')}
                          onChange={(e) => setSelectedAssignees(prev => ({ ...prev, [ticket.key]: e.target.value }))}
                          className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                          disabled={assigningTicket === ticket.key}
                        >
                          <option value="">Assign...</option>
                          {users.map((user) => (
                            <option key={user.accountId} value={user.accountId}>
                              {user.displayName}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignTicket(ticket.key, selectedAssignees[ticket.key] || '')}
                          disabled={!isAssignmentNeeded(ticket) || assigningTicket === ticket.key}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                          {assigningTicket === ticket.key ? '...' : 'Assign'}
                        </button>
                        <a
                          href={`https://your-jira-instance.atlassian.net/browse/${ticket.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
