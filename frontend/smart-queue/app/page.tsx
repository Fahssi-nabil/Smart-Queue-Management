import { Button } from "@/components/ui/button";
import { Users, Clock, BarChart3, ShieldCheck, ListStart } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">

          <div className="flex items-center gap-2">
            <ListStart className="h-7 w-7 text-blue-400" />
            <span className="text-xl font-semibold text-foreground">
              Qly
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/Login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/Register">
              <Button className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>

        </div>
      </header>


      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="mb-6 text-5xl md:text-6xl font-bold text-foreground">
            Manage Queues <br /> Smarter & Faster with Qly 
          </h1>

          <p className="mb-8 text-lg md:text-xl text-muted-foreground">
            Revolutionize your customer waiting experience with our smart queue management system.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Now
            </Button>

            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>

        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">

          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features to Streamline Your Queue
            </h2>
            <p className="text-muted-foreground">
              From customer management to real-time analytics, Qly has everything you need to optimize your service process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Customer Management
              </h3>
              <p className="text-muted-foreground">
                Easily add, track, and organize customers in the queue with live updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-lg bg-accent/10">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Real-Time Waiting Time
              </h3>
              <p className="text-muted-foreground">
                Show estimated waiting time to customers and improve transparency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-lg bg-accent/10">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Smart Analytics
              </h3>
              <p className="text-muted-foreground">
                Analyze busy hours, service speed, and customer flow to optimize operations.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to modernize your queue?
        </h2>

        <p className="text-muted-foreground mb-8">
          Start using Qly today and offer a better waiting experience.
        </p>

        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Get Started Free
        </Button>
      </section>


      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            <span className="font-semibold">Qly</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 Qly Smart Queue System. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}
