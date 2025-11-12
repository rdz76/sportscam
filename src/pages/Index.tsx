import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Radio, Library, Settings, Star, Zap, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-sports.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Video,
      title: "Registrazione Professionale",
      description: "Registra le tue partite in alta qualità direttamente sul tuo dispositivo",
    },
    {
      icon: Radio,
      title: "Streaming Live",
      description: "Trasmetti in diretta su qualsiasi server RTMP compatibile",
    },
    {
      icon: Star,
      title: "Highlights Istantanei",
      description: "Segna i momenti salienti con un solo tocco durante la registrazione",
    },
    {
      icon: Zap,
      title: "Tabellone Personalizzabile",
      description: "Aggiungi punteggio e timer alle tue registrazioni",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Sports action"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                SportsCam Pro
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Registra, trasmetti e condividi le tue partite come un professionista
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/record")}
                className="text-lg h-14 px-8 shadow-[var(--shadow-primary)]"
              >
                <Video className="w-5 h-5 mr-2" />
                Inizia a Registrare
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/library")}
                className="text-lg h-14 px-8"
              >
                <Library className="w-5 h-5 mr-2" />
                Le Mie Registrazioni
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tutto ciò di cui hai bisogno
            </h2>
            <p className="text-muted-foreground text-lg">
              Funzionalità professionali per registrazioni sportive
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-[var(--shadow-primary)] transition-all hover:-translate-y-1"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Smartphone className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto per iniziare?
          </h2>
          <p className="text-xl text-muted-foreground">
            Trasforma il tuo dispositivo in una telecamera sportiva professionale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/record")}
              className="text-lg h-14 px-8"
            >
              <Video className="w-5 h-5 mr-2" />
              Inizia Ora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/settings")}
              className="text-lg h-14 px-8"
            >
              <Settings className="w-5 h-5 mr-2" />
              Configura l'App
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
