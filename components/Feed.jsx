"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Form from "@/components/Form";
import PromptCard from "@/components/PromptCard";

const Feed = () => {
    const [allPrompts, setAllPrompts] = useState([]);
    const [filteredPrompts, setFilteredPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const [copiedPrompt, setCopiedPrompt] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await fetch('/api/prompt');
                const data = await response.json();
                setAllPrompts(data);
                setFilteredPrompts(data);
            } catch (error) {
                console.error('Error fetching prompts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrompts();
    }, []);

    const handleCopy = (promptText) => {
        setCopiedPrompt(promptText);
        navigator.clipboard.writeText(promptText);
        setTimeout(() => setCopiedPrompt(""), 3000);
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchText(searchTerm);

        if (searchTerm.trim() === "") {
            setFilteredPrompts(allPrompts);
            return;
        }

        const filtered = allPrompts.filter((prompt) => {
            const contentMatch = prompt.prompt.toLowerCase().includes(searchTerm);
            const tagMatch = prompt.tag.toLowerCase().includes(searchTerm);

            return contentMatch || tagMatch;
        });

        setFilteredPrompts(filtered);
    };

    if (loading) {
        return (
            <div className="flex-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
            </div>
        );
    }

    return (
        <section className="feed">
            <h1 className="head_text text-center blue_gradient">AI Prompt Feed</h1>
            <form className="relative w-full flex-center">
                <input
                    className="search_input peer"
                    placeholder="Search prompts, tags, or creators"
                    type="text"
                    value={searchText}
                    onChange={handleSearch}
                    required
                />
            </form>
            <div className="mt-16 prompt_layout">
                {filteredPrompts.length === 0 ? (
                    <p className="text-center text-gray-500">No matching prompts found.</p>
                ) : (
                    filteredPrompts.map((prompt) => (
                        <PromptCard
                            key={prompt._id}
                            prompt={prompt}
                            handleCopy={handleCopy}
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default Feed;
