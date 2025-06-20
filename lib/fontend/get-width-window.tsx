import { useState, useEffect } from "react";

// WindowWidth component
export const getWindowWidth = () => {
  // State to store the window width
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Effect hook to handle window resizing
  useEffect(() => {
    // Function to update the window width
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);  // Set the window width to state
    };

    // Add event listener for window resize
    window.addEventListener("resize", updateWindowWidth);

    // Call the function initially to set the window width when the component mounts
    updateWindowWidth();

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return { windowWidth  }
};

