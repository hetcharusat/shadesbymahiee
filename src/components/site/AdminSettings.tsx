import React, { useState } from "react";
import { productService } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, QrCode } from "lucide-react";
import { toast } from "sonner";

export function AdminSettings() {
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return toast.error("Please upload an image file");
      setQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    if (!qrFile) return toast.error("Please select a new QR code image");

    setSaving(true);
    // Overwrite the existing qr_code.jpg to keep the URL consistent
    const uploadRes = await productService.uploadImage(qrFile, "qr_code.jpg");
    
    if (uploadRes.success) {
      toast.success("QR Code updated successfully! It may take a few minutes for the cache to clear on the storefront.");
      setQrFile(null);
      setPreviewUrl("");
    } else {
      toast.error("Failed to upload QR code: " + uploadRes.error);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Store Settings</h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
          <QrCode className="w-5 h-5 text-indigo-500" /> UPI Payment QR Code
        </h3>
        
        <p className="text-sm text-slate-500 mb-6">
          Upload your latest GPay / PhonePe / UPI QR code here. When customers choose "Online Payment", this QR code will be displayed for them to scan.
        </p>

        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-200 rounded-2xl cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
            {previewUrl ? (
              <img src={previewUrl} className="h-full object-contain p-2" alt="QR Preview" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-indigo-400 mb-3" />
                <p className="text-sm font-semibold text-indigo-700">Click to upload new QR Code</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleQrChange} />
          </label>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSaveSettings} 
              disabled={saving || !qrFile}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
