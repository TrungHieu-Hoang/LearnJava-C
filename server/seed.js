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
  { language: 'java', order: 8, title: 'Collections & Generics', theoryHTML: '<h3>List, Set, Map</h3><p>Sử dụng thư viện java.util...</p>', defaultCode: '' },
  { language: 'java', order: 9, title: 'Xử lý ngoại lệ', theoryHTML: '<h3>Try/Catch</h3><p>Bắt lỗi và xử lý ngoại lệ an toàn...</p>', defaultCode: '' },
  { language: 'java', order: 10, title: 'File I/O', theoryHTML: '<h3>Đọc/Ghi File</h3><p>Làm việc với File trong Java...</p>', defaultCode: '' }
];

const cppTopics = [
  { language: 'cpp', order: 1, title: 'Bài 0: Hướng dẫn & Làm quen', theoryHTML: '<h3>👋 Chào mừng đến với CodeCamp</h3><p>Nền tảng này giúp bạn vừa học lý thuyết vừa thực hành viết code ngay lập tức.</p><h4>🛠 Cách sử dụng giao diện:</h4><ul><li><strong>Bên trái:</strong> Cột lộ trình học, hãy đi theo thứ tự.</li><li><strong>Ở giữa:</strong> Đọc lý thuyết và chọn bài tập.</li><li><strong>Bên phải:</strong> Trình gõ code (IDE) để viết chương trình.</li></ul><h4>🚀 Cách nộp bài:</h4><p>Bấm <strong>Chạy Code</strong> để test thử với dữ liệu mẫu. Khi đã tự tin, hãy bấm <strong>Nộp Bài</strong> để máy chủ chấm điểm và đua Top trên Bảng xếp hạng nhé!</p><hr/><h3>⚡ Giới thiệu C++</h3><p>C++ là ngôn ngữ lập trình mạnh mẽ, siêu tốc độ. Mọi chương trình C++ phải có hàm <code>int main()</code> làm điểm bắt đầu.</p>', defaultCode: '#include <iostream>\n\nint main() {\n    // Hãy bấm nút "Chạy code" để xem kết quả nhé:\n    std::cout << "Hello CodeCamp!\\n";\n    return 0;\n}' },
  { language: 'cpp', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong C++</h3><p>int, float, double, char, bool...</p>', defaultCode: '' },
  { language: 'cpp', order: 3, title: 'Điều kiện', theoryHTML: '<h3>if/else, switch</h3><p>Rẽ nhánh chương trình...</p>', defaultCode: '' },
  { language: 'cpp', order: 4, title: 'Vòng lặp', theoryHTML: '<h3>for, while, do-while</h3><p>Lặp lại khối lệnh...</p>', defaultCode: '' },
  { language: 'cpp', order: 5, title: 'Hàm & Con trỏ', theoryHTML: '<h3>Functions & Pointers</h3><p>Con trỏ là khái niệm đặc biệt trong C/C++...</p>', defaultCode: '' },
  { language: 'cpp', order: 6, title: 'Reference & Vector', theoryHTML: '<h3>Tham chiếu và Vector</h3><p>Sử dụng mảng động std::vector...</p>', defaultCode: '' },
  { language: 'cpp', order: 7, title: 'Class & OOP', theoryHTML: '<h3>Lớp và Đối tượng</h3><p>Tính đóng gói, kế thừa...</p>', defaultCode: '' },
  { language: 'cpp', order: 8, title: 'Algorithms & Sort', theoryHTML: '<h3>Thuật toán</h3><p>Thư viện std::sort, binary_search...</p>', defaultCode: '' },
  { language: 'cpp', order: 9, title: 'Xử lý ngoại lệ', theoryHTML: '<h3>Try/Catch</h3><p>Xử lý lỗi runtime trong C++...</p>', defaultCode: '' },
  { language: 'cpp', order: 10, title: 'File I/O', theoryHTML: '<h3>Đọc/Ghi File fstream</h3><p>Thao tác với tệp tin trong C++...</p>', defaultCode: '' }
];

const cTopics = [
  { language: 'c', order: 1, title: 'Bài 0: Hướng dẫn & Làm quen', theoryHTML: '<h3>👋 Chào mừng đến với CodeCamp</h3><p>Nền tảng này giúp bạn vừa học lý thuyết vừa thực hành viết code ngay lập tức.</p><h4>🚀 Cách nộp bài:</h4><p>Bấm <strong>Chạy Code</strong> để test thử với dữ liệu mẫu. Khi đã tự tin, hãy bấm <strong>Nộp Bài</strong> để máy chủ chấm điểm nhé!</p><hr/><h3>⚡ Giới thiệu C</h3><p>C là ngôn ngữ lập trình nền tảng, mạnh mẽ và gần với phần cứng nhất.</p>', defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello CodeCamp!\\n");\n    return 0;\n}' },
  { language: 'c', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong C</h3><p>int, float, double, char...</p>', defaultCode: '' },
  { language: 'c', order: 3, title: 'Điều kiện', theoryHTML: '<h3>if/else, switch</h3><p>Rẽ nhánh chương trình...</p>', defaultCode: '' },
  { language: 'c', order: 4, title: 'Vòng lặp', theoryHTML: '<h3>for, while, do-while</h3><p>Lặp lại khối lệnh...</p>', defaultCode: '' },
  { language: 'c', order: 5, title: 'Hàm & Con trỏ', theoryHTML: '<h3>Hàm & Con trỏ (Pointers)</h3><p>Con trỏ là khái niệm linh hồn của C...</p>', defaultCode: '' },
  { language: 'c', order: 6, title: 'Struct (Cấu trúc)', theoryHTML: '<h3>Kiểu dữ liệu tự định nghĩa</h3><p>Gộp các biến lại với nhau...</p>', defaultCode: '' },
  { language: 'c', order: 7, title: 'Chuỗi (String)', theoryHTML: '<h3>Mảng ký tự</h3><p>Hàm strlen, strcpy, strcmp...</p>', defaultCode: '' },
  { language: 'c', order: 8, title: 'Cấp phát động', theoryHTML: '<h3>malloc, calloc, free</h3><p>Quản lý bộ nhớ thủ công...</p>', defaultCode: '' },
  { language: 'c', order: 9, title: 'File I/O', theoryHTML: '<h3>Đọc/Ghi File</h3><p>Sử dụng fopen, fclose...</p>', defaultCode: '' },
  { language: 'c', order: 10, title: 'Macro & Tiền xử lý', theoryHTML: '<h3>#define, #include</h3><p>Chỉ thị tiền biên dịch...</p>', defaultCode: '' }
];

const pythonTopics = [
  { language: 'python', order: 1, title: 'Bài 0: Hướng dẫn & Làm quen', theoryHTML: '<h3>👋 Chào mừng đến với CodeCamp</h3><p>Nền tảng này giúp bạn vừa học lý thuyết vừa thực hành viết code ngay lập tức.</p><h4>🚀 Cách nộp bài:</h4><p>Bấm <strong>Chạy Code</strong> để test thử với dữ liệu mẫu. Khi đã tự tin, hãy bấm <strong>Nộp Bài</strong> để máy chủ chấm điểm nhé!</p><hr/><h3>🐍 Giới thiệu Python</h3><p>Python là ngôn ngữ cực kỳ dễ học, cú pháp ngắn gọn và rất mạnh mẽ trong AI/Data.</p>', defaultCode: '# Hãy bấm nút "Chạy code" để xem kết quả nhé:\nprint("Hello CodeCamp!")' },
  { language: 'python', order: 2, title: 'Biến & Kiểu dữ liệu', theoryHTML: '<h3>Biến trong Python</h3><p>int, float, str, bool...</p>', defaultCode: '' },
  { language: 'python', order: 3, title: 'Điều kiện', theoryHTML: '<h3>if/elif/else</h3><p>Rẽ nhánh chương trình...</p>', defaultCode: '' },
  { language: 'python', order: 4, title: 'Vòng lặp', theoryHTML: '<h3>for, while</h3><p>Lặp lại khối lệnh...</p>', defaultCode: '' },
  { language: 'python', order: 5, title: 'List & Tuple', theoryHTML: '<h3>Cấu trúc dữ liệu cơ bản</h3><p>Danh sách linh hoạt...</p>', defaultCode: '' },
  { language: 'python', order: 6, title: 'Set & Dictionary', theoryHTML: '<h3>Từ điển và Tập hợp</h3><p>Tra cứu dữ liệu siêu nhanh...</p>', defaultCode: '' },
  { language: 'python', order: 7, title: 'Hàm (Functions)', theoryHTML: '<h3>def & lambda</h3><p>Tạo và sử dụng hàm...</p>', defaultCode: '' },
  { language: 'python', order: 8, title: 'Xử lý chuỗi', theoryHTML: '<h3>String Methods</h3><p>Cắt chuỗi, tìm kiếm, format...</p>', defaultCode: '' },
  { language: 'python', order: 9, title: 'Class & OOP', theoryHTML: '<h3>Lập trình hướng đối tượng</h3><p>Xây dựng lớp và đối tượng...</p>', defaultCode: '' },
  { language: 'python', order: 10, title: 'File I/O & Exceptions', theoryHTML: '<h3>Đọc ghi file & Bắt lỗi</h3><p>with open và try/except...</p>', defaultCode: '' }
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
  const tags = ['math', 'string', 'array', 'sorting', 'greedy', 'dp', 'logic'];
  const lang = topic.language;
  const tTitle = topic.title.toLowerCase();

  let starter = '';
  if (lang === 'java') starter = 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Code của bạn ở đây\n        \n    }\n}';
  else if (lang === 'cpp') starter = '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Code của bạn ở đây\n    \n    return 0;\n}';
  else if (lang === 'c') starter = '#include <stdio.h>\n\nint main() {\n    // Code của bạn ở đây\n    \n    return 0;\n}';
  else if (lang === 'python') starter = '# Code của bạn ở đây\n\n';

  let templates = [];

  // 1. LÀM QUEN
  if (tTitle.includes('làm quen') || tTitle.includes('hello')) {
    const greetings = ["Hello World", "Xin Chao", "Lap Trinh", "CodeCamp", "Welcome", "Toi yeu Code", "Java C++ Python", "Start", "Beginner", "Test", "System", "Online Judge", "Compiler", "Success", "Passed", "Accepted", "Wrong Answer", "Time Limit", "Memory", "End"];
    for(let i=0; i<20; i++) {
      templates.push({
        t: `In thông điệp: ${greetings[i]}`,
        d: `Viết chương trình in ra chính xác dòng chữ: <code>${greetings[i]}</code>`,
        gen: () => ({ i: '', o: greetings[i] })
      });
    }
  } 
  // 2. BIẾN VÀ TOÁN TỬ
  else if (tTitle.includes('biến') || tTitle.includes('kiểu')) {
    templates = [
      { t: "Tổng 2 số", d: "Cho 2 số nguyên a, b. In ra tổng a + b", gen: () => { let a=randInt(-100,100), b=randInt(-100,100); return {i:`${a} ${b}`, o:`${a+b}`}; } },
      { t: "Hiệu 2 số", d: "Cho 2 số nguyên a, b. In ra hiệu a - b", gen: () => { let a=randInt(-100,100), b=randInt(-100,100); return {i:`${a} ${b}`, o:`${a-b}`}; } },
      { t: "Tích 2 số", d: "Cho 2 số nguyên a, b. In ra tích a * b", gen: () => { let a=randInt(-50,50), b=randInt(-50,50); return {i:`${a} ${b}`, o:`${a*b}`}; } },
      { t: "Chia nguyên", d: "Cho a, b. In ra phần nguyên của a chia b (a/b)", gen: () => { let a=randInt(1,100), b=randInt(1,20); return {i:`${a} ${b}`, o:`${Math.floor(a/b)}`}; } },
      { t: "Chia dư", d: "Cho a, b. In ra phần dư a % b", gen: () => { let a=randInt(1,100), b=randInt(1,20); return {i:`${a} ${b}`, o:`${a%b}`}; } },
      { t: "Diện tích HCN", d: "Cho chiều dài x, chiều rộng y. Tính diện tích", gen: () => { let a=randInt(1,50), b=randInt(1,50); return {i:`${a} ${b}`, o:`${a*b}`}; } },
      { t: "Chu vi HCN", d: "Cho chiều dài x, chiều rộng y. Tính chu vi", gen: () => { let a=randInt(1,50), b=randInt(1,50); return {i:`${a} ${b}`, o:`${2*(a+b)}`}; } },
      { t: "Bình phương", d: "Cho n. Tính n^2", gen: () => { let a=randInt(-100,100); return {i:`${a}`, o:`${a*a}`}; } },
      { t: "Lập phương", d: "Cho n. Tính n^3", gen: () => { let a=randInt(-50,50); return {i:`${a}`, o:`${a*a*a}`}; } },
      { t: "Trung bình cộng", d: "Cho 2 số a, b. Tính trung bình cộng (lấy phần nguyên)", gen: () => { let a=randInt(-100,100), b=randInt(-100,100); return {i:`${a} ${b}`, o:`${Math.floor((a+b)/2)}`}; } },
      { t: "Đổi giờ sang phút", d: "Cho h giờ. Hỏi bằng bao nhiêu phút?", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a*60}`}; } },
      { t: "Đổi phút sang giây", d: "Cho m phút. Hỏi bằng bao nhiêu giây?", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a*60}`}; } },
      { t: "Tính tuổi", d: "Cho năm sinh y. Tính tuổi vào năm 2030", gen: () => { let a=randInt(1900, 2030); return {i:`${a}`, o:`${2030-a}`}; } },
      { t: "Tiền lương", d: "Cho số giờ làm h, lương mỗi giờ w. Tính tổng lương", gen: () => { let a=randInt(1,40), b=randInt(10,50); return {i:`${a} ${b}`, o:`${a*b}`}; } },
      { t: "Điểm trung bình", d: "Cho điểm Toán, Văn, Anh. Tính tổng điểm", gen: () => { let a=randInt(0,10), b=randInt(0,10), c=randInt(0,10); return {i:`${a} ${b} ${c}`, o:`${a+b+c}`}; } },
      { t: "Tổng 3 số", d: "Cho a, b, c. Tính a + b + c", gen: () => { let a=randInt(-50,50), b=randInt(-50,50), c=randInt(-50,50); return {i:`${a} ${b} ${c}`, o:`${a+b+c}`}; } },
      { t: "Nhân 3 số", d: "Cho a, b, c. Tính a * b * c", gen: () => { let a=randInt(-10,10), b=randInt(-10,10), c=randInt(-10,10); return {i:`${a} ${b} ${c}`, o:`${a*b*c}`}; } },
      { t: "Chu vi tam giác", d: "Cho 3 cạnh a, b, c. Tính chu vi", gen: () => { let a=randInt(1,50), b=randInt(1,50), c=randInt(1,50); return {i:`${a} ${b} ${c}`, o:`${a+b+c}`}; } },
      { t: "Giá sau thuế", d: "Cho giá tiền p. Tính giá sau khi thêm thuế 10% (p + p/10, lấy nguyên)", gen: () => { let a=randInt(10,1000)*10; return {i:`${a}`, o:`${Math.floor(a*1.1)}`}; } },
      { t: "Đổi ngày sang giờ", d: "Cho d ngày. Hỏi bằng bao nhiêu giờ?", gen: () => { let a=randInt(1,365); return {i:`${a}`, o:`${a*24}`}; } }
    ];
  }
  // 3. ĐIỀU KIỆN
  else if (tTitle.includes('điều kiện') || tTitle.includes('if')) {
    templates = [
      { t: "Chẵn hay lẻ", d: "Cho N. N chẵn in CHAN, lẻ in LE", gen: () => { let a=randInt(-100,100); return {i:`${a}`, o: a%2===0 ? "CHAN" : "LE"}; } },
      { t: "Âm dương", d: "Cho N. N > 0 in DUONG, N < 0 in AM, N = 0 in ZERO", gen: () => { let a=randInt(-10,10); return {i:`${a}`, o: a>0 ? "DUONG" : (a<0 ? "AM" : "ZERO")}; } },
      { t: "Lớn hơn 100", d: "N > 100 in YES, ngược lại in NO", gen: () => { let a=randInt(0,200); return {i:`${a}`, o: a>100 ? "YES" : "NO"}; } },
      { t: "Chia hết cho 3", d: "N chia hết cho 3 in YES, ngược lại in NO", gen: () => { let a=randInt(1,100); return {i:`${a}`, o: a%3===0 ? "YES" : "NO"}; } },
      { t: "Chia hết cho 5", d: "N chia hết cho 5 in YES, ngược lại in NO", gen: () => { let a=randInt(1,100); return {i:`${a}`, o: a%5===0 ? "YES" : "NO"}; } },
      { t: "Max 2 số", d: "Cho a, b. In ra số lớn hơn", gen: () => { let a=randInt(-100,100), b=randInt(-100,100); return {i:`${a} ${b}`, o:`${Math.max(a,b)}`}; } },
      { t: "Min 2 số", d: "Cho a, b. In ra số nhỏ hơn", gen: () => { let a=randInt(-100,100), b=randInt(-100,100); return {i:`${a} ${b}`, o:`${Math.min(a,b)}`}; } },
      { t: "Năm nhuận", d: "Năm N có là năm nhuận không? (YES/NO)", gen: () => { let a=randInt(1900,2100); let isL = (a%400===0 || (a%4===0 && a%100!==0)); return {i:`${a}`, o: isL ? "YES" : "NO"}; } },
      { t: "Max 3 số", d: "Cho a, b, c. In ra số lớn nhất", gen: () => { let a=randInt(-100,100), b=randInt(-100,100), c=randInt(-100,100); return {i:`${a} ${b} ${c}`, o:`${Math.max(a,b,c)}`}; } },
      { t: "Min 3 số", d: "Cho a, b, c. In ra số nhỏ nhất", gen: () => { let a=randInt(-100,100), b=randInt(-100,100), c=randInt(-100,100); return {i:`${a} ${b} ${c}`, o:`${Math.min(a,b,c)}`}; } },
      { t: "Đậu hay rớt", d: "Điểm N >= 50 in PASS, ngược lại in FAIL", gen: () => { let a=randInt(0,100); return {i:`${a}`, o: a>=50 ? "PASS" : "FAIL"}; } },
      { t: "Số nguyên dương", d: "N >= 0 in POSITIVE, N < 0 in NEGATIVE", gen: () => { let a=randInt(-50,50); return {i:`${a}`, o: a>=0 ? "POSITIVE" : "NEGATIVE"}; } },
      { t: "Người lớn tuổi", d: "Tuổi N >= 18 in ADULT, N < 18 in CHILD", gen: () => { let a=randInt(1,100); return {i:`${a}`, o: a>=18 ? "ADULT" : "CHILD"}; } },
      { t: "Số có 2 chữ số", d: "N >= 10 và N <= 99 in YES, ngược lại in NO", gen: () => { let a=randInt(0,150); return {i:`${a}`, o: (a>=10 && a<=99) ? "YES" : "NO"}; } },
      { t: "Tam giác hợp lệ", d: "Cho a,b,c. Có tạo thành tam giác không? (YES/NO)", gen: () => { let a=randInt(1,10), b=randInt(1,10), c=randInt(1,10); let ok = a+b>c && a+c>b && b+c>a; return {i:`${a} ${b} ${c}`, o: ok?"YES":"NO"}; } },
      { t: "Nhiệt độ sôi", d: "Độ C >= 100 in BOIL, ngược lại in NOT BOIL", gen: () => { let a=randInt(0,150); return {i:`${a}`, o: a>=100 ? "BOIL" : "NOT BOIL"}; } },
      { t: "Số lớn hơn 0 và chẵn", d: "N > 0 và chẵn in YES, ngược lại in NO", gen: () => { let a=randInt(-20,20); return {i:`${a}`, o: (a>0 && a%2===0)?"YES":"NO"}; } },
      { t: "Bội số của 10", d: "N chia hết cho 10 in YES, ngược lại in NO", gen: () => { let a=randInt(1,200); return {i:`${a}`, o: a%10===0 ? "YES" : "NO"}; } },
      { t: "Học sinh giỏi", d: "Điểm N >= 8 in GIOI, N < 8 in KHONG GIOI", gen: () => { let a=randInt(0,10); return {i:`${a}`, o: a>=8 ? "GIOI" : "KHONG GIOI"}; } },
      { t: "Hai số bằng nhau", d: "a == b in EQUAL, a != b in NOT EQUAL", gen: () => { let a=randInt(1,5), b=randInt(1,5); return {i:`${a} ${b}`, o: a===b?"EQUAL":"NOT EQUAL"}; } }
    ];
  }
  // 4. VÒNG LẶP
  else if (tTitle.includes('vòng lặp') || tTitle.includes('for')) {
    templates = [
      { t: "Tổng 1 đến N", d: "Tính 1 + 2 + ... + N", gen: () => { let n=randInt(1,50); let sum = n*(n+1)/2; return {i:`${n}`, o:`${sum}`}; } },
      { t: "Giai thừa N", d: "Tính N! = 1 * 2 * ... * N", gen: () => { let n=randInt(1,10); let f=1; for(let j=1;j<=n;j++) f*=j; return {i:`${n}`, o:`${f}`}; } },
      { t: "Tổng chẵn 1..N", d: "Tính tổng các số chẵn <= N", gen: () => { let n=randInt(1,50); let sum=0; for(let j=2;j<=n;j+=2) sum+=j; return {i:`${n}`, o:`${sum}`}; } },
      { t: "Tổng lẻ 1..N", d: "Tính tổng các số lẻ <= N", gen: () => { let n=randInt(1,50); let sum=0; for(let j=1;j<=n;j+=2) sum+=j; return {i:`${n}`, o:`${sum}`}; } },
      { t: "Số lượng ước số", d: "Đếm N có bao nhiêu ước số", gen: () => { let n=randInt(1,100); let c=0; for(let j=1;j<=n;j++) if(n%j===0) c++; return {i:`${n}`, o:`${c}`}; } },
      { t: "In N dấu *", d: "In ra N dấu * liền nhau", gen: () => { let n=randInt(1,20); return {i:`${n}`, o: "*".repeat(n)}; } },
      { t: "Bảng cửu chương", d: "Cho N. In N*5", gen: () => { let n=randInt(1,10); return {i:`${n}`, o:`${n*5}`}; } },
      { t: "Đếm số chữ số", d: "N có bao nhiêu chữ số", gen: () => { let n=randInt(10,1000000); return {i:`${n}`, o:`${String(n).length}`}; } },
      { t: "Tổng các chữ số", d: "Tính tổng các chữ số của N", gen: () => { let n=randInt(10,1000000); let s=String(n).split('').reduce((a,b)=>a+parseInt(b),0); return {i:`${n}`, o:`${s}`}; } },
      { t: "Kiểm tra nguyên tố", d: "N có phải số nguyên tố? YES/NO", gen: () => { let n=randInt(1,50); let p=n>1; for(let j=2;j*j<=n;j++) if(n%j===0) p=false; return {i:`${n}`, o: p?"YES":"NO"}; } },
      { t: "In dãy giảm", d: "Cho N. In dãy giảm từ N về 1, cách nhau bởi khoảng trắng", gen: () => { let n=randInt(1,10); let r=[]; for(let j=n;j>=1;j--) r.push(j); return {i:`${n}`, o:r.join(" ")}; } },
      { t: "Bình phương 1..N", d: "Tổng các bình phương 1^2 + 2^2 + .. + N^2", gen: () => { let n=randInt(1,20); let s=0; for(let j=1;j<=n;j++) s+=j*j; return {i:`${n}`, o:`${s}`}; } },
      { t: "Chữ số lớn nhất", d: "Tìm chữ số lớn nhất của N", gen: () => { let n=randInt(10,1000000); let m=Math.max(...String(n).split('').map(Number)); return {i:`${n}`, o:`${m}`}; } },
      { t: "Chữ số chẵn", d: "Đếm số lượng chữ số chẵn của N", gen: () => { let n=randInt(10,1000000); let c=String(n).split('').filter(x=>x%2===0).length; return {i:`${n}`, o:`${c}`}; } },
      { t: "Tổng ước số", d: "Tổng các ước của N", gen: () => { let n=randInt(1,50); let s=0; for(let j=1;j<=n;j++) if(n%j===0) s+=j; return {i:`${n}`, o:`${s}`}; } },
      { t: "Số hoàn hảo", d: "N có là số hoàn hảo (Tổng ước nhỏ hơn nó = chính nó)? YES/NO", gen: () => { let n=randInt(2,30); let s=0; for(let j=1;j<n;j++) if(n%j===0) s+=j; return {i:`${n}`, o: s===n?"YES":"NO"}; } },
      { t: "Số Fibonacci", d: "Tìm F(N) với F(1)=1, F(2)=1. N <= 20", gen: () => { let n=randInt(1,20); let a=1,b=1; for(let j=3;j<=n;j++) { let t=a+b; a=b; b=t; } return {i:`${n}`, o:`${b}`}; } },
      { t: "Chữ số tận cùng", d: "In chữ số tận cùng của N", gen: () => { let n=randInt(10,100000); return {i:`${n}`, o:`${n%10}`}; } },
      { t: "Lặp N lần", d: "Cho N. In chữ 'A' N lần liền nhau", gen: () => { let n=randInt(1,20); return {i:`${n}`, o: "A".repeat(n)}; } },
      { t: "Tổng các số chia hết 3", d: "Tổng các số chia hết cho 3 từ 1..N", gen: () => { let n=randInt(1,50); let s=0; for(let j=3;j<=n;j+=3) s+=j; return {i:`${n}`, o:`${s}`}; } }
    ];
  }
  // 5. MẢNG
  else if (tTitle.includes('mảng') || tTitle.includes('array') || tTitle.includes('vector')) {
    templates = [
      { t: "Tổng mảng", d: "Tính tổng N phần tử", opArr: (arr) => arr.reduce((a,b)=>a+b,0) },
      { t: "Max mảng", d: "Tìm phần tử lớn nhất", opArr: (arr) => Math.max(...arr) },
      { t: "Min mảng", d: "Tìm phần tử nhỏ nhất", opArr: (arr) => Math.min(...arr) },
      { t: "Đếm số chẵn", d: "Đếm số lượng số chẵn", opArr: (arr) => arr.filter(x=>x%2===0).length },
      { t: "Đếm số lẻ", d: "Đếm số lượng số lẻ", opArr: (arr) => arr.filter(x=>x%2!==0).length },
      { t: "Đếm số âm", d: "Đếm số lượng phần tử âm", opArr: (arr) => arr.filter(x=>x<0).length },
      { t: "Đếm số dương", d: "Đếm số lượng phần tử dương (>0)", opArr: (arr) => arr.filter(x=>x>0).length },
      { t: "Tổng các số chẵn", d: "Tính tổng các phần tử chẵn", opArr: (arr) => arr.filter(x=>x%2===0).reduce((a,b)=>a+b,0) },
      { t: "Tổng các số lẻ", d: "Tính tổng các phần tử lẻ", opArr: (arr) => arr.filter(x=>x%2!==0).reduce((a,b)=>a+b,0) },
      { t: "Trung bình cộng mảng", d: "Tính TBC mảng (lấy phần nguyên)", opArr: (arr) => Math.floor(arr.reduce((a,b)=>a+b,0)/arr.length) },
      { t: "Phần tử đầu và cuối", d: "Tính tổng phần tử đầu tiên và cuối cùng", opArr: (arr) => arr[0] + arr[arr.length-1] },
      { t: "Có số 0 không?", d: "Mảng có số 0 không? In 1 nếu có, 0 nếu không", opArr: (arr) => arr.includes(0)?1:0 },
      { t: "Đếm phần tử > 10", d: "Đếm số lượng phần tử > 10", opArr: (arr) => arr.filter(x=>x>10).length },
      { t: "In đảo ngược mảng", d: "In các phần tử theo chiều ngược lại, cách khoảng trắng", opArrStr: (arr) => arr.slice().reverse().join(' ') },
      { t: "Sắp xếp tăng dần", d: "In mảng đã sắp xếp tăng dần, cách khoảng trắng", opArrStr: (arr) => arr.slice().sort((a,b)=>a-b).join(' ') },
      { t: "Phần tử ở index chẵn", d: "Tổng các phần tử ở vị trí 0, 2, 4...", opArr: (arr) => arr.filter((_,i)=>i%2===0).reduce((a,b)=>a+b,0) },
      { t: "Hiệu Max và Min", d: "Tính chênh lệch giữa phần tử lớn nhất và nhỏ nhất", opArr: (arr) => Math.max(...arr) - Math.min(...arr) },
      { t: "Nhân đôi mảng", d: "In ra mảng với mỗi phần tử được nhân 2", opArrStr: (arr) => arr.map(x=>x*2).join(' ') },
      { t: "Số lượng số chục", d: "Đếm phần tử chia hết cho 10", opArr: (arr) => arr.filter(x=>x%10===0).length },
      { t: "Tích số dương", d: "Tính tích các phần tử dương (Nếu không có in 0)", opArr: (arr) => { let pos = arr.filter(x=>x>0); return pos.length ? pos.reduce((a,b)=>a*b,1) : 0; } }
    ];
    templates = templates.map(t => {
      return {
        t: t.t,
        d: `<p>${t.d}.</p><h4>Dữ liệu vào:</h4><ul><li>Dòng 1: Số nguyên <code>N</code>.</li><li>Dòng 2: <code>N</code> số nguyên.</li></ul>`,
        gen: () => {
          let n = randInt(3, 10);
          let arr = Array.from({length: n}, () => randInt(-20, 20));
          let res = t.opArrStr ? t.opArrStr(arr) : t.opArr(arr);
          return { i: `${n}\n${arr.join(' ')}`, o: `${res}` };
        }
      };
    });
  }
  // 6. STRUCT
  else if (tTitle.includes('struct') || tTitle.includes('cấu trúc')) {
    templates = [
      { t: "Khoảng cách 2 điểm", d: "Cho 2 điểm A(x1, y1) và B(x2, y2). Tính bình phương khoảng cách giữa A và B", gen: () => { let x1=randInt(-10,10),y1=randInt(-10,10),x2=randInt(-10,10),y2=randInt(-10,10); return {i:`${x1} ${y1}\n${x2} ${y2}`, o:`${(x1-x2)**2 + (y1-y2)**2}`}; } },
      { t: "Trung điểm đoạn thẳng", d: "Cho 2 điểm A(x1, y1) và B(x2, y2). In ra tọa độ trung điểm (làm tròn xuống). Định dạng: x y", gen: () => { let x1=randInt(-10,10),y1=randInt(-10,10),x2=randInt(-10,10),y2=randInt(-10,10); return {i:`${x1} ${y1}\n${x2} ${y2}`, o:`${Math.floor((x1+x2)/2)} ${Math.floor((y1+y2)/2)}`}; } },
      { t: "Cộng 2 phân số", d: "Cho 2 phân số a/b và c/d (b,d > 0). Tính tổng và in ra tử số và mẫu số (chưa cần rút gọn, quy đồng chéo a*d+b*c và b*d)", gen: () => { let a=randInt(1,10),b=randInt(1,10),c=randInt(1,10),d=randInt(1,10); return {i:`${a} ${b}\n${c} ${d}`, o:`${a*d+b*c} ${b*d}`}; } },
      { t: "Trừ 2 phân số", d: "Cho 2 phân số a/b và c/d (b,d > 0). Tính hiệu a/b - c/d (chưa cần rút gọn, in a*d-b*c và b*d)", gen: () => { let a=randInt(1,10),b=randInt(1,10),c=randInt(1,10),d=randInt(1,10); return {i:`${a} ${b}\n${c} ${d}`, o:`${a*d-b*c} ${b*d}`}; } },
      { t: "Nhân 2 phân số", d: "Cho 2 phân số a/b và c/d. Tính tích a/b * c/d (chưa cần rút gọn)", gen: () => { let a=randInt(1,10),b=randInt(1,10),c=randInt(1,10),d=randInt(1,10); return {i:`${a} ${b}\n${c} ${d}`, o:`${a*c} ${b*d}`}; } },
      { t: "Cấu trúc Sinh Viên 1", d: "Sinh viên có Điểm Toán và Điểm Văn. In ra Tổng điểm", gen: () => { let m=randInt(0,10),v=randInt(0,10); return {i:`${m} ${v}`, o:`${m+v}`}; } },
      { t: "Cấu trúc Sinh Viên 2", d: "Sinh viên có mã SV (số nguyên) và Tuổi. In ra: Mã SV - Tuổi", gen: () => { let id=randInt(1000,9999), age=randInt(18,25); return {i:`${id} ${age}`, o:`${id} - ${age}`}; } },
      { t: "Chu vi Hình Chữ Nhật", d: "Hình chữ nhật được định nghĩa bởi chiều dài và chiều rộng. Tính chu vi", gen: () => { let w=randInt(1,50),h=randInt(1,50); return {i:`${w} ${h}`, o:`${2*(w+h)}`}; } },
      { t: "Diện tích Hình Chữ Nhật", d: "Hình chữ nhật được định nghĩa bởi chiều dài và chiều rộng. Tính diện tích", gen: () => { let w=randInt(1,50),h=randInt(1,50); return {i:`${w} ${h}`, o:`${w*h}`}; } },
      { t: "Cấu trúc Hình Tròn", d: "Hình tròn có bán kính R. Tính và in ra phần nguyên của Chu vi (pi = 3.14)", gen: () => { let r=randInt(1,20); return {i:`${r}`, o:`${Math.floor(2*3.14*r)}`}; } },
      { t: "Diện tích Hình Tròn", d: "Hình tròn bán kính R. In ra phần nguyên của Diện tích (pi = 3.14)", gen: () => { let r=randInt(1,20); return {i:`${r}`, o:`${Math.floor(3.14*r*r)}`}; } },
      { t: "So sánh 2 Sinh viên", d: "Mỗi sinh viên có mã SV và điểm GPA. In ra mã SV có GPA cao hơn. Nếu bằng in mã nhỏ hơn.", gen: () => { let id1=randInt(100,500),g1=randInt(1,10),id2=randInt(501,999),g2=randInt(1,10); let win=g1>g2?id1:(g2>g1?id2:Math.min(id1,id2)); return {i:`${id1} ${g1}\n${id2} ${g2}`, o:`${win}`}; } },
      { t: "Cấu trúc Thời gian 1", d: "Thời gian gồm Giờ và Phút. Cho 1 mốc thời gian, cộng thêm 1 giờ và in ra Giờ Phút mới", gen: () => { let h=randInt(0,22),m=randInt(0,59); return {i:`${h} ${m}`, o:`${h+1} ${m}`}; } },
      { t: "Cấu trúc Thời gian 2", d: "Thời gian gồm Giờ, Phút, Giây. In ra tổng số giây tính từ 00:00:00", gen: () => { let h=randInt(0,23),m=randInt(0,59),s=randInt(0,59); return {i:`${h} ${m} ${s}`, o:`${h*3600+m*60+s}`}; } },
      { t: "Khoảng cách đến gốc tọa độ", d: "Điểm A(x, y). Tính bình phương khoảng cách đến gốc tọa độ (0,0)", gen: () => { let x=randInt(-20,20),y=randInt(-20,20); return {i:`${x} ${y}`, o:`${x*x+y*y}`}; } },
      { t: "Phân số đảo ngược", d: "Cho phân số a/b (a>0). In ra nghịch đảo b/a (in b a)", gen: () => { let a=randInt(1,100),b=randInt(1,100); return {i:`${a} ${b}`, o:`${b} ${a}`}; } },
      { t: "Cộng 2 vector", d: "Cho 2 vector (x1, y1) và (x2, y2). Tính vector tổng (x1+x2, y1+y2)", gen: () => { let x1=randInt(-10,10),y1=randInt(-10,10),x2=randInt(-10,10),y2=randInt(-10,10); return {i:`${x1} ${y1}\n${x2} ${y2}`, o:`${x1+x2} ${y1+y2}`}; } },
      { t: "Nhân vô hướng vector", d: "Cho 2 vector (x1, y1) và (x2, y2). Tính tích vô hướng x1*x2 + y1*y2", gen: () => { let x1=randInt(-10,10),y1=randInt(-10,10),x2=randInt(-10,10),y2=randInt(-10,10); return {i:`${x1} ${y1}\n${x2} ${y2}`, o:`${x1*x2+y1*y2}`}; } },
      { t: "Kiểm tra điểm thuộc hình chữ nhật", d: "HCN có gốc trái dưới (0,0), chiều dài w, chiều cao h. Điểm A(x, y). In YES nếu A nằm trong/trên cạnh, NO nếu nằm ngoài.", gen: () => { let w=randInt(5,20),h=randInt(5,20),x=randInt(-5,25),y=randInt(-5,25); let isInside = (x>=0 && x<=w && y>=0 && y<=h); return {i:`${w} ${h}\n${x} ${y}`, o:isInside?"YES":"NO"}; } },
      { t: "Tìm điểm xa gốc tọa độ nhất", d: "Cho 2 điểm A(x1, y1) và B(x2, y2). In ra 1 nếu A xa hơn, 2 nếu B xa hơn, 0 nếu bằng nhau.", gen: () => { let x1=randInt(-10,10),y1=randInt(-10,10),x2=randInt(-10,10),y2=randInt(-10,10); let d1=x1*x1+y1*y1, d2=x2*x2+y2*y2; let res = (d1>d2) ? 1 : (d1<d2 ? 2 : 0); return {i:`${x1} ${y1}\n${x2} ${y2}`, o:`${res}`}; } }
    ];
    templates = templates.map(t => {
      return {
        t: t.t,
        d: `<p>${t.d}</p><h4>Dữ liệu vào:</h4><ul><li>Dữ liệu được cấp trên 1 hoặc nhiều dòng (theo yêu cầu).</li></ul><h4>Dữ liệu ra:</h4><ul><li>Kết quả của bài toán.</li></ul>`,
        gen: t.gen
      };
    });
  }
  // 7. CÁC TOPIC KHÁC (Hàm, Chuỗi, Exceptions, OOP...)
  else {
    templates = [
      { t: "Mã hóa đơn giản", d: "Cho N. Trả về N + 100", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a+100}`}; } },
      { t: "Nhân ba", d: "Cho N. Trả về N * 3", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a*3}`}; } },
      { t: "Bình phương", d: "Trả về N * N", gen: () => { let a=randInt(1,50); return {i:`${a}`, o:`${a*a}`}; } },
      { t: "Giá trị tuyệt đối", d: "Cho số N. In ra giá trị tuyệt đối |N|", gen: () => { let a=randInt(-100,100); return {i:`${a}`, o:`${Math.abs(a)}`}; } },
      { t: "Phân loại", d: "N>0 in A, N=0 in B, N<0 in C", gen: () => { let a=randInt(-10,10); return {i:`${a}`, o: a>0?"A":(a<0?"C":"B")}; } },
      { t: "Phép cộng ngẫu nhiên", d: "Cho N. In ra N + 50", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a+50}`}; } },
      { t: "Kiểm tra bằng 0", d: "Nếu N=0 in EMPTY, ngược lại in HAS VALUE", gen: () => { let a=randInt(0,5); return {i:`${a}`, o: a===0?"EMPTY":"HAS VALUE"}; } },
      { t: "Làm tròn số", d: "Cho số nguyên N chia 3. Làm tròn xuống.", gen: () => { let a=randInt(1,50); return {i:`${a}`, o:`${Math.floor(a/3)}`}; } },
      { t: "Đếm ngược", d: "Cho N, in ra N-1", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a-1}`}; } },
      { t: "Nhân đôi", d: "Cho N, in N*2", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a*2}`}; } },
      { t: "Kiểm tra bằng 10", d: "N == 10 in TEN, khác in NOT TEN", gen: () => { let a=randInt(5,15); return {i:`${a}`, o: a===10?"TEN":"NOT TEN"}; } },
      { t: "Chia hết cho 4", d: "N chia hết cho 4 in 1, ngược lại in 0", gen: () => { let a=randInt(1,20); return {i:`${a}`, o: a%4===0?"1":"0"}; } },
      { t: "Tính tuổi nhân 2", d: "In ra N * 2", gen: () => { let a=randInt(1,50); return {i:`${a}`, o:`${a*2}`}; } },
      { t: "Khác 0", d: "N != 0 in OK, N == 0 in ZERO", gen: () => { let a=randInt(0,5); return {i:`${a}`, o: a!==0?"OK":"ZERO"}; } },
      { t: "Hiệu với 100", d: "In ra 100 - N", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${100-a}`}; } },
      { t: "Tích bình phương", d: "Cho N. In N^2 * 2", gen: () => { let a=randInt(1,20); return {i:`${a}`, o:`${a*a*2}`}; } },
      { t: "Kiểm tra chẵn", d: "N chẵn in EVEN, lẻ in ODD", gen: () => { let a=randInt(1,100); return {i:`${a}`, o: a%2===0?"EVEN":"ODD"}; } },
      { t: "Chữ số đầu tiên giả", d: "In ra ký tự đầu tiên của N khi chuyển thành chuỗi", gen: () => { let a=randInt(10,99); return {i:`${a}`, o:`${String(a)[0]}`}; } },
      { t: "Cộng 5", d: "In ra N + 5", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a+5}`}; } },
      { t: "Nhân 10", d: "In ra N * 10", gen: () => { let a=randInt(1,100); return {i:`${a}`, o:`${a*10}`}; } }
    ];
  }

  // Sử dụng đúng 20 mẫu cho mỗi topic
  for (let i = 0; i < 20; i++) {
    let tpl = templates[i % templates.length];
    let tests = [];
    let numTests = randInt(10, 15);
    for(let t = 0; t < numTests; t++) {
      tests.push(tpl.gen());
    }

    let pDesc = tpl.d.includes("<h4>") ? tpl.d : `<p>${tpl.d}</p><h4>Dữ liệu vào:</h4><ul><li>Một dòng dữ liệu theo yêu cầu.</li></ul><h4>Dữ liệu ra:</h4><ul><li>Kết quả.</li></ul>`;

    allExercises.push({
      title: `${tpl.t}`,
      topicId: topic._id,
      language: lang,
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      description: pDesc,
      starterCode: starter,
      testCases: tests.map(t => ({ input: t.i, expectedOutput: t.o })),
      points: Math.floor(Math.random() * 20) + 10,
      tags: [tags[Math.floor(Math.random() * tags.length)]]
    });
  }
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
