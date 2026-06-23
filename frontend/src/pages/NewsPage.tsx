import { useEffect, useState } from 'react'
import { getPosts } from '@/api/posts'
import type { Post } from '@/types'

const NewsPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts().then(setPosts).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">Studio Updates</p>
      <h1 className="font-display text-4xl text-center mb-16">News</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-[#444] py-20 text-xs uppercase tracking-widest">No posts yet</p>
      ) : (
        <div className="flex flex-col gap-16">
          {posts.map(post => (
            <article key={post.id} className="border-b border-[#111] pb-16 last:border-0">
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden mb-8">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-4">
                {new Date(post.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <h2 className="font-display text-2xl text-[#e5e5e5] mb-4">{post.title}</h2>
              <p className="text-[#555] text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
              <p className="text-xs text-[#333] mt-6 uppercase tracking-widest">By {post.publishedBy.username}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default NewsPage
