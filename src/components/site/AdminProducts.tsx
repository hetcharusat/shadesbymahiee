import React, { useState, useEffect } from "react";
import { productService } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Edit2, Trash2, Image as ImageIcon, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [tag, setTag] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await productService.getAllProducts();
    if (res.success) setProducts(res.data);
    setLoading(false);
  };

  const openModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setDiscountPrice(product.discount_price ? product.discount_price.toString() : "");
      setStock(product.stock_quantity.toString());
      setTag(product.tag || "");
      setIsActive(product.is_active);
      setCurrentImageUrl(product.image_url);
      setImageFile(null);
    } else {
      setEditingProduct(null);
      setName("");
      setDescription("");
      setPrice("");
      setDiscountPrice("");
      setStock("10");
      setTag("");
      setIsActive(true);
      setCurrentImageUrl("");
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    let finalImageUrl = currentImageUrl;

    // 1. Upload Image if new file selected
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const uploadRes = await productService.uploadImage(imageFile, fileName);
      if (uploadRes.success) {
        finalImageUrl = uploadRes.url;
      } else {
        alert("Failed to upload image: " + uploadRes.error);
        setSaving(false);
        return;
      }
    }

    if (!finalImageUrl) {
      alert("Please upload an image.");
      setSaving(false);
      return;
    }

    const payload = {
      name,
      description,
      price: parseFloat(price),
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      stock_quantity: parseInt(stock, 10),
      tag,
      is_active: isActive,
      image_url: finalImageUrl
    };

    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, payload);
    } else {
      await productService.addProduct(payload);
    }

    setSaving(false);
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await productService.deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Products</h2>
        <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">No products found. Add one!</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col ${!p.is_active && 'opacity-60 grayscale-[50%]'}`}>
              <div className="aspect-square bg-slate-100 relative">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                {!p.is_active && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">Hidden</span>
                  </div>
                )}
                {p.tag && (
                  <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 line-clamp-1 text-sm sm:text-base">{p.name}</h3>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                  <span className="font-semibold text-slate-900 text-sm sm:text-base">₹{p.discount_price || p.price}</span>
                  {p.discount_price && <span className="text-[10px] sm:text-xs text-slate-400 line-through">₹{p.price}</span>}
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-50 flex justify-between items-center mt-auto">
                  <span className="text-[10px] sm:text-xs text-slate-500">Stock: {p.stock_quantity}</span>
                  <div className="flex gap-1 sm:gap-2">
                    <button onClick={() => openModal(p)} className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Swastik Wall Art" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Original Price (₹)</Label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="999" />
              </div>
              <div className="space-y-2">
                <Label>Sale Price (₹)</Label>
                <Input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} placeholder="Optional" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input type="number" value={stock} onChange={e => setStock(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tag / Badge</Label>
                <Input value={tag} onChange={e => setTag(e.target.value)} placeholder="E.g. Bestseller" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-4">
                {(imageFile || currentImageUrl) ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                    <img src={imageFile ? URL.createObjectURL(imageFile) : currentImageUrl} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="flex-1" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-4">
              <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <Label htmlFor="isActive" className="cursor-pointer">Product is active (visible on store)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
