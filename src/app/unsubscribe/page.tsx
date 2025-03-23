"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function UnsubscribePage() {
    const {email} = useParams();
    const [message, setMessage] = useState("Processing your request...");

    useEffect(() => {
        if (!email) {
            setMessage("Invalid request. Email is missing.");
            return;
        }

        async function unsubscribe() {
            try {
                const response = await fetch(`/apis/newsletterSub?email=${encodeURIComponent(email as string)}`, {
                    method: "DELETE",
                });

                const result = await response.json();
                if (response.ok) {
                    setMessage("You have successfully unsubscribed.");
                } else {
                    setMessage(result.message || "Failed to unsubscribe.");
                }
            } catch (error) {
                setMessage("An error occurred. Please try again later.");
            }
        }

        unsubscribe();
    }, [email]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Unsubscribe</h2>
            <p>{message}</p>
        </div>
    );
}
