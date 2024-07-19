import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// import prisma from "../dbConfig/index";
const getUsers = async () => {
  const users = await prisma.user.findMany();
};
const removeRefreshToken = async () => {
  const updatedUser =  await prisma.user.update({
    where: {
      id: "clx14uyp90000109m9pca7it3",
    },
    data: {
      refreshTokens: [],
    },
  });
  console.log(updatedUser);
};
const removeUser = async () => {
  await prisma.user.delete({
    where: {
      id: "clx9c43k200009uru1dnja9nu",
    },
  });
};
const userAddress = async () => {
  const address = await prisma.address.findMany();
  console.log(address, "address");
};

const getStore = async () => {
  const store = await prisma.store.findMany();
  console.log(store);
};
const removeStoreFromUser = async (userId: any, storeId: any) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { storeId: null },
    });

    // Delete the store
    await prisma.storeAddress.delete({
      where: {
        storeId: storeId,
      },
    });
    await prisma.store.delete({
      where: {
        id: storeId,
      },
    });

    console.log("Store removed and deleted successfully");
  } catch (error) {
    console.error("Error removing store from user:", error);
  } finally {
    await prisma.$disconnect();
  }
};


// const categories = [
//   'Breakfast',
//   'Lunch',
//   'Dinner',
//   'Snacks',
//   'Desserts',
//   'Beverages',
//   'Appetizers',
//   'Salads',
//   'Soups',
//   'Main Course',
//   'Side Dishes',
//   'Pizzas',
//   'Burgers',
//   'Sandwiches',
//   'Pasta',
//   'Seafood',
//   'Grill',
//   'BBQ',
//   'Vegan',
//   'Vegetarian',
//   'Non-Vegetarian',
//   'Gluten-Free',
//   'Keto',
//   'Kids Menu',
//   'Combo Meals'
// ];
// async function addCategory() {
//   for (const name of categories) {
//     await prisma.category.create({
//       data: {
//         name,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     });
//   }
//   console.log('Categories added successfully');
// }
// const getCategory = async () => {
//   const category = await prisma.category.findMany();
//   console.log(category);
// };
//  addCategory();
//  getCategory();
// getUsers
// removeStoreFromUser()
// removeUser();
// userAddress();
// removeStoreFromUser("clwlp9hkg0000ype13yejj8p9","clx4ten3l0001ujn69jqxoxx5")
// removeRefreshToken();
const getChoice = () => {
  prisma.predefinedChoice.findMany({
    where:{
      optionId:"clx97ona4005t118v5h2ftk1g"
    }
  }).then((choices) => {
    console.log(choices);
  })
}
// getChoice()
// getUsers();
// removeStoreFromUser("clwlp9hkg0000ype13yejj8p9","clx4uaa290001n1g6ynkmlht9")
// removeStoreFromUser("clxd6s6to000010sdz4fhiwt4","clxd7batf000210sdg60ic69m")
getStore();