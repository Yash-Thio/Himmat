import { ArrowRight, MapPin, Shield, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="relative isolate">
      <div className="mx-auto relative -mt-24 max-w-7xl overflow-hidden px-6 pb-5 text-center sm:mb-16 pt-24 sm:pt-48 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Travel Safely with
          <span className="text-primary"> Confidence.</span>
        </h1>

        <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover the safest routes for your journey with real-time safety
          data, community insights, and AI-powered recommendations. Your safety
          is our priority.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg">
            Start Planning Your Route
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Real-time Updates
            </h3>
            <p className="text-muted-foreground">
              Live safety data and route conditions
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Community Driven
            </h3>
            <p className="text-muted-foreground">
              Insights from fellow travelers
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              AI-Powered Safety
            </h3>
            <p className="text-muted-foreground">
              Smart recommendations for safer travel
            </p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
