import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="w-full py-4 mt-auto">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>
        © 2025 Ebinesh | Find me on&nbsp;
          <a 
            href="https://www.linkedin.com/in/ebinesh/" 
            className="text-hug-primary hover:underline" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Ebinesh's LinkedIn Profile"
          >
            LinkedIn
          </a>.
          &nbsp;or contribute to this project on&nbsp;
          <a
            href="https://github.com/ebinesh25/hug-in-a-url"
            className="text-hug-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Project GitHub Repository"
          >
            GitHub
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Footer;