import { Course, StudyMaterial } from "./types";

export const initialCourses: Course[] = [
  {
    id: "aiml",
    name: "BCA AI/ML",
    description: "Bachelor of Computer Applications in Artificial Intelligence & Machine Learning",
    semesters: [
      {
        id: 1,
        name: "Semester 1",
        description: "Discrete Structures, C Programming, Computer Architecture, and Constitutional Values",
        status: "In Progress",
        modulesCount: 20,
        completedModules: 14,
        progressPercent: 70,
        borderClass: "border-[#fd9b65]",
        badgeBg: "bg-[#fff2e1] text-[#95491a]",
        badgeText: "Current",
        icon: "BookOpen",
        subjects: [
          {
            id: "discrete_structure",
            name: "Discrete Structure",
            description: "Mathematical structures that are fundamentally discrete rather than continuous, crucial for algorithmic computation.",
            modulesCount: 4,
            completedModules: 4,
            difficulty: "Core",
            icon: "Binary",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 100,
            units: [
              { id: "ds_u1", number: "01", name: "Unit 1: Set Theory", description: "Sets, relations, functions, and Cartesian products with cardinality proofs.", masteryPercent: 100, status: "Mastered", topics: ["Sets and Subsets", "Venn Diagrams", "Set Operations", "Cartesian Products", "Relations and Functions"] },
              { id: "ds_u2", number: "02", name: "Unit 2: Logic and Counting", description: "Propositional calculus, truth tables, quantification rules, and combinatorics principles.", masteryPercent: 100, status: "Mastered", topics: ["Propositional Logic", "Truth Tables", "Tautologies", "Permutations", "Combinations", "Pigeonhole Principle"] },
              { id: "ds_u3", number: "03", name: "Unit 3: Matrices", description: "Matrix algebra, systems of linear equations, eigenvalues, and eigenvectors.", masteryPercent: 100, status: "Mastered", topics: ["Matrix Operations", "Determinants", "System of Linear Equations", "Eigenvalues", "Eigenvectors", "Cayley-Hamilton Theorem"] },
              { id: "ds_u4", number: "04", name: "Unit 4: Graph Theory", description: "Graphs, trees, planar graphs, Eulerian/Hamiltonian paths, and coloring.", masteryPercent: 100, status: "Mastered", topics: ["Basic Graph Terminology", "Euler Paths", "Hamiltonian Cycles", "Trees", "Graph Coloring", "Planar Graphs"] }
            ],
            materials: [
              { id: "mat_ds_1", name: "Set Theory & Relations Solved Proofs.pdf", size: "2.1 MB", addedTime: "Added 3 days ago", type: "pdf", isBookmarked: false, tag: "Handwritten", details: "Step-by-step mathematical proofs of power sets, bijection mapping, and equivalence relations." },
              { id: "mat_ds_2", name: "Truth Tables & Combinatorics Practice.pdf", size: "1.4 MB", addedTime: "Alumni Resource", type: "pdf", isBookmarked: false, tag: "Must Read", details: "Midterm prep booklet with 45 solved examples of permutations, logic formulas, and quantifiers." }
            ]
          },
          {
            id: "problem_solving",
            name: "Problem Solving Techniques",
            description: "Introduction to logical design, algorithms, and modular programming concepts in C language.",
            modulesCount: 4,
            completedModules: 3,
            difficulty: "Intermediate",
            icon: "Braces",
            bgColor: "bg-orange-50 text-orange-800",
            textColor: "text-orange-800",
            progressPercent: 75,
            units: [
              { id: "ps_u1", number: "01", name: "Unit 1: Introduction", description: "Algorithm development, flowchart design, pseudo-code structures, and program life cycle.", masteryPercent: 100, status: "Mastered", topics: ["Definition of Algorithm", "Flowcharts", "Pseudo-code", "Compilation", "Structured Programming"] },
              { id: "ps_u2", number: "02", name: "Unit 2: C Programming", description: "C syntax, control loops, arrays, structures, pointers, and custom helper functions.", masteryPercent: 100, status: "Mastered", topics: ["Data Types & Operators", "Loops and Conditions", "1D and 2D Arrays", "Pointers", "Structures and Unions"] },
              { id: "ps_u3", number: "03", name: "Unit 3: Factoring Methods", description: "Greatest common divisor, prime factorization, square roots, and number generation algorithms.", masteryPercent: 80, status: "In Progress", topics: ["Euclid Algorithm", "Prime Sieve of Eratosthenes", "Square Root Approximation", "Fibonacci Series Generation"] },
              { id: "ps_u4", number: "04", name: "Unit 4: Sorting", description: "Array searching and fundamental sorting techniques such as bubble, selection, and insertion.", masteryPercent: 0, status: "Locked", topics: ["Linear and Binary Search", "Bubble Sort", "Selection Sort", "Insertion Sort"] }
            ],
            materials: [
              { id: "mat_ps_1", name: "Interactive Pointer Demos.java", size: "Code File", addedTime: "Lab Practical", type: "code", isBookmarked: false, details: `// C Pointer demonstration
#include <stdio.h>
int main() {
    int value = 42;
    int *ptr = &value;
    printf("Value: %d\\n", value);
    printf("Pointer Address: %p\\n", ptr);
    printf("Deref Pointer: %d\\n", *ptr);
    return 0;
}` }
            ]
          },
          {
            id: "computer_arch",
            name: "Computer Architecture",
            description: "Explores the fundamental structure, circuits, register operations, and Assembly level organization of computers.",
            modulesCount: 4,
            completedModules: 2,
            difficulty: "Core",
            icon: "Cpu",
            bgColor: "bg-teal-50 text-teal-800",
            textColor: "text-teal-800",
            progressPercent: 50,
            units: [
              { id: "ca_u1", number: "01", name: "Unit 1: Number System", description: "Binary, octal, hexadecimal representations, floating point conventions, and binary arithmetic.", masteryPercent: 100, status: "Mastered", topics: ["Radix Conversions", "Signed Magnitude", "1s and 2s Complement", "IEEE 754 Floating Point", "Binary Arithmetic"] },
              { id: "ca_u2", number: "02", name: "Unit 2: Combinational Circuits", description: "Boolean logic gates, Karnaugh maps minimization, multiplexers, decoders, and arithmetic units.", masteryPercent: 85, status: "In Progress", topics: ["K-Maps Minimization", "Adders and Subtractors", "Multiplexers / Demux", "Decoders and Encoders"] },
              { id: "ca_u3", number: "03", name: "Unit 3: Basic Computer Organization and Design", description: "Instruction cycles, CPU registers, timing signals, memory reference codes, and microprogram control.", masteryPercent: 0, status: "Locked", topics: ["Instruction Codes", "Common Bus System", "Timing and Control", "Instruction Cycle", "Register-Reference Instructions"] },
              { id: "ca_u4", number: "04", name: "Unit 4: Introduction to 8085 Assembly Language", description: "8085 microprocessor register architecture, instruction sets, addressing modes, and simple assembly programs.", masteryPercent: 0, status: "Locked", topics: ["8085 Pin Diagram", "Internal Register Stack", "Instruction Set Grouping", "Addressing Modes", "Sample Loop Scripts"] }
            ],
            materials: [
              { id: "mat_ca_1", name: "K-Map Simplification Guide.pdf", size: "1.8 MB", addedTime: "Added 1 week ago", type: "pdf", isBookmarked: false, details: "Comprehensive guide to 3, 4, and 5 variable K-Maps with grouping and don't care conditions." }
            ]
          },
          {
            id: "constitutional_values_1",
            name: "Constitutional Values I",
            description: "Introduction to the founding ideals, Preamble, and fundamental rights of the Indian Constitution.",
            modulesCount: 1,
            completedModules: 1,
            difficulty: "Core",
            icon: "ShieldAlert",
            bgColor: "bg-blue-50 text-blue-800",
            textColor: "text-blue-800",
            progressPercent: 100,
            units: [
              { id: "cv1_u1", number: "01", name: "Constitutional I", description: "Preamble, historical framing, fundamental rights, and citizenship clauses.", masteryPercent: 100, status: "Mastered", topics: ["Drafting Committee", "Key Preamble Ideals", "Fundamental Rights (Art 14-32)", "Directive Principles of State Policy"] }
            ],
            materials: []
          },
          {
            id: "english_1",
            name: "Language 1: English",
            description: "Literary chapters, communication drafting, grammar fundamentals, and professional vocabulary.",
            modulesCount: 1,
            completedModules: 1,
            difficulty: "Core",
            icon: "Languages",
            bgColor: "bg-pink-50 text-pink-800",
            textColor: "text-pink-800",
            progressPercent: 100,
            units: [
              { id: "eng1_u1", number: "01", name: "English Chapters", description: "Assigned prose, poetry, business correspondence layout, and writing mechanics.", masteryPercent: 100, status: "Mastered", topics: ["Prose Anthologies", "Grammar & Syntax", "Business Letter Formats", "Resume Formulation"] }
            ],
            materials: []
          },
          {
            id: "language_2_1",
            name: "Language 2: Kannada/Hindi/Additional English",
            description: "Second language literature, regional grammar models, essays, and regional syntax studies.",
            modulesCount: 1,
            completedModules: 1,
            difficulty: "Core",
            icon: "Languages",
            bgColor: "bg-purple-50 text-purple-800",
            textColor: "text-purple-800",
            progressPercent: 100,
            units: [
              { id: "lang2_u1", number: "01", name: "Language 2 Curriculum", description: "State approved text chapters, grammatical systems, prose essays, and translation grids.", masteryPercent: 100, status: "Mastered", topics: ["Prose & Drama", "Grammar Models", "Translation Exercises", "Creative Writing"] }
            ],
            materials: []
          },
          {
            id: "lab_sem1",
            name: "Practical Labs (Sem 1)",
            description: "Practical files, execution scripts, and viva records for computer architecture, problem-solving, and office automation.",
            modulesCount: 3,
            completedModules: 2,
            difficulty: "Core",
            icon: "Terminal",
            bgColor: "bg-emerald-50 text-emerald-800",
            textColor: "text-emerald-800",
            progressPercent: 66,
            isLab: true,
            units: [
              { id: "lab_ca", number: "01", name: "Computer Architecture Lab", description: "Design combinational circuits using digital gates simulators and assemble micro-logic scripts.", masteryPercent: 100, status: "Mastered", topics: ["AND/OR/NOT Gates", "Full Adder on Breadboard", "8085 Simulators"] },
              { id: "lab_ps", number: "02", name: "Problem Solving Lab", description: "Write, compile, test, and debug structured computational programs using GCC compiler and C.", masteryPercent: 100, status: "Mastered", topics: ["Conditionals Lab", "Array Search Algorithms", "Pointer Swapping"] },
              { id: "lab_omt", number: "03", name: "Office Automation Tool (OMT)", description: "Leverage standard processors, slide decks, database files, and dynamic sheets calculation.", masteryPercent: 0, status: "In Progress", topics: ["Spreadsheets Formula", "Document Styles", "Mail Merge", "Macro Scripts"] }
            ],
            materials: [
              { id: "mat_lab1", name: "C Language Lab Manual Completed.pdf", size: "3.2 MB", addedTime: "Seniors Approved", type: "pdf", isBookmarked: false, details: "Full set of 15 standard lab programs including bubble sort, matrix transpose, and pointer structures." }
            ]
          }
        ]
      },
      {
        id: 2,
        name: "Semester 2",
        description: "Data Structures, OOPs using Java, Operating Systems, and Environmental Studies",
        status: "Locked",
        modulesCount: 20,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "data_structures",
            name: "Data Structures",
            description: "Foundational techniques of storing and retrieving non-linear and linear data efficiently in modern computer systems.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Network",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 0,
            units: [
              { id: "ds2_u1", number: "01", name: "Unit 1: Introduction and Overview", description: "Data classification, algorithm analysis, asymptotic notations, and complexity structures.", masteryPercent: 0, status: "Locked" },
              { id: "ds2_u2", number: "02", name: "Unit 2: Arrays", description: "Linear arrays, representation in memory, traversal, insertion, deletion, and search bounds.", masteryPercent: 0, status: "Locked" },
              { id: "ds2_u3", number: "03", name: "Unit 3: Stacks", description: "Stack operations, push-pop operations, infix to postfix conversions, and queues implementation.", masteryPercent: 0, status: "Locked" },
              { id: "ds2_u4", number: "04", name: "Unit 4: Binary Trees", description: "Tree schemas, traversing binary trees, searching, heap representation, and search trees.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "oops_java",
            name: "OOPs using JAVA",
            description: "Object-Oriented design, classes, interfaces, inheritance schemes, and virtual machine structures.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "Coffee",
            bgColor: "bg-orange-50 text-orange-800",
            textColor: "text-orange-800",
            progressPercent: 0,
            units: [
              { id: "j_u1", number: "01", name: "Unit 1: Introduction", description: "History of Java, bytecode, JVM, variables, data types, operators, and control loops.", masteryPercent: 0, status: "Locked" },
              { id: "j_u2", number: "02", name: "Unit 2: Inheritance", description: "Method overloading, overriding, class hierarchal extends, interfaces, and packages.", masteryPercent: 0, status: "Locked" },
              { id: "j_u3", number: "03", name: "Unit 3: Event Handling", description: "Delegation event model, listeners, mouse/key event captures, and UI widgets.", masteryPercent: 0, status: "Locked" },
              { id: "j_u4", number: "04", name: "Unit 4: Exception Handling", description: "Try-catch-finally, throwing custom errors, assert frameworks, and multicatch blocks.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "operating_system",
            name: "Operating System",
            description: "Kernel design, system calls, process state, CPU allocation, memory translation, and filesystems.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Core",
            icon: "Settings",
            bgColor: "bg-teal-50 text-teal-800",
            textColor: "text-teal-800",
            progressPercent: 0,
            units: [
              { id: "os_u1", number: "01", name: "Unit 1: Introduction", description: "OS types, microkernel architecture, system calls, and boot sequences.", masteryPercent: 0, status: "Locked" },
              { id: "os_u2", number: "02", name: "Unit 2: Process Synchronisation", description: "Semaphores, critical section problems, classical lock structures, and CPU scheduling.", masteryPercent: 0, status: "Locked" },
              { id: "os_u3", number: "03", name: "Unit 3: Memory Management Strategies", description: "Paging systems, segmentation, translation lookaside buffers, and virtual memory page swaps.", masteryPercent: 0, status: "Locked" },
              { id: "os_u4", number: "04", name: "Unit 4: Introduction to LINUX Programming", description: "Linux shell scripting, file management commands, piping, and administrative tools.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "environmental_studies",
            name: "Environmental Studies",
            description: "Natural resources, eco systems, pollution, biodiversity conservation, and green computing foundations.",
            modulesCount: 1,
            completedModules: 0,
            difficulty: "Core",
            icon: "Leaf",
            bgColor: "bg-emerald-50 text-emerald-800",
            textColor: "text-emerald-800",
            progressPercent: 0,
            units: [
              { id: "env_u1", number: "01", name: "Eco Systems & Pollution", description: "Global warming, local biodiversity, renewable energy resources, and computer recycling.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "constitutional_values_2",
            name: "Constitutional Values II",
            description: "State organs, local governance models, parliamentary rules, and emergency guidelines.",
            modulesCount: 1,
            completedModules: 0,
            difficulty: "Core",
            icon: "ShieldAlert",
            bgColor: "bg-blue-50 text-blue-800",
            textColor: "text-blue-800",
            progressPercent: 0,
            units: [
              { id: "cv2_u1", number: "01", name: "Constitutional II", description: "Judiciary system, Union Executive, amendment methodologies, and local panchayats.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "labs_sem2",
            name: "Practical Labs (Sem 2)",
            description: "Interactive lab exercises for Data Structures, Java Programming, and Linux command shells.",
            modulesCount: 3,
            completedModules: 0,
            difficulty: "Core",
            icon: "Terminal",
            bgColor: "bg-pink-50 text-pink-800",
            textColor: "text-pink-800",
            progressPercent: 0,
            isLab: true,
            units: [
              { id: "l_ds", number: "01", name: "Data Structure Lab", description: "Implement arrays, stacks, queues, and tree navigations using C structures.", masteryPercent: 0, status: "Locked" },
              { id: "l_java", number: "02", name: "OOPs using JAVA Lab", description: "Code custom classes, interface systems, exception trees, and mouse event frames.", masteryPercent: 0, status: "Locked" },
              { id: "l_linux", number: "03", name: "Linux & Shell Programming Lab", description: "Write bash execution scripts, grep files pattern searches, and cron management automation.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 3,
        name: "Semester 3",
        description: "DBMS, Python Programming, Design & Analysis of Algorithms, and Feature Engineering",
        status: "Locked",
        modulesCount: 15,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "dbms",
            name: "Database Management System",
            description: "Core architectures, normalization, storage engines, transactional integrity, and PL/SQL procedures.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "Database",
            bgColor: "bg-indigo-50 text-indigo-800",
            textColor: "text-indigo-800",
            progressPercent: 0,
            units: [
              { id: "db_u1", number: "01", name: "UNIT – I Fundamentals of Database Systems and Architecture", description: "DBMS schemas, data independence models, ER diagrams, and relational algebra operations.", masteryPercent: 0, status: "Locked" },
              { id: "db_u2", number: "02", name: "UNIT – II Database Design and Storage Structures", description: "Keys mappings, file structures, indexing formats (B-Trees), and functional dependencies.", masteryPercent: 0, status: "Locked" },
              { id: "db_u3", number: "03", name: "UNIT – III Relational Model, Normalization and SQL", description: "1NF, 2NF, 3NF, BCNF validation, query expressions, nested subqueries, and table constraints.", masteryPercent: 0, status: "Locked" },
              { id: "db_u4", number: "04", name: "UNIT – IV Query Processing, Transactions and PL/SQL", description: "ACID properties, serializability, query optimization, locks, cursors, and triggers.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "python_programming",
            name: "Python Programming",
            description: "Write clean, object-oriented script pipelines, manipulate files, and harness powerful data visualization modules.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "Terminal",
            bgColor: "bg-yellow-50 text-yellow-800",
            textColor: "text-yellow-800",
            progressPercent: 0,
            units: [
              { id: "py_u1", number: "01", name: "UNIT – I Foundations of Python Programming", description: "Variables, dictionary/tuples structures, conditional checks, loop structures, and functional scopes.", masteryPercent: 0, status: "Locked" },
              { id: "py_u2", number: "02", name: "UNIT – II Data Structures and File Handling", description: "Regular expressions, JSON mapping, read-write filesystem logs, and exception hierarchies.", masteryPercent: 0, status: "Locked" },
              { id: "py_u3", number: "03", name: "UNIT – III Object-Oriented Programming and Data Handling Libraries", description: "Classes, decorators, magic functions, NumPy matrix array calculation, and Pandas datasets.", masteryPercent: 0, status: "Locked" },
              { id: "py_u4", number: "04", name: "UNIT – IV Data Analysis and Visualization", description: "Plotting line graphs with Matplotlib, heatmaps in Seaborn, and exploratory summaries.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "algorithms",
            name: "Design and Analysis of Algorithms",
            description: "Examine complexity, divide-and-conquer, greedy designs, dynamic programming, and optimization.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "TrendingUp",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 0,
            units: [
              { id: "algo_u1", number: "01", name: "UNIT - I Fundamentals of Algorithm Design and Computational Efficiency", description: "Growth rates, recurrences trees, Master Theorem formulas, and algorithm validation.", masteryPercent: 0, status: "Locked" },
              { id: "algo_u2", number: "02", name: "UNIT – II Algorithm Design Techniques", description: "Divide and conquer (Quick/Merge sort), greedy tactics (Kruskal, Prim, Huffman).", masteryPercent: 0, status: "Locked" },
              { id: "algo_u3", number: "03", name: "UNIT - III Optimization Techniques", description: "Dynamic programming (Knapsack 0/1, LCS, Floyd-Warshall) and backtracking algorithms (N-Queens).", masteryPercent: 0, status: "Locked" },
              { id: "algo_u4", number: "04", name: "UNIT – IV Understanding Algorithmic Complexity & Problem-Solving Method", description: "P vs NP classes, approximations limits, branch-and-bound optimization, and travelling salesperson.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "feature_engineering",
            name: "Feature Engineering",
            description: "Extracting, transforming, cleaning, and encoding datasets for robust AI/ML models.",
            modulesCount: 2,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Sliders",
            bgColor: "bg-teal-50 text-teal-800",
            textColor: "text-teal-800",
            progressPercent: 0,
            units: [
              { id: "fe_u1", number: "01", name: "Unit - I Introduction", description: "Importance of feature space, domain expertise extraction, types of variables, and model biases.", masteryPercent: 0, status: "Locked" },
              { id: "fe_u2", number: "02", name: "Unit – II Data Cleaning, Transformation and Encoding", description: "Imputing null values, outlier capping, log transform normalizers, one-hot encoding, and min-max scaling.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "labs_sem3",
            name: "Practical Labs (Sem 3)",
            description: "Practical databases, python script execution, and algorithmic complexity benchmarking.",
            modulesCount: 3,
            completedModules: 0,
            difficulty: "Core",
            icon: "Terminal",
            bgColor: "bg-violet-50 text-violet-800",
            textColor: "text-violet-800",
            progressPercent: 0,
            isLab: true,
            units: [
              { id: "l_dbms", number: "01", name: "Database Management System Lab", description: "Run DDL/DML clauses, nested select join statements, and compile customized PL/SQL scripts.", masteryPercent: 0, status: "Locked" },
              { id: "l_python", number: "02", name: "Python Programming Lab", description: "Code files IO engines, manipulate databases with sqlite3, and plot multidimensional graphs.", masteryPercent: 0, status: "Locked" },
              { id: "l_algo", number: "03", name: "Design and Analysis of Algorithms Lab", description: "Implement merge, quick, prim, heap sorts, and measure execution times.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 4,
        name: "Semester 4",
        description: "Artificial Intelligence, Data Analytics, Internet of Things, and Data Visualization",
        status: "Locked",
        modulesCount: 18,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "artificial_intelligence",
            name: "Artificial Intelligence",
            description: "Core searching strategies, logical inferences, machine learning principles, and ethical AI safeguards.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "BrainCircuit",
            bgColor: "bg-fuchsia-50 text-fuchsia-800",
            textColor: "text-fuchsia-800",
            progressPercent: 0,
            units: [
              { id: "ai_u1", number: "01", name: "UNIT – I Fundamentals of Artificial Intelligence and Search Techniques", description: "BFS, DFS, heuristic searches (A*, Hill Climbing, Game playing with Alpha-Beta pruning).", masteryPercent: 0, status: "Locked" },
              { id: "ai_u2", number: "02", name: "UNIT – II Knowledge Representation, Reasoning, and Learning Paradigms", description: "Predicate logic resolutions, semantic networks schemas, bayesian probability networks.", masteryPercent: 0, status: "Locked" },
              { id: "ai_u3", number: "03", name: "UNIT – III Planning, Reasoning and Perception", description: "Classical planning algorithms, STRIPS representations, natural computer vision bounds, and audio models.", masteryPercent: 0, status: "Locked" },
              { id: "ai_u4", number: "04", name: "UNIT – IV Machine Learning, Neural Networks, and AI Ethics", description: "Supervised classifiers, backpropagation, deep layers, and safety protocols.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "data_analytics",
            name: "Data Analytics",
            description: "Empirical regressions, analytics frameworks, hypothesis validation, and Power BI visual dashboards.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "PieChart",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 0,
            units: [
              { id: "da_u1", number: "01", name: "UNIT- I Introduction to Data Analytics", description: "Descriptive vs prescriptive analytics, life cycle of data science, sampling.", masteryPercent: 0, status: "Locked" },
              { id: "da_u2", number: "02", name: "UNIT- II Correlation & Regression", description: "Pearson r coeff, multi-linear regressions fitting, residuals analysis.", masteryPercent: 0, status: "Locked" },
              { id: "da_u3", number: "03", name: "UNIT-III Probability & Statistical Methods", description: "Z-tests, T-tests, ANOVA tables calculation, confidence bounds.", masteryPercent: 0, status: "Locked" },
              { id: "da_u4", number: "04", name: "UNIT-IV Power BI", description: "DAX calculations, query editors, modeling fields, and interactive chart publishing.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "iot",
            name: "Internet of Things",
            description: "Physical sensors, communication protocols, cloud aggregators, and system nodes automation.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "Network",
            bgColor: "bg-cyan-50 text-cyan-800",
            textColor: "text-cyan-800",
            progressPercent: 0,
            units: [
              { id: "iot_u1", number: "01", name: "UNIT - I Introduction and Applications", description: "IoT definitions, physical structures, sensors, gateways, smart homes.", masteryPercent: 0, status: "Locked" },
              { id: "iot_u2", number: "02", name: "UNIT - II M2M and System Management", description: "Machine-to-machine interfaces, SDN configurations, SNMP networks.", masteryPercent: 0, status: "Locked" },
              { id: "iot_u3", number: "03", name: "UNIT III Developing Internet of Things", description: "Microcontrollers (Arduino, Raspberry Pi), pin triggers, sensor integration.", masteryPercent: 0, status: "Locked" },
              { id: "iot_u4", number: "04", name: "UNIT IV Usage of Python", description: "Writing lightweight socket code scripts, REST APIs triggers, and data feeds.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "data_viz",
            name: "Data Visualization",
            description: "Graphic storytelling, design philosophies, and dashboard tools (Tableau, D3.js).",
            modulesCount: 2,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "Eye",
            bgColor: "bg-emerald-50 text-emerald-800",
            textColor: "text-emerald-800",
            progressPercent: 0,
            units: [
              { id: "dv_u1", number: "01", name: "UNIT – I: Introduction to Data Visualization and Tools", description: "Choosing correct chart formats, cognitive perceptions, and basic BI suites.", masteryPercent: 0, status: "Locked" },
              { id: "dv_u2", number: "02", name: "UNIT – II: Data Storytelling and Visualization Design", description: "Narratives layouts, visual contrast, dashboards organization, and user heatmaps.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "prob_stats",
            name: "Probability and Statistics",
            description: "Random variables, continuous curves, Bayes Theorem, and distribution models.",
            modulesCount: 2,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Binary",
            bgColor: "bg-pink-50 text-pink-800",
            textColor: "text-pink-800",
            progressPercent: 0,
            units: [
              { id: "st_u1", number: "01", name: "UNIT - I Fundamentals of Probability and Theorems", description: "Conditional probability, Bayes formula, independent events, and sample space.", masteryPercent: 0, status: "Locked" },
              { id: "st_u2", number: "02", name: "UNIT - II Random Variables and Probability Distributions", description: "Normal, Binomial, and Poisson distributions curves with density algorithms.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "labs_sem4",
            name: "Practical Labs (Sem 4)",
            description: "Python notebooks and models for AI algorithms, statistical regressions, and IoT sensors.",
            modulesCount: 3,
            completedModules: 0,
            difficulty: "Core",
            icon: "Terminal",
            bgColor: "bg-orange-50 text-orange-800",
            textColor: "text-orange-800",
            progressPercent: 0,
            isLab: true,
            units: [
              { id: "l_ai", number: "01", name: "Artificial Intelligence Lab", description: "Implement A* searches, heuristic minimax trees, and simple neural net weight calculators.", masteryPercent: 0, status: "Locked" },
              { id: "l_da", number: "02", name: "Data Analytics Lab", description: "Write Python pandas correlations, linear regression fitting, and Power BI dashboard layouts.", masteryPercent: 0, status: "Locked" },
              { id: "l_iot", number: "03", name: "Internet of Things Lab", description: "Wire sensor interfaces to Raspberry Pi, log sensor inputs, and write trigger scripts.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 5,
        name: "Semester 5",
        description: "Machine Learning, Digital Image Processing, NLP, and Quantitative Techniques",
        status: "Locked",
        modulesCount: 15,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "ml_nn",
            name: "ML and Neural Network",
            description: "Explore neural networks, single-layer models, multi-layer perceptrons, backpropagation, and classification bounds.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "BrainCircuit",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 0,
            units: [
              { id: "ml_u1", number: "01", name: "Unit 1: Fundamentals of Machine Learning", description: "Supervised and unsupervised learning, bias-variance tradeoff, classification boundaries.", masteryPercent: 0, status: "Locked" },
              { id: "ml_u2", number: "02", name: "Unit 2: Single Layer Perceptron", description: "Activation functions, weight adjustments, linearly separable outputs, and gate learning.", masteryPercent: 0, status: "Locked" },
              { id: "ml_u3", number: "03", name: "Unit 3: Multi-Layer Neural Networks", description: "Hidden layers architectures, activation functions (ReLU, Sigmoid, Softmax), and weight matrices.", masteryPercent: 0, status: "Locked" },
              { id: "ml_u4", number: "04", name: "Unit 4: Training & Backpropagation", description: "Gradient descent, error backpropagation formulas, learning rates, and optimization.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "dip",
            name: "Digital Image Processing",
            description: "Examine matrix representation of images, filters, sharpening, edge segmentation, and compression models.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Eye",
            bgColor: "bg-teal-50 text-teal-800",
            textColor: "text-teal-800",
            progressPercent: 0,
            units: [
              { id: "dip_u1", number: "01", name: "Unit 1: Image Representation", description: "Pixels matrices, sampling, quantization, color models (RGB, YUV, HSV).", masteryPercent: 0, status: "Locked" },
              { id: "dip_u2", number: "02", name: "Unit 2: Enhancement & Filtering", description: "Histogram equalization, smoothing filters, gaussian blur, and sharpening.", masteryPercent: 0, status: "Locked" },
              { id: "dip_u3", number: "03", name: "Unit 3: Edge Detection", description: "Sobel, Prewitt, Canny operators, and image segmentation techniques.", masteryPercent: 0, status: "Locked" },
              { id: "dip_u4", number: "04", name: "Unit 4: Compression", description: "Lossless vs lossy techniques, JPEG compression models, and discrete cosine transforms.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "nlp",
            name: "Natural Language Processing",
            description: "Tokenizers, grammatical tagging, language model architectures, and sentiment analyzers.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Languages",
            bgColor: "bg-indigo-50 text-indigo-800",
            textColor: "text-indigo-800",
            progressPercent: 0,
            units: [
              { id: "nlp_u1", number: "01", name: "Unit 1: Tokenization & Syntax", description: "Text preprocessing, stemmers, lemmatizers, and regular expression models.", masteryPercent: 0, status: "Locked" },
              { id: "nlp_u2", number: "02", name: "Unit 2: POS Tagging", description: "Part-Of-Speech tagging, chunking, and named entity recognition architectures.", masteryPercent: 0, status: "Locked" },
              { id: "nlp_u3", number: "03", name: "Unit 3: Language Models", description: "N-grams, TF-IDF weights, word embeddings (Word2Vec, GloVe), and transformers.", masteryPercent: 0, status: "Locked" },
              { id: "nlp_u4", number: "04", name: "Unit 4: Sentiment Analysis", description: "Classifier training, transformers pipeline, and document semantic checks.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "quant_tech",
            name: "Quantitative Techniques",
            description: "Linear optimization models, transportation models, queuing theory, and minimax game solvers.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "TrendingUp",
            bgColor: "bg-fuchsia-50 text-fuchsia-800",
            textColor: "text-fuchsia-800",
            progressPercent: 0,
            units: [
              { id: "qt_u1", number: "01", name: "Unit 1: Linear Programming", description: "Formulating linear constraints, Simplex method solvers, and dual models.", masteryPercent: 0, status: "Locked" },
              { id: "qt_u2", number: "02", name: "Unit 2: Network Analysis", description: "PERT and CPM charts, project timeline optimizations, and critical paths.", masteryPercent: 0, status: "Locked" },
              { id: "qt_u3", number: "03", name: "Unit 3: Game Theory", description: "Pure vs mixed strategies, saddle points, and multi-player payoff tables.", masteryPercent: 0, status: "Locked" },
              { id: "qt_u4", number: "04", name: "Unit 4: Decision Theory", description: "Decision making under risk, expectation matrix evaluation, and utility functions.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "labs_sem5",
            name: "Practical Labs (Sem 5)",
            description: "PyTorch modeling and OpenCV scripts for machine learning and digital image segmentation.",
            modulesCount: 2,
            completedModules: 0,
            difficulty: "Core",
            icon: "Terminal",
            bgColor: "bg-emerald-50 text-emerald-800",
            textColor: "text-emerald-800",
            progressPercent: 0,
            isLab: true,
            units: [
              { id: "l_ml", number: "01", name: "ML and Neural Network Lab", description: "Train backpropagation nets in PyTorch and plot loss optimization curves.", masteryPercent: 0, status: "Locked" },
              { id: "l_dip", number: "02", name: "Digital Image Processing Lab", description: "Apply Sobel edges and custom filters kernels on OpenCV image matrices.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 6,
        name: "Semester 6",
        description: "Computer Vision Deep Learning, Predictive Analysis, and Capstone Project Work",
        status: "Locked",
        modulesCount: 10,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "deep_cv",
            name: "Deep Learning for Computer Vision",
            description: "Convolutional Neural Networks (CNNs), object localized tagging, image masks, and GANs generators.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Eye",
            bgColor: "bg-pink-50 text-pink-800",
            textColor: "text-pink-800",
            progressPercent: 0,
            units: [
              { id: "cv_u1", number: "01", name: "Unit 1: Convolutional Neural Networks", description: "Pooling filters, padding formulas, kernel weight structures, and ResNet models.", masteryPercent: 0, status: "Locked" },
              { id: "cv_u2", number: "02", name: "Unit 2: Object Detection", description: "YOLO classification models, bounding box regression, intersection-over-union metric.", masteryPercent: 0, status: "Locked" },
              { id: "cv_u3", number: "03", name: "Unit 3: Image Segmentation", description: "Semantic vs instance classification, UNet models, and pixel-level mask tags.", masteryPercent: 0, status: "Locked" },
              { id: "cv_u4", number: "04", name: "Unit 4: GANs", description: "Generators and Discriminators training pipelines, synthetic images generation.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "predictive_analysis",
            name: "Predictive Analysis",
            description: "Forecasting mathematical trends, logistic modeling regressions, and ensemble trees algorithms.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "TrendingUp",
            bgColor: "bg-yellow-50 text-yellow-800",
            textColor: "text-yellow-800",
            progressPercent: 0,
            units: [
              { id: "pa_u1", number: "01", name: "Unit 1: Linear & Logistic Models", description: "Fittings mathematical variables, log-likelihood ratios, and confusion matrix validation.", masteryPercent: 0, status: "Locked" },
              { id: "pa_u2", number: "02", name: "Unit 2: Time Series Forecasting", description: "ARIMA statistical formulas, trend indicators, stationarity checks, and LSTM models.", masteryPercent: 0, status: "Locked" },
              { id: "pa_u3", number: "03", name: "Unit 3: Ensemble Learning", description: "Random Forests models, AdaBoost frameworks, and XGBoost gradient boosters.", masteryPercent: 0, status: "Locked" },
              { id: "pa_u4", number: "04", name: "Unit 4: Model Evaluation", description: "K-fold cross-validation, ROC curves analysis, and precision-recall tradeoffs.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "project_work",
            name: "Project Work",
            description: "Full-scale software development and deployment. Requires database design, modeling, and system verification.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Workflow",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 0,
            units: [
              { id: "pw_u1", number: "01", name: "Unit 1: System Requirement Analysis", description: "Flowcharting specifications, data dictionary models, and architecture design.", masteryPercent: 0, status: "Locked" },
              { id: "pw_u2", number: "02", name: "Unit 2: Interface Design", description: "Responsive component layouts and REST API route blueprints.", masteryPercent: 0, status: "Locked" },
              { id: "pw_u3", number: "03", name: "Unit 3: Core Implementation", description: "Backend models construction, frontend bindings, and database migrations.", masteryPercent: 0, status: "Locked" },
              { id: "pw_u4", number: "04", name: "Unit 4: System Integration & Testing", description: "Deploying nodes, stress tests, security logs verification, and project thesis.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "soft_skills",
            name: "Soft Skills",
            description: "Professional workplace communication, team project management, resumes composition, and public speaking.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "BookOpen",
            bgColor: "bg-teal-50 text-teal-800",
            textColor: "text-teal-800",
            progressPercent: 0,
            units: [
              { id: "ss_u1", number: "01", name: "Unit 1: Interpersonal Communication", description: "Active listening, collaborative writing, and constructive peer reviews.", masteryPercent: 0, status: "Locked" },
              { id: "ss_u2", number: "02", name: "Unit 2: Resume Building", description: "Drafting punchy technical summaries, formatting achievements, and organizing GitHub repositories.", masteryPercent: 0, status: "Locked" },
              { id: "ss_u3", number: "03", name: "Unit 3: Interview Mastery", description: "Answering algorithmic whiteboard challenges and behavioral scenario questions.", masteryPercent: 0, status: "Locked" },
              { id: "ss_u4", number: "04", name: "Unit 4: Public Speaking", description: "Structuring a technical presentation, designing clear slide decks, and managing Q&A.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: "general",
    name: "BCA GENERAL",
    description: "Bachelor of Computer Applications - Standard Curriculum with deep algorithmic focus",
    semesters: [
      {
        id: 1,
        name: "Semester 1",
        description: "Discrete Mathematics, Programming with C, and Computer Organization",
        status: "In Progress",
        modulesCount: 15,
        completedModules: 10,
        progressPercent: 66,
        borderClass: "border-[#fd9b65]",
        badgeBg: "bg-[#fff2e1] text-[#95491a]",
        badgeText: "Current",
        icon: "BookOpen",
        subjects: [
          {
            id: "gen_discrete",
            name: "Discrete Mathematics",
            description: "Graph theories, set structures, logic tables, and matrices operations.",
            modulesCount: 4,
            completedModules: 4,
            difficulty: "Core",
            icon: "Binary",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 100,
            units: [
              { id: "gd_u1", number: "01", name: "Unit 1: Sets & Logic", description: "Set proofs, operators, and boolean logical structures.", masteryPercent: 100, status: "Mastered" },
              { id: "gd_u2", number: "02", name: "Unit 2: Matrices", description: "Equations, determinants, and standard eigenvalues.", masteryPercent: 100, status: "Mastered" },
              { id: "gd_u3", number: "03", name: "Unit 3: Group Theory", description: "Permutations, cycles, and standard algebra rings.", masteryPercent: 100, status: "Mastered" },
              { id: "gd_u4", number: "04", name: "Unit 4: Graphs", description: "Euler pathways, chromatic numbers, and spanning trees.", masteryPercent: 100, status: "Mastered" }
            ],
            materials: []
          },
          {
            id: "gen_c",
            name: "Programming in C",
            description: "GCC compilation, control structures, pointers, matrices, and files IO.",
            modulesCount: 4,
            completedModules: 3,
            difficulty: "Intermediate",
            icon: "Braces",
            bgColor: "bg-orange-50 text-orange-800",
            textColor: "text-orange-800",
            progressPercent: 75,
            units: [
              { id: "gc_u1", number: "01", name: "Unit 1: Syntax Overview", description: "Operators, variables, types, and compiler operations.", masteryPercent: 100, status: "Mastered" },
              { id: "gc_u2", number: "02", name: "Unit 2: Array Loops", description: "For loops, while loops, multidimensional arrays.", masteryPercent: 100, status: "Mastered" },
              { id: "gc_u3", number: "03", name: "Unit 3: Functions & Pointers", description: "Deref values, call by reference, stack variables.", masteryPercent: 80, status: "In Progress" },
              { id: "gc_u4", number: "04", name: "Unit 4: File IO Structures", description: "Pointers to files, records, binary streams.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 2,
        name: "Semester 2",
        description: "Data Structures, OOPs using Java, Operating Systems, and Environmental Studies",
        status: "Locked",
        modulesCount: 16,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "gen_ds_s2",
            name: "Data Structures",
            description: "Fundamental sorting, array searches, trees representation, stacks, and queues.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Core",
            icon: "Network",
            bgColor: "bg-teal-50 text-teal-800",
            textColor: "text-teal-800",
            progressPercent: 0,
            units: [
              { id: "gds2_u1", number: "01", name: "Unit 1: Arrays & Lists", description: "Inserting, traversing, and deleting inside linear linked lists.", masteryPercent: 0, status: "Locked" },
              { id: "gds2_u2", number: "02", name: "Unit 2: Stacks & Queues", description: "Push-pop algorithms, queues structures, and priority bounds.", masteryPercent: 0, status: "Locked" },
              { id: "gds2_u3", number: "03", name: "Unit 3: Sorting & Searching", description: "Merge sorts, selection, insertion, binary searching bounds.", masteryPercent: 0, status: "Locked" },
              { id: "gds2_u4", number: "04", name: "Unit 4: Non-Linear Trees", description: "Binary trees traversals, search nodes, and basic heaps structure.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "gen_oop_s2",
            name: "Object Oriented Programming (Java)",
            description: "Classes and object properties, inheritance hierarchies, interfaces, and packages.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "Coffee",
            bgColor: "bg-orange-50 text-orange-800",
            textColor: "text-orange-800",
            progressPercent: 0,
            units: [
              { id: "goop_u1", number: "01", name: "Unit 1: Java Basics", description: "JVM bytecodes, local data types, loop conditions, and keywords.", masteryPercent: 0, status: "Locked" },
              { id: "goop_u2", number: "02", name: "Unit 2: Class Polymorphism", description: "Method overloading, class inheritance structures, abstract rules.", masteryPercent: 0, status: "Locked" },
              { id: "goop_u3", number: "03", name: "Unit 3: Interfaces", description: "Specifying interfaces, multiple inheritances mock, pack declarations.", masteryPercent: 0, status: "Locked" },
              { id: "goop_u4", number: "04", name: "Unit 4: Exception Chains", description: "Throw triggers, try multicatch blocks, and customized asserts.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 3,
        name: "Semester 3",
        description: "DBMS, Software Engineering, and Computer Networks",
        status: "Locked",
        modulesCount: 12,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "gen_dbms",
            name: "Database Management System",
            description: "ER model mappings, relational algebraic equations, and 3NF normalizations.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Core",
            icon: "Database",
            bgColor: "bg-indigo-50 text-indigo-800",
            textColor: "text-indigo-800",
            progressPercent: 0,
            units: [
              { id: "gdbms_u1", number: "01", name: "Unit 1: DB Foundations", description: "ER mappings, schemas, entities, and relational tables keys.", masteryPercent: 0, status: "Locked" },
              { id: "gdbms_u2", number: "02", name: "Unit 2: Normalization", description: "Decomposing schemas into 1NF, 2NF, 3NF and BCNF.", masteryPercent: 0, status: "Locked" },
              { id: "gdbms_u3", number: "03", name: "Unit 3: Structured Query", description: "Select queries, nested queries, outer joins, and tables view.", masteryPercent: 0, status: "Locked" },
              { id: "gdbms_u4", number: "04", name: "Unit 4: ACID Transactions", description: "Serializability levels, locking guidelines, and rollback procedures.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 4,
        name: "Semester 4",
        description: "Web Programming, Computer Graphics, and Software Testing",
        status: "Locked",
        modulesCount: 12,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "gen_web",
            name: "Web Programming",
            description: "Develop interactive frontends using HTML5, CSS3, and modern Javascript.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "Layers",
            bgColor: "bg-fuchsia-50 text-fuchsia-800",
            textColor: "text-fuchsia-800",
            progressPercent: 0,
            units: [
              { id: "gweb_u1", number: "01", name: "Unit 1: HTML & CSS Markup", description: "Semantic boxes layout, grid grids, and flexible alignments.", masteryPercent: 0, status: "Locked" },
              { id: "gweb_u2", number: "02", name: "Unit 2: JS Scripting", description: "Asynchronous scripts, event loops, DOM, and local storage variables.", masteryPercent: 0, status: "Locked" },
              { id: "gweb_u3", number: "03", name: "Unit 3: Responsive layouts", description: "Media queries rules, mobile views, and viewport adjustments.", masteryPercent: 0, status: "Locked" },
              { id: "gweb_u4", number: "04", name: "Unit 4: Framework overview", description: "Client-side routing architectures, components state, and virtual nodes.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 5,
        name: "Semester 5",
        description: "Cryptography, Cloud Computing, and Mobile Applications",
        status: "Locked",
        modulesCount: 12,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "gen_crypt",
            name: "Cryptography & Security",
            description: "Mathematical encryptions, private keys signatures, and network security protocols.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "ShieldAlert",
            bgColor: "bg-pink-50 text-pink-800",
            textColor: "text-pink-800",
            progressPercent: 0,
            units: [
              { id: "gcr_u1", number: "01", name: "Unit 1: Encryption Ciphers", description: "Caesar shift, Vigenere, transposition matrices, and DES standard.", masteryPercent: 0, status: "Locked" },
              { id: "gcr_u2", number: "02", name: "Unit 2: Public Keys", description: "RSA modular arithmetic equations, Diffie-Hellman keys exchange.", masteryPercent: 0, status: "Locked" },
              { id: "gcr_u3", number: "03", name: "Unit 3: Hash Signatures", description: "SHA-256 blocks, collision limits, and public keys certificates.", masteryPercent: 0, status: "Locked" },
              { id: "gcr_u4", number: "04", name: "Unit 4: Firewall Proxies", description: "SSL handshakes protocols, firewalls setup, and intrusion sensors.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 6,
        name: "Semester 6",
        description: "Capstone Project and Cyber Security",
        status: "Locked",
        modulesCount: 8,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "gen_cyber",
            name: "Cyber Security Fundamentals",
            description: "Information assurance controls, software vulnerabilities patching, and ethical testing.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "ShieldAlert",
            bgColor: "bg-emerald-50 text-emerald-800",
            textColor: "text-emerald-800",
            progressPercent: 0,
            units: [
              { id: "gcy_u1", number: "01", name: "Unit 1: Threat Models", description: "Malware signatures, phish tricks, and buffer overflows vulnerabilities.", masteryPercent: 0, status: "Locked" },
              { id: "gcy_u2", number: "02", name: "Unit 2: Security Patch", description: "Secure programming bounds, SQL injection filters, inputs escape.", masteryPercent: 0, status: "Locked" },
              { id: "gcy_u3", number: "03", name: "Unit 3: Audit Compliance", description: "ISO 27001 rules, privacy acts, and security log audit trails.", masteryPercent: 0, status: "Locked" },
              { id: "gcy_u4", number: "04", name: "Unit 4: Forensic Checks", description: "Hard disk dumps inspection, registry logs, and network capture checks.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "gen_project",
            name: "Capstone Project Work",
            description: "Formulate requirements specifications, construct software modules, and write thesis files.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Workflow",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 0,
            units: [
              { id: "gpw_u1", number: "01", name: "Unit 1: SRS specifications", description: "Architectures diagrams, entities definitions, system specifications.", masteryPercent: 0, status: "Locked" },
              { id: "gpw_u2", number: "02", name: "Unit 2: Implementation", description: "Establish server databases, design frontend screens, compile controllers.", masteryPercent: 0, status: "Locked" },
              { id: "gpw_u3", number: "03", name: "Unit 3: Diagnostics Tests", description: "Write test suites, run edge cases validation, record benchmarks.", masteryPercent: 0, status: "Locked" },
              { id: "gpw_u4", number: "04", name: "Unit 4: Project Thesis", description: "Final software packaging, documentation files, and slides preparation.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: "ds",
    name: "BCA DS",
    description: "Bachelor of Computer Applications in Data Science - Statistics and Analytics specialization",
    semesters: [
      {
        id: 1,
        name: "Semester 1",
        description: "Math Foundations, Python Programming, and BI Tools",
        status: "In Progress",
        modulesCount: 15,
        completedModules: 12,
        progressPercent: 80,
        borderClass: "border-[#fd9b65]",
        badgeBg: "bg-[#fff2e1] text-[#95491a]",
        badgeText: "Current",
        icon: "BookOpen",
        subjects: [
          {
            id: "ds_math",
            name: "Mathematical Foundations",
            description: "Probability formulas, algebra vectors, calculus, and mathematical inductions.",
            modulesCount: 4,
            completedModules: 4,
            difficulty: "Core",
            icon: "Binary",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 100,
            units: [
              { id: "dsm_u1", number: "01", name: "Unit 1: Probability Theory", description: "Combinations, sets, events, and conditional Bayes curves.", masteryPercent: 100, status: "Mastered" },
              { id: "dsm_u2", number: "02", name: "Unit 2: Linear Vector Spaces", description: "Basis dimensions, spans, and linear mappings.", masteryPercent: 100, status: "Mastered" },
              { id: "dsm_u3", number: "03", name: "Unit 3: Differential Calculus", description: "Partial derivatives, limits, and optimizer maxima.", masteryPercent: 100, status: "Mastered" },
              { id: "dsm_u4", number: "04", name: "Unit 4: Mathematical Inductions", description: "Foundations of mathematical induction, proof construction, and recurrence relationships.", masteryPercent: 100, status: "Mastered" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 2,
        name: "Semester 2",
        description: "Probability and Statistics, R Programming, and Data Structures",
        status: "Locked",
        modulesCount: 12,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "ds_prob_s2",
            name: "Probability and Statistics",
            description: "Continuous distributions, probability density variables, and testing hypotheses.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Core",
            icon: "Binary",
            bgColor: "bg-blue-50 text-blue-800",
            textColor: "text-blue-800",
            progressPercent: 0,
            units: [
              { id: "dsp_u1", number: "01", name: "Unit 1: Random Variables", description: "Discrete vs continuous variables, density distributions curves, expect values.", masteryPercent: 0, status: "Locked" },
              { id: "dsp_u2", number: "02", name: "Unit 2: Distributions", description: "Poisson formulas, normal bell curves, binomial distributions calculations.", masteryPercent: 0, status: "Locked" },
              { id: "dsp_u3", number: "03", name: "Unit 3: Estimation Theory", description: "Point estimates, confidence interval margins, and bias metrics.", masteryPercent: 0, status: "Locked" },
              { id: "dsp_u4", number: "04", name: "Unit 4: Hypotheses tests", description: "Z-tests, T-distribution curves, chi-squared testing values.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "ds_r_prog",
            name: "R Programming",
            description: "Interactive scripting vectors, factors, dataframes, and statistical plots with ggplot2.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Intermediate",
            icon: "Terminal",
            bgColor: "bg-yellow-50 text-yellow-800",
            textColor: "text-yellow-800",
            progressPercent: 0,
            units: [
              { id: "dsr_u1", number: "01", name: "Unit 1: R Syntax Basics", description: "Vectors creation, lists indexing, arithmetic operations variables.", masteryPercent: 0, status: "Locked" },
              { id: "dsr_u2", number: "02", name: "Unit 2: Data Frames", description: "Importing csv tables, sorting row observations, handling null values.", masteryPercent: 0, status: "Locked" },
              { id: "dsr_u3", number: "03", name: "Unit 3: Graphics ggplot2", description: "Drawing scatter plots, histogram lines, box plots distributions.", masteryPercent: 0, status: "Locked" },
              { id: "dsr_u4", number: "04", name: "Unit 4: Regressions", description: "Linear regressions modeling, residuals checks, significance parameters.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 3,
        name: "Semester 3",
        description: "DBMS, Linear Algebra, and Data Mining",
        status: "Locked",
        modulesCount: 12,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "ds_dbms",
            name: "Database Management System",
            description: "SQL schemas, relational algebra operations, and transactional lock systems.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Core",
            icon: "Database",
            bgColor: "bg-indigo-50 text-indigo-800",
            textColor: "text-indigo-800",
            progressPercent: 0,
            units: [
              { id: "dsdb_u1", number: "01", name: "Unit 1: DB Entities", description: "Schemas, entities relational constraints, and table designs.", masteryPercent: 0, status: "Locked" },
              { id: "dsdb_u2", number: "02", name: "Unit 2: SQL Scripts", description: "Join queries, select filters, aggregators, and views.", masteryPercent: 0, status: "Locked" },
              { id: "dsdb_u3", number: "03", name: "Unit 3: Schema Normalization", description: "Normal structures (1NF, 2NF, 3NF, BCNF), dependencies mapping.", masteryPercent: 0, status: "Locked" },
              { id: "dsdb_u4", number: "04", name: "Unit 4: Concurrency control", description: "Deadlocks detection, serializability schedules, logging rollbacks.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 4,
        name: "Semester 4",
        description: "Machine Learning, Big Data Analytics, and Data Visualization",
        status: "Locked",
        modulesCount: 12,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "ds_ml",
            name: "Machine Learning",
            description: "Supervised and unsupervised classifiers, decision tree splits, and clustering.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "BrainCircuit",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 0,
            units: [
              { id: "dsml_u1", number: "01", name: "Unit 1: Supervised Classifiers", description: "Linear regression, logistic classifiers, and KNN algorithms.", masteryPercent: 0, status: "Locked" },
              { id: "dsml_u2", number: "02", name: "Unit 2: Tree Models", description: "Decision trees, entropy gini gains, and random forests aggregates.", masteryPercent: 0, status: "Locked" },
              { id: "dsml_u3", number: "03", name: "Unit 3: Support Vectors", description: "Hyperplanes margins, kernel tricks mapping, classification boundaries.", masteryPercent: 0, status: "Locked" },
              { id: "dsml_u4", number: "04", name: "Unit 4: Unsupervised clustering", description: "K-Means cluster points, hierarchical links, and PCA reduction.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 5,
        name: "Semester 5",
        description: "Natural Language Processing, Time Series Forecasting, and Cloud Analytics",
        status: "Locked",
        modulesCount: 12,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "ds_nlp",
            name: "Natural Language Processing",
            description: "Tokenizing preprocessors, syntax dictionaries, and deep embeddings.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Languages",
            bgColor: "bg-fuchsia-50 text-fuchsia-800",
            textColor: "text-fuchsia-800",
            progressPercent: 0,
            units: [
              { id: "dsnlp_u1", number: "01", name: "Unit 1: Text Parse", description: "RegEx filters, tokens, word stemmers, and lemmatizers.", masteryPercent: 0, status: "Locked" },
              { id: "dsnlp_u2", number: "02", name: "Unit 2: Sequence Mappings", description: "POS tagging models, chunking blocks, and named entity recognitions.", masteryPercent: 0, status: "Locked" },
              { id: "dsnlp_u3", number: "03", name: "Unit 3: Word Weights", description: "N-gram frequencies, TF-IDF representations, and word2vec dimensions.", masteryPercent: 0, status: "Locked" },
              { id: "dsnlp_u4", number: "04", name: "Unit 4: Transformers", description: "Self-attention nodes, transformer blocks, and sentiment prediction.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      },
      {
        id: 6,
        name: "Semester 6",
        description: "Predictive Analytics and Capstone Project Work",
        status: "Locked",
        modulesCount: 8,
        completedModules: 0,
        progressPercent: 0,
        borderClass: "border-outline-variant",
        badgeBg: "bg-surface-variant text-on-surface-variant",
        badgeText: "Locked",
        icon: "Lock",
        subjects: [
          {
            id: "ds_predictive",
            name: "Predictive Analytics",
            description: "Trend ARIMA forecasting models, confusion matrix scores, and precision rates.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "TrendingUp",
            bgColor: "bg-yellow-50 text-yellow-800",
            textColor: "text-yellow-800",
            progressPercent: 0,
            units: [
              { id: "dspd_u1", number: "01", name: "Unit 1: Forecasting Trend", description: "ARIMA parameters, season spikes, and stationarity diagnostics.", masteryPercent: 0, status: "Locked" },
              { id: "dspd_u2", number: "02", name: "Unit 2: Classification Bounds", description: "Confusion matrices calculations, precision metrics, and recall scores.", masteryPercent: 0, status: "Locked" },
              { id: "dspd_u3", number: "03", name: "Unit 3: Model validation", description: "K-fold cross verification loops, overfitting detections, and tuning.", masteryPercent: 0, status: "Locked" },
              { id: "dspd_u4", number: "04", name: "Unit 4: Deploy model", description: "Lightweight API servers, live prediction streams, and models logging.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          },
          {
            id: "ds_project",
            name: "Capstone Data Project",
            description: "Define real analytics datasets targets, build pipeline architectures, and write documentation.",
            modulesCount: 4,
            completedModules: 0,
            difficulty: "Advanced",
            icon: "Workflow",
            bgColor: "bg-[#fff2e1] text-[#95491a]",
            textColor: "text-[#95491a]",
            progressPercent: 0,
            units: [
              { id: "dspw_u1", number: "01", name: "Unit 1: Data Gathering", description: "Parsing web tables, public feeds download, database extraction.", masteryPercent: 0, status: "Locked" },
              { id: "dspw_u2", number: "02", name: "Unit 2: Model Training", description: "Fitting algorithms, hyperparameter grid search, metric curves.", masteryPercent: 0, status: "Locked" },
              { id: "dspw_u3", number: "03", name: "Unit 3: Visual App Dashboard", description: "Integrate charts, deploy dashboard panels, build predictions UI.", masteryPercent: 0, status: "Locked" },
              { id: "dspw_u4", number: "04", name: "Unit 4: Thesis Composing", description: "Compose final dissertation files, report performance matrices.", masteryPercent: 0, status: "Locked" }
            ],
            materials: []
          }
        ]
      }
    ]
  }
];

export const mockQuizQuestions = [
  {
    question: "What is the key benefit of Polymorphism in Java?",
    options: [
      "It allows you to restrict unauthorized access to class variables.",
      "It allows one interface to be used for a general class of actions, resolving implementations at runtime.",
      "It speeds up compilation and decreases memory footprint of JVM instances.",
      "It prevents classes from being subclassed or modified by other packages."
    ],
    answer: 1,
    explanation: "Polymorphism allows objects of different classes to be treated as objects of a common superclass, specifically letting a single interface define a group of actions resolved dynamically at runtime."
  },
  {
    question: "Which keyword is used to establish inheritance between classes in Java?",
    options: [
      "implements",
      "inherits",
      "extends",
      "import"
    ],
    answer: 2,
    explanation: "The 'extends' keyword is used in Java to indicate that a class is inherited from another class (superclass)."
  },
  {
    question: "What is encapsulation?",
    options: [
      "The process of combining data and the methods that operate on that data into a single unit (class) while restricting direct access.",
      "The technique of overriding superclass methods in subclasses.",
      "A way to define multiple methods with the same name but different signatures.",
      "The mechanism of loading compiled classes into the JVM memory space."
    ],
    answer: 0,
    explanation: "Encapsulation is bundling data and methods together in a class and hiding implementation details through private fields and public getters/setters."
  }
];
