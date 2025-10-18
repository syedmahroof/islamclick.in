<?php

namespace App\Services;

use OpenAI;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BankStatementProcessor
{
    protected $openAiClient;
    protected $pdfParser;

    public function __construct()
    {
        $this->pdfParser = new Parser();
        $this->openAiClient = OpenAI::client(env('OPENAI_API_KEY'));
    }

    /**
     * Extract raw data from bank statement file
     */
    public function extractBankStatementData($filePath, $fileType)
    {
        try {
            if ($fileType === 'pdf') {
                // Parse PDF content
                $pdf = $this->pdfParser->parseContent(Storage::get($filePath));
                $text = $pdf->getText();
                
                // Handle UTF-8 encoding
                if (mb_detect_encoding($text, 'UTF-8', true) !== 'UTF-8') {
                    $text = mb_convert_encoding($text, 'UTF-8', 'auto');
                }
                
                // Clean up the text by removing extra whitespace and newlines
                $text = preg_replace('/\s+/', ' ', $text);
                $text = trim($text);
            } else {
                // For other file types, get the content directly
                $text = Storage::get($filePath);
                
                // Handle UTF-8 encoding
                if (mb_detect_encoding($text, 'UTF-8', true) !== 'UTF-8') {
                    $text = mb_convert_encoding($text, 'UTF-8', 'auto');
                }
            }

            // Use OpenAI to extract structured data
            $prompt = 'You are an expert financial data extraction specialist. Analyze the provided bank statement and extract information with extreme precision. Return ONLY a valid JSON object with the following structure:

{
    "account_number": "string or null",
    "account_holder": "string or null", 
    "bank_name": "string or null",
    "statement_period": "string or null",
    "opening_balance": "number or null",
    "closing_balance": "number or null",
    "transactions": [
        {
            "date": "string or null",
            "description": "string or null",
            "amount": "number or null",
            "balance": "number or null",
            "transaction_type": "string or null",
            "category": "string or null"
        }
    ],
    "total_credits": "number or null",
    "total_debits": "number or null"
}

CRITICAL EXTRACTION RULES:

1. TRANSACTION IDENTIFICATION:
   - ONLY extract actual financial transactions with specific merchant/payee names
   - IGNORE headers, labels, column titles, and summary text
   - DO NOT extract: "Money in", "Money out", "Balance", "Total", "Summary", etc.
   - Each transaction MUST have: a specific date, a descriptive payee/merchant, and an amount
   - IGNORE entries that are just column headers or formatting artifacts

2. TRANSACTION DESCRIPTIONS:
   - Extract the EXACT description as it appears on the statement
   - Do NOT paraphrase, summarize, or modify the original text
   - Include ALL text in the description field (merchant names, reference numbers, codes)
   - Preserve original spacing, punctuation, and formatting
   - If multiple description fields exist, concatenate them with a space

3. AMOUNTS & SIGNS:
   - Use positive numbers for CREDITS/DEPOSITS/INCOMING money
   - Use negative numbers for DEBITS/WITHDRAWALS/OUTGOING money
   - Extract exact numerical values without currency symbols
   - Include decimal places as shown (e.g., 1234.56)
   - IGNORE amounts that are just running balances or totals

4. DATES:
   - Extract dates in their original format first
   - If format is unclear, use YYYY-MM-DD
   - Common formats: DD/MM/YYYY, MM/DD/YYYY, DD-MMM-YYYY
   - IGNORE date ranges or period descriptions

5. TEXT PARSING CORRECTIONS:
   - If text appears merged (e.g., "timed 9.52 14 Feb11 February"), split into separate logical transactions
   - Look for patterns where dates and descriptions got concatenated
   - Validate that each transaction makes logical sense

6. TRANSACTION CATEGORIZATION:
   - Set transaction_type: "credit" for positive amounts, "debit" for negative amounts
   - For category, infer from description: "transfer", "payment", "withdrawal", "deposit", "fee", "interest", "other"

7. ACCOUNT INFORMATION:
   - Extract account numbers exactly as shown (may include spaces, dashes, asterisks)
   - Bank name should be the official institution name
   - Account holder name as it appears on the statement

8. BALANCES:
   - Opening balance: balance at statement start
   - Closing balance: balance at statement end
   - Running balance: balance after each transaction

9. TOTALS:
   - Calculate total_credits: sum of all positive amounts
   - Calculate total_debits: sum of all negative amounts (as positive number)

10. DATA QUALITY:
    - If any field is unclear, illegible, or missing, use null
    - Ensure all numbers are valid JSON numbers (no commas, currency symbols)
    - Ensure all strings are properly escaped for JSON
    - Double-check that extracted transactions are actual financial activities, not formatting artifacts

RESPONSE FORMAT: Return ONLY the JSON object. No explanations, no markdown, no additional text.

Here is the bank statement text: ' . $text;

            // Call OpenAI API
            $response = $this->openAiClient->chat()->create([
                'model' => 'gpt-4',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0,
            ]);

            // Parse the JSON response
            $jsonResponse = json_decode($response['choices'][0]['message']['content'], true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON response from OpenAI: ' . json_last_error_msg());
            }

            return $jsonResponse;

        } catch (\Exception $e) {
            Log::error('Error extracting bank statement data: ' . $e->getMessage());
            throw new \Exception('Failed to extract bank statement data: ' . $e->getMessage());
        }
    }

    /**
     * Generate FCS from processed bank statement data
     */
    public function generateFcsFromProcessedData($processedData)
    {
       
    }



}