import "./globals.css";
import Navbar from "@/components/Nav";
import { NextAuthProvider } from "@/components/NextAuthProvider";
export const metadata = {
    title: "Promptopia",
    description: "Discover and Share AI prompts",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
         <body className="bg-gradient-to-r from-white via-gray-100 to-gray-200 min-h-screen">
         <NextAuthProvider>
             <Navbar />
             {children}
         </NextAuthProvider>
         </body>
        </html>
    );
}