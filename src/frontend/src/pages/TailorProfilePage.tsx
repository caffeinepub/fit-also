import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, ExternalLink, MapPin, Scissors } from "lucide-react";
import React from "react";
import { LuxuryButton } from "../components/LuxuryButton";
import { LuxuryCard } from "../components/LuxuryCard";
import { useCatalog } from "../hooks/useCatalog";
import { useLanguage } from "../hooks/useLanguage";
import { useTailors } from "../hooks/useTailors";

export function TailorProfilePage() {
  const { id } = useParams({ from: "/tailors/$id" });
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { tailors } = useTailors();
  const { listings } = useCatalog();

  const tailor = tailors.find((t) => t.id === id);
  const tailorListings = listings.filter((l) => l.tailorId === id);

  if (!tailor) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Tailor not found.</p>
        <LuxuryButton
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => navigate({ to: "/tailors" })}
        >
          Back to Directory
        </LuxuryButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <button
        type="button"
        onClick={() => navigate({ to: "/tailors" })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <LuxuryCard className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Scissors className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {tailor.shopName}
              </h1>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{tailor.city}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Turnaround</span>
                </div>
                <span className="font-semibold text-sm">
                  {tailor.turnaroundDays} days
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm text-muted-foreground">
                  Starting from
                </span>
                <span className="font-bold text-primary">
                  ₹{tailor.basePricing.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold text-sm mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-1.5">
                {tailor.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <LuxuryButton variant="outline" size="md" className="w-full mt-5">
              {t("tailor.contact")}
            </LuxuryButton>
          </LuxuryCard>

          {/* Portfolio */}
          {tailor.portfolioUrls.filter((u) => u).length > 0 && (
            <LuxuryCard className="p-5">
              <h3 className="font-serif font-semibold mb-3">Portfolio</h3>
              <div className="space-y-2">
                {tailor.portfolioUrls
                  .filter((u) => u)
                  .map((url, i) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Portfolio {i + 1}
                    </a>
                  ))}
              </div>
            </LuxuryCard>
          )}
        </div>

        {/* Bio + Listings */}
        <div className="lg:col-span-2 space-y-6">
          <LuxuryCard className="p-6">
            <h2 className="font-serif text-xl font-semibold mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {tailor.bio || "No bio provided."}
            </p>
          </LuxuryCard>

          {tailorListings.length > 0 && (
            <div>
              <h2 className="font-serif text-xl font-semibold mb-4">
                Available Listings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tailorListings.map((listing) => (
                  <LuxuryCard
                    key={listing.id}
                    hover
                    onClick={() =>
                      navigate({
                        to: "/listings/$id",
                        params: { id: listing.id },
                      })
                    }
                    className="overflow-hidden"
                  >
                    <img
                      src="/assets/generated/garment-placeholder.dim_400x500.png"
                      alt={listing.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <span className="text-xs text-muted-foreground">
                        {listing.category}
                      </span>
                      <h3 className="font-serif font-semibold text-foreground mt-0.5">
                        {listing.title}
                      </h3>
                      <p className="font-bold text-primary font-serif mt-1">
                        ₹{listing.basePrice.toLocaleString()}
                      </p>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
