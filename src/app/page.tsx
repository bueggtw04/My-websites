'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CameraIcon, HeartIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import useEmblaCarousel from 'embla-carousel-react'
import UploadForm from './components/UploadForm'
import DeleteConfirmDialog from './components/DeleteConfirmDialog'
import PhotoPreview from './components/PhotoPreview'

interface Photo {
  id: number
  title: string
  description: string
  image: string
  likes: number
  isLiked?: boolean
}

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<{ id: number; title: string } | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  // 載入 localStorage
  useEffect(() => {
    const saved = localStorage.getItem('photo-gallery-photos')
    if (saved) {
      setPhotos(JSON.parse(saved))
    } else {
      setPhotos([
        {
          id: 1,
          title: '晨光',
          description: '清晨的第一縷陽光',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
          likes: 128,
          isLiked: false,
        },
        {
          id: 2,
          title: '山間小路',
          description: '寧靜的山間小徑',
          image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
          likes: 95,
          isLiked: false,
        },
        {
          id: 3,
          title: '海邊日落',
          description: '浪漫的海邊日落時分',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
          likes: 156,
          isLiked: false,
        },
        {
          id: 4,
          title: '城市夜景',
          description: '繁華都市的璀璨燈火',
          image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
          likes: 203,
          isLiked: false,
        },
        {
          id: 5,
          title: '雪山之巔',
          description: '白雪皚皚的山峰',
          image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
          likes: 178,
          isLiked: false,
        },
        {
          id: 6,
          title: '沙漠綠洲',
          description: '沙漠中的生命奇跡',
          image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
          likes: 145,
          isLiked: false,
        },
      ])
    }
  }, [])

  // 每次 photos 變動時同步到 localStorage
  useEffect(() => {
    localStorage.setItem('photo-gallery-photos', JSON.stringify(photos))
  }, [photos])

  const carouselPhotos = [
    {
      id: 1,
      title: '倫敦街景',
      description: '英國倫敦的街頭風光，展現城市的歷史與現代交融。',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
    },
    {
      id: 2,
      title: '山巒薄霧',
      description: '山巒間的晨霧與雲海，營造出夢幻的自然景色。',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    },
    {
      id: 3,
      title: '舊金山金門大橋',
      description: '美國最具代表性的地標之一，橫跨金門海峽的壯觀吊橋。',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
    },
  ]

  const handleUpload = (newPhoto: { title: string; description: string; image: string }) => {
    const photo = {
      id: Date.now(),
      ...newPhoto,
      likes: 0,
      isLiked: false,
    }
    setPhotos([...photos, photo])
  }

  const handleDeleteClick = (photo: { id: number; title: string }) => {
    setPhotoToDelete(photo)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (photoToDelete) {
      setPhotos(photos.filter(photo => photo.id !== photoToDelete.id))
      setPhotoToDelete(null)
    }
  }

  const handleLike = (photoId: number) => {
    setPhotos(photos.map(photo => {
      if (photo.id === photoId) {
        const isLiked = !photo.isLiked
        return {
          ...photo,
          isLiked,
          likes: isLiked ? photo.likes + 1 : photo.likes - 1
        }
      }
      return photo
    }))
  }

  const handlePhotoClick = (photo: Photo) => {
    setPreviewPhoto(photo)
    setIsPreviewOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#F5E6D3]">
      {/* 導航欄 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <CameraIcon className="h-8 w-8 text-milk-tea-500" />
              <span className="ml-2 text-xl font-semibold text-milk-tea-900">阿翔的攝影集</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setIsUploadFormOpen(true)}
                className="bg-milk-tea-600 text-black font-semibold px-6 py-2.5 rounded-md hover:bg-milk-tea-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md text-lg"
              >
                上傳作品
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 上傳表單 */}
      <UploadForm
        isOpen={isUploadFormOpen}
        onClose={() => setIsUploadFormOpen(false)}
        onUpload={handleUpload}
      />

      {/* 刪除確認對話框 */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setPhotoToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title={photoToDelete?.title || ''}
      />

      {/* 照片預覽 */}
      <PhotoPreview
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setPreviewPhoto(null)
        }}
        photo={previewPhoto}
      />

      {/* 輪播區 */}
      <div className="relative w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {carouselPhotos.map((photo) => (
            <div key={photo.id} className="flex-[0_0_100%] min-w-0 relative h-[500px]">
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
                <h2 className="text-2xl font-bold">{photo.title}</h2>
                <p className="mt-2">{photo.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 rounded-full p-2 hover:bg-white shadow"
          aria-label="上一張"
        >
          <ChevronLeftIcon className="h-6 w-6 text-milk-tea-900" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 rounded-full p-2 hover:bg-white shadow"
          aria-label="下一張"
        >
          <ChevronRightIcon className="h-6 w-6 text-milk-tea-900" />
        </button>
      </div>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-milk-tea-900 mb-8">精選作品</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-64 cursor-pointer" onClick={() => handlePhotoClick(photo)}>
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick({ id: photo.id, title: photo.title })
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="刪除作品"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-milk-tea-900">{photo.title}</h3>
                <p className="text-milk-tea-600 mt-1">{photo.description}</p>
                <div className="flex items-center mt-4">
                  <button
                    onClick={() => handleLike(photo.id)}
                    className="text-milk-tea-500 hover:text-red-500 transition-colors"
                  >
                    {photo.isLiked ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                  <span className="text-milk-tea-600 ml-2">{photo.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
} 