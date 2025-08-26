// ========== ПУСТЫЕ MOCK ДАННЫЕ ДЛЯ РАЗРАБОТКИ ==========

export const mockTerms = [];

export const mockThemes = [];

// ========== ПЕРЕВОДЫ ИНТЕРФЕЙСА ==========

export const translations = {
  en: {
    nav: {
      home: "Home",
      dictionary: "Dictionary",
      quizzes: "Quizzes",
      progress: "Progress",
      admin: "Admin",
      logout: "Logout",
    },
    home: {
      hero: {
        title: "Master Agricultural Terminology",
        subtitle: "Learn agricultural terms in Karakalpak and English",
        description:
          "Comprehensive learning platform for students and professionals in agriculture",
        browseDictionary: "Browse Dictionary",
        startLearning: "Start Learning",
      },
      stats: {
        termsAvailable: "Terms Available",
        termsDescription: "Comprehensive agricultural vocabulary",
        themes: "Themes",
        themesDescription: "Organized by topics",
        quizTypes: "Quiz Types",
        quizDescription: "Various testing methods",
        activeUsers: "Active Users",
        usersDescription: "Growing community",
      },
      features: {
        title: "Platform Features",
        subtitle: "Everything you need for effective learning",
        smartSearch: "Smart Search",
        smartSearchDesc: "Instant search in both languages",
        interactiveQuizzes: "Interactive Quizzes",
        quizzesDesc: "4 different quiz types",
        progressTracking: "Progress Tracking",
        progressDesc: "Detailed statistics",
        achievements: "Achievements",
        achievementsDesc: "Earn badges and track milestones",
      },
      cta: {
        title: "Ready to Start Learning?",
        subtitle: "Join hundreds of agriculture students",
        getStarted: "Get Started Now",
      },
    },
    dictionary: {
      search: "Search terms in Karakalpak or English...",
      allThemes: "All Themes",
      termsFound: "terms found",
      noTermsFound: "No terms found",
      tryAdjusting: "Try adjusting your search",
      clearFilters: "Clear Filters",
      viewMode: "View Mode",
      gridView: "Grid",
      listView: "List",
      translationDirection: "Translation Direction",
      showingResults: "Showing results",
      quickStats: "Quick Stats",
      totalTerms: "Total Terms",
      themes: "Themes",
      showing: "Showing",
      learningTip: "Learning Tip",
      tipText: "Try to learn 10 new terms daily!",
      actions: {
        favorite: "Add to favorites",
        listen: "Listen pronunciation",
        details: "View details",
        edit: "Edit",
        delete: "Delete",
      },
    },
    quiz: {
      title: "Test Your Knowledge",
      selectType: "Select Quiz Type",
      selectTheme: "Select Theme",
      questionsCount: "Number of Questions",
      startQuiz: "Start Quiz",
      question: "Question",
      score: "Score",
      timeLeft: "Time Left",
      submit: "Submit Answer",
      next: "Next Question",
      finish: "Finish Quiz",
      types: {
        translation_kaa_en: "Karakalpak to English",
        translation_en_kaa: "English to Karakalpak",
        definition: "Definition Match",
        multiple: "Multiple Choice",
      },
      results: {
        title: "Quiz Results",
        correct: "Correct Answers",
        incorrect: "Incorrect Answers",
        percentage: "Success Rate",
        time: "Time Taken",
        tryAgain: "Try Again",
        backToQuizzes: "Back to Quizzes",
      },
    },
    admin: {
      login: {
        title: "Admin Login",
        username: "Username",
        password: "Password",
        loginButton: "Login",
        error: "Invalid credentials",
      },
      dashboard: {
        title: "Admin Dashboard",
        welcome: "Welcome, Admin",
        stats: "Statistics",
        totalTerms: "Total Terms",
        totalThemes: "Themes",
        totalQuizzes: "Quiz Attempts",
        recentActivity: "Recent Activity",
      },
      terms: {
        title: "Manage Terms",
        addNew: "Add New Term",
        edit: "Edit Term",
        delete: "Delete Term",
        import: "Import CSV",
        export: "Export Data",
        fields: {
          termKaa: "Karakalpak Term",
          termEn: "English Term",
          definitionEn: "English Definition",
          definitionKaa: "Karakalpak Definition",
          theme: "Theme",
        },
        messages: {
          created: "Term created successfully",
          updated: "Term updated successfully",
          deleted: "Term deleted successfully",
          imported: "Terms imported successfully",
        },
      },
      themes: {
        title: "Manage Themes",
        addNew: "Add New Theme",
        fields: {
          nameEn: "English Name",
          nameKaa: "Karakalpak Name",
          description: "Description",
        },
      },
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      page: "Page",
      of: "of",
    },
  },

  kaa: {
    nav: {
      home: "Bas bet",
      dictionary: "Sózlik",
      quizzes: "Testler",
      progress: "Nátiyje",
      admin: "Admin",
      logout: "Shıǵıw",
    },
    home: {
      hero: {
        title: "Awıl xojalıq terminologiyasın úyreniń",
        subtitle:
          "Awıl xojalıq terminlerin qaraqalpaq hám ingliz tillerinde úyreniń",
        description:
          "Awıl xojalıq studentleri hám mámanleri ushın tolıq úyreniw platforması",
        browseDictionary: "Sózlikti kóriw",
        startLearning: "Úyreniwdi baslaw",
      },
      stats: {
        termsAvailable: "Bar terminler",
        termsDescription: "Tolıq awıl xojalıq sózligi",
        themes: "Temalar",
        themesDescription: "Temalar boyınsha",
        quizTypes: "Test túrleri",
        quizDescription: "Hár qıylı test usılları",
        activeUsers: "Aktiv paydalanıwshılar",
        usersDescription: "Ósip barıwshı jámáát",
      },
      features: {
        title: "Platforma múmkinshilikleri",
        subtitle: "Nátiyjeli úyreniw ushın barlıq kerekli nárs",
        smartSearch: "Aqlı izlew",
        smartSearchDesc: "Eki tilde tez izlew",
        interactiveQuizzes: "Interaktiv testler",
        quizzesDesc: "4 túrli test túri",
        progressTracking: "Nátiyje baqlawı",
        progressDesc: "Tolıq statistika",
        achievements: "Jeńisler",
        achievementsDesc: "Belgi alıw hám nátiyjelerin baqlawı",
      },
      cta: {
        title: "Úyreniwge tayarsız ba?",
        subtitle: "Júzlergen awıl xojalıq studentlerine qosılıń",
        getStarted: "Házir baslań",
      },
    },
    dictionary: {
      search: "Qaraqalpaq yamasa ingliz tilinde terminlerdi izlew...",
      allThemes: "Barlıq temalar",
      termsFound: "termin tabıldı",
      noTermsFound: "Terminler tabılmadı",
      tryAdjusting: "Izlewińizdi ózgertiń",
      clearFilters: "Filterlerdi tazalaw",
      viewMode: "Kóriw túri",
      gridView: "Setka",
      listView: "Dizim",
      translationDirection: "Awdarma baǵıtı",
      showingResults: "Nátiyje kórsetilip atır",
      quickStats: "Tez statistika",
      totalTerms: "Barlıq terminler",
      themes: "Temalar",
      showing: "Kórsetilip atır",
      learningTip: "Úyreniw keńesi",
      tipText: "Kúnine 10 jańa termin úyreniń!",
      actions: {
        favorite: "Tańlawlılarǵa qosıw",
        listen: "Aytılıwın tıńlaw",
        details: "Tolıq kóriw",
        edit: "Ózgertiw",
        delete: "Óshiriw",
      },
    },
    quiz: {
      title: "Bilimińizdi sınań",
      selectType: "Test túrin saylań",
      selectTheme: "Tema saylań",
      questionsCount: "Sorawlar sanı",
      startQuiz: "Testdi baslaw",
      question: "Soraw",
      score: "Ball",
      timeLeft: "Qalǵan waqıt",
      submit: "Juwaptı jiberiw",
      next: "Keyingi soraw",
      finish: "Testdi tamamlaw",
      types: {
        translation_kaa_en: "Qaraqalpaqtan inglizge",
        translation_en_kaa: "Inglizden qaraqalpaqqa",
        definition: "Anıqlama boyınsha",
        multiple: "Kóp tańlaw",
      },
      results: {
        title: "Test nátiyjesi",
        correct: "Durıs juwaplar",
        incorrect: "Qáte juwaplar",
        percentage: "Tabıs dárejesi",
        time: "Ketken waqıt",
        tryAgain: "Qaytadan sınaw",
        backToQuizzes: "Testlerge qaytıw",
      },
    },
    admin: {
      login: {
        title: "Admin kiriw",
        username: "Paydalanıwshı atı",
        password: "Parol",
        loginButton: "Kiriw",
        error: "Qáte maǵlıwmatlar",
      },
      dashboard: {
        title: "Admin paneli",
        welcome: "Xosh kelipsiz, Admin",
        stats: "Statistika",
        totalTerms: "Barlıq terminler",
        totalThemes: "Temalar",
        totalQuizzes: "Test urinislari",
        recentActivity: "Sońǵı háreket",
      },
      terms: {
        title: "Terminlerdi basqarıw",
        addNew: "Jańa termin qosıw",
        edit: "Termindi ózgertiw",
        delete: "Termindi óshiriw",
        import: "CSV import",
        export: "Maǵlıwmatlardı eksport",
        fields: {
          termKaa: "Qaraqalpaq termin",
          termEn: "Ingliz termin",
          definitionEn: "Inglizche anıqlama",
          definitionKaa: "Qaraqalpaqsha anıqlama",
          theme: "Tema",
        },
        messages: {
          created: "Termin sátkli qosıldı",
          updated: "Termin sátkli ózgertildi",
          deleted: "Termin sátkli óshirildi",
          imported: "Terminler sátkli import qılındı",
        },
      },
      themes: {
        title: "Temalarni basqarıw",
        addNew: "Jańa tema qosıw",
        fields: {
          nameEn: "Inglizche atı",
          nameKaa: "Qaraqalpaqsha atı",
          description: "Tariyplew",
        },
      },
    },
    common: {
      save: "Saqlaw",
      cancel: "Biykar etiw",
      delete: "Óshiriw",
      edit: "Ózgertiw",
      add: "Qosıw",
      search: "Izlew",
      filter: "Filtrlew",
      sort: "Sortlaw",
      loading: "Júklenip atır...",
      error: "Qátelik",
      success: "Sátkli",
      confirm: "Tastıyıqlaw",
      yes: "Áwe",
      no: "Yaq",
      close: "Jabıw",
      back: "Artqa",
      next: "Keyingi",
      previous: "Aldıńǵı",
      page: "Bet",
      of: "dan",
    },
  },
};

