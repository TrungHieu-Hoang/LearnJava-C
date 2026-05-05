require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Ép dùng Google DNS để vượt lỗi querySrv
const mongoose = require('mongoose');
const User = require('./models/User');
const Topic = require('./models/Topic');
const Exercise = require('./models/Exercise');
const Submission = require('./models/Submission');

const javaTopics = [
  { language: 'java', order: 1, title: 'Bài 0: Hướng dẫn & Làm quen', theoryHTML: '<h3>👋 Chào mừng đến với CodeCamp</h3><p>Nền tảng này giúp bạn vừa học lý thuyết vừa thực hành viết code ngay lập tức.</p><h4>🛠 Cách sử dụng giao diện:</h4><ul><li><strong>Bên trái:</strong> Cột lộ trình học, hãy đi theo thứ tự.</li><li><strong>Ở giữa:</strong> Đọc lý thuyết và chọn bài tập.</li><li><strong>Bên phải:</strong> Trình gõ code (IDE) để viết chương trình.</li></ul><h4>🚀 Cách nộp bài:</h4><p>Bấm <strong>Chạy Code</strong> để test thử với dữ liệu mẫu. Khi đã tự tin, hãy bấm <strong>Nộp Bài</strong> để máy chủ chấm điểm và đua Top trên Bảng xếp hạng nhé!</p><hr/><h3>☕ Giới thiệu Java</h3><p>Java là ngôn ngữ lập trình đa nền tảng. Mọi chương trình Java đều bắt đầu với một <code>class Main</code> và hàm <code>public static void main(String[] args)</code>.</p>', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        // Hãy bấm nút "Chạy code" để xem kết quả nhé:\n        System.out.println("Hello CodeCamp!");\n    }\n}' },
  { language: 'java', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong Java</h3><p>Các kiểu dữ liệu cơ bản: int, double, boolean, String...</p>', defaultCode: '' },
  { language: 'java', order: 3, title: 'Điều kiện if/switch', theoryHTML: '<h3>Lệnh điều kiện</h3><p>Sử dụng if/else để rẽ nhánh logic...</p>', defaultCode: '' },
  { language: 'java', order: 4, title: 'Vòng lặp for/while', theoryHTML: '<h3>Vòng lặp</h3><p>Thực hiện các khối lệnh lặp đi lặp lại...</p>', defaultCode: '' },
  { language: 'java', order: 5, title: 'Mảng 1D/2D', theoryHTML: '<h3>Mảng (Array)</h3><p>Lưu trữ nhiều giá trị cùng lúc...</p>', defaultCode: '' },
  { language: 'java', order: 6, title: 'Hàm & Đệ quy', theoryHTML: '<h3>Hàm (Method)</h3><p>Tái sử dụng các khối mã...</p>', defaultCode: '' },
  { language: 'java', order: 7, title: 'OOP cơ bản', theoryHTML: '<h3>Hướng đối tượng</h3><p>Class, Object, Inheritance, Polymorphism...</p>', defaultCode: '' },
  { language: 'java', order: 8, title: 'Collections & Generics', theoryHTML: '<h3>List, Set, Map</h3><p>Sử dụng thư viện java.util...</p>', defaultCode: '' }
];

const cppTopics = [
  { language: 'cpp', order: 1, title: 'Bài 0: Hướng dẫn & Làm quen', theoryHTML: '<h3>👋 Chào mừng đến với CodeCamp</h3><p>Nền tảng này giúp bạn vừa học lý thuyết vừa thực hành viết code ngay lập tức.</p><h4>🛠 Cách sử dụng giao diện:</h4><ul><li><strong>Bên trái:</strong> Cột lộ trình học, hãy đi theo thứ tự.</li><li><strong>Ở giữa:</strong> Đọc lý thuyết và chọn bài tập.</li><li><strong>Bên phải:</strong> Trình gõ code (IDE) để viết chương trình.</li></ul><h4>🚀 Cách nộp bài:</h4><p>Bấm <strong>Chạy Code</strong> để test thử với dữ liệu mẫu. Khi đã tự tin, hãy bấm <strong>Nộp Bài</strong> để máy chủ chấm điểm và đua Top trên Bảng xếp hạng nhé!</p><hr/><h3>⚡ Giới thiệu C++</h3><p>C++ là ngôn ngữ lập trình mạnh mẽ, siêu tốc độ. Mọi chương trình C++ phải có hàm <code>int main()</code> làm điểm bắt đầu.</p>', defaultCode: '#include <iostream>\n\nint main() {\n    // Hãy bấm nút "Chạy code" để xem kết quả nhé:\n    std::cout << "Hello CodeCamp!\\n";\n    return 0;\n}' },
  { language: 'cpp', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong C++</h3><p>int, float, double, char, bool...</p>', defaultCode: '' },
  { language: 'cpp', order: 3, title: 'Điều kiện', theoryHTML: '<h3>if/else, switch</h3><p>Rẽ nhánh chương trình...</p>', defaultCode: '' },
  { language: 'cpp', order: 4, title: 'Vòng lặp', theoryHTML: '<h3>for, while, do-while</h3><p>Lặp lại khối lệnh...</p>', defaultCode: '' },
  { language: 'cpp', order: 5, title: 'Hàm & Con trỏ', theoryHTML: '<h3>Functions & Pointers</h3><p>Con trỏ là khái niệm đặc biệt trong C/C++...</p>', defaultCode: '' },
  { language: 'cpp', order: 6, title: 'Reference & Vector', theoryHTML: '<h3>Tham chiếu và Vector</h3><p>Sử dụng mảng động std::vector...</p>', defaultCode: '' },
  { language: 'cpp', order: 7, title: 'Class & OOP', theoryHTML: '<h3>Lớp và Đối tượng</h3><p>Tính đóng gói, kế thừa...</p>', defaultCode: '' },
  { language: 'cpp', order: 8, title: 'Algorithms & Sort', theoryHTML: '<h3>Thuật toán</h3><p>Thư viện std::sort, binary_search...</p>', defaultCode: '' }
];

const cTopics = [
  { language: 'c', order: 1, title: 'Bài 0: Hướng dẫn & Làm quen', theoryHTML: '<h3>👋 Chào mừng đến với CodeCamp</h3><p>Nền tảng này giúp bạn vừa học lý thuyết vừa thực hành viết code ngay lập tức.</p><h4>🚀 Cách nộp bài:</h4><p>Bấm <strong>Chạy Code</strong> để test thử với dữ liệu mẫu. Khi đã tự tin, hãy bấm <strong>Nộp Bài</strong> để máy chủ chấm điểm nhé!</p><hr/><h3>⚡ Giới thiệu C</h3><p>C là ngôn ngữ lập trình nền tảng, mạnh mẽ và gần với phần cứng nhất.</p>', defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello CodeCamp!\\n");\n    return 0;\n}' },
  { language: 'c', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong C</h3><p>int, float, double, char...</p>', defaultCode: '' },
  { language: 'c', order: 3, title: 'Điều kiện', theoryHTML: '<h3>if/else, switch</h3><p>Rẽ nhánh chương trình...</p>', defaultCode: '' },
  { language: 'c', order: 4, title: 'Vòng lặp', theoryHTML: '<h3>for, while, do-while</h3><p>Lặp lại khối lệnh...</p>', defaultCode: '' },
  { language: 'c', order: 5, title: 'Hàm & Con trỏ', theoryHTML: '<h3>Hàm & Con trỏ (Pointers)</h3><p>Con trỏ là khái niệm linh hồn của C...</p>', defaultCode: '' }
];

const pythonTopics = [
  { language: 'python', order: 1, title: 'Bài 0: Hướng dẫn & Làm quen', theoryHTML: '<h3>👋 Chào mừng đến với CodeCamp</h3><p>Nền tảng này giúp bạn vừa học lý thuyết vừa thực hành viết code ngay lập tức.</p><h4>🚀 Cách nộp bài:</h4><p>Bấm <strong>Chạy Code</strong> để test thử với dữ liệu mẫu. Khi đã tự tin, hãy bấm <strong>Nộp Bài</strong> để máy chủ chấm điểm nhé!</p><hr/><h3>🐍 Giới thiệu Python</h3><p>Python là ngôn ngữ cực kỳ dễ học, cú pháp ngắn gọn và rất mạnh mẽ trong AI/Data.</p>', defaultCode: '# Hãy bấm nút "Chạy code" để xem kết quả nhé:\nprint("Hello CodeCamp!")' },
  { language: 'python', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong Python</h3><p>int, float, str, bool...</p>', defaultCode: '' },
  { language: 'python', order: 3, title: 'Điều kiện', theoryHTML: '<h3>if/elif/else</h3><p>Rẽ nhánh chương trình...</p>', defaultCode: '' },
  { language: 'python', order: 4, title: 'Vòng lặp', theoryHTML: '<h3>for, while</h3><p>Lặp lại khối lệnh...</p>', defaultCode: '' },
  { language: 'python', order: 5, title: 'Cấu trúc dữ liệu', theoryHTML: '<h3>List, Tuple, Set, Dict</h3><p>Lưu trữ và xử lý dữ liệu linh hoạt...</p>', defaultCode: '' }
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

// Hàm tạo bài tập đa dạng cho từng topic
// Hàm helper tạo số ngẫu nhiên
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Hàm tạo bài tập đa dạng cho từng topic
const generateMoreExercisesForTopic = (topic, allExercises) => {
  const difficulties = ['easy', 'medium', 'hard'];
  const sources = ['Codeforces', 'LeetCode', 'HackerRank', 'VNOJ'];
  const tags = ['math', 'string', 'array', 'sorting', 'greedy', 'dp'];
  const lang = topic.language;
  const tTitle = topic.title.toLowerCase();

  let starter = '';
  if (lang === 'java') starter = 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Code của bạn ở đây\n        \n    }\n}';
  else if (lang === 'cpp') starter = '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Code của bạn ở đây\n    \n    return 0;\n}';
  else if (lang === 'c') starter = '#include <stdio.h>\n\nint main() {\n    // Code của bạn ở đây\n    \n    return 0;\n}';
  else if (lang === 'python') starter = '# Code của bạn ở đây\n\n';

  const categoryTemplates = [];

  // Sinh 20 bài tập ngẫu nhiên cho mỗi lộ trình/topic
  for (let i = 1; i <= 20; i++) {
    let title, desc, tests = [];
    
    // Tạo 10 test cases cho mỗi bài tập
    if (tTitle.includes('làm quen') || tTitle.includes('hello')) {
      const msg = ['Hello World', 'CodeCamp', 'Xin Chao', 'Lap Trinh', 'Java C++ Python'][randInt(0, 4)] + ` ${i}`;
      title = `In thông điệp ${i}`;
      desc = `<p>Bạn hãy viết chương trình in ra màn hình chính xác dòng chữ: <code>${msg}</code></p>
              <h4>Dữ liệu vào:</h4><ul><li>Không có dữ liệu đầu vào.</li></ul>
              <h4>Dữ liệu ra:</h4><ul><li>Dòng chữ <code>${msg}</code></li></ul>`;
      for(let t=0; t<10; t++) tests.push({ i: '', o: msg });
    } 
    else if (tTitle.includes('biến') || tTitle.includes('kiểu')) {
      const operations = ['+', '-', '*'];
      const op = operations[i % 3];
      title = `Phép toán ${op} với số ${i}`;
      desc = `<p>Cho hai số nguyên <code>a</code> và <code>b</code>. Tính và in ra kết quả của <code>a ${op} b</code>.</p>
              <h4>Dữ liệu vào:</h4><ul><li>Hai số <code>a, b</code> cách nhau bởi khoảng trắng.</li></ul>
              <h4>Dữ liệu ra:</h4><ul><li>Kết quả <code>a ${op} b</code>.</li></ul>`;
      for(let t=0; t<12; t++) {
        let a = randInt(-1000, 1000), b = randInt(-1000, 1000);
        let ans = op === '+' ? a + b : (op === '-' ? a - b : a * b);
        tests.push({ i: `${a} ${b}`, o: `${ans}` });
      }
    } 
    else if (tTitle.includes('điều kiện') || tTitle.includes('if')) {
      title = `Kiểm tra số chia hết cho ${i + 1}`;
      let div = (i % 9) + 2;
      desc = `<p>Cho số nguyên <code>N</code>. Kiểm tra xem <code>N</code> có chia hết cho <code>${div}</code> hay không. Nếu có in <code>YES</code>, nếu không in <code>NO</code>.</p>`;
      for(let t=0; t<10; t++) {
        let n = randInt(-10000, 10000);
        tests.push({ i: `${n}`, o: n % div === 0 ? 'YES' : 'NO' });
      }
    } 
    else if (tTitle.includes('vòng lặp') || tTitle.includes('for')) {
      title = `Tính tổng từ 1 đến N (Bài ${i})`;
      let multiplier = randInt(1, 5);
      desc = `<p>Tính tổng dãy số <code>${multiplier}*1 + ${multiplier}*2 + ... + ${multiplier}*N</code>.</p>
              <h4>Dữ liệu vào:</h4><ul><li>Số nguyên dương <code>N</code>.</li></ul>
              <h4>Dữ liệu ra:</h4><ul><li>Tổng tính được.</li></ul>`;
      for(let t=0; t<10; t++) {
        let n = randInt(1, 100);
        let sum = (n * (n + 1) / 2) * multiplier;
        tests.push({ i: `${n}`, o: `${sum}` });
      }
    } 
    else if (tTitle.includes('mảng') || tTitle.includes('vector') || tTitle.includes('array')) {
      title = `Xử lý mảng (Version ${i})`;
      let target = randInt(1, 10);
      desc = `<p>Cho mảng có <code>N</code> phần tử. Đếm xem có bao nhiêu số lớn hơn hoặc bằng <code>${target}</code> trong mảng.</p>
              <h4>Dữ liệu vào:</h4><ul><li>Dòng 1: Số nguyên <code>N</code>.</li><li>Dòng 2: <code>N</code> số nguyên.</li></ul>
              <h4>Dữ liệu ra:</h4><ul><li>Số lượng phần tử thỏa mãn.</li></ul>`;
      for(let t=0; t<10; t++) {
        let n = randInt(5, 20);
        let arr = Array.from({length: n}, () => randInt(-20, 20));
        let count = arr.filter(x => x >= target).length;
        tests.push({ i: `${n}\n${arr.join(' ')}`, o: `${count}` });
      }
    } 
    else {
      // Hàm, Chuỗi, Cấu trúc, Thuật toán, Xử lý lỗi...
      title = `Bài tập tổng hợp ${i}`;
      let c = randInt(1, 100);
      desc = `<p>Cho số nguyên <code>X</code>. In ra giá trị <code>X + ${c}</code>.</p>`;
      for(let t=0; t<10; t++) {
        let x = randInt(-1000, 1000);
        tests.push({ i: `${x}`, o: `${x + c}` });
      }
    }

    categoryTemplates.push({ title, desc, tests });
  }

  categoryTemplates.forEach((tpl) => {
    allExercises.push({
      title: tpl.title,
      topicId: topic._id,
      language: lang,
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      description: tpl.desc,
      starterCode: starter,
      testCases: tpl.tests.map(t => ({ input: t.i, expectedOutput: t.o })),
      points: Math.floor(Math.random() * 20) + 10,
      tags: [tags[Math.floor(Math.random() * tags.length)]]
    });
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
    const insertedJavaTopics = await Topic.insertMany(javaTopics);
    const insertedCppTopics = await Topic.insertMany(cppTopics);
    const insertedCTopics = await Topic.insertMany(cTopics);
    const insertedPythonTopics = await Topic.insertMany(pythonTopics);
    
    const allTopics = [...insertedJavaTopics, ...insertedCppTopics, ...insertedCTopics, ...insertedPythonTopics];
    console.log('Topics seeded');

    // Thêm các exercises
    const allExercises = [];
    allTopics.forEach(topic => {
      generateMoreExercisesForTopic(topic, allExercises);
    });
    
    await Exercise.insertMany(allExercises);
    console.log(`Exercises seeded (${allExercises.length} bài tập)`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
