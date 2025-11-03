export const categoryProcessor = async (job) => {
  try {
    const { data } = job; // data sent when adding job
    console.log("Processing category:", data);

    // TODO: Replace this with your actual automation logic
    // Example: save category to database
    // await prisma.category.create({ data });

    return { success: true };
  } catch (err) {
    console.error("Category job failed:", err);
    throw err;
  }
};
