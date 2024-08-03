"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const PromptCard = ({ prompt, handleEdit, handleDelete, handleCopy }) => {
    const { data: session } = useSession();
    const pathName = usePathname();

    const isEditable =
        session?.user.id === prompt.creator?._id &&
        pathName === "/profile";

    return (
        <div className="prompt_card hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start gap-5">
                <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
                    <Image
                        src={prompt.creator?.image || '/assets/images/logo.svg'}
                        alt="user_image"
                        width={40}
                        height={40}
                        className="rounded-full object-contain"
                    />
                    <div className="flex flex-col">
                        <h3 className="font-satoshi font-semibold text-gray-900">
                            {prompt.creator?.username || 'Anonymous'}
                        </h3>
                        <p className="font-inter text-sm text-gray-500">
                            {prompt.creator?.email || 'No email provided'}
                        </p>
                    </div>
                </div>
                <div className="copy_btn" onClick={() => handleCopy(prompt.prompt)}>
                    <Image
                        src="/assets/icons/copy.svg"
                        width={12}
                        height={12}
                        alt="copy"
                    />
                </div>
            </div>
            <p className="my-4 font-satoshi text-sm text-gray-700">{prompt.prompt}</p>
            <p className="font-inter text-sm blue_gradient cursor-pointer">
                #{prompt.tag}
            </p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{prompt.likes || 0}</span>
                    </button>
                </div>
                {isEditable && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit && handleEdit(prompt._id)}
                            className="text-green-500 hover:text-green-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete && handleDelete(prompt._id)}
                            className="text-red-500 hover:text-red-600"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromptCard;
