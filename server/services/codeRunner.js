const https = require('https');

const TIMEOUT_MS = 15000;

// ===== REXTESTER API (Primary) =====
// Rextester language codes
const REXTESTER_LANGS = { java: 4, c: 6, cpp: 7, python: 24 };

function callRextester(language, code, stdin = '') {
  return new Promise((resolve, reject) => {
    const langCode = REXTESTER_LANGS[language];
    if (!langCode) return reject(new Error('Unsupported language'));

    const postData = `LanguageChoice=${langCode}&Program=${encodeURIComponent(code)}&Input=${encodeURIComponent(stdin)}`;

    const req = https.request({
      hostname: 'rextester.com',
      path: '/rundotnet/api',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const stdout = (json.Result || '').replace(/\n$/, '');
          const stderr = (json.Errors || '').trim();
          const warnings = (json.Warnings || '').trim();

          if (stderr && !stdout) {
            resolve({ stdout: '', stderr, exitCode: 1, timedOut: false, status: 'error' });
          } else {
            resolve({ stdout, stderr: stderr || warnings, exitCode: 0, timedOut: false, status: 'success' });
          }
        } catch (e) {
          reject(new Error('API parse error: ' + data.substring(0, 100)));
        }
      });
    });

    req.setTimeout(TIMEOUT_MS, () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ===== WANDBOX API (Fallback) =====
const WANDBOX_COMPILERS = {
  java: 'openjdk-jdk-17.0.1+12',
  cpp: 'gcc-12.2.0',
  c: 'gcc-12.2.0-c',
  python: 'cpython-3.10.2'
};

function callWandbox(language, code, stdin = '') {
  return new Promise((resolve, reject) => {
    const compiler = WANDBOX_COMPILERS[language];
    const payload = JSON.stringify({ compiler, code, stdin });

    const req = https.request({
      hostname: 'wandbox.org',
      path: '/api/compile.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(json.error));
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
          reject(new Error('Wandbox parse error'));
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
 * Chạy code: Rextester (primary) -> Wandbox (fallback)
 */
async function executeCode(language, code, input = '') {
  if (!REXTESTER_LANGS[language]) {
    return { stdout: '', stderr: 'Ngôn ngữ không hỗ trợ', exitCode: 1, timedOut: false, status: 'error' };
  }

  // Thử Rextester trước
  try {
    const result = await callRextester(language, code, input);
    return result;
  } catch (rexErr) {
    console.log('Rextester failed:', rexErr.message);
  }

  // Fallback sang Wandbox
  try {
    const result = await callWandbox(language, code, input);
    return result;
  } catch (wbErr) {
    console.log('Wandbox failed:', wbErr.message);
    return {
      stdout: '',
      stderr: 'Lỗi kết nối compiler. Vui lòng thử lại sau.',
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
