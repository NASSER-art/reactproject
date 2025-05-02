import React from 'react';

export default function Privacy() {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-montserrat font-bold text-3xl md:text-4xl mb-8">
          Politique de confidentialité
        </h1>
        
        <div className="bg-dark-400 rounded-xl p-6 md:p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">
              Chez CineStream, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Informations que nous collectons</h2>
            <p>
              Nous collectons les informations suivantes :
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Informations que vous nous fournissez volontairement (par exemple, lorsque vous créez un compte)</li>
              <li>Informations collectées automatiquement (comme les données d'utilisation du site et les cookies)</li>
              <li>Vos préférences de films et séries lorsque vous utilisez la fonction "Favoris"</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Utilisation des informations</h2>
            <p>
              Nous utilisons vos informations pour :
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Améliorer notre service</li>
              <li>Communiquer avec vous concernant votre compte</li>
              <li>Vous fournir des recommandations personnalisées</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Protection des données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès, l'altération, la divulgation ou la destruction non autorisés.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Partage d'informations</h2>
            <p>
              Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles identifiables à des tiers. Cela n'inclut pas les tiers de confiance qui nous aident à exploiter notre site web ou à vous fournir des services, tant qu'ils acceptent de garder ces informations confidentielles.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous avertir lorsqu'un cookie est envoyé.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Vos droits</h2>
            <p>
              Conformément aux lois sur la protection des données, vous avez le droit d'accéder, de corriger, de supprimer ou de limiter l'utilisation de vos données personnelles. Vous pouvez également vous opposer au traitement de vos données et demander la portabilité de vos données.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications de la politique de confidentialité</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications prendront effet dès leur publication sur le site.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
            <p>
              Pour toute question concernant notre politique de confidentialité, veuillez nous contacter via Instagram @letaif.nasser.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}