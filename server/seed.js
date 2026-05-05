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
const generateMoreExercisesForTopic = (topic, allExercises) => {
  const difficulties = ['easy', 'medium', 'hard'];
  const sources = ['Codeforces', 'LeetCode', 'HackerRank', 'VNOJ'];
  const tags = ['math', 'string', 'array', 'sorting', 'greedy', 'dp'];
  const lang = topic.language;
  const tTitle = topic.title.toLowerCase();

  let categoryTemplates = [];

  if (tTitle.includes('làm quen') || tTitle.includes('hello')) {
    categoryTemplates = [
      { 
        title: `In chữ Hello World`, 
        desc: `<p>Bạn hãy viết chương trình in ra màn hình chính xác dòng chữ: <code>Hello World!</code></p>
               <h4>Dữ liệu vào:</h4><ul><li>Không có dữ liệu đầu vào.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Dòng chữ <code>Hello World!</code></li></ul>
               <h4>Giới hạn:</h4><ul><li>Thời gian thực thi: 1.0s</li></ul>`, 
        tests: [{ i: '', o: `Hello World!` }, { i: ' ', o: `Hello World!` }]
      },
      { 
        title: `In hai dòng thông điệp`, 
        desc: `<p>In ra 2 dòng. Dòng 1: <code>Xin chao</code>, Dòng 2: <code>CodeCamp</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Không có.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>2 dòng text.</li></ul>
               <h4>Giới hạn:</h4><ul><li>Thời gian thực thi: 1.0s</li></ul>`, 
        tests: [{ i: '', o: `Xin chao\nCodeCamp` }, { i: ' ', o: `Xin chao\nCodeCamp` }]
      },
      { 
        title: `In hình vuông sao`, 
        desc: `<p>In ra một hình vuông 3x3 bằng các dấu sao <code>*</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Không có.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>3 dòng, mỗi dòng 3 dấu <code>*</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li>Thời gian thực thi: 1.0s</li></ul>`, 
        tests: [{ i: '', o: `***\n***\n***` }]
      },
      { 
        title: `In hình tam giác`, 
        desc: `<p>In ra một tam giác vuông bằng dấu sao <code>*</code> có 3 dòng.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Không có.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Dòng 1: <code>*</code><br>Dòng 2: <code>**</code><br>Dòng 3: <code>***</code></li></ul>
               <h4>Giới hạn:</h4><ul><li>Thời gian thực thi: 1.0s</li></ul>`, 
        tests: [{ i: '', o: `*\n**\n***` }]
      },
      { 
        title: `Thông điệp nhiều dòng`, 
        desc: `<p>In ra 3 dòng: <code>Toi</code>, <code>Dang</code>, <code>Hoc Code</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Không có.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>3 dòng chữ.</li></ul>
               <h4>Giới hạn:</h4><ul><li>Thời gian thực thi: 1.0s</li></ul>`, 
        tests: [{ i: '', o: `Toi\nDang\nHoc Code` }]
      }
    ];
  } else if (tTitle.includes('biến') || tTitle.includes('kiểu')) {
    categoryTemplates = [
      { 
        title: `Tính tổng 2 số`, 
        desc: `<p>Cho hai số nguyên <code>a</code> và <code>b</code>. Tính và in ra tổng của chúng.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Hai số <code>a, b</code> cách nhau bởi khoảng trắng.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Tổng <code>a + b</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>-10^6 &lt;= a, b &lt;= 10^6</code></li></ul>`, 
        tests: [{ i: '3 5', o: `8` }, { i: '-1 1', o: `0` }, { i: '100 200', o: `300` }, { i: '0 0', o: `0` }, { i: '-10 -20', o: `-30` }]
      },
      { 
        title: `Diện tích hình chữ nhật`, 
        desc: `<p>Cho chiều dài <code>x</code> và chiều rộng <code>y</code>. Tính diện tích.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Hai số nguyên dương <code>x, y</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Diện tích hình chữ nhật.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= x, y &lt;= 10^4</code></li></ul>`, 
        tests: [{ i: '3 4', o: `12` }, { i: '5 5', o: `25` }, { i: '10 20', o: `200` }, { i: '1 1', o: `1` }]
      },
      { 
        title: `Chia lấy dư`, 
        desc: `<p>Cho số nguyên <code>a</code> và <code>b</code>. In ra phần dư của phép chia <code>a</code> cho <code>b</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Hai số nguyên dương <code>a, b</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Phần dư <code>a % b</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= a, b &lt;= 10^4</code></li></ul>`, 
        tests: [{ i: '10 3', o: `1` }, { i: '5 5', o: `0` }, { i: '14 5', o: `4` }, { i: '2 10', o: `2` }]
      },
      { 
        title: `Chu vi hình chữ nhật`, 
        desc: `<p>Cho chiều dài <code>a</code> và chiều rộng <code>b</code>. Tính chu vi.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Hai số nguyên dương <code>a, b</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Chu vi hình chữ nhật.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= a, b &lt;= 10^4</code></li></ul>`, 
        tests: [{ i: '3 4', o: `14` }, { i: '5 5', o: `20` }, { i: '10 20', o: `60` }, { i: '1 1', o: `4` }]
      },
      { 
        title: `Bình phương một số`, 
        desc: `<p>Cho số nguyên <code>X</code>. Tính <code>X * X</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên <code>X</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Bình phương của <code>X</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>-10^4 &lt;= X &lt;= 10^4</code></li></ul>`, 
        tests: [{ i: '5', o: `25` }, { i: '-5', o: `25` }, { i: '0', o: `0` }, { i: '10', o: `100` }]
      },
      { 
        title: `Trung bình cộng 3 số`, 
        desc: `<p>Cho 3 số thực <code>a, b, c</code>. In ra trung bình cộng của 3 số, lấy phần nguyên (ép về số nguyên).</p>
               <h4>Dữ liệu vào:</h4><ul><li>Ba số cách nhau khoảng trắng.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Phần nguyên của trung bình cộng.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>-10^4 &lt;= a,b,c &lt;= 10^4</code></li></ul>`, 
        tests: [{ i: '4 5 6', o: `5` }, { i: '10 20 30', o: `20` }, { i: '2 2 3', o: `2` }, { i: '0 0 0', o: `0` }]
      }
    ];
  } else if (tTitle.includes('điều kiện') || tTitle.includes('if')) {
    categoryTemplates = [
      { 
        title: `Chẵn hay Lẻ`, 
        desc: `<p>Cho số nguyên <code>N</code>. Nếu <code>N</code> chẵn in ra <code>CHAN</code>, nếu lẻ in ra <code>LE</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Chuỗi <code>CHAN</code> hoặc <code>LE</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>-10^9 &lt;= N &lt;= 10^9</code></li></ul>`, 
        tests: [{ i: '4', o: `CHAN` }, { i: '7', o: `LE` }, { i: '0', o: `CHAN` }, { i: '-3', o: `LE` }, { i: '100', o: `CHAN` }]
      },
      { 
        title: `Số lớn nhất trong 3 số`, 
        desc: `<p>Cho 3 số nguyên <code>a, b, c</code>. In ra số lớn nhất.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Ba số nguyên cách nhau khoảng trắng.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Số lớn nhất.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>-10^9 &lt;= a,b,c &lt;= 10^9</code></li></ul>`, 
        tests: [{ i: '1 5 3', o: `5` }, { i: '-1 -5 -3', o: `-1` }, { i: '10 10 10', o: `10` }, { i: '5 1 2', o: `5` }, { i: '1 2 5', o: `5` }]
      },
      { 
        title: `Năm nhuận`, 
        desc: `<p>Cho số nguyên dương <code>N</code> (năm). Kiểm tra xem <code>N</code> có phải năm nhuận hay không. Nếu có in <code>YES</code>, không in <code>NO</code>. (Năm nhuận chia hết cho 4 nhưng không chia hết cho 100, hoặc chia hết cho 400).</p>
               <h4>Dữ liệu vào:</h4><ul><li>Năm <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li><code>YES</code> hoặc <code>NO</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 10^4</code></li></ul>`, 
        tests: [{ i: '2020', o: `YES` }, { i: '2021', o: `NO` }, { i: '1900', o: `NO` }, { i: '2000', o: `YES` }, { i: '4', o: `YES` }]
      },
      { 
        title: `Kiểm tra tam giác hợp lệ`, 
        desc: `<p>Cho 3 số nguyên dương <code>a, b, c</code>. Kiểm tra xem chúng có thể tạo thành 3 cạnh của một tam giác không. (Tổng 2 cạnh bất kỳ luôn lớn hơn cạnh còn lại). Nếu có in <code>YES</code>, ngược lại in <code>NO</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Ba số nguyên dương cách nhau khoảng trắng.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li><code>YES</code> hoặc <code>NO</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= a,b,c &lt;= 10^6</code></li></ul>`, 
        tests: [{ i: '3 4 5', o: `YES` }, { i: '1 1 5', o: `NO` }, { i: '10 10 10', o: `YES` }, { i: '2 3 5', o: `NO` }]
      },
      { 
        title: `Xếp loại học lực`, 
        desc: `<p>Cho điểm trung bình <code>D</code> (số nguyên từ 0-10). Nếu D >= 8 in ra <code>GIOI</code>, 6.5 <= D < 8 in ra <code>KHA</code>, 5 <= D < 6.5 in ra <code>TB</code>, còn lại in <code>YEU</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên <code>D</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Kết quả xếp loại.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>0 &lt;= D &lt;= 10</code></li></ul>`, 
        tests: [{ i: '9', o: `GIOI` }, { i: '7', o: `KHA` }, { i: '5', o: `TB` }, { i: '3', o: `YEU` }, { i: '8', o: `GIOI` }]
      },
      { 
        title: `Kiểm tra số âm dương`, 
        desc: `<p>Cho số nguyên <code>N</code>. Nếu N > 0 in <code>DUONG</code>, N < 0 in <code>AM</code>, N = 0 in <code>ZERO</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li><code>DUONG</code>, <code>AM</code>, hoặc <code>ZERO</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>-10^9 &lt;= N &lt;= 10^9</code></li></ul>`, 
        tests: [{ i: '10', o: `DUONG` }, { i: '-5', o: `AM` }, { i: '0', o: `ZERO` }, { i: '9999', o: `DUONG` }]
      }
    ];
  } else if (tTitle.includes('vòng lặp') || tTitle.includes('for')) {
    categoryTemplates = [
      { 
        title: `Tổng từ 1 đến N`, 
        desc: `<p>Tính tổng <code>1 + 2 + 3 + ... + N</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên dương <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Tổng tính được.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 1000</code></li></ul>`, 
        tests: [{ i: '5', o: `15` }, { i: '10', o: `55` }, { i: '1', o: `1` }, { i: '100', o: `5050` }, { i: '3', o: `6` }]
      },
      { 
        title: `Giai thừa của N`, 
        desc: `<p>Tính <code>N! = 1 * 2 * ... * N</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên dương <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Kết quả giai thừa.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 12</code></li></ul>`, 
        tests: [{ i: '3', o: `6` }, { i: '5', o: `120` }, { i: '1', o: `1` }, { i: '4', o: `24` }, { i: '6', o: `720` }]
      },
      { 
        title: `Số nguyên tố`, 
        desc: `<p>Kiểm tra số nguyên dương <code>N</code> có phải số nguyên tố không. Nếu đúng in <code>YES</code>, sai in <code>NO</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên dương <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li><code>YES</code> hoặc <code>NO</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 10^5</code></li></ul>`, 
        tests: [{ i: '7', o: `YES` }, { i: '10', o: `NO` }, { i: '2', o: `YES` }, { i: '1', o: `NO` }, { i: '97', o: `YES` }]
      },
      { 
        title: `Ước số chung lớn nhất (UCLN)`, 
        desc: `<p>Tìm Ước số chung lớn nhất của hai số nguyên dương <code>A</code> và <code>B</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Hai số nguyên dương cách nhau khoảng trắng.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>UCLN của 2 số.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= A, B &lt;= 10^6</code></li></ul>`, 
        tests: [{ i: '12 18', o: `6` }, { i: '7 5', o: `1` }, { i: '100 50', o: `50` }, { i: '14 28', o: `14` }]
      },
      { 
        title: `Đếm số chữ số`, 
        desc: `<p>Cho số nguyên dương <code>N</code>. Đếm xem <code>N</code> có bao nhiêu chữ số.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên dương <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Số lượng chữ số của N.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 10^9</code></li></ul>`, 
        tests: [{ i: '12345', o: `5` }, { i: '7', o: `1` }, { i: '1000000', o: `7` }, { i: '987', o: `3` }]
      },
      { 
        title: `Liệt kê số lẻ`, 
        desc: `<p>Cho số nguyên dương <code>N</code>. In ra các số lẻ từ 1 đến N, cách nhau bởi khoảng trắng.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số nguyên dương <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Các số lẻ.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 100</code></li></ul>`, 
        tests: [{ i: '5', o: `1 3 5` }, { i: '10', o: `1 3 5 7 9` }, { i: '1', o: `1` }, { i: '6', o: `1 3 5` }]
      }
    ];
  } else if (tTitle.includes('mảng') || tTitle.includes('vector') || tTitle.includes('array')) {
    categoryTemplates = [
      { 
        title: `Tổng mảng`, 
        desc: `<p>Cho mảng có <code>N</code> phần tử. Tính tổng các phần tử.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Dòng 1: Số nguyên <code>N</code>.</li><li>Dòng 2: <code>N</code> số nguyên.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Tổng các số trong mảng.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 100</code></li></ul>`, 
        tests: [{ i: '3\n1 2 3', o: `6` }, { i: '5\n10 -10 5 -5 1', o: `1` }, { i: '1\n100', o: `100` }, { i: '4\n0 0 0 0', o: `0` }, { i: '2\n-5 -5', o: `-10` }]
      },
      { 
        title: `Tìm Min Max`, 
        desc: `<p>Cho mảng <code>N</code> phần tử. In ra phần tử nhỏ nhất và lớn nhất, cách nhau 1 khoảng trắng.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Dòng 1: Số nguyên <code>N</code>.</li><li>Dòng 2: <code>N</code> số nguyên.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li><code>Min Max</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 100</code></li></ul>`, 
        tests: [{ i: '4\n1 5 3 2', o: `1 5` }, { i: '3\n-1 -5 0', o: `-5 0` }, { i: '1\n99', o: `99 99` }, { i: '5\n10 10 10 10 10', o: `10 10` }, { i: '2\n100 1', o: `1 100` }]
      },
      { 
        title: `Đếm số chẵn`, 
        desc: `<p>Cho mảng <code>N</code> phần tử. Đếm xem có bao nhiêu số chẵn trong mảng.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Dòng 1: Số nguyên <code>N</code>.</li><li>Dòng 2: <code>N</code> số nguyên.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Số lượng phần tử chẵn.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 100</code></li></ul>`, 
        tests: [{ i: '4\n1 2 3 4', o: `2` }, { i: '3\n1 3 5', o: `0` }, { i: '3\n2 4 6', o: `3` }, { i: '1\n0', o: `1` }, { i: '5\n-2 4 5 7 8', o: `3` }]
      },
      { 
        title: `Tính trung bình cộng mảng`, 
        desc: `<p>Cho mảng <code>N</code> phần tử. Tính trung bình cộng của mảng (lấy phần nguyên).</p>
               <h4>Dữ liệu vào:</h4><ul><li>Dòng 1: Số nguyên <code>N</code>.</li><li>Dòng 2: <code>N</code> số nguyên.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Trung bình cộng (phần nguyên).</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 100</code></li></ul>`, 
        tests: [{ i: '3\n10 20 30', o: `20` }, { i: '4\n1 2 3 4', o: `2` }, { i: '1\n50', o: `50` }, { i: '2\n-10 10', o: `0` }]
      },
      { 
        title: `Tìm vị trí phần tử x`, 
        desc: `<p>Cho mảng <code>N</code> phần tử và một số <code>x</code>. In ra vị trí đầu tiên của <code>x</code> trong mảng (Index bắt đầu từ 0). Nếu không tìm thấy, in ra <code>-1</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Dòng 1: Hai số nguyên <code>N</code> và <code>x</code>.</li><li>Dòng 2: <code>N</code> số nguyên của mảng.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Vị trí của x hoặc -1.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 100</code></li></ul>`, 
        tests: [{ i: '4 3\n1 2 3 4', o: `2` }, { i: '5 10\n1 5 8 9 2', o: `-1` }, { i: '3 5\n5 5 5', o: `0` }, { i: '1 0\n0', o: `0` }]
      },
      { 
        title: `In mảng đảo ngược`, 
        desc: `<p>Cho mảng <code>N</code> phần tử. In ra mảng theo thứ tự đảo ngược, các phần tử cách nhau khoảng trắng.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Dòng 1: Số nguyên <code>N</code>.</li><li>Dòng 2: <code>N</code> số nguyên.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Mảng đảo ngược.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 100</code></li></ul>`, 
        tests: [{ i: '4\n1 2 3 4', o: `4 3 2 1` }, { i: '3\n10 20 30', o: `30 20 10` }, { i: '1\n9', o: `9` }, { i: '5\n-1 -2 -3 -4 -5', o: `-5 -4 -3 -2 -1` }]
      }
    ];
  } else {
    // Fallback cho các phần khác
    categoryTemplates = [
      { 
        title: `Toán học cơ bản`, 
        desc: `<p>Đọc vào số nguyên <code>X</code>. In ra <code>X * X</code>.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số <code>X</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Bình phương của <code>X</code>.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>-10^4 &lt;= X &lt;= 10^4</code></li></ul>`, 
        tests: [{ i: '5', o: `25` }, { i: '-5', o: `25` }, { i: '0', o: `0` }, { i: '10', o: `100` }]
      },
      { 
        title: `Chuỗi đơn giản`, 
        desc: `<p>Đọc vào một số nguyên <code>N</code>. In ra <code>N</code> dấu <code>!</code> liền nhau.</p>
               <h4>Dữ liệu vào:</h4><ul><li>Số <code>N</code>.</li></ul>
               <h4>Dữ liệu ra:</h4><ul><li>Chuỗi kết quả.</li></ul>
               <h4>Giới hạn:</h4><ul><li><code>1 &lt;= N &lt;= 10</code></li></ul>`, 
        tests: [{ i: '3', o: `!!!` }, { i: '1', o: `!` }, { i: '5', o: `!!!!!` }, { i: '2', o: `!!` }]
      }
    ];
  }

  categoryTemplates.forEach((tpl, idx) => {
    let starter = '';
    if (lang === 'java') starter = 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Code của bạn ở đây\n        \n    }\n}';
    else if (lang === 'cpp') starter = '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Code của bạn ở đây\n    \n    return 0;\n}';
    else if (lang === 'c') starter = '#include <stdio.h>\n\nint main() {\n    // Code của bạn ở đây\n    \n    return 0;\n}';
    else if (lang === 'python') starter = '# Code của bạn ở đây\n\n';

    allExercises.push({
      title: `${tpl.title}`,
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
