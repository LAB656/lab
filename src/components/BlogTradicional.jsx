import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ChevronRight, PenTool, Trash2 } from 'lucide-react'

const BlogTradicional = ({ articles, canEdit, handleEditArticle, handleDeleteArticle }) => {
  const [selectedMonth, setSelectedMonth] = useState(null)

  // Extraer primera imagen del contenido
  const getFirstImage = (content) => {
    if (!content) return null
    const imgMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    return imgMatch ? imgMatch[2] : null
  }

  // Filtrar solo artículos de categoría "Blog"
  const blogArticles = useMemo(() => {
    return articles.filter(article => article.category === 'Blog')
  }, [articles])

  // Ordenar artículos cronológicamente (más reciente primero)
  const sortedArticles = useMemo(() => {
    return [...blogArticles].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [blogArticles])

  // Filtrar por mes si hay uno seleccionado
  const filteredArticles = useMemo(() => {
    if (!selectedMonth) return sortedArticles
    return sortedArticles.filter(article => {
      const articleMonth = new Date(article.date).toISOString().slice(0, 7)
      return articleMonth === selectedMonth
    })
  }, [sortedArticles, selectedMonth])

  // Generar archivo por mes
  const archiveByMonth = useMemo(() => {
    const archive = {}
    blogArticles.forEach(article => {
      const date = new Date(article.date)
      const monthKey = date.toISOString().slice(0, 7)
      const monthName = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
      
      if (!archive[monthKey]) {
        archive[monthKey] = {
          name: monthName,
          count: 0
        }
      }
      archive[monthKey].count++
    })
    return archive
  }, [blogArticles])

  // Posts recientes para sidebar (últimos 5)
  const recentPosts = useMemo(() => {
    return sortedArticles.slice(0, 5)
  }, [sortedArticles])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header del Blog */}
      <div className="mb-12 text-center border-b-4 border-black pb-8">
        <h1 className="text-5xl md:text-6xl font-serif font-black mb-4">Blog</h1>
        <p className="text-xl text-stone-600 italic max-w-2xl mx-auto">
          Reflexiones, análisis y opiniones sobre el periodismo universitario
        </p>
      </div>

      {/* Filtro activo */}
      {selectedMonth && (
        <div className="mb-6 bg-orange-50 border-l-4 border-orange-600 p-4 flex justify-between items-center">
          <div>
            <span className="font-bold text-orange-900">
              Mostrando artículos de: {archiveByMonth[selectedMonth]?.name}
            </span>
          </div>
          <button
            onClick={() => setSelectedMonth(null)}
            className="text-sm text-orange-700 hover:text-orange-900 underline font-bold uppercase tracking-wider"
          >
            Ver todos
          </button>
        </div>
      )}

      {/* Layout principal: Blog + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ÁREA PRINCIPAL DEL BLOG */}
        <main className="lg:col-span-8">
          <div className="bg-white border-2 border-stone-800 shadow-sm">
            <div className="border-b-2 border-stone-200 px-6 py-4 bg-stone-50">
              <h2 className="font-serif font-bold text-xl uppercase tracking-wider">
                Últimas Publicaciones
              </h2>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center text-stone-500 italic">
                No hay artículos de blog para este período.
              </div>
            ) : (
              <div className="divide-y-2 divide-stone-100">
                {filteredArticles.map((article) => (
                  <article key={article.id} className="p-6 hover:bg-stone-50 transition-colors">
                    {/* Meta información */}
                    <div className="flex items-center gap-4 mb-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                        <Calendar size={12} />
                        {new Date(article.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                        <User size={12} />
                        {article.author}
                      </span>

                      {/* BOTONES DE ADMINISTRADOR */}
                      {canEdit && (
                        <div className="ml-auto flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditArticle(article)
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
                              if (window.confirm('¿Borrar esta nota?')) {
                                handleDeleteArticle(article.id)
                              }
                            }}
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                            title="Borrar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Título */}
                    <Link
                      to={`/articulo/${article.id}`}
                      className="block group"
                    >
                      <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-stone-900 hover:text-orange-600 transition-colors">
                        {article.title}
                      </h3>
                    </Link>

                    {/* Imagen si existe */}
                    {(() => {
                      const firstImage = getFirstImage(article.content)
                      return firstImage ? (
                        <Link to={`/articulo/${article.id}`} className="block mb-4">
                          <img
                            src={firstImage}
                            alt={article.title}
                            className="w-full h-64 object-cover border border-stone-200 hover:opacity-90 transition-opacity"
                            loading="lazy"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </Link>
                      ) : null
                    })()}

                    {/* Subtítulo/Excerpt */}
                    {article.subtitle && (
                      <p className="text-lg text-stone-600 italic mb-4 leading-relaxed">
                        {article.subtitle}
                      </p>
                    )}

                    {/* Extracto del contenido */}
                    <p className="text-stone-700 leading-relaxed mb-4 line-clamp-3">
                      {String(article.content || '')
                        .replace(/\[youtube:[^\]]+\]/g, '')
                        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
                        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                        .replace(/\*\*([^*]+)\*\*/g, '$1')
                        .replace(/_([^_]+)_/g, '$1')
                        .replace(/^##\s+(.+)$/gm, '$1')
                        .replace(/^>\s+(.+)$/gm, '$1')
                        .replace(/^-\s+(.+)$/gm, '$1')
                        .replace(/\n+/g, ' ')
                        .trim()
                        .substring(0, 200)}...
                    </p>

                    {/* Read more link */}
                    <Link
                      to={`/articulo/${article.id}`}
                      className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-wider hover:text-orange-800 transition-colors"
                    >
                      Leer más
                      <ChevronRight size={14} />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Paginación (placeholder - implementar si hay muchos posts) */}
          {filteredArticles.length > 10 && (
            <div className="mt-8 flex justify-center gap-2">
              <button className="px-4 py-2 border-2 border-stone-800 bg-white hover:bg-stone-100 font-bold">
                1
              </button>
              <button className="px-4 py-2 border-2 border-stone-300 bg-white hover:bg-stone-100 font-bold">
                2
              </button>
              <button className="px-4 py-2 border-2 border-stone-300 bg-white hover:bg-stone-100 font-bold">
                →
              </button>
            </div>
          )}
        </main>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Posts Recientes */}
          <div className="bg-white border-2 border-stone-800 shadow-sm">
            <div className="border-b-2 border-stone-800 px-4 py-3 bg-stone-900 text-white">
              <h3 className="font-serif font-bold uppercase tracking-wider text-sm">
                Posts Recientes
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/articulo/${post.id}`}
                  className="block p-4 hover:bg-stone-50 transition-colors group"
                >
                  <h4 className="font-serif font-bold text-sm mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <span className="text-xs text-stone-500 uppercase tracking-wider">
                    {new Date(post.date).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Archivo por Mes */}
          <div className="bg-white border-2 border-stone-800 shadow-sm">
            <div className="border-b-2 border-stone-800 px-4 py-3 bg-stone-900 text-white">
              <h3 className="font-serif font-bold uppercase tracking-wider text-sm">
                Archivo
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {Object.entries(archiveByMonth)
                .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
                .map(([monthKey, data]) => (
                  <button
                    key={monthKey}
                    onClick={() => setSelectedMonth(monthKey)}
                    className={`w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex justify-between items-center ${
                      selectedMonth === monthKey ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                    }`}
                  >
                    <span className="text-sm font-serif capitalize">
                      {data.name}
                    </span>
                    <span className="bg-stone-200 text-stone-700 text-xs px-2 py-1 rounded-full font-bold">
                      {data.count}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Categorías (opcional - si quieres subcategorías dentro de Blog) */}
          <div className="bg-white border-2 border-stone-800 shadow-sm">
            <div className="border-b-2 border-stone-800 px-4 py-3 bg-stone-900 text-white">
              <h3 className="font-serif font-bold uppercase tracking-wider text-sm">
                Categorías
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/categoria/Blog"
                  className="inline-block px-3 py-1 bg-stone-100 hover:bg-orange-600 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Blog
                </Link>
                <Link
                  to="/categoria/Editorial"
                  className="inline-block px-3 py-1 bg-stone-100 hover:bg-orange-600 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Editorial
                </Link>
                <Link
                  to="/categoria/Reportajes"
                  className="inline-block px-3 py-1 bg-stone-100 hover:bg-orange-600 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reportajes
                </Link>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  )
}

export default BlogTradicional
