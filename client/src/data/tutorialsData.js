export const tutorialsData = {
  java: [
    {
      id: 'java-intro',
      title: '1. Giới thiệu Java',
      content: `
        <h1>Java là gì?</h1>
        <p>Java là một ngôn ngữ lập trình hướng đối tượng, đa nền tảng được phát triển bởi Sun Microsystems (nay thuộc Oracle). Với triết lý <strong>"Viết một lần, chạy mọi nơi"</strong> (Write Once, Run Anywhere), Java là một trong những ngôn ngữ phổ biến nhất thế giới.</p>
        
        <h3>Cấu trúc chương trình Java cơ bản</h3>
        <p>Mọi chương trình Java đều phải nằm trong một <code>class</code>. Điểm bắt đầu của chương trình là phương thức <code>main</code>.</p>
        <pre><code>public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>
        <div class="tut-note">
          <strong>Lưu ý:</strong> Tên file phải trùng với tên class chứa phương thức main (Ví dụ: <code>Main.java</code>).
        </div>
      `
    },
    {
      id: 'java-vars',
      title: '2. Biến và Kiểu dữ liệu',
      content: `
        <h1>Biến và Kiểu dữ liệu trong Java</h1>
        <p>Biến được sử dụng để lưu trữ dữ liệu. Java là ngôn ngữ định kiểu tĩnh, nghĩa là bạn phải khai báo kiểu dữ liệu cho biến trước khi sử dụng.</p>
        
        <h3>Các kiểu dữ liệu nguyên thủy (Primitive Types)</h3>
        <ul>
          <li><code>int</code>: Số nguyên (Ví dụ: 10, -5). Kích thước 4 bytes.</li>
          <li><code>double</code>: Số thực (Ví dụ: 3.14). Kích thước 8 bytes.</li>
          <li><code>char</code>: Ký tự đơn (Ví dụ: 'A'). Nằm trong dấu nháy đơn.</li>
          <li><code>boolean</code>: Đúng/Sai (<code>true</code> hoặc <code>false</code>).</li>
        </ul>
        
        <h3>Cách khai báo biến</h3>
        <pre><code>int age = 20;
double pi = 3.14159;
char grade = 'A';
boolean isPassed = true;
String name = "CodeCamp"; // String là một class, không phải kiểu nguyên thủy</code></pre>
      `
    },
    {
      id: 'java-io',
      title: '3. Nhập xuất dữ liệu',
      content: `
        <h1>Nhập xuất dữ liệu (I/O)</h1>
        
        <h3>In ra màn hình</h3>
        <p>Sử dụng <code>System.out.println()</code> để in và xuống dòng, hoặc <code>System.out.print()</code> để in không xuống dòng.</p>
        
        <h3>Nhập từ bàn phím</h3>
        <p>Để nhập dữ liệu, chúng ta sử dụng class <code>Scanner</code> trong thư viện <code>java.util</code>.</p>
        <pre><code>import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Nhập tuổi của bạn: ");
        int age = sc.nextInt();
        
        System.out.println("Bạn " + age + " tuổi.");
    }
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
        <p>C++ là ngôn ngữ lập trình bậc trung, được phát triển từ ngôn ngữ C bởi Bjarne Stroustrup. Nó hỗ trợ cả lập trình thủ tục và lập trình hướng đối tượng. C++ cực kỳ mạnh mẽ và nhanh, thường được dùng làm game, hệ điều hành và thi đấu thuật toán.</p>
        
        <h3>Chương trình C++ đầu tiên</h3>
        <pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    cout &lt;&lt; "Hello, C++!" &lt;&lt; endl;
    return 0;
}</code></pre>
        <ul>
          <li><code>#include &lt;iostream&gt;</code>: Khai báo thư viện nhập/xuất chuẩn.</li>
          <li><code>using namespace std;</code>: Sử dụng không gian tên chuẩn để không phải viết <code>std::cout</code>.</li>
          <li><code>int main()</code>: Hàm chính, nơi chương trình bắt đầu thực thi.</li>
        </ul>
      `
    },
    {
      id: 'cpp-io',
      title: '2. Nhập xuất cơ bản',
      content: `
        <h1>Nhập và Xuất trong C++</h1>
        <p>Trong C++, chúng ta sử dụng luồng (streams) để thực hiện I/O.</p>
        
        <h3>Xuất dữ liệu (cout)</h3>
        <pre><code>int a = 5;
cout &lt;&lt; "Giá trị của a là: " &lt;&lt; a &lt;&lt; endl;</code></pre>
        
        <h3>Nhập dữ liệu (cin)</h3>
        <pre><code>int age;
cout &lt;&lt; "Nhập tuổi: ";
cin &gt;&gt; age;
cout &lt;&lt; "Tuổi của bạn là " &lt;&lt; age;</code></pre>
        
        <div class="tut-note">
          <strong>Tip thi đấu thuật toán:</strong> Để tối ưu tốc độ I/O trong C++, hãy thêm 2 dòng lệnh sau vào đầu hàm main:
          <pre><code>ios_base::sync_with_stdio(false);
cin.tie(NULL);</code></pre>
        </div>
      `
    }
  ],
  c: [
    {
      id: 'c-intro',
      title: '1. Giới thiệu C',
      content: `
        <h1>C là gì?</h1>
        <p>C là ngôn ngữ lập trình thủ tục cổ điển, nền tảng cho hàng loạt ngôn ngữ hiện đại sau này (C++, Java, C#...). C có tốc độ thực thi cực nhanh và tương tác trực tiếp với bộ nhớ (phần cứng).</p>
        
        <h3>Cấu trúc cơ bản</h3>
        <pre><code>#include &lt;stdio.h&gt;

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
        <p>C sử dụng các chuỗi định dạng (Format specifiers) để nhập và xuất dữ liệu.</p>
        
        <ul>
          <li><code>%d</code>: Số nguyên (int)</li>
          <li><code>%f</code>: Số thực (float)</li>
          <li><code>%lf</code>: Số thực kép (double)</li>
          <li><code>%c</code>: Ký tự (char)</li>
        </ul>
        
        <h3>Ví dụ Nhập Xuất</h3>
        <pre><code>int age;
printf("Nhập tuổi: ");
scanf("%d", &age); // Chú ý dấu & (địa chỉ) trước tên biến
printf("Bạn %d tuổi.\\n", age);</code></pre>
      `
    }
  ],
  python: [
    {
      id: 'py-intro',
      title: '1. Giới thiệu Python',
      content: `
        <h1>Python là gì?</h1>
        <p>Python là ngôn ngữ lập trình bậc cao, thông dịch, có cú pháp cực kỳ đơn giản và gần gũi với ngôn ngữ tự nhiên. Nó được dùng nhiều trong AI, Data Science và Web Backend.</p>
        
        <h3>Chương trình Python siêu ngắn gọn</h3>
        <p>Không cần class, không cần hàm main bắt buộc, không cần dấu chấm phẩy <code>;</code> ở cuối dòng.</p>
        <pre><code>print("Hello, Python!")</code></pre>
      `
    },
    {
      id: 'py-vars',
      title: '2. Biến và Kiểu dữ liệu',
      content: `
        <h1>Biến trong Python</h1>
        <p>Python là ngôn ngữ kiểu động (Dynamic typing), bạn không cần khai báo kiểu dữ liệu. Tên biến tự động nhận kiểu dựa vào giá trị được gán.</p>
        <pre><code>name = "CodeCamp" # Kiểu chuỗi (str)
age = 20          # Kiểu số nguyên (int)
score = 9.5       # Kiểu số thực (float)
is_valid = True   # Kiểu boolean (bool)</code></pre>
      `
    },
    {
      id: 'py-io',
      title: '3. Nhập xuất',
      content: `
        <h1>Nhập xuất dữ liệu</h1>
        <p>Dùng <code>input()</code> để nhập dữ liệu (luôn trả về chuỗi str). Cần phải ép kiểu nếu muốn nhập số.</p>
        <pre><code># Nhập chuỗi
name = input("Nhập tên: ")

# Nhập số nguyên
age = int(input("Nhập tuổi: "))

print(f"Chào {name}, bạn {age} tuổi.") # Sử dụng f-string để định dạng</code></pre>
      `
    }
  ]
};
