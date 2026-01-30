'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

export default function ProductSubmissionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    serialNumber: '',
    brand: '',
    productName: '',
    description: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);

      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);

    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const submitFormData = new FormData();
      submitFormData.append('serialNumber', formData.serialNumber);
      submitFormData.append('brand', formData.brand);
      submitFormData.append('productName', formData.productName);
      submitFormData.append('description', formData.description);

      images.forEach((image) => {
        submitFormData.append('images', image);
      });

      const response = await fetch('/api/products/submit', {
        method: 'POST',
        body: submitFormData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Submit Product for Authentication</CardTitle>
            <CardDescription className="text-base">
              Fill in the details below to submit your product for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                Product submitted successfully! Redirecting to dashboard...
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Serial Number */}
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  type="text"
                  placeholder="Enter product serial number"
                  required
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder="Enter brand name"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  name="productName"
                  type="text"
                  placeholder="Enter product name"
                  required
                  value={formData.productName}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Add any additional details about the product"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Product Images *</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    required={images.length === 0}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-1">
                      Click to upload images
                    </p>
                    <p className="text-xs text-slate-500">
                      PNG, JPG up to 10MB
                    </p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && (
                  <p className="text-sm text-slate-600 mt-2">
                    {images.length} file(s) selected
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
