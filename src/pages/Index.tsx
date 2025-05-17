
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MessageForm from "@/components/MessageForm";

const Index = () => {
  const navigate = useNavigate();
  
  // Check if we have a hash in the URL
  useEffect(() => {
    if (window.location.hash && window.location.hash.length > 1) {
      // There's an encrypted message in the URL hash, navigate to view
      // and preserve the hash by using the full hash in the URL
      navigate('/view' + window.location.hash, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-hug-light py-8 px-4 sm:px-6 lg:px-8">
      <div className="container-app">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-hug-primary sm:text-4xl">
            Send a Virtual Hug
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create an encrypted message with a warm hug GIF that only the recipient can see.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <MessageForm />
        </div>
        
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Your messages are encrypted end-to-end and only accessible via your unique link.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
