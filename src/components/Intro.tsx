import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Package, Ruler } from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    icon: Users,
    title: 'Gérez vos clients facilement',
    description: 'Organisez toutes les informations de vos clients en un seul endroit. Photos, contacts, historique des commandes.',
    image: 'https://i.ibb.co/BKNjQDPX/00b0879e255400ef2ed1f3563faad69a.jpg'
  },
  {
    id: 2,
    icon: Package,
    title: 'Ne perdez plus aucune commande',
    description: 'Suivez vos commandes de A à Z. Dates de livraison, paiements, statuts - tout est sous contrôle.',
    image: 'https://i.ibb.co/TMDgFWYj/ca6ae50fa968d55259bc8ad49d068f7a.jpg'
  },
  {
    id: 3,
    icon: Ruler,
    title: 'Optimisez vos mesures',
    description: 'Prenez et sauvegardez toutes les mesures importantes. Historique complet pour chaque client.',
    image: 'https://images.pexels.com/photos/7691820/pexels-photo-7691820.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function Intro({ onComplete }: IntroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-[#0A3764]">Bienvenue sur COUTUPRO</h1>
      </div>

      {/* Carousel */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <div key={slide.id} className="w-full flex-shrink-0 px-6">
                <div className="h-full flex flex-col justify-center items-center text-center max-w-md mx-auto">
                  {/* Image */}
                  <div className="w-64 h-48 rounded-2xl overflow-hidden mb-6 shadow-lg">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-[#0A3764] rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-opacity ${
            currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
          }`}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6 text-[#0A3764]" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#0A3764] rounded-full shadow-lg flex items-center justify-center"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center space-x-2 py-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-[#0A3764]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <button
          onClick={nextSlide}
          className="w-full bg-[#0A3764] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#195885] transition-colors"
        >
          {currentSlide === slides.length - 1 ? 'Commencer' : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}