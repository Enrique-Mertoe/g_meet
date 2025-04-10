import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="pt-12 bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo + Description + Social Icons */}
                    <div>
                        <Link
                            className={"hstack gap-2"}
                            href="/">
                            <img src="/logo.png" alt="logo" className="h-10 block dark:hidden"/>
                            <span className={"font-bold text-xl"}>V-Learn</span>
                        </Link>
                        <p className="mt-4 mb-3 text-sm">
                            Designed to support educators and inspire learners with a smart, user-friendly platform.
                        </p>
                        <h5 className="text-lg font-semibold my-2">Contact</h5>
                        <p className="text-sm mb-1">Toll free: <span className="font-light">+1234 568 963</span></p>
                        <p className="text-xs">(9:AM to 8:PM IST)</p>
                        <p className="text-sm mt-2">Email: <span className="font-light">example@gmail.com</span></p>
                        <div className="flex space-x-2 mt-4">
                            <a href="#"
                               className="bg-white shadow p-2 h-12 w-12 flex items-center justify-center  rounded-full text-blue-600">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#"
                               className="bg-white shadow p-2  h-12 w-12 flex items-center justify-center rounded-full text-pink-600">
                                <i className="bi-instagram"></i>
                            </a>
                            <a href="#"
                               className="bg-white shadow p-2 h-12 w-12 flex items-center justify-center rounded-full text-blue-400">
                                <i className="bi-twitter-x"></i>
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h5 className="text-lg font-semibold mb-4">Company</h5>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">About us</a></li>
                            <li><a href="#" className="hover:underline">Contact us</a></li>
                            <li><a href="#" className="hover:underline">News and Blogs</a></li>
                            <li><a href="#" className="hover:underline">Library</a></li>
                            <li><a href="#" className="hover:underline">Career</a></li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h5 className="text-lg font-semibold mb-4">Community</h5>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">Documentation</a></li>
                            <li><a href="#" className="hover:underline">Faq</a></li>
                            <li><a href="#" className="hover:underline">Forum</a></li>
                            <li><a href="#" className="hover:underline">Sitemap</a></li>
                        </ul>
                    </div>

                    {/* Teaching + Contact */}
                    <div>
                        <h5 className="text-lg font-semibold mb-4">Teaching</h5>
                        <ul className="space-y-2 text-sm mb-6">
                            <li><a href="#" className="hover:underline">Become a teacher</a></li>
                            <li><a href="#" className="hover:underline">How to guide</a></li>
                            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                        </ul>

                        <div className="flex gap-4 mt-4">
                            <a href="#">
                                <img src="/playstore.png" alt="Play Store" className="h-10"/>
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-gray-300 dark:border-gray-700"/>

                {/* Bottom */}
                <div className="flex flex-colmd:flex-row pb-10 justify-between items-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        &copy;2025 LomTechnology All rights reserved
                    </p>

                    <ul className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0">
                        <li className="relative group">
                            <button className="flex items-center gap-1">
                                <i className="fas fa-globe"></i> Language
                            </button>
                            {/* Language dropdown (implement with headlessui or custom dropdown later) */}
                        </li>
                        <li><a href="#" className="hover:underline">Terms of use</a></li>
                        <li><a href="#" className="hover:underline">Privacy policy</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;