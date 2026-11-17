// Technical Question Bank: Core CS, Frontend, Data Analytics, Cybersecurity & Programming
export const TECHNICAL_QUESTIONS = [
  // --- FRONTEND & JAVASCRIPT ---
  {
    id: 'tech_fe_01',
    category: 'Frontend & Web',
    topic: 'React Fundamentals',
    companyTags: ['frontend_track', 'product_sde1', 'accenture_ase'],
    difficulty: 'Intermediate',
    question: 'How does React\'s Virtual DOM improve web application performance during frequent UI state updates?',
    options: [
      'It writes directly to hardware GPU memory to bypass browser rendering',
      'It maintains an in-memory representation of the real DOM, diffs changes using a heuristic algorithm, and batches only the necessary minimal updates to the real DOM',
      'It replaces CSS styles with precompiled WebAssembly binaries',
      'It disables all HTML repaints and reflows permanently'
    ],
    correctIndex: 1,
    explanation: 'Updating the real browser DOM is computationally expensive due to recalculating styles, layout (reflow), and repaint. React keeps a lightweight virtual copy in memory. When state changes, it generates a new Virtual DOM tree, compares (diffs) it with the previous snapshot, and patches ONLY the dirty nodes on the actual DOM in a single batched operation.',
    tip: 'Keywords for interviewers: "Reconciliation algorithm, Diffing, Batched DOM mutations, avoiding full reflow/repaints".'
  },
  {
    id: 'tech_fe_02',
    category: 'Frontend & Web',
    topic: 'JavaScript Engine & Async',
    companyTags: ['frontend_track', 'product_sde1'],
    difficulty: 'Intermediate',
    question: 'In the JavaScript Event Loop, what is the exact execution priority order between Microtasks (e.g. Promise.then, queueMicrotask) and Macrotasks (e.g. setTimeout, setInterval)?',
    options: [
      'Macrotasks always execute before any Promise callbacks',
      'The engine alternates strictly one Macrotask followed by one Microtask',
      'After the synchronous call stack empties, ALL pending Microtasks are executed to completion before the next Macrotask is picked from the task queue',
      'They run in parallel on separate operating system threads'
    ],
    correctIndex: 2,
    explanation: 'JavaScript has a single-threaded event loop. After executing synchronous code in the Call Stack, the engine empties the Microtask Queue (Promise.then, MutationObserver) completely before fetching the next task from the Macrotask Queue (setTimeout, setInterval). Even if new microtasks are scheduled during microtask processing, they are drained before moving to macrotasks.',
    tip: 'Classic output question: `setTimeout(() => console.log(1), 0); Promise.resolve().then(() => console.log(2)); console.log(3);` -> Output is: 3, 2, 1.'
  },
  {
    id: 'tech_fe_03',
    category: 'Frontend & Web',
    topic: 'CSS Layout & Modern UI',
    companyTags: ['frontend_track'],
    difficulty: 'Beginner',
    question: 'When should a modern frontend developer choose CSS Grid over CSS Flexbox?',
    options: [
      'CSS Grid is only for mobile screens, while Flexbox is for desktop screens',
      'CSS Flexbox is designed for 1-dimensional layouts (a single row OR a single column), while CSS Grid is designed for 2-dimensional layouts (simultaneous rows AND columns)',
      'CSS Grid has been deprecated in favor of CSS Subgrid',
      'CSS Flexbox does not support responsive breakpoints'
    ],
    correctIndex: 1,
    explanation: 'Flexbox is content-driven and handles one dimension at a time (either distribution along the main axis or alignment on the cross axis). CSS Grid is container-driven and simultaneously controls both columns and rows in two dimensions, making it the ideal choice for overall page layouts and multi-row/column grids.',
    tip: 'Golden rule: "Flexbox for components & 1D alignment; Grid for page structure & 2D alignment".'
  },

  // --- DATA ANALYTICS & SQL ---
  {
    id: 'tech_data_01',
    category: 'Data Analytics',
    topic: 'SQL Window Functions',
    companyTags: ['data_analyst_track', 'product_sde1', 'infosys_sp'],
    difficulty: 'Intermediate',
    question: 'In SQL analytics, what is the difference between `RANK()` and `DENSE_RANK()` when dealing with tied values (e.g., two items tied for 1st place)?',
    options: [
      'RANK() leaves gaps in the subsequent ranking numbers (e.g., 1, 1, 3), whereas DENSE_RANK() does not skip rank values (e.g., 1, 1, 2)',
      'DENSE_RANK() sorts in ascending order, while RANK() sorts only descending',
      'RANK() can only be used with numeric columns, while DENSE_RANK() requires string columns',
      'There is no difference; they are aliases in standard ANSI SQL'
    ],
    correctIndex: 0,
    explanation: 'When values tie:\n`ROW_NUMBER()` gives unique sequential numbers: 1, 2, 3.\n`RANK()` assigns the same rank to ties and skips subsequent numbers: 1, 1, 3.\n`DENSE_RANK()` assigns the same rank to ties without skipping subsequent numbers: 1, 1, 2.',
    tip: 'Top SQL interview query: "Find employees with the Nth highest salary using DENSE_RANK() over (order by salary desc)".'
  },
  {
    id: 'tech_data_02',
    category: 'Data Analytics',
    topic: 'Data Cleaning & Stats',
    companyTags: ['data_analyst_track'],
    difficulty: 'Intermediate',
    question: 'When preparing a dataset with significant right-skewness (heavy positive tail with extreme outliers), which imputation metric is generally preferred for missing numeric values?',
    options: [
      'Mean, because it balances mathematical variance',
      'Median, because it is robust against extreme outliers and skewness',
      'Zero imputation, because it preserves column sum',
      'Random Gaussian noise'
    ],
    correctIndex: 1,
    explanation: 'In skewed distributions, the mean is heavily pulled towards extreme outlier values, giving a distorted central tendency. The Median represents the 50th percentile (the true middle value) and is insensitive to extreme outlier magnitudes, making it the standard robust choice.',
    tip: 'Remember: Normal distribution -> Mean; Skewed / Outlier-heavy -> Median; Categorical -> Mode.'
  },
  {
    id: 'tech_data_03',
    category: 'Data Analytics',
    topic: 'Business Analytics & Stats',
    companyTags: ['data_analyst_track'],
    difficulty: 'Beginner',
    question: 'What statistical phenomenon describes a scenario where a trend or correlation appears in several distinct groups of data, but reverses or disappears when the groups are combined?',
    options: [
      'Hawthorne Effect',
      'Simpson\'s Paradox',
      'Pareto Principle',
      'Central Limit Theorem'
    ],
    correctIndex: 1,
    explanation: 'Simpson\'s Paradox occurs when aggregate data masks a lurking or confounding variable that splits the data into sub-populations. When analyzed across groups, the true relationship reveals itself, but combining them reverses the statistical relationship.',
    tip: 'Commonly asked in analytics case studies to test whether you blindly aggregate data without segmenting!'
  },

  // --- CYBERSECURITY & APPSEC ---
  {
    id: 'tech_sec_01',
    category: 'Cybersecurity',
    topic: 'Web Security & OWASP',
    companyTags: ['cyber_track', 'product_sde1', 'accenture_ase'],
    difficulty: 'Intermediate',
    question: 'What is the fundamental difference between Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?',
    options: [
      'XSS attacks network firewalls; CSRF attacks DNS resolvers',
      'XSS exploits a user\'s trust in a website by executing malicious scripts in their browser; CSRF exploits a website\'s trust in the victim\'s browser by tricking it into submitting unauthorized commands',
      'XSS requires physical access to the server; CSRF is purely virtual',
      'CSRF has been completely solved by SSL certificates'
    ],
    correctIndex: 1,
    explanation: 'In XSS, an attacker injects malicious client-side JavaScript into a trusted website, stealing cookies, session tokens, or manipulating DOM. In CSRF, an attacker tricks an already authenticated user\'s browser into sending an HTTP request (carrying their session cookies) to a target site without their consent.',
    tip: 'Mitigations: XSS -> Content Security Policy (CSP) + Output Encoding + HTTP-only cookies; CSRF -> Anti-CSRF tokens + SameSite cookie flag.'
  },
  {
    id: 'tech_sec_02',
    category: 'Cybersecurity',
    topic: 'Cryptography & Auth',
    companyTags: ['cyber_track', 'product_sde1'],
    difficulty: 'Intermediate',
    question: 'Why do modern authentication architectures combine Asymmetric Encryption (e.g. RSA / ECC) and Symmetric Encryption (e.g. AES-256) in protocols like HTTPS / TLS?',
    options: [
      'Because symmetric encryption is too weak to encrypt any data',
      'Asymmetric encryption is used securely to authenticate and exchange a temporary symmetric session key; symmetric encryption is then used to encrypt the actual payload data because it is orders of magnitude faster',
      'Asymmetric encryption cannot run on mobile devices',
      'They are identical algorithms configured with different bit lengths'
    ],
    correctIndex: 1,
    explanation: 'Asymmetric encryption solves the key exchange dilemma (no shared secret needed beforehand), but requires heavy modular arithmetic and large CPU overhead. Symmetric encryption is blazing fast and hardware-accelerated (AES-NI). TLS uses asymmetric cryptography (certificates & public/private keys) solely to agree on a shared session key, then switches to AES for high-throughput data transfer.',
    tip: 'Keywords: "Hybrid Cryptosystem: Asymmetric for handshake key exchange, Symmetric for bulk payload encryption".'
  },

  // --- OOPS CONCEPTS ---
  {
    id: 'tech_oops_01',
    category: 'Core CS',
    topic: 'OOPs Concepts',
    companyTags: ['tcs_nqt', 'infosys_sp', 'wipro_turbo', 'product_sde1', 'frontend_track'],
    difficulty: 'Intermediate',
    question: 'In object-oriented programming, which principle allows an object to take many forms, typically demonstrated by method overriding at runtime and method overloading at compile time?',
    options: ['Encapsulation', 'Polymorphism', 'Data Abstraction', 'Inheritance'],
    correctIndex: 1,
    explanation: 'Polymorphism (Greek for "many forms") is the ability of an entity to take on different forms. Compile-time polymorphism is achieved through method overloading, while runtime polymorphism is achieved through method overriding via virtual method tables (vtable).',
    tip: 'Interviewers often ask: "Is method overloading static or dynamic?" Overloading = Static (Compile-time), Overriding = Dynamic (Runtime).'
  },
  {
    id: 'tech_oops_02',
    category: 'Core CS',
    topic: 'OOPs Concepts',
    companyTags: ['infosys_sp', 'product_sde1', 'accenture_ase', 'frontend_track'],
    difficulty: 'Intermediate',
    question: 'Why does Java not support multiple inheritance with classes, and how does it avoid the "Diamond Problem"?',
    options: [
      'Java avoids it by having all classes extend Object by default',
      'Java restricts multiple inheritance to interfaces with default methods, preventing ambiguity in class state and multiple method implementations',
      'Java uses virtual base classes identical to C++',
      'Java compiler automatically merges identical member variables'
    ],
    correctIndex: 1,
    explanation: 'The Diamond Problem occurs when two classes B and C inherit from A, and class D inherits from both B and C. If B and C override a method from A, D does not know which implementation to inherit. Java avoids this by not supporting multiple inheritance of classes, allowing multiple inheritance of behavior only through interfaces.',
    tip: 'Mention the "Diamond Problem" explicitly whenever multiple inheritance is asked!'
  },

  // --- DBMS & SQL ---
  {
    id: 'tech_dbms_01',
    category: 'Core CS',
    topic: 'DBMS & SQL',
    companyTags: ['tcs_nqt', 'infosys_sp', 'wipro_turbo', 'accenture_ase', 'data_analyst_track', 'product_sde1'],
    difficulty: 'Beginner',
    question: 'What is the key difference between the SQL commands TRUNCATE and DELETE?',
    options: [
      'DELETE is DDL and cannot be rolled back; TRUNCATE is DML and can be rolled back',
      'TRUNCATE is DDL, deallocates data pages, resets identity counters, and is faster; DELETE is DML, deletes row-by-row, and logs each deletion',
      'TRUNCATE allows a WHERE clause; DELETE does not',
      'There is no functional difference; they are aliases in standard ANSI SQL'
    ],
    correctIndex: 1,
    explanation: 'DELETE is a Data Manipulation Language (DML) operation that deletes rows matching a WHERE clause, logs each row removal, and activates triggers. TRUNCATE is a Data Definition Language (DDL) command that deallocates entire data pages, resets auto-increment IDs, cannot have a WHERE clause, and operates significantly faster.',
    tip: 'Golden table: TRUNCATE = DDL, faster, resets identity, no WHERE clause; DELETE = DML, slower, supports WHERE.'
  },
  {
    id: 'tech_dbms_02',
    category: 'Core CS',
    topic: 'DBMS & SQL',
    companyTags: ['infosys_sp', 'product_sde1', 'data_analyst_track'],
    difficulty: 'Advanced',
    question: 'Given an `Employees` table with columns `(id, name, department, salary)`, which SQL query correctly finds the employee(s) with the 2nd highest salary?',
    options: [
      'SELECT MAX(salary) FROM Employees WHERE salary < (SELECT MAX(salary) FROM Employees);',
      'SELECT salary FROM Employees ORDER BY salary DESC LIMIT 2;',
      'SELECT DISTINCT salary FROM Employees ORDER BY salary DESC LIMIT 2, 1;',
      'SELECT salary FROM Employees GROUP BY salary HAVING COUNT(*) = 2;'
    ],
    correctIndex: 0,
    explanation: 'The standard correlated subquery `SELECT MAX(salary) FROM Employees WHERE salary < (SELECT MAX(salary) FROM Employees)` is vendor-neutral and safely returns the second highest distinct salary. Alternatively, in MySQL: `SELECT DISTINCT salary FROM Employees ORDER BY salary DESC LIMIT 1 OFFSET 1;` (Option C had incorrect offset params).',
    tip: 'In interviews, write the correlated subquery method first because it works in Oracle, SQL Server, and MySQL alike!'
  },
  {
    id: 'tech_dbms_03',
    category: 'Core CS',
    topic: 'DBMS & SQL',
    companyTags: ['product_sde1', 'tcs_nqt', 'data_analyst_track'],
    difficulty: 'Intermediate',
    question: 'What ACID property ensures that once a transaction has committed, its changes survive even across power failures or system crashes?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correctIndex: 3,
    explanation: 'Durability guarantees that once a transaction completes and commits, its state is written to non-volatile storage (WAL / redo log) and will not be lost even in case of an immediate system crash or power outage.',
    tip: 'Remember ACID: A = All or nothing; C = Valid state; I = Concurrent independence; D = Survives crashes.'
  },

  // --- OPERATING SYSTEMS ---
  {
    id: 'tech_os_01',
    category: 'Core CS',
    topic: 'Operating Systems',
    companyTags: ['tcs_nqt', 'infosys_sp', 'product_sde1', 'cyber_track'],
    difficulty: 'Intermediate',
    question: 'Which of the following conditions is NOT one of Coffman\'s four necessary and sufficient conditions for a deadlock to occur?',
    options: [
      'Mutual Exclusion',
      'Hold and Wait',
      'Preemptive Resource Allocation',
      'Circular Wait'
    ],
    correctIndex: 2,
    explanation: 'The four Coffman conditions for deadlock are:\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption (resources cannot be forcibly taken away)\n4. Circular Wait.\n"Preemptive Resource Allocation" actively breaks deadlock, so it is the opposite of the deadlock condition!',
    tip: 'Mnemonic: "M-H-N-C" (Mutual Exclusion, Hold & wait, No preemption, Circular wait).'
  },
  {
    id: 'tech_os_02',
    category: 'Core CS',
    topic: 'Operating Systems',
    companyTags: ['wipro_turbo', 'accenture_ase', 'tcs_nqt', 'product_sde1'],
    difficulty: 'Beginner',
    question: 'What is the primary difference between a Process and a Thread?',
    options: [
      'Processes share memory space by default, while threads have isolated address spaces',
      'A process is an executing program with its own dedicated memory space; threads are lightweight units of execution within a process that share its address space and heap',
      'Threads are created by the BIOS, while processes are created by the OS kernel',
      'Processes can only run sequentially, while threads always run on separate CPU cores'
    ],
    correctIndex: 1,
    explanation: 'A Process is an instance of a computer program being executed, containing its own memory space (code, data, heap, stack). A Thread (often called a lightweight process) lives inside a process, sharing code, data, and heap segments with peer threads, but maintaining its own registers and call stack.',
    tip: 'Keywords to use in interview: "Shared heap, isolated stack, lower context-switching overhead".'
  },

  // --- COMPUTER NETWORKS ---
  {
    id: 'tech_cn_01',
    category: 'Core CS',
    topic: 'Computer Networks',
    companyTags: ['accenture_ase', 'tcs_nqt', 'infosys_sp', 'cyber_track', 'product_sde1'],
    difficulty: 'Intermediate',
    question: 'In the TCP 3-way handshake protocol used to establish a reliable connection, what is the exact packet exchange sequence between client and server?',
    options: [
      'Client sends ACK -> Server sends SYN -> Client sends FIN',
      'Client sends SYN -> Server sends SYN + ACK -> Client sends ACK',
      'Client sends PING -> Server sends PONG -> Client sends ACK',
      'Client sends SYN -> Server sends ACK -> Client sends SYN-ACK'
    ],
    correctIndex: 1,
    explanation: 'TCP 3-way handshake sequence:\n1. Client -> Server: SYN (Synchronize Sequence Number)\n2. Server -> Client: SYN + ACK (Acknowledge Client sequence and synchronize server sequence)\n3. Client -> Server: ACK (Acknowledge Server sequence). The connection is then ESTABLISHED.',
    tip: 'Remember: SYN -> SYN-ACK -> ACK. To terminate, it uses a 4-way FIN handshake.'
  },

  // --- DATA STRUCTURES & ALGORITHMS ---
  {
    id: 'tech_dsa_01',
    category: 'Core CS',
    topic: 'Data Structures & Algorithms',
    companyTags: ['product_sde1', 'tcs_nqt', 'infosys_sp', 'frontend_track'],
    difficulty: 'Intermediate',
    question: 'What is the worst-case time complexity of QuickSort, and in what scenario does it occur when using the last element as the pivot?',
    options: [
      'O(n log n), occurs when array contains duplicate keys',
      'O(n^2), occurs when the input array is already sorted or reverse sorted',
      'O(n), occurs when elements are randomly shuffled',
      'O(2^n), occurs when recursion depth exceeds 1000'
    ],
    correctIndex: 1,
    explanation: 'When the pivot selected is consistently the smallest or largest element (which happens in an already sorted or reverse sorted array if pivot is always the last/first element), the partition splits the array into sizes 0 and n-1. This degrades recursion depth to n, resulting in T(n) = T(n-1) + O(n) = O(n^2) worst-case time.',
    tip: 'Explain how to mitigate this: "Use Randomized QuickSort or Median-of-Three pivot selection to guarantee expected O(n log n)".'
  },
  {
    id: 'tech_dsa_02',
    category: 'Core CS',
    topic: 'Data Structures & Algorithms',
    companyTags: ['product_sde1', 'infosys_sp'],
    difficulty: 'Intermediate',
    question: 'In a hash table using separate chaining for collision resolution, what happens to the search time complexity if all keys hash to the exact same bucket?',
    options: [
      'It remains O(1) due to cache locality',
      'It degrades to O(n) equivalent to linear search in a linked list',
      'It triggers an immediate StackOverflow error',
      'It becomes O(log n) automatically in standard C++ std::unordered_map'
    ],
    correctIndex: 1,
    explanation: 'If all n elements hash to the same bucket index, they all form a single linked list in that bucket. Searching for an element requires traversing that list, resulting in O(n) worst-case time complexity (unless the bucket is converted to a red-black tree, as in Java 8+ HashMap which caps it at O(log n)).',
    tip: 'Bonus points in interviews: mention "Java 8 HashMap converts the bucket linked list to a Red-Black Tree when bucket size exceeds TREEIFY_THRESHOLD (8)".'
  },

  // --- PSEUDOCODE & CODE TRACING ---
  {
    id: 'tech_pseudo_01',
    category: 'Pseudocode & Logic',
    topic: 'Pseudocode Tracing',
    companyTags: ['infosys_sp', 'tcs_nqt', 'accenture_ase', 'product_sde1'],
    difficulty: 'Intermediate',
    question: 'What is the return value of the following recursive function when called as `solve(3, 4)`?\n\n```c\nint solve(int a, int b) {\n    if (b == 0) return 0;\n    if (b % 2 == 0) return solve(a + a, b / 2);\n    return solve(a + a, b / 2) + a;\n}\n```',
    options: ['7', '12', '14', '64'],
    correctIndex: 1,
    explanation: 'Trace `solve(a, b)`:\n1. `solve(3, 4)`: b=4 is even -> `solve(6, 2)`\n2. `solve(6, 2)`: b=2 is even -> `solve(12, 1)`\n3. `solve(12, 1)`: b=1 is odd -> `solve(24, 0) + 12`\n4. `solve(24, 0)`: b=0 returns 0.\nReturning up: 0 + 12 = 12.\nThis algorithm is the Russian Peasant Multiplication method, which computes `a * b` in O(log b) steps: 3 * 4 = 12.',
    tip: 'Notice the pattern: `a` doubles while `b` halves! It is binary exponentiation / Russian Peasant multiplication.'
  },
  {
    id: 'tech_pseudo_02',
    category: 'Pseudocode & Logic',
    topic: 'Bitwise Operators',
    companyTags: ['tcs_nqt', 'infosys_sp', 'product_sde1'],
    difficulty: 'Intermediate',
    question: 'What does the expression `(x & (x - 1)) == 0` check for any positive integer `x`?',
    options: [
      'Checks if x is an odd number',
      'Checks if x is a power of 2',
      'Checks if x is a multiple of 4',
      'Checks if x has alternating 1s and 0s in binary'
    ],
    correctIndex: 1,
    explanation: 'A power of 2 has exactly one binary bit set to 1 (e.g., 8 = 1000_2). Subtracting 1 flips all bits after and including the lowest set bit (e.g., 7 = 0111_2). Performing bitwise AND yields 0 (1000 & 0111 = 0000). For any number with more than one set bit, the higher bits remain, yielding non-zero.',
    tip: 'One of the most frequently asked bit-manipulation tricks in campus placements!'
  }
];
