import Footer from "@/root/ui/landing/Footer";

export default function Page() {
    return (
        <>
            <div className="w-full h-screen bg-gray-400">
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
              <span className="border border-yellow-500 text-yellow-500 px-3 py-1 rounded-full text-sm inline-block">
                March 24 - 26, 2024 | San Diego, CA
              </span>

                                        <div className="my-5 text-white">
                                            <h1 className="text-4xl md:text-6xl font-bold my-3 text-white">
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
                                            <a
                                                href="offcanvasRight"
                                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#offcanvasRight"
                                                aria-controls="offcanvasRight"
                                            >
                                                Register Now
                                            </a>

                                            <div className="ring-2 ring-blue-600 p-1 rounded-md">
                                                <div
                                                    className="border border-blue-600 text-gray-100 px-2  border border-1 border-gray-100   rounded-md  hover:text-white transition flex items-center"
                                                >
                                                    <input type="text"
                                                           className={"px-6 py-3 outline-0 border-0 shadow-none"}
                                                           placeholder={"Add to Calendar"}/>
                                                    <span className="ml-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-window-dock"
                        viewBox="0 0 16 16"
                    >
                      <path
                          d="M3.5 11a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm3.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm4.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z"></path>
                      <path
                          d="M14 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h12ZM2 14h12a1 1 0 0 0 1-1V5H1v8a1 1 0 0 0 1 1ZM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2Z"></path>
                    </svg>
                  </span>
                                                </div>
                                            </div>
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

        </>
    )
}