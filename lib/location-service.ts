// This is a service for handling location-related functionality

interface Location {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp?: number
}

export async function getUserLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser")
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        })
      },
      (error) => {
        console.error("Error getting location:", error)
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  })
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula to calculate distance between two points on Earth
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

export function isWithinRadius(userLocation: Location, targetLocation: Location, radiusMeters = 50): boolean {
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    targetLocation.latitude,
    targetLocation.longitude,
  )

  return distance <= radiusMeters
}
