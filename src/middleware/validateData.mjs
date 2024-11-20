// Returns a function that validates a schema over the given data
// Schema is from Zod
export function validateData(schema) {
  return (req, res, next) => {
    // Isolate the body
    const input = {
      ...req.body,
    };

    const { success, error } = schema.safeParse(input);
    console.log(`Got ${req.method}:`, input);

    // If it fails, bail!
    if (!success) {
      console.warn("Error:", error.message);
      return res.status(400).json(error);
    }

    // Otherwise, continue going along...
    next();
  };
}
