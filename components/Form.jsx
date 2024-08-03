import Link from "next/link";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <h1 className="head_text text-center">
                <span className="blue_gradient">{type} Post</span>
            </h1>
            <p className="desc text-center max-w-md">
                {type} and share amazing prompts with the world and let your imagination run wild with any AI-powered platform.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-10 w-full flex flex-col gap-7 glassmorphism"
            >
                <label className="flex flex-col">
          <span className="font-satoshi font-semibold text-base text-gray-700 mb-2">
            Your AI Prompt
          </span>
                    <textarea
                        value={post.prompt}
                        onChange={(e) => setPost({ ...post, prompt: e.target.value })}
                        placeholder="Write your prompt here..."
                        className="form_textarea"
                        required
                    />
                </label>

                <label className="flex flex-col">
          <span className="font-satoshi font-semibold text-base text-gray-700 mb-2">
            Tag
          </span>
                    <input
                        value={post.tag}
                        onChange={(e) => setPost({ ...post, tag: e.target.value })}
                        placeholder="#tag"
                        className="form_input"
                        required
                    />
                </label>

                <div className="flex justify-end items-center mx-3 mb-5 gap-4">
                    <Link href="/" className="text-gray-500 text-sm">
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
                    >
                        {submitting ? `${type}ing...` : type}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;