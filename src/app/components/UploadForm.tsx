'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'

interface UploadFormProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (photo: {
    title: string
    description: string
    image: string
  }) => void
}

export default function UploadForm({ isOpen, onClose, onUpload }: UploadFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('圖片大小不能超過 15MB')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) return
    setIsSubmitting(true)
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpload({
          title,
          description,
          image: reader.result as string
        })
        handleClose()
      }
      reader.readAsDataURL(image)
    } catch (error) {
      alert('上傳失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setImage(null)
    setPreview('')
    onClose()
  }

  if (!isOpen) return null

  const isReady = title && description && image

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-milk-tea-900">上傳作品</h2>
          <button
            onClick={handleClose}
            className="text-milk-tea-500 hover:text-milk-tea-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-milk-tea-700 mb-1">
              標題
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-milk-tea-300 rounded-md focus:outline-none focus:ring-2 focus:ring-milk-tea-500"
              required
              maxLength={50}
              placeholder="請輸入作品標題（最多50字）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-milk-tea-700 mb-1">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-milk-tea-300 rounded-md focus:outline-none focus:ring-2 focus:ring-milk-tea-500"
              rows={3}
              required
              maxLength={200}
              placeholder="請輸入作品描述（最多200字）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-milk-tea-700 mb-1">
              圖片
            </label>
            <label className="inline-flex items-center px-4 py-2 bg-milk-tea-100 text-milk-tea-800 rounded-md cursor-pointer hover:bg-milk-tea-200 border border-milk-tea-300 transition-colors font-medium gap-2">
              <ArrowUpTrayIcon className="h-5 w-5" />
              {image ? (image.name) : '選擇檔案'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </label>
            <p className="text-sm text-milk-tea-500 mt-1">
              支持 JPG、PNG 格式，大小不超過 15MB
            </p>
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isReady || isSubmitting}
            className={`w-full py-2 px-4 rounded-md font-semibold text-lg transition-colors ${isReady ? 'bg-milk-tea-600 text-black hover:bg-milk-tea-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {isSubmitting ? '上傳中...' : '確認上傳'}
          </button>
        </form>
      </motion.div>
    </div>
  )
} 