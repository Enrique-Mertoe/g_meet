"use client";

import { useEffect, useCallback } from "react";
import { useSocket } from "@/root/context/providers/SocketProvider";

interface UseMeetingSocketParams {
    meetingId?: string;
    userId?: string;
    userName?: string;
    onUserJoined?: (data: { userId: string; userName: string; socketId: string }) => void;
    onUserLeft?: (data: { userId: string; userName: string; socketId: string }) => void;
    onMeetingStatusChanged?: (data: { meetingId: string; status: string; data: any }) => void;
    onParticipantStatusChanged?: (data: { userId: string; status: any }) => void;
    onMeetingDataUpdated?: (data: { meetingId: string; data: any }) => void;
    onNewMeetingCreated?: (meetingData: any) => void;
}

export const useMeetingSocket = ({
    meetingId,
    userId,
    userName,
    onUserJoined,
    onUserLeft,
    onMeetingStatusChanged,
    onParticipantStatusChanged,
    onMeetingDataUpdated,
    onNewMeetingCreated,
}: UseMeetingSocketParams) => {
    const socket = useSocket();

    // Join meeting room
    const joinMeeting = useCallback(() => {
        if (socket && meetingId && userId && userName) {
            socket.emit('join-meeting', { meetingId, userId, userName });
        }
    }, [socket, meetingId, userId, userName]);

    // Leave meeting room
    const leaveMeeting = useCallback(() => {
        if (socket && meetingId && userId && userName) {
            socket.emit('leave-meeting', { meetingId, userId, userName });
        }
    }, [socket, meetingId, userId, userName]);

    // Update meeting status
    const updateMeetingStatus = useCallback((status: string, data?: any) => {
        if (socket && meetingId) {
            socket.emit('meeting-status-update', { meetingId, status, data });
        }
    }, [socket, meetingId]);

    // Update participant status
    const updateParticipantStatus = useCallback((status: any) => {
        if (socket && meetingId && userId) {
            socket.emit('participant-status-update', { meetingId, userId, status });
        }
    }, [socket, meetingId, userId]);

    // Notify meeting created
    const notifyMeetingCreated = useCallback((meetingData: any) => {
        if (socket) {
            socket.emit('meeting-created', meetingData);
        }
    }, [socket]);

    // Update meeting data
    const updateMeetingData = useCallback((data: any) => {
        if (socket && meetingId) {
            socket.emit('meeting-updated', { meetingId, data });
        }
    }, [socket, meetingId]);

    // Set up event listeners
    useEffect(() => {
        if (!socket) return;

        if (onUserJoined) {
            socket.on('user-joined-meeting', onUserJoined);
        }

        if (onUserLeft) {
            socket.on('user-left-meeting', onUserLeft);
        }

        if (onMeetingStatusChanged) {
            socket.on('meeting-status-changed', onMeetingStatusChanged);
        }

        if (onParticipantStatusChanged) {
            socket.on('participant-status-changed', onParticipantStatusChanged);
        }

        if (onMeetingDataUpdated) {
            socket.on('meeting-data-updated', onMeetingDataUpdated);
        }

        if (onNewMeetingCreated) {
            socket.on('new-meeting-created', onNewMeetingCreated);
        }

        // Cleanup listeners on unmount
        return () => {
            if (onUserJoined) {
                socket.off('user-joined-meeting', onUserJoined);
            }
            if (onUserLeft) {
                socket.off('user-left-meeting', onUserLeft);
            }
            if (onMeetingStatusChanged) {
                socket.off('meeting-status-changed', onMeetingStatusChanged);
            }
            if (onParticipantStatusChanged) {
                socket.off('participant-status-changed', onParticipantStatusChanged);
            }
            if (onMeetingDataUpdated) {
                socket.off('meeting-data-updated', onMeetingDataUpdated);
            }
            if (onNewMeetingCreated) {
                socket.off('new-meeting-created', onNewMeetingCreated);
            }
        };
    }, [
        socket,
        onUserJoined,
        onUserLeft,
        onMeetingStatusChanged,
        onParticipantStatusChanged,
        onMeetingDataUpdated,
        onNewMeetingCreated,
    ]);

    return {
        joinMeeting,
        leaveMeeting,
        updateMeetingStatus,
        updateParticipantStatus,
        notifyMeetingCreated,
        updateMeetingData,
    };
};