'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { DataUsers } from '@/lib/mockData';

export default function ProfileDetails({ profile }: { profile: typeof DataUsers[0] }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-96"
              >
                {profile.photos.map((photo, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={photo}
                      alt={`${profile.name} Photo ${i}`}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300x300?text=No+Image')
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}