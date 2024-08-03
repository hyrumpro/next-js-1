import { connectToDB } from "@/utils/database";
import Prompt from "@/models/prompt";


// Patch

export const PATCH = async (request, { params }) => {
    const { id } = params;
    const { prompt, tag } = await request.json();
    try {
        await connectToDB();
        const existingPrompt = await Prompt.findById(id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), { status: 200 });
    } catch (error) {
       console.error('Error updating prompt:', error);
    }
}

export const DELETE = async (request, { params }) => {
    const { id } = params;
    try {
        await connectToDB();
        await Prompt.findByIdAndDelete(id);
        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        console.error('Error deleting prompt:', error);
        return new Response("Error deleting prompt", { status: 500 });
    }
}
