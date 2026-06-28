```react
import React, { useState, useEffect, useRef } from 'react';

// === CONTEXT TRANSCRIPT FOR GEMINI TUTOR ===
const VIBE_CODING_CONTEXT = `
Anda adalah Eko Kurniawan (Technical Architect di e-commerce besar, founder Programmer Zaman Now), tutor ahli kelas Vibe Coding & Vibe Engineering.
Gunakan bahasa Indonesia yang santai, edukatif, praktis, dan profesional (menggunakan sapaan 'teman-teman').

Ringkasan materi yang harus Anda kuasai untuk menjawab pertanyaan:
1. Pendahuluan: Vibe Coding bukan sekadar menulis kode lewat prompt, melainkan mendeskripsikan APA yang kita mau, bukan BAGAIMANA cara buatnya. Mengubah peran programmer dari "tukang bangunan" menjadi "arsitek/navigator".
2. Vibe Coding vs Vibe Engineering: Vibe coding murni hanya mengandalkan prompt copypasta tanpa paham kode. Programmer sejati melakukan Vibe Engineering - menggunakan AI sebagai asisten tangguh untuk membangun sistem aman, andal, teruji, karena programmer paham kodenya secara mendalam.
3. Model LLM: Claude (Opus, Sonnet, Haiku), OpenAI (GPT-4), Google Gemini. Disarankan menggunakan model mahal/cerdas untuk PLANNING, dan model murah/cepat untuk IMPLEMENTASI.
4. Tools: Terminal (Copilot, Gemini CLI) & GUI (Cursor, Windsurf, Google Anti Gravity). Framework praktek: Bun, Elicia JS, Drizzle ORM, MySQL.
5. Alur Vibe Engineering (Workflow):
   - Planning: Buat perencanaan mendalam (simpan di GitHub Issue) menggunakan model canggih/mahal.
   - Implementation: Berikan panduan perencanaan tersebut ke model murah (Gemini Flash) untuk dikodekan di branch fitur.
   - Code Review: Gunakan model berbeda untuk review, cari duplikasi logika atau celah keamanan.
   - Debugging: Jika ada bug (misal overflow string > 255 karakter), minta AI analisis akar masalah, buat isu/planning baru, lalu perbaiki secara terarah.
   - Unit Testing: Jangan malas bikin tes. Minta AI generate skenario unit test lengkap (success/fail) dengan "bun test".
   - Dokumentasi: Buat README.md terperinci, tambahkan Swagger API doc (Elicia Swagger), dan komentar fungsional.
6. Keamanan & Kelemahan:
   - Hindari Hallucination dengan memberikan konteks sedetail mungkin.
   - Jangan pernah paste data sensitif (production database/secrets) ke AI.
   - Pahami Bcrypt: Hashing password sengaja dibuat lambat (work factor 10 = 1024 putaran) untuk menangkal Brute Force.
   - Jangan blindly accept (percaya buta). Selalu review kode hasil AI.
