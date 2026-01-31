'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/database/connection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { Upload, X, Package, Loader2, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductSubmissionForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    serialNumber: '', // will be auto-generated or manual? assuming manual for now as per previous
    productName: '',
    brand: '',
    description: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error('You must be logged in to submit a product');

      const imageUrls: string[] = [];

      // Upload images
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Create product record
      const { error: dbError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          product_name: formData.productName,
          brand: formData.brand,
          description: formData.description,
          serial_number: formData.serialNumber,
          images: imageUrls,
          status: 'pending'
        });

      if (dbError) throw dbError;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <GlassCard className="p-8 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Product Details</h2>
            <p className="text-slate-500">Provide comprehensive information for authentication.</p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 mb-6 rounded-lg bg-red-50 text-red-600 border border-red-100"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Brand/Manufacturer</Label>
              <Input
                placeholder="e.g. Rolex, Nike, Apple"
                className="h-12"
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                placeholder="e.g. Submariner Date, Air Jordan 1"
                className="h-12"
                value={formData.productName}
                onChange={e => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Serial Number / ID</Label>
              <Input
                placeholder="Unique Identifier found on product"
                className="h-12 font-mono text-sm"
                value={formData.serialNumber}
                onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description & Details</Label>
            <Textarea
              placeholder="Describe the condition, provenance, and any specific details..."
              className="min-h-[200px] p-4 leading-relaxed resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-8 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
            <ImagePlus className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Visual Evidence</h2>
            <p className="text-slate-500">Upload high-resolution images of the product and its packaging.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <AnimatePresence>
            {imagePreviews.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary">
              <Upload className="w-8 h-8" />
              <span className="text-xs font-semibold uppercase">Upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </AnimatePresence>
        </div>
      </GlassCard>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto px-8 h-12 text-lg rounded-full shadow-xl shadow-primary/20 bg-primary hover:bg-primary-600"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Verification Request'
          )}
        </Button>
      </div>
    </form>
  );
}
