"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { directEnroll } from "@/app/actions/enrollment";

export default function EnrollButton({ course, hasPurchased }: { course: any; hasPurchased: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleEnroll = async () => {
    // If already purchased, go to learning page
    if (hasPurchased) {
      router.push(`/courses/${course.slug}/learn`);
      return;
    }

    // Direct enrollment for testing (bypasses Stripe)
    startTransition(async () => {
      const result = await directEnroll(course.id, course.slug);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully enrolled! Redirecting to course...");
        setTimeout(() => {
          router.push(`/courses/${course.slug}/learn`);
          router.refresh();
        }, 1000);
      }
    });

    /* 
    // STRIPE CHECKOUT CODE (Preserved for production)
    // Uncomment this section and remove directEnroll when ready for payments
    
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
    */
  };

  return (
    <Button
      size="lg"
      className="w-full h-14 text-lg rounded-full mb-4 flex items-center justify-center gap-2"
      onClick={handleEnroll}
      disabled={isPending}
    >
      {isPending ? "Enrolling..." : hasPurchased ? "Go to Course" : "Enroll Now (Free for Testing)"}
      {!isPending && <ArrowRight className="w-5 h-5" />}
    </Button>
  );
}