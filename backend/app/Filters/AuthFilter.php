<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthFilter implements FilterInterface
{
    /**
     * Do whatever processing this filter needs to do.
     * By default it should not return anything during
     * normal execution. However, when an abnormal state
     * is found, it should return an instance of
     * CodeIgniter\HTTP\Response. If it does, script
     * execution will end and that Response will be
     * sent back to the client, allowing for error pages,
     * redirects, etc.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments
     *
     * @return RequestInterface|ResponseInterface|string|void
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        if ($request->getMethod() === 'OPTIONS') {
            return;
        }

        $key = getenv('JWT_SECRET') ?: env('JWT_SECRET') ?: 'default_fallback_secret_change_me';
        $header = $request->header('Authorization');

        if (!$header) {
            return service('response')->setJSON(['message' => 'Token Required'])->setStatusCode(401);
        }

        // Get value from header object
        $headerValue = $header->getValue();
        $token = explode(' ', $headerValue)[1] ?? '';

        if (empty($token)) {
            return service('response')->setJSON(['message' => 'Invalid Token Format'])->setStatusCode(401);
        }

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            // Store user info in request for controllers to access
            $request->userData = [
                'uid' => $decoded->uid,
                'username' => $decoded->username,
                'role' => $decoded->role
            ];
        } catch (Exception $e) {
            log_message('error', '[AuthFilter] JWT Decode Error: ' . $e->getMessage() . ' | Token: ' . substr($token, 0, 10) . '...');
            return service('response')->setJSON([
                'message' => 'Invalid Token',
                'error' => $e->getMessage()
            ])->setStatusCode(401);
        }
    }

    /**
     * Allows After filters to inspect and modify the response
     * object as needed. This method does not allow any way
     * to stop execution of other after filters, short of
     * throwing an Exception or Error.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return ResponseInterface|void
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
