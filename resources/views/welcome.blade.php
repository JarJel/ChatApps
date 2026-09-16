<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Chat-Apps | Real-time Chat</title>

    <!-- Directive wajib Vite untuk React HMR -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="bg-gray-900 text-white min-h-screen antialiased">
    <div id="app"></div>
</body>
</html>
