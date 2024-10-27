import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";

function Type() {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Start typing after 8 seconds
    const startTypingTimeout = setTimeout(() => {
      setIsTyping(true);
    }, 7000);

    return () => {
      clearTimeout(startTypingTimeout);
    };
  }, []);

  return (
    <>

    
      {isTyping && (
        <Typewriter
          options={{
            strings: [
              "<span style='color:black;'>had</span><span style='color:white;'>eer</span>",
            ],
            autoStart: true,
            loop: false,  // Disable looping
            delay: 50,    // Fast typing speed
            cursor: '',   // Remove the cursor completely
            wrapperClassName: 'Typewriter__wrapper', // Add a class for styling
          }}
        />
      )}
    </>
  );
}

export default Type;
