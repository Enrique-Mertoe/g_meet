const activeMeetings: Record<string, Set<string>> = {}; // Key: meetingId, Value: Set of userIds

export const joinMeeting = (meetingId: string, userId: string) => {
    if (!activeMeetings[meetingId]) {
        activeMeetings[meetingId] = new Set();
    }
    activeMeetings[meetingId].add(userId);
};

export const leaveMeeting = (meetingId: string, userId: string) => {
    activeMeetings[meetingId]?.delete(userId);
    if (activeMeetings[meetingId]?.size === 0) {
        delete activeMeetings[meetingId]; // Remove empty meetings
    }
};

// Helper function to view active meetings (For debugging)
export const getMeetings = () => activeMeetings;
