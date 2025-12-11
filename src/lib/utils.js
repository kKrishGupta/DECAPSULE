// utils.js

// Combines class names safely
export function cn(...inputs) {
  return inputs
    .flatMap(input =>
      typeof input === "string"
        ? input
        : Array.isArray(input)
        ? input
        : typeof input === "object" && input !== null
        ? Object.entries(input)
            .filter(([_, value]) => Boolean(value))
            .map(([key]) => key)
        : []
    )
    .join(" ")
}
