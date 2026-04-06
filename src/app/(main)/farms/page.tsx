import { redirect } from 'next/navigation';

// /farms just redirects to dashboard where all farms are listed
export default function FarmsPage() {
  redirect('/');
}
