@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
echo Using JAVA_HOME: %JAVA_HOME%
cmd /c "gradlew.bat assembleDebug"
