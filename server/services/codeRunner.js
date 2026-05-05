const https = require('https');

const TIMEOUT_MS = 20000;

// Paiza.io language mapping
const PAIZA_LANGS = {
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  python: 'python3'
};

/**
 * Bước 1: Tạo runner trên Paiza.io
 */
function createRunner(language, code, input = '') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      source_code: code,
      language: PAIZA_LANGS[language],
      input: input,
      api_key: 'guest'
    });

    const req = https.request({
      hostname: 'api.paiza.io',
      path: '/runners/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.id) {
            resolve(json.id);
          } else {
            reject(new Error('No runner ID: ' + data.substring(0, 200)));
          }
        } catch (e) {
          reject(new Error('Create parse error'));
        }
      });
    });

    req.setTimeout(TIMEOUT_MS, () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Bước 2: Lấy kết quả từ Paiza.io (có retry vì code cần thời gian chạy)
 */
function getDetails(runnerId, retries = 10) {
  return new Promise((resolve, reject) => {
    const check = (attempt) => {
      const req = https.request({
        hostname: 'api.paiza.io',
        path: `/runners/get_details?id=${runnerId}&api_key=guest`,
        method: 'GET'
      }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            
            if (json.status === 'completed') {
              resolve(json);
            } else if (attempt < retries) {
              // Chờ 1 giây rồi thử lại
              setTimeout(() => check(attempt + 1), 1000);
            } else {
              reject(new Error('Runner timeout'));
            }
          } catch (e) {
            reject(new Error('Details parse error'));
          }
        });
      });

      req.setTimeout(5000, () => { req.destroy(); reject(new Error('Timeout')); });
      req.on('error', reject);
      req.end();
    };

    check(0);
  });
}

/**
 * Chạy code qua Paiza.io API
 */
async function executeCode(language, code, input = '') {
  if (!PAIZA_LANGS[language]) {
    return { stdout: '', stderr: 'Ngôn ngữ không hỗ trợ', exitCode: 1, timedOut: false, status: 'error' };
  }

  try {
    // Bước 1: Gửi code lên
    const runnerId = await createRunner(language, code, input);

    // Bước 2: Chờ kết quả
    const details = await getDetails(runnerId);

    const stdout = (details.stdout || '').replace(/\n$/, '');
    const stderr = (details.stderr || '').trim();
    const buildStderr = (details.build_stderr || '').trim();
    const exitCode = parseInt(details.exit_code) || 0;
    const result_status = details.result || '';

    // Lỗi biên dịch
    if (result_status === 'failure' && buildStderr) {
      return {
        stdout: '',
        stderr: `Compile Error:\n${buildStderr}`,
        exitCode: 1,
        timedOut: false,
        status: 'error'
      };
    }

    // Timeout
    if (result_status === 'timeout') {
      return {
        stdout: '',
        stderr: 'Time Limit Exceeded (10s)',
        exitCode: 1,
        timedOut: true,
        status: 'tle'
      };
    }

    // Thành công (bao gồm cả trường hợp có stderr nhưng vẫn có output)
    if (result_status === 'success' || stdout) {
      return {
        stdout,
        stderr,
        exitCode: 0,
        timedOut: false,
        status: 'success'
      };
    }

    // Runtime error (không có stdout, exit code != 0)
    if (exitCode !== 0 || result_status === 'failure') {
      return {
        stdout: '',
        stderr: `Runtime Error:\n${stderr || buildStderr || 'Unknown error'}`,
        exitCode: exitCode || 1,
        timedOut: false,
        status: 'error'
      };
    }

    return {
      stdout,
      stderr,
      exitCode: 0,
      timedOut: false,
      status: 'success'
    };

  } catch (err) {
    return {
      stdout: '',
      stderr: `Lỗi: ${err.message}. Vui lòng thử lại.`,
      exitCode: 1,
      timedOut: false,
      status: 'error'
    };
  }
}

/**
 * Chạy code với nhiều test cases
 */
async function runTestCases(language, code, testCases) {
  const results = [];

  for (const testCase of testCases) {
    try {
      const result = await executeCode(language, code, testCase.input);
      const actualOutput = (result.stdout || '').trim();
      const expectedOutput = (testCase.expectedOutput || '').trim();

      results.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed: actualOutput === expectedOutput,
        error: result.stderr || null,
        status: result.status
      });

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
        error: err.message,
        status: 'error'
      });
    }
  }

  return results;
}

module.exports = { executeCode, runTestCases };
