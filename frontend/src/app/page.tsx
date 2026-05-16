import { Features } from "@/components/home/features";
import { VideoDemo } from "@/components/home/video-demo";
import { Workflow } from "@/components/home/workflow";
import { Hero } from "@/components/home/hero";
import { Footer } from "@/components/layout/footer";
import { TickerTape } from "@/components/home/ticker-tape";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Hero />
      <Features />
      <VideoDemo />
      
      {/* Workflow Section Wrapper */}
      <div id="workflow-section" className="bg-black">
        <Workflow />
      </div>

      <TickerTape />
      <Footer />
    </div>
  );
}
