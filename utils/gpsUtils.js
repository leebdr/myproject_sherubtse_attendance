/**
 * Calculate distance between two points using the Haversine formula
 * @param {number} lat1 - Latitude of first point in degrees
 * @param {number} lon1 - Longitude of first point in degrees
 * @param {number} lat2 - Latitude of second point in degrees
 * @param {number} lon2 - Longitude of second point in degrees
 * @returns {number} Distance in meters
 */
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Radius of the Earth in meters
  const R = 6371e3

  // Convert degrees to radians
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  // Haversine formula
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // Distance in meters
  const distance = R * c

  return distance
}

/**
 * Check if a location is within a specified radius of another location
 * @param {Object} userLocation - User's location {latitude, longitude}
 * @param {Object} targetLocation - Target location {latitude, longitude}
 * @param {number} radiusMeters - Maximum allowed distance in meters
 * @returns {boolean} True if within radius, false otherwise
 */
exports.isWithinRadius = (userLocation, targetLocation, radiusMeters = 50) => {
  const distance = this.calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    targetLocation.latitude,
    targetLocation.longitude,
  )

  return distance <= radiusMeters
}
