'use client'

import * as React from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [verifying, setVerifying] = React.useState(false)
  const [error, setError] = React.useState('')
  const [code, setCode] = React.useState('')
  const router = useRouter()

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    
    try {
      await signUp.create({
        emailAddress,
        password,
      })

     
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      
      setVerifying(true)
    } catch (err: any) {
      
      console.error(JSON.stringify(err, null, 2))
    }
  }

 
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    try {
      
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

    
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.push('/')
      } else {
       
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    }
   
    catch (err: any) {
        setError(err.errors?.[0]?.longMessage || 'Sign up failed');
      }
  }

  
  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
        <form onSubmit={handleVerify}>
          <label id="code">Enter your verification code</label>
          <input value={code} id="code" name="code" onChange={(e) => setCode(e.target.value)} />
          <button type="submit">Verify</button>
        </form>
      </>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-g bg-[#98E4FF]">
      <form onSubmit={handleSubmit} className="bg-blue-950 p-8 rounded-lg shadow-md w-80 space-y-4">
        <h1 className="text-xl font-semibold text-white">Sign Up</h1>
  
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
  
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
  
        <div id="clerk-captcha"></div>
  
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
}  