"use client";

import { useState } from "react";
import { useMentorshipRequests, useUpdateMentorshipRequest } from "@cliniq/ui";

export default function MentorshipRequestsPage() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const { data: sentData, isLoading: sentLoading } = useMentorshipRequests("sent", {
    status: statusFilter || undefined,
  });
  
  const { data: receivedData, isLoading: receivedLoading } = useMentorshipRequests("received", {
    status: statusFilter || undefined,
  });

  const updateMutation = useUpdateMentorshipRequest();

  const requests = activeTab === "sent" ? sentData?.requests : receivedData?.requests;
  const isLoading = activeTab === "sent" ? sentLoading : receivedLoading;

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await updateMutation.mutateAsync({
        requestId,
        action: "accept"
      });
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      await updateMutation.mutateAsync({
        requestId,
        action: "reject",
        reason
      });
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      await updateMutation.mutateAsync({
        requestId,
        action: "complete"
      });
    } catch (error) {
      console.error("Failed to complete request:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "LOW": return "bg-green-100 text-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "HIGH": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Requests</h1>
        <p className="text-gray-600">
          Manage your mentorship requests and track your mentoring sessions.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("sent")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "sent"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Sent Requests ({sentData?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "received"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Received Requests ({receivedData?.total || 0})
          </button>
        </nav>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading requests...</div>
      ) : !requests || requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium mb-2">No requests found</div>
          <p className="text-sm">
            {activeTab === "sent" 
              ? "You haven't sent any mentorship requests yet."
              : "You haven't received any mentorship requests yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white border rounded-lg p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.topic}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency} Priority
                    </span>
                    <span>Requested {formatDate(request.createdAt)}</span>
                  </div>
                </div>
                
                {/* Actions for mentors */}
                {activeTab === "received" && request.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={updateMutation.isPending}
                      className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Reason for rejection:");
                        if (reason) handleRejectRequest(request.id, reason);
                      }}
                      disabled={updateMutation.isPending}
                      className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* Actions for accepted requests */}
                {request.status === "ACCEPTED" && (
                  <button
                    onClick={() => handleCompleteRequest(request.id)}
                    disabled={updateMutation.isPending}
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Complete
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{request.description}</p>

              {/* People Info */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                {activeTab === "sent" && request.mentor && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {request.mentor.user.avatarUrl ? (
                        <img 
                          src={request.mentor.user.avatarUrl} 
                          alt={request.mentor.user.name} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs">👤</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{request.mentor.user.name}</div>
                      <div className="text-gray-500">Mentor</div>
                    </div>
                  </div>
                )}

                {activeTab === "received" && request.student && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {request.student.avatarUrl ? (
                        <img 
                          src={request.student.avatarUrl} 
                          alt={request.student.name} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs">👤</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{request.student.name}</div>
                      <div className="text-gray-500">{request.student.institution} • {request.student.program}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Preferred Time:</span>
                  <span className="ml-2 text-gray-600">{request.preferredTime}</span>
                </div>
                
                {request.scheduledAt && (
                  <div>
                    <span className="font-medium text-gray-900">Scheduled:</span>
                    <span className="ml-2 text-gray-600">{formatDate(request.scheduledAt)}</span>
                  </div>
                )}

                {request.completedAt && (
                  <div>
                    <span className="font-medium text-gray-900">Completed:</span>
                    <span className="ml-2 text-gray-600">{formatDate(request.completedAt)}</span>
                  </div>
                )}

                {request.rejectionReason && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-900">Reason:</span>
                    <span className="ml-2 text-gray-600">{request.rejectionReason}</span>
                  </div>
                )}

                {request.notes && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-900">Notes:</span>
                    <span className="ml-2 text-gray-600">{request.notes}</span>
                  </div>
                )}
              </div>

              {/* Ratings */}
              {(request.studentRating || request.mentorRating) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm">
                    {request.studentRating && (
                      <div>
                        <span className="font-medium text-gray-900">Student Rating:</span>
                        <span className="ml-2 text-yellow-500">⭐ {request.studentRating}/5</span>
                      </div>
                    )}
                    {request.mentorRating && (
                      <div>
                        <span className="font-medium text-gray-900">Mentor Rating:</span>
                        <span className="ml-2 text-yellow-500">⭐ {request.mentorRating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
