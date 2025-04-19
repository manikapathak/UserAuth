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

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.push('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    }
    // } catch (err: any) {
    //   // See https://clerk.com/docs/custom-flows/error-handling
    //   // for more info on error handling
    //   console.error('Error:', JSON.stringify(err, null, 2))
    // }
    catch (err: any) {
        setError(err.errors?.[0]?.longMessage || 'Sign up failed');
      }
  }

  // Display the verification form to capture the OTP code
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

  // Display the initial sign-up form to capture the email and password
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
  
        {/* CAPTCHA Widget */}
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