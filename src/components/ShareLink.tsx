
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShareLinkProps {
  url: string;
  onCreateNew: () => void;
  messagePreview: {
    to: string;
    from: string;
    message: string;
    gifUrl: string;
  };
}

const ShareLink = ({ url, onCreateNew, messagePreview }: ShareLinkProps) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Extract the hash part from the URL
  const hash = url.includes('#') ? url.substring(url.indexOf('#')) : '';
  
  // Generate a direct link to the view page with the hash
  const viewUrl = `${window.location.origin}/view${hash}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(viewUrl);
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      
      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Encrypted Hug Message",
          text: "I've sent you a hug message!",
          url: viewUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  return (
    <Card className="w-full border-hug-secondary shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center text-hug-primary">
          Your Hug Link is Ready!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="share">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="share">Share Link</TabsTrigger>
            <TabsTrigger value="preview">Message Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="share" className="space-y-6">
            <div className="text-center py-1">
              <p className="text-muted-foreground">
                Your message has been encrypted and is ready to share. Anyone with this
                link can view your message securely.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                value={viewUrl}
                readOnly
                className="text-sm h-11 font-mono"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                onClick={handleCopyLink}
                className="min-w-[90px]"
                variant="outline"
              >
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
            
            <div className="grid gap-4">
              <Button
                onClick={handleShare}
                className="w-full h-11 bg-hug-primary hover:bg-hug-dark"
              >
                Share Link
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-hug-secondary">
              <div className="p-4 pt-5 text-center">
                <h3 className="text-xl font-bold mb-1">Hi {messagePreview.to}</h3>
                <p className="text-md whitespace-pre-wrap px-1 py-3">
                  {messagePreview.message}
                </p>
              </div>
              
              <div className="flex justify-center p-4 pb-2">
                <div className="w-full h-full sm:h-full rounded-md overflow-hidden">
                  <img 
                    src={messagePreview.gifUrl}
                    alt="Hug GIF" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="p-4 pt-1 text-center">
                <p className="text-lg font-medium text-hug-dark">— {messagePreview.from}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-1">
          <Button
            variant="outline"
            onClick={onCreateNew}
            className="w-full h-11 border-hug-primary text-hug-primary hover:bg-hug-light"
          >
            Create New Hug Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareLink;
