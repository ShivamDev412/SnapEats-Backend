import prisma from ".";

const foodTypes = [
  "Fast Food",
  "Pizza",
  "Desserts",
  "Wings",
  "Indian",
  "Ice Cream",
  "Halal",
  "Sandwich",
  "Burgers",
  "Asian",
  "Sushi",
  "Mexican",
  "Chinese",
  "BBQ",
  "Korean",
  "Breakfast",
  "Healthy",
  "Thai",
  "Italian",
  "Smoothies",
  "Soup",
  "Seafood",
  "Caribbean",
  "Street Food",
  "Coffee",
  "Japanese",
  "Vegan",
  "Salads",
  "American",
];

async function removeDuplicateFoodTypes() {
  // Get all food types
  const allFoodTypes = await prisma.storeFoodTypes.findMany();
  
  // Find duplicates by foodType
  const foodTypeSet = new Set();
  const duplicates:any = [];
  
  allFoodTypes.forEach(foodType => {
    if (foodTypeSet.has(foodType.foodType)) {
      duplicates.push(foodType.id);
    } else {
      foodTypeSet.add(foodType.foodType);
    }
  });

  // Remove duplicates
  if (duplicates.length > 0) {
    await prisma.storeFoodTypes.deleteMany({
      where: {
        id: { in: duplicates },
      },
    });
  }
}

async function seedFoodTypes() {
  await prisma.storeFoodTypes.createMany({
    data: foodTypes.map((foodType) => ({
      foodType,
    })),
    skipDuplicates: true,
  });

  console.log('Food types seeded successfully');
}

async function main() {
  await removeDuplicateFoodTypes();
  // await seedFoodTypes();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
