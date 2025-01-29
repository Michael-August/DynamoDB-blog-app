import { useState } from "react";
import { toast } from "react-toastify";

const Subscribe = ({fromNavBar}: {fromNavBar: boolean}) => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!fullName) {
            toast.error("Please provide your full name")
            return;
        }

        if (!email) {
            toast.error("Please provide an active email")
            return;
        }

        try {
            const response = await fetch("/apis/newsletterSub", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email }),
            });

            const data = await response.json();

            console.log(data)

            if (response.ok) {
                toast.success("Subscription successful!.");
                setFullName("");
                setEmail("");
            } else {
                toast.error(data.message || "Subscription failed.")
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-wrap justify-center gap-4">
            <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name" 
                className={`w-full sm:w-auto px-4 py-2 rounded-md ${fromNavBar ? 'bg-zinc-200' : 'bg-gray-800'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className={`w-full sm:w-auto px-4 py-2 rounded-md ${fromNavBar ? 'bg-zinc-200' : 'bg-gray-800'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button 
                type="submit" 
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
            >
                Subscribe
            </button>
        </form>
    )
}

export default Subscribe;

