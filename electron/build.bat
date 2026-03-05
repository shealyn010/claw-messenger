@echo off
echo ========================================
echo   Claw Messenger - 打包成EXE
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

echo [2/3] 安装依赖...
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

echo [3/3] 打包成EXE...
echo 这可能需要几分钟...
call npm run build-win

if errorlevel 1 (
    echo.
    echo ❌ 打包失败！
) else (
    echo.
    echo ✅ 打包成功！
    echo.
    echo EXE文件在 dist\ 文件夹里！
)

echo.
echo ========================================
echo.
pause
