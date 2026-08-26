export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900">
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">🚀 AdaptiveLearn</h1>
          <nav className="space-x-4">
            <a href="/auth/signin" className="text-white hover:text-blue-200 transition">
              Connexion
            </a>
            <a href="/auth/signup" className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
              S'inscrire
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center text-white mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Apprentissage Adaptatif pour Tous
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Une plateforme qui s'adapte à votre niveau et votre vitesse d'apprentissage
          </p>
          <a
            href="/auth/signup"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            Commencer Gratuitement
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg text-white">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Contenu Riche</h3>
            <p className="text-blue-100">
              Cours, exercices, simulations, quiz et projets
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg text-white">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-2">Adaptatif</h3>
            <p className="text-blue-100">
              Difficulté ajustée selon vos erreurs et votre progression
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg text-white">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Gamifié</h3>
            <p className="text-blue-100">
              Points, niveaux, badges et achievements
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
