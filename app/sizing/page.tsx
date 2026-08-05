import { SizingGuide } from "@/components/sizing/SizingGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sizing Guide | NailVibe",
  description: "Find your perfect press-on nail size.",
};

export default function SizingPage() {
  return (
    <div className="min-h-screen pt-20">
      <SizingGuide />
    </div>
  );
}
