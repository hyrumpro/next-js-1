"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEdit, FaSave, FaCalendarAlt } from 'react-icons/fa';
import PromptCard from "@/components/PromptCard";
import EditPromptModal from "@/components/EditPromptModal";

const ProfilePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        bio: '',
    });

    useEffect(() => {
        if (session?.user) {
            setUserData({
                name: session.user.name || '',
                email: session.user.email || '',
                bio: session.user.bio || '',
            });
            fetchUserPosts();
        }
    }, [session]);

    const fetchUserPosts = async () => {
        if (session?.user.id) {
            try {
                const response = await fetch(`/api/users/${session.user.id}/posts`);
                const data = await response.json();
                setUserPosts(data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        // Here you would typically send the updated data to your backend
        console.log('Saving user data:', userData);
        setIsEditing(false);
    };

    const handleEditSave = async (id, newPrompt, newTag) => {
        try {
            const response = await fetch(`/api/prompt/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: newPrompt, tag: newTag }),
            });

            if (response.ok) {
                setUserPosts(prevPosts =>
                    prevPosts.map(p => p._id === id ? { ...p, prompt: newPrompt, tag: newTag } : p)
                );
                setEditingPrompt(null);
            } else {
                throw new Error('Failed to update prompt');
            }
        } catch (error) {
            console.error('Error updating prompt:', error);
            alert('Failed to update prompt. Please try again.');
        }
    };


    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id}`, {
                    method: 'DELETE'
                });

                const filteredPosts = userPosts.filter((p) => p._id !== post._id);
                setUserPosts(filteredPosts);
            } catch (error) {
                console.error("Error deleting prompt:", error);
            }
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (status === "loading") {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/");
        return null;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 sm:h-64"></div>
                    <div className="relative px-4 sm:px-6 lg:px-8">
                        <div className="-mt-24 sm:-mt-32 flex justify-center">
                            <Image
                                src={session.user.image || "/assets/images/default-avatar.png"}
                                alt={userData.name}
                                width={150}
                                height={150}
                                className="rounded-full border-4 border-white shadow-lg"
                            />
                        </div>
                        <div className="mt-6 text-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleInputChange}
                                        className="text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    userData.name
                                )}
                            </h1>
                            <p className="text-gray-600 mt-1">{userData.email}</p>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-300"
                            >
                                {isEditing ? (
                                    <>
                                        <FaSave className="mr-2" /> Save Profile
                                    </>
                                ) : (
                                    <>
                                        <FaEdit className="mr-2" /> Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={userData.bio}
                                    onChange={handleInputChange}
                                    className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-gray-600">{userData.bio || "No bio provided"}</p>
                            )}
                        </div> <br />
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userPosts.map((post) => (
                            <PromptCard
                                key={post._id}
                                prompt={post}
                                handleCopy={handleCopy}
                                handleEdit={() => setEditingPrompt(post)}
                                handleDelete={() => handleDelete(post)}
                            />
                        ))}
                    </div>
                    {userPosts.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No posts yet. Start creating!</p>
                    )}
                </div>
            </div>

            {editingPrompt && (
                <EditPromptModal
                    prompt={editingPrompt}
                    onSave={handleEditSave}
                    onClose={() => setEditingPrompt(null)}
                />
            )}
        </div>
    );
};

export default ProfilePage;
