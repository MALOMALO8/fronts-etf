import { Search } from 'lucide-react'
import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Rechercher un front, contact, adresse..."
        value={query}
        onChange={handleChange}
        className="input-field pl-10"
      />
      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
    </div>
  )
}
