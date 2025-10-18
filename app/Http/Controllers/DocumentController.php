<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenAI\Laravel\Facades\OpenAI;

class DocumentController
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        // Get the file content
        $content = file_get_contents(storage_path('app/public/' . $path));

        // Process with OpenAI
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-vision-preview',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => 'Please analyze this document and provide a detailed summary of its contents.'
                        ],
                        [
                            'type' => 'image_url',
                            'image_url' => [
                                'url' => 'data:' . $file->getMimeType() . ';base64,' . base64_encode($content)
                            ]
                        ]
                    ]
                ]
            ],
            'max_tokens' => 1000
        ]);

        return response()->json([
            'message' => 'Document processed successfully',
            'summary' => $response->choices[0]->message->content,
            'file_path' => $path
        ]);
    }
}
