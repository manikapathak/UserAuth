import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#98E4FF] px-4 text-center overflow-hidden">


  
      <h1 className="text-5xl font-extrabold text-blue-950 z-10">Welcome to My App</h1>

      <SignedOut>
        <p className="mt-4 mb-2 pt-2 text-white font-semibold">Please log in to access the dashboard.</p>
        <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Go to Login
        </Link>
        <p className="mt-4 mb-2 pt-2 text-white font-semibold">Or sign up for a new account:</p>
        <Link href="/signin" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Go to Sign-in
        </Link>
      </SignedOut>

      <SignedIn>
        <p className="mb-6 mt-4 text-lg text-white z-10">You're signed in</p>
        <div className="flex gap-4 items-center">
          <UserButton />
          <Link
            href="/dashboard"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </SignedIn>
    </main>
  );
}
