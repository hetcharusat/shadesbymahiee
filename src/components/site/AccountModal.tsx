import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Phone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, updateUserProfile } = useAuth();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || "");
      setPhone(userProfile.phone || "");
    } else if (user) {
      setName(user.user_metadata?.full_name || "");
    }
  }, [userProfile, user, isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Update our context
      await updateUserProfile({ displayName: name, phone });

      // 2. Also try to update auth metadata for safety
      await supabase.auth.updateUser({
        data: { full_name: name, phone }
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to save profile. Make sure you are logged in.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5 text-amber-700" />
            Account Details
          </DialogTitle>
          <DialogDescription>
            Update your personal information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={user?.email || ""} 
              disabled 
              className="bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="pl-9 focus:ring-amber-400"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="pl-9 focus:ring-amber-400"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 font-medium">
              Profile saved successfully!
            </div>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-amber-800 hover:bg-amber-900 text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
