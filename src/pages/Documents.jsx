import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { FileText, Download, ExternalLink } from 'lucide-react'

export default function Documents() {
  const { frontId } = useParams()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [frontId])

  const fetchDocuments = async () => {
    try {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('front_id', frontId)
        .order('created_at', { ascending: false })

      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-etf-blue"></div>
      </div>
    )
  }

  return (
    <div className="container min-h-screen py-8">
      <h1 className="text-4xl font-bold text-etf-blue mb-8">Documents</h1>

      {documents.length === 0 ? (
        <div className="text-center py-12 card p-6">
          <p className="text-gray-600">Aucun document disponible</p>
        </div>
      ) : (
        <div className="space-y-4 pb-12">
          {documents.map((doc) => (
            <div key={doc.id} className="card p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="text-etf-blue" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-etf-blue">{doc.name}</h3>
                  <p className="text-gray-600 text-sm">{doc.type}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-2 px-4 py-2"
                >
                  <ExternalLink size={18} />
                  Consulter
                </a>
                <a
                  href={doc.url}
                  download={doc.name}
                  className="btn-primary flex items-center gap-2 px-4 py-2"
                >
                  <Download size={18} />
                  Télécharger
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
