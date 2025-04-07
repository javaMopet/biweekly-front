export const removeFields = (input, fieldsToRemove) => {
  if (Array.isArray(input)) {
    return input.map((item) => removeFields(item, fieldsToRemove))
  } else if (input && typeof input === 'object') {
    const cleaned = {}
    for (const key in input) {
      if (!fieldsToRemove.includes(key)) {
        cleaned[key] = removeFields(input[key], fieldsToRemove)
      }
    }
    return cleaned
  }
  return input
}
