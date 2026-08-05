import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { BestsellersRail } from "@/components/home/BestsellersRail";
import { UGCGallery } from "@/components/home/UGCGallery";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <BestsellersRail />
      <UGCGallery />
    </>
  );
}
