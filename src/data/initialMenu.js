export const initialCategories = [
  {
    id: "starters",
    name: "Starters",
    icon: "Utensils",
    translations: {
      en: "Starters",
      am: "መክሰስ እና መግቢያዎች",
      om: "Nyaata Jalqabaa"
    }
  },
  {
    id: "mains",
    name: "Main Courses",
    icon: "ChefHat",
    translations: {
      en: "Main Courses",
      am: "ዋና ምግቦች",
      om: "Nyaata Ijoo"
    }
  },
  {
    id: "coffee",
    name: "Ethiopian Coffee",
    icon: "Coffee",
    translations: {
      en: "Ethiopian Coffee",
      am: "የኢትዮጵያ ቡና",
      om: "Buna Itoophiyaa"
    }
  },
  {
    id: "bebidas",
    name: "Beverages",
    icon: "CupSoda",
    translations: {
      en: "Beverages",
      am: "መጠጦች",
      om: "Dhugaatii"
    }
  },
  {
    id: "postres",
    name: "Desserts & Pastries",
    icon: "Cake",
    translations: {
      en: "Desserts & Pastries",
      am: "ጣፋጭ ምግቦች",
      om: "Mi'aawaa fi Keekii"
    }
  },
];

export const dishImagesMap = {
  bruschetta: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=400&auto=format&fit=crop",
  caesar: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400&auto=format&fit=crop",
  alfredo: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=400&auto=format&fit=crop",
  jebena: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop",
  pourover: "https://images.unsplash.com/photo-151097252790b-a48177348e37?q=80&w=400&auto=format&fit=crop",
  espresso: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400&auto=format&fit=crop",
  macchiato: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=400&auto=format&fit=crop",
  soup: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?q=80&w=400&auto=format&fit=crop",
  prawns: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop",
  skewers: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop",
  steak: "https://images.unsplash.com/photo-1432139534698-cf43e8d21988?q=80&w=400&auto=format&fit=crop",
  salmon: "https://images.unsplash.com/photo-1485921325814-a532d8f49d7f?q=80&w=400&auto=format&fit=crop",
  tiramisu: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop",
  mousse: "https://images.unsplash.com/photo-1541795795328-f073b763494e?q=80&w=400&auto=format&fit=crop",
  mocktail: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=400&auto=format&fit=crop",
  croissant: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop"
};

