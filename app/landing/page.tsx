"use client";

import Footer from "@/root/ui/landing/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [classCode, setClassCode] = useState("");

    const handleJoinClass = () => {
        if (classCode && classCode.trim()) {
            router.push(`/meeting/${classCode.trim()}`);
        } else {
            alert("Please enter a class code");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleJoinClass();
        }
    };

    return (
        <div className={"vstack"}>
            <div className="w-full min-h-screen">
                <div
                    data-cue="fadeIn"
                    className="h-full"
                    style={{
                        backgroundImage: "url(/landing-bg.png)",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                    data-show="true"
                >
                    <section className="h-full lg:h-auto">
                        <div className="max-w-7xl mx-auto px-4 py-9">
                            <div className="flex justify-center">
                                <div className="w-full lg:w-10/12">
                                    <div
                                        className="text-center"
                                        data-cue="zoomIn"
                                        data-show="true"
                                    >
              <span className="border border-yellow-500 text-yellow-500 px-3 py-1 mt-[1.5rem] mb:mt-0 rounded-full text-sm inline-block">
               Limitless learning at your fingertips
              </span>

                                        <div className="my-5 text-white">
                                            <div className="hstack absolute top-0 m-3 end-0">
                                                <a href="/auth/login" className="btn btn-primary-grad rounded-1 !p-[.5rem] !px-10 mb-0">
                                                    Signin
                                                    <i className="bi-arrow-right ms-2"></i>
                                                </a>

                                            </div>
                                            <h1 className="text-4xl md:text-6xl font-bold mmy-3 text-white">
                                                Your Virtual Classroom, Reinvented <br/>
                                                for the Modern Academic World
                                            </h1>
                                            <p className="text-lg mt-5 text-gray-400 md:w-[80%] mx-auto  md:text-xl">
                                                Host live lectures, conduct thesis defenses, manage group discussions,
                                                or hold private mentoring sessions — all in one secure, education-first
                                                platform.

                                                Built for universities, colleges, and research institutions, our
                                                academic meeting app brings structure, clarity, and purpose to every
                                                virtual interaction.
                                            </p>
                                        </div>

                                        <div
                                            className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 px-4">


                                            <div className="ring-2 ring-blue-600 p-1 rounded-md">
                                                <div
                                                    className="border border-blue-600 text-gray-100 px-2  border border-1 border-gray-100   rounded-sm  hover:text-white transition flex items-center"
                                                >
                                                    <input
                                                        type="text"
                                                        value={classCode}
                                                        onChange={(e) => setClassCode(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        className={"px-6 py-2 outline-0 border-0 shadow-none bg-transparent text-white"}
                                                        placeholder={"Enter lecture code"}
                                                    />
                                                    <span className="ml-2">
                    <i className="bi-keyboard text-xl"></i>
                  </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleJoinClass}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition cursor-pointer"
                                            >
                                                Join
                                            </button>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className={"w-full"}>
                        <div className="max-w-7xl mx-auto px-4 py-9">
                            <div className="grid grid-cols-1 mt-10 md:text-white sm:grid-cols-2 gap-10">

                                <div className="vstack items-center space-x-4">
                                    <div
                                        className="flex items-center justify-center w-12 h-12 text-white bg-yellow-500 rounded text-xl">
                                        <i className="bi bi-mortarboard-fill"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-lg font-semibold mb-1">Made for Classrooms &
                                            Campuses</h6>
                                        <p className="text-sm text-gray-200">Designed with educators and
                                            students in mind.</p>
                                    </div>
                                </div>

                                <div className="vstack items-center  space-x-4">
                                    <div
                                        className="flex items-center justify-center w-12 h-12 text-white bg-blue-500 rounded text-xl">
                                        <i className="bi bi-chat-dots-fill"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-lg font-semibold mb-1">Real-time Chat, Notes &
                                            Q&A</h6>
                                        <p className="text-sm text-gray-200">Engage your audience with
                                            interactive tools.</p>
                                    </div>
                                </div>

                                <div className="vstack items-center space-x-4">
                                    <div
                                        className="flex items-center justify-center w-12 h-12 text-white bg-red-500 rounded text-xl">
                                        <i className="bi bi-journal-richtext"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-lg font-semibold mb-1">Session Recordings &
                                            Attendance Logs</h6>
                                        <p className="text-sm text-gray-200">Keep track of every learning
                                            moment.</p>
                                    </div>
                                </div>

                                <div className="vstack items-center space-x-4">
                                    <div
                                        className="flex items-center justify-center w-12 h-12 text-white bg-green-600 rounded text-xl">
                                        <i className="bi bi-shield-lock-fill"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-lg font-semibold mb-1">Secure Access for Faculty
                                            and Students</h6>
                                        <p className="text-sm text-gray-200">Privacy and protection you can
                                            trust.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
            <Footer/>
        </div>
    )
}