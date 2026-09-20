<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    description: 'Dokumentasi API untuk Aplikasi Real-Time Chat & Voice Connect',
    title: 'Connect Chat Apps API'
)]
#[OA\Server(
    url: 'http://127.0.0.1:8000',
    description: 'Local Development Server'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    bearerFormat: 'JWT',
    scheme: 'bearer',
    description: 'Masukkan Token Sanctum kamu di sini'
)]
abstract class Controller
{
    //
}
