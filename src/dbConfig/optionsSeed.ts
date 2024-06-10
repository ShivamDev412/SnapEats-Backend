import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const optionsWithChoices = [
  {
    name: 'Size',
    choices: ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large']
  },
  {
    name: 'Crust Type',
    choices: ['Thin Crust', 'Thick Crust', 'Stuffed Crust', 'Gluten-Free Crust', 'Cheese Burst']
  },
  {
    name: 'Toppings',
    choices: [
      'Cheese',
      'Pepperoni',
      'Mushrooms',
      'Onions',
      'Sausage',
      'Bacon',
      'Extra Cheese',
      'Black Olives',
      'Green Peppers',
      'Pineapple',
      'Spinach',
      'Jalapenos',
      'Tomatoes',
      'Garlic',
      'Broccoli',
      'Artichokes'
    ]
  },
  {
    name: 'Bread Type',
    choices: [
      'White Bread',
      'Whole Wheat Bread',
      'Multigrain Bread',
      'Sourdough Bread',
      'Ciabatta',
      'Baguette',
      'Focaccia',
      'Brioche'
    ]
  },
  {
    name: 'Sauce',
    choices: ['Marinara', 'Alfredo', 'Pesto', 'Barbecue', 'Garlic Parmesan', 'Buffalo', 'Ranch', 'Honey Mustard']
  },
  {
    name: 'Cheese Type',
    choices: ['Mozzarella', 'Cheddar', 'Swiss', 'Parmesan', 'Provolone', 'American', 'Feta', 'Gorgonzola']
  },
  {
    name: 'Spice Level',
    choices: ['Mild', 'Medium', 'Hot', 'Extra Hot']
  },
  {
    name: 'Dressing',
    choices: ['Ranch', 'Caesar', 'Vinaigrette', 'Thousand Island', 'Blue Cheese', 'Italian', 'Honey Mustard']
  },
  {
    name: 'Cook Style',
    choices: ['Rare', 'Medium Rare', 'Medium', 'Well-Done', 'Grilled', 'Fried', 'Steamed', 'Baked']
  },
  {
    name: 'Extras',
    choices: ['Fries', 'Salad', 'Coleslaw', 'Breadsticks', 'Mashed Potatoes', 'Onion Rings', 'Garlic Bread']
  },
  {
    name: 'Pasta Type',
    choices: ['Spaghetti', 'Penne', 'Fettuccine', 'Linguine', 'Macaroni', 'Ravioli', 'Lasagna', 'Fusilli']
  },
  {
    name: 'Rice Type',
    choices: ['White Rice', 'Brown Rice', 'Basmati', 'Jasmine', 'Wild Rice', 'Sushi Rice', 'Sticky Rice']
  },
  {
    name: 'Side Dish',
    choices: ['Fries', 'Coleslaw', 'Salad', 'Breadsticks', 'Mashed Potatoes', 'Onion Rings', 'Garlic Bread']
  },
  {
    name: 'Beverage Size',
    choices: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  {
    name: 'Sweetener',
    choices: ['Sugar', 'Honey', 'Artificial Sweetener', 'Stevia']
  },
  {
    name: 'Milk Type',
    choices: ['Whole Milk', 'Skim Milk', 'Almond Milk', 'Soy Milk', 'Oat Milk', 'Coconut Milk']
  },
  {
    name: 'Tea Type',
    choices: ['Black Tea', 'Green Tea', 'Herbal Tea', 'Chai', 'Oolong Tea', 'White Tea', 'Matcha']
  },
  {
    name: 'Coffee Type',
    choices: ['Espresso', 'Americano', 'Latte', 'Cappuccino', 'Mocha', 'Macchiato', 'Flat White']
  },
  {
    name: 'Protein Type',
    choices: ['Chicken', 'Beef', 'Tofu', 'Fish', 'Pork', 'Lamb', 'Shrimp', 'Egg']
  },
  {
    name: 'Vegetable Type',
    choices: ['Broccoli', 'Carrots', 'Spinach', 'Peppers', 'Tomatoes', 'Onions', 'Mushrooms', 'Zucchini']
  },
  {
    name: 'Fruit Type',
    choices: ['Apple', 'Banana', 'Berries', 'Citrus', 'Grapes', 'Mango', 'Pineapple', 'Melon']
  },
  {
    name: 'Preparation Style',
    choices: ['Grilled', 'Fried', 'Steamed', 'Roasted', 'Baked', 'Sautéed', 'Boiled']
  }
];

async function main() {
  for (const option of optionsWithChoices) {
    const createdOption = await prisma.option.create({
      data: {
        name: option.name,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    for (const choice of option.choices) {
      await prisma.predefinedChoice.create({
        data: {
          optionId: createdOption.id,
          name: choice,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
  }
  console.log('Options and choices added successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
