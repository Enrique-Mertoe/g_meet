"use client";
import ComponentWrapper, {MainContent} from "@/root/ui/components/Layout/ComponentWrapper";
import {Suspense, useEffect, useState} from "react";
import AppContext from "@/root/context/AppContext";
import Link from "next/link";
import {AlertCircle, XCircle, Clock, Home} from "lucide-react";
import axios from "axios";

interface PageProps {
    meetingId: any;
    user: any;
}

type ErrorType = 'not_found' | 'ended' | 'cancelled' | 'connection_error' | null;

export default function MeetingPage({meetingId, user}: PageProps) {
    const [errorType, setErrorType] = useState<ErrorType>(null);
    const [meeting, setMeeting] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateMeeting = async () => {
            try {
                const response = await axios.get('/api/meeting', {
                    params: {
                        type: "get",
                        meetingId
                    }
                });

                const data = response.data;
                console.log("Meeting data:", data);

                if (!data.ok) {
                    setErrorType('not_found');
                } else {
                    setMeeting(data.data);

                    // Check meeting status
                    if (data.data.status === 'ended') {
                        setErrorType('ended');
                    } else if (data.data.status === 'cancelled') {
                        setErrorType('cancelled');
                    }
                }
            } catch (error) {
                console.error('Error validating meeting:', error);
                setErrorType('connection_error');
            } finally {
                setLoading(false);
            }
        };

        validateMeeting();
    }, [meetingId]);

    // Show loading state
    if (loading) {
        return <LoadingMeeting />;
    }

    // Show error UI if there's an error
    if (errorType) {
        return <MeetingErrorUI errorType={errorType} meetingId={meetingId}/>;
    }

    return (
        <AppContext>
            <div className="[family-name:var(--font-geist-sans)] h-screen w-screen">
                <main className="h-full w-full">
                    <ComponentWrapper>
                        <Suspense fallback={<LoadingMeeting/>}>
                            <MainContent meetingId={meetingId} userId={user._id} userName={user.name}/>
                        </Suspense>
                    </ComponentWrapper>
                </main>
            </div>
        </AppContext>
    );
}

function LoadingMeeting() {
    return (
        <div className="flex items-center justify-center h-full w-full bg-[#131314]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-white text-lg">Joining meeting...</p>
            </div>
        </div>
    );
}

function MeetingErrorUI({errorType, meetingId}: { errorType: ErrorType; meetingId: string }) {
    const getErrorContent = () => {
        switch (errorType) {
            case 'not_found':
                return {
                    icon: <AlertCircle className="w-20 h-20 text-yellow-500"/>,
                    title: "Class Not Found",
                    description: `The class code "${meetingId}" doesn't exist or may have been deleted.`,
                    suggestions: [
                        "Double-check the class code for typos",
                        "Ask the host for the correct class code",
                        "The class may have been removed by the host"
                    ]
                };
            case 'ended':
                return {
                    icon: <Clock className="w-20 h-20 text-gray-500"/>,
                    title: "Class Has Ended",
                    description: "This class session has already concluded.",
                    suggestions: [
                        "Contact the host to schedule a new session",
                        "Check your dashboard for upcoming classes",
                        "Review the session recording if available"
                    ]
                };
            case 'cancelled':
                return {
                    icon: <XCircle className="w-20 h-20 text-red-500"/>,
                    title: "Class Cancelled",
                    description: "This class has been cancelled by the host.",
                    suggestions: [
                        "Contact the host for more information",
                        "Check for rescheduled sessions",
                        "Look for alternative classes"
                    ]
                };
            case 'connection_error':
                return {
                    icon: <AlertCircle className="w-20 h-20 text-red-500"/>,
                    title: "Connection Error",
                    description: "We couldn't connect to the server. Please try again.",
                    suggestions: [
                        "Check your internet connection",
                        "Refresh the page",
                        "Try again in a few moments"
                    ]
                };
            default:
                return {
                    icon: <AlertCircle className="w-20 h-20 text-gray-500"/>,
                    title: "Something Went Wrong",
                    description: "An unexpected error occurred.",
                    suggestions: ["Please try again later"]
                };
        }
    };

    const content = getErrorContent();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        {content.icon}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {content.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-6">
                        {content.description}
                    </p>

                    {/* Class Code Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg mb-8">
                        <span className="text-sm text-gray-500 mr-2">Class Code:</span>
                        <span className="text-lg font-mono font-semibold text-gray-900">{meetingId}</span>
                    </div>

                    {/* Suggestions */}
                    <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="text-sm font-semibold text-blue-900 mb-3">What you can do:</h3>
                        <ul className="space-y-2">
                            {content.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start text-sm text-blue-800">
                                    <span className="mr-2">•</span>
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Home className="w-5 h-5 mr-2"/>
                            Go to Dashboard
                        </Link>
                        {errorType === 'connection_error' && (
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Need help? Contact your instructor or{" "}
                    <a href="/support" className="text-blue-600 hover:underline">
                        visit our support page
                    </a>
                </p>
            </div>
        </div>
    );
}