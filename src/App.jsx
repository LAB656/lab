import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  PenTool,
  Trash2,
  Plus,
  X,
  ChevronLeft,
  Calendar,
  User,
  Search,
  Menu,
  Share2,
  Printer,
  Loader2,
} from 'lucide-react'

// --- Supabase ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Simple Card Component for Layout
const Card = ({ children, className = '' }) => (
  <div className={`bg-white border-2 border-stone-800 shadow-sm ${className}`}>{children}</div>
)

export default function App() {
  // --- State ---
  const [view, setView] = useState('frontpage') // 'frontpage', 'article', 'editor'
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    subtitle: '',
    category: 'General',
    author: '',
    content: '',
  })
  const [isEditing, setIsEditing] = useState(false)

  const [loading, setLoading] = useState(true)

  // --- Auth UI ---
  const [session, setSession] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authBusy, setAuthBusy] = useState(false)
  const [authForm, setAuthForm] = useState({ email: '', password: '' })

  const canEdit = !!session

  // --- Demo fallback (si Supabase no tiene filas o no hay conexión) ---
  const DEMO_ARTICLES = [
    {
      id: 'demo-1',
      title: 'La Inteligencia Artificial Transforma el Arte Moderno',
      subtitle: 'Un debate sobre la creatividad y los algoritmos generativos que sacude las galerías.',
      category: 'Cultura',
      author: 'Elena R. G.',
      date: '2023-10-24',
      content:
        "En un giro sin precedentes para el mundo del arte contemporáneo, las galerías más prestigiosas de la ciudad han comenzado a exhibir obras generadas enteramente por algoritmos. La crítica se encuentra dividida: ¿es esto el fin de la expresión humana o el comienzo de una nueva simbiosis? Los precios de estas obras digitales han alcanzado cifras astronómicas, mientras los tradicionalistas protestan a las puertas de los museos exigiendo una distinción clara entre el arte humano y el sintético.",
      highlight: true,
    },
    {
      id: 'demo-2',
      title: 'Nuevas Reformas Urbanas Aprobadas',
      subtitle: 'El concejo municipal da luz verde al proyecto de peatonalización del centro histórico.',
      category: 'Política',
      author: 'Mario Velasco',
      date: '2023-10-23',
      content:
        "Tras meses de deliberación y múltiples consultas ciudadanas, el proyecto 'Ciudad Caminable' ha sido aprobado por unanimidad.",
      highlight: false,
    },
    {
      id: 'demo-3',
      title: 'El Equipo Local Gana el Campeonato Regional',
      subtitle: 'Una victoria agónica en el último minuto asegura la copa.',
      category: 'Deportes',
      author: 'J.J. López',
      date: '2023-10-22',
      content:
        'Nadie esperaba este desenlace. Con un jugador menos y el marcador en contra, el equipo de Los Leones logró revertir el resultado.',
      highlight: false,
    },
    {
      id: 'demo-4',
      title: 'Avances en Energía Solar',
      subtitle: 'Científicos locales desarrollan paneles un 20% más eficientes.',
      category: 'Ciencia',
      author: 'Dra. S. Mendez',
      date: '2023-10-21',
      content:
        'El laboratorio de energías renovables de la universidad tecnológica ha presentado un prototipo que podría cambiar el mercado energético doméstico.',
      highlight: false,
    },
  ]

  // --- Session: getSession + onAuthStateChange ---
  useEffect(() => {
    if (!supabase) return

    let mounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return
      if (error) console.error(error)
      setSession(data.session ?? null)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const fetchArticles = async () => {
    setLoading(true)

    if (!supabase) {
      setArticles(DEMO_ARTICLES)
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error(error)
      setArticles(DEMO_ARTICLES)
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      setArticles([])
      setLoading(false)
      return
    }

    const adapted = data.map((a) => ({
      ...a,
      date: a.date || (a.created_at ? new Date(a.created_at).toISOString().slice(0, 10) : ''),
    }))
    setArticles(adapted)
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // --- Actions ---
  const handleOpenArticle = (article) => {
    setSelectedArticle(article)
    setView('article')
    window.scrollTo(0, 0)
  }

  const handleCreateNew = () => {
    if (!session) {
      setAuthOpen(true)
      return
    }
    setFormData({
      id: null,
      title: '',
      subtitle: '',
      category: 'General',
      author: '',
      content: '',
    })
    setIsEditing(false)
    setView('editor')
  }

  const handleEditArticle = (article) => {
    if (!session) {
      setAuthOpen(true)
      return
    }
    setFormData({
      id: article.id,
      title: article.title || '',
      subtitle: article.subtitle || '',
      category: article.category || 'General',
      author: article.author || '',
      content: article.content || '',
      date: article.date || '',
    })
    setIsEditing(true)
    setView('editor')
  }

  const handleDeleteArticle = async (id) => {
    if (!session) {
      setAuthOpen(true)
      return
    }

    const ok = window.confirm('¿Borrar esta nota?')
    if (!ok) return

    // si es demo, bórralo local
    if (String(id).startsWith('demo-') || !supabase) {
      setArticles((prev) => prev.filter((a) => a.id !== id))
      if (view === 'article' && selectedArticle?.id === id) setView('frontpage')
      return
    }

    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) {
      console.error(error)
      alert('No se pudo borrar (revisa RLS/policies).')
      return
    }
    if (view === 'article' && selectedArticle?.id === id) {
      setSelectedArticle(null)
      setView('frontpage')
    }
    await fetchArticles()
  }

  const handleSave = async (e) => {
    e.preventDefault()

    // demo local si no hay supabase
    if (!supabase) {
      const now = new Date().toISOString().split('T')[0]
      if (isEditing) {
        setArticles((prev) => prev.map((a) => (a.id === formData.id ? { ...formData, date: now } : a)))
      } else {
        const newArticle = { ...formData, id: Date.now(), date: now, highlight: false }
        setArticles((prev) => [newArticle, ...prev])
      }
      setView('frontpage')
      return
    }

    if (!session) {
      setAuthOpen(true)
      return
    }

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      category: formData.category || 'General',
      author: formData.author,
      content: formData.content,
      date: new Date().toISOString().slice(0, 10),
    }

    try {
      setLoading(true)
      if (isEditing && formData.id != null) {
        const { error } = await supabase.from('articles').update(payload).eq('id', formData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('articles').insert(payload)
        if (error) throw error
      }

      await fetchArticles()
      setView('frontpage')
    } catch (err) {
      console.error(err)
      alert('Error al guardar (revisa RLS/policies).')
    } finally {
      setLoading(false)
    }
  }

  // --- Auth handlers ---
  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!supabase) return

    setAuthBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    })
    setAuthBusy(false)

    if (error) {
      console.error(error)
      alert('No se pudo iniciar sesión. Revisa email/password.')
      return
    }

    setAuthOpen(false)
    setAuthForm({ email: '', password: '' })
  }

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  // --- Views ---
  const Navbar = () => (
    <div className="border-b-4 border-black mb-6 bg-stone-100">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center text-xs uppercase tracking-widest border-b border-stone-300">
        <div className="flex gap-4">
          <span>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="hidden md:inline"> | Edición Digital Nº 4.521</span>
        </div>

        <div className="flex gap-4 items-center">
          <span className="cursor-pointer hover:underline">Suscribirse</span>

          {session ? (
            <button onClick={handleSignOut} className="cursor-pointer hover:underline">
              Cerrar Sesión
            </button>
          ) : (
            <button onClick={() => setAuthOpen(true)} className="cursor-pointer hover:underline">
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 text-center relative">
        <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter mb-2 text-stone-900">
  LAB de Periodismo Crítico
</h1>
<p className="font-serif italic text-stone-600 text-lg">Periodismo Crítico Universitario.</p>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex gap-2">
          {canEdit && (
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 hover:bg-red-700 transition-colors shadow-md"
            >
              <PenTool size={16} />
              <span>Publicar Nota</span>
            </button>
          )}
        </div>
      </div>

      <div className="border-t-2 border-black border-double py-2 bg-stone-200">
        <div className="container mx-auto px-4 flex justify-center md:justify-between items-center font-serif font-bold text-sm md:text-base">
          <nav className="flex flex-wrap justify-center gap-6 uppercase tracking-wider">
            {['Política', 'Economía', 'Cultura', 'Deportes', 'Ciencia', 'Opinión'].map((cat) => (
              <a
                key={cat}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="hover:text-red-700 transition-colors decoration-2 underline-offset-4 hover:underline"
              >
                {cat}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4 text-stone-500">
            <Search size={18} className="cursor-pointer hover:text-black" />
            <Menu size={18} className="cursor-pointer hover:text-black" />
          </div>
        </div>
      </div>
    </div>
  )

  const AuthModal = () => {
    if (!authOpen) return null
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border-2 border-black shadow-2xl p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-serif font-bold">Iniciar sesión</h2>
            <button onClick={() => setAuthOpen(false)} className="text-stone-500 hover:text-red-700">
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              />
            </div>

            <button
              disabled={authBusy}
              className="w-full bg-black text-white py-2 font-bold uppercase tracking-widest hover:bg-stone-800 disabled:opacity-60"
            >
              {authBusy ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="text-xs text-stone-500">
              No hay registro desde la app. Solo cuentas creadas por el administrador.
            </p>
          </form>
        </div>
      </div>
    )
  }

  const EditorView = () => (
    <div className="max-w-3xl mx-auto bg-white p-8 border border-stone-300 shadow-xl mt-8 mb-12">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-serif font-bold text-stone-800">{isEditing ? 'Editar Nota' : 'Nueva Publicación'}</h2>
        <button onClick={() => setView('frontpage')} className="text-stone-500 hover:text-red-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1 uppercase tracking-wide">Titular</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 text-2xl font-serif font-bold border-2 border-stone-300 focus:border-black outline-none bg-stone-50"
            placeholder="Escriba un titular impactante..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1 uppercase tracking-wide">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none bg-white font-serif"
            >
              <option>General</option>
              <option>Política</option>
              <option>Economía</option>
              <option>Cultura</option>
              <option>Deportes</option>
              <option>Ciencia</option>
              <option>Opinión</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1 uppercase tracking-wide">Autor</label>
            <input
              required
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              placeholder="Nombre del periodista"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1 uppercase tracking-wide">Bajada / Subtítulo</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none italic font-serif"
            placeholder="Un resumen breve de la noticia..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1 uppercase tracking-wide">Contenido de la Nota</label>
          <textarea
            required
            rows={12}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-4 border-2 border-stone-300 focus:border-black outline-none font-serif text-lg leading-relaxed bg-stone-50"
            placeholder="Escriba aquí el cuerpo de la noticia..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={() => setView('frontpage')}
            className="px-6 py-2 text-stone-600 hover:bg-stone-100 font-bold uppercase tracking-wider text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-black text-white hover:bg-stone-800 font-bold uppercase tracking-wider text-sm shadow-lg disabled:opacity-60"
          >
            {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Publicar Nota'}
          </button>
        </div>
      </form>
    </div>
  )

  const ArticleDetail = () => {
    if (!selectedArticle) return null

    return (
      <div className="container mx-auto px-4 max-w-4xl my-8">
        <button
          onClick={() => setView('frontpage')}
          className="flex items-center gap-2 text-stone-500 hover:text-black mb-6 font-bold uppercase tracking-widest text-xs"
        >
          <ChevronLeft size={16} /> Volver a Portada
        </button>

        <article className="bg-white p-8 md:p-12 shadow-sm border border-stone-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl font-serif text-stone-50 opacity-10 select-none pointer-events-none -mt-8 -mr-8">
            {selectedArticle.category?.charAt(0) || '•'}
          </div>

          <header className="mb-8 text-center border-b-2 border-black pb-8">
            <div className="inline-block bg-stone-100 px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase text-red-700 border border-stone-200">
              {selectedArticle.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-4 leading-tight">
              {selectedArticle.title}
            </h1>
            <h2 className="text-xl md:text-2xl font-serif text-stone-600 italic font-light max-w-2xl mx-auto leading-relaxed">
              {selectedArticle.subtitle}
            </h2>

            <div className="flex justify-center items-center gap-6 mt-6 text-sm font-sans text-stone-500 uppercase tracking-wide">
              <span className="flex items-center gap-2 font-bold text-black">
                <User size={14} /> {selectedArticle.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} /> {selectedArticle.date}
              </span>
            </div>
          </header>

          <div className="prose prose-lg prose-stone mx-auto font-serif text-justify leading-loose first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:mt-2">
            {String(selectedArticle.content || '')
              .split('\n')
              .map((paragraph, idx) => (
                <p key={idx} className="mb-6">
                  {paragraph}
                </p>
              ))}
          </div>

          <footer className="mt-12 pt-8 border-t border-stone-300 flex justify-between items-center">
            <div className="flex gap-4">
              <button type="button" className="flex items-center gap-2 text-stone-500 hover:text-black">
                <Share2 size={18} /> <span className="text-xs uppercase font-bold hidden sm:inline">Compartir</span>
              </button>
              <button type="button" className="flex items-center gap-2 text-stone-500 hover:text-black" onClick={() => window.print()}>
                <Printer size={18} /> <span className="text-xs uppercase font-bold hidden sm:inline">Imprimir</span>
              </button>
            </div>

            {canEdit && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEditArticle(selectedArticle)}
                  className="bg-stone-100 text-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-stone-200 border border-stone-300"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteArticle(selectedArticle.id)}
                  className="bg-red-50 text-red-700 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-100 border border-red-200"
                >
                  Borrar
                </button>
              </div>
            )}
          </footer>
        </article>
      </div>
    )
  }

  const FrontPage = () => {
    if (loading) {
      return (
        <div className="container mx-auto px-4 pb-12">
          <div className="flex flex-col items-center py-20 text-stone-400 italic font-serif">
            <Loader2 className="animate-spin mb-2" />
            Cargando la rotativa...
          </div>
        </div>
      )
    }

    if (!articles || articles.length === 0) {
      return (
        <div className="container mx-auto px-4 pb-12">
          <div className="text-center py-20 text-stone-500">
            <p className="font-serif text-2xl italic">No hay noticias hoy.</p>
            <p className="mt-2">Sé el primero en informar.</p>
            {!session && (
              <button onClick={() => setAuthOpen(true)} className="mt-6 underline font-bold uppercase tracking-widest text-xs">
                Iniciar sesión para publicar
              </button>
            )}
          </div>
        </div>
      )
    }

    const mainStory = articles[0]
    const sideStories = articles.slice(1)

    return (
      <div className="container mx-auto px-4 pb-12">
        {canEdit && (
          <div className="lg:hidden mb-6 mt-4">
            <button
              onClick={handleCreateNew}
              className="w-full flex justify-center items-center gap-2 bg-stone-900 text-white px-4 py-3 hover:bg-stone-800 font-bold uppercase tracking-wider"
            >
              <PenTool size={16} /> Publicar Nota
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 border-b-2 border-black pb-12">
          <div className="lg:col-span-8 group cursor-pointer" onClick={() => handleOpenArticle(mainStory)}>
            <div className="mb-2 flex items-center gap-2">
              <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                {mainStory.category}
              </span>
              <span className="text-xs text-stone-500 font-bold uppercase">{mainStory.date}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-4 leading-none group-hover:underline decoration-4 decoration-stone-300 underline-offset-4">
              {mainStory.title}
            </h2>
            <div className="h-1 w-20 bg-black mb-4"></div>
            <p className="text-xl md:text-2xl font-serif text-stone-700 italic leading-relaxed">{mainStory.subtitle}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" className="text-red-700 font-bold text-sm uppercase tracking-widest hover:bg-red-50 px-2 py-1 -ml-2">
                Leer nota completa &rarr;
              </button>
            </div>
          </div>

          <Card className="lg:col-span-4 flex flex-col justify-center border-l border-stone-300 pl-8 bg-stone-50/50 p-6">
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-400 mb-4 border-b border-stone-200 pb-2">
              Destacado del Editor
            </h3>
            <p className="font-serif text-lg leading-relaxed text-stone-800 line-clamp-[10]">
              {String(mainStory.content || '').substring(0, 300)}...
            </p>
            <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold uppercase text-stone-500">
              <div className="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-stone-600">
                {String(mainStory.author || '?').charAt(0)}
              </div>
              {mainStory.author}
            </div>
          </Card>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gap-y-12">
          {sideStories.map((article) => (
            <article key={article.id} className="flex flex-col h-full border-t border-black pt-4 group">
              <div className="mb-3 flex justify-between items-center">
                <span className="text-xs font-bold text-red-700 uppercase tracking-widest">{article.category}</span>

                {canEdit && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditArticle(article)
                      }}
                      className="p-1 hover:bg-stone-200 rounded"
                      title="Editar"
                    >
                      <PenTool size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteArticle(article.id)
                      }}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                      title="Borrar"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              <h3
                onClick={() => handleOpenArticle(article)}
                className="text-2xl font-serif font-bold leading-tight mb-2 cursor-pointer hover:text-stone-600 transition-colors"
              >
                {article.title}
              </h3>

              <p className="text-stone-600 font-serif italic text-sm mb-4 line-clamp-3 flex-grow">{article.subtitle}</p>

              <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400 uppercase font-bold tracking-wider">
                <span>{article.author}</span>
                <button type="button" onClick={() => handleOpenArticle(article)} className="text-black hover:underline">
                  Leer
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    )
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-900 font-sans selection:bg-red-200 selection:text-red-900">
      <Navbar />
      <AuthModal />

      <main className="min-h-[60vh]">
        {view === 'frontpage' && <FrontPage />}
        {view === 'editor' && canEdit && <EditorView />}
        {view === 'article' && <ArticleDetail />}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 mt-12 border-t-8 border-red-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2">
            <h2 className="text-white text-2xl font-serif font-bold mb-4">LAB de Periodismo Crítico</h2>
<p className="mb-4 max-w-md">
  LAB de Periodismo Crítico Universitario documenta el uso de recursos públicos y decisiones institucionales en universidades públicas, con foco inicial en la UACJ y Ciudad Juárez, a partir de evidencia documental fidedigna y verificable.
</p>
<p>&copy; {new Date().getFullYear()} LAB de Periodismo Crítico. Todos los derechos reservados.</p>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-4">Secciones</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Política Nacional</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Economía Global</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Cultura y Arte</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Deportes</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Términos de Uso</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Política de Privacidad</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Contacto</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Trabaja con Nosotros</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
