"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerFace } from "@/lib/face-service"

export default function RegisterFacePage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [regulaLoaded, setRegulaLoaded] = useState(false)
  const [regulaError, setRegulaError] = useState("")

  // Load Regula SDK
  useEffect(() => {
    const loadRegula = async () => {
      try {
        // In a real implementation, you would load the Regula SDK here
        // For this example, we'll simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRegulaLoaded(true)
      } catch (err) {
        console.error("Failed to load Regula SDK:", err)
        setRegulaError("Failed to load facial recognition SDK. Please try again later.")
      }
    }

    loadRegula()
  }, [])

  // Start camera when Regula is loaded
  useEffect(() => {
    if (regulaLoaded && !cameraActive) {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [regulaLoaded])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please ensure camera permissions are granted.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }

  const retakeImage = () => {
    setCapturedImage(null)
    startCamera()
  }

  const handleSubmit = async () => {
    if (!capturedImage) {
      setError("Please capture your face image first")
      return
    }

    setLoading(true)
    setError("")

    try {
      // In a real implementation, this would send the image to your server
      const result = await registerFace(capturedImage)

      if (result.success) {
        // Redirect based on user role (assuming role is stored in session/local storage)
        const userRole = localStorage.getItem("userRole") || "student"
        router.push(`/${userRole}/dashboard`)
      } else {
        setError(result.message || "Failed to register face. Please try again.")
      }
    } catch (err) {
      console.error("Error registering face:", err)
      setError("An error occurred while registering your face. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (regulaError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Face Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{regulaError}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button onClick={() => router.push("/auth/login")}>Return to Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Face Registration</CardTitle>
          <CardDescription className="text-center">
            We need to capture your face for identity verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {!regulaLoaded ? (
                <div className="text-center p-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-2"></div>
                  <p>Loading facial recognition SDK...</p>
                </div>
              ) : capturedImage ? (
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured face"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex justify-center space-x-4">
              {capturedImage ? (
                <>
                  <Button variant="outline" onClick={retakeImage} disabled={loading}>
                    Retake
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Processing..." : "Continue"}
                  </Button>
                </>
              ) : (
                <Button onClick={captureImage} disabled={!cameraActive || loading} className="px-8">
                  Capture
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          <p>Your facial data will be securely stored and only used for attendance verification purposes.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
