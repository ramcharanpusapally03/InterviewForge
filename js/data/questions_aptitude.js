// Aptitude Question Bank: Quantitative, Logical, and Verbal Reasoning
export const APTITUDE_QUESTIONS = [
  // --- QUANTITATIVE APTITUDE ---
  {
    id: 'apt_quant_01',
    category: 'Quantitative',
    topic: 'Time and Work',
    companyTags: ['tcs_nqt', 'infosys_sp', 'wipro_turbo'],
    difficulty: 'Intermediate',
    question: 'A can complete a piece of work in 12 days and B can complete the same work in 16 days. They work together for 4 days, and then A leaves. In how many more days will B finish the remaining work alone?',
    options: ['5.33 days (5 1/3 days)', '6.67 days (6 2/3 days)', '7 days', '8 days'],
    correctIndex: 1,
    explanation: 'Total Work = LCM(12, 16) = 48 units.\nA\'s rate = 48/12 = 4 units/day.\nB\'s rate = 48/16 = 3 units/day.\nTogether in 4 days = 4 * (4 + 3) = 28 units.\nRemaining work = 48 - 28 = 20 units.\nTime taken by B alone = 20 / 3 = 6 2/3 days (~6.67 days).',
    tip: 'Use LCM of days as total work to avoid working with fractions!'
  },
  {
    id: 'apt_quant_02',
    category: 'Quantitative',
    topic: 'Speed, Time and Distance',
    companyTags: ['tcs_nqt', 'accenture_ase', 'product_sde1'],
    difficulty: 'Intermediate',
    question: 'A train 180 meters long running at a speed of 72 km/h crosses a platform in 24 seconds. What is the length of the platform?',
    options: ['240 meters', '280 meters', '300 meters', '320 meters'],
    correctIndex: 2,
    explanation: 'Convert speed to m/s: 72 * (5/18) = 20 m/s.\nDistance covered in 24 s = Speed * Time = 20 * 24 = 480 meters.\nDistance = Train Length + Platform Length.\n480 = 180 + Platform Length => Platform Length = 480 - 180 = 300 meters.',
    tip: 'Remember to multiply by 5/18 when converting km/h to m/s!'
  },
  {
    id: 'apt_quant_03',
    category: 'Quantitative',
    topic: 'Percentages & Profit/Loss',
    companyTags: ['wipro_turbo', 'infosys_sp', 'accenture_ase'],
    difficulty: 'Beginner',
    question: 'A shopkeeper sells an article at 20% discount on its marked price and still manages to earn a 25% profit. If the cost price is ₹480, find the marked price.',
    options: ['₹600', '₹700', '₹750', '₹800'],
    correctIndex: 2,
    explanation: 'Cost Price (CP) = ₹480.\nProfit = 25% => Selling Price (SP) = 480 * 1.25 = ₹600.\nSince SP is 20% off Marked Price (MP):\nSP = 0.80 * MP => 600 = 0.80 * MP => MP = 600 / 0.8 = ₹750.',
    tip: 'SP = CP * (1 + Profit%) and SP = MP * (1 - Discount%). Equate them directly.'
  },
  {
    id: 'apt_quant_04',
    category: 'Quantitative',
    topic: 'Probability & Combinatorics',
    companyTags: ['product_sde1', 'tcs_nqt', 'infosys_sp'],
    difficulty: 'Advanced',
    question: 'Two dice are rolled simultaneously. What is the probability that the sum of the numbers on the two dice is a prime number?',
    options: ['5/12', '7/18', '1/2', '15/36'],
    correctIndex: 0,
    explanation: 'Total outcomes = 6 * 6 = 36.\nPossible prime sums between 2 and 12 are 2, 3, 5, 7, 11.\n- Sum = 2: (1,1) -> 1 pair\n- Sum = 3: (1,2), (2,1) -> 2 pairs\n- Sum = 5: (1,4), (2,3), (3,2), (4,1) -> 4 pairs\n- Sum = 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 pairs\n- Sum = 11: (5,6), (6,5) -> 2 pairs\nTotal favorable outcomes = 1 + 2 + 4 + 6 + 2 = 15.\nProbability = 15/36 = 5/12.',
    tip: 'Primes under 12 are 2, 3, 5, 7, 11. Count systematically by fixing the first die.'
  },
  {
    id: 'apt_quant_05',
    category: 'Quantitative',
    topic: 'Ratios & Mixtures',
    companyTags: ['tcs_nqt', 'wipro_turbo', 'accenture_ase'],
    difficulty: 'Beginner',
    question: 'In a 60-liter mixture of milk and water, the ratio of milk to water is 2:1. How much water should be added so that the ratio becomes 1:2?',
    options: ['40 liters', '50 liters', '60 liters', '80 liters'],
    correctIndex: 2,
    explanation: 'Current mixture: Total = 60L.\nMilk = (2/3) * 60 = 40L, Water = (1/3) * 60 = 20L.\nWe add only water (let it be x). Milk remains 40L.\nNew ratio: Milk / (Water + x) = 1 / 2\n40 / (20 + x) = 1 / 2 => 80 = 20 + x => x = 60 liters.',
    tip: 'The quantity of milk does not change. Set up the equation using constant milk quantity.'
  },
  {
    id: 'apt_quant_06',
    category: 'Quantitative',
    topic: 'Number Systems & Divisibility',
    companyTags: ['infosys_sp', 'tcs_nqt'],
    difficulty: 'Intermediate',
    question: 'What is the remainder when 2^100 is divided by 7?',
    options: ['1', '2', '4', '6'],
    correctIndex: 1,
    explanation: 'Find cyclical powers of 2 mod 7:\n2^1 = 2 (mod 7)\n2^2 = 4 (mod 7)\n2^3 = 8 ≡ 1 (mod 7).\nSince 2^3 ≡ 1, the cycle length is 3.\nDivide the exponent 100 by 3: 100 = 3 * 33 + 1 (remainder 1).\nThus, 2^100 ≡ (2^3)^33 * 2^1 ≡ 1^33 * 2 ≡ 2 (mod 7).',
    tip: 'Euler\'s totient theorem and Fermat\'s Little Theorem simplify large exponent remainders!'
  },

  // --- LOGICAL REASONING ---
  {
    id: 'apt_logic_01',
    category: 'Logical',
    topic: 'Syllogisms',
    companyTags: ['tcs_nqt', 'infosys_sp', 'accenture_ase'],
    difficulty: 'Intermediate',
    question: 'Statements:\n1. All developers are problem solvers.\n2. Some problem solvers are coffee lovers.\nConclusions:\nI. Some developers are coffee lovers.\nII. Some coffee lovers are problem solvers.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
    correctIndex: 1,
    explanation: 'Statement 2: "Some problem solvers are coffee lovers". The converse of "Some A are B" is always valid: "Some B are A". Thus, "Some coffee lovers are problem solvers" (Conclusion II) definitely follows.\nConclusion I does not necessarily follow because there is no direct link between developers and coffee lovers in the middle term distribution.',
    tip: 'Always check if the middle term is distributed at least once before joining two premises.'
  },
  {
    id: 'apt_logic_02',
    category: 'Logical',
    topic: 'Coding-Decoding',
    companyTags: ['wipro_turbo', 'accenture_ase', 'tcs_nqt'],
    difficulty: 'Beginner',
    question: 'In a certain code language, "SYSTEM" is coded as "SYSMET" and "NEARER" is coded as "AENRER". How will "FRACTION" be coded in that language?',
    options: ['CARFNOIT', 'CARFTION', 'CRAFNOIT', 'ARFCNOIT'],
    correctIndex: 0,
    explanation: 'Break each 6-letter word into two halves of 3 letters:\nSYS-TEM -> reverse first 3: SYS, reverse last 3: MET -> SYSMET.\nNEA-RER -> reverse first 3: AEN, reverse last 3: RER -> AENRER.\nFor "FRACTION" (8 letters), split into two halves of 4 letters: FRAC - TION.\nReverse FRAC -> CARF. Reverse TION -> NOIT.\nCombining gives CARFNOIT.',
    tip: 'Count total letters; even-numbered words often use half-splitting and individual reversals.'
  },
  {
    id: 'apt_logic_03',
    category: 'Logical',
    topic: 'Blood Relations',
    companyTags: ['infosys_sp', 'tcs_nqt', 'wipro_turbo'],
    difficulty: 'Intermediate',
    question: 'Pointing towards a photograph, Priya said, "His mother is the only daughter of my mother." How is Priya related to the person in the photograph, assuming Priya is female?',
    options: ['Sister', 'Aunt', 'Mother', 'Daughter'],
    correctIndex: 2,
    explanation: '"The only daughter of my mother" when spoken by Priya (who is female with no other sisters mentioned) refers to Priya herself.\nTherefore, "His mother is Priya."\nThus, Priya is the Mother of the person in the photograph.',
    tip: 'Work backwards from the possessive phrases: "My mother\'s only daughter" -> "Me".'
  },
  {
    id: 'apt_logic_04',
    category: 'Logical',
    topic: 'Number & Letter Series',
    companyTags: ['tcs_nqt', 'infosys_sp', 'product_sde1'],
    difficulty: 'Intermediate',
    question: 'Find the next number in the sequence: 4, 18, 48, 100, 180, ?',
    options: ['244', '280', '294', '312'],
    correctIndex: 2,
    explanation: 'Analyze pattern based on n^3 - n^2 or n^2 * (n+1):\n1: 2^3 - 2^2 = 8 - 4 = 4\n2: 3^3 - 3^2 = 27 - 9 = 18\n3: 4^3 - 4^2 = 64 - 16 = 48\n4: 5^3 - 5^2 = 125 - 25 = 100\n5: 6^3 - 6^2 = 216 - 36 = 180\nNext term is for n = 7: 7^3 - 7^2 = 343 - 49 = 294.',
    tip: 'Recognize common algebraic series forms like n^3 - n^2 or n^2 * (n - 1).'
  },
  {
    id: 'apt_logic_05',
    category: 'Logical',
    topic: 'Seating Arrangements',
    companyTags: ['infosys_sp', 'tcs_nqt', 'product_sde1'],
    difficulty: 'Advanced',
    question: 'Six friends A, B, C, D, E, and F sit around a circular table facing the center. B is to the immediate left of D. F is between A and D. E is opposite to B. Who is sitting to the immediate right of A?',
    options: ['B', 'C', 'D', 'F'],
    correctIndex: 1,
    explanation: 'Place D at 6 o\'clock. B is to immediate left of D (clockwise = left if facing center, or right depending on convention):\nFacing center: Left of D is clockwise. So B is at 7 o\'clock.\nF is between A and D. Since B is at 7, F must be at 5 o\'clock and A at 4 o\'clock.\nE is opposite B (1 o\'clock).\nThe only remaining spot is at 2/3 o\'clock for C.\nLooking at A (at 4 o\'clock facing center): to A\'s left is F (at 5), and to A\'s immediate right is C (at 3).',
    tip: 'Always draw a 6-node circle and anchor the fixed pair first.'
  },

  // --- VERBAL ABILITY ---
  {
    id: 'apt_verb_01',
    category: 'Verbal',
    topic: 'Error Spotting & Grammar',
    companyTags: ['wipro_turbo', 'accenture_ase', 'tcs_nqt'],
    difficulty: 'Beginner',
    question: 'Identify the part of the sentence containing the grammatical error:\n"Neither of the two candidates (A) / who were shortlisted for the post (B) / have submitted their credentials on time (C) / No error (D)"',
    options: ['Part A', 'Part B', 'Part C', 'Part D'],
    correctIndex: 2,
    explanation: 'Subject-Verb Agreement rule: "Neither of", "Either of", "Each of" takes a singular verb.\nTherefore, "have submitted" is grammatically incorrect and should be "has submitted". Hence Part C has the error.',
    tip: 'Remember: "Neither of + plural noun" takes a SINGULAR verb (has, is, was).'
  },
  {
    id: 'apt_verb_02',
    category: 'Verbal',
    topic: 'Sentence Completion & Vocab',
    companyTags: ['accenture_ase', 'wipro_turbo'],
    difficulty: 'Intermediate',
    question: 'Select the most appropriate word to complete the sentence:\n"The senior architect praised the junior developer for proposing a _______ design pattern that eliminated redundant microservice calls."',
    options: ['cumbersome', 'tenuous', 'lucid', 'superfluous'],
    correctIndex: 2,
    explanation: '"Lucid" means clear, easily understood, and rational, which positively matches the context of praise for eliminating redundancy.\nCumbersome = clumsy/heavy; Tenuous = weak/flimsy; Superfluous = unnecessary/redundant.',
    tip: 'Look at the tone of the sentence: "praised" indicates a clearly positive characteristic.'
  },
  {
    id: 'apt_verb_03',
    category: 'Verbal',
    topic: 'Reading Comprehension',
    companyTags: ['tcs_nqt', 'infosys_sp'],
    difficulty: 'Intermediate',
    question: 'Passage: "Edge computing shifts computational processing and storage closer to the network edge where data is generated, rather than relying exclusively on centralized cloud servers. While this minimizes latency and bandwidth usage, it demands robust decentralized security protocols."\nAccording to the passage, what is the primary operational trade-off of edge computing?',
    options: [
      'It increases central cloud server costs',
      'It reduces latency at the expense of needing stronger decentralized security',
      'It completely eliminates the requirement for data encryption',
      'It slows down local bandwidth'
    ],
    correctIndex: 1,
    explanation: 'The passage explicitly pairs the benefit ("minimizes latency and bandwidth usage") with the trade-off challenge ("demands robust decentralized security protocols").',
    tip: 'Identify contrasting transition words like "While", "However", "Rather than" in RC passages.'
  }
];
