
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import GifCarousel from "./GifCarousel";
import { encryptData, createUrlHash } from "@/utils/encryption";
import ShareLink from "./ShareLink";
import { toast } from "sonner";

interface MessageFormData {
  to: string;
  from: string;
  message: string;
  gifUrl: string;
}

const MessageForm = () => {
  const [formData, setFormData] = useState<MessageFormData>({
    to: "",
    from: "",
    message: "",
    gifUrl: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGifChange = (gifUrl: string) => {
    setFormData((prev) => ({ ...prev, gifUrl }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.to || !formData.from || !formData.message || !formData.gifUrl) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Encrypt the data
      const { encrypted, keyString } = await encryptData(formData);
      
      // Create URL with hash
      const hash = createUrlHash(encrypted, keyString);
      
      // Generate full URL with the hash (use current origin)
      const fullUrl = `${window.location.origin}${hash}`;
      
      // console.log("Generated URL hash:", hash);
      // console.log("Full URL:", fullUrl);
      
      // Store share URL
      setShareUrl(fullUrl);
    } catch (error) {
      console.error("Encryption error:", error);
      toast.error("Failed to create encrypted message link");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form and go back to create new message
  const handleCreateNew = () => {
    setShareUrl(null);
    setFormData({
      to: "",
      from: "",
      message: "",
      gifUrl: formData.gifUrl, // Keep the selected GIF
    });
  };

  if (shareUrl) {
    return <ShareLink 
      url={shareUrl} 
      onCreateNew={handleCreateNew}
      messagePreview={formData}
    />;
  }

  return (
    <Card className="w-full border-hug-secondary shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-center text-hug-primary">
          Send a Hug 🤗
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5">
            <div className="space-y-2.5">
              <Label htmlFor="to" className="text-base">To</Label>
              <Input
                id="to"
                name="to"
                placeholder="Who's receiving this hug?"
                value={formData.to}
                onChange={handleInputChange}
                className="h-12"
                required
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="message" className="text-base">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Write your heartfelt message here..."
                value={formData.message}
                onChange={handleInputChange}
                className="min-h-28"
                required
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="from" className="text-base">From</Label>
              <Input
                id="from"
                name="from"
                placeholder="Your name"
                value={formData.from}
                onChange={handleInputChange}
                className="h-12"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2.5">
            <Label className="text-base block mb-1">Choose a hug GIF</Label>
            <GifCarousel
              value={formData.gifUrl}
              onChange={handleGifChange}
            />
          </div>
          
          <div className="space-y-2.5">
            <Label htmlFor="gifUrl" className="text-base block mb-1">Or enter a custom GIF URL</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="gifUrl"
                name="gifUrl"
                placeholder="https://media.giphy.com/media/..."
                value={formData.gifUrl}
                onChange={handleInputChange}
                className="h-12 flex-1"
              />
              <Button
                type="button"
                onClick={() => window.open('https://giphy.com/search/hug', '_blank')}
                className="h-12"
              >
                Search Giphy
              </Button>
            </div>
          </div>
          
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-hug-primary hover:bg-hug-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating link..." : "Create Hug Link"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MessageForm;