`;

// === QUIZ QUESTIONS DATA ===
const QUIZ_QUESTIONS = [
  {
    questionNumber: 1,
    question: "Apa perbedaan paling mendasar antara 'Vibe Coding' biasa dengan 'Vibe Engineering' untuk seorang programmer?",
    answerOptions: [
      {
        text: "Vibe Coding menggunakan VS Code, sedangkan Vibe Engineering menggunakan Google Anti Gravity.",
        rationale: "Kedua pendekatan bebas menggunakan text editor apa pun; perbedaan utamanya terletak pada kedalaman pemahaman dan metodologi keamanan sistem.",
        isCorrect: false
      },
      {
        text: "Vibe Coding mengandalkan prompt tanpa memahami kode secara mendalam, sedangkan Vibe Engineering menggunakan AI sebagai asisten untuk membangun sistem yang andal, aman, dan teruji berdasarkan pemahaman teknis kita.",
        rationale: "Vibe Engineering menuntut kita memahami output AI sepenuhnya, menjamin keamanan, dan melakukan pengujian otomatis daripada sekadar menyalin kode.",
        isCorrect: true
      },
      {
        text: "Vibe Engineering tidak memerlukan keahlian coding sama sekali karena AI melakukan segalanya.",
        rationale: "Salah. Justru Vibe Engineering membutuhkan pemahaman fundamental pemrograman yang kuat untuk mereview dan mengarahkan AI.",
        isCorrect: false
      },
      {
        text: "Vibe Coding hanya dilakukan menggunakan command line interface (CLI).",
        rationale: "Vibe Coding dan Vibe Engineering bisa dilakukan baik di CLI maupun di GUI.",
        isCorrect: false
      }
    ],
    hint: "Pikirkan tentang peran pemahaman mendalam programmer terhadap kualitas kode hasil AI."
  },
  {
    questionNumber: 2,
    question: "Mengapa dalam workflow Vibe Engineering kita disarankan membuat perencanaan (Planning) yang mendetail sebelum eksekusi kode?",
    answerOptions: [
      {
        text: "Agar kita bisa langsung menyalin kode tanpa perlu melakukan pengujian lagi di akhir.",
        rationale: "Pengujian tetap wajib dilakukan untuk menjamin kualitas perangkat lunak.",
        isCorrect: false
      },
      {
        text: "Agar AI tidak melakukan halusinasi dan kita dapat mengevaluasi serta merevisi alur kerja sebelum kode benar-benar dibuat.",
        rationale: "Perencanaan memberikan arah yang jelas, mendefinisikan batasan skema, endpoints, dan mencegah AI menghasilkan kode acak yang tidak sesuai standar kita.",
        isCorrect: true
      },
      {
        text: "Agar kita tidak perlu menggunakan Git atau sistem version control.",
        rationale: "Git tetap sangat dibutuhkan untuk versioning dan melakukan kolaborasi branch.",
        isCorrect: false
      },
      {
        text: "Agar program kita otomatis berjalan di production server tanpa konfigurasi.",
        rationale: "Planning adalah dokumen panduan desain, bukan konfigurasi otomatis ke server production.",
        isCorrect: false
      }
    ],
    hint: "Pertimbangkan apa yang terjadi jika AI diberikan instruksi yang terlalu singkat atau tanpa konteks."
  },
  {
    questionNumber: 3,
    question: "Strategi hemat biaya dan cerdas dalam Vibe Engineering adalah membagi tugas antara model LLM yang mahal dan murah. Bagaimana pembagian tugas yang tepat?",
    answerOptions: [
      {
        text: "Gunakan model murah untuk membuat planning arsitektur, lalu gunakan model mahal untuk menulis baris kode biasa.",
        rationale: "Ini tidak efisien karena merancang arsitektur membutuhkan kecerdasan logika tingkat tinggi yang dimiliki model mahal.",
        isCorrect: false
      },
      {
        text: "Gunakan model mahal untuk membuat planning yang detail dan matang, lalu instruksikan model murah untuk mengimplementasikan kode berdasarkan dokumen planning tersebut.",
        rationale: "Model mahal sangat bagus dalam berpikir logis/desain arsitektur, sedangkan model murah sangat cepat dan efisien untuk mengeksekusi instruksi koding terpandu.",
        isCorrect: true
      },
      {
        text: "Menggunakan model murah untuk segala proses karena hasilnya pasti sama persis.",
        rationale: "Model murah cenderung lebih ceroboh dan sering melakukan halusinasi jika diberi tugas arsitektur yang kompleks langsung.",
        isCorrect: false
      },
      {
        text: "Hanya menggunakan satu jenis model karena bertukar model akan merusak repositori kode.",
        rationale: "Mengganti model di tengah pengerjaan adalah hal lumrah dan sangat direkomendasikan untuk optimalisasi performa dan biaya.",
        isCorrect: false
      }
    ],
    hint: "Desain arsitektur memerlukan kapasitas berpikir analitis tinggi, sementara koding berbasis instruksi butuh kecepatan."
  },
  {
    questionNumber: 4,
    question: "Mengapa algoritma hashing password seperti Bcrypt secara sengaja dirancang lambat saat melakukan verifikasi?",
    answerOptions: [
      {
        text: "Karena JavaScript adalah bahasa pemrograman single-threaded yang tidak bisa memproses data dengan cepat.",
        rationale: "Lambatnya hashing Bcrypt adalah fitur keamanan bawaan algoritmanya, bukan karena batasan bahasa JavaScript.",
        isCorrect: false
      },
      {
        text: "Untuk mencegah kebocoran memori pada CPU server lokal.",
        rationale: "Tujuan utamanya adalah keamanan autentikasi terhadap peretas, bukan manajemen memori CPU.",
        isCorrect: false
      },
      {
        text: "Untuk mempersulit serangan brute force dengan cara memperbanyak putaran iterasi kunci (work factor).",
        rationale: "Dengan work factor (misal 10), proses hashing membutuhkan ribuan putaran yang membuatnya lambat secara mikro. Hal ini menyulitkan komputer peretas menebak jutaan kombinasi kata sandi.",
        isCorrect: true
      },
      {
        text: "Agar database MySQL memiliki waktu luang untuk melakukan sinkronisasi data.",
        rationale: "Bcrypt bekerja di level server aplikasi sebelum menyimpannya ke database, tidak ada hubungannya dengan sinkronisasi database.",
        isCorrect: false
      }
    ],
    hint: "Ingat istilah serangan tebak paksa kata sandi secara massal."
  },
  {
    questionNumber: 5,
    question: "Dalam materi, apa yang disorot mengenai keamanan data sensitif saat melakukan vibe coding?",
    answerOptions: [
      {
        text: "Kita boleh memberikan data kredensial production ke AI asalkan menggunakan model berbayar.",
        rationale: "Meskipun berbayar, mengirimkan data sensitif atau kredensial production ke server luar adalah pelanggaran keamanan fatal.",
        isCorrect: false
      },
      {
        text: "Selalu jalankan unit testing langsung di server database production.",
        rationale: "Unit testing harus dijalankan di lingkungan lokal atau staging untuk mencegah kerusakan data asli.",
        isCorrect: false
      },
      {
        text: "Jangan pernah menempelkan (paste) data sensitif, seperti database production atau kunci akses rahasia perusahaan, ke dalam prompt AI.",
        rationale: "AI adalah pihak ketiga. Memberikan akses kredensial nyata berisiko terjadinya penghapusan data atau kebocoran informasi rahasia.",
        isCorrect: true
      },
      {
        text: "Kita harus mengenkripsi semua file TypeScript sebelum membukanya di editor AI.",
        rationale: "AI membutuhkan file teks asli untuk menganalisis kode; mengenkripsinya akan membuat AI tidak bisa membantu kita.",
        isCorrect: false
      }
    ],
    hint: "Pikirkan tentang batasan privasi data antara komputer lokal Anda dan server penyedia LLM."
  },
  {
    questionNumber: 6,
    question: "Ketika terjadi bug di mana query database gagal karena panjang karakter nama melebihi 255 batas skema MySQL, tindakan apa yang mencerminkan workflow Vibe Engineering?",
    answerOptions: [
      {
        text: "Langsung mengubah kode secara manual tanpa memberitahu AI agar cepat selesai.",
        rationale: "Ini melanggar prinsip kolaborasi dengan AI asisten dan membuat dokumen perencanaan kita tidak sinkron.",
        isCorrect: false
      },
      {
        text: "Meminta AI menganalisis bug, membuat issue perencanaan perbaikan (bugfix plan) yang rapi, lalu menginstruksikan AI mengimplementasikannya secara aman beserta pengujiannya.",
        rationale: "Ini adalah alur terstruktur: menganalisis dengan model cerdas, mencatat perbaikan di issue, menerapkan validasi di sisi kode router, lalu menguji kembali.",
        isCorrect: true
      },
      {
        text: "Menghapus database MySQL dan menggantinya dengan NoSQL agar tidak ada batasan tipe data.",
        rationale: "Mengganti seluruh arsitektur database hanya karena bug validasi input adalah keputusan ekstrem yang tidak bijak.",
        isCorrect: false
      },
      {
        text: "Mengabaikan bug tersebut karena pengguna jarang menginput nama yang sangat panjang.",
        rationale: "Mengabaikan validasi input dapat memicu kebocoran raw SQL error yang membahayakan keamanan sistem.",
        isCorrect: false
      }
    ],
    hint: "Fokus pada pendekatan terstruktur: Analisis -> Perencanaan perbaikan -> Implementasi -> Pengujian ulang."
  },
  {
    questionNumber: 7,
    question: "Apa fungsi utama dari Swager API documentation yang diimplementasikan di kelas menggunakan Elicia JS?",
    answerOptions: [
      {
        text: "Untuk mempercepat eksekusi query database MySQL.",
        rationale: "Swagger adalah alat dokumentasi UI untuk API, tidak memengaruhi performa database.",
        isCorrect: false
      },
      {
        text: "Untuk menyembunyikan endpoint penting dari akses publik.",
        rationale: "Swagger justru mengekspos spesifikasi endpoint agar mudah dibaca dan diuji oleh pengguna lain.",
        isCorrect: false
      },
      {
        text: "Untuk memvisualisasikan seluruh endpoint API secara interaktif, lengkap dengan contoh request dan respons, sehingga memudahkan pengembang lain atau AI dalam memahami kontrak data.",
        rationale: "Swagger memudahkan pengujian manual lewat UI browser dan membuat kontrak data API sangat transparan bagi tim developer maupun AI asisten lainnya.",
        isCorrect: true
      },
      {
        text: "Sebagai generator otomatis kode backend dari database skema.",
        rationale: "Drizzle ORM adalah alat untuk memetakan skema database ke kode, bukan Swagger.",
        isCorrect: false
      }
    ],
    hint: "Swagger memberikan antarmuka visual di browser tempat kita bisa melihat daftar route dan mengeklik 'Try it out'."
  },
  {
    questionNumber: 8,
    question: "Bcrypt work factor 10 menghasilkan jumlah putaran hashing sebanyak berapa kali?",
    answerOptions: [
      {
        text: "10 kali putaran saja.",
        rationale: "Work factor pada Bcrypt bersifat eksponensial basis 2, bukan linear perkalian.",
        isCorrect: false
      },
      {
        text: "1.024 kali putaran.",
        rationale: "Rumus putaran Bcrypt adalah $2^{work\\_factor}$. Jadi, $2^{10} = 1024$ putaran hashing.",
        isCorrect: true
      },
      {
        text: "10.000 kali putaran.",
        rationale: "Perhitungan eksponensial $2^{10}$ tidak menghasilkan 10.000.",
        isCorrect: false
      },
      {
        text: "1.000.000 kali putaran.",
        rationale: "Angka satu juta adalah putaran untuk work factor yang jauh lebih tinggi (sekitar 20), yang akan membuat server sangat lambat.",
        isCorrect: false
      }
    ],
    hint: "Gunakan rumus eksponensial pangkat dua: $2^x$ di mana $x$ adalah work factor."
  },
  {
    questionNumber: 9,
    question: "Saat mereview Pull Request hasil generate AI, mengapa disarankan untuk melakukan Code Review secara kritis dan tidak langsung memergemnya?",
    answerOptions: [
      {
        text: "Karena AI sering sengaja memasukkan virus berbahaya ke dalam repositori kita.",
        rationale: "AI tidak sengaja merusak, tetapi keterbatasan pemahamannya bisa menghasilkan kode yang tidak optimal atau berulang.",
        isCorrect: false
      },
      {
        text: "Untuk memastikan kode bebas dari duplikasi logika, menerapkan best practice, memiliki keamanan yang baik, dan sesuai dengan standar performa arsitektur kita.",
        rationale: "Prinsip Vibe Engineering menekankan bahwa kitalah penanggung jawab akhir dari kualitas kode tersebut. Kita harus memastikan tidak ada redudansi logika atau celah keamanan.",
        isCorrect: true
      },
      {
        text: "Agar kita terlihat sibuk di depan manajer proyek.",
        rationale: "Review kode dilakukan demi kualitas perangkat lunak, bukan sekadar kosmetik performa kerja.",
        isCorrect: false
      },
      {
        text: "Karena GitHub akan memblokir akun yang langsung melakukan merge otomatis tanpa review.",
        rationale: "GitHub mengizinkan merge langsung tanpa review, namun hal itu sangat tidak disarankan demi kualitas kode tim.",
        isCorrect: false
      }
    ],
    hint: "Kita adalah 'mandor/arsitek' yang bertanggung jawab penuh atas hasil kerja 'tukang' (AI)."
  },
  {
    questionNumber: 10,
    question: "Arsitektur kode apa yang diterapkan pada project kelas Vibe Coding ini, yang memisahkan tanggung jawab antara router, logika bisnis, dan database?",
    answerOptions: [
      {
        text: "Monolithic Spaghetti Architecture.",
        rationale: "Arsitektur spaghetti justru menyatukan semua kode tanpa struktur yang jelas, sangat berlawanan dengan praktik terbaik.",
        isCorrect: false
      },
      {
        text: "Layered Architecture (Arsitektur Berlapis).",
        rationale: "Kita membagi kode menjadi SRC -> Roads (Router/Elicia), Services (Logika bisnis), dan Schema (Database/Drizzle) demi kemudahan pengujian dan pemeliharaan.",
        isCorrect: true
      },
      {
        text: "Serverless Micro-Frontend.",
        rationale: "Aplikasi ini dirancang sebagai service backend berlapis tradisional, bukan micro-frontend.",
        isCorrect: false
      },
      {
        text: "No-Code Cloud Pipeline.",
        rationale: "Kita tetap menulis dan mengarahkan kode program, sehingga ini bukan pendekatan No-Code.",
        isCorrect: false
      }
    ],
    hint: "Pikirkan tentang pola pemisahan tanggung jawab (Separation of Concern) berdasarkan folder roads, services, dan skema."
  }
];

export default function App() {
  // Navigation & Tabs State
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'chat' | 'quiz' | 'simulator'
  const [currentChapter, setCurrentChapter] = useState(1);
  
  // Chat State
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Halo teman-teman! Selamat datang di Kelas Interaktif Vibe Coding & Vibe Engineering. Saya adalah tutor asisten Anda di sini. Anda bebas menanyakan apa saja tentang materi kita, mulai dari pergeseran mindset, pemilihan model LLM, cara setup Bun + Elicia JS, hingga alur kerja merancang unit testing. Apa yang ingin teman-teman diskusikan hari ini?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // tracks user's choice for each question

  // Simulator State
  const [simulatorStep, setSimulatorStep] = useState(0); // 0 to 5
  const [simLogs, setSimLogs] = useState([]);
  const [simRunning, setSimRunning] = useState(false);

  // Scroll Chat to Bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Chat Submit (with real Gemini API integration)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // API call setup
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // resolved at runtime by sandbox
      const systemInstruction = VIBE_CODING_CONTEXT + "\nJawablah dengan nada mengajar yang antusias, ramah, dan solutif.";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      // Build context payload
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Berikut adalah pertanyaan dari siswa: "${userMsg.text}". Jawablah berdasarkan materi pelajaran Vibe Coding untuk Programmer.`
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        }
      };

      // Implement backoff retry mechanism (max 5 retries)
      let response;
      let delay = 1000;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) break;
        } catch (err) {
          if (attempt === 4) throw err;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      }

      if (!response || !response.ok) {
        throw new Error("Gagal terhubung dengan asisten tutor AI.");
      }

      const data = await response.json();
      const answerText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Maaf teman-teman, saya tidak dapat memproses jawaban saat ini. Silakan coba tanyakan kembali ya!";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: answerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: "Waduh teman-teman, sepertinya koneksi kita sedang bermasalah. Tapi jangan khawatir! Vibe Coding mengajarkan kita untuk selalu tangguh. Coba kirim pesan sekali lagi ya, atau cek materi di tab Modul Belajar!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Quiz Logic
  const handleOptionSelect = (index) => {
    if (quizSubmitted) return;
    setSelectedOption(index);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || quizSubmitted) return;
    
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    const isCorrect = currentQuestion.answerOptions[selectedOption].isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 10);
    }

    // Save answer choice
    setUserAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: currentQuestion.answerOptions[selectedOption].text,
        isCorrect: isCorrect,
        rationale: currentQuestion.answerOptions[selectedOption].rationale,
        correctText: currentQuestion.answerOptions.find(o => o.isCorrect).text
      }
    ]);

    setQuizSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setShowHint(false);
    
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
    setShowHint(false);
    setUserAnswers([]);
    setQuizStarted(true);
  };

  // Simulator Actions
  const runSimulatorStep = async (stepIndex) => {
    if (simRunning) return;
    setSimRunning(true);
    
    const stepsConfig = [
      {
        title: "Fase 1: Planning dengan Model Cerdas (Gemini Pro / Claude Opus)",
        logs: [
          "[$] gh issue create --title 'Fitur Registrasi User' --body 'Membuat database MySQL, tabel user, routing Elicia JS, dan hashing Bcrypt'",
          "[AI-Pro] Menganalisis kebutuhan arsitektur...",
          "[AI-Pro] Membuat skema perencanaan detail di issue.md...",
          "[OK] Perencanaan berhasil dibuat dan diposting ke GitHub Issues!"
        ]
      },
      {
        title: "Fase 2: Implementasi Kode dengan Model Hemat (Gemini Flash)",
        logs: [
          "[$] git checkout -b feature/registrasi-user",
          "[AI-Flash] Membaca instruksi planning dari GitHub Issue #1...",
          "[AI-Flash] Generate file src/schema.ts (Drizzle ORM)...",
          "[AI-Flash] Generate file src/services/user-service.ts...",
          "[AI-Flash] Generate file src/roads/user-roads.ts...",
          "[OK] File kode berhasil dibuat di lingkungan lokal!"
        ]
      },
      {
        title: "Fase 3: Automated & Manual Code Review",
        logs: [
          "[$] gh pr create --title 'Implementasi Registrasi User'",
          "[AI-Pro-Reviewer] Menelaah file perubahan...",
          "[Peringatan] Ditemukan duplikasi ekstraksi token di user-service & session-service!",
          "[Rekomendasi] Gunakan middleware / Elicia Derive untuk ekstraksi token terpusat.",
          "[$] Menginstruksikan AI memperbaiki sesuai komentar review...",
          "[OK] Kode direfaktor dengan bersih dan siap dimerge!"
        ]
      },
      {
        title: "Fase 4: Pembuatan & Eksekusi Unit Test",
        logs: [
          "[AI-Flash] Generate skenario pengujian lengkap di test/user-api.test.ts...",
          "[$] bun test",
          "[TEST] ✓ POST /api/users - Registrasi Sukses (200ms)",
          "[TEST] ✓ POST /api/users - Gagal (Email Sudah Terdaftar) (120ms)",
          "[TEST] ✓ POST /api/users - Gagal (Nama > 255 karakter) (80ms)",
          "[OK] Semua unit test berhasil lolos (100% pass)!"
        ]
      },
      {
        title: "Fase 5: Dokumentasi Lengkap & Swagger",
        logs: [
          "[AI-Flash] Membaca seluruh fungsionalitas aplikasi...",
          "[AI-Flash] Menambahkan Swagger OpenAPI spec di index.ts...",
          "[AI-Flash] Memperbarui README.md dengan struktur folder, instruksi instalasi, dan panduan API.",
          "[$] git add . && git commit -m 'docs: add swagger and update readme' && git push",
          "[OK] Dokumentasi siap dibaca oleh tim developer!"
        ]
      }
    ];

    const currentStepConfig = stepsConfig[stepIndex];
    setSimLogs((prev) => [...prev, `>>> MEMULAI: ${currentStepConfig.title}`]);
    
    for (const log of currentStepConfig.logs) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSimLogs((prev) => [...prev, log]);
    }
    
    setSimLogs((prev) => [...prev, `[SELESAI] Langkah ${stepIndex + 1} tuntas!\n`]);
    setSimulatorStep(stepIndex + 1);
    setSimRunning(false);
  };

  const resetSimulator = () => {
    setSimulatorStep(0);
    setSimLogs([]);
    setSimRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Vibe Coding & Engineering Assistant
            </h1>
            <p className="text-xs text-slate-400">Belajar Cerdas Mengarahkan AI bersama Programmer Zaman Now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Arsitek Mindset Shift
          </span>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 gap-4 overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 p-1 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-x-auto lg:overflow-x-visible">
          <button
            onClick={() => setActiveTab('modules')}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'modules'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="hidden lg:inline">Modul Belajar</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="hidden lg:inline">Workflow Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="hidden lg:inline">Tanya Tutor AI</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden lg:inline">Uji Pemahaman (Kuis)</span>
          </button>
        </aside>

        {/* Dynamic Content Window */}
        <main className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col min-h-[500px] lg:h-[calc(100vh-120px)] shadow-2xl">
          
          {/* TAB 1: MODULES */}
          {activeTab === 'modules' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Sub-Sidebar (Chapter List) */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/40 p-3 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                <button
                  onClick={() => setCurrentChapter(1)}
                  className={`flex-1 md:flex-none text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    currentChapter === 1 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BAB 1: Pergeseran Mindset
                </button>
                <button
                  onClick={() => setCurrentChapter(2)}
                  className={`flex-1 md:flex-none text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    currentChapter === 2 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BAB 2: Ekosistem, Tools & Stack
                </button>
                <button
                  onClick={() => setCurrentChapter(3)}
                  className={`flex-1 md:flex-none text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    currentChapter === 3 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BAB 3: Alur Vibe Engineering
                </button>
                <button
                  onClick={() => setCurrentChapter(4)}
                  className={`flex-1 md:flex-none text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    currentChapter === 4 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BAB 4: Keamanan & Best Practices
                </button>
              </div>

              {/* Right content view */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {currentChapter === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                      <span>Materi Pokok #1</span>
                      <span className="h-1 w-1 bg-indigo-400 rounded-full"></span>
                      <span>Konsep Vibe</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">Bab 1: Menghadapi Pergeseran Paradigma Pemrograman</h2>
                    
                    {/* Visual Card */}
                    <div className="bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/10 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-5">
                      <div className="p-4 bg-indigo-500/10 rounded-xl">
                        <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100">Mindset Baru: Navigator & Arsitek</h3>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                          Dahulu, seorang programmer bertindak sebagai tukang bangunan yang menyusun batu bata kode baris demi baris. Kini, AI bertindak sebagai tukang yang sangat produktif, sedangkan kita adalah <strong>Arsitek (Navigator)</strong> yang menentukan desain cetak biru.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                          Vibe Coding Biasa
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          Seringkali tidak memahami kode secara mendalam. Hanya mengandalkan prompt copypasta, mengecek hasil instan, tanpa mengerti kualitas keamanan, efisiensi arsitektur, atau kesiapan rilis.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                        <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                          <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
                          Vibe Engineering
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          Pendekatan matang seorang programmer berpengalaman yang memperlakukan AI sebagai asisten ahli. Menjamin kode andal, aman, terstruktur melalui planning terarah, automated testing, dan integrasi berkelanjutan.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-lg font-bold text-white mb-2">Poin Inti Pengajaran</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm text-slate-300 leading-relaxed">
                        <li>Fokus utama bergeser: dari menjawab <span className="text-indigo-400 font-mono">"Bagaimana kodenya?"</span> menjadi mendefinisikan <span className="text-indigo-400 font-mono">"Sistem apa yang ingin dibuat?"</span>.</li>
                        <li>Sebagai engineer, tanggung jawab akhir berada di pundak Anda. Pemahaman mendalam logika kode mutlak diperlukan untuk mengoreksi bias AI.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {currentChapter === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                      <span>Materi Pokok #2</span>
                      <span className="h-1 w-1 bg-indigo-400 rounded-full"></span>
                      <span>Teknologi</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">Bab 2: Ekosistem Model LLM, Tools, & Stack Modern</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Untuk memaksimalkan Vibe Engineering, seorang programmer perlu memahami ekosistem tools yang dapat diintegrasikan secara sinergis.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <h3 className="font-bold text-indigo-300 text-sm">Large Language Models</h3>
                        <p className="text-xs text-slate-400 mt-2">
                          Pilihan LLM bervariasi dari Anthropic (Claude Opus/Sonnet/Haiku), OpenAI (GPT), hingga Google Gemini. Penting melihat benchmark berkala (seperti LMSYS) karena performa logika koding terus berevolusi.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <h3 className="font-bold text-indigo-300 text-sm">Vibe Editor / Agents</h3>
                        <p className="text-xs text-slate-400 mt-2">
                          Mencakup Editor berbasis GUI seperti <strong>Cursor</strong>, <strong>Windsurf</strong>, atau <strong>Google Anti Gravity</strong>, serta tool CLI pendukung seperti GitHub CLI (<span className="text-pink-400 font-mono">gh</span>).
                        </p>
                      </div>
                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <h3 className="font-bold text-indigo-300 text-sm">Modern Stack</h3>
                        <p className="text-xs text-slate-400 mt-2">
                          Di kelas ini dipraktikkan menggunakan <strong>Bun</strong> (runtime JavaScript super cepat), <strong>Elicia JS</strong> (web framework), dan <strong>Drizzle ORM</strong> yang terhubung ke database <strong>MySQL</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mt-6">
                      <h3 className="text-sm font-bold text-white mb-2">Mengapa Bun & Elicia JS?</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Bun menyediakan runtime minimalis tanpa seremoni setup yang panjang, lengkap dengan testing runner bawaan (<span className="text-pink-400 font-mono">bun test</span>). Elicia JS sangat ringan, mendukung validasi tipe data statis yang kuat, dan memiliki plugin ekosistem OpenAPI yang sangat disukai AI untuk mendokumentasikan API.
                      </p>
                    </div>
                  </div>
                )}

                {currentChapter === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                      <span>Materi Pokok #3</span>
                      <span className="h-1 w-1 bg-indigo-400 rounded-full"></span>
                      <span>Workflow</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">Bab 3: Alur Kerja (Workflow) Emas Vibe Engineering</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Langkah-langkah profesional dalam berkolaborasi dengan asisten AI agar proyek aman dari bug tersembunyi.
                    </p>

                    {/* Timeline */}
                    <div className="space-y-6 relative border-l border-slate-800 pl-6 ml-2 mt-4">
                      {/* Step 1 */}
                      <div className="relative">
                        <span className="absolute -left-10 top-0 bg-indigo-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold border-4 border-slate-900">
                          1
                        </span>
                        <h3 className="font-bold text-white text-base">Fase Planning (Perencanaan)</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Gunakan model LLM tercerdas (misal Claude Opus atau Gemini Pro) untuk mendesain arsitektur, mendefinisikan skema, endpoints, dan validasi input. Simpan hasil perencanaan sebagai file <span className="text-pink-400 font-mono">issue.md</span> atau di GitHub Issues.
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="relative">
                        <span className="absolute -left-10 top-0 bg-slate-800 text-slate-300 rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold border-4 border-slate-900">
                          2
                        </span>
                        <h3 className="font-bold text-white text-base">Fase Implementasi Terpandu</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Umpankan rencana detail yang sudah disepakati ke model yang lebih murah dan cepat (seperti Gemini Flash). Model murah ini hanya perlu mengikuti cetak biru dari tahap planning, sehingga meminimalisasi kesalahan logika.
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <span className="absolute -left-10 top-0 bg-slate-800 text-slate-300 rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold border-4 border-slate-900">
                          3
                        </span>
                        <h3 className="font-bold text-white text-base">Automated Code Review</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Gunakan asisten AI eksternal atau model berbeda untuk mereview kode yang sudah dihasilkan. Cari peluang refaktorisasi, redundansi kode, atau isu keamanan sebelum merge ke branch utama.
                        </p>
                      </div>

                      {/* Step 4 */}
                      <div className="relative">
                        <span className="absolute -left-10 top-0 bg-slate-800 text-slate-300 rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold border-4 border-slate-900">
                          4
                        </span>
                        <h3 className="font-bold text-white text-base">Unit Testing Komprehensif</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Minta AI untuk menuliskan berkas testing (<span className="text-pink-400 font-mono">*.test.ts</span>) berisi seluruh skenario sukses maupun gagal secara lengkap guna memverifikasi kebenaran kode logika yang telah dibuat.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentChapter === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                      <span>Materi Pokok #4</span>
                      <span className="h-1 w-1 bg-indigo-400 rounded-full"></span>
                      <span>Keamanan</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">Bab 4: Keamanan Data & Best Practices</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Dalam Vibe Engineering, terdapat batasan ketat demi menjaga kredibilitas, kualitas, serta keamanan data perusahaan Anda.
                    </p>

                    <div className="space-y-4 mt-4">
                      <div className="p-4 bg-red-950/20 border border-red-500/10 rounded-xl">
                        <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Larangan Paste Data Sensitif
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          Sangat dilarang membagikan rahasia kredensial (secrets), API Keys, atau data real database production ke dalam prompt LLM publik. Model AI ditenagai server luar yang menyimpan histori masukan prompt.
                        </p>
                      </div>

                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Memahami Logika Kriptografi Hashing (Bcrypt)
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          Hashing berbeda dengan enkripsi. Enkripsi bersifat dua arah karena memiliki kunci deskripsi, sedangkan hashing satu arah. Bcrypt sengaja dikembangkan agar lambat di sisi CPU. Dengan work factor default <span className="font-mono text-indigo-400">10</span>, ia akan mengulang kalkulasi sebanyak <span className="font-mono text-indigo-400">2^10 = 1024 putaran</span>, membuat serangan brute force dari peretas mustahil secara komputasi.
                        </p>
                      </div>

                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Mitigasi Halusinasi AI
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          AI dapat menciptakan asumsi atau fungsi fiktif jika tidak memiliki pembatasan yang eksplisit. Berikan prompt berisi format masukan (request body) dan keluaran (response body) yang Anda inginkan secara presisi dalam format JSON.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WORKFLOW SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Vibe Engineering Workflow Simulator</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Praktikkan alur kerja terstruktur dari materi untuk melihat bagaimana planning, koding, review, dan dokumentasi dilakukan secara aman.
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex-1 flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                      simulatorStep >= step 
                        ? 'bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {step}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 hidden md:block text-center">
                      {step === 1 && "Planning"}
                      {step === 2 && "Koding"}
                      {step === 3 && "Review"}
                      {step === 4 && "Unit Test"}
                      {step === 5 && "Docs"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Console Output Panel */}
              <div className="flex-1 bg-black rounded-xl p-4 font-mono text-xs text-emerald-400 border border-slate-800 min-h-[220px] max-h-[350px] overflow-y-auto space-y-2 flex flex-col">
                <div className="text-slate-500">// Vibe Engineering CLI Simulation console - Ready</div>
                {simLogs.map((log, index) => (
                  <div key={index} className={
                    log.startsWith(">>>") ? "text-indigo-400 font-bold" : 
                    log.startsWith("[OK]") ? "text-emerald-300 font-semibold" :
                    log.startsWith("[Peringatan]") ? "text-yellow-400" :
                    log.startsWith("[$]") ? "text-slate-300" : "text-emerald-400"
                  }>
                    {log}
                  </div>
                ))}
                {simRunning && (
                  <div className="flex items-center gap-2 text-slate-400 animate-pulse mt-1">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping"></span>
                    <span>AI sedang memproses berkas...</span>
                  </div>
                )}
              </div>

              {/* Interactive buttons */}
              <div className="flex gap-3 justify-end">
                {simulatorStep > 0 && (
                  <button
                    onClick={resetSimulator}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800"
                  >
                    Ulang Simulator
                  </button>
                )}
                {simulatorStep < 5 ? (
                  <button
                    onClick={() => runSimulatorStep(simulatorStep)}
                    disabled={simRunning}
                    className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {simRunning ? "Memproses..." : `Jalankan Langkah ${simulatorStep + 1}`}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Selamat! Alur kerja Vibe Engineering berhasil disimulasikan!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CHAT TUTOR */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
              
              {/* Tutor Header Info */}
              <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                    EK
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Mas Eko Kurniawan - Tutor AI</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[11px] text-slate-400">Aktif mengajar Vibe Engineering</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-800/40 px-2 py-1 rounded">
                  Bertenaga Gemini 2.5 Flash
                </div>
              </div>

              {/* Chat Window Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}>
                      <div className="text-[10px] text-slate-400/80 mb-1 flex items-center justify-between gap-4">
                        <span className="font-bold uppercase tracking-wider">{msg.role === 'user' ? 'Siswa' : 'Mas Eko'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className="whitespace-pre-line prose prose-invert max-w-none text-xs md:text-sm">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-bl-none p-4 max-w-[80%]">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"></span>
                        <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Suggestions */}
              <div className="px-4 py-2 bg-slate-950/20 flex gap-2 overflow-x-auto border-t border-slate-800">
                <button
                  onClick={() => setInputMessage("Apa itu Vibe Engineering dan bedanya dengan Vibe Coding biasa?")}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Apa beda Coding vs Engineering?
                </button>
                <button
                  onClick={() => setInputMessage("Bagaimana alur workflow planning yang disarankan?")}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Bagaimana alur Planning?
                </button>
                <button
                  onClick={() => setInputMessage("Kenapa kita harus menggunakan bcrypt dengan work factor 10?")}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Kenapa Bcrypt harus lambat?
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pertanyaan teman-teman di sini..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>

            </div>
          )}

          {/* TAB 4: QUIZ EVALUATION */}
          {activeTab === 'quiz' && (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
              {!quizStarted && !quizCompleted && (
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 space-y-6">
                  <div className="h-16 w-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-500/20">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-white">Evaluasi Pemahaman Vibe Coding</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Selesaikan 10 pertanyaan mendalam seputar materi Vibe Engineering untuk programmer. Anda akan langsung menerima ulasan logis setelah menjawab setiap pertanyaan.
                    </p>
                  </div>
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-600/10"
                  >
                    Mulai Kuis Evaluasi
                  </button>
                </div>
              )}

              {quizStarted && !quizCompleted && (
                <div className="space-y-6">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Pertanyaan</span>
                      <h3 className="text-sm font-bold text-slate-200">
                        {currentQuestionIndex + 1} dari {QUIZ_QUESTIONS.length}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Akumulasi Nilai</span>
                      <span className="text-sm font-bold text-slate-200">{score} Poin</span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="bg-slate-950 p-5 border border-slate-800 rounded-2xl">
                    <p className="text-base text-white font-medium leading-relaxed">
                      {QUIZ_QUESTIONS[currentQuestionIndex].question}
                    </p>
                  </div>

                  {/* Hint Toggle */}
                  <div>
                    {!showHint ? (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tampilkan Petunjuk (Hint)
                      </button>
                    ) : (
                      <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-3 text-xs text-indigo-300 italic leading-relaxed">
                        <strong>Petunjuk:</strong> {QUIZ_QUESTIONS[currentQuestionIndex].hint}
                      </div>
                    )}
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {QUIZ_QUESTIONS[currentQuestionIndex].answerOptions.map((opt, idx) => {
                      let btnStyle = "border-slate-800 text-slate-300 hover:bg-slate-800/40 bg-slate-900/40";
                      
                      if (selectedOption === idx) {
                        btnStyle = "border-indigo-500 bg-indigo-500/10 text-indigo-300";
                      }
                      
                      if (quizSubmitted) {
                        if (opt.isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold";
                        } else if (selectedOption === idx) {
                          btnStyle = "border-red-500 bg-red-500/10 text-red-400";
                        } else {
                          btnStyle = "border-slate-800 text-slate-600 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="h-5 w-5 rounded-full shrink-0 border flex items-center justify-center text-xs font-bold border-slate-600 text-slate-400 bg-slate-850">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Ulasan Jawaban (Rationale) */}
                  {quizSubmitted && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ulasan Logis:</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {QUIZ_QUESTIONS[currentQuestionIndex].answerOptions[selectedOption]?.rationale}
                      </p>
                    </div>
                  )}

                  {/* Submit / Next Button */}
                  <div className="flex justify-end pt-4">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedOption === null}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/10 disabled:opacity-50"
                      >
                        Kirim Jawaban
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/10"
                      >
                        {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil Akhir"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Completed Certificate Screen */}
              {quizCompleted && (
                <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto py-12 space-y-6">
                  
                  {/* Interactive Certificate Card */}
                  <div className="w-full bg-slate-950 border-2 border-indigo-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
                    
                    {/* Glowing BG Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-36 w-36 bg-indigo-500/10 rounded-full blur-2xl"></div>

                    {/* Badge Icon */}
                    <div className="h-20 w-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-500/20 mb-4 animate-bounce">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Sertifikat Penyelesaian</h2>
                    <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mt-1">Vibe Engineering Course</p>

                    <div className="w-full border-t border-slate-800 my-4"></div>

                    <p className="text-xs text-slate-400">Selamat kepada Pengguna yang telah menuntaskan kuis evaluasi dengan hasil:</p>
                    
                    <div className="my-4">
                      <span className="text-5xl font-black text-indigo-400">{score}</span>
                      <span className="text-slate-500 text-lg font-semibold"> / 100 Poin</span>
                    </div>

                    <p className="text-xs text-slate-300 italic max-w-md leading-relaxed">
                      "Kini teman-teman telah menguasai esensi Vibe Engineering, bukan sekadar coder biasa yang copypasta, melainkan arsitek handal penentu kualitas sistem!"
                    </p>

                    <div className="w-full border-t border-slate-800 my-4"></div>
                    
                    <p className="text-[10px] text-slate-500">Diverifikasi secara interaktif oleh Vibe Coding Assistant • Juni 2026</p>
                  </div>

                  {/* Review Answers Collapse */}
                  <div className="w-full space-y-3">
                    <h3 className="font-bold text-white text-sm">Review Jawaban Anda:</h3>
                    <div className="space-y-2">
                      {userAnswers.map((ans, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-1">
                          <p className="font-bold text-slate-300">Pertanyaan {idx + 1}: {ans.question}</p>
                          <p className="text-slate-400">Pilihan Anda: <span className={ans.isCorrect ? "text-emerald-400" : "text-red-400"}>{ans.selected}</span></p>
                          {!ans.isCorrect && (
                            <p className="text-emerald-400">Jawaban Benar: {ans.correctText}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetQuiz}
                    className="w-full px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 transition text-xs font-bold"
                  >
                    Coba Kuis Lagi
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Footer Info */}
      <footer className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        <p>© 2026 Vibe Coding Assistant • Terinspirasi dari Programmer Zaman Now (Eko Kurniawan)</p>
      </footer>
    </div>
  );
}

```
