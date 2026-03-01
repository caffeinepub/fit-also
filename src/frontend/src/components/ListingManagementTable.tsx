import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useCatalog } from "../hooks/useCatalog";
import { useLanguage } from "../hooks/useLanguage";
import { useTailors } from "../hooks/useTailors";
import type { GarmentCategory, ProductListing } from "../types/catalog";
import { LuxuryButton } from "./LuxuryButton";
import { LuxuryCard } from "./LuxuryCard";

const CATEGORIES: GarmentCategory[] = [
  "Shirts",
  "Kurtas",
  "Suits",
  "Sherwanis",
  "Trousers",
  "Lehengas",
  "Saree Blouses",
  "Anarkalis",
];

const ALL_NECK = ["round", "vNeck", "mandarin", "boat", "square", "sweetheart"];
const ALL_SLEEVE = ["full", "half", "sleeveless", "threequarter", "cap"];
const ALL_FABRIC = [
  "cotton",
  "silk",
  "linen",
  "chiffon",
  "georgette",
  "velvet",
  "brocade",
  "crepe",
];
const ALL_COLOR = [
  "ivory",
  "red",
  "navy",
  "emerald",
  "gold",
  "burgundy",
  "blush",
  "black",
];
const ALL_WORK = ["plain", "embroidery", "zari", "sequin", "mirror", "block"];

type ListingForm = {
  title: string;
  description: string;
  category: GarmentCategory;
  basePrice: number;
  estimatedDays: number;
  availableNeckStyles: string[];
  availableSleeveStyles: string[];
  availableFabrics: string[];
  availableColors: string[];
  availableWorkTypes: string[];
};

function defaultForm(): ListingForm {
  return {
    title: "",
    description: "",
    category: "Kurtas",
    basePrice: 2000,
    estimatedDays: 14,
    availableNeckStyles: ["round"],
    availableSleeveStyles: ["full"],
    availableFabrics: ["cotton"],
    availableColors: ["ivory"],
    availableWorkTypes: ["plain"],
  };
}

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function MultiSelect({
  options,
  selected,
  onChange,
}: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(toggleArr(selected, o))}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            selected.includes(o)
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function ListingManagementTable() {
  const { t } = useLanguage();
  const { listings, createListing, updateListing, deleteListing } =
    useCatalog();
  const { getMyTailorProfile } = useTailors();
  const tailorProfile = getMyTailorProfile();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ListingForm>(defaultForm());

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm());
    setShowForm(true);
  };

  const openEdit = (listing: ProductListing) => {
    setEditingId(listing.id);
    setForm({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      basePrice: listing.basePrice,
      estimatedDays: listing.estimatedDays,
      availableNeckStyles: listing.availableNeckStyles,
      availableSleeveStyles: listing.availableSleeveStyles,
      availableFabrics: listing.availableFabrics,
      availableColors: listing.availableColors,
      availableWorkTypes: listing.availableWorkTypes,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      updateListing(editingId, form as any);
    } else {
      createListing({
        ...(form as any),
        tailorId: tailorProfile?.id ?? "unknown",
        tailorName: tailorProfile?.shopName ?? "Unknown Tailor",
        tailorCity: tailorProfile?.city ?? "",
      });
    }
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-semibold">
          {t("dash.myListings")}
        </h3>
        <LuxuryButton variant="primary" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Create Listing
        </LuxuryButton>
      </div>

      <LuxuryCard>
        {listings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No listings yet. Create your first one!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {listing.category}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    ₹{listing.basePrice.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(listing)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteListing(listing.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </LuxuryCard>

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) setShowForm(false);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingId ? "Edit Listing" : "Create New Listing"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, category: v as GarmentCategory }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Base Price (₹)</Label>
                <Input
                  type="number"
                  value={form.basePrice}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      basePrice: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Estimated Days</Label>
              <Input
                type="number"
                value={form.estimatedDays}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    estimatedDays: Number.parseInt(e.target.value) || 14,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Neck Styles</Label>
              <MultiSelect
                options={ALL_NECK}
                selected={form.availableNeckStyles}
                onChange={(v) =>
                  setForm((p) => ({ ...p, availableNeckStyles: v }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Sleeve Styles</Label>
              <MultiSelect
                options={ALL_SLEEVE}
                selected={form.availableSleeveStyles}
                onChange={(v) =>
                  setForm((p) => ({ ...p, availableSleeveStyles: v }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Fabrics</Label>
              <MultiSelect
                options={ALL_FABRIC}
                selected={form.availableFabrics}
                onChange={(v) =>
                  setForm((p) => ({ ...p, availableFabrics: v }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Colors</Label>
              <MultiSelect
                options={ALL_COLOR}
                selected={form.availableColors}
                onChange={(v) => setForm((p) => ({ ...p, availableColors: v }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Work Types</Label>
              <MultiSelect
                options={ALL_WORK}
                selected={form.availableWorkTypes}
                onChange={(v) =>
                  setForm((p) => ({ ...p, availableWorkTypes: v }))
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <LuxuryButton
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                {t("common.cancel")}
              </LuxuryButton>
              <LuxuryButton
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleSave}
                disabled={!form.title.trim()}
              >
                {t("common.save")}
              </LuxuryButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
