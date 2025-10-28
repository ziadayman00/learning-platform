"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function EnrollButton({ course, hasPurchased }: { course: any; hasPurchased: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    // If already purchased, go to learning page
    if (hasPurchased) {
      router.push(`/courses/${course.slug}/learn`);
      return;
    }

    // Otherwise, go to checkout
    try {
      setLoading(true);
      toast.loading("Redirecting to payment...");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");

      const data = await res.json();
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <Button
      size="lg"
      className="w-full h-14 text-lg rounded-full mb-4 flex items-center justify-center gap-2"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? "Loading..." : hasPurchased ? "Go to Course" : "Enroll Now"}
      {!loading && <ArrowRight className="w-5 h-5" />}
    </Button>
  );
}