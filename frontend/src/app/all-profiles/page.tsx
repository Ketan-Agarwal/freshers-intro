'use client'
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
const LIMIT=10
type Image = { image_url: string };
type Profile = {
    user: { username: string, email: string, id: number, is_varified: boolean, images: Image[] };
    bio?: string;
    branch?: string;
    batch?: string;
    hostel?: string;
    hobbies?: string[];
    interests?: string[];
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth()

  const fetchProfiles = async () => {
    setLoading(true);

    const res = await fetch(`${ORIGIN}/profile/get-all-profiles?skip=${LIMIT*page}&limit=${LIMIT}`, {
        method : "POST",
        credentials : "include",
    });
    const json =await res.json()
    console.log(json)
    setProfiles(prev => [...prev, ...(json)]);
    setLoading(false);
  };

  useEffect(() => {
    if(isAuthenticated){
        fetchProfiles();
    }
  }, [page,isAuthenticated]);

  const scrollToBottom = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 200 >=
      document.documentElement.offsetHeight
    ) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollToBottom);
    return () => window.removeEventListener("scroll", scrollToBottom);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {profiles.map((p, idx) => (
        <div key={idx} className="p-4 border rounded mb-4">
          <h2 className="text-xl font-semibold">{p.user.username}</h2>
          <p>{p.bio}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {p.user.images.map((img, i) => (
              <img
                key={i}
                src={img.image_url}
                loading="lazy"
                className="rounded-md object-cover w-full h-48"
                alt={`${p.user.username} #${i}`}
              />
            ))}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex items-center gap-2 text-gray-700 dark:text-purple-300 text-lg">
          <Loader2 className="animate-spin" />
          loading images...
        </div>
      )}
    </div>
  );
}
