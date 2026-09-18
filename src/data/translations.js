export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', short: 'አማ' },
  { code: 'om', name: 'Afan Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', short: 'OM' },
];

export const translations = {
  en: {
    // Brand & Hero
    restaurantTitle: 'Abu Coffee',
    restaurantSubtitle: 'Ethiopia',
    heroHeading: 'Your menu, your orders, in 1 click',
    heroTagline: 'Digital QR Menu with WhatsApp Ordering',
    badgeSimple: 'Simple',
    badgeModern: 'Modern',
    badgeFast: 'Fast',
    
    // Header & Quick Actions
    tableLabel: 'Table',
    callWaiter: 'Call Waiter',
    directWhatsApp: 'Direct WhatsApp',
    viewMenu: 'View Menu',
    openCart: 'View Cart',
    adminConsole: 'Admin Console',
    viewStorefront: 'View Storefront',
    selectLanguage: 'Language',
    openMenu: 'Open menu',
    menuCategories: 'Menu categories',
    
    // Categories
    allCategories: 'All',
    categoryStarters: 'Starters',
    categoryMains: 'Main Courses',
    categoryCoffee: 'Ethiopian Coffee',
    categoryDrinks: 'Beverages',
    categoryDesserts: 'Desserts & Pastries',
    
    // Search & Filters
    searchPlaceholder: 'Search menu...',
    filters: 'Filters',
    filterVegetarian: 'Vegetarian',
    filterSpicy: 'Spicy',
    filterClear: 'Clear',
    noItemsFound: 'No items found in this category.',
    
    // Item Cards & Badges
    favoriteBadge: 'Favorite',
    chefSpecial: 'Chef Special',
    addToCart: 'Add',
    decreaseQty: 'Decrease quantity',
    increaseQty: 'Increase quantity',
    prepTimeLabel: 'mins',
    caloriesLabel: 'kcal',
    reviewsCount: 'reviews',
    
    // Sticky Cart Bar
    itemSingle: 'item',
    itemPlural: 'items',
    sendOrderWhatsApp: 'SEND ORDER VIA WHATSAPP',
    subtotalLabel: 'Subtotal',
    
    // Checkout Drawer
    yourOrder: 'Your Order',
    dineIn: 'Dine-In (Table)',
    delivery: 'Takeaway / Delivery',
    tableNumberLabel: 'Table Number',
    tableNumberPlaceholder: 'e.g. 04',
    customerName: 'Your Name',
    customerPhone: 'WhatsApp / Phone',
    deliveryAddress: 'Delivery Address',
    deliveryAddressPlaceholder: 'Street, Building, Apartment...',
    whatsAppPreviewTitle: 'WhatsApp Message Preview:',
    copiedSuccess: 'Copied!',
    copyMessage: 'Copy text',
    totalToPay: 'Total to Pay',
    confirmDirectKitchen: 'Confirm & send to kitchen directly',
    orderReceivedSimulation: 'Order received!',
    orderReceivedSimDesc: 'Your order has been registered successfully.',
    
    // WhatsApp Generated Message Template
    waOrderGreeting: 'Hello, here is my order from Abu Coffee:',
    waTotal: 'Total:',
    waTable: 'Table:',
    waDeliveryDetails: 'Delivery Order Details:',
    waName: 'Name:',
    waPhone: 'Phone:',
    waAddress: 'Address:',
    
    // Order Success Modal
    orderSuccessTitle: 'Order Received!',
    orderSuccessDesc: 'Your order has been received by our kitchen team. We will attend to you shortly.',
    orderStatusLabel: 'Status:',
    orderStatusPreparing: 'In Preparation',
    backToMenu: 'Back to Menu',
    
    // Call Waiter Modal
    waiterModalTitle: 'Need Table Assistance?',
    waiterModalSubtitle: 'Select a reason and we will notify our staff immediately.',
    waiterSentAlert: 'Notice sent to staff!',
    waiterReasonGeneral: 'General assistance',
    waiterReasonWater: 'Table water',
    waiterReasonBill: 'Bring the bill',
    waiterReasonNapkins: 'Extra napkins',
    cancelButton: 'Cancel',
    callButton: 'Call Staff',
    
    // Feedback Modal
    reviewModalTitle: 'Rate Your Experience',
    reviewModalSubtitle: 'At Abu Coffee we value your feedback.',
    reviewCommentLabel: 'Comment',
    reviewCommentPlaceholder: 'Tell us which dish or coffee you enjoyed most...',
    closeButton: 'Close',
    submitReviewButton: 'Submit Review',
    reviewSuccessMessage: 'Thank you for your feedback!',
    
    // Welcome QR Modal
    welcomeTitle: 'Welcome to Abu Coffee',
    welcomeDesc: 'Interactive digital QR menu with direct WhatsApp ordering. Scan, choose, and enjoy our Ethiopian specialty coffee and artisan cuisine.',
    whichTablePrompt: 'Which table are you sitting at?',
    exploreMenuButton: 'Explore Menu',
    
    // Side Drawer
    guestWifi: 'Guest WiFi',
    networkLabel: 'Network:',
    passwordLabel: 'Password:',
    leaveReview: 'Leave a Review',
    whatsappContact: 'WhatsApp Concierge',
    
    // Item Detail Modal
    dishDetailsTitle: 'Dish Details',
    ingredientsTitle: 'Ingredients',
    selectOneOption: 'Select One',
    optionalMulti: 'Optional (Multi)',
    addToOrderButton: 'Add to Order',
    
    // Table Tent Card
    tentScanTo: 'SCAN TO',
    tentViewMenu: 'VIEW OUR MENU',
    tentStep1: '1. Scan',
    tentStep2: '2. Choose',
    tentStep3: '3. Send Order',
    tentWhatsAppBadge: 'Direct orders via WhatsApp',
    tentLanguagesSupported: 'Available in English · አማርኛ · Afaan Oromoo',
    
    // Bank Transfer
    transferBirr: 'Transfer Birr / Pay',
    bankAccountsTitle: 'Bank Accounts & Mobile Pay',
    bankAccountsSubtitle: 'Transfer directly using your mobile banking app. Show confirmation to staff.',
    accountNameLabel: 'Account Name:',
    accountNumberLabel: 'Account Number:',
    copyAccount: 'Copy Number',
    accountCopied: 'Copied!',
    transferReceiptNotice: 'After completing the transfer, please show the confirmation SMS or receipt to your server.',
    closeModal: 'Close',
    
    // Alerts
    alertEnterTable: 'Please enter your table number',
    alertEnterDelivery: 'Please complete your delivery name, phone, and address',
    alertEnterTableFirst: 'Please enter your table number first',
  },
  
  am: {
    // Brand & Hero
    restaurantTitle: 'አቡ ቡና',
    restaurantSubtitle: 'ኢትዮጵያ',
    heroHeading: 'ሜኑዎ፣ ትዕዛዝዎ፣ በአንድ ጠቅታ',
    heroTagline: 'የዲጂታል QR ሜኑ በዋትስአፕ ማዘዣ ጋር',
    badgeSimple: 'ቀላል',
    badgeModern: 'ዘመናዊ',
    badgeFast: 'ፈጣን',
    
    // Header & Quick Actions
    tableLabel: 'ጠረጴዛ',
    callWaiter: 'አስተናጋጅ ጥራ',
    directWhatsApp: 'ቀጥታ ዋትስአፕ',
    viewMenu: 'ሜኑ ይመልከቱ',
    openCart: 'ጋሪውን እይ',
    adminConsole: 'የአስተዳዳሪ ክፍል',
    viewStorefront: 'ወደ ሜኑ ተመለስ',
    selectLanguage: 'ቋንቋ',
    openMenu: 'ሜኑን ክፈት',
    menuCategories: 'የሜኑ ምድቦች',
    
    // Categories
    allCategories: 'ሁሉም',
    categoryStarters: 'መክሰስ እና መግቢያዎች',
    categoryMains: 'ዋና ምግቦች',
    categoryCoffee: 'የኢትዮጵያ ቡና',
    categoryDrinks: 'መጠጦች',
    categoryDesserts: 'ጣፋጭ ምግቦች',
    
    // Search & Filters
    searchPlaceholder: 'በሜኑ ውስጥ ይፈልጉ...',
    filters: 'ማጣሪያዎች',
    filterVegetarian: 'የአትክልት',
    filterSpicy: 'የሚቃጠል / ቅመም',
    filterClear: 'አጽዳ',
    noItemsFound: 'በዚህ ምድብ ውስጥ ምንም አይነት ምግብ አልተገኘም።',
    
    // Item Cards & Badges
    favoriteBadge: 'ተወዳጅ',
    chefSpecial: 'የሼፍ ምርጥ',
    addToCart: 'አክል',
    decreaseQty: 'መጠኑን ቀንስ',
    increaseQty: 'መጠኑን ጨምር',
    prepTimeLabel: 'ደቂቃ',
    caloriesLabel: 'ካሎሪ',
    reviewsCount: 'ግምገማዎች',
    
    // Sticky Cart Bar
    itemSingle: 'እቃ',
    itemPlural: 'እቃዎች',
    sendOrderWhatsApp: 'ትዕዛዝ በዋትስአፕ ላክ',
    subtotalLabel: 'ጠቅላላ ክፍያ',
    
    // Checkout Drawer
    yourOrder: 'ትዕዛዝዎ · አቡ ቡና',
    dineIn: 'እዚሁ መመገብ (ጠረጴዛ)',
    delivery: 'ይዞ መሄድ / ማድረስ',
    tableNumberLabel: 'የጠረጴዛ ቁጥር',
    tableNumberPlaceholder: 'ምሳሌ 04',
    customerName: 'የእርስዎ ስም',
    customerPhone: 'ዋትስአፕ / ስልክ ቁጥር',
    deliveryAddress: 'የማድረሻ አድራሻ',
    deliveryAddressPlaceholder: 'ሰፈር፣ ሕንፃ፣ የቤት ቁጥር...',
    whatsAppPreviewTitle: 'የዋትስአፕ መልዕክት ቅድመ-እይታ:',
    copiedSuccess: 'ተቀድቷል!',
    copyMessage: 'ጽሑፉን ቅዳ',
    totalToPay: 'የሚከፈል ጠቅላላ ዋጋ',
    confirmDirectKitchen: 'ቀጥታ ወደ ማብሰያ ክፍል ላክ',
    orderReceivedSimulation: 'ትዕዛዝዎ ደርሷል!',
    orderReceivedSimDesc: 'ትዕዛዝዎ በተሳካ ሁኔታ ተመዝግቧል።',
    
    // WhatsApp Generated Message Template
    waOrderGreeting: 'ሰላም፣ ከአቡ ቡና ያዘዝኩት ትዕዛዝ የሚከተለው ነው፡',
    waTotal: 'ጠቅላላ ዋጋ:',
    waTable: 'ጠረጴዛ:',
    waDeliveryDetails: 'የማድረሻ መረጃ:',
    waName: 'ስም:',
    waPhone: 'ስልክ:',
    waAddress: 'አድራሻ:',
    
    // Order Success Modal
    orderSuccessTitle: 'ትዕዛዝዎ ደርሷል!',
    orderSuccessDesc: 'ትዕዛዝዎ በኩሽና ሰራተኞቻችን ደርሷል። በቅርቡ እናስተናግድዎታለን።',
    orderStatusLabel: 'ሁኔታ:',
    orderStatusPreparing: 'በዝግጅት ላይ',
    backToMenu: 'ወደ ሜኑ ተመለስ',
    
    // Call Waiter Modal
    waiterModalTitle: 'የጠረጴዛ እርዳታ ይፈልጋሉ?',
    waiterModalSubtitle: 'ምክንያቱን ይምረጡ፤ ሰራተኞቻችንን ወዲያውኑ እናሳውቃለን።',
    waiterSentAlert: 'ማሳወቂያ ለሰራተኞች ተልኳል!',
    waiterReasonGeneral: 'አጠቃላይ እርዳታ',
    waiterReasonWater: 'የጠረጴዛ ውሃ',
    waiterReasonBill: 'ሒሳብ አምጡልኝ',
    waiterReasonNapkins: 'ተጨማሪ ሶፍት / ናፕኪን',
    cancelButton: 'ሰርዝ',
    callButton: 'አስተናጋጅ ጥራ',
    
    // Feedback Modal
    reviewModalTitle: 'አገልግሎታችንን ይገምግሙ',
    reviewModalSubtitle: 'በአቡ ቡና የእርስዎ አስተያየት ለእኛ ትልቅ ዋጋ አለው።',
    reviewCommentLabel: 'አስተያየት',
    reviewCommentPlaceholder: 'የትኛውን ምግብ ወይም ቡና እንደወደዱት ይንገሩን...',
    closeButton: 'ዝጋ',
    submitReviewButton: 'አስተያየቱን ላክ',
    reviewSuccessMessage: 'ስለ አስተያየትዎ እናመሰግናለን!',
    
    // Welcome QR Modal
    welcomeTitle: 'እንኳን ወደ አቡ ቡና በደህና መጡ',
    welcomeDesc: 'በዋትስአፕ በቀላሉ የሚያዙበት ዲጂታል የQR ሜኑ። ይቃኙ፣ ይምረጡ እና ምርጥ የኢትዮጵያ ቡናና ምግቦችን ያጣጥሙ።',
    whichTablePrompt: 'የትኛው ጠረጴዛ ላይ ተቀምጠዋል?',
    exploreMenuButton: 'ሜኑውን ይመልከቱ',
    
    // Side Drawer
    guestWifi: 'የደንበኞች ዋይፋይ',
    networkLabel: 'ኔትወርክ:',
    passwordLabel: 'የይለፍ ቃል:',
    leaveReview: 'አስተያየት ይስጡ',
    whatsappContact: 'የዋትስአፕ ግንኙነት',
    
    // Item Detail Modal
    dishDetailsTitle: 'የምግቡ ዝርዝር መረጃ',
    ingredientsTitle: 'ግብአቶች',
    selectOneOption: 'አንዱን ይምረጡ',
    optionalMulti: 'አማራጭ (ብዙ)',
    addToOrderButton: 'ወደ ትዕዛዝ አክል',
    
    // Table Tent Card
    tentScanTo: 'ይቃኙ',
    tentViewMenu: 'ሜኑ ለመመልከት',
    tentStep1: '1. ይቃኙ',
    tentStep2: '2. ይምረጡ',
    tentStep3: '3. ትዕዛዝ ይላኩ',
    tentWhatsAppBadge: 'ቀጥታ ትዕዛዝ በዋትስአፕ',
    tentLanguagesSupported: 'በእንግሊዝኛ · በአማርኛ · በኦሮምኛ ይገኛል',
    
    // Bank Transfer
    transferBirr: 'ብር ያስተላልፉ / ይክፈሉ',
    bankAccountsTitle: 'የባንክ ሂሳቦች እና ሞባይል ክፍያ',
    bankAccountsSubtitle: 'በሞባይል ባንኪንግ በቀጥታ ይክፈሉ። ደረሰኙን ለአስተናጋጁ ያሳዩ።',
    accountNameLabel: 'የሂሳብ ስም፦',
    accountNumberLabel: 'የሂሳብ ቁጥር፦',
    copyAccount: 'ቁጥሩን ቅዳ',
    accountCopied: 'ተገልብጧል!',
    transferReceiptNotice: 'ክፍያውን ከፈጸሙ በኋላ የማረጋገጫ መልዕክቱን ለአስተናጋጁ ያሳዩ።',
    closeModal: 'ዝጋ',
    
    // Alerts
    alertEnterTable: 'እባክዎ የጠረጴዛ ቁጥርዎን ያስገቡ',
    alertEnterDelivery: 'እባክዎ ስምዎን፣ ስልክዎን እና አድራሻዎን ሙሉ ያድርጉ',
    alertEnterTableFirst: 'እባክዎ መጀመሪያ የጠረጴዛ ቁጥርዎን ያስገቡ',
  },
  
  om: {
    // Brand & Hero
    restaurantTitle: 'Abu Coffee',
    restaurantSubtitle: 'Itoophiyaa',
    heroHeading: 'Meenuu keessan, ajaja keessan, cica 1n',
    heroTagline: 'Meenuu Dijitaalaa QR Ajaja WhatsApp Waliin',
    badgeSimple: 'Salphaa',
    badgeModern: 'Ammayyaa',
    badgeFast: 'Saffisaa',
    
    // Header & Quick Actions
    tableLabel: 'Minjee',
    callWaiter: 'Keessummeessaa Waami',
    directWhatsApp: 'Kallattiin WhatsApp',
    viewMenu: 'Meenuu Daawwadhaa',
    openCart: 'Garii Ilaali',
    adminConsole: 'Konsolii Bulchaa',
    viewStorefront: 'Gara Meenuutti Deebi\'aa',
    selectLanguage: 'Afaan',
    openMenu: 'Meenuu bani',
    menuCategories: 'Ramaddiiwwan meenuu',
    
    // Categories
    allCategories: 'Hunda',
    categoryStarters: 'Nyaata Jalqabaa',
    categoryMains: 'Nyaata Ijoo',
    categoryCoffee: 'Buna Itoophiyaa',
    categoryDrinks: 'Dhugaatii',
    categoryDesserts: 'Mi\'aawaa fi Keekii',
    
    // Search & Filters
    searchPlaceholder: 'Meenuu keessatti barbaadaa...',
    filters: 'Filannoo',
    filterVegetarian: 'Biqiltuu Qofa',
    filterSpicy: 'Qaraawaa',
    filterClear: 'Haqi',
    noItemsFound: 'Kukuta kana keessatti wanti argame hin jiru.',
    
    // Item Cards & Badges
    favoriteBadge: 'Filatamaa',
    chefSpecial: 'Adda Sheefii',
    addToCart: 'Dabali',
    decreaseQty: 'Hangi xiqqeessi',
    increaseQty: 'Hangi dabali',
    prepTimeLabel: 'daqiiqaa',
    caloriesLabel: 'kcal',
    reviewsCount: 'madaalliiwwan',
    
    // Sticky Cart Bar
    itemSingle: 'wanta',
    itemPlural: 'wantoota',
    sendOrderWhatsApp: 'AJAJA WHATSAPP-N ERGAA',
    subtotalLabel: 'Waliigala',
    
    // Checkout Drawer
    yourOrder: 'Ajaja Keessan · Abu Coffee',
    dineIn: 'Minjee Irra (Asitti)',
    delivery: 'Fudhachuu / Geejjibaa',
    tableNumberLabel: 'Lakkoofsa Minjee',
    tableNumberPlaceholder: 'Fkn. 04',
    customerName: 'Maqaa Keessan',
    customerPhone: 'WhatsApp / Bilbila',
    deliveryAddress: 'Teessoo Geejjibaa',
    deliveryAddressPlaceholder: 'Magaalaa, Gamoo, Kutaa...',
    whatsAppPreviewTitle: 'Mul\'ata Ergaa WhatsApp:',
    copiedSuccess: 'Koppii ta\'eera!',
    copyMessage: 'Barreeffama koppii godhi',
    totalToPay: 'Waliigala Kaffaltii',
    confirmDirectKitchen: 'Kallattiin gara kushiinaatti ergi',
    orderReceivedSimulation: 'Ajajni qaqqabeera!',
    orderReceivedSimDesc: 'Ajajni keessan milkaa\'inaan galmaa\'eera.',
    
    // WhatsApp Generated Message Template
    waOrderGreeting: 'Akkam, ajajni koo Abu Coffee irraa kanadha:',
    waTotal: 'Waliigala:',
    waTable: 'Minjee:',
    waDeliveryDetails: 'Ibsa Geejjibaa:',
    waName: 'Maqaa:',
    waPhone: 'Bilbila:',
    waAddress: 'Teessoo:',
    
    // Order Success Modal
    orderSuccessTitle: 'Ajajni Qaqqabeera!',
    orderSuccessDesc: 'Ajajni keessan garee kushiinaa keenyaan qaqqabeera. Yeroo dhiyootti isin tajaajilla.',
    orderStatusLabel: 'Haala:',
    orderStatusPreparing: 'Qophii Irra Jira',
    backToMenu: 'Gara Meenuutti Deebi\'aa',
    
    // Call Waiter Modal
    waiterModalTitle: 'Gargaarsi Minjee Isin Barbaachisaa?',
    waiterModalSubtitle: 'Sababa filadhaa, hojjettoota keenya yeroodhaan ni beeksisna.',
    waiterSentAlert: 'Hubachiisni hojjettootaaf ergameera!',
    waiterReasonGeneral: 'Gargaarsa waliigalaa',
    waiterReasonWater: 'Bishaan minjee',
    waiterReasonBill: 'Herrega fidaa',
    waiterReasonNapkins: 'Waraqaa harkaa (Naapkiinii)',
    cancelButton: 'Haqi',
    callButton: 'Waami',
    
    // Feedback Modal
    reviewModalTitle: 'Muuxannoo Keessan Madaalaa',
    reviewModalSubtitle: 'Abu Coffee keessatti yaada keessaniif bakka guddaa qabna.',
    reviewCommentLabel: 'Yaada',
    reviewCommentPlaceholder: 'Nyaata ykn buna isa kam akka jaallattan nutti himaa...',
    closeButton: 'Cufi',
    submitReviewButton: 'Yaada Ergi',
    reviewSuccessMessage: 'Yaada keessaniif galatoomaa!',
    
    // Welcome QR Modal
    welcomeTitle: 'Baga Gara Abu Coffeetti Nagaan Dhuftan',
    welcomeDesc: 'Meenuu QR dijitaalaa fayyadamuun kallattiin WhatsApp-n ajajaa. Iskaan godhaa, filadhaatii buna Itoophiyaa mi\'aawaa dhandhamaa.',
    whichTablePrompt: 'Minjee isa kam irra teessaniittu?',
    exploreMenuButton: 'Meenuu Daawwadhaa',
    
    // Side Drawer
    guestWifi: 'WiFi Keessummootaa',
    networkLabel: 'Netwoorkii:',
    passwordLabel: 'Jecha Darbii:',
    leaveReview: 'Yaada Barreessaa',
    whatsappContact: 'Qunnamtii WhatsApp',
    
    // Item Detail Modal
    dishDetailsTitle: 'Ibsa Nyaataa',
    ingredientsTitle: 'Qabiyyee',
    selectOneOption: 'Tokko Filadhaa',
    optionalMulti: 'Filannoo (Dabalataa)',
    addToOrderButton: 'Gara Ajajaatti Dabali',
    
    // Table Tent Card
    tentScanTo: 'ISKAAN GODHAA',
    tentViewMenu: 'MEENUU KAN DAAWWADHAA',
    tentStep1: '1. Iskaan',
    tentStep2: '2. Filadhaa',
    tentStep3: '3. Ajaja Ergaa',
    tentWhatsAppBadge: 'Ajaja kallattii WhatsApp tiin',
    tentLanguagesSupported: 'Ingiliffaan · Afaan Oromootiin · Amaariffaan kan qophaa\'e',
    
    // Bank Transfer
    transferBirr: 'Birrii Dabarfaa / Kaffalaa',
    bankAccountsTitle: 'Lakkoofsa Baankii fi Moobaayilaa',
    bankAccountsSubtitle: 'Kallattiin baankii moobaayilaatiin kaffalaa. Nagahee agarsiisaa.',
    accountNameLabel: 'Maqaa Herregaa:',
    accountNumberLabel: 'Lakkoofsa Herregaa:',
    copyAccount: 'Lakkoofsa Koppii Godhi',
    accountCopied: 'Koppii ta\'eera!',
    transferReceiptNotice: 'Kaffaltii erga raawwattanii booda nagahee ykn ergaa mirkaneessaa hojjetaatti agarsiisaa.',
    closeModal: 'Cufi',
    
    // Alerts
    alertEnterTable: 'Moo deebi\'aa lakkoofsa minjee keessan galchaa',
    alertEnterDelivery: 'Maaloo maqaa, bilbila fi teessoo geejjibaa guutaa',
    alertEnterTableFirst: 'Maaloo dura lakkoofsa minjee keessan galchaa',
  }
};
