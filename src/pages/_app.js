import React from "react";
import "../../styles/globals.css"; // Import your global CSS (optional)

export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
