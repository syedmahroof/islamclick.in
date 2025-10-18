<?php

namespace App\Services;

use OpenAI;
use Illuminate\Support\Facades\Log;

class FcsProcessor
{
    protected $openAiClient;

    public function __construct()
    {
        $this->openAiClient = OpenAI::client(env('OPENAI_API_KEY'));
    }

    /**
     * Generate FCS data from bank statement transactions
     */
    public function generateFcsData($transactions, $processedStatement)
    {
        try {
            // Get unique months from transactions
            $months = array_unique(array_map(function($transaction) {
                return date('Y-m', strtotime($transaction['date']));
            }, $transactions));
            
            // Sort months
            sort($months);
            
            // Generate month structure
            $monthStructure = implode(', ', array_map(function($month) {
                $monthName = strtolower(date('M', strtotime($month)));
                return "\"{$monthName}\": 0";
            }, $months));
            
            // Prepare the prompt
            $prompt = 'Convert the following bank statement data into FCS (Financial Cash Flow Summary) format.

CRITICAL CALCULATION RULES:

1. REVENUE: Sum of all POSITIVE transactions (deposits, credits) for each month
2. ADJUSTMENTS: Sum of all bank fees, service charges, and penalties (typically negative)
3. DEPOSITS_COUNT: Count of all deposit transactions for each month
4. NSF_FEES: Sum of all NSF (Non-Sufficient Funds) fees and returned item fees
5. NEGATIVE_DAYS: Count of days in each month where the account balance was negative
6. ENDING_BALANCE: The final balance at the end of each month

IMPORTANT NOTES:
- All monetary values should be positive numbers (use absolute values)
- If no data exists for a month, use 0
- Calculate "total" as the sum across all months
- Ensure dates are parsed correctly to determine the month
- Negative days should be calculated based on daily balances, not individual transactions

Bank Statement Data:
' . json_encode($transactions) . '

Return ONLY a valid JSON object in this exact format:
{
  "metrics": {
    "revenue": {
      ' . $monthStructure . ',
      "total": 0
    },
    "adjustments": {
      ' . $monthStructure . ',
      "total": 0
    },
    "deposits_count": {
      ' . $monthStructure . ',
      "total": 0
    },
    "nsf_fees": {
      ' . $monthStructure . ',
      "total": 0
    },
    "negative_days": {
      ' . $monthStructure . ',
      "total": 0
    },
    "ending_balance": {
      ' . $monthStructure . ',
      "total": 0
    }
  }
}

Analyze the transactions carefully and calculate each metric according to the rules above.';

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
            Log::error('Error generating FCS: ' . $e->getMessage());
            throw new \Exception('Failed to generate FCS: ' . $e->getMessage());
        }
    }
}
