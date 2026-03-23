import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  size?: 'hero' | 'compact'
  initialValue?: string
}

export default function SearchBar({ size = 'hero', initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const cleaned = query.trim().toLowerCase().replace(/\.btc$/, '')
    if (cleaned) {
      navigate(`/search?q=${encodeURIComponent(cleaned)}`)
    }
  }

  const isHero = size === 'hero'

  return (
    <form onSubmit={handleSubmit} className={`relative ${isHero ? 'max-w-2xl' : 'max-w-xl'} mx-auto group`}>
      {isHero && (
        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      )}
      <div className={`relative flex items-center bg-surface-container-highest/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl ${isHero ? 'border border-outline-variant/20' : ''}`}>
        <span className="material-symbols-outlined ml-4 text-outline" style={{ fontVariationSettings: "'wght' 300" }}>
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`bg-transparent border-none focus:ring-0 focus:outline-none outline-none ${isHero ? 'text-lg' : 'text-base'} px-4 w-full font-headline placeholder:text-outline/50 text-on-surface`}
          placeholder={isHero ? 'Search your unique .btc handle...' : 'Search for your .btc domain...'}
        />
        <button
          type="submit"
          className={`bg-primary text-on-primary ${isHero ? 'px-8 py-3' : 'px-6 py-2'} rounded-xl font-headline font-bold hover:bg-primary-fixed-dim transition-colors`}
        >
          Search
        </button>
      </div>
    </form>
  )
}
