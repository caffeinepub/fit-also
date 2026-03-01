import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, type PlatformConfig, type Product } from "../backend";
import {
  useGetPlatformConfig,
  useUpdatePlatformConfig,
} from "../hooks/useQueries";

interface AdminCustomizationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminCustomizationPanel({
  open,
  onOpenChange,
}: AdminCustomizationPanelProps) {
  const { data: config } = useGetPlatformConfig();
  const updateConfig = useUpdatePlatformConfig();

  const [products, setProducts] = useState(config?.products || []);
  const [fabrics, setFabrics] = useState(config?.fabrics || []);
  const [colors, setColors] = useState(config?.colors || []);
  const [workTypes, setWorkTypes] = useState(config?.workTypes || []);
  const [cities, setCities] = useState(config?.cities || []);
  const [banners, setBanners] = useState(config?.banners || []);
  // biome-ignore lint/correctness/noUnusedVariables: used in handleImageUpload for future upload UI
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<{
    title: string;
    category: string;
    price: string;
    description: string;
    imageFile: File | null;
    imagePreview: string;
  }>({
    title: "",
    category: "Saree Blouse",
    price: "",
    description: "",
    imageFile: null,
    imagePreview: "",
  });

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

  // biome-ignore lint/correctness/noUnusedVariables: reserved for image upload feature
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

      toast.success("Platform configuration updated successfully");

      onOpenChange(false);
    } catch {
      toast.error("Failed to update platform configuration");
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.title.trim() || !newProduct.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Convert image to base64 if file provided
      let imageBlob = config?.products[0]?.image; // Default placeholder
      if (newProduct.imageFile) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(newProduct.imageFile!);
        });
        imageBlob = ExternalBlob.fromURL(base64);
      }

      const product: Product = {
        id: crypto.randomUUID(),
        title: newProduct.title,
        category: newProduct.category,
        price: Number.parseFloat(newProduct.price) || 0,
        description: newProduct.description,
        image:
          imageBlob ||
          ExternalBlob.fromURL(
            "/assets/generated/garment-placeholder.dim_400x500.png",
          ),
        tailorId: "admin",
        isDeleted: false,
        customizationOptions: {
          neckStyles: [],
          sleeveStyles: [],
          fabricTypes: [],
          colorPatterns: [],
          workTypes: [],
        },
      };

      setProducts([...products, product]);
      setAddProductOpen(false);
      setNewProduct({
        title: "",
        category: "Saree Blouse",
        price: "",
        description: "",
        imageFile: null,
        imagePreview: "",
      });
      toast.success("Product added! Remember to save changes.");
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleProductImageUpload = (file: File) => {
    setNewProduct((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            🎨 Platform Customization
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pb-6">
            {/* Products Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products ({products.length})</CardTitle>
                  <Button size="sm" onClick={() => setAddProductOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {products.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-3 p-3 border rounded-lg"
                    >
                      <img
                        src={product.image.getDirectURL()}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {product.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ₹{product.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.category}
                        </p>
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
                  <Button
                    size="sm"
                    onClick={() => {
                      setCities([
                        ...cities,
                        { id: crypto.randomUUID(), name: "" },
                      ]);
                    }}
                  >
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
                        onClick={() =>
                          setCities(cities.filter((_, i) => i !== idx))
                        }
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

      {/* Add Product Dialog */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Product Title *</Label>
              <Input
                value={newProduct.title}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Premium Silk Saree Blouse"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(v) =>
                    setNewProduct((p) => ({ ...p, category: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Saree Blouse">Saree Blouse</SelectItem>
                    <SelectItem value="Salwar Kameez">Salwar Kameez</SelectItem>
                    <SelectItem value="Lehenga">Lehenga</SelectItem>
                    <SelectItem value="Kurta">Kurta</SelectItem>
                    <SelectItem value="Sherwani">Sherwani</SelectItem>
                    <SelectItem value="Suit">Suit</SelectItem>
                    <SelectItem value="Dress">Dress</SelectItem>
                    <SelectItem value="Skirt">Skirt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="1500"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe the product..."
                rows={3}
              />
            </div>
            <div>
              <Label>Product Image</Label>
              <div className="mt-2 space-y-2">
                {newProduct.imagePreview && (
                  <img
                    src={newProduct.imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProductImageUpload(file);
                  }}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProductOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
