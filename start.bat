@echo off
chcp 65001 >nul
echo ========================================
echo   Claw Messenger - 启动器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 请先安装Node.js！
    echo 下载地址：https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js已安装！
echo.

echo [2/3] 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败！
        pause
        exit /b 1
    )
)
echo ✅ 依赖已安装！
echo.

echo [3/3] 启动Claw Messenger...
echo.
echo ========================================
echo.

call node quick-test.js

echo.
echo ========================================
echo.
pause
