const https = require('https');
const http = require('http');

const TIMEOUT_MS = 15000;

// Wandbox compiler mapping
const WANDBOX_COMPILERS = {
  java: 'openjdk-head',
  cpp: 'gcc-head',
  c: 'gcc-head-c',
  python: 'cpython-head'
};

/**
 * Gọi Wandbox API
 */
function callWandbox(language, code, stdin = '') {
  return new Promise((resolve, reject) => {
    const compiler = WANDBOX_COMPILERS[language];
    const body = {
      compiler,
      code,
      stdin,
      options: language === 'cpp' ? 'warning,gnu++17' : ''
    };
    const payload = JSON.stringify(body);

    const options = {
      hostname: 'wandbox.org',
      path: '/api/compile.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const stdout = (json.program_output || '').replace(/\n$/, '');
          const stderr = json.compiler_error || json.program_error || '';
          const exitCode = parseInt(json.status || '0');
          const signal = json.signal || '';

          if (signal) {
            resolve({ stdout: '', stderr: 'Time Limit Exceeded', exitCode: 1, timedOut: true, status: 'tle' });
          } else if (exitCode !== 0 && !stdout) {
            resolve({ stdout: '', stderr: `Error:\n${stderr}`, exitCode, timedOut: false, status: 'error' });
          } else {
            resolve({ stdout, stderr, exitCode, timedOut: false, status: 'success' });
          }
        } catch (e) {
          reject(new Error('Wandbox returned invalid response: ' + data.substring(0, 200)));
        }
      });
    });

    req.setTimeout(TIMEOUT_MS, () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Fallback: Rextester API (backup nếu Wandbox lỗi)
 */
function callRextester(language, code, stdin = '') {
  return new Promise((resolve, reject) => {
    // Rextester language codes
    const langMap = { c: 6, cpp: 7, java: 4, python: 24 };
    const langCode = langMap[language];
    if (!langCode) return reject(new Error('Unsupported'));

    const postData = `LanguageChoice=${langCode}&Program=${encodeURIComponent(code)}&Input=${encodeURIComponent(stdin)}`;

    const options = {
      hostname: 'rextester.com',
      path: '/rundotnet/api',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const stdout = (json.Result || '').replace(/\n$/, '');
          const stderr = json.Errors || '';
          
          if (stderr && !stdout) {
            resolve({ stdout: '', stderr, exitCode: 1, timedOut: false, status: 'error' });
          } else {
            resolve({ stdout, stderr, exitCode: 0, timedOut: false, status: 'success' });
          }
        } catch (e) {
          reject(new Error('Rextester error'));
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
 * Chạy code với fallback: Wandbox -> Rextester
 */
async function executeCode(language, code, input = '') {
  if (!WANDBOX_COMPILERS[language]) {
    return { stdout: '', stderr: 'Ngôn ngữ không hỗ trợ', exitCode: 1, timedOut: false, status: 'error' };
  }

  try {
    return await callWandbox(language, code, input);
  } catch (wandboxErr) {
    console.log('Wandbox failed, trying Rextester:', wandboxErr.message);
    try {
      return await callRextester(language, code, input);
    } catch (rexErr) {
      return {
        stdout: '',
        stderr: `Lỗi kết nối compiler. Vui lòng thử lại sau.\n(${wandboxErr.message})`,
        exitCode: 1,
        timedOut: false,
        status: 'error'
      };
    }
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
      const passed = actualOutput === expectedOutput;

      results.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
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
