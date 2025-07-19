import { notFound } from 'next/navigation';
import ProfileDetails from '@/components/ProfileDetails';
import { DataUsers } from '@/lib/mockData';

export default function ProfilePage({ params }: { params: { profileId: string } }) {
  try {
    // Decode the base64 ID
    const decodedId = decodeURIComponent(params.profileId);
    const profile = DataUsers.find(user => user.id === decodedId);
    
    if (!profile) return notFound();
    
    return <ProfileDetails profile={profile} />;
  } catch {
    return notFound();
  }
}