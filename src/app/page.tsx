import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout, Feather, ArrowRight, User, Github } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const contentImages = PlaceHolderImages.filter(img => img.id.startsWith('content-'));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-headline font-bold text-xl text-primary">
            <Layout className="w-6 h-6" />
            <span>WebCanvas</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
            <Link href="/explore" className="text-sm font-medium hover:text-primary">Explore</Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4 px-3 py-1">New: AI Content Assistant</Badge>
              <h1 className="text-5xl md:text-7xl font-bold font-headline leading-tight mb-6">
                Your Digital <span className="text-primary">Canvas</span> for Modern Content.
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Create, publish, and scale your web presence with WebCanvas. The most intuitive platform for writers, designers, and creators to share their vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 rounded-full shadow-lg" asChild>
                  <Link href="/dashboard">
                    Start Creating <Feather className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-full" asChild>
                  <Link href="/explore">
                    Explore Feed
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full hidden lg:block opacity-20">
             <Image 
              src={heroImage?.imageUrl || "https://picsum.photos/seed/webcanvas/800/800"} 
              alt="Background" 
              fill
              className="object-cover"
              priority
             />
          </div>
        </section>

        <section className="bg-muted/30 py-20 border-y">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold font-headline">Latest from the Community</h2>
                <p className="text-muted-foreground">Discover fresh ideas and trending content</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex" asChild>
                <Link href="/explore">View all <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Designing for Accessibility', tag: 'Design', author: 'Sarah Jenkins', time: '2h ago' },
                { title: 'Server-Side Magic with Next.js', tag: 'Code', author: 'Markus Chen', time: '5h ago' },
                { title: 'The Art of Minimalist Living', tag: 'Lifestyle', author: 'Elena Gray', time: '1d ago' },
              ].map((item, idx) => (
                <Card key={idx} className="group hover:shadow-xl transition-all duration-300 border-none bg-card overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={contentImages[idx % contentImages.length]?.imageUrl || `https://picsum.photos/seed/${idx}/800/500`} 
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">{item.tag}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Join us as we explore the foundational principles that make WebCanvas the go-to platform for high-quality {item.tag.toLowerCase()} publications.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <span>{item.author}</span>
                    </div>
                    <span>{item.time}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-headline font-bold text-lg text-primary mb-4">
                <Layout className="w-5 h-5" />
                <span>WebCanvas</span>
              </Link>
              <p className="text-sm text-muted-foreground">The digital canvas for creators of all kinds. Modern, fast, and secure.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Features</Link></li>
                <li><Link href="#" className="hover:text-primary">Integrations</Link></li>
                <li><Link href="#" className="hover:text-primary">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2025 WebCanvas Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Github className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}