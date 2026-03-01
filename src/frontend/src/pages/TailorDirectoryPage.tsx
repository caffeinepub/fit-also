import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Clock, MapPin, Scissors, Search } from "lucide-react";
import React, { useState } from "react";
import { LuxuryButton } from "../components/LuxuryButton";
import { LuxuryCard } from "../components/LuxuryCard";
import { useLanguage } from "../hooks/useLanguage";
import { useTailors } from "../hooks/useTailors";

const CITIES = [
  "All Cities",
  "Mumbai",
  "Delhi",
  "Jaipur",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
];
const SPECIALTIES = [
  "All Specialties",
  "Shirts",
  "Kurtas",
  "Suits",
  "Sherwanis",
  "Trousers",
  "Lehengas",
  "Saree Blouses",
  "Anarkalis",
];

export function TailorDirectoryPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { approvedTailors } = useTailors();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const [specialty, setSpecialty] = useState("All Specialties");

  const filtered = approvedTailors.filter((tailor) => {
    const matchSearch =
      !search || tailor.shopName.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "All Cities" || tailor.city === city;
    const matchSpecialty =
      specialty === "All Specialties" || tailor.specialties.includes(specialty);
    return matchSearch && matchCity && matchSpecialty;
  });

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-8">
        <p className="text-accent font-medium text-sm tracking-widest uppercase mb-1">
          Artisans
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          {t("tailor.directory")}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tailors..."
            className="pl-9"
          />
        </div>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPECIALTIES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Scissors className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No tailors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tailor) => (
            <LuxuryCard
              key={tailor.id}
              hover
              onClick={() =>
                navigate({ to: "/tailors/$id", params: { id: tailor.id } })
              }
              className="p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground">
                    {tailor.shopName}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {tailor.city}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {tailor.bio}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tailor.specialties.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm border-t border-border pt-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {tailor.turnaroundDays} {t("common.days")}
                  </span>
                </div>
                <span className="font-semibold text-primary">
                  From ₹{tailor.basePricing.toLocaleString()}
                </span>
              </div>
            </LuxuryCard>
          ))}
        </div>
      )}
    </div>
  );
}
