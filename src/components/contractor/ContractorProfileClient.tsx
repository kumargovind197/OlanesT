
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

interface ContractorProfileClientProps {
  contractorId: string;
  initialIsFavorited: boolean;
  contractorName: string;
}

export function ContractorProfileClient({ contractorId, initialIsFavorited, contractorName }: ContractorProfileClientProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const { user, role } = useAuth();

  const handleFavoriteToggle = async () => {
    if (!user) {
        toast({ title: "Please log in", description: "You must be logged in to favorite a contractor.", variant: "destructive" });
        return;
    }
    if (role !== 'homeowner') {
        toast({ title: "Action not available", description: "Only homeowners can favorite contractors.", variant: "destructive" });
        return;
    }
    
    setIsPending(true);
    // In a real app, this would be an API call to add/remove from favorites
    console.log(`Toggling favorite for contractor ${contractorId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    setIsFavorited(!isFavorited);
    setIsPending(false);
    toast({
      title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
      description: `${contractorName} has been ${isFavorited ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  return (
    <div className="absolute top-4 right-4">
      <Button 
        onClick={handleFavoriteToggle} 
        disabled={isPending || role !== 'homeowner'} 
        variant="ghost" 
        size="icon"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        className="rounded-full h-10 w-10 bg-background/70 hover:bg-background"
      >
        <Heart className={cn("h-5 w-5 text-muted-foreground", isFavorited && "fill-red-500 text-red-500")} />
      </Button>
    </div>
  );
}
