import React from 'react';

export default function Terms() {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-montserrat font-bold text-3xl md:text-4xl mb-8">
          Conditions d'utilisation
        </h1>
        
        <div className="bg-dark-400 rounded-xl p-6 md:p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">
              Bienvenue sur CineStream, la plateforme qui vous permet de découvrir où regarder vos films et séries préférés en streaming légal.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptation des conditions</h2>
            <p>
              En utilisant notre service, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description du service</h2>
            <p>
              CineStream est un service d'information qui vous aide à trouver sur quelles plateformes de streaming légales sont disponibles les films et séries que vous recherchez. Notre service ne propose pas directement de contenu en streaming.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Données de The Movie Database (TMDb)</h2>
            <p>
              CineStream utilise les données fournies par The Movie Database (TMDb). Ces données sont protégées par les droits d'auteur et les conditions d'utilisation de TMDb.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Comptes utilisateurs</h2>
            <p>
              Pour certaines fonctionnalités comme sauvegarder vos favoris, vous pourriez avoir besoin de créer un compte. Vous êtes responsable de maintenir la confidentialité de vos informations de connexion.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitations de responsabilité</h2>
            <p>
              CineStream s'efforce de fournir des informations précises, mais ne garantit pas l'exactitude complète des données concernant la disponibilité des films et séries sur les plateformes de streaming. Les informations peuvent changer sans préavis en fonction des mises à jour des plateformes de streaming.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Modifications des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications prendront effet dès leur publication sur le site.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
            <p>
              Pour toute question concernant les présentes conditions d'utilisation, veuillez nous contacter via Instagram @letaif.nasser.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}