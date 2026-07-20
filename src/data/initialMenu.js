export const initialCategories = [
  { id: "starters", name: "Signature Starters", icon: "Soup" },
  { id: "specials", name: "Chef's Specials", icon: "Sparkles" },
  { id: "mains", name: "Main Course", icon: "Utensils" },
  { id: "desserts", name: "Sweet Desserts", icon: "Dessert" },
  { id: "drinks", name: "Craft Drinks & Coffee", icon: "CupSoda" },
];

export const dishImagesMap = {
  soup: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?q=80&w=400&auto=format&fit=crop",
  prawns: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop",
  skewers: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop",
  caesar: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400&auto=format&fit=crop",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
  tandoori: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=400&auto=format&fit=crop",
  breakfast: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop",
  sweetduo: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=400&auto=format&fit=crop",
  steak: "https://images.unsplash.com/photo-1432139534698-cf43e8d21988?q=80&w=400&auto=format&fit=crop",
  salmon: "https://images.unsplash.com/photo-1485921325814-a532d8f49d7f?q=80&w=400&auto=format&fit=crop",
  tiramisu: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop",
  mousse: "https://images.unsplash.com/photo-1541795795328-f073b763494e?q=80&w=400&auto=format&fit=crop",
  espresso: "https://images.unsplash.com/photo-151097252790b-a48177348e37?q=80&w=400&auto=format&fit=crop",
  cappuccino: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=400&auto=format&fit=crop",
  macchiato: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=400&auto=format&fit=crop",
  mocktail: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=400&auto=format&fit=crop"
};

