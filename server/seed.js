require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Topic = require('./models/Topic');
const Exercise = require('./models/Exercise');
const Submission = require('./models/Submission');

const javaTopics = [
  { language: 'java', order: 1, title: 'Hello World', theoryHTML: '<h3>Giới thiệu Java</h3><p>Java là ngôn ngữ hướng đối tượng...</p>', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}' },
  { language: 'java', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong Java</h3><p>int, double, boolean, String...</p>', defaultCode: '' },
  { language: 'java', order: 3, title: 'Điều kiện if/switch', theoryHTML: '<h3>Lệnh điều kiện</h3>', defaultCode: '' },
  { language: 'java', order: 4, title: 'Vòng lặp for/while', theoryHTML: '<h3>Vòng lặp</h3>', defaultCode: '' },
  { language: 'java', order: 5, title: 'Mảng 1D/2D', theoryHTML: '<h3>Mảng</h3>', defaultCode: '' },
  { language: 'java', order: 6, title: 'Hàm & Đệ quy', theoryHTML: '<h3>Hàm</h3>', defaultCode: '' },
  { language: 'java', order: 7, title: 'OOP cơ bản', theoryHTML: '<h3>Hướng đối tượng</h3>', defaultCode: '' },
  { language: 'java', order: 8, title: 'Collections & Generics', theoryHTML: '<h3>List, Set, Map</h3>', defaultCode: '' }
];

const cppTopics = [
  { language: 'cpp', order: 1, title: 'Hello World', theoryHTML: '<h3>Giới thiệu C++</h3><p>C++ là ngôn ngữ lập trình mạnh mẽ...</p>', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}' },
  { language: 'cpp', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong C++</h3>', defaultCode: '' },
  { language: 'cpp', order: 3, title: 'Điều kiện', theoryHTML: '<h3>if/else, switch</h3>', defaultCode: '' },
  { language: 'cpp', order: 4, title: 'Vòng lặp', theoryHTML: '<h3>for, while, do-while</h3>', defaultCode: '' },
  { language: 'cpp', order: 5, title: 'Hàm & Con trỏ', theoryHTML: '<h3>Functions & Pointers</h3>', defaultCode: '' },
  { language: 'cpp', order: 6, title: 'Reference & STL Vector', theoryHTML: '<h3>Tham chiếu và Vector</h3>', defaultCode: '' },
  { language: 'cpp', order: 7, title: 'Class & OOP', theoryHTML: '<h3>Lớp và Đối tượng</h3>', defaultCode: '' },
  { language: 'cpp', order: 8, title: 'Algorithms & Sort', theoryHTML: '<h3>Thuật toán</h3>', defaultCode: '' }
];

const exercises = [
  // Java Exercises
  {
    title: 'Two Sum', language: 'java', difficulty: 'easy', source: 'LeetCode',
    description: 'Cho mảng số nguyên nums và một số nguyên target, trả về chỉ số của 2 số sao cho tổng của chúng bằng target.\nĐầu vào: N Dòng 1: N (số lượng phần tử), Dòng 2: N số nguyên, Dòng 3: target.\nĐầu ra: 2 chỉ số cách nhau bởi khoảng trắng.',
    starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Viết code tại đây\n    }\n}',
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2' },
      { input: '2\n3 3\n6', expectedOutput: '0 1' }
    ],
    points: 10, tags: ['array', 'hash-table']
  },
  {
    title: 'Palindrome Number', language: 'java', difficulty: 'easy', source: 'LeetCode',
    description: 'Kiểm tra xem một số nguyên x có phải là số đối xứng hay không. In ra "true" hoặc "false".',
    starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n    }\n}',
    testCases: [
      { input: '121', expectedOutput: 'true' },
      { input: '-121', expectedOutput: 'false' },
      { input: '10', expectedOutput: 'false' }
    ],
    points: 10, tags: ['math']
  },
  {
    title: 'Plus Minus', language: 'java', difficulty: 'easy', source: 'HackerRank',
    description: 'Cho mảng n số nguyên. In ra tỉ lệ của số dương, số âm và số 0 trong mảng (làm tròn 6 chữ số thập phân, mỗi kết quả trên 1 dòng).',
    starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}',
    testCases: [
      { input: '6\n-4 3 -9 0 4 1', expectedOutput: '0.500000\n0.333333\n0.166667' },
      { input: '5\n1 2 3 -1 -2', expectedOutput: '0.600000\n0.400000\n0.000000' }
    ],
    points: 15, tags: ['array', 'math']
  },
  {
    title: 'Watermelon', language: 'java', difficulty: 'easy', source: 'Codeforces',
    description: 'Một quả dưa hấu có trọng lượng w (1 <= w <= 100). Kiểm tra xem có thể chia nó thành 2 phần, mỗi phần có trọng lượng là một số chẵn không. In ra "YES" hoặc "NO".',
    starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}',
    testCases: [
      { input: '8', expectedOutput: 'YES' },
      { input: '2', expectedOutput: 'NO' },
      { input: '5', expectedOutput: 'NO' }
    ],
    points: 10, tags: ['math']
  },
  {
    title: 'Tính tổng', language: 'java', difficulty: 'easy', source: 'VNOJ',
    description: 'Cho 2 số nguyên a và b. In ra tổng a + b.',
    starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}',
    testCases: [
      { input: '1 2', expectedOutput: '3' },
      { input: '100 -50', expectedOutput: '50' },
      { input: '0 0', expectedOutput: '0' }
    ],
    points: 5, tags: ['basic']
  },
  
  // C++ Exercises
  {
    title: 'Two Sum C++', language: 'cpp', difficulty: 'easy', source: 'LeetCode',
    description: 'Cho mảng số nguyên nums và một số nguyên target, trả về chỉ số của 2 số sao cho tổng của chúng bằng target.\nĐầu vào: N Dòng 1: N (số lượng phần tử), Dòng 2: N số nguyên, Dòng 3: target.\nĐầu ra: 2 chỉ số cách nhau bởi khoảng trắng.',
    starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Viết code tại đây\n    return 0;\n}',
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2' },
      { input: '2\n3 3\n6', expectedOutput: '0 1' }
    ],
    points: 10, tags: ['array', 'hash-table']
  },
  {
    title: 'Way Too Long Words', language: 'cpp', difficulty: 'easy', source: 'Codeforces',
    description: 'Nếu một từ có độ dài lớn hơn 10 ký tự, nó được coi là quá dài. Từ này sẽ được viết tắt bằng ký tự đầu tiên, số lượng ký tự ở giữa, và ký tự cuối cùng. In ra từ đã chuyển đổi hoặc giữ nguyên nếu độ dài <= 10. Đầu vào: n (số từ), n dòng tiếp theo là các từ.',
    starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '4\nword\nlocalization\ninternationalization\npneumonoultramicroscopicsilicovolcanoconiosis', expectedOutput: 'word\nl10n\ni18n\np43s' }
    ],
    points: 15, tags: ['string']
  },
  {
    title: 'Bubble Sort', language: 'cpp', difficulty: 'easy', source: 'GeeksforGeeks',
    description: 'Cài đặt thuật toán Bubble Sort. Đầu vào: n (số phần tử), n phần tử. Đầu ra: mảng đã sắp xếp.',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '5\n4 1 3 9 7', expectedOutput: '1 3 4 7 9' },
      { input: '10\n10 9 8 7 6 5 4 3 2 1', expectedOutput: '1 2 3 4 5 6 7 8 9 10' }
    ],
    points: 10, tags: ['sorting']
  },
  {
    title: 'Staircase', language: 'cpp', difficulty: 'easy', source: 'HackerRank',
    description: 'In ra cầu thang bằng ký tự # và khoảng trắng, chiều cao n. Cầu thang căn phải.',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '4', expectedOutput: '   #\n  ##\n ###\n####' },
      { input: '6', expectedOutput: '     #\n    ##\n   ###\n  ####\n #####\n######' }
    ],
    points: 10, tags: ['loop']
  },
  {
    title: 'Số nguyên tố', language: 'cpp', difficulty: 'easy', source: 'VNOJ',
    description: 'Kiểm tra n có phải số nguyên tố không. In YES hoặc NO.',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '7', expectedOutput: 'YES' },
      { input: '10', expectedOutput: 'NO' },
      { input: '2', expectedOutput: 'YES' }
    ],
    points: 10, tags: ['math']
  }
];

