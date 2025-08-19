<?php
/**
 * Signova Customer Registration API
 * Creates Stripe customers for trial registrations
 * Uses environment variables for security
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Stripe configuration - MUST be set as environment variable on server
$stripe_secret_key = getenv('STRIPE_SECRET_KEY');
if (!$stripe_secret_key) {
    // Fallback for development - server admin must set STRIPE_SECRET_KEY environment variable
    $stripe_secret_key = 'STRIPE_KEY_MUST_BE_SET_AS_ENVIRONMENT_VARIABLE';
}

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'customer_id' => null,
    'error' => null,
    'timestamp' => date('c')
];

try {
    // Only process POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests are allowed');
    }

    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data');
    }

    // Validate required fields
    $required_fields = ['company', 'fullname', 'email', 'phone', 'plan', 'users'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Check if Stripe key is properly configured
    if ($stripe_secret_key === 'STRIPE_KEY_MUST_BE_SET_AS_ENVIRONMENT_VARIABLE') {
        // Fallback: Create customer record without Stripe (for testing)
        $customer_id = 'cus_test_' . uniqid();
        
        // Log the registration
        $log_entry = [
            'timestamp' => date('c'),
            'customer_id' => $customer_id,
            'company' => $data['company'],
            'name' => $data['fullname'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'plan' => $data['plan'],
            'users' => $data['users'],
            'status' => 'trial_started',
            'method' => 'fallback_registration_no_stripe_key'
        ];
        
        file_put_contents('/tmp/signova_registrations.log', json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);
        
        $response['success'] = true;
        $response['customer_id'] = $customer_id;
        $response['message'] = 'Registration successful! Trial started (Stripe key not configured).';
        
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit();
    }

    // Check if Stripe library is available
    if (!class_exists('Stripe\Stripe')) {
        // Try to include Stripe library
        $stripe_paths = [
            '/var/www/html/vendor/autoload.php',
            '/usr/local/lib/php/vendor/autoload.php',
            __DIR__ . '/vendor/autoload.php',
            __DIR__ . '/stripe-php/init.php'
        ];
        
        $stripe_loaded = false;
        foreach ($stripe_paths as $path) {
            if (file_exists($path)) {
                require_once $path;
                $stripe_loaded = true;
                break;
            }
        }
        
        if (!$stripe_loaded) {
            // Fallback: Create customer record without Stripe (for testing)
            $customer_id = 'cus_test_' . uniqid();
            
            // Log the registration
            $log_entry = [
                'timestamp' => date('c'),
                'customer_id' => $customer_id,
                'company' => $data['company'],
                'name' => $data['fullname'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'plan' => $data['plan'],
                'users' => $data['users'],
                'status' => 'trial_started',
                'method' => 'fallback_registration_no_stripe_library'
            ];
            
            file_put_contents('/tmp/signova_registrations.log', json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);
            
            $response['success'] = true;
            $response['customer_id'] = $customer_id;
            $response['message'] = 'Registration successful! Trial started (Stripe library not available).';
            
            echo json_encode($response, JSON_PRETTY_PRINT);
            exit();
        }
    }

    // Set Stripe API key
    \Stripe\Stripe::setApiKey($stripe_secret_key);

    // Determine plan pricing
    $plan_prices = [
        'professional' => 15,
        'enterprise' => 35,
        'enterprise_plus' => 65
    ];

    $plan_price = $plan_prices[$data['plan']] ?? 35;

    // Create Stripe customer
    $customer_data = [
        'email' => $data['email'],
        'name' => $data['fullname'],
        'phone' => $data['phone'],
        'metadata' => [
            'company' => $data['company'],
            'plan' => $data['plan'],
            'users' => $data['users'],
            'trial_start' => date('Y-m-d'),
            'trial_end' => date('Y-m-d', strtotime('+14 days')),
            'source' => 'signova_website',
            'registration_ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ]
    ];

    $customer = \Stripe\Customer::create($customer_data);

    // Create a trial subscription (optional - for tracking purposes)
    try {
        // First, create a product if it doesn't exist
        $product_id = 'signova_' . $data['plan'];
        
        try {
            $product = \Stripe\Product::retrieve($product_id);
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Product doesn't exist, create it
            $product = \Stripe\Product::create([
                'id' => $product_id,
                'name' => 'Signova ' . ucfirst(str_replace('_', ' ', $data['plan'])),
                'description' => 'Signova Electronic Signature Platform - ' . ucfirst(str_replace('_', ' ', $data['plan'])) . ' Plan'
            ]);
        }

        // Create a price for the product
        $price_id = $product_id . '_monthly';
        
        try {
            $price = \Stripe\Price::retrieve($price_id);
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Price doesn't exist, create it
            $price = \Stripe\Price::create([
                'id' => $price_id,
                'product' => $product_id,
                'unit_amount' => $plan_price * 100, // Convert to cents
                'currency' => 'usd',
                'recurring' => [
                    'interval' => 'month'
                ]
            ]);
        }

        // Create trial subscription (will not charge during trial period)
        $subscription = \Stripe\Subscription::create([
            'customer' => $customer->id,
            'items' => [
                [
                    'price' => $price_id,
                ]
            ],
            'trial_period_days' => 14,
            'metadata' => [
                'plan' => $data['plan'],
                'users' => $data['users'],
                'company' => $data['company']
            ]
        ]);

    } catch (Exception $e) {
        // Subscription creation failed, but customer was created successfully
        error_log("Subscription creation failed for customer {$customer->id}: " . $e->getMessage());
    }

    // Log successful registration
    $log_entry = [
        'timestamp' => date('c'),
        'customer_id' => $customer->id,
        'company' => $data['company'],
        'name' => $data['fullname'],
        'email' => $data['email'],
        'phone' => $data['phone'],
        'plan' => $data['plan'],
        'users' => $data['users'],
        'plan_price' => $plan_price,
        'status' => 'trial_started',
        'stripe_customer_created' => true,
        'subscription_id' => $subscription->id ?? null
    ];
    
    file_put_contents('/tmp/signova_registrations.log', json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);

    // Send welcome email (simulate)
    $email_subject = "Welcome to Signova Enterprise - Your Trial Has Started!";
    $email_body = "
    Dear {$data['fullname']},

    Welcome to Signova Enterprise! Your 14-day free trial has started.

    Account Details:
    - Customer ID: {$customer->id}
    - Plan: " . ucfirst(str_replace('_', ' ', $data['plan'])) . "
    - Company: {$data['company']}
    - Trial Period: 14 days (until " . date('M j, Y', strtotime('+14 days')) . ")

    What's Next:
    1. Access your dashboard at: https://portal.signova.ai
    2. Upload your first document for signing
    3. Invite team members to collaborate
    4. Explore our template library

    Need Help?
    - Documentation: https://docs.signova.ai
    - Support: support@signova.ai
    - Enterprise Sales: enterprise@signova.ai

    Thank you for choosing Signova!

    Best regards,
    The Signova Team
    ";

    // Log email (in production, this would actually send)
    file_put_contents('/tmp/signova_welcome_emails.log', 
        "TO: {$data['email']}\nSUBJECT: $email_subject\nBODY: $email_body\n" . str_repeat('-', 50) . "\n", 
        FILE_APPEND | LOCK_EX
    );

    $response['success'] = true;
    $response['customer_id'] = $customer->id;
    $response['message'] = 'Registration successful! Welcome to Signova Enterprise.';
    $response['trial_end_date'] = date('Y-m-d', strtotime('+14 days'));
    $response['plan'] = $data['plan'];
    $response['plan_price'] = $plan_price;

} catch (\Stripe\Exception\InvalidRequestException $e) {
    $response['error'] = 'Stripe error: ' . $e->getMessage();
    $response['message'] = 'Registration failed due to payment processing error.';
    error_log("Stripe InvalidRequestException: " . $e->getMessage());
    
} catch (\Stripe\Exception\ApiErrorException $e) {
    $response['error'] = 'Stripe API error: ' . $e->getMessage();
    $response['message'] = 'Registration failed due to API error.';
    error_log("Stripe ApiErrorException: " . $e->getMessage());
    
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
    $response['message'] = 'Registration failed: ' . $e->getMessage();
    error_log("General Exception: " . $e->getMessage());
}

// Output JSON response
echo json_encode($response, JSON_PRETTY_PRINT);

// Log API access
$access_log = date('Y-m-d H:i:s') . " - Registration API accessed from " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . 
              " - Success: " . ($response['success'] ? 'YES' : 'NO') . 
              " - Email: " . ($data['email'] ?? 'unknown') . "\n";
file_put_contents('/tmp/signova_api_access.log', $access_log, FILE_APPEND | LOCK_EX);

?>