export const initialMenu = [
  // --- STARTERS ---
  {
    id: "truffle-soup",
    name: "Truffle Mushroom Soup",
    description: "Creamy wild mushroom soup infused with premium black truffle oil and fresh herbs.",
    price: 8.00,
    category: "starters",
    image: "soup",
    tags: ["Vegetarian", "Gluten-Free"],
    rating: 4.8,
    reviews: 124,
    calories: 240,
    prepTime: "10 mins",
    ingredients: ["Wild Mushrooms", "Black Truffle Oil", "Heavy Cream", "Garlic", "Thyme"],
    customizations: [
      {
        name: "Serving Temperature",
        type: "single",
        options: ["Warm", "Hot (Standard)", "Extra Hot"]
      },
      {
        name: "Add-ons",
        type: "multiple",
        options: [
          { name: "Extra Garlic Bread (+ $1.50)", price: 1.50 },
          { name: "Truffle Shavings (+ $3.00)", price: 3.00 }
        ]
      }
    ]
  },
  {
    id: "prawn-tempura",
    name: "Crispy Prawn Tempura",
    description: "Lightly battered jumbo prawns fried to golden crisp, served with house spicy mayo dipping sauce.",
    price: 12.00,
    category: "starters",
    image: "prawns",
    tags: ["Seafood", "Spicy"],
    rating: 4.9,
    reviews: 312,
    calories: 380,
    prepTime: "12 mins",
    ingredients: ["Jumbo Prawns", "Tempura Batter", "Spicy Mayo", "Scallions", "Lemon"],
    customizations: [
      {
        name: "Mayo Spice Level",
        type: "single",
        options: ["Mild Mayo", "Spicy Mayo (Standard)", "Sriracha Fire Mayo"]
      }
    ]
  },
  {
    id: "chicken-skewers",
    name: "Grilled Chicken Skewers",
    description: "Tender, juicy chicken skewers marinated in Mediterranean herbs, served with tzatziki dipping sauce.",
    price: 9.00,
    category: "starters",
    image: "skewers",
    tags: ["High-Protein"],
    rating: 4.7,
    reviews: 98,
    calories: 310,
    prepTime: "15 mins",
    ingredients: ["Chicken Breast", "Olive Oil", "Garlic", "Lemon Juice", "Greek Oregano", "Tzatziki"],
    customizations: [
      {
        name: "Marinade Style",
        type: "single",
        options: ["Herb Garlic", "Spicy BBQ", "Citrus Herb"]
      }
    ]
  },
  {
    id: "caesar-salad",
    name: "Classic Caesar Salad",
    description: "Crisp romaine lettuce tossed in creamy Caesar dressing, topped with shaved parmesan and garlic butter croutons.",
    price: 7.00,
    category: "starters",
    image: "caesar",
    tags: ["Vegetarian Available"],
    rating: 4.6,
    reviews: 145,
    calories: 290,
    prepTime: "8 mins",
    ingredients: ["Romaine Lettuce", "Caesar Dressing", "Parmesan Cheese", "Garlic Croutons", "Anchovies (optional)"],
    customizations: [
      {
        name: "Dietary Adjustment",
        type: "single",
        options: ["Standard (with anchovies)", "Vegetarian (no anchovies)"]
      },
      {
        name: "Add Protein",
        type: "single",
        options: ["No Extra Protein", "Add Grilled Chicken (+ $3.00)", "Add Grilled Prawns (+ $4.50)"]
      }
    ]
  },

  // --- SPECIALS ---
  {
    id: "chicken-tandoor",
    name: "Chicken Tandoor",
    description: "Bone-in chicken marinated in yogurt and aromatic spices, roasted in a clay tandoor oven, served with mint chutney.",
    price: 16.00,
    category: "specials",
    image: "tandoori",
    tags: ["Spicy", "Chef Recommendation", "High-Protein"],
    rating: 4.9,
    reviews: 540,
    calories: 520,
    prepTime: "20 mins",
    ingredients: ["Chicken Drumsticks", "Yogurt", "Tandoori Masala", "Ginger-Garlic Paste", "Mint Chutney"],
    customizations: [
      {
        name: "Spice Intensity",
        type: "single",
        options: ["Medium", "Hot (Standard)", "Extreme Hot (Indian Style)"]
      }
    ]
  },
  {
    id: "breakfast-boost",
    name: "Breakfast Boost Combo",
    description: "The ultimate morning combo. Warm, buttery, flaky French croissant served with a rich, frothy double Cappuccino.",
    price: 10.00,
    category: "specials",
    image: "breakfast",
    tags: ["Chef Recommendation", "Combo Offer"],
    rating: 4.8,
    reviews: 87,
    calories: 450,
    prepTime: "5 mins",
    ingredients: ["Butter Croissant", "Double Espresso", "Steamed Milk", "Cocoa Powder dusting"],
    customizations: [
      {
        name: "Croissant Style",
        type: "single",
        options: ["Plain Butter", "Toasted with Butter (+ $0.50)", "With Nutella (+ $1.00)", "With Cheddar Cheese (+ $1.20)"]
      },
      {
        name: "Coffee Milk Choice",
        type: "single",
        options: ["Whole Milk", "Oat Milk (+ $0.75)", "Almond Milk (+ $0.75)", "Skim Milk"]
      }
    ]
  },
  {
    id: "sweet-duo",
    name: "Sweet Duo Platter",
    description: "A decadent pairing of our signature espresso-soaked Tiramisu and light, airy Dark Chocolate Mousse.",
    price: 14.00,
    category: "specials",
    image: "sweetduo",
    tags: ["Dessert Combo", "Popular"],
    rating: 4.9,
    reviews: 216,
    calories: 620,
    prepTime: "5 mins",
    ingredients: ["Mascarpone Cheese", "Ladyfingers", "Espresso", "Dark Belgian Chocolate", "Whipped Cream"],
    customizations: [
      {
        name: "Size",
        type: "single",
        options: ["Standard Platter", "Sharing Platter for Two (+ $6.00)"]
      }
    ]
  },

  // --- MAINS ---
  {
    id: "ribeye-steak",
    name: "Prime Ribeye Steak",
    description: "10oz USDA Prime ribeye steak grilled to perfection, served with garlic mashed potatoes and red wine reduction.",
    price: 28.00,
    category: "mains",
    image: "steak",
    tags: ["High-Protein", "Gluten-Free Available"],
    rating: 4.9,
    reviews: 423,
    calories: 780,
    prepTime: "22 mins",
    ingredients: ["Prime Ribeye", "Garlic", "Rosemary", "Butter", "Red Wine Reduction", "Potatoes"],
    customizations: [
      {
        name: "Doneness",
        type: "single",
        options: ["Rare", "Medium Rare (Recommended)", "Medium", "Medium Well", "Well Done"]
      },
      {
        name: "Choice of Sauce",
        type: "single",
        options: ["Red Wine Demi-Glace", "Creamy Peppercorn", "Garlic Herb Butter"]
      }
    ]
  },
  {
    id: "salmon-fillet",
    name: "Pan-Seared Atlantic Salmon",
    description: "Crispy skin Atlantic salmon over a bed of lemon-dill quinoa and roasted asparagus, drizzled with honey glaze.",
    price: 22.00,
    category: "mains",
    image: "salmon",
    tags: ["Keto-Friendly", "Omega-3 Rich"],
    rating: 4.8,
    reviews: 195,
    calories: 540,
    prepTime: "18 mins",
    ingredients: ["Atlantic Salmon", "Quinoa", "Asparagus", "Lemon juice", "Dill", "Honey glaze"],
    customizations: [
      {
        name: "Preparation Type",
        type: "single",
        options: ["Pan-Seared (Standard)", "Baked (Oil-Free)", "Grilled"]
      }
    ]
  },

  // --- DESSERTS ---
  {
    id: "tiramisu",
    name: "Classic Italian Tiramisu",
    description: "Espresso-soaked ladyfingers layered with rich whipped mascarpone cheese cream and dusted with dark cocoa.",
    price: 8.50,
    category: "desserts",
    image: "tiramisu",
    tags: ["Vegetarian", "Contains Caffeine"],
    rating: 4.9,
    reviews: 388,
    calories: 410,
    prepTime: "5 mins",
    ingredients: ["Ladyfinger Biscuits", "Espresso Coffee", "Mascarpone Cheese", "Egg Yolks", "Cocoa Powder"],
    customizations: []
  },
  {
    id: "chocolate-mousse",
    name: "Belgian Chocolate Mousse",
    description: "Rich, smooth, and airy mousse crafted with 70% dark Belgian chocolate, topped with fresh raspberries and gold leaf.",
    price: 7.50,
    category: "desserts",
    image: "mousse",
    tags: ["Vegetarian", "Gluten-Free"],
    rating: 4.7,
    reviews: 154,
    calories: 320,
    prepTime: "5 mins",
    ingredients: ["Belgian Dark Chocolate", "Egg Whites", "Sugar", "Heavy Cream", "Fresh Raspberries"],
    customizations: [
      {
        name: "Whipped Cream",
        type: "single",
        options: ["Add Whipped Cream (Standard)", "No Whipped Cream"]
      }
    ]
  },

  // --- DRINKS ---
  {
    id: "espresso",
    name: "Single Espresso",
    description: "A concentrated, bold shot of premium roasted Arabica coffee beans, extraction at high pressure.",
    price: 2.50,
    category: "drinks",
    image: "espresso",
    tags: ["Vegan", "Gluten-Free"],
    rating: 4.5,
    reviews: 80,
    calories: 5,
    prepTime: "3 mins",
    ingredients: ["100% Arabica Coffee Beans", "Filtered Water"],
    customizations: [
      {
        name: "Shot Type",
        type: "single",
        options: ["Single Shot", "Double Shot (+ $1.00)", "Triple Shot (+ $1.75)"]
      }
    ]
  },
  {
    id: "cappuccino",
    name: "Frothy Cappuccino",
    description: "Equal parts espresso, steamed milk, and a thick layer of velvety milk foam, dusted with cocoa.",
    price: 3.50,
    category: "drinks",
    image: "cappuccino",
    tags: ["Vegetarian"],
    rating: 4.7,
    reviews: 245,
    calories: 120,
    prepTime: "4 mins",
    ingredients: ["Espresso", "Steamed Milk", "Milk Foam", "Cocoa Powder"],
    customizations: [
      {
        name: "Milk Choice",
        type: "single",
        options: ["Whole Milk (Standard)", "Oat Milk (+ $0.75)", "Almond Milk (+ $0.75)", "Soy Milk (+ $0.50)", "Skim Milk"]
      },
      {
        name: "Sweetness",
        type: "single",
        options: ["Unsweetened", "Medium Sweet", "Sweet"]
      }
    ]
  },
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    description: "Steamed milk stained with espresso, vanilla syrup, and drizzled with a decadent buttery caramel sauce.",
    price: 4.25,
    category: "drinks",
    image: "macchiato",
    tags: ["Vegetarian", "Sweet"],
    rating: 4.8,
    reviews: 310,
    calories: 210,
    prepTime: "4 mins",
    ingredients: ["Espresso", "Steamed Milk", "Vanilla Syrup", "Caramel Sauce Drizzle"],
    customizations: [
      {
        name: "Temperature",
        type: "single",
        options: ["Hot (Standard)", "Iced"]
      },
      {
        name: "Milk Choice",
        type: "single",
        options: ["Whole Milk (Standard)", "Oat Milk (+ $0.75)", "Almond Milk (+ $0.75)"]
      },
      {
        name: "Extra Drizzle",
        type: "single",
        options: ["Regular Caramel", "Extra Caramel Drizzle (+ $0.50)", "Double Caramel + Whipped Cream (+ $1.20)"]
      }
    ]
  },
  {
    id: "sunset-mocktail",
    name: "Sunset Paradise Mocktail",
    description: "A refreshing layered summer beverage with orange juice, pineapple juice, coconut water, and a splash of grenadine, garnished with fresh orange and cherry.",
    price: 6.00,
    category: "drinks",
    image: "mocktail",
    tags: ["Vegan", "Gluten-Free", "Refreshing"],
    rating: 4.9,
    reviews: 184,
    calories: 140,
    prepTime: "4 mins",
    ingredients: ["Orange Juice", "Pineapple Juice", "Coconut Water", "Grenadine Syrup", "Lime"],
    customizations: [
      {
        name: "Ice Preference",
        type: "single",
        options: ["Regular Ice", "Crushed Ice", "Less Ice", "No Ice"]
      }
    ]
  }
];

export const initialOffers = [
  {
    id: "romantic-offer",
    title: "Romantic Dining Offer",
    description: "Spend $60 or more and unlock a complimentary dessert and a craft mocktail!",
    threshold: 60,
    rewardText: "1 complimentary dessert + 1 mocktail",
    bgClass: "from-emerald-950 to-teal-900 text-emerald-100 border border-emerald-800",
    icon: "GlassWater"
  },
  {
    id: "early-bird",
    title: "Early Bird Special",
    description: "Get 10% off your entire order by placing it before 5:00 PM!",
    discountPercent: 10,
    rewardText: "10% off total bill",
    bgClass: "from-amber-950 to-orange-900 text-amber-100 border border-amber-800",
    icon: "Clock"
  }
];
