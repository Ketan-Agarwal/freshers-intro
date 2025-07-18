//this is the code where the data is to fetched from backend
//below this code is the code which uses an array of mock users just for checking the rendering
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ITEMS_PER_PAGE = 9;

const UserGallery = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // fetching users from backend
  const fetchUsers = useCallback(async () => {
    if (!hasMore) return;

    const res = await fetch(
      `/users?search=${encodeURIComponent(searchTerm)}&limit=${ITEMS_PER_PAGE}&offset=${offset}` //whatever route  will be created..this is just an example to show how the query parameters will be sent in the backend request
    );
    const data = await res.json();

    //we will have to set these query parameters in our backend route for fetching profiles
    //once the suer opens the screen of profiles, he will be shown 9 profiles first(according to the screen size for laptop i decided this, and then as they 
    //scroll below , more 9 profiles will be fetched from backend and so on.)/
    //so we need to include these 2 query params : offset and limit in our backend route
    //rest will be unchanged i think

    setUsers((prev) => [...prev, ...data]);
    setOffset((prev) => prev + ITEMS_PER_PAGE);
    if (data.length < ITEMS_PER_PAGE) setHasMore(false);
  }, [searchTerm, offset, hasMore]);

  // fr trigger fetch on searchTerm change
  useEffect(() => {
    setOffset(0);
    setUsers([]);
    setHasMore(true);
  }, [searchTerm]);

  // fetch initial + on scroll
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // intersection observer
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchUsers();
      }
    });

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchUsers, hasMore]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          Browse Profiles
        </h1>

        <input
          type="text"
          placeholder="Search by name or interest..."
          className="w-full md:w-80 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 p-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full h-full"
                >
                  {user.photos.map((photo: string, i: number) => (
                    <SwiperSlide key={i}>
                      <img
                        src={photo}
                        alt={`User ${index} Photo ${i}`}
                        loading="lazy"
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

              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                  {user.bio}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {user.interests.map((interest: string, i: number) => (
                    <span
                      key={i}
                      className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 mt-10 text-center">
        {hasMore ? <p className="text-gray-500">Loading more...</p> : <p>No more profiles</p>}
      </div>
    </div>
  );
};

export default UserGallery;






// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import './swiper-custom.css'; // For arrow styling

// //this mock array will be replaced by the data fetched from backend. 

// const DataUsers = [
//      {     name: 'Alice Verma',
//     bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
//     interests: ['AI', 'Robotics', 'Music', 'Chess'],
//     photos: [
//       '/images/person.jpg',
//       '/images/person2.jpg',
//       '/images/ritikab24.png',
//     ],
//   },
//   {
//     name: 'Rohan Mehta',
//     bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
//     interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?boy,1',
//       'https://source.unsplash.com/random/300x300?boy,2',
//     ],
//   },
//   {
//     name: 'Sara Khan',
//     bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
//     interests: ['Art', 'UI/UX', 'React', 'Painting'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?woman,1',
//       'https://source.unsplash.com/random/300x300?woman,2',
//       'https://source.unsplash.com/random/300x300?woman,3',
//     ],
//   },
//   {
//     name: 'Alice Verma',
//     bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
//     interests: ['AI', 'Robotics', 'Music', 'Chess'],
//     photos: [
//       '/images/person.jpg',
//       '/images/person2.jpg',
//       '/images/ritikab24.png',
//     ],
//   },
//   {
//     name: 'Rohan Mehta',
//     bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
//     interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?boy,1',
//       'https://source.unsplash.com/random/300x300?boy,2',
//     ],
//   },
//   {
//     name: 'Sara Khan',
//     bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
//     interests: ['Art', 'UI/UX', 'React', 'Painting'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?woman,1',
//       'https://source.unsplash.com/random/300x300?woman,2',
//       'https://source.unsplash.com/random/300x300?woman,3',
//     ],
//   },
//   {
//     name: 'Alice Verma',
//     bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
//     interests: ['AI', 'Robotics', 'Music', 'Chess'],
//     photos: [
//       '/images/person.jpg',
//       '/images/person2.jpg',
//       '/images/ritikab24.png',
//     ],
//   },
//   {
//     name: 'Rohan Mehta',
//     bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
//     interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?boy,1',
//       'https://source.unsplash.com/random/300x300?boy,2',
//     ],
//   },
//   {
//     name: 'Sara Khan',
//     bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
//     interests: ['Art', 'UI/UX', 'React', 'Painting'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?woman,1',
//       'https://source.unsplash.com/random/300x300?woman,2',
//       'https://source.unsplash.com/random/300x300?woman,3',
//     ],
//   },
//   {
//     name: 'Alice Verma',
//     bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
//     interests: ['AI', 'Robotics', 'Music', 'Chess'],
//     photos: [
//       '/images/person.jpg',
//       '/images/person2.jpg',
//       '/images/ritikab24.png',
//     ],
//   },
//   {
//     name: 'Rohan Mehta',
//     bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
//     interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?boy,1',
//       'https://source.unsplash.com/random/300x300?boy,2',
//     ],
//   },
//   {
//     name: 'Sara Khan',
//     bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
//     interests: ['Art', 'UI/UX', 'React', 'Painting'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?woman,1',
//       'https://source.unsplash.com/random/300x300?woman,2',
//       'https://source.unsplash.com/random/300x300?woman,3',
//     ],
//   },
//   {
//     name: 'Alice Verma',
//     bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
//     interests: ['AI', 'Robotics', 'Music', 'Chess'],
//     photos: [
//       '/images/person.jpg',
//       '/images/person2.jpg',
//       '/images/ritikab24.png',
//     ],
//   },
//   {
//     name: 'Rohan Mehta',
//     bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
//     interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?boy,1',
//       'https://source.unsplash.com/random/300x300?boy,2',
//     ],
//   },
//   {
//     name: 'Sara Khan',
//     bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
//     interests: ['Art', 'UI/UX', 'React', 'Painting'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?woman,1',
//       'https://source.unsplash.com/random/300x300?woman,2',
//       'https://source.unsplash.com/random/300x300?woman,3',
//     ],
//   },
//   {
//     name: 'Alice Verma',
//     bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
//     interests: ['AI', 'Robotics', 'Music', 'Chess'],
//     photos: [
//       '/images/person.jpg',
//       '/images/person2.jpg',
//       '/images/ritikab24.png',
//     ],
//   },
//   {
//     name: 'Rohan Mehta',
//     bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
//     interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?boy,1',
//       'https://source.unsplash.com/random/300x300?boy,2',
//     ],
//   },
//   {
//     name: 'Sara Khan',
//     bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
//     interests: ['Art', 'UI/UX', 'React', 'Painting'],
//     photos: [
//       'https://source.unsplash.com/random/300x300?woman,1',
//       'https://source.unsplash.com/random/300x300?woman,2',
//       'https://source.unsplash.com/random/300x300?woman,3',
//     ],
//   },
// ];


// const ITEMS_PER_PAGE = 6;

// const UserGallery = () => {
//   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
//   const [searchTerm, setSearchTerm] = useState('');
//   const observerRef = useRef<HTMLDivElement | null>(null);

//   const filteredUsers = DataUsers.filter((user) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       user.name.toLowerCase().includes(search) ||
//       user.interests.some((interest) => interest.toLowerCase().includes(search))
//     );
//   });

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];
//         if (entry.isIntersecting && visibleCount < filteredUsers.length) {
//           setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (observerRef.current) {
//       observer.observe(observerRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observer.unobserve(observerRef.current);
//       }
//     };
//   }, [visibleCount, filteredUsers.length]);

//   return (
//     <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-8 transition-colors duration-300">
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
//         <h1 className="text-5xl font-extrabold text-center md:text-left mb-4 md:mb-0 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
//           Browse Profiles
//         </h1>

//         <input
//           type="text"
//           placeholder="Search by name or interest..."
//           className="w-full md:w-80 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {filteredUsers.slice(0, visibleCount).map((user, index) => (
//           <div
//             key={index}
//             className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 transition-colors p-4"
//           >
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
//                 <Swiper
//                   modules={[Navigation, Pagination]}
//                   navigation
//                   pagination={{ clickable: true }}
//                   className="w-full h-full custom-swiper"
//                 >
//                   {user.photos.map((photo, i) => (
//                     <SwiperSlide key={i}>
//                       <img
//                         src={photo}
//                         alt={`User ${index} Photo ${i}`}
//                         loading="lazy"
//                         className="w-full h-full object-cover"
//                         onError={(e) =>
//                           ((e.target as HTMLImageElement).src =
//                             'https://via.placeholder.com/300x300?text=No+Image')
//                         }
//                       />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>

//               <div className="flex-1 flex flex-col">
//                 <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
//                 <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
//                   {user.bio}
//                 </p>

//                 <div className="flex flex-wrap gap-2 mt-auto">
//                   {user.interests.map((interest, i) => (
//                     <span
//                       key={i}
//                       className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
//                     >
//                       {interest}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {visibleCount < filteredUsers.length && (
//         <div
//           ref={observerRef}
//           className="h-10 mt-10 flex justify-center items-center text-gray-500"
//         >
//           Loading more profiles...
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserGallery;