// Hàm tạo thêm bài tập để đủ 20 bài mỗi ngôn ngữ
const generateMoreExercises = () => {
  const sources = ['LeetCode', 'HackerRank', 'Codeforces', 'VNOJ', 'GeeksforGeeks'];
  const difficulties = ['easy', 'medium', 'hard'];
  const tags = ['array', 'math', 'string', 'sorting', 'dp', 'graph', 'tree'];
  
  const langs = ['java', 'cpp'];
  
  langs.forEach(lang => {
    const currentCount = exercises.filter(e => e.language === lang).length;
    for (let i = currentCount + 1; i <= 20; i++) {
      exercises.push({
        title: `Bài tập tự động ${lang.toUpperCase()} #${i}`,
        language: lang,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        description: `Đây là mô tả cho bài tập tự động #${i}. Viết chương trình đọc vào 1 số và in ra số đó nhân 2.`,
        starterCode: lang === 'java' 
          ? 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) System.out.println(sc.nextInt() * 2);\n    }\n}'
          : '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n; if(cin >> n) cout << n * 2;\n    return 0;\n}',
        testCases: [
          { input: '5', expectedOutput: '10' },
          { input: '12', expectedOutput: '24' },
          { input: '-3', expectedOutput: '-6' }
        ],
        points: Math.floor(Math.random() * 20) + 10,
        tags: [tags[Math.floor(Math.random() * tags.length)]]
      });
    }
  });
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await Topic.deleteMany({});
    await Exercise.deleteMany({});
    await Submission.deleteMany({});
    
    // Thêm các topics
    await Topic.insertMany(javaTopics);
    await Topic.insertMany(cppTopics);
    console.log('Topics seeded');

    // Thêm các exercises
    generateMoreExercises();
    await Exercise.insertMany(exercises);
    console.log(`Exercises seeded (${exercises.length} bài tập)`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
