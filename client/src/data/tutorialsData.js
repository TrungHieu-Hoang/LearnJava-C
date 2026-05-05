export const tutorialsData = {
  java: [
    {
      id: 'java-intro',
      title: '1. Giới thiệu Java',
      content: `
        <h1>Java là gì?</h1>
        <p>Java là một ngôn ngữ lập trình hướng đối tượng, đa nền tảng được phát triển bởi Sun Microsystems (nay thuộc Oracle). Với triết lý <strong>"Viết một lần, chạy mọi nơi"</strong> (Write Once, Run Anywhere), Java là một trong những ngôn ngữ phổ biến nhất thế giới trong phát triển phần mềm doanh nghiệp và Android.</p>
        
        <h3>Cấu trúc chương trình Java cơ bản</h3>
        <p>Mọi mã nguồn Java đều phải nằm trong một <code>class</code>. Điểm bắt đầu của chương trình là phương thức <code>main</code>.</p>
        <pre><code>public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>
        <div class="tut-note">
          <strong>Lưu ý:</strong> Tên file phải trùng với tên class chứa phương thức main (Ví dụ: <code>Main.java</code>) và phân biệt hoa/thường (Case-sensitive).
        </div>
      `
    },
    {
      id: 'java-vars',
      title: '2. Biến và Kiểu dữ liệu',
      content: `
        <h1>Biến và Kiểu dữ liệu trong Java</h1>
        <p>Java là ngôn ngữ định kiểu tĩnh (Statically Typed), nghĩa là mọi biến đều phải khai báo kiểu trước khi dùng và không thể thay đổi kiểu sau đó.</p>
        
        <h3>Các kiểu dữ liệu nguyên thủy (Primitive Types)</h3>
        <ul>
          <li><code>int</code>: Số nguyên (Ví dụ: 10, -5). Kích thước 4 bytes.</li>
          <li><code>long</code>: Số nguyên lớn (thêm hậu tố 'L'). Kích thước 8 bytes.</li>
          <li><code>double</code>: Số thực (Ví dụ: 3.14). Kích thước 8 bytes.</li>
          <li><code>char</code>: Ký tự đơn (Ví dụ: 'A'). Nằm trong dấu nháy đơn.</li>
          <li><code>boolean</code>: Đúng/Sai (<code>true</code> hoặc <code>false</code>).</li>
        </ul>
        
        <h3>Cách khai báo biến</h3>
        <pre><code>int age = 20;
double pi = 3.14159;
char grade = 'A';
boolean isPassed = true;
String name = "CodeCamp"; // String là Object, được cấp phát bộ nhớ động</code></pre>
      `
    },
    {
      id: 'java-io',
      title: '3. Nhập xuất dữ liệu (I/O)',
      content: `
        <h1>Nhập xuất dữ liệu trong Java</h1>
        
        <h3>In ra màn hình</h3>
        <ul>
            <li><code>System.out.println()</code>: In xong tự động xuống dòng mới.</li>
            <li><code>System.out.print()</code>: In liên tiếp trên cùng một dòng.</li>
        </ul>
        
        <h3>Nhập từ bàn phím</h3>
        <p>Để nhập dữ liệu, chúng ta thường sử dụng class <code>Scanner</code> có sẵn trong gói <code>java.util</code>.</p>
        <pre><code>import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in); // Khởi tạo Scanner
        
        System.out.print("Nhập tên: ");
        String name = sc.nextLine(); // Đọc 1 dòng chuỗi
        
        System.out.print("Nhập tuổi: ");
        int age = sc.nextInt(); // Đọc số nguyên
        
        System.out.println("Chào " + name + ", bạn " + age + " tuổi.");
        sc.close(); // Giải phóng tài nguyên
    }
}</code></pre>
      `
    },
    {
      id: 'java-ifelse',
      title: '4. Điều kiện If/Else',
      content: `
        <h1>Câu lệnh rẽ nhánh If/Else</h1>
        <p>Dùng để thực thi các khối mã khác nhau dựa trên các điều kiện đúng/sai (boolean).</p>
        
        <pre><code>int score = 85;

if (score >= 90) {
    System.out.println("Loại Xuất sắc");
} else if (score >= 80) {
    System.out.println("Loại Giỏi");
} else if (score >= 50) {
    System.out.println("Loại Khá/Trung bình");
} else {
    System.out.println("Thi trượt");
}</code></pre>

        <h3>Toán tử 3 ngôi (Ternary Operator)</h3>
        <p>Là một cách viết ngắn gọn cho <code>if/else</code> khi gán giá trị.</p>
        <pre><code>int n = 10;
String result = (n % 2 == 0) ? "Số Chẵn" : "Số Lẻ";
System.out.println(result); // In ra "Số Chẵn"</code></pre>
      `
    },
    {
      id: 'java-loops',
      title: '5. Vòng lặp For / While',
      content: `
        <h1>Vòng lặp trong Java</h1>
        <p>Vòng lặp giúp lặp đi lặp lại một khối lệnh nhiều lần mà không cần viết lại mã.</p>
        
        <h3>Vòng lặp For</h3>
        <p>Sử dụng khi biết trước số lần lặp.</p>
        <pre><code>for (int i = 1; i <= 5; i++) {
    System.out.println("Lặp lần thứ " + i);
}</code></pre>

        <h3>Vòng lặp While</h3>
        <p>Sử dụng khi số lần lặp chưa biết trước, phụ thuộc vào một điều kiện.</p>
        <pre><code>int count = 5;
while (count > 0) {
    System.out.println("Đếm ngược: " + count);
    count--; // count = count - 1
}</code></pre>

        <div class="tut-note">
          <strong>Lệnh ngắt:</strong> Sử dụng <code>break</code> để thoát vòng lặp ngay lập tức, và <code>continue</code> để bỏ qua vòng lặp hiện tại và chạy luôn sang vòng tiếp theo.
        </div>
      `
    },
    {
      id: 'java-arrays',
      title: '6. Mảng (Arrays)',
      content: `
        <h1>Mảng (Arrays)</h1>
        <p>Mảng là một tập hợp các biến có cùng kiểu dữ liệu, được cấp phát liên tiếp trong bộ nhớ. Kích thước của mảng trong Java là cố định và không thể thay đổi sau khi tạo.</p>
        
        <h3>Khai báo và sử dụng mảng 1 chiều</h3>
        <pre><code>// Cấp phát mảng gồm 5 phần tử nguyên
int[] arr = new int[5];

// Gán giá trị qua chỉ số (Index bắt đầu từ 0)
arr[0] = 10;
arr[1] = 20;

// Khai báo và gán giá trị trực tiếp
int[] numbers = {1, 2, 3, 4, 5};

// In ra phần tử thứ 3 (index 2)
System.out.println(numbers[2]); // Kết quả: 3</code></pre>

        <h3>Duyệt qua các phần tử của mảng</h3>
        <pre><code>// Sử dụng For-each (Rất tiện lợi khi không cần quan tâm đến index)
for (int num : numbers) {
    System.out.print(num + " ");
}</code></pre>
      `
    },
    {
      id: 'java-functions',
      title: '7. Hàm (Methods)',
      content: `
        <h1>Phương thức (Methods)</h1>
        <p>Hàm giúp chia nhỏ chương trình thành các khối logic tái sử dụng. Trong Java, hàm nằm trong class và gọi là <strong>Method</strong>.</p>
        <pre><code>static int tinhTong(int a, int b) {
    return a + b;
}

public static void main(String[] args) {
    int kq = tinhTong(3, 5);
    System.out.println(kq); // 8
}</code></pre>
        <h3>Hàm void (không trả về)</h3>
        <pre><code>static void chao(String name) {
    System.out.println("Xin chao " + name);
}</code></pre>
      `
    },
    {
      id: 'java-string',
      title: '8. Xử lý chuỗi (String)',
      content: `
        <h1>Chuỗi ký tự (String)</h1>
        <p>String trong Java là <strong>Object bất biến (Immutable)</strong>.</p>
        <pre><code>String s = "Hello CodeCamp";
s.length();           // 14
s.charAt(0);          // 'H'
s.substring(6);       // "CodeCamp"
s.toUpperCase();      // "HELLO CODECAMP"
s.contains("Code");   // true
s.indexOf("Camp");    // 10
s.replace("Hello","Hi"); // "Hi CodeCamp"
s.split(" ");         // ["Hello","CodeCamp"]</code></pre>
        <div class="tut-note">
          <strong>So sánh chuỗi:</strong> KHÔNG dùng <code>==</code>. Dùng <code>s1.equals(s2)</code>.
        </div>
      `
    },
    {
      id: 'java-switch',
      title: '9. Switch-Case',
      content: `
        <h1>Switch-Case</h1>
        <p>Thay thế chuỗi if-else dài khi so sánh một biến với nhiều giá trị cụ thể.</p>
        <pre><code>int day = 3;
switch (day) {
    case 1: System.out.println("Thu Hai"); break;
    case 2: System.out.println("Thu Ba"); break;
    case 3: System.out.println("Thu Tu"); break;
    default: System.out.println("Ngay khac"); break;
}</code></pre>
        <div class="tut-note"><strong>Quan trọng:</strong> Quên <code>break</code> sẽ gây lỗi fall-through (chạy tiếp case dưới).</div>
      `
    },
    {
      id: 'java-arraylist',
      title: '10. ArrayList',
      content: `
        <h1>ArrayList - Mảng tự co giãn</h1>
        <p>Khác mảng thường có kích thước cố định, <code>ArrayList</code> thêm/xóa tự do.</p>
        <pre><code>import java.util.ArrayList;

ArrayList&lt;String&gt; ds = new ArrayList&lt;&gt;();
ds.add("An");
ds.add("Binh");
ds.get(0);        // "An"
ds.size();        // 2
ds.remove(0);     // Xóa "An"

for (String ten : ds) {
    System.out.println(ten);
}</code></pre>
      `
    }
  ],
  cpp: [
    {
      id: 'cpp-intro',
      title: '1. Giới thiệu C++',
      content: `
        <h1>C++ là gì?</h1>
        <p>C++ là ngôn ngữ lập trình bậc trung, được phát triển từ ngôn ngữ C bởi Bjarne Stroustrup. Nó hỗ trợ đa mô hình: hướng thủ tục, hướng đối tượng (OOP) và lập trình tổng quát (Templates). C++ cực kỳ mạnh mẽ, kiểm soát trực tiếp phần cứng và siêu nhanh, thường được dùng làm game AAA, hệ điều hành và thi đấu thuật toán (Competitive Programming).</p>
        
        <h3>Chương trình C++ đầu tiên</h3>
        <pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    cout &lt;&lt; "Hello, C++!" &lt;&lt; endl;
    return 0;
}</code></pre>
        <ul>
          <li><code>#include &lt;iostream&gt;</code>: Nạp thư viện nhập/xuất chuẩn của C++.</li>
          <li><code>using namespace std;</code>: Đưa không gian tên <code>std</code> vào để không phải gõ <code>std::cout</code>.</li>
          <li><code>int main()</code>: Hàm chính. Bắt buộc phải trả về số nguyên (0 biểu thị không có lỗi).</li>
        </ul>
      `
    },
    {
      id: 'cpp-io',
      title: '2. Biến và I/O Cơ bản',
      content: `
        <h1>Biến và Nhập xuất C++</h1>
        <p>C++ có các kiểu dữ liệu như C nhưng luồng (streams) nhập xuất thì hiện đại hơn rất nhiều.</p>
        
        <h3>Khai báo biến</h3>
        <pre><code>int age = 18;
double weight = 65.5;
char letter = 'A';
bool is_raining = false;
string name = "John Doe"; // Phải #include &lt;string&gt;</code></pre>

        <h3>Xuất dữ liệu (cout)</h3>
        <pre><code>int a = 5;
cout &lt;&lt; "Giá trị của a là: " &lt;&lt; a &lt;&lt; endl;</code></pre>
        
        <h3>Nhập dữ liệu (cin)</h3>
        <pre><code>int age;
cout &lt;&lt; "Nhập tuổi: ";
cin &gt;&gt; age;
cout &lt;&lt; "Năm sau bạn sẽ " &lt;&lt; age + 1 &lt;&lt; " tuổi.";</code></pre>
        
        <div class="tut-note">
          <strong>Tip thi đấu thuật toán:</strong> <code>cin</code> và <code>cout</code> đôi khi chạy chậm hơn <code>scanf</code> của C. Để tối ưu hóa tốc độ (chạy cực nhanh trong các kỳ thi OLP), thêm 2 dòng này vào đầu <code>main()</code>:
          <pre><code>ios_base::sync_with_stdio(false);
cin.tie(NULL);</code></pre>
        </div>
      `
    },
    {
      id: 'cpp-ifelse',
      title: '3. Rẽ nhánh If/Else',
      content: `
        <h1>Lệnh rẽ nhánh If/Else</h1>
        <p>Cú pháp hoàn toàn tương tự Java và C.</p>
        
        <pre><code>int x;
cin &gt;&gt; x;

if (x > 0) {
    cout &lt;&lt; "Số Dương";
} else if (x < 0) {
    cout &lt;&lt; "Số Âm";
} else {
    cout &lt;&lt; "Số Không";
}</code></pre>
      `
    },
    {
      id: 'cpp-loops',
      title: '4. Vòng lặp',
      content: `
        <h1>Vòng lặp trong C++</h1>
        
        <h3>Vòng lặp For</h3>
        <pre><code>for (int i = 0; i < 5; i++) {
    cout &lt;&lt; i &lt;&lt; " ";
}
// Kết quả: 0 1 2 3 4</code></pre>

        <h3>Vòng lặp While</h3>
        <pre><code>int n = 123;
int sum = 0;

// Tính tổng các chữ số của N
while (n > 0) {
    sum += n % 10;
    n /= 10;
}
cout &lt;&lt; "Tổng = " &lt;&lt; sum;</code></pre>
      `
    },
    {
      id: 'cpp-vector',
      title: '5. Mảng và Vector',
      content: `
        <h1>Mảng tĩnh và Vector (Mảng động)</h1>
        
        <h3>Mảng tĩnh cơ bản</h3>
        <pre><code>int arr[100]; // Mảng chứa tối đa 100 phần tử
arr[0] = 5;
arr[1] = 10;</code></pre>

        <h3>Thư viện Vector siêu việt</h3>
        <p>Điểm mạnh nhất của C++ so với C chính là thư viện Chuẩn STL, đặc biệt là <code>std::vector</code>. Vector là mảng tự động co giãn kích thước.</p>
        <pre><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;

int main() {
    vector&lt;int&gt; v; // Khởi tạo vector rỗng
    
    // Thêm phần tử vào cuối
    v.push_back(10);
    v.push_back(20);
    v.push_back(30);
    
    // Xóa phần tử cuối
    v.pop_back(); // Còn lại 10, 20
    
    // Duyệt vector
    for (int i = 0; i < v.size(); i++) {
        cout &lt;&lt; v[i] &lt;&lt; " ";
    }
    
    return 0;
}</code></pre>
      `
    },
    {
      id: 'cpp-functions',
      title: '6. Hàm (Functions)',
      content: `
        <h1>Hàm trong C++</h1>
        <pre><code>int tinhTong(int a, int b) {
    return a + b;
}

void inChao(string name) {
    cout &lt;&lt; "Chao " &lt;&lt; name &lt;&lt; endl;
}

int main() {
    cout &lt;&lt; tinhTong(3, 5); // 8
    inChao("CodeCamp");
    return 0;
}</code></pre>
        <h3>Truyền tham chiếu (&amp;)</h3>
        <p>Cho phép hàm thay đổi trực tiếp giá trị biến gốc bên ngoài.</p>
        <pre><code>void doiCho(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int x = 1, y = 2;
doiCho(x, y);
cout &lt;&lt; x &lt;&lt; " " &lt;&lt; y; // 2 1</code></pre>
      `
    },
    {
      id: 'cpp-string',
      title: '7. Chuỗi (String)',
      content: `
        <h1>Xử lý chuỗi trong C++</h1>
        <pre><code>#include &lt;string&gt;

string s = "Hello World";
s.length();        // 11
s.substr(6);       // "World"
s.find("World");   // 6
s += " C++";       // Nối chuỗi: "Hello World C++"

// Nhập cả dòng (có dấu cách)
string line;
getline(cin, line);</code></pre>
      `
    },
    {
      id: 'cpp-sort',
      title: '8. Sắp xếp &amp; Algorithm',
      content: `
        <h1>Thư viện Algorithm</h1>
        <p>C++ có hàm <code>sort()</code> cực nhanh, sắp xếp mảng/vector chỉ bằng 1 dòng.</p>
        <pre><code>#include &lt;algorithm&gt;
#include &lt;vector&gt;

vector&lt;int&gt; v = {5, 2, 8, 1, 9};

// Sắp xếp tăng dần
sort(v.begin(), v.end());
// v = {1, 2, 5, 8, 9}

// Sắp xếp giảm dần
sort(v.begin(), v.end(), greater&lt;int&gt;());

// Đảo ngược
reverse(v.begin(), v.end());

// Tìm min/max
int mn = *min_element(v.begin(), v.end());
int mx = *max_element(v.begin(), v.end());</code></pre>
      `
    },
    {
      id: 'cpp-exceptions',
      title: '9. Xử lý ngoại lệ',
      content: `
        <h1>Try/Catch trong C++</h1>
        <p>Bắt và xử lý các lỗi phát sinh trong lúc chương trình đang chạy để tránh việc chương trình bị văng (crash).</p>
        <pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    try {
        int a = 10;
        int b = 0;
        if (b == 0) throw "Lỗi chia cho 0!";
        cout << a / b << endl;
    } catch (const char* msg) {
        cout << "Ngoại lệ: " << msg << endl;
    }
    return 0;
}</code></pre>
      `
    },
    {
      id: 'cpp-fileio',
      title: '10. File I/O',
      content: `
        <h1>Đọc và Ghi File với fstream</h1>
        <p>Thư viện <code>&lt;fstream&gt;</code> cung cấp <code>ofstream</code> để ghi và <code>ifstream</code> để đọc file.</p>
        <pre><code>#include &lt;iostream&gt;
#include &lt;fstream&gt;
#include &lt;string&gt;
using namespace std;

int main() {
    // Ghi file
    ofstream outFile("data.txt");
    outFile << "Hello CodeCamp!" << endl;
    outFile.close();

    // Đọc file
    ifstream inFile("data.txt");
    string line;
    while (getline(inFile, line)) {
        cout << line << endl;
    }
    inFile.close();
    return 0;
}</code></pre>
      `
    }
  ],
  c: [
    {
      id: 'c-intro',
      title: '1. Giới thiệu C',
      content: `
        <h1>Ngôn ngữ C là gì?</h1>
        <p>C là một ngôn ngữ lập trình có cấu trúc, được Denis Ritchie phát triển vào đầu thập niên 70. Đây là ngôn ngữ mẹ của rất nhiều ngôn ngữ sau này (Java, C++, C#). Nó hoạt động cực gần với phần cứng và thường được dùng lập trình nhúng, IoT, driver.</p>
        
        <h3>Cấu trúc cơ bản</h3>
        <pre><code>#include &lt;stdio.h&gt; // Chứa hàm printf, scanf

int main() {
    printf("Hello, C Programming!\\n");
    return 0;
}</code></pre>
      `
    },
    {
      id: 'c-io',
      title: '2. Printf và Scanf',
      content: `
        <h1>Nhập xuất trong C</h1>
        <p>Bởi vì C rất thô sơ, nó sử dụng các <strong>Định dạng chuỗi (Format specifiers)</strong> để quy định kiểu dữ liệu khi nhập và in ra.</p>
        
        <ul>
          <li><code>%d</code>: Số nguyên (int)</li>
          <li><code>%lld</code>: Số nguyên lớn (long long)</li>
          <li><code>%f</code>: Số thực (float)</li>
          <li><code>%lf</code>: Số thực kép (double)</li>
          <li><code>%c</code>: Ký tự (char)</li>
        </ul>
        
        <h3>Ví dụ Nhập Xuất</h3>
        <pre><code>int age;
float height;

printf("Nhập tuổi và chiều cao: ");
// Chú ý bắt buộc phải có ký tự & (Lấy địa chỉ ô nhớ) trước tên biến khi scanf
scanf("%d %f", &age, &height); 

printf("Bạn %d tuổi và cao %.2f mét.\\n", age, height); // %.2f là in ra 2 số thập phân</code></pre>
      `
    },
    {
      id: 'c-control',
      title: '3. Điều kiện & Vòng lặp',
      content: `
        <h1>Điều kiện & Vòng lặp trong C</h1>
        <p>Cú pháp chuẩn mực, làm nền móng cho tất cả các ngôn ngữ họ C.</p>
        
        <h3>Lệnh if-else</h3>
        <pre><code>int n;
scanf("%d", &n);
if (n % 2 == 0) {
    printf("Chan");
} else {
    printf("Le");
}</code></pre>

        <h3>Vòng lặp For</h3>
        <p>Chú ý: Trong các chuẩn C cũ (trước C99), bạn phải khai báo <code>int i</code> ở bên ngoài vòng for.</p>
        <pre><code>int i;
for (i = 1; i <= 10; i++) {
    printf("%d ", i);
}</code></pre>
      `
    },
    {
      id: 'c-arrays-pointers',
      title: '4. Mảng và Con trỏ',
      content: `
        <h1>Mảng và Con trỏ (Nỗi ám ảnh của sinh viên IT)</h1>
        
        <h3>Mảng</h3>
        <p>Mảng trong C là vùng nhớ tĩnh. Tên mảng thực chất chính là địa chỉ của phần tử đầu tiên.</p>
        <pre><code>int arr[5] = {1, 2, 3, 4, 5};
for(int i = 0; i < 5; i++) {
    printf("%d ", arr[i]);
}</code></pre>

        <h3>Con trỏ (Pointer) cơ bản</h3>
        <p>Con trỏ là biến dùng để <strong>lưu trữ địa chỉ của một biến khác</strong> trong thanh RAM.</p>
        <pre><code>int x = 10;
int *ptr = &x; // ptr trỏ tới địa chỉ của biến x

printf("Gia tri cua x: %d\\n", x);         // 10
printf("Dia chi cua x: %p\\n", &x);        // VD: 0x7ffe42
printf("Gia tri qua con tro: %d\\n", *ptr); // 10 (Toán tử * để giải tham chiếu)</code></pre>
      `
    },
    {
      id: 'c-functions',
      title: '5. Hàm (Functions)',
      content: `
        <h1>Hàm trong C</h1>
        <p>Hàm phải được <strong>khai báo trước</strong> khi gọi, hoặc đặt phía trên hàm <code>main()</code>.</p>
        <pre><code>int tinhTong(int a, int b) {
    return a + b;
}

void inKetQua(int n) {
    printf("Ket qua: %d\\n", n);
}

int main() {
    int s = tinhTong(3, 5);
    inKetQua(s); // Ket qua: 8
    return 0;
}</code></pre>
      `
    },
    {
      id: 'c-struct',
      title: '6. Struct (Kiểu cấu trúc)',
      content: `
        <h1>Struct - Tự tạo kiểu dữ liệu</h1>
        <p>C không có class như Java/C++. Thay vào đó dùng <code>struct</code> để gom nhóm nhiều biến lại.</p>
        <pre><code>struct SinhVien {
    char ten[50];
    int tuoi;
    float diem;
};

int main() {
    struct SinhVien sv;
    strcpy(sv.ten, "Nguyen Van A");
    sv.tuoi = 20;
    sv.diem = 8.5;

    printf("%s, %d tuoi, diem %.1f\\n", sv.ten, sv.tuoi, sv.diem);
    return 0;
}</code></pre>
      `
    },
    {
      id: 'c-string',
      title: '7. Chuỗi (String)',
      content: `
        <h1>Xử lý chuỗi trong C</h1>
        <p>Chuỗi trong C thực chất là một mảng ký tự kết thúc bằng ký tự null <code>'\\0'</code>. Thư viện <code>&lt;string.h&gt;</code> chứa các hàm xử lý.</p>
        <pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main() {
    char s1[50] = "Hello";
    char s2[] = " World";
    
    strcat(s1, s2); // Nối s2 vào s1
    printf("Chuoi: %s\\n", s1);
    printf("Do dai: %zu\\n", strlen(s1));
    return 0;
}</code></pre>
      `
    },
    {
      id: 'c-malloc',
      title: '8. Cấp phát động',
      content: `
        <h1>Quản lý bộ nhớ với malloc, free</h1>
        <p>Cấp phát vùng nhớ linh hoạt trong thời gian chạy bằng các hàm trong thư viện <code>&lt;stdlib.h&gt;</code>.</p>
        <pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    int n = 5;
    // Cấp phát bộ nhớ cho mảng 5 số nguyên
    int *arr = (int*) malloc(n * sizeof(int));
    
    for (int i = 0; i < n; i++) arr[i] = i + 1;
    
    free(arr); // Quan trọng: Giải phóng bộ nhớ
    return 0;
}</code></pre>
      `
    },
    {
      id: 'c-fileio',
      title: '9. File I/O',
      content: `
        <h1>Đọc / Ghi tệp tin trong C</h1>
        <p>Sử dụng con trỏ <code>FILE*</code> cùng các hàm như <code>fopen</code>, <code>fprintf</code>, <code>fscanf</code>.</p>
        <pre><code>#include &lt;stdio.h&gt;

int main() {
    // Ghi vào file
    FILE *f = fopen("test.txt", "w");
    fprintf(f, "CodeCamp C-Tutorial\\n");
    fclose(f);

    // Đọc từ file
    char buffer[100];
    f = fopen("test.txt", "r");
    fgets(buffer, 100, f);
    printf("Doc duoc: %s", buffer);
    fclose(f);
    return 0;
}</code></pre>
      `
    },
    {
      id: 'c-macro',
      title: '10. Macro & Tiền xử lý',
      content: `
        <h1>Chỉ thị tiền biên dịch (Preprocessor)</h1>
        <p>Các lệnh bắt đầu bằng <code>#</code> như <code>#include</code> hay <code>#define</code> được xử lý trước khi biên dịch code.</p>
        <pre><code>#include &lt;stdio.h&gt;
#define PI 3.14159
#define SQUARE(x) ((x) * (x))

int main() {
    float r = 5.0;
    printf("Dien tich: %.2f\\n", PI * SQUARE(r));
    return 0;
}</code></pre>
      `
    }
  ],
  python: [
    {
      id: 'py-intro',
      title: '1. Giới thiệu Python',
      content: `
        <h1>Python là gì?</h1>
        <p>Python là ngôn ngữ lập trình thông dịch bậc cao. Nó nổi tiếng vì cú pháp "đẹp như thơ", gần gũi với ngôn ngữ tiếng Anh và bỏ đi hoàn toàn sự rườm rà của các ngôn ngữ kiểu cũ. Nó là ngôn ngữ số 1 hiện nay cho Trí tuệ nhân tạo (AI) và Khoa học Dữ liệu.</p>
        
        <h3>Chương trình Python "ngắn không tưởng"</h3>
        <p>Không cần báo class, không cần hàm <code>main()</code> bắt buộc, không cần dấu chấm phẩy <code>;</code> ở cuối dòng.</p>
        <pre><code>print("Hello, Python!")</code></pre>
      `
    },
    {
      id: 'py-vars',
      title: '2. Biến và Kiểu dữ liệu',
      content: `
        <h1>Biến trong Python (Dynamic Typing)</h1>
        <p>Python là ngôn ngữ kiểu động, bạn <strong>không cần</strong> phải khai báo kiểu <code>int</code>, <code>float</code> hay <code>String</code>. Nó tự động nhận diện thông minh.</p>
        <pre><code>name = "CodeCamp" # Python hiểu đây là chuỗi str
age = 20          # Python hiểu đây là số nguyên int
score = 9.5       # Python hiểu đây là số thực float
is_valid = True   # Lưu ý: True/False viết Hoa chữ cái đầu

# Có thể gán nhiều biến 1 lúc
a, b, c = 1, 2, 3</code></pre>
      `
    },
    {
      id: 'py-io',
      title: '3. Nhập xuất (I/O)',
      content: `
        <h1>Nhập xuất dữ liệu</h1>
        
        <h3>Lệnh input()</h3>
        <p>Luôn nhận dữ liệu từ bàn phím dưới dạng <strong>Chuỗi (String)</strong>. Muốn tính toán phải ép kiểu (Casting).</p>
        <pre><code># Nhập số nguyên
n = int(input("Nhập số: "))

# Nhập nhiều số cách nhau bởi dấu cách trên cùng 1 dòng
a, b = map(int, input().split())</code></pre>

        <h3>Lệnh print() và F-String</h3>
        <pre><code>name = "Alice"
money = 500

# Cách in xịn nhất trong Python: F-String (thêm chữ f đằng trước chuỗi)
print(f"Xin chào {name}, bạn có {money} đô la.")</code></pre>
      `
    },
    {
      id: 'py-ifelse',
      title: '4. Cấu trúc rẽ nhánh (Thụt lề)',
      content: `
        <h1>Điều kiện If/Elif/Else</h1>
        <p>Đặc sản của Python là <strong>KHÔNG</strong> dùng dấu ngoặc nhọn <code>{}</code> để bao bọc mã, mà nó dùng khoảng trắng <strong>Thụt lề (Indentation)</strong>. Thụt lề sai = Code lỗi báo ngay.</p>
        
        <pre><code>score = 8.5

if score >= 8.0:
    print("Học sinh Giỏi")
    print("Được thưởng")
elif score >= 6.5: # elif thay vì else if
    print("Học sinh Khá")
else:
    print("Học sinh Trung Bình")</code></pre>
      `
    },
    {
      id: 'py-loops',
      title: '5. Vòng lặp',
      content: `
        <h1>Vòng lặp thần thánh của Python</h1>
        
        <h3>Vòng lặp While</h3>
        <pre><code>n = 5
while n > 0:
    print(n)
    n -= 1</code></pre>

        <h3>Vòng lặp For và hàm range()</h3>
        <p>Vòng lặp For của Python duyệt qua tập hợp chứ không dùng biến đếm i truyền thống.</p>
        <pre><code># range(5) tạo dãy [0, 1, 2, 3, 4]
for i in range(5):
    print(i)

# range(start, stop, step)
# In các số lẻ từ 1 đến 9
for i in range(1, 10, 2):
    print(i)</code></pre>
      `
    },
    {
      id: 'py-lists',
      title: '6. Danh sách (List / Mảng)',
      content: `
        <h1>Danh sách (Lists) siêu linh hoạt</h1>
        <p>List trong Python chứa được vô số thứ, và tự động co giãn. Thậm chí các phần tử không cần cùng kiểu dữ liệu.</p>
        
        <pre><code>arr = [10, 20, 30]

# Thêm phần tử cuối
arr.append(40)

# Chèn phần tử vào vị trí index 1
arr.insert(1, 15)

# Cắt list (Slicing) siêu việt
print(arr[0:2]) # Lấy từ index 0 đến 1
print(arr[::-1]) # Đảo ngược danh sách trong 1 nốt nhạc!

# Duyệt list
for item in arr:
    print(item)</code></pre>
      `
    },
    {
      id: 'py-functions',
      title: '7. Hàm (def)',
      content: `
        <h1>Hàm trong Python</h1>
        <p>Dùng từ khóa <code>def</code>. Không cần khai báo kiểu trả về.</p>
        <pre><code>def tinh_tong(a, b):
    return a + b

def chao(name):
    print(f"Xin chao {name}!")

# Gọi hàm
kq = tinh_tong(3, 5)
print(kq) # 8
chao("CodeCamp")</code></pre>
        <h3>Tham số mặc định</h3>
        <pre><code>def luy_thua(x, n=2):  # n mặc định = 2
    return x ** n

print(luy_thua(5))     # 25 (5^2)
print(luy_thua(2, 10)) # 1024 (2^10)</code></pre>
      `
    },
    {
      id: 'py-dict',
      title: '8. Dictionary (Từ điển)',
      content: `
        <h1>Dictionary - Cặp Key:Value</h1>
        <p>Giống HashMap trong Java, lưu dữ liệu theo cặp khóa-giá trị.</p>
        <pre><code>sv = {
    "ten": "Nguyen Van A",
    "tuoi": 20,
    "diem": 8.5
}

print(sv["ten"])       # Nguyen Van A
sv["lop"] = "12A1"     # Thêm key mới
del sv["tuoi"]         # Xóa key

# Duyệt dictionary
for key, value in sv.items():
    print(f"{key}: {value}")</code></pre>
      `
    },
    {
      id: 'py-string',
      title: '9. Xử lý chuỗi',
      content: `
        <h1>Chuỗi (String) trong Python</h1>
        <pre><code>s = "Hello CodeCamp"

len(s)              # 14
s.upper()           # "HELLO CODECAMP"
s.lower()           # "hello codecamp"
s.split(" ")        # ["Hello", "CodeCamp"]
s.replace("Hello", "Hi") # "Hi CodeCamp"
s.startswith("He")  # True
s.count("o")        # 2
" ".join(["A","B"]) # "A B"

# Cắt chuỗi (Slicing)
s[0:5]   # "Hello"
s[-8:]   # "CodeCamp"
s[::-1]  # Đảo ngược chuỗi</code></pre>
      `
    },
    {
      id: 'py-exception',
      title: '10. Xử lý lỗi (Try/Except)',
      content: `
        <h1>Bắt lỗi với Try/Except</h1>
        <p>Giúp chương trình không bị dừng đột ngột khi gặp lỗi.</p>
        <pre><code>try:
    n = int(input("Nhap so: "))
    kq = 100 / n
    print(f"Ket qua: {kq}")
except ValueError:
    print("Ban nhap khong phai so!")
except ZeroDivisionError:
    print("Khong the chia cho 0!")
finally:
    print("Luon chay du co loi hay khong")</code></pre>
      `
    }
  ]
};
