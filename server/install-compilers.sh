#!/usr/bin/env bash
# Script cài đặt compilers trên Render (Ubuntu)
set -e

echo "=== Cài đặt compilers cho CodeCamp ==="

# Cài JDK (Java), GCC/G++ (C/C++), Python3
apt-get update -qq
apt-get install -y -qq default-jdk gcc g++ python3 2>/dev/null || true

echo "=== Kiểm tra phiên bản ==="
javac -version 2>&1 || echo "javac KHÔNG tìm thấy"
java -version 2>&1 || echo "java KHÔNG tìm thấy"
gcc --version | head -1 || echo "gcc KHÔNG tìm thấy"
g++ --version | head -1 || echo "g++ KHÔNG tìm thấy"
python3 --version || echo "python3 KHÔNG tìm thấy"

# Cài npm dependencies
npm install

echo "=== Hoàn tất cài đặt ==="
