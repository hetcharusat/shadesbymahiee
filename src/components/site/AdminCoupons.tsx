import React, { useState, useEffect } from "react";
import { couponService } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit2, Trash2, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  
  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const res = await couponService.getAllCoupons();
    if (res.success) setCoupons(res.data);
    setLoading(false);
  };

  const openModal = (coupon?: any) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCode(coupon.code);
      setDiscountType(coupon.discount_type);
      setDiscountValue(coupon.discount_value.toString());
      setMinOrder(coupon.min_order_value ? coupon.min_order_value.toString() : "");
      setIsActive(coupon.is_active);
    } else {
      setEditingCoupon(null);
      setCode("");
      setDiscountType("percentage");
      setDiscountValue("");
      setMinOrder("");
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      code: code.toUpperCase(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      min_order_value: minOrder ? parseFloat(minOrder) : null,
      is_active: isActive,
    };

    if (editingCoupon) {
      await couponService.updateCoupon(editingCoupon.id, payload);
    } else {
      await couponService.addCoupon(payload);
    }
    setSaving(false);
    setIsModalOpen(false);
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      await couponService.deleteCoupon(id);
      fetchCoupons();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Discount Coupons</h2>
        <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            <Tag className="w-12 h-12 mx-auto text-slate-200 mb-4" />
            <p>No coupons active. Create one to run a sale!</p>
          </div>
        ) : (
          coupons.map((c) => (
            <div key={c.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Tag className="w-5 h-5" /></div>
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-lg tracking-wider">{c.code}</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {c.min_order_value ? `Min. ₹${c.min_order_value}` : 'No minimum order'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {c.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-lg font-black text-indigo-600">
                  {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(c)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Coupon Code</Label>
              <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="E.g. DIWALI50" className="uppercase font-mono tracking-wider font-bold" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === 'percentage' ? "20" : "500"} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Minimum Order Value (₹) <span className="text-slate-400 font-normal">- Optional</span></Label>
              <Input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="Leave blank for no minimum" />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-4">
              <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <Label htmlFor="isActive" className="cursor-pointer">Coupon is active and can be used</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
