import React, { useState, useEffect } from 'react';

const EditPromptModal = ({ prompt, onSave, onClose }) => {
    const [editedPrompt, setEditedPrompt] = useState(prompt.prompt);
    const [editedTag, setEditedTag] = useState(prompt.tag);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(prompt._id, editedPrompt, editedTag);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-5 w-full max-w-md glassmorphism transition-all duration-300 ease-in-out transform hover:scale-105">
                <div className="mt-3">
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">Edit Prompt</h3>
                    <form onSubmit={handleSubmit} className="mt-2">
            <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="form_textarea"
                rows="4"
                placeholder="Write your prompt here..."
            />
                        <input
                            type="text"
                            value={editedTag}
                            onChange={(e) => setEditedTag(e.target.value)}
                            className="form_input"
                            placeholder="Tag"
                        />
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="outline_btn"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="black_btn"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPromptModal;
