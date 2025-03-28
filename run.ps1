# 원하는 포트
$port = 5030

# 포트 점유 중인 프로세스 종료
$pid = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
if ($pid) {
    Write-Host "🛑 Killing process on port $port (PID: $pid)"
    Stop-Process -Id $pid -Force
} else {
    Write-Host "✅ No process using port $port"
}

# 최신 코드 가져오기
Write-Host "`n📥 Pulling latest code from Git..."
git pull origin main

# Gradle로 실행
Write-Host "`n🚀 Starting Spring Boot with Gradle..."
./gradlew bootRun

