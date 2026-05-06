import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FileText } from "lucide-react";

export default function VisaPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold">Visa Services</h1>
          </div>
          <p className="text-muted-foreground">Visa services coming soon.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
