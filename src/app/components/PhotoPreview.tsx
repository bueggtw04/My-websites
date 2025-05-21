'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PhotoPreviewProps {
  isOpen: boolean
  onClose: () => void
  photo: {
    title: string
    description: string
    image: string
  } | null
}

export default function PhotoPreview({ isOpen, onClose, photo }: PhotoPreviewProps) {
  if (!isOpen || !photo) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>

        <div className="relative w-full h-full max-w-7xl">
          <Image
            src={photo.image}
            alt={photo.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
          <h2 className="text-2xl font-bold">{photo.title}</h2>
          <p className="mt-2">{photo.description}</p>
        </div>
      </motion.div>
    </div>
  )
} 