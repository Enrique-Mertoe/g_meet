"use client";

import React from "react";
import { Video, Calendar, Clock, Users, Copy, ExternalLink } from "lucide-react";
import { MeetingData } from "@/root/apiHandler/index";

interface MeetingCardProps {
    meeting: MeetingData;
    onJoin?: (meetingId: string) => void;
    onCopyLink?: (meetingId: string) => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onJoin, onCopyLink }) => {
    const formatDate = (date: Date) => {
        const d = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (d.toDateString() === today.toDateString()) {
            return `Today at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        } else if (d.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        } else {
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'ended':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const isActive = meeting.status === 'active';
    const isScheduled = meeting.status === 'scheduled';

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {meeting.title}
                        </h3>
                        {meeting.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {meeting.description}
                            </p>
                        )}
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(meeting.status)}`}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                </div>

                {/* Meeting Info */}
                <div className="space-y-2 mb-4">
                    {meeting.scheduledAt && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(meeting.scheduledAt)}</span>
                        </div>
                    )}
                    {meeting.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{meeting.duration} minutes</span>
                        </div>
                    )}
                    {meeting.participants && meeting.participants.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{meeting.participants.filter(p => !p.leftAt).length} participant{meeting.participants.filter(p => !p.leftAt).length !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>

                {/* Meeting ID */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md mb-4">
                    <div className="flex items-center">
                        <Video className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm font-mono text-gray-700">{meeting.meetingId}</span>
                    </div>
                    <button
                        onClick={() => onCopyLink?.(meeting.meetingId)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copy meeting link"
                    >
                        <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {(isActive || isScheduled) && (
                        <button
                            onClick={() => onJoin?.(meeting.meetingId)}
                            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                                isActive
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                        >
                            <ExternalLink className="w-4 h-4" />
                            {isActive ? 'Join Now' : 'Join Meeting'}
                        </button>
                    )}
                    {meeting.status === 'ended' && (
                        <div className="flex-1 px-4 py-2 text-center text-sm text-gray-500">
                            Meeting ended
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingCard;