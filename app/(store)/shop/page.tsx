import { ProductGrid } from "@/components/products/ProductGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Sets | NailVibe",
  description: "Browse our full collection of handcrafted press-on nails.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const collection = typeof params.collection === "string" ? params.collection : undefined;

  return (
    <div className="min-h-screen pt-20">
      <ProductGrid collection={collection} />
    </div>
  );
}
