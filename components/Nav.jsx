"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [providers, setProviders] = useState(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        };
        setUpProviders();
    }, []);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const handleSignIn = (providerId) => {
        signIn(providerId);
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <nav className="bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex gap-2 flex-center">
                            <Image src="/assets/images/logo.svg" alt="Logo" width={30} height={30} />
                            <p className="logo_text">Promptopia</p>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {session?.user ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/create-prompt" className="black_btn focus:ring-indigo-500 transition duration-150 ease-in-out">
                                    Create Post
                                </Link>
                                <div className="relative">
                                    <Image
                                        className="h-8 w-8 rounded-full cursor-pointer"
                                        src={session.user.image || "/default-avatar.png"}
                                        alt="Profile"
                                        width={32}
                                        height={32}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    />
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                                            <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {providers &&
                                    Object.values(providers).map((provider) => (
                                        <button
                                            key={provider.name}
                                            onClick={() => handleSignIn(provider.id)}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                        >
                                            Sign In with {provider.name}
                                        </button>
                                    ))
                                }
                            </>
                        )}
                    </div>
                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:bg-gray-50 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    {session?.user && (
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <Image
                                        className="h-10 w-10 rounded-full"
                                        src={session.user.image || "/default-avatar.png"}
                                        alt="User avatar"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{session.user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                >
                                    Your Profile
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;