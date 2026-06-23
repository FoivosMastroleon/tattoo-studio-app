import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getGalleryImages } from '@/api/galleryImage'
import { getPosts } from '@/api/posts'
import { getTattooStyles } from '@/api/tattooStyles'
import Carousel from '@/components/Carousel'
import type { GalleryImage, Post, TattooStyle } from '@/types'

const HomePage = () => {
  const [featured, setFeatured] = useState<GalleryImage[]>([])
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [styles, setStyles] = useState<TattooStyle[]>([])
  const [selectedStyle, setSelectedStyle] = useState<TattooStyle | null>(null)

  useEffect(() => {
    getGalleryImages().then(setFeatured).catch(() => {})
    getPosts().then(posts => setLatestPosts(posts.slice(0, 3))).catch(() => {})
    getTattooStyles().then(setStyles).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center min-h-[90vh] px-6">
        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] mb-6">Athens, Greece</p>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
          Art Etched<br />Into Skin
        </h1>
        <p className="text-[#555] text-base mb-12 max-w-md mx-auto leading-relaxed">
          Custom tattoo artwork crafted with precision and passion.<br />Every piece tells your story.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/book"
            className="px-8 py-4 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest font-medium hover:bg-[#b8973b] transition-colors"
          >
            Book a Session
          </Link>
          <Link
            to="/gallery"
            className="px-8 py-4 border border-[#2a2a2a] text-xs uppercase tracking-widest hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
          >
            View Gallery
          </Link>
        </div>
      </section>

      <div className="border-t border-[#111]" />

      {/* Featured work */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-10 py-24">
          <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">Our Work</p>
          <h2 className="font-display text-3xl text-center mb-16">Featured Pieces</h2>
          <Carousel>
            {featured.map(img => (
              <div key={img.id} className="aspect-square overflow-hidden group">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </Carousel>
          <div className="text-center mt-12">
            <Link to="/gallery" className="text-xs uppercase tracking-widest text-[#c9a84c] border-b border-[#c9a84c]/40 pb-1 hover:border-[#c9a84c] transition-colors">
              View Full Gallery
            </Link>
          </div>
        </section>
      )}

      {styles.length > 0 && (
        <>
          <div className="border-t border-[#111]" />
          <section className="max-w-6xl mx-auto px-10 py-24">
            <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">What We Do</p>
            <h2 className="font-display text-3xl text-center mb-16">Our Styles</h2>
            <Carousel>
              {styles.map(style => (
                <div
                  key={style.id}
                  className="aspect-square overflow-hidden group relative cursor-pointer"
                  onClick={() => setSelectedStyle(style)}
                >
                  <img
                    src={style.imageUrl}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#0a0a0a]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="font-display text-xl text-[#e5e5e5]">{style.name}</p>
                  </div>
                </div>
              ))}
            </Carousel>
            <div className="text-center mt-12">
              <Link to="/styles" className="text-xs uppercase tracking-widest text-[#c9a84c] border-b border-[#c9a84c]/40 pb-1 hover:border-[#c9a84c] transition-colors">
                View All Styles
              </Link>
            </div>
          </section>
        </>
      )}

      <div className="border-t border-[#111]" />

      {/* Stats */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-4xl text-[#c9a84c] mb-2">10+</p>
            <p className="text-xs uppercase tracking-widest text-[#444]">Years of Experience</p>
          </div>
          <div>
            <p className="font-display text-4xl text-[#c9a84c] mb-2">500+</p>
            <p className="text-xs uppercase tracking-widest text-[#444]">Satisfied Clients</p>
          </div>
          <div>
            <p className="font-display text-4xl text-[#c9a84c] mb-2">12+</p>
            <p className="text-xs uppercase tracking-widest text-[#444]">Tattoo Styles</p>
          </div>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <>
          <div className="border-t border-[#111]" />
          <section className="max-w-4xl mx-auto px-6 py-24">
            <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">Studio Updates</p>
            <h2 className="font-display text-3xl text-center mb-16">Latest News</h2>
            <div className="flex flex-col gap-px bg-[#111]">
              {latestPosts.map(post => (
                <article key={post.id} className="bg-[#0a0a0a]">
                  {post.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-8">
                    <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">
                      {new Date(post.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <h3 className="font-display text-xl text-[#e5e5e5] mb-3">{post.title}</h3>
                    <p className="text-[#555] text-sm leading-relaxed line-clamp-3">{post.content}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/news" className="text-xs uppercase tracking-widest text-[#c9a84c] border-b border-[#c9a84c]/40 pb-1 hover:border-[#c9a84c] transition-colors">
                View All News
              </Link>
            </div>
          </section>
        </>
      )}
      {/* Style modal */}
      {selectedStyle && (
        <div
          className="fixed inset-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center px-6"
          onClick={() => setSelectedStyle(null)}
        >
          <div
            className="bg-[#111] border border-[#1a1a1a] max-w-lg w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={selectedStyle.imageUrl}
                alt={selectedStyle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="font-display text-2xl text-[#e5e5e5] mb-4">{selectedStyle.name}</h3>
              {selectedStyle.description && (
                <p className="text-[#555] text-sm leading-relaxed">{selectedStyle.description}</p>
              )}
              <button
                onClick={() => setSelectedStyle(null)}
                className="mt-8 text-xs uppercase tracking-widest text-[#444] hover:text-[#c9a84c] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
