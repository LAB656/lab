import React, { useEffect, useState } from 'react'
import { Link, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
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
  Bold,
  Italic,
  Link2,
  List,
  Heading2,
  Quote,
  Image,
  Mic,
  Facebook,
  Video,
} from 'lucide-react'

// --- Supabase ---
const supabaseUrl = 'https://niafglccpjvqhtfzbml.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYWZsZ2xjY3BqdnFodGZ6Ym1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDk1ODgsImV4cCI6MjA4NTg4NTU4OH0.b1j8C-htAiYJrdIXsnt5yTK5Tm3wRJjMZigGPgRDSGA'
const supabase = createClient(supabaseUrl, supabaseKey)

// Simple Card Component for Layout
const Card = ({ children, className = '' }) => (
  <div className={`bg-white border-2 border-stone-800 shadow-sm ${className}`}>{children}</div>
)

// --- Demo fallback (MOVIDO FUERA DE APP) ---
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

// --- LINK MODAL COMPONENT ---
const LinkModal = ({ isOpen, onClose, onInsert, selectedText }) => {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (isOpen) {
      setUrl('')
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim()) {
      onInsert(url.trim())
      setUrl('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-2xl p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-serif font-bold">Insertar enlace</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-red-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              Texto del enlace
            </label>
            <input
              type="text"
              readOnly
              value={selectedText || '(seleccione texto primero)'}
              className="w-full p-2 border-2 border-stone-300 bg-stone-50 outline-none text-stone-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              URL de destino
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-100 text-stone-700 py-2 font-bold uppercase tracking-widest hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-2 font-bold uppercase tracking-widest hover:bg-stone-800"
            >
              Insertar
            </button>
          </div>

          <p className="text-xs text-stone-500">
            💡 Consejo: Seleccione el texto en el editor antes de hacer clic en el botón URL.
          </p>
        </form>
      </div>
    </div>
  )
}

// --- IMAGE MODAL COMPONENT ---
const ImageModal = ({ isOpen, onClose, onInsert }) => {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')

  useEffect(() => {
    if (isOpen) {
      setImageUrl('')
      setAltText('')
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (imageUrl.trim()) {
      onInsert(imageUrl.trim(), altText.trim() || 'Imagen')
      setImageUrl('')
      setAltText('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-2xl p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-serif font-bold">Insertar imagen</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-red-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              URL de la imagen
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              Texto alternativo (opcional)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descripción de la imagen"
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
            />
          </div>

          {imageUrl && (
            <div className="border-2 border-stone-200 p-2 rounded">
              <p className="text-xs text-stone-500 mb-2">Vista previa:</p>
              <img
                src={imageUrl}
                alt={altText || 'Vista previa'}
                className="w-full max-h-48 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <p className="text-xs text-red-600 hidden">No se pudo cargar la imagen. Verifica la URL.</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-100 text-stone-700 py-2 font-bold uppercase tracking-widest hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-2 font-bold uppercase tracking-widest hover:bg-stone-800"
            >
              Insertar
            </button>
          </div>

          <p className="text-xs text-stone-500">
            💡 Consejo: Asegúrate de que la URL de la imagen sea pública y accesible.
          </p>
        </form>
      </div>
    </div>
  )
}

// --- FILE MODAL COMPONENT ---
const FileModal = ({ isOpen, onClose, onInsert }) => {
  const [fileName, setFileName] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFileName('')
      setFileUrl('')
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (fileName.trim() && fileUrl.trim()) {
      onInsert(fileName.trim(), fileUrl.trim())
      setFileName('')
      setFileUrl('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-2xl p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-serif font-bold">Insertar Archivo</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-red-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              Nombre del archivo
            </label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="R 232"
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              URL del archivo
            </label>
            <input
              type="url"
              required
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://ejemplo.com/documento.pdf"
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-stone-600">
            <p className="font-bold mb-1">💡 Consejo:</p>
            <p>Puedes usar enlaces de Google Drive, Dropbox, o cualquier URL pública.</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-100 text-stone-700 py-2 font-bold uppercase tracking-widest hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 font-bold uppercase tracking-widest hover:bg-blue-700"
            >
              Insertar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- YOUTUBE MODAL COMPONENT ---
const YouTubeModal = ({ isOpen, onClose, onInsert }) => {
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    if (isOpen) {
      setVideoUrl('')
    }
  }, [isOpen])

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const videoId = extractVideoId(videoUrl.trim())

    if (!videoId) {
      alert('Por favor, introduce una URL válida de YouTube o un ID de video válido.')
      return
    }

    onInsert(videoId)
    setVideoUrl('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-2xl p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-serif font-bold">Insertar video de YouTube</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-red-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              URL del video o ID
            </label>
            <input
              type="text"
              required
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... o dQw4w9WgXcQ"
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              autoFocus
            />
          </div>

          <div className="bg-stone-50 border border-stone-200 p-3 rounded text-xs text-stone-600">
            <p className="font-bold mb-1">Formatos aceptados:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>https://youtube.com/watch?v=VIDEO_ID</li>
              <li>https://youtu.be/VIDEO_ID</li>
              <li>VIDEO_ID (solo el identificador)</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-100 text-stone-700 py-2 font-bold uppercase tracking-widest hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-2 font-bold uppercase tracking-widest hover:bg-stone-800"
            >
              Insertar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- IVOOX PODCAST MODAL COMPONENT ---
const IvooxModal = ({ isOpen, onClose, onInsert }) => {
  const [podcastUrl, setPodcastUrl] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPodcastUrl('')
    }
  }, [isOpen])

  const extractIvooxId = (url) => {
    // Extraer ID de URLs como:
    // https://go.ivoox.com/rf/167955875
    // https://www.ivoox.com/episodio_md_167955875_1.mp3
    // 167955875

    const patterns = [
      /ivoox\.com\/rf\/(\d+)/,
      /ivoox\.com\/.*_md_(\d+)_/,
      /^(\d{8,})$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const podcastId = extractIvooxId(podcastUrl.trim())

    if (!podcastId) {
      alert('Por favor, introduce una URL válida de Ivoox o un ID de podcast válido.')
      return
    }

    onInsert(podcastId)
    setPodcastUrl('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-2xl p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-serif font-bold">Insertar Podcast de Ivoox</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-red-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              URL del episodio o ID
            </label>
            <input
              type="text"
              required
              value={podcastUrl}
              onChange={(e) => setPodcastUrl(e.target.value)}
              placeholder="https://go.ivoox.com/rf/167955875 o 167955875"
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              autoFocus
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded text-xs text-stone-600">
            <p className="font-bold mb-2 flex items-center gap-1">
              <Mic size={14} className="text-orange-600" />
              Formatos aceptados:
            </p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>https://go.ivoox.com/rf/167955875</li>
              <li>https://www.ivoox.com/episodio_md_167955875_1.mp3</li>
              <li>167955875 (solo el ID numérico)</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-stone-600">
            <p className="font-bold mb-1">💡 ¿Cómo obtener el ID?</p>
            <ol className="space-y-1 ml-4 list-decimal">
              <li>Ve al episodio en Ivoox</li>
              <li>Haz clic en "Compartir"</li>
              <li>Copia el enlace (contiene el ID)</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-100 text-stone-700 py-2 font-bold uppercase tracking-widest hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-600 text-white py-2 font-bold uppercase tracking-widest hover:bg-orange-700"
            >
              Insertar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- EDITION NUMBER COMPONENT ---
const EditionNumber = () => {
  const [editionNumber, setEditionNumber] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEditionNumber = async () => {
      if (!supabase) {
        const localEdition = parseInt(localStorage.getItem('edition_number') || '1')
        setEditionNumber(localEdition)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('site_stats')
          .select('edition_number')
          .eq('id', 1)
          .single()

        if (error && error.code === 'PGRST116') {
          setEditionNumber(1)
        } else if (data) {
          setEditionNumber(data.edition_number || 1)
        }
      } catch (err) {
        console.error('Error fetching edition number:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEditionNumber()
  }, [])

  if (loading) return <span className="text-xs text-stone-500">...</span>

  return <span className="text-xs text-stone-500 font-bold">Edición N° {editionNumber}</span>
}

// --- NAVBAR COMPONENT (ACTUALIZADO CON FILTRADO) ---
const Navbar = ({ session, setAuthOpen, handleSignOut, canEdit, handleCreateNew, selectedCategory, setShowSubscribe }) => (
  <div className="bg-white border-b-4 border-black shadow-md sticky top-0 z-40">
    <div className="container mx-auto px-4 py-3 text-xs md:text-sm flex justify-between items-center border-b border-stone-200">
      <div className="flex items-center gap-4">
        <a
          href="https://www.ivoox.com/podcast-lab-periodismo-critico_sq_f13106090_1.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white hover:bg-orange-600 transition-colors rounded shadow-sm"
          title="Escuchar podcast en Ivoox"
        >
          <Mic size={14} className="animate-pulse" />
          <span className="hidden sm:inline">Podcast</span>
        </a>

        <span className="hidden md:inline">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <EditionNumber />
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setShowSubscribe(true)}
          className="cursor-pointer hover:underline hidden sm:inline font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          Suscribirse
        </button>

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
      <Link
        to="/"
        className="text-5xl md:text-7xl font-serif font-black tracking-tighter mb-2 text-stone-900 cursor-pointer hover:text-stone-700 transition-colors block"
      >
        LAB de Periodismo Crítico
      </Link>

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
          {['Reportajes', 'Blog', 'Dossier', 'Editorial', 'Gobierno Universitario', 'Minuto LAB'].map((cat) => (
            <Link
              key={cat}
              to={`/categoria/${cat}`}
              className={`hover:text-orange-600 transition-colors decoration-2 underline-offset-4 hover:underline ${selectedCategory === cat ? 'text-orange-600 underline' : ''
                }`}
            >
              {cat}
            </Link>
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

// --- PODCAST WIDGET COMPONENT (VERSIÓN DISCRETA CON EFECTOS) ---
const PodcastWidget = () => (
  <div className="bg-stone-100 border-b border-stone-300 py-3">
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        <details className="group">
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none hover:text-red-700 transition-colors">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 rounded-full p-1.5 animate-pulse shadow-lg shadow-red-600/50">
                <Mic size={12} className="text-white animate-bounce" />
              </div>
              <span className="text-sm font-serif font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-pulse bg-[length:200%_auto]">
                Escuchar Podcast
              </span>
            </div>
            <span className="text-xs text-stone-500 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <div className="mt-3 bg-white rounded border border-stone-300 overflow-hidden">
            <iframe
              src="https://www.ivoox.com/player_es_podcast_3106090_zp_1.html?c1=444444"
              width="100%"
              height="200"
              frameBorder="0"
              allowFullScreen={true}
              scrolling="no"
              loading="lazy"
              title="LAB Periodismo Crítico Podcast"
              className="w-full"
            />
          </div>
        </details>
      </div>
    </div>
  </div>
)

// --- AUTH MODAL COMPONENT (MOVIDO FUERA DE APP) ---
const AuthModal = ({ authOpen, setAuthOpen, authForm, setAuthForm, handleSignIn, authBusy }) => {
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
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              className="w-full p-2 border-2 border-stone-300 focus:border-black outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={authBusy}
            className="w-full bg-black text-white py-2 hover:bg-stone-800 font-bold uppercase tracking-widest disabled:opacity-60"
          >
            {authBusy ? 'Procesando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

// --- EDITOR VIEW COMPONENT (MOVIDO FUERA DE APP) ---
const EditorView = ({ formData, setFormData, isEditing, loading, handleSave, setView, insertAtCursor }) => {
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false)
  const [fileModalOpen, setFileModalOpen] = useState(false)
  const [ivooxModalOpen, setIvooxModalOpen] = useState(false)
  const [selectedTextForLink, setSelectedTextForLink] = useState('')
  const [selectionPositions, setSelectionPositions] = useState({ start: 0, end: 0 })
  const [originalContent, setOriginalContent] = useState('')

  const handleOpenLinkModal = () => {
    const textarea = document.getElementById('content-editor')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.content
    const selectedText = text.substring(start, end)

    if (!selectedText) {
      alert('Por favor, seleccione el texto que desea convertir en enlace primero.')
      return
    }

    setSelectedTextForLink(selectedText)
    setSelectionPositions({ start, end })
    setOriginalContent(text)
    setLinkModalOpen(true)
  }

  const handleInsertLink = (url) => {
    const textarea = document.getElementById('content-editor')
    if (!textarea) return

    const linkMarkdown = `[${selectedTextForLink}](${url})`
    const newText = originalContent.substring(0, selectionPositions.start) + linkMarkdown + originalContent.substring(selectionPositions.end)

    setFormData({ ...formData, content: newText })

    setTimeout(() => {
      textarea.focus()
      const newPosition = selectionPositions.start + linkMarkdown.length
      textarea.selectionStart = newPosition
      textarea.selectionEnd = newPosition
    }, 0)
  }

  const handleOpenImageModal = () => {
    setImageModalOpen(true)
  }

  const handleInsertImage = (imageUrl, altText) => {
    const textarea = document.getElementById('content-editor')
    if (!textarea) return

    const cursorPosition = textarea.selectionStart
    const text = formData.content
    const imageMarkdown = `![${altText}](${imageUrl})`

    const newText = text.substring(0, cursorPosition) + '\n' + imageMarkdown + '\n' + text.substring(cursorPosition)
    setFormData({ ...formData, content: newText })

    setTimeout(() => {
      textarea.focus()
      const newPosition = cursorPosition + imageMarkdown.length + 2
      textarea.selectionStart = newPosition
      textarea.selectionEnd = newPosition
    }, 0)
  }

  const handleInsertYouTube = (videoId) => {
    const textarea = document.getElementById('content-editor')
    if (!textarea) return

    const cursorPosition = textarea.selectionStart
    const text = formData.content
    const youtubeMarkdown = `[youtube:${videoId}]`

    const newText = text.substring(0, cursorPosition) + '\n' + youtubeMarkdown + '\n' + text.substring(cursorPosition)
    setFormData({ ...formData, content: newText })

    setTimeout(() => {
      textarea.focus()
      const newPosition = cursorPosition + youtubeMarkdown.length + 2
      textarea.selectionStart = newPosition
      textarea.selectionEnd = newPosition
    }, 0)
  }

  const handleInsertFile = (fileName, fileUrl) => {
    const textarea = document.getElementById('content-editor')
    if (!textarea) return

    const cursorPosition = textarea.selectionStart
    const text = formData.content
    const fileMarkdown = `[archivo:${fileName}|${fileUrl}|PDF file]`

    const newText = text.substring(0, cursorPosition) + '\n' + fileMarkdown + '\n' + text.substring(cursorPosition)
    setFormData({ ...formData, content: newText })

    setTimeout(() => {
      textarea.focus()
      const newPosition = cursorPosition + fileMarkdown.length + 2
      textarea.selectionStart = newPosition
      textarea.selectionEnd = newPosition
    }, 0)
  }


  const handleInsertIvoox = (podcastId) => {
    const textarea = document.getElementById('content-editor')
    if (!textarea) return

    const cursorPosition = textarea.selectionStart
    const text = formData.content
    const ivooxMarkdown = `[ivoox:${podcastId}]`

    const newText = text.substring(0, cursorPosition) + '\n' + ivooxMarkdown + '\n' + text.substring(cursorPosition)
    setFormData({ ...formData, content: newText })

    setTimeout(() => {
      textarea.focus()
      const newPosition = cursorPosition + ivooxMarkdown.length + 2
      textarea.selectionStart = newPosition
      textarea.selectionEnd = newPosition
    }, 0)
  }

  return (
    <>
      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onInsert={handleInsertLink}
        selectedText={selectedTextForLink}
      />

      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsert={handleInsertImage}
      />

      <YouTubeModal
        isOpen={youtubeModalOpen}
        onClose={() => setYoutubeModalOpen(false)}
        onInsert={handleInsertYouTube}
      />

      <IvooxModal
        isOpen={ivooxModalOpen}
        onClose={() => setIvooxModalOpen(false)}
        onInsert={handleInsertIvoox}
      />

      <FileModal
        isOpen={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        onInsert={handleInsertFile}
      />


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
                <option>Reportajes</option>
                <option>Blog</option>
                <option>Dossier</option>
                <option>Editorial</option>
                <option>Gobierno Universitario</option>
                <option>Minuto LAB</option>
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

            {/* Barra de herramientas de edición */}
            <div className="mb-3 p-3 bg-stone-100 border-2 border-stone-300 rounded flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => insertAtCursor('**', '**')}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-200 rounded text-sm font-bold"
                title="Negrita"
              >
                <Bold size={14} /> Bold
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor('_', '_')}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-200 rounded text-sm"
                title="Cursiva"
              >
                <Italic size={14} /> Italic
              </button>
              <button
                type="button"
                onClick={handleOpenLinkModal}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-200 rounded text-sm"
                title="Enlace"
              >
                <Link2 size={14} /> URL
              </button>
              <button
                type="button"
                onClick={handleOpenImageModal}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-200 rounded text-sm"
                title="Imagen"
              >
                <Image size={14} /> Imagen
              </button>
              <button
                type="button"
                onClick={() => setYoutubeModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-200 rounded text-sm"
                title="Video de YouTube"
              >
                <Video size={14} /> YouTube
              </button>
              <button
                type="button"
                onClick={() => setIvooxModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-orange-300 hover:bg-orange-50 rounded text-sm text-orange-700"
                title="Podcast de Ivoox"
              >
                <Mic size={14} /> Podcast
              </button>
              <button
                type="button"
                onClick={() => setFileModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-blue-300 hover:bg-blue-50 rounded text-sm text-blue-700"
                title="Archivo adjunto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                Archivo
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor('## ', '\n')}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-200 rounded text-sm"
                title="Encabezado"
              >
                <Heading2 size={14} /> Título
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor('> ', '\n')}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-200 rounded text-sm"
                title="Cita"
              >
                <Quote size={14} /> Cita
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor('- ', '\n')}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-200 rounded text-sm"
                title="Lista"
              >
                <List size={14} /> Lista
              </button>
            </div>


            {/* Ayuda de formato */}
            <details className="mb-2 text-xs text-stone-500">
              <summary className="cursor-pointer font-bold hover:text-stone-700">💡 Ayuda de formato</summary>
              <ul className="mt-2 space-y-1 pl-4 text-stone-600">
                <li>**texto** → <strong>texto en negrita</strong></li>
                <li>_texto_ → <em>texto en cursiva</em></li>
                <li>[texto](url) → enlace clicable</li>
                <li>![alt](url) → imagen</li>
                <li>[youtube:VIDEO_ID] → video de YouTube</li>
                <li>[ivoox:PODCAST_ID] → mini reproductor de podcast Ivoox</li>
                <li>[archivo:Nombre|URL|Tamaño] → tarjeta de descarga</li>
                <li>## Texto → encabezado (subtítulo importante)</li>
                <li>&gt; Texto → cita o destacado</li>
                <li>- Texto → lista de viñetas</li>
              </ul>
            </details>

            <textarea
              id="content-editor"
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
    </>
  )
}

// --- ARTICLE DETAIL COMPONENT (MOVIDO FUERA DE APP) ---
const ArticleDetail = ({ articles, canEdit, handleEditArticle, handleDeleteArticle }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const selectedArticle = articles.find(a => String(a.id) === String(id))

  if (!selectedArticle) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 font-serif text-xl italic">Cargando artículo...</p>
        <Link to="/" className="mt-4 inline-block bg-stone-900 text-white px-6 py-2 uppercase tracking-widest text-xs font-bold">
          Volver al Inicio
        </Link>
      </div>
    )
  }
  if (!selectedArticle) return null

  // Función para convertir markdown simple a HTML
  const renderMarkdown = (text) => {
    if (!text) return ''

    let html = text

    // NUEVO: Archivos adjuntos [archivo:Nombre|URL|Tamaño]
    html = html.replace(/\[archivo:([^\|]+)\|([^\|]+)\|([^\]]+)\]/g, (match, nombre, url, tamano) => {
      return `
      <div class="my-6 bg-white border-2 border-stone-200 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="bg-stone-100 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-stone-600">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </div>
          <div>
            <p class="font-bold text-stone-900">${nombre}</p>
            <p class="text-sm text-stone-500">${tamano} · PDF file</p>
          </div>
        </div>
        <a href="${url}" target="_blank" rel="noopener noreferrer" download class="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded transition-colors">
          Download
        </a>
      </div>
    `
    })

    // Videos de YouTube [youtube:VIDEO_ID] - PRIMERO
    html = html.replace(/\[youtube:([^\]]+)\]/g, '<div class="my-8"><iframe width="100%" height="400" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded shadow-lg"></iframe></div>')

    // Podcasts de Ivoox [ivoox:PODCAST_ID]
    html = html.replace(/\[ivoox:([^\]]+)\]/g, '<div class="my-8 bg-orange-50 border-2 border-orange-600 rounded-lg p-4"><iframe src="https://www.ivoox.com/player_ek_$1_6_1.html" width="100%" height="200" frameborder="0" allowfullscreen scrolling="no" loading="lazy" class="rounded"></iframe><p class="text-xs text-stone-600 mt-2 text-center">🎙️ Episodio de podcast vía Ivoox</p></div>')

    // Imágenes ![alt](url) - DESPUÉS
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto my-6 rounded shadow-lg" loading="lazy" />')

    // Enlaces [texto](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-red-700 underline hover:text-red-900" target="_blank" rel="noopener noreferrer">$1</a>')

    // Negritas **texto**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

    // Cursivas _texto_
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

    // Encabezados ## texto
    html = html.replace(/^## (.+)$/gm, '<h3 class="text-2xl font-bold mt-6 mb-3">$1</h3>')

    // Citas > texto
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-stone-300 pl-4 italic my-4">$1</blockquote>')

    // Listas - item
    html = html.replace(/^- (.+)$/gm, '<li class="ml-6">$1</li>')

    // Párrafos
    html = html.split('\n\n').map(p => `<p class="mb-4">${p}</p>`).join('')

    return html
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedArticle.title,
          text: selectedArticle.subtitle,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      alert('Tu navegador no soporta la función de compartir.')
    }
  }

  const handlePrint = () => {
    window.print()
  }


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-stone-500 hover:text-stone-900 uppercase tracking-widest text-xs font-bold group transition-colors"
      >
        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Volver
      </button>

      <article className="bg-white p-8 md:p-12 border border-stone-300 shadow-xl">
        <div className="mb-6 flex flex-wrap gap-3 items-center text-xs">
          <span className="bg-orange-600 text-white font-bold px-3 py-1 uppercase tracking-widest">
            {selectedArticle.category}
          </span>
          <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Calendar size={14} />
            {selectedArticle.date}
          </span>
          <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <User size={14} />
            {selectedArticle.author}
          </span>

          <div className="ml-auto flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-stone-100 rounded text-stone-600"
              title="Compartir"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-stone-100 rounded text-stone-600"
              title="Imprimir"
            >
              <Printer size={16} />
            </button>

            {canEdit && (
              <>
                <button
                  onClick={() => handleEditArticle(selectedArticle)}
                  className="p-2 hover:bg-stone-200 rounded text-stone-600"
                  title="Editar"
                >
                  <PenTool size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Borrar esta nota?')) {
                      handleDeleteArticle(selectedArticle.id)
                    }
                  }}
                  className="p-2 hover:bg-red-100 text-red-600 rounded"
                  title="Borrar"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-black leading-tight mb-6">
          {selectedArticle.title}
        </h1>

        {selectedArticle.subtitle && (
          <>
            <div className="h-1 w-24 bg-black mb-6"></div>
            <p className="text-2xl md:text-3xl font-serif text-stone-700 italic leading-relaxed mb-8">
              {selectedArticle.subtitle}
            </p>
          </>
        )}

        <div
          className="prose prose-lg max-w-none font-serif text-lg leading-relaxed text-stone-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedArticle.content) }}
        />
      </article>
    </div >
  )
}

// --- FRONTPAGE COMPONENT (ACTUALIZADO CON FILTRADO) ---
// Helper: extraer la primera imagen del contenido Markdown
const getFirstImage = (content) => {
  if (!content) return null
  const match = content.match(/!\[([^\]]*)\]\(([^)]+)\)/)
  return match ? { alt: match[1], url: match[2] } : null
}

const FrontPage = ({ loading, articles, session, setAuthOpen, canEdit, handleCreateNew, handleEditArticle, handleDeleteArticle }) => {
  const { category: selectedCategory } = useParams()
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="mx-auto animate-spin text-stone-500" size={48} />
        <p className="mt-4 text-stone-500 font-serif">Cargando noticias...</p>
      </div>
    )
  }

  // Filtrar artículos por categoría seleccionada
  const filteredArticles = selectedCategory
    ? articles.filter(article => article.category === selectedCategory)
    : articles

  if (!filteredArticles || filteredArticles.length === 0) {
    return (
      <div className="container mx-auto px-4 pb-12">
        <div className="text-center py-20 text-stone-500">
          <p className="font-serif text-2xl italic">
            {selectedCategory
              ? `No hay noticias en la categoría "${selectedCategory}".`
              : 'No hay noticias hoy.'}
          </p>
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

  const mainStory = filteredArticles[0]
  const sideStories = filteredArticles.slice(1)

  return (
    <div className="container mx-auto px-4 pb-12">
      {selectedCategory && (
        <div className="mt-6 mb-8 p-4 bg-orange-50 border-l-4 border-orange-600">
          <p className="font-serif font-bold text-lg text-orange-900">
            Filtrando por: {selectedCategory}
          </p>
        </div>
      )}

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
        <div className="lg:col-span-8 group">
          {/* Imagen destacada del artículo principal */}
          {getFirstImage(mainStory.content) && (
            <Link to={`/articulo/${mainStory.id}`} className="block mb-4">
              <img
                src={getFirstImage(mainStory.content).url}
                alt={getFirstImage(mainStory.content).alt || mainStory.title}
                className="w-full h-64 md:h-80 object-cover border-2 border-stone-800"
              />
            </Link>
          )}
          <div className="mb-2 flex items-center gap-2">
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
              {mainStory.category}
            </span>
            <span className="text-xs text-stone-500 font-bold uppercase">{mainStory.date}</span>
            {canEdit && (
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditArticle(mainStory)
                  }}
                  className="p-1 hover:bg-stone-200 rounded text-stone-600"
                  title="Editar"
                >
                  <PenTool size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteArticle(mainStory.id)
                  }}
                  className="p-1 hover:bg-red-100 text-red-600 rounded"
                  title="Borrar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          <Link
            to={`/articulo/${mainStory.id}`}
            className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-4 leading-none hover:underline decoration-4 decoration-stone-300 underline-offset-4 cursor-pointer block"
          >
            {mainStory.title}
          </Link>
          <div className="h-1 w-20 bg-black mb-4"></div>
          <p className="text-xl md:text-2xl font-serif text-stone-700 italic leading-relaxed">{mainStory.subtitle}</p>
          <div className="mt-4 flex gap-2">
            <Link
              to={`/articulo/${mainStory.id}`}
              className="text-red-700 font-bold text-sm uppercase tracking-widest hover:bg-red-50 px-2 py-1 -ml-2"
            >
              Leer nota completa &rarr;
            </Link>
          </div>
        </div>

        <Card className="lg:col-span-4 flex flex-col justify-center border-l border-stone-300 pl-8 bg-stone-50/50 p-6">
          <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-400 mb-4 border-b border-stone-200 pb-2">
            Destacado del Editor
          </h3>
          <p className="font-serif text-lg leading-relaxed text-stone-800 line-clamp-[10]">
            {String(mainStory.content || '')
              .replace(/\[youtube:[^\]]+\]/g, '')  // Eliminar videos
              .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')  // Eliminar imágenes
              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Enlaces: solo texto
              .replace(/\*\*([^*]+)\*\*/g, '$1')  // Eliminar negritas
              .replace(/_([^_]+)_/g, '$1')  // Eliminar cursivas
              .replace(/^##\s+(.+)$/gm, '$1')  // Eliminar encabezados
              .replace(/^>\s+(.+)$/gm, '$1')  // Eliminar citas
              .replace(/^-\s+(.+)$/gm, '$1')  // Eliminar listas
              .replace(/\n+/g, ' ')  // Unir líneas
              .trim()
              .substring(0, 300)}...
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
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">{article.category}</span>

              {canEdit && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditArticle(article)
                    }}
                    className="p-1 hover:bg-stone-200 rounded text-stone-600"
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

            <Link
              to={`/articulo/${article.id}`}
              className="text-2xl font-serif font-bold leading-tight mb-2 cursor-pointer hover:text-stone-600 transition-colors block"
            >
              {article.title}
            </Link>

            {/* Miniatura si tiene imagen */}
            {getFirstImage(article.content) && (
              <Link to={`/articulo/${article.id}`} className="block mb-3">
                <img
                  src={getFirstImage(article.content).url}
                  alt={getFirstImage(article.content).alt || article.title}
                  className="w-full h-32 object-cover border border-stone-300"
                />
              </Link>
            )}

            <p className="text-stone-600 font-serif italic text-sm mb-4 line-clamp-3 flex-grow">{article.subtitle}</p>

            <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400 uppercase font-bold tracking-wider">
              <span>{article.author}</span>
              <Link to={`/articulo/${article.id}`} className="text-black hover:underline">
                Leer
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}


// --- CONTADOR DE VISITAS (COMPONENTE SEPARADO) ---
const VisitCounter = () => {
  const [visitCount, setVisitCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAndUpdateVisits = async () => {
      if (!supabase) {
        const localCount = parseInt(localStorage.getItem('visit_count') || '0')
        const newCount = localCount + 1
        localStorage.setItem('visit_count', newCount.toString())
        setVisitCount(newCount)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('site_stats')
          .select('visit_count')
          .eq('id', 1)
          .single()

        if (error && error.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('site_stats')
            .insert({ id: 1, visit_count: 1 })
            .select()
            .single()

          if (!insertError) setVisitCount(1)
        } else if (data) {
          const newCount = (data.visit_count || 0) + 1
          await supabase
            .from('site_stats')
            .update({ visit_count: newCount })
            .eq('id', 1)
          setVisitCount(newCount)
        }
      } catch (err) {
        console.error('Error updating visits:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAndUpdateVisits()
  }, [])

  if (loading) {
    return (
      <div className="text-xs text-stone-500">
        Cargando contador...
      </div>
    )
  }

  return (
    <div className="text-xs text-stone-400">
      <p className="font-bold uppercase tracking-wider mb-1">Visitas Totales</p>
      <p className="text-2xl font-mono font-bold text-orange-500">
        {visitCount.toLocaleString()}
      </p>
    </div>
  )
}

// --- TÉRMINOS DE USO COMPONENT ---
const TermsOfUseModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border-4 border-stone-900 shadow-2xl my-8">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-3xl font-serif font-bold">Términos de Uso</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition-colors"
            aria-label="Cerrar"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 font-serif text-stone-800 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="border-l-4 border-orange-600 pl-4 mb-8">
            <p className="text-sm text-stone-600 italic">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">1. Aceptación de los Términos</h3>
            <p className="leading-relaxed">
              Al acceder y utilizar LAB de Periodismo Crítico ("el Sitio"), usted acepta estar sujeto a estos
              Términos de Uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar
              nuestro sitio web.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">2. Naturaleza del Contenido</h3>
            <p className="leading-relaxed mb-3">
              LAB de Periodismo Crítico es una plataforma de periodismo de investigación dedicada a documentar
              el uso de recursos públicos y decisiones institucionales en universidades públicas, con enfoque
              inicial en la Universidad Autónoma de Ciudad Juárez (UACJ).
            </p>
            <p className="leading-relaxed">
              Todo nuestro contenido se basa en evidencia documental fidedigna y verificable. Nos comprometemos
              a los más altos estándares de exactitud periodística y transparencia.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">3. Uso del Contenido</h3>
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong>3.1 Licencia de Uso:</strong> El contenido publicado en LAB de Periodismo Crítico está
                disponible para uso personal, educativo y periodístico, siempre que se cite adecuadamente la fuente.
              </p>
              <p className="leading-relaxed">
                <strong>3.2 Reproducción:</strong> Se permite la reproducción parcial o total de nuestros artículos
                con fines periodísticos, académicos o de investigación, siempre que:
              </p>
              <ul className="list-disc ml-8 space-y-2">
                <li>Se cite claramente a LAB de Periodismo Crítico como fuente</li>
                <li>Se incluya un enlace al artículo original cuando sea publicado en formato digital</li>
                <li>No se altere el contenido de manera que distorsione su significado</li>
                <li>No se utilice con fines comerciales sin autorización previa</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">4. Propiedad Intelectual</h3>
            <p className="leading-relaxed mb-3">
              Todo el contenido original publicado en LAB de Periodismo Crítico, incluyendo textos,
              investigaciones, análisis y diseño del sitio, está protegido por derechos de autor.
            </p>
            <p className="leading-relaxed">
              Los documentos públicos citados y reproducidos en nuestras investigaciones pertenecen a sus
              respectivos autores y están sujetos a las leyes de transparencia y acceso a la información pública.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">5. Responsabilidad del Usuario</h3>
            <p className="leading-relaxed mb-3">Al utilizar este sitio, usted se compromete a:</p>
            <ul className="list-disc ml-8 space-y-2">
              <li>No utilizar el contenido para difamar, acosar o violar los derechos de terceros</li>
              <li>No manipular o tergiversar la información publicada</li>
              <li>No intentar acceder a áreas restringidas del sitio sin autorización</li>
              <li>Respetar los derechos de privacidad de las personas mencionadas en nuestras investigaciones</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">6. Exactitud de la Información</h3>
            <p className="leading-relaxed mb-3">
              Nos esforzamos por garantizar la exactitud y actualidad de toda la información publicada.
              Sin embargo, LAB de Periodismo Crítico no garantiza que:
            </p>
            <ul className="list-disc ml-8 space-y-2">
              <li>El sitio esté libre de errores o interrupciones</li>
              <li>Los defectos serán corregidos inmediatamente</li>
              <li>El sitio o sus servidores estén libres de virus u otros componentes dañinos</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">7. Correcciones y Actualizaciones</h3>
            <p className="leading-relaxed">
              Si identificamos un error en alguna de nuestras publicaciones, lo corregiremos de inmediato
              y publicaremos una nota de corrección claramente visible. Valoramos y agradecemos las
              correcciones de nuestros lectores.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">8. Enlaces a Terceros</h3>
            <p className="leading-relaxed">
              El Sitio puede contener enlaces a sitios web de terceros. LAB de Periodismo Crítico no tiene
              control sobre estos sitios y no se hace responsable de su contenido, políticas de privacidad
              o prácticas.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">9. Limitación de Responsabilidad</h3>
            <p className="leading-relaxed">
              LAB de Periodismo Crítico no será responsable de ningún daño directo, indirecto, incidental,
              especial o consecuente que resulte del uso o la imposibilidad de usar el Sitio o su contenido.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">10. Derecho de Réplica</h3>
            <p className="leading-relaxed">
              Respetamos el derecho de réplica de cualquier persona o institución mencionada en nuestras
              publicaciones. Las réplicas serán publicadas de manera prominente junto al artículo original,
              siempre que:
            </p>
            <ul className="list-disc ml-8 space-y-2 mt-3">
              <li>Sean enviadas por escrito de manera oficial</li>
              <li>Se refieran específicamente al contenido publicado</li>
              <li>No contengan difamaciones o información falsa</li>
              <li>Sean enviadas dentro de un plazo razonable</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">11. Modificaciones a los Términos</h3>
            <p className="leading-relaxed">
              LAB de Periodismo Crítico se reserva el derecho de modificar estos Términos de Uso en cualquier
              momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el Sitio.
              El uso continuado del Sitio después de tales modificaciones constituye su aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">12. Ley Aplicable</h3>
            <p className="leading-relaxed">
              Estos Términos de Uso se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier disputa
              relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales
              competentes en Ciudad Juárez, Chihuahua, México.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">13. Contacto</h3>
            <p className="leading-relaxed">
              Para cualquier pregunta sobre estos Términos de Uso, puede contactarnos a través de los
              canales oficiales publicados en el sitio web.
            </p>
          </section>

          <div className="mt-12 p-6 bg-orange-50 border-l-4 border-orange-600">
            <p className="font-bold text-lg mb-2">Compromiso con el Periodismo de Calidad</p>
            <p className="leading-relaxed">
              LAB de Periodismo Crítico se compromete a mantener los más altos estándares de ética periodística,
              transparencia y rigor en la investigación. Creemos en el derecho ciudadano a la información y en
              la importancia de la rendición de cuentas en las instituciones públicas.
            </p>
          </div>
        </div>

        {/* Footer del modal */}
        <div className="bg-stone-100 p-6 border-t-2 border-stone-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-stone-900 text-white hover:bg-orange-600 font-bold uppercase tracking-wider transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// --- POLÍTICA DE PRIVACIDAD COMPONENT ---
const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border-4 border-stone-900 shadow-2xl my-8">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-3xl font-serif font-bold">Política de Privacidad</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition-colors"
            aria-label="Cerrar"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 font-serif text-stone-800 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="border-l-4 border-orange-600 pl-4 mb-8">
            <p className="text-sm text-stone-600 italic">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-8">
            <p className="font-bold text-lg mb-2">Compromiso con tu Privacidad</p>
            <p className="leading-relaxed">
              En LAB de Periodismo Crítico nos tomamos muy en serio la privacidad de nuestros lectores y usuarios.
              Esta política explica qué información recopilamos, cómo la usamos y cuáles son tus derechos.
            </p>
          </div>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">1. Información que Recopilamos</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold mb-2 text-stone-800">1.1 Información que Proporcionas Voluntariamente</h4>
                <p className="leading-relaxed mb-3">
                  Recopilamos información que nos proporcionas directamente cuando:
                </p>
                <ul className="list-disc ml-8 space-y-2">
                  <li>Creas una cuenta de usuario (email y contraseña)</li>
                  <li>Te suscribes a nuestro newsletter</li>
                  <li>Envías comentarios o feedback</li>
                  <li>Participas en encuestas o cuestionarios</li>
                  <li>Nos contactas a través de formularios o email</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-stone-800">1.2 Información Recopilada Automáticamente</h4>
                <p className="leading-relaxed mb-3">
                  Cuando visitas nuestro sitio, recopilamos automáticamente:
                </p>
                <ul className="list-disc ml-8 space-y-2">
                  <li><strong>Datos de navegación:</strong> Páginas visitadas, tiempo de permanencia, enlaces clicados</li>
                  <li><strong>Información técnica:</strong> Tipo de navegador, sistema operativo, dirección IP</li>
                  <li><strong>Dispositivo:</strong> Tipo de dispositivo, resolución de pantalla</li>
                  <li><strong>Cookies:</strong> Identificadores únicos para mejorar tu experiencia</li>
                  <li><strong>Estadísticas de visitas:</strong> Contador de visitas general (no identifica usuarios individuales)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-stone-800">1.3 Información que NO Recopilamos</h4>
                <p className="leading-relaxed">
                  <strong>Importante:</strong> NO recopilamos datos sensibles como información financiera,
                  datos de salud, orientación política o religiosa, a menos que tú decidas compartirlos
                  voluntariamente en comunicaciones con nosotros.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">2. Cómo Usamos tu Información</h3>
            <p className="leading-relaxed mb-3">Utilizamos la información recopilada para:</p>
            <ul className="list-disc ml-8 space-y-2">
              <li><strong>Proveer y mejorar nuestros servicios:</strong> Personalizar tu experiencia de lectura</li>
              <li><strong>Comunicación:</strong> Enviarte actualizaciones, newsletter y contenido relevante (solo si te suscribes)</li>
              <li><strong>Análisis:</strong> Entender cómo los usuarios interactúan con nuestro contenido</li>
              <li><strong>Seguridad:</strong> Proteger contra fraude, abuso y actividades ilegales</li>
              <li><strong>Cumplimiento legal:</strong> Responder a solicitudes legales cuando sea requerido</li>
              <li><strong>Investigación periodística:</strong> Mejorar la calidad y relevancia de nuestras publicaciones</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">3. Base Legal para el Procesamiento de Datos</h3>
            <p className="leading-relaxed mb-3">Procesamos tus datos personales bajo las siguientes bases legales:</p>
            <ul className="list-disc ml-8 space-y-2">
              <li><strong>Consentimiento:</strong> Cuando te suscribes o creas una cuenta</li>
              <li><strong>Interés legítimo:</strong> Para análisis estadísticos y mejora del servicio</li>
              <li><strong>Cumplimiento legal:</strong> Cuando la ley lo requiere</li>
              <li><strong>Ejecución de contrato:</strong> Para proveer los servicios solicitados</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">4. Compartir Información con Terceros</h3>

            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
                <p className="font-bold mb-2">⚠️ Principio fundamental:</p>
                <p className="leading-relaxed">
                  <strong>NO vendemos, alquilamos ni compartimos tu información personal con terceros
                    con fines comerciales o de marketing.</strong>
                </p>
              </div>

              <p className="leading-relaxed mb-3">Podemos compartir información en estos casos limitados:</p>

              <div>
                <h4 className="text-lg font-bold mb-2 text-stone-800">4.1 Proveedores de Servicios</h4>
                <p className="leading-relaxed mb-2">
                  Trabajamos con proveedores de servicios confiables que nos ayudan a operar el sitio:
                </p>
                <ul className="list-disc ml-8 space-y-2">
                  <li><strong>Supabase:</strong> Hosting de base de datos y autenticación</li>
                  <li><strong>Firebase/Hosting:</strong> Alojamiento del sitio web</li>
                  <li><strong>Ivoox:</strong> Servicio de podcast (datos de reproducción)</li>
                  <li><strong>Google Analytics:</strong> Análisis de tráfico web (si aplica)</li>
                </ul>
                <p className="leading-relaxed mt-2 text-sm text-stone-600">
                  Estos proveedores están obligados contractualmente a proteger tu información y solo pueden
                  usarla para los servicios que nos proveen.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-2 text-stone-800">4.2 Requerimientos Legales</h4>
                <p className="leading-relaxed">
                  Podemos divulgar información si estamos legalmente obligados a hacerlo por orden judicial,
                  citación o proceso legal similar, o si creemos de buena fe que la divulgación es necesaria
                  para proteger nuestros derechos, tu seguridad o la de otros.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-2 text-stone-800">4.3 Transferencia de Negocio</h4>
                <p className="leading-relaxed">
                  En caso de fusión, adquisición o venta de activos, tu información podría ser transferida.
                  Te notificaremos antes de que tu información personal sea transferida y quede sujeta a
                  una política de privacidad diferente.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">5. Cookies y Tecnologías Similares</h3>

            <div className="space-y-3">
              <p className="leading-relaxed">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio.
              </p>

              <div>
                <h4 className="text-lg font-bold mb-2 text-stone-800">5.1 Tipos de Cookies que Usamos</h4>
                <ul className="list-disc ml-8 space-y-2">
                  <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio (autenticación, preferencias)</li>
                  <li><strong>Cookies de análisis:</strong> Nos ayudan a entender cómo los usuarios usan el sitio</li>
                  <li><strong>Cookies funcionales:</strong> Recuerdan tus preferencias y configuraciones</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-2 text-stone-800">5.2 Gestionar Cookies</h4>
                <p className="leading-relaxed">
                  Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad
                  del sitio. La mayoría de los navegadores permiten gestionar las preferencias de cookies en
                  sus configuraciones.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">6. Seguridad de tu Información</h3>
            <p className="leading-relaxed mb-3">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
            </p>
            <ul className="list-disc ml-8 space-y-2">
              <li><strong>Cifrado:</strong> Usamos HTTPS/SSL para todas las comunicaciones</li>
              <li><strong>Autenticación segura:</strong> Contraseñas hasheadas y tokens seguros</li>
              <li><strong>Control de acceso:</strong> Solo personal autorizado puede acceder a datos sensibles</li>
              <li><strong>Respaldos regulares:</strong> Copias de seguridad para prevenir pérdida de datos</li>
              <li><strong>Monitoreo:</strong> Detección de accesos no autorizados y actividades sospechosas</li>
            </ul>
            <p className="leading-relaxed mt-4 text-sm text-stone-600">
              <strong>Nota:</strong> Ningún sistema es 100% seguro. Aunque hacemos nuestro mejor esfuerzo,
              no podemos garantizar la seguridad absoluta de tu información.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">7. Retención de Datos</h3>
            <p className="leading-relaxed mb-3">
              Conservamos tu información personal solo durante el tiempo necesario para cumplir con los
              propósitos descritos en esta política:
            </p>
            <ul className="list-disc ml-8 space-y-2">
              <li><strong>Cuentas activas:</strong> Mientras mantengas tu cuenta activa</li>
              <li><strong>Datos de análisis:</strong> Generalmente 26 meses</li>
              <li><strong>Obligaciones legales:</strong> El tiempo que requiera la ley</li>
              <li><strong>Cuentas inactivas:</strong> Podemos eliminar cuentas sin actividad después de 2 años</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">8. Tus Derechos</h3>
            <p className="leading-relaxed mb-4">
              De acuerdo con las leyes de protección de datos aplicables, tienes los siguientes derechos:
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 space-y-3">
              <div>
                <h4 className="font-bold text-stone-900">✓ Derecho de Acceso</h4>
                <p className="text-sm">Solicitar una copia de tu información personal</p>
              </div>
              <div>
                <h4 className="font-bold text-stone-900">✓ Derecho de Rectificación</h4>
                <p className="text-sm">Corregir información inexacta o incompleta</p>
              </div>
              <div>
                <h4 className="font-bold text-stone-900">✓ Derecho de Supresión</h4>
                <p className="text-sm">Solicitar la eliminación de tus datos ("derecho al olvido")</p>
              </div>
              <div>
                <h4 className="font-bold text-stone-900">✓ Derecho de Oposición</h4>
                <p className="text-sm">Oponerte al procesamiento de tus datos</p>
              </div>
              <div>
                <h4 className="font-bold text-stone-900">✓ Derecho de Portabilidad</h4>
                <p className="text-sm">Recibir tus datos en formato estructurado y transferirlos</p>
              </div>
              <div>
                <h4 className="font-bold text-stone-900">✓ Derecho de Limitación</h4>
                <p className="text-sm">Restringir el procesamiento de tus datos</p>
              </div>
              <div>
                <h4 className="font-bold text-stone-900">✓ Derecho a Retirar Consentimiento</h4>
                <p className="text-sm">Retirar tu consentimiento en cualquier momento</p>
              </div>
            </div>

            <p className="leading-relaxed mt-4">
              Para ejercer cualquiera de estos derechos, contáctanos a través de los canales oficiales
              publicados en el sitio. Responderemos a tu solicitud dentro de 30 días.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">9. Privacidad de Menores</h3>
            <p className="leading-relaxed mb-3">
              Nuestro sitio no está dirigido a menores de 13 años. No recopilamos intencionalmente
              información personal de niños menores de 13 años.
            </p>
            <p className="leading-relaxed">
              Si descubrimos que hemos recopilado información de un menor de 13 años sin el consentimiento
              parental verificable, tomaremos medidas para eliminar esa información de nuestros servidores.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">10. Enlaces a Sitios de Terceros</h3>
            <p className="leading-relaxed mb-3">
              Nuestro sitio puede contener enlaces a sitios web de terceros. Esta Política de Privacidad
              no se aplica a esos sitios.
            </p>
            <p className="leading-relaxed">
              No somos responsables de las prácticas de privacidad de otros sitios. Te recomendamos leer
              las políticas de privacidad de cada sitio que visites.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">11. Transferencias Internacionales</h3>
            <p className="leading-relaxed mb-3">
              Tu información puede ser transferida y procesada en servidores ubicados fuera de México,
              incluyendo Estados Unidos y otros países.
            </p>
            <p className="leading-relaxed">
              Cuando transferimos información fuera de México, nos aseguramos de que existan las salvaguardas
              adecuadas para proteger tu información de acuerdo con esta política y las leyes aplicables.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">12. Cambios a esta Política</h3>
            <p className="leading-relaxed mb-3">
              Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en
              nuestras prácticas o por razones legales u operativas.
            </p>
            <p className="leading-relaxed">
              Te notificaremos sobre cambios significativos publicando la nueva política en esta página
              y actualizando la fecha de "Última actualización" en la parte superior. Te recomendamos
              revisar esta política periódicamente.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">13. Contacto</h3>
            <p className="leading-relaxed mb-3">
              Si tienes preguntas, comentarios o preocupaciones sobre esta Política de Privacidad o
              nuestras prácticas de datos, contáctanos a través de:
            </p>
            <div className="bg-stone-100 p-4 rounded border border-stone-300">
              <p className="mb-2"><strong>LAB de Periodismo Crítico</strong></p>
              <p className="mb-2">Email: privacidad@labperiodismocritico.com</p>
              <p className="mb-2">Ubicación: Ciudad Juárez, Chihuahua, México</p>
              <p>Responderemos a tu consulta dentro de 30 días.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-stone-900">14. Autoridad de Control</h3>
            <p className="leading-relaxed">
              Si consideras que hemos violado tus derechos de privacidad, tienes derecho a presentar
              una queja ante el Instituto Nacional de Transparencia, Acceso a la Información y Protección
              de Datos Personales (INAI) en México.
            </p>
          </section>

          <div className="mt-12 p-6 bg-orange-50 border-l-4 border-orange-600">
            <p className="font-bold text-lg mb-2">Nuestro Compromiso Continuo</p>
            <p className="leading-relaxed">
              En LAB de Periodismo Crítico, la privacidad y la protección de datos son fundamentales para
              nuestra misión periodística. Nos comprometemos a ser transparentes sobre nuestras prácticas
              y a respetar tus derechos en todo momento. Tu confianza es esencial para nuestro trabajo
              de periodismo de investigación.
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-stone-600">
            <p>Esta política cumple con:</p>
            <p className="font-bold mt-2">
              Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México) •
              GDPR (UE) • CCPA (California)
            </p>
          </div>
        </div>

        {/* Footer del modal */}
        <div className="bg-stone-100 p-6 border-t-2 border-stone-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-stone-900 text-white hover:bg-orange-600 font-bold uppercase tracking-wider transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// --- SUBSCRIBE MODAL COMPONENT ---
const SubscribeModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState('weekly')
  const [interests, setInterests] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInterestToggle = (interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío (aquí integrarías con tu servicio de email)
    if (!supabase) {
      // Modo demo - guardar en localStorage
      const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]')
      const newSubscriber = {
        email,
        name,
        frequency,
        interests,
        subscribedAt: new Date().toISOString()
      }
      subscribers.push(newSubscriber)
      localStorage.setItem('subscribers', JSON.stringify(subscribers))

      setTimeout(() => {
        setIsSubmitting(false)
        setSubmitted(true)
      }, 1500)
      return
    }

    try {
      // Guardar en Supabase
      const { error } = await supabase
        .from('subscribers')
        .insert({
          email,
          name: name || null,
          frequency,
          interests: interests.length > 0 ? interests : null,
          subscribed_at: new Date().toISOString(),
          is_active: true
        })

      if (error) throw error

      setIsSubmitting(false)
      setSubmitted(true)
    } catch (err) {
      console.error('Error al suscribir:', err)
      alert('Hubo un error al procesar tu suscripción. Por favor intenta nuevamente.')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setName('')
    setFrequency('weekly')
    setInterests([])
    setSubmitted(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border-4 border-stone-900 shadow-2xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-1">Suscríbete al Newsletter</h2>
            <p className="text-orange-100 text-sm">Recibe periodismo de investigación directo en tu inbox</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-orange-200 transition-colors flex-shrink-0 ml-4"
            aria-label="Cerrar"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 mb-6">
                <p className="text-sm leading-relaxed">
                  <strong>¿Por qué suscribirte?</strong> Recibe investigaciones exclusivas, análisis profundos
                  y reportajes sobre el uso de recursos públicos en universidades. Sin spam, sin publicidad,
                  solo periodismo de calidad.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full p-3 border-2 border-stone-300 focus:border-orange-600 outline-none transition-colors"
                />
              </div>

              {/* Nombre (opcional) */}
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">
                  Nombre <span className="text-stone-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full p-3 border-2 border-stone-300 focus:border-orange-600 outline-none transition-colors"
                />
              </div>

              {/* Frecuencia */}
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide">
                  Frecuencia de emails
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-stone-300 hover:border-orange-600 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="frequency"
                      value="daily"
                      checked={frequency === 'daily'}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div>
                      <div className="font-bold text-stone-900">Diario</div>
                      <div className="text-xs text-stone-600">Recibe las últimas publicaciones cada día</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border-2 border-stone-300 hover:border-orange-600 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="frequency"
                      value="weekly"
                      checked={frequency === 'weekly'}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div>
                      <div className="font-bold text-stone-900">Semanal (Recomendado)</div>
                      <div className="text-xs text-stone-600">Un resumen cada semana con lo más destacado</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border-2 border-stone-300 hover:border-orange-600 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="frequency"
                      value="monthly"
                      checked={frequency === 'monthly'}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div>
                      <div className="font-bold text-stone-900">Mensual</div>
                      <div className="text-xs text-stone-600">Solo las investigaciones más importantes</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Intereses */}
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide">
                  Temas de interés <span className="text-stone-400 text-xs">(selecciona uno o más)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Blog', 'Dossier', 'Reportajes', 'Editorial', 'Gobierno Universitario', 'Minuto LAB'].map((interest) => (
                    <label
                      key={interest}
                      className={`flex items-center gap-2 p-3 border-2 cursor-pointer transition-all ${interests.includes(interest)
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-stone-300 hover:border-orange-400'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="w-4 h-4 text-orange-600"
                      />
                      <span className="text-sm font-semibold">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consentimiento */}
              <div className="bg-stone-50 p-4 border border-stone-300 text-xs text-stone-600 leading-relaxed">
                Al suscribirte, aceptas recibir correos electrónicos de LAB de Periodismo Crítico.
                Puedes cancelar tu suscripción en cualquier momento. Consultá nuestra{' '}
                <button
                  type="button"
                  onClick={() => {
                    handleClose()
                    setTimeout(() => {
                      const privacyBtn = document.querySelector('[data-privacy-trigger]')
                      if (privacyBtn) privacyBtn.click()
                    }, 100)
                  }}
                  className="text-orange-600 underline hover:text-orange-800"
                >
                  Política de Privacidad
                </button>.
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 text-stone-600 hover:bg-stone-100 font-bold uppercase tracking-wider text-sm border-2 border-stone-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 font-bold uppercase tracking-wider text-sm shadow-lg disabled:opacity-60 transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Suscribiendo...
                    </span>
                  ) : (
                    'Suscribirme'
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Mensaje de éxito
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif font-bold text-stone-900 mb-2">
                  ¡Suscripción Exitosa!
                </h3>
                <p className="text-lg text-stone-600">
                  Te has suscrito correctamente al newsletter
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-6 text-left mb-6">
                <p className="font-bold mb-2">📧 Revisa tu bandeja de entrada</p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Hemos enviado un email de confirmación a <strong>{email}</strong>.
                  Si no lo ves en unos minutos, revisa tu carpeta de spam.
                </p>
              </div>

              <div className="space-y-3 text-sm text-stone-600 mb-6">
                <p>✓ Frecuencia: <strong className="text-stone-900">
                  {frequency === 'daily' ? 'Diario' : frequency === 'weekly' ? 'Semanal' : 'Mensual'}
                </strong></p>
                {interests.length > 0 && (
                  <p>✓ Intereses: <strong className="text-stone-900">{interests.join(', ')}</strong></p>
                )}
              </div>

              <button
                onClick={handleClose}
                className="px-8 py-3 bg-stone-900 text-white hover:bg-orange-600 font-bold uppercase tracking-wider transition-colors"
              >
                Cerrar
              </button>

              <p className="mt-6 text-xs text-stone-500">
                ¿Quieres cambiar tus preferencias? Usa el enlace en cualquier email que recibas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// === MAIN APP COMPONENT ===
export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authBusy, setAuthBusy] = useState(false)
  const [formData, setFormData] = useState({ id: null, title: '', subtitle: '', category: 'Blog', author: '', content: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showSubscribe, setShowSubscribe] = useState(false)

  // Determinar categoría actual de la URL para el Navbar
  const pathParts = location.pathname.split('/')
  const selectedCategory = pathParts[1] === 'categoria' ? decodeURIComponent(pathParts[2]) : null

  const canEdit = Boolean(session)

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
      return () => listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    if (!supabase) {
      setArticles(DEMO_ARTICLES)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setArticles(DEMO_ARTICLES)
    } else {
      setArticles(data || [])
    }
    setLoading(false)
  }

  const handleCreateNew = () => {
    setFormData({ id: null, title: '', subtitle: '', category: 'Dossier', author: '', content: '' })
    setIsEditing(false)
    navigate('/editar')
  }

  // handleOpenArticle eliminado - se usa <Link> directamente

  const handleEditArticle = (article) => {
    setFormData({ ...article })
    setIsEditing(true)
    navigate(`/editar/${article.id}`)
  }

  const handleDeleteArticle = async (id) => {
    if (!session) {
      setAuthOpen(true)
      return
    }
    const ok = window.confirm('¿Borrar esta nota?')
    if (!ok) return

    if (String(id).startsWith('demo-') || !supabase) {
      setArticles((prev) => prev.filter((a) => a.id !== id))
      if (location.pathname === `/articulo/${id}`) {
        navigate('/')
      }
      return
    }

    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) {
      console.error(error)
      alert('No se pudo borrar; revisa RLS/policies.')
      return
    }
    if (location.pathname === `/articulo/${id}`) {
      navigate('/')
    }
    await fetchArticles()
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!supabase) {
      const now = new Date().toISOString().split('T')[0]
      if (isEditing) {
        setArticles((prev) =>
          prev.map((a) => (a.id === formData.id ? { ...formData, date: now } : a))
        )
      } else {
        const newArticle = { ...formData, id: Date.now(), date: now, highlight: false }
        setArticles((prev) => [newArticle, ...prev])
      }
      navigate('/')
      return
    }

    if (!session) {
      setAuthOpen(true)
      return
    }

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      category: formData.category || 'Dossier',
      author: formData.author,
      content: formData.content,
      date: new Date().toISOString().slice(0, 10),
    }

    try {
      setLoading(true)
      if (isEditing && formData.id !== null) {
        const { error } = await supabase.from('articles').update(payload).eq('id', formData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('articles').insert(payload)
        if (error) throw error

        // Incrementar número de edición cuando se publica un artículo nuevo
        const { data: statsData } = await supabase
          .from('site_stats')
          .select('edition_number')
          .eq('id', 1)
          .single()

        if (statsData) {
          await supabase
            .from('site_stats')
            .update({ edition_number: (statsData.edition_number || 1) + 1 })
            .eq('id', 1)
        }
      }
      await fetchArticles()
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Error al guardar; revisa RLS/policies.')
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

  // --- Helper: Insert text into textarea ---
  const insertAtCursor = (before, after) => {
    const textarea = document.getElementById('content-editor')
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.content
    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    setFormData({ ...formData, content: newText })

    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
    }, 0)
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-900 font-mono selection:bg-red-200 selection:text-red-900">
      <Navbar
        session={session}
        setAuthOpen={setAuthOpen}
        handleSignOut={handleSignOut}
        canEdit={canEdit}
        handleCreateNew={handleCreateNew}
        selectedCategory={selectedCategory}
        setShowSubscribe={setShowSubscribe}
      />

      <Routes>
        <Route path="/" element={<PodcastWidget />} />
        <Route path="/categoria/:category" element={<PodcastWidget />} />
        <Route path="*" element={null} />
      </Routes>

      <AuthModal
        authOpen={authOpen}
        setAuthOpen={setAuthOpen}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleSignIn={handleSignIn}
        authBusy={authBusy}
      />

      <TermsOfUseModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />

      <PrivacyPolicyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />

      <SubscribeModal
        isOpen={showSubscribe}
        onClose={() => setShowSubscribe(false)}
      />

      <main className="min-h-[60vh]">
        <Routes>
          <Route
            path="/"
            element={
              <FrontPage
                loading={loading}
                articles={articles}
                session={session}
                setAuthOpen={setAuthOpen}
                canEdit={canEdit}
                handleCreateNew={handleCreateNew}
                handleEditArticle={handleEditArticle}
                handleDeleteArticle={handleDeleteArticle}
              />
            }
          />
          <Route
            path="/categoria/:category"
            element={
              <FrontPage
                loading={loading}
                articles={articles}
                session={session}
                setAuthOpen={setAuthOpen}
                canEdit={canEdit}
                handleCreateNew={handleCreateNew}
                handleEditArticle={handleEditArticle}
                handleDeleteArticle={handleDeleteArticle}
              />
            }
          />
          <Route
            path="/articulo/:id"
            element={
              <ArticleDetail
                articles={articles}
                canEdit={canEdit}
                handleEditArticle={handleEditArticle}
                handleDeleteArticle={handleDeleteArticle}
              />
            }
          />
          <Route
            path="/editar"
            element={
              canEdit ? (
                <EditorView
                  formData={formData}
                  setFormData={setFormData}
                  isEditing={isEditing}
                  loading={loading}
                  handleSave={handleSave}
                  insertAtCursor={insertAtCursor}
                  setView={() => navigate('/')}
                />
              ) : (
                <div className="text-center py-20 font-serif italic text-stone-500">
                  Debes iniciar sesión para editar.
                </div>
              )
            }
          />
          <Route
            path="/editar/:id"
            element={
              canEdit ? (
                <EditorView
                  formData={formData}
                  setFormData={setFormData}
                  isEditing={isEditing}
                  loading={loading}
                  handleSave={handleSave}
                  insertAtCursor={insertAtCursor}
                  setView={() => navigate('/')}
                />
              ) : (
                <div className="text-center py-20 font-serif italic text-stone-500">
                  Debes iniciar sesión para editar.
                </div>
              )
            }
          />
        </Routes>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 mt-12 border-t-8 border-orange-600">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2">
            <h2 className="text-white text-2xl font-serif font-bold mb-4">LAB de Periodismo Crítico</h2>
            <p className="mb-4 max-w-md">
              LAB de Periodismo Crítico Universitario documenta el uso de recursos públicos y decisiones institucionales en universidades públicas, con foco inicial en la UACJ y Ciudad Juárez, a partir de evidencia documental fidedigna y verificable.
            </p>
            <p>&copy; {new Date().getFullYear()} LAB de Periodismo Crítico. Todos los derechos reservados.</p>

            {/* CONTADOR DE VISITAS */}
            <div className="mt-4 pt-4 border-t border-stone-700">
              <VisitCounter />
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-4">Secciones</h3>
            <ul className="space-y-2">
              {['Reportajes', 'Blog', 'Dossier', 'Editorial', 'Gobierno Universitario', 'Minuto LAB'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/categoria/${cat}`}
                    className={`transition-colors italic ${selectedCategory === cat
                      ? 'text-orange-500 font-bold'
                      : 'text-stone-400 hover:text-white'
                      }`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setShowTerms(true)}
                  className="hover:text-white transition-colors"
                >
                  Términos de Uso
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPrivacy(true)}
                  data-privacy-trigger
                  className="hover:text-white transition-colors"
                >
                  Política de Privacidad
                </button>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-stone-700">
              <a
                href="https://www.facebook.com/profile.php?id=61587394063219"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-stone-400 hover:text-blue-500 transition-colors"
                title="Síguenos en Facebook"
              >
                <Facebook size={24} />
                <span className="font-bold uppercase tracking-widest text-xs">Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
