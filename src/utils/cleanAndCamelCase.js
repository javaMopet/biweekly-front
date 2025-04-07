const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

export const cleanAndCamelCase = (input, fieldsToRemove = []) => {
  if (Array.isArray(input)) {
    return input.map((item) => cleanAndCamelCase(item, fieldsToRemove))
  } else if (input && typeof input === 'object') {
    const cleaned = {}
    for (const key in input) {
      if (!fieldsToRemove.includes(key)) {
        const newKey = toCamelCase(key)
        cleaned[newKey] = cleanAndCamelCase(input[key], fieldsToRemove)
      }
    }
    return cleaned
  }
  return input
}
