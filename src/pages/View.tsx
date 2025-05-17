
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { decryptData, parseUrlHash } from "@/utils/encryption";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DecryptedMessage {
  to: string;
  from: string;
  message: string;
  gifUrl: string;
}

const View: React.FC = () => {
  const [message, setMessage] = useState<DecryptedMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const decryptMessage = async () => {
      try {
        setLoading(true);
        
        // Log the hash for debugging
        // console.log("Current URL hash:", window.location.hash);
        
        const hashData = parseUrlHash(window.location.hash);
        if (!hashData) {
          console.error("No hash data found in URL:", window.location.hash);
          setError("No encrypted message found in the URL");
          setLoading(false);
          return;
        }
        
        const { data, key } = hashData;
        // console.log("Parsed hash data:", { dataLength: data.length, keyLength: key.length });
        
        const decrypted = await decryptData(data, key);
        
        // Validate expected data structure
        if (!decrypted.to || !decrypted.from || !decrypted.message || !decrypted.gifUrl) {
          throw new Error("Invalid message format");
        }
        
        setMessage(decrypted as DecryptedMessage);
      } catch (error) {
        console.error("Decryption error:", error);
        setError("Failed to decrypt the message. It may be invalid or corrupted.");
        toast.error("Failed to decrypt message");
      } finally {
        setLoading(false);
      }
    };
    
    decryptMessage();
  }, []);
  
  const handleCreateNew = () => {
    // Clear hash and navigate to home page
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="container-app flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full border-hug-secondary shadow-md p-8 flex flex-col items-center">
          <div className="animate-pulse mb-6">
            <div className="h-12 w-12 rounded-full bg-hug-secondary"></div>
          </div>
          <p className="text-center text-lg font-medium text-hug-primary">
            Decrypting your hug message...
          </p>
        </Card>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="container-app flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full border-hug-secondary shadow-md">
          <CardContent className="pt-6 pb-4 px-5 flex flex-col items-center">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">Message Error</h2>
              <p className="text-muted-foreground">{error || "Message not found"}</p>
            </div>
            
            <div className="mt-4">
              <Button
                onClick={handleCreateNew}
                className="bg-hug-primary hover:bg-hug-dark"
              >
                Create Your Own Hug Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-app flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full border-hug-secondary shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-5 pt-6 text-center">
            <h2 className="text-2xl font-bold mb-1">Hi {message.to}</h2>
            <p className="text-lg whitespace-pre-wrap px-1 py-4">
              {message.message}
            </p>
          </div>
          
          <div className="flex justify-center p-4">
            <div className="w-full h-full sm:h-full rounded-md overflow-hidden">
              <img 
                src={message.gifUrl}
                alt="Hug GIF" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="p-5 pt-2 text-center">
            <p className="text-lg font-medium text-hug-dark">— {message.from}</p>
          </div>
          
          <div className="bg-muted p-4 text-center">
            <Button
              onClick={handleCreateNew}
              className="bg-hug-primary hover:bg-hug-dark"
            >
              Send Your Own Hug
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default View;
