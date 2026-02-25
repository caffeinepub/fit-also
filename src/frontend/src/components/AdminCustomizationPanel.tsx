import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useGetPlatformConfig, useUpdatePlatformConfig } from '../hooks/useQueries';
import { Loader2, Save, Plus, Trash2, Edit, X } from 'lucide-react';
import { ExternalBlob, type Product, type PlatformConfig } from '../backend';

interface AdminCustomizationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminCustomizationPanel({ open, onOpenChange }: AdminCustomizationPanelProps) {
  const { data: config } = useGetPlatformConfig();
  const updateConfig = useUpdatePlatformConfig();

  const [products, setProducts] = useState(config?.products || []);
  const [fabrics, setFabrics] = useState(config?.fabrics || []);
  const [colors, setColors] = useState(config?.colors || []);
  const [workTypes, setWorkTypes] = useState(config?.workTypes || []);
  const [cities, setCities] = useState(config?.cities || []);
  const [banners, setBanners] = useState(config?.banners || []);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Sync state with config when it loads
  React.useEffect(() => {
    if (config) {
      setProducts(config.products);
      setFabrics(config.fabrics);
      setColors(config.colors);
      setWorkTypes(config.workTypes);
      setCities(config.cities);
      setBanners(config.banners);
    }
  }, [config]);

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      // For now, return a placeholder. In production, this should upload to blob storage
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      return dataUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!config) return;
    
    try {
      const updatedConfig: PlatformConfig = {
        ...config,
        products,
        fabrics,
        colors,
        workTypes,
        cities,
        banners,
      };
      
      await updateConfig.mutateAsync(updatedConfig);
      
      toast.success('Platform configuration updated successfully');
      
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update platform configuration');
    }
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">🎨 Platform Customization</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pb-6">
            {/* Products Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products ({products.length})</CardTitle>
                  <Button size="sm" onClick={() => {
                    toast.info('Add Product functionality - coming soon');
                  }}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {products.slice(0, 4).map((product) => (
                    <div key={product.id} className="flex gap-3 p-3 border rounded-lg">
                      <img 
                        src={product.image.getDirectURL()} 
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.title}</h4>
                        <p className="text-sm text-muted-foreground">₹{product.price}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cities Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cities ({cities.length})</CardTitle>
                  <Button size="sm" onClick={() => {
                    setCities([...cities, { id: crypto.randomUUID(), name: '' }]);
                  }}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add City
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-2">
                  {cities.map((city, idx) => (
                    <div key={city.id} className="flex items-center gap-2">
                      <Input
                        value={city.name}
                        onChange={(e) => {
                          const updated = [...cities];
                          updated[idx] = { ...city, name: e.target.value };
                          setCities(updated);
                        }}
                        placeholder="City name"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCities(cities.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fabrics Section */}
            <Card>
              <CardHeader>
                <CardTitle>Fabrics ({fabrics.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-2">
                  {fabrics.map((fabric, idx) => (
                    <div key={fabric.id} className="flex items-center gap-2">
                      <Input
                        value={fabric.name}
                        onChange={(e) => {
                          const updated = [...fabrics];
                          updated[idx] = { ...fabric, name: e.target.value };
                          setFabrics(updated);
                        }}
                        placeholder="Fabric name"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Colors Section */}
            <Card>
              <CardHeader>
                <CardTitle>Colors ({colors.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-2">
                  {colors.map((color, idx) => (
                    <div key={color.id} className="flex items-center gap-2">
                      <Input
                        value={color.name}
                        onChange={(e) => {
                          const updated = [...colors];
                          updated[idx] = { ...color, name: e.target.value };
                          setColors(updated);
                        }}
                        placeholder="Color name"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Types Section */}
            <Card>
              <CardHeader>
                <CardTitle>Work Types ({workTypes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-2">
                  {workTypes.map((workType, idx) => (
                    <div key={workType.id} className="flex items-center gap-2">
                      <Input
                        value={workType.name}
                        onChange={(e) => {
                          const updated = [...workTypes];
                          updated[idx] = { ...workType, name: e.target.value };
                          setWorkTypes(updated);
                        }}
                        placeholder="Work type name"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Save Button (Sticky Footer) */}
        <div className="border-t pt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={updateConfig.isPending}>
            {updateConfig.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
