# Android 0.0.53 - last build failure

```text
--- node check ---

--- gradle ---
Starting a Gradle Daemon (subsequent builds will be faster)
WARNING: We recommend using a newer Android Gradle plugin to use compileSdk = 35

This Android Gradle plugin (8.5.2) was tested up to compileSdk = 34.

You are strongly encouraged to update your project to use a newer
Android Gradle plugin that has been tested with compileSdk = 35.

If you are already using the latest version of the Android Gradle plugin,
you may need to wait until a newer version with support for compileSdk = 35 is available.

For more information refer to the compatibility table:
https://d.android.com/r/tools/api-level-support

To suppress this warning, add/update
    android.suppressUnsupportedCompileSdk=35
to this project's gradle.properties.
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:generateDebugBuildConfig
> Task :app:javaPreCompileDebug
> Task :app:generateDebugResValues
> Task :app:checkDebugAarMetadata
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources
> Task :app:packageDebugResources
> Task :app:mergeDebugResources
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug
> Task :app:parseDebugLocalResources
> Task :app:processDebugMainManifest
> Task :app:processDebugManifest
> Task :app:mergeDebugShaders
> Task :app:processDebugManifestForPackage
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:compressDebugAssets
> Task :app:desugarDebugFileDependencies
> Task :app:mergeDebugStartupProfile
> Task :app:checkDebugDuplicateClasses
> Task :app:mergeDebugJniLibFolders
> Task :app:processDebugResources
> Task :app:mergeLibDexDebug
> Task :app:mergeDebugJavaResource

> Task :app:compileDebugJavaWithJavac
Note: /home/runner/work/CineTracker/CineTracker/apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.

> Task :app:dexBuilderDebug
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:mergeProjectDexDebug
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:mergeExtDexDebug
> Task :app:validateSigningDebug
> Task :app:writeDebugAppMetadata
> Task :app:writeDebugSigningConfigVersions
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
gradle/actions: Writing build results to /home/runner/work/_temp/.gradle-actions/build-results/__run_4-1787497611506.json

[Incubating] Problems report is available at: file:///home/runner/work/CineTracker/CineTracker/apps/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 10.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/9.7.0/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 28s
33 actionable tasks: 33 executed
Consider enabling configuration cache to speed up this build: https://docs.gradle.org/9.7.0/userguide/configuration_cache_enabling.html

--- signing check ---
V2 Signer: certificate DN: C=US, O=Android, CN=Android Debug
V2 Signer: certificate SHA-256 digest: 23823889fc09849e16e9c8d2d3112247efd89e234e1e0596266371fdcdb69e46
V2 Signer: certificate SHA-1 digest: f1431298927b6150e6ef1fe862833e77946b2e0a
V2 Signer: certificate MD5 digest: 3754e7b90f879b27d279a6db5734d491
0.0.53 v7 signer: 23823889fc09849e16e9c8d2d3112247efd89e234e1e0596266371fdcdb69e46
Built package: com.cinetracker.app

--- release publish ---
{"name":"CineTracker Android 0.0.53","tagName":"android-v0.0.53","url":"https://github.com/caiqrodrigues/CineTracker/releases/tag/android-v0.0.53"}
```
