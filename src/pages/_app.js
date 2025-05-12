import React from "react";
import Head from "next/head"; // Import the Head component for metadata
import "../../styles/globals.css"; // Import your global CSS

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>EchoScape - Ambient Sound & Pomodoro Focus App</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="UTF-8" />
                <meta name="description" content="EchoScape is a serene ambient sound and Pomodoro timer app designed to help you stay focused, relaxed, and productive." />
                <meta name="keywords" content="ambient sound, pomodoro timer, productivity, focus app, react app, soundscapes, mental health, indie project" />
                <meta name="author" content="EchoScape" />
                <meta name="theme-color" content="#111827" />
                <link rel="icon" href="/favicon.ico" />
                {/* Open Graph / Social Media Meta */}
                <meta property="og:title" content="EchoScape – Focus Better With Sound" />
                <meta property="og:description" content="EchoScape is your ambient escape. Blend relaxing soundscapes with focus sessions using Pomodoro." />
                <meta property="og:image" content="/social-preview.jpg" />
                <meta property="og:url" content="https://echoscape.vercel.app" />
                <meta property="og:type" content="website" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="EchoScape - Focus Better With Sound" />
                <meta name="twitter:description" content="Relax, focus, and get more done with ambient sounds and a Pomodoro timer." />
                <meta name="twitter:image" content="/social-preview.png" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