// ========== КОНСТАНТЫ ==========

export const QUIZ_TYPES = [
  { id: "translation_kaa_en", name: "Karakalpak to English", icon: "🔤" },
  { id: "translation_en_kaa", name: "English to Karakalpak", icon: "🔤" },
  { id: "definition", name: "Definition Match", icon: "📖" },
  { id: "multiple", name: "Multiple Choice", icon: "✅" },
];

export const LANGUAGES = [
  { id: "en", name: "English", flag: "🇬🇧" },
  { id: "kaa", name: "Qaraqalpaq", flag: "🇺🇿" },
];

export const TRANSLATION_DIRECTIONS = [
  { id: "kaa-en", from: "kaa", to: "en", label: "Qaraqalpaq → English" },
  { id: "en-kaa", from: "en", to: "kaa", label: "English → Qaraqalpaq" },
  { id: "both", from: "both", to: "both", label: "Both directions" },
];

// ========== УТИЛИТЫ ==========

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// ========== ВАЛИДАЦИЯ ==========

export const validateTerm = (term) => {
  const errors = {};

  if (!term.term_kaa || term.term_kaa.trim().length < 2) {
    errors.term_kaa = "Karakalpak term is required (min 2 characters)";
  }

  if (!term.term_en || term.term_en.trim().length < 2) {
    errors.term_en = "English term is required (min 2 characters)";
  }

  if (!term.definition_en || term.definition_en.trim().length < 10) {
    errors.definition_en = "English definition is required (min 10 characters)";
  }

  if (!term.theme) {
    errors.theme = "Theme is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTheme = (theme) => {
  const errors = {};

  if (!theme.name_en || theme.name_en.trim().length < 2) {
    errors.name_en = "English name is required";
  }

  if (!theme.name_kaa || theme.name_kaa.trim().length < 2) {
    errors.name_kaa = "Karakalpak name is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ========== CSV EXPORT/IMPORT HELPERS ==========

export const exportToCSV = (data, filename = "terms.csv") => {
  const headers = [
    "term_kaa",
    "term_en",
    "definition_en",
    "definition_kaa",
    "theme",
  ];
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => `"${row[header] || ""}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (text) => {
  const lines = text.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      data.push(row);
    }
  }

  return data;
};

export default {
  mockTerms,
  mockThemes,
  translations,
  QUIZ_TYPES,
  LANGUAGES,
  TRANSLATION_DIRECTIONS,
  formatTime,
  validateTerm,
  validateTheme,
  exportToCSV,
  parseCSV,
};
