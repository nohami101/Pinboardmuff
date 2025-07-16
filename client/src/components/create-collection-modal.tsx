import { useState } from "react";
import { type Photo } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCollections } from "@/hooks/use-collections";

interface CreateCollectionModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCollectionModal({ 
  photo, 
  isOpen, 
  onClose 
}: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createCollection, addPhotoToCollection } = useCollections();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Please enter a collection name");
      return;
    }

    setIsLoading(true);
    
    try {
      const newCollection = createCollection(name.trim(), description.trim() || undefined);
      
      if (photo) {
        addPhotoToCollection(newCollection.id, photo);
      }
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = photo 
        ? 'Collection created and photo saved!' 
        : 'Collection created successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      // Reset form
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Collection</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Collection name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg focus:border-pinterest-red"
            required
          />
          
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg focus:border-pinterest-red resize-none"
            rows={3}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-pinterest-red hover:bg-red-700 text-white rounded-full"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
