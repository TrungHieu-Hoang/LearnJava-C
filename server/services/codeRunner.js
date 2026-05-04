const { execFile, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const TIMEOUT_MS = 5000; // 5 seconds
const MAX_OUTPUT_SIZE = 1024 * 256; // 256KB

/**
 * Run code for a specific language with given input
 * Returns { stdout, stderr, exitCode, timedOut }
 */
async function executeCode(language, code, input = '') {
  const sessionId = uuidv4();
  const tmpDir = path.join(os.tmpdir(), 'codecamp', sessionId);
  
  try {
    fs.mkdirSync(tmpDir, { recursive: true });

    if (language === 'java') {
      return await runJava(tmpDir, code, input);
    } else if (language === 'cpp') {
      return await runCpp(tmpDir, code, input);
    } else if (language === 'c') {
      return await runC(tmpDir, code, input);
    } else if (language === 'python') {
      return await runPython(tmpDir, code, input);
    } else {
      return { stdout: '', stderr: 'Unsupported language', exitCode: 1, timedOut: false };
    }
  } finally {
    // Cleanup temp directory
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Compile and run Java code
 */
async function runJava(tmpDir, code, input) {
  // Extract class name from code
  const classNameMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classNameMatch ? classNameMatch[1] : 'Main';
  
  // If no public class found, wrap in Main class
  let finalCode = code;
  if (!classNameMatch) {
    // Check if it has a class at all
    if (!code.match(/class\s+\w+/)) {
      finalCode = `public class Main {\n${code}\n}`;
    }
  }

  const sourceFile = path.join(tmpDir, `${className}.java`);
  fs.writeFileSync(sourceFile, finalCode);

  // Compile
  try {
    await execPromise('javac', [sourceFile], tmpDir, TIMEOUT_MS);
  } catch (compileError) {
    return {
      stdout: '',
      stderr: `Compile Error:\n${compileError.stderr || compileError.message}`,
      exitCode: 1,
      timedOut: false,
      status: 'error'
    };
  }

  // Run
  try {
    const result = await execPromise('java', ['-cp', tmpDir, className], tmpDir, TIMEOUT_MS, input);
    return {
      stdout: result.stdout.trim(),
      stderr: result.stderr,
      exitCode: 0,
      timedOut: false,
      status: 'success'
    };
  } catch (runError) {
    if (runError.timedOut) {
      return {
        stdout: '',
        stderr: 'Time Limit Exceeded (5s)',
        exitCode: 1,
        timedOut: true,
        status: 'tle'
      };
    }
    return {
      stdout: runError.stdout || '',
      stderr: `Runtime Error:\n${runError.stderr || runError.message}`,
      exitCode: 1,
      timedOut: false,
      status: 'error'
    };
  }
}

/**
 * Compile and run C++ code
 */
async function runCpp(tmpDir, code, input) {
  const sourceFile = path.join(tmpDir, 'main.cpp');
  const outputFile = path.join(tmpDir, os.platform() === 'win32' ? 'main.exe' : 'main');
  
  fs.writeFileSync(sourceFile, code);

  // Compile
  try {
    await execPromise('g++', ['-o', outputFile, sourceFile, '-std=c++17'], tmpDir, TIMEOUT_MS);
  } catch (compileError) {
    return {
      stdout: '',
      stderr: `Compile Error:\n${compileError.stderr || compileError.message}`,
      exitCode: 1,
      timedOut: false,
      status: 'error'
    };
  }

  // Run
  try {
    const result = await execPromise(outputFile, [], tmpDir, TIMEOUT_MS, input);
    return {
      stdout: result.stdout.trim(),
      stderr: result.stderr,
      exitCode: 0,
      timedOut: false,
      status: 'success'
    };
  } catch (runError) {
    if (runError.timedOut) {
      return {
        stdout: '',
        stderr: 'Time Limit Exceeded (5s)',
        exitCode: 1,
        timedOut: true,
        status: 'tle'
      };
    }
    return {
      stdout: runError.stdout || '',
      stderr: `Runtime Error:\n${runError.stderr || runError.message}`,
      exitCode: 1,
      timedOut: false,
      status: 'error'
    };
  }
}

/**
 * Compile and run C code
 */
async function runC(tmpDir, code, input) {
  const sourceFile = path.join(tmpDir, 'main.c');
  const outputFile = path.join(tmpDir, os.platform() === 'win32' ? 'main.exe' : 'main');
  
  fs.writeFileSync(sourceFile, code);

  // Compile
  try {
    await execPromise('gcc', ['-o', outputFile, sourceFile], tmpDir, TIMEOUT_MS);
  } catch (compileError) {
    return {
      stdout: '',
      stderr: `Compile Error:\n${compileError.stderr || compileError.message}`,
      exitCode: 1,
      timedOut: false,
      status: 'error'
    };
  }

  // Run
  try {
    const result = await execPromise(outputFile, [], tmpDir, TIMEOUT_MS, input);
    return {
      stdout: result.stdout.trim(),
      stderr: result.stderr,
      exitCode: 0,
      timedOut: false,
      status: 'success'
    };
  } catch (runError) {
    if (runError.timedOut) {
      return { stdout: '', stderr: 'Time Limit Exceeded (5s)', exitCode: 1, timedOut: true, status: 'tle' };
    }
    return { stdout: runError.stdout || '', stderr: `Runtime Error:\n${runError.stderr || runError.message}`, exitCode: 1, timedOut: false, status: 'error' };
  }
}

/**
 * Run Python 3 code
 */
async function runPython(tmpDir, code, input) {
  const sourceFile = path.join(tmpDir, 'main.py');
  fs.writeFileSync(sourceFile, code);

  // Run
  try {
    const pythonCmd = os.platform() === 'win32' ? 'python' : 'python3';
    const result = await execPromise(pythonCmd, [sourceFile], tmpDir, TIMEOUT_MS, input);
    return {
      stdout: result.stdout.trim(),
      stderr: result.stderr,
      exitCode: 0,
      timedOut: false,
      status: 'success'
    };
  } catch (runError) {
    if (runError.timedOut) {
      return { stdout: '', stderr: 'Time Limit Exceeded (5s)', exitCode: 1, timedOut: true, status: 'tle' };
    }
    return { stdout: runError.stdout || '', stderr: `Runtime Error:\n${runError.stderr || runError.message}`, exitCode: 1, timedOut: false, status: 'error' };
  }
}

/**
 * Promise wrapper for execFile with timeout and stdin support
 */
function execPromise(command, args, cwd, timeout, stdinData = '') {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      timeout,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeout);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      if (stdout.length > MAX_OUTPUT_SIZE) {
        child.kill('SIGKILL');
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      if (timedOut) {
        reject({ stdout, stderr, timedOut: true, message: 'Time Limit Exceeded' });
      } else if (exitCode !== 0) {
        reject({ stdout, stderr, exitCode, timedOut: false, message: stderr });
      } else {
        resolve({ stdout, stderr, exitCode });
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      reject({ stdout: '', stderr: err.message, exitCode: 1, timedOut: false, message: err.message });
    });

    // Write stdin data
    if (stdinData) {
      child.stdin.write(stdinData);
    }
    child.stdin.end();
  });
}

/**
 * Run code against multiple test cases
 * Returns array of test results
 */
async function runTestCases(language, code, testCases) {
  const results = [];
  
  for (const testCase of testCases) {
    try {
      const result = await executeCode(language, code, testCase.input);
      
      const actualOutput = result.stdout.trim();
      const expectedOutput = testCase.expectedOutput.trim();
      const passed = actualOutput === expectedOutput;

      results.push({
        input: testCase.input,
        expectedOutput: expectedOutput,
        actualOutput: actualOutput,
        passed,
        error: result.stderr || null,
        status: result.status
      });

      // If compile error or TLE, skip remaining test cases
      if (result.status === 'error' || result.status === 'tle') {
        // Fill remaining tests as failed
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
