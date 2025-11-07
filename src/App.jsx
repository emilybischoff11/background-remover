import { useState, useEffect } from 'react'
import { Upload, Download, Trash2, Loader2, Image as ImageIcon, LogOut } from 'lucide-react'
import axios from 'axios'
import { supabase } from './supabaseClient'
import Auth from './Auth'

function App() {
  const [session, setSession] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setProcessedImage(null)
      setError(null)
    }
  }

  const handleRemoveBackground = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await axios.post('/api/remove-background', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const imageUrl = URL.createObjectURL(response.data)
      setProcessedImage(imageUrl)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove background')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.href = processedImage
    link.download = 'background-removed.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setProcessedImage(null)
    setError(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center mb-4">
            <ImageIcon className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Background Remover
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload an image and remove its background instantly
          </p>
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="absolute top-0 right-4 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Upload Section */}
          {!previewUrl && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-16 h-16 text-purple-400 mb-4" />
                  <p className="mb-2 text-xl font-semibold text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          )}

          {/* Preview and Result Section */}
          {previewUrl && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Original Image */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Original Image
                  </h3>
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Background Removed
                  </h3>
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
                    {loading ? (
                      <div className="flex items-center justify-center h-64 bg-white/80">
                        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                      </div>
                    ) : processedImage ? (
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-white/80">
                        <p className="text-gray-400">Processed image will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleRemoveBackground}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5" />
                      Remove Background
                    </>
                  )}
                </button>

                {processedImage && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Trash2 className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App