const https = require('https');
const http = require('http');

const TIMEOUT_MS = 10000; // 10 seconds for API call

// Mapping ngôn ngữ sang compiler Wandbox
const COMPILER_MAP = {
  java: 'openjdk-jdk-17.0.1+12',
  cpp: 'gcc-12.1.0',
  c: 'gcc-12.1.0-c',
  python: 'cpython-3.10.2'
};

/**
 * Gọi Wandbox API để biên dịch và chạy code
 */
function callWandbox(compiler, code, stdin = '') {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      compiler,
      code,
      stdin,
      options: compiler.includes('gcc') && !compiler.includes('-c') ? 'warning,gnu++17' : ''
    });

    const options = {
      hostname: 'wandbox.org',
      path: '/api/compile.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: TIMEOUT_MS
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error('Invalid response from compiler API'));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('API timeout'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Run code for a specific language with given input
 */
async function executeCode(language, code, input = '') {
  const compiler = COMPILER_MAP[language];
  if (!compiler) {
    return { stdout: '', stderr: 'Unsupported language', exitCode: 1, timedOut: false, status: 'error' };
  }

  try {
    const result = await callWandbox(compiler, code, input);

    const stdout = (result.program_output || '').trim();
    const compileErr = result.compiler_error || '';
    const runtimeErr = result.program_error || '';
    const signal = result.signal || '';
    const status_code = result.status || '0';

    // Kiểm tra lỗi biên dịch
    if (compileErr && !stdout && status_code !== '0') {
      return {
        stdout: '',
        stderr: `Compile Error:\n${compileErr}`,
        exitCode: 1,
        timedOut: false,
        status: 'error'
      };
    }

    // Kiểm tra timeout/signal
    if (signal === 'Killed' || signal === '9') {
      return {
        stdout: '',
        stderr: 'Time Limit Exceeded',
        exitCode: 1,
        timedOut: true,
        status: 'tle'
      };
    }

    // Kiểm tra runtime error
    if (status_code !== '0' && !stdout) {
      return {
        stdout: '',
        stderr: `Runtime Error:\n${runtimeErr || compileErr || 'Unknown error'}`,
        exitCode: 1,
        timedOut: false,
        status: 'error'
      };
    }

    return {
      stdout,
      stderr: runtimeErr || compileErr || '',
      exitCode: parseInt(status_code) || 0,
      timedOut: false,
      status: 'success'
    };

  } catch (err) {
    return {
      stdout: '',
      stderr: `Server Error: ${err.message}`,
      exitCode: 1,
      timedOut: err.message === 'API timeout',
      status: 'error'
    };
  }
}

/**
 * Run code against multiple test cases
 */
async function runTestCases(language, code, testCases) {
  const results = [];

  for (const testCase of testCases) {
    try {
      const result = await executeCode(language, code, testCase.input);

      const actualOutput = (result.stdout || '').trim();
      const expectedOutput = (testCase.expectedOutput || '').trim();
      const passed = actualOutput === expectedOutput;

      results.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
        error: result.stderr || null,
        status: result.status
      });

      // Nếu lỗi biên dịch hoặc TLE, bỏ qua các test còn lại
      if (result.status === 'error' || result.status === 'tle') {
        for (let i = results.length; i < testCases.length; i++) {
          results.push({
            input: testCases[i].input,
            expectedOutput: testCases[i].expectedOutput,
            actualOutput: '',
            passed: false,
            error: result.stderr,
            status: result.status
          });
        }
        break;
      }
    } catch (err) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        passed: false,
        error: err.message || 'Unknown error',
        status: 'error'
      });
    }
  }

  return results;
}

module.exports = { executeCode, runTestCases };