export const initialMenu = [
  // --- STARTERS ---
  {
    id: "bruschetta-caprese",
    name: "Bruschetta Caprese",
    description: "Toasted artisan sourdough with sun-ripened cherry tomatoes, fresh mozzarella, sweet basil, and extra virgin olive oil.",
    price: 350.00,
    category: "starters",
    image: "bruschetta",
    tags: ["Vegetarian", "Fresh", "Favorite"],
    rating: 4.9,
    reviews: 218,
    calories: 220,
    prepTime: "8 mins",
    ingredients: ["Artisan Sourdough", "Cherry Tomatoes", "Fresh Mozzarella", "Sweet Basil", "Extra Virgin Olive Oil"],
    customizations: [
      {
        name: "Bread Choice",
        type: "single",
        options: ["Classic Sourdough", "Artisan Whole Wheat", "Gluten-Free Bread (+ 60 ETB)"],
        translations: {
          en: {
            name: "Bread Choice",
            options: ["Classic Sourdough", "Artisan Whole Wheat", "Gluten-Free Bread (+ 60 ETB)"]
          },
          am: {
            name: "የዳቦ ምርጫ",
            options: ["ክላሲክ እርሾ ዳቦ", "የሙሉ ስንዴ ዳቦ", "ግሉተን-አልባ ዳቦ (+ 60 ብር)"]
          },
          om: {
            name: "Filannoo Daabboo",
            options: ["Daabboo Kilaasikii", "Daabboo Qamadii Guutuu", "Daabboo Giluuteen-Albaa (+ 60 ETB)"]
          }
        }
      },
      {
        name: "Extra Toppings",
        type: "multiple",
        options: [
          { name: "Extra Mozzarella (+ 90 ETB)", price: 90.00, translations: { en: "Extra Mozzarella (+ 90 ETB)", am: "ተጨማሪ ሞዛሬላ አይብ (+ 90 ብር)", om: "Ayibii Mozaarellaa Dabalataa (+ 90 ETB)" } },
          { name: "Aged Modena Balsamic Glaze (+ 50 ETB)", price: 50.00, translations: { en: "Aged Modena Balsamic Glaze (+ 50 ETB)", am: "ሞዴና ባልሳሚክ ግሌዝ (+ 50 ብር)", om: "Soosii Baalsaamik Moodeenaa (+ 50 ETB)" } }
        ],
        translations: {
          en: { name: "Extra Toppings" },
          am: { name: "ተጨማሪ ማጣፈጫዎች" },
          om: { name: "Mi'eessituu Dabalataa" }
        }
      }
    ],
    translations: {
      en: {
        name: "Bruschetta Caprese",
        description: "Toasted artisan sourdough with sun-ripened cherry tomatoes, fresh mozzarella, sweet basil, and extra virgin olive oil.",
        tags: ["Vegetarian", "Fresh", "Favorite"],
        ingredients: ["Artisan Sourdough", "Cherry Tomatoes", "Fresh Mozzarella", "Sweet Basil", "Extra Virgin Olive Oil"]
      },
      am: {
        name: "ብሩሼታ ካፕሬዜ",
        description: "የተጠበሰ ባህላዊ ዳቦ ከትኩስ ቼሪ ቲማቲም፣ ሞዛሬላ አይብ፣ ጣፋጭ ባሲል ቅጠል እና የወይራ ዘይት ጋር።",
        tags: ["የአትክልት", "ትኩስ", "ተወዳጅ"],
        ingredients: ["ባህላዊ እርሾ ዳቦ", "ቼሪ ቲማቲም", "ትኩስ ሞዛሬላ", "ባሲል ቅጠል", "የወይራ ዘይት"]
      },
      om: {
        name: "Buruskeettaa Kaapreezee",
        description: "Daabboo aadaa goggoge timaatima cheeri haaraa, ayibii mozaarellaa, baazilii fi zayitii ejersaa qulqulluu waliin.",
        tags: ["Biqiltuu", "Haaraa", "Filatamaa"],
        ingredients: ["Daabboo Aadaa", "Timaatima Cheeri", "Ayibii Mozaarellaa", "Baazilii Haaraa", "Zayitii Ejersaa"]
      }
    }
  },
  {
    id: "ensalada-cesar",
    name: "Classic Caesar Salad",
    description: "Crisp romaine lettuce hearts, charbroiled chicken breast, herb croutons, shaved parmesan reggiano, and creamy house Caesar dressing.",
    price: 420.00,
    category: "starters",
    image: "caesar",
    tags: ["High Protein", "Menu Favorite"],
    rating: 4.8,
    reviews: 194,
    calories: 320,
    prepTime: "10 mins",
    ingredients: ["Romaine Lettuce", "Grilled Chicken Breast", "Parmesan Reggiano", "Herb Croutons", "House Caesar Dressing"],
    customizations: [
      {
        name: "Dressing Preference",
        type: "single",
        options: ["Classic Tossed", "Dressing on the Side", "Light Dressing"],
        translations: {
          en: {
            name: "Dressing Preference",
            options: ["Classic Tossed", "Dressing on the Side", "Light Dressing"]
          },
          am: {
            name: "የመረቅ ምርጫ",
            options: ["ከተደባለቀ መረቅ ጋር", "መረቅ ለብቻው", "ቀለል ያለ መረቅ"]
          },
          om: {
            name: "Filannoo Soosii",
            options: ["Soosii Waliin Makame", "Soosii Kophaatti", "Soosii Salphaa"]
          }
        }
      },
      {
        name: "Extra Protein",
        type: "multiple",
        options: [
          { name: "Double Grilled Chicken (+ 150 ETB)", price: 150.00, translations: { en: "Double Grilled Chicken (+ 150 ETB)", am: "ድርብ የተጠበሰ የዶሮ ስጋ (+ 150 ብር)", om: "Foon Lukkuu Waddame Dachaa (+ 150 ETB)" } },
          { name: "Crispy Bacon Crumbles (+ 90 ETB)", price: 90.00, translations: { en: "Crispy Bacon Crumbles (+ 90 ETB)", am: "ክሪስፒ ቤከን ቁራጮች (+ 90 ብር)", om: "Beekonii Caccabee (+ 90 ETB)" } }
        ],
        translations: {
          en: { name: "Extra Protein" },
          am: { name: "ተጨማሪ ፕሮቲን" },
          om: { name: "Pirootiinii Dabalataa" }
        }
      }
    ],
    translations: {
      en: {
        name: "Classic Caesar Salad",
        description: "Crisp romaine lettuce hearts, charbroiled chicken breast, herb croutons, shaved parmesan reggiano, and creamy house Caesar dressing.",
        tags: ["High Protein", "Menu Favorite"],
        ingredients: ["Romaine Lettuce", "Grilled Chicken Breast", "Parmesan Reggiano", "Herb Croutons", "House Caesar Dressing"]
      },
      am: {
        name: "ክላሲክ ሲዛር ሰላጣ",
        description: "ትኩስ የሮሜን ሰላጣ ቅጠል፣ የተጠበሰ የዶሮ ስጋ፣ የዳቦ ቁራጮች፣ ፓርሜሳን አይብ እና የሲዛር መረቅ።",
        tags: ["ከፍተኛ ፕሮቲን", "የሜኑ ተወዳጅ"],
        ingredients: ["የሮሜን ሰላጣ", "የተጠበሰ የዶሮ ስጋ", "ፓርሜሳን አይብ", "የዳቦ ቁራጮች", "የሲዛር መረቅ"]
      },
      om: {
        name: "Salaaxaa Seezaar Kilaasikii",
        description: "Salaaxaa roomeen qabbanaawaa, foon lukkuu waddame, kurootoonii, ayibii paarmezaanii fi soosii seezaar.",
        tags: ["Pirootiinii Olaanaa", "Filatamaa Meenuu"],
        ingredients: ["Salaaxaa Roomeen", "Foon Lukkuu Waddame", "Ayibii Paarmezaanii", "Kurootoonii", "Soosii Seezaar"]
      }
    }
  },
  {
    id: "truffle-soup",
    name: "Truffle & Wild Mushroom Soup",
    description: "Silky woodland mushroom velouté drizzled with aromatic Italian black truffle oil and fresh thyme leaves.",
    price: 380.00,
    category: "starters",
    image: "soup",
    tags: ["Vegetarian", "Gourmet"],
    rating: 4.9,
    reviews: 142,
    calories: 240,
    prepTime: "10 mins",
    ingredients: ["Wild Forest Mushrooms", "Black Truffle Oil", "Light Cream", "Garlic", "Fresh Thyme"],
    customizations: [
      {
        name: "Serving Temperature",
        type: "single",
        options: ["Piping Hot", "Warm & Moderate"],
        translations: {
          en: {
            name: "Serving Temperature",
            options: ["Piping Hot", "Warm & Moderate"]
          },
          am: {
            name: "የሙቀት መጠን",
            options: ["በጣም ትኩስ", "መጠነኛ ሙቀት"]
          },
          om: {
            name: "Ho'ina Dhihaatu",
            options: ["Baay'ee Ho'aa", "Ho'aa Giddu-galeessaa"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Truffle & Wild Mushroom Soup",
        description: "Silky woodland mushroom velouté drizzled with aromatic Italian black truffle oil and fresh thyme leaves.",
        tags: ["Vegetarian", "Gourmet"],
        ingredients: ["Wild Forest Mushrooms", "Black Truffle Oil", "Light Cream", "Garlic", "Fresh Thyme"]
      },
      am: {
        name: "የትረፍል እና የበረሃ እንጉዳይ ሾርባ",
        description: "ለስላሳ የበረሃ እንጉዳይ ሾርባ በጥቁር ትረፍል ዘይት፣ ትኩስ ጠጅ ሳር እና ነጭ ሽንኩርት ክሬም የተዘጋጀ።",
        tags: ["የአትክልት", "ልዩ ጣዕም"],
        ingredients: ["የበረሃ እንጉዳይ", "ጥቁር ትረፍል ዘይት", "ቀለል ያለ ክሬም", "ነጭ ሽንኩርት", "ትኩስ ጠጅ ሳር"]
      },
      om: {
        name: "Supii Hiddii Tiraafilii fi Boombii",
        description: "Supii boombii bosonaa lallaafaa zayitii tiraafilii gurraacha, qoricha fi qullubbii adii waliin.",
        tags: ["Biqiltuu", "Filatamaa Addaa"],
        ingredients: ["Boombii Bosonaa", "Zayitii Tiraafilii Gurraacha", "Kiriimii", "Qullubbii Adii", "Qoricha"]
      }
    }
  },
  {
    id: "prawn-tempura",
    name: "Crispy Jumbo Prawn Tempura",
    description: "Golden Japanese-style tempura battered jumbo tiger prawns served with sriracha spicy mayo and fresh lime wedges.",
    price: 580.00,
    category: "starters",
    image: "prawns",
    tags: ["Seafood", "Crispy"],
    rating: 4.9,
    reviews: 165,
    calories: 350,
    prepTime: "12 mins",
    ingredients: ["Jumbo Tiger Prawns", "Crispy Tempura Batter", "Spicy Sriracha Mayo", "Spring Onions", "Fresh Lime"],
    customizations: [
      {
        name: "Sauce Option",
        type: "single",
        options: ["Spicy Mayo (Signature)", "Mild Garlic Mayo", "Sweet Chili Dip"],
        translations: {
          en: {
            name: "Sauce Option",
            options: ["Spicy Mayo (Signature)", "Mild Garlic Mayo", "Sweet Chili Dip"]
          },
          am: {
            name: "የመረቅ ምርጫ",
            options: ["ቅመም ማዮኔዝ (ልዩ)", "ነጭ ሽንኩርት ማዮኔዝ", "ጣፋጭ ቺሊ መረቅ"]
          },
          om: {
            name: "Filannoo Soosii",
            options: ["Maayoo Qaraawaa (Filatamaa)", "Maayoo Qullubbii Adii", "Soosii Mi'aawaa Qaraawaa"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Crispy Jumbo Prawn Tempura",
        description: "Golden Japanese-style tempura battered jumbo tiger prawns served with sriracha spicy mayo and fresh lime wedges.",
        tags: ["Seafood", "Crispy"],
        ingredients: ["Jumbo Tiger Prawns", "Crispy Tempura Batter", "Spicy Sriracha Mayo", "Spring Onions", "Fresh Lime"]
      },
      am: {
        name: "ክሪስፒ ጃምቦ ፕራውን ቴምፑራ",
        description: "በወርቃማ ቴምፑራ የተጠበሱ ትላልቅ ፕራውን ሽሪምፖች ከስሪራቻ ቅመም ማዮኔዝ እና ሎሚ ጋር።",
        tags: ["የባህር ምግብ", "ክሪስፒ"],
        ingredients: ["ትላልቅ ፕራውንስ", "ቴምፑራ ዱቄት", "ቅመም ማዮኔዝ", "የሽንኩርት ቅጠል", "ትኩስ ሎሚ"]
      },
      om: {
        name: "Qurxummii Tampuuraa Jaamboo Ciminnaa",
        description: "Piraawunii gurguddaa bifa warqeetiin waddame soosii maayoo qaraawaa fi lomiin dhihaatu.",
        tags: ["Nyaata Galaanaa", "Ciminnaa"],
        ingredients: ["Piraawunii Jaamboo", "Makuu Tampuuraa", "Maayoo Qaraawaa", "Qullubbii Baala", "Lomii Haaraa"]
      }
    }
  },

  // --- MAIN COURSES ---
  {
    id: "pasta-alfredo",
    name: "Creamy Fettuccine Alfredo",
    description: "Al dente fettuccine pasta tossed in luscious Italian parmesan cream sauce, French butter, and cracked tellicherry black pepper.",
    price: 520.00,
    category: "mains",
    image: "alfredo",
    tags: ["Italian Classic", "Vegetarian"],
    rating: 4.8,
    reviews: 320,
    calories: 580,
    prepTime: "15 mins",
    ingredients: ["Artisan Fettuccine", "House Alfredo Cream Sauce", "Parmigiano-Reggiano", "Creamery Butter", "Garlic"],
    customizations: [
      {
        name: "Add Protein",
        type: "single",
        options: ["No Extra Protein", "With Herb Grilled Chicken (+ 150 ETB)", "With Sautéed Garlic Prawns (+ 220 ETB)"],
        translations: {
          en: {
            name: "Add Protein",
            options: ["No Extra Protein", "With Herb Grilled Chicken (+ 150 ETB)", "With Sautéed Garlic Prawns (+ 220 ETB)"]
          },
          am: {
            name: "ፕሮቲን ያክሉ",
            options: ["ተጨማሪ ፕሮቲን የለም", "ከተጠበሰ የዶሮ ስጋ ጋር (+ 150 ብር)", "ከነጭ ሽንኩርት ፕራውን ሽሪምፕ ጋር (+ 220 ብር)"]
          },
          om: {
            name: "Pirootiinii Dabali",
            options: ["Pirootiinii Dabalataa Malee", "Foon Lukkuu Waddame Waliin (+ 150 ETB)", "Piraawunii Qullubbii Waliin (+ 220 ETB)"]
          }
        }
      },
      {
        name: "Cheese Add-ons",
        type: "multiple",
        options: [
          { name: "Extra Melted Parmigiano (+ 90 ETB)", price: 90.00, translations: { en: "Extra Melted Parmigiano (+ 90 ETB)", am: "ተጨማሪ የቀለጠ ፓርሜሳን አይብ (+ 90 ብር)", om: "Ayibii Paarmezaanii Dabalataa (+ 90 ETB)" } }
        ],
        translations: {
          en: { name: "Cheese Add-ons" },
          am: { name: "ተጨማሪ አይብ" },
          om: { name: "Ayibii Dabalataa" }
        }
      }
    ],
    translations: {
      en: {
        name: "Creamy Fettuccine Alfredo",
        description: "Al dente fettuccine pasta tossed in luscious Italian parmesan cream sauce, French butter, and cracked tellicherry black pepper.",
        tags: ["Italian Classic", "Vegetarian"],
        ingredients: ["Artisan Fettuccine", "House Alfredo Cream Sauce", "Parmigiano-Reggiano", "Creamery Butter", "Garlic"]
      },
      am: {
        name: "ክሬሚ ፌቱቺኒ አልፍሬዶ",
        description: "ለስላሳ ፌቱቺኒ ፓስታ በፓርሜሳን አይብ፣ በፈረንሳይ ቅቤ እና በጥቁር በርበሬ ክሬም መረቅ በጥንቃቄ የተዘጋጀ።",
        tags: ["የጣሊያን ባህላዊ", "የአትክልት"],
        ingredients: ["ፌቱቺኒ ፓስታ", "የአልፍሬዶ ክሬም መረቅ", "ፓርሜሳን አይብ", "የላም ቅቤ", "ነጭ ሽንኩርት"]
      },
      om: {
        name: "Paastaa Feetuccinii Alfireedoo",
        description: "Paastaa feetuuchiinii ayibii paarmezaanii fi kirimii lallaafaa dhadhaa waliin qophaa'e.",
        tags: ["Aadaa Xaaliyaanii", "Biqiltuu"],
        ingredients: ["Paastaa Feetuccinii", "Soosii Kiriimii Alfireedoo", "Ayibii Paarmezaanii", "Dhadhaa", "Qullubbii Adii"]
      }
    }
  },
  {
    id: "chicken-skewers",
    name: "Charcoal Grilled Chicken Souvlaki",
    description: "Tender chicken breast skewers marinated in Mediterranean oregano, garlic, and citrus, served with golden roasted potatoes and tzatziki.",
    price: 480.00,
    category: "mains",
    image: "skewers",
    tags: ["Flame-Grilled", "High Protein"],
    rating: 4.7,
    reviews: 118,
    calories: 460,
    prepTime: "18 mins",
    ingredients: ["Tender Chicken Breast", "Mediterranean Herbs", "Crisp Roasted Potatoes", "Greek Tzatziki Sauce"],
    customizations: [
      {
        name: "Choice of Side",
        type: "single",
        options: ["Herb Roasted Potatoes", "Fresh Garden Salad", "Aromatic Jasmine Rice"],
        translations: {
          en: {
            name: "Choice of Side",
            options: ["Herb Roasted Potatoes", "Fresh Garden Salad", "Aromatic Jasmine Rice"]
          },
          am: {
            name: "የተጓዳኝ ምግብ ምርጫ",
            options: ["የተጠበሰ የድንች ጥብስ", "ትኩስ አረንጓዴ ሰላጣ", "መዓዛ ያለው የጃስሚን ሩዝ"]
          },
          om: {
            name: "Filannoo Cinaachaa",
            options: ["Dinnicha Waddame", "Salaaxaa Haaraa", "Ruuzii Jaasmiinii"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Charcoal Grilled Chicken Souvlaki",
        description: "Tender chicken breast skewers marinated in Mediterranean oregano, garlic, and citrus, served with golden roasted potatoes and tzatziki.",
        tags: ["Flame-Grilled", "High Protein"],
        ingredients: ["Tender Chicken Breast", "Mediterranean Herbs", "Crisp Roasted Potatoes", "Greek Tzatziki Sauce"]
      },
      am: {
        name: "በከሰል የተጠበሰ የዶሮ ሺሽ ሱቭላኪ",
        description: "በቅመማ ቅመም የተቀመመ የዶሮ ስጋ ከወርቃማ ድንች ጥብስ እና ከነጭ ፃፃኪ መረቅ ጋር።",
        tags: ["በእሳት የተጠበሰ", "ከፍተኛ ፕሮቲን"],
        ingredients: ["የዶሮ ስጋ", "የሜዲትራኒያን ቅመሞች", "የተጠበሰ ድንች", "የግሪክ ፃፃኪ መረቅ"]
      },
      om: {
        name: "Shikabaabi Lukkuu Waddame Suuvlaakii",
        description: "Foon lukkuu qorichaan laaffifamee waddame, dinnicha fi soosii zaatziikii waliin.",
        tags: ["Abiddarra Waddame", "Pirootiinii Olaanaa"],
        ingredients: ["Foon Lukkuu Lallaafaa", "Qoricha Aadaa", "Dinnicha Waddame", "Soosii Zaatziikii Giriikii"]
      }
    }
  },
  {
    id: "ribeye-steak",
    name: "Prime Charbroiled Ribeye Steak",
    description: "USDA Prime 300g ribeye steak flame-seared to your liking, finished with roasted garlic rosemary butter and sea salt crystals.",
    price: 980.00,
    category: "mains",
    image: "steak",
    tags: ["Prime Cut", "Chef Special"],
    rating: 4.9,
    reviews: 205,
    calories: 680,
    prepTime: "20 mins",
    ingredients: ["Prime Ribeye Beef (300g)", "Rosemary Garlic Butter", "Roasted Baby Potatoes", "Flaky Sea Salt"],
    customizations: [
      {
        name: "Meat Doneness",
        type: "single",
        options: ["Medium Rare (Recommended)", "Medium", "Medium Well", "Well Done"],
        translations: {
          en: {
            name: "Meat Doneness",
            options: ["Medium Rare (Recommended)", "Medium", "Medium Well", "Well Done"]
          },
          am: {
            name: "የስጋው የበሰለበት ደረጃ",
            options: ["መካከለኛ ቅልውጥ (ይመከራል)", "መካከለኛ የበሰለ", "በደንብ የበሰለ", "ሙሉ በሙሉ የበሰለ"]
          },
          om: {
            name: "Haala Bilchina Foonii",
            options: ["Giddu-galeessa Dhiiga Qabu (Filatamaa)", "Giddu-galeessa", "Sirriitti Bilchaate", "Baay'ee Bilchaate"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Prime Charbroiled Ribeye Steak",
        description: "USDA Prime 300g ribeye steak flame-seared to your liking, finished with roasted garlic rosemary butter and sea salt crystals.",
        tags: ["Prime Cut", "Chef Special"],
        ingredients: ["Prime Ribeye Beef (300g)", "Rosemary Garlic Butter", "Roasted Baby Potatoes", "Flaky Sea Salt"]
      },
      am: {
        name: "ፕራይም ሪብአይ የበሬ ስጋ ስቴክ",
        description: "ምርጥ 300 ግራም የበሬ ስቴክ በሮዝመሪና ነጭ ሽንኩርት ቅቤ ተጠብሶ ከተጠበሰ ድንች ጋር የቀረበ።",
        tags: ["ምርጥ ስጋ", "የሼፍ ምርጥ"],
        ingredients: ["ፕራይም ሪብአይ የበሬ ስጋ", "የሮዝመሪ ነጭ ሽንኩርት ቅቤ", "የተጠበሰ ድንች", "የባህር ጨው"]
      },
      om: {
        name: "Isteekii Foon Sa'aa Ribaayii Piraayim",
        description: "Foon sa'aa filatamaa waddame, dhadhaa roozmeerii fi qullubbii adii waliin.",
        tags: ["Foon Filatamaa", "Adda Sheefii"],
        ingredients: ["Foon Sa'aa Ribaayii", "Dhadhaa Roozmeerii", "Dinnicha Waddame", "Soogidda Galaanaa"]
      }
    }
  },
  {
    id: "grilled-salmon",
    name: "Pan-Seared Norwegian Salmon",
    description: "Sustainably farmed Atlantic salmon filet with crispy skin, paired with velvety lemon dill cream and butter-glazed green asparagus.",
    price: 920.00,
    category: "mains",
    image: "salmon",
    tags: ["Fresh Catch", "Omega 3"],
    rating: 4.9,
    reviews: 172,
    calories: 520,
    prepTime: "16 mins",
    ingredients: ["Atlantic Salmon Filet", "Creamy Lemon Dill Sauce", "Tender Green Asparagus", "Preserved Lemon"],
    customizations: [
      {
        name: "Cook Style",
        type: "single",
        options: ["Juicy & Flaky (Chef Recommendation)", "Well Done Crispy"],
        translations: {
          en: {
            name: "Cook Style",
            options: ["Juicy & Flaky (Chef Recommendation)", "Well Done Crispy"]
          },
          am: {
            name: "የአዘገጃጀት ሁኔታ",
            options: ["ለስላሳና ጭማቂ (የሼፍ ምርጫ)", "በደንብ የተጠበሰ"]
          },
          om: {
            name: "Akkaataa Qophii",
            options: ["Lallaafaa (Gorsa Sheefii)", "Sirriitti Waddame"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Pan-Seared Norwegian Salmon",
        description: "Sustainably farmed Atlantic salmon filet with crispy skin, paired with velvety lemon dill cream and butter-glazed green asparagus.",
        tags: ["Fresh Catch", "Omega 3"],
        ingredients: ["Atlantic Salmon Filet", "Creamy Lemon Dill Sauce", "Tender Green Asparagus", "Preserved Lemon"]
      },
      am: {
        name: "የኖርዌይ ሳልሞን ዓሣ ጥብስ",
        description: "የሳልሞን ዓሣ ከክሬም ሎሚ ዲል መረቅ እና ትኩስ አስፓራገስ ጋር በጣፋጭ ሁኔታ ተጠብሶ የቀረበ።",
        tags: ["ትኩስ ዓሣ", "ኦሜጋ 3"],
        ingredients: ["ሳልሞን ዓሣ", "ክሬም የሎሚ ዲል መረቅ", "አስፓራገስ", "የተዘጋጀ ሎሚ"]
      },
      om: {
        name: "Qurxummii Saalman Noorweey Waddame",
        description: "Qurxummii saalman haaraa soosii liimii fi diilii, aspaaraagasii dhadhaan waddame waliin.",
        tags: ["Qurxummii Haaraa", "Omeegaa 3"],
        ingredients: ["Foon Qurxummii Saalman", "Soosii Diilii fi Liimii", "Aspaaraagasii Magariisa", "Lomii"]
      }
    }
  },

  // --- ETHIOPIAN SPECIALTY COFFEE ---
  {
    id: "jebena-buna",
    name: "Traditional Jebena Buna Ceremony",
    description: "Ancestral Ethiopian coffee ceremony brewed slowly in an authentic clay Jebena pot, creating a full-bodied cup with wild floral jasmine aroma.",
    price: 120.00,
    category: "coffee",
    image: "jebena",
    tags: ["Abu Coffee Signature", "Ethiopian Heritage"],
    rating: 5.0,
    reviews: 412,
    calories: 15,
    prepTime: "6 mins",
    ingredients: ["100% Single-Estate Ethiopian Arabica", "Pure Mountain Spring Water", "Traditional Incense Aroma"],
    customizations: [
      {
        name: "Serving Style",
        type: "single",
        options: ["Classic Black (Buna Qala)", "Infused with Cardamom (Hel)", "Highland Wildflower Honey (+ 40 ETB)"],
        translations: {
          en: {
            name: "Serving Style",
            options: ["Classic Black (Buna Qala)", "Infused with Cardamom (Hel)", "Highland Wildflower Honey (+ 40 ETB)"]
          },
          am: {
            name: "የአቀራረብ ዘይቤ",
            options: ["ጥቁር ባህላዊ (ቡና ቀላ)", "ከኮረሪማ/ሄል ጋር", "ከተፈጥሮ የጫካ ማር ጋር (+ 40 ብር)"]
          },
          om: {
            name: "Akkaataa Dhihaatu",
            options: ["Gurraacha Aadaa (Buna Qala)", "Qoricha Qoromfoolii Waliin", "Damma Bosonaa Waliin (+ 40 ETB)"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Traditional Jebena Buna Ceremony",
        description: "Ancestral Ethiopian coffee ceremony brewed slowly in an authentic clay Jebena pot, creating a full-bodied cup with wild floral jasmine aroma.",
        tags: ["Abu Coffee Signature", "Ethiopian Heritage"],
        ingredients: ["100% Single-Estate Ethiopian Arabica", "Pure Mountain Spring Water", "Traditional Incense Aroma"]
      },
      am: {
        name: "ባህላዊ የጀበና ቡና ስነ-ስርዓት",
        description: "በሸክላ ጀበና በእርጋታ የተፈላ ትክክለኛ የኢትዮጵያ ባህላዊ ቡና፣ ልዩ መዓዛና የበለጸገ የተፈጥሮ ጣዕም ያለው።",
        tags: ["የአቡ ቡና መለያ", "የኢትዮጵያ ቅርስ"],
        ingredients: ["100% የኢትዮጵያ አረቢካ ቡና", "ንጹህ የተጣራ ውሃ", "ባህላዊ የዕጣን መዓዛ"]
      },
      om: {
        name: "Sirna Buna Jabanaa Aadaa",
        description: "Buna aadaa Itoophiyaa jabanaadhaan suuta danfe, foolii mi'aawaa fi dhandhama addaa qabu.",
        tags: ["Asxaa Abu Coffee", "Dhaala Itoophiyaa"],
        ingredients: ["Buna Arabiikaa Itoophiyaa 100%", "Bishaan Burqaa Qulqulluu", "Foolii Ixaanaa Aadaa"]
      }
    }
  },
  {
    id: "yirgacheffe-v60",
    name: "Yirgacheffe V60 Single Origin",
    description: "Precision hand-poured artisan filter coffee exhibiting bright bergamot notes, jasmine blossom florals, and a vibrant Meyer lemon finish.",
    price: 190.00,
    category: "coffee",
    image: "pourover",
    tags: ["Specialty Coffee", "Single Origin"],
    rating: 4.9,
    reviews: 289,
    calories: 10,
    prepTime: "5 mins",
    ingredients: ["Grade 1 Yirgacheffe Washed Beans", "Hand Pour V60 Extraction"],
    customizations: [
      {
        name: "Brew Temperature",
        type: "single",
        options: ["Hot Artisan Pour-Over", "On the Rocks (Japanese Flash Chilled)"],
        translations: {
          en: {
            name: "Brew Temperature",
            options: ["Hot Artisan Pour-Over", "On the Rocks (Japanese Flash Chilled)"]
          },
          am: {
            name: "የሙቀት ምርጫ",
            options: ["ትኩስ የተጣራ ቡና", "ከበረዶ ጋር (ቀዝቃዛ አይስ ድሪፕ)"]
          },
          om: {
            name: "Ho'ina Bunaa",
            options: ["Ho'aa V60", "Cabbiidhaan Qabbanaaye (Aayis Diriip)"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Yirgacheffe V60 Single Origin",
        description: "Precision hand-poured artisan filter coffee exhibiting bright bergamot notes, jasmine blossom florals, and a vibrant Meyer lemon finish.",
        tags: ["Specialty Coffee", "Single Origin"],
        ingredients: ["Grade 1 Yirgacheffe Washed Beans", "Hand Pour V60 Extraction"]
      },
      am: {
        name: "ይርጋጨፌ ቪ60 ነጠላ መነሻ ቡና",
        description: "በቪ60 የተጣራ አንደኛ ደረጃ የይርጋጨፌ ቡና የጃስሚን አበባ መዓዛና የሲትረስ ጣዕም ያለው።",
        tags: ["ስፔሻሊቲ ቡና", "ነጠላ መነሻ"],
        ingredients: ["ደረጃ 1 የታጠበ የይርጋጨፌ ቡና", "በእጅ የተጣራ ቪ60"]
      },
      om: {
        name: "Buna Yirgaacaffee V60 Qulqulluu",
        description: "Buna dhangala'aa Yirgaacaffee foolii daraaraa fi mi'eessituu liimii qabu.",
        tags: ["Buna Addaa", "Madda Tokko"],
        ingredients: ["Buna Yirgaacaffee Sadarkaa 1ffaa", "Dhangala'aa V60 Harkaa"]
      }
    }
  },
  {
    id: "sidamo-espresso",
    name: "Sidamo Double Espresso Shot",
    description: "Rich and dense espresso extraction crafted from natural Sidamo beans, showcasing dark chocolate undertones and thick hazelnut crema.",
    price: 140.00,
    category: "coffee",
    image: "espresso",
    tags: ["Bold & Intense", "Double Shot"],
    rating: 4.8,
    reviews: 310,
    calories: 5,
    prepTime: "3 mins",
    ingredients: ["Abu Sidamo Signature Roast Blend", "9-Bar Precision Extraction"],
    customizations: [
      {
        name: "Extraction Style",
        type: "single",
        options: ["Classic Double Shot (Doppio)", "Single Shot (Solo)", "Ristretto (Short & Intense)"],
        translations: {
          en: {
            name: "Extraction Style",
            options: ["Classic Double Shot (Doppio)", "Single Shot (Solo)", "Ristretto (Short & Intense)"]
          },
          am: {
            name: "የኤክስትራክሽን ዓይነት",
            options: ["ክላሲክ ድርብ ሾት", "ነጠላ ሾት", "ሪስትሬቶ (የተከማቸ ወፍራም)"]
          },
          om: {
            name: "Gosa Iskipeeressoo",
            options: ["Dachaa Kilaasikii (Dopiyoo)", "Tokkicha (Sooloo)", "Ristireettoo (Cimaa)"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Sidamo Double Espresso Shot",
        description: "Rich and dense espresso extraction crafted from natural Sidamo beans, showcasing dark chocolate undertones and thick hazelnut crema.",
        tags: ["Bold & Intense", "Double Shot"],
        ingredients: ["Abu Sidamo Signature Roast Blend", "9-Bar Precision Extraction"]
      },
      am: {
        name: "ሲዳሞ ድርብ ኤስፕሬሶ",
        description: "ከምርጥ የሲዳሞ ቡና ፍሬዎች የተዘጋጀ ወፍራም እና ጠንካራ ድርብ ኤስፕሬሶ ከጥቁር ቸኮሌት ጣዕም ጋር።",
        tags: ["ጠንካራ ጣዕም", "ድርብ ሾት"],
        ingredients: ["የሲዳሞ አቡ ቡና ቅይጥ", "9 ባር የኤስፕሬሶ ማሽን"]
      },
      om: {
        name: "Buna Sidaamoo Iskipeeressoo Dachaa",
        description: "Buna Sidaamoo cimaa fi mi'aawaa dachaadhaan qophaa'e, bifa chookoleetii fi kirimii gaarii waliin.",
        tags: ["Cimaa & Mi'aawaa", "Rasaasa Dachaa"],
        ingredients: ["Buna Sidaamoo Abu Coffee", "Iskipeeressoo Baarii 9"]
      }
    }
  },
  {
    id: "honey-macchiato",
    name: "Cinnamon Highland Honey Macchiato",
    description: "Double Sidamo espresso crowned with micro-foamed velvety milk, organic Ethiopian wild honey, and ground Ceylon cinnamon bark.",
    price: 180.00,
    category: "coffee",
    image: "macchiato",
    tags: ["Sweet & Spiced", "Customer Favorite"],
    rating: 4.9,
    reviews: 245,
    calories: 140,
    prepTime: "4 mins",
    ingredients: ["Sidamo Espresso Shot", "Microfoam Steamed Milk", "Organic Forest Honey", "Grated Cinnamon"],
    customizations: [
      {
        name: "Milk Choice",
        type: "single",
        options: ["Creamy Whole Milk", "Oat Milk (+ 50 ETB)", "Almond Milk (+ 50 ETB)", "Lactose-Free Milk"],
        translations: {
          en: {
            name: "Milk Choice",
            options: ["Creamy Whole Milk", "Oat Milk (+ 50 ETB)", "Almond Milk (+ 50 ETB)", "Lactose-Free Milk"]
          },
          am: {
            name: "የወተት ምርጫ",
            options: ["ሙሉ ወተት", "የአጃ ወተት (+ 50 ብር)", "የለውዝ ወተት (+ 50 ብር)", "ላክቶስ-አልባ ወተት"]
          },
          om: {
            name: "Filannoo Aannanii",
            options: ["Aannan Guutuu", "Aannan Ootii (+ 50 ETB)", "Aannan Baadamii (+ 50 ETB)", "Aannan Laaktoos-Albaa"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Cinnamon Highland Honey Macchiato",
        description: "Double Sidamo espresso crowned with micro-foamed velvety milk, organic Ethiopian wild honey, and ground Ceylon cinnamon bark.",
        tags: ["Sweet & Spiced", "Customer Favorite"],
        ingredients: ["Sidamo Espresso Shot", "Microfoam Steamed Milk", "Organic Forest Honey", "Grated Cinnamon"]
      },
      am: {
        name: "የቀረፋ እና የተፈጥሮ ማር ማኪያቶ",
        description: "ድርብ የሲዳሞ ኤስፕሬሶ ከተፈተገ ወተት፣ ንጹህ የተፈጥሮ የጫካ ማር እና ከተፈጨ ቀረፋ ጋር።",
        tags: ["ጣፋጭ እና ቅመም", "የደንበኞች ተወዳጅ"],
        ingredients: ["የሲዳሞ ኤስፕሬሶ", "የተፈተገ ወተት", "ንጹህ የተፈጥሮ ማር", "የተፈጨ ቀረፋ"]
      },
      om: {
        name: "Maakiyaattoo Dammaa fi Qarafaa",
        description: "Buna maakiyaattoo aannan lallaafaa, damma qulqulluu bosonaa fi qarafaa waliin qophaa'e.",
        tags: ["Mi'aawaa & Qoricha", "Filatamaa Maamiltootaa"],
        ingredients: ["Iskipeeressoo Sidaamoo", "Aannan Lallaafaa", "Damma Bosonaa Qulqulluu", "Qarafaa"]
      }
    }
  },

  // --- BEVERAGES ---
  {
    id: "passion-fruit-mocktail",
    name: "Sparkling Passion Fruit Mint Cooler",
    description: "Effervescent handcrafted cooler prepared with fresh passion fruit pulp, crushed garden mint, zesty lime juice, and sparkling mineral water.",
    price: 210.00,
    category: "bebidas",
    image: "mocktail",
    tags: ["Alcohol-Free", "Refreshing"],
    rating: 4.8,
    reviews: 95,
    calories: 110,
    prepTime: "4 mins",
    ingredients: ["Fresh Passion Fruit Pulp", "Garden Mint Leaves", "Fresh Lime", "Sparkling Soda", "Crushed Ice"],
    customizations: [
      {
        name: "Sweetness Level",
        type: "single",
        options: ["Balanced (Standard)", "Less Sweet (Light)", "No Added Sugar"],
        translations: {
          en: {
            name: "Sweetness Level",
            options: ["Balanced (Standard)", "Less Sweet (Light)", "No Added Sugar"]
          },
          am: {
            name: "የጣፋጭነት መጠን",
            options: ["መጠነኛ (መደበኛ)", "ቀለል ያለ ጣፋጭ", "ያለ ስኳር"]
          },
          om: {
            name: "Hanga Mi'aawaa",
            options: ["Giddu-galeessa (Idilee)", "Mi'aawaa Xiqqaa", "Sukkaara Malee"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Sparkling Passion Fruit Mint Cooler",
        description: "Effervescent handcrafted cooler prepared with fresh passion fruit pulp, crushed garden mint, zesty lime juice, and sparkling mineral water.",
        tags: ["Alcohol-Free", "Refreshing"],
        ingredients: ["Fresh Passion Fruit Pulp", "Garden Mint Leaves", "Fresh Lime", "Sparkling Soda", "Crushed Ice"]
      },
      am: {
        name: "የፓሽን ፍሩት እና ናና ስፓርክሊንግ መጠጥ",
        description: "ተፈጥሯዊ የፓሽን ፍሩት፣ ትኩስ የናና ቅጠል፣ ሎሚ እና የበረዶ ክምችት ያለው መንፈስን የሚያድስ መጠጥ።",
        tags: ["አልኮል-አልባ", "መንፈስ የሚያድስ"],
        ingredients: ["ትኩስ ፓሽን ፍሩት", "የናና ቅጠል", "ሎሚ", "ሶዳ ውሃ", "የተፈጨ በረዶ"]
      },
      om: {
        name: "Dhugaatii Paashinii fi Naanaa",
        description: "Dhugaatii bishaan qabbanaa'aa mijuu paashinii, baala naanaa haaraa fi liimii waliin.",
        tags: ["Alkoolii Malee", "Haareffamaa"],
        ingredients: ["Firii Paashinii", "Baala Naanaa", "Lomii", "Sooqaa Bishaan", "Cabbi Caccabaa"]
      }
    }
  },

  // --- DESSERTS & PASTRIES ---
  {
    id: "tiramisu-abu",
    name: "Ethiopian Coffee Infused Tiramisu",
    description: "Authentic Venetian tiramisu with savoiardi ladyfingers bathed in intense Yirgacheffe espresso reduction, silky mascarpone, and dark cocoa.",
    price: 340.00,
    category: "postres",
    image: "tiramisu",
    tags: ["Infused with House Coffee", "Signature Dessert"],
    rating: 5.0,
    reviews: 260,
    calories: 380,
    prepTime: "Ready to Serve",
    ingredients: ["Italian Mascarpone", "Yirgacheffe Coffee Reduction", "Savoiardi Ladyfingers", "Dutch Process Cocoa"],
    customizations: [
      {
        name: "Serving Pair",
        type: "single",
        options: ["As Is (Classic)", "With Madagascar Vanilla Bean Gelato (+ 90 ETB)"],
        translations: {
          en: {
            name: "Serving Pair",
            options: ["As Is (Classic)", "With Madagascar Vanilla Bean Gelato (+ 90 ETB)"]
          },
          am: {
            name: "የማቅረቢያ ምርጫ",
            options: ["ክላሲክ (እንደተዘጋጀው)", "ከቫኒላ ጄላቶ አይስክሬም ጋር (+ 90 ብር)"]
          },
          om: {
            name: "Filannoo Dhihaatu",
            options: ["Akkuma Jirutti (Kilaasikii)", "Aayiskiriimii Vaanillaa Waliin (+ 90 ETB)"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Ethiopian Coffee Infused Tiramisu",
        description: "Authentic Venetian tiramisu with savoiardi ladyfingers bathed in intense Yirgacheffe espresso reduction, silky mascarpone, and dark cocoa.",
        tags: ["Infused with House Coffee", "Signature Dessert"],
        ingredients: ["Italian Mascarpone", "Yirgacheffe Coffee Reduction", "Savoiardi Ladyfingers", "Dutch Process Cocoa"]
      },
      am: {
        name: "ቲራሚሱ በኢትዮጵያ ቡና የተዘጋጀ",
        description: "በይርጋጨፌ ቡና የተነከረ ጣፋጭ የጣሊያን ቲራሚሱ ከማስካርፖኔ ክሬም እና ከጥቁር ኮኮዋ ዱቄት ጋር።",
        tags: ["በቤቱ ቡና የተዘጋጀ", "የመጨረሻ ጣፋጭ"],
        ingredients: ["የጣሊያን ማስካርፖኔ", "የይርጋጨፌ ቡና ክምችት", "የሳቮያርዲ ብስኩት", "የኮኮዋ ዱቄት"]
      },
      om: {
        name: "Tiraamiisuu Buna Itoophiyaatiin Tolfame",
        description: "Keekii tiraamiisuu aadaa buna Yirgaacaffeetti cuubame, kirimii maaskaarpoonii fi kookoo waliin.",
        tags: ["Buna Manatiin Qophaa'e", "Dhangala'aa Addaa"],
        ingredients: ["Maaskaarpoonii Xaaliyaanii", "Buna Yirgaacaffee", "Biskutii Saavoyaardii", "Dhangala'aa Kookoo"]
      }
    }
  },
  {
    id: "chocolate-mousse",
    name: "70% Dark Belgian Chocolate Mousse",
    description: "Airy, melt-in-the-mouth Belgian dark chocolate mousse accompanied by tart raspberry coulis and toasted slivered almonds.",
    price: 310.00,
    category: "postres",
    image: "mousse",
    tags: ["Gluten-Free", "Rich & Decadent"],
    rating: 4.8,
    reviews: 130,
    calories: 340,
    prepTime: "Ready to Serve",
    ingredients: ["70% Belgian Dark Chocolate", "Whipped Dairy Cream", "Wild Forest Berry Coulis", "Toasted Almonds"],
    customizations: [],
    translations: {
      en: {
        name: "70% Dark Belgian Chocolate Mousse",
        description: "Airy, melt-in-the-mouth Belgian dark chocolate mousse accompanied by tart raspberry coulis and toasted slivered almonds.",
        tags: ["Gluten-Free", "Rich & Decadent"],
        ingredients: ["70% Belgian Dark Chocolate", "Whipped Dairy Cream", "Wild Forest Berry Coulis", "Toasted Almonds"]
      },
      am: {
        name: "70% የቤልጂየም ጥቁር ቸኮሌት ሙስ",
        description: "የቤልጂየም ጥቁር ቸኮሌት ሙስ ከጫካ ፍራፍሬዎች መረቅ እና ከተጠበሰ የለውዝ ፍሬዎች ጋር።",
        tags: ["ግሉተን-አልባ", "የበለጸገ ጣዕም"],
        ingredients: ["70% ጥቁር ቸኮሌት", "የወተት ክሬም", "የጫካ ፍራፍሬ መረቅ", "የተጠበሰ ለውዝ"]
      },
      om: {
        name: "Chookoleetii Muusii Gurraacha 70%",
        description: "Chookoleetii Beeljiyeem gurraacha lallaafaa firii diimaa fi baadamii waddame waliin.",
        tags: ["Giluuteen Malee", "Mi'aawaa Cimaa"],
        ingredients: ["Chookoleetii Gurraacha 70%", "Kiriimii Aannanii", "Soosii Firii Bosonaa", "Baadamii Waddame"]
      }
    }
  },
  {
    id: "croissant-artesanal",
    name: "Fresh French Butter Croissant",
    description: "Freshly baked traditional French viennoiserie made with pure Normandy butter, delivering a shattered golden crust and honeycomb interior.",
    price: 180.00,
    category: "postres",
    image: "croissant",
    tags: ["Freshly Baked", "Artisan"],
    rating: 4.9,
    reviews: 180,
    calories: 260,
    prepTime: "Ready to Serve",
    ingredients: ["French Normandy Butter", "High Grade Flour", "Fleur de Sel"],
    customizations: [
      {
        name: "Filling Choice",
        type: "single",
        options: ["Plain Golden Flaky", "Pistachio Cream Filling (+ 60 ETB)", "Warm Nutella Chocolate (+ 50 ETB)"],
        translations: {
          en: {
            name: "Filling Choice",
            options: ["Plain Golden Flaky", "Pistachio Cream Filling (+ 60 ETB)", "Warm Nutella Chocolate (+ 50 ETB)"]
          },
          am: {
            name: "የመሙያ ምርጫ",
            options: ["ክላሲክ ያለ መሙያ", "የፒስታቺዮ ክሬም (+ 60 ብር)", "ትኩስ ኑቴላ ቸኮሌት (+ 50 ብር)"]
          },
          om: {
            name: "Filannoo Keessaa",
            options: ["Kilaasikii Qullaa", "Kiriimii Pistaashiyoo (+ 60 ETB)", "Chookoleetii Nuuteellaa (+ 50 ETB)"]
          }
        }
      }
    ],
    translations: {
      en: {
        name: "Fresh French Butter Croissant",
        description: "Freshly baked traditional French viennoiserie made with pure Normandy butter, delivering a shattered golden crust and honeycomb interior.",
        tags: ["Freshly Baked", "Artisan"],
        ingredients: ["French Normandy Butter", "High Grade Flour", "Fleur de Sel"]
      },
      am: {
        name: "ትኩስ የፈረንሳይ ቅቤ ክሩአሶን",
        description: "ትኩስ የተጋገረ የፈረንሳይ ቅቤ ክሩአሶን፣ ከላይ ጥርት ያለ ውስጡ ለስላሳና ቀፎ የሚመስል።",
        tags: ["ትኩስ የተጋገረ", "ባህላዊ"],
        ingredients: ["የፈረንሳይ ኖርማንዲ ቅቤ", "ምርጥ ዱቄት", "የባህር ጨው"]
      },
      om: {
        name: "Kuroosaantii Dhadhaa Firaansi Haaraa",
        description: "Kuroosaantii aadaa Firaansi dhadhaa qulqulluudhaan tolfamee haaraa bilchaate.",
        tags: ["Haaraa Bilchaate", "Aadaadhaan Tolfame"],
        ingredients: ["Dhadhaa Firaansi", "Dhangala'aa Qamadii", "Soogidda"]
      }
    }
  }
];
