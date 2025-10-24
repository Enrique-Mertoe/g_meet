"use client";

import React, { useEffect, useState, useRef } from "react";
import { Video, Calendar, Clock, BookOpen, Users, Settings, X, LogOut, User, Bell } from "lucide-react";
import MeetingCard from "./MeetingCard";
import { MeetingData } from "@/root/apiHandler/index";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMeetingSocket } from "@/root/hooks/useMeetingSocket";

const Dashboard: React.FC = () => {
    const router = useRouter();
    const [upcomingClasses, setUpcomingClasses] = useState<MeetingData[]>([]);
    const [recentClasses, setRecentClasses] = useState<MeetingData[]>([]);
    const [activeClasses, setActiveClasses] = useState<MeetingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [creating, setCreating] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const settingsMenuRef = useRef<HTMLDivElement>(null);

    // Set up WebSocket listeners for real-time updates
    useMeetingSocket({
        onNewMeetingCreated: (meetingData) => {
            console.log('New class created:', meetingData);
            fetchClasses();
        },
        onMeetingStatusChanged: ({ meetingId, status }) => {
            console.log(`Class ${meetingId} status changed to ${status}`);
            fetchClasses();
        },
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    // Close settings menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                setShowSettingsMenu(false);
            }
        };

        if (showSettingsMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSettingsMenu]);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const [upcomingRes, recentRes, activeRes] = await Promise.all([
                axios.get('/api/meeting?type=upcoming'),
                axios.get('/api/meeting?type=recent&limit=5'),
                axios.get('/api/meeting?type=active')
            ]);

            if (upcomingRes.data.ok) setUpcomingClasses(upcomingRes.data.data || []);
            if (recentRes.data.ok) setRecentClasses(recentRes.data.data || []);
            if (activeRes.data.ok) setActiveClasses(activeRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartClass = async () => {
        if (creating) return;

        try {
            setCreating(true);
            const res = await axios.post('/api/meeting', {
                action: 'create-instant',
                title: 'Quick Class Session'
            });

            if (res.data.ok && res.data.data) {
                const meetingId = res.data.data.meetingId;
                console.log('Class created, redirecting to:', meetingId);
                router.push(`/meeting/${meetingId}`);
            } else {
                console.error('Failed to create class:', res.data.error);

                // Check if user has an active class
                if (res.data.error?.includes('already have an active class')) {
                    const confirmed = window.confirm(
                        'You already have an active class running.\n\n' +
                        'Would you like to rejoin it?\n\n' +
                        'Click OK to rejoin or Cancel to stay here.'
                    );

                    if (confirmed && activeClasses.length > 0) {
                        // Find the active class hosted by this user
                        const myActiveClass = activeClasses.find(m => m.status === 'active');
                        if (myActiveClass) {
                            router.push(`/meeting/${myActiveClass.meetingId}`);
                        }
                    }
                } else {
                    alert('Failed to start class: ' + (res.data.error || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error creating class:', error);
            alert('Failed to start class. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    const handleJoinClass = (classId: string) => {
        if (classId && classId.trim()) {
            router.push(`/meeting/${classId.trim()}`);
        }
    };

    const handleJoinWithCode = () => {
        if (classCode && classCode.trim()) {
            setShowJoinDialog(false);
            handleJoinClass(classCode.trim());
            setClassCode("");
        }
    };

    const handleCopyLink = (meetingId: string) => {
        const link = `${window.location.origin}/meeting/${meetingId}`;
        navigator.clipboard.writeText(link);
        // Show success feedback
        alert('Class link copied to clipboard!');
    };

    const handleLogout = async () => {
        try {
            // Clear session on server
            await axios.post('/api/auth/logout');
            // Redirect to login page
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Redirect anyway
            router.push('/auth/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
                        </div>

                        {/* Settings Dropdown */}
                        <div className="relative" ref={settingsMenuRef}>
                            <button
                                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Settings className="w-6 h-6 text-gray-600" />
                            </button>

                            {/* Dropdown Menu */}
                            {showSettingsMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <button
                                        onClick={() => {
                                            setShowSettingsMenu(false);
                                            // Profile action placeholder
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>Profile</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowSettingsMenu(false);
                                            // Notifications action placeholder
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                                    >
                                        <Bell className="w-5 h-5" />
                                        <span>Notifications</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowSettingsMenu(false);
                                            // Settings action placeholder
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span>Settings</span>
                                    </button>

                                    <hr className="my-1 border-gray-200" />

                                    <button
                                        onClick={() => {
                                            setShowSettingsMenu(false);
                                            handleLogout();
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Start Class */}
                    <button
                        onClick={handleStartClass}
                        disabled={creating}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg p-6 flex items-center justify-center gap-3 transition-colors"
                    >
                        {creating ? (
                            <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                <span className="font-semibold text-lg">Starting...</span>
                            </>
                        ) : (
                            <>
                                <Video className="w-6 h-6" />
                                <span className="font-semibold text-lg">Start Class</span>
                            </>
                        )}
                    </button>

                    {/* Join with Code */}
                    <button
                        onClick={() => setShowJoinDialog(true)}
                        className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-lg p-6 flex items-center justify-center gap-3 transition-colors"
                    >
                        <Users className="w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-lg text-gray-900">Join Class</span>
                    </button>

                    {/* Schedule */}
                    <button
                        className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-lg p-6 flex items-center justify-center gap-3 transition-colors"
                    >
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-lg text-gray-900">Schedule Session</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Active Classes */}
                        {activeClasses.length > 0 && (
                            <section className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <h2 className="text-xl font-semibold text-gray-900">Live Now</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activeClasses.map((meeting) => (
                                        <MeetingCard
                                            key={meeting.meetingId}
                                            meeting={meeting}
                                            onJoin={handleJoinClass}
                                            onCopyLink={handleCopyLink}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Upcoming Classes */}
                        <section className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
                            </div>
                            {upcomingClasses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {upcomingClasses.map((meeting) => (
                                        <MeetingCard
                                            key={meeting.meetingId}
                                            meeting={meeting}
                                            onJoin={handleJoinClass}
                                            onCopyLink={handleCopyLink}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No upcoming sessions</p>
                                    <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                                        Schedule a session
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Recent Classes */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-gray-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
                            </div>
                            {recentClasses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentClasses.map((meeting) => (
                                        <MeetingCard
                                            key={meeting.meetingId}
                                            meeting={meeting}
                                            onJoin={handleJoinClass}
                                            onCopyLink={handleCopyLink}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No recent sessions</p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            {/* Join Class Dialog */}
            {showJoinDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Join a Class</h2>
                            <button
                                onClick={() => {
                                    setShowJoinDialog(false);
                                    setClassCode("");
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">Enter the class code to join</p>
                        <input
                            type="text"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleJoinWithCode();
                            }}
                            placeholder="Enter class code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowJoinDialog(false);
                                    setClassCode("");
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoinWithCode}
                                disabled={!classCode.trim()}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;